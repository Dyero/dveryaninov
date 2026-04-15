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

  // Panel type selection (solid/glazed)
  function initPanelTypeSelection() {
    const panelBtns = document.querySelectorAll(".product__panel-type");
    if (!panelBtns.length) return;

    panelBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const panelType = btn.getAttribute("data-panel-type");
        const priceModifier = Number(btn.getAttribute("data-price-modifier")) || 0;

        // Update active state
        panelBtns.forEach(b => b.classList.remove("product__size_active"));
        btn.classList.add("product__size_active");

        // Update option value
        const val = btn.closest(".product__option")?.querySelector(".product__option-value");
        if (val) val.textContent = btn.textContent.trim();

        // Update price
        updateProductPrice(priceModifier);

        // Update image if glazed
        if (panelType === "glazed") {
          updateProductImage(true);
        } else {
          updateProductImage(false);
        }
      });
    });
  }

  function updateProductPrice(modifier) {
    const priceEl = document.querySelector(".product__price");
    if (!priceEl) return;

    // Get base price from text
    const basePrice = getBasePrice();
    const newPrice = basePrice + modifier;

    priceEl.textContent = `от ${new Intl.NumberFormat("ru-RU").format(newPrice)} ₽`;
  }

  function getBasePrice() {
    const priceEl = document.querySelector(".product__price");
    if (!priceEl) return 18450;

    const text = priceEl.textContent || "0";
    const match = text.match(/\d[\d\s]*/);
    if (!match) return 18450;

    return Number(match[0].replace(/\s/g, "")) || 18450;
  }

  function updateProductImage(isGlazed) {
    const mainImg = document.querySelector(".product__main-image img");
    const thumbs = document.querySelectorAll(".product__thumb");

    if (!mainImg) return;

    // Get current image src
    let currentSrc = mainImg.getAttribute("src") || "";

    if (isGlazed) {
      // Replace "3.png" with "1.png" (glazed version) or add "ПГ" marker
      if (currentSrc.includes("3.png")) {
        currentSrc = currentSrc.replace("3.png", "1.png");
      }
    } else {
      // Replace back to solid version
      if (currentSrc.includes("1.png")) {
        currentSrc = currentSrc.replace("1.png", "3.png");
      }
    }

    mainImg.setAttribute("src", currentSrc);

    // Update thumbnails if they exist
    thumbs.forEach(thumb => {
      const thumbImg = thumb.querySelector("img");
      if (thumbImg) {
        let thumbSrc = thumbImg.getAttribute("src") || "";
        if (isGlazed) {
          thumbSrc = thumbSrc.replace("3.png", "1.png");
        } else {
          thumbSrc = thumbSrc.replace("1.png", "3.png");
        }
        thumbImg.setAttribute("src", thumbSrc);
      }
    });
  }

  // Size selection
  function initSizeSelection() {
    const sizes = document.querySelectorAll(".product__size:not(.product__panel-type)");
    sizes.forEach(btn => {
      if (btn.classList.contains("product__size_measure") || btn.classList.contains("product__size_own")) return;
      btn.addEventListener("click", () => {
        sizes.forEach(b => {
          if (!b.classList.contains("product__size_measure") && !b.classList.contains("product__size_own")) {
            b.classList.remove("product__size_active");
          }
        });
        btn.classList.add("product__size_active");
        const val = btn.closest(".product__option")?.querySelector(".product__option-value");
        if (val) val.textContent = btn.textContent.trim();
      });
    });
  }

  // Move selected color to first position with 64px gap
  function reorderProductColors(selectedBtn) {
    var container = selectedBtn.closest(".product__colors");
    if (!container) return;
    // Move selected to first child (before all other color buttons)
    var firstChild = container.firstElementChild;
    if (firstChild !== selectedBtn) {
      container.insertBefore(selectedBtn, firstChild);
    }
  }

  // Color selection
  function initColorSelection() {
    const colors = document.querySelectorAll(".product__color");
    colors.forEach(btn => {
      if (btn.classList.contains("product__color_more")) return;
      btn.addEventListener("click", () => {
        colors.forEach(b => { if (!b.classList.contains("product__color_more")) b.classList.remove("product__color_active"); });
        btn.classList.add("product__color_active");
        const val = document.querySelector(".product__option_coating .product__option-value");
        if (val && btn.getAttribute("title")) val.textContent = btn.getAttribute("title");
        // Move selected color to first position
        reorderProductColors(btn);
        // Sync with configurator if open
        syncCoatingToConfigurator(btn.getAttribute("aria-label") || btn.getAttribute("title"));
      });
    });
  }

  // Sync coating selection to configurator
  function syncCoatingToConfigurator(name) {
    const modal = document.getElementById("configModal");
    if (!modal) return;
    modal.querySelectorAll('.cfg-coating-swatch').forEach(sw => {
      sw.classList.toggle('cfg-coating-swatch_active', sw.getAttribute('data-coating') === name);
    });
    const hdr = modal.querySelector('#cfgCoatingsContainer')?.closest('.config-detail-item')?.querySelector('.config-detail-value');
    if (hdr) hdr.textContent = name;
  }

  // Sync coating selection from configurator to product page
  window.syncCoatingToPage = function(name) {
    const colors = document.querySelectorAll(".product__color");
    colors.forEach(b => {
      if (b.classList.contains("product__color_more")) return;
      b.classList.toggle("product__color_active", b.getAttribute("aria-label") === name);
    });
    const val = document.querySelector(".product__option_coating .product__option-value");
    if (val) val.textContent = name;
    // Find or create swatch
    let activeBtn = document.querySelector('.product__color[aria-label="' + name + '"]');
    if (!activeBtn) {
      // Find hex from coatings data
      var hex = "#ccc";
      var coatings = window.DVERYANINOV_COATINGS;
      if (coatings) {
        for (var i = 0; i < coatings.length; i++) {
          if (coatings[i][0] === name) { hex = coatings[i][1]; break; }
        }
      }
      activeBtn = document.createElement("button");
      activeBtn.type = "button";
      activeBtn.className = "product__color product__color_active";
      activeBtn.setAttribute("aria-label", name);
      activeBtn.title = name;
      activeBtn.style.cssText = "--color-swatch: " + hex + ";";
      activeBtn.innerHTML = '<span class="product__color-inner" style="background: ' + hex + ';"></span>';
      activeBtn.addEventListener("click", function() {
        document.querySelectorAll(".product__color").forEach(function(b) { if (!b.classList.contains("product__color_more")) b.classList.remove("product__color_active"); });
        this.classList.add("product__color_active");
        var v = document.querySelector(".product__option_coating .product__option-value");
        if (v) v.textContent = name;
        reorderProductColors(this);
        syncCoatingToConfigurator(name);
      });
      var container = document.querySelector(".product__colors");
      if (container) container.insertBefore(activeBtn, container.firstElementChild);
    }
    if (activeBtn) reorderProductColors(activeBtn);
  };

  // +83 coatings popup
  function initCoatingsPopup() {
    let popup = null;

    document.addEventListener("click", e => {
      const moreBtn = e.target.closest(".product__color_more");
      if (!moreBtn) {
        // Close popup on outside click
        if (popup && !e.target.closest(".coatings-popup")) {
          popup.remove();
          popup = null;
        }
        return;
      }

      if (popup) { popup.remove(); popup = null; return; }

      const coatings = window.DVERYANINOV_COATINGS;
      if (!coatings) return;

      const activeLabel = document.querySelector(".product__color_active")?.getAttribute("aria-label") || "";

      popup = document.createElement("div");
      popup.className = "coatings-popup";
      popup.innerHTML = '<div class="coatings-popup__header"><h3 class="coatings-popup__title">Все покрытия</h3><button type="button" class="coatings-popup__close" aria-label="Закрыть">&times;</button></div><div class="coatings-popup__body"></div>';

      const body = popup.querySelector(".coatings-popup__body");

      // Helper function to get coating type
      function getCoatingType(name) {
        if (/ПЭТ/i.test(name)) return "ПЭТ";
        if (/Эмаль/i.test(name) || name === "Белый лёд" || name === "Свой цвет по RAL и NCS") return "Эмаль";
        return "ПВХ";
      }

      // Group coatings by type
      const grouped = { "ПВХ": [], "ПЭТ": [], "Эмаль": [] };
      coatings.forEach(([name, hex, texture]) => {
        const type = getCoatingType(name);
        grouped[type].push([name, hex, texture]);
      });

      // Render each group
      ["ПВХ", "ПЭТ", "Эмаль"].forEach(type => {
        if (grouped[type].length === 0) return;

        const section = document.createElement("div");
        section.className = "coatings-popup__section";

        const heading = document.createElement("h4");
        heading.className = "coatings-popup__section-title";
        heading.textContent = type;
        section.appendChild(heading);

        const grid = document.createElement("div");
        grid.className = "coatings-popup__grid";

        grouped[type].forEach(([name, hex, texture]) => {
          const swatch = document.createElement("button");
          swatch.type = "button";
          swatch.className = "coatings-popup__swatch" + (name === activeLabel ? " coatings-popup__swatch_active" : "");
          swatch.setAttribute("aria-label", name);
          swatch.title = name;

          const colorEl = document.createElement("span");
          colorEl.className = "coatings-popup__color";
          if (texture) {
            colorEl.style.backgroundImage = `url(${texture})`;
            colorEl.style.backgroundSize = "cover";
            colorEl.style.backgroundPosition = "center";
          } else {
            colorEl.style.background = hex;
          }

          const nameEl = document.createElement("span");
          nameEl.className = "coatings-popup__name";
          nameEl.textContent = name;

          swatch.appendChild(colorEl);
          swatch.appendChild(nameEl);

          swatch.addEventListener("click", () => {
            popup.querySelectorAll(".coatings-popup__swatch").forEach(s => s.classList.remove("coatings-popup__swatch_active"));
            swatch.classList.add("coatings-popup__swatch_active");
            // Update product page color
            const pageColors = document.querySelectorAll(".product__color");
            pageColors.forEach(b => { if (!b.classList.contains("product__color_more")) b.classList.remove("product__color_active"); });
            // Find matching visible swatch or create one
            let matched = document.querySelector('.product__color[aria-label="' + name + '"]');
            if (!matched) {
              // Create a new swatch for this color
              matched = document.createElement("button");
              matched.type = "button";
              matched.className = "product__color";
              matched.setAttribute("aria-label", name);
              matched.title = name;
              matched.style.cssText = "--color-swatch: " + hex + ";";
              const inner = document.createElement("span");
              inner.className = "product__color-inner";
              if (texture) {
                inner.style.backgroundImage = `url(${texture})`;
                inner.style.backgroundSize = "cover";
                inner.style.backgroundPosition = "center";
              } else {
                inner.style.background = hex;
              }
              matched.appendChild(inner);
              matched.addEventListener("click", function() {
                document.querySelectorAll(".product__color").forEach(b => { if (!b.classList.contains("product__color_more")) b.classList.remove("product__color_active"); });
                this.classList.add("product__color_active");
                var v = document.querySelector(".product__option_coating .product__option-value");
                if (v) v.textContent = name;
                reorderProductColors(this);
                syncCoatingToConfigurator(name);
              });
              var colorsContainer = document.querySelector(".product__colors");
              if (colorsContainer) colorsContainer.insertBefore(matched, colorsContainer.firstElementChild);
            }
            matched.classList.add("product__color_active");
            const val = document.querySelector(".product__option_coating .product__option-value");
            if (val) val.textContent = name;
            // Move selected to first position
            reorderProductColors(matched);
            syncCoatingToConfigurator(name);
          });
          grid.appendChild(swatch);
        });

        section.appendChild(grid);
        body.appendChild(section);
      });

      popup.querySelector(".coatings-popup__close").addEventListener("click", () => { popup.remove(); popup = null; });

      moreBtn.closest(".product__colors")?.appendChild(popup);
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
  initPanelTypeSelection();
  initSizeSelection();
  initColorSelection();
  initCoatingsPopup();
  initReviewReadMore();
  initShowAllReviews();
  initMeasureModal();
  initCustomModal();

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

  function initCustomModal() {
    // Build a simple modal for "Свой размер" / "Свой цвет" on first click
    let customModal = null;
    function ensureModal() {
      if (customModal) return customModal;
      const div = document.createElement("div");
      div.className = "modal";
      div.id = "customRequestModal";
      div.setAttribute("aria-hidden", "true");
      div.setAttribute("role", "dialog");
      div.setAttribute("aria-modal", "true");
      div.innerHTML = `
        <div class="modal__backdrop" data-close-custom></div>
        <div class="modal__panel" style="width: min(480px, calc(100vw - 32px)); max-height: 520px; grid-template-rows: auto 1fr;">
          <div class="modal__header">
            <h2 class="modal__title" id="customModalTitle">Индивидуальный запрос</h2>
            <button class="modal__close" type="button" data-close-custom aria-label="Закрыть">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal__body" style="padding: 24px 16px; overflow-y: auto;">
            <p style="margin: 0 0 20px; font-size: 14px; color: #666; line-height: 1.5;" id="customModalDesc">Оставьте заявку, и наш менеджер свяжется с вами для уточнения деталей</p>
            <form id="customRequestForm" style="display: flex; flex-direction: column; gap: 14px;">
              <input type="text" name="name" placeholder="Ваше имя*" required style="width: 100%; padding: 14px 16px; border: 1px solid #ddd; font-size: 15px; font-family: inherit; box-sizing: border-box;">
              <input type="tel" name="phone" placeholder="Ваш телефон*" required style="width: 100%; padding: 14px 16px; border: 1px solid #ddd; font-size: 15px; font-family: inherit; box-sizing: border-box;">
              <textarea name="comment" placeholder="Укажите желаемые параметры" rows="3" style="width: 100%; padding: 14px 16px; border: 1px solid #ddd; font-size: 15px; font-family: inherit; resize: vertical; box-sizing: border-box;"></textarea>
              <button type="submit" class="btn btn_primary" style="width: 100%; padding: 16px; font-size: 15px; letter-spacing: 0.05em;">ОТПРАВИТЬ ЗАЯВКУ</button>
              <p style="margin: 0; font-size: 12px; color: #999; text-align: center;">Отправляя заявку, вы даёте согласие на обработку <a href="#" style="color: inherit; text-decoration: underline;">персональных данных</a></p>
            </form>
            <div id="customRequestSuccess" style="display: none; text-align: center; padding: 40px 0;">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style="margin-bottom: 16px;"><circle cx="24" cy="24" r="24" fill="#E8F5E9"/><path d="M15 25l6 6 12-14" stroke="#4CAF50" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <h3 style="margin: 0 0 8px; font-size: 18px;">Заявка отправлена!</h3>
              <p style="margin: 0; color: #666; font-size: 14px;">Мы свяжемся с вами в ближайшее рабочее время</p>
            </div>
          </div>
        </div>`;
      document.body.appendChild(div);
      customModal = div;

      div.querySelectorAll("[data-close-custom]").forEach(el => el.addEventListener("click", close));
      div.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
      const form = div.querySelector("#customRequestForm");
      const success = div.querySelector("#customRequestSuccess");
      if (form) {
        form.addEventListener("submit", e => {
          e.preventDefault();
          const data = Object.fromEntries(new FormData(form));
          data.page = window.location.pathname;
          data.product = document.querySelector(".product__title")?.textContent.trim() || "";
          console.log("[Индивидуальный запрос]", data);
          form.style.display = "none";
          if (success) success.style.display = "block";
          setTimeout(close, 3000);
        });
      }
      return div;
    }

    function open(title, desc) {
      const m = ensureModal();
      const t = m.querySelector("#customModalTitle");
      const d = m.querySelector("#customModalDesc");
      if (t) t.textContent = title;
      if (d) d.textContent = desc;
      // Reset form
      const form = m.querySelector("#customRequestForm");
      const success = m.querySelector("#customRequestSuccess");
      if (form) { form.style.display = ""; form.reset(); }
      if (success) success.style.display = "none";
      m.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function close() {
      if (customModal) {
        customModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
    }

    // Delegate clicks on size_own buttons
    document.addEventListener("click", e => {
      const sizeOwn = e.target.closest(".product__size_own");
      if (!sizeOwn) return;
      // Determine context by checking parent option label
      const label = sizeOwn.closest(".product__option")?.querySelector(".product__option-label")?.textContent || "";
      if (label.includes("Покрытие") || sizeOwn.closest(".product__colors")) {
        open("Свой цвет", "Укажите желаемый цвет или покрытие, и мы рассчитаем стоимость");
      } else {
        open("Свой размер", "Укажите необходимые размеры дверного полотна, и мы подберём решение");
      }
    });
  }

  // Restore selections from cart edit
  function restoreEditState() {
    var raw = localStorage.getItem("dveryaninov_edit_item");
    if (!raw) return;
    var data;
    try { data = JSON.parse(raw); } catch(e) { return; }
    if (!data || !data.item) return;

    // Check we're on a product page
    if (!document.querySelector(".product__title")) {
      // Not a product page — don't consume the edit state
      return;
    }

    var opts = data.item.options || {};

    // Normalize size strings for comparison (both Cyrillic х and × multiplication sign)
    function normSize(s) { return String(s || '').replace(/[хx×]/gi, '×'); }

    // Restore size selection
    if (opts.size) {
      var sizeBtns = document.querySelectorAll(".product__size");
      sizeBtns.forEach(function(btn) {
        if (btn.classList.contains("product__size_measure") || btn.classList.contains("product__size_own")) return;
        var match = normSize(btn.textContent.trim()) === normSize(opts.size);
        btn.classList.toggle("product__size_active", match);
      });
      var sizeVal = document.querySelector(".product__option-value");
      if (sizeVal) sizeVal.textContent = opts.size;
    }

    // Restore coating/finish selection
    if (opts.finish) {
      var colorBtns = document.querySelectorAll(".product__color");
      colorBtns.forEach(function(btn) {
        if (btn.classList.contains("product__color_more")) return;
        var lbl = btn.getAttribute("aria-label") || "";
        btn.classList.toggle("product__color_active", lbl === opts.finish);
      });
      var finishHeaders = document.querySelectorAll(".product__option-header");
      finishHeaders.forEach(function(h) {
        var lbl = h.querySelector(".product__option-label");
        if (lbl && lbl.textContent.includes("Покрытие")) {
          var val = h.querySelector(".product__option-value");
          if (val) val.textContent = opts.finish;
        }
      });
    }

    // Store edit index so configurator can update instead of add
    window._dvEditCartIndex = data.index;

    // Clear the edit marker
    localStorage.removeItem("dveryaninov_edit_item");

    // Auto-open configurator after page loads
    setTimeout(function() {
      var openBtn = document.querySelector("[data-open-config]");
      if (openBtn) openBtn.click();
    }, 300);
  }

  document.addEventListener("DOMContentLoaded", restoreEditState);
})();
