"use client"

import { KPICard } from '@/components/dashboard/kpi-card'
import { DeliveryChart } from '@/components/charts/delivery-chart'
import { FleetMap } from '@/components/dashboard/fleet-map'
import { mockKPIs } from '@/lib/db/mock-data'
import { useRolePermissions, ProtectedComponent } from '@/hooks/use-role-permissions'

export default function DashboardPage() {
  const { userRole, isDriver, isTechnician, isFinance } = useRolePermissions()

  // Filtrer les KPIs selon le rôle
  const getFilteredKPIs = () => {
    if (isDriver) {
      return mockKPIs.filter(kpi => 
        kpi.title.includes('Mission') || 
        kpi.title.includes('Véhicule') ||
        kpi.title.includes('Carburant')
      )
    }
    if (isTechnician) {
      return mockKPIs.filter(kpi => 
        kpi.title.includes('Maintenance') || 
        kpi.title.includes('Véhicule') ||
        kpi.title.includes('Alerte')
      )
    }
    if (isFinance) {
      return mockKPIs.filter(kpi => 
        kpi.title.includes('Coût') || 
        kpi.title.includes('Revenus') ||
        kpi.title.includes('Carburant')
      )
    }
    return mockKPIs
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                Dashboard {userRole !== 'guest' && `- ${userRole}`}
              </h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                Vue d&apos;ensemble de votre flotte de camions-citernes
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-green-50 dark:bg-green-950 px-3 py-2 rounded-lg border border-green-200 dark:border-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Système opérationnel</span>
            </div>
          </div>
        </div>

        {/* KPIs Grid - Responsif et filtré selon le rôle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {getFilteredKPIs().map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi} />
          ))}
        </div>

        {/* Charts and Map Grid - Responsif */}
        <ProtectedComponent resource="reports" action="read">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="card-hover rounded-xl p-4 sm:p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
              <DeliveryChart />
            </div>
            <div className="card-hover rounded-xl p-4 sm:p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
              <FleetMap />
            </div>
          </div>
        </ProtectedComponent>

        {/* Additional Stats with improved design and role-based filtering */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <ProtectedComponent resource="missions" action="read">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">
                  Missions aujourd&apos;hui
                </h3>
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground text-sm">Planifiées</span>
                  <span className="font-semibold text-foreground bg-background px-3 py-1 rounded-full text-sm border border-border">8</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground text-sm">En cours</span>
                  <span className="font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm border border-primary/20">3</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground text-sm">Terminées</span>
                  <span className="font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full text-sm border border-green-200 dark:border-green-800">12</span>
                </div>
              </div>
            </div>
          </ProtectedComponent>

          <ProtectedComponent resource="vehicles" action="read">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">
                  État de la flotte
                </h3>
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground text-sm">Disponibles</span>
                  <span className="font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full text-sm border border-green-200 dark:border-green-800">15</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground text-sm">En mission</span>
                  <span className="font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm border border-primary/20">8</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground text-sm">En maintenance</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full text-sm border border-orange-200 dark:border-orange-800">2</span>
                </div>
              </div>
            </div>
          </ProtectedComponent>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Alertes &amp; Notifications
              </h3>
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <ProtectedComponent resource="maintenance" action="read">
                <div className="p-3 rounded-lg bg-muted/50 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Maintenance due</span>
                    <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full border border-orange-200 dark:border-orange-800">2</span>
                  </div>
                </div>
              </ProtectedComponent>
              <div className="p-3 rounded-lg bg-muted/50 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Retard livraison</span>
                  <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full border border-red-200 dark:border-red-800">1</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Nouveau message</span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full border border-primary/30">5</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section spécifique selon le rôle */}
        {isDriver && (
          <div className="mt-8 p-6 bg-card border border-border rounded-xl">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              🚛 Espace Chauffeur
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Prochaine mission</p>
                <p className="font-semibold text-foreground">14:30 - Livraison Paris</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Véhicule assigné</p>
                <p className="font-semibold text-foreground">TC-001 - Mercedes</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Heures ce mois</p>
                <p className="font-semibold text-foreground">152h / 160h</p>
              </div>
            </div>
          </div>
        )}

        {isTechnician && (
          <div className="mt-8 p-6 bg-card border border-border rounded-xl">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              🔧 Espace Technicien
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Interventions en attente</p>
                <p className="font-semibold text-foreground">3 véhicules</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Maintenance préventive</p>
                <p className="font-semibold text-foreground">2 prévues</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Pièces en stock</p>
                <p className="font-semibold text-foreground">85%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 