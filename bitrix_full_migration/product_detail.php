<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");

// Получаем ID элемента из URL или параметра
$elementID = intval($_REQUEST['ELEMENT_ID'] ?? 0);

if ($elementID > 0) {
    $rsElement = CIBlockElement::GetByID($elementID);
    if ($arElement = $rsElement->GetNext()) {
        $arProduct = CIBlockElement::GetList(
            [],
            ["ID" => $elementID],
            false,
            false,
            [
                "ID", "NAME", "CODE", "DETAIL_PICTURE", "PREVIEW_PICTURE", "DETAIL_TEXT",
                "PROPERTY_PRICE", "PROPERTY_COLLECTION", "PROPERTY_VARIANT",
                "PROPERTY_SIZES", "PROPERTY_COATINGS", "PROPERTY_HEIGHT",
                "PROPERTY_WIDTH", "PROPERTY_THICKNESS"
            ]
        )->GetNext();

        $arProps = [];
        $dbProps = CIBlockElement::GetProperty($arElement["IBLOCK_ID"], $elementID);
        while ($arProp = $dbProps->Fetch()) {
            $arProps[$arProp["CODE"]] = $arProp["VALUE"];
        }

        $APPLICATION->SetTitle($arProduct["NAME"]);
        $APPLICATION->SetPageProperty("description", "Межкомнатная дверь " . $arProduct["NAME"] . " от фабрики Дверянинов");
    }
} else {
    $APPLICATION->SetTitle("Товар не найден");
}
?>

<?php if ($elementID > 0 && $arProduct): ?>
<?php
// Include site header
$includeHeaderPath = $_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/includes/header.php";
if (file_exists($includeHeaderPath)) {
    include($includeHeaderPath);
}
?>

