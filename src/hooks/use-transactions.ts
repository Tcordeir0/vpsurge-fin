import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

export interface Transaction {
  id: number
  user: string
  valor: number
  created_at: string
  estabelecimento: string | null
  detalhes: string | null
  tipo: string | null
  categoria: string | null
  quando: string | null
}

export function useTransactions() {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getCurrentUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      
      const { data, error } = await supabase
        .from('transacoes')
        .select('*')
        .eq('user', user.id)
        .order('quando', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!user?.id,
  })

  // Real-time subscription for transactions
  useEffect(() => {
    if (!user?.id) return

    const channel = supabase
      .channel('transactions-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transacoes',
          filter: `user=eq.${user.id}`
        },
        () => {
          // Invalidate and refetch when any change occurs
          queryClient.invalidateQueries({ queryKey: ['transactions', user.id] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id, queryClient])

  const addTransaction = useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id' | 'created_at' | 'user'>) => {
      if (!user?.id) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('transacoes')
        .insert([{ ...transaction, user: user.id }])
        .select()

      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Transação adicionada com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao adicionar transação: ' + error.message)
    },
  })

  const updateTransaction = useMutation({
    mutationFn: async ({ id, ...transaction }: Partial<Transaction> & { id: number }) => {
      const { data, error } = await supabase
        .from('transacoes')
        .update(transaction)
        .eq('id', id)
        .select()

      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Transação atualizada com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao atualizar transação: ' + error.message)
    },
  })

  const deleteTransaction = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('transacoes')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Transação removida com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao remover transação: ' + error.message)
    },
  })

  // Calculate metrics
  const totalBalance = transactions.reduce((acc, t) => acc + (t.valor || 0), 0)
  const totalIncome = transactions
    .filter(t => t.tipo === 'receita')
    .reduce((acc, t) => acc + (t.valor || 0), 0)
  const totalExpenses = transactions
    .filter(t => t.tipo === 'despesa')
    .reduce((acc, t) => acc + Math.abs(t.valor || 0), 0)

  // Calculate monthly change (current month vs previous month)
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear

  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.quando || t.created_at)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })

  const previousMonthTransactions = transactions.filter(t => {
    const date = new Date(t.quando || t.created_at)
    return date.getMonth() === previousMonth && date.getFullYear() === previousYear
  })

  const currentMonthTotal = currentMonthTransactions.reduce((acc, t) => acc + (t.valor || 0), 0)
  const previousMonthTotal = previousMonthTransactions.reduce((acc, t) => acc + (t.valor || 0), 0)
  const monthlyChange = currentMonthTotal - previousMonthTotal

  return {
    transactions,
    loading: isLoading, // For backward compatibility
    isLoading,
    error,
    user,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    metrics: {
      totalBalance,
      totalIncome,
      totalExpenses: -totalExpenses,
      monthlyChange,
    },
  }
}