import { useState, useEffect } from 'react'
import { toast } from 'sonner'

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

export interface VPSStatus {
  id: string
  name: string
  status: 'online' | 'offline' | 'unknown'
  host: string
  location: string
  cpuUsage: number
  ramUsage: number
  diskUsage: number
  expirationDate: string
  lastChecked: string
}

const VPS_CONFIGS_KEY = 'vps-configs'
const VPS_STATUS_KEY = 'vps-status'

export function useVPS() {
  const [configs, setConfigs] = useState<VPSConfig[]>([])
  const [statuses, setStatuses] = useState<VPSStatus[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedConfigs = localStorage.getItem(VPS_CONFIGS_KEY)
    const savedStatuses = localStorage.getItem(VPS_STATUS_KEY)
    
    if (savedConfigs) {
      setConfigs(JSON.parse(savedConfigs))
    }
    
    if (savedStatuses) {
      setStatuses(JSON.parse(savedStatuses))
    }
  }, [])

  // Save configs to localStorage
  const saveConfigs = (newConfigs: VPSConfig[]) => {
    setConfigs(newConfigs)
    localStorage.setItem(VPS_CONFIGS_KEY, JSON.stringify(newConfigs))
  }

  // Save statuses to localStorage
  const saveStatuses = (newStatuses: VPSStatus[]) => {
    setStatuses(newStatuses)
    localStorage.setItem(VPS_STATUS_KEY, JSON.stringify(newStatuses))
  }

  const addConfig = (config: VPSConfig) => {
    const newConfigs = [...configs, config]
    saveConfigs(newConfigs)
    
    // Create initial status for the new VPS
    const newStatus: VPSStatus = {
      id: config.id,
      name: config.name,
      status: 'unknown',
      host: config.host,
      location: 'Não informado',
      cpuUsage: 0,
      ramUsage: 0,
      diskUsage: 0,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      lastChecked: new Date().toISOString(),
    }
    
    const newStatuses = [...statuses, newStatus]
    saveStatuses(newStatuses)
    
    toast.success('Configuração de VPS salva com sucesso!')
  }

  const updateConfig = (id: string, updatedConfig: VPSConfig) => {
    const newConfigs = configs.map(config => 
      config.id === id ? updatedConfig : config
    )
    saveConfigs(newConfigs)
    
    // Update corresponding status
    const newStatuses = statuses.map(status =>
      status.id === id 
        ? { ...status, name: updatedConfig.name, host: updatedConfig.host }
        : status
    )
    saveStatuses(newStatuses)
    
    toast.success('Configuração atualizada com sucesso!')
  }

  const deleteConfig = (id: string) => {
    const newConfigs = configs.filter(config => config.id !== id)
    const newStatuses = statuses.filter(status => status.id !== id)
    
    saveConfigs(newConfigs)
    saveStatuses(newStatuses)
    
    toast.success('Configuração removida com sucesso!')
  }

  // Simulate testing connection
  const testConnection = async (config: VPSConfig) => {
    setIsLoading(true)
    toast.info('Testando conexão...')
    
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Randomly succeed or fail for demo
    const success = Math.random() > 0.3
    
    if (success) {
      toast.success(`Conexão com ${config.name} estabelecida com sucesso!`)
      
      // Update status if config exists
      const existingStatusIndex = statuses.findIndex(s => s.id === config.id)
      if (existingStatusIndex >= 0) {
        const newStatuses = [...statuses]
        newStatuses[existingStatusIndex] = {
          ...newStatuses[existingStatusIndex],
          status: 'online',
          lastChecked: new Date().toISOString(),
          cpuUsage: Math.floor(Math.random() * 100),
          ramUsage: Math.floor(Math.random() * 100),
          diskUsage: Math.floor(Math.random() * 100),
        }
        saveStatuses(newStatuses)
      }
    } else {
      toast.error(`Falha ao conectar com ${config.name}. Verifique as credenciais.`)
      
      // Update status if config exists
      const existingStatusIndex = statuses.findIndex(s => s.id === config.id)
      if (existingStatusIndex >= 0) {
        const newStatuses = [...statuses]
        newStatuses[existingStatusIndex] = {
          ...newStatuses[existingStatusIndex],
          status: 'offline',
          lastChecked: new Date().toISOString(),
        }
        saveStatuses(newStatuses)
      }
    }
    
    setIsLoading(false)
  }

  // Simulate VPS actions
  const restartVPS = async (id: string) => {
    const status = statuses.find(s => s.id === id)
    if (!status) return
    
    setIsLoading(true)
    toast.info(`Reiniciando ${status.name}...`)
    
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const newStatuses = statuses.map(s =>
      s.id === id
        ? { ...s, status: 'online' as const, lastChecked: new Date().toISOString() }
        : s
    )
    saveStatuses(newStatuses)
    
    setIsLoading(false)
    toast.success(`${status.name} reiniciado com sucesso!`)
  }

  const stopVPS = async (id: string) => {
    const status = statuses.find(s => s.id === id)
    if (!status) return
    
    setIsLoading(true)
    toast.info(`Alterando status de ${status.name}...`)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newStatus: 'online' | 'offline' = status.status === 'online' ? 'offline' : 'online'
    const newStatuses = statuses.map(s =>
      s.id === id
        ? { ...s, status: newStatus, lastChecked: new Date().toISOString() }
        : s
    )
    saveStatuses(newStatuses)
    
    setIsLoading(false)
    toast.success(`Status de ${status.name} alterado para ${newStatus === 'online' ? 'online' : 'offline'}!`)
  }

  // Refresh all VPS statuses
  const refreshStatuses = async () => {
    if (configs.length === 0) {
      toast.info('Nenhuma VPS configurada para atualizar')
      return
    }
    
    setIsLoading(true)
    toast.info('Atualizando status de todas as VPS...')
    
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const newStatuses = statuses.map(status => {
      const randomStatus = Math.random() > 0.7 ? 'offline' : 'online'
      return {
        ...status,
        status: randomStatus as 'online' | 'offline',
        cpuUsage: Math.floor(Math.random() * 100),
        ramUsage: Math.floor(Math.random() * 100),
        diskUsage: Math.floor(Math.random() * 100),
        lastChecked: new Date().toISOString(),
      }
    })
    
    saveStatuses(newStatuses)
    setIsLoading(false)
    toast.success('Status atualizado para todas as VPS!')
  }

  return {
    configs,
    statuses,
    isLoading,
    addConfig,
    updateConfig,
    deleteConfig,
    testConnection,
    restartVPS,
    stopVPS,
    refreshStatuses,
  }
}