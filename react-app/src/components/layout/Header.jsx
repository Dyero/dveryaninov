import { Link, useLocation } from "react-router-dom";

export default function Header({ onOpenCall, onOpenAuth, onOpenSearch }) {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header__level header__level_1">
        <div className="header__top-row">
          <div className="header__location">
            <img src="/images/icon-location.svg" alt="" width="24" height="24" className="header__icon-img" />
            <span className="header__city">Чебоксары</span>
          </div>
          <Link className="header__link" to="/contacts">Адреса салонов</Link>
          <Link className="header__link" to="/about">О компании</Link>
          <Link className="header__link" to="/contacts">Контакты</Link>
          <div className="header__right">
            <Link className="header__link" to="/blog">Блог</Link>
            <Link className="header__link" to="/projects">Проекты</Link>
            <button type="button" className="header__topbar-callback" onClick={onOpenCall}>Заказать звонок</button>
          </div>
        </div>
      </div>
      <div className="header__level header__level_2">
        <nav className="header__nav">
          <Link className="header__nav-item" to="/catalog">Каталог</Link>
          <Link className="header__nav-item" to="/service">Услуги</Link>
          <Link className="header__nav-item" to="/partners">Партнёрам</Link>
        </nav>
        <Link className="header__logo" to="/">
          <img src="/images/logo.svg" alt="Дверянинов" width="196" height="59" />
        </Link>
        <div className="header__actions">
          <a className="header__phone" href="tel:88005508869">8 800 550-88-69</a>
          <Link to="/wishlist" id="header-wishlist-btn" className="header__icon-btn" aria-label="Избранное" style={{ position: "relative" }}>
            <img src="/images/icon-heart.svg" alt="" width="24" height="24" />
          </Link>
          <Link to="/cart" className="header__icon-btn" aria-label="Корзина">
            <img src="/images/icon-bag.svg" alt="" width="24" height="24" />
          </Link>
          <button type="button" className="header__icon-btn header__profile-btn" aria-label="Профиль" onClick={onOpenAuth}>
            <img src="/images/icon-user.svg" alt="" width="24" height="24" />
          </button>
          <button type="button" className="header__icon-btn header__search-btn" aria-label="Поиск" onClick={onOpenSearch}>
            <img src="/images/icon-search.svg" alt="" width="24" height="24" />
          </button>
        </div>
      </div>
    </header>
  );
}
