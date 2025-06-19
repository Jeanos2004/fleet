"use client"

import { useState, useEffect } from 'react'

interface NotificationOptions {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  requireInteraction?: boolean
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    // Vérifier le support des notifications
    if ('Notification' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }

    // Enregistrer le service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('Service Worker enregistré:', reg)
          setRegistration(reg)
        })
        .catch((error) => {
          console.error('Erreur enregistrement Service Worker:', error)
        })
    }
  }, [])

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      throw new Error('Les notifications ne sont pas supportées')
    }

    if (permission === 'granted') {
      return permission
    }

    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }

  const showNotification = async (options: NotificationOptions) => {
    if (!isSupported) {
      throw new Error('Les notifications ne sont pas supportées')
    }

    if (permission !== 'granted') {
      const newPermission = await requestPermission()
      if (newPermission !== 'granted') {
        throw new Error('Permission refusée pour les notifications')
      }
    }

    if (registration) {
      // Utiliser le service worker pour les notifications
      return registration.showNotification(options.title, {
        body: options.body,
        icon: options.icon || '/icon-192x192.png',
        badge: options.badge || '/icon-72x72.png',
        tag: options.tag,
        requireInteraction: options.requireInteraction || false,
        // actions: options.actions || [], // Non supporté dans tous les navigateurs
        // vibrate: [100, 50, 100], // Non supporté dans l'API Notification standard
        data: {
          timestamp: Date.now()
        }
      })
    } else {
      // Fallback: notification directe
      return new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icon-192x192.png',
        tag: options.tag
      })
    }
  }

  const showMissionAlert = (missionId: string, message: string) => {
    return showNotification({
      title: 'Alerte Mission',
      body: message,
      tag: `mission-${missionId}`,
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'Voir mission'
        },
        {
          action: 'dismiss',
          title: 'Ignorer'
        }
      ]
    })
  }

  const showMaintenanceAlert = (camionId: string, message: string) => {
    return showNotification({
      title: 'Alerte Maintenance',
      body: message,
      tag: `maintenance-${camionId}`,
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'Voir détails'
        },
        {
          action: 'schedule',
          title: 'Planifier'
        }
      ]
    })
  }

  const showTelemetryAlert = (camionId: string, alertType: string, message: string) => {
    return showNotification({
      title: `Alerte Télémétrie - ${alertType}`,
      body: message,
      tag: `telemetry-${camionId}-${alertType}`,
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'Voir télémétrie'
        },
        {
          action: 'contact',
          title: 'Contacter chauffeur'
        }
      ]
    })
  }

  const showGeneralAlert = (title: string, message: string, tag?: string) => {
    return showNotification({
      title,
      body: message,
      tag: tag || 'general-alert',
      actions: [
        {
          action: 'view',
          title: 'Voir détails'
        }
      ]
    })
  }

  // Fonction pour programmer des notifications récurrentes
  const scheduleRecurringNotification = (
    options: NotificationOptions,
    intervalMs: number
  ) => {
    const interval = setInterval(() => {
      showNotification(options)
    }, intervalMs)

    return () => clearInterval(interval)
  }

  // Fonction pour envoyer des notifications de rappel
  const sendMaintenanceReminders = () => {
    // Cette fonction serait appelée périodiquement pour vérifier
    // les maintenances à venir et envoyer des rappels

    // Ici on vérifierait la base de données pour les maintenances à venir
    // et enverrait des notifications de rappel
    console.log('Vérification des rappels de maintenance...')
  }

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification,
    showMissionAlert,
    showMaintenanceAlert,
    showTelemetryAlert,
    showGeneralAlert,
    scheduleRecurringNotification,
    sendMaintenanceReminders
  }
} 