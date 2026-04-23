<?php
/**
 * /services/index.php
 * Страница «Услуги» — PHP/Битрикс версия.
 * Статический service.html остаётся нетронутым.
 */
require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/header.php');
$APPLICATION->SetTitle('Услуги — Дверянинов');
?>

<main class="service-page">
  <nav class="breadcrumbs service-page__breadcrumbs" aria-label="Хлебные крошки">
    <a class="breadcrumbs__link" href="/">Главная</a>
    <span class="breadcrumbs__sep">–</span>
    <span class="breadcrumbs__current">Услуги</span>
  </nav>

  <h1 class="service-page__title">Услуги</h1>

  <section class="service-hero" aria-label="Описание услуги">
    <div class="service-hero__grid">
      <div class="service-hero__content">
        <p class="service-hero__lead">Подберём дверь, комплектацию и монтаж под ваш интерьер и бюджет.</p>
        <ul class="service-hero__bullets">
          <li>Консультация и подбор</li>
          <li>Замер и рекомендации</li>
          <li>Доставка и монтаж</li>
        </ul>
        <div class="service-hero__actions">
          <a class="btn service-hero__btn" href="/contacts/">Связаться с нами</a>
          <a class="service-hero__link" href="#map">Где мы находимся</a>
        </div>
      </div>
      <div class="service-hero__media" role="img" aria-label="">
        <img class="service-hero__image" src="/images/hero-bg.svg" alt="" width="960" height="520">
      </div>
    </div>
  </section>

  <section class="service-steps" aria-label="Этапы">
    <h2 class="service-steps__title">Как это работает</h2>
    <div class="service-steps__grid">
      <article class="step-card">
        <p class="step-card__num">01</p>
        <h3 class="step-card__title">Заявка</h3>
        <p class="step-card__text">Оставляете заявку, уточняем задачу и сроки.</p>
      </article>
      <article class="step-card">
        <p class="step-card__num">02</p>
        <h3 class="step-card__title">Подбор</h3>
        <p class="step-card__text">Подбираем модель, покрытие, размеры и комплектующие.</p>
      </article>
      <article class="step-card">
        <p class="step-card__num">03</p>
        <h3 class="step-card__title">Замер</h3>
        <p class="step-card__text">При необходимости выезд замерщика и рекомендации.</p>
      </article>
      <article class="step-card">
        <p class="step-card__num">04</p>
        <h3 class="step-card__title">Монтаж</h3>
        <p class="step-card__text">Доставка и установка с гарантией качества.</p>
      </article>
    </div>
  </section>

  <section class="service-faq" aria-label="Вопросы и ответы">
    <h2 class="service-faq__title">Частые вопросы</h2>
    <div class="service-faq__grid">
      <details class="faq-item">
        <summary class="faq-item__summary">Сколько занимает изготовление</summary>
        <p class="faq-item__text">Срок зависит от модели и покрытия, обычно от 10 рабочих дней.</p>
      </details>
      <details class="faq-item">
        <summary class="faq-item__summary">Можно ли подобрать свой цвет</summary>
        <p class="faq-item__text">Да, доступна палитра RAL и индивидуальная колеровка.</p>
      </details>
      <details class="faq-item">
        <summary class="faq-item__summary">Делаете ли вы замер</summary>
        <p class="faq-item__text">Да, выезд замерщика возможен по согласованию.</p>
      </details>
    </div>
  </section>

  <section class="map-module" id="map" aria-label="Карта">
    <div class="map-module__grid">
      <div class="map-module__info">
        <h2 class="map-module__title">Мы на карте</h2>
        <p class="map-module__text">Приезжайте в шоурум, чтобы увидеть и потрогать двери лично.</p>
        <div class="map-module__list">
          <div class="map-point">
            <p class="map-point__name">Шоурум</p>
            <p class="map-point__addr">г. Новочебоксарск, Промышленная ул., 53, этаж 1, офис 4</p>
            <a class="map-point__link" href="tel:88005508869">8 800 550-88-69</a>
          </div>
        </div>
      </div>
      <div class="map-module__map" aria-label="Карта">
        <script type="text/javascript" charset="utf-8" async
          src="https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A8b3ba775eb6c9393103d98610a836324133782df260789901a3c724aeb6d050a&amp;width=600&amp;height=400&amp;lang=ru_RU&amp;scroll=true"></script>
      </div>
    </div>
  </section>
</main>

<?php require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/footer.php'); ?>
