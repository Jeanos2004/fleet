'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { ViewToggle, useViewMode } from '../ui/view-toggle'
import { useDemoAuth } from '@/components/providers/demo-auth-provider'
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
  const { hasPermission, isDriver } = useDemoAuth()
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
  const [viewingDriver, setViewingDriver] = useState<Driver | null>(null)
  const [formData, setFormData] = useState<Partial<Driver>>({})
  const { viewMode, setViewMode, isCardView, isListView } = useViewMode('card')

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
        <div className="flex items-center gap-4">
          <ViewToggle 
            viewMode={viewMode} 
            onViewModeChange={setViewMode}
          />
          {hasPermission('drivers', 'create') && (
            <Button onClick={handleAdd} className="w-full sm:w-auto shadow-sm hover:shadow-md">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un chauffeur
            </Button>
          )}
        </div>
      </div>

      {/* Drivers Display */}
      {isCardView ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => (
            <Card key={driver.id} className="bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center border border-blue-200 dark:border-blue-700">
                    <User className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-card-foreground truncate">
                      {driver.firstName} {driver.lastName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground truncate">
                      {driver.email}
                    </p>
                  </div>
                </div>
                {getStatusBadge(driver.status)}
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
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Véhicule assigné</span>
                    </div>
                    <div className="text-sm font-mono text-blue-900 dark:text-blue-100 mt-1">
                      {driver.currentVehicle}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(driver)}
                    className="flex-1 hover:bg-muted"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Voir
                  </Button>
                  {hasPermission('drivers', 'update') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(driver)}
                      className="flex-1 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Modifier
                    </Button>
                  )}
                  {hasPermission('drivers', 'delete') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(driver)}
                      className="flex-1 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Suppr.
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Liste des Chauffeurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-3 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
                <div className="col-span-3">Chauffeur</div>
                <div className="col-span-2">Contact</div>
                <div className="col-span-2">Permis</div>
                <div className="col-span-2">Statut</div>
                <div className="col-span-2">Performance</div>
                <div className="col-span-1">Actions</div>
              </div>
              
              {/* Table Rows */}
              {drivers.map((driver) => (
                <div key={driver.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  {/* Driver Info */}
                  <div className="col-span-12 md:col-span-3">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-blue-600" />
                      <h3 className="font-medium text-foreground">{driver.firstName} {driver.lastName}</h3>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Embauché: {new Date(driver.hireDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Contact */}
                  <div className="col-span-12 md:col-span-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Mail className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-muted-foreground truncate">{driver.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-muted-foreground">{driver.phone}</span>
                    </div>
                  </div>
                  
                  {/* License */}
                  <div className="col-span-12 md:col-span-2">
                    <div className="text-xs font-mono mb-1">{driver.licenseNumber}</div>
                    <div className={`text-xs flex items-center gap-1 ${
                      isLicenseExpiringSoon(driver.licenseExpiry) ? 'text-red-600' : 'text-muted-foreground'
                    }`}>
                      <Calendar className="h-3 w-3" />
                      {new Date(driver.licenseExpiry).toLocaleDateString()}
                      {isLicenseExpiringSoon(driver.licenseExpiry) && (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="col-span-12 md:col-span-2">
                    {getStatusBadge(driver.status)}
                    {driver.currentVehicle && (
                      <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                        <Car className="h-3 w-3" />
                        {driver.currentVehicle}
                      </div>
                    )}
                  </div>
                  
                  {/* Performance */}
                  <div className="col-span-12 md:col-span-2">
                    <div className="text-sm font-medium">{driver.totalMissions} missions</div>
                    <div className="text-xs text-yellow-600">★ {driver.rating}</div>
                  </div>
                  
                  {/* Actions */}
                  <div className="col-span-12 md:col-span-1">
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => handleView(driver)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      {hasPermission('drivers', 'update') && (
                        <Button variant="outline" size="sm" onClick={() => handleEdit(driver)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                      {hasPermission('drivers', 'delete') && (
                        <Button variant="outline" size="sm" onClick={() => handleDelete(driver)} className="text-red-600">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-card-foreground">
                  {editingDriver ? 'Modifier le chauffeur' : 'Ajouter un chauffeur'}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Prénom</label>
                    <input
                      type="text"
                      value={formData.firstName || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Nom</label>
                    <input
                      type="text"
                      value={formData.lastName || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Numéro de permis</label>
                    <input
                      type="text"
                      value={formData.licenseNumber || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Date d&apos;expiration du permis</label>
                    <input
                      type="date"
                      value={formData.licenseExpiry || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, licenseExpiry: e.target.value }))}
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Statut</label>
                    <select
                      value={formData.status || 'available'}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Driver['status'] }))}
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                    >
                      <option value="available">Disponible</option>
                      <option value="on_mission">En mission</option>
                      <option value="on_leave">En congé</option>
                      <option value="suspended">Suspendu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Date d&apos;embauche</label>
                    <input
                      type="date"
                      value={formData.hireDate || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, hireDate: e.target.value }))}
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-border">
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingDriver ? 'Modifier' : 'Ajouter'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1"
                  >
                    Annuler
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
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-card-foreground">
                  Détails du chauffeur {viewingDriver.firstName} {viewingDriver.lastName}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewingDriver(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-card-foreground mb-2">Informations personnelles</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-muted-foreground">Nom complet:</span> {viewingDriver.firstName} {viewingDriver.lastName}</div>
                      <div><span className="text-muted-foreground">Email:</span> {viewingDriver.email}</div>
                      <div><span className="text-muted-foreground">Téléphone:</span> {viewingDriver.phone}</div>
                      <div><span className="text-muted-foreground">Date d&apos;embauche:</span> {new Date(viewingDriver.hireDate).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-card-foreground mb-2">Statut actuel</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Statut:</span> 
                        {getStatusBadge(viewingDriver.status)}
                      </div>
                      <div><span className="text-muted-foreground">Permis:</span> {viewingDriver.licenseNumber}</div>
                      <div><span className="text-muted-foreground">Expiration:</span> {new Date(viewingDriver.licenseExpiry).toLocaleDateString()}</div>
                      {viewingDriver.currentVehicle && (
                        <div><span className="text-muted-foreground">Véhicule:</span> {viewingDriver.currentVehicle}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Performance */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-card-foreground mb-2">Performance</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Missions totales</div>
                      <div className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                        {viewingDriver.totalMissions}
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Note moyenne</div>
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
