'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Truck,
  Users,
  MapPin,
  Fuel,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface MetricData {
  label: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  trendValue: number
  icon: React.ElementType
  color: string
  description: string
}

interface RealTimeMetricsProps {
  className?: string
}

export function RealTimeMetrics({ className = '' }: RealTimeMetricsProps) {
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  
  // Simulation de données en temps réel
  useEffect(() => {
    const generateMetrics = (): MetricData[] => {
      const baseMetrics = [
        {
          label: 'Véhicules actifs',
          value: Math.floor(Math.random() * 5) + 12, // 12-17
          unit: '',
          icon: Truck,
          color: 'text-blue-600',
          description: 'Véhicules en mission'
        },
        {
          label: 'Chauffeurs disponibles',
          value: Math.floor(Math.random() * 3) + 8, // 8-11
          unit: '',
          icon: Users,
          color: 'text-green-600',
          description: 'Chauffeurs prêts à partir'
        },
        {
          label: 'Missions en cours',
          value: Math.floor(Math.random() * 4) + 15, // 15-19
          unit: '',
          icon: MapPin,
          color: 'text-purple-600',
          description: 'Livraisons en cours'
        },
        {
          label: 'Consommation carburant',
          value: Math.floor(Math.random() * 50) + 450, // 450-500
          unit: 'L/h',
          icon: Fuel,
          color: 'text-orange-600',
          description: 'Consommation moyenne'
        },
        {
          label: 'Revenus du jour',
          value: Math.floor(Math.random() * 5000) + 25000, // 25000-30000
          unit: '€',
          icon: DollarSign,
          color: 'text-emerald-600',
          description: 'Chiffre d\'affaires journalier'
        },
        {
          label: 'Temps moyen livraison',
          value: Math.floor(Math.random() * 30) + 120, // 120-150
          unit: 'min',
          icon: Clock,
          color: 'text-indigo-600',
          description: 'Durée moyenne des missions'
        }
      ]
      
      // Ajouter les tendances
      return baseMetrics.map(metric => {
        const trendValue = (Math.random() - 0.5) * 20 // -10% à +10%
        const trend = trendValue > 2 ? 'up' : trendValue < -2 ? 'down' : 'stable'
        
        return {
          ...metric,
          trend,
          trendValue: Math.abs(trendValue)
        }
      })
    }
    
    // Générer les métriques initiales
    setMetrics(generateMetrics())
    setIsLoading(false)
    
    // Mettre à jour toutes les 5 secondes
    const interval = setInterval(() => {
      setMetrics(generateMetrics())
      setLastUpdate(new Date())
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Obtenir l'icône de tendance
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp
      case 'down': return TrendingDown
      default: return Minus
    }
  }
  
  // Obtenir la couleur de tendance
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }
  
  // Formater la valeur
  const formatValue = (value: number, unit: string) => {
    if (unit === '€') {
      return `${value.toLocaleString('fr-FR')}€`
    }
    if (value >= 1000 && unit === '') {
      return `${(value / 1000).toFixed(1)}k`
    }
    return `${value}${unit ? ` ${unit}` : ''}`
  }
  
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  
  return (
    <div className={className}>
      {/* Header avec dernière mise à jour */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Métriques en temps réel</h2>
          <p className="text-muted-foreground">
            Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">En direct</span>
        </div>
      </div>
      
      {/* Grille des métriques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          const TrendIcon = getTrendIcon(metric.trend)
          
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-muted/50`}>
                      <Icon className={`h-5 w-5 ${metric.color}`} />
                    </div>
                    <Badge 
                      variant={metric.trend === 'up' ? 'default' : metric.trend === 'down' ? 'destructive' : 'secondary'}
                      className="flex items-center gap-1"
                    >
                      <TrendIcon className="h-3 w-3" />
                      {metric.trend !== 'stable' && `${metric.trendValue.toFixed(1)}%`}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="text-3xl font-bold">
                      {formatValue(metric.value, metric.unit)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                  </div>
                  
                  {/* Indicateur de changement */}
                  {metric.trend !== 'stable' && (
                    <div className={`mt-3 text-xs ${getTrendColor(metric.trend)}`}>
                      {metric.trend === 'up' ? '↗' : '↘'} 
                      {metric.trendValue.toFixed(1)}% par rapport à hier
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
      
      {/* Alertes rapides */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Attention requise
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-300">
                  3 véhicules nécessitent une maintenance dans les 7 prochains jours
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Performances optimales
                </p>
                <p className="text-xs text-green-600 dark:text-green-300">
                  Tous les chauffeurs respectent les temps de livraison
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 