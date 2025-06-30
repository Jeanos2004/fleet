'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { ModalForm } from '@/components/crud/modal-form'
import { DataTable } from '@/components/crud/data-table'
import { 
  Plus, 
  Truck, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Download,
  Fuel,
  MapPin,
  CheckCircle,
  Settings,
  AlertTriangle
} from 'lucide-react'

// Types pour les véhicules
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
  lastMaintenance: Date
  nextMaintenance: Date
  driver?: string
  location: string
  fuelLevel: number
  createdAt: Date
}

// Données mockées
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
    lastMaintenance: new Date('2024-02-15'),
    nextMaintenance: new Date('2024-05-15'),
    driver: 'Pierre Martin',
    location: 'Paris, 75001',
    fuelLevel: 85,
    createdAt: new Date('2021-03-15')
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
    lastMaintenance: new Date('2024-01-20'),
    nextMaintenance: new Date('2024-04-20'),
    location: 'Lyon, 69001',
    fuelLevel: 72,
    createdAt: new Date('2020-07-20')
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
    lastMaintenance: new Date('2024-03-01'),
    nextMaintenance: new Date('2024-06-01'),
    driver: 'Marie Dubois',
    location: 'Atelier Central',
    fuelLevel: 15,
    createdAt: new Date('2019-11-10')
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
    lastMaintenance: new Date('2024-02-28'),
    nextMaintenance: new Date('2024-08-28'),
    location: 'Marseille, 13001',
    fuelLevel: 92,
    createdAt: new Date('2023-01-15')
  }
]

const statusLabels = {
  disponible: 'Disponible',
  en_mission: 'En mission',
  maintenance: 'Maintenance',
  hors_service: 'Hors service'
}

