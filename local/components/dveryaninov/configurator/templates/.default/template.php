<?php
/**
 * /local/components/dveryaninov/configurator/templates/.default/template.php
 * Шаблон попапа конфигуратора.
 * HTML-структура взята из constructor-template.html,
 * статические секции заменены на PHP-циклы из HL/инфоблоков.
 */
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

$glasses      = $arResult['GLASSES'];
$surcharges   = $arResult['SURCHARGES'];
$openVariants = $arResult['OPEN_VARIANTS'];
$aluEdges     = $arResult['ALU_EDGES'];
$coatings     = $arResult['COATINGS'];
$molding      = $arResult['MOLDING'];
$hardware     = $arResult['HARDWARE'];

/* Разбить покрытия по типам */
$coatingsByType = ['pvc' => [], 'pet' => [], 'enamel' => []];
foreach ($coatings as $c) {
    $type = $c['COATING_TYPE'] ?? 'pvc';
    $coatingsByType[$type][] = $c;
}

/* Разбить фурнитуру по группам */
$hwByGroup = [];
foreach ($hardware as $hw) {
    $group = $hw['PROPERTY_HW_GROUP_VALUE'] ?? 'other';
    $hwByGroup[$group][] = $hw;
}

/* Разбить погонаж по типу системы */
$moldingBySystem = ['telescope' => [], 'coplanar' => []];
foreach ($molding as $m) {
    $sys = $m['PROPERTY_SYSTEM_TYPE_VALUE'] ?? 'telescope';
    $key = (mb_strpos(mb_strtolower($sys), 'компл') !== false) ? 'coplanar' : 'telescope';
    $moldingBySystem[$key][] = $m;
}
?>

<!-- ======================================================
     МОДАЛ КОНФИГУРАТОРА (3 шага)
     Соответствует #configModal из constructor-template.html
     ====================================================== -->
