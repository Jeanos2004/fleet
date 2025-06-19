"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Truck, MapPin, Clock, Users, Fuel, TrendingUp, Download, Calendar } from 'lucide-react'

interface OperationalMetrics {
  period: string
  totalMissions: number
  completedMissions: number
  onTimeMissions: number
  totalDistance: number
  totalFuelConsumed: number
  avgFuelEfficiency: number
  activeDrivers: number
  vehicleUtilization: number
  maintenanceEvents: number
  customerSatisfaction: number
}

const mockOperationalData: OperationalMetrics[] = [
  {
    period: 'Mars 2024',
    totalMissions: 145,
    completedMissions: 142,
    onTimeMissions: 135,
    totalDistance: 28500,
    totalFuelConsumed: 8200,
    avgFuelEfficiency: 3.48,
    activeDrivers: 12,
    vehicleUtilization: 87,
    maintenanceEvents: 8,
    customerSatisfaction: 4.6
  },
  {
    period: 'Février 2024',
    totalMissions: 132,
    completedMissions: 128,
    onTimeMissions: 118,
    totalDistance: 25800,
    totalFuelConsumed: 7650,
    avgFuelEfficiency: 3.37,
    activeDrivers: 11,
    vehicleUtilization: 82,
    maintenanceEvents: 12,
    customerSatisfaction: 4.4
  },
  {
    period: 'Janvier 2024',
    totalMissions: 128,
    completedMissions: 125,
    onTimeMissions: 115,
    totalDistance: 24200,
    totalFuelConsumed: 7200,
    avgFuelEfficiency: 3.36,
    activeDrivers: 10,
    vehicleUtilization: 78,
    maintenanceEvents: 6,
    customerSatisfaction: 4.3
  }
]

interface VehiclePerformance {
  vehiclePlate: string
  missions: number
  distance: number
  fuelEfficiency: number
  utilization: number
  onTimeRate: number
}

const mockVehiclePerformance: VehiclePerformance[] = [
  { vehiclePlate: 'TC-001-FR', missions: 42, distance: 8500, fuelEfficiency: 3.6, utilization: 92, onTimeRate: 95 },
  { vehiclePlate: 'TC-002-FR', missions: 38, distance: 7800, fuelEfficiency: 3.4, utilization: 88, onTimeRate: 92 },
  { vehiclePlate: 'TC-003-FR', missions: 35, distance: 6900, fuelEfficiency: 3.5, utilization: 85, onTimeRate: 89 },
  { vehiclePlate: 'TC-004-FR', missions: 32, distance: 5300, fuelEfficiency: 3.2, utilization: 79, onTimeRate: 94 }
]

