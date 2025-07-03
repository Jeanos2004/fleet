'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ViewToggle, useViewMode, AdaptiveContainer } from '@/components/ui/view-toggle'
import { VehicleItem } from './vehicle-item'
import { FleetStatusChart, FleetMileageChart, FleetCapacityChart, FleetAgeChart } from '@/components/charts/fleet-charts'
import { useDemoAuth } from '@/components/providers/demo-auth-provider'
import { 
  Plus, 
  Search, 
  Filter,
  Download,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar
} from 'lucide-react'

// Types pour les véhicules
// Interface Vehicle compatible avec UIVehicle
interface Vehicle {
  id: string
  immatriculation: string
  modele: string
  type?: string // Optionnel pour compatibilité
  statut: string
  capacite?: number
  kilometrage?: number
  derniereMaintenance?: string
  prochaineMaintenance?: string
  chauffeurId?: string | null
  annee?: number
}

// Données mockées pour les véhicules
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    immatriculation: 'AB-123-CD',
    modele: 'Volvo FH16',
    type: 'Citerne',
    statut: 'disponible',
    capacite: 35000,
    kilometrage: 125000,
    derniereMaintenance: '2024-02-15',
    prochaineMaintenance: '2024-04-15',
    chauffeurId: null,
    annee: 2020
  },
  {
    id: '2',
    immatriculation: 'EF-456-GH',
    modele: 'Mercedes Actros',
    type: 'Citerne',
    statut: 'en_mission',
    capacite: 40000,
    kilometrage: 98000,
    derniereMaintenance: '2024-01-20',
    prochaineMaintenance: '2024-03-20',
    chauffeurId: 'C1',
    annee: 2021
  },
  {
    id: '3',
    immatriculation: 'IJ-789-KL',
    modele: 'Scania R450',
    type: 'Citerne',
    statut: 'maintenance',
    capacite: 38000,
    kilometrage: 156000,
    derniereMaintenance: '2024-03-10',
    prochaineMaintenance: '2024-05-10',
    chauffeurId: null,
    annee: 2019
  },
  {
    id: '4',
    immatriculation: 'MN-012-OP',
    modele: 'Volvo FH',
    type: 'Citerne',
    statut: 'disponible',
    capacite: 32000,
    kilometrage: 87000,
    derniereMaintenance: '2024-02-28',
    prochaineMaintenance: '2024-04-28',
    chauffeurId: null,
    annee: 2022
  },
  {
    id: '5',
    immatriculation: 'QR-345-ST',
    modele: 'Mercedes Atego',
    type: 'Citerne',
    statut: 'panne',
    capacite: 25000,
    kilometrage: 203000,
    derniereMaintenance: '2024-01-15',
    prochaineMaintenance: '2024-03-15',
    chauffeurId: null,
    annee: 2018
  },
  {
    id: '6',
    immatriculation: 'UV-678-WX',
    modele: 'Iveco Stralis',
    type: 'Citerne',
    statut: 'en_mission',
    capacite: 36000,
    kilometrage: 142000,
    derniereMaintenance: '2024-02-05',
    prochaineMaintenance: '2024-04-05',
    chauffeurId: 'C2',
    annee: 2020
  }
]

export function VehicleManager() {
  const { hasPermission } = useDemoAuth()
  const { viewMode, setViewMode: setToggleViewMode } = useViewMode('card')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [vehicles] = useState<Vehicle[]>(mockVehicles)

  // Filtrer les véhicules
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.modele.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || vehicle.statut === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculer les statistiques
  const stats = {
    total: vehicles.length,
    disponible: vehicles.filter(v => v.statut === 'disponible').length,
    en_mission: vehicles.filter(v => v.statut === 'en_mission').length,
    maintenance: vehicles.filter(v => v.statut === 'maintenance').length,
    panne: vehicles.filter(v => v.statut === 'panne').length
  }

  // Véhicules nécessitant une attention
  const maintenanceDue = vehicles.filter(v => {
    if (!v.prochaineMaintenance) return false
    const nextMaintenance = new Date(v.prochaineMaintenance)
    const warningDate = new Date()
    warningDate.setDate(warningDate.getDate() + 14) // 14 jours
    return nextMaintenance <= warningDate
  })

  // Handlers pour les actions
  const handleEdit = (vehicle: Vehicle) => {
    console.log('Modifier véhicule:', vehicle)
    // Ici on ouvrirait un modal ou une page d'édition
  }

  const handleView = (vehicle: Vehicle) => {
    console.log('Voir véhicule:', vehicle)
    // Ici on ouvrirait un modal ou une page de détails
  }

  const handleAdd = () => {
    console.log('Ajouter véhicule')
    // Ici on ouvrirait un modal ou une page d'ajout
  }

  return (
    <div className="space-y-8 m-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion de la Flotte</h1>
            <p className="text-muted-foreground">
              Gérez vos véhicules, leur maintenance et leurs affectations
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un véhicule
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Statistiques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <div className="bg-background border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Truck className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="bg-background border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Disponibles</p>
              <p className="text-2xl font-bold text-green-600">{stats.disponible}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-background border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En mission</p>
              <p className="text-2xl font-bold text-blue-600">{stats.en_mission}</p>
            </div>
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-background border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Maintenance</p>
              <p className="text-2xl font-bold text-orange-600">{stats.maintenance}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-background border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En panne</p>
              <p className="text-2xl font-bold text-red-600">{stats.panne}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </motion.div>

      {/* Alertes maintenance */}
      {maintenanceDue.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                Maintenance requise
              </h3>
              <p className="text-sm text-yellow-600 dark:text-yellow-300">
                {maintenanceDue.length} véhicule(s) nécessitent une maintenance dans les 14 prochains jours
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <FleetStatusChart vehicles={vehicles as any} />
        <FleetMileageChart vehicles={vehicles as any} />
        <FleetCapacityChart vehicles={vehicles as any} />
        <FleetAgeChart vehicles={vehicles as any} />
      </motion.div>

      {/* Filtres et recherche avec ViewToggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par immatriculation ou modèle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <ViewToggle
            viewMode={viewMode}
            onViewModeChange={setToggleViewMode}
          />
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            Tous
          </Button>
          <Button
            variant={statusFilter === 'disponible' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('disponible')}
          >
            Disponibles
          </Button>
          <Button
            variant={statusFilter === 'en_mission' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('en_mission')}
          >
            En mission
          </Button>
          <Button
            variant={statusFilter === 'maintenance' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('maintenance')}
          >
            Maintenance
          </Button>
        </div>
      </motion.div>

      {/* Liste des véhicules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Aucun véhicule trouvé
            </h3>
            <p className="text-sm text-muted-foreground">
              Essayez de modifier vos critères de recherche ou d'ajouter un nouveau véhicule.
            </p>
          </div>
        ) : (
          <AdaptiveContainer viewMode={viewMode}>
            {filteredVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <VehicleItem
                  vehicle={vehicle}
                  viewMode={viewMode}
                  onEdit={handleEdit}
                  onView={handleView}
                />
              </motion.div>
            ))}
          </AdaptiveContainer>
        )}
      </motion.div>
    </div>
  )
}