const statusColors = {
  disponible: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  en_mission: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  maintenance: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  hors_service: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

const typeLabels = {
  citerne: 'Citerne',
  camion: 'Camion',
  fourgon: 'Fourgon'
}

const fuelTypeLabels = {
  diesel: 'Diesel',
  essence: 'Essence',
  electrique: 'Électrique'
}

export default function VehiclesCrudPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Filtrage des véhicules
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = `${vehicle.plateNumber} ${vehicle.brand} ${vehicle.model} ${vehicle.driver || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  // Statistiques
  const stats = {
    total: vehicles.length,
    disponible: vehicles.filter(v => v.status === 'disponible').length,
    en_mission: vehicles.filter(v => v.status === 'en_mission').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
    avgFuelLevel: Math.round(vehicles.reduce((sum, v) => sum + v.fuelLevel, 0) / vehicles.length)
  }

  // Configuration des colonnes pour le tableau
  const columns = [
    {
      key: 'vehicle',
      label: 'Véhicule',
      render: (vehicle: Vehicle) => (
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            vehicle.status === 'disponible' ? 'bg-green-500/10' : 
            vehicle.status === 'en_mission' ? 'bg-blue-500/10' :
            vehicle.status === 'maintenance' ? 'bg-orange-500/10' : 'bg-red-500/10'
          }`}>
            <Truck className={`h-5 w-5 ${
              vehicle.status === 'disponible' ? 'text-green-500' : 
              vehicle.status === 'en_mission' ? 'text-blue-500' :
              vehicle.status === 'maintenance' ? 'text-orange-500' : 'text-red-500'
            }`} />
          </div>
          <div>
            <div className="font-semibold text-card-foreground">
              {vehicle.plateNumber}
            </div>
            <div className="text-sm text-muted-foreground">
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (vehicle: Vehicle) => (
        <div>
          <div className="text-sm font-medium">{typeLabels[vehicle.type]}</div>
          <div className="text-xs text-muted-foreground">
            {vehicle.capacity.toLocaleString()} L
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      render: (vehicle: Vehicle) => (
        <Badge className={`${statusColors[vehicle.status]} border-0`}>
          {statusLabels[vehicle.status]}
        </Badge>
      )
    },
    {
      key: 'driver',
      label: 'Chauffeur',
      render: (vehicle: Vehicle) => (
        <div className="text-sm">
          {vehicle.driver ? (
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              {vehicle.driver}
            </div>
          ) : (
            <span className="text-muted-foreground">Non assigné</span>
          )}
        </div>
      )
    },
    {
      key: 'location',
      label: 'Localisation',
      render: (vehicle: Vehicle) => (
        <div className="flex items-center gap-1 text-sm">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          {vehicle.location}
        </div>
      )
    },
    {
      key: 'fuel',
      label: 'Carburant',
      render: (vehicle: Vehicle) => (
        <div>
          <div className="flex items-center gap-1 text-sm">
            <Fuel className="h-3 w-3 text-muted-foreground" />
            {vehicle.fuelLevel}%
          </div>
          <div className="text-xs text-muted-foreground">
            {fuelTypeLabels[vehicle.fuelType]}
          </div>
        </div>
      )
    },
    {
      key: 'maintenance',
      label: 'Prochaine maintenance',
      render: (vehicle: Vehicle) => {
        const daysUntilMaintenance = Math.ceil((vehicle.nextMaintenance.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        const isUrgent = daysUntilMaintenance <= 7
        return (
          <div>
            <div className={`text-sm flex items-center gap-1 ${isUrgent ? 'text-red-600' : ''}`}>
              {isUrgent && <AlertTriangle className="h-3 w-3" />}
              {vehicle.nextMaintenance.toLocaleDateString('fr-FR')}
            </div>
            <div className="text-xs text-muted-foreground">
              {daysUntilMaintenance > 0 ? `Dans ${daysUntilMaintenance} jours` : 'En retard'}
            </div>
          </div>
        )
      }
    }
  ]

  // Configuration du formulaire
  const formFields = [
    {
      name: 'plateNumber',
      label: 'Plaque d\'immatriculation',
      type: 'text' as const,
      required: true,
      placeholder: 'TC-001-FR'
    },
    {
      name: 'brand',
      label: 'Marque',
      type: 'text' as const,
      required: true,
      placeholder: 'Mercedes, Volvo, Scania...'
    },
    {
      name: 'model',
      label: 'Modèle',
      type: 'text' as const,
      required: true,
      placeholder: 'Actros 2545'
    },
    {
      name: 'year',
      label: 'Année',
      type: 'number' as const,
      required: true,
      min: 1990,
      max: new Date().getFullYear() + 1
    },
    {
      name: 'type',
      label: 'Type de véhicule',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'citerne', label: 'Citerne' },
        { value: 'camion', label: 'Camion' },
        { value: 'fourgon', label: 'Fourgon' }
      ]
    },
    {
      name: 'capacity',
      label: 'Capacité (litres)',
      type: 'number' as const,
      required: true,
      min: 1000,
      max: 50000,
      step: 1000
    },
    {
      name: 'fuelType',
      label: 'Type de carburant',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'diesel', label: 'Diesel' },
        { value: 'essence', label: 'Essence' },
        { value: 'electrique', label: 'Électrique' }
      ]
    },
    {
      name: 'status',
      label: 'Statut',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'disponible', label: 'Disponible' },
        { value: 'en_mission', label: 'En mission' },
        { value: 'maintenance', label: 'Maintenance' },
        { value: 'hors_service', label: 'Hors service' }
      ]
    },
    {
      name: 'mileage',
      label: 'Kilométrage',
      type: 'number' as const,
      required: true,
      min: 0
    },
    {
      name: 'location',
      label: 'Localisation',
      type: 'text' as const,
      required: true,
      placeholder: 'Paris, 75001'
    },
    {
      name: 'fuelLevel',
      label: 'Niveau de carburant (%)',
      type: 'number' as const,
      required: true,
      min: 0,
      max: 100
    },
    {
      name: 'driver',
      label: 'Chauffeur assigné',
      type: 'text' as const,
      placeholder: 'Nom du chauffeur (optionnel)'
    }
  ]

  // Actions CRUD
  const handleCreate = (data: any) => {
    const newVehicle: Vehicle = {
      id: (vehicles.length + 1).toString(),
      ...data,
      lastMaintenance: new Date(),
      nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 mois
      createdAt: new Date()
    }
    setVehicles([...vehicles, newVehicle])
    setIsFormOpen(false)
    toast({
      title: "Véhicule créé",
      description: `${data.plateNumber} a été ajouté avec succès.`
    })
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setIsFormOpen(true)
  }

  const handleUpdate = (data: any) => {
    if (editingVehicle) {
      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...v, ...data } : v))
      setIsFormOpen(false)
      setEditingVehicle(null)
      toast({
        title: "Véhicule modifié",
        description: `${data.plateNumber} a été mis à jour.`
      })
    }
  }

  const handleDelete = (vehicle: Vehicle) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le véhicule ${vehicle.plateNumber} ?`)) {
      setVehicles(vehicles.filter(v => v.id !== vehicle.id))
      toast({
        title: "Véhicule supprimé",
        description: `${vehicle.plateNumber} a été supprimé.`,
        variant: "destructive"
      })
    }
  }

  const handleView = (vehicle: Vehicle) => {
    toast({
      title: "Voir le véhicule",
      description: `Ouverture des détails de ${vehicle.plateNumber}`
    })
  }

  const actions = [
    {
      label: 'Voir',
      icon: Eye,
      onClick: handleView,
      variant: 'ghost' as const
    },
    {
      label: 'Modifier',
      icon: Edit,
      onClick: handleEdit,
      variant: 'ghost' as const
    },
    {
      label: 'Supprimer',
      icon: Trash2,
      onClick: handleDelete,
      variant: 'ghost' as const,
      className: 'text-red-600 hover:text-red-700'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-border pb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Truck className="h-8 w-8 text-primary" />
                Gestion des Véhicules CRUD
              </h1>
              <p className="text-muted-foreground mt-2">
                Interface complète de gestion des véhicules avec opérations CRUD
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Nouveau Véhicule
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-card-foreground">{stats.total}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Disponibles</p>
                <p className="text-2xl font-bold text-green-600">{stats.disponible}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En mission</p>
                <p className="text-2xl font-bold text-blue-600">{stats.en_mission}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Maintenance</p>
                <p className="text-2xl font-bold text-orange-600">{stats.maintenance}</p>
              </div>
              <Settings className="h-8 w-8 text-orange-500" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Carburant moy.</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgFuelLevel}%</p>
              </div>
              <Fuel className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
        </motion.div>

        {/* Filtres et recherche */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        >
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher par plaque, marque, modèle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-80 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
            >
              <option value="all">Tous les statuts</option>
              <option value="disponible">Disponible</option>
              <option value="en_mission">En mission</option>
              <option value="maintenance">Maintenance</option>
              <option value="hors_service">Hors service</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
            >
              <option value="all">Tous les types</option>
              <option value="citerne">Citerne</option>
              <option value="camion">Camion</option>
              <option value="fourgon">Fourgon</option>
            </select>
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredVehicles.length} véhicule(s) trouvé(s)
          </div>
        </motion.div>

        {/* Tableau des véhicules */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DataTable
            data={filteredVehicles}
            columns={columns}
            actions={actions}
            emptyMessage="Aucun véhicule trouvé"
          />
        </motion.div>

        {/* Modal formulaire */}
        <ModalForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false)
            setEditingVehicle(null)
          }}
          title={editingVehicle ? 'Modifier le véhicule' : 'Nouveau véhicule'}
          fields={formFields}
          onSubmit={editingVehicle ? handleUpdate : handleCreate}
          initialData={editingVehicle ? editingVehicle : undefined}
        />
      </div>
    </div>
  )
}
