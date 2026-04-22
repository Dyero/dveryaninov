<?php
/**
 * /local/templates/dveryaninov/components/bitrix/catalog.element/dveryaninov/template.php
 * Шаблон карточки товара (аналог статических product-*.html, но динамический из инфоблока)
 * НЕ трогает оригинальные product-*.html — они остаются резервной копией
 */
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

/* -------------------------------------------------- *
 * Данные элемента инфоблока
 * -------------------------------------------------- */
$item   = $arResult;
$props  = $arResult['PROPERTIES'];
$iblock = $arResult['IBLOCK_ID'];

$name         = htmlspecialchars($item['NAME']);
$code         = htmlspecialchars($item['CODE']);
$previewImg   = $item['PREVIEW_PICTURE'] ? CFile::GetPath($item['PREVIEW_PICTURE']) : '';
$detailImg    = $item['DETAIL_PICTURE']  ? CFile::GetPath($item['DETAIL_PICTURE'])  : $previewImg;
$priceBase    = (int)($props['PRICE_BASE']['VALUE'] ?? 0);
$collection   = htmlspecialchars($props['COLLECTION']['VALUE'] ?? '');
$hasGlazing   = ($props['HAS_GLAZING']['VALUE'] === 'Y');
$hasMolding   = ($props['HAS_MOLDING']['VALUE'] === 'Y');
$hasAluEdge   = ($props['HAS_ALU_EDGE']['VALUE'] === 'Y');
$bladePOPrice = (int)($props['BLADE_PO_PRICE']['VALUE'] ?? 0);
$style        = htmlspecialchars($props['STYLE']['VALUE'] ?? '');
$description  = $item['DETAIL_TEXT'] ?: $item['PREVIEW_TEXT'] ?: '';

/* Галерея */
$galleryRaw = $props['GALLERY']['VALUE'] ?? [];
if (!is_array($galleryRaw)) {
    $galleryRaw = array_filter([$galleryRaw]);
}
$galleryPaths = [];
foreach ($galleryRaw as $fileId) {
    $p = CFile::GetPath($fileId);
    if ($p) $galleryPaths[] = $p;
}

/* Стёкла из HL Glass (id=6) */
$glasses = [];
$glazingIds = $props['GLAZING_IDS']['VALUE'] ?? [];
if (!is_array($glazingIds)) $glazingIds = array_filter([$glazingIds]);
if (!empty($glazingIds)) {
    try {
        $hlGlass   = \Bitrix\Highloadblock\HighloadBlockTable::getById(6)->fetch();
        $entity    = \Bitrix\Highloadblock\HighloadBlockTable::compileEntity($hlGlass);
        $dataClass = $entity->getDataClass();
        $res = $dataClass::getList([
            'filter' => ['ID' => array_map('intval', $glazingIds)],
            'select' => ['ID', 'UF_NAME', 'UF_FILE', 'UF_PRICE'],
        ]);
        while ($row = $res->fetch()) {
            $row['FILE_PATH'] = $row['UF_FILE'] ? CFile::GetPath($row['UF_FILE']) : '';
            $glasses[] = $row;
        }
    } catch (\Exception $e) { /* HL-блок недоступен — игнорируем */ }
}

/* Варианты открывания из HL OpenVariant (id=8) */
$openVariants = [];
$openIds = $props['OPEN_VARIANT_IDS']['VALUE'] ?? [];
if (!is_array($openIds)) $openIds = array_filter([$openIds]);
if (!empty($openIds)) {
    try {
        $hlOpen    = \Bitrix\Highloadblock\HighloadBlockTable::getById(8)->fetch();
        $entity    = \Bitrix\Highloadblock\HighloadBlockTable::compileEntity($hlOpen);
        $dataClass = $entity->getDataClass();
        $res = $dataClass::getList([
            'filter' => ['ID' => array_map('intval', $openIds)],
            'select' => ['ID', 'UF_NAME', 'UF_FILE', 'UF_XML_ID'],
        ]);
        while ($row = $res->fetch()) {
            $row['FILE_PATH'] = $row['UF_FILE'] ? CFile::GetPath($row['UF_FILE']) : '';
            $openVariants[] = $row;
        }
    } catch (\Exception $e) {}
}

