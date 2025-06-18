import { KPICard } from '@/components/dashboard/kpi-card'
import { DeliveryChart } from '@/components/charts/delivery-chart'
import { FleetMap } from '@/components/dashboard/fleet-map'
import { mockKPIs } from '@/lib/db/mock-data'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Vue d'ensemble de votre flotte de camions-citernes
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Système opérationnel</span>
            </div>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockKPIs.map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi} />
          ))}
        </div>

        {/* Charts and Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-hover rounded-xl p-6">
            <DeliveryChart />
          </div>
          <div className="card-hover rounded-xl p-6">
            <FleetMap />
          </div>
        </div>

        {/* Additional Stats with improved design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Missions aujourd'hui
              </h3>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Planifiées</span>
                <span className="font-semibold text-card-foreground bg-muted px-2 py-1 rounded-md">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">En cours</span>
                <span className="font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Terminées</span>
                <span className="font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-md">12</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                État de la flotte
              </h3>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Disponibles</span>
                <span className="font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-md">15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">En mission</span>
                <span className="font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">En maintenance</span>
                <span className="font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-md">2</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Alertes & Notifications
              </h3>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <div className="alert-warning p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Maintenance due</span>
                  <span className="text-xs bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-full">2</span>
                </div>
              </div>
              <div className="alert-error p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">Retard livraison</span>
                  <span className="text-xs bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">1</span>
                </div>
              </div>
              <div className="alert-card p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">Nouveau message</span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 