<main class="product-page">
    <nav class="breadcrumbs" aria-label="Хлебные крошки">
        <a class="breadcrumbs__link" href="/">Главная</a>
        <span class="breadcrumbs__sep">–</span>
        <a class="breadcrumbs__link" href="/catalog/">Каталог</a>
        <span class="breadcrumbs__sep">–</span>
        <?php if (!empty($arProps["COLLECTION"])): ?>
        <a class="breadcrumbs__link" href="/collections/<?= strtolower($arProps["COLLECTION"]) ?>/">Коллекция «<?= htmlspecialcharsbx($arProps["COLLECTION"]) ?>»</a>
        <span class="breadcrumbs__sep">–</span>
        <?php endif; ?>
        <span class="breadcrumbs__current"><?= htmlspecialcharsbx($arProduct["NAME"]) ?></span>
    </nav>

    <div class="product">
        <div class="product__gallery product__gallery-col">
            <div class="product__thumbs">
                <?php
                $images = [];
                if ($arProduct["DETAIL_PICTURE"]) {
                    $images[] = CFile::GetPath($arProduct["DETAIL_PICTURE"]);
                } elseif ($arProduct["PREVIEW_PICTURE"]) {
                    $images[] = CFile::GetPath($arProduct["PREVIEW_PICTURE"]);
                }

                foreach ($images as $idx => $imgSrc):
                ?>
                <button type="button" class="product__thumb <?= $idx === 0 ? 'product__thumb_active' : '' ?>" aria-pressed="<?= $idx === 0 ? 'true' : 'false' ?>" tabindex="0" title="Вид <?= $idx + 1 ?>">
                    <img src="<?= $imgSrc ?>" alt="<?= htmlspecialcharsbx($arProduct["NAME"]) ?>" width="100" height="100">
                </button>
                <?php endforeach; ?>
            </div>
            <div class="product__main-image" role="region" aria-label="Основное изображение">
                <?php if (count($images) > 1): ?>
                <button type="button" class="product__arrow product__arrow_prev" aria-label="Показать предыдущее фото"></button>
                <?php endif; ?>
                <img src="<?= $images[0] ?? SITE_TEMPLATE_PATH . '/images/card-placeholder.svg' ?>" alt="<?= htmlspecialcharsbx($arProduct["NAME"]) ?>" width="560" height="560" loading="lazy">
                <?php if (count($images) > 1): ?>
                <button type="button" class="product__arrow product__arrow_next" aria-label="Показать следующее фото"></button>
                <?php endif; ?>
            </div>
        </div>

        <div class="product__info product__info-col">
            <h1 class="product__title"><?= htmlspecialcharsbx($arProduct["NAME"]) ?></h1>

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

            <div class="product__option product__option_coating">
                <div class="product__option-header">
                    <span class="product__option-label">Покрытие:</span>
                    <span class="product__option-value">Бэйсик вайт ПЭТ</span>
                </div>
                <div class="product__colors">
                    <button type="button" class="product__color product__color_active" style="--color-swatch: #F5F5F0;" aria-label="Бэйсик вайт ПЭТ" title="Бэйсик вайт ПЭТ">
                        <span class="product__color-inner" style="background: #F5F5F0;"></span>
                    </button>
                    <button type="button" class="product__color" style="--color-swatch: #D3D3D3;" aria-label="Лайт грэй ПЭТ" title="Лайт грэй ПЭТ">
                        <span class="product__color-inner" style="background: #D3D3D3;"></span>
                    </button>
                    <button type="button" class="product__color product__color_more" aria-label="Ещё покрытий">+83</button>
                    <div class="product__color-custom-wrap">
                        <button type="button" class="product__size product__size_own">Свой цвет</button>
                    </div>
                </div>
            </div>

            <div class="product__price-block">
                <p class="product__price">от <?= number_format($arProps["PRICE"] ?? 23140, 0, ',', ' ') ?> ₽</p>
                <span class="product__price-note">цена за полотно</span>
                <div class="product__actions">
                    <button type="button" class="product__btn product__btn_cart">
                        <span class="product__btn-icon product__btn-icon_cart" aria-hidden="true"></span>
                        Добавить в корзину
                    </button>
                    <button type="button" class="product__btn product__btn_wishlist" aria-label="В избранное"></button>
                </div>
                <button type="button" class="product__btn product__btn_config" data-open-config>
                    <img src="<?= SITE_TEMPLATE_PATH ?>/images/0203 vuesax 04 conf.svg" alt="" width="20" height="20" aria-hidden="true"> Конструктор
                </button>
            </div>
        </div>
    </div>

    <section class="product-section product-section_desc">
        <h2 class="product-section__title">Описание</h2>
        <p class="product-section__text">
            <?= $arProduct["DETAIL_TEXT"] ?: htmlspecialcharsbx($arProduct["NAME"]) . " — межкомнатная дверь от фабрики Дверянинов. Высокое качество материалов и современный дизайн. Подходит для жилых и коммерческих помещений." ?>
        </p>
    </section>

    <section class="product-section product-section_specs">
        <h2 class="product-section__title">Характеристики двери</h2>
        <div class="product-specs">
            <div class="product-specs__row">
                <div class="product-specs__label">Высота</div>
                <div class="product-specs__value"><?= htmlspecialcharsbx($arProps["HEIGHT"] ?? "1900–2200 мм") ?></div>
            </div>
            <div class="product-specs__row">
                <div class="product-specs__label">Ширина</div>
                <div class="product-specs__value"><?= htmlspecialcharsbx($arProps["WIDTH"] ?? "600–900 мм") ?></div>
            </div>
            <div class="product-specs__row">
                <div class="product-specs__label">Толщина</div>
                <div class="product-specs__value"><?= htmlspecialcharsbx($arProps["THICKNESS"] ?? "40 мм") ?></div>
            </div>
        </div>
    </section>

    <?php if (!empty($arProps["COLLECTION"])): ?>
    <section class="product-section product-section_related">
        <h2 class="product-section__title">Другие модели в коллекции</h2>
        <div class="section__cards section__cards_wrap product-section__cards">
            <?php
            // Получаем другие товары из той же коллекции
            $rsRelated = CIBlockElement::GetList(
                ["SORT" => "ASC"],
                [
                    "IBLOCK_ID" => $arElement["IBLOCK_ID"],
                    "ACTIVE" => "Y",
                    "!ID" => $elementID,
                    "PROPERTY_COLLECTION" => $arProps["COLLECTION"]
                ],
                false,
                ["nTopCount" => 4],
                ["ID", "NAME", "CODE", "PREVIEW_PICTURE", "PROPERTY_PRICE"]
            );

            while ($arRelated = $rsRelated->GetNext()) {
                $relatedImg = $arRelated["PREVIEW_PICTURE"] ? CFile::GetPath($arRelated["PREVIEW_PICTURE"]) : SITE_TEMPLATE_PATH . "/images/card-placeholder.svg";
                ?>
                <article class="card">
                    <div class="card__image-wrap">
                        <img class="card__image" src="<?= $relatedImg ?>" alt="<?= htmlspecialcharsbx($arRelated["NAME"]) ?>" width="288" height="320">
                    </div>
                    <div class="card__info">
                        <h3 class="card__title">
                            <a href="/catalog/<?= $arRelated["CODE"] ?>/"><?= htmlspecialcharsbx($arRelated["NAME"]) ?></a>
                        </h3>
                        <p class="card__price">от <?= number_format($arRelated["PROPERTY_PRICE_VALUE"] ?? 23140, 0, ',', ' ') ?> ₽</p>
                    </div>
                </article>
                <?php
            }
            ?>
        </div>
    </section>
    <?php endif; ?>

    <section class="product-help">
        <div class="product-help__content">
            <p class="product-help__kicker">Консультация специалиста</p>
            <h2 class="product-help__title">Нужна помощь?</h2>
            <p class="product-help__text">Ответим на все вопросы и поможем<br>сделать правильный выбор</p>
            <button type="button" class="product-help__btn product__btn product__btn_cart">Нужна помощь</button>
        </div>
        <div class="product-help__image-wrap" aria-hidden="true">
            <img class="product-help__image" src="<?= SITE_TEMPLATE_PATH ?>/images/hero-bg.svg" alt="" width="960" height="360">
        </div>
    </section>
