"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Activity, 
  Truck, 
  Users, 
  MapPin, 
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
  AlertTriangle
} from 'lucide-react'

interface RealTimeMetric {
  id: string
  label: string
  value: number
  unit: string
  change: number
  status: 'active' | 'warning' | 'critical'
  lastUpdate: Date
}

interface LiveVehicle {
  id: string
  name: string
  status: 'active' | 'idle' | 'maintenance'
  location: string
  speed: number
  fuel: number
  driver: string
}

export function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([
    {
      id: '1',
      label: 'Véhicules actifs',
      value: 12,
      unit: '',
      change: 0,
      status: 'active',
      lastUpdate: new Date()
    },
    {
      id: '2',
      label: 'Vitesse moyenne',
      value: 68,
      unit: 'km/h',
      change: 2,
      status: 'active',
      lastUpdate: new Date()
    },
    {
      id: '3',
      label: 'Consommation',
      value: 28.5,
      unit: 'L/100km',
      change: -0.5,
      status: 'active',
      lastUpdate: new Date()
    },
    {
      id: '4',
      label: 'Alertes',
      value: 3,
      unit: '',
      change: 1,
      status: 'warning',
      lastUpdate: new Date()
    }
  ])

  const [liveVehicles, setLiveVehicles] = useState<LiveVehicle[]>([
    {
      id: 'TC-001',
      name: 'Mercedes Actros',
      status: 'active',
      location: 'A6 - Lyon',
      speed: 85,
      fuel: 78,
      driver: 'Jean Martin'
    },
    {
      id: 'TC-002',
      name: 'Volvo FH16',
      status: 'active',
      location: 'A7 - Marseille',
      speed: 72,
      fuel: 45,
      driver: 'Marie Dubois'
    },
    {
      id: 'TC-003',
      name: 'Scania R450',
      status: 'idle',
      location: 'Dépôt Paris',
      speed: 0,
      fuel: 92,
      driver: 'Pierre Durand'
    },
    {
      id: 'TC-004',
      name: 'DAF XF',
      status: 'active',
      location: 'A10 - Bordeaux',
      speed: 78,
      fuel: 23,
      driver: 'Sophie Martin'
    }
  ])

  // Simulation de mise à jour en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * 2,
        change: (Math.random() - 0.5) * 4,
        lastUpdate: new Date()
      })))

      setLiveVehicles(prev => prev.map(vehicle => ({
        ...vehicle,
        speed: vehicle.status === 'active' ? 
          Math.max(0, vehicle.speed + (Math.random() - 0.5) * 10) : 0,
        fuel: Math.max(5, vehicle.fuel - Math.random() * 0.5),
        location: vehicle.status === 'active' ? 
          `${vehicle.location.split(' - ')[0]} - ${Math.floor(Math.random() * 100)}km` : 
          vehicle.location
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'warning': return 'bg-orange-500'
      case 'critical': return 'bg-red-500'
      case 'idle': return 'bg-gray-500'
      case 'maintenance': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'warning': return 'secondary'
      case 'critical': return 'destructive'
      case 'idle': return 'outline'
      case 'maintenance': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      {/* Métriques en temps réel */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-500" />
          Métriques Temps Réel
          <div className="flex items-center gap-1 ml-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.id} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(metric.status)} animate-pulse`} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">
                      {metric.value.toFixed(metric.unit === 'L/100km' ? 1 : 0)}
                    </span>
                    <span className="text-sm text-muted-foreground">{metric.unit}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {metric.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : metric.change < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                    <span className={`text-xs ${
                      metric.change > 0 ? 'text-green-500' : 
                      metric.change < 0 ? 'text-red-500' : 'text-muted-foreground'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-muted-foreground">
                  Mis à jour: {metric.lastUpdate.toLocaleTimeString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Véhicules en temps réel */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Truck className="h-5 w-5 text-blue-500" />
          Suivi Véhicules en Direct
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {liveVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{vehicle.id}</h4>
                    <p className="text-sm text-muted-foreground">{vehicle.name}</p>
                  </div>
                  <Badge variant={getStatusBadge(vehicle.status)}>
                    {vehicle.status === 'active' ? 'En route' : 
                     vehicle.status === 'idle' ? 'Arrêté' : 'Maintenance'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{vehicle.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{vehicle.driver}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {vehicle.speed.toFixed(0)}
                      </div>
                      <div className="text-xs text-muted-foreground">km/h</div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`text-lg font-bold ${
                        vehicle.fuel > 50 ? 'text-green-600' : 
                        vehicle.fuel > 25 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {vehicle.fuel.toFixed(0)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Carburant</div>
                    </div>
                  </div>
                  
                  {/* Barre de carburant */}
                  <div className="mt-3">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          vehicle.fuel > 50 ? 'bg-green-500' : 
                          vehicle.fuel > 25 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${vehicle.fuel}%` }}
                      />
                    </div>
                  </div>
                  
                  {vehicle.fuel < 25 && (
                    <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 dark:bg-red-950 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-red-700 dark:text-red-300">
                        Niveau carburant faible
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Graphique de vitesse en temps réel */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Vitesses en Temps Réel
        </h3>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-end justify-between h-32 bg-gradient-to-t from-blue-50 to-transparent dark:from-blue-950 rounded-lg p-4">
              {liveVehicles.map((vehicle, index) => (
                <div key={vehicle.id} className="flex flex-col items-center gap-2">
                  <div className="text-xs font-medium text-muted-foreground">
                    {vehicle.speed.toFixed(0)}
                  </div>
                  <div 
                    className={`w-6 rounded-t-sm transition-all ${
                      vehicle.status === 'active' ? 'bg-gradient-to-t from-blue-500 to-blue-300' : 
                      'bg-gradient-to-t from-gray-500 to-gray-300'
                    }`}
                    style={{ 
                      height: `${Math.max(vehicle.speed / 100 * 80, 5)}px`,
                      minHeight: '5px'
                    }}
                  />
                  <div className="text-xs font-medium">{vehicle.id}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 