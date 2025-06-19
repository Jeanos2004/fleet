'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-permissions'
import { Truck, Fuel, MapPin, Activity, AlertTriangle, CheckCircle, Settings } from 'lucide-react'

interface Vehicle {
  id: string
  plateNumber: string
  model: string
  brand: string
  year: number
  capacity: number
  status: 'available' | 'in_mission' | 'maintenance' | 'out_of_service'
  mileage: number
  fuelLevel: number
  location: string
}

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    plateNumber: 'AB-123-CD',
    model: 'Actros',
    brand: 'Mercedes',
    year: 2022,
    capacity: 25000,
    status: 'available',
    mileage: 45000,
    fuelLevel: 85,
    location: 'Dépôt Principal'
  },
  {
    id: '2',
    plateNumber: 'EF-456-GH',
    model: 'Volvo FH',
    brand: 'Volvo',
    year: 2021,
    capacity: 30000,
    status: 'in_mission',
    mileage: 67000,
    fuelLevel: 45,
    location: 'En route vers Roissy'
  }
]

export function VehicleManager() {
  const { hasPermission } = useAuth()
  const [vehicles] = useState<Vehicle[]>(mockVehicles)

  const getStatusBadge = (status: Vehicle['status']) => {
    const statusConfig = {
      available: { label: 'Disponible', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
      in_mission: { label: 'En mission', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      maintenance: { label: 'Maintenance', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
      out_of_service: { label: 'Hors service', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }
    }
    
    const config = statusConfig[status]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  if (!hasPermission('FLEET_VIEW')) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Accès non autorisé</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total véhicules</p>
              <p className="text-2xl font-bold">{vehicles.length}</p>
            </div>
            <Truck className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Disponibles</p>
              <p className="text-2xl font-bold text-green-600">
                {vehicles.filter(v => v.status === 'available').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En mission</p>
              <p className="text-2xl font-bold text-blue-600">
                {vehicles.filter(v => v.status === 'in_mission').length}
              </p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Maintenance</p>
              <p className="text-2xl font-bold text-orange-600">
                {vehicles.filter(v => v.status === 'maintenance').length}
              </p>
            </div>
            <Settings className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="card-hover rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">Gestion de la Flotte</h2>
        <div className="grid gap-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="gradient-border">
              <div className="p-4 bg-card rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{vehicle.plateNumber}</h3>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.brand} {vehicle.model} ({vehicle.year})
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(vehicle.status)}
                    <div className="text-right">
                      <p className="text-sm font-medium">{vehicle.capacity.toLocaleString()} L</p>
                      <p className="text-xs text-muted-foreground">{vehicle.mileage.toLocaleString()} km</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{vehicle.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Fuel className={`h-4 w-4 ${vehicle.fuelLevel > 50 ? 'text-green-500' : 'text-orange-500'}`} />
                    <span>{vehicle.fuelLevel}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}