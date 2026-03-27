const fs = require('fs');
const jsPath = '/workspaces/dveryaninov/js/account.js';
let js = fs.readFileSync(jsPath, 'utf8');

const newRenderCode = `
  function renderOrders() {
    var section = document.querySelector('.account-orders');
    if (!section) return;

    var auth = window.DvAuth;
    var user = auth ? auth.getCurrentUser() : null;
    var orders = window.safeJsonParse ? safeJsonParse(localStorage.getItem("dveryaninov_orders_v1"), []) : JSON.parse(localStorage.getItem("dveryaninov_orders_v1") || "[]");

    var nameEl  = document.querySelector('.account-user-greeting__name');
    var emailEl = document.querySelector('.account-user-greeting__email');
    if (nameEl) nameEl.textContent = user ? user.name : "Гость";
    if (emailEl) emailEl.textContent = user ? user.email : "";

    if (!orders || orders.length === 0) {
      section.innerHTML = 
        '<div class="account-empty">' +
          '<p class="account-empty__text" style="color: #666; font-size: 16px;">Заказов пока нет</p>' +
          '<a class="btn btn_primary" href="catalog.html" style="margin-top: 16px;">Перейти в каталог</a>' +
        '</div>';
      return;
    }

    const labels = { 
      size: 'Размер', finish: 'Цвет покрытия', glazing: 'Остекление', opening: 'Тип открывания', 'opening-type': 'Сторона открывания', pattern: 'Узор',
      casing: 'Наличники', quantity: 'Шт. доборов', 'height-add': 'Добор', threshold: 'Порог',
      'handle-color': 'Модель ручки', 'lock-type': 'Тип замка', 'lock-color': 'Цвет замка',
      locker: 'Запирание (Фиксатор)', hinges: 'Петли', 'hinges-color': 'Цвет петель',
      stopper: 'Ограничитель' 
    };

    section.innerHTML = orders.map(function(ord) {
      var itemsHtml = (ord.items || []).map(function(it) {
        
        let doorProps = '';
        if (it.options) {
          doorProps = '<div style="margin-top: 16px; display: grid; gap: 8px; font-size: 13px; color: #555;">';
          for (var k in labels) {
            if (it.options[k] && it.options[k] !== '-') {
              doorProps += '<div><span style="color:#999">' + labels[k] + ':</span> ' + it.options[k] + '</div>';
            }
          }
          doorProps += '</div>';
        }

        let accHtml = '';
        if (it.accessories && it.accessories.length) {
          accHtml = '<div style="margin-top: 24px;">';
          it.accessories.forEach(function(acc) {
            accHtml += '<div style="display: grid; grid-template-columns: 120px 1fr; gap: 24px; margin-bottom: 24px;">';
            accHtml += '<div style="width:120px; height:120px; background:#f5f5f5; display:flex; align-items:center; justify-content:center; padding:10px;"><img src="images/card-door-1.svg" style="max-height:100%; object-fit:contain" alt=""></div>';
            accHtml += '<div><h4 style="margin:0 0 8px; font-size:16px;">' + (acc.title || 'Аксессуар') + '</h4>';
            accHtml += '<div style="font-size:13px; color:#555;"><span style="color:#999">Спецификация:</span> ' + (acc.spec || '') + '</div>';
            accHtml += '<div style="font-size:13px; color:#555; margin-top:4px;"><span style="color:#999">Цена:</span> ' + new Intl.NumberFormat('ru-RU').format(acc.price) + ' ₽ × ' + (acc.qty||1) + '</div>';
            accHtml += '</div></div>';
          });
          accHtml += '</div>';
        }

        return '<div style="display: grid; grid-template-columns: 120px 1fr; gap: 24px; margin-bottom: 40px; padding-bottom: 40px; border-bottom: 1px solid #eee;">' +
          '<div style="width: 120px;"><img src="' + (it.image || 'images/card-door-1.svg') + '" style="width: 100%; background: #f9f9f9; padding: 10px;" alt=""></div>' +
          '<div>' +
            '<div style="display: flex; justify-content: space-between; align-items: flex-start;">' +
              '<h3 style="margin: 0; font-size: 16px;">' + (it.title || 'Товар') + '</h3>' +
              '<div style="text-align: right; font-size: 14px;"><div style="color: #999;">Цена за комплект</div>' + new Intl.NumberFormat('ru-RU').format(it.priceSum || it.price || 0) + ' ₽</div>' +
            '</div>' +
            doorProps +
            accHtml +
          '</div>' +
        '</div>';

      }).join('');

      var d = new Date(ord.date).toLocaleDateString('ru-RU');
      return '<div style="margin-bottom: 40px;">' +
        '<h2 style="font-size: 20px; margin-bottom: 24px;">Заказ #' + ord.id.replace('ORD-','') + ' от ' + d + '</h2>' +
        itemsHtml +
        '<div style="text-align: right; font-size: 18px; font-weight: bold;">Итого: ' + new Intl.NumberFormat('ru-RU').format(ord.total) + ' ₽</div>' +
      '</div>';
    }).join('');
  }
`;

const startIndex = js.indexOf('function renderOrders() {');
const endIndex = js.indexOf('function initLogout() {');

if (startIndex !== -1 && endIndex !== -1) {
  js = js.substring(0, startIndex) + newRenderCode + '\n  ' + js.substring(endIndex);
  fs.writeFileSync(jsPath, js);
  console.log("account.js successfully patched using substring");
} else {
  console.log("Failed to find boundaries");
}
