const CACHE_NAME = 'meisterwerk-v1.0.0';
const STATIC_CACHE = 'meisterwerk-static-v1.0.0';
const DYNAMIC_CACHE = 'meisterwerk-dynamic-v1.0.0';

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add critical CSS and JS files here
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Handle API requests with network-first strategy
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone response for caching
          const responseClone = response.clone();
          
          if (response.status === 200) {
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          
          return response;
        })
        .catch(() => {
          // Return cached version if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Return cached index.html for SPA routing
          return caches.match('/') || caches.match('/index.html');
        })
    );
    return;
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone response for caching
            const responseClone = response.clone();

            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });

            return response;
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync-course-progress') {
    event.waitUntil(syncCourseProgress());
  }
  
  if (event.tag === 'background-sync-forum-posts') {
    event.waitUntil(syncForumPosts());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
  
  const options = {
    body: 'Sie haben eine neue Nachricht erhalten',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Öffnen',
        icon: '/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Schließen',
        icon: '/icons/action-close.png'
      }
    ],
    requireInteraction: true,
    renotify: true,
    tag: 'meisterwerk-notification'
  };

  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.data = { ...options.data, ...data };
  }

  event.waitUntil(
    self.registration.showNotification('MeisterWerk', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if app is already open
          for (const client of clientList) {
            if (client.url.includes('/') && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Open new window if not already open
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
});

// Helper functions for background sync
async function syncCourseProgress() {
  try {
    // Get offline course progress data from IndexedDB
    const offlineData = await getOfflineProgressData();
    
    if (offlineData.length > 0) {
      // Send to server
      await fetch('/api/sync/course-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offlineData)
      });
      
      // Clear offline data after successful sync
      await clearOfflineProgressData();
      
      console.log('[SW] Course progress synced successfully');
    }
  } catch (error) {
    console.error('[SW] Failed to sync course progress:', error);
    throw error; // This will retry the sync
  }
}

async function syncForumPosts() {
  try {
    // Get offline forum posts from IndexedDB
    const offlinePosts = await getOfflineForumPosts();
    
    if (offlinePosts.length > 0) {
      // Send to server
      await fetch('/api/sync/forum-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offlinePosts)
      });
      
      // Clear offline data after successful sync
      await clearOfflineForumPosts();
      
      console.log('[SW] Forum posts synced successfully');
    }
  } catch (error) {
    console.error('[SW] Failed to sync forum posts:', error);
    throw error;
  }
}

// IndexedDB helper functions (simplified)
async function getOfflineProgressData() {
  // In a real implementation, this would query IndexedDB
  return [];
}

async function clearOfflineProgressData() {
  // In a real implementation, this would clear IndexedDB data
}

async function getOfflineForumPosts() {
  // In a real implementation, this would query IndexedDB
  return [];
}

async function clearOfflineForumPosts() {
  // In a real implementation, this would clear IndexedDB data
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncOfflineContent());
  }
});

async function syncOfflineContent() {
  try {
    // Sync course content and user progress
    console.log('[SW] Performing periodic sync');
  } catch (error) {
    console.error('[SW] Periodic sync failed:', error);
  }
}

// Share target handler
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (url.pathname === '/share' && event.request.method === 'POST') {
    event.respondWith(handleShareTarget(event.request));
  }
});

async function handleShareTarget(request) {
  const formData = await request.formData();
  const title = formData.get('title') || '';
  const text = formData.get('text') || '';
  const url = formData.get('url') || '';
  
  // Process shared content
  console.log('[SW] Shared content:', { title, text, url });
  
  // Redirect to app with shared data
  return Response.redirect(`/?shared=true&title=${encodeURIComponent(title)}&text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, 302);
}