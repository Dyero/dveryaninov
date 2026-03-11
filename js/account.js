(function () {
  'use strict';

  function fmt(n) {
    return new Intl.NumberFormat('ru-RU').format(Number(n) || 0);
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function buildSpecsHtml(options) {
    if (!options || typeof options !== 'object') return '';
    var labels = {
      box:           'Короб',
      casing:        'Наличник',
      quantity:      'Комплект',
      'height-add':  'Доп. высота',
      threshold:     'Порог',
      size:          'Размер',
      finish:        'Покрытие',
      glazing:       'Остекление',
      opening:       'Тип открывания',
      'handle-color':'Цвет ручки',
      'lock-type':   'Замок',
      hinges:        'Петли',
      stopper:       'Ограничитель'
    };
    return Object.keys(options).filter(function (k) { return options[k]; }).map(function (k) {
      var label = labels[k] || k;
      return '<div class="order-item__spec">' +
        '<span class="order-item__spec-label">' + esc(label) + ':</span>' +
        '<span class="order-item__spec-value">' + esc(options[k]) + '</span>' +
        '</div>';
    }).join('');
  }

  function renderOrders() {
    var section = document.querySelector('.account-orders');
    if (!section) return;

    var auth   = window.DvAuth;
    var user   = auth ? auth.getCurrentUser() : null;
    var orders = auth ? auth.getUserOrders()  : [];

    // Update user greeting
    var nameEl  = document.querySelector('.account-user-greeting__name');
    var emailEl = document.querySelector('.account-user-greeting__email');
    if (nameEl  && user) nameEl.textContent  = user.name;
    if (emailEl && user) emailEl.textContent = user.email;

    if (!orders.length) {
      section.innerHTML =
        '<div class="account-empty">' +
          '<p class="account-empty__text">Заказов пока нет</p>' +
          '<a class="account-empty__link" href="catalog.html">Перейти в каталог</a>' +
        '</div>';
      return;
    }

    section.innerHTML = orders.map(function (ord) {
      var itemsHtml = (ord.items || []).map(function (it) {
        return '<div class="order-item">' +
          '<div class="order-item__image-wrap"></div>' +
          '<div class="order-item__info">' +
            '<span class="order-item__title">' + esc(it.title || 'Товар') + '</span>' +
            '<div class="order-item__specs">' + buildSpecsHtml(it.options) + '</div>' +
          '</div>' +
          '<div class="order-item__price-block">' +
            '<span class="order-item__price-label">Цена</span>' +
            '<span class="order-item__price">' +
              fmt((it.price || 0) * (it.qty || 1)) + '\u00a0₽' +
            '</span>' +
          '</div>' +
        '</div>';
      }).join('');

      var ordNum = String(ord.id).replace('ord-', '');
      return '<div class="order-card">' +
        '<div class="order-card__header">' +
          '<span class="order-card__id">Заказ #' + esc(ordNum) + '</span>' +
          '<span class="order-card__date">' + esc(ord.date) + '</span>' +
          '<span class="order-card__status">' + esc(ord.status || 'Принят') + '</span>' +
        '</div>' +
        itemsHtml +
        '<div class="order-card__total">' +
          '<span class="order-card__total-label">Итого:</span>' +
          '<span class="order-card__total-value">' + fmt(ord.total) + '\u00a0₽</span>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function initLogout() {
    var btn = document.querySelector('.account-nav__logout');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (window.DvAuth) DvAuth.logout();
      else { localStorage.removeItem('dv_session'); window.location.href = 'index.html'; }
    });
  }

  function showAccountPage() {
    renderOrders();
    initLogout();
  }

  function requireAuth(auth) {
    // Auth modal is inside header.html — wait until it's in DOM
    if (document.getElementById('auth-modal')) {
      auth.openAuthModal(showAccountPage);
    } else {
      document.addEventListener('headerReady', function () {
        auth.openAuthModal(showAccountPage);
      }, { once: true });
    }
  }

  function init() {
    var auth = window.DvAuth;

    if (!auth || !auth.isLoggedIn()) {
      if (auth) requireAuth(auth);
      return;
    }

    showAccountPage();
  }

  // DvAuth is in <head> so it's available by the time this script runs
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
