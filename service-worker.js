/* ============================================
   AKINDO — Service Worker (PWA)
   Cache de assets para funcionamento offline
   ============================================ */

const CACHE_NAME = "akindo-cache-v1";

const ASSETS_TO_CACHE = [
  "./html/homepage.html",
  "./html/login.html",
  "./html/happy-berry.html",
  "./html/carrinho.html",
  "./css/variables.css",
  "./css/header-footer.css",
  "./css/homepage.css",
  "./css/login.css",
  "./css/happy-berry.css",
  "./css/carrinho.css",
  "./js/header.js",
  "./js/cart.js",
  "./js/homepage.js",
  "./js/login.js",
  "./js/happy-berry.js",
  "./js/carrinho.js",
  "./js/brands-data.js",
  "./js/featured-data.js",
  "./js/happy-berry-data.js",
  "./manifest.json",
];

/* -------- Instalação: pré-cache dos arquivos essenciais -------- */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn("AKINDO SW: falha ao pré-cachear alguns assets", err);
      });
    })
  );
  self.skipWaiting();
});

/* -------- Ativação: limpa caches antigos -------- */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* -------- Fetch: cache-first com fallback de rede -------- */
self.addEventListener("fetch", (event) => {
  // Ignora requisições para Firebase / APIs externas
  if (
    event.request.method !== "GET" ||
    event.request.url.includes("googleapis.com") ||
    event.request.url.includes("gstatic.com") ||
    event.request.url.includes("firebaseio.com")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          // Cacheia novos recursos do mesmo domínio
          if (response.ok && event.request.url.startsWith(self.location.origin)) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Fallback simples para navegação offline
          if (event.request.mode === "navigate") {
            return caches.match("./html/homepage.html");
          }
        });
    })
  );
});
