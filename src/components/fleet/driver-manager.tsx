'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { useRolePermissions, ProtectedComponent } from '@/hooks/use-role-permissions'
import { 
  User, 
  Mail, 
  Calendar, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Car,
  Edit,
  Trash2,
  Plus,
  Phone,
  Save,
  X,
  Eye
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface Driver {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  licenseNumber: string
  licenseExpiry: string
  status: 'available' | 'on_mission' | 'on_leave' | 'suspended'
  hireDate: string
  totalMissions: number
  rating: number
  currentVehicle?: string
  lastMission?: string
}

const mockDrivers: Driver[] = [
  {
    id: '1',
    firstName: 'Pierre',
    lastName: 'Martin',
    email: 'pierre.martin@fleet.com',
    phone: '+33 6 12 34 56 78',
    licenseNumber: 'A123456789',
    licenseExpiry: '2025-06-15',
    status: 'on_mission',
    hireDate: '2020-03-15',
    totalMissions: 245,
    rating: 4.8,
    currentVehicle: 'EF-456-GH',
    lastMission: '2024-03-10'
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Dubois',
    email: 'marie.dubois@fleet.com',
    phone: '+33 6 98 76 54 32',
    licenseNumber: 'B987654321',
    licenseExpiry: '2024-12-20',
    status: 'available',
    hireDate: '2021-07-20',
    totalMissions: 189,
    rating: 4.6,
    lastMission: '2024-03-08'
  },
  {
    id: '3',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@fleet.com',
    phone: '+33 6 55 44 33 22',
    licenseNumber: 'C555444333',
    licenseExpiry: '2024-04-10',
    status: 'suspended',
    hireDate: '2019-11-10',
    totalMissions: 312,
    rating: 3.9,
    lastMission: '2024-02-28'
  }
]

export function DriverManager() {
  const { hasPermission, isDriver } = useRolePermissions()
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
  const [viewingDriver, setViewingDriver] = useState<Driver | null>(null)
  const [formData, setFormData] = useState<Partial<Driver>>({})

  const getStatusBadge = (status: Driver['status']) => {
    const statusConfig = {
      available: { label: 'Disponible', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-300' },
      on_mission: { label: 'En mission', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-300' },
      on_leave: { label: 'En congé', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-300' },
      suspended: { label: 'Suspendu', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-300' }
    }
    
    const config = statusConfig[status]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
        <span className="text-xs text-muted-foreground ml-1">({rating})</span>
      </div>
    )
  }

  const isLicenseExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30
  }

  const handleAdd = () => {
    setEditingDriver(null)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      licenseNumber: '',
      licenseExpiry: '',
      status: 'available',
      hireDate: new Date().toISOString().split('T')[0]
    })
    setIsModalOpen(true)
  }

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver)
    setFormData(driver)
    setIsModalOpen(true)
  }

  const handleView = (driver: Driver) => {
    setViewingDriver(driver)
  }

  const handleDelete = async (driver: Driver) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${driver.firstName} ${driver.lastName} ?`)) {
      setDrivers(prev => prev.filter(d => d.id !== driver.id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
      
      if (editingDriver) {
      // Update existing driver
      setDrivers(prev => prev.map(d => d.id === editingDriver.id ? { ...d, ...formData } : d))
      } else {
      // Add new driver
        const newDriver: Driver = {
          id: Date.now().toString(),
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        licenseNumber: formData.licenseNumber || '',
        licenseExpiry: formData.licenseExpiry || '',
        status: formData.status as Driver['status'] || 'available',
        hireDate: formData.hireDate || new Date().toISOString().split('T')[0],
          totalMissions: 0,
          rating: 5.0
        }
        setDrivers(prev => [...prev, newDriver])
    }
    
    setIsModalOpen(false)
    setFormData({})
    setEditingDriver(null)
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Gestion des Chauffeurs</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gérez votre équipe de chauffeurs et leurs informations
          </p>
        </div>
        <ProtectedComponent resource="drivers" action="create">
          <Button onClick={handleAdd} className="w-full sm:w-auto shadow-lg border-2 border-transparent hover:border-primary/20">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un chauffeur
          </Button>
        </ProtectedComponent>
      </div>

      {/* Drivers Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {drivers.map((driver) => (
          <Card key={driver.id} className="shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:border-primary/30">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                    <User className="h-6 w-6 text-primary" />
                  </div>
            <div>
                    <CardTitle className="text-base font-semibold">
                      {driver.firstName} {driver.lastName}
                    </CardTitle>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{driver.email}</span>
                    </div>
                  </div>
                </div>
                {getStatusBadge(driver.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{driver.phone}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-xs">{driver.licenseNumber}</span>
                  </div>
                  <div className={`text-xs flex items-center space-x-1 ${
                    isLicenseExpiringSoon(driver.licenseExpiry) ? 'text-red-500' : 'text-muted-foreground'
                  }`}>
                    <Calendar className="h-3 w-3" />
                    <span>Exp: {new Date(driver.licenseExpiry).toLocaleDateString()}</span>
                    {isLicenseExpiringSoon(driver.licenseExpiry) && (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">{driver.totalMissions}</div>
                  <div className="text-xs text-muted-foreground">Missions</div>
            </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-yellow-600">{driver.rating}★</div>
                  <div className="text-xs text-muted-foreground">Note</div>
          </div>
        </div>
        
              {/* Current Vehicle */}
              {driver.currentVehicle && (
                <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
                  <Car className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-mono text-blue-700 dark:text-blue-300">
                    {driver.currentVehicle}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleView(driver)}
                  className="flex-1 border-2 hover:border-primary hover:bg-primary/10"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Voir
                </Button>
                <ProtectedComponent resource="drivers" action="update">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(driver)}
                    className="flex-1 border-2 hover:border-blue-500 hover:bg-blue-50"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Modifier
                  </Button>
                </ProtectedComponent>
                <ProtectedComponent resource="drivers" action="delete">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(driver)}
                    className="flex-1 border-2 hover:border-red-500 hover:bg-red-50 text-red-600"
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-300 dark:border-gray-600 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {editingDriver ? 'Modifier le chauffeur' : 'Ajouter un chauffeur'}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="border-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                    <label className="block text-sm font-medium mb-2">Prénom</label>
                    <input
                      type="text"
                      value={formData.firstName || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800"
                      required
                    />
            </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom</label>
                    <input
                      type="text"
                      value={formData.lastName || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800"
                      required
                    />
          </div>
        </div>
        
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                    <label className="block text-sm font-medium mb-2">Numéro de permis</label>
                    <input
                      type="text"
                      value={formData.licenseNumber || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800"
                      required
                    />
            </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date d&apos;expiration</label>
                    <input
                      type="date"
                      value={formData.licenseExpiry || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, licenseExpiry: e.target.value }))}
                      className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800"
                      required
                    />
          </div>
        </div>
        
            <div>
                  <label className="block text-sm font-medium mb-2">Statut</label>
                  <select
                    value={formData.status || 'available'}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Driver['status'] }))}
                    className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800"
                  >
                    <option value="available">Disponible</option>
                    <option value="on_mission">En mission</option>
                    <option value="on_leave">En congé</option>
                    <option value="suspended">Suspendu</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-auto border-2"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto shadow-lg border-2 border-transparent hover:border-primary/20"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingDriver ? 'Mettre à jour' : 'Ajouter'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal for View Details */}
      {viewingDriver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-300 dark:border-gray-600 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Détails du chauffeur</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewingDriver(null)}
                  className="border-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold">
                    {viewingDriver.firstName} {viewingDriver.lastName}
                  </h4>
                  {getStatusBadge(viewingDriver.status)}
      </div>

                <div className="grid grid-cols-1 gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium text-muted-foreground">Email</div>
                    <div className="text-sm">{viewingDriver.email}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium text-muted-foreground">Téléphone</div>
                    <div className="text-sm">{viewingDriver.phone}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium text-muted-foreground">Permis</div>
                    <div className="text-sm font-mono">{viewingDriver.licenseNumber}</div>
                    <div className="text-xs text-muted-foreground">
                      Expire le {new Date(viewingDriver.licenseExpiry).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium text-muted-foreground">Embauché le</div>
                    <div className="text-sm">{new Date(viewingDriver.hireDate).toLocaleDateString()}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Missions</div>
                      <div className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                        {viewingDriver.totalMissions}
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Note</div>
                      <div className="text-xl font-semibold text-yellow-900 dark:text-yellow-100">
                        {viewingDriver.rating}★
                      </div>
                    </div>
                  </div>
                  {viewingDriver.currentVehicle && (
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-sm font-medium text-green-700 dark:text-green-300">Véhicule actuel</div>
                      <div className="text-sm font-mono text-green-900 dark:text-green-100">
                        {viewingDriver.currentVehicle}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
