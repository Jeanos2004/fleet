"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDemoAuth, ProtectedComponent } from '@/components/providers/demo-auth-provider'
import { Truck, TrendingUp, Fuel, BarChart3, Calendar, Plus, Search, Download } from 'lucide-react'

interface MileageRecord {
  id: string
  vehicleId: string
  vehiclePlate: string
  date: string
  startMileage: number
  endMileage: number
  distance: number
  fuelConsumed: number
  efficiency: number
  mission: string
  route: string
  driver: string
  status: 'completed' | 'pending' | 'verified'
}

const mockMileageRecords: MileageRecord[] = [
  {
    id: '1',
    vehicleId: 'v1',
    vehiclePlate: 'TC-001-FR',
    date: '2024-03-16',
    startMileage: 125430,
    endMileage: 125715,
    distance: 285,
    fuelConsumed: 89.5,
    efficiency: 3.19,
    mission: 'Livraison Paris-Lyon',
    route: 'A6',
    driver: 'Pierre Martin',
    status: 'verified'
  },
  {
    id: '2',
    vehicleId: 'v2',
    vehiclePlate: 'TC-002-FR',
    date: '2024-03-15',
    startMileage: 89245,
    endMileage: 89450,
    distance: 205,
    fuelConsumed: 68.2,
    efficiency: 3.01,
    mission: 'Transport Marseille-Nice',
    route: 'A8',
    driver: 'Marie Dubois',
    status: 'completed'
  },
  {
    id: '3',
    vehicleId: 'v3',
    vehiclePlate: 'TC-003-FR',
    date: '2024-03-14',
    startMileage: 156890,
    endMileage: 157568,
    distance: 678,
    fuelConsumed: 198.4,
    efficiency: 3.42,
    mission: 'Retour Toulouse-Paris',
    route: 'A20/A10',
    driver: 'Jean Dupont',
    status: 'pending'
  }
]

export default function VehicleMileagePage() {
  const { hasPermission } = useDemoAuth()
  const [records] = useState<MileageRecord[]>(mockMileageRecords)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredRecords = records.filter(record => {
    const statusMatch = statusFilter === 'all' || record.status === statusFilter
    const searchMatch = record.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       record.mission.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       record.driver.toLowerCase().includes(searchTerm.toLowerCase())
    return statusMatch && searchMatch
  })

  const getStatusBadge = (status: MileageRecord['status']) => {
    const statusConfig = {
      completed: { label: 'Terminé', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700' },
      pending: { label: 'En attente', className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700' },
      verified: { label: 'Vérifié', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700' }
    }
    
    const config = statusConfig[status]
    return <Badge className={`${config.className} border`}>{config.label}</Badge>
  }

  const getEfficiencyBadge = (efficiency: number) => {
    if (efficiency > 3.5) {
      return <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 border">Excellent</Badge>
    } else if (efficiency > 3.0) {
      return <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700 border">Bon</Badge>
    } else {
      return <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 border">À améliorer</Badge>
    }
  }

  const stats = {
    totalDistance: records.reduce((sum, record) => sum + record.distance, 0),
    totalFuel: records.reduce((sum, record) => sum + record.fuelConsumed, 0),
    avgEfficiency: records.reduce((sum, record) => sum + record.efficiency, 0) / records.length,
    totalRecords: records.length
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Historique Kilométrage</h1>
          <p className="text-muted-foreground">
            Suivez les performances et l'efficacité de votre flotte
          </p>
        </div>
        <div className="flex gap-2">
          <ProtectedComponent resource="vehicles" action="create">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau relevé
            </Button>
          </ProtectedComponent>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card className="stat-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Distance totale</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{stats.totalDistance.toLocaleString()} km</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <Fuel className="h-6 w-6 md:h-8 md:w-8 text-orange-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Carburant total</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{stats.totalFuel.toFixed(1)} L</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Efficacité moy.</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{stats.avgEfficiency.toFixed(2)} km/L</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Relevés</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{stats.totalRecords}</p>
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
            placeholder="Rechercher un relevé..."
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
            Tous
          </Button>
          <Button 
            variant={statusFilter === 'verified' ? 'default' : 'outline'} 
            onClick={() => setStatusFilter('verified')}
            size="sm"
          >
            Vérifiés
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

      {/* Records List */}
      <div className="grid gap-4">
        {filteredRecords.map((record) => (
          <Card key={record.id} className="card-hover">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-foreground">{record.vehiclePlate}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(record.date).toLocaleDateString('fr-FR')} • {record.driver}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Distance</p>
                      <p className="font-semibold text-foreground">{record.distance} km</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Carburant</p>
                      <p className="font-semibold text-foreground">{record.fuelConsumed} L</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Efficacité</p>
                      <p className="font-semibold text-foreground">{record.efficiency} km/L</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Kilométrage</p>
                      <p className="font-semibold text-foreground">{record.startMileage.toLocaleString()} → {record.endMileage.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                    <div className="text-muted-foreground">
                      Mission: <span className="font-medium text-foreground">{record.mission}</span>
                    </div>
                    <div className="hidden sm:block text-muted-foreground">•</div>
                    <div className="text-muted-foreground">
                      Route: <span className="text-foreground">{record.route}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:items-end">
                  <div className="flex gap-2">
                    {getStatusBadge(record.status)}
                    {getEfficiencyBadge(record.efficiency)}
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

      {filteredRecords.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Aucun relevé trouvé</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Essayez de modifier vos filtres de recherche.'
                : 'Créez votre premier relevé kilométrique.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 

