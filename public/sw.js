// Soundify PWA Service Worker v7
// Fixes: Android 8 compat, no heavy banners, CDN caching, robust navigation
const CACHE_NAME = 'soundify-pwa-v7';

const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/logo-192.png',
  '/logo-512.png',
  '/favicon.ico',
  '/app.js',
  '/home.js',
  '/player.js',
  '/search.js',
  '/miniplayer.js',
  '/fullplayer.js',
  '/artist.js',
  '/album.js',
  '/rating.js'
  // Banner (1.3MB) DIHAPUS dari pre-cache — terlalu besar, bikin install lambat → ANR
];

// CDN kritis: harus di-cache agar app bisa buka saat koneksi lambat
var CDN_ASSETS = [
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest'
];

// ── INSTALL ──────────────────────────────────────────────────────────────────
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // Cache asset lokal satu per satu — jika satu gagal, lanjut yang lain
      var localPromises = ASSETS.map(function(asset) {
        return cache.add(asset).catch(function(err) {
          console.warn('[SW] Skip asset:', asset, err.message);
        });
      });

      return Promise.all(localPromises).then(function() {
        // Cache CDN scripts setelah asset lokal — non-blocking per item
        var cdnPromises = CDN_ASSETS.map(function(url) {
          return fetch(url, { mode: 'cors' }).then(function(response) {
            if (response && response.ok) {
              return cache.put(url, response);
            }
          }).catch(function(err) {
            console.warn('[SW] Skip CDN:', url, err.message);
          });
        });
        return Promise.all(cdnPromises);
      });
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// ── ACTIVATE ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(key) {
          if (key !== CACHE_NAME) {
            console.log('[SW] Hapus cache lama:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// ── FETCH ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  var url = new URL(event.request.url);

  // 1. API calls → langsung ke network, JANGAN di-cache
  if (url.pathname.indexOf('/api/') === 0) return;

  // 2. Navigasi (buka dari home screen / klik link) → cache-first
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then(function(cached) {
        if (cached) {
          // Serve cache seketika, update di background
          fetch(event.request).then(function(fresh) {
            if (fresh && fresh.ok) {
              caches.open(CACHE_NAME).then(function(cache) {
                cache.put('/index.html', fresh.clone());
                cache.put('/', fresh.clone());
              });
            }
          }).catch(function() {});
          return cached;
        }

        // Belum ada di cache → ambil dari network
        return fetch(event.request).then(function(fresh) {
          if (fresh && fresh.ok) {
            var copy = fresh.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put('/index.html', copy);
              cache.put('/', copy.clone());
            });
          }
          return fresh;
        }).catch(function() {
          // Fallback offline page — hindari blank screen / crash
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8">' +
            '<meta name="viewport" content="width=device-width,initial-scale=1">' +
            '<title>Soundify - Offline</title>' +
            '<style>body{font-family:sans-serif;display:flex;flex-direction:column;' +
            'align-items:center;justify-content:center;height:100vh;margin:0;' +
            'background:#0b0a12;color:#fff;text-align:center;gap:12px}' +
            'h2{margin:0}p{margin:0;opacity:.6;font-size:14px}' +
            'button{margin-top:8px;padding:10px 24px;border-radius:99px;border:none;' +
            'background:#6366f1;color:#fff;font-size:14px;cursor:pointer}</style></head>' +
            '<body><h2>📶 Tidak Ada Koneksi</h2>' +
            '<p>Soundify butuh internet pertama kali dibuka.</p>' +
            '<button onclick="location.reload()">Coba Lagi</button></body></html>',
            { status: 200, headers: { 'Content-Type': 'text/html;charset=utf-8' } }
          );
        });
      })
    );
    return;
  }

  // 3. CDN (Tailwind, Lucide) → cache-first, update di background
  if (url.origin !== location.origin) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        if (cached) return cached;
        return fetch(event.request).then(function(fresh) {
          if (fresh && fresh.ok) {
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, fresh.clone());
            });
          }
          return fresh;
        }).catch(function() { return undefined; });
      })
    );
    return;
  }

  // 4. Asset lokal (JS, CSS, gambar) → cache-first + ignoreSearch untuk ?v=28
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(function(cached) {
      // Stale-while-revalidate: langsung return cache, update di background
      fetch(event.request).then(function(fresh) {
        if (fresh && fresh.ok && fresh.type === 'basic') {
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, fresh.clone());
          });
        }
      }).catch(function() {});

      return cached || fetch(event.request).then(function(fresh) {
        if (fresh && fresh.ok && fresh.type === 'basic') {
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, fresh.clone());
          });
        }
        return fresh;
      });
    })
  );
});
