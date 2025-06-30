'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useDemoAuth } from '@/components/providers/demo-auth-provider'
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  User,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Clock,
  RefreshCw
} from 'lucide-react'

interface AuditLog {
  id: string
  timestamp: Date
  userId: string
  userName: string
  userRole: string
  action: string
  resource: string
  resourceId: string
  details: string
  ipAddress: string
  userAgent: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'SUCCESS' | 'FAILED' | 'WARNING'
}

// Données mockées pour les logs d'audit
const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date('2024-03-15T10:30:00'),
    userId: '1',
    userName: 'Jean Administrateur',
    userRole: 'ADMIN',
    action: 'CREATE_USER',
    resource: 'User',
    resourceId: 'user_123',
    details: 'Création d\'un nouvel utilisateur: Marie Dubois (marie@fleet.com)',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    severity: 'MEDIUM',
    status: 'SUCCESS'
  },
  {
    id: '2',
    timestamp: new Date('2024-03-15T10:25:00'),
    userId: '2',
    userName: 'Marie Dubois',
    userRole: 'TRANSPORT_MANAGER',
    action: 'UPDATE_MISSION',
    resource: 'Mission',
    resourceId: 'mission_456',
    details: 'Modification de la mission Paris-Lyon: changement de chauffeur',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    severity: 'LOW',
    status: 'SUCCESS'
  },
  {
    id: '3',
    timestamp: new Date('2024-03-15T10:20:00'),
    userId: '3',
    userName: 'Pierre Martin',
    userRole: 'TECHNICIAN',
    action: 'DELETE_VEHICLE',
    resource: 'Vehicle',
    resourceId: 'vehicle_789',
    details: 'Tentative de suppression du véhicule VL-001 refusée: permissions insuffisantes',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    severity: 'HIGH',
    status: 'FAILED'
  },
  {
    id: '4',
    timestamp: new Date('2024-03-15T10:15:00'),
    userId: '1',
    userName: 'Jean Administrateur',
    userRole: 'ADMIN',
    action: 'LOGIN',
    resource: 'Auth',
    resourceId: 'session_101',
    details: 'Connexion administrative depuis l\'interface web',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    severity: 'LOW',
    status: 'SUCCESS'
  },
  {
    id: '5',
    timestamp: new Date('2024-03-15T10:10:00'),
    userId: '4',
    userName: 'Sophie Leroy',
    userRole: 'FINANCE',
    action: 'EXPORT_REPORT',
    resource: 'Report',
    resourceId: 'report_202',
    details: 'Export du rapport financier mensuel en format Excel',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    severity: 'MEDIUM',
    status: 'SUCCESS'
  },
  {
    id: '6',
    timestamp: new Date('2024-03-15T10:05:00'),
    userId: '5',
    userName: 'Jean Dupont',
    userRole: 'DRIVER',
    action: 'UPDATE_PROFILE',
    resource: 'User',
    resourceId: 'user_789',
    details: 'Mise à jour des informations de profil: changement de numéro de téléphone',
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    severity: 'LOW',
    status: 'SUCCESS'
  },
  {
    id: '7',
    timestamp: new Date('2024-03-15T09:55:00'),
    userId: 'unknown',
    userName: 'Utilisateur Inconnu',
    userRole: 'UNKNOWN',
    action: 'FAILED_LOGIN',
    resource: 'Auth',
    resourceId: 'failed_session',
    details: 'Tentative de connexion échouée: identifiants incorrects pour admin@fleet.com',
    ipAddress: '203.45.123.88',
    userAgent: 'curl/7.68.0',
    severity: 'CRITICAL',
    status: 'FAILED'
  },
  {
    id: '8',
    timestamp: new Date('2024-03-15T09:50:00'),
    userId: '2',
    userName: 'Marie Dubois',
    userRole: 'TRANSPORT_MANAGER',
    action: 'CREATE_MISSION',
    resource: 'Mission',
    resourceId: 'mission_999',
    details: 'Création d\'une nouvelle mission: Marseille-Nice (Livraison urgente)',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    severity: 'MEDIUM',
    status: 'SUCCESS'
  }
]

