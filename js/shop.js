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
    const items = getCart();
    items.push(item);
    setCart(items);
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

  function updateWishlistBadge() {
    const count = getWishlist().length;
    const btn = document.getElementById("header-wishlist-btn");
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
    const modal = document.getElementById("configModal");
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
        const imgEl = document.getElementById("cfgImageEl");
        if (imgEl) { imgEl.src = cfg.img; imgEl.alt = cfg.alt; }

        const nextBtn = document.getElementById("cfgNextBtn");
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
        modal.querySelectorAll(".config-detail-options").forEach((el) => { el.hidden = true; });
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
      modal.querySelectorAll(".config-detail-options").forEach((el) => { el.hidden = true; });
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
        if (options) options.hidden = false;
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
        toggle.setAttribute("aria-expanded", isExpanded ? "false" : "true");
        const options = detailHeader.nextElementSibling;
        if (options) options.hidden = isExpanded;
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

      // Кнопки изменения количества (cfg-item и config-item)
      const qtyBtn = target.closest("[data-qty-decrease], [data-qty-increase]");
      if (qtyBtn) {
        const qtyWrap = qtyBtn.closest(".cfg-item__qty, .config-item__qty");
        const input = qtyWrap?.querySelector(".cfg-qty-input, .config-qty-input");
        if (input) {
          const curr = Number(input.value) || 0;
          input.value = qtyBtn.hasAttribute("data-qty-decrease")
            ? Math.max(0, curr - 1)
            : curr + 1;
          // пересчёт суммы для cfg-item или config-item
          const cfgItem = qtyBtn.closest(".cfg-item");
          const configItem = qtyBtn.closest(".config-item");
          if (cfgItem) updateConfigTotal();
          else if (configItem) updateItemTotal(configItem);
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
    const cartMeta = document.getElementById("cart-meta");
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
      const items = getCart();
      itemsWrap.innerHTML = "";
      if (cartMeta) cartMeta.innerHTML = "";

      if (!items.length) {
        itemsWrap.innerHTML = '<p class="cart-empty">Корзина пуста. <a href="catalog.html">Перейти в каталог →</a></p>';
        if (cartSummary) cartSummary.hidden = true;
        return;
      }
      if (cartSummary) cartSummary.hidden = false;

      const totalCount = items.reduce(function (s, x) { return s + (Number(x.qty) || 1); }, 0);
      if (cartMeta) {
        cartMeta.innerHTML =
          '<span class="cart-meta__count">' + totalCount + ' ' + pluralItems(totalCount) + '</span>' +
          '<button type="button" class="cart-meta__clear" id="cart-clear-btn">Очистить корзину</button>';
        var clearBtn = document.getElementById("cart-clear-btn");
        if (clearBtn) {
          clearBtn.addEventListener("click", function () { setCart([]); renderCart(); });
        }
      }

      var total = 0;
      items.forEach(function (it) {
        total += (Number(it.price) || 0) * (Number(it.qty) || 1);

        var detailRowsHtml = "";
        if (it.options) {
          Object.entries(it.options).forEach(function (entry) {
            var k = entry[0], v = entry[1];
            if (v && String(v).trim() !== "") {
              var label = OPTION_LABELS[k] || k;
              detailRowsHtml +=
                '<div class="cart-item__detail-row">' +
                '<span class="cart-item__detail-label">' + label + ':</span>' +
                '<span class="cart-item__detail-value">' + v + '</span>' +
                '</div>';
            }
          });
        }
        if (!detailRowsHtml) {
          detailRowsHtml =
            '<div class="cart-item__detail-row">' +
            '<span class="cart-item__detail-label">Комплектация:</span>' +
            '<span class="cart-item__detail-value">по выбору</span>' +
            '</div>';
        }

        var priceText = it.price > 0
          ? formatPriceRub(it.price) + "\u00a0\u20bd"
          : "Цена по запросу";

        var article = document.createElement("article");
        article.className = "cart-item";
        article.innerHTML =
          '<div class="cart-item__image-wrap">' +
            '<img class="cart-item__image" src="' + (it.image || "images/card-door-1.svg") + '" alt="" width="120" height="160">' +
          '</div>' +
          '<div class="cart-item__info">' +
            '<div class="cart-item__info-header">' +
              '<h3 class="cart-item__title">' + (it.title || "Товар") + '</h3>' +
              '<div class="cart-item__actions">' +
                '<a class="cart-item__action-btn" href="catalog.html">Добавить ещё дверь</a>' +
                '<span class="cart-item__action-sep">|</span>' +
                '<a class="cart-item__action-btn" href="product.html">Редактировать</a>' +
                '<span class="cart-item__action-sep">|</span>' +
                '<button type="button" class="cart-item__action-btn cart-item__action-btn_danger" data-cart-remove="' + it.id + '">Удалить</button>' +
              '</div>' +
            '</div>' +
            '<p class="cart-item__price-line">' + priceText + '</p>' +
            '<dl class="cart-item__details">' + detailRowsHtml + '</dl>' +
          '</div>';

        if (it.accessories && it.accessories.length > 0) {
          var accSection = document.createElement("div");
          accSection.className = "cart-item__accessories";
          it.accessories.forEach(function (acc) {
            var accEl = document.createElement("div");
            accEl.className = "cart-accessory";
            var unitPrice = Number(acc.price) || 0;
            accEl.innerHTML =
              '<div class="cart-accessory__img-wrap">' +
                '<img class="cart-accessory__img" src="' + (acc.image || "images/card-door-1.svg") + '" alt="">' +
              '</div>' +
              '<div class="cart-accessory__info">' +
                '<span class="cart-accessory__name">' + acc.title + '</span>' +
                '<span class="cart-accessory__spec">' + acc.spec + '</span>' +
              '</div>' +
              '<div class="cart-accessory__qty">' +
                '<button type="button" class="cart-accessory__qty-btn" aria-label="Уменьшить" data-acc-dec="' + acc.id + '" data-acc-item="' + it.id + '">−</button>' +
                '<input type="number" class="cart-accessory__qty-input" value="' + acc.qty + '" min="1" readonly>' +
                '<button type="button" class="cart-accessory__qty-btn" aria-label="Увеличить" data-acc-inc="' + acc.id + '" data-acc-item="' + it.id + '">+</button>' +
              '</div>' +
              '<div class="cart-accessory__pricing">' +
                '<span class="cart-accessory__price">' + formatPriceRub(unitPrice) + '\u00a0\u20bd</span>' +
                (acc.oldPrice ? '<span class="cart-accessory__old-price">' + formatPriceRub(acc.oldPrice) + '\u00a0\u20bd</span>' : '') +
              '</div>';
            accSection.appendChild(accEl);
          });
          article.appendChild(accSection);
        }
        itemsWrap.appendChild(article);
      });

      var totalText = formatPriceRub(total) + "\u00a0\u20bd";
      if (summaryTotal) summaryTotal.textContent = totalText;
      if (summarySum) summarySum.textContent = totalText;
    }

    renderCart();

    document.addEventListener("click", function (e) {
      var t = e.target;
      if (!(t instanceof Element)) return;
      if (!t.closest(".cart-page")) return;
      var itemsNow = getCart();
      var removeId = t.getAttribute("data-cart-remove");
      var incId = t.getAttribute("data-cart-inc");
      var decId = t.getAttribute("data-cart-dec");
      var changed = false;
      if (removeId) {
        setCart(itemsNow.filter(function (x) { return x.id !== removeId; }));
        changed = true;
      } else if (incId) {
        var xi = itemsNow.find(function (x) { return x.id === incId; });
        if (xi) { xi.qty = (Number(xi.qty) || 1) + 1; setCart(itemsNow); changed = true; }
      } else if (decId) {
        var xd = itemsNow.find(function (x) { return x.id === decId; });
        if (xd) { xd.qty = Math.max(1, (Number(xd.qty) || 1) - 1); setCart(itemsNow); changed = true; }
      }
      var accIncId = t.getAttribute("data-acc-inc");
      var accDecId = t.getAttribute("data-acc-dec");
      var accItemId = t.getAttribute("data-acc-item");
      if (accIncId || accDecId) {
        var cartItem = itemsNow.find(function (x) { return x.id === accItemId; });
        if (cartItem && cartItem.accessories) {
          var acc = cartItem.accessories.find(function (a) { return a.id === (accIncId || accDecId); });
          if (acc) {
            acc.qty = accIncId ? (Number(acc.qty) || 1) + 1 : Math.max(1, (Number(acc.qty) || 1) - 1);
            setCart(itemsNow);
            changed = true;
          }
        }
      }
      if (changed) renderCart();
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

  function openCheckoutModal() {
    var modal = document.getElementById('checkout-modal');
    if (!modal) return;
    var content = document.getElementById('checkout-content');
    var success = document.getElementById('checkout-success');
    if (content) content.hidden = false;
    if (success) success.hidden = true;
    if (window.DvAuth) {
      var user = DvAuth.getCurrentUser();
      if (user) {
        var nameInput = modal.querySelector('[name="checkout-name"]');
        if (nameInput && !nameInput.value) nameInput.value = user.name;
      }
    }
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
  }

  function closeCheckoutModal() {
    var modal = document.getElementById('checkout-modal');
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
  }

  function initCheckoutPage() {
    if (!document.querySelector('.cart')) return;

    var checkoutBtn = document.querySelector('.cart-summary__btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function() {
        if (!getCart().length) return;
        if (window.DvAuth && !DvAuth.isLoggedIn()) {
          DvAuth.openAuthModal(function() { openCheckoutModal(); });
        } else {
          openCheckoutModal();
        }
      });
    }

    var modal = document.getElementById('checkout-modal');
    if (!modal) return;

    modal.querySelectorAll('[data-close-checkout]').forEach(function(btn) {
      btn.addEventListener('click', closeCheckoutModal);
    });
    var backdrop = modal.querySelector('.checkout-modal__backdrop');
    if (backdrop) backdrop.addEventListener('click', closeCheckoutModal);

    var form = document.getElementById('checkout-form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var items = getCart();
        if (!items.length) return;
        if (window.DvAuth) DvAuth.saveOrder(items);
        setCart([]);
        var content = document.getElementById('checkout-content');
        var success = document.getElementById('checkout-success');
        if (content) content.hidden = true;
        if (success) success.hidden = false;
      });
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
        closeCheckoutModal();
      }
    });
  }

  function initWishlistBtn() {
    const btn = document.querySelector(".product__btn_wishlist");
    if (!btn) return;
    const titleEl = document.querySelector(".product__title");
    const priceEl = document.querySelector(".product__price");
    const imgEl = document.querySelector(".product__main-image img");
    const title = titleEl ? titleEl.textContent.trim() : "Товар";
    const id = `w-${title.replace(/\s+/g, "-").toLowerCase()}`;

    function refreshWishlistBtn() {
      if (isInWishlist(id)) {
        btn.classList.add("product__btn_wishlist_active");
        btn.setAttribute("aria-label", "Убрать из избранного");
      } else {
        btn.classList.remove("product__btn_wishlist_active");
        btn.setAttribute("aria-label", "В избранное");
      }
      updateWishlistBadge();
    }

    btn.addEventListener("click", () => {
      const price = Number(
        ((priceEl ? priceEl.textContent : "0").match(/\d[\d\s]*/)?.[0] || "0").replace(/\s/g, "")
      );
      const image = imgEl ? imgEl.getAttribute("src") : "";
      toggleWishlist({ id, title, price, image });
      refreshWishlistBtn();
    });

    refreshWishlistBtn();
  }

  function initCardWishlist() {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      const btn = card.querySelector(".card__action");
      if (!btn) return;
      const titleEl = card.querySelector(".card__title");
      const priceEl = card.querySelector(".card__price");
      const imgEl = card.querySelector(".card__image");
      const title = titleEl ? titleEl.textContent.trim() : "Товар";
      const id = `w-${title.replace(/\s+/g, "-").toLowerCase()}`;

      function refreshCardBtn() {
        if (isInWishlist(id)) {
          btn.classList.add("card__action_active");
          btn.setAttribute("aria-label", "Убрать из избранного");
        } else {
          btn.classList.remove("card__action_active");
          btn.setAttribute("aria-label", "В избранное");
        }
      }

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const price = Number(((priceEl ? priceEl.textContent : "0").replace(/[^\d]/g, ""))) || 0;
        const image = imgEl ? imgEl.getAttribute("src") : "";
        toggleWishlist({ id, title, price, image });
        refreshCardBtn();
        updateWishlistBadge();
      });

      refreshCardBtn();
    });
    updateWishlistBadge();
  }

  function initWishlistPage() {
    const grid = document.getElementById("wishlist-grid");
    const empty = document.getElementById("wishlist-empty");
    if (!grid) return;

    function renderWishlist() {
      const items = getWishlist();
      grid.innerHTML = "";

      if (!items.length) {
        grid.hidden = true;
        if (empty) empty.hidden = false;
        updateWishlistBadge();
        return;
      }

      grid.hidden = false;
      if (empty) empty.hidden = true;

      items.forEach((item) => {
        const article = document.createElement("article");
        article.className = "cart-item";
        article.innerHTML = `
          <div class="cart-item__image-wrap">
            <img class="cart-item__image" src="${item.image || "images/card-door-1.svg"}" alt="${item.title}" width="120" height="120">
          </div>
          <div class="cart-item__info">
            <h3 class="cart-item__title"><a href="product.html">${item.title}</a></h3>
            <div class="cart-item__details">
              <span class="cart-item__detail">${item.price ? formatPriceRub(item.price) + "\u00a0\u20bd" : ""}</span>
            </div>
          </div>
          <button type="button" class="wishlist-item__cart-btn" aria-label="Добавить в корзину" data-wishlist-to-cart="${item.id}">В корзину</button>
          <button type="button" class="cart-item__remove" aria-label="Убрать из избранного" data-wishlist-remove="${item.id}">×</button>
        `;
        grid.appendChild(article);
      });

      updateWishlistBadge();
    }

    grid.addEventListener("click", (e) => {
      const removeBtn = e.target.closest("[data-wishlist-remove]");
      if (removeBtn) {
        const id = removeBtn.getAttribute("data-wishlist-remove");
        setWishlist(getWishlist().filter((x) => x.id !== id));
        renderWishlist();
        return;
      }

      const cartBtn = e.target.closest("[data-wishlist-to-cart]");
      if (cartBtn) {
        const id = cartBtn.getAttribute("data-wishlist-to-cart");
        const item = getWishlist().find((x) => x.id === id);
        if (item) {
          addToCart({
            id: `p-${Date.now()}`,
            title: item.title,
            price: item.price,
            image: item.image,
            qty: 1,
          });
          window.location.href = "cart.html";
        }
      }
    });

    renderWishlist();
  }

  initProductSelections();
  initConfigurator();
  initCartPage();
  initCheckoutPage();
  initProductGallery();
  initWishlistBtn();
  initCardWishlist();
  initWishlistPage();
})();

