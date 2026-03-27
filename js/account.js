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
    var heading  = document.querySelector('#account-page-heading');
    var panels   = {
      orders:  document.querySelector('#panel-orders'),
      profile: document.querySelector('#panel-profile')
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
    var nameInput   = document.querySelector('#pf-name');
    var emailInput  = document.querySelector('#pf-email');
    var phoneInput  = document.querySelector('#pf-phone');
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
    var form = document.querySelector('#profile-form');
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
    if (document.querySelector('#auth-modal')) {
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
