const fs = require('fs');
const { JSDOM } = require('jsdom');

const log = console.log;

// 1. Rewrite cart.html to have an empty cart list container and a checkout form
const cartPath = '/workspaces/dveryaninov/cart.html';
let cartHtml = fs.readFileSync(cartPath, 'utf8');
const domCart = new JSDOM(cartHtml);
const docCart = domCart.window.document;

const itemsContainer = docCart.querySelector('.cart__items');
if (itemsContainer) itemsContainer.innerHTML = ''; // Clear static items
itemsContainer.id = 'cart-items-container';

const checkoutSidebar = docCart.querySelector('.cart__sidebar');
if (checkoutSidebar) {
  checkoutSidebar.innerHTML = `
    <div class="cart-summary cart-summary_sticky">
      <h2 class="cart-summary__title">Сумма заказа</h2>
      <div class="cart-summary__row"><span class="cart-summary__label">Товары:</span><span class="cart-summary__value" id="cart-summary-total">0 ₽</span></div>
      <div class="cart-summary__row"><span class="cart-summary__label">Монтаж:</span><span class="cart-summary__value" id="cart-summary-install">0 ₽</span></div>
      <div class="cart-summary__row cart-summary__row_total">
        <span class="cart-summary__label">Итого:</span><b class="cart-summary__value cart-summary__value_accent" id="cart-summary-final">0 ₽</b>
      </div>
      
      <form id="checkout-form" style="margin-top: 1.5rem;">
        <div style="margin-bottom: 1rem;">
          <input type="text" id="checkout-name" placeholder="Ваше имя" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" />
        </div>
        <div style="margin-bottom: 1rem;">
          <input type="tel" id="checkout-phone" placeholder="Телефон" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" />
        </div>
        <button type="submit" class="btn btn_primary" style="width: 100%;">ОФОРМИТЬ ЗАКАЗ</button>
      </form>
    </div>
  `;
}

fs.writeFileSync(cartPath, domCart.serialize());
log("cart.html layout updated");

// 2. Add checkout JS and rendering to shop.js
const shopPath = '/workspaces/dveryaninov/js/shop.js';
let shopJs = fs.readFileSync(shopPath, 'utf8');

const injectCartRender = `
// ------------ CHECKOUT & CART RENDER ------------
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cart-items-container");
  const checkoutForm = document.getElementById("checkout-form");
  if (!container && !checkoutForm) return;

  function renderCart() {
    if (!container) return;
    const items = window.dveryaninovGetCart ? window.dveryaninovGetCart() : getCart();
    container.innerHTML = "";
    
    let total = 0;
    if (items.length === 0) {
      container.innerHTML = "<p>Корзина пуста. <a href='index.html'>Перейти в каталог</a></p>";
    }

    items.forEach((item, index) => {
      total += Number(item.priceSum || item.price || 0);
      const div = document.createElement("article");
      div.className = "cart-item";
      div.innerHTML = \`
        <div class="cart-item__image-wrap">
          <img class="cart-item__image" src="images/card-door-1.svg" alt="Товар" width="120" height="160">
        </div>
        <div class="cart-item__info">
          <h3 class="cart-item__title">\${item.title || 'Товар конфигуратора'}</h3>
          <p style="font-size: 0.8rem; color: #666; margin: 4px 0;">Конфигурация: \${item.params ? Object.values(item.params).slice(0,3).join(', ') + '...' : ''}</p>
          <div class="cart-item__price" style="margin-top: auto; font-weight: bold;">\${new Intl.NumberFormat('ru-RU').format(item.priceSum || item.price || 0)} ₽</div>
          <button type="button" style="color: #c00; background: none; border: none; font-size: 0.8rem; text-decoration: underline; cursor: pointer; margin-top: 10px;" onclick="window.removeCartItem(\${index})">Удалить</button>
        </div>
      \`;
      container.appendChild(div);
    });

    const summaryTotal = document.getElementById("cart-summary-total");
    const summaryFinal = document.getElementById("cart-summary-final");
    if (summaryTotal) summaryTotal.textContent = new Intl.NumberFormat('ru-RU').format(total) + " ₽";
    if (summaryFinal) summaryFinal.textContent = new Intl.NumberFormat('ru-RU').format(total) + " ₽";
  }

  window.removeCartItem = (idx) => {
    const items = getCart();
    items.splice(idx, 1);
    setCart(items);
    renderCart();
  };

  renderCart();

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const items = getCart();
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
      setCart([]);
      
      alert("Ваша заявка успешно оформлена (см. консоль)!");
      window.location.href = "account.html";
    });
  }
});
`;

fs.writeFileSync(shopPath, shopJs + "\n" + injectCartRender);
log("Cart + Checkout logic injected into shop.js");

