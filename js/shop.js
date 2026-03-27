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
    }

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

      if (added) {
        wishBtn.style.backgroundColor = "var(--color-primary, #e21836)";
        wishBtn.style.borderColor = "var(--color-primary, #e21836)";
      } else {
        wishBtn.style.backgroundColor = "";
        wishBtn.style.borderColor = "";
      }
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
          btn.style.backgroundColor = "var(--color-primary, #e21836)";
          btn.style.borderColor = "var(--color-primary, #e21836)";
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
          fav.style.backgroundColor = "var(--color-primary, #e21836)";
          fav.style.borderColor = "var(--color-primary, #e21836)";
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
})();

document.addEventListener("DOMContentLoaded", () => {
  if (typeof updateWishlistBadge === "function") updateWishlistBadge();
  if (typeof updateCartBadge === "function") updateCartBadge();
});
