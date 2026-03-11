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
    '      <button type="button" class="header__icon-btn" aria-label="Избранное">',
    '        <img src="images/icon-heart.svg" alt="" width="24" height="24">',
    '      </button>',
    '      <a href="cart.html" class="header__icon-btn" aria-label="Корзина">',
    '        <img src="images/icon-bag.svg" alt="" width="24" height="24">',
    '      </a>',
    '      <button type="button" class="header__icon-btn header__profile-btn" aria-label="Профиль">',
    '        <img src="images/icon-user.svg" alt="" width="24" height="24">',
    '      </button>',
    '      <button type="button" class="header__icon-btn" aria-label="Поиск">',
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

  function insertHeader() {
    document.body.insertAdjacentHTML('afterbegin', HEADER_HTML);
    if (window.DvAuth) {
      DvAuth.updateHeaderUI();
      DvAuth.initAuthModal();
    }
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
