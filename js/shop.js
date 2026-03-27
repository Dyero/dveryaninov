(() => {
  const CART_KEY = "dveryaninov_cart_v1";
  const WISHLIST_KEY = "dveryaninov_wishlist_v1";

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
    const items = JSON.parse(localStorage.getItem("dveryaninov_cart_v1") || "[]");
    items.push(item);
    localStorage.setItem("dveryaninov_cart_v1", JSON.stringify(items));
    updateCartBadge();
  }

  function getWishlist() {
    return safeJsonParse(localStorage.getItem(WISHLIST_KEY) || "[]", []);
  }

  function setWishlist(items) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  }

  function isInWishlist(id) {
    return getWishlist().some((x) => x.id === id);
  }

  function toggleWishlist(item) {
    const items = getWishlist();
    const idx = items.findIndex((x) => x.id === item.id);
    if (idx !== -1) {
      items.splice(idx, 1);
    } else {
      items.push(item);
    }
    setWishlist(items);
    return idx === -1;
  }

  
  function updateCartBadge() {
    const items = getCart();
    const count = items.length;
    const btns = document.querySelectorAll('a[href="cart.html"].header__icon-btn');
    btns.forEach(btn => {
      let badge = btn.querySelector(".header__wishlist-count"); // reusing the same badge class design
      if (count > 0) {
        btn.style.position = "relative";
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "header__wishlist-count";
          btn.appendChild(badge);
        }
        badge.textContent = count;
      } else {
        if (badge) badge.remove();
      }
    });
  }

  // Original function:
  function updateWishlistBadge() {
    const count = getWishlist().length;
    const btn = document.querySelector("#header-wishlist-btn");
    if (!btn) return;
    let badge = btn.querySelector(".header__wishlist-count");
    if (count > 0) {
      btn.classList.add("has-items");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "header__wishlist-count";
        btn.style.position = "relative";
        btn.appendChild(badge);
      }
      badge.textContent = count;
    } else {
      btn.classList.remove("has-items");
      if (badge) badge.remove();
    }
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
    const modal = document.querySelector("#dv-config-modal");
    if (!modal) return;

    const state = {
      // Шаг 1 — Конфигурация двери
      size: "2000×600",
      finish: "RAL 9003",
      glazing: "Стекло 1",
      pattern: "Без узора",
      opening: "Распашная",
      "opening-type": "Схема 1",
      // Шаг 2 — Погонаж
      box: "Телескопический",
      casing: "Телескоп +",
      quantity: "5 шт",
      "height-add": "100 мм",
      threshold: "Без порога",
      // Шаг 3 — Фурнитура
      "handle-color": "Белый",
      "lock-type": "Нажимные модели",
      "lock-color": "Белый",
      locker: "Завертка (WC)",
      hinges: "Скрытые",
      "hinges-color": "Белый",
      stopper: "Напольный",
    };

    // Экспортируем для интеграции с Битрикс: window.cfgState даёт доступ
    // к каждому свойству как к отдельной переменной (state.size, state.finish, …)
    window.cfgState = state;

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

    // Конфигурация шагов: изображение, текст кнопки «Далее»
    const stepConfig = {
      config:   { img: "images/card-door-1.svg",  alt: "Вид двери",       nextLabel: "ВЫБРАТЬ ПОГОНАЖ →",   nextStep: "molding"  },
      molding:  { img: "images/Альберта.png",      alt: "Погонаж",          nextLabel: "ВЫБРАТЬ ФУРНИТУРУ →", nextStep: "hardware" },
      hardware: { img: "images/card-door-1.svg",  alt: "Ручка",            nextLabel: "СОХРАНИТЬ И ВЫЙТИ →", nextStep: null       },
    };

    function setStep(step) {
      // Переключаем секции параметров
      modal.querySelectorAll("[data-step]").forEach((el) => {
        el.classList.toggle("config-step_active", el.getAttribute("data-step") === step);
      });

      // Переключаем активный шаг степпера
      modal.querySelectorAll(".cfg-stepper__step").forEach((el) => {
        const isActive = el.getAttribute("data-step-tab") === step;
        el.classList.toggle("cfg-stepper__step_active", isActive);
      });

      // Обновляем изображение и кнопку «Далее»
      const cfg = stepConfig[step];
      if (cfg) {
        const imgEl = document.querySelector("#cfgImageEl");
        if (imgEl) { imgEl.src = cfg.img; imgEl.alt = cfg.alt; }

        const nextBtn = document.querySelector("#cfgNextBtn");
        if (nextBtn) {
          nextBtn.textContent = cfg.nextLabel;
          if (cfg.nextStep) {
            nextBtn.setAttribute("data-next-step", cfg.nextStep);
            nextBtn.removeAttribute("data-add-to-cart-close");
            nextBtn.style.display = "";
          } else {
            // Последний шаг — кнопка "Сохранить и выйти" закрывает
            nextBtn.removeAttribute("data-next-step");
            nextBtn.setAttribute("data-add-to-cart-close", "true");
          }
        }
      }

      // При смене шага сбрасываем аккордеон: открываем только первый элемент нового шага
      const newStepEl = modal.querySelector('[data-step="' + step + '"]');
      if (newStepEl) {
        modal.querySelectorAll(".config-detail-options").forEach((el) => { el.classList.remove("is-open"); });
        modal.querySelectorAll(".cfg-section__body").forEach((el) => { el.hidden = true; });
        modal.querySelectorAll(".config-detail-toggle").forEach((btn) => {
          btn.setAttribute("aria-expanded", "false");
        });
        openFirstAccordionItem(newStepEl);
      }
    }

    function initModalSelection() {
      // 1. Синхронизируем активные чипы и значения в заголовках
      modal.querySelectorAll("[data-pick][data-value]").forEach((chip) => {
        const pick = chip.getAttribute("data-pick");
        const value = chip.getAttribute("data-value");
        if (state[pick] === value) {
          chip.classList.add("config-chip_active");
          const header = chip.closest(".config-detail-item")?.querySelector(".config-detail-header");
          if (header) {
            const valueSpan = header.querySelector(".config-detail-value");
            if (valueSpan) valueSpan.textContent = value;
          }
        } else {
          chip.classList.remove("config-chip_active");
        }
      });

      // 2. Закрываем все аккордеон-элементы
      modal.querySelectorAll(".config-detail-options").forEach((el) => { el.classList.remove("is-open"); });
      modal.querySelectorAll(".cfg-section__body").forEach((el) => { el.hidden = true; });
      modal.querySelectorAll(".config-detail-toggle").forEach((btn) => {
        btn.setAttribute("aria-expanded", "false");
      });

      // 3. Открываем первый аккордеон-элемент активного шага
      openFirstAccordionItem(modal.querySelector(".config-step_active"));
    }

    function openFirstAccordionItem(stepEl) {
      if (!stepEl) return;
      // Ищем первый config-detail-item с toggle (пропускаем те, что без опций)
      const firstItem = stepEl.querySelector(".config-detail-item .config-detail-toggle");
      if (firstItem) {
        firstItem.setAttribute("aria-expanded", "true");
        const options = firstItem.closest(".config-detail-header")?.nextElementSibling;
        if (options) options.classList.add("is-open");
      }
    }

    document.addEventListener("click", (e) => {

      

      const target = e.target;
      if (!(target instanceof Element)) return;

      // Раскрытие/схлопывание по клику на весь заголовок или toggle
      const detailHeader = target.closest(".config-detail-header");
      if (detailHeader && !target.closest(".config-chip")) {
        const toggle = detailHeader.querySelector(".config-detail-toggle");
        if (!toggle) return;
        const isExpanded = toggle.getAttribute("aria-expanded") === "true";
        // Закрываем все остальные аккордеоны в том же шаге
        if (!isExpanded) {
          const stepEl = detailHeader.closest(".config-step");
          if (stepEl) {
            stepEl.querySelectorAll(".config-detail-header").forEach((h) => {
              if (h === detailHeader) return;
              const t = h.querySelector(".config-detail-toggle");
              if (t) t.setAttribute("aria-expanded", "false");
              const opts = h.nextElementSibling;
              if (opts) opts.classList.remove("is-open");
            });
          }
        }
        toggle.setAttribute("aria-expanded", isExpanded ? "false" : "true");
        const options = detailHeader.nextElementSibling;
        if (options) options.classList.toggle("is-open", !isExpanded);
        return;
      }

      // Клик по шагу степпера
      const stepTab = target.closest(".cfg-stepper__step[data-step-tab]");
      if (stepTab) {
        setStep(stepTab.getAttribute("data-step-tab"));
        return;
      }

      // Раскрытие секции (Модель ручки и т.п.)
      const sectionToggle = target.closest("[data-section-toggle]");
      if (sectionToggle) {
        const toggle = sectionToggle.querySelector(".config-detail-toggle");
        const body = sectionToggle.closest(".cfg-section")?.querySelector(".cfg-section__body");
        if (!toggle || !body) return;
        const isExpanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", isExpanded ? "false" : "true");
        body.hidden = isExpanded;
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

      
      // Выбор карточки (Radio)
      const cfgItemToSelect = target.closest(".cfg-item");
      if (cfgItemToSelect && !target.closest('.cfg-qty-btn') && !target.closest('.cfg-qty-input')) {
         const list = cfgItemToSelect.closest('.config-detail-options');
         if (list) {
            list.querySelectorAll('.cfg-item').forEach(item => {
               item.classList.remove('cfg-item_active');
               const inp = item.querySelector('.cfg-qty-input');
               if (inp) inp.value = 0;
            });
            cfgItemToSelect.classList.add('cfg-item_active');
            const inp = cfgItemToSelect.querySelector('.cfg-qty-input');
            if (inp) inp.value = 1;
            
            // update header text
            const title = cfgItemToSelect.querySelector('.config-item__title')?.textContent;
            const headerVal = list.parentElement.querySelector('.config-detail-value');
            if (headerVal && title) headerVal.textContent = title;
            updateConfigTotal();
         }
         return;
      }
      
      // Кнопки изменения количества

      const qtyBtn = target.closest("[data-qty-decrease], [data-qty-increase]");
      if (qtyBtn) {
        const qtyWrap = qtyBtn.closest(".cfg-item__qty, .config-item__qty");
        const input = qtyWrap?.querySelector(".cfg-qty-input, .config-qty-input");
        
        if (input) {
          const curr = Number(input.value) || 0;
          const isDecrease = qtyBtn.hasAttribute("data-qty-decrease");
          input.value = isDecrease ? Math.max(0, curr - 1) : curr + 1;
          
          const cfgItem = qtyBtn.closest(".cfg-item");
          if (cfgItem) {
             const list = cfgItem.closest('.config-detail-options');
             if (list && input.value > 0) {
                 list.querySelectorAll('.cfg-item').forEach(item => {
                    if (item !== cfgItem) {
                       item.classList.remove('cfg-item_active');
                       const tempInp = item.querySelector('.cfg-qty-input');
                       if (tempInp) tempInp.value = 0;
                    }
                 });
                 cfgItem.classList.add('cfg-item_active');
                 const title = cfgItem.querySelector('.config-item__title')?.textContent;
                 const headerVal = list.parentElement.querySelector('.config-detail-value');
                 if (headerVal && title) headerVal.textContent = title;
             }
             updateConfigTotal();
          }

          const configItem = qtyBtn.closest(".config-item");
          if (configItem) updateItemTotal(configItem);
        }
        return;
      }

      if (target.closest("[data-open-config]")) {
        syncStateFromPage();
        openModal(modal);
        initModalSelection();
        addPriceBadges();
        updateConfigTotal();
        setStep("config");
        return;
      }

      const openStepEl = target.closest("[data-open-config-step]");
      if (openStepEl) {
        const step = openStepEl.getAttribute("data-open-config-step");
        syncStateFromPage();
        openModal(modal);
        initModalSelection();
        addPriceBadges();
        updateConfigTotal();
        setStep(step);
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

        // Обновляем итоговую цену
        updateConfigTotal();
        return;
      }

      if (target.closest("[data-add-to-cart]") || target.closest("[data-add-to-cart-close]")) {
        const titleEl = document.querySelector(".product__title");
        const priceEl = document.querySelector(".product__price");
        const imgEl = document.querySelector(".product__main-image img");

        const title = titleEl ? titleEl.textContent.trim() : "Товар";
        const priceText = priceEl ? priceEl.textContent : "0";
        const basePrice = Number((priceText.match(/\d[\d\s]*/)?.[0] || "0").replace(/\s/g, ""));

        // Получаем цену с конфигуратора
        const configTotalText = modal?.querySelector(".config-total-price")?.textContent || "0";
        const totalPrice = Number(configTotalText.replace(/\s/g, "").replace(/\u00a0/g, "")) || basePrice;

        // Собираем выбранные аксессуары из cfg-item (новые карточки)
        const accessories = [];
        modal.querySelectorAll(".cfg-item").forEach((item) => {
          const qtyInput = item.querySelector(".cfg-qty-input");
          const qty = Number(qtyInput?.value) || 0;
          if (qty > 0) {
            const accTitle = item.querySelector(".cfg-item__name")?.textContent.trim() || "";
            const spec = item.querySelector(".cfg-item__spec")?.textContent.trim() || "";
            const price = Number(item.querySelector(".config-item__amount")?.textContent.replace(/[^\d]/g, "")) || 0;
            accessories.push({
              id: `acc-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              title: accTitle,
              spec,
              qty,
              price,
              oldPrice: 0,
            });
          }
        });
        // Также cfg-item со старыми config-item (если есть)
        modal.querySelectorAll(".config-item").forEach((item) => {
          const qtyInput = item.querySelector(".config-qty-input");
          const qty = Number(qtyInput?.value) || 0;
          if (qty > 0) {
            const accTitle = item.querySelector(".config-item__title")?.textContent.trim() || "";
            const spec = item.querySelector(".config-item__spec")?.textContent.trim() || "";
            const price = Number(item.querySelector(".config-item__amount")?.textContent.replace(/[^\d]/g, "")) || 0;
            accessories.push({
              id: `acc-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              title: accTitle,
              spec,
              qty,
              price,
              oldPrice: 0,
            });
          }
        });

        addToCart({
          id: `p-${Date.now()}`,
          title,
          price: totalPrice,
          image: imgEl ? imgEl.getAttribute("src") : "",
          qty: 1,
          options: { ...state },
          accessories,
        });

        closeModal(modal);
        window.location.href = "cart.html";
      }
    });

    // Обработка изменения количества через ввод с клавиатуры
    modal?.addEventListener("input", (e) => {
      if (e.target.classList.contains("config-qty-input") || e.target.classList.contains("cfg-qty-input")) {
        e.target.value = Math.max(0, Number(e.target.value) || 0);
        const configItem = e.target.closest(".config-item");
        if (configItem) updateItemTotal(configItem);
        else updateConfigTotal();
      }
    });

    function getChipsTotal() {
      let total = 0;
      modal.querySelectorAll('.config-chip_active[data-price]').forEach(function(chip) {
        total += Number(chip.getAttribute('data-price')) || 0;
      });
      return total;
    }

    function addPriceBadges() {
      modal.querySelectorAll('[data-pick][data-price]').forEach(function(chip) {
        if (chip.querySelector('.config-chip__delta')) return;
        var price = Number(chip.getAttribute('data-price')) || 0;
        var badge = document.createElement('small');
        badge.className = 'config-chip__delta';
        badge.textContent = price > 0 ? '+\u2009' + formatPriceRub(price) + '\u00a0\u20bd' : 'база';
        chip.appendChild(badge);
      });
    }

    function updateConfigTotal() {
      // Считаем cfg-item (новые карточки фурнитуры)
      const cfgItemsTotal = Array.from(modal?.querySelectorAll(".cfg-item") || [])
        .reduce((sum, item) => {
          const price = Number(item.querySelector(".config-item__amount")?.textContent.replace(/\s/g, "")) || 0;
          const qty = Math.max(0, Number(item.querySelector(".cfg-qty-input")?.value) || 0);
          return sum + price * qty;
        }, 0);
      // Считаем config-item (старые, если останутся)
      const configItemsTotal = Array.from(modal?.querySelectorAll(".config-item") || [])
        .reduce((sum, item) => sum + calcItemTotal(item), 0);
      const chipsTotal = getChipsTotal();
      const totalPriceEl = modal?.querySelector(".config-total-price");
      if (totalPriceEl) {
        totalPriceEl.textContent = formatPriceRub(BASE_PRICE + cfgItemsTotal + configItemsTotal + chipsTotal);
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
    const cartSummary = cartRoot.querySelector(".cart-summary");
    const cartMeta = document.querySelector("#cart-meta");
    if (!itemsWrap) return;

    const OPTION_LABELS = {
      size: "Размер",
      finish: "Цвет покрытия",
      glazing: "Остекление",
      pattern: "Узор стекла",
      opening: "Тип открывания",
      "opening-type": "Схема открывания",
      box: "Тип погонажа",
      casing: "Наличники",
      quantity: "Количество",
      "height-add": "Добор",
      threshold: "Порог",
      "handle-color": "Цвет ручки",
      "lock-type": "Тип замка",
      "lock-color": "Цвет замка",
      locker: "Запирание (Фиксатор)",
      hinges: "Петли",
      "hinges-color": "Цвет петель",
      stopper: "Ограничитель",
    };

    function pluralItems(n) {
      if (n % 10 === 1 && n % 100 !== 11) return "ТОВАР";
      if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return "ТОВАРА";
      return "ТОВАРОВ";
    }

    function renderCart() {
    if (!container) return;
    const items = JSON.parse(localStorage.getItem("dveryaninov_cart_v1") || "[]");
    container.innerHTML = "";
    
    let total = 0;
    if (items.length === 0) {
      container.innerHTML = "<p>Корзина пуста. <a href='catalog.html' style='color:#611025; text-decoration:underline;'>Перейти в каталог</a></p>";
      const cSide = document.querySelector('.cart-summary');
      if (cSide) cSide.style.display = 'none';
      return;
    } else {
      const cSide = document.querySelector('.cart-summary');
      if (cSide) cSide.style.display = 'block';
    }

    const labels = { 
      size: 'Размер', finish: 'Цвет покрытия', glazing: 'Остекление', 
      opening: 'Тип открывания', 'opening-type': 'Сторона открывания', 
      pattern: 'Узор',
      box: 'Тип погонажа', casing: 'Наличники', quantity: 'Шт. доборов', 'height-add': 'Добор', 
      threshold: 'Порог',
      'handle-color': 'Модель ручки', 'lock-type': 'Тип замка', 'lock-color': 'Цвет замка',
      locker: 'Запирание (Фиксатор)', hinges: 'Петли', 'hinges-color': 'Цвет петель',
      stopper: 'Ограничитель' 
    };

    items.forEach((item, index) => {
      const itemPrice = Number(item.priceSum || item.price || 0);
      total += itemPrice;
      
      let propsHtml = '';
      if (item.options) {
        propsHtml = '<div style="margin-top: 16px; display: grid; gap: 8px; font-size: 13px; color: #555;">';
        for (const [k, v] of Object.entries(item.options)) {
          if (v && v !== '-') {
            propsHtml += `<div><span style="color:#999">${labels[k] || k}:</span> ${v}</div>`;
          }
        }
        if (item.accessories && item.accessories.length) {
           item.accessories.forEach(acc => {
             propsHtml += `<div><span style="color:#999">${acc.title}:</span> ${acc.spec || ''} (${acc.price} ₽ x ${acc.qty})</div>`;
           });
        }
        propsHtml += '</div>';
      }

      const div = document.createElement("article");
      div.className = "cart-item";
      div.innerHTML = `
        <div class="cart-item__image-wrap" style="align-self: start;">
          <img class="cart-item__image" src="${item.image || 'images/card-door-1.svg'}" alt="Товар" style="width: 100%; height: auto; display: block;">
        </div>
        <div class="cart-item__info">
          <div class="cart-item__info-header" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap;">
            <div>
              <h3 class="cart-item__title" style="margin: 0; font-size: 16px;">${item.title || 'Товар конфигуратора'}</h3>
              <div class="cart-item__price" style="margin-top: 8px; font-weight: bold;">Цена за комплект<br>${new Intl.NumberFormat('ru-RU').format(itemPrice)} ₽</div>
            </div>
            
            <div class="cart-item__actions" style="display: flex; gap: 12px; font-size: 13px;">
              <a href="catalog.html" style="color: #666; text-decoration: none;">Добавить ещё дверь</a>
              <span class="cart-item__action-sep" style="color: #ccc;">|</span>
              <a href="product.html" style="color: #666; text-decoration: none;">Редактировать</a>
              <span class="cart-item__action-sep" style="color: #ccc;">|</span>
              <button type="button" style="color: #666; background: none; border: none; cursor: pointer; padding: 0;" onclick="window.removeCartItem(${index})">Удалить</button>
            </div>
          </div>
          ${propsHtml}
        </div>
      `;
      container.appendChild(div);
    });

    const summaryTotal = document.getElementById("cart-summary-total");
    const summaryFinal = document.getElementById("cart-summary-final");
    if (summaryTotal) summaryTotal.textContent = new Intl.NumberFormat('ru-RU').format(total) + " ₽";
    if (summaryFinal) summaryFinal.textContent = new Intl.NumberFormat('ru-RU').format(total) + " ₽";
  }

  window.removeCartItem = (idx) => {
    const items = JSON.parse(localStorage.getItem("dveryaninov_cart_v1") || "[]");
    items.splice(idx, 1);
    localStorage.setItem("dveryaninov_cart_v1", JSON.stringify(items));
    renderCart();
    updateCartBadge();
  };

  renderCart();

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const items = JSON.parse(localStorage.getItem("dveryaninov_cart_v1") || "[]");
      if (items.length === 0) {
        alert("Корзина пуста");
        return;
      }
      
      const name = document.getElementById("checkout-name").value;
      const phone = document.getElementById("checkout-phone").value;
      
      const order = {
        id: "ORD-" + Math.floor(Math.random() * 1000000),
        date: new Date().toISOString(),
        customer: { name, phone },
        items: items,
        total: items.reduce((sum, item) => sum + (Number(item.priceSum) || Number(item.price) || 0), 0)
      };

      console.log("=== BITRIX24 INTEGRATION MOCK ===");
      console.log("NEW ORDER SUBMITTED:", JSON.stringify(order, null, 2));
      console.log("=================================");

      // Save to Orders History
      const history = window.safeJsonParse ? safeJsonParse(localStorage.getItem("dveryaninov_orders_v1"), []) : JSON.parse(localStorage.getItem("dveryaninov_orders_v1") || "[]");
      history.push(order);
      localStorage.setItem("dveryaninov_orders_v1", JSON.stringify(history));

      // Clear cart
      localStorage.setItem("dveryaninov_cart_v1", JSON.stringify([]));
      
      alert("Ваша заявка успешно оформлена (см. консоль)!");
      window.location.href = "account.html";
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (typeof updateWishlistBadge === "function") updateWishlistBadge();
  if (typeof updateCartBadge === "function") updateCartBadge();
});
