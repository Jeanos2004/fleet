"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ViewToggle, useViewMode } from '@/components/ui/view-toggle'
import { useDemoAuth, ProtectedComponent } from '@/components/providers/demo-auth-provider'
import { Wrench, AlertTriangle, Calendar, Clock, Plus, Filter, Search, User } from 'lucide-react'

interface MaintenanceIntervention {
  id: string
  vehicleId: string
  vehiclePlate: string
  type: 'preventive' | 'corrective' | 'emergency'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  scheduledDate: string
  completedDate?: string
  technician: string
  estimatedCost: number
  actualCost?: number
  partsCost: number
  laborCost: number
  mileage: number
}

const mockInterventions: MaintenanceIntervention[] = [
  {
    id: '1',
    vehicleId: 'v1',
    vehiclePlate: 'TC-001-FR',
    type: 'preventive',
    title: 'Vidange moteur + filtres',
    description: 'Vidange huile moteur, remplacement filtres à huile et à air',
    priority: 'medium',
    status: 'completed',
    scheduledDate: '2024-03-10',
    completedDate: '2024-03-10',
    technician: 'Lucas Moreau',
    estimatedCost: 450,
    actualCost: 485,
    partsCost: 120,
    laborCost: 365,
    mileage: 85000
  },
  {
    id: '2',
    vehicleId: 'v2',
    vehiclePlate: 'TC-002-FR',
    type: 'corrective',
    title: 'Réparation système freinage',
    description: 'Remplacement plaquettes et disques de frein avant',
    priority: 'high',
    status: 'in_progress',
    scheduledDate: '2024-03-15',
    technician: 'Pierre Duval',
    estimatedCost: 1200,
    partsCost: 750,
    laborCost: 450,
    mileage: 142000
  },
  {
    id: '3',
    vehicleId: 'v3',
    vehiclePlate: 'TC-003-FR',
    type: 'emergency',
    title: 'Panne moteur - diagnostic',
    description: 'Diagnostic complet suite à perte de puissance',
    priority: 'critical',
    status: 'planned',
    scheduledDate: '2024-03-18',
    technician: 'Antoine Bernard',
    estimatedCost: 800,
    partsCost: 0,
    laborCost: 800,
    mileage: 95000
  }
]

