'use client'

import { useState } from 'react'
import { useRolePermissions, ProtectedComponent } from '@/hooks/use-role-permissions'
import { 
  Truck, 
  Calendar, 
  MapPin,
  Fuel,
  Settings,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'

interface Vehicle {
  id: string
  plateNumber: string
  brand: string
  model: string
  year: number
  type: 'citerne' | 'camion' | 'fourgon'
  capacity: number
  fuelType: 'diesel' | 'essence' | 'electrique'
  status: 'disponible' | 'en_mission' | 'maintenance' | 'hors_service'
  mileage: number
  lastMaintenance: string
  nextMaintenance: string
  driver?: string
  location: string
  fuelLevel: number
  documents: {
    insurance: string
    inspection: string
    registration: string
  }
}

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    plateNumber: 'TC-001-FR',
    brand: 'Mercedes',
    model: 'Actros 2545',
    year: 2021,
    type: 'citerne',
    capacity: 25000,
    fuelType: 'diesel',
    status: 'en_mission',
    mileage: 87542,
    lastMaintenance: '2024-02-15',
    nextMaintenance: '2024-05-15',
    driver: 'Pierre Martin',
    location: 'Paris, 75001',
    fuelLevel: 85,
    documents: {
      insurance: '2025-12-31',
      inspection: '2024-08-15',
      registration: '2026-03-20'
    }
  },
  {
    id: '2',
    plateNumber: 'TC-002-FR',
    brand: 'Volvo',
    model: 'FH16 750',
    year: 2020,
    type: 'citerne',
    capacity: 30000,
    fuelType: 'diesel',
    status: 'disponible',
    mileage: 142300,
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-04-20',
    location: 'Lyon, 69001',
    fuelLevel: 72,
    documents: {
      insurance: '2025-06-30',
      inspection: '2024-12-10',
      registration: '2025-11-15'
    }
  },
  {
    id: '3',
    plateNumber: 'TC-003-FR',
    brand: 'Scania',
    model: 'R450',
    year: 2019,
    type: 'citerne',
    capacity: 28000,
    fuelType: 'diesel',
    status: 'maintenance',
    mileage: 198750,
    lastMaintenance: '2024-03-01',
    nextMaintenance: '2024-06-01',
    driver: 'Marie Dubois',
    location: 'Atelier Central',
    fuelLevel: 15,
    documents: {
      insurance: '2024-09-30',
      inspection: '2024-07-22',
      registration: '2025-04-18'
    }
  },
  {
    id: '4',
    plateNumber: 'EV-001-FR',
    brand: 'Tesla',
    model: 'Semi',
    year: 2023,
    type: 'camion',
    capacity: 20000,
    fuelType: 'electrique',
    status: 'disponible',
    mileage: 15800,
    lastMaintenance: '2024-02-28',
    nextMaintenance: '2024-08-28',
    location: 'Marseille, 13001',
    fuelLevel: 92,
    documents: {
      insurance: '2026-01-15',
      inspection: '2025-02-28',
      registration: '2027-12-10'
    }
  }
]

