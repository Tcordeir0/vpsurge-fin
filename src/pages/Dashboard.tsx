import { useState } from "react"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { ChartsSection } from "@/components/dashboard/charts-section"
import { TransactionsTable } from "@/components/dashboard/transactions-table"
import { TransactionForm } from "@/components/dashboard/transaction-form"
import { useTransactions } from "@/hooks/use-transactions"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

export default function Dashboard() {
  const { transactions, metrics, addTransaction, updateTransaction, deleteTransaction, user } = useTransactions()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
          <p className="text-muted-foreground">Você precisa estar logado para acessar o dashboard financeiro.</p>
        </div>
      </div>
    )
  }

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }

  const handleDeleteTransaction = (id: number) => {
    deleteTransaction.mutate(id)
  }

  const handleAddTransaction = () => {
    setEditingTransaction(null)
    setIsFormOpen(true)
  }

  const handleFormSubmit = (data: any) => {
    if (editingTransaction) {
      updateTransaction.mutate({ id: editingTransaction.id, ...data })
    } else {
      addTransaction.mutate(data)
    }
    setIsFormOpen(false)
    setEditingTransaction(null)
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setEditingTransaction(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
            Dashboard Financeiro
          </h1>
          <p className="text-muted-foreground">
            Visualize e gerencie suas finanças pessoais
          </p>
        </div>

        {/* Overview Cards */}
        <OverviewCards
          totalBalance={metrics.totalBalance}
          totalIncome={metrics.totalIncome}
          totalExpenses={metrics.totalExpenses}
          monthlyChange={metrics.monthlyChange}
        />

        {/* Charts Section */}
        <ChartsSection transactions={transactions} />

        {/* Transactions Table */}
        <TransactionsTable
          transactions={transactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          onAdd={handleAddTransaction}
        />

        {/* Transaction Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
              </DialogTitle>
            </DialogHeader>
            <TransactionForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              initialData={editingTransaction ? {
                valor: Math.abs(editingTransaction.valor),
                quando: new Date(editingTransaction.quando || editingTransaction.created_at),
                detalhes: editingTransaction.detalhes || '',
                estabelecimento: editingTransaction.estabelecimento || '',
                tipo: editingTransaction.tipo || 'despesa',
                categoria: editingTransaction.categoria || '',
              } : undefined}
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}