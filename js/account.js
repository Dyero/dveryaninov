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

  function initPanelSwitching() {
    var navLinks = document.querySelectorAll('.account-nav__link[data-panel]');
    var heading  = document.getElementById('account-page-heading');
    var panels   = {
      orders:  document.getElementById('panel-orders'),
      profile: document.getElementById('panel-profile')
    };
    var titles = { orders: 'История заказов', profile: 'Личные данные' };

    navLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var target = link.getAttribute('data-panel');
        // update nav active state
        navLinks.forEach(function(l) {
          var item = l.closest('.account-nav__item');
          item.classList.toggle('account-nav__item_active', l === link);
          l.removeAttribute('aria-current');
        });
        link.setAttribute('aria-current', 'page');
        // show/hide panels
        Object.keys(panels).forEach(function(key) {
          if (panels[key]) panels[key].hidden = key !== target;
        });
        // update heading
        if (heading) heading.textContent = titles[target] || '';
        // populate profile form when switching to it
        if (target === 'profile') populateProfileForm();
      });
    });
  }

  function populateProfileForm() {
    var user = window.DvAuth ? DvAuth.getCurrentUser() : null;
    if (!user) return;
    var nameInput   = document.getElementById('pf-name');
    var emailInput  = document.getElementById('pf-email');
    var phoneInput  = document.getElementById('pf-phone');
    if (nameInput)  nameInput.value  = user.name  || '';
    if (emailInput) emailInput.value = user.email || '';
    if (phoneInput) phoneInput.value = user.phone || '';
    // clear password fields and messages
    ['pf-pass-current','pf-pass-new','pf-pass-confirm'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    var errEl = document.querySelector('.account-profile-form__error');
    var okEl  = document.querySelector('.account-profile-form__success');
    if (errEl) errEl.textContent = '';
    if (okEl)  okEl.textContent  = '';
  }

  function initProfileForm() {
    var form = document.getElementById('profile-form');
    if (!form) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var errEl       = form.querySelector('.account-profile-form__error');
      var okEl        = form.querySelector('.account-profile-form__success');
      var newName     = form.querySelector('#pf-name')         ? form.querySelector('#pf-name').value.trim()         : '';
      var newEmail    = form.querySelector('#pf-email')        ? form.querySelector('#pf-email').value.trim()        : '';
      var newPhone    = form.querySelector('#pf-phone')        ? form.querySelector('#pf-phone').value.trim()        : '';
      var curPass     = form.querySelector('#pf-pass-current') ? form.querySelector('#pf-pass-current').value        : '';
      var newPass     = form.querySelector('#pf-pass-new')     ? form.querySelector('#pf-pass-new').value            : '';
      var confPass    = form.querySelector('#pf-pass-confirm') ? form.querySelector('#pf-pass-confirm').value        : '';

      if (errEl) errEl.textContent = '';
      if (okEl)  okEl.textContent  = '';

      if (!newName) { if (errEl) errEl.textContent = 'Имя не может быть пустым'; return; }
      if (!newEmail) { if (errEl) errEl.textContent = 'Email не может быть пустым'; return; }

      if (newPass || confPass || curPass) {
        if (!curPass) { if (errEl) errEl.textContent = 'Введите текущий пароль'; return; }
        if (!newPass) { if (errEl) errEl.textContent = 'Введите новый пароль'; return; }
        if (newPass !== confPass) { if (errEl) errEl.textContent = 'Пароли не совпадают'; return; }
        if (newPass.length < 6)  { if (errEl) errEl.textContent = 'Пароль должен содержать минимум 6 символов'; return; }
      }

      var auth = window.DvAuth;
      if (!auth) return;
      var res = auth.updateProfile(newName, newEmail, newPhone, newPass || null, curPass || null);
      if (!res.ok) { if (errEl) errEl.textContent = res.error; return; }

      // update greeting
      var nameEl  = document.querySelector('.account-user-greeting__name');
      var emailEl = document.querySelector('.account-user-greeting__email');
      if (nameEl)  nameEl.textContent  = res.user.name;
      if (emailEl) emailEl.textContent = res.user.email;

      // update header profile link
      var profileLink = document.querySelector('.header__profile-link .header__user-name');
      if (profileLink) profileLink.textContent = res.user.name;

      // clear password fields
      ['pf-pass-current','pf-pass-new','pf-pass-confirm'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.value = '';
      });

      if (okEl) okEl.textContent = 'Данные обновлены';
    });
  }

  function showAccountPage() {
    renderOrders();
    initLogout();
    initPanelSwitching();
    initProfileForm();
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
