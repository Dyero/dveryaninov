<?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>

<div class="catalog-page">
    <h1 class="catalog__title">Каталог дверей</h1>

    <div class="section__cards section__cards_wrap">
        <?php foreach ($arResult["ITEMS"] as $item):
            $picture = CFile::GetPath($item["PREVIEW_PICTURE"]);
            $price = floatval($item["PROPERTIES"]["PRICE"]["VALUE"]);
        ?>
        <article class="card">
            <div class="card__image-wrap">
                <img class="card__image"
                     src="<?= htmlspecialcharsbx($picture) ?>"
                     alt="<?= htmlspecialcharsbx($item["NAME"]) ?>"
                     width="288" height="320">
            </div>
            <div class="card__info">
                <h3 class="card__title">
                    <a href="<?= htmlspecialcharsbx($item["DETAIL_PAGE_URL"]) ?>">
                        <?= htmlspecialcharsbx($item["NAME"]) ?>
                    </a>
                </h3>
                <p class="card__price">от <?= number_format($price, 0, ',', ' ') ?> ₽</p>
            </div>
        </article>
        <?php endforeach; ?>
    </div>

    <?php if ($arResult["NAV_STRING"]): ?>
    <div class="catalog__pagination">
        <?= $arResult["NAV_STRING"] ?>
    </div>
    <?php endif; ?>
</div>
