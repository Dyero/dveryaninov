/* Load header and footer on all pages.
   HTML is embedded as strings — works on file:// and any HTTP server without CORS issues. */
(function () {
  var HEADER_HTML = [
    '<header class="header">',
    '  <div class="header__level header__level_1">',
    '    <div class="header__top-row">',
    '      <div class="header__location">',
    '        <img src="images/icon-location.svg" alt="" width="24" height="24" class="header__icon-img">',
    '        <span class="header__city">Новочебоксарск</span>',
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
    '    <button type="button" class="header__burger" id="mobile-menu-open" aria-label="Открыть меню" aria-expanded="false">',
    '      <img src="images/Burger.svg" alt="" width="24" height="36">',
    '    </button>',
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
    '    <a href="tel:88005508869" class="header__phone-icon" aria-label="Позвонить">',
    '      <img src="images/Phone.svg" alt="" width="24" height="25">',
    '    </a>',
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

  var MOBILE_MENU_HTML = [
    '<div class="mob-menu" id="mob-menu" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Меню">',
    '  <div class="mob-panel mob-panel_active" id="mob-panel-main">',
    '    <div class="mob-panel__head">',
    '      <span></span>',
    '      <button class="mob-panel__close" id="mob-menu-close" aria-label="Закрыть">',
    '        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" stroke-width="1.5"/><line x1="15" y1="1" x2="1" y2="15" stroke="currentColor" stroke-width="1.5"/></svg>',
    '      </button>',
    '    </div>',
    '    <div class="mob-menu__city">',
    '      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1C4.79 1 3 2.79 3 5c0 3 4 8 4 8s4-5 4-8c0-2.21-1.79-4-4-4z" stroke="currentColor" stroke-width="1.2" fill="none"/><circle cx="7" cy="5" r="1.2" fill="currentColor"/></svg>',
    '      <span>Чебоксары</span>',
    '    </div>',
    '    <nav class="mob-nav">',
    '      <button class="mob-nav__item mob-nav__item_arrow" data-panel="catalog">Каталог<svg class="mob-nav__chevron" width="7" height="12" viewBox="0 0 7 12"><path d="M1 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg></button>',
    '      <a class="mob-nav__item" href="collections.html">Коллекции</a>',
    '      <button class="mob-nav__item mob-nav__item_arrow" data-panel="services">Услуги<svg class="mob-nav__chevron" width="7" height="12" viewBox="0 0 7 12"><path d="M1 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg></button>',
    '      <a class="mob-nav__item" href="about.html">О компании</a>',
    '      <a class="mob-nav__item" href="#">Блог</a>',
    '      <a class="mob-nav__item" href="#">Проекты</a>',
    '      <a class="mob-nav__item" href="contacts.html">Адреса салонов</a>',
    '      <a class="mob-nav__item" href="contacts.html">Контакты</a>',
    '    </nav>',
    '    <div class="mob-menu__footer">',
    '      <button class="mob-menu__cta" id="mob-callback-btn" type="button">ЗАКАЗАТЬ ЗВОНОК</button>',
    '      <div class="mob-menu__contacts">',
    '        <p class="mob-menu__contacts-label">СВЯЗАТЬСЯ С НАМИ</p>',
    '        <a class="mob-menu__phone" href="tel:88005508869">8 800 550-88-69</a>',
    '        <p class="mob-menu__hours">с 08:00 до 17:00 по МСК</p>',
    '        <p class="mob-menu__email-label">По всем вопросам</p>',
    '        <a class="mob-menu__email" href="mailto:info@dveryaninov.ru">info@dveryaninov.ru</a>',
    '      </div>',
    '      <div class="mob-menu__social">',
    '        <a href="#" class="mob-menu__social-link" aria-label="VКонтакте">',
    '          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" stroke="#e0ddda"/><path d="M22.8 11.8c.1-.4 0-.7-.5-.7h-1.7c-.4 0-.6.2-.7.5 0 0-.8 2-2 3.4-.4.4-.5.5-.7.5-.1 0-.2-.1-.2-.5v-3.2c0-.4-.1-.5-.5-.5H14c-.3 0-.5.2-.5.5 0 .5.7.6.8 1.9v2.9c0 .5-.1.6-.3.6-.5 0-1.8-2-2.5-4.3-.2-.4-.4-.6-.8-.6H9c-.5 0-.6.2-.6.5 0 .5.5 2.9 2.4 6.1 1.3 2.2 3.1 3.4 4.7 3.4 1 0 1.1-.2 1.1-.6v-1.5c0-.5.1-.6.4-.6.3 0 .7.1 1.8 1.2 1.2 1.2 1.4 1.7 2.1 1.7h1.7c.5 0 .7-.2.6-.7-.2-.5-.6-1.1-1.2-1.8-.3-.4-.8-.9-1-1.1-.2-.3-.2-.4 0-.7 0 0 1.9-2.7 2.1-3.7z" fill="#4a4a4a"/></svg>',
    '        </a>',
    '      </div>',
    '    </div>',
    '  </div>',
    '  <div class="mob-panel" id="mob-panel-catalog">',
    '    <div class="mob-panel__head">',
    '      <button class="mob-panel__back" data-back="main" aria-label="Назад"><svg width="8" height="14" viewBox="0 0 8 14"><path d="M7 1L1 7l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg></button>',
    '      <span class="mob-panel__title">Каталог</span>',
    '      <button class="mob-panel__close" aria-label="Закрыть"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" stroke-width="1.5"/><line x1="15" y1="1" x2="1" y2="15" stroke="currentColor" stroke-width="1.5"/></svg></button>',
    '    </div>',
    '    <div class="mob-panel__search">',
    '      <input type="search" class="mob-search-input" placeholder="Поиск по каталогу" id="mob-catalog-search">',
    '    </div>',
    '    <nav class="mob-nav">',
    '      <button class="mob-nav__item mob-nav__item_arrow" data-panel="doors">Межкомнатные двери<svg class="mob-nav__chevron" width="7" height="12" viewBox="0 0 7 12"><path d="M1 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg></button>',
    '      <a class="mob-nav__item" href="#">Скрытые двери</a>',
    '      <a class="mob-nav__item" href="#">Перегородки</a>',
    '      <a class="mob-nav__item" href="catalog.html?cat=hardware">Фурнитура</a>',
    '    </nav>',
    '  </div>',
    '  <div class="mob-panel" id="mob-panel-doors">',
    '    <div class="mob-panel__head">',
    '      <button class="mob-panel__back" data-back="catalog" aria-label="Назад"><svg width="8" height="14" viewBox="0 0 8 14"><path d="M7 1L1 7l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg></button>',
    '      <span class="mob-panel__title">Межкомнатные двери</span>',
    '      <button class="mob-panel__close" aria-label="Закрыть"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" stroke-width="1.5"/><line x1="15" y1="1" x2="1" y2="15" stroke="currentColor" stroke-width="1.5"/></svg></button>',
    '    </div>',
    '    <nav class="mob-nav">',
    '      <a class="mob-nav__item" href="catalog.html?style=modern">Современные</a>',
    '      <a class="mob-nav__item" href="catalog.html?style=classic">Классические</a>',
    '      <a class="mob-nav__item" href="catalog.html?style=neoclassic">Неоклассика</a>',
    '      <a class="mob-nav__item" href="catalog.html?style=design">Дизайнерские</a>',
    '      <a class="mob-nav__item" href="catalog.html">Все двери</a>',
    '    </nav>',
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
    { title: 'Аврора 1', url: 'product-avrora-1.html' },
    { title: 'Аврора 2', url: 'product-avrora-2.html' },
    { title: 'Аврора 3', url: 'product-avrora-3.html' },
    { title: 'Аврора 4', url: 'product-avrora-4.html' },
    { title: 'Аврора 5', url: 'product-avrora-5.html' },
    { title: 'Альберта 1', url: 'product-alberta-1.html' },
    { title: 'Альберта 2', url: 'product-alberta-2.html' },
    { title: 'Альберта 3', url: 'product-alberta-3.html' },
    { title: 'Альберта 4', url: 'product-alberta-4.html' },
    { title: 'Альберта 5', url: 'product-alberta-5.html' },
    { title: 'Альберта 6', url: 'product-alberta-6.html' },
    { title: 'Альберта 7', url: 'product-alberta-7.html' },
    { title: 'Амери 1', url: 'product-ameri-1.html' },
    { title: 'Амери 10', url: 'product-ameri-10.html' },
    { title: 'Амери 2', url: 'product-ameri-2.html' },
    { title: 'Амери 3', url: 'product-ameri-3.html' },
    { title: 'Амери 4', url: 'product-ameri-4.html' },
    { title: 'Амери 5', url: 'product-ameri-5.html' },
    { title: 'Амери 6', url: 'product-ameri-6.html' },
    { title: 'Амери 7', url: 'product-ameri-7.html' },
    { title: 'Амери 8', url: 'product-ameri-8.html' },
    { title: 'Амери 9', url: 'product-ameri-9.html' },
    { title: 'Амфора 1', url: 'product-amfora-1.html' },
    { title: 'Амфора 2', url: 'product-amfora-2.html' },
    { title: 'Амфора 3', url: 'product-amfora-3.html' },
    { title: 'Амфора 4', url: 'product-amfora-4.html' },
    { title: 'Амфора 5', url: 'product-amfora-5.html' },
    { title: 'Амфора 6', url: 'product-amfora-6.html' },
    { title: 'Амфора 7', url: 'product-amfora-7.html' },
    { title: 'Амфора 8', url: 'product-amfora-8.html' },
    { title: 'Амфора 9', url: 'product-amfora-9.html' },
    { title: 'Белуни 1', url: 'product-beluni-1.html' },
    { title: 'Белуни 2', url: 'product-beluni-2.html' },
    { title: 'Белуни 3', url: 'product-beluni-3.html' },
    { title: 'Белуни 4', url: 'product-beluni-4.html' },
    { title: 'Белуни 5', url: 'product-beluni-5.html' },
    { title: 'Белуни 6', url: 'product-beluni-6.html' },
    { title: 'Белуни 7', url: 'product-beluni-7.html' },
    { title: 'Белуни 8', url: 'product-beluni-8.html' },
    { title: 'Бланк 1', url: 'product-blank-1.html' },
    { title: 'Бланк 2', url: 'product-blank-2.html' },
    { title: 'Бланк 3', url: 'product-blank-3.html' },
    { title: 'Бланк 4', url: 'product-blank-4.html' },
    { title: 'Бланк 5', url: 'product-blank-5.html' },
    { title: 'Бона 1', url: 'product-bona-1.html' },
    { title: 'Бона 2', url: 'product-bona-2.html' },
    { title: 'Бона 3', url: 'product-bona-3.html' },
    { title: 'Бона 4', url: 'product-bona-4.html' },
    { title: 'Бона 5', url: 'product-bona-5.html' },
    { title: 'Бона 6', url: 'product-bona-6.html' },
    { title: 'Бонеко 1', url: 'product-boneko-1.html' },
    { title: 'Бонеко 2', url: 'product-boneko-2.html' },
    { title: 'Бонеко 3', url: 'product-boneko-3.html' },
    { title: 'Бонеко 4', url: 'product-boneko-4.html' },
    { title: 'Бонеко 5', url: 'product-boneko-5.html' },
    { title: 'Бонеко 6', url: 'product-boneko-6.html' },
    { title: 'Вектор 1', url: 'product-vektor-1.html' },
    { title: 'Вектор 10', url: 'product-vektor-10.html' },
    { title: 'Вектор 11', url: 'product-vektor-11.html' },
    { title: 'Вектор 2', url: 'product-vektor-2.html' },
    { title: 'Вектор 3', url: 'product-vektor-3.html' },
    { title: 'Вектор 4', url: 'product-vektor-4.html' },
    { title: 'Вектор 5', url: 'product-vektor-5.html' },
    { title: 'Вектор 6', url: 'product-vektor-6.html' },
    { title: 'Вектор 7', url: 'product-vektor-7.html' },
    { title: 'Вектор 8', url: 'product-vektor-8.html' },
    { title: 'Вектор 9', url: 'product-vektor-9.html' },
    { title: 'Верто 1', url: 'product-verto-1.html' },
    { title: 'Верто 10', url: 'product-verto-10.html' },
    { title: 'Верто 2', url: 'product-verto-2.html' },
    { title: 'Верто 3', url: 'product-verto-3.html' },
    { title: 'Верто 4', url: 'product-verto-4.html' },
    { title: 'Верто 5', url: 'product-verto-5.html' },
    { title: 'Верто 6', url: 'product-verto-6.html' },
    { title: 'Верто 7', url: 'product-verto-7.html' },
    { title: 'Верто 8', url: 'product-verto-8.html' },
    { title: 'Верто 9', url: 'product-verto-9.html' },
    { title: 'Витра 1', url: 'product-vitra-1.html' },
    { title: 'Витра 2', url: 'product-vitra-2.html' },
    { title: 'Витра 3', url: 'product-vitra-3.html' },
    { title: 'Витра 4', url: 'product-vitra-4.html' },
    { title: 'Витра 5', url: 'product-vitra-5.html' },
    { title: 'Витра 6', url: 'product-vitra-6.html' },
    { title: 'Витра 7', url: 'product-vitra-7.html' },
    { title: 'Д14', url: 'product-d14.html' },
    { title: 'Д16', url: 'product-d16.html' },
    { title: 'Д17', url: 'product-d17.html' },
    { title: 'Д22', url: 'product-d22.html' },
    { title: 'Д36', url: 'product-d36.html' },
    { title: 'Д4', url: 'product-d4.html' },
    { title: 'Д43', url: 'product-d43.html' },
    { title: 'Д44', url: 'product-d44.html' },
    { title: 'Д48', url: 'product-d48.html' },
    { title: 'Д49', url: 'product-d49.html' },
    { title: 'Д50', url: 'product-d50.html' },
    { title: 'Декар 1', url: 'product-dekar-1.html' },
    { title: 'Декар 2', url: 'product-dekar-2.html' },
    { title: 'Декар 3', url: 'product-dekar-3.html' },
    { title: 'Декар 4', url: 'product-dekar-4.html' },
    { title: 'Декар 5', url: 'product-dekar-5.html' },
    { title: 'Декар с багетом 1', url: 'product-dekar-s-bagetom-1.html' },
    { title: 'Декар с багетом 2', url: 'product-dekar-s-bagetom-2.html' },
    { title: 'Декар с багетом 3', url: 'product-dekar-s-bagetom-3.html' },
    { title: 'Декар с багетом 4', url: 'product-dekar-s-bagetom-4.html' },
    { title: 'Декар с багетом 5', url: 'product-dekar-s-bagetom-5.html' },
    { title: 'Кант 1', url: 'product-kant-1.html' },
    { title: 'Кант 2', url: 'product-kant-2.html' },
    { title: 'Кант 3', url: 'product-kant-3.html' },
    { title: 'Кант 4', url: 'product-kant-4.html' },
    { title: 'Кант 5', url: 'product-kant-5.html' },
    { title: 'Каскад 1', url: 'product-kaskad-1.html' },
    { title: 'Каскад 2', url: 'product-kaskad-2.html' },
    { title: 'Каскад 3', url: 'product-kaskad-3.html' },
    { title: 'Каскад 4', url: 'product-kaskad-4.html' },
    { title: 'Каскад 5', url: 'product-kaskad-5.html' },
    { title: 'Квант 1', url: 'product-kvant-1.html' },
    { title: 'Квант 2', url: 'product-kvant-2.html' },
    { title: 'Квант 3', url: 'product-kvant-3.html' },
    { title: 'Квант 4', url: 'product-kvant-4.html' },
    { title: 'Мета 1', url: 'product-meta-1.html' },
    { title: 'Мета 2', url: 'product-meta-2.html' },
    { title: 'Мета 3', url: 'product-meta-3.html' },
    { title: 'Мета 4', url: 'product-meta-4.html' },
    { title: 'Мета 5', url: 'product-meta-5.html' },
    { title: 'Миура 1', url: 'product-miura-1.html' },
    { title: 'Миура 2', url: 'product-miura-2.html' },
    { title: 'Миура 3', url: 'product-miura-3.html' },
    { title: 'Миура 4', url: 'product-miura-4.html' },
    { title: 'Миура 5', url: 'product-miura-5.html' },
    { title: 'Модена 1', url: 'product-modena-1.html' },
    { title: 'Модена 2', url: 'product-modena-2.html' },
    { title: 'Модена 3', url: 'product-modena-3.html' },
    { title: 'Модена 4', url: 'product-modena-4.html' },
    { title: 'Модена 5', url: 'product-modena-5.html' },
    { title: 'Моно 1', url: 'product-mono-1.html' },
    { title: 'Моно 10', url: 'product-mono-10.html' },
    { title: 'Моно 11', url: 'product-mono-11.html' },
    { title: 'Моно 12', url: 'product-mono-12.html' },
    { title: 'Моно 2', url: 'product-mono-2.html' },
    { title: 'Моно 3', url: 'product-mono-3.html' },
    { title: 'Моно 4', url: 'product-mono-4.html' },
    { title: 'Моно 5', url: 'product-mono-5.html' },
    { title: 'Моно 6', url: 'product-mono-6.html' },
    { title: 'Моно 7', url: 'product-mono-7.html' },
    { title: 'Моно 8', url: 'product-mono-8.html' },
    { title: 'Моно 9', url: 'product-mono-9.html' },
    { title: 'Нео 1', url: 'product-neo-1.html' },
    { title: 'Нео 2', url: 'product-neo-2.html' },
    { title: 'Нео 3', url: 'product-neo-3.html' },
    { title: 'Нео 4', url: 'product-neo-4.html' },
    { title: 'Нео 5', url: 'product-neo-5.html' },
    { title: 'Нео 6', url: 'product-neo-6.html' },
    { title: 'Оазис 1', url: 'product-oazis-1.html' },
    { title: 'Оазис 2', url: 'product-oazis-2.html' },
    { title: 'Оазис 3', url: 'product-oazis-3.html' },
    { title: 'Оазис 4', url: 'product-oazis-4.html' },
    { title: 'Оазис 5', url: 'product-oazis-5.html' },
    { title: 'Палладио 1', url: 'product-palladio-1.html' },
    { title: 'Палладио 2', url: 'product-palladio-2.html' },
    { title: 'Палладио 3', url: 'product-palladio-3.html' },
    { title: 'Палладио 4', url: 'product-palladio-4.html' },
    { title: 'Палладио 5', url: 'product-palladio-5.html' },
    { title: 'Палладио 6', url: 'product-palladio-6.html' },
    { title: 'Плиссе', url: 'product-plisse.html' },
    { title: 'Плиссе 1', url: 'product-plisse-1.html' },
    { title: 'Плиссе 2', url: 'product-plisse-2.html' },
    { title: 'Плиссе 3', url: 'product-plisse-3.html' },
    { title: 'Терра 1', url: 'product-terra-1.html' },
    { title: 'Терра 2', url: 'product-terra-2.html' },
    { title: 'Терра 3', url: 'product-terra-3.html' },
    { title: 'Терра 4', url: 'product-terra-4.html' },
    { title: 'Терра 5', url: 'product-terra-5.html' },
    { title: 'Ультра 1', url: 'product-ultra-1.html' },
    { title: 'Ультра 2', url: 'product-ultra-2.html' },
    { title: 'Ультра 3', url: 'product-ultra-3.html' },
    { title: 'Ультра 4', url: 'product-ultra-4.html' },
    { title: 'Ультра 5', url: 'product-ultra-5.html' },
    { title: 'Флай 1', url: 'product-flaj-1.html' },
    { title: 'Флай 2', url: 'product-flaj-2.html' },
    { title: 'Флай 3', url: 'product-flaj-3.html' },
    { title: 'Флай 4', url: 'product-flaj-4.html' },
    { title: 'Флай 5', url: 'product-flaj-5.html' },
    { title: 'Флай 6', url: 'product-flaj-6.html' },
    { title: 'Флай 7', url: 'product-flaj-7.html' },
    { title: 'Флай 8', url: 'product-flaj-8.html' },
    { title: 'Форм 1', url: 'product-form-1.html' },
    { title: 'Форм 2', url: 'product-form-2.html' },
    { title: 'Форм 3', url: 'product-form-3.html' },
    { title: 'Форм 4', url: 'product-form-4.html' },
    { title: 'Форм 5', url: 'product-form-5.html' },
    { title: 'Этерна 1', url: 'product-eterna-1.html' },
    { title: 'Этерна 2', url: 'product-eterna-2.html' },
    { title: 'Этерна 3', url: 'product-eterna-3.html' },
    { title: 'Этерна 4', url: 'product-eterna-4.html' },
    { title: 'Этерна 5', url: 'product-eterna-5.html' }
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
    '        <a class="footer__email" href="mailto:info@dveryaninov.ru">info@dveryaninov.ru</a>',
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
    var overlay  = document.querySelector('#search-overlay');
    var input    = document.querySelector('#search-input');
    var results  = document.querySelector('#search-results');
    var closeBtn = document.querySelector('#search-close');
    var openBtn  = document.querySelector('#header-search-btn');

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
        return p.title.toLowerCase().indexOf(q) !== -1;
      });
      if (!matches.length) {
        results.innerHTML = '<li class="search-overlay__no-results">Ничего не найдено</li>';
        results.hidden = false;
        return;
      }
      var shown = matches.slice(0, 12);
      results.innerHTML = shown.map(function(p) {
        return '<li class="search-overlay__item" role="option">' +
          '<a class="search-overlay__link" href="' + escHtml(p.url) + '">' +
            '<span class="search-overlay__item-title">' + escHtml(p.title) + '</span>' +
            '<span class="search-overlay__item-desc">Межкомнатная дверь</span>' +
          '</a>' +
        '</li>';
      }).join('') + (matches.length > 12 ? '<li class="search-overlay__no-results">и ещё ' + (matches.length - 12) + ' результатов…</li>' : '');
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
    var modal    = document.querySelector('#call-modal');
    var closeBtn = document.querySelector('#call-modal-close');
    var openBtn  = document.querySelector('#header-callback-btn');
    var form     = document.querySelector('#call-modal-form');
    var phoneInput = document.querySelector('#call-phone');
    var successEl  = document.querySelector('#call-modal-success');

    function openCallModal() {
      if (successEl) successEl.hidden = true;
      if (form) form.hidden = false;
      var errEl = modal.querySelector('.call-modal__error');
      if (errEl) errEl.textContent = '';
      modal.setAttribute('aria-hidden', 'false');
      document.documentElement.style.overflow = 'hidden';
      setTimeout(function() {
        var nameInput = document.querySelector('#call-name');
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
        var nameVal  = (document.querySelector('#call-name') || {}).value || '';
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

  function initMobileMenu() {
    document.body.insertAdjacentHTML('beforeend', MOBILE_MENU_HTML);
    var menu    = document.getElementById('mob-menu');
    var openBtn = document.getElementById('mobile-menu-open');
    if (!menu) return;

    function openMenu() {
      menu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      showPanel('main');
    }

    function closeMenu() {
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(function() {
        var panels = document.querySelectorAll('.mob-panel');
        panels.forEach(function(p) {
          p.classList.remove('mob-panel_active', 'mob-panel_behind');
        });
        document.getElementById('mob-panel-main').classList.add('mob-panel_active');
      }, 300);
    }

    function showPanel(name) {
      var panels = document.querySelectorAll('.mob-panel');
      var target = document.getElementById('mob-panel-' + name);
      if (!target) return;
      panels.forEach(function(p) {
        if (p === target) {
          p.classList.remove('mob-panel_behind');
          p.classList.add('mob-panel_active');
        } else if (p.classList.contains('mob-panel_active')) {
          p.classList.add('mob-panel_behind');
          p.classList.remove('mob-panel_active');
        }
      });
    }

    function goBack(targetName) {
      var panels = document.querySelectorAll('.mob-panel');
      var target = document.getElementById('mob-panel-' + targetName);
      if (!target) return;
      panels.forEach(function(p) {
        if (p === target) {
          p.classList.remove('mob-panel_behind');
          p.classList.add('mob-panel_active');
        } else if (p.classList.contains('mob-panel_active')) {
          p.classList.remove('mob-panel_active', 'mob-panel_behind');
        }
      });
    }

    if (openBtn) openBtn.addEventListener('click', openMenu);

    menu.querySelectorAll('.mob-panel__close').forEach(function(btn) {
      btn.addEventListener('click', closeMenu);
    });

    var mobCallbackBtn = document.getElementById('mob-callback-btn');
    if (mobCallbackBtn) {
      mobCallbackBtn.addEventListener('click', function() {
        closeMenu();
        var callModal = document.getElementById('call-modal');
        if (callModal) {
          callModal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
      });
    }

    menu.querySelectorAll('[data-panel]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        showPanel(this.getAttribute('data-panel'));
      });
    });

    menu.querySelectorAll('[data-back]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        goBack(this.getAttribute('data-back'));
      });
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menu.getAttribute('aria-hidden') === 'false') {
        closeMenu();
      }
    });
  }

  function insertHeader() {
    document.body.insertAdjacentHTML('afterbegin', HEADER_HTML);
    if (window.DvAuth) {
      DvAuth.updateHeaderUI();
      DvAuth.initAuthModal();
    }
    initSearch();
    initCallModal();
    initMobileMenu();
    document.dispatchEvent(new CustomEvent('headerReady'));
  }

  /* ===== НИЖНЕЕ МОБИЛЬНОЕ МЕНЮ ===== */
  var BOTTOM_NAV_HTML = [
    '<nav class="bottom-nav" aria-label="Мобильная навигация">',
    '  <a href="index.html" class="bottom-nav__item">',
    '    <img src="images/Main%20logo%20menu.svg" alt="" class="bottom-nav__icon" width="26" height="26">',
    '    <span class="bottom-nav__label">Главная</span>',
    '  </a>',
    '  <a href="catalog.html" class="bottom-nav__item">',
    '    <img src="images/Catalog%20menu.svg" alt="" class="bottom-nav__icon" width="26" height="25">',
    '    <span class="bottom-nav__label">Каталог</span>',
    '  </a>',
    '  <a href="wishlist.html" class="bottom-nav__item">',
    '    <svg class="bottom-nav__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/></svg>',
    '    <span class="bottom-nav__label">Избранное</span>',
    '  </a>',
    '  <a href="cart.html" class="bottom-nav__item">',
    '    <svg class="bottom-nav__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 14H6V8h2v2h2V8h4v2h2V8h2v10z" fill="currentColor"/></svg>',
    '    <span class="bottom-nav__label">Корзина</span>',
    '  </a>',
    '</nav>'
  ].join('\n');

  function insertBottomNav() {
    document.body.insertAdjacentHTML('beforeend', BOTTOM_NAV_HTML);
    // Подсветка текущей страницы
    var path = location.pathname.replace(/^.*\//, '');
    var items = document.querySelectorAll('.bottom-nav__item');
    items.forEach(function(item) {
      var href = item.getAttribute('href');
      if (path === href || (path === '' && href === 'index.html')) {
        item.classList.add('is-active');
      }
    });
  }

  function insertFooter() {
    var m = document.querySelector('#main');
    (m || document.body).insertAdjacentHTML(m ? 'afterend' : 'beforeend', FOOTER_HTML);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      insertHeader();
      insertFooter();
      insertBottomNav();
    });
  } else {
    insertHeader();
    insertFooter();
    insertBottomNav();
  }
}());
