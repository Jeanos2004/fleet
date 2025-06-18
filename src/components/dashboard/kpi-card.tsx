import { Badge } from '@/components/ui/badge'
import { KPI } from '@/types'

interface KPICardProps {
  kpi: KPI
}

export function KPICard({ kpi }: KPICardProps) {
  const getIconColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-500'
      case 'down':
        return 'text-red-500'
      default:
        return 'text-muted-foreground'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l10-10M17 7v10M17 7H7" />
          </svg>
        )
      case 'down':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17l-10-10M7 7v10M7 7h10" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        )
    }
  }

  return (
    <div className="stat-card group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-2xl font-bold text-card-foreground">{kpi.value}</span>
              {kpi.unit && (
                <span className="text-sm text-muted-foreground">{kpi.unit}</span>
              )}
            </div>
          </div>
        </div>
        
        {kpi.trend && (
          <div className={`flex items-center space-x-1 ${getIconColor(kpi.trend)}`}>
            {getTrendIcon(kpi.trend)}
            {kpi.change && (
              <span className="text-sm font-medium">{kpi.change}</span>
            )}
          </div>
        )}
      </div>

      {kpi.description && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{kpi.description}</p>
          {kpi.status && (
            <Badge 
              variant={kpi.status === 'good' ? 'default' : kpi.status === 'warning' ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {kpi.status === 'good' ? 'Bon' : kpi.status === 'warning' ? 'Attention' : 'Critique'}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
} 