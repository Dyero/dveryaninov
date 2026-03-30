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
    const items = JSON.parse(
      localStorage.getItem("dveryaninov_cart_v1") || "[]",
    );
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
    const btns = document.querySelectorAll(
      'a[href="cart.html"].header__icon-btn',
    );
    btns.forEach((btn) => {
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

        const optionValue = btn
          .closest(".product__option")
          ?.querySelector(".product__option-value");
        if (optionValue) {
          optionValue.textContent = btn.textContent.trim();
        }
      });
    });

    // Handle color selection on quick product page
    const colorButtons = document.querySelectorAll(".product__color");
    colorButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (
          btn.classList.contains("product__color_more") ||
          btn.classList.contains("product__color_custom")
        ) {
          return;
        }

        e.preventDefault();
        colorButtons.forEach((b) => {
          if (
            !b.classList.contains("product__color_more") &&
            !b.classList.contains("product__color_custom")
          ) {
            b.classList.remove("product__color_active");
          }
        });
        btn.classList.add("product__color_active");

        const optionValue = btn
          .closest(".product__option")
          ?.querySelector(".product__option-value");
        if (optionValue && btn.hasAttribute("aria-label")) {
          const colorName = btn.getAttribute("aria-label");
          optionValue.textContent = colorName;
        }
      });
    });
  }

  const BASE_PRICE = 52000;

  function initConfigurator() {
    const modal = document.querySelector(".cfg-modal");
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
      const priceText =
        item?.querySelector(".config-item__amount")?.textContent || "0";
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
      config: {
        img: "images/card-door-1.svg",
        alt: "Вид двери",
        nextLabel: "ВЫБРАТЬ ПОГОНАЖ →",
        nextStep: "molding",
      },
      molding: {
        img: "images/Альберта.png",
        alt: "Погонаж",
        nextLabel: "ВЫБРАТЬ ФУРНИТУРУ →",
        nextStep: "hardware",
      },
      hardware: {
        img: "images/card-door-1.svg",
        alt: "Ручка",
        nextLabel: "СОХРАНИТЬ И ВЫЙТИ →",
        nextStep: null,
      },
    };

    function setStep(step) {
      // Переключаем секции параметров
      modal.querySelectorAll("[data-step]").forEach((el) => {
        el.classList.toggle(
          "config-step_active",
          el.getAttribute("data-step") === step,
        );
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
        if (imgEl) {
          imgEl.src = cfg.img;
          imgEl.alt = cfg.alt;
        }

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
        modal.querySelectorAll(".config-detail-options").forEach((el) => {
          el.classList.remove("is-open");
        });
        modal.querySelectorAll(".cfg-section__body").forEach((el) => {
          el.hidden = true;
        });
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
          const header = chip
            .closest(".config-detail-item")
            ?.querySelector(".config-detail-header");
          if (header) {
            const valueSpan = header.querySelector(".config-detail-value");
            if (valueSpan) valueSpan.textContent = value;
          }
        } else {
          chip.classList.remove("config-chip_active");
        }
      });

      // 2. Закрываем все аккордеон-элементы
      modal.querySelectorAll(".config-detail-options").forEach((el) => {
        el.classList.remove("is-open");
      });
      modal.querySelectorAll(".cfg-section__body").forEach((el) => {
        el.hidden = true;
      });
      modal.querySelectorAll(".config-detail-toggle").forEach((btn) => {
        btn.setAttribute("aria-expanded", "false");
      });

      // 3. Открываем первый аккордеон-элемент активного шага
      openFirstAccordionItem(modal.querySelector(".config-step_active"));
    }

    function openFirstAccordionItem(stepEl) {
      if (!stepEl) return;
      // Ищем первый config-detail-item с toggle (пропускаем те, что без опций)
      const firstItem = stepEl.querySelector(
        ".config-detail-item .config-detail-toggle",
      );
      if (firstItem) {
        firstItem.setAttribute("aria-expanded", "true");
        const options = firstItem.closest(
          ".config-detail-header",
        )?.nextElementSibling;
        if (options) options.classList.add("is-open");
      }
      // Открываем первую cfg-section (погонаж, фурнитура)
      const firstSection = stepEl.querySelector("[data-section-toggle]");
      if (firstSection) {
        const toggle = firstSection.querySelector(".config-detail-toggle");
        const body = firstSection.closest(".cfg-section")?.querySelector(".cfg-section__body");
        if (toggle) toggle.setAttribute("aria-expanded", "true");
        if (body) body.hidden = false;
      }
    }

    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      // Раскрытие/схлопывание по клику на весь заголовок или toggle
      const detailHeader = target.closest(".config-detail-header");
      if (detailHeader && !target.closest(".config-chip") && !target.closest("[data-section-toggle]")) {
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
        const body = sectionToggle
          .closest(".cfg-section")
          ?.querySelector(".cfg-section__body");
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

        const body = itemToggle
          .closest(".config-item")
          ?.querySelector(".config-item__body");
        if (body) {
          body.hidden = isExpanded;
        }
        return;
      }

      // Выбор карточки (Radio)
      const cfgItemToSelect = target.closest(".cfg-item");
      if (
        cfgItemToSelect &&
        !target.closest(".cfg-qty-btn") &&
        !target.closest(".cfg-qty-input")
      ) {
        const list = cfgItemToSelect.closest(".config-detail-options");
        if (list) {
          list.querySelectorAll(".cfg-item").forEach((item) => {
            item.classList.remove("cfg-item_active");
            const inp = item.querySelector(".cfg-qty-input");
            if (inp) inp.value = 0;
          });
          cfgItemToSelect.classList.add("cfg-item_active");
          const inp = cfgItemToSelect.querySelector(".cfg-qty-input");
          if (inp) inp.value = 1;

          // update header text
          const title = cfgItemToSelect.querySelector(
            ".config-item__title",
          )?.textContent;
          const headerVal = list.parentElement.querySelector(
            ".config-detail-value",
          );
          if (headerVal && title) headerVal.textContent = title;
          updateConfigTotal();
        }
        return;
      }

      // Кнопки изменения количества

      const qtyBtn = target.closest("[data-qty-decrease], [data-qty-increase]");
      if (qtyBtn) {
        const qtyWrap = qtyBtn.closest(".cfg-item__qty, .config-item__qty");
        const input = qtyWrap?.querySelector(
          ".cfg-qty-input, .config-qty-input",
        );

        if (input) {
          const curr = Number(input.value) || 0;
          const isDecrease = qtyBtn.hasAttribute("data-qty-decrease");
          input.value = isDecrease ? Math.max(0, curr - 1) : curr + 1;

          const cfgItem = qtyBtn.closest(".cfg-item");
          if (cfgItem) {
            const list = cfgItem.closest(".config-detail-options");
            if (list && input.value > 0) {
              list.querySelectorAll(".cfg-item").forEach((item) => {
                if (item !== cfgItem) {
                  item.classList.remove("cfg-item_active");
                  const tempInp = item.querySelector(".cfg-qty-input");
                  if (tempInp) tempInp.value = 0;
                }
              });
              cfgItem.classList.add("cfg-item_active");
              const title = cfgItem.querySelector(
                ".config-item__title",
              )?.textContent;
              const headerVal = list.parentElement.querySelector(
                ".config-detail-value",
              );
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
          optionsGroup
            .querySelectorAll(".config-chip")
            .forEach((b) => b.classList.remove("config-chip_active"));
          chip.classList.add("config-chip_active");
        }

        // Обновляем значение в header
        const header = chip
          .closest(".config-detail-item")
          ?.querySelector(".config-detail-header");
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

      if (
        target.closest("[data-add-to-cart]") ||
        target.closest("[data-add-to-cart-close]")
      ) {
        const titleEl = document.querySelector(".product__title");
        const priceEl = document.querySelector(".product__price");
        const imgEl = document.querySelector(".product__main-image img");

        const title = titleEl ? titleEl.textContent.trim() : "Товар";
        const priceText = priceEl ? priceEl.textContent : "0";
        const basePrice = Number(
          (priceText.match(/\d[\d\s]*/)?.[0] || "0").replace(/\s/g, ""),
        );

        // Получаем цену с конфигуратора
        const configTotalText =
          modal?.querySelector(".config-total-price")?.textContent || "0";
        const totalPrice =
          Number(configTotalText.replace(/\s/g, "").replace(/\u00a0/g, "")) ||
          basePrice;

        // Собираем выбранные аксессуары из cfg-item (новые карточки)
        const accessories = [];
        modal.querySelectorAll(".cfg-item").forEach((item) => {
          const qtyInput = item.querySelector(".cfg-qty-input");
          const qty = Number(qtyInput?.value) || 0;
          if (qty > 0) {
            const accTitle =
              item.querySelector(".cfg-item__name")?.textContent.trim() || "";
            const spec =
              item.querySelector(".cfg-item__spec")?.textContent.trim() || "";
            const price =
              Number(
                item
                  .querySelector(".config-item__amount")
                  ?.textContent.replace(/[^\d]/g, ""),
              ) || 0;
            const accImg = item.querySelector('.cfg-item__thumb img')?.getAttribute('src') || '';
            accessories.push({
              id: `acc-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              title: accTitle,
              spec,
              qty,
              price,
              oldPrice: 0,
              image: accImg,
            });
          }
        });
        // Также cfg-item со старыми config-item (если есть)
        modal.querySelectorAll(".config-item").forEach((item) => {
          const qtyInput = item.querySelector(".config-qty-input");
          const qty = Number(qtyInput?.value) || 0;
          if (qty > 0) {
            const accTitle =
              item.querySelector(".config-item__title")?.textContent.trim() ||
              "";
            const spec =
              item.querySelector(".config-item__spec")?.textContent.trim() ||
              "";
            const price =
              Number(
                item
                  .querySelector(".config-item__amount")
                  ?.textContent.replace(/[^\d]/g, ""),
              ) || 0;
            const accImg = item.querySelector('.cfg-item__thumb img, .config-item__img img')?.getAttribute('src') || '';
            accessories.push({
              id: `acc-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              title: accTitle,
              spec,
              qty,
              price,
              oldPrice: 0,
              image: accImg,
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
      if (
        e.target.classList.contains("config-qty-input") ||
        e.target.classList.contains("cfg-qty-input")
      ) {
        e.target.value = Math.max(0, Number(e.target.value) || 0);
        const configItem = e.target.closest(".config-item");
        if (configItem) updateItemTotal(configItem);
        else updateConfigTotal();
      }
    });

    function getChipsTotal() {
      let total = 0;
      modal
        .querySelectorAll(".config-chip_active[data-price]")
        .forEach(function (chip) {
          total += Number(chip.getAttribute("data-price")) || 0;
        });
      return total;
    }

    function addPriceBadges() {
      modal
        .querySelectorAll("[data-pick][data-price]")
        .forEach(function (chip) {
          if (chip.querySelector(".config-chip__delta")) return;
          var price = Number(chip.getAttribute("data-price")) || 0;
          var badge = document.createElement("small");
          badge.className = "config-chip__delta";
          badge.textContent =
            price > 0
              ? "+\u2009" + formatPriceRub(price) + "\u00a0\u20bd"
              : "база";
          chip.appendChild(badge);
        });
    }

    function updateConfigTotal() {
      // Считаем cfg-item (новые карточки фурнитуры)
      const cfgItemsTotal = Array.from(
        modal?.querySelectorAll(".cfg-item") || [],
      ).reduce((sum, item) => {
        const price =
          Number(
            item
              .querySelector(".config-item__amount")
              ?.textContent.replace(/\s/g, ""),
          ) || 0;
        const qty = Math.max(
          0,
          Number(item.querySelector(".cfg-qty-input")?.value) || 0,
        );
        return sum + price * qty;
      }, 0);
      // Считаем config-item (старые, если останутся)
      const configItemsTotal = Array.from(
        modal?.querySelectorAll(".config-item") || [],
      ).reduce((sum, item) => sum + calcItemTotal(item), 0);
      const chipsTotal = getChipsTotal();
      const totalPriceEl = modal?.querySelector(".config-total-price");
      if (totalPriceEl) {
        totalPriceEl.textContent = formatPriceRub(
          BASE_PRICE + cfgItemsTotal + configItemsTotal + chipsTotal,
        );
      }
    }

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (modal.getAttribute("aria-hidden") === "false") closeModal(modal);
    });
  }

  function initCartPage() {
    const container = document.getElementById("cart-items-container");
    if (!container) return; // Not on cart page

    const checkoutBtn = document.getElementById("cart-checkout-btn");
    const promoToggle = document.getElementById("cart-promo-toggle");
    const promoField = document.getElementById("cart-promo-field");

    const labels = {
      size: "Размер",
      finish: "Цвет покрытия",
      glazing: "Остекление",
      opening: "Тип открывания",
      "opening-type": "Сторона открывания",
      pattern: "Узор",
      box: "Тип погонажа",
      casing: "Наличники",
      quantity: "Шт. доборов",
      "height-add": "Добор",
      threshold: "Порог",
      "handle-color": "Модель ручки",
      "lock-type": "Тип замка",
      "lock-color": "Цвет замка",
      locker: "Запирание (Фиксатор)",
      hinges: "Петли",
      "hinges-color": "Цвет петель",
      stopper: "Ограничитель",
    };

    // Meta bar
    const metaEl = document.getElementById("cart-meta");

    function renderCart() {
      const items = safeJsonParse(localStorage.getItem("dveryaninov_cart_v1"), []);
      container.innerHTML = "";

      if (items.length === 0) {
        container.innerHTML =
          "<p class='cart-empty'>Корзина пуста. <a href='catalog.html'>Перейти в каталог</a></p>";
        const cSide = document.querySelector(".cart-summary");
        if (cSide) cSide.style.display = "none";
        if (metaEl) metaEl.innerHTML = "";
        return;
      }

      // Show summary
      const cSide = document.querySelector(".cart-summary");
      if (cSide) cSide.style.display = "block";

      // Meta bar
      if (metaEl) {
        metaEl.innerHTML =
          '<span class="cart-meta__count">' + items.length + ' ' + pluralize(items.length, 'ТОВАР', 'ТОВАРА', 'ТОВАРОВ') + '</span>'
          + '<button type="button" class="cart-meta__clear" id="cart-clear-all">Очистить корзину</button>';
        document.getElementById("cart-clear-all")?.addEventListener("click", function () {
          localStorage.setItem("dveryaninov_cart_v1", "[]");
          renderCart();
          updateCartBadge();
        });
      }

      let total = 0;
      let priceRequestCount = 0;
      let servicesTotal = 0;

      items.forEach((item, index) => {
        const itemPrice = Number(item.priceSum || item.price || 0);
        const isPriceRequest = itemPrice === 0;
        if (isPriceRequest) {
          priceRequestCount++;
        } else {
          total += itemPrice;
        }

        /* --- Door options as individual rows --- */
        let propsHtml = "";
        if (item.options) {
          const doorKeys = [
            "size", "finish", "glazing", "opening", "opening-type",
            "pattern", "box", "casing", "quantity", "height-add",
            "threshold", "handle-color", "lock-type", "lock-color",
            "locker", "hinges", "hinges-color", "stopper"
          ];
          propsHtml = '<div class="cart-item__props">';
          for (const key of doorKeys) {
            const val = item.options[key];
            if (val && val !== "-") {
              const label = labels[key] || key;
              propsHtml += '<div class="cart-item__prop-row"><span class="cart-item__prop-label">' + label + ':</span> <span class="cart-item__prop-value">' + val + '</span></div>';
            }
          }
          if (item.note) {
            propsHtml += '<div class="cart-item__prop-row"><span class="cart-item__prop-label">Примечание к комплекту:</span> <span class="cart-item__prop-value">' + item.note + '</span></div>';
          }
          propsHtml += "</div>";
        }

        /* --- Accessories blocks --- */
        let accessoriesHtml = "";
        if (item.accessories && item.accessories.length) {
          accessoriesHtml += '<div class="cart-item__accessories-group">';
          accessoriesHtml += '<div class="cart-item__accessories-header">Погонаж</div>';
          item.accessories.forEach(function (acc) {
            accessoriesHtml += '<div class="cart-item__accessory">'
              + '<div class="cart-item__accessory-img">'
              + '<img src="' + (acc.image || item.image || "images/card-door-1.svg") + '" alt="' + (acc.title || "") + '">'
              + '</div>'
              + '<div class="cart-item__accessory-info">'
              + '<strong class="cart-item__accessory-title">' + (acc.title || "Аксессуар") + '</strong>'
              + (acc.spec ? '<div class="cart-item__accessory-spec">' + acc.spec + '</div>' : '')
              + (acc.qty ? '<div class="cart-item__accessory-qty-label">Кол-во: ' + acc.qty + ' шт.</div>' : '')
              + '</div>'
              + '</div>';
          });
          accessoriesHtml += '</div>';
        }

        /* --- Handle section --- */
        let handleHtml = "";
        if (item.options && item.options["handle-color"] && item.options["handle-color"] !== "-") {
          handleHtml = '<div class="cart-item__accessories-group">'
            + '<div class="cart-item__accessories-header">Ручка</div>'
            + '<div class="cart-item__accessory">'
            + '<div class="cart-item__accessory-info">'
            + '<strong class="cart-item__accessory-title">' + item.options["handle-color"] + '</strong>'
            + (item.options["lock-type"] ? '<div class="cart-item__accessory-spec">Замок: ' + item.options["lock-type"] + '</div>' : '')
            + '</div>'
            + '</div>'
            + '</div>';
        }

        const div = document.createElement("article");
        div.className = "cart-item";
        div.innerHTML = ''
          + '<div class="cart-item__door-section">'
          +   '<div class="cart-item__image-wrap">'
          +     '<img class="cart-item__image" src="' + (item.image || "images/card-door-1.svg") + '" alt="' + (item.title || "Товар") + '">'
          +   '</div>'
          +   '<div class="cart-item__info">'
          +     '<div class="cart-item__header">'
          +       '<div class="cart-item__header-left">'
          +         '<h3 class="cart-item__title">' + (item.title || "Товар конфигуратора") + '</h3>'
          +         '<span class="cart-item__price-tag">' + (isPriceRequest ? 'Цена по запросу' : (new Intl.NumberFormat("ru-RU").format(itemPrice) + ' ₽')) + '</span>'
          +       '</div>'
          +       '<div class="cart-item__action-links">'
          +         '<a href="catalog.html" class="cart-item__action-link">Добавить ещё дверь</a>'
          +         '<button type="button" class="cart-item__action-link" data-edit-item="' + index + '">Редактировать</button>'
          +         '<button type="button" class="cart-item__action-link cart-item__action-link_delete" data-remove-item="' + index + '">Удалить</button>'
          +       '</div>'
          +     '</div>'
          +     propsHtml
          +   '</div>'
          + '</div>'
          + handleHtml
          + accessoriesHtml;

        container.appendChild(div);
      });

      // Services area
      const servicesDiv = document.createElement("div");
      servicesDiv.className = "cart-services";
      servicesDiv.innerHTML = ''
        + '<label class="cart-services__item"><input type="checkbox" class="cart-services__checkbox" data-service="install" value="300"><span class="cart-services__label">Нужна установка двери</span></label>'
        + '<label class="cart-services__item"><input type="checkbox" class="cart-services__checkbox" data-service="delivery" value="300"><span class="cart-services__label">Нужна доставка</span></label>'
        + '<button type="button" class="cart-services__show-all">Показать все услуги ›</button>';
      container.appendChild(servicesDiv);

      // Bind service checkboxes
      servicesDiv.querySelectorAll(".cart-services__checkbox").forEach(function (cb) {
        cb.addEventListener("change", updateSummary);
      });

      updateSummary();

      function updateSummary() {
        let svcTotal = 0;
        let svcCount = 0;
        servicesDiv.querySelectorAll(".cart-services__checkbox:checked").forEach(function (cb) {
          svcTotal += Number(cb.value) || 0;
          svcCount++;
        });

        const goodsCount = items.length - priceRequestCount;
        const goodsEl = document.querySelector(".cart-summary__goods-count");
        const sumEl = document.querySelector(".cart-summary__sum");
        const reqCountEl = document.querySelector(".cart-summary__request-count");
        const svcCountEl = document.querySelector(".cart-summary__services-count");
        const svcSumEl = document.querySelector(".cart-summary__services-sum");

        if (goodsEl) goodsEl.textContent = goodsCount + ' ' + pluralize(goodsCount, 'товар', 'товара', 'товаров');
        if (sumEl) sumEl.textContent = total > 0 ? 'от ' + new Intl.NumberFormat("ru-RU").format(total) + ' ₽' : '0 ₽';
        if (reqCountEl) {
          reqCountEl.textContent = priceRequestCount + ' ' + pluralize(priceRequestCount, 'товар', 'товара', 'товаров');
          reqCountEl.closest('.cart-summary__row').style.display = priceRequestCount > 0 ? '' : 'none';
        }
        if (svcCountEl) svcCountEl.textContent = svcCount + ' ' + pluralize(svcCount, 'услуга', 'услуги', 'услуг');
        if (svcSumEl) svcSumEl.textContent = svcTotal > 0 ? new Intl.NumberFormat("ru-RU").format(svcTotal) + ' ₽' : '0 ₽';
      }

      // Bind remove/edit buttons
      container.addEventListener("click", function (e) {
        const removeBtn = e.target.closest("[data-remove-item]");
        if (removeBtn) {
          const idx = Number(removeBtn.getAttribute("data-remove-item"));
          window.removeCartItem(idx);
          return;
        }
        const editBtn = e.target.closest("[data-edit-item]");
        if (editBtn) {
          // Navigate back to product page for editing (simplified)
          const itemIdx = Number(editBtn.getAttribute("data-edit-item"));
          const cartItems = safeJsonParse(localStorage.getItem("dveryaninov_cart_v1"), []);
          if (cartItems[itemIdx]) {
            alert("Функция редактирования будет доступна в следующей версии");
          }
        }
      });
    }

    // Pluralization helper
    function pluralize(n, one, few, many) {
      const abs = Math.abs(n) % 100;
      const last = abs % 10;
      if (abs > 10 && abs < 20) return many;
      if (last > 1 && last < 5) return few;
      if (last === 1) return one;
      return many;
    }

    window.removeCartItem = (idx) => {
      const items = JSON.parse(
        localStorage.getItem("dveryaninov_cart_v1") || "[]",
      );
      items.splice(idx, 1);
      localStorage.setItem("dveryaninov_cart_v1", JSON.stringify(items));
      renderCart();
      updateCartBadge();
    };

    renderCart();

    // Promo toggle
    if (promoToggle && promoField) {
      promoToggle.addEventListener("click", function () {
        promoField.hidden = !promoField.hidden;
      });
    }

    // Checkout button — opens modal
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", function () {
        const items = safeJsonParse(localStorage.getItem("dveryaninov_cart_v1"), []);
        if (items.length === 0) { alert("Корзина пуста"); return; }

        const modal = document.getElementById("checkout-modal");
        if (!modal) return;

        const guestContent = document.getElementById("checkout-content");
        const authConfirm = document.getElementById("checkout-auth-confirm");
        const successScreen = document.getElementById("checkout-success");

        // Reset screens
        if (guestContent) guestContent.hidden = false;
        if (authConfirm) authConfirm.hidden = true;
        if (successScreen) successScreen.hidden = true;

        // Check auth
        const isAuth = typeof window.DvAuth !== 'undefined' && window.DvAuth.isLoggedIn();
        if (isAuth) {
          if (guestContent) guestContent.hidden = true;
          if (authConfirm) authConfirm.hidden = false;
          const userName = document.getElementById("checkout-user-name");
          const user = window.DvAuth.getCurrentUser();
          if (userName && user) userName.textContent = user.name || user.email;
        }

        openModal(modal);
      });
    }

    // Checkout form submit (guest)
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", function (e) {
        e.preventDefault();
        submitOrder();
      });
    }

    // Checkout auth confirm
    const authSubmit = document.getElementById("checkout-auth-submit");
    if (authSubmit) {
      authSubmit.addEventListener("click", function () {
        submitOrder();
      });
    }

    function submitOrder() {
      const items = safeJsonParse(localStorage.getItem("dveryaninov_cart_v1"), []);
      if (items.length === 0) { alert("Корзина пуста"); return; }

      const name = document.getElementById("checkout-name")?.value || "";
      const phone = document.getElementById("checkout-phone")?.value || "";

      const order = {
        id: "ORD-" + Math.floor(Math.random() * 1000000),
        date: new Date().toISOString(),
        customer: { name, phone },
        items: items,
        total: items.reduce(function (sum, item) {
          return sum + (Number(item.priceSum) || Number(item.price) || 0);
        }, 0),
      };

      const history = safeJsonParse(localStorage.getItem("dveryaninov_orders_v1"), []);
      history.push(order);
      localStorage.setItem("dveryaninov_orders_v1", JSON.stringify(history));
      localStorage.setItem("dveryaninov_cart_v1", "[]");

      // Show success
      const guestContent = document.getElementById("checkout-content");
      const authConfirm = document.getElementById("checkout-auth-confirm");
      const successScreen = document.getElementById("checkout-success");
      if (guestContent) guestContent.hidden = true;
      if (authConfirm) authConfirm.hidden = true;
      if (successScreen) successScreen.hidden = false;

      renderCart();
      updateCartBadge();
    }

    // Close checkout modal handlers
    const checkoutModal = document.getElementById("checkout-modal");
    if (checkoutModal) {
      checkoutModal.querySelectorAll("[data-close-checkout]").forEach(function (btn) {
        btn.addEventListener("click", function () { closeModal(checkoutModal); });
      });
      const backdrop = checkoutModal.querySelector(".checkout-modal__backdrop");
      if (backdrop) {
        backdrop.addEventListener("click", function () { closeModal(checkoutModal); });
      }
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && checkoutModal.getAttribute("aria-hidden") !== "true") {
          closeModal(checkoutModal);
        }
      });
    }

    // Auth hint buttons
    const loginBtn = document.getElementById("checkout-login-btn");
    const registerBtn = document.getElementById("checkout-register-btn");
    if (loginBtn) {
      loginBtn.addEventListener("click", function () {
        const authModal = document.getElementById("auth-modal");
        if (authModal) {
          if (checkoutModal) closeModal(checkoutModal);
          openModal(authModal);
          const loginTab = authModal.querySelector('[data-tab="login"]');
          if (loginTab) loginTab.click();
        }
      });
    }
    if (registerBtn) {
      registerBtn.addEventListener("click", function () {
        const authModal = document.getElementById("auth-modal");
        if (authModal) {
          if (checkoutModal) closeModal(checkoutModal);
          openModal(authModal);
          const regTab = authModal.querySelector('[data-tab="register"]');
          if (regTab) regTab.click();
        }
      });
    }
  }

  window.updateWishlistBadge = updateWishlistBadge;
  window.addToCart = addToCart;
  window.updateCartBadge = updateCartBadge;

  document.addEventListener("click", (e) => {
    const target = e.target;
    // For Wishlist button
    const wishBtn = target.closest(".card__fav, .product__btn_wishlist");
    // For Cart button
    const cartBtn = target.closest(".product__btn_cart");
    
    if (cartBtn) {
      e.preventDefault();
      
      const card = cartBtn.closest(".card");
      let title = "Товар";
      let image = "images/card-door-1.svg";
      let priceVal = 0;
      let id = "p-" + Date.now();
      let size = "2000×600";
      let color = "RAL 9003";

      if (card) {
          title = card.querySelector(".card__title")?.textContent.trim() || title;
          image = card.querySelector("img")?.getAttribute("src") || image;
          priceVal = parseInt((card.querySelector(".card__price")?.textContent || "0").replace(/\D/g, "")) || 0;
          const link = card.querySelector("a")?.getAttribute("href") || "";
          id = link ? link.split("/").pop().replace(".html", "") : id;
      } else {
          title = document.querySelector(".product__title")?.textContent.trim() || document.querySelector("h1")?.textContent.trim() || title;
          image = document.querySelector(".product__main-image img")?.getAttribute("src") || image;
          priceVal = parseInt((document.querySelector(".product__price")?.textContent || "0").replace(/\D/g, "")) || 52000;
          
          size = document.querySelector(".product__size_active")?.textContent.trim() || size;
          const activeColorBtn = document.querySelector(".product__color_active");
          if (activeColorBtn) {
              const label = activeColorBtn.getAttribute("aria-label");
              if (label) color = label;
          }
          
          const path = window.location.pathname.split("/").pop();
          if (path && path !== "product.html" && path !== "") {
              id = path.replace(".html", "");
          }
      }

      window.addToCart({
          id: id,
          title: title,
          price: priceVal,
          priceSum: priceVal,
          image: image,
          qty: 1,
          options: { size: size, finish: color },
          accessories: []
      });
      window.location.href = "cart.html";
      return;
    }

    if (wishBtn) {
      e.preventDefault();
      const card = wishBtn.closest(".card");
      let id, title, image, price;
      
      if (card) {
        title = card.querySelector(".card__title")?.textContent.trim() || "Товар";
        image = card.querySelector("img")?.getAttribute("src") || "";
        const priceText = card.querySelector(".card__price")?.textContent || "0";
        price = parseInt(priceText.replace(/\D/g, "")) || 0;
        const link = card.querySelector("a")?.getAttribute("href") || "";
        id = link ? link.split("/").pop().replace(".html", "") : "p-" + Date.now();
      } else {
        title = document.querySelector(".product__title")?.textContent.trim() || document.querySelector("h1")?.textContent.trim() || "Товар";
        image = document.querySelector(".product__main-image img")?.getAttribute("src") || "";
        const priceText = document.querySelector(".product__price")?.textContent || "0";
        price = parseInt(priceText.replace(/\D/g, "")) || 0;
        
        const path = window.location.pathname.split("/").pop();
        id = (path && path !== "product.html" && path !== "") ? path.replace(".html", "") : "p-" + Date.now();
      }

      const added = toggleWishlist({ id, title, image, price });
      wishBtn.classList.toggle("is-active", added);
    }
  });

    // Init visual state
  document.addEventListener("DOMContentLoaded", () => {
    document
      .querySelectorAll(".card__fav, .product__btn_wishlist")
      .forEach((btn) => {
        const card = btn.closest(".card");
        let id, title;
        if (card) {
          title =
            card.querySelector(".card__title")?.textContent.trim() || "Товар";
          const link = card.querySelector("a")?.getAttribute("href") || "";
          id = link ? link.split("/").pop() : title;
        } else {
          title =
            document.querySelector(".product__title")?.textContent.trim() ||
            document
              .querySelector(".breadcrumbs__current")
              ?.textContent.trim() ||
            "Товар";
          id = window.location.pathname.split("/").pop() || title;
        }
        if (isInWishlist(id)) {
          btn.classList.add("is-active");
        }
      });
  });

  // Call initCartPage
  initCartPage();

  function initWishlistPage() {
    const grid = document.getElementById("wishlist-grid");
    const empty = document.getElementById("wishlist-empty");
    if (!grid) return;

    function render() {
      const items = getWishlist();
      grid.innerHTML = "";

      if (items.length === 0) {
        grid.hidden = true;
        if (empty) empty.hidden = false;
        return;
      }

      grid.hidden = false;
      if (empty) empty.hidden = true;

      items.forEach((item) => {
        const card = document.createElement("article");
        card.className = "card card_wishlist";

        card.innerHTML = `
          <a href="${item.id === "Товар" ? "#" : item.id + ".html"}" class="card__link">
            <div class="card__image-wrap">
              <img src="${item.image || "images/card-door-1.svg"}" alt="${item.title}" class="card__image" loading="lazy">
              <div class="card__badges">
                <span class="card__badge card__badge_hit">Хит</span>
              </div>
            </div>
            <div class="card__info">
              <h3 class="card__title">${item.title}</h3>
              <div class="card__price-row">
                <span class="card__price">${new Intl.NumberFormat("ru-RU").format(item.price)} ₽</span>
              </div>
            </div>
          </a>
          <button class="card__fav is-active" aria-label="Убрать из избранного" onclick="window.removeWishlistItem('${item.id}')"></button>
        `;

        // Add minimal inline style for wish cards to flow like catalog if needed
        card.style.position = "relative";
        const fav = card.querySelector(".card__fav");
        if (fav) {
          fav.style.position = "absolute";
          fav.style.top = "12px";
          fav.style.right = "12px";
        }

        grid.appendChild(card);
      });
    }

    window.removeWishlistItem = (id) => {
      const items = getWishlist();
      const newItems = items.filter((x) => x.id !== id);
      setWishlist(newItems);
      render();
      if (typeof updateWishlistBadge === "function") updateWishlistBadge();
    };

    render();
  }

  initWishlistPage();
  initConfigurator();

  // Lead form handler
  const leadForm = document.querySelector(".lead__form");
  if (leadForm) {
    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const inputs = leadForm.querySelectorAll(".lead__input");
      const name = inputs[0]?.value.trim() || "";
      const phone = inputs[1]?.value.trim() || "";
      if (!name || !phone) return;
      console.log("[Лид] Заявка:", { name, phone });
      leadForm.innerHTML = '<p style="text-align:center;font-size:16px;color:#333;padding:20px 0;">Спасибо! Мы свяжемся с вами в ближайшее время.</p>';
    });
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  if (typeof updateWishlistBadge === "function") updateWishlistBadge();
  if (typeof updateCartBadge === "function") updateCartBadge();
});
