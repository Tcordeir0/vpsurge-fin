import { TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface OverviewCardsProps {
  totalBalance: number
  totalIncome: number
  totalExpenses: number
  monthlyChange: number
}

export function OverviewCards({
  totalBalance,
  totalIncome,
  totalExpenses,
  monthlyChange,
}: OverviewCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const cards = [
    {
      title: "Saldo Total",
      value: totalBalance,
      icon: DollarSign,
      description: "Saldo atual na conta",
      className: "card-gradient border-primary/20",
      valueClassName: totalBalance >= 0 ? "number-positive" : "number-negative",
    },
    {
      title: "Receitas",
      value: totalIncome,
      icon: TrendingUp,
      description: "Total de entradas",
      className: "card-gradient border-success/20",
      valueClassName: "number-positive",
    },
    {
      title: "Despesas",
      value: totalExpenses,
      icon: TrendingDown,
      description: "Total de saídas",
      className: "card-gradient border-destructive/20",
      valueClassName: "number-negative",
    },
    {
      title: "Variação Mensal",
      value: monthlyChange,
      icon: CreditCard,
      description: "Mudança vs mês anterior",
      className: "card-gradient border-warning/20",
      valueClassName: monthlyChange >= 0 ? "number-positive" : "number-negative",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card
            key={card.title}
            className={cn(
              "transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
              card.className
            )}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold", card.valueClassName)}>
                {formatCurrency(card.value)}
              </div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}