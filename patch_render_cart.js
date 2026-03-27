const fs = require('fs');
const jsPath = '/workspaces/dveryaninov/js/shop.js';
let js = fs.readFileSync(jsPath, 'utf8');

const newRenderCartCode = `
  function renderCart() {
    if (!container) return;
    const items = JSON.parse(localStorage.getItem("dveryaninov_cart_v1") || "[]");
    container.innerHTML = "";
    
    let total = 0;
    if (items.length === 0) {
      container.innerHTML = "<p>Корзина пуста. <a href='catalog.html' style='color:#611025; text-decoration:underline;'>Перейти в каталог</a></p>";
      const cSide = document.querySelector('.cart-summary');
      if (cSide) cSide.style.display = 'none';
      return;
    } else {
      const cSide = document.querySelector('.cart-summary');
      if (cSide) cSide.style.display = 'block';
    }

    const labels = { 
      size: 'Размер', finish: 'Цвет покрытия', glazing: 'Остекление', 
      opening: 'Тип открывания', 'opening-type': 'Сторона открывания', 
      pattern: 'Узор',
      box: 'Тип погонажа', casing: 'Наличники', quantity: 'Шт. доборов', 'height-add': 'Добор', 
      threshold: 'Порог',
      'handle-color': 'Модель ручки', 'lock-type': 'Тип замка', 'lock-color': 'Цвет замка',
      locker: 'Запирание (Фиксатор)', hinges: 'Петли', 'hinges-color': 'Цвет петель',
      stopper: 'Ограничитель' 
    };

    items.forEach((item, index) => {
      const itemPrice = Number(item.priceSum || item.price || 0);
      total += itemPrice;
      
      let propsHtml = '';
      if (item.options) {
        propsHtml = '<div style="margin-top: 16px; display: grid; gap: 8px; font-size: 13px; color: #555;">';
        for (const [k, v] of Object.entries(item.options)) {
          if (v && v !== '-') {
            propsHtml += \`<div><span style="color:#999">\${labels[k] || k}:</span> \${v}</div>\`;
          }
        }
        if (item.accessories && item.accessories.length) {
           item.accessories.forEach(acc => {
             propsHtml += \`<div><span style="color:#999">\${acc.title}:</span> \${acc.spec || ''} (\${acc.price} ₽ x \${acc.qty})</div>\`;
           });
        }
        propsHtml += '</div>';
      }

      const div = document.createElement("article");
      div.className = "cart-item";
      div.innerHTML = \`
        <div class="cart-item__image-wrap" style="align-self: start;">
          <img class="cart-item__image" src="\${item.image || 'images/card-door-1.svg'}" alt="Товар" style="width: 100%; height: auto; display: block;">
        </div>
        <div class="cart-item__info">
          <div class="cart-item__info-header" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap;">
            <div>
              <h3 class="cart-item__title" style="margin: 0; font-size: 16px;">\${item.title || 'Товар конфигуратора'}</h3>
              <div class="cart-item__price" style="margin-top: 8px; font-weight: bold;">Цена за комплект<br>\${new Intl.NumberFormat('ru-RU').format(itemPrice)} ₽</div>
            </div>
            
            <div class="cart-item__actions" style="display: flex; gap: 12px; font-size: 13px;">
              <a href="catalog.html" style="color: #666; text-decoration: none;">Добавить ещё дверь</a>
              <span class="cart-item__action-sep" style="color: #ccc;">|</span>
              <a href="product.html" style="color: #666; text-decoration: none;">Редактировать</a>
              <span class="cart-item__action-sep" style="color: #ccc;">|</span>
              <button type="button" style="color: #666; background: none; border: none; cursor: pointer; padding: 0;" onclick="window.removeCartItem(\${index})">Удалить</button>
            </div>
          </div>
          \${propsHtml}
        </div>
      \`;
      container.appendChild(div);
    });

    const summaryTotal = document.getElementById("cart-summary-total");
    const summaryFinal = document.getElementById("cart-summary-final");
    if (summaryTotal) summaryTotal.textContent = new Intl.NumberFormat('ru-RU').format(total) + " ₽";
    if (summaryFinal) summaryFinal.textContent = new Intl.NumberFormat('ru-RU').format(total) + " ₽";
  }
`;

js = js.replace(/function renderCart\(\) \{[\s\S]*?if \(summaryFinal\)[^\n]*\n  \}/, newRenderCartCode.trim());
fs.writeFileSync(jsPath, js);
console.log("Cart patched");
