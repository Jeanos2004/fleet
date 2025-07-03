"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ViewToggle, useViewMode, AdaptiveContainer, ListItem, CardItem } from '@/components/ui/view-toggle'
import { MaintenanceTypeChart, MaintenanceCostChart, MaintenanceDistributionChart, MaintenanceOverviewChart, MaintenanceReliabilityChart } from '@/components/charts/maintenance-charts'
import { 
  Wrench, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  DollarSign,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Settings,
  CheckCircle,
  Car
} from 'lucide-react'

interface MaintenanceRecord {
  id: string
  vehicleId: string
  vehiclePlate: string
  type: 'preventive' | 'corrective' | 'emergency'
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  description: string
  scheduledDate: string
  completedDate?: string
  cost: number
  technician: string
  priority: 'low' | 'medium' | 'high'
  estimatedDuration: number
}

const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: '1',
    vehicleId: 'v1',
    vehiclePlate: 'AB-123-CD',
    type: 'preventive',
    status: 'scheduled',
    description: 'Révision générale 15 000 km',
    scheduledDate: '2024-03-20',
    cost: 1200,
    technician: 'Michel Durand',
    priority: 'medium',
    estimatedDuration: 4
  },
  {
    id: '2',
    vehicleId: 'v2',
    vehiclePlate: 'EF-456-GH',
    type: 'corrective',
    status: 'in_progress',
    description: 'Réparation système de freinage',
    scheduledDate: '2024-03-18',
    cost: 850,
    technician: 'Pierre Martin',
    priority: 'high',
    estimatedDuration: 6
  },
  {
    id: '3',
    vehicleId: 'v3',
    vehiclePlate: 'IJ-789-KL',
    type: 'emergency',
    status: 'completed',
    description: 'Panne moteur - Remplacement turbo',
    scheduledDate: '2024-03-15',
    completedDate: '2024-03-16',
    cost: 2500,
    technician: 'Jean Leblanc',
    priority: 'high',
    estimatedDuration: 8
  },
  {
    id: '4',
    vehicleId: 'v4',
    vehiclePlate: 'MN-012-OP',
    type: 'preventive',
    status: 'scheduled',
    description: 'Changement d\'huile et filtres',
    scheduledDate: '2024-03-22',
    cost: 300,
    technician: 'Sophie Bernard',
    priority: 'low',
    estimatedDuration: 2
  },
  {
    id: '5',
    vehicleId: 'v5',
    vehiclePlate: 'QR-345-ST',
    type: 'corrective',
    status: 'completed',
    description: 'Réparation système électrique',
    scheduledDate: '2024-03-12',
    completedDate: '2024-03-13',
    cost: 650,
    technician: 'Antoine Leroy',
    priority: 'medium',
    estimatedDuration: 5
  }
]

