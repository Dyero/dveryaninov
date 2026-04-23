<?php
/**
 * /index.php
 * Главная страница сайта Дверянинов — PHP/Битрикс версия.
 * Статический index.html остаётся нетронутым.
 */

require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/header.php');
/** @var CMain $APPLICATION */
$APPLICATION->SetTitle('Дверянинов — Премиальные межкомнатные двери');

/* P10: Случайные двери из инфоблока (8 штук) */
$randomDoors = [];
try {
    $iblockId = 10; // ID инфоблока «Двери»
    // Собираем ID всех активных элементов
    $allIds = [];
    $resIds = \CIBlockElement::GetList(
        [],
        ['IBLOCK_ID' => $iblockId, 'ACTIVE' => 'Y'],
        false,
        false,
        ['ID']
    );
    while ($row = $resIds->Fetch()) {
        $allIds[] = (int)$row['ID'];
    }
    if (!empty($allIds)) {
        shuffle($allIds);
        $pickedIds = array_slice($allIds, 0, 8);
        $resItems = \CIBlockElement::GetList(
            [],
            ['ID' => $pickedIds, 'IBLOCK_ID' => $iblockId, 'ACTIVE' => 'Y'],
            false,
            false,
            ['ID', 'NAME', 'CODE', 'DETAIL_PAGE_URL', 'PREVIEW_PICTURE']
        );
        $resItems->SetPropertyFilter(['PRICE_BASE']);
        while ($el = $resItems->GetNextElement()) {
            $fields = $el->GetFields();
            $props  = $el->GetProperties();
            $fields['PRICE_BASE'] = (int)($props['PRICE_BASE']['VALUE'] ?? 0);
            $fields['IMG_PATH']   = $fields['PREVIEW_PICTURE']
                ? \CFile::GetPath($fields['PREVIEW_PICTURE'])
                : '';
            $randomDoors[] = $fields;
        }
    }
} catch (\Exception $e) { /* Битрикс недоступен — блок не выводится */ }
?>

