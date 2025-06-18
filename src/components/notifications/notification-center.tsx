'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Bell, Check, X, AlertTriangle, Info, CheckCircle, Settings } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  read: boolean
  createdAt: Date
  priority: 'low' | 'medium' | 'high'
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Maintenance programmée',
    message: 'Le camion AB-123-CD nécessite une révision dans 3 jours',
    type: 'warning',
    read: false,
    createdAt: new Date('2024-03-15T10:30:00'),
    priority: 'high'
  },
  {
    id: '2',
    title: 'Mission terminée',
    message: 'Livraison Total Energies - Site Roissy terminée avec succès',
    type: 'success',
    read: false,
    createdAt: new Date('2024-03-15T09:15:00'),
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Alerte télémétrie',
    message: 'Température anormale détectée sur le camion EF-456-GH',
    type: 'error',
    read: true,
    createdAt: new Date('2024-03-15T08:45:00'),
    priority: 'high'
  }
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case 'error':
        return <CheckCircle className="h-5 w-5 text-red-500" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const filteredNotifications = notifications.filter(notif => 
    filter === 'all' || !notif.read
  )

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center space-x-3">
            <Bell className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <span className="text-xl font-bold">{notifications.length}</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Non lues</p>
              <span className="text-xl font-bold">{unreadCount}</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center space-x-3">
            <Settings className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Priorité haute</p>
              <span className="text-xl font-bold">
                {notifications.filter(n => n.priority === 'high').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-hover rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Toutes
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Non lues ({unreadCount})
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div key={notification.id} className="gradient-border">
              <div className="p-4 bg-card rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium">{notification.title}</h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                        <Badge variant={notification.priority === 'high' ? 'destructive' : 'secondary'}>
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    {!notification.read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 