export default function MaintenancePage() {
  const { viewMode, setViewMode } = useViewMode('card')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [records] = useState<MaintenanceRecord[]>(mockMaintenanceRecords)

  // Filtrer les enregistrements
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.technician.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter
    const matchesType = typeFilter === 'all' || record.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  // Calculer les statistiques
  const stats = {
    total: records.length,
    scheduled: records.filter(r => r.status === 'scheduled').length,
    inProgress: records.filter(r => r.status === 'in_progress').length,
    completed: records.filter(r => r.status === 'completed').length,
    totalCost: records.reduce((sum, r) => sum + r.cost, 0),
    avgCost: records.length > 0 ? records.reduce((sum, r) => sum + r.cost, 0) / records.length : 0,
    preventive: records.filter(r => r.type === 'preventive').length,
    corrective: records.filter(r => r.type === 'corrective').length
  }

  // Fonctions utilitaires
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'preventive': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
      case 'corrective': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800'
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
      case 'in_progress': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  // Composant pour afficher un enregistrement de maintenance
  const MaintenanceRecordItem = ({ record }: { record: MaintenanceRecord }) => {
    if (viewMode === 'list') {
      return (
        <ListItem>
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{record.vehiclePlate}</p>
                <p className="text-sm text-muted-foreground">{record.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className={`${getTypeColor(record.type)} border text-xs`}>
                {record.type === 'preventive' ? 'Préventive' : 
                 record.type === 'corrective' ? 'Corrective' : 'Urgence'}
              </Badge>
              <Badge className={`${getStatusColor(record.status)} border text-xs`}>
                {record.status === 'scheduled' ? 'Planifiée' :
                 record.status === 'in_progress' ? 'En cours' :
                 record.status === 'completed' ? 'Terminée' : 'Annulée'}
              </Badge>
              <Badge className={getPriorityColor(record.priority)}>
                {record.priority === 'high' ? 'Haute' :
                 record.priority === 'medium' ? 'Moyenne' : 'Basse'}
              </Badge>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(record.scheduledDate).toLocaleDateString('fr-FR')}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {record.cost.toLocaleString()}€
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {record.estimatedDuration}h
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </ListItem>
      )
    }

    return (
      <CardItem>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{record.vehiclePlate}</h3>
              {viewMode !== 'card' && (
                <p className="text-sm text-muted-foreground">{record.technician}</p>
              )}
            </div>
          </div>
          
          <Badge className={`${getStatusColor(record.status)} border`}>
            {record.status === 'scheduled' ? 'Planifiée' :
             record.status === 'in_progress' ? 'En cours' :
             record.status === 'completed' ? 'Terminée' : 'Annulée'}
          </Badge>
        </div>

        {viewMode !== 'card' && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">{record.description}</p>
            <div className="flex items-center gap-2">
              <Badge className={`${getTypeColor(record.type)} border text-xs`}>
                {record.type === 'preventive' ? 'Préventive' : 
                 record.type === 'corrective' ? 'Corrective' : 'Urgence'}
              </Badge>
              <Badge className={getPriorityColor(record.priority)}>
                {record.priority === 'high' ? 'Haute' :
                 record.priority === 'medium' ? 'Moyenne' : 'Basse'}
              </Badge>
            </div>
          </div>
        )}

        {viewMode !== 'card' && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Date prévue</span>
              <span className="font-medium">{new Date(record.scheduledDate).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Coût</span>
              <span className="font-medium">{record.cost.toLocaleString()}€</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Durée estimée</span>
              <span className="font-medium">{record.estimatedDuration}h</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Button variant="outline" size="sm" className="flex-1">
            <Settings className="h-4 w-4 mr-2" />
            {viewMode === 'card' ? '' : 'Gérer'}
          </Button>
        </div>
      </CardItem>
    )
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
            <h1 className="text-3xl font-bold tracking-tight">Gestion de la Maintenance</h1>
            <p className="text-muted-foreground">
              Planifiez et suivez toutes les interventions de maintenance de votre flotte
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ViewToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}

            />
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Planifier maintenance
            </Button>
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
              <Wrench className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.scheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">En cours</p>
                <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Terminées</p>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Coût total</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalCost.toLocaleString()}€</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Coût moyen</p>
                <p className="text-2xl font-bold text-foreground">{Math.round(stats.avgCost).toLocaleString()}€</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-teal-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Ratio P/C</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.corrective > 0 ? (stats.preventive / stats.corrective).toFixed(1) : '∞'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Graphiques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        <MaintenanceTypeChart />
        <MaintenanceCostChart />
        <MaintenanceDistributionChart />
        {/* <MaintenanceOverviewChart />
        <MaintenanceReliabilityChart /> */}
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
            placeholder="Rechercher par description, véhicule ou technicien..."
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
              variant={statusFilter === 'scheduled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('scheduled')}
            >
              Planifiées
            </Button>
            <Button
              variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('in_progress')}
            >
              En cours
            </Button>
            <Button
              variant={statusFilter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('completed')}
            >
              Terminées
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">Type:</span>
            <Button
              variant={typeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('all')}
            >
              Tous
            </Button>
            <Button
              variant={typeFilter === 'preventive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('preventive')}
            >
              Préventive
            </Button>
            <Button
              variant={typeFilter === 'corrective' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('corrective')}
            >
              Corrective
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Liste des maintenances */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Aucune maintenance trouvée
            </h3>
            <p className="text-sm text-muted-foreground">
              Essayez de modifier vos critères de recherche ou de planifier une nouvelle maintenance.
            </p>
          </div>
        ) : (
          <AdaptiveContainer viewMode={viewMode}>
            {filteredRecords.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <MaintenanceRecordItem record={record} />
              </motion.div>
            ))}
          </AdaptiveContainer>
        )}
      </motion.div>
    </div>
  )
} 

