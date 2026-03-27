const fs = require('fs');
let shopJs = fs.readFileSync('js/shop.js', 'utf8');

shopJs = shopJs.replace('  // Call initCartPage', `
  window.updateWishlistBadge = updateWishlistBadge;
  window.updateCartBadge = updateCartBadge;

  document.addEventListener("click", (e) => {
    const target = e.target;
    const wishBtn = target.closest(".card__fav, .product__btn_wishlist");
    if (wishBtn) {
      e.preventDefault();
      const card = wishBtn.closest(".card");
      let id, title, image, price;
      if (card) {
        title = card.querySelector(".card__title")?.textContent.trim() || 'Товар';
        image = card.querySelector("img")?.getAttribute("src") || "";
        const priceText = card.querySelector(".card__price")?.textContent || "0";
        price = priceText.replace(/[^\\d]/g, "");
        const link = card.querySelector("a")?.getAttribute("href") || "";
        id = link ? link.split('/').pop() : title;
      } else {
        title = document.querySelector(".product__title")?.textContent.trim() || document.querySelector(".breadcrumbs__current")?.textContent.trim() || 'Товар';
        image = document.querySelector(".product__main-image img")?.getAttribute("src") || "";
        price = document.querySelector(".product__price, .config-total-price")?.textContent.replace(/[^\\d]/g, "") || "52000";
        id = window.location.pathname.split('/').pop() || title;
      }

      toggleWishlist({ id, title, image, price: Number(price) || 0 });
      wishBtn.classList.toggle("is-active", isInWishlist(id));
      
      if (isInWishlist(id)) {
        wishBtn.style.backgroundColor = "var(--color-primary, #e21836)";
        wishBtn.style.borderColor = "var(--color-primary, #e21836)";
      } else {
        wishBtn.style.backgroundColor = "";
        wishBtn.style.borderColor = "";
      }
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".card__fav, .product__btn_wishlist").forEach(btn => {
      const card = btn.closest(".card");
      let id, title;
      if (card) {
        title = card.querySelector(".card__title")?.textContent.trim() || 'Товар';
        const link = card.querySelector("a")?.getAttribute("href") || "";
        id = link ? link.split('/').pop() : title;
      } else {
        title = document.querySelector(".product__title")?.textContent.trim() || document.querySelector(".breadcrumbs__current")?.textContent.trim() || 'Товар';
        id = window.location.pathname.split('/').pop() || title;
      }
      if (isInWishlist(id)) {
        btn.classList.add("is-active");
        btn.style.backgroundColor = "var(--color-primary, #e21836)";
        btn.style.borderColor = "var(--color-primary, #e21836)";
      }
    });
  });

  // Call initCartPage`);
fs.writeFileSync('js/shop.js', shopJs);
