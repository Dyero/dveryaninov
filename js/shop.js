(() => {
  const CART_KEY = "dveryaninov_cart_v1";
  const WISHLIST_KEY = "dveryaninov_wishlist_v1";

  // Цены погонажа
  const MOLDING_PRICES = {
    box_telescope_pvc: 3450,
    box_telescope_enamel: 4980,
    box_coplanar_pvc: 3680,
    box_coplanar_enamel: 5380,
    casing_80_pvc: 2030,
    casing_80_enamel: 3150,
    casing_plus_80_pvc: 2130,
    casing_plus_80_enamel: 3200,
    casing_100_pvc: 2900,
    casing_100_enamel: 4780,
    casing_coplanar_80_pvc: 2030,
    casing_coplanar_80_enamel: 3230,
    dobor_100_pvc: 2880,
    dobor_100_enamel: 4620,
    dobor_150_pvc: 3960,
    dobor_150_enamel: 6930,
    dobor_200_pvc: 4890,
    dobor_200_enamel: 9240,
    threshold_pvc: 1330,
    threshold_enamel: 1940,
    plinth_pvc: 1150,
    plinth_enamel: 1900,
    enamel_pg_surcharge: 12780,
    enamel_po_surcharge: 14200,
  };

  // Наценка за тип полотна
  const GLAZING_SURCHARGE = {
    'pg': 0,
    'po': 14200,
  };

  const DEFAULT_DOOR_PRICE = 52000;

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

    // Handle blade type selection (ПГ/ПО) on product page
    var bladeButtons = document.querySelectorAll(".product__blade-btn");
    var currentBladeType = "pg";
    bladeButtons.forEach(function(btn) {
      btn.addEventListener("click", function(e) {
        e.preventDefault();
        bladeButtons.forEach(function(b) { b.classList.remove("product__blade-btn_active"); });
        btn.classList.add("product__blade-btn_active");
        var bladeVal = btn.getAttribute("data-blade");
        currentBladeType = bladeVal;
        var bladeValueEl = document.getElementById("bladeTypeValue");
        if (bladeValueEl) bladeValueEl.textContent = bladeVal === "po" ? "ПО" : "ПГ";
        // Update price
        var priceEl = document.querySelector(".product__price");
        if (priceEl) {
          var basePrice = DEFAULT_DOOR_PRICE;
          var surcharge = GLAZING_SURCHARGE[bladeVal] || 0;
          priceEl.textContent = "от " + new Intl.NumberFormat("ru-RU").format(basePrice + surcharge) + " ₽";
        }
        // Swap gallery image for ПО (add '-po' suffix convention)
        var mainImg = document.querySelector(".product__main-image img");
        if (mainImg) {
          var origSrc = mainImg.getAttribute("data-src-pg") || mainImg.src;
          if (!mainImg.hasAttribute("data-src-pg")) mainImg.setAttribute("data-src-pg", origSrc);
          if (bladeVal === "po") {
            mainImg.src = origSrc.replace(/(\.\w+)$/, " ПО$1");
          } else {
            mainImg.src = origSrc;
          }
        }
      });
    });
  }

  // Заполнить product__colors из coatings-data.js
  (function populateProductColors() {
    var colorsWrap = document.querySelector(".product__colors");
    if (!colorsWrap || !window.DVERYANINOV_COATINGS) return;
    var coatings = window.DVERYANINOV_COATINGS.filter(function(c) { return c[1] !== "custom"; });
    var VISIBLE = 8;
    colorsWrap.innerHTML = "";
    var optionValue = colorsWrap.closest(".product__option")?.querySelector(".product__option-value");

    function makeColorBtn(c, active) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "product__color" + (active ? " product__color_active" : "");
      btn.setAttribute("aria-label", c[0]);
      btn.title = c[0];
      var inner = document.createElement("span");
      inner.className = "product__color-inner";
      if (c[2]) {
        inner.style.backgroundImage = 'url("' + c[2] + '")';
        inner.style.backgroundSize = "cover";
        inner.style.backgroundPosition = "center";
      } else {
        inner.style.background = c[1];
      }
      btn.appendChild(inner);
      btn.addEventListener("click", function() {
        colorsWrap.querySelectorAll(".product__color:not(.product__color_more)").forEach(function(b) {
          b.classList.remove("product__color_active");
        });
        btn.classList.add("product__color_active");
        if (optionValue) optionValue.textContent = c[0];
      });
      return btn;
    }

    // First VISIBLE colors
    coatings.slice(0, VISIBLE).forEach(function(c, i) {
      colorsWrap.appendChild(makeColorBtn(c, i === 0));
    });

    // "+N" button + hidden overflow
    if (coatings.length > VISIBLE) {
      var rest = coatings.length - VISIBLE;
      var moreBtn = document.createElement("button");
      moreBtn.type = "button";
      moreBtn.className = "product__color product__color_more";
      moreBtn.setAttribute("aria-label", "Ещё " + rest + " покрытий");
      moreBtn.textContent = "+" + rest;

      var overflowWrap = document.createElement("div");
      overflowWrap.className = "product__colors-overflow";
      overflowWrap.hidden = true;

      // Group remaining coatings by type
      var COATING_GROUP_LABELS = { pvc: "ПВХ", pet: "ПЭТ", enamel: "Эмаль" };
      var COATING_GROUP_ORDER = ["pvc", "pet", "enamel"];
      var grouped = {};
      COATING_GROUP_ORDER.forEach(function(t) { grouped[t] = []; });
      coatings.slice(VISIBLE).forEach(function(c) {
        var type = c[3] || "pvc";
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(c);
      });
      COATING_GROUP_ORDER.forEach(function(type) {
        if (!grouped[type] || !grouped[type].length) return;
        var section = document.createElement("div");
        section.className = "product__colors-group";
        var title = document.createElement("div");
        title.className = "product__colors-group__title";
        title.textContent = COATING_GROUP_LABELS[type] || type;
        section.appendChild(title);
        var grid = document.createElement("div");
        grid.className = "product__colors-group__grid";
        grouped[type].forEach(function(c) {
          grid.appendChild(makeColorBtn(c, false));
        });
        section.appendChild(grid);
        overflowWrap.appendChild(section);
      });

      moreBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        overflowWrap.hidden = !overflowWrap.hidden;
        moreBtn.textContent = overflowWrap.hidden ? "+" + rest : "−";
      });

      overflowWrap.addEventListener("click", function(e) { e.stopPropagation(); });
      document.addEventListener("click", function() {
        if (!overflowWrap.hidden) {
          overflowWrap.hidden = true;
          moreBtn.textContent = "+" + rest;
        }
      });

      colorsWrap.appendChild(moreBtn);
      colorsWrap.appendChild(overflowWrap);
    }

    // «Свой цвет»
    var customWrap = document.createElement("div");
    customWrap.className = "product__color-custom-wrap";
    var customBtn = document.createElement("button");
    customBtn.type = "button";
    customBtn.className = "product__size product__size_own";
    customBtn.textContent = "Свой цвет";
    customWrap.appendChild(customBtn);
    colorsWrap.appendChild(customWrap);

    if (optionValue && coatings.length > 0) {
      optionValue.textContent = coatings[0][0];
    }
  })();

  function getBasePrice() {
    var priceEl = document.querySelector(".product__price");
    if (!priceEl) return DEFAULT_DOOR_PRICE;
    var text = priceEl.textContent || "0";
    return Number((text.match(/\d[\d\s]*/)?.[0] || "0").replace(/\s/g, "")) || DEFAULT_DOOR_PRICE;
  }

  function initConfigurator() {
    let modal = document.querySelector(".cfg-modal");

    const state = {
      // Шаг 1 — Конфигурация двери
      "blade-type": "pg",
      "blade-surcharge": 0,
      size: "2000×600",
      "coating-type": "ПВХ",
      finish: "",
      glazing: "",
      engraving: "Без гравировки",
      "alu-edge": "Без кромки",
      moldings: "",
      opening: "Распашная",
      "opening-type": "Левое на себя",
      // Шаг 2 — Погонаж
      box: "",
      "casing-side1": "",
      "casing-side2": "",
      dobor: "",
      // Шаг 3 — Фурнитура
      "hw-color": "",
      handle: "",
      locker: "",
      hinges: "",
      stopper: "Apecs золотой DS-0014-GM",
    };

    // Коллекция и модель — определяются из заголовка страницы
    var _collection = "";
    var _model = "";

    function detectCollectionModel() {
      var title = document.querySelector(".product__title")?.textContent.trim() || "";
      // Пример: "Альберта 1 ПГ" → коллекция "Альберта", модель "Альберта 1"
      var collections = [
        "Декар с багетом","Альберта","Амери","Амфора","Аврора","Белуни","Бланк","Бона","Бонеко",
        "Декар","Этерна","Флай","Форм","Кант","Каскад","Квант","Мета","Миура","Модена",
        "Моно","Нео","Оазис","Палладио","Плиссе","Терра","Ультра","Вектор","Верто","Витра","Д"
      ];
      for (var i = 0; i < collections.length; i++) {
        if (title.indexOf(collections[i]) === 0 || title.indexOf(collections[i]) !== -1) {
          _collection = collections[i];
          // Модель = коллекция + номер (напр. "Ультра 4")
          var rest = title.replace(collections[i], "").trim();
          var numMatch = rest.match(/^(\d+)/);
          _model = numMatch ? collections[i] + " " + numMatch[1] : collections[i];
          break;
        }
      }
    }

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
    function getCoatingType(name, entry) {
      if (entry && entry[3]) return entry[3];
      if (/ПЭТ/i.test(name)) return "pet";
      if (/Эмаль/i.test(name) || name === "Белый лёд" || name === "Свой цвет по RAL и NCS") return "enamel";
      return "pvc";
    }

    var COATING_TYPE_LABELS = { pvc: "ПВХ", pet: "ПЭТ", enamel: "Эмаль" };
    var COATING_TYPE_ORDER = ["pvc", "pet", "enamel"];

    function populateCoatingSwatches() {
      var container = modal?.querySelector("#cfgCoatingsContainer");
      if (!container || !window.DVERYANINOV_COATINGS) return;

      // Группировка по типу
      var groups = {};
      COATING_TYPE_ORDER.forEach(function(t) { groups[t] = []; });
      window.DVERYANINOV_COATINGS.forEach(function(c) {
        if (c[1] === "custom") return; // «Свой цвет» отдельно
        var type = getCoatingType(c[0], c);
        if (!groups[type]) groups[type] = [];
        groups[type].push(c);
      });

      COATING_TYPE_ORDER.forEach(function(type) {
        var items = groups[type];
        if (!items || !items.length) return;
        var section = document.createElement("div");
        section.className = "cfg-coatings-group";
        section.setAttribute("data-coating-group", type);
        var heading = document.createElement("div");
        heading.className = "cfg-coatings-group__title";
        heading.textContent = COATING_TYPE_LABELS[type] || type;
        section.appendChild(heading);
        var grid = document.createElement("div");
        grid.className = "cfg-coatings-grid";
        items.forEach(function(c) {
          grid.appendChild(createCoatingSwatch(c, type));
        });
        section.appendChild(grid);
        container.appendChild(section);
      });

      // «Свой цвет по RAL и NCS»
      var customEntry = window.DVERYANINOV_COATINGS.find(function(c) { return c[1] === "custom"; });
      if (customEntry) {
        container.appendChild(createCoatingSwatch(customEntry, "custom"));
      }
    }

    function createCoatingSwatch(c, type) {
      var btn = document.createElement("button");
      btn.type = "button";
      var isCustom = c[1] === "custom";
      btn.className = "cfg-coating-swatch" + (isCustom ? " cfg-coating-swatch_custom" : "");
      btn.setAttribute("data-coating", c[0]);
      btn.setAttribute("data-coating-type", type);
      btn.title = c[0];
      var swatch = document.createElement("span");
      swatch.className = "cfg-coating-swatch__color";
      if (!isCustom) {
        if (c[2]) {
          swatch.style.backgroundImage = 'url("' + c[2] + '")';
        } else {
          swatch.style.background = c[1];
        }
      }
      var label = document.createElement("span");
      label.className = "cfg-coating-swatch__name";
      label.textContent = c[0];
      var zoom = document.createElement("span");
      zoom.className = "cfg-swatch-zoom";
      if (!isCustom) {
        if (c[2]) {
          zoom.style.backgroundImage = 'url("' + c[2] + '")';
        } else {
          zoom.style.background = c[1];
        }
      }
      btn.appendChild(swatch);
      btn.appendChild(label);
      btn.appendChild(zoom);
      return btn;
    }

    // Фильтрация покрытий по выбранному типу (ПВХ/ПЭТ/Эмаль)
    var COATING_TYPE_MAP = { "ПВХ": "pvc", "ПЭТ": "pet", "Эмаль": "enamel" };
    function filterCoatingsByType(type) {
      if (!modal) return;
      var typeKey = COATING_TYPE_MAP[type] || type;
      var flyColors = (_collection === "Флай" && CFG.FLY_PVH_COLORS) ? CFG.FLY_PVH_COLORS : null;

      // Показать/скрыть группы
      modal.querySelectorAll(".cfg-coatings-group").forEach(function(group) {
        var groupType = group.getAttribute("data-coating-group");
        group.style.display = (groupType === typeKey) ? "" : "none";
      });

      var swatches = modal.querySelectorAll(".cfg-coating-swatch");
      var activeHidden = false;
      var hasActive = false;
      swatches.forEach(function(btn) {
        var btnType = btn.getAttribute("data-coating-type");
        var visible = btnType === typeKey;
        // Для Флай — дополнительно фильтруем по 45 разрешённым цветам
        if (visible && flyColors && typeKey === "pvc") {
          var name = btn.getAttribute("data-coating") || "";
          visible = flyColors.indexOf(name) !== -1;
        }
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

    function syncDoorInfoToConfigurator() {
      var nameEl  = modal?.querySelector('#cfgDoorName');
      var priceEl = modal?.querySelector('#cfgDoorBasePrice');
      var pageTitle = document.querySelector('.product__title')?.textContent.trim();
      var pagePrice = document.querySelector('.product__price')?.textContent
        .replace(/[^\d\s]/g, '').trim();
      if (nameEl && pageTitle) nameEl.textContent = pageTitle;
      if (priceEl && pagePrice) priceEl.textContent = pagePrice;
    }

    function initBackButton() {
      var backBtn = modal?.querySelector('#cfgBackBtn');
      if (backBtn && !backBtn._bound) {
        backBtn._bound = true;
        backBtn.addEventListener('click', function() {
          var stepMap = { molding: 'config', hardware: 'molding' };
          var currentStep = modal.dataset.step || 'config';
          var prevStep = stepMap[currentStep];
          if (prevStep) setStep(prevStep);
        });
      }
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
        // Extract just the color code or color name
        const matches = colorLabel.match(/\d{4}|Дуб|Венге|Орех/);
        if (matches) {
          state.finish = matches[0];
        }
      }
    }

    // ─── Стандартные кол-ва погонажа на одностворчатую дверь ───
    var MOLDING_DEFAULT_QTY = {
      box: 1,       // стойка короба: 1 комплект (2.5 шт)
      "casing-side1": 1,    // наличник 1 сторона: 1 комплект
      "casing-side2": 1,    // наличник 2 сторона: 1 комплект
      dobor: 1,     // добор: 1 комплект
      handle: 1,
      locker: 1,
      hinges: 1,
      glazing: 1,
      engraving: 1,
      "alu-edge": 1,
      moldings: 1,
      "opening-type": 0  // тип открывания — не товар
    };

    /* ═══════════════════════════════════════════
     * Динамическое заполнение секций из DVERYANINOV_CFG
     * ═══════════════════════════════════════════ */
    var CFG = window.DVERYANINOV_CFG || {};

    // Утилита: создать cfg-item HTML
    /**
     * Разбить название на заголовок и подзаголовок (размеры / кол-во).
     * Расшифровывает сокращения: прод. → продольный, попер. → поперечный, компл. → комплект.
     */
    function splitNameSubtitle(name) {
      var m = name.match(/^(.*?)\s*\(([^)]+)\)\s*(.*)$/);
      if (!m) return { title: name, subtitle: "" };
      var base = m[1].trim();
      var dims = m[2].trim();
      var suffix = m[3].trim().replace(/^,\s*/, "");
      // Расшифровать сокращения
      var exp = suffix
        .replace(/\bпрод\.\s*/g, "продольный ")
        .replace(/\bпопер\.\s*/g, "поперечный ")
        .replace(/\bкомпл\.\s*/g, "комплект ")
        .trim();
      // «продольный + поперечный» — часть названия, не подзаголовка
      if (/продольн|поперечн/.test(exp)) {
        return { title: base + " " + exp, subtitle: "(" + dims + ")" };
      }
      // «комплект ...» внутри скобок — не размеры
      if (/комплект/i.test(dims)) {
        return { title: base, subtitle: dims };
      }
      var sub = "(" + dims + ")";
      if (exp) sub += ", " + exp;
      return { title: base, subtitle: sub };
    }

    function buildRadioItem(name, price, img, extraClass) {
      var div = document.createElement("div");
      div.className = "cfg-item" + (extraClass ? " " + extraClass : "");
      div.setAttribute("data-radio-value", name);
      div.setAttribute("data-price", String(price));
      var parts = splitNameSubtitle(name);
      var thumbImg = img || (/^Без\s/i.test(name) ? "images/Without.svg" : "");
      var html = "";
      if (thumbImg) {
        html += '<div class="cfg-item__thumb"><img src="' + thumbImg + '" alt="' + name + '" loading="lazy"></div>';
      }
      html += '<div class="cfg-item__info"><span class="cfg-item__name config-item__title">' + parts.title + '</span>';
      if (parts.subtitle) {
        html += '<span class="cfg-item__spec config-item__spec">' + parts.subtitle + '</span>';
      }
      html += '</div>';
      if (price > 0) {
        html += '<div class="cfg-item__price"><span class="config-item__amount">' + formatPriceRub(price) + '</span><span class="cfg-item__currency"> ₽</span></div>';
      }
      div.innerHTML = html;
      return div;
    }

    // Заполнить размеры
    function populateSizes() {
      var container = modal?.querySelector("#cfgSizeOptions");
      if (!container || !CFG.SIZES) return;
      container.innerHTML = "";
      CFG.SIZES.forEach(function(s, i) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "config-chip" + (s === state.size ? " config-chip_active" : "");
        btn.setAttribute("data-pick", "size");
        btn.setAttribute("data-price", "0");
        btn.setAttribute("data-value", s);
        btn.textContent = s;
        container.appendChild(btn);
      });
    }

    // Заполнить типы покрытия (ПВХ/ПЭТ/Эмаль) по коллекции
    function populateCoatingTypes() {
      var container = modal?.querySelector("#cfgCoatingTypeOptions");
      if (!container || !CFG.getAllowedCoatings) return;
      var allowed = CFG.getAllowedCoatings(_collection);
      container.innerHTML = "";
      allowed.forEach(function(t) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "config-chip" + (t === state["coating-type"] ? " config-chip_active" : "");
        btn.setAttribute("data-pick", "coating-type");
        btn.setAttribute("data-price", "0");
        btn.setAttribute("data-value", t);
        if (t === "Эмаль" && CFG.ENAMEL_SURCHARGE) {
          var surcharge = CFG.ENAMEL_SURCHARGE.pg || 0;
          btn.innerHTML = t + ' <span class="config-chip__delta">+' + new Intl.NumberFormat("ru-RU").format(surcharge) + '&nbsp;₽</span>';
        } else {
          btn.textContent = t;
        }
        container.appendChild(btn);
      });
      // Если текущий тип не в списке — переключить на первый
      if (allowed.indexOf(state["coating-type"]) === -1) {
        state["coating-type"] = allowed[0];
        var header = modal.querySelector("#cfgCoatingTypeItem .config-detail-value");
        if (header) header.textContent = allowed[0];
      }
      // Если только один тип — скрыть секцию
      var item = modal.querySelector("#cfgCoatingTypeItem");
      if (item) item.style.display = allowed.length <= 1 ? "none" : "";
    }

    // Заполнить остекление
    function populateGlazing() {
      var container = modal?.querySelector("#cfgGlazingOptions");
      if (!container || !CFG.getGlasses) return;
      var glasses = CFG.getGlasses(_collection, _model);
      container.innerHTML = "";
      // Если нет стёкол — скрыть секцию
      var section = modal.querySelector("#cfgGlazingSection");
      if (glasses.length === 0) {
        if (section) section.style.display = "none";
        state.glazing = "";
        return;
      }
      if (section) section.style.display = "";
      // Добавляем стёкла
      glasses.forEach(function(g) {
        container.appendChild(buildRadioItem(g.name, g.price, g.img));
      });
      // «Без остекления»
      container.appendChild(buildRadioItem("Без остекления", 0, ""));
    }

    // Заполнить гравировку
    function populateEngraving() {
      var container = modal?.querySelector("#cfgEngravingOptions");
      var section = modal?.querySelector("#cfgEngravingSection");
      if (!container || !section) return;
      if (!CFG.isEngravingAvailable || !CFG.isEngravingAvailable(_collection, state.glazing)) {
        section.style.display = "none";
        state.engraving = "Без гравировки";
        return;
      }
      section.style.display = "";
      container.innerHTML = "";
      CFG.ENGRAVING_OPTIONS.forEach(function(e) {
        container.appendChild(buildRadioItem(e.name, e.price, ""));
      });
    }

    // Заполнить алюминиевую кромку
    function populateAluEdge() {
      var container = modal?.querySelector("#cfgAluEdgeOptions");
      var section = modal?.querySelector("#cfgAluEdgeSection");
      if (!container || !section) return;
      if (!CFG.ALU_BLOCKED || CFG.ALU_BLOCKED.indexOf(_collection) !== -1) {
        section.style.display = "none";
        state["alu-edge"] = "Без кромки";
        return;
      }
      section.style.display = "";
      container.innerHTML = "";
      CFG.ALU_EDGE.forEach(function(edge) {
        var name = edge.type + (edge.color ? " — " + edge.color : "");
        container.appendChild(buildRadioItem(name, edge.price, ""));
      });
    }

    // Заполнить молдинги
    function populateMoldings() {
      var container = modal?.querySelector("#cfgMoldingsOptions");
      var section = modal?.querySelector("#cfgMoldingsSection");
      if (!container || !section) return;
      var opts = CFG.getMoldings ? CFG.getMoldings(_collection, _model) : null;
      if (!opts) {
        section.style.display = "none";
        state.moldings = "";
        return;
      }
      section.style.display = "";
      container.innerHTML = "";
      opts.forEach(function(m) {
        container.appendChild(buildRadioItem(m.color, m.price, ""));
      });
    }

    // Заполнить стойки короба
    function populateBox() {
      var container = modal?.querySelector("#cfgBoxOptions");
      if (!container) return;
      var cg = CFG.coatingGroup ? CFG.coatingGroup(state["coating-type"]) : "pvh";
      var boxes = CFG.BOX_TYPES ? CFG.BOX_TYPES[cg] : [];
      container.innerHTML = "";
      (boxes || []).forEach(function(b) {
        var img = /Телескоп/i.test(b.name) ? "images/ПОГОНАЖ/Стойка короба телескоп (МДФ), цветной уплотнитель.jpg" : "images/ПОГОНАЖ/Стойка короба компланарная, цветной уплотнитель.jpg";
        container.appendChild(buildRadioItem(b.name, b.price, img));
      });
    }

    // Заполнить наличники (1-я сторона)
    function populateCasingSide1() {
      var container = modal?.querySelector("#cfgCasingSide1Options");
      if (!container) return;
      var boxType = state.box || "";
      var coatingType = state["coating-type"] || "ПВХ";
      var casings = CFG.getCasings ? CFG.getCasings(boxType, coatingType, _collection) : [];
      container.innerHTML = "";
      casings.forEach(function(c) {
        container.appendChild(buildRadioItem(c.name, c.price, ""));
      });
      // Сбросить текущий выбор
      state["casing-side1"] = "";
      var display = modal.querySelector('[data-radio-display="casing-side1"]');
      if (display) display.textContent = "—";
    }

    // Заполнить наличники (2-я сторона)
    function populateCasingSide2() {
      var container = modal?.querySelector("#cfgCasingSide2Options");
      var section = modal?.querySelector("#cfgCasingSide2Section");
      if (!container || !section) return;
      // Показывать только если есть выбор в 1-й стороне
      if (!state["casing-side1"]) {
        section.style.display = "none";
        state["casing-side2"] = "";
        return;
      }
      section.style.display = "";
      var boxType = state.box || "";
      var coatingType = state["coating-type"] || "ПВХ";
      var casings = CFG.getCasingsSide2 ? CFG.getCasingsSide2(boxType, coatingType, _collection) : [];
      container.innerHTML = "";
      casings.forEach(function(c) {
        container.appendChild(buildRadioItem(c.name, c.price, ""));
      });
      // Сбросить
      state["casing-side2"] = "";
      var display = modal.querySelector('[data-radio-display="casing-side2"]');
      if (display) display.textContent = "—";
    }

    // Заполнить добор
    function populateDobor() {
      var container = modal?.querySelector("#cfgDoborOptions");
      if (!container) return;
      var cg = CFG.coatingGroup ? CFG.coatingGroup(state["coating-type"]) : "pvh";
      var items = CFG.DOBOR ? CFG.DOBOR[cg] : [];
      container.innerHTML = "";
      (items || []).forEach(function(d) {
        var img = d.price === 0 && !d.priceRequest ? "" : "images/ПОГОНАЖ/Добор телескоп ТИП 2 .jpg";
        var el = buildRadioItem(d.name, d.price, img);
        // Override spec if provided in data
        if (d.spec) {
          var specEl = el.querySelector(".cfg-item__spec");
          if (specEl) {
            specEl.textContent = d.spec;
          } else {
            var info = el.querySelector(".cfg-item__info");
            if (info) {
              var sp = document.createElement("span");
              sp.className = "cfg-item__spec config-item__spec";
              sp.textContent = d.spec;
              info.appendChild(sp);
            }
          }
        }
        container.appendChild(el);
      });
    }

    // Обновить цены порога/плинтуса по типу покрытия
    function updateExtrasPrice() {
      var cg = CFG.coatingGroup ? CFG.coatingGroup(state["coating-type"]) : "pvh";
      var extras = CFG.EXTRAS ? CFG.EXTRAS[cg] : {};
      var porogPriceEl = modal?.querySelector("#cfgPorogPrice");
      var plintusPriceEl = modal?.querySelector("#cfgPlintusPrice");
      if (porogPriceEl && extras.porog) porogPriceEl.textContent = formatPriceRub(extras.porog.price);
      if (plintusPriceEl && extras.plintus) plintusPriceEl.textContent = formatPriceRub(extras.plintus.price);
      // Скрыть порог при компланарной стойке
      var porogItem = modal?.querySelector("#cfgPorogItem");
      if (porogItem) {
        var porogVisible = CFG.isPorogAvailable ? CFG.isPorogAvailable(state.box) : true;
        porogItem.style.display = porogVisible ? "" : "none";
        if (!porogVisible) {
          var inp = porogItem.querySelector("[data-item='porog']");
          if (inp) inp.value = 0;
        }
      }
    }

    // Заполнить все динамические секции
    function populateAllDynamicSections() {
      populateSizes();
      populateCoatingTypes();
      populateGlazing();
      populateEngraving();
      populateAluEdge();
      populateMoldings();
      populateBox();
      populateCasingSide1();
      populateCasingSide2();
      populateDobor();
      updateExtrasPrice();
      // Auto-assign data-hw-color to items that don't have it
      if (modal) {
        modal.querySelectorAll(
          '[data-radio-group="handle"] .cfg-item,' +
          '[data-radio-group="locker"] .cfg-item,' +
          '[data-radio-group="hinges"] .cfg-item,' +
          '[data-radio-group="stopper"] .cfg-item'
        ).forEach(function(item) {
          if (!item.getAttribute("data-hw-color")) {
            var nameEl = item.querySelector(".cfg-item__name");
            var imgEl = item.querySelector("img");
            var txt = (nameEl ? nameEl.textContent : "") || (imgEl ? imgEl.getAttribute("alt") : "") || "";
            item.setAttribute("data-hw-color", detectColorFromName(txt));
          }
        });
      }
      initHardwareColor();
    }

    // Обработка зависимостей при изменении параметра
    function refreshDependentSections(changedGroup) {
      if (!modal) return;

      if (changedGroup === "coating-type") {
        filterCoatingsByType(state["coating-type"]);
        populateBox();
        populateCasingSide1();
        populateCasingSide2();
        populateDobor();
        updateExtrasPrice();
      }

      if (changedGroup === "glazing") {
        populateEngraving();
        swapDoorImage(state.glazing);
      }

      if (changedGroup === "box") {
        populateCasingSide1();
        populateCasingSide2();
        updateExtrasPrice();
      }

      if (changedGroup === "casing-side1") {
        populateCasingSide2();
      }

      if (changedGroup === "opening") {
        // Раздвижная → скрыть цвет фурнитуры, ручку, защёлку, петли
        var hideGroups = state.opening === "Раздвижная" ? ["handle", "locker", "hinges"] : [];
        var hwColorPicker = modal.querySelector("#hw-color-picker");
        if (hwColorPicker) hwColorPicker.style.display = hideGroups.length ? "none" : "";
        ["handle", "locker", "hinges"].forEach(function(g) {
          var rg = modal.querySelector('[data-radio-group="' + g + '"]');
          if (rg) {
            var cfgSection = rg.closest(".cfg-section");
            if (cfgSection) cfgSection.style.display = hideGroups.indexOf(g) !== -1 ? "none" : "";
          }
        });
      }

      updateConfigTotal();
    }

    /* ── Фурнитура: цвет → фильтрация ручек → авто-выбор защёлки/петель ── */

    var COLOR_FALLBACK = {
      black:  ["black"],
      chrome: ["chrome", "nickel", "silver"],
      gold:   ["gold", "brass", "champagne", "chrome"],
      nickel: ["nickel", "chrome", "silver"],
      brass:  ["brass", "gold", "champagne", "chrome"],
      emboss: ["emboss", "brass", "gold", "chrome"],
      champagne: ["champagne", "gold", "brass", "chrome"],
      silver: ["silver", "chrome", "nickel"]
    };

    var HW_COLOR_NAMES = {
      black: "Чёрный", chrome: "Мат. хром", gold: "Мат. золото",
      nickel: "Мат. никель", brass: "Флор. золото", emboss: "Итал. тисненый"
    };

    function filterHandlesByColor(selectedColor) {
      var handleGroup = modal ? modal.querySelector('[data-radio-group="handle"]') : null;
      if (!handleGroup) return;
      var firstVisible = null;
      handleGroup.querySelectorAll(".cfg-item").forEach(function(item) {
        var colors = (item.getAttribute("data-hw-colors") || "").split(",");
        var visible = colors.indexOf(selectedColor) !== -1;
        item.style.display = visible ? "" : "none";
        if (visible) {
          // Подменяем цену
          var priceAttr = item.getAttribute("data-hw-price-" + selectedColor);
          if (priceAttr) {
            item.setAttribute("data-price", priceAttr);
            var priceDisplay = item.querySelector(".cfg-item__price-display");
            if (priceDisplay) priceDisplay.textContent = formatPriceRub(Number(priceAttr)) + " ₽";
          }
          // Подменяем картинку на нужный цвет
          var imgSrc = item.getAttribute("data-hw-img-" + selectedColor);
          if (imgSrc) {
            var img = item.querySelector(".cfg-item__thumb img");
            if (img) img.src = imgSrc;
            // Обновляем zoom-картинку если есть
            var zoomImg = item.querySelector(".cfg-item__zoom img");
            if (zoomImg) zoomImg.src = imgSrc;
          }
          if (!firstVisible) firstVisible = item;
        }
      });
      // Если активная ручка скрыта — выбираем первую видимую
      var activeHandle = handleGroup.querySelector(".cfg-item_active");
      if (activeHandle && activeHandle.style.display === "none") {
        handleGroup.querySelectorAll(".cfg-item").forEach(function(i) { i.classList.remove("cfg-item_active"); });
        if (firstVisible) {
          firstVisible.classList.add("cfg-item_active");
          state.handle = firstVisible.getAttribute("data-radio-value") || "";
          var displayEl = modal.querySelector('[data-radio-display="handle"]');
          var itemName = firstVisible.querySelector(".cfg-item__name");
          if (displayEl && itemName) displayEl.textContent = itemName.textContent.trim();
        }
      }
    }

    function autoSelectHardwareByColor(selectedColor) {
      var groups = ["locker", "hinges", "stopper"];
      groups.forEach(function(groupName) {
        var group = modal ? modal.querySelector('[data-radio-group="' + groupName + '"]') : null;
        if (!group) return;
        var fallbackOrder = COLOR_FALLBACK[selectedColor] || [selectedColor];
        var selected = null;
        for (var i = 0; i < fallbackOrder.length; i++) {
          selected = group.querySelector('.cfg-item[data-hw-color="' + fallbackOrder[i] + '"]');
          if (selected) break;
        }
        if (!selected) selected = group.querySelector(".cfg-item");
        if (selected) {
          group.querySelectorAll(".cfg-item").forEach(function(i) { i.classList.remove("cfg-item_active"); });
          selected.classList.add("cfg-item_active");
          state[groupName] = selected.getAttribute("data-radio-value") || "";
          var displayEl = modal.querySelector('[data-radio-display="' + groupName + '"]');
          var name = selected.querySelector(".cfg-item__name");
          if (displayEl && name) displayEl.textContent = name.textContent.trim();
        }
      });
      updateConfigTotal();
    }

    function detectColorFromName(name) {
      var n = name.toLowerCase();
      if (/чёрн|черн|black|bl-/i.test(n))     return "black";
      if (/хром|chrome|crs|mcr/i.test(n))      return "chrome";
      if (/матов.*золот|mg\b|gold/i.test(n))   return "gold";
      if (/никел|nickel|ni\b|nis/i.test(n))    return "nickel";
      if (/латун|brass/i.test(n))              return "brass";
      if (/шампан|champagne/i.test(n))         return "champagne";
      if (/флорент|emboss|итальян/i.test(n))   return "emboss";
      return "chrome";
    }

    function initHardwareColor() {
      if (!modal) return;
      if (state["hw-color"]) {
        filterHandlesByColor(state["hw-color"]);
        autoSelectHardwareByColor(state["hw-color"]);
        // Подсветить нужный тайл
        var tile = modal.querySelector('.cfg-color-tile[data-hw-color="' + state["hw-color"] + '"]');
        if (tile) {
          var grid = tile.closest(".cfg-color-grid");
          if (grid) grid.querySelectorAll(".cfg-color-tile").forEach(function(t) { t.classList.remove("cfg-color-tile_active"); });
          tile.classList.add("cfg-color-tile_active");
          var displayEl = modal.querySelector('[data-radio-display="hw-color"]');
          if (displayEl) displayEl.textContent = HW_COLOR_NAMES[state["hw-color"]] || state["hw-color"];
        }
      } else {
        // Дефолтный цвет — Чёрный
        var defaultTile = modal.querySelector('.cfg-color-tile[data-hw-color="black"]');
        if (defaultTile) defaultTile.click();
      }
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
      modal.dataset.step = step;
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
          var cfgSection = sectionToggle.closest(".cfg-section");
          var body = cfgSection?.querySelector(".cfg-section__body");
          toggle.setAttribute("aria-expanded", "true");
          if (body) body.classList.add("is-open");
          if (cfgSection) cfgSection.classList.add("cfg-section_active");
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
              s.classList.remove("cfg-section_active");
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
        section.classList.toggle("cfg-section_active", !isExpanded);
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
          refreshDependentSections(groupName);
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
              // Detect collection and model
              detectCollectionModel();
              // Populate coating swatches from global data
              populateCoatingSwatches();
              // Populate all dynamic sections
              populateAllDynamicSections();
              filterCoatingsByType(state["coating-type"] || "ПВХ");
              syncStateFromPage();
              toggleGlazingVisibility();
              openModal(modal);
              initModalSelection();
              addPriceBadges();
              addItemZoomPopups();
              initSmartZoom();
              updateConfigTotal();
              syncDoorInfoToConfigurator();
              initBackButton();
              setStep("config");
            });
          return;
        }
        syncStateFromPage();
        detectCollectionModel();
        populateAllDynamicSections();
        toggleGlazingVisibility();
        openModal(modal);
        initModalSelection();
        addPriceBadges();
        addItemZoomPopups();
        initSmartZoom();
        updateConfigTotal();
        syncDoorInfoToConfigurator();
        initBackButton();
        setStep("config");
        return;
      }

      const openStepEl = target.closest("[data-open-config-step]");
      if (openStepEl) {
        const step = openStepEl.getAttribute("data-open-config-step");
        syncStateFromPage();
        detectCollectionModel();
        populateAllDynamicSections();
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

        // Тип полотна (ПГ/ПО) — обновляем наценку
        if (pick === "blade-type") {
          state["blade-surcharge"] = GLAZING_SURCHARGE[value] || 0;
        }

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
        refreshDependentSections(pick);
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

        var pick = colorTile.getAttribute("data-pick");

        // Цвет фурнитуры — специальная логика
        if (pick === "hw-color") {
          var hwColor = colorTile.getAttribute("data-hw-color");
          state["hw-color"] = hwColor;
          var hwDisplay = modal ? modal.querySelector('[data-radio-display="hw-color"]') : null;
          var hwLabel = colorTile.querySelector(".cfg-color-tile__label");
          if (hwDisplay && hwLabel) hwDisplay.textContent = hwLabel.textContent.trim();
          filterHandlesByColor(hwColor);
          autoSelectHardwareByColor(hwColor);
          updateConfigTotal();
          return;
        }

        // Все остальные цветовые плитки (покрытие и т.д.)
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

        // Кастомный цвет — пометка для менеджера
        if (state.finish === "Свой цвет по RAL и NCS") {
          newItem.note = "Цвет по RAL/NCS — уточняется менеджером";
        }

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
        var zoomW = 200, zoomH = 250;
        var spaceAbove = rect.top;
        // Position zoom fixed so it escapes overflow:auto containers
        zoom.style.position = "fixed";
        zoom.style.left = (rect.left + rect.width / 2 - zoomW / 2) + "px";
        zoom.style.width = zoomW + "px";
        zoom.style.height = zoomH + "px";
        if (spaceAbove < zoomH + 8) {
          zoom.style.top = (rect.bottom + 8) + "px";
          zoom.style.bottom = "auto";
        } else {
          zoom.style.top = "auto";
          zoom.style.bottom = (window.innerHeight - rect.top + 8) + "px";
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

      // 1) Radio-группы — активный элемент × дефолтное кол-во
      modal.querySelectorAll(".cfg-radio-group").forEach(function(group) {
        var active = group.querySelector(".cfg-item_active");
        if (!active) return;
        var accTitle = active.querySelector(".cfg-item__name")?.textContent.trim() || "";
        // Пропускаем "Без добора" / "Без остекления" / "Без ..." 
        if (/^Без\s/i.test(accTitle)) return;
        var groupName = group.getAttribute("data-radio-group") || "";
        var qty = MOLDING_DEFAULT_QTY[groupName] !== undefined ? MOLDING_DEFAULT_QTY[groupName] : 1;
        if (qty === 0) return;
        var price = Number(active.getAttribute("data-price")) || 0;
        if (price === 0) {
          var amountEl = active.querySelector(".config-item__amount");
          if (amountEl) price = Number(amountEl.textContent.replace(/\s/g, "")) || 0;
        }
        radioTotal += price * qty;
      });

      // 2) Элементы со счётчиками (порог, плинтус, притворная)
      modal.querySelectorAll(".cfg-item").forEach(function(item) {
        if (item.closest(".cfg-radio-group")) return;
        var qtyInput = item.querySelector(".cfg-qty-input");
        if (!qtyInput) return;
        var qty = Math.max(0, Number(qtyInput.value) || 0);
        if (qty === 0) return;
        var amountEl = item.querySelector(".config-item__amount");
        var price = amountEl ? Number(amountEl.textContent.replace(/\s/g, "")) || 0 : 0;
        qtyTotal += price * qty;
      });

      // 3) Чипы + цветовые плитки
      var chipsTotal = getChipsTotal();

      // 4) Наценка за эмаль
      var enamelSurcharge = 0;
      if (state["coating-type"] === "Эмаль" && CFG.ENAMEL_SURCHARGE) {
        // ПГ или ПО — определяем по наличию остекления
        var isGlazed = state.glazing && !/^Без\s|^$/i.test(state.glazing) && state.glazing !== "-";
        enamelSurcharge = isGlazed ? CFG.ENAMEL_SURCHARGE.po : CFG.ENAMEL_SURCHARGE.pg;
      }

      // 5) Наценка за ширину 900 при наличии остекления
      var w900Surcharge = 0;
      if (CFG.WIDTH_900_PO_SURCHARGE && /900/.test(state.size)) {
        var isGlazed2 = state.glazing && !/^Без\s|^$/i.test(state.glazing) && state.glazing !== "-";
        if (isGlazed2) w900Surcharge = CFG.WIDTH_900_PO_SURCHARGE;
      }

      // 6) Наценка за тип полотна (ПО = остеклённое)
      var bladeSurcharge = state["blade-surcharge"] || 0;

      var totalPriceEl = modal.querySelector(".config-total-price");
      if (totalPriceEl) {
        totalPriceEl.textContent = formatPriceRub(
          getBasePrice() + radioTotal + qtyTotal + chipsTotal + enamelSurcharge + w900Surcharge + bladeSurcharge,
        );
      }

      // Показ/скрытие строки «Полотно остеклённое» в разбивке цены
      updateBladeSurchargeRow(state["blade-type"]);
    }

    function updateBladeSurchargeRow(bladeType) {
      var row = modal?.querySelector('[data-price-row="blade-surcharge"]');
      if (!row) return;
      row.hidden = (bladeType !== 'po');
      var valEl = row.querySelector('.cfg-price-row__value');
      if (valEl) valEl.textContent = '+' + formatPriceRub(GLAZING_SURCHARGE['po'] || 14200) + ' ₽';
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
      "coating-type": "Тип покрытия",
      glazing: "Остекление",
      engraving: "Гравировка",
      "alu-edge": "Алюминиевая кромка",
      moldings: "Молдинги",
      opening: "Вариант открывания",
      "opening-type": "Тип открывания",
      box: "Стойка короба",
      "casing-side1": "Наличник (1-я сторона)",
      "casing-side2": "Наличник (2-я сторона)",
      dobor: "Добор",
      "hw-color": "Цвет фурнитуры",
      handle: "Ручка",
      locker: "Защёлка",
      hinges: "Петли",
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
            "size", "coating-type", "finish", "glazing", "engraving", "alu-edge", "moldings",
            "opening", "opening-type",
            "box", "casing-side1", "casing-side2", "dobor",
            "hw-color", "handle", "locker", "hinges", "stopper"
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
      let color = "Эмаль 9003";

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
      // TODO: send lead to CRM
      leadForm.innerHTML = '<p style="text-align:center;font-size:16px;color:#333;padding:20px 0;">Спасибо! Мы свяжемся с вами в ближайшее время.</p>';
    });
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  if (typeof updateWishlistBadge === "function") updateWishlistBadge();
  if (typeof updateCartBadge === "function") updateCartBadge();

  // --- Catalog category switch ---
  (function() {
    var catBtns = document.querySelectorAll('.catalog__cat-btn[data-category]');
    if (!catBtns.length) return;
    var doorsSection = document.getElementById('catalog-doors-section');
    var hwSection    = document.getElementById('catalog-hardware-section');
    var emptySection = document.getElementById('catalog-empty-section');
    var filterToggle = document.getElementById('catalogFilterToggle');
    var EMPTY_CATS   = ['partitions', 'invisible'];

    function switchCatalogCategory(cat) {
      catBtns.forEach(function(b) { b.classList.remove('catalog__cat-btn_active'); });
      var active = document.querySelector('.catalog__cat-btn[data-category="' + cat + '"]');
      if (active) active.classList.add('catalog__cat-btn_active');

      var showDoors = (cat === 'all' || cat === 'doors');
      var showHw    = (cat === 'hardware');
      var showEmpty = EMPTY_CATS.indexOf(cat) !== -1;

      if (doorsSection) doorsSection.hidden = !showDoors;
      if (hwSection)    hwSection.hidden    = !showHw;
      if (emptySection) emptySection.hidden = !showEmpty;
      if (filterToggle) filterToggle.hidden = !showDoors;
    }

    catBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        switchCatalogCategory(btn.getAttribute('data-category'));
      });
    });
  })();

  // --- Catalog hardware sub-filter ---
  (function() {
    var filterBtns = document.querySelectorAll('.catalog__hw-filter-btn[data-hw-filter]');
    if (!filterBtns.length) return;
    var groups = document.querySelectorAll('[data-hw-group]');
    var titles = document.querySelectorAll('.catalog-hardware__group-title');

    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var filter = btn.getAttribute('data-hw-filter');
        filterBtns.forEach(function(b) { b.classList.remove('catalog__hw-filter-btn_active'); });
        btn.classList.add('catalog__hw-filter-btn_active');
        var titleArr = Array.from(titles);
        groups.forEach(function(g, i) {
          var show = (filter === 'all' || g.getAttribute('data-hw-group') === filter);
          g.style.display = show ? '' : 'none';
          if (titleArr[i]) titleArr[i].style.display = show ? '' : 'none';
        });
      });
    });
  })();

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
