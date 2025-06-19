interface ErrorLog {
  id: string
  timestamp: Date
  error: Error
  context: {
    component?: string
    action?: string
    userId?: string
    url?: string
    userAgent?: string
    stack?: string
    // Propriétés additionnelles pour différents types d'erreurs
    statusCode?: number
    props?: string
    data?: string
    componentStack?: string
    filename?: string
    lineno?: number
    colno?: number
    resolution?: string
    resolvedAt?: string
    [key: string]: unknown // Permet d'ajouter d'autres propriétés
  }
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  resolved: boolean
}

class ErrorHandler {
  private errors: ErrorLog[] = []
  private listeners: ((error: ErrorLog) => void)[] = []

  logError(error: Error, context: ErrorLog['context'] = {}, severity: ErrorLog['severity'] = 'MEDIUM') {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      timestamp: new Date(),
      error,
      context: {
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        stack: error.stack,
        ...context
      },
      severity,
      resolved: false
    }

    this.errors.push(errorLog)
    
    // Notifier les listeners
    this.listeners.forEach(listener => listener(errorLog))
    
    // Log en console pour le développement
    console.error('Error logged:', errorLog)
    
    // En production, envoyer vers un service de monitoring (Sentry, LogRocket, etc.)
    this.sendToMonitoringService(errorLog)
    
