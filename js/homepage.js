/* ============================================
   AKINDO — Homepage: Carrossel, Bento, Marcas
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* -------- HERO CAROUSEL -------- */
  const track = document.querySelector(".hero-track");
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".hero-dot"));
  const prevBtn = document.querySelector(".hero-arrow.prev");
  const nextBtn = document.querySelector(".hero-arrow.next");

  let current = 0;
  let autoplayTimer = null;
  const AUTOPLAY_MS = 6000;

  function goToSlide(index) {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === current);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === current);
    });

    if (track) {
      track.style.transform = `translateX(-${current * 100}%)`;
    }
  }

  function nextSlide() {
    goToSlide(current + 1);
  }

  function restartAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_MS);
  }

  if (slides.length > 1) {
    goToSlide(0);
    restartAutoplay();

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        goToSlide(i);
        restartAutoplay();
      });
    });

    prevBtn?.addEventListener("click", () => {
      goToSlide(current - 1);
      restartAutoplay();
    });

    nextBtn?.addEventListener("click", () => {
      goToSlide(current + 1);
      restartAutoplay();
    });

    // Suporte a swipe (touch)
    let touchStartX = 0;
    track.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goToSlide(current - 1) : goToSlide(current + 1);
        restartAutoplay();
      }
    }, { passive: true });
  } else if (slides.length === 1) {
    slides[0].classList.add("is-active");
  }

  /* -------- TOAST -------- */
  const toast = document.querySelector("#toast");
  let toastTimer = null;

  function showToast(text) {
    if (!toast) return;
    toast.querySelector("span").textContent = text;
    toast.classList.add("is-visible");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  /* -------- FAIXA DE MARCAS -------- */
  const brandsRow = document.querySelector("#brands-row");
  if (brandsRow && typeof AKINDO_BRANDS !== "undefined") {
    brandsRow.innerHTML = AKINDO_BRANDS.map((brand) => {
      const isActive = brand.status === "Loja ativa";
      return `
        <a class="brand-card${isActive ? " is-active" : ""}" href="${brand.href}">
          <div class="curation-seal">
            <svg viewBox="0 0 56 56" aria-hidden="true">
              <polygon class="seal-hex" points="28,4 50,16 50,40 28,52 6,40 6,16" />
              <text x="28" y="33" text-anchor="middle" class="seal-num">${brand.seal}</text>
            </svg>
          </div>
          <div class="brand-card-swatch" style="background:${brand.color}1A; border:1px solid ${brand.color}33;"></div>
          <h3>${brand.name}</h3>
          <p class="brand-founder">por ${brand.founder}</p>
          <p class="brand-status">${brand.status}</p>
        </a>
      `;
    }).join("");
  }

  /* -------- BENTO GRID DE PRODUTOS -------- */
  const bentoGrid = document.querySelector("#bento-grid");
  if (bentoGrid && typeof AKINDO_FEATURED !== "undefined") {
    bentoGrid.innerHTML = AKINDO_FEATURED.map((product) => {
      return `
        <article class="bento-item size-${product.size} fade-in-up">
          <div
class="bento-item-bg"
style="
background-image:
linear-gradient(
rgba(15,23,42,0.15),
rgba(15,23,42,0.60)
),
url('${product.image}');
background-size: cover;
background-position: center;
">
</div>
          ${product.tag ? `<span class="bento-item-tag" style="position:relative; z-index:2; margin: var(--space-3) 0 0 var(--space-3); align-self:flex-start;">${product.tag}</span>` : ""}
          <button class="bento-item-add" type="button" aria-label="Adicionar ${product.name} ao carrinho"
            data-id="${product.id}" data-brand="${product.brand}" data-brand-slug="${product.brandSlug}"
            data-name="${product.name}" data-price="${product.price}">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M12 5v14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <div class="bento-item-content">
            <p class="bento-item-brand">${product.brand}</p>
            <h3>${product.name}</h3>
            <p class="bento-item-price">${formatBRL(product.price)}</p>
          </div>
        </article>
      `;
    }).join("");

    // Eventos de adicionar ao carrinho
    bentoGrid.querySelectorAll(".bento-item-add").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const { id, brand, brandSlug, name, price } = btn.dataset;

        AkindoCart.addItem({
          id,
          brand,
          brandSlug,
          name,
          price: parseFloat(price),
        });

        btn.classList.add("is-added");
        showToast(`${name} adicionado ao carrinho`);

        setTimeout(() => btn.classList.remove("is-added"), 1200);
      });
    });
  }

  /* -------- SCROLL REVEAL -------- */
  const revealEls = document.querySelectorAll(".fade-in-up");
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
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* -------- Utilitários -------- */
  function formatBRL(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  // Escurece/clareia uma cor hex (usado nos gradientes do bento)
  function shade(hex, percent) {
    const num = parseInt(hex.replace("#", ""), 16);
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00ff) + percent;
    let b = (num & 0x0000ff) + percent;
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
});

window.addEventListener("load", () => {
    document
        .getElementById("page-loader")
        ?.classList.add("hidden");
});