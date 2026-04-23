<?php
/**
 * /about/index.php
 * Страница «О компании» — PHP/Битрикс версия.
 * Статический about.html остаётся нетронутым.
 */
require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/header.php');
$APPLICATION->SetTitle('О компании — Дверянинов');
?>

<main class="about-page">
  <nav class="breadcrumbs" aria-label="Хлебные крошки">
    <a class="breadcrumbs__link" href="/">Главная</a>
    <span class="breadcrumbs__sep">–</span>
    <span class="breadcrumbs__current">О компании</span>
  </nav>

  <h1 class="about-page__title">Премиальные двери от производителя</h1>

  <div class="about-banner">
    <img class="about-banner__image" src="/images/hero-bg.svg" alt="" width="1920" height="500">
  </div>

  <section class="about-intro">
    <h2 class="about-intro__heading">О компании</h2>
    <p class="about-intro__text">
      Дверянинов — это качественные материалы, современные технологии производства, новейшие
      дизайнерские решения и удобные условия сотрудничества с дизайнерами и архитекторами.
    </p>
    <p class="about-intro__text about-intro__text_muted">
      В каталоге Дверянинов представлен широкий ассортимент моделей, покрытий, расцветок, среди
      которых даже самый требовательный заказчик найдёт идеальный вариант для своёго дома.
    </p>
  </section>

  <section class="about-block about-block_image-right">
    <div class="about-block__content">
      <h2 class="about-block__heading">Всегда придём на помощь</h2>
      <p class="about-block__text">
        От вас ничего не требуется: дизайнер приедет к вам домой, проведёт замеры и сделает
        3D-визуализацию. Мы разбираемся в трендах, уважаем ваш вкус и предложим лучший вариант
        дизайна.
      </p>
    </div>
    <div class="about-block__image-wrap">
      <img class="about-block__image" src="/images/news-1.png" alt="Сервис компании" width="560" height="380">
    </div>
  </section>

  <section class="about-block about-block_alt about-block_image-left">
    <div class="about-block__content">
      <h2 class="about-block__heading">Подстроимся под нужные размеры</h2>
      <p class="about-block__text">
        В типовых решениях нет свободы творчества, поэтому мы никогда не ограничиваемся
        стандартными приёмами. Просто любим своих клиентов – а значит, сделаем всё, чтобы ваша
        идеальная дверь стала реальностью.
      </p>
    </div>
    <div class="about-block__image-wrap">
      <img class="about-block__image" src="/images/news-2.png" alt="Индивидуальные размеры" width="560" height="380">
    </div>
  </section>

  <section class="about-block about-block_image-right">
    <div class="about-block__content">
      <h2 class="about-block__heading">Собственное производство</h2>
      <p class="about-block__text">
        Наша фабрика оснащена современными линиями ЧПУ и системами автоматического контроля.
        Полный цикл производства — от заготовки до упаковки — позволяет нам гарантировать
        качество каждого изделия и точно соблюдать сроки.
      </p>
    </div>
    <div class="about-block__image-wrap">
      <img class="about-block__image" src="/images/news-3.png" alt="Производство" width="560" height="380">
    </div>
  </section>

  <section class="about-block about-block_alt about-block_image-left">
    <div class="about-block__content">
      <h2 class="about-block__heading">Экологичные материалы</h2>
      <p class="about-block__text">
        Используем только проверенные материалы с заводскими сертификатами соответствия.
        Покрытия не содержат вредных летучих соединений и безопасны для здоровья.
      </p>
    </div>
    <div class="about-block__image-wrap">
      <img class="about-block__image" src="/images/news-4.png" alt="Экологичные материалы" width="560" height="380">
    </div>
  </section>

  <section class="about-quality">
    <div class="about-quality__bg"></div>
    <div class="about-quality__content">
      <h2 class="about-quality__heading">Контроль качества</h2>
      <p class="about-quality__intro">Эффективная система контроля качества продукции на четырёх этапах производства:</p>
      <ul class="about-quality__list">
        <li class="about-quality__item">проверка поверхности перед окраской</li>
        <li class="about-quality__item">контроль качества окраски</li>
        <li class="about-quality__item">общая проверка изделия перед упаковкой</li>
        <li class="about-quality__item">финальный контроль перед отгрузкой</li>
      </ul>
    </div>
  </section>

  <section class="about-certs">
    <h2 class="about-certs__title">Сертификаты и награды</h2>
    <p class="about-certs__lead">Наша продукция сертифицирована по российским и международным стандартам качества.</p>
    <div class="about-certs__grid">
      <div class="cert-card">
        <div class="cert-card__image-wrap">
          <img class="cert-card__image" src="/images/card-door-1.svg" alt="Сертификат ГОСТ" width="200" height="280">
        </div>
        <p class="cert-card__label">Сертификат ГОСТ Р</p>
      </div>
      <div class="cert-card">
        <div class="cert-card__image-wrap">
          <img class="cert-card__image" src="/images/card-door-2.svg" alt="Пожарная безопасность" width="200" height="280">
        </div>
        <p class="cert-card__label">Пожарная безопасность</p>
      </div>
      <div class="cert-card">
        <div class="cert-card__image-wrap">
          <img class="cert-card__image" src="/images/card-door-3.svg" alt="Экологический сертификат" width="200" height="280">
        </div>
        <p class="cert-card__label">Эко-сертификат</p>
      </div>
      <div class="cert-card">
        <div class="cert-card__image-wrap">
          <img class="cert-card__image" src="/images/card-door-4.svg" alt="Звукоизоляция" width="200" height="280">
        </div>
        <p class="cert-card__label">Звукоизоляция</p>
      </div>
    </div>
  </section>

  <section class="about-news">
    <h2 class="about-news__title">Новости компании</h2>
    <div class="about-news__grid">
      <?php
      $APPLICATION->IncludeComponent(
          'bitrix:news.list',
          '',
          [
              'IBLOCK_TYPE'  => 'NEWS',
              'IBLOCK_ID'    => 1,
              'COUNT'        => 4,
              'SORT_BY1'     => 'ACTIVE_FROM',
              'SORT_ORDER1'  => 'DESC',
              'CACHE_TYPE'   => 'A',
              'CACHE_TIME'   => 3600,
              'DETAIL_URL'   => '/news/#CODE#/',
              'SET_TITLE'    => 'N',
          ]
      );
      ?>
    </div>
  </section>
</main>

<?php require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/footer.php'); ?>
