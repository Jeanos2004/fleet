"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRolePermissions, ProtectedComponent } from '@/hooks/use-role-permissions'
import { Calendar, Clock, MapPin, Truck, User, Plus, Search } from 'lucide-react'

interface PlannedMission {
  id: string
  title: string
  date: string
  timeSlot: string
  vehiclePlate: string
  driverName: string
  route: string
  priority: 'low' | 'medium' | 'high'
  status: 'draft' | 'confirmed' | 'optimized'
}

const mockPlannedMissions: PlannedMission[] = [
  {
    id: '1',
    title: 'Livraison Paris-Lyon',
    date: '2024-03-18',
    timeSlot: '08:00 - 18:00',
    vehiclePlate: 'TC-001-FR',
    driverName: 'Pierre Martin',
    route: 'A6 direct',
    priority: 'high',
    status: 'confirmed'
  },
  {
    id: '2',
    title: 'Transport Marseille-Nice',
    date: '2024-03-19',
    timeSlot: '06:00 - 14:00',
    vehiclePlate: 'TC-002-FR',
    driverName: 'Marie Dubois',
    route: 'A8 côtier',
    priority: 'medium',
    status: 'draft'
  }
]

export default function MissionPlanningPage() {
  const [missions] = useState<PlannedMission[]>(mockPlannedMissions)
  const [searchTerm, setSearchTerm] = useState('')

  const getPriorityBadge = (priority: PlannedMission['priority']) => {
    const config = {
      low: { label: 'Basse', className: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700' },
      medium: { label: 'Moyenne', className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700' },
      high: { label: 'Haute', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700' }
    }
    
    const { label, className } = config[priority]
    return <Badge className={`${className} border`}>{label}</Badge>
  }

  const getStatusBadge = (status: PlannedMission['status']) => {
    const config = {
      draft: { label: 'Brouillon', className: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700' },
      confirmed: { label: 'Confirmée', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700' },
      optimized: { label: 'Optimisée', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700' }
    }
    
    const { label, className } = config[status]
    return <Badge className={`${className} border`}>{label}</Badge>
  }

  const filteredMissions = missions.filter(mission => 
    mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mission.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mission.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Planification Missions</h1>
          <p className="text-muted-foreground">
            Organisez et optimisez vos missions de transport
          </p>
        </div>
        <ProtectedComponent resource="missions" action="create">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Planifier mission
          </Button>
        </ProtectedComponent>
      </div>

      {/* Calendar View Toggle */}
      <div className="flex gap-2">
        <Button variant="default" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          Vue semaine
        </Button>
        <Button variant="outline" size="sm">
          Vue jour
        </Button>
        <Button variant="outline" size="sm">
          Vue liste
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher une mission..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-background text-foreground"
        />
      </div>

      {/* Missions List */}
      <div className="grid gap-4">
        {filteredMissions.map((mission) => (
          <Card key={mission.id} className="card-hover">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="font-semibold text-foreground">{mission.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(mission.date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-muted-foreground">Horaire:</span>
                      <span className="font-medium text-foreground">{mission.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-green-600" />
                      <span className="text-muted-foreground">Véhicule:</span>
                      <span className="font-medium text-foreground">{mission.vehiclePlate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-purple-600" />
                      <span className="text-muted-foreground">Conducteur:</span>
                      <span className="font-medium text-foreground">{mission.driverName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    <span className="text-muted-foreground">Route:</span>
                    <span className="text-foreground">{mission.route}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:items-end">
                  <div className="flex gap-2">
                    {getStatusBadge(mission.status)}
                    {getPriorityBadge(mission.priority)}
                  </div>
                  <ProtectedComponent resource="missions" action="update">
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
    </div>
  )
} 