/* Наценки из HL PriceNacenka (id=7) */
$surcharges = [];
try {
    $hlPrice   = \Bitrix\Highloadblock\HighloadBlockTable::getById(7)->fetch();
    $entity    = \Bitrix\Highloadblock\HighloadBlockTable::compileEntity($hlPrice);
    $dataClass = $entity->getDataClass();
    $res = $dataClass::getList(['select' => ['UF_XML_ID', 'UF_NAME', 'UF_PRICE']]);
    while ($row = $res->fetch()) {
        $surcharges[$row['UF_XML_ID']] = $row;
    }
} catch (\Exception $e) {}

$enamelPGPrice = (float)($surcharges['surcharge_enamel_pg']['UF_PRICE'] ?? 12780);
$enamelPOPrice = (float)($surcharges['surcharge_enamel_po']['UF_PRICE'] ?? 14200);

/* JSON-конфиг для shop.js / product.js */
$configData = json_encode([
    'id'                  => (int)$item['ID'],
    'name'                => $name,
    'code'                => $code,
    'collection'          => $collection,
    'price_base'          => $priceBase,
    'has_glazing'         => $hasGlazing,
    'has_molding'         => $hasMolding,
    'has_alu_edge'        => $hasAluEdge,
    'blade_po_price'      => $bladePOPrice,
    'surcharge_enamel_pg' => $enamelPGPrice,
    'surcharge_enamel_po' => $enamelPOPrice,
    'glasses'             => $glasses,
    'open_variants'       => $openVariants,
], JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP);
?>

