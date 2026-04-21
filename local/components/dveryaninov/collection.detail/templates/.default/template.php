<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
?>

<div class="collection-detail">
    <!-- Hero секция с информацией о коллекции -->
    <section class="collection-hero">
        <div class="collection-hero__wrapper">
            <?php if (!empty($arResult["COLLECTION"]["DETAIL_PICTURE_SRC"])): ?>
                <div class="collection-hero__image">
                    <img
                        src="<?= htmlspecialcharsbx($arResult["COLLECTION"]["DETAIL_PICTURE_SRC"]) ?>"
                        alt="<?= htmlspecialcharsbx($arResult["COLLECTION"]["NAME"]) ?>"
                        loading="lazy"
                    >
                </div>
            <?php endif; ?>

            <div class="collection-hero__content">
                <h1 class="collection-hero__title"><?= htmlspecialcharsbx($arResult["COLLECTION"]["NAME"]) ?></h1>

                <?php if (!empty($arResult["COLLECTION"]["PREVIEW_TEXT"])): ?>
                    <p class="collection-hero__description">
                        <?= htmlspecialcharsbx($arResult["COLLECTION"]["PREVIEW_TEXT"]) ?>
                    </p>
                <?php endif; ?>

                <?php if (!empty($arResult["COLLECTION"]["DETAIL_TEXT"])): ?>
                    <div class="collection-hero__text">
                        <?= $arResult["COLLECTION"]["DETAIL_TEXT"] ?>
                    </div>
                <?php endif; ?>

                <!-- Характеристики коллекции -->
                <div class="collection-hero__specs">
                    <?php if (!empty($arResult["COLLECTION"]["PROPERTIES"]["COATING_TYPES"]["VALUE"])): ?>
                        <div class="collection-spec">
                            <span class="collection-spec__label">Типы покрытий:</span>
                            <span class="collection-spec__value">
                                <?php
                                $coatingTypes = $arResult["COLLECTION"]["PROPERTIES"]["COATING_TYPES"]["VALUE"];
                                if (is_array($coatingTypes)) {
                                    echo htmlspecialcharsbx(implode(", ", $coatingTypes));
                                } else {
                                    echo htmlspecialcharsbx($coatingTypes);
                                }
                                ?>
                            </span>
                        </div>
                    <?php endif; ?>

                    <?php if (!empty($arResult["COLLECTION"]["PROPERTIES"]["YEAR"]["VALUE"])): ?>
                        <div class="collection-spec">
                            <span class="collection-spec__label">Год выпуска:</span>
                            <span class="collection-spec__value">
                                <?= htmlspecialcharsbx($arResult["COLLECTION"]["PROPERTIES"]["YEAR"]["VALUE"]) ?>
                            </span>
                        </div>
                    <?php endif; ?>

                    <div class="collection-spec">
                        <span class="collection-spec__label">Количество моделей:</span>
                        <span class="collection-spec__value"><?= count($arResult["DOORS"]) ?></span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Список дверей в коллекции -->
    <section class="collection-doors">
        <div class="collection-doors__wrapper">
            <h2 class="collection-doors__title">Модели коллекции</h2>

            <?php if (!empty($arResult["DOORS"])): ?>
                <div class="doors-grid">
                    <?php foreach ($arResult["DOORS"] as $arDoor): ?>
                        <article class="door-card">
                            <a href="<?= htmlspecialcharsbx($arDoor["DETAIL_PAGE_URL"]) ?>" class="door-card__link">
                                <?php if (!empty($arDoor["PREVIEW_PICTURE_SRC"])): ?>
                                    <div class="door-card__image">
                                        <img
                                            src="<?= htmlspecialcharsbx($arDoor["PREVIEW_PICTURE_SRC"]) ?>"
                                            alt="<?= htmlspecialcharsbx($arDoor["NAME"]) ?>"
                                            loading="lazy"
                                        >
                                    </div>
                                <?php else: ?>
                                    <div class="door-card__image door-card__image_placeholder">
                                        <span>Нет фото</span>
                                    </div>
                                <?php endif; ?>

                                <div class="door-card__content">
                                    <h3 class="door-card__name"><?= htmlspecialcharsbx($arDoor["NAME"]) ?></h3>

                                    <?php if (!empty($arDoor["MODEL_CODE"])): ?>
                                        <p class="door-card__code">
                                            Артикул: <?= htmlspecialcharsbx($arDoor["MODEL_CODE"]) ?>
                                        </p>
                                    <?php endif; ?>

                                    <?php if (!empty($arDoor["PREVIEW_TEXT"])): ?>
                                        <p class="door-card__description">
                                            <?= htmlspecialcharsbx($arDoor["PREVIEW_TEXT"]) ?>
                                        </p>
                                    <?php endif; ?>

                                    <?php if (!empty($arDoor["PRICE"])): ?>
                                        <div class="door-card__price">
                                            от <?= number_format($arDoor["PRICE"], 0, ',', ' ') ?> ₽
                                        </div>
                                    <?php endif; ?>

                                    <span class="door-card__button">Подробнее</span>
                                </div>
                            </a>
                        </article>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <p class="collection-doors__empty">В этой коллекции пока нет дверей</p>
            <?php endif; ?>
        </div>
    </section>

    <!-- Преимущества коллекции -->
    <section class="collection-features">
        <div class="collection-features__wrapper">
            <h2 class="collection-features__title">Преимущества коллекции</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-card__icon" aria-hidden="true">✓</div>
                    <h3 class="feature-card__title">Качественные материалы</h3>
                    <p class="feature-card__text">Используем только проверенные материалы от надежных поставщиков</p>
                </div>
                <div class="feature-card">
                    <div class="feature-card__icon" aria-hidden="true">✓</div>
                    <h3 class="feature-card__title">Современный дизайн</h3>
                    <p class="feature-card__text">Актуальные дизайнерские решения для любого интерьера</p>
                </div>
                <div class="feature-card">
                    <div class="feature-card__icon" aria-hidden="true">✓</div>
                    <h3 class="feature-card__title">Гарантия качества</h3>
                    <p class="feature-card__text">Официальная гарантия производителя на все изделия</p>
                </div>
                <div class="feature-card">
                    <div class="feature-card__icon" aria-hidden="true">✓</div>
                    <h3 class="feature-card__title">Широкий выбор</h3>
                    <p class="feature-card__text">Множество вариантов покрытий и остекления</p>
                </div>
            </div>
        </div>
    </section>