<main>
  <!-- 1. Hero-слайдер -->
  <section class="hero-slider" id="hero-slider">
    <div class="hero-slider__slides">
      <div class="hero-slider__slide is-active">
        <div class="hero-new">
          <div class="hero-new__col hero-new__col_left">
            <img class="hero-new__bg-img" src="/images/news-1.png" alt="Интерьер с дверью">
            <div class="hero-new__content">
              <p class="hero-new__subtitle">ПРЕМИАЛЬНЫЕ МЕЖКОМНАТНЫЕ ДВЕРИ ОТ ФАБРИКИ</p>
              <h1 class="hero-new__title">Двери, которые приносят тишину, статус и уверенность в ваш дом</h1>
              <a class="hero-new__btn btn btn_primary" href="/catalog/">Перейти в каталог <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="hero-slider__nav" hidden>
      <button class="hero-slider__arrow hero-slider__arrow_prev" aria-label="Предыдущий">&#8249;</button>
      <button class="hero-slider__arrow hero-slider__arrow_next" aria-label="Следующий">&#8250;</button>
      <div class="hero-slider__dots"></div>
    </div>
  </section>

  <!-- 2. Промо-слайдер коллекций -->
  <section class="promo-slider" id="promo-slider">
    <div class="promo-slider__slides">
      <div class="promo-slider__slide is-active" data-slide="0">
        <div class="promo__content promo__content_beige">
          <h2 class="promo__title">Двери Амфора</h2>
          <p class="promo__text">Оригинальность конструкции, по-настоящему огромная вариативность декорирования и небольшие детали — все вместе собирается в один рецепт красоты</p>
          <a href="/catalog/" class="btn btn_primary promo__btn">ПОДРОБНЕЕ <span aria-hidden="true">↗</span></a>
        </div>
        <div class="promo__image-wrap">
          <img class="promo__image" src="/images/news-2.png" alt="Интерьер Амфора">
        </div>
      </div>
      <div class="promo-slider__slide" data-slide="1">
        <div class="promo__content promo__content_beige">
          <h2 class="promo__title">Двери Альберта</h2>
          <p class="promo__text">Классический дизайн с современными материалами. Коллекция Альберта — элегантность в каждой детали, непревзойдённое качество отделки</p>
          <a href="/catalog/" class="btn btn_primary promo__btn">ПОДРОБНЕЕ <span aria-hidden="true">↗</span></a>
        </div>
        <div class="promo__image-wrap">
          <img class="promo__image" src="/images/Коллекции/Альберта/Альберта 1 1.png" alt="Коллекция Альберта">
        </div>
      </div>
      <div class="promo-slider__slide" data-slide="2">
        <div class="promo__content promo__content_beige">
          <h2 class="promo__title">Двери Флай</h2>
          <p class="promo__text">Лёгкость форм и воздушность линий. Коллекция Флай — современный дизайн, идеальный для светлых и просторных интерьеров</p>
          <a href="/catalog/" class="btn btn_primary promo__btn">ПОДРОБНЕЕ <span aria-hidden="true">↗</span></a>
        </div>
        <div class="promo__image-wrap">
          <img class="promo__image" src="/images/Коллекции/Флай/ФЛАЙ 1 1.png" alt="Коллекция Флай">
        </div>
      </div>
    </div>
    <button class="promo-slider__arrow promo-slider__arrow_prev" aria-label="Предыдущий слайд">&#8249;</button>
    <button class="promo-slider__arrow promo-slider__arrow_next" aria-label="Следующий слайд">&#8250;</button>
    <div class="promo-slider__dots">
      <button class="promo-slider__dot is-active" data-go="0" aria-label="Слайд 1"></button>
      <button class="promo-slider__dot" data-go="1" aria-label="Слайд 2"></button>
      <button class="promo-slider__dot" data-go="2" aria-label="Слайд 3"></button>
    </div>
  </section>

  <!-- 3. Коллекции -->
  <section class="section section_cards">
    <div class="section__head">
      <h2 class="section__title">Коллекции</h2>
      <a href="/collections/" class="section__link">Смотреть все <span>&rarr;</span></a>
    </div>
    <div class="section__cards section__cards_wrap">
      <article class="card">
        <div class="card__image-wrap">
          <img class="card__image" src="/images/Коллекции/Флай/ФЛАЙ 8 1.png" alt="Коллекция Флай">
        </div>
        <div class="card__info">
          <h3 class="card__title"><a href="/catalog/?section=flaj">Флай</a></h3>
          <p class="card__price"><span class="card__price-prefix">от</span> 52 800 ₽</p>
        </div>
      </article>
      <article class="card">
        <div class="card__image-wrap">
          <img class="card__image" src="/images/Коллекции/Ультра/ультра 5 пг 1.png" alt="Коллекция Ультра">
        </div>
        <div class="card__info">
          <h3 class="card__title"><a href="/catalog/?section=ultra">Ультра</a></h3>
          <p class="card__price"><span class="card__price-prefix">от</span> 49 100 ₽</p>
        </div>
      </article>
      <article class="card">
        <div class="card__image-wrap">
          <img class="card__image" src="/images/Коллекции/Кант/кант 5 ПО 1.png" alt="Коллекция Кант">
        </div>
        <div class="card__info">
          <h3 class="card__title"><a href="/catalog/?section=kant">Кант</a></h3>
          <p class="card__price"><span class="card__price-prefix">от</span> 49 100 ₽</p>
        </div>
      </article>
      <article class="card">
        <div class="card__image-wrap">
          <img class="card__image" src="/images/Коллекции/Альберта/Альберта 1 1.png" alt="Коллекция Альберта">
        </div>
        <div class="card__info">
          <h3 class="card__title"><a href="/catalog/?section=alberta">Альберта</a></h3>
          <p class="card__price"><span class="card__price-prefix">от</span> 23 140 ₽</p>
        </div>
      </article>
    </div>
  </section>

  <!-- 4. Блог — компонент Битрикс -->
  <section class="blog">
    <div class="blog__container">
      <div class="blog__header">
        <h2 class="blog__title">Создаём двери, за которыми живётся спокойно</h2>
        <div class="blog__tabs">
          <button class="blog__tab is-active">Проекты</button>
          <button class="blog__tab">Новости</button>
          <button class="blog__tab">Блог</button>
        </div>
      </div>
      <?php
      $APPLICATION->IncludeComponent(
          'bitrix:blog.post.list',
          'dveryaninov_home',
          [
              'BLOG_URL'      => '/blog/',
              'POST_COUNT'    => 4,
              'CACHE_TYPE'    => 'A',
              'CACHE_TIME'    => 3600,
              'SORT_BY'       => 'DATE_PUBLISH',
              'SORT_ORDER'    => 'DESC',
              'SET_TITLE'     => 'N',
              'SET_LAST_MODIFIED' => 'N',
          ]
      );
      ?>
    </div>
  </section>

  <!-- 5. Случайные двери (P10) -->
  <?php if (!empty($randomDoors)): ?>
  <section class="random-doors">
    <div class="random-doors__head">
      <h2 class="random-doors__title">Двери из каталога</h2>
      <a href="/catalog/" class="random-doors__link">Смотреть все &rarr;</a>
    </div>
    <div class="random-doors__grid">
      <?php foreach ($randomDoors as $door): ?>
        <article class="card">
          <?php if ($door['IMG_PATH']): ?>
          <div class="card__image-wrap">
            <img class="card__image"
                 src="<?= htmlspecialchars($door['IMG_PATH']) ?>"
                 alt="<?= htmlspecialchars($door['NAME']) ?>"
                 width="288" height="320" loading="lazy">
          </div>
          <?php endif; ?>
          <div class="card__info">
            <h3 class="card__title">
              <a href="<?= htmlspecialchars($door['DETAIL_PAGE_URL']) ?>">
                <?= htmlspecialchars($door['NAME']) ?>
              </a>
            </h3>
            <?php if ($door['PRICE_BASE'] > 0): ?>
            <p class="card__price">
              <span class="card__price-prefix">от</span>
              <?= number_format($door['PRICE_BASE'], 0, '.', ' ') ?> ₽
            </p>
            <?php endif; ?>
          </div>
          <a class="card__btn btn btn_outline"
             href="<?= htmlspecialchars($door['DETAIL_PAGE_URL']) ?>">
            Настроить
          </a>
        </article>
      <?php endforeach; ?>
    </div>
  </section>
  <?php endif; ?>

  <!-- 6. Промо-блок «Примерка» -->
  <section class="promo promo_mirrored">
    <div class="promo__content promo__content_dark">
      <h2 class="promo__title">Примерьте дверь в своём интерьере бесплатно</h2>
      <p class="promo__text">Наш дизайнер приедет к вам домой, проведёт замеры и сделает 3D-визуализацию. Мы разбираемся в трендах, уважаем ваш вкус и предложим лучший вариант дизайна.</p>
      <button class="btn btn_primary promo__btn" id="open-fitting-popup">ЗАКАЗАТЬ ПРИМЕРКУ <span aria-hidden="true">↗</span></button>
    </div>
    <div class="promo__image-wrap">
      <img class="promo__image" src="/images/news-3.png" alt="Интерьер с дверью">
    </div>
  </section>

  <!-- Попап «Заказать примерку» -->
  <div class="appeal-popup" id="fitting-popup" hidden>
    <div class="appeal-popup__overlay"></div>
    <div class="appeal-popup__window">
      <button class="appeal-popup__close" aria-label="Закрыть">&times;</button>
      <h2 class="appeal-popup__title">Заказать примерку</h2>
      <p style="margin:0 0 20px;font-size:14px;color:#666;line-height:1.5;">Наш дизайнер приедет к вам и покажет, как дверь будет смотреться в вашем интерьере</p>
      <form class="appeal-popup__form" id="fitting-form" novalidate>
        <div class="appeal-popup__group">
          <label class="appeal-popup__label" for="fitting-name">Имя</label>
          <input class="appeal-popup__input" type="text" id="fitting-name" name="name" required>
        </div>
        <div class="appeal-popup__group">
          <label class="appeal-popup__label" for="fitting-phone">Телефон</label>
          <input class="appeal-popup__input" type="tel" id="fitting-phone" name="phone" placeholder="+7 (___) ___-__-__" required>
        </div>
        <div class="appeal-popup__group" style="display:flex;align-items:flex-start;gap:10px;">
          <input type="checkbox" id="fitting-privacy" name="privacy" required style="margin-top:3px;">
          <label for="fitting-privacy" style="font-size:13px;color:#666;line-height:1.4;cursor:pointer;">Я даю согласие на обработку <a href="/privacy/" style="color:inherit;text-decoration:underline;">персональных данных</a></label>
        </div>
        <button type="submit" class="appeal-popup__btn btn btn_primary">ОТПРАВИТЬ ЗАЯВКУ</button>
      </form>
    </div>
  </div>

  <!-- 7. Панорама-баннер -->
  <section class="panorama-banner">
    <img class="panorama-banner__img" src="/images/news-4.png" alt="Панорама интерьера">
  </section>

  <!-- 8. Лид-форма -->
  <section class="lead">
    <div class="lead__container">
      <p class="lead__eyebrow">СВЯЗАТЬСЯ С НАМИ</p>
      <h2 class="lead__title">Поможем подобрать двери из каталога<br>или подготовим уникальный дизайн-проект</h2>
      <p class="lead__subtitle">Оставьте свои данные и мы свяжемся с вами в ближайшее рабочее время</p>
      <form class="lead__form">
        <input type="text" class="lead__input" placeholder="Ваше имя*" required>
        <input type="tel" class="lead__input" placeholder="Ваш телефон*" required>
        <button type="submit" class="btn btn_primary lead__submit">ОТПРАВИТЬ</button>
      </form>
      <p class="lead__policy">Отправляя заявку, вы даёте своё согласие на обработку <a href="/privacy/">персональных данных</a></p>
    </div>
  </section>
