'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ViewToggle, useViewMode, AdaptiveContainer } from '@/components/ui/view-toggle'
import { DriverItem } from './driver-item'
import { DriverPerformanceChart, DriverStatusChart, DriverRatingChart, DriverExperienceChart, DriverSkillsRadialChart } from '@/components/charts/driver-charts'
import { useDemoAuth } from '@/components/providers/demo-auth-provider'
import { 
  Plus, 
  Search, 
  Filter,
  Download,
  User, 
  Mail, 
  Calendar, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Car,
  Edit,
  Trash2,
  Phone,
  Save,
  X,
  Eye,
  Star
} from 'lucide-react'

interface Driver {
  id: string
  firstName: string
  lastName: string
  nom: string
  prenom: string
  email: string
  phone: string
  telephone: string
  licenseNumber: string
  licenseExpiry: string
  permis: string
  statut: 'disponible' | 'en_mission' | 'repos' | 'absent'
  hireDate: string
  dateEmbauche: string
  totalMissions: number
  rating: number
  currentVehicle?: string
  lastMission?: string
  experience?: number
}

// Données mockées pour les chauffeurs
const mockDrivers: Driver[] = [
  {
    id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@fleetmanager.com',
    phone: '06 12 34 56 78',
    telephone: '06 12 34 56 78',
    licenseNumber: 'C123456789',
    licenseExpiry: '2026-12-31',
    permis: 'C123456789',
    statut: 'disponible',
    hireDate: '2020-03-15',
    dateEmbauche: '2020-03-15',
    totalMissions: 142,
    rating: 4.8,
    currentVehicle: undefined,
    experience: 8
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Martin',
    nom: 'Martin',
    prenom: 'Marie',
    email: 'marie.martin@fleetmanager.com',
    phone: '06 23 45 67 89',
    telephone: '06 23 45 67 89',
    licenseNumber: 'C987654321',
    licenseExpiry: '2025-08-15',
    permis: 'C987654321',
    statut: 'en_mission',
    hireDate: '2019-07-10',
    dateEmbauche: '2019-07-10',
    totalMissions: 198,
    rating: 4.9,
    currentVehicle: 'EF-456-GH',
    experience: 12
  },
  {
    id: '3',
    firstName: 'Pierre',
    lastName: 'Durand',
    nom: 'Durand',
    prenom: 'Pierre',
    email: 'pierre.durand@fleetmanager.com',
    phone: '06 34 56 78 90',
    telephone: '06 34 56 78 90',
    licenseNumber: 'C456789123',
    licenseExpiry: '2027-03-20',
    permis: 'C456789123',
    statut: 'repos',
    hireDate: '2021-01-20',
    dateEmbauche: '2021-01-20',
    totalMissions: 89,
    rating: 4.6,
    currentVehicle: undefined,
    experience: 5
  },
  {
    id: '4',
    firstName: 'Sophie',
    lastName: 'Bernard',
    nom: 'Bernard',
    prenom: 'Sophie',
    email: 'sophie.bernard@fleetmanager.com',
    phone: '06 45 67 89 01',
    telephone: '06 45 67 89 01',
    licenseNumber: 'C789123456',
    licenseExpiry: '2026-11-10',
    permis: 'C789123456',
    statut: 'en_mission',
    hireDate: '2020-09-05',
    dateEmbauche: '2020-09-05',
    totalMissions: 156,
    rating: 4.7,
    currentVehicle: 'UV-678-WX',
    experience: 7
  },
  {
    id: '5',
    firstName: 'Antoine',
    lastName: 'Leroy',
    nom: 'Leroy',
    prenom: 'Antoine',
    email: 'antoine.leroy@fleetmanager.com',
    phone: '06 56 78 90 12',
    telephone: '06 56 78 90 12',
    licenseNumber: 'C321654987',
    licenseExpiry: '2024-06-30',
    permis: 'C321654987',
    statut: 'absent',
    hireDate: '2018-04-12',
    dateEmbauche: '2018-04-12',
    totalMissions: 267,
    rating: 4.5,
    currentVehicle: undefined,
    experience: 15
  }
]

export function DriverManager() {
  const { hasPermission } = useDemoAuth()
  const { viewMode, setViewMode } = useViewMode('card')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [drivers] = useState<Driver[]>(mockDrivers)

  // Filtrer les chauffeurs
  const filteredDrivers = drivers.filter(driver => {
    const fullName = `${driver.prenom} ${driver.nom}`.toLowerCase()
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.telephone.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || driver.statut === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculer les statistiques
  const stats = {
    total: drivers.length,
    disponible: drivers.filter(d => d.statut === 'disponible').length,
    en_mission: drivers.filter(d => d.statut === 'en_mission').length,
    repos: drivers.filter(d => d.statut === 'repos').length,
    absent: drivers.filter(d => d.statut === 'absent').length
  }

  // Chauffeurs nécessitant une attention
  const licenseExpiring = drivers.filter(d => {
    const expiryDate = new Date(d.licenseExpiry)
    const warningDate = new Date()
    warningDate.setMonth(warningDate.getMonth() + 3) // 3 mois
    return expiryDate <= warningDate
  })

  // Calculer la note moyenne
  const averageRating = drivers.reduce((sum, driver) => sum + driver.rating, 0) / drivers.length

  // Handlers pour les actions
  const handleEdit = (driver: Driver) => {
    console.log('Modifier chauffeur:', driver)
    // Ici on ouvrirait un modal ou une page d'édition
  }

  const handleView = (driver: Driver) => {
    console.log('Voir chauffeur:', driver)
    // Ici on ouvrirait un modal ou une page de détails
  }

  const handleAdd = () => {
    console.log('Ajouter chauffeur')
    // Ici on ouvrirait un modal ou une page d'ajout
  }

  return (
    <div className="space-y-8 m-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion des Chauffeurs</h1>
            <p className="text-muted-foreground">
              Gérez votre équipe de chauffeurs, leurs certifications et leurs performances
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ViewToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              showGrid={true}
            />
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un chauffeur
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Statistiques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4"
      >
        <div className="bg-background border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <User className="h-8 w-8 text-primary" />
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
            <Car className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-background border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Au repos</p>
              <p className="text-2xl font-bold text-orange-600">{stats.repos}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-background border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Absents</p>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-background border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Note moyenne</p>
              <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}/5</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </motion.div>

      {/* Alertes permis */}
      {licenseExpiring.length > 0 && (
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
                Permis à renouveler
              </h3>
              <p className="text-sm text-yellow-600 dark:text-yellow-300">
                {licenseExpiring.length} chauffeur(s) ont leur permis qui expire dans les 3 prochains mois
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
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        <DriverPerformanceChart drivers={drivers} />
        <DriverStatusChart drivers={drivers} />
        <DriverRatingChart drivers={drivers} />
        <DriverExperienceChart drivers={drivers} />
        <DriverSkillsRadialChart drivers={drivers} />
      </motion.div>

      {/* Filtres et recherche */}
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
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        
        <div className="flex items-center gap-2">
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
            variant={statusFilter === 'repos' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('repos')}
          >
            Au repos
          </Button>
        </div>
      </motion.div>

      {/* Liste des chauffeurs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        {filteredDrivers.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Aucun chauffeur trouvé
            </h3>
            <p className="text-sm text-muted-foreground">
              Essayez de modifier vos critères de recherche ou d'ajouter un nouveau chauffeur.
            </p>
          </div>
        ) : (
          <AdaptiveContainer viewMode={viewMode}>
            {filteredDrivers.map((driver, index) => (
              <motion.div
                key={driver.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <DriverItem
                  driver={driver}
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
