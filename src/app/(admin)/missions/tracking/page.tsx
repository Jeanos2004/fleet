"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDemoAuth, ProtectedComponent } from '@/components/providers/demo-auth-provider'
import { MapPin, Clock, Truck, Navigation, AlertCircle, CheckCircle, Search } from 'lucide-react'

interface TrackedMission {
  id: string
  title: string
  vehiclePlate: string
  driverName: string
  currentLocation: string
  destination: string
  progress: number
  estimatedArrival: string
  actualSpeed: number
  status: 'on_time' | 'delayed' | 'ahead' | 'stopped'
  lastUpdate: string
}

const mockTrackedMissions: TrackedMission[] = [
  {
    id: '1',
    title: 'Livraison Paris-Lyon',
    vehiclePlate: 'TC-001-FR',
    driverName: 'Pierre Martin',
    currentLocation: 'A6 - Beaune',
    destination: 'Lyon',
    progress: 65,
    estimatedArrival: '16:30',
    actualSpeed: 85,
    status: 'on_time',
    lastUpdate: '14:25'
  },
  {
    id: '2',
    title: 'Transport Marseille-Nice',
    vehiclePlate: 'TC-002-FR',
    driverName: 'Marie Dubois',
    currentLocation: 'A8 - Cannes',
    destination: 'Nice',
    progress: 90,
    estimatedArrival: '11:45',
    actualSpeed: 0,
    status: 'stopped',
    lastUpdate: '11:30'
  }
]

export default function MissionTrackingPage() {
  const [missions] = useState<TrackedMission[]>(mockTrackedMissions)
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusBadge = (status: TrackedMission['status']) => {
    const config = {
      on_time: { label: 'À l\'heure', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700', icon: CheckCircle },
      delayed: { label: 'Retard', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700', icon: AlertCircle },
      ahead: { label: 'En avance', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700', icon: CheckCircle },
      stopped: { label: 'Arrêté', className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700', icon: AlertCircle }
    }
    
    const { label, className, icon: Icon } = config[status]
    return (
      <Badge className={`${className} border flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
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
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Suivi en Temps Réel</h1>
          <p className="text-muted-foreground">
            Surveillez vos missions en cours
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <MapPin className="h-4 w-4 mr-2" />
            Vue carte
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card className="stat-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <Navigation className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">En cours</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{missions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">À l'heure</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{missions.filter(m => m.status === 'on_time').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Alertes</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{missions.filter(m => m.status === 'delayed' || m.status === 'stopped').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <Clock className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Avg. vitesse</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{Math.round(missions.reduce((sum, m) => sum + m.actualSpeed, 0) / missions.length)} km/h</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-foreground">{mission.vehiclePlate}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {mission.driverName} • {mission.title}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span className="text-muted-foreground">Position:</span>
                        <span className="font-medium text-foreground">{mission.currentLocation}</span>
                      </div>
                      <div className="hidden sm:block text-muted-foreground">→</div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Destination:</span>
                        <span className="text-foreground">{mission.destination}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${mission.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-foreground">{mission.progress}%</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">ETA</p>
                        <p className="font-semibold text-foreground">{mission.estimatedArrival}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Vitesse</p>
                        <p className="font-semibold text-foreground">{mission.actualSpeed} km/h</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">MAJ</p>
                        <p className="font-semibold text-foreground">{mission.lastUpdate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:items-end">
                  {getStatusBadge(mission.status)}
                  <ProtectedComponent resource="missions" action="read">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Détails
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
