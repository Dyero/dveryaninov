(() => {
  // Gallery
  function initProductGallery() {
    const gallery = document.querySelector(".product__gallery");
    if (!gallery) return;

    const mainImg = gallery.querySelector(".product__main-image img");
    const mainContainer = gallery.querySelector(".product__main-image");
    const thumbsContainer = gallery.querySelector(".product__thumbs");
    const thumbs = Array.from(gallery.querySelectorAll(".product__thumb"));

    if (!mainImg || !thumbs.length) return;

    let currentIndex = Math.max(0, thumbs.findIndex(b => b.classList.contains("product__thumb_active")));

    function setIndex(idx) {
      const total = thumbs.length;
      currentIndex = ((idx % total) + total) % total;
      thumbs.forEach((btn, i) => {
        const active = i === currentIndex;
        btn.classList.toggle("product__thumb_active", active);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
        btn.setAttribute("tabindex", active ? "0" : "-1");
      });
      const src = thumbs[currentIndex]?.querySelector("img")?.getAttribute("src");
      const alt = thumbs[currentIndex]?.querySelector("img")?.getAttribute("alt") || "";
      if (src) { mainImg.src = src; mainImg.alt = alt; }
    }

    setIndex(currentIndex);

    thumbsContainer?.addEventListener("click", e => {
      const btn = e.target.closest(".product__thumb");
      if (btn) setIndex(thumbs.indexOf(btn));
    });

    mainContainer?.addEventListener("click", e => {
      if (e.target.closest(".product__arrow_prev")) { e.preventDefault(); setIndex(currentIndex - 1); }
      else if (e.target.closest(".product__arrow_next")) { e.preventDefault(); setIndex(currentIndex + 1); }
      else if (e.target === mainImg) { openLightbox(mainImg.src, mainImg.alt); }
    });

    // Fullscreen lightbox
    let lightbox = document.querySelector(".product-lightbox");
    if (!lightbox) {
      lightbox = document.createElement("div");
      lightbox.className = "product-lightbox";
      lightbox.innerHTML = '<img class="product-lightbox__img" alt="">';
      document.body.appendChild(lightbox);
      lightbox.addEventListener("click", () => {
        lightbox.classList.remove("is-open");
      });
    }
    const lbImg = lightbox.querySelector(".product-lightbox__img");
    function openLightbox(src, alt) {
      lbImg.src = src;
      lbImg.alt = alt || "";
      lightbox.classList.add("is-open");
    }

    document.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft")  { e.preventDefault(); setIndex(currentIndex - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); setIndex(currentIndex + 1); }
    });
  }

  // Size selection
  function initSizeSelection() {
    const sizes = document.querySelectorAll(".product__size");
    sizes.forEach(btn => {
      if (btn.classList.contains("product__size_measure")) return;
      btn.addEventListener("click", () => {
        sizes.forEach(b => { if (!b.classList.contains("product__size_measure")) b.classList.remove("product__size_active"); });
        btn.classList.add("product__size_active");
        const val = btn.closest(".product__option")?.querySelector(".product__option-value");
        if (val) val.textContent = btn.textContent.trim();
      });
    });
  }

  // Color selection
  function initColorSelection() {
    const colors = document.querySelectorAll(".product__color");
    colors.forEach(btn => {
      if (btn.classList.contains("product__color_more")) return;
      btn.addEventListener("click", () => {
        colors.forEach(b => { if (!b.classList.contains("product__color_more")) b.classList.remove("product__color_active"); });
        btn.classList.add("product__color_active");
        const val = btn.closest(".product__option")?.querySelector(".product__option-value");
        if (val && btn.getAttribute("title")) val.textContent = btn.getAttribute("title");
      });
    });
  }

  // Read more in reviews
  function initReviewReadMore() {
    document.querySelectorAll(".review__read-more").forEach(btn => {
      btn.addEventListener("click", () => {
        const clipped = btn.previousElementSibling;
        if (!clipped) return;
        clipped.classList.remove("review__text_clipped");
        btn.remove();
      });
    });
  }

  // Show all reviews button (scroll to section)
  function initShowAllReviews() {
    const btn = document.querySelector(".product-reviews__show-all");
    if (!btn) return;
    btn.addEventListener("click", () => {
      document.querySelector(".product-section_reviews")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  initProductGallery();
  initSizeSelection();
  initColorSelection();
  initReviewReadMore();
  initShowAllReviews();
  initMeasureModal();

  function initMeasureModal() {
    const modal = document.getElementById("measureModal");
    if (!modal) return;

    const form = document.getElementById("measureForm");
    const success = document.getElementById("measureSuccess");

    function open() { modal.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
    function close() { modal.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }

    document.querySelectorAll(".product__size_measure").forEach(btn => btn.addEventListener("click", open));
    modal.querySelectorAll("[data-close-measure]").forEach(el => el.addEventListener("click", close));
    modal.addEventListener("keydown", e => { if (e.key === "Escape") close(); });

    if (form) {
      form.addEventListener("submit", e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        data.page = window.location.pathname;
        data.product = document.querySelector(".product__title")?.textContent.trim() || "";
        console.log("[Замер] Заявка:", data);
        form.style.display = "none";
        if (success) success.style.display = "block";
        setTimeout(close, 3000);
      });
    }
  }
})();
