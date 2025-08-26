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

// Sample data for charts - replace with real data from props
const lineData = [
  { month: "Jan", saldo: 4000 },
  { month: "Fev", saldo: 3000 },
  { month: "Mar", saldo: 5000 },
  { month: "Abr", saldo: 4500 },
  { month: "Mai", saldo: 6000 },
  { month: "Jun", saldo: 5500 },
]

const pieData = [
  { name: "Alimentação", value: 2400, color: "hsl(259, 94%, 51%)" },
  { name: "Transporte", value: 1398, color: "hsl(142, 76%, 36%)" },
  { name: "Lazer", value: 800, color: "hsl(32, 95%, 44%)" },
  { name: "Moradia", value: 3800, color: "hsl(0, 84%, 60%)" },
  { name: "Outros", value: 1200, color: "hsl(229, 94%, 61%)" },
]

const barData = [
  { estabelecimento: "Supermercado", valor: 1200 },
  { estabelecimento: "Posto", valor: 800 },
  { estabelecimento: "Restaurante", valor: 600 },
  { estabelecimento: "Farmácia", valor: 400 },
  { estabelecimento: "Loja", valor: 300 },
]

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

export function ChartsSection() {
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