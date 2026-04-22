<?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

$item = $arResult["ITEM"];
$picture = CFile::GetPath($item["DETAIL_PICTURE"] ?: $item["PREVIEW_PICTURE"]);
?>

<main class="product-page product-page_simple">
    <nav class="breadcrumbs" aria-label="Хлебные крошки">
        <a class="breadcrumbs__link" href="/">Главная</a>
        <span class="breadcrumbs__sep">–</span>
        <a class="breadcrumbs__link" href="/catalog/">Каталог</a>
        <span class="breadcrumbs__sep">–</span>
        <span class="breadcrumbs__current"><?= htmlspecialcharsbx($item["NAME"]) ?></span>
    </nav>

    <div class="product-simple">
        <div class="product-simple__image">
            <img src="<?= htmlspecialcharsbx($picture) ?>"
                 alt="<?= htmlspecialcharsbx($item["NAME"]) ?>"
                 width="560" height="560">
        </div>

        <div class="product-simple__info">
            <h1 class="product-simple__title"><?= htmlspecialcharsbx($item["NAME"]) ?></h1>

            <?php if ($arResult["SUBTYPE"]): ?>
            <p class="product-simple__subtype"><?= htmlspecialcharsbx($arResult["SUBTYPE"]) ?></p>
            <?php endif; ?>

            <?php if ($arResult["DIMENSIONS"]): ?>
            <p class="product-simple__dimensions">
                <strong>Размер:</strong> <?= htmlspecialcharsbx($arResult["DIMENSIONS"]) ?>
            </p>
            <?php endif; ?>

            <?php if (!empty($item["PREVIEW_TEXT"])): ?>
            <div class="product-simple__preview">
                <?= $item["PREVIEW_TEXT"] ?>
            </div>
            <?php endif; ?>

            <?php if (!empty($item["DETAIL_TEXT"])): ?>
            <div class="product-simple__description">
                <?= $item["DETAIL_TEXT"] ?>
            </div>
            <?php endif; ?>

            <div class="product-simple__price-block">
                <p class="product-simple__price">
                    <?= number_format($arResult["PRICE"], 0, ',', ' ') ?> ₽/<?= htmlspecialcharsbx($arResult["UNIT"]) ?>
                </p>

                <div class="product-simple__quantity">
                    <label>Количество:</label>
                    <input type="number" class="product-simple__qty-input" value="1" min="1" step="1">
                </div>

                <button type="button" class="product__btn product__btn_cart">
                    <span class="product__btn-icon product__btn-icon_cart" aria-hidden="true"></span>
                    Добавить в корзину
                </button>
            </div>
        </div>
    </div>
</main>

<style>
.product-simple {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    max-width: 1200px;
    margin: 40px auto;
}

.product-simple__image img {
    width: 100%;
    height: auto;
    border-radius: 12px;
}

.product-simple__title {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 12px;
}

.product-simple__subtype {
    font-size: 18px;
    color: #666;
    font-style: italic;
    margin-bottom: 16px;
}

.product-simple__dimensions {
    font-size: 16px;
    margin-bottom: 20px;
}

.product-simple__price-block {
    margin-top: 40px;
}

.product-simple__price {
    font-size: 36px;
    font-weight: 700;
    color: #000;
    margin-bottom: 20px;
}

.product-simple__quantity {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}

.product-simple__qty-input {
    width: 80px;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
}

@media (max-width: 768px) {
    .product-simple {
        grid-template-columns: 1fr;
    }
}
</style>