export default function OperationalReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Mars 2024')
  const [viewMode, setViewMode] = useState<'overview' | 'vehicles' | 'routes'>('overview')

  const currentData = mockOperationalData.find(data => data.period === selectedPeriod) || mockOperationalData[0]
  const previousData = mockOperationalData[1]

  const calculateGrowth = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1)
  }

  const onTimePercentage = ((currentData.onTimeMissions / currentData.completedMissions) * 100).toFixed(1)
  const completionRate = ((currentData.completedMissions / currentData.totalMissions) * 100).toFixed(1)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rapports Opérationnels</h1>
          <p className="text-muted-foreground">
            Analysez les performances opérationnelles de votre flotte
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            {mockOperationalData.map(data => (
              <option key={data.period} value={data.period}>{data.period}</option>
            ))}
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter rapport
          </Button>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === 'overview' ? 'default' : 'outline'}
          onClick={() => setViewMode('overview')}
          size="sm"
        >
          Vue d&apos;ensemble
        </Button>
        <Button
          variant={viewMode === 'vehicles' ? 'default' : 'outline'}
          onClick={() => setViewMode('vehicles')}
          size="sm"
        >
          Par véhicule
        </Button>
        <Button
          variant={viewMode === 'routes' ? 'default' : 'outline'}
          onClick={() => setViewMode('routes')}
          size="sm"
        >
          Routes & zones
        </Button>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Missions complètes</p>
                <p className="text-2xl font-bold text-foreground">{currentData.completedMissions}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">
                    +{calculateGrowth(currentData.completedMissions, previousData.completedMissions)}%
                  </span>
                </div>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ponctualité</p>
                <p className="text-2xl font-bold text-foreground">{onTimePercentage}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">
                    +{(parseFloat(onTimePercentage) - ((previousData.onTimeMissions / previousData.completedMissions) * 100)).toFixed(1)}%
                  </span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Distance totale</p>
                <p className="text-2xl font-bold text-foreground">{currentData.totalDistance.toLocaleString()} km</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-sm text-blue-600">
                    +{calculateGrowth(currentData.totalDistance, previousData.totalDistance)}%
                  </span>
                </div>
              </div>
              <MapPin className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Efficacité carburant</p>
                <p className="text-2xl font-bold text-foreground">{currentData.avgFuelEfficiency} km/L</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">
                    +{calculateGrowth(currentData.avgFuelEfficiency, previousData.avgFuelEfficiency)}%
                  </span>
                </div>
              </div>
              <Fuel className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Mode */}
      {viewMode === 'overview' && (
        <>
          {/* Operational Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance globale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Taux de réalisation</span>
                  <span className="text-xl font-bold text-green-600">{completionRate}%</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Missions programmées</span>
                    <span className="font-medium">{currentData.totalMissions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Missions réalisées</span>
                    <span className="font-medium text-green-600">{currentData.completedMissions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>À temps</span>
                    <span className="font-medium text-blue-600">{currentData.onTimeMissions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>En retard</span>
                    <span className="font-medium text-orange-600">{currentData.completedMissions - currentData.onTimeMissions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utilisation des ressources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Taux d&apos;utilisation véhicules</span>
                      <span className="font-medium">{currentData.vehicleUtilization}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${currentData.vehicleUtilization}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Chauffeurs actifs</span>
                      <span className="font-medium">{currentData.activeDrivers}/15</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(currentData.activeDrivers / 15) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Carburant</p>
                      <p className="font-bold">{currentData.totalFuelConsumed.toLocaleString()} L</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Maintenance</p>
                      <p className="font-bold">{currentData.maintenanceEvents} interventions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Satisfaction */}
          <Card>
            <CardHeader>
              <CardTitle>Satisfaction client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-4xl font-bold text-foreground">{currentData.customerSatisfaction}</p>
                  <p className="text-sm text-muted-foreground">Note moyenne /5</p>
                  <div className="flex justify-center mt-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-2xl ${
                          i < Math.floor(currentData.customerSatisfaction) 
                            ? 'text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm w-8">{rating}★</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ 
                            width: `${rating === 5 ? 60 : rating === 4 ? 25 : rating === 3 ? 10 : rating === 2 ? 3 : 2}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm w-8 text-right">
                        {rating === 5 ? '60%' : rating === 4 ? '25%' : rating === 3 ? '10%' : rating === 2 ? '3%' : '2%'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Vehicle Performance Mode */}
      {viewMode === 'vehicles' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockVehiclePerformance.map((vehicle) => (
            <Card key={vehicle.vehiclePlate} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg">{vehicle.vehiclePlate}</CardTitle>
                <Badge className={
                  vehicle.utilization >= 90 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                  vehicle.utilization >= 80 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }>
                  {vehicle.utilization >= 90 ? 'Excellent' : vehicle.utilization >= 80 ? 'Bon' : 'À améliorer'}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Missions</p>
                    <p className="text-xl font-bold">{vehicle.missions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Distance</p>
                    <p className="text-xl font-bold">{vehicle.distance.toLocaleString()} km</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Utilisation</span>
                      <span className="font-medium">{vehicle.utilization}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          vehicle.utilization >= 90 ? 'bg-green-500' :
                          vehicle.utilization >= 80 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${vehicle.utilization}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Ponctualité</span>
                      <span className="font-medium">{vehicle.onTimeRate}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${vehicle.onTimeRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-sm">Efficacité carburant</span>
                    <span className="font-semibold">{vehicle.fuelEfficiency} km/L</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Routes & Zones Mode */}
      {viewMode === 'routes' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 des routes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { route: 'Paris → Lyon', missions: 28, distance: '465 km', avgTime: '6h 30min', efficiency: 'Excellent' },
                  { route: 'Lyon → Marseille', missions: 22, distance: '315 km', avgTime: '4h 15min', efficiency: 'Bon' },
                  { route: 'Paris → Bordeaux', missions: 18, distance: '580 km', avgTime: '7h 45min', efficiency: 'Bon' },
                  { route: 'Marseille → Nice', missions: 15, distance: '205 km', avgTime: '3h 00min', efficiency: 'Excellent' },
                  { route: 'Toulouse → Montpellier', missions: 12, distance: '245 km', avgTime: '3h 30min', efficiency: 'Correct' }
                ].map((route, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{route.route}</h3>
                      <p className="text-sm text-muted-foreground">{route.distance} • {route.avgTime}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{route.missions}</p>
                      <p className="text-xs text-muted-foreground">missions</p>
                    </div>
                    <Badge className={
                      route.efficiency === 'Excellent' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                      route.efficiency === 'Bon' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                      'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                    }>
                      {route.efficiency}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analyse géographique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Carte des zones de livraison</p>
                  <p className="text-sm">Heatmap des performances par région</p>
                  <p className="text-sm">Intégration GoogleMaps/Mapbox</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des performances - 3 derniers mois</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-muted-foreground">Période</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Missions</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Distance</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Ponctualité</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Efficacité</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Utilisation</th>
                </tr>
              </thead>
              <tbody>
                {mockOperationalData.map((data, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{data.period}</td>
                    <td className="p-4 text-right">{data.completedMissions}</td>
                    <td className="p-4 text-right">{data.totalDistance.toLocaleString()} km</td>
                    <td className="p-4 text-right">
                      {((data.onTimeMissions / data.completedMissions) * 100).toFixed(1)}%
                    </td>
                    <td className="p-4 text-right">{data.avgFuelEfficiency} km/L</td>
                    <td className="p-4 text-right">{data.vehicleUtilization}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 