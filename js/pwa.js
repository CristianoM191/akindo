/* ============================================
   AKINDO — Registro do Service Worker (PWA)
   Pode ser importado como módulo ou script normal
   ============================================ */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Detecta profundidade do caminho para achar o SW na raiz
    const depth = window.location.pathname.split("/").length - 1;
    const swPath = depth > 2 ? "../service-worker.js" : "./service-worker.js";
    navigator.serviceWorker.register(swPath).catch(() => {});
  });
}
