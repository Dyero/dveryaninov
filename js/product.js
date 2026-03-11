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
    });

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

  function initConfiguratorModal() {
    const modal = document.getElementById("configModal");
    if (!modal) return;

    const openBtn = document.querySelector("[data-open-config]");
    const closeControls = modal.querySelectorAll("[data-close-config]");
    const tabs = Array.from(modal.querySelectorAll("[data-step-tab]"));
    const steps = Array.from(modal.querySelectorAll(".config-step"));
    const nextButtons = modal.querySelectorAll("[data-next-step]");
    const prevButtons = modal.querySelectorAll("[data-prev-step]");
    const addToCartBtn = modal.querySelector("[data-add-to-cart]");

    function setStep(stepName) {
      tabs.forEach(tab => {
        const active = tab.getAttribute("data-step-tab") === stepName;
        tab.classList.toggle("modal__tab_active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
      });

      steps.forEach(step => {
        const active = step.getAttribute("data-step") === stepName;
        step.classList.toggle("config-step_active", active);
      });
    }

    function openModal() {
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setStep("config");
    }

    function closeModal() {
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    openBtn?.addEventListener("click", openModal);
    closeControls.forEach(node => node.addEventListener("click", closeModal));

    modal.addEventListener("keydown", e => {
      if (e.key === "Escape") closeModal();
    });

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const stepName = tab.getAttribute("data-step-tab");
        if (stepName) setStep(stepName);
      });
    });

    nextButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-next-step");
        if (target) setStep(target);
      });
    });

    prevButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-prev-step");
        if (target) setStep(target);
      });
    });

    modal.querySelectorAll(".config-detail-toggle").forEach(toggle => {
      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        const options = toggle.closest(".config-detail-item")?.querySelector(".config-detail-options");
        toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
        if (options) options.hidden = expanded;
      });
    });

    modal.querySelectorAll(".config-item__toggle").forEach(toggle => {
      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        const body = toggle.closest(".config-item")?.querySelector(".config-item__body");
        toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
        if (body) body.hidden = expanded;
      });
    });

    modal.addEventListener("click", e => {
      const chip = e.target.closest(".config-chip");
      if (!chip) return;

      const group = chip.getAttribute("data-pick");
      if (!group) return;

      modal.querySelectorAll(`.config-chip[data-pick="${group}"]`).forEach(node => {
        node.classList.remove("config-chip_active");
      });
      chip.classList.add("config-chip_active");

      const valueNode = chip.closest(".config-detail-item")?.querySelector(".config-detail-value");
      if (valueNode) {
        valueNode.textContent = chip.getAttribute("data-value") || chip.textContent.trim();
      }
    });

    function recalcConfigTotals() {
      let total = 52000;

      modal.querySelectorAll(".config-item").forEach(item => {
        const qtyInput = item.querySelector(".config-qty-input");
        const amountNode = item.querySelector(".config-item__amount");
        const totalAmountNode = item.querySelector(".total-amount");

        if (!qtyInput || !amountNode) return;

        const amount = Number.parseInt(amountNode.textContent.replace(/\D+/g, ""), 10);
        const qty = Number.parseInt(qtyInput.value, 10) || 0;
        if (Number.isNaN(amount)) return;

        const itemTotal = amount * qty;
        if (totalAmountNode) totalAmountNode.textContent = String(itemTotal);
        total += itemTotal;
      });

      const totalNode = modal.querySelector(".config-total-price");
      if (totalNode) totalNode.textContent = String(total);
    }

    modal.addEventListener("click", e => {
      const decBtn = e.target.closest("[data-qty-decrease]");
      const incBtn = e.target.closest("[data-qty-increase]");
      const trigger = decBtn || incBtn;
      if (!trigger) return;

      const item = trigger.closest(".config-item");
      const input = item?.querySelector(".config-qty-input");
      if (!input) return;

      const step = 1;
      const min = Number.parseInt(input.min || "0", 10);
      const current = Number.parseInt(input.value, 10) || 0;
      const next = decBtn ? Math.max(min, current - step) : current + step;
      input.value = String(next);
      recalcConfigTotals();
    });

    addToCartBtn?.addEventListener("click", closeModal);

    recalcConfigTotals();
  }

  initProductGallery();
  initSizeSelection();
  initColorSelection();
  initReviewReadMore();
  initShowAllReviews();
  initConfiguratorModal();
})();
