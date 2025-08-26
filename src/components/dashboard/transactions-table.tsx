import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Edit, Trash2, Plus, Search, Filter } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Sample transaction data - replace with real data from props
const sampleTransactions = [
  {
    id: 1,
    quando: new Date("2024-01-15"),
    valor: -150.50,
    detalhes: "Compras no supermercado",
    estabelecimento: "Pão de Açúcar",
    tipo: "despesa",
    categoria: "Alimentação",
  },
  {
    id: 2,
    quando: new Date("2024-01-14"),
    valor: 3500.00,
    detalhes: "Salário mensal",
    estabelecimento: "Empresa XYZ",
    tipo: "receita",
    categoria: "Salário",
  },
  {
    id: 3,
    quando: new Date("2024-01-13"),
    valor: -80.00,
    detalhes: "Abastecimento",
    estabelecimento: "Posto Shell",
    tipo: "despesa",
    categoria: "Transporte",
  },
  {
    id: 4,
    quando: new Date("2024-01-12"),
    valor: -45.90,
    detalhes: "Cinema",
    estabelecimento: "Cinemark",
    tipo: "despesa",
    categoria: "Lazer",
  },
  {
    id: 5,
    quando: new Date("2024-01-11"),
    valor: -1200.00,
    detalhes: "Aluguel",
    estabelecimento: "Imobiliária ABC",
    tipo: "despesa",
    categoria: "Moradia",
  },
]

interface TransactionsTableProps {
  onEdit?: (transaction: any) => void
  onDelete?: (id: number) => void
  onAdd?: () => void
}

export function TransactionsTable({ 
  onEdit, 
  onDelete, 
  onAdd 
}: TransactionsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getTypeVariant = (tipo: string) => {
    return tipo === "receita" ? "default" : "destructive"
  }

  const filteredTransactions = sampleTransactions.filter((transaction) => {
    const matchesSearch = 
      transaction.detalhes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.estabelecimento.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || transaction.tipo === filterType
    const matchesCategory = filterCategory === "all" || transaction.categoria === filterCategory
    
    return matchesSearch && matchesType && matchesCategory
  })

  const categories = [...new Set(sampleTransactions.map(t => t.categoria))]

  return (
    <Card className="card-gradient">
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle>Transações Recentes</CardTitle>
          <Button onClick={onAdd} className="btn-gradient-primary gap-2">
            <Plus className="h-4 w-4" />
            Nova Transação
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="receita">Receitas</SelectItem>
              <SelectItem value="despesa">Despesas</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Detalhes</TableHead>
                <TableHead>Estabelecimento</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {format(transaction.quando, "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>{transaction.detalhes}</TableCell>
                  <TableCell>{transaction.estabelecimento}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.categoria}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeVariant(transaction.tipo)}>
                      {transaction.tipo === "receita" ? "Receita" : "Despesa"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        "font-semibold",
                        transaction.valor >= 0 ? "number-positive" : "number-negative"
                      )}
                    >
                      {formatCurrency(transaction.valor)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit?.(transaction)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete?.(transaction.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredTransactions.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}