<div class="cfg-modal" id="configModal" aria-hidden="true"
     role="dialog" aria-modal="true" aria-label="Конструктор двери">

  <!-- Левая половина — изображение двери -->
  <div class="cfg-modal__image" id="cfgImage">
    <img src="/images/card-door-1.svg" alt="Изображение двери" id="cfgImageEl">
  </div>

  <!-- Правая половина — параметры -->
  <div class="cfg-modal__side">

    <!-- Верхняя панель: steper + кнопка закрыть -->
    <div class="cfg-modal__topbar">
      <button class="cfg-modal__back-btn" type="button" aria-label="Предыдущий шаг" id="cfgBackBtn">
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
          <path d="M7 1L1 7l6 6" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="cfg-stepper" aria-label="Шаги конфигуратора">
        <div class="cfg-stepper__step cfg-stepper__step_active" data-step-tab="config">
          <span class="cfg-stepper__num">1</span>
          <span class="cfg-stepper__label">Конфигурация двери</span>
        </div>
        <span class="cfg-stepper__line" aria-hidden="true"></span>
        <div class="cfg-stepper__step" data-step-tab="molding">
          <span class="cfg-stepper__num">2</span>
          <span class="cfg-stepper__label">Погонаж</span>
        </div>
        <span class="cfg-stepper__line" aria-hidden="true"></span>
        <div class="cfg-stepper__step" data-step-tab="hardware">
          <span class="cfg-stepper__num">3</span>
          <span class="cfg-stepper__label">Фурнитура</span>
        </div>
      </div>
      <button class="cfg-modal__close" type="button"
              aria-label="Закрыть конфигуратор" data-close-config>Закрыть ×</button>
    </div>

    <div class="cfg-modal__door-info" id="cfgDoorInfo">
      <p class="cfg-modal__door-name" id="cfgDoorName"></p>
      <p class="cfg-modal__door-price">от <span id="cfgDoorBasePrice">52 000</span> ₽</p>
    </div>

    <!-- Прокручиваемый блок параметров -->
    <div class="cfg-modal__params">

      <!-- ================================================ -->
      <!-- ШАГ 1: Конфигурация двери                        -->
      <!-- ================================================ -->
      <section class="config-step config-step_active" data-step="config"
               aria-label="Конфигурация двери">

        <!-- Модель (статично, заполняется из window.DOOR_CONFIG через JS) -->
        <div class="config-detail-item">
          <div class="config-detail-header">
            <span class="config-detail-label">Модель</span>
            <span class="config-detail-value" id="cfgModelDisplay"></span>
          </div>
        </div>

        <!-- Размер полотна -->
        <div class="config-detail-item">
          <div class="config-detail-header">
            <span class="config-detail-label">Размер полотна</span>
            <span class="config-detail-value">2000×600</span>
            <button class="config-detail-toggle" type="button"
                    aria-expanded="false" aria-label="Показать опции"></button>
          </div>
          <div class="config-detail-options" id="cfgSizeOptions"></div>
        </div>

        <!-- Тип покрытия -->
        <div class="config-detail-item" id="cfgCoatingTypeItem">
          <div class="config-detail-header">
            <span class="config-detail-label">Тип покрытия</span>
            <span class="config-detail-value">ПВХ</span>
            <button class="config-detail-toggle" type="button"
                    aria-expanded="false" aria-label="Показать опции"></button>
          </div>
          <div class="config-detail-options" id="cfgCoatingTypeOptions"></div>
        </div>

        <!-- Покрытие (цвет/фактура) — динамически из HL Coatings -->
        <div class="config-detail-item">
          <div class="config-detail-header">
            <span class="config-detail-label">Покрытие</span>
            <span class="config-detail-value" id="cfgCoatingDisplay">—</span>
            <button class="config-detail-toggle" type="button"
                    aria-expanded="false" aria-label="Показать опции"></button>
          </div>
          <div class="config-detail-options" id="cfgCoatingsContainer">
            <?php foreach (['pvc' => 'ПВХ', 'pet' => 'ПЭТ', 'enamel' => 'Эмаль'] as $type => $label): ?>
              <?php if (empty($coatingsByType[$type])) continue; ?>
              <div class="cfg-coatings-group" data-coating-type="<?= $type ?>">
                <p class="cfg-coatings-group__title"><?= $label ?></p>
                <div class="cfg-coatings-group__swatches">
                  <?php foreach ($coatingsByType[$type] as $coating):
                    $hex   = htmlspecialchars($coating['UF_HEX'] ?? '#cccccc');
                    $img   = $coating['FILE_PATH'] ?? '';
                    $cName = htmlspecialchars($coating['UF_NAME'] ?? '');
                    $bgStyle = $img
                      ? "background-image:url('" . htmlspecialchars($img) . "');background-size:cover;"
                      : "background:{$hex};";
                  ?>
                    <button class="cfg-coating-swatch"
                            data-coating="<?= $cName ?>"
                            data-type="<?= $type ?>"
                            type="button" title="<?= $cName ?>">
                      <span class="cfg-coating-swatch__color" style="<?= $bgStyle ?>"></span>
                      <span class="cfg-coating-swatch__label"><?= $cName ?></span>
                    </button>
                  <?php endforeach; ?>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        </div>

        <!-- Остекление — динамически из HL Glass -->
        <div class="cfg-section" id="cfgGlazingSection">
          <div class="cfg-section__header config-detail-header cfg-section__header_toggle"
               data-section-toggle>
            <span class="config-detail-label">Остекление</span>
            <span class="config-detail-value" data-radio-display="glazing">—</span>
            <button class="config-detail-toggle" type="button"
                    aria-expanded="false" aria-label="Свернуть"></button>
          </div>
          <div class="cfg-section__body cfg-radio-group" data-radio-group="glazing"
               id="cfgGlazingOptions">
            <!-- «Без стекла» -->
            <div class="cfg-item cfg-item_active"
                 data-radio-value="Без стекла" data-pick="glazing" data-price="0">
              <div class="cfg-item__thumb">
                <span style="font:400 12px Manrope;color:#999">—</span>
              </div>
              <div class="cfg-item__info">
                <span class="cfg-item__name config-item__title">Без стекла</span>
              </div>
            </div>
            <?php foreach ($glasses as $glass):
              $gName  = htmlspecialchars($glass['UF_NAME'] ?? '');
              $gFile  = $glass['FILE_PATH'] ?? '';
              $gPrice = (int)($glass['UF_PRICE'] ?? 0);
            ?>
              <div class="cfg-item"
                   data-radio-value="<?= $gName ?>"
                   data-pick="glazing"
                   data-price="<?= $gPrice ?>">
                <div class="cfg-item__thumb">
                  <?php if ($gFile): ?>
                  <img src="<?= htmlspecialchars($gFile) ?>" alt="<?= $gName ?>" loading="lazy">
                  <?php endif; ?>
                </div>
                <div class="cfg-item__info">
                  <span class="cfg-item__name config-item__title"><?= $gName ?></span>
                  <?php if ($gPrice > 0): ?>
                  <span class="cfg-item__spec config-item__spec">
                    +<?= number_format($gPrice, 0, '.', ' ') ?> ₽
                  </span>
                  <?php endif; ?>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        </div>

        <!-- Гравировка на стекле (скрыта по умолчанию) -->
        <div class="cfg-section" id="cfgEngravingSection" style="display:none">
          <div class="cfg-section__header config-detail-header cfg-section__header_toggle"
               data-section-toggle>
            <span class="config-detail-label">Гравировка на стекле</span>
            <span class="config-detail-value" data-radio-display="engraving">Без гравировки</span>
            <button class="config-detail-toggle" type="button"
                    aria-expanded="false" aria-label="Свернуть"></button>
          </div>
          <div class="cfg-section__body cfg-radio-group" data-radio-group="engraving"
               id="cfgEngravingOptions"></div>
        </div>

        <!-- Алюминиевая кромка — динамически из HL AluEdges -->
        <div class="cfg-section" id="cfgAluEdgeSection" style="display:none">
          <div class="cfg-section__header config-detail-header cfg-section__header_toggle"
               data-section-toggle>
            <span class="config-detail-label">Алюминиевая кромка</span>
            <span class="config-detail-value" data-radio-display="alu-edge">Без кромки</span>
            <button class="config-detail-toggle" type="button"
                    aria-expanded="false" aria-label="Свернуть"></button>
          </div>
          <div class="cfg-section__body cfg-radio-group" data-radio-group="alu-edge"
               id="cfgAluEdgeOptions">
            <div class="cfg-item cfg-item_active"
                 data-radio-value="Без кромки" data-pick="alu-edge" data-price="0">
              <div class="cfg-item__info">
                <span class="cfg-item__name config-item__title">Без кромки</span>
              </div>
            </div>
            <?php foreach ($aluEdges as $edge):
              $eName  = htmlspecialchars($edge['UF_NAME'] ?? '');
              $eFile  = $edge['FILE_PATH'] ?? '';
              $eColor = htmlspecialchars($edge['UF_COLOR'] ?? 'chrome');
              $ePrice = (int)($edge['UF_PRICE'] ?? 0);
            ?>
              <div class="cfg-item"
                   data-radio-value="<?= $eName ?>"
                   data-pick="alu-edge"
                   data-hw-color="<?= $eColor ?>"
                   data-price="<?= $ePrice ?>">
                <div class="cfg-item__thumb">
                  <?php if ($eFile): ?>
                  <img src="<?= htmlspecialchars($eFile) ?>" alt="<?= $eName ?>" loading="lazy">
                  <?php endif; ?>
                </div>
                <div class="cfg-item__info">
                  <span class="cfg-item__name config-item__title"><?= $eName ?></span>
                  <?php if ($ePrice > 0): ?>
                  <span class="cfg-item__spec config-item__spec">
                    +<?= number_format($ePrice, 0, '.', ' ') ?> ₽
                  </span>
                  <?php endif; ?>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        </div>

        <!-- Молдинги (скрыт по умолчанию) -->
        <div class="cfg-section" id="cfgMoldingsSection" style="display:none">
          <div class="cfg-section__header config-detail-header cfg-section__header_toggle"
               data-section-toggle>
            <span class="config-detail-label">Молдинги</span>
            <span class="config-detail-value" data-radio-display="moldings">—</span>
            <button class="config-detail-toggle" type="button"
                    aria-expanded="false" aria-label="Свернуть"></button>
          </div>
          <div class="cfg-section__body cfg-radio-group" data-radio-group="moldings"
               id="cfgMoldingsOptions"></div>
        </div>

        <!-- Вариант открывания — динамически из HL OpenVariant -->
        <div class="cfg-section">
          <div class="cfg-section__header config-detail-header cfg-section__header_toggle"
               data-section-toggle>
            <span class="config-detail-label">Вариант открывания</span>
            <span class="config-detail-value" data-radio-display="opening-system">
              Распашные прямые
            </span>
            <button class="config-detail-toggle" type="button"
                    aria-expanded="false" aria-label="Свернуть"></button>
          </div>
          <div class="cfg-section__body cfg-radio-group" data-radio-group="opening-system">
            <?php if (!empty($openVariants)):
              foreach ($openVariants as $idx => $ov):
                $ovName = htmlspecialchars($ov['UF_NAME'] ?? '');
                $ovFile = $ov['FILE_PATH'] ?? '';
            ?>
              <div class="cfg-item <?= $idx === 0 ? 'cfg-item_active' : '' ?>"
                   data-radio-value="<?= $ovName ?>" data-price="0">
                <div class="cfg-item__thumb cfg-item__thumb_gif">
                  <?php if ($ovFile): ?>
                  <img src="<?= htmlspecialchars($ovFile) ?>" alt="<?= $ovName ?>" loading="lazy">
                  <?php endif; ?>
                </div>
                <div class="cfg-item__info">
                  <span class="cfg-item__name config-item__title"><?= $ovName ?></span>
                </div>
              </div>
            <?php endforeach; else: ?>
              <!-- Статик-фолбэк если HL-блок пуст -->
              <div class="cfg-item cfg-item_active" data-radio-value="Распашные прямые" data-price="0">
                <div class="cfg-item__thumb cfg-item__thumb_gif">
                  <img src="/images/Вариант открывания/Распашные прямые.gif"
                       alt="Распашные прямые" loading="lazy">
                </div>
                <div class="cfg-item__info">
                  <span class="cfg-item__name config-item__title">Распашные прямые</span>
                </div>
              </div>
            <?php endif; ?>
          </div>
        </div>

        <!-- Тип открывания (левое/правое — статичные варианты) -->
        <div class="cfg-section">
          <div class="cfg-section__header config-detail-header cfg-section__header_toggle"
               data-section-toggle>
            <span class="config-detail-label">Тип открывания</span>
            <span class="config-detail-value" data-radio-display="opening-type">Левое на себя</span>
            <button class="config-detail-toggle" type="button"
                    aria-expanded="false" aria-label="Свернуть"></button>
          </div>
          <div class="cfg-section__body cfg-radio-group" data-radio-group="opening-type">
            <?php
            $openTypes = [
                ['Левое на себя',   'левое на себя'],
                ['Левое от себя',   'левое от себя'],
                ['Правое на себя',  'правое на себя'],
                ['Правое от себя',  'правое от себя'],
            ];
            foreach ($openTypes as $idx => [$label, $imgName]):
            ?>
              <div class="cfg-item <?= $idx === 0 ? 'cfg-item_active' : '' ?>"
                   data-radio-value="<?= htmlspecialchars($label) ?>" data-price="0">
                <div class="cfg-item__thumb">
                  <img src="/images/открывание/<?= htmlspecialchars($imgName) ?>.jpg"
                       alt="<?= htmlspecialchars($label) ?>" loading="lazy">
                </div>
                <div class="cfg-item__info">
                  <span class="cfg-item__name config-item__title">
                    <?= htmlspecialchars($label) ?>
                  </span>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        </div>

      </section><!-- /ШАГ 1 -->

      <!-- ================================================ -->
      <!-- ШАГ 2: Погонаж                                   -->
      <!-- ================================================ -->
      <section class="config-step" data-step="molding" aria-label="Погонаж">

        <!-- Стойка короба -->
        <div class="cfg-section">
          <div class="cfg-section__header config-detail-header cfg-section__header_toggle"
               data-section-toggle>
            <span class="config-detail-label">Стойка короба</span>
            <span class="config-detail-value" data-radio-display="box">—</span>
            <button class="config-detail-toggle" type="button"
                    aria-expanded="false" aria-label="Свернуть"></button>
          </div>
          <div class="cfg-section__body cfg-radio-group" data-radio-group="box"
               id="cfgBoxOptions"></div>
        </div>

        <!-- Наличник — первая сторона -->
        <div class="cfg-section" id="cfgCasingSide1Section">
          <div class="cfg-section__header config-detail-header cfg-section__header_toggle"
               data-section-toggle>
            <span class="config-detail-label">Наличник — первая сторона</span>
            <span class="config-detail-value" data-radio-display="casing-side1">—</span>
            <button class="config-detail-toggle" type="button"
                    aria-expanded="false" aria-label="Свернуть"></button>
          </div>
          <div class="cfg-section__body cfg-radio-group" data-radio-group="casing-side1"
               id="cfgCasingSide1Options"></div>
        </div>

        <!-- Наличник — вторая сторона (скрыт) -->
        <div class="cfg-section" id="cfgCasingSide2Section" style="display:none">
          <div class="cfg-section__header config-detail-header cfg-section__header_toggle"
               data-section-toggle>
            <span class="config-detail-label">Наличник — вторая сторона</span>
            <span class="config-detail-value" data-radio-display="casing-side2">—</span>
            <button class="config-detail-toggle" type="button"
                    aria-expanded="false" aria-label="Свернуть"></button>
          </div>
          <div class="cfg-section__body cfg-radio-group" data-radio-group="casing-side2"
               id="cfgCasingSide2Options"></div>
        </div>

        <!-- Добор -->
        <div class="cfg-section">
          <div class="cfg-section__header config-detail-header cfg-section__header_toggle"
               data-section-toggle>
            <span class="config-detail-label">Добор</span>
            <span class="config-detail-value" data-radio-display="dobor">Без добора</span>
            <button class="config-detail-toggle" type="button"
                    aria-expanded="false" aria-label="Свернуть"></button>
          </div>
          <div class="cfg-section__body cfg-radio-group" data-radio-group="dobor"
               id="cfgDoborOptions">
            <?php
            // Статические доборы (ширина 100/150/200 мм)
            // Динамические данные заполняются из инфоблока погонажа через shop.js
            $doborWidths = [100, 150, 200];
            foreach ($doborWidths as $dw):
            ?>
              <div class="cfg-item"
                   data-radio-value="Добор <?= $dw ?> мм" data-price="0"
                   data-dobor-width="<?= $dw ?>">
                <div class="cfg-item__info">
                  <span class="cfg-item__name config-item__title">Добор <?= $dw ?> мм</span>
                </div>
              </div>
            <?php endforeach; ?>
            <div class="cfg-item cfg-item_active"
                 data-radio-value="Без добора" data-price="0">
              <div class="cfg-item__info">
                <span class="cfg-item__name config-item__title">Без добора</span>
              </div>
            </div>
          </div>
        </div>

        <?php if (!empty($molding)): ?>
        <!-- Позиции погонажа из инфоблока -->
        <?php foreach (['telescope' => 'Телескопическая система', 'coplanar' => 'Компланарная система'] as $sysKey => $sysLabel): ?>
          <?php if (empty($moldingBySystem[$sysKey])) continue; ?>
          <div class="cfg-molding-group">
            <h3 class="cfg-section__sub-title"><?= $sysLabel ?></h3>
            <?php foreach ($moldingBySystem[$sysKey] as $m):
              $mName      = htmlspecialchars($m['NAME']);
              $mPhoto     = $m['PHOTO_PATH'] ?? '';
              $mPricePvc  = (int)($m['PROPERTY_PRICE_PVC_VALUE'] ?? 0);
              $mPriceEnam = (int)($m['PROPERTY_PRICE_ENAMEL_VALUE'] ?? 0);
              $mDobor     = (int)($m['PROPERTY_DOBOR_WIDTH_VALUE'] ?? 0);
            ?>
              <div class="cfg-item cfg-molding-list"
                   data-molding-id="<?= (int)$m['ID'] ?>"
                   data-price-pvc="<?= $mPricePvc ?>"
                   data-price-enamel="<?= $mPriceEnam ?>">
                <div class="cfg-item__thumb">
                  <?php if ($mPhoto): ?>
                  <img src="<?= htmlspecialchars($mPhoto) ?>" alt="<?= $mName ?>" loading="lazy">
                  <?php endif; ?>
                </div>
                <div class="cfg-item__info">
                  <span class="cfg-item__name config-item__title"><?= $mName ?></span>
                  <?php if ($mDobor > 0): ?>
                  <span class="cfg-item__spec config-item__spec">Ширина: <?= $mDobor ?> мм</span>
                  <?php endif; ?>
                </div>
                <div class="cfg-item__qty-price">
                  <div class="cfg-item__qty">
                    <button class="cfg-qty-btn" data-qty="-1" type="button">−</button>
                    <input class="cfg-qty-input" type="number" value="1" min="0">
                    <button class="cfg-qty-btn" data-qty="+1" type="button">+</button>
                  </div>
                  <span class="cfg-item__price">
                    <?= number_format($mPricePvc, 0, '.', ' ') ?> ₽
                  </span>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        <?php endforeach; ?>
        <?php endif; ?>

      </section><!-- /ШАГ 2 -->

      <!-- ================================================ -->
      <!-- ШАГ 3: Фурнитура                                 -->
      <!-- ================================================ -->
      <section class="config-step" data-step="hardware" aria-label="Фурнитура">

        <!-- 1. Цвет фурнитуры -->
        <div class="cfg-section">
          <div class="cfg-section__header config-detail-header cfg-section__header_toggle"
               data-section-toggle>
            <span class="config-detail-label">Цвет фурнитуры</span>
            <span class="config-detail-value" data-radio-display="hw-color">Выберите цвет</span>
            <button class="config-detail-toggle" type="button"
                    aria-expanded="false" aria-label="Свернуть"></button>
          </div>
          <div class="cfg-section__body">
            <div class="cfg-color-grid">
              <button type="button" class="cfg-color-tile cfg-color-tile_active"
                      data-pick="hw-color" data-hw-color="black" data-price="0">
                <span class="cfg-color-tile__swatch">
                  <img src="/images/Цвет фурнитуры/черный.jpg" alt="Чёрный" loading="lazy">
                </span>
                <span class="cfg-color-tile__label">Чёрный</span>
              </button>
              <button type="button" class="cfg-color-tile"
                      data-pick="hw-color" data-hw-color="chrome" data-price="0">
                <span class="cfg-color-tile__swatch">
                  <img src="/images/Цвет фурнитуры/матовый хром.jpg" alt="Мат. хром" loading="lazy">
                </span>
                <span class="cfg-color-tile__label">Мат. хром</span>
              </button>
              <button type="button" class="cfg-color-tile"
                      data-pick="hw-color" data-hw-color="gold" data-price="0">
                <span class="cfg-color-tile__swatch">
                  <img src="/images/Цвет фурнитуры/матовое золото.jpg" alt="Мат. золото" loading="lazy">
                </span>
                <span class="cfg-color-tile__label">Мат. золото</span>
              </button>
              <button type="button" class="cfg-color-tile"
                      data-pick="hw-color" data-hw-color="nickel" data-price="0">
                <span class="cfg-color-tile__swatch">
                  <img src="/images/Цвет фурнитуры/матовый никель.jpg" alt="Мат. никель" loading="lazy">
                </span>
                <span class="cfg-color-tile__label">Мат. никель</span>
              </button>
              <button type="button" class="cfg-color-tile"
                      data-pick="hw-color" data-hw-color="brass" data-price="0">
                <span class="cfg-color-tile__swatch">
                  <img src="/images/Цвет фурнитуры/флорентийское золото.jpg"
                       alt="Флор. золото" loading="lazy">
                </span>
                <span class="cfg-color-tile__label">Флор. золото</span>
              </button>
              <button type="button" class="cfg-color-tile"
                      data-pick="hw-color" data-hw-color="emboss" data-price="0">
                <span class="cfg-color-tile__swatch">
                  <img src="/images/Цвет фурнитуры/итальянский тисненый.jpg"
                       alt="Итал. тисненый" loading="lazy">
                </span>
                <span class="cfg-color-tile__label">Итал. тисненый</span>
              </button>
            </div>
          </div>
        </div>

        <?php
        /* Если инфоблок Фурнитура заполнен — выводим из него,
           иначе — статик-фолбэк из constructor-template.html */
        $hwGroups = [
            'Ручки'       => 'handle',
            'Петли'       => 'hinges',
            'Защёлки'     => 'locker',
            'Ограничители'=> 'stopper',
        ];
        if (!empty($hardware)):
            foreach ($hwGroups as $groupLabel => $groupKey):
                $groupItems = $hwByGroup[$groupLabel] ?? [];
                if (empty($groupItems)) continue;
        ?>
        <!-- Группа фурнитуры: <?= $groupLabel ?> -->
        <div class="cfg-section">
          <div class="cfg-section__header config-detail-header cfg-section__header_toggle"
               data-section-toggle>
            <span class="config-detail-label"><?= $groupLabel ?></span>
            <span class="config-detail-value" data-radio-display="<?= $groupKey ?>">—</span>
            <button class="config-detail-toggle" type="button"
                    aria-expanded="false" aria-label="Свернуть"></button>
          </div>
          <div class="cfg-section__body cfg-radio-group" data-radio-group="<?= $groupKey ?>">
            <?php foreach ($groupItems as $hw):
              $hwName  = htmlspecialchars($hw['NAME']);
              $hwPhoto = $hw['PHOTO_PATH'] ?? '';
              $hwColor = htmlspecialchars($hw['PROPERTY_HW_COLOR_VALUE'] ?? 'any');
              $hwPrice = (int)($hw['PROPERTY_PRICE_VALUE'] ?? 0);
            ?>
              <div class="cfg-item"
                   data-radio-value="<?= $hwName ?>"
                   data-pick="<?= $groupKey ?>"
                   data-hw-color="<?= $hwColor ?>"
                   data-price="<?= $hwPrice ?>">
                <div class="cfg-item__thumb">
                  <?php if ($hwPhoto): ?>
                  <img src="<?= htmlspecialchars($hwPhoto) ?>" alt="<?= $hwName ?>" loading="lazy">
                  <?php endif; ?>
                </div>
                <div class="cfg-item__info">
                  <span class="cfg-item__name config-item__title"><?= $hwName ?></span>
                  <?php if ($hwPrice > 0): ?>
                  <span class="cfg-item__price-display">
                    <?= number_format($hwPrice, 0, '.', ' ') ?> ₽
                  </span>
                  <?php endif; ?>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        </div>
        <?php endforeach; else: ?>

        <!-- Статик-фолбэк: ручки, защёлки, петли, ограничители из constructor-template.html -->
        <div class="cfg-section">
          <div class="cfg-section__header config-detail-header cfg-section__header_toggle"
               data-section-toggle>
            <span class="config-detail-label">Модель ручки</span>
            <span class="config-detail-value" data-radio-display="handle">—</span>
            <button class="config-detail-toggle" type="button"
                    aria-expanded="true" aria-label="Свернуть"></button>
          </div>
          <div class="cfg-section__body cfg-radio-group" data-radio-group="handle"
               id="cfgHandleSection">
            <?php
            $handles = [
              ['Punto EXTRA',      810,  'black,nickel,gold',
               'Фурнитура/Punto EXTRA/Ручка Punto EXTRA BL-24 черный 810 руб..jpg'],
              ['Punto ROUND',      1580, 'black,chrome,gold',
               'Фурнитура/Punto ROUND/Ручка Punto  ROUND BL-24 черный 1580 руб..jpg'],
              ['Punto SELECT',     1280, 'black,nickel,gold',
               'Фурнитура/Punto SELECT/Ручка Punto SELECT BL-24 черный 1280 руб..jpg'],
              ['Punto STEP',       810,  'black,gold',
               'Фурнитура/Punto STEP/Ручка Punto STEP BL-24 черный 810 руб..jpg'],
              ['Fuaro ETALON',     1930, 'black,chrome,gold',
               'Фурнитура/Fuaro ETALON/Ручка Fuaro ETALON BL-24 черный 1930 руб..jpg'],
              ['Armadillo CREME',  3180, 'black,brass,emboss',
               'Фурнитура/Armadillo CREME/Ручка Armadillo CREME BL-26 черный 3180 руб..jpg'],
              ['Armadillo LACONY', 3350, 'black,brass,emboss',
               'Фурнитура/Armadillo LACONY/Ручка Armadillo LACONY BL-26 черный 3350 руб..jpg'],
              ['Armadillo SAVOIARDI', 3040, 'black,brass,emboss',
               'Фурнитура/Armadillo SAVOIARDI/Ручка Armadillo SAVOIARDI BL-26 черный 3040 руб..jpg'],
              ['Armadillo TWIN',   2490, 'black,emboss',
               'Фурнитура/Armadillo TWIN/Ручка Armadillo раздельная TWIN BL-26 черный 2490 руб..jpg'],
            ];
            foreach ($handles as $h):
              [$hName, $hPrice, $hColors, $hImg] = $h;
            ?>
              <div class="cfg-item"
                   data-radio-value="<?= htmlspecialchars($hName) ?>"
                   data-price="<?= $hPrice ?>"
                   data-hw-colors="<?= htmlspecialchars($hColors) ?>">
                <div class="cfg-item__thumb">
                  <img src="/images/<?= htmlspecialchars($hImg) ?>"
                       alt="<?= htmlspecialchars($hName) ?>" loading="lazy">
                </div>
                <div class="cfg-item__info">
                  <span class="cfg-item__name config-item__title">
                    <?= htmlspecialchars($hName) ?>
                  </span>
                  <span class="cfg-item__price-display">
                    <?= number_format($hPrice, 0, '.', ' ') ?> ₽
                  </span>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        </div>

        <!-- Защёлки — статик -->
        <div class="cfg-section">
          <div class="cfg-section__header config-detail-header cfg-section__header_toggle"
               data-section-toggle>
            <span class="config-detail-label">Защёлка</span>
            <span class="config-detail-value" data-radio-display="locker">—</span>
            <button class="config-detail-toggle" type="button"
                    aria-expanded="true" aria-label="Свернуть"></button>
          </div>
          <div class="cfg-section__body cfg-radio-group" data-radio-group="locker">
            <?php
            $lockers = [
              ['Гардиан Soft BL',  970, 'black',  'Фурнитура/защелки/Защелка Гардиан Soft 1М BL 970 руб..png'],
              ['Гардиан Soft MCR', 970, 'chrome', 'Фурнитура/защелки/Защелка Гардиан Soft 1М MCR 970 руб..png'],
              ['Гардиан Soft MG',  970, 'gold',   'Фурнитура/защелки/Защелка Гардиан Soft 1М MG 970 руб..jpg'],
              ['Гардиан Soft NI',  970, 'nickel', 'Фурнитура/защелки/Защелка Гардиан Soft 1М NI 970 руб..jpg'],
              ['AGB Polaris чёрный',   2700, 'black',
               'Фурнитура/защелки/Защелка WC AGB MEDIANA POLARIS черный 2700 руб..jpg'],
              ['AGB Polaris никель',   2160, 'nickel',
               'Фурнитура/защелки/Защелка WC AGB MEDIANA POLARIS никель 2160 руб..jpg'],
              ['AGB Polaris латунь',   2160, 'brass',
               'Фурнитура/защелки/Защелка WC AGB MEDIANA POLARIS латунь 2160 руб..jpg'],
              ['Без защёлки', 0, 'any', 'Without.svg'],
            ];
            foreach ($lockers as $l):
              [$lName, $lPrice, $lColor, $lImg] = $l;
            ?>
              <div class="cfg-item"
                   data-radio-value="<?= htmlspecialchars($lName) ?>"
                   data-price="<?= $lPrice ?>"
                   data-hw-color="<?= $lColor ?>">
                <div class="cfg-item__thumb">
                  <img src="/images/<?= htmlspecialchars($lImg) ?>"
                       alt="<?= htmlspecialchars($lName) ?>" loading="lazy">
                </div>
                <div class="cfg-item__info">
                  <span class="cfg-item__name config-item__title">
                    <?= htmlspecialchars($lName) ?>
                  </span>
                  <span class="cfg-item__spec config-item__spec">
                    <?= $lPrice > 0 ? number_format($lPrice, 0, '.', ' ') . ' ₽' : '0 ₽' ?>
                  </span>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        </div>

        <!-- Петли — статик -->
        <div class="cfg-section">
          <div class="cfg-section__header config-detail-header cfg-section__header_toggle"
               data-section-toggle>
            <span class="config-detail-label">Петли</span>
            <span class="config-detail-value" data-radio-display="hinges">—</span>
            <button class="config-detail-toggle" type="button"
                    aria-expanded="true" aria-label="Свернуть"></button>
          </div>
          <div class="cfg-section__body cfg-radio-group" data-radio-group="hinges">
            <?php
            $hinges = [
              ['AGB Eclipse чёрный', 2860, 'black',
               'Фурнитура/петли/Петля AGB  ECLIPSE 2.2 черный 2860 руб..jpg'],
              ['AGB Eclipse хром',  2410, 'chrome',
               'Фурнитура/петли/Петля AGB  ECLIPSE 2.2 матовый хром 2410 руб..jpg'],
              ['AGB Eclipse латунь', 2410, 'brass',
               'Фурнитура/петли/Петля AGB  ECLIPSE 2.2 матовая латунь 2410 руб..jpg'],
              ['Apecs чёрная',  240, 'black',
               'Фурнитура/петли/Петля врезная Apecs 100х70 B4 ВLM черный 240 руб..jpg'],
              ['Apecs хром',    240, 'chrome',
               'Фурнитура/петли/Петля врезная Apecs 100х70 B4 CRS матовый хром 240 руб..jpg'],
              ['Apecs золото',  240, 'gold',
               'Фурнитура/петли/Петля врезная Apecs 100х70 B4 GMS матовое золото 240 руб..jpg'],
              ['Apecs никель',  240, 'nickel',
               'Фурнитура/петли/Петля врезная Apecs 100х70 B4 NIS матовый никель 240 руб..jpg'],
              ['Armadillo флажковая чёрный', 860, 'black',
               'Фурнитура/петли/Петля флажковая Armadillo  черный 860 руб..jpg'],
              ['Armadillo флажковая хром',   860, 'chrome',
               'Фурнитура/петли/Петля флажковая Armadillo  матовый хром 860 руб..jpg'],
              ['Armadillo флажковая золото',  860, 'gold',
               'Фурнитура/петли/Петля флажковая Armadillo  матовое золото 860 руб..jpg'],
            ];
            foreach ($hinges as $h2):
              [$hName, $hPrice, $hColor, $hImg] = $h2;
            ?>
              <div class="cfg-item"
                   data-radio-value="<?= htmlspecialchars($hName) ?>"
                   data-price="<?= $hPrice ?>"
                   data-hw-color="<?= $hColor ?>">
                <div class="cfg-item__thumb">
                  <img src="/images/<?= htmlspecialchars($hImg) ?>"
                       alt="<?= htmlspecialchars($hName) ?>" loading="lazy">
                </div>
                <div class="cfg-item__info">
                  <span class="cfg-item__name config-item__title">
                    <?= htmlspecialchars($hName) ?>
                  </span>
                  <span class="cfg-item__spec config-item__spec">
                    <?= number_format($hPrice, 0, '.', ' ') ?> ₽
                  </span>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        </div>

        <!-- Ограничители — статик -->
        <div class="cfg-section">
          <div class="cfg-section__header config-detail-header cfg-section__header_toggle"
               data-section-toggle>
            <span class="config-detail-label">Ограничитель</span>
            <span class="config-detail-value" data-radio-display="stopper">—</span>
            <button class="config-detail-toggle" type="button"
                    aria-expanded="false" aria-label="Показать опции"></button>
          </div>
          <div class="cfg-section__body cfg-radio-group" data-radio-group="stopper">
            <?php
            $stoppers = [
              ['Apecs золотой DS-0014-GM',   240, 'gold',
               'Фурнитура/Ограничители/Упор дверной Apecs золотой DS-0014-GM 240 руб..jpg'],
              ['Apecs хром DS-0014-NIS',     240, 'emboss',
               'Фурнитура/Ограничители/Упор дверной Apecs хромированный (итальянский тиснёный) DS-0014-NIS 240 руб..jpg'],
              ['Магнитный скрытый',         1100, 'any',
               'Фурнитура/Ограничители/Упор дверной магнитный скрытый 1100 руб..jpg'],
              ['Apecs чёрный DS-0014-BLM',  240, 'black',
               'Фурнитура/Ограничители/Упор дверной чёрный Apecs DS-0014-BLM 240 руб..jpg'],
              ['Без ограничителя', 0, 'any', 'Without.svg'],
            ];
            foreach ($stoppers as $idx => $s):
              [$sName, $sPrice, $sColor, $sImg] = $s;
            ?>
              <div class="cfg-item <?= $idx === 0 ? 'cfg-item_active' : '' ?>"
                   data-radio-value="<?= htmlspecialchars($sName) ?>"
                   data-price="<?= $sPrice ?>"
                   data-hw-color="<?= $sColor ?>">
                <div class="cfg-item__thumb">
                  <img src="/images/<?= htmlspecialchars($sImg) ?>"
                       alt="<?= htmlspecialchars($sName) ?>" loading="lazy">
                </div>
                <div class="cfg-item__info">
                  <span class="cfg-item__name config-item__title">
                    <?= htmlspecialchars($sName) ?>
                  </span>
                  <span class="cfg-item__spec config-item__spec">
                    <?= $sPrice > 0 ? number_format($sPrice, 0, '.', ' ') . ' ₽' : '0 ₽' ?>
                  </span>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        </div>

        <?php endif; /* /фолбэк-статик */ ?>

      </section><!-- /ШАГ 3 -->

    </div><!-- /.cfg-modal__params -->

    <!-- Фиксированный футер с ценой и кнопками -->
    <div class="cfg-modal__footer">
      <div data-price-row="blade-surcharge" hidden>
        <span class="cfg-price-row__label">Полотно остеклённое</span>
        <span class="cfg-price-row__value">+14 200 ₽</span>
      </div>
      <div class="cfg-modal__price">
        Цена за комплект: от
        <strong><span class="config-total-price">52 000</span>&nbsp;₽</strong>
      </div>
      <div class="cfg-modal__actions">
        <button class="cfg-btn cfg-btn_outline" type="button" data-add-to-cart>
          ДОБАВИТЬ В КОРЗИНУ
        </button>
        <button class="cfg-btn cfg-btn_fill" type="button"
                data-next-step="molding" id="cfgNextBtn">
          ВЫБРАТЬ ПОГОНАЖ →
        </button>
      </div>
    </div>

  </div><!-- /.cfg-modal__side -->
</div><!-- /.cfg-modal (#configModal) -->

<!-- Все данные для JS-конфигуратора -->
<script>
window.CFG_DATA = {
  glasses:      <?= json_encode($glasses,      JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) ?>,
  surcharges:   <?= json_encode($surcharges,   JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) ?>,
  openVariants: <?= json_encode($openVariants, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) ?>,
  aluEdges:     <?= json_encode($aluEdges,     JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) ?>,
  coatings:     <?= json_encode($coatings,     JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) ?>,
  molding:      <?= json_encode($molding,      JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) ?>,
  hardware:     <?= json_encode($hardware,     JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) ?>,
};
</script>
