import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleCheckout = (e) => {
    e.preventDefault();
    setCheckoutSuccess(true);
  };

  return (
    <main className="cart-page">
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <Link className="breadcrumbs__link" to="/">Главная</Link>
        <span className="breadcrumbs__sep">–</span>
        <span className="breadcrumbs__current">Корзина</span>
      </nav>

      <h1 className="cart-page__title">Корзина</h1>

      <div className="cart-meta" id="cart-meta"></div>

      <div className="cart">
        <div className="cart__items">
          <article className="cart-item">
            <div className="cart-item__image-wrap">
              <img className="cart-item__image" src="/images/card-door-1.svg" alt="Дверь Флай 8 ПГ" width="120" height="160" />
            </div>
            <div className="cart-item__info">
              <div className="cart-item__info-header">
                <h3 className="cart-item__title">Дверь Флай 8 ПГ</h3>
                <div className="cart-item__actions">
                  <Link className="cart-item__action-btn" to="/catalog">Добавить ещё дверь</Link>
                  <span className="cart-item__action-sep">|</span>
                  <Link className="cart-item__action-btn" to="/product/1">Редактировать</Link>
                  <span className="cart-item__action-sep">|</span>
                  <button type="button" className="cart-item__action-btn cart-item__action-btn_danger">Удалить</button>
                </div>
              </div>
              <p className="cart-item__price-line">58 600 ₽</p>
              <dl className="cart-item__details">
                <div className="cart-item__detail-row">
                  <span className="cart-item__detail-label">Размер:</span>
                  <span className="cart-item__detail-value">2000×600</span>
                </div>
                <div className="cart-item__detail-row">
                  <span className="cart-item__detail-label">Цвет покрытия:</span>
                  <span className="cart-item__detail-value">RAL 9003</span>
                </div>
              </dl>
            </div>
            <div className="cart-item__accessories">
              <div className="cart-accessory">
                <div className="cart-accessory__img-wrap">
                  <img className="cart-accessory__img" src="/images/card-door-1.svg" alt="" />
                </div>
                <div className="cart-accessory__info">
                  <span className="cart-accessory__name">Ручка Стандарт</span>
                  <span className="cart-accessory__spec">Длина 120 мм, хром</span>
                </div>
                <div className="cart-accessory__qty">
                  <button type="button" className="cart-accessory__qty-btn" aria-label="Уменьшить">−</button>
                  <input type="number" className="cart-accessory__qty-input" value="1" min="1" readOnly />
                  <button type="button" className="cart-accessory__qty-btn" aria-label="Увеличить">+</button>
                </div>
                <div className="cart-accessory__pricing">
                  <span className="cart-accessory__price">1 200 ₽</span>
                  <span className="cart-accessory__old-price">55 799 ₽</span>
                </div>
              </div>
            </div>
          </article>

          <article className="cart-item">
            <div className="cart-item__image-wrap">
              <img className="cart-item__image" src="/images/card-door-2.svg" alt="Дверь Ультра 5 ПГ" width="120" height="160" />
            </div>
            <div className="cart-item__info">
              <div className="cart-item__info-header">
                <h3 className="cart-item__title">Дверь Ультра 5 ПГ</h3>
                <div className="cart-item__actions">
                  <Link className="cart-item__action-btn" to="/catalog">Добавить ещё дверь</Link>
                  <span className="cart-item__action-sep">|</span>
                  <Link className="cart-item__action-btn" to="/product/2">Редактировать</Link>
                  <span className="cart-item__action-sep">|</span>
                  <button type="button" className="cart-item__action-btn cart-item__action-btn_danger">Удалить</button>
                </div>
              </div>
              <p className="cart-item__price-line">Цена по запросу</p>
              <dl className="cart-item__details">
                <div className="cart-item__detail-row">
                  <span className="cart-item__detail-label">Размер:</span>
                  <span className="cart-item__detail-value">2000×700</span>
                </div>
                <div className="cart-item__detail-row">
                  <span className="cart-item__detail-label">Цвет покрытия:</span>
                  <span className="cart-item__detail-value">RAL 9003</span>
                </div>
              </dl>
            </div>
          </article>
        </div>

        <aside className="cart-summary">
          <div className="cart-summary__content">
            <h2 className="cart-summary__title">Итог</h2>
            <div className="cart-summary__row">
              <span className="cart-summary__label">Товаров на сумму:</span>
              <span className="cart-summary__value cart-summary__sum">175 800 ₽</span>
            </div>
            <div className="cart-summary__row">
              <span className="cart-summary__label">Доставка:</span>
              <span className="cart-summary__value">Рассчитывается при оформлении</span>
            </div>
            <div className="cart-summary__total">
              <span className="cart-summary__total-label">К оплате:</span>
              <span className="cart-summary__total-value cart-summary__pay">175 800 ₽</span>
            </div>
            <button type="button" className="cart-summary__btn" onClick={() => setCheckoutOpen(true)}>Оформить заказ</button>
            <Link to="/catalog" className="cart-summary__continue">Продолжить покупки</Link>
          </div>
        </aside>
      </div>

      {isCheckoutOpen && (
        <div className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-modal-title">
          <div className="checkout-modal__backdrop" onClick={() => setCheckoutOpen(false)}></div>
          <div className="checkout-modal__panel">
            {!checkoutSuccess ? (
              <div id="checkout-content">
                <div className="checkout-modal__header">
                  <h2 className="checkout-modal__title" id="checkout-modal-title">Оформление заявки</h2>
                  <button type="button" className="checkout-modal__close" onClick={() => setCheckoutOpen(false)} aria-label="Закрыть">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
                      <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
                <form className="checkout-form" id="checkout-form" onSubmit={handleCheckout} noValidate>
                  <div className="checkout-form__field">
                    <label className="checkout-form__label" htmlFor="checkout-name">Имя</label>
                    <input className="checkout-form__input" type="text" id="checkout-name" name="checkout-name" autoComplete="name" required />
                  </div>
                  <div className="checkout-form__field">
                    <label className="checkout-form__label" htmlFor="checkout-phone">Номер телефона</label>
                    <input className="checkout-form__input" type="tel" id="checkout-phone" name="checkout-phone" autoComplete="tel" required />
                  </div>
                  <div className="checkout-form__field">
                    <label className="checkout-form__label" htmlFor="checkout-city">Город</label>
                    <input className="checkout-form__input" type="text" id="checkout-city" name="checkout-city" autoComplete="address-level2" />
                  </div>
                  <div className="checkout-form__field">
                    <label className="checkout-form__label" htmlFor="checkout-comment">Комментарий</label>
                    <textarea className="checkout-form__textarea" id="checkout-comment" name="checkout-comment" rows="3"></textarea>
                  </div>
                  <button type="submit" className="checkout-form__submit">Оформить заявку</button>
                </form>
                <div className="checkout-auth-hint">
                  <p className="checkout-auth-hint__text">
                    Есть аккаунт? <button type="button" className="checkout-auth-hint__link">Войти</button> или <button type="button" className="checkout-auth-hint__link">зарегистрироваться</button> для отслеживания заказов
                  </p>
                </div>
              </div>
            ) : (
              <div id="checkout-success">
                <div className="checkout-success">
                  <div className="checkout-success__icon">&#10003;</div>
                  <h3 className="checkout-success__title">Заявка принята!</h3>
                  <p className="checkout-success__text">Мы свяжемся с вами в ближайшее время для уточнения деталей.</p>
                  <Link className="checkout-success__link" to="/account" onClick={() => setCheckoutOpen(false)}>Перейти в личный кабинет</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}