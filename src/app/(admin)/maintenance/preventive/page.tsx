"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, AlertTriangle, CheckCircle, Clock, Plus, Download } from 'lucide-react'

interface PreventiveMaintenance {
  id: string
  vehicleId: string
  vehiclePlate: string
  taskType: string
  description: string
  frequency: 'monthly' | 'quarterly' | 'bi-annual' | 'annual'
  lastPerformed: string
  nextDue: string
  mileageInterval: number
  currentMileage: number
  status: 'upcoming' | 'due' | 'overdue' | 'completed'
  estimatedCost: number
  estimatedDuration: number
}

const mockPreventiveTasks: PreventiveMaintenance[] = [
  {
    id: '1',
    vehicleId: 'v1',
    vehiclePlate: 'TC-001-FR',
    taskType: 'Vidange moteur',
    description: 'Vidange huile moteur + remplacement filtre à huile',
    frequency: 'quarterly',
    lastPerformed: '2024-01-15',
    nextDue: '2024-04-15',
    mileageInterval: 20000,
    currentMileage: 87500,
    status: 'upcoming',
    estimatedCost: 180,
    estimatedDuration: 2
  },
  {
    id: '2',
    vehicleId: 'v2',
    vehiclePlate: 'TC-002-FR',
    taskType: 'Contrôle freinage',
    description: 'Vérification plaquettes, disques et circuit de freinage',
    frequency: 'bi-annual',
    lastPerformed: '2023-09-10',
    nextDue: '2024-03-10',
    mileageInterval: 40000,
    currentMileage: 142300,
    status: 'overdue',
    estimatedCost: 250,
    estimatedDuration: 3
  },
  {
    id: '3',
    vehicleId: 'v1',
    vehiclePlate: 'TC-001-FR',
    taskType: 'Révision générale',
    description: 'Contrôle complet véhicule + mise à jour',
    frequency: 'annual',
    lastPerformed: '2023-03-01',
    nextDue: '2024-03-01',
    mileageInterval: 80000,
    currentMileage: 87500,
    status: 'due',
    estimatedCost: 800,
    estimatedDuration: 8
  },
  {
    id: '4',
    vehicleId: 'v3',
    vehiclePlate: 'TC-003-FR',
    taskType: 'Contrôle pneumatiques',
    description: 'Vérification pression, usure et géométrie',
    frequency: 'monthly',
    lastPerformed: '2024-03-01',
    nextDue: '2024-04-01',
    mileageInterval: 10000,
    currentMileage: 95200,
    status: 'completed',
    estimatedCost: 80,
    estimatedDuration: 1
  }
]