export default function MaintenancePage() {
  const { hasPermission } = useDemoAuth()
  const [interventions] = useState<MaintenanceIntervention[]>(mockInterventions)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const { viewMode, setViewMode, isCardView, isListView } = useViewMode('card')

  const filteredInterventions = interventions.filter(intervention => {
    const statusMatch = statusFilter === 'all' || intervention.status === statusFilter
    const typeMatch = typeFilter === 'all' || intervention.type === typeFilter
    const searchMatch = intervention.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       intervention.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       intervention.technician.toLowerCase().includes(searchTerm.toLowerCase())
    return statusMatch && typeMatch && searchMatch
  })

  const getStatusBadge = (status: MaintenanceIntervention['status']) => {
    const statusConfig = {
      planned: { label: 'Planifiée', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
      in_progress: { label: 'En cours', className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
      completed: { label: 'Terminée', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
      cancelled: { label: 'Annulée', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' }
    }
    
    const config = statusConfig[status]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getPriorityBadge = (priority: MaintenanceIntervention['priority']) => {
    const priorityConfig = {
      low: { label: 'Basse', className: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300' },
      medium: { label: 'Moyenne', className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
      high: { label: 'Haute', className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
      critical: { label: 'Critique', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' }
    }
    
    const config = priorityConfig[priority]
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>
  }

  const getTypeBadge = (type: MaintenanceIntervention['type']) => {
    const typeConfig = {
      preventive: { label: 'Préventive', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
      corrective: { label: 'Corrective', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
      emergency: { label: 'Urgence', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' }
    }
    
    const config = typeConfig[type]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const maintenanceStats = {
    total: interventions.length,
    inProgress: interventions.filter(i => i.status === 'in_progress').length,
    planned: interventions.filter(i => i.status === 'planned').length,
    completed: interventions.filter(i => i.status === 'completed').length,
    critical: interventions.filter(i => i.priority === 'critical').length,
    totalCost: interventions.reduce((sum, i) => sum + (i.actualCost || i.estimatedCost), 0)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interventions de Maintenance</h1>
          <p className="text-muted-foreground">
            Gérez toutes les interventions de maintenance de votre flotte
          </p>
        </div>
        <ProtectedComponent resource="maintenance" action="create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle intervention
          </Button>
        </ProtectedComponent>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Wrench className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{maintenanceStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">En cours</p>
                <p className="text-2xl font-bold text-foreground">{maintenanceStats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Planifiées</p>
                <p className="text-2xl font-bold text-foreground">{maintenanceStats.planned}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Critiques</p>
                <p className="text-2xl font-bold text-foreground">{maintenanceStats.critical}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-purple-600 font-bold">€</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Coût total</p>
                <p className="text-2xl font-bold text-foreground">{maintenanceStats.totalCost.toLocaleString()} €</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une intervention..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
        >
          <option value="all">Tous les statuts</option>
          <option value="planned">Planifiées</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Terminées</option>
          <option value="cancelled">Annulées</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
        >
          <option value="all">Tous les types</option>
          <option value="preventive">Préventive</option>
          <option value="corrective">Corrective</option>
          <option value="emergency">Urgence</option>
        </select>
        <ViewToggle 
          viewMode={viewMode} 
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Interventions Display */}
      {isCardView ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInterventions.map((intervention) => (
            <Card key={intervention.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{intervention.title}</CardTitle>
                    {getTypeBadge(intervention.type)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {intervention.vehiclePlate} • {intervention.mileage.toLocaleString()} km
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  {getStatusBadge(intervention.status)}
                  {getPriorityBadge(intervention.priority)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Description */}
                <p className="text-sm text-muted-foreground">{intervention.description}</p>

                {/* Schedule and Technician */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date prévue</p>
                    <p className="font-medium">{new Date(intervention.scheduledDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Technicien</p>
                    <p className="font-medium">{intervention.technician}</p>
                  </div>
                </div>

                {/* Costs */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Pièces</p>
                      <p className="font-medium">{intervention.partsCost} €</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Main d&apos;œuvre</p>
                      <p className="font-medium">{intervention.laborCost} €</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-semibold text-lg">
                        {(intervention.actualCost || intervention.estimatedCost)} €
                      </p>
                    </div>
                  </div>
                </div>

                {/* Completion Date */}
                {intervention.completedDate && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">Terminée le</p>
                    <p className="font-medium">{new Date(intervention.completedDate).toLocaleDateString()}</p>
                  </div>
                )}

                {/* Actions */}
                <ProtectedComponent resource="maintenance" action="update">
                  <div className="flex gap-2 pt-3 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      Voir détails
                    </Button>
                    {intervention.status === 'planned' && (
                      <Button size="sm" className="flex-1">
                        Démarrer
                      </Button>
                    )}
                    {intervention.status === 'in_progress' && (
                      <Button size="sm" className="flex-1">
                        Terminer
                      </Button>
                    )}
                  </div>
                </ProtectedComponent>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Liste des Interventions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-3 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
                <div className="col-span-3">Intervention</div>
                <div className="col-span-2">Véhicule</div>
                <div className="col-span-2">Technicien</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Coût</div>
                <div className="col-span-1">Actions</div>
              </div>
              
              {/* Table Rows */}
              {filteredInterventions.map((intervention) => (
                <div key={intervention.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  {/* Intervention Info */}
                  <div className="col-span-12 md:col-span-3">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{intervention.title}</h3>
                      {getTypeBadge(intervention.type)}
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      {getStatusBadge(intervention.status)}
                      {getPriorityBadge(intervention.priority)}
                    </div>
                    <p className="text-xs text-muted-foreground">{intervention.description}</p>
                  </div>
                  
                  {/* Vehicle */}
                  <div className="col-span-12 md:col-span-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Wrench className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">{intervention.vehiclePlate}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {intervention.mileage.toLocaleString()} km
                    </div>
                  </div>
                  
                  {/* Technician */}
                  <div className="col-span-12 md:col-span-2">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{intervention.technician}</span>
                    </div>
                  </div>
                  
                  {/* Date */}
                  <div className="col-span-12 md:col-span-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{new Date(intervention.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    {intervention.completedDate && (
                      <div className="text-xs text-green-600">
                        Terminée: {new Date(intervention.completedDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  {/* Cost */}
                  <div className="col-span-12 md:col-span-2">
                    <div className="text-sm font-medium">
                      {(intervention.actualCost || intervention.estimatedCost)} €
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Pièces: {intervention.partsCost}€ • MO: {intervention.laborCost}€
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="col-span-12 md:col-span-1">
                    <ProtectedComponent resource="maintenance" action="update">
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          Voir
                        </Button>
                        {intervention.status === 'planned' && (
                          <Button size="sm">
                            Start
                          </Button>
                        )}
                        {intervention.status === 'in_progress' && (
                          <Button size="sm">
                            End
                          </Button>
                        )}
                      </div>
                    </ProtectedComponent>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 

