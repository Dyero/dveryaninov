const fs = require('fs');

let shopJs = fs.readFileSync('js/shop.js', 'utf-8');

// 1. Rewrite renderCart to look like the mockups
let renderCartRegex = /function renderCart\(\) \{[\s\S]*?if \(summaryFinal\)[\s\S]*? ₽";\n    \}/;

let newRenderCart = `function renderCart() {
      const items = window.safeJsonParse
        ? safeJsonParse(localStorage.getItem("dveryaninov_cart_v1"), [])
        : JSON.parse(localStorage.getItem("dveryaninov_cart_v1") || "[]");
      container.innerHTML = "";

      let total = 0;
      if (items.length === 0) {
        container.innerHTML =
          "<p>Корзина пуста. <a href='catalog.html' style='color:#611025; text-decoration:underline;'>Перейти в каталог</a></p>";
        const cSide = document.querySelector(".cart-summary");
        if (cSide) cSide.style.display = "none";
        return;
      } else {
        const cSide = document.querySelector(".cart-summary");
        if (cSide) cSide.style.display = "block";
      }

      items.forEach((item, index) => {
        const itemPrice = Number(item.priceSum || item.price || 0);
        total += itemPrice;

        // Collect door options
        const doorOptions = [];
        if (item.options) {
            if (item.options.finish && item.options.finish !== "-") doorOptions.push("Цвет: " + item.options.finish);
            if (item.options.glazing && item.options.glazing !== "-") doorOptions.push("Стекло: " + item.options.glazing);
            if (item.options.size && item.options.size !== "-") doorOptions.push("Размер: " + item.options.size);
            if (item.options.opening && item.options.opening !== "-") doorOptions.push("Открывание: " + item.options.opening);
        }

        // Collect accessories into categories
        let moldingHtml = "";
        let hardwareHtml = "";
        
        let moldingTotal = 0;
        let hardwareTotal = 0;

        if (item.accessories && item.accessories.length) {
            const moldings = [];
            const hardware = [];
            
            item.accessories.forEach(acc => {
                if (['Коробка', 'Наличник', 'Доборы'].includes(acc.title)) {
                    moldings.push(acc.title + " - " + acc.spec);
                    moldingTotal += (acc.price * acc.qty);
                } else if (['Ручка', 'Замок', 'Петли', 'Завертка'].includes(acc.title)) {
                    hardware.push(acc.title + " - " + acc.spec);
                    hardwareTotal += (acc.price * acc.qty);
                } else {
                    // other stuff can go to molding
                    moldings.push(acc.title + " - " + acc.spec);
                    moldingTotal += (acc.price * acc.qty);
                }
            });

            if (moldings.length > 0) {
                moldingHtml = \`<div class="cart-item__sub-row">
                    <div class="cart-item__sub-info">
                        <strong>Погонаж</strong>
                        <div class="cart-item__sub-desc">\${moldings.join(" | ")}</div>
                    </div>
                    <div class="cart-item__sub-price">\${new Intl.NumberFormat("ru-RU").format(moldingTotal)} ₽</div>
                </div>\`;
            }

            if (hardware.length > 0) {
                hardwareHtml = \`<div class="cart-item__sub-row">
                    <div class="cart-item__sub-info">
                        <strong>Фурнитура</strong>
                        <div class="cart-item__sub-desc">\${hardware.join(" | ")}</div>
                    </div>
                    <div class="cart-item__sub-price">\${new Intl.NumberFormat("ru-RU").format(hardwareTotal)} ₽</div>
                </div>\`;
            }
        }

        const doorBasePrice = item.priceSum ? (item.priceSum - moldingTotal - hardwareTotal) : itemPrice;

        const div = document.createElement("article");
        div.className = "cart-item cart-item--rich";
        div.innerHTML = \`
          <div class="cart-item__main-row" style="display:flex; gap:16px;">
            <div class="cart-item__image-wrap" style="width:100px; flex-shrink:0;">
              <img class="cart-item__image" src="\${item.image || "images/card-door-1.svg"}" alt="Товар" style="width:100%; height:auto; display:block; border-radius:8px;">
            </div>
            
            <div class="cart-item__info" style="flex-grow:1;">
              <div class="cart-item__info-header" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
                <div>
                  <h3 class="cart-item__title" style="margin: 0 0 8px 0; font-size: 18px; font-weight:600;">\${item.title || "Товар конфигуратора"}</h3>
                  <div class="cart-item__desc" style="font-size:13px; color:#555; margin-bottom: 12px;">\${doorOptions.join(" | ")}</div>
                  <div class="cart-item__actions" style="display: flex; gap: 12px; font-size: 13px;">
                    <a href="catalog.html" style="color: #999; text-decoration: none;">Добавить ещё пол.</a>
                    <a href="#" style="color: #999; text-decoration: none;">Изменить парам.</a>
                    <button type="button" style="color: #999; background: none; border: none; cursor: pointer; padding: 0;" onclick="window.removeCartItem(\${index})">Очистить наборы</button>
                  </div>
                </div>
                
                <div class="cart-item__price-block" style="text-align:right;">
                  <div class="cart-item__price" style="font-size:18px; font-weight:600;">\${new Intl.NumberFormat("ru-RU").format(itemPrice)} ₽</div>
                  <div class="cart-item__price-note" style="font-size:12px; color:#999; margin-top:4px;">Сумма с учетом<br>комплектующих</div>
                </div>
              </div>
            </div>
          </div>
          
          \${moldingHtml || hardwareHtml ? \`<div class="cart-item__accessories" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #efefef;">
              \${moldingHtml}
              \${hardwareHtml}
          </div>\` : ''}
        \`;
        container.appendChild(div);
      });

      if (summaryTotal)
        summaryTotal.textContent =
          new Intl.NumberFormat("ru-RU").format(total) + " ₽";
      if (summaryFinal)
        summaryFinal.textContent =
          new Intl.NumberFormat("ru-RU").format(total) + " ₽";
    }`;

shopJs = shopJs.replace(renderCartRegex, newRenderCart);

// 2. Fix add to cart logic globally
let docClickRegex = /document.addEventListener\("click", \(e\) => \{[\s\S]*?let id, title;[\s\S]*?\/\/ Init visual state/g;

let newDocClick = `// Global cart and wishlist interceptors
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
          priceVal = parseInt((card.querySelector(".card__price")?.textContent || "0").replace(/\\D/g, "")) || 0;
          const link = card.querySelector("a")?.getAttribute("href") || "";
          id = link ? link.split("/").pop().replace(".html", "") : id;
      } else {
          title = document.querySelector(".product__title")?.textContent.trim() || document.querySelector("h1")?.textContent.trim() || title;
          image = document.querySelector(".product__main-image img")?.getAttribute("src") || image;
          priceVal = parseInt((document.querySelector(".product__price")?.textContent || "0").replace(/\\D/g, "")) || 52000;
          
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
        price = parseInt(priceText.replace(/\\D/g, "")) || 0;
        const link = card.querySelector("a")?.getAttribute("href") || "";
        id = link ? link.split("/").pop().replace(".html", "") : "p-" + Date.now();
      } else {
        title = document.querySelector(".product__title")?.textContent.trim() || document.querySelector("h1")?.textContent.trim() || "Товар";
        image = document.querySelector(".product__main-image img")?.getAttribute("src") || "";
        const priceText = document.querySelector(".product__price")?.textContent || "0";
        price = parseInt(priceText.replace(/\\D/g, "")) || 0;
        
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

  // Init visual state`;

// Use simple replacement index, since original regex on the massive string might fail
const splitIndex = shopJs.indexOf('document.addEventListener("click", (e) => {');
if (splitIndex !== -1) {
    const endInitIndex = shopJs.indexOf('// Init visual state', splitIndex);
    if (endInitIndex !== -1) {
       shopJs = shopJs.substring(0, splitIndex) + newDocClick + "\n  " + shopJs.substring(endInitIndex);
    }
} else {
    console.log("Could not patch doc click");
}

fs.writeFileSync('js/shop.js', shopJs);
console.log("Patched successfully");