const severityColors = {
  LOW: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  MEDIUM: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

const statusColors = {
  SUCCESS: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  FAILED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  WARNING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
}

const statusIcons = {
  SUCCESS: CheckCircle,
  FAILED: XCircle,
  WARNING: AlertTriangle
}

export default function AdminAuditPage() {
  const { user: currentUser, hasPermission } = useDemoAuth()
  const [logs, setLogs] = useState<AuditLog[]>(mockAuditLogs)
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('today')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Vérifier les permissions
  if (!currentUser || !hasPermission('admin', 'read')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Accès refusé</h2>
          <p className="text-muted-foreground">
            Vous n'avez pas les permissions nécessaires pour accéder aux logs d'audit.
          </p>
        </div>
      </div>
    )
  }

  // Filtrage des logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter
    const matchesAction = actionFilter === 'all' || log.action.includes(actionFilter)
    
    // Filtrage par date
    let matchesDate = true
    const today = new Date()
    if (dateRange === 'today') {
      matchesDate = log.timestamp.toDateString() === today.toDateString()
    } else if (dateRange === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      matchesDate = log.timestamp >= weekAgo
    } else if (dateRange === 'month') {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      matchesDate = log.timestamp >= monthAgo
    }
    
    return matchesSearch && matchesSeverity && matchesStatus && matchesAction && matchesDate
  })

  // Statistiques
  const stats = {
    total: filteredLogs.length,
    success: filteredLogs.filter(l => l.status === 'SUCCESS').length,
    failed: filteredLogs.filter(l => l.status === 'FAILED').length,
    critical: filteredLogs.filter(l => l.severity === 'CRITICAL').length
  }

  // Actions uniques pour le filtre
  const uniqueActions = [...new Set(logs.map(log => log.action))]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulation d'un rechargement
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Utilisateur', 'Action', 'Ressource', 'Statut', 'Sévérité', 'Détails'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp.toISOString(),
        log.userName,
        log.action,
        log.resource,
        log.status,
        log.severity,
        `"${log.details}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                Logs d'Audit
              </h1>
              <p className="text-muted-foreground mt-2">
                Suivi des activités et actions des utilisateurs du système
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exporter CSV
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
                <p className="text-2xl font-bold text-card-foreground">{stats.total}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Succès</p>
                <p className="text-2xl font-bold text-green-600">{stats.success}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Échecs</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critiques</p>
                <p className="text-2xl font-bold text-orange-600">{stats.critical}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
        </motion.div>

        {/* Filtres */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
                />
              </div>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">7 derniers jours</option>
                <option value="month">30 derniers jours</option>
              </select>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
              >
                <option value="all">Toutes sévérités</option>
                <option value="LOW">Faible</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="HIGH">Élevée</option>
                <option value="CRITICAL">Critique</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
              >
                <option value="all">Tous les statuts</option>
                <option value="SUCCESS">Succès</option>
                <option value="FAILED">Échec</option>
                <option value="WARNING">Avertissement</option>
              </select>

              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
              >
                <option value="all">Toutes les actions</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredLogs.length} log(s) trouvé(s)
            </div>
          </div>
        </motion.div>

        {/* Tableau des logs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">Date/Heure</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Utilisateur</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Action</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Ressource</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Statut</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Sévérité</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">IP</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => {
                  const StatusIcon = statusIcons[log.status]
                  return (
                    <tr key={log.id} className="border-t border-border hover:bg-muted/25 transition-colors">
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="font-medium">{formatDate(log.timestamp)}</div>
                          <div className="text-xs text-muted-foreground">
                            {log.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-card-foreground">{log.userName}</div>
                          <div className="text-xs text-muted-foreground">{log.userRole}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="text-sm font-medium">{log.resource}</div>
                          <div className="text-xs text-muted-foreground">{log.resourceId}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={`${statusColors[log.status]} border-0 flex items-center gap-1 w-fit`}>
                          <StatusIcon className="h-3 w-3" />
                          {log.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={`${severityColors[log.severity]} border-0`}>
                          {log.severity}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-mono text-muted-foreground">
                          {log.ipAddress}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end">
                          <Button variant="ghost" size="sm" title="Voir les détails">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun log trouvé pour les critères sélectionnés</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 
