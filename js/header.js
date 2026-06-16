/* ============================================
   AKINDO — Comportamento do Header (global)
   ============================================ */

(function () {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  // Sombra ao rolar
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Menu mobile
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("is-open");
      menuToggle.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("is-open");
        menuToggle.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  // Atualiza badge do carrinho com base no localStorage
  function updateCartBadge() {
    const badge = document.querySelector("[data-cart-count]");
    if (!badge) return;
    try {
      const cart = JSON.parse(localStorage.getItem("akindo_cart") || "[]");
      const total = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
      badge.textContent = total;
      badge.hidden = total === 0;
    } catch (e) {
      badge.hidden = true;
    }
  }

  updateCartBadge();
  window.addEventListener("storage", updateCartBadge);
  window.akindoUpdateCartBadge = updateCartBadge;
})();

window.addEventListener("load", () => {
    document
        .getElementById("page-loader")
        ?.classList.add("hidden");
});