const fs = require('fs');

const shopJsFile = '/workspaces/dveryaninov/js/shop.js';
let shopJs = fs.readFileSync(shopJsFile, 'utf8');

if (!shopJs.includes('function updateCartBadge()')) {
  shopJs = shopJs.replace('function updateWishlistBadge() {', `
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
  function updateWishlistBadge() {`);

  // Hook addToCart
  shopJs = shopJs.replace('localStorage.setItem("dveryaninov_cart_v1", JSON.stringify(items));\n  }', 'localStorage.setItem("dveryaninov_cart_v1", JSON.stringify(items));\n    updateCartBadge();\n  }');

  // Hook removeCartItem (it's inside logic, I'll just re-render)
  shopJs = shopJs.replace('renderCart();\n  };', 'renderCart();\n    updateCartBadge();\n  };');

  // Trigger on load
  shopJs = shopJs + `
document.addEventListener("DOMContentLoaded", () => {
  if (typeof updateWishlistBadge === "function") updateWishlistBadge();
  if (typeof updateCartBadge === "function") updateCartBadge();
});
`;
  fs.writeFileSync(shopJsFile, shopJs);
  console.log("shop.js badges patched");
}

let wishlistFile = '/workspaces/dveryaninov/wishlist.html';
if (fs.existsSync(wishlistFile)) {
  let wl = fs.readFileSync(wishlistFile, 'utf8');
  fs.writeFileSync(wishlistFile, wl);
}

