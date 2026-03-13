import { Link } from "react-router-dom";

export default function Catalog() {
  return (
    <main className="catalog-page">
      <nav className="breadcrumbs catalog-page__breadcrumbs" aria-label="Хлебные крошки">
        <Link className="breadcrumbs__link" to="/">Главная</Link>
        <span className="breadcrumbs__sep">–</span>
        <span className="breadcrumbs__current">Каталог</span>
      </nav>

      <h1 className="catalog-page__title">Каталог</h1>

      <section className="collections" aria-labelledby="collections-title">
        <div className="collections__head">
          <h2 className="collections__title" id="collections-title">Коллекции</h2>
        </div>

        <div className="collections__grid">
          <a className="collection-card" href="#catalog">
            <div className="collection-card__image-wrap">
              <img className="collection-card__image" src="/images/hero-bg.svg" alt="" width="720" height="420" />
            </div>
            <div className="collection-card__body">
              <h3 className="collection-card__title">Коллекция «Мета»</h3>
              <p className="collection-card__meta">12 моделей</p>
            </div>
          </a>

          <a className="collection-card" href="#catalog">
            <div className="collection-card__image-wrap">
              <img className="collection-card__image" src="/images/hero-bg.svg" alt="" width="720" height="420" />
            </div>
            <div className="collection-card__body">
              <h3 className="collection-card__title">Коллекция «Флай»</h3>
              <p className="collection-card__meta">10 моделей</p>
            </div>
          </a>

          <a className="collection-card" href="#catalog">
            <div className="collection-card__image-wrap">
              <img className="collection-card__image" src="/images/hero-bg.svg" alt="" width="720" height="420" />
            </div>
            <div className="collection-card__body">
              <h3 className="collection-card__title">Коллекция «Ультра»</h3>
              <p className="collection-card__meta">8 моделей</p>
            </div>
          </a>
        </div>
      </section>

      <section className="catalog" id="catalog" aria-labelledby="catalog-title">
        <div className="catalog__head">
          <h2 className="catalog__title" id="catalog-title">Общий каталог</h2>

          <div className="catalog__controls" aria-label="Фильтры каталога">
            <button className="catalog__chip catalog__chip_active" type="button">Межкомнатные</button>
            <button className="catalog__chip" type="button">Скрытые</button>
          </div>
        </div>

        <div className="section__cards section__cards_wrap catalog__grid">
          <article className="card">
            <div className="card__image-wrap">
              <img className="card__image" src="/images/card-door-1.svg" alt="Дверь Флай 8 ПГ" width="288" height="320" />
            </div>
            <span className="card__badge">Новинка</span>
            <h3 className="card__title"><Link to="/product/fly-8-pg">Дверь Флай 8 ПГ</Link></h3>
            <p className="card__price">от 58 600 ₽</p>
            <button type="button" className="card__action" aria-label="В корзину"></button>
          </article>

          <article className="card">
            <div className="card__image-wrap">
              <img className="card__image" src="/images/card-door-2.svg" alt="Дверь Ультра 5 ПГ" width="288" height="320" />
            </div>
            <span className="card__badge">Новинка</span>
            <h3 className="card__title"><Link to="/product/ultra-5-pg">Дверь Ультра 5 ПГ</Link></h3>
            <p className="card__price">от 63 200 ₽</p>
            <button type="button" className="card__action" aria-label="В корзину"></button>
          </article>

          <article className="card">
            <div className="card__image-wrap">
              <img className="card__image" src="/images/card-door-3.svg" alt="Дверь Мета 1 ПГ Престиж" width="288" height="320" />
            </div>
            <span className="card__badge">Новинка</span>
            <h3 className="card__title"><Link to="/product/meta-1-pg">Дверь Мета 1 ПГ Престиж</Link></h3>
            <p className="card__price">от 48 900 ₽</p>
            <button type="button" className="card__action" aria-label="В корзину"></button>
          </article>

          <article className="card">
            <div className="card__image-wrap">
              <img className="card__image" src="/images/card-door-4.svg" alt="Дверь Сол 2 ПГ" width="288" height="320" />
            </div>
            <span className="card__badge">Новинка</span>
            <h3 className="card__title"><Link to="/product/sol-2-pg">Дверь Сол 2 ПГ</Link></h3>
            <p className="card__price">от 52 000 ₽</p>
            <button type="button" className="card__action" aria-label="В корзину"></button>
          </article>
        </div>

        <div className="catalog__more">
          <button className="catalog__more-btn btn" type="button">Показать ещё</button>
        </div>
      </section>
    </main>
  );
}