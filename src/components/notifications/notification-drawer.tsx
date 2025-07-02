'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  X, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Clock,
  Circle,
  Dot
} from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  timestamp: string
  read: boolean
  urgent?: boolean
}

interface NotificationDrawerProps {
  isOpen: boolean
  onClose: () => void
}

// Données mockées pour les notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Maintenance requise',
    message: 'Le véhicule AB-123-CD nécessite une révision dans 5 jours',
    type: 'warning',
    timestamp: '2024-03-16T10:30:00',
    read: false,
    urgent: true
  },
  {
    id: '2',
    title: 'Mission terminée',
    message: 'Livraison Paris-Lyon terminée avec succès par Jean Dupont',
    type: 'success',
    timestamp: '2024-03-16T09:15:00',
    read: false
  },
  {
    id: '3',
    title: 'Alerte carburant',
    message: 'Niveau de carburant faible sur le véhicule EF-456-GH',
    type: 'error',
    timestamp: '2024-03-16T08:45:00',
    read: true,
    urgent: true
  },
  {
    id: '4',
    title: 'Nouveau chauffeur',
    message: 'Marie Martin a été ajoutée à l\'équipe',
    type: 'info',
    timestamp: '2024-03-15T16:20:00',
    read: true
  },
  {
    id: '5',
    title: 'Mise à jour système',
    message: 'Le système a été mis à jour vers la version 2.1.0',
    type: 'info',
    timestamp: '2024-03-15T14:10:00',
    read: true
  }
]

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Marquer comme lue
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  // Marquer toutes comme lues
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  // Obtenir l'icône selon le type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  // Obtenir la couleur de fond selon le type
  const getTypeBgColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800'
      case 'error':
        return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
      case 'success':
        return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
    }
  }

  // Formater la date
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `il y a ${diffInMinutes}min`
    } else if (diffInHours < 24) {
      return `il y a ${diffInHours}h`
    } else {
      return date.toLocaleDateString('fr-FR')
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-96 bg-background border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Notifications</h2>
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="h-5 px-2 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="mt-3 text-xs h-8"
                >
                  Marquer toutes comme lues
                </Button>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Aucune notification
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Vous n'avez aucune notification pour le moment
                  </p>
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`
                        p-4 rounded-lg border cursor-pointer transition-all duration-200
                        ${notification.read 
                          ? 'bg-background border-border opacity-75' 
                          : `${getTypeBgColor(notification.type)} border`
                        }
                        hover:shadow-md
                      `}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {getTypeIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm text-foreground truncate">
                              {notification.title}
                            </h4>
                            {notification.urgent && (
                              <Badge variant="destructive" className="h-4 px-1.5 text-xs">
                                Urgent
                              </Badge>
                            )}
                            {!notification.read && (
                              <Dot className="h-3 w-3 text-primary fill-current" />
                            )}
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  onClose()
                  // Navigation vers la page notifications complète
                  window.location.href = '/notifications'
                }}
              >
                Voir toutes les notifications
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 