<main class="product-page">

  <!-- Хлебные крошки -->
  <nav class="breadcrumbs" aria-label="Хлебные крошки">
    <?php $navChain = $APPLICATION->GetNavChain(false, true); ?>
    <?php foreach ($navChain as $idx => $crumb): ?>
      <?php if ($idx < count($navChain) - 1): ?>
        <a class="breadcrumbs__link" href="<?= htmlspecialchars($crumb['LINK']) ?>">
          <?= htmlspecialchars($crumb['TITLE']) ?>
        </a>
        <span class="breadcrumbs__sep">–</span>
      <?php else: ?>
        <span class="breadcrumbs__current"><?= htmlspecialchars($crumb['TITLE']) ?></span>
      <?php endif; ?>
    <?php endforeach; ?>
  </nav>

  <div class="product"
       data-item-id="<?= (int)$item['ID'] ?>"
       data-collection="<?= $collection ?>"
       data-has-glazing="<?= $hasGlazing ? 'true' : 'false' ?>"
       data-has-molding="<?= $hasMolding ? 'true' : 'false' ?>">

    <!-- Галерея -->
    <div class="product__gallery product__gallery-col">
      <div class="product__thumbs">
        <?php
        // Первый thumb — detailImg
        $allThumbs = [];
        if ($detailImg) $allThumbs[] = ['src' => $detailImg, 'alt' => $name];
        foreach ($galleryPaths as $gp) {
            $allThumbs[] = ['src' => $gp, 'alt' => $name];
        }
        foreach ($allThumbs as $tidx => $thumb):
        ?>
          <button type="button"
                  class="product__thumb<?= $tidx === 0 ? ' product__thumb_active' : '' ?>"
                  aria-pressed="<?= $tidx === 0 ? 'true' : 'false' ?>"
                  tabindex="0" title="Вид <?= $tidx + 1 ?>">
            <img src="<?= htmlspecialchars($thumb['src']) ?>"
                 alt="<?= htmlspecialchars($thumb['alt']) ?>"
                 width="100" height="100">
          </button>
        <?php endforeach; ?>
      </div>

      <div class="product__main-image" role="region" aria-label="Основное изображение">
        <button type="button" class="product__arrow product__arrow_prev"
                aria-label="Показать предыдущее фото"></button>
        <?php if ($detailImg): ?>
          <img src="<?= htmlspecialchars($detailImg) ?>" alt="<?= $name ?>"
               width="560" height="560" loading="eager">
        <?php endif; ?>
        <button type="button" class="product__arrow product__arrow_next"
                aria-label="Показать следующее фото"></button>
      </div>
    </div>

    <!-- Информация о товаре -->
    <div class="product__info product__info-col">
      <h1 class="product__title"><?= $name ?></h1>

      <!-- Тип полотна ПГ/ПО (только если есть остеклённый вариант) -->
      <?php if ($hasGlazing && $bladePOPrice > 0): ?>
      <div class="blade-type-selector" id="bladeTypeSelector">
        <p class="blade-type-selector__label">Тип полотна</p>
        <div class="blade-type-selector__options">
          <button class="product__blade-btn product__blade-btn_active"
                  data-blade="pg" data-surcharge="0" type="button">
            <img class="product__blade-corner"
                 src="/images/blade-types/pg-corner.jpg"
                 alt="Глухое полотно"
                 onerror="this.style.display='none'">
            <span class="product__blade-name">ПГ — Глухое</span>
          </button>
          <button class="product__blade-btn"
                  data-blade="po"
                  data-surcharge="<?= $bladePOPrice ?>"
                  type="button">
            <img class="product__blade-corner"
                 src="/images/blade-types/po-corner.jpg"
                 alt="Остеклённое полотно"
                 onerror="this.style.display='none'">
            <span class="product__blade-name">ПО — Остеклённое</span>
            <span class="product__blade-price">+<?= number_format($bladePOPrice, 0, '.', ' ') ?> ₽</span>
          </button>
        </div>
      </div>
      <?php endif; ?>

      <!-- Размеры -->
      <div class="product__option">
        <div class="product__option-header">
          <span class="product__option-label">Размер полотна:</span>
          <span class="product__option-value">2000×600</span>
        </div>
        <div class="product__sizes">
          <button type="button" class="product__size">2000×800</button>
          <button type="button" class="product__size">2000×700</button>
          <button type="button" class="product__size product__size_active">2000×600</button>
          <button type="button" class="product__size">2000×900</button>
          <button type="button" class="product__size product__size_measure">Нужен замер</button>
          <button type="button" class="product__size product__size_own">Свой размер</button>
        </div>
      </div>

      <!-- Цена и кнопки -->
      <div class="product__price-block">
        <p class="product__price">от <?= number_format($priceBase, 0, '.', ' ') ?> ₽</p>
        <span class="product__price-note">цена за полотно</span>
        <div class="product__actions">
          <button type="button" class="product__btn product__btn_cart">
            <span class="product__btn-icon product__btn-icon_cart" aria-hidden="true"></span>
            Добавить в корзину
          </button>
          <button type="button" class="product__btn product__btn_wishlist"
                  aria-label="В избранное"></button>
        </div>
        <button type="button" class="product__btn product__btn_config"
                data-open-config>
          <img src="/images/0203 vuesax 04 conf.svg" alt="" width="20" height="20" aria-hidden="true">
          Конструктор
        </button>
      </div>
    </div>
  </div>

  <!-- Описание -->
  <?php if ($description): ?>
  <section class="product-section product-section_desc">
    <h2 class="product-section__title">Описание</h2>
    <div class="product-section__text"><?= $description ?></div>
  </section>
  <?php endif; ?>

  <!-- Характеристики -->
  <section class="product-section product-section_specs">
    <h2 class="product-section__title">Характеристики двери</h2>
    <div class="product-specs">
      <div class="product-specs__row">
        <div class="product-specs__label">Высота</div>
        <div class="product-specs__value">1900–2200 мм</div>
      </div>
      <div class="product-specs__row">
        <div class="product-specs__label">Ширина</div>
        <div class="product-specs__value">600–900 мм</div>
      </div>
      <div class="product-specs__row">
        <div class="product-specs__label">Толщина</div>
        <div class="product-specs__value">40 мм</div>
      </div>
      <?php if ($collection): ?>
      <div class="product-specs__row">
        <div class="product-specs__label">Коллекция</div>
        <div class="product-specs__value"><?= $collection ?></div>
      </div>
      <?php endif; ?>
    </div>
  </section>

  <!-- Другие модели в коллекции -->
  <?php
  if ($collection) {
      $relRes = CIBlockElement::GetList(
          ['SORT' => 'ASC'],
          [
              'IBLOCK_ID'         => $iblock,
              'ACTIVE'            => 'Y',
              '!ID'               => (int)$item['ID'],
              'PROPERTY_COLLECTION' => $props['COLLECTION']['VALUE'],
          ],
          false,
          ['nTopCount' => 4],
          ['ID', 'NAME', 'CODE', 'PREVIEW_PICTURE', 'DETAIL_PAGE_URL', 'PROPERTY_PRICE_BASE']
      );
      $relItems = [];
      while ($r = $relRes->GetNext()) $relItems[] = $r;
  }
  ?>
  <?php if (!empty($relItems)): ?>
  <section class="product-section product-section_related">
    <h2 class="product-section__title">Другие модели в коллекции</h2>
    <div class="section__cards section__cards_wrap product-section__cards">
      <?php foreach ($relItems as $r):
        $rImg   = $r['PREVIEW_PICTURE'] ? CFile::GetPath($r['PREVIEW_PICTURE']) : '';
        $rPrice = (int)($r['PROPERTY_PRICE_BASE_VALUE'] ?? 0);
      ?>
        <article class="card">
          <div class="card__image-wrap">
            <?php if ($rImg): ?>
            <img class="card__image" src="<?= htmlspecialchars($rImg) ?>"
                 alt="<?= htmlspecialchars($r['NAME']) ?>" width="288" height="320">
            <?php endif; ?>
          </div>
          <div class="card__info">
            <h3 class="card__title">
              <a href="<?= htmlspecialchars($r['DETAIL_PAGE_URL']) ?>">
                <?= htmlspecialchars($r['NAME']) ?>
              </a>
            </h3>
            <?php if ($rPrice > 0): ?>
            <p class="card__price">от <?= number_format($rPrice, 0, '.', ' ') ?> ₽</p>
            <?php endif; ?>
          </div>
        </article>
      <?php endforeach; ?>
    </div>
  </section>
  <?php endif; ?>

  <!-- Блок консультации -->
  <section class="product-help">
    <div class="product-help__content">
      <p class="product-help__kicker">Консультация специалиста</p>
      <h2 class="product-help__title">Нужна помощь?</h2>
      <p class="product-help__text">Ответим на все вопросы и поможем<br>сделать правильный выбор</p>
      <button type="button" class="product-help__btn product__btn product__btn_cart">
        Нужна помощь
      </button>
    </div>
    <div class="product-help__image-wrap" aria-hidden="true">
      <img class="product-help__image" src="/images/hero-bg.svg" alt="" width="960" height="360">
    </div>
  </section>

</main>

<!-- Данные двери для JS-конфигуратора -->
<script>
window.DOOR_CONFIG = <?= $configData ?>;
</script>

<!-- Компонент конфигуратора (попап) -->
<?php $APPLICATION->IncludeComponent(
    'dveryaninov:configurator',
    '',
    [
        'IBLOCK_ID'    => $iblock,
        'ELEMENT_ID'   => (int)$item['ID'],
        'ELEMENT_CODE' => $code,
    ]
); ?>
