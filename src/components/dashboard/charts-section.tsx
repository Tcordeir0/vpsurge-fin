import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartsSectionProps {
  transactions: any[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg p-3 shadow-lg">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(entry.value)}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function ChartsSection({ transactions }: ChartsSectionProps) {
  // Process transactions for charts
  const processLineData = () => {
    const monthlyData: { [key: string]: number } = {}
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.quando || transaction.created_at)
      const monthKey = months[date.getMonth()]
      if (!monthlyData[monthKey]) monthlyData[monthKey] = 0
      monthlyData[monthKey] += transaction.valor || 0
    })
    
    return months.map(month => ({
      month,
      saldo: monthlyData[month] || 0
    })).filter(item => item.saldo !== 0)
  }

  const processPieData = () => {
    const categoryData: { [key: string]: number } = {}
    const colors = [
      "hsl(259, 94%, 51%)",
      "hsl(142, 76%, 36%)",
      "hsl(32, 95%, 44%)",
      "hsl(0, 84%, 60%)",
      "hsl(229, 94%, 61%)",
      "hsl(280, 70%, 50%)",
      "hsl(60, 90%, 50%)",
    ]
    
    transactions
      .filter(t => t.tipo === 'despesa' && t.categoria)
      .forEach(transaction => {
        const category = transaction.categoria
        if (!categoryData[category]) categoryData[category] = 0
        categoryData[category] += Math.abs(transaction.valor || 0)
      })
    
    return Object.entries(categoryData).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }))
  }

  const processBarData = () => {
    const establishmentData: { [key: string]: number } = {}
    
    transactions
      .filter(t => t.estabelecimento)
      .forEach(transaction => {
        const establishment = transaction.estabelecimento
        if (!establishmentData[establishment]) establishmentData[establishment] = 0
        establishmentData[establishment] += Math.abs(transaction.valor || 0)
      })
    
    return Object.entries(establishmentData)
      .map(([estabelecimento, valor]) => ({ estabelecimento, valor }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5)
  }

  const lineData = processLineData()
  const pieData = processPieData()
  const barData = processBarData()
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Balance Evolution Chart */}
      <Card className="card-gradient col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Evolução do Saldo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => 
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    notation: "compact"
                  }).format(value)
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="saldo"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle>Gastos por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                className="text-xs"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Establishments */}
      <Card className="card-gradient col-span-full lg:col-span-3">
        <CardHeader>
          <CardTitle>Top Estabelecimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="estabelecimento"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => 
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    notation: "compact"
                  }).format(value)
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="valor"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                className="transition-all duration-300 hover:opacity-80"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}