/* ============================================
   AKINDO — Carrinho (LocalStorage)
   Compartilhado entre AKINDO e páginas de marca
   ============================================ */

const AkindoCart = (function () {
  const STORAGE_KEY = "akindo_cart";

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    if (window.akindoUpdateCartBadge) window.akindoUpdateCartBadge();
    document.dispatchEvent(new CustomEvent("akindo:cart-updated", { detail: { cart } }));
  }

  function addItem(product, qty = 1) {
    const cart = getCart();
    const existing = cart.find(
      (item) => item.id === product.id && item.variant === (product.variant || null)
    );

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: product.id,
        brand: product.brand,
        brandSlug: product.brandSlug,
        name: product.name,
        price: product.price,
        image: product.image || null,
        variant: product.variant || null,
        qty,
      });
    }

    saveCart(cart);
    return cart;
  }

  function removeItem(id, variant = null) {
    const cart = getCart().filter(
      (item) => !(item.id === id && item.variant === variant)
    );
    saveCart(cart);
    return cart;
  }

  function updateQty(id, variant, qty) {
    const cart = getCart();
    const item = cart.find((i) => i.id === id && i.variant === variant);
    if (!item) return cart;

    if (qty <= 0) {
      return removeItem(id, variant);
    }

    item.qty = qty;
    saveCart(cart);
    return cart;
  }

  function clearCart() {
    saveCart([]);
  }

  function getTotal() {
    return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function getCount() {
    return getCart().reduce((sum, item) => sum + item.qty, 0);
  }

  function formatPrice(value) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return {
    getCart,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    getTotal,
    getCount,
    formatPrice,
  };
})();
