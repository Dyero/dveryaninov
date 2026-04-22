<?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

$door = $arResult["DOOR"];
$collection = $arResult["COLLECTION"];
$gallery = $arResult["GALLERY"];
?>

<main class="product-page">
    <nav class="breadcrumbs" aria-label="Хлебные крошки">
        <a class="breadcrumbs__link" href="/">Главная</a>
        <span class="breadcrumbs__sep">–</span>
        <a class="breadcrumbs__link" href="/catalog/">Каталог</a>
        <?php if ($collection): ?>
        <span class="breadcrumbs__sep">–</span>
        <a class="breadcrumbs__link" href="/catalog/<?= htmlspecialcharsbx($collection["CODE"]) ?>/">
            Коллекция «<?= htmlspecialcharsbx($collection["NAME"]) ?>»
        </a>
        <?php endif; ?>
        <span class="breadcrumbs__sep">–</span>
        <span class="breadcrumbs__current"><?= htmlspecialcharsbx($door["NAME"]) ?></span>
    </nav>

    <div class="product">
        <div class="product__gallery product__gallery-col">
            <?php if (count($gallery) > 1): ?>
            <div class="product__thumbs">
                <?php foreach ($gallery as $idx => $img): ?>
                <button type="button"
                        class="product__thumb <?= ($idx === 0) ? 'product__thumb_active' : '' ?>"
                        aria-pressed="<?= ($idx === 0) ? 'true' : 'false' ?>"
                        tabindex="<?= ($idx === 0) ? '0' : '-1' ?>"
                        title="Вид <?= $idx + 1 ?>">
                    <img src="<?= htmlspecialcharsbx($img["SRC"]) ?>"
                         alt="<?= htmlspecialcharsbx($door["NAME"]) ?> вид <?= $idx + 1 ?>"
                         width="100" height="100">
                </button>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>

            <div class="product__main-image" role="region" aria-label="Основное изображение">
                <?php if (count($gallery) > 1): ?>
                <button type="button" class="product__arrow product__arrow_prev" aria-label="Показать предыдущее фото"></button>
                <?php endif; ?>

                <img src="<?= htmlspecialcharsbx($gallery[0]["SRC"]) ?>"
                     alt="<?= htmlspecialcharsbx($door["NAME"]) ?>"
                     width="560" height="560" loading="lazy">

                <?php if (count($gallery) > 1): ?>
                <button type="button" class="product__arrow product__arrow_next" aria-label="Показать следующее фото"></button>
                <?php endif; ?>
            </div>
        </div>

        <div class="product__info product__info-col">
            <h1 class="product__title"><?= htmlspecialcharsbx($door["NAME"]) ?></h1>

            <!-- Выбор размера -->
            <div class="product__option">
                <div class="product__option-header">
                    <span class="product__option-label">Размер полотна:</span>
                    <span class="product__option-value"><?= htmlspecialcharsbx($arResult["AVAILABLE_SIZES"][0]) ?></span>
                </div>
                <div class="product__sizes">
                    <?php foreach ($arResult["AVAILABLE_SIZES"] as $idx => $size): ?>
                    <button type="button"
                            class="product__size <?= ($idx === 0) ? 'product__size_active' : '' ?>"
                            data-size="<?= htmlspecialcharsbx($size) ?>">
                        <?= htmlspecialcharsbx($size) ?>
                    </button>
                    <?php endforeach; ?>
                    <button type="button" class="product__size product__size_measure">Нужен замер</button>
                    <button type="button" class="product__size product__size_own">Свой размер</button>
                </div>
            </div>

            <!-- Выбор покрытия -->
            <div class="product__option product__option_coating">
                <div class="product__option-header">
                    <span class="product__option-label">Покрытие:</span>
                    <span class="product__option-value"><?= htmlspecialcharsbx($arResult["COATINGS"][0]["UF_NAME"]) ?></span>
                </div>
                <div class="product__colors">
                    <?php
                    $visibleCount = 8;
                    $totalCount = count($arResult["COATINGS"]);
                    foreach ($arResult["COATINGS"] as $idx => $coating):
                        if ($idx >= $visibleCount) break;
                        $colorHex = htmlspecialcharsbx($coating["UF_COLOR_HEX"]);
                    ?>
                    <button type="button"
                            class="product__color <?= ($idx === 0) ? 'product__color_active' : '' ?>"
                            style="--color-swatch: <?= $colorHex ?>;"
                            aria-label="<?= htmlspecialcharsbx($coating["UF_NAME"]) ?>"
                            title="<?= htmlspecialcharsbx($coating["UF_NAME"]) ?>"
                            data-coating-id="<?= htmlspecialcharsbx($coating["UF_XML_ID"]) ?>">
                        <span class="product__color-inner" style="background: <?= $colorHex ?>;"></span>
                    </button>
                    <?php endforeach; ?>

                    <?php if ($totalCount > $visibleCount): ?>
                    <button type="button" class="product__color product__color_more"
                            aria-label="Ещё <?= $totalCount - $visibleCount ?> покрытий">
                        +<?= $totalCount - $visibleCount ?>
                    </button>
                    <?php endif; ?>

                    <div class="product__color-custom-wrap">
                        <button type="button" class="product__size product__size_own">Свой цвет</button>
                    </div>
                </div>
            </div>

            <!-- Цена и действия -->
            <div class="product__price-block">
                <p class="product__price">от <?= number_format($arResult["BASE_PRICE"], 0, ',', ' ') ?> ₽</p>
                <span class="product__price-note">цена за полотно</span>
                <div class="product__actions">
                    <button type="button" class="product__btn product__btn_cart">
                        <span class="product__btn-icon product__btn-icon_cart" aria-hidden="true"></span>
                        Добавить в корзину
                    </button>
                    <button type="button" class="product__btn product__btn_wishlist" aria-label="В избранное"></button>
                </div>
                <button type="button" class="product__btn product__btn_config" data-open-config>
                    <img src="/images/0203 vuesax 04 conf.svg" alt="" width="20" height="20" aria-hidden="true">
                    Конструктор
                </button>
            </div>
        </div>
    </div>

    <!-- Описание -->
    <?php if (!empty($door["DETAIL_TEXT"])): ?>
    <section class="product-section product-section_desc">
        <h2 class="product-section__title">Описание</h2>
        <div class="product-section__text">
            <?= $door["DETAIL_TEXT"] ?>
        </div>
    </section>
    <?php endif; ?>

    <!-- Характеристики -->
    <?php if (!empty($door["PROPERTIES"]["SPECIFICATIONS"]["VALUE"])): ?>
    <section class="product-section product-section_specs">
        <h2 class="product-section__title">Характеристики двери</h2>
        <div class="product-specs">
            <?php
            $specs = json_decode($door["PROPERTIES"]["SPECIFICATIONS"]["VALUE"], true);
            foreach ($specs as $label => $value):
            ?>
            <div class="product-specs__row">
                <div class="product-specs__label"><?= htmlspecialcharsbx($label) ?></div>
                <div class="product-specs__value"><?= htmlspecialcharsbx($value) ?></div>
            </div>
            <?php endforeach; ?>
        </div>
    </section>
    <?php endif; ?>

    <!-- Другие модели коллекции -->
    <?php if (!empty($arResult["RELATED_DOORS"])): ?>
    <section class="product-section product-section_related">
        <h2 class="product-section__title">Другие модели в коллекции</h2>
        <div class="section__cards section__cards_wrap product-section__cards">
            <?php foreach ($arResult["RELATED_DOORS"] as $relDoor):
                $relPicture = CFile::GetPath($relDoor["PREVIEW_PICTURE"]);
                $relPrice = floatval($relDoor["PROPERTIES"]["PRICE"]["VALUE"]);
            ?>
            <article class="card">
                <div class="card__image-wrap">
                    <img class="card__image"
                         src="<?= htmlspecialcharsbx($relPicture) ?>"
                         alt="<?= htmlspecialcharsbx($relDoor["NAME"]) ?>"
                         width="288" height="320">
                </div>
                <div class="card__info">
                    <h3 class="card__title">
                        <a href="<?= htmlspecialcharsbx($relDoor["DETAIL_PAGE_URL"]) ?>">
                            <?= htmlspecialcharsbx($relDoor["NAME"]) ?>
                        </a>
                    </h3>
                    <p class="card__price">от <?= number_format($relPrice, 0, ',', ' ') ?> ₽</p>
                </div>
            </article>
            <?php endforeach; ?>
        </div>
    </section>
    <?php endif; ?>

    <!-- Секция помощи -->
    <section class="product-help">
        <div class="product-help__content">
            <p class="product-help__kicker">Консультация специалиста</p>
            <h2 class="product-help__title">Нужна помощь?</h2>
            <p class="product-help__text">Ответим на все вопросы и поможем<br>сделать правильный выбор</p>
            <button type="button" class="product-help__btn product__btn product__btn_cart">Нужна помощь</button>
        </div>
        <div class="product-help__image-wrap" aria-hidden="true">
            <img class="product-help__image" src="/images/hero-bg.svg" alt="" width="960" height="360">
        </div>
    </section>
</main>

<script>
// Передаём данные в JavaScript для конфигуратора
window.DOOR_DATA = {
    id: <?= $door["ID"] ?>,
    name: "<?= CUtil::JSEscape($door["NAME"]) ?>",
    basePrice: <?= $arResult["BASE_PRICE"] ?>,
    pricePO: <?= $arResult["PRICE_PO"] ?>,
    coatings: <?= CUtil::PhpToJSObject($arResult["COATINGS"]) ?>,
    glasses: <?= CUtil::PhpToJSObject($arResult["GLASSES_BY_CATEGORY"]) ?>,
    openingVariants: <?= CUtil::PhpToJSObject($arResult["OPENING_VARIANTS"]) ?>,
    aluEdges: <?= CUtil::PhpToJSObject($arResult["ALU_EDGES"]) ?>
};
</script>
