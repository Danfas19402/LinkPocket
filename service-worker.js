
const CACHE_NAME = "linkpocket-v1";

const ARQUIVOS = [
  "./",
  "./index.html"
];

// Instala o Service Worker
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ARQUIVOS);
    })
  );

  self.skipWaiting();
});

// Ativa e limpa caches antigos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(nomes => {
      return Promise.all(
        nomes
          .filter(nome => nome !== CACHE_NAME)
          .map(nome => caches.delete(nome))
      );
    })
  );

  self.clients.claim();
});

// Busca arquivos e permite fallback offline
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(() => {
      if (event.request.mode === "navigate") {
        return caches.match("./index.html");
      }

      return caches.match(event.request);
    })
  );
});
