"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ViewToggle, useViewMode, AdaptiveContainer } from '@/components/ui/view-toggle'
import { MissionItem } from '@/components/missions/mission-item'
import { useDemoAuth, ProtectedComponent } from '@/components/providers/demo-auth-provider'
import { MissionsStatusChart, MissionsDistanceChart, MissionsPriorityChart } from '@/components/charts/missions-chart'
import { MapPin, Clock, Truck, User, Plus, Filter, Search, Calendar, Route, Fuel } from 'lucide-react'

interface Mission {
  id: string
  title: string
  type: string
  vehicleId: string
  vehiclePlate: string
  driverId: string
  driverName: string
  origin: string
  destination: string
  dateDebut: string | Date
  dateFin?: string | Date
  statut: 'planifiee' | 'en_cours' | 'terminee' | 'annulee'
  distance: number
  quantite?: number
  cargo: string
  priority: 'low' | 'medium' | 'high'
  urgente?: boolean
  client?: string
}

const mockMissions: Mission[] = [
  {
    id: '1',
    title: 'Livraison carburant Paris - Lyon',
    type: 'diesel',
    vehicleId: 'v1',
    vehiclePlate: 'TC-001-FR',
    driverId: 'd1',
    driverName: 'Pierre Martin',
    origin: 'Paris, 75001',
    destination: 'Lyon, 69001',
    dateDebut: '2024-03-16T08:00:00',
    dateFin: '2024-03-16T18:00:00',
    statut: 'en_cours',
    distance: 465,
    quantite: 35000,
    cargo: 'Diesel 35000L',
    priority: 'high',
    urgente: true,
    client: 'Station Total Lyon'
  },
  {
    id: '2',
    title: 'Transport essence Marseille - Nice',
    type: 'essence',
    vehicleId: 'v2',
    vehiclePlate: 'TC-002-FR',
    driverId: 'd2',
    driverName: 'Marie Dubois',
    origin: 'Marseille, 13001',
    destination: 'Nice, 06000',
    dateDebut: '2024-03-17T06:00:00',
    dateFin: '2024-03-17T12:00:00',
    statut: 'planifiee',
    distance: 205,
    quantite: 28000,
    cargo: 'Essence 28000L',
    priority: 'medium',
    urgente: false,
    client: 'Station BP Nice'
  },
  {
    id: '3',
    title: 'Livraison GPL Toulouse - Bordeaux',
    type: 'gaz',
    vehicleId: 'v3',
    vehiclePlate: 'TC-003-FR',
    driverId: 'd3',
    driverName: 'Jean Dupont',
    origin: 'Toulouse, 31000',
    destination: 'Bordeaux, 33000',
    dateDebut: '2024-03-15T14:00:00',
    dateFin: '2024-03-15T22:00:00',
    statut: 'terminee',
    distance: 245,
    quantite: 22000,
    cargo: 'GPL 22000L',
    priority: 'low',
    urgente: false,
    client: 'Station Shell Bordeaux'
  },
  {
    id: '4',
    title: 'Transport urgent diesel Paris - Lille',
    type: 'diesel',
    vehicleId: 'v4',
    vehiclePlate: 'TC-004-FR',
    driverId: 'd4',
    driverName: 'Sophie Bernard',
    origin: 'Paris, 75001',
    destination: 'Lille, 59000',
    dateDebut: '2024-03-18T05:00:00',
    dateFin: '2024-03-18T11:00:00',
    statut: 'planifiee',
    distance: 225,
    quantite: 40000,
    cargo: 'Diesel 40000L',
    priority: 'high',
    urgente: true,
    client: 'Dépôt Auchan Lille'
  },
  {
    id: '5',
    title: 'Retour à vide Strasbourg',
    type: '',
    vehicleId: 'v5',
    vehiclePlate: 'TC-005-FR',
    driverId: 'd5',
    driverName: 'Antoine Leroy',
    origin: 'Strasbourg, 67000',
    destination: 'Paris, 75001',
    dateDebut: '2024-03-16T16:00:00',
    dateFin: '2024-03-17T01:00:00',
    statut: 'en_cours',
    distance: 489,
    quantite: 0,
    cargo: 'Retour à vide',
    priority: 'low',
    urgente: false,
    client: ''
  }
]

