/* Load header and footer on all pages.
   HTML is embedded as strings — works on file:// and any HTTP server without CORS issues. */
(function () {
  var HEADER_HTML = [
    '<header class="header">',
    '  <div class="header__level header__level_1">',
    '    <div class="header__top-row">',
    '      <div class="header__location">',
    '        <img src="images/icon-location.svg" alt="" width="24" height="24" class="header__icon-img">',
    '        <span class="header__city">Чебоксары</span>',
    '      </div>',
    '      <a class="header__link" href="contacts.html">Адреса салонов</a>',
    '      <a class="header__link" href="about.html">О компании</a>',
    '      <a class="header__link" href="contacts.html">Контакты</a>',
    '      <div class="header__right">',
    '        <a class="header__link" href="#">Блог</a>',
    '        <a class="header__link" href="#">Проекты</a>',
    '        <button type="button" class="header__topbar-callback" id="header-callback-btn">Заказать звонок</button>',
    '      </div>',
    '    </div>',
    '  </div>',
    '  <div class="header__level header__level_2">',
    '    <nav class="header__nav">',
    '      <a class="header__nav-item" href="catalog.html">Каталог</a>',
    '      <a class="header__nav-item" href="service.html">Услуги</a>',
    '      <a class="header__nav-item" href="#">Партнёрам</a>',
    '    </nav>',
    '    <a class="header__logo" href="index.html">',
    '      <img src="images/logo.svg" alt="Дверянинов" width="196" height="59">',
    '    </a>',
    '    <div class="header__actions">',
    '      <a class="header__phone" href="tel:88005508869">8 800 550-88-69</a>',
    '      <a href="wishlist.html" id="header-wishlist-btn" class="header__icon-btn" aria-label="Избранное" style="position:relative">',
    '        <img src="images/icon-heart.svg" alt="" width="24" height="24">',
    '      </a>',
    '      <a href="cart.html" class="header__icon-btn" aria-label="Корзина">',
    '        <img src="images/icon-bag.svg" alt="" width="24" height="24">',
    '      </a>',
    '      <button type="button" class="header__icon-btn header__profile-btn" aria-label="Профиль">',
    '        <img src="images/icon-user.svg" alt="" width="24" height="24">',
    '      </button>',
    '      <button type="button" id="header-search-btn" class="header__icon-btn header__search-btn" aria-label="Поиск">',
    '        <img src="images/icon-search.svg" alt="" width="24" height="24">',
    '      </button>',
    '    </div>',
    '  </div>',
    '</header>',
    '<div class="auth-modal" id="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" aria-hidden="true">',
    '  <div class="auth-modal__backdrop"></div>',
    '  <div class="auth-modal__panel">',
    '    <div class="auth-modal__header">',
    '      <h2 class="auth-modal__title" id="auth-modal-title">Личный кабинет</h2>',
    '      <button type="button" class="auth-modal__close" data-close-auth aria-label="Закрыть">',
    '        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
    '          <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>',
    '          <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" stroke-width="2"/>',
    '        </svg>',
    '      </button>',
    '    </div>',
    '    <div class="auth-modal__tabs">',
    '      <button class="modal__tab modal__tab_active" type="button" data-auth-tab="login" aria-selected="true">Войти</button>',
    '      <button class="modal__tab" type="button" data-auth-tab="register" aria-selected="false">Регистрация</button>',
    '    </div>',
    '    <div data-auth-panel="login">',
    '      <form class="auth-form" id="login-form" novalidate>',
    '        <div class="auth-form__field">',
    '          <label class="auth-form__label" for="login-email">Email</label>',
    '          <input class="auth-form__input" type="email" id="login-email" name="email" autocomplete="email" required>',
    '        </div>',
    '        <div class="auth-form__field">',
    '          <label class="auth-form__label" for="login-password">Пароль</label>',
    '          <input class="auth-form__input" type="password" id="login-password" name="password" autocomplete="current-password" required>',
    '        </div>',
    '        <div class="auth-form__error" aria-live="polite"></div>',
    '        <button type="submit" class="auth-form__btn">Войти</button>',
    '      </form>',
    '    </div>',
    '    <div data-auth-panel="register" hidden>',
    '      <form class="auth-form" id="register-form" novalidate>',
    '        <div class="auth-form__field">',
    '          <label class="auth-form__label" for="reg-name">Имя</label>',
    '          <input class="auth-form__input" type="text" id="reg-name" name="reg-name" autocomplete="name" required>',
    '        </div>',
    '        <div class="auth-form__field">',
    '          <label class="auth-form__label" for="reg-email">Email</label>',
    '          <input class="auth-form__input" type="email" id="reg-email" name="reg-email" autocomplete="email" required>',
    '        </div>',
    '        <div class="auth-form__field">',
    '          <label class="auth-form__label" for="reg-password">Пароль</label>',
    '          <input class="auth-form__input" type="password" id="reg-password" name="reg-password" autocomplete="new-password" required>',
    '        </div>',
    '        <div class="auth-form__error" aria-live="polite"></div>',
    '        <button type="submit" class="auth-form__btn">Зарегистрироваться</button>',
    '      </form>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('\n');

  var SEARCH_OVERLAY_HTML = [
    '<div class="search-overlay" id="search-overlay" role="dialog" aria-modal="true" aria-label="Поиск" aria-hidden="true">',
    '  <div class="search-overlay__backdrop"></div>',
    '  <div class="search-overlay__panel">',
    '    <div class="search-overlay__field">',
    '      <input class="search-overlay__input" type="search" id="search-input" placeholder="Поиск по моделям дверей..." autocomplete="off" aria-label="Введите запрос">',
    '      <button type="button" class="search-overlay__close" id="search-close" aria-label="Закрыть поиск">',
    '        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
    '          <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>',
    '          <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" stroke-width="2"/>',
    '        </svg>',
    '      </button>',
    '    </div>',
    '    <ul class="search-overlay__results" id="search-results" role="listbox" aria-label="Результаты поиска"></ul>',
    '  </div>',
    '</div>'
  ].join('\n');

  var SEARCH_PRODUCTS = [
    { title: 'Флай 8 ПГ', url: 'product-fly-8-pg.html', desc: 'Межкомнатная дверь' },
    { title: 'Ультра 5 ПГ', url: 'product-ultra-5-pg.html', desc: 'Межкомнатная дверь' },
    { title: 'Мета 1 ПГ Престиж', url: 'product-meta-1-pg.html', desc: 'Межкомнатная дверь' },
    { title: 'Сол 2 ПГ', url: 'product-sol-2-pg.html', desc: 'Межкомнатная дверь' }
  ];

  var CALL_MODAL_HTML = [
    '<div class="call-modal" id="call-modal" role="dialog" aria-modal="true" aria-labelledby="call-modal-title" aria-hidden="true">',
    '  <div class="call-modal__backdrop"></div>',
    '  <div class="call-modal__panel">',
    '    <button type="button" class="call-modal__close" id="call-modal-close" aria-label="Закрыть">',
    '      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
    '        <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>',
    '        <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" stroke-width="2"/>',
    '      </svg>',
    '    </button>',
    '    <div class="call-modal__icon" aria-hidden="true">',
    '      <img src="images/0203 vuesax 04 phone.svg" alt="" width="40" height="40">',
    '    </div>',
    '    <h2 class="call-modal__title" id="call-modal-title">Заказать звонок</h2>',
    '    <p class="call-modal__subtitle">Оставьте свои данные, и мы перезвоним вам в течение 30 минут</p>',
    '    <form class="call-modal__form" id="call-modal-form" novalidate>',
    '      <div class="call-modal__field">',
    '        <label class="call-modal__label" for="call-name">Ваше имя</label>',
    '        <input class="call-modal__input" type="text" id="call-name" name="name" autocomplete="name" placeholder="Иван Иванов" required>',
    '      </div>',
    '      <div class="call-modal__field">',
    '        <label class="call-modal__label" for="call-phone">Номер телефона</label>',
    '        <input class="call-modal__input call-modal__input_phone" type="tel" id="call-phone" name="phone" autocomplete="tel" placeholder="+7 (___) ___-__-__" required>',
    '      </div>',
    '      <div class="call-modal__error" aria-live="polite"></div>',
    '      <button type="submit" class="call-modal__submit">Перезвоните мне</button>',
    '    </form>',
    '    <div class="call-modal__success" id="call-modal-success" hidden>',
    '      <div class="call-modal__success-icon" aria-hidden="true">&#10003;</div>',
    '      <p class="call-modal__success-text">Заявка принята! Мы перезвоним вам в течение 30 минут.</p>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('\n');

  var FOOTER_HTML = [
    '<footer class="footer">',
    '  <div class="footer__top">',
    '    <div class="footer__brand">',
    '      <a href="index.html"><img class="footer__logo" src="images/logo-footer.svg" alt="Дверянинов" width="266" height="81"></a>',
    '      <div class="footer__contact">',
    '        <a class="footer__phone" href="tel:88005508869">8 800 550-88-69</a>',
    '        <p class="footer__hours">с 08:00 до 17:00 по МСК</p>',
    '      </div>',
    '      <div class="footer__social">',
    '        <p class="footer__social-title">Присоединяйтесь</p>',
    '        <div class="footer__social-links"></div>',
    '      </div>',
    '      <div class="footer__email-block">',
    '        <p class="footer__label">По всем вопросам</p>',
    '        <a class="footer__email" href="mailto:design@dveryaninov.ru">design@dveryaninov.ru</a>',
    '      </div>',
    '    </div>',
    '    <div class="footer__columns">',
    '      <div class="footer__column">',
    '        <h4 class="footer__column-title">Каталог</h4>',
    '        <ul class="footer__list">',
    '          <li><a href="catalog.html">Межкомнатные двери</a></li>',
    '          <li><a href="#">Входные двери</a></li>',
    '          <li><a href="#">Скрытые двери</a></li>',
    '          <li><a href="#">Декоративные рейки</a></li>',
    '          <li><a href="#">Стеновые панели</a></li>',
    '          <li><a href="#">Фурнитура</a></li>',
    '        </ul>',
    '      </div>',
    '      <div class="footer__column">',
    '        <h4 class="footer__column-title">Услуги</h4>',
    '        <ul class="footer__list">',
    '          <li><a href="service.html">Выездная консультация</a></li>',
    '          <li><a href="service.html">Доставка и установка</a></li>',
    '        </ul>',
    '      </div>',
    '      <div class="footer__column">',
    '        <h4 class="footer__column-title">Информация</h4>',
    '        <ul class="footer__list">',
    '          <li><a href="#">Оплата и гарантия</a></li>',
    '          <li><a href="#">Советы и рекомендации</a></li>',
    '          <li><a href="#">Дизайнерам</a></li>',
    '          <li><a href="#">Партнёрам</a></li>',
    '          <li><a href="contacts.html">Адреса салонов</a></li>',
    '          <li><a href="contacts.html">Контакты</a></li>',
    '        </ul>',
    '      </div>',
    '    </div>',
    '  </div>',
    '  <div class="footer__divider"></div>',
    '</footer>'
  ].join('\n');

  function initSearch() {
    document.body.insertAdjacentHTML('beforeend', SEARCH_OVERLAY_HTML);
    var overlay  = document.getElementById('search-overlay');
    var input    = document.getElementById('search-input');
    var results  = document.getElementById('search-results');
    var closeBtn = document.getElementById('search-close');
    var openBtn  = document.getElementById('header-search-btn');

    function escHtml(s) {
      return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function renderResults(query) {
      var q = query.trim().toLowerCase();
      if (!q) {
        results.innerHTML = '';
        results.hidden = true;
        return;
      }
      var matches = SEARCH_PRODUCTS.filter(function(p) {
        return p.title.toLowerCase().indexOf(q) !== -1 || p.desc.toLowerCase().indexOf(q) !== -1;
      });
      if (!matches.length) {
        results.innerHTML = '<li class="search-overlay__no-results">Ничего не найдено</li>';
        results.hidden = false;
        return;
      }
      results.innerHTML = matches.map(function(p) {
        return '<li class="search-overlay__item" role="option">' +
          '<a class="search-overlay__link" href="' + escHtml(p.url) + '">' +
            '<span class="search-overlay__item-title">' + escHtml(p.title) + '</span>' +
            '<span class="search-overlay__item-desc">' + escHtml(p.desc) + '</span>' +
          '</a>' +
        '</li>';
      }).join('');
      results.hidden = false;
    }

    function openSearch() {
      overlay.setAttribute('aria-hidden', 'false');
      document.documentElement.style.overflow = 'hidden';
      setTimeout(function() { input.focus(); }, 50);
    }

    function closeSearch() {
      overlay.setAttribute('aria-hidden', 'true');
      document.documentElement.style.overflow = '';
      input.value = '';
      results.innerHTML = '';
      results.hidden = true;
    }

    if (openBtn) openBtn.addEventListener('click', openSearch);
    if (closeBtn) closeBtn.addEventListener('click', closeSearch);
    var backdrop = overlay.querySelector('.search-overlay__backdrop');
    if (backdrop) backdrop.addEventListener('click', closeSearch);
    input.addEventListener('input', function() { renderResults(input.value); });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.getAttribute('aria-hidden') === 'false') closeSearch();
    });
  }

  function formatPhone(raw) {
    var digits = raw.replace(/\D/g, '');
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    if (!digits.startsWith('7')) digits = '7' + digits;
    digits = digits.slice(0, 11);
    var result = '+7';
    if (digits.length > 1) result += ' (' + digits.slice(1, 4);
    if (digits.length >= 4) result += ')';
    if (digits.length > 4) result += ' ' + digits.slice(4, 7);
    if (digits.length > 7) result += '-' + digits.slice(7, 9);
    if (digits.length > 9) result += '-' + digits.slice(9, 11);
    return result;
  }

  function initCallModal() {
    document.body.insertAdjacentHTML('beforeend', CALL_MODAL_HTML);
    var modal    = document.getElementById('call-modal');
    var closeBtn = document.getElementById('call-modal-close');
    var openBtn  = document.getElementById('header-callback-btn');
    var form     = document.getElementById('call-modal-form');
    var phoneInput = document.getElementById('call-phone');
    var successEl  = document.getElementById('call-modal-success');

    function openCallModal() {
      if (successEl) successEl.hidden = true;
      if (form) form.hidden = false;
      var errEl = modal.querySelector('.call-modal__error');
      if (errEl) errEl.textContent = '';
      modal.setAttribute('aria-hidden', 'false');
      document.documentElement.style.overflow = 'hidden';
      setTimeout(function() {
        var nameInput = document.getElementById('call-name');
        if (nameInput) nameInput.focus();
      }, 50);
    }

    function closeCallModal() {
      modal.setAttribute('aria-hidden', 'true');
      document.documentElement.style.overflow = '';
    }

    if (openBtn) openBtn.addEventListener('click', openCallModal);
    if (closeBtn) closeBtn.addEventListener('click', closeCallModal);
    var backdrop = modal.querySelector('.call-modal__backdrop');
    if (backdrop) backdrop.addEventListener('click', closeCallModal);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeCallModal();
    });

    if (phoneInput) {
      phoneInput.addEventListener('input', function() {
        var pos = phoneInput.selectionStart;
        var prev = phoneInput.value;
        var formatted = formatPhone(phoneInput.value);
        phoneInput.value = formatted;
        // restore cursor approximately
        if (formatted.length > prev.length) phoneInput.selectionStart = phoneInput.selectionEnd = formatted.length;
        else phoneInput.selectionStart = phoneInput.selectionEnd = Math.min(pos, formatted.length);
      });
      phoneInput.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace') {
          var val = phoneInput.value;
          // Remove trailing non-digit
          var pos = phoneInput.selectionStart;
          if (pos > 0 && !/\d/.test(val[pos-1])) {
            e.preventDefault();
            phoneInput.value = val.slice(0, pos-1) + val.slice(pos);
            phoneInput.selectionStart = phoneInput.selectionEnd = pos-1;
          }
        }
      });
      phoneInput.addEventListener('focus', function() {
        if (!phoneInput.value) phoneInput.value = '+7 (';
      });
    }

    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var nameVal  = (document.getElementById('call-name') || {}).value || '';
        var phoneVal = phoneInput ? phoneInput.value : '';
        var errEl    = modal.querySelector('.call-modal__error');
        if (!nameVal.trim()) { if (errEl) errEl.textContent = 'Введите имя'; return; }
        var digits = phoneVal.replace(/\D/g, '');
        if (digits.length < 11) { if (errEl) errEl.textContent = 'Введите корректный номер телефона'; return; }
        if (errEl) errEl.textContent = '';
        if (form) form.hidden = true;
        if (successEl) successEl.hidden = false;
        setTimeout(closeCallModal, 3000);
      });
    }
  }

  function insertHeader() {
    document.body.insertAdjacentHTML('afterbegin', HEADER_HTML);
    if (window.DvAuth) {
      DvAuth.updateHeaderUI();
      DvAuth.initAuthModal();
    }
    initSearch();
    initCallModal();
    document.dispatchEvent(new CustomEvent('headerReady'));
  }

  function insertFooter() {
    var m = document.querySelector('main');
    (m || document.body).insertAdjacentHTML(m ? 'afterend' : 'beforeend', FOOTER_HTML);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      insertHeader();
      insertFooter();
    });
  } else {
    insertHeader();
    insertFooter();
  }
}());
