import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save, TestTube } from "lucide-react"
import { toast } from "sonner"

// Este é um exemplo de interface, ajuste conforme sua necessidade
export interface TransactionFormData {
  id: string
  name: string
  host: string
  port: number
  username: string
  password?: string
  privateKey?: string
  usePrivateKey: boolean
}

interface TransactionFormProps {
  config?: TransactionFormData
  onSave: (config: TransactionFormData) => void
  onTest: (config: TransactionFormData) => void
}

// A função agora se chama TransactionForm e está sendo exportada corretamente
export function TransactionForm({ config, onSave, onTest }: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>(
    config || {
      id: crypto.randomUUID(),
      name: "",
      host: "",
      port: 22,
      username: "",
      password: "",
      privateKey: "",
      usePrivateKey: false,
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Suas validações...
    if (!formData.name || !formData.host || !formData.username) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    onSave(formData)
  }

  const handleTest = () => {
    onTest(formData)
  }

  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle>Configuração de Transação</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* O resto do seu JSX do formulário vai aqui... */}
          
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Transação *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Compra Online"
            />
          </div>

          {/* Adicione os outros campos do formulário aqui */}

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="btn-gradient-primary gap-2">
              <Save className="h-4 w-4" />
              Salvar
            </Button>
            <Button type="button" variant="outline" onClick={handleTest} className="gap-2">
              <TestTube className="h-4 w-4" />
              Testar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
