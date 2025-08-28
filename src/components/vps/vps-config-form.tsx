import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save, TestTube } from "lucide-react"
import { toast } from "sonner"

export interface VPSConfig {
  id: string
  name: string
  host: string
  port: number
  username: string
  password?: string
  privateKey?: string
  usePrivateKey: boolean
}

interface VPSConfigFormProps {
  config?: VPSConfig
  onSave: (config: VPSConfig) => void
  onTest: (config: VPSConfig) => void
}

export function VPSConfigForm({ config, onSave, onTest }: VPSConfigFormProps) {
  const [formData, setFormData] = useState<VPSConfig>(
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
    
    if (!formData.name || !formData.host || !formData.username) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    if (!formData.usePrivateKey && !formData.password) {
      toast.error("Informe a senha ou configure uma chave privada")
      return
    }

    if (formData.usePrivateKey && !formData.privateKey) {
      toast.error("Informe a chave privada")
      return
    }

    onSave(formData)
  }

  const handleTest = () => {
    if (!formData.host || !formData.username) {
      toast.error("Preencha pelo menos o host e usuário para testar")
      return
    }
    onTest(formData)
  }

  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle>Configuração de VPS</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da VPS *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Servidor Principal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="host">Host/IP *</Label>
              <Input
                id="host"
                value={formData.host}
                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                placeholder="Ex: 192.168.1.100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="port">Porta SSH</Label>
              <Input
                id="port"
                type="number"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) || 22 })}
                placeholder="22"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Usuário *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Ex: root"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="usePrivateKey"
              checked={formData.usePrivateKey}
              onCheckedChange={(checked) => setFormData({ ...formData, usePrivateKey: checked })}
            />
            <Label htmlFor="usePrivateKey">Usar chave privada em vez de senha</Label>
          </div>

          {formData.usePrivateKey ? (
            <div className="space-y-2">
              <Label htmlFor="privateKey">Chave Privada *</Label>
              <Textarea
                id="privateKey"
                value={formData.privateKey}
                onChange={(e) => setFormData({ ...formData, privateKey: e.target.value })}
                placeholder="-----BEGIN PRIVATE KEY-----"
                rows={6}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Senha do usuário"
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="btn-gradient-primary gap-2">
              <Save className="h-4 w-4" />
              Salvar Configuração
            </Button>
            <Button type="button" variant="outline" onClick={handleTest} className="gap-2">
              <TestTube className="h-4 w-4" />
              Testar Conexão
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}