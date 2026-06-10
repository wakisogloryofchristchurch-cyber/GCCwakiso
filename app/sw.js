// ============================================================
//  GCC Church PWA — Service Worker v2
//  Handles: caching, push notifications, scheduled alarms
//  Fixed for subfolder: /GCCwakiso/app/
// ============================================================

const CACHE_NAME   = 'gcc-church-v2';
const APP_BASE     = '/GCCwakiso/app/';
const STATIC_ASSETS = [
  APP_BASE,
  APP_BASE + 'index.html',
  APP_BASE + 'manifest.json',
  APP_BASE + 'firebase.js',
];

// ===== INSTALL =====
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

// ===== ACTIVATE =====
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ===== FETCH =====
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, clone)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});

// ===== PUSH NOTIFICATIONS (from Firebase Cloud Messaging) =====
self.addEventListener('push', event => {
  const data    = event.data ? event.data.json() : {};
  const title   = data.title || 'Glory of Christ Church';
  const options = {
    body:    data.body    || 'You have a new message.',
    icon:    data.icon    || APP_BASE + 'icons/icon-192.png',
    badge:   APP_BASE + 'icons/icon-72.png',
    tag:     data.tag     || 'gcc-push',
    vibrate: [300, 100, 300, 100, 300],
    data:    { url: data.url || APP_BASE },
    actions: [
      { action: 'open',    title: '✝️ Open App' },
      { action: 'dismiss', title: 'Dismiss'     }
    ],
    requireInteraction: data.requireInteraction || false,
    silent: false
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// ===== NOTIFICATION CLICK =====
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  const url = (event.notification.data && event.notification.data.url) || APP_BASE;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('/GCCwakiso/app') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ===== SCHEDULED ALARMS via postMessage =====
// The app sends { type: 'SCHEDULE_ALARM', id, title, body, fireAt, sound }
// We store them and check every minute

let scheduledAlarms = [];

self.addEventListener('message', event => {
  const msg = event.data;
  if (!msg || !msg.type) return;

  if (msg.type === 'SCHEDULE_ALARM') {
    // Remove existing alarm with same id
    scheduledAlarms = scheduledAlarms.filter(a => a.id !== msg.id);
    scheduledAlarms.push(msg);
    console.log('[SW] Alarm scheduled:', msg.id, 'at', new Date(msg.fireAt).toLocaleString());
    event.source && event.source.postMessage({ type: 'ALARM_SCHEDULED', id: msg.id });
  }

  if (msg.type === 'CANCEL_ALARM') {
    scheduledAlarms = scheduledAlarms.filter(a => a.id !== msg.id);
    console.log('[SW] Alarm cancelled:', msg.id);
  }

  if (msg.type === 'GET_ALARMS') {
    event.source && event.source.postMessage({ type: 'ALARMS_LIST', alarms: scheduledAlarms });
  }

  if (msg.type === 'SCHEDULE_DAILY_VERSE') {
    // Schedule daily verse — fires every day at specified hour:minute
    scheduledAlarms = scheduledAlarms.filter(a => a.id !== 'daily-verse');
    scheduledAlarms.push({
      type:    'SCHEDULE_ALARM',
      id:      'daily-verse',
      title:   '📖 Daily Bible Verse',
      body:    msg.verse || 'Open the app for today\'s verse.',
      daily:   true,
      hour:    msg.hour   || 7,
      minute:  msg.minute || 0,
      fireAt:  getNextFireTime(msg.hour || 7, msg.minute || 0),
      sound:   true
    });
    console.log('[SW] Daily verse scheduled at', msg.hour + ':' + String(msg.minute).padStart(2,'0'));
  }
});

function getNextFireTime(hour, minute) {
  const now  = new Date();
  const fire = new Date();
  fire.setHours(hour, minute, 0, 0);
  if (fire <= now) fire.setDate(fire.getDate() + 1); // next day if already passed
  return fire.getTime();
}

// Check alarms every 30 seconds
setInterval(() => {
  const now = Date.now();
  scheduledAlarms.forEach((alarm, index) => {
    if (alarm.fireAt && now >= alarm.fireAt) {
      // Fire the notification
      self.registration.showNotification(alarm.title, {
        body:    alarm.body,
        icon:    APP_BASE + 'icons/icon-192.png',
        badge:   APP_BASE + 'icons/icon-72.png',
        tag:     alarm.id,
        vibrate: [500, 200, 500, 200, 500],
        requireInteraction: true,
        silent:  false,
        data:    { url: APP_BASE, alarmId: alarm.id }
      });

      // If daily, reschedule for next day
      if (alarm.daily) {
        scheduledAlarms[index].fireAt = getNextFireTime(alarm.hour, alarm.minute);
      } else {
        // One-time: remove it
        scheduledAlarms.splice(index, 1);
      }
    }
  });
}, 30000);
