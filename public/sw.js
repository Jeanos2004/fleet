const CACHE_NAME = 'fleet-manager-v1'
const urlsToCache = [
  '/',
  '/dashboard',
  '/missions',
  '/fleet',
  '/telemetry',
  '/maintenance',
  '/reports',
  '/admin',
  '/manifest.json'
]

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert')
        return cache.addAll(urlsToCache)
      })
  )
})

// Activation du service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression ancien cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourner le cache si disponible
        if (response) {
          return response
        }
        
        // Sinon, faire la requête réseau
        return fetch(event.request).then((response) => {
          // Vérifier si la réponse est valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }
          
          // Cloner la réponse
          const responseToCache = response.clone()
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })
          
          return response
        })
      })
      .catch(() => {
        // Retourner une page offline basique si nécessaire
        if (event.request.destination === 'document') {
          return caches.match('/dashboard')
        }
      })
  )
})

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('Notification push reçue:', event)
  
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle notification',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Voir détails',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/icon-192x192.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Fleet Manager', options)
  )
})

// Gestion des clics sur notifications
self.addEventListener('notificationclick', (event) => {
  console.log('Clic sur notification:', event)
  
  event.notification.close()
  
  if (event.action === 'explore') {
    // Ouvrir l'application
    event.waitUntil(
      clients.openWindow('/dashboard')
    )
  } else if (event.action === 'close') {
    // Fermer la notification
    event.notification.close()
  } else {
    // Action par défaut
    event.waitUntil(
      clients.openWindow('/dashboard')
    )
  }
})

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Synchronisation en arrière-plan')
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  try {
    // Synchroniser les données critiques
    const response = await fetch('/api/telemetry/real-time')
    const data = await response.json()
    
    // Vérifier s'il y a des alertes
    if (data.summary && data.summary.camionsEnAlerte > 0) {
      await self.registration.showNotification('Alerte Flotte', {
        body: `${data.summary.camionsEnAlerte} camion(s) en alerte`,
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        tag: 'fleet-alert'
      })
    }
  } catch (error) {
    console.error('Erreur synchronisation:', error)
  }
}

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
}) 