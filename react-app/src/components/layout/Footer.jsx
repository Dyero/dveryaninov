import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <Link to="/">
            <img className="footer__logo" src="/images/logo-footer.svg" alt="Дверянинов" width="266" height="81" />
          </Link>
          <div className="footer__contact">
            <a className="footer__phone" href="tel:88005508869">8 800 550-88-69</a>
            <p className="footer__hours">с 08:00 до 17:00 по МСК</p>
          </div>
          <div className="footer__social">
            <p className="footer__social-title">Присоединяйтесь</p>
            <div className="footer__social-links"></div>
          </div>
          <div className="footer__email-block">
            <p className="footer__label">По всем вопросам</p>
            <a className="footer__email" href="mailto:design@dveryaninov.ru">design@dveryaninov.ru</a>
          </div>
        </div>
        <div className="footer__columns">
          <div className="footer__column">
            <h4 className="footer__column-title">Каталог</h4>
            <ul className="footer__list">
              <li><Link to="/catalog">Межкомнатные двери</Link></li>
              <li><Link to="/catalog">Входные двери</Link></li>
              <li><Link to="/catalog">Скрытые двери</Link></li>
              <li><Link to="/catalog">Декоративные рейки</Link></li>
              <li><Link to="/catalog">Стеновые панели</Link></li>
              <li><Link to="/catalog">Фурнитура</Link></li>
            </ul>
          </div>
          <div className="footer__column">
            <h4 className="footer__column-title">Услуги</h4>
            <ul className="footer__list">
              <li><Link to="/service">Выездная консультация</Link></li>
              <li><Link to="/service">Доставка и установка</Link></li>
            </ul>
          </div>
          <div className="footer__column">
            <h4 className="footer__column-title">Информация</h4>
            <ul className="footer__list">
              <li><Link to="/info">Оплата и гарантия</Link></li>
              <li><Link to="/info">Советы и рекомендации</Link></li>
              <li><Link to="/info">Дизайнерам</Link></li>
              <li><Link to="/partners">Партнёрам</Link></li>
              <li><Link to="/contacts">Адреса салонов</Link></li>
              <li><Link to="/contacts">Контакты</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer__divider"></div>
      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Дверянинов. Все права защищены.</p>
      </div>
    </footer>
  );
}
