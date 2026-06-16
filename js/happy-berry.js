/* ============================================
   Happy Berry — Loja: render de produtos e filtros
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#hb-products-grid");
  const filtersRow = document.querySelector("#hb-filters-row");
  const toast = document.querySelector("#toast");
  let toastTimer = null;

  if (!grid || typeof HAPPY_BERRY_PRODUCTS === "undefined") return;

  const categories = ["Todos", ...new Set(HAPPY_BERRY_PRODUCTS.map((p) => p.category))];
  let activeCategory = "Todos";

  function showToast(text) {
    if (!toast) return;
    toast.querySelector("span").textContent = text;
    toast.classList.add("is-visible");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  function formatBRL(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function renderFilters() {
    if (!filtersRow) return;
    filtersRow.innerHTML = categories
      .map(
        (cat) => `
        <button class="hb-filter-chip${cat === activeCategory ? " is-active" : ""}" data-category="${cat}" type="button">
          ${cat}
        </button>
      `
      )
      .join("");

    filtersRow.querySelectorAll(".hb-filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        activeCategory = chip.dataset.category;
        renderFilters();
        renderProducts();
      });
    });
  }

  function renderProducts() {
    const items =
      activeCategory === "Todos"
        ? HAPPY_BERRY_PRODUCTS
        : HAPPY_BERRY_PRODUCTS.filter((p) => p.category === activeCategory);

    grid.innerHTML = items
      .map(
        (product) => `
        <article class="hb-card fade-in-up">
          <div class="hb-card-media">
            ${product.tag ? `<span class="hb-card-tag">${product.tag}</span>` : ""}
            <img src="${product.image}" alt="${product.name}" loading="lazy"
              onerror="this.closest('.hb-card-media').style.background='linear-gradient(160deg, var(--hb-pink-soft) 0%, var(--hb-cream) 100%)'; this.remove();" />
            <button class="hb-card-quick" type="button" aria-label="Adicionar ${product.name} ao carrinho"
              data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5v14" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="hb-card-body">
            <span class="hb-card-category">${product.category}</span>
            <h3>${product.name}</h3>
            <p class="hb-card-price">${formatBRL(product.price)}</p>
          </div>
        </article>
      `
      )
      .join("");

    // Scroll reveal
    const revealEls = grid.querySelectorAll(".fade-in-up");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      revealEls.forEach((el) => observer.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }

    // Adicionar ao carrinho
    grid.querySelectorAll(".hb-card-quick").forEach((btn) => {
      btn.addEventListener("click", () => {
        const { id, name, price } = btn.dataset;
        AkindoCart.addItem({
          id,
          brand: "Happy Berry",
          brandSlug: "happy-berry",
          name,
          price: parseFloat(price),
          image: HAPPY_BERRY_PRODUCTS.find((p) => p.id === id)?.image || null,
        });

        btn.classList.add("is-added");
        showToast(`${name} adicionado ao carrinho`);
        setTimeout(() => btn.classList.remove("is-added"), 1200);
      });
    });
  }

  renderFilters();
  renderProducts();
});

window.addEventListener("load", () => {
    document
        .getElementById("page-loader")
        ?.classList.add("hidden");
});