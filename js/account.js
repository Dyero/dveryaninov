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

    // Brief order cards
    section.innerHTML = orders.slice().reverse().map(function(ord, revIdx) {
      var d = new Date(ord.date).toLocaleDateString('ru-RU');
      var itemCount = (ord.items || []).length;
      var firstTitle = (ord.items && ord.items[0]) ? (ord.items[0].title || 'Товар') : 'Товар';
      var moreText = itemCount > 1 ? ' и ещё ' + (itemCount - 1) + ' поз.' : '';
      var badges = '';
      if (ord.delivery) badges += '<span style="display:inline-block;margin-right:8px;padding:3px 8px;background:#f0f0f0;font-size:11px;">Доставка</span>';
      if (ord.install) badges += '<span style="display:inline-block;padding:3px 8px;background:#f0f0f0;font-size:11px;">Установка</span>';

      return '<div class="order-card" style="border:1px solid #eee;padding:20px;margin-bottom:16px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
          '<h3 style="margin:0;font-size:16px;">Заказ #' + ord.id.replace('ORD-','') + '</h3>' +
          '<span style="font-size:13px;color:#999;">' + d + '</span>' +
        '</div>' +
        '<p style="margin:0 0 8px;font-size:14px;color:#555;">' + esc(firstTitle) + moreText + '</p>' +
        (badges ? '<div style="margin-bottom:8px;">' + badges + '</div>' : '') +
        '<div style="display:flex;justify-content:space-between;align-items:center;">' +
          '<span style="font-size:16px;font-weight:700;">' + fmt(ord.total) + ' ₽</span>' +
          '<button type="button" class="btn btn_primary" style="padding:8px 20px;font-size:13px;" data-order-detail="' + (orders.length - 1 - revIdx) + '">Подробнее</button>' +
        '</div>' +
      '</div>';
    }).join('');

    // Bind detail buttons
    section.querySelectorAll('[data-order-detail]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = Number(btn.getAttribute('data-order-detail'));
        showOrderDetail(orders[idx], labels);
      });
    });

    // Highlight newest order if redirected from checkout
    var params = new URLSearchParams(window.location.search);
    var highlightId = params.get('order');
    if (highlightId) {
      // Find the card for this order
      var cards = section.querySelectorAll('.order-card');
      cards.forEach(function(card) {
        if (card.innerHTML.indexOf(highlightId.replace('ORD-','')) !== -1) {
          card.style.borderColor = '#611025';
          card.style.borderWidth = '2px';
        }
      });
      // Clean URL
      window.history.replaceState({}, '', 'account.html');
    }
  }

  function showOrderDetail(ord, labels) {
    // Remove existing detail modal
    var existing = document.getElementById('order-detail-modal');
    if (existing) existing.remove();

    var itemsHtml = (ord.items || []).map(function(it) {
      var doorQty = it.doorQty || 1;
      var doorProps = '';
      if (it.options) {
        doorProps = '<div style="margin-top:12px;display:grid;gap:6px;font-size:13px;color:#555;">';
        for (var k in labels) {
          if (it.options[k] && it.options[k] !== '-') {
            doorProps += '<div><span style="color:#999">' + labels[k] + ':</span> ' + it.options[k] + '</div>';
          }
        }
        doorProps += '</div>';
      }

      var accHtml = '';
      if (it.accessories && it.accessories.length) {
        accHtml = '<div style="margin-top:16px;border-top:1px solid #f0f0f0;padding-top:12px;">';
        accHtml += '<div style="font-size:13px;font-weight:600;margin-bottom:8px;">Фурнитура и погонаж</div>';
        it.accessories.forEach(function(acc) {
          accHtml += '<div style="display:flex;gap:12px;margin-bottom:8px;font-size:13px;">';
          if (acc.image) accHtml += '<img src="' + acc.image + '" style="width:40px;height:40px;object-fit:contain;background:#f5f5f5;" alt="">';
          accHtml += '<div>' + esc(acc.title || 'Аксессуар');
          if (acc.spec) accHtml += ' <span style="color:#999">(' + esc(acc.spec) + ')</span>';
          accHtml += ' × ' + (acc.qty || 1);
          accHtml += '</div></div>';
        });
        accHtml += '</div>';
      }

      return '<div style="display:flex;gap:16px;padding:16px 0;border-bottom:1px solid #f0f0f0;">' +
        '<img src="' + (it.image || 'images/card-door-1.svg') + '" style="width:80px;height:100px;object-fit:contain;background:#f9f9f9;padding:4px;flex-shrink:0;" alt="">' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;">' +
            '<h4 style="margin:0;font-size:15px;">' + esc(it.title || 'Товар') + (doorQty > 1 ? ' <span style="color:#999">× ' + doorQty + '</span>' : '') + '</h4>' +
            '<span style="font-weight:600;white-space:nowrap;margin-left:12px;">' + fmt((it.priceSum || it.price || 0) * doorQty) + ' ₽</span>' +
          '</div>' +
          doorProps +
          accHtml +
        '</div>' +
      '</div>';
    }).join('');

    var d = new Date(ord.date).toLocaleDateString('ru-RU');
    var badges = '';
    if (ord.delivery) badges += '<span style="display:inline-block;margin-right:8px;padding:4px 10px;background:#f0f0f0;font-size:12px;">Доставка</span>';
    if (ord.install) badges += '<span style="display:inline-block;padding:4px 10px;background:#f0f0f0;font-size:12px;">Установка</span>';

    var modal = document.createElement('div');
    modal.id = 'order-detail-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);';
    modal.innerHTML = '<div style="background:#fff;width:min(600px,calc(100vw - 32px));max-height:85vh;overflow-y:auto;padding:32px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">' +
        '<h2 style="margin:0;font-size:20px;">Заказ #' + ord.id.replace('ORD-','') + '</h2>' +
        '<button type="button" id="close-order-detail" style="background:none;border:none;font-size:24px;cursor:pointer;padding:0;line-height:1;">×</button>' +
      '</div>' +
      '<p style="margin:0 0 12px;font-size:13px;color:#999;">Дата: ' + d + '</p>' +
      (badges ? '<div style="margin-bottom:16px;">' + badges + '</div>' : '') +
      itemsHtml +
      '<div style="text-align:right;margin-top:20px;padding-top:16px;border-top:1px solid #eee;font-size:18px;font-weight:700;">Итого: ' + fmt(ord.total) + ' ₽</div>' +
    '</div>';

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    function closeDetail() {
      modal.remove();
      document.body.style.overflow = '';
    }
    modal.querySelector('#close-order-detail').addEventListener('click', closeDetail);
    modal.addEventListener('click', function(e) { if (e.target === modal) closeDetail(); });
    document.addEventListener('keydown', function handler(e) {
      if (e.key === 'Escape') { closeDetail(); document.removeEventListener('keydown', handler); }
    });
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
