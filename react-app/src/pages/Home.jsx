import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero__bg" role="img" aria-label=""></div>
        <div className="hero__content">
          <p className="hero__subtitle">Премиальные межкомнатные двери от фабрики</p>
          <h1 className="hero__title">Двери, которые приносят тишину, статус и уверенность в ваш дом</h1>
          <Link className="hero__btn btn" to="/catalog">Перейти в каталог</Link>
        </div>
      </section>

      <section className="section section_cards">
        <div className="section__cards section__cards_wrap">
          <article className="card">
            <div className="card__image-wrap">
              <img className="card__image" src="/images/card-door-1.svg" alt="Дверь Флай 8 ПГ" width="288" height="320" />
            </div>
            <span className="card__badge">Новинка</span>
            <h3 className="card__title"><Link to="/product/1">Дверь Флай 8 ПГ</Link></h3>
            <p className="card__price">от 58 600 ₽</p>
            <button type="button" className="card__action" aria-label="В корзину"></button>
          </article>
          <article className="card">
            <div className="card__image-wrap">
              <img className="card__image" src="/images/card-door-2.svg" alt="Дверь Ультра 5 ПГ" width="288" height="320" />
            </div>
            <span className="card__badge">Новинка</span>
            <h3 className="card__title"><Link to="/product/2">Дверь Ультра 5 ПГ</Link></h3>
            <p className="card__price">от 58 600 ₽</p>
            <button type="button" className="card__action" aria-label="В корзину"></button>
          </article>
          <article className="card">
            <div className="card__image-wrap">
              <img className="card__image" src="/images/card-door-3.svg" alt="Дверь Кант 5 ПО" width="288" height="320" />
            </div>
            <span className="card__badge">Новинка</span>
            <h3 className="card__title"><Link to="/product/3">Дверь Кант 5 ПО</Link></h3>
            <p className="card__price">от 58 600 ₽</p>
            <button type="button" className="card__action" aria-label="В корзину"></button>
          </article>
          <article className="card">
            <div className="card__image-wrap">
              <img className="card__image" src="/images/card-door-4.svg" alt="Дверь Терра 5 ПГ" width="288" height="320" />
            </div>
            <span className="card__badge">Новинка</span>
            <h3 className="card__title"><Link to="/product/4">Дверь Терра 5 ПГ</Link></h3>
            <p className="card__price">от 58 600 ₽</p>
            <button type="button" className="card__action" aria-label="В корзину"></button>
          </article>
        </div>
      </section>

      <section className="section section_in-stock">
        <div className="section__head">
          <h2 className="section__title">Двери в наличии</h2>
          <Link className="section__link" to="/catalog">Смотреть всё</Link>
        </div>
        <div className="section__cards">
          <article className="card">
            <div className="card__image-wrap">
              <img className="card__image" src="/images/card-placeholder.svg" alt="Дверь Флай 8 ПГ" width="288" height="320" />
            </div>
            <span className="card__badge">Новинка</span>
            <h3 className="card__title"><Link to="/product/1">Дверь Флай 8 ПГ</Link></h3>
            <p className="card__price">от 58 600 ₽</p>
            <button type="button" className="card__action" aria-label="В корзину"></button>
          </article>
          <article className="card">
            <div className="card__image-wrap">
              <img className="card__image" src="/images/card-placeholder.svg" alt="Дверь Флай 8 ПГ" width="288" height="320" />
            </div>
            <span className="card__badge">Новинка</span>
            <h3 className="card__title"><Link to="/product/1">Дверь Флай 8 ПГ</Link></h3>
            <p className="card__price">от 58 600 ₽</p>
            <button type="button" className="card__action" aria-label="В корзину"></button>
          </article>
          <article className="card">
            <div className="card__image-wrap">
              <img className="card__image" src="/images/card-placeholder.svg" alt="Дверь Флай 8 ПГ" width="288" height="320" />
            </div>
            <span className="card__badge">Новинка</span>
            <h3 className="card__title"><Link to="/product/1">Дверь Флай 8 ПГ</Link></h3>
            <p className="card__price">от 58 600 ₽</p>
            <button type="button" className="card__action" aria-label="В корзину"></button>
          </article>
          <article className="card">
            <div className="card__image-wrap">
              <img className="card__image" src="/images/card-placeholder.svg" alt="Дверь Флай 8 ПГ" width="288" height="320" />
            </div>
            <span className="card__badge">Новинка</span>
            <h3 className="card__title"><Link to="/product/1">Дверь Флай 8 ПГ</Link></h3>
            <p className="card__price">от 58 600 ₽</p>
            <button type="button" className="card__action" aria-label="В корзину"></button>
          </article>
        </div>
      </section>

      <section className="section section_news">
        <h2 className="section__title section__title_center">Создаём двери, за которыми живётся спокойно</h2>
        <div className="news">
          <div className="news__divider"></div>
          <div className="news__content">
            <div className="news__grid">
              <article className="news-card">
                <img className="news-card__image" src="/images/news-1.png" alt="Новость 1" width="440" height="302" />
                <div className="news-card__meta">
                  <span className="news-card__date">16.09.2022</span>
                  <span className="news-card__tag">Новости</span>
                </div>
                <h3 className="news-card__title">Lorem Ipsum is simply dummy text of the printing and typesetting industry</h3>
              </article>
              <article className="news-card">
                <img className="news-card__image" src="/images/news-2.png" alt="Новость 2" width="440" height="302" />
                <div className="news-card__meta">
                  <span className="news-card__date">16.09.2022</span>
                  <span className="news-card__tag">Новости</span>
                </div>
                <h3 className="news-card__title">Lorem Ipsum is simply dummy text of the printing and typesetting industry</h3>
              </article>
              <article className="news-card">
                <img className="news-card__image" src="/images/news-3.png" alt="Новость 3" width="440" height="302" />
                <div className="news-card__meta">
                  <span className="news-card__date">16.09.2022</span>
                  <span className="news-card__tag">Новости</span>
                </div>
                <h3 className="news-card__title">Lorem Ipsum is simply dummy text of the printing and typesetting industry</h3>
              </article>
              <article className="news-card">
                <img className="news-card__image" src="/images/news-4.png" alt="Новость 4" width="440" height="302" />
                <div className="news-card__meta">
                  <span className="news-card__date">16.09.2022</span>
                  <span className="news-card__tag">Новости</span>
                </div>
                <h3 className="news-card__title">Коллекция MILLENNIUM в натуральном шпоне</h3>
              </article>
            </div>
            <div className="news__nav"></div>
          </div>
          <nav className="news__tabs">
            <a className="news__tab news__tab_active" href="#">Проекты</a>
            <a className="news__tab" href="#">Новости</a>
            <a className="news__tab" href="#">Блог</a>
          </nav>
        </div>
      </section>
    </>
  );
}