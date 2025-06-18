"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { auditLogger } from '@/lib/audit/audit-logger'
import { formatDate } from '@/lib/utils'
import { 
  Shield, 
  Filter, 
  Download, 
  Eye, 
  AlertTriangle,
  User,
  Activity,
  Clock,
  Search
} from 'lucide-react'

interface AuditLog {
  id: string
  timestamp: Date
  userId: string
  userEmail: string
  action: string
  resource: string
  resourceId?: string
  details: Record<string, any>
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

const severityColors = {
  LOW: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  MEDIUM: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

const resourceIcons = {
  AUTH: User,
  MISSION: Activity,
  CAMION: Activity,
  WORK_ORDER: Activity,
  USER: User,
  REPORT: Activity,
  SYSTEM: Activity,
  SECURITY: Shield
}

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [filters, setFilters] = useState({
    severity: '',
    resource: '',
    action: '',
    user: '',
    startDate: '',
    endDate: ''
  })
  const [stats, setStats] = useState<any>(null)
  const [showDetails, setShowDetails] = useState<string | null>(null)

  useEffect(() => {
    // Charger les logs
    const allLogs = auditLogger.getLogs({ limit: 500 })
    setLogs(allLogs)
    setFilteredLogs(allLogs)

    // Charger les statistiques
    const logStats = auditLogger.getLogStats()
    setStats(logStats)

    // Simuler quelques logs pour la démo
    if (allLogs.length === 0) {
      const mockLogs = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          userId: '1',
          userEmail: 'admin@fleetmanager.com',
          action: 'LOGIN_SUCCESS',
          resource: 'AUTH',
          details: { ipAddress: '192.168.1.100' },
          severity: 'LOW' as const
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          userId: '2',
          userEmail: 'transport@fleetmanager.com',
          action: 'MISSION_CREATE',
          resource: 'MISSION',
          resourceId: 'M-001',
          details: { missionType: 'UNIQUE', sites: 1 },
          severity: 'MEDIUM' as const
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          userId: '1',
          userEmail: 'admin@fleetmanager.com',
          action: 'USER_ROLE_CHANGE',
          resource: 'USER',
          resourceId: '3',
          details: { oldRole: 'DRIVER', newRole: 'TRANSPORT_MANAGER' },
          severity: 'CRITICAL' as const
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          userId: '4',
          userEmail: 'tech@fleetmanager.com',
          action: 'MAINTENANCE_APPROVE',
          resource: 'WORK_ORDER',
          resourceId: 'WO-001',
          details: { cost: 467.50, approved: true },
          severity: 'HIGH' as const
        }
      ]
      setLogs(mockLogs)
      setFilteredLogs(mockLogs)
    }
  }, [])

  useEffect(() => {
    // Appliquer les filtres
    let filtered = logs

    if (filters.severity) {
      filtered = filtered.filter(log => log.severity === filters.severity)
    }
    if (filters.resource) {
      filtered = filtered.filter(log => log.resource === filters.resource)
    }
    if (filters.action) {
      filtered = filtered.filter(log => log.action.toLowerCase().includes(filters.action.toLowerCase()))
    }
    if (filters.user) {
      filtered = filtered.filter(log => log.userEmail.toLowerCase().includes(filters.user.toLowerCase()))
    }
    if (filters.startDate) {
      filtered = filtered.filter(log => log.timestamp >= new Date(filters.startDate))
    }
    if (filters.endDate) {
      filtered = filtered.filter(log => log.timestamp <= new Date(filters.endDate))
    }

    setFilteredLogs(filtered)
  }, [filters, logs])

  const handleExport = () => {
    const csvData = auditLogger.exportLogs('CSV', filters)
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${formatDate(new Date()).replace(/\//g, '-')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearFilters = () => {
    setFilters({
      severity: '',
      resource: '',
      action: '',
      user: '',
      startDate: '',
      endDate: ''
    })
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.recentActivity} dernière heure
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critiques</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.bySeverity.CRITICAL}</div>
              <p className="text-xs text-muted-foreground">
                Actions critiques
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(stats.byUser).length}</div>
              <p className="text-xs text-muted-foreground">
                Utilisateurs avec activité
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ressources</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(stats.byResource).length}</div>
              <p className="text-xs text-muted-foreground">
                Types de ressources
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filtres
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Effacer
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-3 w-3 mr-1" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Sévérité</label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                className="w-full p-2 border border-border rounded bg-background text-foreground text-sm"
              >
                <option value="">Toutes</option>
                <option value="LOW">Faible</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="HIGH">Élevée</option>
                <option value="CRITICAL">Critique</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Ressource</label>
              <select
                value={filters.resource}
                onChange={(e) => setFilters(prev => ({ ...prev, resource: e.target.value }))}
                className="w-full p-2 border border-border rounded bg-background text-foreground text-sm"
              >
                <option value="">Toutes</option>
                <option value="AUTH">Authentification</option>
                <option value="MISSION">Mission</option>
                <option value="CAMION">Camion</option>
                <option value="WORK_ORDER">Maintenance</option>
                <option value="USER">Utilisateur</option>
                <option value="REPORT">Rapport</option>
                <option value="SYSTEM">Système</option>
                <option value="SECURITY">Sécurité</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Action</label>
              <input
                type="text"
                value={filters.action}
                onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
                placeholder="Rechercher action..."
                className="w-full p-2 border border-border rounded bg-background text-foreground text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Utilisateur</label>
              <input
                type="text"
                value={filters.user}
                onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
                placeholder="Email utilisateur..."
                className="w-full p-2 border border-border rounded bg-background text-foreground text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Date début</label>
              <input
                type="datetime-local"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full p-2 border border-border rounded bg-background text-foreground text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Date fin</label>
              <input
                type="datetime-local"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full p-2 border border-border rounded bg-background text-foreground text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Logs d'Audit ({filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Aucun log trouvé avec ces filtres</p>
              </div>
            ) : (
              filteredLogs.map((log) => {
                const ResourceIcon = resourceIcons[log.resource as keyof typeof resourceIcons] || Activity
                const isExpanded = showDetails === log.id
                
                return (
                  <div key={log.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-2 rounded-full ${severityColors[log.severity]}`}>
                          <ResourceIcon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-foreground">{log.action}</h4>
                            <Badge className={severityColors[log.severity]}>
                              {log.severity}
                            </Badge>
                            <Badge variant="outline">
                              {log.resource}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {log.userEmail}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(log.timestamp)}
                            </span>
                            {log.resourceId && (
                              <span>ID: {log.resourceId}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDetails(isExpanded ? null : log.id)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {isExpanded && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <h5 className="font-medium text-foreground mb-2">Détails</h5>
                        <pre className="text-xs text-muted-foreground overflow-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 