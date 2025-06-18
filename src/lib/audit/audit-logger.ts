interface AuditLog {
  id: string
  timestamp: Date
  userId: string
  userEmail: string
  action: string
  resource: string
  resourceId?: string
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

class AuditLogger {
  private logs: AuditLog[] = []

  log(entry: Omit<AuditLog, 'id' | 'timestamp'>) {
    const auditEntry: AuditLog = {
      id: this.generateId(),
      timestamp: new Date(),
      ...entry
    }

    this.logs.push(auditEntry)
    
    // En production, envoyer vers une base de données ou service de logging
    console.log('Audit Log:', auditEntry)
    
    // Alertes pour les actions critiques
    if (entry.severity === 'CRITICAL') {
      this.triggerAlert(auditEntry)
    }

    return auditEntry
  }

  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private triggerAlert(entry: AuditLog) {
    // Déclencher une alerte pour les actions critiques
    console.warn('ALERTE CRITIQUE:', entry)
    // Ici on pourrait envoyer un email, SMS ou notification push
  }

  // Méthodes spécialisées pour différents types d'actions
  logAuthentication(userId: string, userEmail: string, success: boolean, ipAddress?: string) {
    return this.log({
      userId,
      userEmail,
      action: success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
      resource: 'AUTH',
      details: { success, ipAddress },
      ipAddress,
      severity: success ? 'LOW' : 'MEDIUM'
    })
  }

  logMissionAction(userId: string, userEmail: string, action: string, missionId: string, details: any = {}) {
    return this.log({
      userId,
      userEmail,
      action: `MISSION_${action.toUpperCase()}`,
      resource: 'MISSION',
      resourceId: missionId,
      details,
      severity: action === 'DELETE' ? 'HIGH' : 'MEDIUM'
    })
  }

  logFleetAction(userId: string, userEmail: string, action: string, camionId: string, details: any = {}) {
    return this.log({
      userId,
      userEmail,
      action: `FLEET_${action.toUpperCase()}`,
      resource: 'CAMION',
      resourceId: camionId,
      details,
      severity: action === 'DELETE' ? 'HIGH' : 'MEDIUM'
    })
  }

  logMaintenanceAction(userId: string, userEmail: string, action: string, workOrderId: string, details: any = {}) {
    return this.log({
      userId,
      userEmail,
      action: `MAINTENANCE_${action.toUpperCase()}`,
      resource: 'WORK_ORDER',
      resourceId: workOrderId,
      details,
      severity: action === 'APPROVE' ? 'HIGH' : 'MEDIUM'
    })
  }

  logUserAction(userId: string, userEmail: string, action: string, targetUserId: string, details: any = {}) {
    return this.log({
      userId,
      userEmail,
      action: `USER_${action.toUpperCase()}`,
      resource: 'USER',
      resourceId: targetUserId,
      details,
      severity: ['DELETE', 'ROLE_CHANGE', 'PERMISSION_CHANGE'].includes(action) ? 'CRITICAL' : 'HIGH'
    })
  }

  logDataExport(userId: string, userEmail: string, exportType: string, details: any = {}) {
    return this.log({
      userId,
      userEmail,
      action: 'DATA_EXPORT',
      resource: 'REPORT',
      details: { exportType, ...details },
      severity: 'MEDIUM'
    })
  }

  logSystemAction(userId: string, userEmail: string, action: string, details: any = {}) {
    return this.log({
      userId,
      userEmail,
      action: `SYSTEM_${action.toUpperCase()}`,
      resource: 'SYSTEM',
      details,
      severity: 'HIGH'
    })
  }

  logSecurityEvent(userId: string, userEmail: string, event: string, details: any = {}) {
    return this.log({
      userId,
      userEmail,
      action: `SECURITY_${event.toUpperCase()}`,
      resource: 'SECURITY',
      details,
      severity: 'CRITICAL'
    })
  }

  // Méthodes de consultation des logs
  getLogs(filters?: {
    userId?: string
    action?: string
    resource?: string
    severity?: string
    startDate?: Date
    endDate?: Date
    limit?: number
  }): AuditLog[] {
    let filteredLogs = [...this.logs]

    if (filters) {
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filters.userId)
      }
      if (filters.action) {
        filteredLogs = filteredLogs.filter(log => log.action.includes(filters.action!))
      }
      if (filters.resource) {
        filteredLogs = filteredLogs.filter(log => log.resource === filters.resource)
      }
      if (filters.severity) {
        filteredLogs = filteredLogs.filter(log => log.severity === filters.severity)
      }
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate!)
      }
      if (filters.endDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate!)
      }
    }

    // Trier par date décroissante
    filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    // Limiter le nombre de résultats
    if (filters?.limit) {
      filteredLogs = filteredLogs.slice(0, filters.limit)
    }

    return filteredLogs
  }

  getLogsByUser(userId: string, limit: number = 50): AuditLog[] {
    return this.getLogs({ userId, limit })
  }

  getLogsByResource(resource: string, resourceId?: string, limit: number = 50): AuditLog[] {
    let filteredLogs = this.logs.filter(log => log.resource === resource)
    
    if (resourceId) {
      filteredLogs = filteredLogs.filter(log => log.resourceId === resourceId)
    }

    return filteredLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }

  getCriticalLogs(limit: number = 20): AuditLog[] {
    return this.getLogs({ severity: 'CRITICAL', limit })
  }

  getRecentLogs(minutes: number = 60, limit: number = 100): AuditLog[] {
    const startDate = new Date(Date.now() - minutes * 60 * 1000)
    return this.getLogs({ startDate, limit })
  }

  // Statistiques
  getLogStats(startDate?: Date, endDate?: Date) {
    const logs = this.getLogs({ startDate, endDate })
    
    const stats = {
      total: logs.length,
      bySeverity: {
        LOW: logs.filter(l => l.severity === 'LOW').length,
        MEDIUM: logs.filter(l => l.severity === 'MEDIUM').length,
        HIGH: logs.filter(l => l.severity === 'HIGH').length,
        CRITICAL: logs.filter(l => l.severity === 'CRITICAL').length
      },
      byResource: logs.reduce((acc, log) => {
        acc[log.resource] = (acc[log.resource] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      byUser: logs.reduce((acc, log) => {
        acc[log.userEmail] = (acc[log.userEmail] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      recentActivity: this.getRecentLogs(60).length
    }

    return stats
  }

  // Export des logs
  exportLogs(format: 'JSON' | 'CSV' = 'JSON', filters?: any): string {
    const logs = this.getLogs(filters)

    if (format === 'CSV') {
      const headers = ['ID', 'Timestamp', 'User', 'Action', 'Resource', 'Resource ID', 'Severity', 'Details']
      const csvRows = [
        headers.join(','),
        ...logs.map(log => [
          log.id,
          log.timestamp.toISOString(),
          log.userEmail,
          log.action,
          log.resource,
          log.resourceId || '',
          log.severity,
          JSON.stringify(log.details).replace(/"/g, '""')
        ].map(field => `"${field}"`).join(','))
      ]
      return csvRows.join('\n')
    }

    return JSON.stringify(logs, null, 2)
  }

  // Nettoyage des logs anciens
  cleanupOldLogs(daysToKeep: number = 90) {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000)
    const initialCount = this.logs.length
    
    this.logs = this.logs.filter(log => log.timestamp >= cutoffDate)
    
    const removedCount = initialCount - this.logs.length
    console.log(`Nettoyage audit: ${removedCount} logs supprimés, ${this.logs.length} conservés`)
    
    return removedCount
  }
}

// Instance singleton
export const auditLogger = new AuditLogger()

// Utilitaires pour l'utilisation dans les composants
export const useAuditLogger = () => {
  return {
    logAction: auditLogger.log.bind(auditLogger),
    logMission: auditLogger.logMissionAction.bind(auditLogger),
    logFleet: auditLogger.logFleetAction.bind(auditLogger),
    logMaintenance: auditLogger.logMaintenanceAction.bind(auditLogger),
    logUser: auditLogger.logUserAction.bind(auditLogger),
    logExport: auditLogger.logDataExport.bind(auditLogger),
    logSystem: auditLogger.logSystemAction.bind(auditLogger),
    logSecurity: auditLogger.logSecurityEvent.bind(auditLogger)
  }
} 