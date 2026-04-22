<?php
/**
 * /local/templates/dveryaninov/components/bitrix/catalog.section/dveryaninov/template.php
 * Шаблон списка каталога (аналог catalog.html, но динамический)
 */
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();
?>

<main class="catalog-page">
  <div class="container">

    <h1 class="catalog-page__title">
      <?= $arResult['SECTION']['NAME']
          ? htmlspecialchars($arResult['SECTION']['NAME'])
          : 'Каталог дверей' ?>
    </h1>

    <div class="catalog-layout">

      <!-- Сайдбар с коллекциями -->
      <aside class="catalog__sidebar" id="catalogSidebar">
        <h2 class="catalog__sidebar-title">Коллекции</h2>
        <ul class="catalog__collections-list">
          <li>
            <a href="/catalog/"
               class="catalog__collection-link <?= empty($arResult['SECTION']['ID']) ? 'is-active' : '' ?>">
              Все двери
            </a>
          </li>
          <?php foreach ($arResult['SECTIONS'] as $sec): ?>
            <li>
              <a href="<?= htmlspecialchars($sec['SECTION_PAGE_URL']) ?>"
                 class="catalog__collection-link <?= $sec['SELECTED'] ? 'is-active' : '' ?>">
                <?= htmlspecialchars($sec['NAME']) ?>
              </a>
            </li>
          <?php endforeach; ?>
        </ul>
      </aside>

      <!-- Грид товаров -->
      <div class="catalog__grid">

        <?php if (empty($arResult['ITEMS'])): ?>
          <p class="catalog__empty">В этой коллекции пока нет товаров.</p>
        <?php endif; ?>

        <?php foreach ($arResult['ITEMS'] as $arItem):
          $imgPath = $arItem['PREVIEW_PICTURE']
            ? CFile::GetPath($arItem['PREVIEW_PICTURE'])
            : '';
          $price = (int)($arItem['PROPERTIES']['PRICE_BASE']['VALUE'] ?? 0);
        ?>
          <article class="card">
            <a href="<?= htmlspecialchars($arItem['DETAIL_PAGE_URL']) ?>" class="card__link">
              <div class="card__image-wrap">
                <?php if ($imgPath): ?>
                <img class="card__image"
                     src="<?= htmlspecialchars($imgPath) ?>"
                     alt="<?= htmlspecialchars($arItem['NAME']) ?>"
                     width="288" height="320"
                     loading="lazy">
                <?php endif; ?>
              </div>
              <div class="card__info">
                <h3 class="card__title"><?= htmlspecialchars($arItem['NAME']) ?></h3>
                <?php if ($price > 0): ?>
                <p class="card__price">от <?= number_format($price, 0, '.', ' ') ?> ₽</p>
                <?php endif; ?>
              </div>
            </a>
            <a class="card__btn btn btn_outline"
               href="<?= htmlspecialchars($arItem['DETAIL_PAGE_URL']) ?>">
              Настроить
            </a>
          </article>
        <?php endforeach; ?>

      </div><!-- /.catalog__grid -->
    </div><!-- /.catalog-layout -->

    <!-- Пагинация -->
    <?php if ($arResult['NAV_STRING']): ?>
    <div class="catalog__pagination">
      <?= $arResult['NAV_STRING'] ?>
    </div>
    <?php endif; ?>

  </div><!-- /.container -->
</main>
