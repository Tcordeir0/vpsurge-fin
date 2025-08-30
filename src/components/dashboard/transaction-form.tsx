import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface TransactionFormData {
  valor: number
  quando: Date
  detalhes: string
  estabelecimento: string
  tipo: 'receita' | 'despesa'
  categoria: string
}

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void
  onCancel: () => void
  initialData?: Partial<TransactionFormData>
}

export function TransactionForm({ onSubmit, onCancel, initialData }: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    valor: initialData?.valor || 0,
    quando: initialData?.quando || new Date(),
    detalhes: initialData?.detalhes || '',
    estabelecimento: initialData?.estabelecimento || '',
    tipo: initialData?.tipo || 'despesa',
    categoria: initialData?.categoria || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="valor">Valor *</Label>
          <Input
            id="valor"
            type="number"
            step="0.01"
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
            placeholder="0,00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Data *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.quando && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.quando ? format(formData.quando, "dd/MM/yyyy") : "Selecione uma data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.quando}
                onSelect={(date) => date && setFormData({ ...formData, quando: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo *</Label>
          <Select value={formData.tipo} onValueChange={(value: 'receita' | 'despesa') => setFormData({ ...formData, tipo: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="receita">Receita</SelectItem>
              <SelectItem value="despesa">Despesa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria</Label>
          <Input
            id="categoria"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            placeholder="Ex: Alimentação, Transporte..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="estabelecimento">Estabelecimento</Label>
        <Input
          id="estabelecimento"
          value={formData.estabelecimento}
          onChange={(e) => setFormData({ ...formData, estabelecimento: e.target.value })}
          placeholder="Ex: Supermercado, Restaurante..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="detalhes">Detalhes</Label>
        <Textarea
          id="detalhes"
          value={formData.detalhes}
          onChange={(e) => setFormData({ ...formData, detalhes: e.target.value })}
          placeholder="Descrição adicional da transação..."
          rows={3}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="btn-gradient-primary">
          Salvar
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}