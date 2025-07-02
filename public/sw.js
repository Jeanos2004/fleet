const CACHE_NAME = 'fleet-management-v1.0.0'
const STATIC_CACHE = 'fleet-static-v1.0.0'
const DYNAMIC_CACHE = 'fleet-dynamic-v1.0.0'

// Ressources à mettre en cache lors de l'installation
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/auth/login',
  '/manifest.json',
  '/favicon.png',
  '/icon-192x192.png',
  '/icon-144x144.png'
]

// URLs des API à mettre en cache
const API_CACHE_PATTERNS = [
  '/api/dashboard/stats',
  '/api/fleet',
  '/api/drivers',
  '/api/missions',
  '/api/telemetry'
]

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation en cours...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Mise en cache des ressources statiques')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('[SW] Installation terminée')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('[SW] Erreur lors de l\'installation:', error)
      })
  )
})

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation en cours...')
  
  event.waitUntil(
    Promise.all([
      // Nettoyer les anciens caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Suppression de l\'ancien cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // Prendre le contrôle de tous les clients
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Activation terminée')
    })
  )
})

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return
  }
  
  // Stratégie pour les ressources statiques
  if (STATIC_ASSETS.some(asset => url.pathname === asset)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }
  
  // Stratégie pour les API
  if (API_CACHE_PATTERNS.some(pattern => url.pathname.startsWith(pattern))) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
    return
  }
  
  // Stratégie pour les autres ressources
  if (request.destination === 'document') {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
  } else {
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE))
  }
})

// Stratégie Cache First
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      console.log('[SW] Réponse depuis le cache:', request.url)
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone())
      console.log('[SW] Ressource mise en cache:', request.url)
    }
    
    return networkResponse
  } catch (error) {
    console.error('[SW] Erreur cache first:', error)
    
    // Fallback pour les pages
    if (request.destination === 'document') {
      const cache = await caches.open(STATIC_CACHE)
      return cache.match('/') || new Response('Hors ligne', { status: 503 })
    }
    
    return new Response('Ressource non disponible', { status: 503 })
  }
}

// Stratégie Network First
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      await cache.put(request, networkResponse.clone())
      console.log('[SW] Réponse réseau mise en cache:', request.url)
    }
    
    return networkResponse
  } catch (error) {
    console.log('[SW] Réseau indisponible, tentative cache:', request.url)
    
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      console.log('[SW] Réponse depuis le cache (fallback):', request.url)
      return cachedResponse
    }
    
    // Fallback pour les API
    if (request.url.includes('/api/')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Données non disponibles hors ligne',
        offline: true
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    return new Response('Contenu non disponible hors ligne', { status: 503 })
  }
}

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('[SW] Notification push reçue')
  
  let data = {}
  
  if (event.data) {
    try {
      data = event.data.json()
    } catch (error) {
      data = { title: 'Fleet Management', body: event.data.text() }
    }
  }
  
  const options = {
    title: data.title || 'Fleet Management',
    body: data.body || 'Nouvelle notification',
    icon: '/icon-192x192.png',
    badge: '/icon-144x144.png',
    tag: data.tag || 'general',
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'Voir',
        icon: '/icon-144x144.png'
      },
      {
        action: 'dismiss',
        title: 'Ignorer'
      }
    ],
    vibrate: [200, 100, 200],
    requireInteraction: data.urgent || false
  }
  
  event.waitUntil(
    self.registration.showNotification(options.title, options)
  )
})

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Clic sur notification:', event.notification.tag)
  
  event.notification.close()
  
  if (event.action === 'dismiss') {
    return
  }
  
  const urlToOpen = event.notification.data?.url || '/dashboard'
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Vérifier si une fenêtre est déjà ouverte
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus()
          }
        }
        
        // Ouvrir une nouvelle fenêtre
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  console.log('[SW] Synchronisation en arrière-plan:', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

// Fonction de synchronisation
async function doBackgroundSync() {
  try {
    // Synchroniser les données critiques
    const responses = await Promise.allSettled([
      fetch('/api/dashboard/stats'),
      fetch('/api/fleet'),
      fetch('/api/missions?status=active')
    ])
    
    console.log('[SW] Synchronisation terminée:', responses.length, 'requêtes')
    
    // Envoyer une notification si des données importantes ont changé
    const hasImportantUpdates = responses.some(response => 
      response.status === 'fulfilled' && response.value.ok
    )
    
    if (hasImportantUpdates) {
      await self.registration.showNotification('Données synchronisées', {
        body: 'Les données de la flotte ont été mises à jour',
        icon: '/icon-192x192.png',
        tag: 'sync-complete',
        silent: true
      })
    }
  } catch (error) {
    console.error('[SW] Erreur lors de la synchronisation:', error)
  }
}

// Gestion des messages depuis l'application
self.addEventListener('message', (event) => {
  console.log('[SW] Message reçu:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then(cache => cache.addAll(event.data.urls))
        .then(() => event.ports[0].postMessage({ success: true }))
        .catch(error => event.ports[0].postMessage({ success: false, error: error.message }))
    )
  }
})

// Nettoyage périodique du cache
setInterval(async () => {
  try {
    const cache = await caches.open(DYNAMIC_CACHE)
    const requests = await cache.keys()
    
    // Supprimer les entrées de cache anciennes (plus de 24h)
    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24 heures
    
    for (const request of requests) {
      const response = await cache.match(request)
      if (response) {
        const dateHeader = response.headers.get('date')
        if (dateHeader) {
          const responseDate = new Date(dateHeader).getTime()
          if (now - responseDate > maxAge) {
            await cache.delete(request)
            console.log('[SW] Cache expiré supprimé:', request.url)
          }
        }
      }
    }
  } catch (error) {
    console.error('[SW] Erreur lors du nettoyage du cache:', error)
  }
}, 60 * 60 * 1000) // Toutes les heures

console.log('[SW] Service Worker Fleet Management chargé') 