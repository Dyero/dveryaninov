const fs = require('fs');

const productHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Дверь Альберта 1 — Дверянинов</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/responsive.css">
  <script src="js/auth.js"></script>
  <script src="js/load-components.js"></script>
</head>
<body class="page page_product">

  <!-- Mobile Sticky CTA Header (Optional, but often we use sticky footer) -->
  
  <main class="product-pdp">
    <!-- Breadcrumbs -->
    <div class="product-wrap">
      <nav class="pdp-breadcrumbs" aria-label="Хлебные крошки">
        <a class="pdp-breadcrumbs__link pdp-breadcrumbs__link_mobile-back" href="catalog.html">Назад в Каталог</a>
        <div class="pdp-breadcrumbs__desktop">
          <a class="pdp-breadcrumbs__link" href="index.html">Главная</a>
          <span class="pdp-breadcrumbs__sep">></span>
          <a class="pdp-breadcrumbs__link" href="catalog.html">Каталог</a>
          <span class="pdp-breadcrumbs__sep">></span>
          <a class="pdp-breadcrumbs__link" href="catalog.html">Межкомнатные двери</a>
          <span class="pdp-breadcrumbs__sep">></span>
          <a class="pdp-breadcrumbs__link" href="catalog.html">Серия Альберта</a>
          <span class="pdp-breadcrumbs__sep">></span>
          <span class="pdp-breadcrumbs__current" id="product-br-title">Дверь Альберта 1</span>
        </div>
      </nav>

      <!-- Main Product Screen -->
      <section class="pdp-main">
        <!-- Left: Gallery -->
        <div class="pdp-gallery">
          <div class="pdp-gallery__badges">
            <span class="badge badge_hit">Хит</span>
            <span class="badge badge_new">Новинка</span>
          </div>

          <div class="pdp-gallery__thumbs">
            <!-- Dynamically generated via JS, template below -->
            <button class="pdp-gallery__thumb is-active"><img src="images/card-door-1.svg" alt=""></button>
            <button class="pdp-gallery__thumb"><img src="images/card-door-2.svg" alt=""></button>
            <button class="pdp-gallery__thumb"><img src="images/card-door-3.svg" alt=""></button>
            <button class="pdp-gallery__thumb pdp-gallery__thumb_video">
              <span class="pdp-gallery__play"></span>
              <img src="images/card-door-4.svg" alt="Video">
            </button>
          </div>

          <div class="pdp-gallery__main-wrap">
            <button class="pdp-gallery__nav pdp-gallery__nav_prev" aria-label="Назад"></button>
            <figure class="pdp-gallery__main-fig">
              <img id="pdp-main-image" src="images/card-door-1.svg" alt="Дверь Альберта 1" class="pdp-gallery__main-img">
            </figure>
            <button class="pdp-gallery__nav pdp-gallery__nav_next" aria-label="Вперед"></button>
            
            <div class="pdp-gallery__dots">
              <span class="pdp-gallery__dot is-active"></span>
              <span class="pdp-gallery__dot"></span>
              <span class="pdp-gallery__dot"></span>
              <span class="pdp-gallery__dot"></span>
            </div>
            <div class="pdp-gallery__mobile-count">1 / 4</div>
          </div>
        </div>

        <!-- Right: Info -->
        <div class="pdp-info">
          <!-- Mobile block context -->
          <h1 class="pdp-info__title">Дверь Альберта 1</h1>
          <div class="pdp-info__meta">
            <span class="status status_instock">В наличии</span>
            <a href="#reviews" class="pdp-info__rating">
              <div class="stars">★★★★★</div>
              <span class="pdp-info__reviews-count">12 отзывов</span>
            </a>
          </div>

          <p class="pdp-info__price"><span class="price-prefix">от</span> <span id="pdp-price-val">52 000</span> ₽</p>

          <form id="pdp-main-form" class="pdp-form">
            
            <!-- Sizes -->
            <fieldset class="pdp-fieldset">
              <div class="pdp-fieldset__header">
                <legend class="pdp-fieldset__legend">Размер полотна</legend>
                <a href="#" class="pdp-fieldset__hint">Как замерить?</a>
              </div>
              <div class="pdp-options-scroll">
                <label class="pdp-chip">
                  <input type="radio" name="pdp_size" value="600x2000">
                  <span class="pdp-chip__label">600x2000 мм</span>
                </label>
                <label class="pdp-chip">
                  <input type="radio" name="pdp_size" value="700x2000" checked>
                  <span class="pdp-chip__label">700x2000 мм</span>
                </label>
                <label class="pdp-chip">
                  <input type="radio" name="pdp_size" value="800x2000">
                  <span class="pdp-chip__label">800x2000 мм</span>
                </label>
                <label class="pdp-chip pdp-chip_custom">
                  <input type="radio" name="pdp_size" value="custom">
                  <span class="pdp-chip__label">Свой размер</span>
                </label>
              </div>
            </fieldset>

            <!-- Colors -->
            <fieldset class="pdp-fieldset">
              <div class="pdp-fieldset__header">
                <legend class="pdp-fieldset__legend">Цвет отделки: <span id="pdp-color-name">Бежевый</span></legend>
              </div>
              <div class="pdp-options-scroll">
                <div class="pdp-colors" id="pdp-colors-container">
                  <!-- JS Gen -->
                  <label class="pdp-color-swatch is-active" title="Бежевый">
                    <input type="radio" name="pdp_color" value="beige" checked>
                    <span class="swatch-fill" style="background:#ddd8d0;"></span>
                  </label>
                  <label class="pdp-color-swatch" title="Светло-серый">
                    <input type="radio" name="pdp_color" value="grey_light">
                    <span class="swatch-fill" style="background:#D3D3D3;"></span>
                  </label>
                  <label class="pdp-color-swatch" title="Графит">
                    <input type="radio" name="pdp_color" value="graphite">
                    <span class="swatch-fill" style="background:#4A4A4A;"></span>
                  </label>
                  <button type="button" class="pdp-color-more" aria-label="Показать все цвета">+</button>
                </div>
              </div>
              <a href="#" class="pdp-fieldset__link">Свой цвет по RAL</a>
            </fieldset>

            <!-- Desktop actions -->
            <div class="pdp-actions pdp-actions_desktop">
              <button type="button" class="btn btn_primary btn_lg pdp-actions__btn" id="btn-configure-desktop">НАСТРОИТЬ И ДОБАВИТЬ</button>
              <button type="button" class="btn btn_secondary pdp-actions__fav" aria-label="В избранное">♥</button>
            </div>
          </form>
        </div>
      </section>

      <!-- Info blocks vs Accordions on mobile -->
      <section class="pdp-details">
        <details class="pdp-acc" open id="pdp-desc-acc">
          <summary class="pdp-acc__summary"><h2>Описание</h2></summary>
          <div class="pdp-acc__content">
            <p>Дверь «Альберта 1» — это воплощение современной классики. Идеально выверенные пропорции, глухое полотно и качественная отделка делают ее универсальным решением для любого интерьера. Высокая плотность материалов обеспечивает отличную шумоизоляцию, сохраняя покой и уют в вашем доме.</p>
            <p>Доступны различные варианты погонажа (наличники, короба), а также интегрированные скрытые петли и магнитные замки для создания премиального внешнего вида.</p>
          </div>
        </details>

        <details class="pdp-acc" open id="pdp-specs-acc">
          <summary class="pdp-acc__summary"><h2>Характеристики</h2></summary>
          <div class="pdp-acc__content">
            <ul class="pdp-specs-list">
              <li><span class="spec-name">Стиль</span> <span class="spec-val">Современная классика</span></li>
              <li><span class="spec-name">Отделка</span> <span class="spec-val">Эмаль (Италия), 5 слоев</span></li>
              <li><span class="spec-name">Толщина полотна</span> <span class="spec-val">40 мм (усиленная)</span></li>
              <li><span class="spec-name">Звукоизоляция</span> <span class="spec-val">Класс А (до 32 дБ)</span></li>
              <li><span class="spec-name">Каркас</span> <span class="spec-val">Сращенный массив сосны + MDF</span></li>
            </ul>
          </div>
        </details>
      </section>

      <!-- Reviews Block -->
      <section class="pdp-reviews" id="reviews">
        <div class="pdp-reviews__header">
          <div class="pdp-reviews__title-wrap">
            <h2 class="pdp-reviews__title">Отзывы о модели</h2>
            <span class="pdp-reviews__count">12</span>
          </div>
          <div class="pdp-reviews__header-right">
            <div class="stars">★★★★★</div>
            <button class="btn btn_outline">НАПИСАТЬ ОТЗЫВ</button>
          </div>
        </div>

        <div class="pdp-reviews__ugc">
          <div class="pdp-reviews__ugc-scroll">
            <img src="images/card-door-1.svg" class="ugc-photo" alt="Фото покупателя">
            <img src="images/card-door-2.svg" class="ugc-photo" alt="Фото покупателя">
            <img src="images/card-door-3.svg" class="ugc-photo" alt="Фото покупателя">
            <button class="ugc-nav-btn">&rarr;</button>
          </div>
        </div>

        <div class="pdp-reviews__list">
          <article class="review-card">
            <div class="review-card__header">
              <div>
                <b class="review-card__author">Константин В.</b>
                <span class="review-card__date">12 октября 2023</span>
              </div>
              <div class="stars">★★★★★</div>
            </div>
            <div class="review-card__body">
              <p>Двери отличные, заказывали сразу в 4 комнаты. Шумоизоляция на высоте, фурнитура скрытая работает идеально. Цвет бежевый вписался как родной.</p>
              <div class="review-card__photos">
                <img src="images/card-door-1.svg" class="review-photo-thumb" alt="">
              </div>
            </div>
          </article>
        </div>
        
        <div class="pdp-reviews__footer">
          <button class="btn btn_text">ПОКАЗАТЬ ВСЕ ОТЗЫВЫ</button>
        </div>
      </section>

      <!-- Sticky Mobile CTA -->
      <div class="pdp-sticky-cta" id="pdp-sticky-cta">
        <div class="pdp-sticky-cta__price">
          <span class="price-prefix">от</span> <strong>52 000 ₽</strong>
        </div>
        <button class="btn btn_primary pdp-sticky-cta__btn" id="btn-configure-mobile">НАСТРОИТЬ</button>
      </div>

    </div>
  </main>
  
  <!-- Configurator Modal (Bottom Sheet on Mobile) -->
  <!-- Оставляем существующий html модалки, но добавим классы для bottom sheet -->
  <div class="modal config-modal pdp-sheet" id="dv-config-modal" aria-hidden="true">
    <div class="modal__overlay" tabindex="-1" data-modal-close></div>
    <div class="modal__window modal__window_fullscreen pdp-sheet__window" role="dialog" aria-modal="true" aria-labelledby="config-title">
       
      <div class="modal__header pdp-sheet__header">
        <h2 class="modal__title" id="config-title">Настройка комплектации</h2>
        <button class="modal__close" type="button" aria-label="Закрыть" data-modal-close>
          <img src="images/icon-close.svg" alt="" width="24" height="24">
        </button>
      </div>

      <!-- Stepper / Progress Bar (Mobile) -->
      <div class="cfg-stepper pdp-sheet__stepper">
        <div class="cfg-stepper__step cfg-stepper__step_active" data-step-tab="config">Дверь</div>
        <div class="cfg-stepper__step" data-step-tab="molding">Погонаж</div>
        <div class="cfg-stepper__step" data-step-tab="hardware">Фурнитура</div>
      </div>

      <div class="modal__body cfg-body pdp-sheet__body">
         <!-- Existing Config HTML can be injected here -->
         <p style="padding: 20px;">(Здесь содержимое конфигуратора с аккордеоном выводится JS)</p>
      </div>

      <div class="modal__footer pdp-sheet__footer">
        <div class="config-summary pdp-sheet__summary">
          <div class="config-summary__row"><span>Итого:</span><b class="config-summary__value">52 000 ₽</b></div>
        </div>
        <button type="button" class="btn btn_secondary config-btn-reset">Сбросить</button>
        <button type="button" class="btn btn_primary config-btn-add">В КОРЗИНУ</button>
      </div>
    </div>
  </div>

  <script src="js/shop.js"></script>
  <script src="js/pdp.js"></script>
</body>
</html>`;

fs.writeFileSync('/workspaces/dveryaninov/product.html', productHtml);
console.log('product.html replaced with new layout.');

