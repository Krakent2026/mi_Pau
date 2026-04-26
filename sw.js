/* Service Worker — Mi PAU 2026
 * Estrategia: cache-first para shell, network-first para CDN.
 */
const VERSION = "v2.0.0-personal";
const CACHE = `pau-shell-${VERSION}`;

const SHELL = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/data.js",
  "./js/exams.js",
  "./js/flashcards.js",
  "./js/tests.js",
  "./js/grados.js",
  "./js/logros.js",
  "./js/ia.js",
  "./js/adjuntos.js",
  "./js/extras.js",
  "./js/app.js",
  "./manifest.webmanifest"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // No cachear las llamadas a APIs de IA ni POSTs
  if (e.request.method !== "GET") return;
  if (/api\.(openai|anthropic|groq|openrouter)\.com|generativelanguage\.googleapis\.com/.test(url.host)) return;
  // No cachear backend Supabase ni Stripe
  if (/\.supabase\.co$|stripe\.com$|m\.stripe\./.test(url.host)) return;

  // CDN (PDF.js, Mammoth) → network-first
  if (/jsdelivr\.net|cdnjs\.cloudflare\.com|unpkg\.com/.test(url.host)) {
    e.respondWith(
      fetch(e.request)
        .then((r) => {
          const clone = r.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
          return r;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // App shell → cache-first
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).then((r) => {
      if (r.ok && url.origin === location.origin) {
        const clone = r.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
      }
      return r;
    }).catch(() => caches.match("./index.html")))
  );
});
