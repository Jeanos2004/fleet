"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDemoAuth, ProtectedComponent } from '@/components/providers/demo-auth-provider'
import { Truck, User, MapPin, Clock, Plus, Filter, Search, AlertCircle, CheckCircle } from 'lucide-react'

interface Assignment {
  id: string
  vehicleId: string
  vehiclePlate: string
  vehicleModel: string
  driverId: string
  driverName: string
  status: 'active' | 'pending' | 'completed' | 'cancelled'
  startDate: string
  endDate: string
  mission: string
  location: string
  distance: number
  priority: 'low' | 'medium' | 'high'
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    vehicleId: 'v1',
    vehiclePlate: 'TC-001-FR',
    vehicleModel: 'Mercedes Actros',
    driverId: 'd1',
    driverName: 'Pierre Martin',
    status: 'active',
    startDate: '2024-03-16T08:00:00',
    endDate: '2024-03-16T18:00:00',
    mission: 'Livraison Paris - Lyon',
    location: 'A6 - Sens Lyon',
    distance: 285,
    priority: 'high'
  },
  {
    id: '2',
    vehicleId: 'v2',
    vehiclePlate: 'TC-002-FR',
    vehicleModel: 'Volvo FH16',
    driverId: 'd2',
    driverName: 'Marie Dubois',
    status: 'pending',
    startDate: '2024-03-17T06:00:00',
    endDate: '2024-03-17T14:00:00',
    mission: 'Transport Marseille - Nice',
    location: 'Dépôt Marseille',
    distance: 0,
    priority: 'medium'
  },
  {
    id: '3',
    vehicleId: 'v3',
    vehiclePlate: 'TC-003-FR',
    vehicleModel: 'Scania R450',
    driverId: 'd3',
    driverName: 'Jean Dupont',
    status: 'completed',
    startDate: '2024-03-15T14:00:00',
    endDate: '2024-03-15T22:00:00',
    mission: 'Retour à vide Toulouse',
    location: 'Dépôt Paris',
    distance: 678,
    priority: 'low'
  }
]

export default function VehicleAssignmentsPage() {
  const { hasPermission } = useDemoAuth()
  const [assignments] = useState<Assignment[]>(mockAssignments)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredAssignments = assignments.filter(assignment => {
    const statusMatch = statusFilter === 'all' || assignment.status === statusFilter
    const searchMatch = assignment.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       assignment.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       assignment.mission.toLowerCase().includes(searchTerm.toLowerCase())
    return statusMatch && searchMatch
  })

  const getStatusBadge = (status: Assignment['status']) => {
    const statusConfig = {
      active: { label: 'En cours', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700' },
      pending: { label: 'En attente', className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700' },
      completed: { label: 'Terminée', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700' },
      cancelled: { label: 'Annulée', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700' }
    }
    
    const config = statusConfig[status]
    return <Badge className={`${config.className} border`}>{config.label}</Badge>
  }

  const getPriorityBadge = (priority: Assignment['priority']) => {
    const priorityConfig = {
      low: { label: 'Basse', className: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700' },
      medium: { label: 'Moyenne', className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700' },
      high: { label: 'Haute', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700' }
    }
    
    const config = priorityConfig[priority]
    return <Badge variant="outline" className={`${config.className} border`}>{config.label}</Badge>
  }

  const stats = {
    total: assignments.length,
    active: assignments.filter(a => a.status === 'active').length,
    pending: assignments.filter(a => a.status === 'pending').length,
    completed: assignments.filter(a => a.status === 'completed').length
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Assignations Véhicules</h1>
          <p className="text-muted-foreground">
            Gérez les assignations de véhicules aux conducteurs
          </p>
        </div>
        <ProtectedComponent resource="vehicles" action="create">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle assignation
          </Button>
        </ProtectedComponent>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card className="stat-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <Truck className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Actives</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <Clock className="h-6 w-6 md:h-8 md:w-8 text-yellow-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">En attente</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Terminées</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une assignation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-background text-foreground"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={statusFilter === 'all' ? 'default' : 'outline'} 
            onClick={() => setStatusFilter('all')}
            size="sm"
          >
            Toutes
          </Button>
          <Button 
            variant={statusFilter === 'active' ? 'default' : 'outline'} 
            onClick={() => setStatusFilter('active')}
            size="sm"
          >
            Actives
          </Button>
          <Button 
            variant={statusFilter === 'pending' ? 'default' : 'outline'} 
            onClick={() => setStatusFilter('pending')}
            size="sm"
          >
            En attente
          </Button>
        </div>
      </div>

      {/* Assignments List */}
      <div className="grid gap-4">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} className="card-hover">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-foreground">{assignment.vehiclePlate}</span>
                      <span className="text-sm text-muted-foreground">({assignment.vehicleModel})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-foreground">{assignment.driverName}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="text-muted-foreground">Mission:</span>
                      <span className="font-medium text-foreground">{assignment.mission}</span>
                    </div>
                    <div className="hidden sm:block text-muted-foreground">•</div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Position:</span>
                      <span className="text-foreground">{assignment.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <div className="text-muted-foreground">
                      Distance: <span className="font-medium text-foreground">{assignment.distance} km</span>
                    </div>
                    <div className="text-muted-foreground">
                      Début: <span className="text-foreground">{new Date(assignment.startDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Fin: <span className="text-foreground">{new Date(assignment.endDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:items-end">
                  <div className="flex gap-2">
                    {getStatusBadge(assignment.status)}
                    {getPriorityBadge(assignment.priority)}
                  </div>
                  <ProtectedComponent resource="vehicles" action="update">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Modifier
                    </Button>
                  </ProtectedComponent>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Aucune assignation trouvée</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Essayez de modifier vos filtres de recherche.'
                : 'Créez votre première assignation véhicule-conducteur.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

