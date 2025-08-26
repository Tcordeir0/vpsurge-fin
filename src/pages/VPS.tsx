import { VPSCards } from "@/components/vps/vps-cards"
import { toast } from "sonner"

export default function VPS() {
  const handleRestart = (vpsId: number) => {
    toast.success(`VPS ${vpsId} reiniciado com sucesso!`)
    // Simulate restart action
  }

  const handleStop = (vpsId: number) => {
    toast.info(`Alterando status do VPS ${vpsId}...`)
    // Simulate stop/start action
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
            Painel VPS
          </h1>
          <p className="text-muted-foreground">
            Monitore e gerencie seus servidores virtuais
          </p>
        </div>

        {/* VPS Cards */}
        <VPSCards
          onRestart={handleRestart}
          onStop={handleStop}
        />
      </main>
    </div>
  )
}