    return errorLog
  }

  private generateId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private sendToMonitoringService(errorLog: ErrorLog) {
    // Simulation d'envoi vers un service de monitoring
    if (process.env.NODE_ENV === 'production') {
      // Ici on enverrait vers Sentry, LogRocket, ou autre service
      console.log('Sending to monitoring service:', errorLog.id)
    }
  }

  // Méthodes spécialisées pour différents types d'erreurs
  logAPIError(error: Error, endpoint: string, method: string, statusCode?: number) {
    return this.logError(error, {
      component: 'API',
      action: `${method} ${endpoint}`,
      statusCode,
    }, statusCode && statusCode >= 500 ? 'HIGH' : 'MEDIUM')
  }

  logComponentError(error: Error, componentName: string, props?: Record<string, unknown>) {
    return this.logError(error, {
      component: componentName,
      action: 'RENDER',
      props: JSON.stringify(props)
    }, 'MEDIUM')
  }

  logAuthError(error: Error, action: string) {
    return this.logError(error, {
      component: 'AUTH',
      action
    }, 'HIGH')
  }

  logValidationError(error: Error, formName: string, fieldName?: string) {
    return this.logError(error, {
      component: 'VALIDATION',
      action: `${formName}${fieldName ? `.${fieldName}` : ''}`
    }, 'LOW')
  }

  logDatabaseError(error: Error, operation: string, table?: string) {
    return this.logError(error, {
      component: 'DATABASE',
      action: `${operation}${table ? ` ${table}` : ''}`
    }, 'HIGH')
  }

  logBusinessLogicError(error: Error, businessRule: string, data?: Record<string, unknown>) {
    return this.logError(error, {
      component: 'BUSINESS_LOGIC',
      action: businessRule,
      data: JSON.stringify(data)
    }, 'MEDIUM')
  }

  // Gestion des erreurs React
  handleReactError(error: Error, errorInfo: { componentStack?: string }) {
    return this.logError(error, {
      component: 'REACT_ERROR_BOUNDARY',
      action: 'COMPONENT_ERROR',
      componentStack: errorInfo.componentStack
    }, 'HIGH')
  }

  // Gestion des erreurs de réseau
  handleNetworkError(error: Error, url: string, method: string) {
    return this.logError(error, {
      component: 'NETWORK',
      action: `${method} ${url}`
    }, 'MEDIUM')
  }

  // Méthodes de consultation
  getErrors(filters?: {
    severity?: ErrorLog['severity']
    component?: string
    resolved?: boolean
    startDate?: Date
    endDate?: Date
    limit?: number
  }): ErrorLog[] {
    let filteredErrors = [...this.errors]

    if (filters) {
      if (filters.severity) {
        filteredErrors = filteredErrors.filter(err => err.severity === filters.severity)
      }
      if (filters.component) {
        filteredErrors = filteredErrors.filter(err => err.context.component === filters.component)
      }
      if (filters.resolved !== undefined) {
        filteredErrors = filteredErrors.filter(err => err.resolved === filters.resolved)
      }
      if (filters.startDate) {
        filteredErrors = filteredErrors.filter(err => err.timestamp >= filters.startDate!)
      }
      if (filters.endDate) {
        filteredErrors = filteredErrors.filter(err => err.timestamp <= filters.endDate!)
      }
    }

    // Trier par date décroissante
    filteredErrors.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    if (filters?.limit) {
      filteredErrors = filteredErrors.slice(0, filters.limit)
    }

    return filteredErrors
  }

  getUnresolvedErrors(): ErrorLog[] {
    return this.getErrors({ resolved: false })
  }

  getCriticalErrors(): ErrorLog[] {
    return this.getErrors({ severity: 'CRITICAL', resolved: false })
  }

  getRecentErrors(minutes: number = 60): ErrorLog[] {
    const startDate = new Date(Date.now() - minutes * 60 * 1000)
    return this.getErrors({ startDate })
  }

  // Résolution d'erreurs
  resolveError(errorId: string, resolution?: string) {
    const error = this.errors.find(err => err.id === errorId)
    if (error) {
      error.resolved = true
      if (resolution) {
        error.context.resolution = resolution
      }
      error.context.resolvedAt = new Date().toISOString()
    }
    return error
  }

  // Statistiques
  getErrorStats(startDate?: Date, endDate?: Date) {
    const errors = this.getErrors({ startDate, endDate })
    
    return {
      total: errors.length,
      unresolved: errors.filter(e => !e.resolved).length,
      bySeverity: {
        LOW: errors.filter(e => e.severity === 'LOW').length,
        MEDIUM: errors.filter(e => e.severity === 'MEDIUM').length,
        HIGH: errors.filter(e => e.severity === 'HIGH').length,
        CRITICAL: errors.filter(e => e.severity === 'CRITICAL').length
      },
      byComponent: errors.reduce((acc, err) => {
        const component = err.context.component || 'UNKNOWN'
        acc[component] = (acc[component] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      recentErrors: this.getRecentErrors(60).length,
      errorRate: this.calculateErrorRate(startDate, endDate)
    }
  }

  private calculateErrorRate(startDate?: Date, endDate?: Date): number {
    const errors = this.getErrors({ startDate, endDate })
    const timeWindow = endDate && startDate 
      ? (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60) // heures
      : 24 // 24 heures par défaut
    
    return errors.length / timeWindow // erreurs par heure
  }

  // Listeners pour les notifications en temps réel
  addErrorListener(listener: (error: ErrorLog) => void) {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  // Nettoyage des erreurs anciennes
  cleanupOldErrors(daysToKeep: number = 30) {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000)
    const initialCount = this.errors.length
    
    this.errors = this.errors.filter(err => err.timestamp >= cutoffDate)
    
    const removedCount = initialCount - this.errors.length
    console.log(`Cleanup errors: ${removedCount} erreurs supprimées, ${this.errors.length} conservées`)
    
    return removedCount
  }

  // Export des erreurs
  exportErrors(format: 'JSON' | 'CSV' = 'JSON', filters?: Record<string, unknown>): string {
    const errors = this.getErrors(filters)

    if (format === 'CSV') {
      const headers = ['ID', 'Timestamp', 'Severity', 'Component', 'Action', 'Message', 'Resolved']
      const csvRows = [
        headers.join(','),
        ...errors.map(err => [
          err.id,
          err.timestamp.toISOString(),
          err.severity,
          err.context.component || '',
          err.context.action || '',
          err.error.message.replace(/"/g, '""'),
          err.resolved ? 'Yes' : 'No'
        ].map(field => `"${field}"`).join(','))
      ]
      return csvRows.join('\n')
    }

    return JSON.stringify(errors.map(err => ({
      ...err,
      error: {
        message: err.error.message,
        name: err.error.name,
        stack: err.error.stack
      }
    })), null, 2)
  }
}

// Instance singleton
export const errorHandler = new ErrorHandler()

// Hook pour utilisation dans les composants React
export const useErrorHandler = () => {
  return {
    logError: errorHandler.logError.bind(errorHandler),
    logAPIError: errorHandler.logAPIError.bind(errorHandler),
    logComponentError: errorHandler.logComponentError.bind(errorHandler),
    logAuthError: errorHandler.logAuthError.bind(errorHandler),
    logValidationError: errorHandler.logValidationError.bind(errorHandler),
    logBusinessLogicError: errorHandler.logBusinessLogicError.bind(errorHandler),
    getErrors: errorHandler.getErrors.bind(errorHandler),
    resolveError: errorHandler.resolveError.bind(errorHandler)
  }
}

// Gestionnaire global d'erreurs pour les erreurs non capturées
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    errorHandler.logError(
      new Error(event.message),
      {
        component: 'GLOBAL',
        action: 'UNHANDLED_ERROR',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      },
      'HIGH'
    )
  })

  window.addEventListener('unhandledrejection', (event) => {
    errorHandler.logError(
      new Error(event.reason),
      {
        component: 'GLOBAL',
        action: 'UNHANDLED_PROMISE_REJECTION'
      },
      'HIGH'
    )
  })
} 