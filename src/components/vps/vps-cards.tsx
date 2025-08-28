import { Server, Activity, HardDrive, Cpu, MemoryStick, MapPin, Calendar, Power, RotateCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface VPSCardsProps {
  statuses: any[]
  onRestart?: (vpsId: string) => void
  onStop?: (vpsId: string) => void
}

export function VPSCards({ statuses, onRestart, onStop }: VPSCardsProps) {
  const getStatusColor = (status: string) => {
    return status === "online" ? "default" : "destructive"
  }

  const getUsageColor = (usage: number) => {
    if (usage < 50) return "hsl(var(--success))"
    if (usage < 80) return "hsl(var(--warning))"
    return "hsl(var(--destructive))"
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR })
  }

  if (!statuses || statuses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma VPS configurada. Configure uma nova VPS para começar.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {statuses.map((vps, index) => (
        <Card 
          key={vps.id} 
          className={cn(
            "card-gradient transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
            vps.status === "online" ? "border-success/20" : "border-destructive/20"
          )}
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Server className="h-5 w-5" />
                {vps.name}
              </CardTitle>
              <Badge variant={getStatusColor(vps.status)} className={cn(
                vps.status === "online" && "bg-success/10 text-success border-success/20"
              )}>
                <div className={cn(
                  "mr-2 h-2 w-2 rounded-full",
                  vps.status === "online" ? "bg-success animate-pulse" : "bg-destructive"
                )} />
                {vps.status === "online" ? "Online" : vps.status === "offline" ? "Offline" : "Desconhecido"}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                {vps.host}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {vps.location}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Usage Metrics */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    CPU
                  </span>
                  <span className="font-medium">{vps.cpuUsage}%</span>
                </div>
                <Progress 
                  value={vps.cpuUsage} 
                  className="h-2"
                  style={{
                    "--progress-background": getUsageColor(vps.cpuUsage)
                  } as React.CSSProperties}
                />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <MemoryStick className="h-4 w-4" />
                    RAM
                  </span>
                  <span className="font-medium">{vps.ramUsage}%</span>
                </div>
                <Progress 
                  value={vps.ramUsage} 
                  className="h-2"
                  style={{
                    "--progress-background": getUsageColor(vps.ramUsage)
                  } as React.CSSProperties}
                />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4" />
                    Disco
                  </span>
                  <span className="font-medium">{vps.diskUsage}%</span>
                </div>
                <Progress 
                  value={vps.diskUsage} 
                  className="h-2"
                  style={{
                    "--progress-background": getUsageColor(vps.diskUsage)
                  } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-2 border-t pt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Expira em:
                </span>
                <span className="font-medium">{formatDate(vps.expirationDate)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Última verificação:</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(vps.lastChecked), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRestart?.(vps.id)}
                disabled={vps.status === "offline"}
                className="flex-1 gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reiniciar
              </Button>
              <Button
                variant={vps.status === "online" ? "destructive" : "default"}
                size="sm"
                onClick={() => onStop?.(vps.id)}
                className="flex-1 gap-2"
              >
                <Power className="h-4 w-4" />
                {vps.status === "online" ? "Parar" : "Iniciar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}