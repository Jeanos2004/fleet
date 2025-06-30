"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDemoAuth, ProtectedComponent } from '@/components/providers/demo-auth-provider'
import { MapPin, Clock, Truck, User, Plus, Filter, Search } from 'lucide-react'

interface Mission {
  id: string
  title: string
  vehicleId: string
  vehiclePlate: string
  driverId: string
  driverName: string
  origin: string
  destination: string
  startDate: string
  endDate: string
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  distance: number
  cargo: string
  priority: 'low' | 'medium' | 'high'
}

const mockMissions: Mission[] = [
  {
    id: '1',
    title: 'Livraison Paris - Lyon',
    vehicleId: 'v1',
    vehiclePlate: 'TC-001-FR',
    driverId: 'd1',
    driverName: 'Pierre Martin',
    origin: 'Paris, 75001',
    destination: 'Lyon, 69001',
    startDate: '2024-03-16T08:00:00',
    endDate: '2024-03-16T18:00:00',
    status: 'in_progress',
    distance: 465,
    cargo: 'Marchandises diverses (12T)',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Transport Marseille - Nice',
    vehicleId: 'v2',
    vehiclePlate: 'TC-002-FR',
    driverId: 'd2',
    driverName: 'Marie Dubois',
    origin: 'Marseille, 13001',
    destination: 'Nice, 06000',
    startDate: '2024-03-17T06:00:00',
    endDate: '2024-03-17T12:00:00',
    status: 'planned',
    distance: 205,
    cargo: 'Équipements industriels (8T)',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Retour à vide Toulouse',
    vehicleId: 'v3',
    vehiclePlate: 'TC-003-FR',
    driverId: 'd3',
    driverName: 'Jean Dupont',
    origin: 'Toulouse, 31000',
    destination: 'Paris, 75001',
    startDate: '2024-03-15T14:00:00',
    endDate: '2024-03-15T22:00:00',
    status: 'completed',
    distance: 678,
    cargo: 'Retour à vide',
    priority: 'low'
  }
]

export default function MissionsPage() {
  const { hasPermission } = useDemoAuth()
  const [missions] = useState<Mission[]>(mockMissions)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredMissions = missions.filter(mission => {
    const statusMatch = statusFilter === 'all' || mission.status === statusFilter
    const searchMatch = mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       mission.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       mission.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())
    return statusMatch && searchMatch
  })

  const getStatusBadge = (status: Mission['status']) => {
    const statusConfig = {
      planned: { label: 'Planifiée', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
      in_progress: { label: 'En cours', className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
      completed: { label: 'Terminée', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
      cancelled: { label: 'Annulée', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' }
    }
    
    const config = statusConfig[status]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getPriorityBadge = (priority: Mission['priority']) => {
    const priorityConfig = {
      low: { label: 'Basse', className: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300' },
      medium: { label: 'Moyenne', className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
      high: { label: 'Haute', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' }
    }
    
    const config = priorityConfig[priority]
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>
  }

  const missionStats = {
    total: missions.length,
    inProgress: missions.filter(m => m.status === 'in_progress').length,
    planned: missions.filter(m => m.status === 'planned').length,
    completed: missions.filter(m => m.status === 'completed').length
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Toutes les Missions</h1>
          <p className="text-muted-foreground">
            Gérez et suivez toutes vos missions de transport
          </p>
        </div>
        <ProtectedComponent resource="missions" action="create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle mission
          </Button>
        </ProtectedComponent>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total missions</p>
                <p className="text-2xl font-bold text-foreground">{missionStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">En cours</p>
                <p className="text-2xl font-bold text-foreground">{missionStats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Planifiées</p>
                <p className="text-2xl font-bold text-foreground">{missionStats.planned}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Terminées</p>
                <p className="text-2xl font-bold text-foreground">{missionStats.completed}</p>
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
            placeholder="Rechercher une mission..."
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
      </div>

      {/* Missions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMissions.map((mission) => (
          <Card key={mission.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between pb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-lg">{mission.title}</CardTitle>
                  {getPriorityBadge(mission.priority)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {mission.vehiclePlate} • {mission.driverName}
                </p>
              </div>
              {getStatusBadge(mission.status)}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Route */}
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">{mission.origin}</p>
                  <p className="text-muted-foreground">→ {mission.destination}</p>
                  <p className="text-xs text-muted-foreground mt-1">{mission.distance} km</p>
                </div>
              </div>

              {/* Timing */}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(mission.startDate).toLocaleDateString()} - {new Date(mission.endDate).toLocaleDateString()}</span>
              </div>

              {/* Cargo */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">Chargement</p>
                <p className="text-sm text-muted-foreground">{mission.cargo}</p>
              </div>

              {/* Actions */}
              <ProtectedComponent resource="missions" action="update">
                <div className="flex gap-2 pt-3 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    Voir détails
                  </Button>
                  {mission.status === 'planned' && (
                    <Button size="sm" className="flex-1">
                      Démarrer
                    </Button>
                  )}
                </div>
              </ProtectedComponent>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 