export default function PreventiveMaintenancePage() {
  const [preventiveTasks] = useState<PreventiveMaintenance[]>(mockPreventiveTasks)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [vehicleFilter, setVehicleFilter] = useState<string>('all')

  const filteredTasks = preventiveTasks.filter(task => {
    const statusMatch = statusFilter === 'all' || task.status === statusFilter
    const vehicleMatch = vehicleFilter === 'all' || task.vehicleId === vehicleFilter
    return statusMatch && vehicleMatch
  })

  const getStatusBadge = (status: PreventiveMaintenance['status']) => {
    const statusConfig = {
      upcoming: { label: 'À venir', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', icon: Clock },
      due: { label: 'Échue', className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', icon: AlertTriangle },
      overdue: { label: 'En retard', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300', icon: AlertTriangle },
      completed: { label: 'Terminée', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', icon: CheckCircle }
    }
    
    const config = statusConfig[status]
    const Icon = config.icon
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getFrequencyLabel = (frequency: PreventiveMaintenance['frequency']) => {
    const labels = {
      monthly: 'Mensuelle',
      quarterly: 'Trimestrielle',
      'bi-annual': 'Semestrielle',
      annual: 'Annuelle'
    }
    return labels[frequency]
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const preventiveStats = {
    total: preventiveTasks.length,
    due: preventiveTasks.filter(t => t.status === 'due').length,
    overdue: preventiveTasks.filter(t => t.status === 'overdue').length,
    upcoming: preventiveTasks.filter(t => t.status === 'upcoming').length,
    totalCost: preventiveTasks
      .filter(t => t.status !== 'completed')
      .reduce((sum, t) => sum + t.estimatedCost, 0)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Maintenance Préventive</h1>
          <p className="text-muted-foreground">
            Planifiez et suivez la maintenance préventive de votre flotte
          </p>
        </div>
        <div className="flex gap-3">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Planifier maintenance
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Planning PDF
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total tâches</p>
                <p className="text-2xl font-bold text-foreground">{preventiveStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Échues</p>
                <p className="text-2xl font-bold text-foreground">{preventiveStats.due}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">En retard</p>
                <p className="text-2xl font-bold text-foreground">{preventiveStats.overdue}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">À venir</p>
                <p className="text-2xl font-bold text-foreground">{preventiveStats.upcoming}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-purple-600 font-bold">€</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Coût prévu</p>
                <p className="text-2xl font-bold text-foreground">{preventiveStats.totalCost} €</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={vehicleFilter}
          onChange={(e) => setVehicleFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
        >
          <option value="all">Tous les véhicules</option>
          <option value="v1">TC-001-FR</option>
          <option value="v2">TC-002-FR</option>
          <option value="v3">TC-003-FR</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
        >
          <option value="all">Tous les statuts</option>
          <option value="overdue">En retard</option>
          <option value="due">Échues</option>
          <option value="upcoming">À venir</option>
          <option value="completed">Terminées</option>
        </select>
      </div>

      {/* Maintenance Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTasks.map((task) => {
          const daysUntilDue = getDaysUntilDue(task.nextDue)
          
          return (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div className="flex-1">
                  <CardTitle className="text-lg">{task.taskType}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {task.vehiclePlate} • {getFrequencyLabel(task.frequency)}
                  </p>
                </div>
                {getStatusBadge(task.status)}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Description */}
                <p className="text-sm text-muted-foreground">{task.description}</p>

                {/* Dates and Status */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Dernière maintenance</p>
                    <p className="font-medium">{new Date(task.lastPerformed).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Prochaine échéance</p>
                    <p className="font-medium">{new Date(task.nextDue).toLocaleDateString()}</p>
                    {task.status !== 'completed' && (
                      <p className={`text-xs ${
                        daysUntilDue < 0 ? 'text-red-600' : 
                        daysUntilDue < 7 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} jours de retard` :
                         daysUntilDue === 0 ? 'Aujourd\'hui' :
                         `Dans ${daysUntilDue} jours`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Mileage Info */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span>Kilométrage actuel</span>
                    <span className="font-medium">{task.currentMileage.toLocaleString()} km</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span>Intervalle</span>
                    <span className="font-medium">{task.mileageInterval.toLocaleString()} km</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary h-2 rounded-full"
                      style={{ 
                        width: `${Math.min(100, (task.currentMileage % task.mileageInterval) / task.mileageInterval * 100)}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Cost and Duration */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Coût estimé</p>
                    <p className="font-semibold text-lg">{task.estimatedCost} €</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Durée estimée</p>
                    <p className="font-medium">{task.estimatedDuration}h</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    Programmer
                  </Button>
                  {(task.status === 'due' || task.status === 'overdue') && (
                    <Button size="sm" className="flex-1">
                      Effectuer maintenant
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle>Planning des 30 prochains jours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTasks
              .filter(task => task.status !== 'completed')
              .sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime())
              .slice(0, 5)
              .map((task) => {
                const daysUntilDue = getDaysUntilDue(task.nextDue)
                return (
                  <div key={task.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        daysUntilDue < 0 ? 'bg-red-500' :
                        daysUntilDue < 7 ? 'bg-orange-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <p className="font-medium">{task.taskType}</p>
                        <p className="text-sm text-muted-foreground">{task.vehiclePlate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{new Date(task.nextDue).toLocaleDateString()}</p>
                      <p className={`text-xs ${
                        daysUntilDue < 0 ? 'text-red-600' : 
                        daysUntilDue < 7 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)}j de retard` :
                         daysUntilDue === 0 ? 'Aujourd\'hui' :
                         `Dans ${daysUntilDue}j`}
                      </p>
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 