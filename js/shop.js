(() => {
  const CART_KEY = "dveryaninov_cart_v1";
  const WISHLIST_KEY = "dveryaninov_wishlist_v1";

  function safeJsonParse(value, fallback) {
    try {
      var result = JSON.parse(value);
      return result != null ? result : fallback;
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
    const count = items.reduce((sum, it) => sum + (it.doorQty || 1), 0);
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

  function getBasePrice() {
    var priceEl = document.querySelector(".product__price");
    if (!priceEl) return 52000;
    var text = priceEl.textContent || "0";
    return Number((text.match(/\d[\d\s]*/)?.[0] || "0").replace(/\s/g, "")) || 52000;
  }

  function initConfigurator() {
    let modal = document.querySelector(".cfg-modal");

    const state = {
      // Шаг 1 — Конфигурация двери
      size: "2000×600",
      "coating-type": "ПВХ",
      finish: "RAL 9003",
      glazing: "Сатинато белое",
      pattern: "Без узора",
      opening: "Распашная",
      "opening-type": "Левое на себя",
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
      updateQtyDisplay();
    }

    function updateQtyDisplay() {
      var displayEl = modal?.querySelector("[data-qty-display]");
      if (!displayEl) return;
      var parts = [];
      modal.querySelectorAll(".cfg-item").forEach(function(item) {
        if (item.closest(".cfg-radio-group")) return;
        var qtyInput = item.querySelector(".cfg-qty-input");
        if (!qtyInput) return;
        var qty = Number(qtyInput.value) || 0;
        if (qty > 0) {
          var name = item.querySelector(".cfg-item__name")?.textContent.trim() || "";
          parts.push(name + " ×" + qty);
        }
      });
      displayEl.textContent = parts.length ? parts.join(", ") : "\u2014";
    }

    // Определение типа покрытия по имени
    function getCoatingType(name) {
      if (/ПЭТ/i.test(name)) return "ПЭТ";
      if (/Эмаль/i.test(name)) return "Эмаль";
      return "ПВХ";
    }

    function populateCoatingSwatches() {
      var container = modal?.querySelector("#cfgCoatingsContainer");
      if (!container || !window.DVERYANINOV_COATINGS) return;
      var grid = document.createElement("div");
      grid.className = "cfg-coatings-grid";
      window.DVERYANINOV_COATINGS.forEach(function(c, i) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cfg-coating-swatch";
        btn.setAttribute("data-coating", c[0]);
        btn.setAttribute("data-coating-type", getCoatingType(c[0]));
        btn.title = c[0];
        var swatch = document.createElement("span");
        swatch.className = "cfg-coating-swatch__color";
        swatch.style.background = c[1];
        var label = document.createElement("span");
        label.className = "cfg-coating-swatch__name";
        label.textContent = c[0];
        var zoom = document.createElement("span");
        zoom.className = "cfg-swatch-zoom";
        zoom.style.background = c[1];
        btn.appendChild(swatch);
        btn.appendChild(label);
        btn.appendChild(zoom);
        grid.appendChild(btn);
      });
      container.appendChild(grid);
    }

    // Фильтрация покрытий по выбранному типу (ПВХ/ПЭТ/Эмаль)
    function filterCoatingsByType(type) {
      if (!modal) return;
      var swatches = modal.querySelectorAll(".cfg-coating-swatch");
      var activeHidden = false;
      var hasActive = false;
      swatches.forEach(function(btn) {
        var btnType = btn.getAttribute("data-coating-type");
        var visible = btnType === type;
        btn.style.display = visible ? "" : "none";
        if (btn.classList.contains("cfg-coating-swatch_active")) {
          if (!visible) activeHidden = true;
          else hasActive = true;
        }
      });
      // Если текущий активный скрыт или нет активного — выбрать первый видимый
      if (activeHidden || !hasActive) {
        swatches.forEach(function(btn) { btn.classList.remove("cfg-coating-swatch_active"); });
        var first = modal.querySelector('.cfg-coating-swatch:not([style*="display: none"])');
        if (first) {
          first.classList.add("cfg-coating-swatch_active");
          var name = first.getAttribute("data-coating");
          state.finish = name;
          var coatingHeader = modal.querySelector("#cfgCoatingsContainer")?.closest(".config-detail-item")?.querySelector(".config-detail-value");
          if (coatingHeader) coatingHeader.textContent = name;
        }
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

    // ─── Стандартные кол-ва погонажа на одностворчатую дверь ───
    var MOLDING_DEFAULT_QTY = {
      box: 3,       // стойка короба: 2 на бока + 1 на верх
      casing: 5,    // наличник: 2.5 на сторону × 2 стороны
      dobor: 0,     // добор: 0 по умолчанию
      handle: 1,
      locker: 1,
      hinges: 1,
      glazing: 1,
      "opening-type": 0  // тип открывания — не товар, не добавлять в аксессуары
    };

    // ─── Декларативные зависимости между параметрами ───
    // Ключ верхнего уровня — группа-источник (changedGroup).
    // Для каждого значения источника — массив допустимых data-radio-value
    // в группе-потребителе. Если значение отсутствует в карте, все элементы видимы.
    var DEPENDENCIES = {
      // Стойка короба → Наличник
      box: {
        casing: {
          "Телескоп":     ["Телескоп 80мм", "Телескоп 100мм", "Телескоп+", "Плоский", "Декоративный"],
          "Компланарная": ["Компланарный"],
          "Книжка":       ["Телескоп 80мм", "Телескоп 100мм", "Телескоп+", "Плоский"]
        },
        dobor: {
          "Телескоп":     ["Телескоп ТИП 2", "Без добора"],
          "Компланарная": ["Без добора"],
          "Книжка":       ["Без добора"]
        }
      },
      // Вариант открывания → видимость секций фурнитуры
      opening: {
        _sections: {
          "Раздвижная": { hide: ["handle", "locker", "hinges"] },
          "Распашная":  { hide: [] }
        }
      }
    };

    // Показать toast-уведомление при авто-сбросе параметра
    function showDepToast(msg) {
      var toast = document.createElement("div");
      toast.className = "cfg-dep-toast";
      toast.textContent = msg;
      (modal || document.body).appendChild(toast);
      requestAnimationFrame(function() { toast.classList.add("cfg-dep-toast_show"); });
      setTimeout(function() {
        toast.classList.remove("cfg-dep-toast_show");
        setTimeout(function() { toast.remove(); }, 300);
      }, 3000);
    }

    /**
     * applyDependencies(changedGroup) — фильтрует зависимые группы.
     * Для каждого зависимого radio-group:
     *   - скрывает несовместимые элементы
     *   - если текущий активный стал скрыт — авто-выбирает первый видимый
     *   - при авто-сбросе показывает toast и рекурсивно вызывает себя
     * Для _sections — скрывает/показывает целые cfg-section по data-radio-group.
     */
    function applyDependencies(changedGroup) {
      if (!modal) return;
      var deps = DEPENDENCIES[changedGroup];
      if (!deps) return;
      var srcValue = state[changedGroup];

      // --- обработка _sections (показ/скрытие целых секций) ---
      if (deps._sections) {
        var rule = deps._sections[srcValue];
        var hideList = rule ? rule.hide : [];
        // Показываем все секции из пула, затем скрываем нужные
        var allGroupNames = new Set();
        Object.keys(deps._sections).forEach(function(k) {
          (deps._sections[k].hide || []).forEach(function(g) { allGroupNames.add(g); });
        });
        allGroupNames.forEach(function(groupName) {
          var section = modal.querySelector('[data-radio-group="' + groupName + '"]');
          if (section) {
            var cfgSection = section.closest(".cfg-section");
            if (cfgSection) {
              var hidden = hideList.indexOf(groupName) !== -1;
              cfgSection.style.display = hidden ? "none" : "";
              // Если скрыли — деактивируем текущий выбор, обнуляем state
              if (hidden) {
                section.querySelectorAll(".cfg-item_active").forEach(function(el) {
                  el.classList.remove("cfg-item_active");
                });
                state[groupName] = undefined;
                var displayEl = modal.querySelector('[data-radio-display="' + groupName + '"]');
                if (displayEl) displayEl.textContent = "\u2014";
              }
            }
          }
        });
      }

      // --- обработка radio-group фильтрации ---
      Object.keys(deps).forEach(function(targetGroup) {
        if (targetGroup === "_sections") return;
        var allowed = deps[targetGroup][srcValue];
        // Если нет правил для этого значения — показать всё
        var showAll = !allowed;

        var rg = modal.querySelector('[data-radio-group="' + targetGroup + '"]');
        if (!rg) return;

        var activeItem = rg.querySelector(".cfg-item_active");
        var activeValue = activeItem ? activeItem.getAttribute("data-radio-value") : null;
        var activeHidden = false;

        rg.querySelectorAll(".cfg-item").forEach(function(item) {
          var val = item.getAttribute("data-radio-value");
          if (showAll) {
            item.style.display = "";
          } else {
            var visible = allowed.indexOf(val) !== -1;
            item.style.display = visible ? "" : "none";
            if (!visible && val === activeValue) activeHidden = true;
          }
        });

        // Если активный элемент стал скрыт — авто-выбор первого видимого
        if (activeHidden) {
          var firstVisible = rg.querySelector('.cfg-item:not([style*="display: none"])');
          if (firstVisible) {
            rg.querySelectorAll(".cfg-item").forEach(function(el) { el.classList.remove("cfg-item_active"); });
            firstVisible.classList.add("cfg-item_active");
            var newVal = firstVisible.getAttribute("data-radio-value");
            state[targetGroup] = newVal;
            // Обновить display в аккордеоне
            var displayEl = modal.querySelector('[data-radio-display="' + targetGroup + '"]');
            var newName = firstVisible.querySelector(".cfg-item__name")?.textContent.trim();
            if (displayEl && newName) displayEl.textContent = newName;
            // Toast
            var labelEl = rg.closest(".cfg-section")?.querySelector(".config-detail-label");
            var label = labelEl ? labelEl.textContent.trim() : targetGroup;
            showDepToast(label + ' изменён на «' + (newName || newVal) + '» — совместим с выбранным параметром');
            // Рекурсивный каскад
            applyDependencies(targetGroup);
          } else {
            // Ни один элемент не доступен — сбрасываем
            rg.querySelectorAll(".cfg-item").forEach(function(el) { el.classList.remove("cfg-item_active"); });
            state[targetGroup] = undefined;
            var displayEl2 = modal.querySelector('[data-radio-display="' + targetGroup + '"]');
            if (displayEl2) displayEl2.textContent = "\u2014";
          }
        }
      });

      updateConfigTotal();
    }

    // Hide glazing section for ПГ (глухое полотно) doors
    // Определяем наличие остекления по миниатюрам: если есть thumb с «ПО» в alt — дверь со стеклом
    function toggleGlazingVisibility() {
      if (!modal) return;
      var thumbs = document.querySelectorAll(".product__thumb img");
      var hasPO = false;
      thumbs.forEach(function(img) {
        if (/ПО/i.test(img.getAttribute("alt") || "")) hasPO = true;
      });
      var isPG = !hasPO;
      // Glazing is now a cfg-section with data-radio-group="glazing"
      var glazingBody = modal.querySelector('[data-radio-group="glazing"]');
      if (glazingBody) {
        var cfgSection = glazingBody.closest(".cfg-section");
        if (cfgSection) {
          cfgSection.style.display = isPG ? "none" : "";
          if (isPG) {
            state.glazing = "-";
          }
        }
      }
    }

    // Переключаем изображение двери в конструкторе при смене остекления
    // «Без остекления» → ПГ-картинка, любое стекло → ПО-картинка
    function swapDoorImage(glazingValue) {
      if (!modal) return;
      var cfgImgEl = modal.querySelector("#cfgImageEl");
      if (!cfgImgEl) return;
      var thumbs = document.querySelectorAll(".product__thumb img");
      var pgSrc = null, poSrc = null;
      thumbs.forEach(function(img) {
        var alt = img.getAttribute("alt") || "";
        var src = img.getAttribute("src") || "";
        if (/ПО/i.test(alt)) {
          poSrc = src;
        } else if (!poSrc || /ПГ/i.test(alt)) {
          pgSrc = src;
        }
      });
      // Если нет отдельных ПГ/ПО — не переключаем
      if (!pgSrc || !poSrc) return;
      var wantGlazed = glazingValue && !/^Без\s/i.test(glazingValue);
      cfgImgEl.src = wantGlazed ? poSrc : pgSrc;
    }

    // Конфигурация шагов: текст кнопки «Далее». Изображение берётся с карточки товара.
    const stepConfig = {
      config: {
        nextLabel: "ВЫБРАТЬ ПОГОНАЖ →",
        nextStep: "molding",
      },
      molding: {
        nextLabel: "ВЫБРАТЬ ФУРНИТУРУ →",
        nextStep: "hardware",
      },
      hardware: {
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

      // Обновляем кнопку «Далее» (изображение двери остаётся неизменным)
      const cfg = stepConfig[step];
      if (cfg) {
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
        // Сбрасываем только в пределах нового шага
        newStepEl.querySelectorAll(".config-detail-options").forEach((el) => {
          el.classList.remove("is-open");
        });
        newStepEl.querySelectorAll(".cfg-section__body").forEach((el) => {
          el.classList.remove("is-open");
        });
        newStepEl.querySelectorAll(".config-detail-toggle").forEach((btn) => {
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

      // 2. Закрываем все аккордеон-элементы в активном шаге
      var activeStep = modal.querySelector(".config-step_active");
      if (activeStep) {
        activeStep.querySelectorAll(".config-detail-options").forEach((el) => {
          el.classList.remove("is-open");
        });
        activeStep.querySelectorAll(".cfg-section__body").forEach((el) => {
          el.classList.remove("is-open");
        });
        activeStep.querySelectorAll(".config-detail-toggle").forEach((btn) => {
          btn.setAttribute("aria-expanded", "false");
        });
      }

      // 3. Открываем первый аккордеон-элемент активного шага
      openFirstAccordionItem(modal.querySelector(".config-step_active"));
    }

    function openFirstAccordionItem(stepEl) {
      if (!stepEl) return;
      // Ищем первый аккордеон ЛЮБОГО типа в порядке DOM
      // (config-detail-item с toggle ИЛИ cfg-section с data-section-toggle)
      var allHeaders = stepEl.querySelectorAll(".config-detail-header");
      for (var i = 0; i < allHeaders.length; i++) {
        var header = allHeaders[i];
        var toggle = header.querySelector(".config-detail-toggle");
        if (!toggle) continue;
        // Определяем тип: cfg-section или config-detail-item
        var sectionToggle = header.closest("[data-section-toggle]");
        if (sectionToggle) {
          // cfg-section: открываем body
          var body = sectionToggle.closest(".cfg-section")?.querySelector(".cfg-section__body");
          toggle.setAttribute("aria-expanded", "true");
          if (body) body.classList.add("is-open");
        } else {
          // config-detail-item: открываем options
          toggle.setAttribute("aria-expanded", "true");
          var options = header.nextElementSibling;
          if (options) options.classList.add("is-open");
        }
        return; // Открываем только первый
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
        // Закрываем все остальные аккордеоны в том же шаге (и config-detail, и cfg-section)
        if (!isExpanded) {
          const stepEl = detailHeader.closest(".config-step");
          if (stepEl) {
            stepEl.querySelectorAll(".config-detail-header").forEach((h) => {
              if (h === detailHeader) return;
              if (h.closest("[data-section-toggle]")) return;
              const t = h.querySelector(".config-detail-toggle");
              if (t) t.setAttribute("aria-expanded", "false");
              const opts = h.nextElementSibling;
              if (opts) opts.classList.remove("is-open");
            });
            stepEl.querySelectorAll(".cfg-section").forEach((s) => {
              const t = s.querySelector("[data-section-toggle] .config-detail-toggle");
              const b = s.querySelector(".cfg-section__body");
              if (t) t.setAttribute("aria-expanded", "false");
              if (b) b.classList.remove("is-open");
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

      // Раскрытие секции (Модель ручки и т.п.) — одна открытая, остальные закрыты
      const sectionToggle = target.closest("[data-section-toggle]");
      if (sectionToggle) {
        const toggle = sectionToggle.querySelector(".config-detail-toggle");
        const section = sectionToggle.closest(".cfg-section");
        const body = section?.querySelector(".cfg-section__body");
        if (!toggle || !body) return;
        const isExpanded = toggle.getAttribute("aria-expanded") === "true";

        // Закрываем все остальные аккордеоны в том же шаге (и cfg-section, и config-detail)
        if (!isExpanded) {
          const stepEl = sectionToggle.closest(".config-step");
          if (stepEl) {
            stepEl.querySelectorAll(".cfg-section").forEach((s) => {
              if (s === section) return;
              const t = s.querySelector("[data-section-toggle] .config-detail-toggle");
              const b = s.querySelector(".cfg-section__body");
              if (t) t.setAttribute("aria-expanded", "false");
              if (b) b.classList.remove("is-open");
            });
            stepEl.querySelectorAll(".config-detail-header").forEach((h) => {
              if (h.closest("[data-section-toggle]")) return;
              const t = h.querySelector(".config-detail-toggle");
              if (t) t.setAttribute("aria-expanded", "false");
              const opts = h.nextElementSibling;
              if (opts) opts.classList.remove("is-open");
            });
          }
        }

        toggle.setAttribute("aria-expanded", isExpanded ? "false" : "true");
        body.classList.toggle("is-open", !isExpanded);
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

      // Выбор карточки (Radio) в config-detail-options
      const cfgItemToSelect = target.closest(".cfg-item");
      if (
        cfgItemToSelect &&
        !target.closest(".cfg-qty-btn") &&
        !target.closest(".cfg-qty-input")
      ) {
        // Radio group (handles, hinges, casing etc.) — одна активная
        const radioGroup = cfgItemToSelect.closest(".cfg-radio-group");
        if (radioGroup) {
          radioGroup.querySelectorAll(".cfg-item").forEach((item) => item.classList.remove("cfg-item_active"));
          cfgItemToSelect.classList.add("cfg-item_active");
          // Обновляем state
          const groupName = radioGroup.getAttribute("data-radio-group");
          const radioValue = cfgItemToSelect.getAttribute("data-radio-value");
          if (groupName && radioValue) state[groupName] = radioValue;
          // Обновляем отображение в заголовке аккордеона
          var displayEl = modal.querySelector('[data-radio-display="' + groupName + '"]');
          var itemName = cfgItemToSelect.querySelector(".cfg-item__name")?.textContent.trim();
          if (displayEl && itemName) displayEl.textContent = itemName;
          // Переключаем изображение двери при выборе остекления
          if (groupName === "glazing") swapDoorImage(radioValue);
          updateConfigTotal();
          applyDependencies(groupName);
          return;
        }

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
        // Dynamically load constructor modal if not present
        if (!modal) {
          fetch("constructor-template.html")
            .then(function(r) { return r.text(); })
            .then(function(html) {
              var modelName = document.querySelector(".product__title")?.textContent.trim() || "Товар";
              var productImg = document.querySelector(".product__main-image img")?.getAttribute("src") || "images/card-door-1.svg";
              html = html.replace(/\{\{MODEL_NAME\}\}/g, modelName);
              var wrapper = document.createElement("div");
              wrapper.innerHTML = html;
              document.body.appendChild(wrapper.firstElementChild);
              modal = document.getElementById("configModal");
              var cfgImgEl = modal.querySelector("#cfgImageEl");
              if (cfgImgEl) cfgImgEl.src = productImg;
              // Populate coating swatches from global data
              populateCoatingSwatches();
              filterCoatingsByType(state["coating-type"] || "ПВХ");
              syncStateFromPage();
              toggleGlazingVisibility();
              openModal(modal);
              initModalSelection();
              addPriceBadges();
              addItemZoomPopups();
              initSmartZoom();
              updateConfigTotal();
              setStep("config");
            });
          return;
        }
        syncStateFromPage();
        toggleGlazingVisibility();
        openModal(modal);
        initModalSelection();
        addPriceBadges();
        addItemZoomPopups();
        initSmartZoom();
        updateConfigTotal();
        setStep("config");
        return;
      }

      const openStepEl = target.closest("[data-open-config-step]");
      if (openStepEl) {
        const step = openStepEl.getAttribute("data-open-config-step");
        syncStateFromPage();
        toggleGlazingVisibility();
        openModal(modal);
        initModalSelection();
        addPriceBadges();
        addItemZoomPopups();
        initSmartZoom();
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

        // Фильтрация покрытий по типу (ПВХ/ПЭТ/Эмаль)
        if (pick === "coating-type") {
          filterCoatingsByType(value);
        }

        // Фильтрация погонажа по размеру двери
        if (pick === "size" && modal) {
          const widthMatch = value.match(/×(\d+)/);
          const doorWidth = widthMatch ? widthMatch[1] : "";
          modal.querySelectorAll("[data-step='molding'] [data-for-width]").forEach(function(el) {
            const allowed = el.getAttribute("data-for-width").split(",");
            var cfgItem = el.closest(".cfg-item");
            if (cfgItem) cfgItem.style.display = allowed.includes(doorWidth) ? "" : "none";
          });
          // Синхронизация размера в карточку товара
          var norm = value.replace(/×/g, "х");
          document.querySelectorAll(".product__size").forEach(function(b) {
            if (b.classList.contains("product__size_measure") || b.classList.contains("product__size_own")) return;
            b.classList.toggle("product__size_active", b.textContent.trim() === norm);
          });
          var sizeVal = document.querySelector(".product__option-value");
          if (sizeVal) sizeVal.textContent = norm;
        }

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
        applyDependencies(pick);
        return;
      }

      // Клик по покрытию в конфигураторе
      var coatingSwatch = target.closest(".cfg-coating-swatch");
      if (coatingSwatch && modal?.contains(coatingSwatch)) {
        modal.querySelectorAll(".cfg-coating-swatch").forEach(function(s) { s.classList.remove("cfg-coating-swatch_active"); });
        coatingSwatch.classList.add("cfg-coating-swatch_active");
        var coatingName = coatingSwatch.getAttribute("data-coating");
        state.finish = coatingName;
        // Обновляем header
        var coatingHeader = coatingSwatch.closest(".config-detail-item")?.querySelector(".config-detail-value");
        if (coatingHeader) coatingHeader.textContent = coatingName;
        // Синхронизируем на страницу товара
        if (typeof window.syncCoatingToPage === "function") window.syncCoatingToPage(coatingName);
        return;
      }

      // Клик по цветовой плитке
      var colorTile = target.closest(".cfg-color-tile");
      if (colorTile) {
        var colorGrid = colorTile.closest(".cfg-color-grid");
        if (colorGrid) colorGrid.querySelectorAll(".cfg-color-tile").forEach(function(t) { t.classList.remove("cfg-color-tile_active"); });
        colorTile.classList.add("cfg-color-tile_active");
        // Обновляем header и state
        var pick = colorTile.getAttribute("data-pick");
        var val = colorTile.getAttribute("data-value");
        if (pick) state[pick] = val;
        var tileHeader = colorTile.closest(".config-detail-item")?.querySelector(".config-detail-value");
        if (tileHeader && val) tileHeader.textContent = val;
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
        // Элементы со счётчиком
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
        // Элементы из radio-групп (активный = дефолтный qty по типу)
        modal.querySelectorAll(".cfg-radio-group .cfg-item_active").forEach((item) => {
          if (item.querySelector(".cfg-qty-input")) return; // уже учтён выше
          const accTitle = item.querySelector(".cfg-item__name")?.textContent.trim() || "";
          if (!accTitle) return;
          // Skip "Без добора" / "Без остекления" — не добавлять в аксессуары
          if (/^Без\s/i.test(accTitle)) return;
          const spec = item.querySelector(".cfg-item__spec")?.textContent.trim() || "";
          var price = 0;
          if (item.hasAttribute("data-price")) {
            price = Number(item.getAttribute("data-price")) || 0;
          } else {
            price = Number(item.querySelector(".config-item__amount")?.textContent.replace(/[^\d]/g, "")) || 0;
          }
          const accImg = item.querySelector('.cfg-item__thumb img')?.getAttribute('src') || '';
          var groupName = item.closest("[data-radio-group]")?.getAttribute("data-radio-group") || "";
          var defaultQty = MOLDING_DEFAULT_QTY[groupName] !== undefined ? MOLDING_DEFAULT_QTY[groupName] : 1;
          if (defaultQty === 0) return; // Не добавлять если qty = 0
          accessories.push({
            id: `acc-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            title: accTitle,
            spec,
            qty: defaultQty,
            price,
            oldPrice: 0,
            image: accImg,
          });
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

        // Берём изображение из конфигуратора (может быть ПО), если нет — с карточки
        var cfgImg = modal.querySelector("#cfgImageEl");
        var cartImage = (cfgImg && cfgImg.src) ? cfgImg.getAttribute("src") : (imgEl ? imgEl.getAttribute("src") : "");
        var newItem = {
          id: `p-${Date.now()}`,
          title,
          price: totalPrice,
          image: cartImage,
          qty: 1,
          options: { ...state },
          accessories,
          productUrl: window.location.pathname.split('/').pop() || '',
        };

        // If editing an existing cart item, replace it
        if (typeof window._dvEditCartIndex === 'number') {
          var cartItems = safeJsonParse(localStorage.getItem("dveryaninov_cart_v1"), []);
          var editIdx = window._dvEditCartIndex;
          if (cartItems[editIdx]) {
            newItem.doorQty = cartItems[editIdx].doorQty || 1;
            cartItems[editIdx] = newItem;
            localStorage.setItem("dveryaninov_cart_v1", JSON.stringify(cartItems));
            updateCartBadge();
          } else {
            addToCart(newItem);
          }
          delete window._dvEditCartIndex;
        } else {
          addToCart(newItem);
        }

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
      var total = 0;
      // config-chip (размер, остекление, открывание, ограничитель и т.д.)
      modal
        .querySelectorAll(".config-chip_active[data-price]")
        .forEach(function (chip) {
          total += Number(chip.getAttribute("data-price")) || 0;
        });
      // cfg-color-tile (цвет ручки и т.д.)
      modal
        .querySelectorAll(".cfg-color-tile_active[data-price]")
        .forEach(function (tile) {
          total += Number(tile.getAttribute("data-price")) || 0;
        });
      return total;
    }

    function addPriceBadges() {
      modal
        .querySelectorAll("[data-pick][data-price]")
        .forEach(function (chip) {
          if (chip.querySelector(".config-chip__delta")) return;
          var price = Number(chip.getAttribute("data-price")) || 0;
          if (price === 0) return; // Don't show badge for base price
          var badge = document.createElement("small");
          badge.className = "config-chip__delta";
          badge.textContent =
            "+\u2009" + formatPriceRub(price) + "\u00a0\u20bd";
          chip.appendChild(badge);
        });
    }

    function addItemZoomPopups() {
      modal.querySelectorAll(".cfg-item").forEach(function(item) {
        if (item.querySelector(".cfg-item__zoom")) return;
        var thumb = item.querySelector(".cfg-item__thumb img");
        if (!thumb) return;
        var zoom = document.createElement("span");
        zoom.className = "cfg-item__zoom";
        var img = document.createElement("img");
        img.src = thumb.src;
        img.alt = thumb.alt || "";
        img.loading = "lazy";
        zoom.appendChild(img);
        item.appendChild(zoom);
      });
    }

    // Smart zoom: show above or below based on viewport space
    function initSmartZoom() {
      if (modal._smartZoomInit) return;
      modal._smartZoomInit = true;
      modal.addEventListener("mouseenter", function(e) {
        var trigger = e.target.closest(".cfg-coating-swatch, .cfg-color-tile, .cfg-item");
        if (!trigger) return;
        var zoom = trigger.querySelector(".cfg-swatch-zoom, .cfg-item__zoom");
        if (!zoom) return;
        var rect = trigger.getBoundingClientRect();
        var spaceAbove = rect.top;
        var zoomH = 258; // 250 + 8 gap
        if (spaceAbove < zoomH) {
          zoom.classList.add(zoom.classList.contains("cfg-swatch-zoom") ? "cfg-swatch-zoom_below" : "cfg-item__zoom_below");
        } else {
          zoom.classList.remove("cfg-swatch-zoom_below", "cfg-item__zoom_below");
        }
        zoom.classList.add("is-visible");
      }, true);
      modal.addEventListener("mouseleave", function(e) {
        var trigger = e.target.closest(".cfg-coating-swatch, .cfg-color-tile, .cfg-item");
        if (!trigger) return;
        var zoom = trigger.querySelector(".cfg-swatch-zoom, .cfg-item__zoom");
        if (zoom) zoom.classList.remove("is-visible");
      }, true);
    }

    function updateConfigTotal() {
      var radioTotal = 0;
      var qtyTotal = 0;

      // 1) Radio-группы (погонаж: стойка короба, наличник, добор; фурнитура: ручка, защёлка, петли)
      //    Активный элемент × дефолтное кол-во из MOLDING_DEFAULT_QTY
      modal.querySelectorAll(".cfg-radio-group").forEach(function(group) {
        var active = group.querySelector(".cfg-item_active");
        if (!active) return;
        var accTitle = active.querySelector(".cfg-item__name")?.textContent.trim() || "";
        // Пропускаем "Без добора" / "Без остекления"
        if (/^Без\s/i.test(accTitle)) return;
        var groupName = group.getAttribute("data-radio-group") || "";
        var qty = MOLDING_DEFAULT_QTY[groupName] !== undefined ? MOLDING_DEFAULT_QTY[groupName] : 1;
        if (qty === 0) return;
        var price = 0;
        if (active.hasAttribute("data-price")) {
          price = Number(active.getAttribute("data-price")) || 0;
        } else {
          var amountEl = active.querySelector(".config-item__amount");
          if (amountEl) {
            price = Number(amountEl.textContent.replace(/\s/g, "")) || 0;
          }
        }
        radioTotal += price * qty;
      });

      // 2) Элементы со счётчиками (не в radio-группе): порог, плинтус, и т.д.
      modal.querySelectorAll(".cfg-item").forEach(function(item) {
        // Пропускаем элементы в radio-группе — они уже посчитаны выше
        if (item.closest(".cfg-radio-group")) return;
        var qtyInput = item.querySelector(".cfg-qty-input");
        if (!qtyInput) return;
        var qty = Math.max(0, Number(qtyInput.value) || 0);
        if (qty === 0) return;
        var price = 0;
        var amountEl = item.querySelector(".config-item__amount");
        if (amountEl) {
          price = Number(amountEl.textContent.replace(/\s/g, "")) || 0;
        }
        qtyTotal += price * qty;
      });

      // 3) Старые config-item (если остались)
      var configItemsTotal = Array.from(
        modal.querySelectorAll(".config-item") || [],
      ).reduce(function(sum, item) { return sum + calcItemTotal(item); }, 0);

      // 4) Чипы + цветовые плитки
      var chipsTotal = getChipsTotal();

      var totalPriceEl = modal.querySelector(".config-total-price");
      if (totalPriceEl) {
        totalPriceEl.textContent = formatPriceRub(
          getBasePrice() + radioTotal + qtyTotal + configItemsTotal + chipsTotal,
        );
      }
    }

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (modal && modal.getAttribute("aria-hidden") === "false") closeModal(modal);
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
      "opening-type": "Тип открывания",
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
        const doorQtyVal = item.doorQty || 1;
        if (isPriceRequest) {
          priceRequestCount++;
        } else {
          total += itemPrice * doorQtyVal;
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
          accessoriesHtml += '<div class="cart-item__accessories-header">Фурнитура и погонаж</div>';
          item.accessories.forEach(function (acc) {
            var accPriceStr = acc.price ? new Intl.NumberFormat("ru-RU").format(acc.price) + ' ₽/шт' : '';
            accessoriesHtml += '<div class="cart-item__accessory">'
              + '<div class="cart-item__accessory-img">'
              + '<img src="' + (acc.image || item.image || "images/card-door-1.svg") + '" alt="' + (acc.title || "") + '">'
              + '</div>'
              + '<div class="cart-item__accessory-info">'
              + '<strong class="cart-item__accessory-title">' + (acc.title || "Аксессуар") + '</strong>'
              + (acc.spec ? '<div class="cart-item__accessory-spec">' + acc.spec + '</div>' : '')
              + (acc.qty ? '<div class="cart-item__accessory-qty-label">' + accPriceStr + ' × ' + acc.qty + ' шт.</div>' : '')
              + '</div>'
              + '</div>';
          });
          accessoriesHtml += '</div>';
        }



        const doorQty = item.doorQty || 1;
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
          +         '<h3 class="cart-item__title">' + (item.title || "Товар конструктора") + '</h3>'
          +         '<span class="cart-item__price-tag">' + (isPriceRequest ? 'Цена по запросу' : (new Intl.NumberFormat("ru-RU").format(itemPrice * doorQty) + ' ₽')) + '</span>'
          +       '</div>'
          +       '<div class="cart-item__action-links">'
          +         '<a href="catalog.html" class="cart-item__action-link">Добавить ещё дверь</a>'
          +         '<button type="button" class="cart-item__action-link" data-edit-item="' + index + '">Редактировать</button>'
          +         '<button type="button" class="cart-item__action-link cart-item__action-link_delete" data-remove-item="' + index + '">Удалить</button>'
          +       '</div>'
          +     '</div>'
          +     '<div class="cart-item__qty-row">'
          +       '<span class="cart-item__qty-label">Количество:</span>'
          +       '<div class="cart-item__qty-controls">'
          +         '<button type="button" class="cart-item__qty-btn" data-door-qty-decrease="' + index + '">−</button>'
          +         '<span class="cart-item__qty-value">' + doorQty + '</span>'
          +         '<button type="button" class="cart-item__qty-btn" data-door-qty-increase="' + index + '">+</button>'
          +       '</div>'
          +     '</div>'
          +     propsHtml
          +   '</div>'
          + '</div>'
          + accessoriesHtml;

        container.appendChild(div);
      });

      updateSummary();

      function updateSummary() {
        const goodsCount = items.length - priceRequestCount;
        const goodsEl = document.querySelector(".cart-summary__goods-count");
        const sumEl = document.querySelector(".cart-summary__sum");
        const reqCountEl = document.querySelector(".cart-summary__request-count");
        const totalEl = document.querySelector(".cart-summary__total");

        if (goodsEl) goodsEl.textContent = goodsCount + ' ' + pluralize(goodsCount, 'товар', 'товара', 'товаров');
        if (sumEl) sumEl.textContent = total > 0 ? 'от ' + new Intl.NumberFormat("ru-RU").format(total) + ' ₽' : '0 ₽';
        if (reqCountEl) {
          reqCountEl.textContent = priceRequestCount + ' ' + pluralize(priceRequestCount, 'товар', 'товара', 'товаров');
          reqCountEl.closest('.cart-summary__row').style.display = priceRequestCount > 0 ? '' : 'none';
        }
        if (totalEl) totalEl.textContent = total > 0 ? new Intl.NumberFormat("ru-RU").format(total) + ' ₽' : '0 ₽';
      }
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

    // Bind remove/edit/qty buttons ONCE (not inside renderCart to avoid stacking listeners)
    container.addEventListener("click", function (e) {
      const removeBtn = e.target.closest("[data-remove-item]");
      if (removeBtn) {
        const idx = Number(removeBtn.getAttribute("data-remove-item"));
        window.removeCartItem(idx);
        return;
      }
      const qtyInc = e.target.closest("[data-door-qty-increase]");
      if (qtyInc) {
        const idx = Number(qtyInc.getAttribute("data-door-qty-increase"));
        const cartItems = safeJsonParse(localStorage.getItem("dveryaninov_cart_v1"), []);
        if (cartItems[idx]) {
          cartItems[idx].doorQty = (cartItems[idx].doorQty || 1) + 1;
          localStorage.setItem("dveryaninov_cart_v1", JSON.stringify(cartItems));
          renderCart();
          updateCartBadge();
        }
        return;
      }
      const qtyDec = e.target.closest("[data-door-qty-decrease]");
      if (qtyDec) {
        const idx = Number(qtyDec.getAttribute("data-door-qty-decrease"));
        const cartItems = safeJsonParse(localStorage.getItem("dveryaninov_cart_v1"), []);
        if (cartItems[idx]) {
          const cur = cartItems[idx].doorQty || 1;
          if (cur > 1) {
            cartItems[idx].doorQty = cur - 1;
            localStorage.setItem("dveryaninov_cart_v1", JSON.stringify(cartItems));
            renderCart();
            updateCartBadge();
          }
        }
        return;
      }
      const editBtn = e.target.closest("[data-edit-item]");
      if (editBtn) {
        const itemIdx = Number(editBtn.getAttribute("data-edit-item"));
        const cartItems = safeJsonParse(localStorage.getItem("dveryaninov_cart_v1"), []);
        if (cartItems[itemIdx]) {
          var item = cartItems[itemIdx];
          // Save edit state so product page can restore selections
          localStorage.setItem("dveryaninov_edit_item", JSON.stringify({ index: itemIdx, item: item }));
          // Determine product page URL
          var url = item.productUrl;
          if (!url && item.id && item.id.indexOf('product-') === 0) {
            url = item.id + '.html';
          }
          if (!url) url = "catalog.html";
          window.location.href = url;
        }
      }
    });

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

      var name = "";
      var phone = "";
      var isAuth = typeof window.DvAuth !== 'undefined' && window.DvAuth.isLoggedIn();
      if (isAuth) {
        var user = window.DvAuth.getCurrentUser();
        if (user) { name = user.name || ""; phone = user.phone || ""; }
      } else {
        name = document.getElementById("checkout-name")?.value || "";
        phone = document.getElementById("checkout-phone")?.value || "";
      }

      const order = {
        id: "ORD-" + Math.floor(Math.random() * 1000000),
        date: new Date().toISOString(),
        customer: { name, phone },
        items: items,
        delivery: document.getElementById("cart-need-delivery")?.checked || false,
        install: document.getElementById("cart-need-install")?.checked || false,
        total: items.reduce(function (sum, item) {
          var qty = item.doorQty || 1;
          return sum + ((Number(item.priceSum) || Number(item.price) || 0) * qty);
        }, 0),
      };

      const history = safeJsonParse(localStorage.getItem("dveryaninov_orders_v1"), []);
      history.push(order);
      localStorage.setItem("dveryaninov_orders_v1", JSON.stringify(history));
      localStorage.setItem("dveryaninov_cart_v1", "[]");

      // Redirect to account page to show order in history
      window.location.href = "account.html?order=" + encodeURIComponent(order.id);
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
          accessories: [],
          productUrl: window.location.pathname.split('/').pop() || ''
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

  // --- Catalog collection filter ---
  (function() {
    var sidebar = document.getElementById("catalogSidebar");
    var toggle = document.getElementById("catalogFilterToggle");
    var closeBtn = document.getElementById("catalogSidebarClose");
    if (!sidebar) return;

    var filterBtns = sidebar.querySelectorAll("[data-filter-collection]");
    var cards = document.querySelectorAll(".catalog__grid .card[data-collection]");

    filterBtns.forEach(function(btn) {
      btn.addEventListener("click", function() {
        var coll = btn.getAttribute("data-filter-collection");
        filterBtns.forEach(function(b) { b.classList.remove("catalog__filter-btn_active"); });
        btn.classList.add("catalog__filter-btn_active");
        cards.forEach(function(card) {
          if (coll === "all" || card.getAttribute("data-collection") === coll) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
        // Close mobile sidebar
        sidebar.classList.remove("is-open");
      });
    });

    if (toggle) {
      toggle.addEventListener("click", function() {
        sidebar.classList.add("is-open");
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", function() {
        sidebar.classList.remove("is-open");
      });
    }
  })();

  /* ── Hover: показ ПО-варианта на карточках каталога ── */
  (function initCardHover() {
    document.querySelectorAll(".card").forEach(function (card) {
      var variant = card.querySelector(".card__variant");
      if (!variant || variant.textContent.trim() !== "ПГ / ПО") return;
      var img = card.querySelector(".card__image");
      if (!img) return;
      var src = img.getAttribute("src");
      // Заменяем ПГ → ПО (в любом регистре, с пробелом или без)
      var hoverSrc = src.replace(/(\s?)ПГ(\s)/i, function (m, before, after) {
        var base = m.replace(/пг/i, function (pg) {
          return pg === "ПГ" ? "ПО" : pg === "пг" ? "по" : pg === "Пг" ? "По" : "ПО";
        });
        return base;
      });
      // Для слитных вариантов: "6пг " → "6по "
      if (hoverSrc === src) {
        hoverSrc = src.replace(/пг(\s)/i, function (m, after) {
          return m.replace(/пг/i, function (pg) {
            return pg === "ПГ" ? "ПО" : pg === "пг" ? "по" : "ПО";
          });
        });
      }
      if (hoverSrc === src) return; // не удалось построить путь
      img.classList.add("card__image--has-hover");
      var hoverImg = document.createElement("img");
      hoverImg.className = "card__image card__image_hover";
      hoverImg.alt = img.alt;
      hoverImg.loading = "lazy";
      hoverImg.src = hoverSrc;
      card.querySelector(".card__image-wrap").appendChild(hoverImg);
    });
  })();
});
