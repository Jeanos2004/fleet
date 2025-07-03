"use client"

import { Suspense } from 'react'
import { KPICard } from '@/components/dashboard/kpi-card'
import { DeliveryChart } from '@/components/charts/delivery-chart'
import { FleetMap } from '@/components/dashboard/fleet-map'
import { PerformanceChart } from '@/components/charts/performance-chart'
import { FuelConsumptionChart } from '@/components/charts/fuel-consumption-chart'
import { useDemoAuth } from '@/components/providers/demo-auth-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { KPI } from '@/types'
import { 
  Truck, 
  Users, 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Fuel,
  DollarSign,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Eye,
  Settings,
  Bell,
  Target,
  Zap,
  ShieldCheck,
  Plus
} from 'lucide-react'

export default function DashboardPage() {
  const { user, isDriver, isTechnician, isFinance, isAdmin, isTransportManager } = useDemoAuth()
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Données KPI principales
  const mainKpis: KPI[] = [
    {
      id: '1',
      title: 'Véhicules actifs',
      value: '24',
      unit: 'véhicules',
      change: '+2',
      trend: 'up',
      status: 'good',
      description: 'Véhicules disponibles pour missions'
    },
    {
      id: '2',
      title: 'Missions en cours',
      value: '12',
      unit: 'missions',
      change: '-1',
      trend: 'down',
      status: 'warning',
      description: 'Missions actuellement en cours'
    },
    {
      id: '3',
      title: 'Chauffeurs disponibles',
      value: '18',
      unit: 'chauffeurs',
      change: '+3',
      trend: 'up',
      status: 'good',
      description: 'Chauffeurs prêts pour nouvelles missions'
    },
    {
      id: '4',
      title: 'Alertes critiques',
      value: '3',
      unit: 'alertes',
      change: '0',
      trend: 'stable',
      status: 'error',
      description: 'Alertes nécessitant attention immédiate'
    }
  ]

  // KPIs financiers
  const financialKpis: KPI[] = [
    {
      id: '5',
      title: 'Chiffre d\'affaires',
      value: '€45,230',
      change: '+12%',
      trend: 'up',
      status: 'good',
      description: 'Revenus du mois en cours'
    },
    {
      id: '6',
      title: 'Coûts opérationnels',
      value: '€28,450',
      change: '-5%',
      trend: 'up',
      status: 'good',
      description: 'Économies réalisées ce mois'
    },
    {
      id: '7',
      title: 'Marge bénéficiaire',
      value: '37%',
      change: '+3%',
      trend: 'up',
      status: 'good',
      description: 'Marge nette calculée'
    },
    {
      id: '8',
      title: 'ROI Flotte',
      value: '23%',
      change: '+1%',
      trend: 'up',
      status: 'good',
      description: 'Retour sur investissement'
    }
  ]

  // Données pour les graphiques
  const recentMissions = [
    { id: 1, destination: 'Paris-Lyon', chauffeur: 'Jean Martin', statut: 'En cours', progress: 65 },
    { id: 2, destination: 'Marseille-Nice', chauffeur: 'Marie Dubois', statut: 'Terminée', progress: 100 },
    { id: 3, destination: 'Bordeaux-Toulouse', chauffeur: 'Pierre Durand', statut: 'Planifiée', progress: 0 },
    { id: 4, destination: 'Lille-Strasbourg', chauffeur: 'Sophie Martin', statut: 'En cours', progress: 45 }
  ]

  const alertes = [
    { type: 'maintenance', message: 'Véhicule TC-001 maintenance programmée dans 2 jours', priority: 'high' },
    { type: 'fuel', message: 'Niveau carburant faible sur véhicule TC-003', priority: 'medium' },
    { type: 'delay', message: 'Mission Paris-Lyon retardée de 30 minutes', priority: 'low' },
    { type: 'document', message: 'Permis chauffeur expire dans 15 jours', priority: 'high' }
  ]

  const vehicleStats = [
    { status: 'Disponible', count: 15, color: 'bg-green-500' },
    { status: 'En mission', count: 9, color: 'bg-blue-500' },
    { status: 'Maintenance', count: 3, color: 'bg-orange-500' },
    { status: 'Hors service', count: 1, color: 'bg-red-500' }
  ]

  const performanceData = [
    { metric: 'Taux de livraison', value: 98.5, target: 95, unit: '%' },
    { metric: 'Temps moyen trajet', value: 4.2, target: 4.5, unit: 'h' },
    { metric: 'Consommation moyenne', value: 28.5, target: 30, unit: 'L/100km' },
    { metric: 'Satisfaction client', value: 4.7, target: 4.5, unit: '/5' }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-8">
        {/* En-tête avec actions */}
        <div className="flex items-center justify-between border-b pb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Tableau de Bord
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Vue d&apos;ensemble de votre flotte - {user.firstName} {user.lastName}
              <Badge className="ml-3 bg-primary/10 text-primary border-primary/20">
                {user.role}
              </Badge>
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
            <Button className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Paramètres
            </Button>
          </div>
        </div>

        {/* KPIs Principaux */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            Indicateurs Clés
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainKpis.map((kpi) => (
              <KPICard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        </section>

        {/* Vue par rôle spécialisée */}
        {isDriver && (
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Truck className="h-6 w-6 text-blue-500" />
              Mon Espace Chauffeur
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Mes missions aujourd&apos;hui</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Paris → Lyon</h4>
                        <p className="text-sm text-muted-foreground">Départ: 08:00 - Arrivée prévue: 12:30</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Lyon → Marseille</h4>
                        <p className="text-sm text-muted-foreground">Départ: 14:00 - Arrivée prévue: 18:00</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Planifiée</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Véhicule assigné</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Truck className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                    <h3 className="font-semibold">TC-001-FR</h3>
                    <p className="text-sm text-muted-foreground">Mercedes Actros</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Carburant:</span>
                        <span className="font-semibold">85%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kilométrage:</span>
                        <span className="font-semibold">87,542 km</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Section Financière pour Finance */}
        {(isFinance || isAdmin) && (
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-green-500" />
              Performance Financière
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {financialKpis.map((kpi) => (
                <KPICard key={kpi.id} kpi={kpi} />
              ))}
            </div>
          </section>
        )}

        {/* Graphiques et Cartes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Graphique des livraisons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Évolution des Livraisons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-64 flex items-center justify-center">Chargement...</div>}>
                <DeliveryChart />
              </Suspense>
            </CardContent>
          </Card>

          {/* Carte de la flotte */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Position de la Flotte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-64 flex items-center justify-center">Chargement de la carte...</div>}>
                <FleetMap />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Missions récentes et Alertes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Missions récentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Missions Récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMissions.map((mission) => (
                  <div key={mission.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold">{mission.destination}</h4>
                      <p className="text-sm text-muted-foreground">Chauffeur: {mission.chauffeur}</p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Progression</span>
                          <span>{mission.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              mission.progress === 100 ? 'bg-green-500' : 
                              mission.progress > 0 ? 'bg-blue-500' : 'bg-muted-foreground'
                            }`}
                            style={{ width: `${mission.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={mission.statut === 'Terminée' ? 'default' : 
                              mission.statut === 'En cours' ? 'secondary' : 'outline'}
                    >
                      {mission.statut}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alertes et Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                Alertes & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alertes.map((alerte, index) => (
                  <div key={index} className={`text-white p-3 rounded-lg border-l-4 ${
                    alerte.priority === 'high' ? 'border-red-500 bg-red-350 dark:bg-red-700' :
                    alerte.priority === 'medium' ? 'border-orange-500 bg-orange-350 dark:bg-orange-600' :
                    'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  }`}>
                    <div className="flex items-start gap-3">
                      {alerte.type === 'maintenance' && <Settings className="h-5 w-5 text-orange-500 mt-0.5" />}
                      {alerte.type === 'fuel' && <Fuel className="h-5 w-5 text-red-500 mt-0.5" />}
                      {alerte.type === 'delay' && <Clock className="h-5 w-5 text-blue-500 mt-0.5" />}
                      {alerte.type === 'document' && <ShieldCheck className="h-5 w-5 text-orange-500 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alerte.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={
                            alerte.priority === 'high' ? 'destructive' :
                            alerte.priority === 'medium' ? 'secondary' : 'outline'
                          }>
                            {alerte.priority === 'high' ? 'Urgent' :
                             alerte.priority === 'medium' ? 'Moyen' : 'Info'}
                          </Badge>
                          <span className="text-xs text-gray-100 dark:text-muted-foreground">Il y a 2h</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques véhicules et Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Répartition des véhicules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Statut des Véhicules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vehicleStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${stat.color}`} />
                      <span className="font-medium">{stat.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{stat.count}</span>
                      <span className="text-sm text-muted-foreground">véhicules</span>
                    </div>
                  </div>
                ))}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span>Taux de disponibilité</span>
                    <span className="font-semibold text-green-600">85.7%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Indicateurs de performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Indicateurs de Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {performanceData.map((perf, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{perf.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{perf.value}{perf.unit}</span>
                        {perf.value >= perf.target ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          perf.value >= perf.target ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((perf.value / perf.target) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Objectif: {perf.target}{perf.unit}</span>
                      <span>{Math.round((perf.value / perf.target) * 100)}% de l&apos;objectif</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Maintenance pour Techniciens */}
        {(isTechnician || isAdmin) && (
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Settings className="h-6 w-6 text-orange-500" />
              Maintenance & Interventions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Maintenance Programmée</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-orange-500">5</div>
                  <p className="text-sm text-muted-foreground">véhicules cette semaine</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Interventions d&apos;urgence</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-red-500">2</div>
                  <p className="text-sm text-muted-foreground">en attente</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Pièces en stock</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-green-500">87%</div>
                  <p className="text-sm text-muted-foreground">disponibilité</p>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Plus className="h-6 w-6" />
                <span className="text-xs">Nouvelle Mission</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Truck className="h-6 w-6" />
                <span className="text-xs">Ajouter Véhicule</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Users className="h-6 w-6" />
                <span className="text-xs">Nouveau Chauffeur</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Settings className="h-6 w-6" />
                <span className="text-xs">Maintenance</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <BarChart3 className="h-6 w-6" />
                <span className="text-xs">Rapport</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Eye className="h-6 w-6" />
                <span className="text-xs">Suivi Temps Réel</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 