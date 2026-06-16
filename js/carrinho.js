/* ============================================
   AKINDO — Lógica da página de Carrinho
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  const itemsWrap = document.querySelector("#cart-items");
  const emptyWrap = document.querySelector("#cart-empty");
  const summaryWrap = document.querySelector("#cart-summary");
  const layoutWrap = document.querySelector("#cart-layout");

  const subtotalEl = document.querySelector("#summary-subtotal");
  const totalEl = document.querySelector("#summary-total");
  const countEl = document.querySelector("#summary-count");

  function formatBRL(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function render() {
    const cart = AkindoCart.getCart();

    if (cart.length === 0) {
      layoutWrap.classList.add("is-empty");
      emptyWrap.hidden = false;
      itemsWrap.hidden = true;
      summaryWrap.hidden = true;
      return;
    }

    layoutWrap.classList.remove("is-empty");
    emptyWrap.hidden = true;
    itemsWrap.hidden = false;
    summaryWrap.hidden = false;

    itemsWrap.innerHTML = cart
      .map((item) => {
        const lineTotal = item.price * item.qty;
        return `
        <article class="cart-item" data-id="${item.id}" data-variant="${item.variant || ""}">
          <div class="cart-item-media">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" onerror="this.remove();" />` : ""}
          </div>
          <div class="cart-item-info">
            <span class="cart-item-brand">${item.brand}</span>
            <h3 class="cart-item-name">${item.name}</h3>
            <span class="cart-item-price-mobile">${formatBRL(lineTotal)}</span>
          </div>
          <div class="cart-item-actions">
            <div class="qty-stepper" role="group" aria-label="Quantidade">
              <button type="button" data-action="decrease" aria-label="Diminuir quantidade">−</button>
              <span>${item.qty}</span>
              <button type="button" data-action="increase" aria-label="Aumentar quantidade">+</button>
            </div>
            <span class="cart-item-price-desktop">${formatBRL(lineTotal)}</span>
            <button class="cart-item-remove" type="button" data-action="remove">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6h12z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Remover
            </button>
          </div>
        </article>
      `;
      })
      .join("");

    bindItemEvents();
    renderSummary(cart);
  }

  function renderSummary(cart) {
    const subtotal = AkindoCart.getTotal();
    const count = AkindoCart.getCount();

    subtotalEl.textContent = formatBRL(subtotal);
    totalEl.textContent = formatBRL(subtotal);
    countEl.textContent = count === 1 ? "1 item" : `${count} itens`;
  }

  function bindItemEvents() {
    itemsWrap.querySelectorAll(".cart-item").forEach((el) => {
      const id = el.dataset.id;
      const variant = el.dataset.variant || null;

      el.querySelector("[data-action='increase']").addEventListener("click", () => {
        const item = AkindoCart.getCart().find((i) => i.id === id && i.variant === variant);
        AkindoCart.updateQty(id, variant, (item?.qty || 0) + 1);
        render();
      });

      el.querySelector("[data-action='decrease']").addEventListener("click", () => {
        const item = AkindoCart.getCart().find((i) => i.id === id && i.variant === variant);
        AkindoCart.updateQty(id, variant, (item?.qty || 0) - 1);
        render();
      });

      el.querySelector("[data-action='remove']").addEventListener("click", () => {
        el.classList.add("is-removing");
        setTimeout(() => {
          AkindoCart.removeItem(id, variant);
          render();
        }, 200);
      });
    });
  }

  render();
});

window.addEventListener("load", () => {
    document
        .getElementById("page-loader")
        ?.classList.add("hidden");
});