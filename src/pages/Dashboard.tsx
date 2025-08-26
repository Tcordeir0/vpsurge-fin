import { useState } from "react"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { ChartsSection } from "@/components/dashboard/charts-section"
import { TransactionsTable } from "@/components/dashboard/transactions-table"
import { toast } from "sonner"

export default function Dashboard() {
  // Sample data - replace with real data from Supabase
  const [totalBalance] = useState(8450.75)
  const [totalIncome] = useState(12500.00)
  const [totalExpenses] = useState(-4049.25)
  const [monthlyChange] = useState(892.50)

  const handleEditTransaction = (transaction: any) => {
    toast.info(`Editando transação: ${transaction.detalhes}`)
    // Implement edit modal logic here
  }

  const handleDeleteTransaction = (id: number) => {
    toast.success(`Transação ${id} removida com sucesso`)
    // Implement delete logic here
  }

  const handleAddTransaction = () => {
    toast.info("Abrindo formulário de nova transação")
    // Implement add modal logic here
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
          totalBalance={totalBalance}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          monthlyChange={monthlyChange}
        />

        {/* Charts Section */}
        <ChartsSection />

        {/* Transactions Table */}
        <TransactionsTable
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          onAdd={handleAddTransaction}
        />
      </main>
    </div>
  )
}