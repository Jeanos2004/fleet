"use client"

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type StatusType = 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'neutral'
  | 'primary'

interface StatusBadgeProps {
  status: StatusType
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'default' | 'lg'
}

const statusConfig: Record<StatusType, string> = {
  success: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
  warning: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800',
  error: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
  info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
  neutral: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800',
  primary: 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/30'
}

export function StatusBadge({ status, children, className, size = 'default' }: StatusBadgeProps) {
  return (
    <Badge 
      className={cn(
        'border font-medium',
        statusConfig[status],
        size === 'sm' && 'text-xs px-2 py-0.5',
        size === 'lg' && 'text-sm px-3 py-1',
        className
      )}
    >
      {children}
    </Badge>
  )
}

// Helpers pour les statuts spécifiques
export const VehicleStatusBadge = ({ status }: { status: 'disponible' | 'en_mission' | 'maintenance' | 'hors_service' }) => {
  const statusMap = {
    disponible: { type: 'success' as StatusType, label: 'Disponible' },
    en_mission: { type: 'info' as StatusType, label: 'En mission' },
    maintenance: { type: 'warning' as StatusType, label: 'Maintenance' },
    hors_service: { type: 'error' as StatusType, label: 'Hors service' }
  }
  
  const config = statusMap[status]
  return <StatusBadge status={config.type}>{config.label}</StatusBadge>
}

export const DriverStatusBadge = ({ status }: { status: 'available' | 'on_mission' | 'on_leave' | 'suspended' }) => {
  const statusMap = {
    available: { type: 'success' as StatusType, label: 'Disponible' },
    on_mission: { type: 'info' as StatusType, label: 'En mission' },
    on_leave: { type: 'warning' as StatusType, label: 'En congé' },
    suspended: { type: 'error' as StatusType, label: 'Suspendu' }
  }
  
  const config = statusMap[status]
  return <StatusBadge status={config.type}>{config.label}</StatusBadge>
}

export const MissionStatusBadge = ({ status }: { status: 'planned' | 'in_progress' | 'completed' | 'cancelled' }) => {
  const statusMap = {
    planned: { type: 'neutral' as StatusType, label: 'Planifiée' },
    in_progress: { type: 'info' as StatusType, label: 'En cours' },
    completed: { type: 'success' as StatusType, label: 'Terminée' },
    cancelled: { type: 'error' as StatusType, label: 'Annulée' }
  }
  
  const config = statusMap[status]
  return <StatusBadge status={config.type}>{config.label}</StatusBadge>
}

export const MaintenanceStatusBadge = ({ status }: { status: 'scheduled' | 'in_progress' | 'completed' | 'overdue' }) => {
  const statusMap = {
    scheduled: { type: 'neutral' as StatusType, label: 'Programmée' },
    in_progress: { type: 'info' as StatusType, label: 'En cours' },
    completed: { type: 'success' as StatusType, label: 'Terminée' },
    overdue: { type: 'error' as StatusType, label: 'En retard' }
  }
  
  const config = statusMap[status]
  return <StatusBadge status={config.type}>{config.label}</StatusBadge>
}

export const PriorityBadge = ({ priority }: { priority: 'low' | 'medium' | 'high' | 'urgent' }) => {
  const priorityMap = {
    low: { type: 'neutral' as StatusType, label: 'Faible' },
    medium: { type: 'warning' as StatusType, label: 'Moyenne' },
    high: { type: 'error' as StatusType, label: 'Élevée' },
    urgent: { type: 'error' as StatusType, label: 'Urgent' }
  }
  
  const config = priorityMap[priority]
  return <StatusBadge status={config.type}>{config.label}</StatusBadge>
} 