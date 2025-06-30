"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Fuel, TrendingUp, TrendingDown } from 'lucide-react'

interface FuelData {
  vehicleId: string
  vehicleName: string
  consumption: number
  target: number
  trend: 'up' | 'down' | 'stable'
  efficiency: 'excellent' | 'good' | 'warning' | 'poor'
}

const fuelData: FuelData[] = [
  { vehicleId: 'TC-001', vehicleName: 'Mercedes Actros', consumption: 28.5, target: 30, trend: 'down', efficiency: 'excellent' },
  { vehicleId: 'TC-002', vehicleName: 'Volvo FH16', consumption: 32.1, target: 30, trend: 'up', efficiency: 'warning' },
  { vehicleId: 'TC-003', vehicleName: 'Scania R450', consumption: 29.8, target: 30, trend: 'stable', efficiency: 'good' },
  { vehicleId: 'TC-004', vehicleName: 'DAF XF', consumption: 27.9, target: 30, trend: 'down', efficiency: 'excellent' },
  { vehicleId: 'TC-005', vehicleName: 'MAN TGX', consumption: 31.5, target: 30, trend: 'up', efficiency: 'warning' },
  { vehicleId: 'TC-006', vehicleName: 'Iveco Stralis', consumption: 35.2, target: 30, trend: 'up', efficiency: 'poor' }
]

const weeklyData = [
  { day: 'Lun', consumption: 28.5 },
  { day: 'Mar', consumption: 29.1 },
  { day: 'Mer', consumption: 27.8 },
  { day: 'Jeu', consumption: 30.2 },
  { day: 'Ven', consumption: 28.9 },
  { day: 'Sam', consumption: 29.5 },
  { day: 'Dim', consumption: 26.8 }
]

export function FuelConsumptionChart() {
  const averageConsumption = fuelData.reduce((sum, vehicle) => sum + vehicle.consumption, 0) / fuelData.length
  const maxConsumption = Math.max(...weeklyData.map(d => d.consumption))
  
  const getEfficiencyColor = (efficiency: string) => {
    switch (efficiency) {
      case 'excellent': return 'bg-green-500'
      case 'good': return 'bg-blue-500'
      case 'warning': return 'bg-orange-500'
      case 'poor': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getEfficiencyBadge = (efficiency: string) => {
    switch (efficiency) {
      case 'excellent': return 'default'
      case 'good': return 'secondary'
      case 'warning': return 'destructive'
      case 'poor': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      {/* Consommation par véhicule */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Fuel className="h-5 w-5 text-orange-500" />
          Consommation par Véhicule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fuelData.map((vehicle) => (
            <Card key={vehicle.vehicleId} className="relative">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-sm">{vehicle.vehicleId}</h4>
                    <p className="text-xs text-muted-foreground">{vehicle.vehicleName}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {vehicle.trend === 'up' && <TrendingUp className="h-4 w-4 text-red-500" />}
                    {vehicle.trend === 'down' && <TrendingDown className="h-4 w-4 text-green-500" />}
                    {vehicle.trend === 'stable' && <div className="w-4 h-4 rounded-full bg-gray-400" />}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{vehicle.consumption}</span>
                    <span className="text-sm text-muted-foreground">L/100km</span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${getEfficiencyColor(vehicle.efficiency)}`}
                      style={{ width: `${Math.min((vehicle.target / vehicle.consumption) * 100, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Objectif: {vehicle.target} L/100km
                    </span>
                    <Badge size="sm" variant={getEfficiencyBadge(vehicle.efficiency)}>
                      {vehicle.efficiency}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tendance hebdomadaire */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Consommation Hebdomadaire</h3>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-end justify-between h-48 bg-gradient-to-t from-orange-50 to-transparent dark:from-orange-950 rounded-lg p-4">
              {weeklyData.map((day, index) => (
                <div key={day.day} className="flex flex-col items-center gap-2">
                  <div className="text-xs font-medium text-muted-foreground">
                    {day.consumption}L
                  </div>
                  <div 
                    className="w-8 bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-sm transition-all hover:from-orange-600 hover:to-orange-400 cursor-pointer"
                    style={{ 
                      height: `${(day.consumption / maxConsumption) * 160}px`,
                      minHeight: '20px'
                    }}
                  />
                  <div className="text-xs font-medium">{day.day}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {averageConsumption.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Moyenne flotte</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.min(...fuelData.map(v => v.consumption)).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Meilleure</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {Math.max(...fuelData.map(v => v.consumption)).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">À améliorer</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques de consommation */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Statistiques de Consommation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {fuelData.filter(v => v.efficiency === 'excellent').length}
              </div>
              <div className="text-xs text-muted-foreground">Excellente</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {fuelData.filter(v => v.efficiency === 'good').length}
              </div>
              <div className="text-xs text-muted-foreground">Bonne</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {fuelData.filter(v => v.efficiency === 'warning').length}
              </div>
              <div className="text-xs text-muted-foreground">À surveiller</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {fuelData.filter(v => v.efficiency === 'poor').length}
              </div>
              <div className="text-xs text-muted-foreground">Critique</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 