'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Truck, 
  Users, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function DashboardPage() {
  const stats = [
    {
      title: "Véhicules actifs",
      value: "24",
      change: "+2",
      icon: Truck,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Missions en cours",
      value: "12",
      change: "+5",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "Chauffeurs",
      value: "18",
      change: "0",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      title: "Alertes",
      value: "3",
      change: "-1",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Tableau de bord" 
        subtitle="Vue d&apos;ensemble de votre flotte"
      />
      
      <div className="p-6">
        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          {/* Welcome Section */}
          <motion.div variants={fadeInUp}>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Bienvenue sur FleetPro ! 🚛
            </h1>
            <p className="text-muted-foreground">
              Testez le magnifique bouton de changement de mode dans le header ! 
              Cliquez sur l&apos;icône soleil/lune en haut à droite.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-border/50 hover:border-border transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <p className="text-2xl font-bold text-foreground">
                            {stat.value}
                          </p>
                          <Badge 
                            variant={stat.change.startsWith('+') ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {stat.change}
                          </Badge>
                        </div>
                      </div>
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Demo Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Header Premium</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Bouton de mode avec animations fluides</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Effets de glow et dégradés</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Transitions spring ultra stylées</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Design responsive et moderne</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>Fonctionnalités</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Barre de recherche intelligente</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Notifications avec badges animés</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Menu utilisateur avec dropdown</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Menu mobile responsive</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div variants={fadeInUp}>
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    🎉 Header Ultra Stylé Restauré !
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Le bouton de changement de mode est maintenant ultra stylé avec des animations 
                    fluides, des effets de glow et des transitions spring !
                  </p>
                  <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    Testez le bouton soleil/lune ! ☀️🌙
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 