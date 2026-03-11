(() => {
  const CART_KEY = "dveryaninov_cart_v1";

  function safeJsonParse(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function getCart() {
    return safeJsonParse(localStorage.getItem(CART_KEY) || "[]", []);
  }

  function setCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  function addToCart(item) {
    const items = getCart();
    items.push(item);
    setCart(items);
  }

  function formatPriceRub(value) {
    const n = Number(value) || 0;
    return new Intl.NumberFormat("ru-RU").format(n);
  }

  function openModal(modal) {
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
  }

  function closeModal(modal) {
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
  }

  function initProductSelections() {
    // Handle size selection on quick product page
    const sizeButtons = document.querySelectorAll(".product__size");
    sizeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // Skip link elements (custom sizes)
        if (btn.tagName === "A") {
          return;
        }
        
        e.preventDefault();
        sizeButtons.forEach((b) => {
          if (b.tagName !== "A") {
            b.classList.remove("product__size_active");
          }
        });
        btn.classList.add("product__size_active");
        
        const optionValue = btn.closest(".product__option")?.querySelector(".product__option-value");
        if (optionValue) {
          optionValue.textContent = btn.textContent.trim();
        }
      });
    });

    // Handle color selection on quick product page
    const colorButtons = document.querySelectorAll(".product__color");
    colorButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (btn.classList.contains("product__color_more") || btn.classList.contains("product__color_custom")) {
          return;
        }
        
        e.preventDefault();
        colorButtons.forEach((b) => {
          if (!b.classList.contains("product__color_more") && !b.classList.contains("product__color_custom")) {
            b.classList.remove("product__color_active");
          }
        });
        btn.classList.add("product__color_active");
        
        const optionValue = btn.closest(".product__option")?.querySelector(".product__option-value");
        if (optionValue && btn.hasAttribute("aria-label")) {
          const colorName = btn.getAttribute("aria-label");
          optionValue.textContent = colorName;
        }
      });
    });
  }

  const BASE_PRICE = 52000;

  function initConfigurator() {
    const modal = document.getElementById("configModal");
    if (!modal) return;

    const state = {
      // Шаг 1
      box: "Телескопический",
      casing: "Телеско +",
      quantity: "5 шт",
      "height-add": "100 мм",
      threshold: "Без порога",
      // Шаг 2
      size: "2000×600",
      finish: "RAL 9003",
      glazing: "Стекло 1",
      pattern: "Узор 1",
      opening: "Распашная",
      "opening-type": "Схема 1",
      // Шаг 3
      "handle-color": "Белый",
      "lock-type": "Нажимное модели",
      "lock-color": "Белый",
      locker: "Завертка (WC)",
      hinges: "Скрытые",
      "hinges-color": "Белый",
      stopper: "Напольный",
    };

    function calcItemTotal(item) {
      const priceText = item?.querySelector(".config-item__amount")?.textContent || "0";
      const price = Number(priceText.replace(/\s/g, "")) || 0;
      const input = item?.querySelector(".config-qty-input");
      const qty = Math.max(0, Number(input?.value) || 0);
      return price * qty;
    }

    function updateItemTotal(item) {
      const total = calcItemTotal(item);
      const totalAmount = item?.querySelector(".total-amount");
      if (totalAmount) {
        totalAmount.textContent = formatPriceRub(total);
      }
      updateConfigTotal();
    }

    function syncStateFromPage() {
      // Sync size from quick selection
      const activeSize = document.querySelector(".product__size_active");
      if (activeSize && activeSize.textContent.trim()) {
        state.size = activeSize.textContent.trim();
      }

      // Sync finish (color) from quick selection
      const activeColor = document.querySelector(".product__color_active");
      if (activeColor && activeColor.hasAttribute("aria-label")) {
        const colorLabel = activeColor.getAttribute("aria-label");
        // Extract just the RAL code or color name
        const matches = colorLabel.match(/RAL \d+|Дуб|Венге|Орех/);
        if (matches) {
          state.finish = matches[0];
        }
      }
    }

    function setStep(step) {
      modal.querySelectorAll("[data-step]").forEach((el) => {
        el.classList.toggle("config-step_active", el.getAttribute("data-step") === step);
      });
      modal.querySelectorAll("[data-step-tab]").forEach((btn) => {
        const active = btn.getAttribute("data-step-tab") === step;
        btn.classList.toggle("modal__tab_active", active);
        btn.setAttribute("aria-selected", active ? "true" : "false");
      });
    }

    function initModalSelection() {
      // Синхронизируем все чипы с текущим состоянием
      modal.querySelectorAll("[data-pick][data-value]").forEach((chip) => {
        const pick = chip.getAttribute("data-pick");
        const value = chip.getAttribute("data-value");
        
        if (state[pick] === value) {
          chip.classList.add("config-chip_active");
          
          // Обновляем значение в заголовке
          const header = chip.closest(".config-detail-item")?.querySelector(".config-detail-header");
          if (header) {
            const valueSpan = header.querySelector(".config-detail-value");
            if (valueSpan) {
              valueSpan.textContent = value;
            }
          }
          
          // Раскрываем блок если есть выбранный чип
          const parent = chip.closest(".config-detail-options");
          if (parent) {
            const toggle = parent.previousElementSibling?.querySelector(".config-detail-toggle");
            if (toggle) {
              toggle.setAttribute("aria-expanded", "true");
              parent.hidden = false;
            }
          }
        } else {
          chip.classList.remove("config-chip_active");
        }
      });
    }

    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      // Раскрытие/схлопывание detail-toggle
      const detailToggle = target.closest(".config-detail-toggle");
      if (detailToggle) {
        const isExpanded = detailToggle.getAttribute("aria-expanded") === "true";
        detailToggle.setAttribute("aria-expanded", isExpanded ? "false" : "true");
        
        const options = detailToggle.closest(".config-detail-header")?.nextElementSibling;
        if (options) {
          options.hidden = isExpanded;
        }
        return;
      }

      // Раскрытие/схлопывание item-toggle
      const itemToggle = target.closest(".config-item__toggle");
      if (itemToggle) {
        const isExpanded = itemToggle.getAttribute("aria-expanded") === "true";
        itemToggle.setAttribute("aria-expanded", isExpanded ? "false" : "true");
        
        const body = itemToggle.closest(".config-item")?.querySelector(".config-item__body");
        if (body) {
          body.hidden = isExpanded;
        }
        return;
      }

      // Кнопки изменения количества
      const qtyBtn = target.closest("[data-qty-decrease], [data-qty-increase]");
      if (qtyBtn) {
        const input = qtyBtn.closest(".config-item__qty")?.querySelector(".config-qty-input");
        if (input) {
          const curr = Number(input.value) || 0;
          input.value = qtyBtn.hasAttribute("data-qty-decrease")
            ? Math.max(0, curr - 1)
            : curr + 1;
          updateItemTotal(qtyBtn.closest(".config-item"));
        }
        return;
      }

      if (target.closest("[data-open-config]")) {
        syncStateFromPage();
        openModal(modal);
        initModalSelection();
        setStep("config");
        return;
      }

      if (target.closest("[data-close-config]")) {
        closeModal(modal);
        return;
      }

      const next = target.closest("[data-next-step]");
      if (next) {
        setStep(next.getAttribute("data-next-step"));
        return;
      }

      const prev = target.closest("[data-prev-step]");
      if (prev) {
        setStep(prev.getAttribute("data-prev-step"));
        return;
      }

      const tab = target.closest("[data-step-tab]");
      if (tab) {
        setStep(tab.getAttribute("data-step-tab"));
        return;
      }

      const chip = target.closest("[data-pick][data-value]");
      if (chip) {
        const pick = chip.getAttribute("data-pick");
        const value = chip.getAttribute("data-value");
        state[pick] = value;

        // Обновляем группу чипов в detail-options
        const optionsGroup = chip.closest(".config-detail-options");
        if (optionsGroup) {
          optionsGroup.querySelectorAll(".config-chip").forEach((b) => b.classList.remove("config-chip_active"));
          chip.classList.add("config-chip_active");
        }
        
        // Обновляем значение в header
        const header = chip.closest(".config-detail-item")?.querySelector(".config-detail-header");
        if (header) {
          const valueSpan = header.querySelector(".config-detail-value");
          if (valueSpan) {
            valueSpan.textContent = value;
          }
        }
        return;
      }

      if (target.closest("[data-add-to-cart]")) {
        const titleEl = document.querySelector(".product__title");
        const priceEl = document.querySelector(".product__price");
        const imgEl = document.querySelector(".product__main-image img");

        const title = titleEl ? titleEl.textContent.trim() : "Товар";
        const priceText = priceEl ? priceEl.textContent : "0";
        const basePrice = Number((priceText.match(/\d[\d\s]*/)?.[0] || "0").replace(/\s/g, ""));

        // Получаем цену с конфигуратора
        const configTotalText = modal?.querySelector(".config-total-price")?.textContent || "0";
        const totalPrice = Number(configTotalText.replace(/\s/g, "")) || basePrice;

        addToCart({
          id: `p-${Date.now()}`,
          title,
          price: totalPrice,
          image: imgEl ? imgEl.getAttribute("src") : "",
          qty: 1,
          options: { ...state },
        });

        closeModal(modal);
        window.location.href = "cart.html";
      }
    });

    // Обработка изменения количества через ввод с клавиатуры
    modal?.addEventListener("input", (e) => {
      if (e.target.classList.contains("config-qty-input")) {
        e.target.value = Math.max(0, Number(e.target.value) || 0);
        updateItemTotal(e.target.closest(".config-item"));
      }
    });

    function updateConfigTotal() {
      const itemsTotal = Array.from(modal?.querySelectorAll(".config-item") || [])
        .reduce((sum, item) => sum + calcItemTotal(item), 0);
      const totalPriceEl = modal?.querySelector(".config-total-price");
      if (totalPriceEl) {
        totalPriceEl.textContent = formatPriceRub(BASE_PRICE + itemsTotal);
      }
    }

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (modal.getAttribute("aria-hidden") === "false") closeModal(modal);
    });
  }

  function initCartPage() {
    const cartRoot = document.querySelector(".cart");
    if (!cartRoot) return;

    const itemsWrap = cartRoot.querySelector(".cart__items");
    const summaryTotal = cartRoot.querySelector(".cart-summary__pay");
    const summarySum = cartRoot.querySelector(".cart-summary__sum");

    if (!itemsWrap) return;

    const items = getCart();
    if (!items.length) return;

    itemsWrap.innerHTML = "";

    let total = 0;
    let count = 0;

    items.forEach((it) => {
      const lineTotal = (Number(it.price) || 0) * (Number(it.qty) || 1);
      total += lineTotal;
      count += Number(it.qty) || 1;

      const details = it.options
        ? Object.entries(it.options)
            .map(([k, v]) => `${k}: ${v}`)
            .join(" • ")
        : "";

      const article = document.createElement("article");
      article.className = "cart-item";
      article.innerHTML = `
        <div class="cart-item__image-wrap">
          <img class="cart-item__image" src="${it.image || "images/card-door-1.svg"}" alt="" width="120" height="120">
        </div>
        <div class="cart-item__info">
          <h3 class="cart-item__title">${it.title || "Товар"}</h3>
          <div class="cart-item__details">
            <span class="cart-item__detail">${details || "Комплектация: по выбору"}</span>
          </div>
        </div>
        <div class="cart-item__quantity">
          <button type="button" class="cart-item__qty-btn" aria-label="Уменьшить" data-cart-dec="${it.id}">−</button>
          <input type="number" class="cart-item__qty-input" value="${it.qty || 1}" min="1" readonly>
          <button type="button" class="cart-item__qty-btn" aria-label="Увеличить" data-cart-inc="${it.id}">+</button>
        </div>
        <div class="cart-item__price">
          <span class="cart-item__price-value">${formatPriceRub(lineTotal)}</span>
          <span class="cart-item__currency">₽</span>
        </div>
        <button type="button" class="cart-item__remove" aria-label="Удалить товар" data-cart-remove="${it.id}">×</button>
      `;
      itemsWrap.appendChild(article);
    });

    const totalText = `${formatPriceRub(total)} ₽`;
    if (summaryTotal) summaryTotal.textContent = totalText;
    if (summarySum) summarySum.textContent = totalText;

    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;

      const itemsNow = getCart();
      const removeId = t.getAttribute("data-cart-remove");
      const incId = t.getAttribute("data-cart-inc");
      const decId = t.getAttribute("data-cart-dec");

      let changed = false;
      if (removeId) {
        setCart(itemsNow.filter((x) => x.id !== removeId));
        changed = true;
      } else if (incId) {
        const x = itemsNow.find((x) => x.id === incId);
        if (x) x.qty = (Number(x.qty) || 1) + 1;
        setCart(itemsNow);
        changed = true;
      } else if (decId) {
        const x = itemsNow.find((x) => x.id === decId);
        if (x) x.qty = Math.max(1, (Number(x.qty) || 1) - 1);
        setCart(itemsNow);
        changed = true;
      }

      if (changed) window.location.reload();
    });
  }

  function initProductGallery() {
    const gallery = document.querySelector(".product__gallery");
    if (!gallery) return;

    const mainImg = gallery.querySelector(".product__main-image img");
    const mainContainer = gallery.querySelector(".product__main-image");
    const thumbsContainer = gallery.querySelector(".product__thumbs");
    const thumbs = Array.from(gallery.querySelectorAll(".product__thumb"));

    if (!mainImg || !thumbs.length) return;

    let currentIndex = thumbs.findIndex((btn) => btn.classList.contains("product__thumb_active"));
    if (currentIndex < 0) currentIndex = 0;

    function setIndex(idx) {
      const total = thumbs.length;
      if (!total) return;
      
      currentIndex = (idx + total) % total;

      thumbs.forEach((btn, i) => {
        const isActive = i === currentIndex;
        btn.classList.toggle("product__thumb_active", isActive);
        btn.setAttribute("aria-pressed", isActive ? "true" : "false");
        btn.setAttribute("tabindex", isActive ? "0" : "-1");
      });

      const activeImg = thumbs[currentIndex]?.querySelector("img");
      if (activeImg) {
        const newSrc = activeImg.getAttribute("src");
        if (newSrc) {
          mainImg.src = newSrc;
          mainImg.alt = activeImg.getAttribute("alt") || "";
        }
      }
    }

    setIndex(currentIndex);

    thumbsContainer?.addEventListener("click", (e) => {
      const thumbBtn = e.target.closest(".product__thumb");
      const idx = thumbBtn ? thumbs.indexOf(thumbBtn) : -1;
      if (idx !== -1) setIndex(idx);
    });

    mainContainer?.addEventListener("click", (e) => {
      if (!(e.target instanceof Element)) return;
      if (e.target.closest(".product__arrow_prev")) {
        e.preventDefault();
        setIndex(currentIndex - 1);
      } else if (e.target.closest(".product__arrow_next")) {
        e.preventDefault();
        setIndex(currentIndex + 1);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); setIndex(currentIndex - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); setIndex(currentIndex + 1); }
    });
  }

  initProductSelections();
  initConfigurator();
  initCartPage();
  initProductGallery();
})();

