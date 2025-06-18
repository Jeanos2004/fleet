import { RealTimeDashboard } from '@/components/telemetry/real-time-dashboard'

export default function TelemetryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Télémétrie IoT</h1>
              <p className="text-muted-foreground mt-2">
                Surveillance en temps réel des camions-citernes
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Données temps réel</span>
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <RealTimeDashboard />
      </div>
    </div>
  )
} 