'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X, 
  Clock,
  Truck,
  Wrench,
  MapPin,
  Fuel
} from 'lucide-react'

export interface SystemNotification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'mission' | 'vehicle' | 'maintenance' | 'fuel' | 'driver' | 'system'
  title: string
  message: string
  timestamp: Date
  read: boolean
  urgent: boolean
  data?: any
}

interface SystemNotificationsProps {
  notifications: SystemNotification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDismiss: (id: string) => void
  className?: string
}

export function SystemNotifications({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  className = ''
}: SystemNotificationsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  
  const unreadCount = notifications.filter(n => !n.read).length
  const urgentCount = notifications.filter(n => n.urgent && !n.read).length
  
  // Filtrer les notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    if (filter === 'urgent') return notification.urgent
    return notification.category === filter
  })
  
  // Icônes par catégorie
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mission': return MapPin
      case 'vehicle': return Truck
      case 'maintenance': return Wrench
      case 'fuel': return Fuel
      case 'driver': return Bell
      default: return Info
    }
  }
  
  // Couleurs par type
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100 border-green-200'
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'error': return 'text-red-600 bg-red-100 border-red-200'
      default: return 'text-blue-600 bg-blue-100 border-blue-200'
    }
  }
  
  // Icône par type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle
      case 'warning': return AlertTriangle
      case 'error': return AlertTriangle
      default: return Info
    }
  }
  
  // Formater la date
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'À l\'instant'
    if (minutes < 60) return `Il y a ${minutes}min`
    if (hours < 24) return `Il y a ${hours}h`
    if (days < 7) return `Il y a ${days}j`
    return timestamp.toLocaleDateString('fr-FR')
  }
  
  return (
    <div className={`relative ${className}`}>
      {/* Bouton de notification */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative p-2"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
      
      {/* Panel des notifications */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-96 max-h-96 bg-white dark:bg-slate-800 border border-border rounded-lg shadow-lg z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Statistiques */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span>{notifications.length} total</span>
                {unreadCount > 0 && <span>{unreadCount} non lues</span>}
                {urgentCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {urgentCount} urgentes
                  </Badge>
                )}
              </div>
              
              {/* Filtres */}
              <div className="flex flex-wrap gap-1">
                {['all', 'unread', 'urgent', 'mission', 'vehicle', 'maintenance'].map((filterOption) => (
                  <Button
                    key={filterOption}
                    variant={filter === filterOption ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter(filterOption)}
                    className="text-xs h-7"
                  >
                    {filterOption === 'all' ? 'Toutes' :
                     filterOption === 'unread' ? 'Non lues' :
                     filterOption === 'urgent' ? 'Urgentes' :
                     filterOption === 'mission' ? 'Missions' :
                     filterOption === 'vehicle' ? 'Véhicules' :
                     'Maintenance'}
                  </Button>
                ))}
              </div>
              
              {/* Actions */}
              {unreadCount > 0 && (
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onMarkAllAsRead}
                    className="w-full text-xs"
                  >
                    Marquer tout comme lu
                  </Button>
                </div>
              )}
            </div>
            
            {/* Liste des notifications */}
            <div className="max-h-64 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredNotifications.map((notification) => {
                    const CategoryIcon = getCategoryIcon(notification.category)
                    const TypeIcon = getTypeIcon(notification.type)
                    
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`
                          p-3 rounded-lg border cursor-pointer transition-all duration-200
                          ${notification.read 
                            ? 'bg-muted/50 border-border' 
                            : 'bg-background border-primary/20 shadow-sm'
                          }
                          ${notification.urgent && !notification.read 
                            ? 'ring-2 ring-red-200 dark:ring-red-800' 
                            : ''
                          }
                          hover:bg-muted/70
                        `}
                        onClick={() => !notification.read && onMarkAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icône de catégorie */}
                          <div className={`
                            p-1.5 rounded-full flex-shrink-0
                            ${getTypeColor(notification.type)}
                          `}>
                            <CategoryIcon className="h-3.5 w-3.5" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            {/* Titre et badge urgent */}
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`
                                text-sm font-medium truncate
                                ${notification.read ? 'text-muted-foreground' : 'text-foreground'}
                              `}>
                                {notification.title}
                              </h4>
                              {notification.urgent && !notification.read && (
                                <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                  Urgent
                                </Badge>
                              )}
                            </div>
                            
                            {/* Message */}
                            <p className={`
                              text-xs mb-2 line-clamp-2
                              ${notification.read ? 'text-muted-foreground' : 'text-muted-foreground'}
                            `}>
                              {notification.message}
                            </p>
                            
                            {/* Footer */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatTimestamp(notification.timestamp)}
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <TypeIcon className={`h-3 w-3 ${getTypeColor(notification.type).split(' ')[0]}`} />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onDismiss(notification.id)
                                  }}
                                  className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Hook pour générer des notifications de démonstration
export function useSystemNotifications() {
  const [notifications, setNotifications] = useState<SystemNotification[]>([])
  
  useEffect(() => {
    // Générer quelques notifications de démonstration
    const demoNotifications: SystemNotification[] = [
      {
        id: '1',
        type: 'warning',
        category: 'maintenance',
        title: 'Maintenance requise',
        message: 'Le véhicule ABC-123 nécessite une maintenance dans 3 jours',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // Il y a 15 minutes
        read: false,
        urgent: true
      },
      {
        id: '2',
        type: 'success',
        category: 'mission',
        title: 'Mission terminée',
        message: 'Livraison de carburant à Station Shell - Réalisée avec succès',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // Il y a 2 heures
        read: false,
        urgent: false
      },
      {
        id: '3',
        type: 'error',
        category: 'vehicle',
        title: 'Véhicule en panne',
        message: 'Le camion XYZ-789 a signalé un problème moteur',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // Il y a 4 heures
        read: true,
        urgent: true
      },
      {
        id: '4',
        type: 'info',
        category: 'fuel',
        title: 'Niveau de carburant bas',
        message: 'Réservoir principal à 15% - Réapprovisionnement recommandé',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // Il y a 6 heures
        read: false,
        urgent: false
      }
    ]
    
    setNotifications(demoNotifications)
  }, [])
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }
  
  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }
  
  const addNotification = (notification: Omit<SystemNotification, 'id' | 'timestamp'>) => {
    const newNotification: SystemNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    setNotifications(prev => [newNotification, ...prev])
  }
  
  return {
    notifications,
    markAsRead,
    markAllAsRead,
    dismiss,
    addNotification
  }
} 