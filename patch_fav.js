const fs = require('fs');

const path = '/workspaces/dveryaninov/js/shop.js';
let js = fs.readFileSync(path, 'utf8');

// 1. Remove the global event listener for .card__fav to avoid conflict
js = js.replace(/\/\/ Лайк \(Избранное\)[\s\S]*?if \(favBtn\) \{[\s\S]*?e\.preventDefault\(\);[\s\S]*?favBtn\.classList\.toggle\("is-active"\);[\s\S]*?return;[\s\S]*?\}/g, '');

// 2. Fix the initCardWishlist selector: It was .card__action, we change it to .card__fav and .is-active
js = js.replace(/const btn = card\.querySelector\("\.card__action"\);/g, 'const btn = card.querySelector(".card__fav");');
js = js.replace(/card__action_active/g, 'is-active');

// 3. Update initWishlistBtn to support BOTH product__btn_wishlist and pdp-actions__fav
const pdpFavFix = `
  function initWishlistBtn() {
    const btn = document.querySelector(".product__btn_wishlist") || document.querySelector(".pdp-actions__fav");
    if (!btn) return;
    const titleEl = document.querySelector(".product__title") || document.querySelector(".pdp-info__title");
    const priceEl = document.querySelector(".product__price") || document.querySelector(".pdp-info__price");
    const imgEl = document.querySelector(".product__main-image img") || document.getElementById("pdp-main-image");
    
    // For styling the text "♥" vs actual heart based on the class
    const isPdpBtn = btn.classList.contains("pdp-actions__fav");
    
    const title = titleEl ? titleEl.textContent.trim() : "Товар";
    const id = \`w-\${title.replace(/\\s+/g, "-").toLowerCase()}\`;

    function refreshWishlistBtn() {
      if (isInWishlist(id)) {
        btn.classList.add("is-active", "product__btn_wishlist_active");
        if(isPdpBtn) { btn.style.color = "#611025"; btn.style.borderColor = "#611025"; }
        btn.setAttribute("aria-label", "Убрать из избранного");
      } else {
        btn.classList.remove("is-active", "product__btn_wishlist_active");
        if(isPdpBtn) { btn.style.color = ""; btn.style.borderColor = "#ccc"; }
        btn.setAttribute("aria-label", "В избранное");
      }
      updateWishlistBadge();
    }

    btn.addEventListener("click", () => {
      const priceText = priceEl ? priceEl.textContent : "0";
      const price = Number((priceText.match(/\\d[\\d\\s]*/)?.[0] || "0").replace(/\\s/g, ""));
      const image = imgEl ? imgEl.getAttribute("src") : "";
      toggleWishlist({ id, title, price, image });
      refreshWishlistBtn();
    });

    refreshWishlistBtn();
  }
`;

js = js.replace(/function initWishlistBtn\(\) \{[\s\S]*?refreshWishlistBtn\(\);\n  \}/, pdpFavFix.trim());

fs.writeFileSync(path, js);
console.log("Wishlist logic patched successfully in shop.js");