export function VehicleManager() {
  const { hasPermission } = useRolePermissions()
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState<Partial<Vehicle>>({})

  const getStatusBadge = (status: Vehicle['status']) => {
    const statusConfig = {
      disponible: { label: 'Disponible', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' },
      en_mission: { label: 'En mission', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
      maintenance: { label: 'Maintenance', className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
      hors_service: { label: 'Hors service', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' }
    }
    
    const config = statusConfig[status]
    return <Badge className={`${config.className} border`}>{config.label}</Badge>
  }

  const getFuelIcon = (fuelType: Vehicle['fuelType']) => {
    if (fuelType === 'electrique') {
      return <span className="text-lg">⚡</span>
    }
    return <Fuel className="h-4 w-4" />
  }

  const isDocumentExpiringSoon = (date: string) => {
    const expiry = new Date(date)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30
  }

  const handleAdd = () => {
    setEditingVehicle(null)
    setFormData({
      plateNumber: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      type: 'citerne',
      capacity: 25000,
      fuelType: 'diesel',
      status: 'disponible',
      mileage: 0,
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: '',
      location: '',
      fuelLevel: 100,
      documents: {
        insurance: '',
        inspection: '',
        registration: ''
      }
    })
    setIsModalOpen(true)
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setFormData(vehicle)
    setIsModalOpen(true)
  }

  const handleView = (vehicle: Vehicle) => {
    setViewingVehicle(vehicle)
  }

  const handleDelete = async (vehicle: Vehicle) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le véhicule ${vehicle.plateNumber} ?`)) {
      setVehicles(prev => prev.filter(v => v.id !== vehicle.id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingVehicle) {
      setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? { ...v, ...formData } : v))
    } else {
      const newVehicle: Vehicle = {
        id: Date.now().toString(),
        plateNumber: formData.plateNumber || '',
        brand: formData.brand || '',
        model: formData.model || '',
        year: formData.year || new Date().getFullYear(),
        type: formData.type as Vehicle['type'] || 'citerne',
        capacity: formData.capacity || 25000,
        fuelType: formData.fuelType as Vehicle['fuelType'] || 'diesel',
        status: formData.status as Vehicle['status'] || 'disponible',
        mileage: formData.mileage || 0,
        lastMaintenance: formData.lastMaintenance || new Date().toISOString().split('T')[0],
        nextMaintenance: formData.nextMaintenance || '',
        location: formData.location || '',
        fuelLevel: formData.fuelLevel || 100,
        documents: formData.documents || {
          insurance: '',
          inspection: '',
          registration: ''
        }
      }
      setVehicles(prev => [...prev, newVehicle])
    }
    
    setIsModalOpen(false)
    setFormData({})
    setEditingVehicle(null)
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Gestion des Véhicules</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gérez votre flotte de véhicules et suivez leur état
          </p>
        </div>
        <ProtectedComponent resource="vehicles" action="create">
          <Button onClick={handleAdd} className="w-full sm:w-auto shadow-sm hover:shadow-md">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un véhicule
          </Button>
        </ProtectedComponent>
        </div>
        
      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Truck className="h-6 w-6 text-muted-foreground" />
                  </div>
            <div>
                    <CardTitle className="text-lg font-semibold">
                      {vehicle.plateNumber}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.brand} {vehicle.model} ({vehicle.year})
              </p>
            </div>
                </div>
                {getStatusBadge(vehicle.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Vehicle Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {getFuelIcon(vehicle.fuelType)}
                    <span className="text-sm font-medium">Type</span>
                  </div>
                  <span className="text-sm text-muted-foreground capitalize">
                    {vehicle.type} • {vehicle.capacity.toLocaleString()}L
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">Localisation</span>
                  </div>
                  <span className="text-sm text-muted-foreground truncate">
                    {vehicle.location}
                  </span>
                </div>

                {vehicle.driver && (
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">👨‍💼 Chauffeur</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {vehicle.driver}
                    </span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                <div className="text-center p-2 bg-muted/30 rounded">
                  <div className="text-lg font-semibold text-foreground">
                    {vehicle.mileage.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">km</div>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded">
                  <div className="text-lg font-semibold text-foreground">
                    {vehicle.fuelLevel}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {vehicle.fuelType === 'electrique' ? 'Batterie' : 'Carburant'}
                  </div>
                </div>
              </div>

              {/* Maintenance */}
              <div className={`p-3 rounded-lg border ${
                isDocumentExpiringSoon(vehicle.nextMaintenance) 
                  ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800' 
                  : 'bg-muted/30 border-border'
              }`}>
                <div className="flex items-center space-x-2 mb-1">
                  <Settings className="h-4 w-4" />
                  <span className="text-sm font-medium">Prochaine maintenance</span>
                  {isDocumentExpiringSoon(vehicle.nextMaintenance) && (
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(vehicle.nextMaintenance).toLocaleDateString()}
          </div>
        </div>
        
              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleView(vehicle)}
                  className="flex-1 hover:bg-muted"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Voir
                </Button>
                <ProtectedComponent resource="vehicles" action="update">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(vehicle)}
                    className="flex-1 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Modifier
                  </Button>
                </ProtectedComponent>
                <ProtectedComponent resource="vehicles" action="delete">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(vehicle)}
                    className="flex-1 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Suppr.
                  </Button>
                </ProtectedComponent>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-card-foreground">
                  {editingVehicle ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Plaque d&apos;immatriculation</label>
                    <input
                      type="text"
                      value={formData.plateNumber || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, plateNumber: e.target.value }))}
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Marque</label>
                    <input
                      type="text"
                      value={formData.brand || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Modèle</label>
                    <input
                      type="text"
                      value={formData.model || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Année</label>
                    <input
                      type="number"
                      value={formData.year || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Type</label>
                    <select
                      value={formData.type || 'citerne'}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Vehicle['type'] }))}
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                    >
                      <option value="citerne">Citerne</option>
                      <option value="camion">Camion</option>
                      <option value="fourgon">Fourgon</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Capacité (L)</label>
                    <input
                      type="number"
                      value={formData.capacity || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                      required
                    />
                  </div>
            <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Carburant</label>
                    <select
                      value={formData.fuelType || 'diesel'}
                      onChange={(e) => setFormData(prev => ({ ...prev, fuelType: e.target.value as Vehicle['fuelType'] }))}
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                    >
                      <option value="diesel">Diesel</option>
                      <option value="essence">Essence</option>
                      <option value="electrique">Électrique</option>
                    </select>
            </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Statut</label>
                    <select
                      value={formData.status || 'disponible'}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Vehicle['status'] }))}
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                    >
                      <option value="disponible">Disponible</option>
                      <option value="en_mission">En mission</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="hors_service">Hors service</option>
                    </select>
          </div>
        </div>
        
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto shadow-sm hover:shadow-md"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingVehicle ? 'Mettre à jour' : 'Ajouter'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal for View Details */}
      {viewingVehicle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-card-foreground">Détails du véhicule</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewingVehicle(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
      </div>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-10 w-10 text-muted-foreground" />
                    </div>
                  <h4 className="text-xl font-semibold text-card-foreground">
                    {viewingVehicle.plateNumber}
                  </h4>
                  <p className="text-muted-foreground">
                    {viewingVehicle.brand} {viewingVehicle.model} ({viewingVehicle.year})
                  </p>
                  <div className="mt-2">
                    {getStatusBadge(viewingVehicle.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-6">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">Type & Capacité</div>
                    <div className="text-sm text-foreground capitalize">
                      {viewingVehicle.type} • {viewingVehicle.capacity.toLocaleString()}L
                    </div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">Carburant</div>
                    <div className="text-sm text-foreground capitalize">{viewingVehicle.fuelType}</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">Kilométrage</div>
                    <div className="text-sm text-foreground">{viewingVehicle.mileage.toLocaleString()} km</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">Niveau carburant</div>
                    <div className="text-sm text-foreground">{viewingVehicle.fuelLevel}%</div>
                    </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">Localisation</div>
                    <div className="text-sm text-foreground">{viewingVehicle.location}</div>
                  </div>
                  {viewingVehicle.driver && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">Chauffeur</div>
                      <div className="text-sm text-foreground">{viewingVehicle.driver}</div>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-border pt-6">
                  <h5 className="font-semibold text-card-foreground mb-3">Documents</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <span className="text-sm text-muted-foreground">Assurance</span>
                      <span className={`text-sm ${
                        isDocumentExpiringSoon(viewingVehicle.documents.insurance) 
                          ? 'text-orange-600 dark:text-orange-400' 
                          : 'text-foreground'
                      }`}>
                        {new Date(viewingVehicle.documents.insurance).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <span className="text-sm text-muted-foreground">Contrôle technique</span>
                      <span className={`text-sm ${
                        isDocumentExpiringSoon(viewingVehicle.documents.inspection) 
                          ? 'text-orange-600 dark:text-orange-400' 
                          : 'text-foreground'
                      }`}>
                        {new Date(viewingVehicle.documents.inspection).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <span className="text-sm text-muted-foreground">Carte grise</span>
                      <span className={`text-sm ${
                        isDocumentExpiringSoon(viewingVehicle.documents.registration) 
                          ? 'text-orange-600 dark:text-orange-400' 
                          : 'text-foreground'
                      }`}>
                        {new Date(viewingVehicle.documents.registration).toLocaleDateString()}
                      </span>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}