export default function MissionsPage() {
  const { hasPermission } = useDemoAuth()
  const [missions] = useState<Mission[]>(mockMissions)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const { viewMode, setViewMode } = useViewMode('card')

  const filteredMissions = missions.filter(mission => {
    const statusMatch = statusFilter === 'all' || mission.statut === statusFilter
    const priorityMatch = priorityFilter === 'all' || mission.priority === priorityFilter
    const searchMatch = mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       mission.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       mission.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       mission.driverName.toLowerCase().includes(searchTerm.toLowerCase())
    return statusMatch && priorityMatch && searchMatch
  })

  const missionStats = {
    total: missions.length,
    enCours: missions.filter(m => m.statut === 'en_cours').length,
    planifiee: missions.filter(m => m.statut === 'planifiee').length,
    terminee: missions.filter(m => m.statut === 'terminee').length,
    urgentes: missions.filter(m => m.urgente).length,
    totalDistance: missions.reduce((sum, m) => sum + m.distance, 0),
    totalQuantite: missions.reduce((sum, m) => sum + (m.quantite || 0), 0)
  }

  // Handlers pour les actions
  const handleEdit = (mission: Mission) => {
    console.log('Modifier mission:', mission)
    // Ici on ouvrirait un modal ou une page d'édition
  }

  const handleView = (mission: Mission) => {
    console.log('Voir mission:', mission)
    // Ici on ouvrirait un modal ou une page de détails
  }

  const handleStart = (mission: Mission) => {
    console.log('Démarrer mission:', mission)
    // Ici on démarrerait la mission
  }

  const handleAdd = () => {
    console.log('Ajouter mission')
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
            <h1 className="text-3xl font-bold tracking-tight">Gestion des Missions</h1>
            <p className="text-muted-foreground">
              Planifiez, suivez et gérez toutes vos missions de livraison de carburant
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ViewToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              showGrid={true}
            />
            <ProtectedComponent resource="missions" action="create">
              <Button onClick={handleAdd} className="gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle mission
              </Button>
            </ProtectedComponent>
          </div>
        </div>
      </motion.div>

      {/* Statistiques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{missionStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">En cours</p>
                <p className="text-2xl font-bold text-foreground">{missionStats.enCours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Planifiées</p>
                <p className="text-2xl font-bold text-foreground">{missionStats.planifiee}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Terminées</p>
                <p className="text-2xl font-bold text-foreground">{missionStats.terminee}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Urgentes</p>
                <p className="text-2xl font-bold text-foreground">{missionStats.urgentes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Route className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Distance</p>
                <p className="text-2xl font-bold text-foreground">{missionStats.totalDistance.toLocaleString()}km</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Fuel className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Volume</p>
                <p className="text-2xl font-bold text-foreground">{(missionStats.totalQuantite / 1000).toFixed(0)}kL</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <MissionsStatusChart missions={missions} />
        <MissionsDistanceChart missions={missions} />
        <MissionsPriorityChart missions={missions} />
      </motion.div>

      {/* Filtres et recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="flex flex-col lg:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par titre, destination, véhicule ou chauffeur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">Statut:</span>
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              Tous
            </Button>
            <Button
              variant={statusFilter === 'planifiee' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('planifiee')}
            >
              Planifiées
            </Button>
            <Button
              variant={statusFilter === 'en_cours' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('en_cours')}
            >
              En cours
            </Button>
            <Button
              variant={statusFilter === 'terminee' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('terminee')}
            >
              Terminées
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">Priorité:</span>
            <Button
              variant={priorityFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPriorityFilter('all')}
            >
              Toutes
            </Button>
            <Button
              variant={priorityFilter === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPriorityFilter('high')}
            >
              Haute
            </Button>
            <Button
              variant={priorityFilter === 'medium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPriorityFilter('medium')}
            >
              Moyenne
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Liste des missions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        {filteredMissions.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Aucune mission trouvée
            </h3>
            <p className="text-sm text-muted-foreground">
              Essayez de modifier vos critères de recherche ou de créer une nouvelle mission.
            </p>
          </div>
        ) : (
          <AdaptiveContainer viewMode={viewMode}>
            {filteredMissions.map((mission, index) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <MissionItem
                  mission={mission}
                  viewMode={viewMode}
                  onEdit={handleEdit}
                  onView={handleView}
                  onStart={handleStart}
                />
              </motion.div>
            ))}
          </AdaptiveContainer>
        )}
      </motion.div>
    </div>
  )
} 

