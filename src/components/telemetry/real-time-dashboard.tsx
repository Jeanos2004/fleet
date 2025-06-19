"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockCamions } from '@/lib/db/mock-data'
import { formatDate } from '@/lib/utils'
import { 
  Activity, 
  MapPin, 
  Fuel, 
  Gauge, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

interface TelemetryData {
  camionId: string
  timestamp: Date
  latitude: number
  longitude: number
  vitesse: number
  odometre: number
  consommationInstantanee: number
  consommationMoyenne: number
  temperatureMoteur: number
  pressionPneus: number[]
  alertes: string[]
  statut: 'EN_MARCHE' | 'ARRET' | 'MAINTENANCE' | 'ALERTE'
}

// Simulation de données télémétrie
const generateMockTelemetryData = (camionId: string): TelemetryData => {
  const baseData = {
    '1': { lat: 48.8566, lon: 2.3522, odo: 125430 }, // Paris
    '2': { lat: 45.7640, lon: 4.8357, odo: 98750 },  // Lyon  
    '3': { lat: 43.2965, lon: 5.3698, odo: 156890 }  // Marseille
  }
  
  const base = baseData[camionId as keyof typeof baseData] || baseData['1']
  const variation = (Math.random() - 0.5) * 0.01 // Variation position
  
  return {
    camionId,
    timestamp: new Date(),
    latitude: base.lat + variation,
    longitude: base.lon + variation,
    vitesse: Math.floor(Math.random() * 90) + 10,
    odometre: base.odo + Math.floor(Math.random() * 100),
    consommationInstantanee: Math.random() * 40 + 20, // L/100km
    consommationMoyenne: Math.random() * 35 + 25,
    temperatureMoteur: Math.random() * 20 + 80, // 80-100°C
    pressionPneus: Array.from({ length: 6 }, () => Math.random() * 0.5 + 7.5), // 7.5-8.0 bars
    alertes: Math.random() > 0.8 ? ['Conduite agressive détectée'] : [],
    statut: Math.random() > 0.9 ? 'ALERTE' : 'EN_MARCHE'
  }
}

export function RealTimeDashboard() {
  const [telemetryData, setTelemetryData] = useState<Record<string, TelemetryData>>({})
  const [isConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Simulation de la réception de données télémétrie
  useEffect(() => {
    const interval = setInterval(() => {
      const newData: Record<string, TelemetryData> = {}
      mockCamions.forEach(camion => {
        if (camion.disponible) {
          newData[camion.id] = generateMockTelemetryData(camion.id)
        }
      })
      setTelemetryData(newData)
      setLastUpdate(new Date())
    }, 5000) // Mise à jour toutes les 5 secondes

    return () => clearInterval(interval)
  }, [])

  const activeTrucks = Object.keys(telemetryData).length
  const alertCount = Object.values(telemetryData).reduce((count, data) => 
    count + data.alertes.length, 0
  )
  const avgConsumption = Object.values(telemetryData).length > 0 
    ? Object.values(telemetryData).reduce((sum, data) => sum + data.consommationMoyenne, 0) / Object.values(telemetryData).length
    : 0

  const refreshData = () => {
    const newData: Record<string, TelemetryData> = {}
    mockCamions.forEach(camion => {
      if (camion.disponible) {
        newData[camion.id] = generateMockTelemetryData(camion.id)
      }
    })
    setTelemetryData(newData)
    setLastUpdate(new Date())
  }

  return (
    <div className="space-y-6">
      {/* Header avec statut de connexion */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Télémétrie Temps Réel</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Connecté' : 'Déconnecté'} - Dernière MAJ: {formatDate(lastUpdate)}
            </span>
          </div>
        </div>
        <Button onClick={refreshData} variant="outline" size="sm" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </Button>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Camions actifs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeTrucks}</div>
            <p className="text-xs text-muted-foreground">
              sur {mockCamions.length} camions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes actives</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${alertCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {alertCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {alertCount === 0 ? 'Aucune alerte' : 'Nécessitent attention'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consommation moy.</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConsumption.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              L/100km
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statut réseau</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">OK</div>
            <p className="text-xs text-muted-foreground">
              Tous systèmes opérationnels
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Données détaillées par camion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(telemetryData).map(([camionId, data]) => {
          const camion = mockCamions.find(c => c.id === camionId)
          if (!camion) return null

          const hasAlerts = data.alertes.length > 0
          const highTemp = data.temperatureMoteur > 95

          return (
            <Card key={camionId} className={hasAlerts ? 'border-red-200 dark:border-red-800' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {camion.immatriculation}
                  </CardTitle>
                  <Badge variant={data.statut === 'ALERTE' ? 'destructive' : 'default'}>
                    {data.statut}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Position et vitesse */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <MapPin className="h-3 w-3" />
                      Position
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <Gauge className="h-3 w-3" />
                      Vitesse
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {data.vitesse} km/h
                    </p>
                  </div>
                </div>

                {/* Odomètre et consommation */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Odomètre</div>
                    <p className="text-sm font-medium text-foreground">
                      {data.odometre.toLocaleString()} km
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <Fuel className="h-3 w-3" />
                      Consommation
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium text-foreground">
                        {data.consommationInstantanee.toFixed(1)} L/100km
                      </p>
                      {data.consommationInstantanee < data.consommationMoyenne ? (
                        <TrendingDown className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingUp className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Température moteur */}
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Température moteur</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${highTemp ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min((data.temperatureMoteur / 120) * 100, 100)}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${highTemp ? 'text-red-600' : 'text-foreground'}`}>
                      {data.temperatureMoteur.toFixed(0)}°C
                    </span>
                  </div>
                </div>

                {/* Pression pneus */}
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Pression pneus</div>
                  <div className="grid grid-cols-3 gap-2">
                    {data.pressionPneus.map((pression, index) => (
                      <div key={index} className="text-center">
                        <div className={`text-xs font-medium ${pression < 7.8 ? 'text-red-600' : 'text-foreground'}`}>
                          {pression.toFixed(1)} bar
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Pneu {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alertes */}
                {data.alertes.length > 0 && (
                  <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800 dark:text-red-200">
                        Alertes actives
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {data.alertes.map((alerte, index) => (
                        <li key={index} className="text-xs text-red-700 dark:text-red-300">
                          • {alerte}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Dernière mise à jour: {formatDate(data.timestamp)}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 