</main>

<script src="/js/shop.js"></script>
<script>
(function () {
  /* Промо-слайдер */
  var slider = document.getElementById('promo-slider');
  if (!slider) return;
  var slides = slider.querySelectorAll('.promo-slider__slide');
  var dots   = slider.querySelectorAll('.promo-slider__dot');
  var prevBtn = slider.querySelector('.promo-slider__arrow_prev');
  var nextBtn = slider.querySelector('.promo-slider__arrow_next');
  var current = 0, total = slides.length, timer;

  function goTo(idx) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = ((idx % total) + total) % total;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
  }
  function startTimer() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(current + 1); }, 15000);
  }
  dots.forEach(function (d) {
    d.addEventListener('click', function () { goTo(Number(d.dataset.go)); startTimer(); });
  });
  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); startTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); startTimer(); });
  startTimer();
})();

/* Fitting popup */
(function() {
  var popup  = document.getElementById('fitting-popup');
  var openBtn = document.getElementById('open-fitting-popup');
  if (!popup || !openBtn) return;
  openBtn.addEventListener('click', function (e) { e.preventDefault(); popup.hidden = false; });
  popup.querySelector('.appeal-popup__overlay').addEventListener('click', function () { popup.hidden = true; });
  popup.querySelector('.appeal-popup__close').addEventListener('click', function () { popup.hidden = true; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !popup.hidden) popup.hidden = true; });
})();
</script>

<?php require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/footer.php'); ?>
