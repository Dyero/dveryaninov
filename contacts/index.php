<?php
/**
 * /contacts/index.php
 * Страница «Контакты» — PHP/Битрикс версия.
 * Статический contacts.html остаётся нетронутым.
 */
require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/header.php');
$APPLICATION->SetTitle('Контакты — Дверянинов');
?>

<main class="contacts-page">
  <nav class="breadcrumbs contacts-page__breadcrumbs" aria-label="Хлебные крошки">
    <a class="breadcrumbs__link" href="/">Главная</a>
    <span class="breadcrumbs__sep">–</span>
    <span class="breadcrumbs__current">Контакты</span>
  </nav>

  <h1 class="contacts-page__title">Контакты</h1>

  <section class="contacts" aria-label="Контактная информация">
    <div class="contacts__grid">
      <article class="contact-card">
        <h2 class="contact-card__title">Телефон</h2>
        <a class="contact-card__value" href="tel:88005508869">8 800 550-88-69</a>
        <p class="contact-card__note">с 08:00 до 17:00 по МСК</p>
      </article>

      <article class="contact-card">
        <h2 class="contact-card__title">Почта</h2>
        <a class="contact-card__value" href="mailto:info@dveryaninov.ru">info@dveryaninov.ru</a>
        <p class="contact-card__note">Ответим в течение рабочего дня</p>
      </article>

      <article class="contact-card">
        <h2 class="contact-card__title">Адрес</h2>
        <p class="contact-card__value contact-card__value_text">г. Новочебоксарск, Промышленная ул., 53, этаж 1, офис 4</p>
        <p class="contact-card__note">Офис и шоурум</p>
      </article>
    </div>
  </section>

  <section class="map-module" aria-label="Карта и точки продаж">
    <div class="map-module__grid">
      <div class="map-module__info">
        <h2 class="map-module__title">Мы на карте</h2>
        <p class="map-module__text">Постройте маршрут до шоурума или уточните наличие образцов у менеджера.</p>
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