</main>

<!-- Модалка: заказать замер -->
<div class="modal" id="measureModal" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Заказать замер">
    <div class="modal__backdrop" data-close-measure></div>
    <div class="modal__panel" style="width: min(480px, calc(100vw - 32px)); max-height: 520px; grid-template-rows: auto 1fr;">
        <div class="modal__header">
            <h2 class="modal__title">Заказать замер</h2>
            <button class="modal__close" type="button" data-close-measure aria-label="Закрыть">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>
        <div class="modal__body" style="padding: 24px 16px; overflow-y: auto;">
            <p style="margin: 0 0 20px; font-size: 14px; color: #666; line-height: 1.5;">Наш специалист приедет к вам, чтобы точно измерить дверной проём и подобрать оптимальное решение</p>
            <form id="measureForm" style="display: flex; flex-direction: column; gap: 14px;">
                <input type="text" name="name" placeholder="Ваше имя*" required style="width: 100%; padding: 14px 16px; border: 1px solid #ddd; font-size: 15px; font-family: inherit; box-sizing: border-box;">
                <input type="tel" name="phone" placeholder="Ваш телефон*" required style="width: 100%; padding: 14px 16px; border: 1px solid #ddd; font-size: 15px; font-family: inherit; box-sizing: border-box;">
                <textarea name="comment" placeholder="Комментарий (необязательно)" rows="3" style="width: 100%; padding: 14px 16px; border: 1px solid #ddd; font-size: 15px; font-family: inherit; resize: vertical; box-sizing: border-box;"></textarea>
                <button type="submit" class="btn btn_primary" style="width: 100%; padding: 16px; font-size: 15px; letter-spacing: 0.05em;">ЗАКАЗАТЬ ЗАМЕР</button>
                <p style="margin: 0; font-size: 12px; color: #999; text-align: center;">Отправляя заявку, вы даёте согласие на обработку <a href="#" style="color: inherit; text-decoration: underline;">персональных данных</a></p>
            </form>
            <div id="measureSuccess" style="display: none; text-align: center; padding: 40px 0;">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style="margin-bottom: 16px;"><circle cx="24" cy="24" r="24" fill="#E8F5E9"/><path d="M15 25l6 6 12-14" stroke="#4CAF50" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <h3 style="margin: 0 0 8px; font-size: 18px;">Заявка отправлена!</h3>
                <p style="margin: 0; color: #666; font-size: 14px;">Мы свяжемся с вами в ближайшее рабочее время</p>
            </div>
        </div>
    </div>
</div>

<script src="<?= SITE_TEMPLATE_PATH ?>/js/coatings-data.js"></script>
<script src="<?= SITE_TEMPLATE_PATH ?>/js/configurator-data.js"></script>
<script src="<?= SITE_TEMPLATE_PATH ?>/js/product.js"></script>
<script src="<?= SITE_TEMPLATE_PATH ?>/js/shop.js"></script>

<?php else: ?>
<main>
    <h1>Товар не найден</h1>
    <p><a href="/catalog/">Вернуться в каталог</a></p>
</main>
<?php endif; ?>

<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
?>
