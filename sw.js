// Service Worker for MD Viewer PWA
const CACHE_NAME = 'md-viewer-v3';
const SHARED_CACHE = 'shared-files';

// Resources to cache on install for offline use
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  // CDN dependencies
  'https://cdn.jsdelivr.net/npm/marked@11/marked.min.js',
  'https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11/highlight.min.js',
  'https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11/styles/github-dark.min.css',
  'https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11/styles/github.min.css',
];

// ── Install: Pre-cache key resources ──
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// ── Activate: Clean old caches ──
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== SHARED_CACHE)
            .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: Intercept share-target POST and cache-first for other requests ──
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle share target POST
  if (request.method === 'POST' && url.pathname.endsWith('/')) {
    event.respondWith(handleSharePost(request));
    return;
  }

  // Cache-first for GET requests
  if (request.method === 'GET') {
    event.respondWith(handleGet(request));
  }
});

// ── Handle Share Target POST ──
async function handleSharePost(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const text = formData.get('text');

    if (file && file.name) {
      const content = await file.text();
      const cache = await caches.open(SHARED_CACHE);
      // Create a response with the file content and original filename
      const headers = new Headers({
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Filename': encodeURIComponent(file.name),
      });
      await cache.put('/shared-file', new Response(content, { headers }));
    } else if (text && typeof text === 'string' && text.trim()) {
      const cache = await caches.open(SHARED_CACHE);
      const headers = new Headers({
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Filename': encodeURIComponent('分享的文本.md'),
      });
      await cache.put('/shared-file', new Response(text, { headers }));
    }

    // Redirect to main page with shared flag
    return Response.redirect('./?shared=1', 303);
  } catch (err) {
    console.error('Share handler error:', err);
    return Response.redirect('./', 303);
  }
}

// ── Handle GET (cache-first) ──
async function handleGet(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    // Offline fallback
    return caches.match('./');
  }
}
