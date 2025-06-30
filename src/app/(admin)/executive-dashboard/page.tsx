'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Truck, 
  MapPin, 
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Fuel,
  Settings,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Données mockées pour le dashboard executif
const executiveData = {
  kpis: [
    {
      id: 'revenue',
      title: 'Revenus mensuels',
      value: '€1,234,567',
      change: '+12.5%',
      trend: 'up' as const,
      description: 'vs mois précédent',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: 'deliveries',
      title: 'Livraisons effectuées',
      value: '2,847',
      change: '+8.3%',
      trend: 'up' as const,
      description: 'ce mois',
      icon: CheckCircle,
      color: 'text-blue-600'
    },
    {
      id: 'fleet_utilization',
      title: 'Utilisation flotte',
      value: '87.4%',
      change: '-2.1%',
      trend: 'down' as const,
      description: 'taux d\'utilisation',
      icon: Truck,
      color: 'text-orange-600'
    },
    {
      id: 'fuel_efficiency',
      title: 'Efficacité carburant',
      value: '6.8L/100km',
      change: '-5.2%',
      trend: 'up' as const,
      description: 'amélioration',
      icon: Fuel,
      color: 'text-purple-600'
    },
    {
      id: 'driver_satisfaction',
      title: 'Satisfaction chauffeurs',
      value: '4.6/5',
      change: '+0.3',
      trend: 'up' as const,
      description: 'note moyenne',
      icon: Users,
      color: 'text-indigo-600'
    },
    {
      id: 'maintenance_cost',
      title: 'Coûts maintenance',
      value: '€45,230',
      change: '-15.7%',
      trend: 'up' as const,
      description: 'réduction ce mois',
      icon: Settings,
      color: 'text-teal-600'
    }
  ],
  fleetStatus: {
    total: 45,
    available: 28,
    in_mission: 12,
    maintenance: 3,
    out_of_service: 2
  },
  recentAlerts: [
    {
      id: '1',
      type: 'maintenance',
      title: 'Maintenance programmée',
      description: 'Véhicule TC-015 - Révision 10,000km',
      time: 'Il y a 15 minutes',
      priority: 'medium',
      status: 'pending'
    },
    {
      id: '2',
      type: 'fuel',
      title: 'Niveau carburant critique',
      description: 'Véhicule TC-023 - Niveau < 10%',
      time: 'Il y a 32 minutes',
      priority: 'high',
      status: 'urgent'
    },
    {
      id: '3',
      type: 'delivery',
      title: 'Livraison en retard',
      description: 'Mission #1847 - Retard estimé 25min',
      time: 'Il y a 1 heure',
      priority: 'medium',
      status: 'in_progress'
    }
  ],
  topPerformers: [
    {
      id: '1',
      name: 'Pierre Martin',
      role: 'Chauffeur Senior',
      metric: '98.5%',
      description: 'Taux de livraison à temps',
      avatar: 'PM'
    },
    {
      id: '2',
      name: 'Marie Dubois',
      role: 'Responsable Maintenance',
      metric: '€12,450',
      description: 'Économies réalisées',
      avatar: 'MD'
    },
    {
      id: '3',
      name: 'Jean Dupont',
      role: 'Coordinateur Transport',
      metric: '47',
      description: 'Missions optimisées',
      avatar: 'JD'
    }
  ]
}

export default function ExecutiveDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulation d'actualisation des données
    setTimeout(() => setRefreshing(false), 2000)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800'
      case 'medium': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'bg-red-500'
      case 'pending': return 'bg-orange-500'
      case 'in_progress': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-border pb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-primary" />
                Dashboard Exécutif
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Vue d&apos;ensemble stratégique de l&apos;activité transport
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="90d">90 derniers jours</option>
                <option value="1y">1 année</option>
              </select>
              
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              
              <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>
        </motion.div>

        {/* KPIs Grid */}
        <motion.div 
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
        >
          {executiveData.kpis.map((kpi) => {
            const IconComponent = kpi.icon
            return (
              <motion.div key={kpi.id} variants={fadeInUp}>
                <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${kpi.color} bg-opacity-10`}>
                        <IconComponent className={`h-6 w-6 ${kpi.color}`} />
                      </div>
                      <div className="flex items-center gap-1">
                        {kpi.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {kpi.change}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-2xl font-bold text-card-foreground mb-1">
                        {kpi.value}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {kpi.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {kpi.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Fleet Status et Alertes */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Fleet Status */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                État de la Flotte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Disponibles</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {executiveData.fleetStatus.available}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">En mission</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {executiveData.fleetStatus.in_mission}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-medium">Maintenance</span>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">
                    {executiveData.fleetStatus.maintenance}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium">Hors service</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">
                    {executiveData.fleetStatus.out_of_service}
                  </span>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-3xl font-bold text-primary">
                      {executiveData.fleetStatus.total}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alertes récentes */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Alertes Récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {executiveData.recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer">
                    <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(alert.status)}`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-card-foreground truncate">
                          {alert.title}
                        </h4>
                        <Badge className={`text-xs ${getPriorityColor(alert.priority)}`}>
                          {alert.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {alert.description}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {alert.time}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full mt-4">
                  Voir toutes les alertes
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Performers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-500" />
                Top Performers du Mois
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {executiveData.topPerformers.map((performer, index) => (
                  <div key={performer.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {performer.avatar}
                        </span>
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-xs">🏆</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-card-foreground truncate">
                        {performer.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {performer.role}
                      </p>
                      <div className="mt-2">
                        <span className="text-lg font-bold text-primary">
                          {performer.metric}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {performer.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions rapides */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5">
            <PieChart className="h-6 w-6 text-primary" />
            <span className="text-sm">Rapports Détaillés</span>
          </Button>
          
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="text-sm">Suivi Temps Réel</span>
          </Button>
          
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="text-sm">Planification</span>
          </Button>
          
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5">
            <Settings className="h-6 w-6 text-primary" />
            <span className="text-sm">Configuration</span>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
