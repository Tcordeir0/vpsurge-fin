import { useState } from "react"
import { VPSCards } from "@/components/vps/vps-cards"
import { VPSConfigForm } from "@/components/vps/vps-config-form"
import { useVPS } from "@/hooks/use-vps"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, RefreshCw } from "lucide-react"

export default function VPS() {
  const { configs, statuses, isLoading, addConfig, testConnection, restartVPS, stopVPS, refreshStatuses } = useVPS()
  const [isConfigFormOpen, setIsConfigFormOpen] = useState(false)

  const handleSaveConfig = (config: any) => {
    addConfig(config)
    setIsConfigFormOpen(false)
  }

  const handleTestConnection = (config: any) => {
    testConnection(config)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
              Painel VPS
            </h1>
            <p className="text-muted-foreground">
              Monitore e gerencie seus servidores virtuais
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={refreshStatuses}
              variant="outline"
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar Status
            </Button>
            <Button
              onClick={() => setIsConfigFormOpen(true)}
              className="btn-gradient-primary gap-2"
            >
              <Plus className="h-4 w-4" />
              Nova VPS
            </Button>
          </div>
        </div>

        {/* VPS Configuration Form (if no VPS configured) */}
        {configs.length === 0 && !isConfigFormOpen && (
          <VPSConfigForm
            onSave={handleSaveConfig}
            onTest={handleTestConnection}
          />
        )}

        {/* VPS Cards */}
        {statuses.length > 0 && (
          <VPSCards
            statuses={statuses}
            onRestart={restartVPS}
            onStop={stopVPS}
          />
        )}

        {/* VPS Configuration Dialog */}
        <Dialog open={isConfigFormOpen} onOpenChange={setIsConfigFormOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Configurar Nova VPS</DialogTitle>
            </DialogHeader>
            <VPSConfigForm
              onSave={handleSaveConfig}
              onTest={handleTestConnection}
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}