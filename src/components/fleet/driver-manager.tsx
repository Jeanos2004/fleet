'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { usePermissions } from '@/hooks/use-permissions'
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
  Plus
} from 'lucide-react'
import { Button } from '../ui/button'

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
  const { hasPermission } = usePermissions()
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)

  const getStatusBadge = (status: Driver['status']) => {
    const statusConfig = {
      available: { label: 'Disponible', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
      on_mission: { label: 'En mission', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      on_leave: { label: 'En congé', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
      suspended: { label: 'Suspendu', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }
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

  const _columns = [
    {
      key: 'firstName' as keyof Driver,
      label: 'Chauffeur',
      sortable: true,
      render: (value: string, driver: Driver) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{driver.firstName} {driver.lastName}</div>
            <div className="text-xs text-muted-foreground flex items-center space-x-1">
              <Mail className="h-3 w-3" />
              <span>{driver.email}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'status' as keyof Driver,
      label: 'Statut',
      sortable: true,
      render: (value: Driver['status']) => getStatusBadge(value)
    },
    {
      key: 'licenseNumber' as keyof Driver,
      label: 'Permis',
      render: (value: string, driver: Driver) => (
        <div className="space-y-1">
          <div className="font-mono text-sm">{value}</div>
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
      )
    },
    {
      key: 'totalMissions' as keyof Driver,
      label: 'Missions',
      sortable: true,
      render: (value: number) => (
        <div className="text-center">
          <div className="font-semibold">{value}</div>
          <div className="text-xs text-muted-foreground">total</div>
        </div>
      )
    },
    {
      key: 'rating' as keyof Driver,
      label: 'Évaluation',
      sortable: true,
      render: (value: number) => getRatingStars(value)
    },
    {
      key: 'currentVehicle' as keyof Driver,
      label: 'Véhicule',
      render: (value: string | undefined) => (
        value ? (
          <div className="flex items-center space-x-1">
            <Car className="h-3 w-3 text-blue-500" />
            <span className="text-sm font-mono">{value}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Non assigné</span>
        )
      )
    }
  ]

  const _formFields = [
    {
      name: 'firstName',
      label: 'Prénom',
      type: 'text' as const,
      required: true,
      placeholder: 'Pierre'
    },
    {
      name: 'lastName',
      label: 'Nom',
      type: 'text' as const,
      required: true,
      placeholder: 'Martin'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      required: true,
      placeholder: 'pierre.martin@fleet.com'
    },
    {
      name: 'phone',
      label: 'Téléphone',
      type: 'text' as const,
      required: true,
      placeholder: '+33 6 12 34 56 78'
    },
    {
      name: 'licenseNumber',
      label: 'Numéro de permis',
      type: 'text' as const,
      required: true,
      placeholder: 'A123456789'
    },
    {
      name: 'licenseExpiry',
      label: 'Expiration du permis',
      type: 'date' as const,
      required: true
    },
    {
      name: 'status',
      label: 'Statut',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'available', label: 'Disponible' },
        { value: 'on_leave', label: 'En congé' },
        { value: 'suspended', label: 'Suspendu' }
      ]
    },
    {
      name: 'hireDate',
      label: 'Date d\'embauche',
      type: 'date' as const,
      required: true
    }
  ]

  const handleAdd = () => {
    setEditingDriver(null)
    setIsModalOpen(true)
  }

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver)
    setIsModalOpen(true)
  }

  const handleDelete = async (driver: Driver) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${driver.firstName} ${driver.lastName} ?`)) {
      setDrivers(prev => prev.filter(d => d.id !== driver.id))
    }
  }

  const _handleSubmit = async (data: Record<string, unknown>) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingDriver) {
      setDrivers(prev => prev.map(d => 
        d.id === editingDriver.id 
          ? { ...d, ...data }
          : d
      ))
    } else {
      const newDriver: Driver = {
        id: Date.now().toString(),
        firstName: data.firstName as string,
        lastName: data.lastName as string,
        email: data.email as string,
        phone: data.phone as string,
        licenseNumber: data.licenseNumber as string,
        licenseExpiry: data.licenseExpiry as string,
        status: data.status as 'available' | 'on_mission' | 'on_leave' | 'suspended',
        hireDate: data.hireDate as string,
        totalMissions: 0,
        rating: 5.0
      }
      setDrivers(prev => [...prev, newDriver])
    }
  }

  if (!hasPermission('FLEET_VIEW')) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Accès non autorisé</p>
      </div>
    )
  }

  const expiringSoonCount = drivers.filter(d => isLicenseExpiringSoon(d.licenseExpiry)).length

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total chauffeurs</p>
              <p className="text-2xl font-bold">{drivers.length}</p>
            </div>
            <User className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Disponibles</p>
              <p className="text-2xl font-bold text-green-600">
                {drivers.filter(d => d.status === 'available').length}
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
                {drivers.filter(d => d.status === 'on_mission').length}
              </p>
            </div>
            <Car className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Permis expirant</p>
              <p className="text-2xl font-bold text-orange-600">{expiringSoonCount}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Alerts */}
      {expiringSoonCount > 0 && (
        <div className="alert-warning p-4 rounded-xl">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <p className="font-medium">Attention: Permis expirant bientôt</p>
              <p className="text-sm">{expiringSoonCount} chauffeur{expiringSoonCount > 1 ? 's ont' : ' a'} leur permis qui expire dans moins de 30 jours.</p>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="card-hover rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">Gestion des Chauffeurs</h2>
            <p className="text-muted-foreground">Gérez votre équipe de chauffeurs et suivez leurs performances</p>
          </div>
          {hasPermission('FLEET_MANAGE') && (
            <Button onClick={handleAdd} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Nom</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Email</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Téléphone</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Statut</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Permis</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Note</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id} className="border-b border-border hover:bg-muted/50">
                  <td className="p-3">
                    <div>
                      <p className="font-medium text-card-foreground">{driver.firstName} {driver.lastName}</p>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{driver.email}</td>
                  <td className="p-3 text-sm text-muted-foreground">{driver.phone}</td>
                  <td className="p-3">{getStatusBadge(driver.status)}</td>
                  <td className="p-3">
                    <div className="text-sm">
                      <p className="text-card-foreground">{driver.licenseNumber}</p>
                      <p className={`text-xs ${isLicenseExpiringSoon(driver.licenseExpiry) ? 'text-red-500' : 'text-muted-foreground'}`}>
                        Exp: {driver.licenseExpiry}
                      </p>
                    </div>
                  </td>
                  <td className="p-3">{getRatingStars(driver.rating)}</td>
                  <td className="p-3">
                    {hasPermission('FLEET_MANAGE') && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(driver)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(driver)} className="text-red-600">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form - Simple placeholder for now */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              {editingDriver ? 'Modifier le chauffeur' : 'Ajouter un chauffeur'}
            </h3>
            <p className="text-muted-foreground mb-4">Fonctionnalité en cours de développement</p>
            <Button onClick={() => setIsModalOpen(false)}>Fermer</Button>
          </div>
        </div>
      )}
    </div>
  )
} 
