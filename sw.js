const CACHE_NAME = 'notification-simulator-v1';
const APP_SHELL = ['./', './index.html', './manifest.webmanifest'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});

self.addEventListener('message', event => {
  const msg = event.data || {};
  if (msg.type === 'SHOW_NOTIFICATION' && msg.title && msg.options) {
    event.waitUntil(self.registration.showNotification(msg.title, msg.options));
  }
  if (msg.type === 'GET_STATUS') {
    event.source?.postMessage?.({ type: 'SW_STATUS', active: true, cache: CACHE_NAME });
  }
  if (msg.type === 'CLEAR_DATA') {
    event.waitUntil(caches.delete(CACHE_NAME));
  }
});

self.addEventListener('push', event => {
  let payload = { title: 'Notification Simulator', body: 'New simulated notification', data: {} };
  try { payload = { ...payload, ...(event.data ? event.data.json() : {}) }; } catch (_) {}
  const options = {
    body: payload.body || payload.message || '',
    icon: payload.icon,
    badge: payload.badge,
    tag: payload.tag || payload.notificationId || 'push-notification',
    renotify: true,
    timestamp: payload.timestamp || Date.now(),
    data: { ...(payload.data || {}), notificationId: payload.notificationId, url: payload.url || './' },
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };
  event.waitUntil(self.registration.showNotification(payload.title || payload.person || 'Notification Simulator', options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  const target = event.notification.data?.url || './';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if ('focus' in client) {
          client.navigate(target).catch(() => {});
          return client.focus();
        }
      }
      return clients.openWindow ? clients.openWindow(target) : undefined;
    })
  );
});

self.addEventListener('notificationclose', () => {});