</div>

<style>
.collection-detail {
    width: 100%;
}

.collection-hero {
    padding: 60px 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.collection-hero__wrapper {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
}

.collection-hero__image img {
    width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.collection-hero__title {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 20px;
    color: #2c3e50;
}

.collection-hero__description {
    font-size: 20px;
    line-height: 1.6;
    color: #555;
    margin-bottom: 30px;
}

.collection-hero__text {
    font-size: 16px;
    line-height: 1.8;
    color: #666;
    margin-bottom: 40px;
}

.collection-hero__specs {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.collection-spec {
    display: flex;
    gap: 10px;
}

.collection-spec__label {
    font-weight: 600;
    color: #2c3e50;
}

.collection-spec__value {
    color: #555;
}

.collection-doors {
    padding: 80px 20px;
}

.collection-doors__wrapper {
    max-width: 1200px;
    margin: 0 auto;
}

.collection-doors__title {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 40px;
    text-align: center;
    color: #2c3e50;
}

.doors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
}

.door-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.door-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}

.door-card__link {
    text-decoration: none;
    color: inherit;
    display: block;
}

.door-card__image {
    width: 100%;
    height: 300px;
    overflow: hidden;
    background: #f5f5f5;
}

.door-card__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.door-card__image_placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
}

.door-card__content {
    padding: 20px;
}

.door-card__name {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #2c3e50;
}

.door-card__code {
    font-size: 14px;
    color: #999;
    margin-bottom: 10px;
}

.door-card__description {
    font-size: 14px;
    line-height: 1.6;
    color: #666;
    margin-bottom: 15px;
}

.door-card__price {
    font-size: 24px;
    font-weight: 700;
    color: #e74c3c;
    margin-bottom: 15px;
}

.door-card__button {
    display: inline-block;
    padding: 10px 20px;
    background: #3498db;
    color: #fff;
    border-radius: 6px;
    font-weight: 600;
    transition: background 0.3s ease;
}

.door-card:hover .door-card__button {
    background: #2980b9;
}

.collection-doors__empty {
    text-align: center;
    font-size: 18px;
    color: #999;
    padding: 60px 20px;
}

.collection-features {
    padding: 80px 20px;
    background: #f9f9f9;
}

.collection-features__wrapper {
    max-width: 1200px;
    margin: 0 auto;
}

.collection-features__title {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 40px;
    text-align: center;
    color: #2c3e50;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
}

.feature-card {
    text-align: center;
    padding: 30px 20px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.feature-card__icon {
    font-size: 48px;
    color: #27ae60;
    margin-bottom: 15px;
}

.feature-card__title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #2c3e50;
}

.feature-card__text {
    font-size: 14px;
    line-height: 1.6;
    color: #666;
}

@media (max-width: 768px) {
    .collection-hero__wrapper {
        grid-template-columns: 1fr;
        gap: 30px;
    }

    .collection-hero__title {
        font-size: 32px;
    }

    .collection-hero__description {
        font-size: 16px;
    }

    .doors-grid {
        grid-template-columns: 1fr;
    }

    .features-grid {
        grid-template-columns: 1fr;
    }
}
</style>
