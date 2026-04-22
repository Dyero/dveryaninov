<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Дверянинов — Премиальные межкомнатные двери");
$APPLICATION->SetPageProperty("description", "Премиальные межкомнатные двери от фабрики Дверянинов. Собственное производство, широкий выбор коллекций, индивидуальные размеры.");
?>

<main>
    <!-- 1. Hero Block -->
    <section class="hero-slider" id="hero-slider">
        <div class="hero-slider__slides">
            <div class="hero-slider__slide is-active">
                <div class="hero-new">
                    <div class="hero-new__col hero-new__col_left">
                        <img class="hero-new__bg-img" src="<?= SITE_TEMPLATE_PATH ?>/images/news-1.png" alt="Интерьер с дверью">
                        <div class="hero-new__content">
                            <p class="hero-new__subtitle">ПРЕМИАЛЬНЫЕ МЕЖКОМНАТНЫЕ ДВЕРИ ОТ ФАБРИКИ</p>
                            <h1 class="hero-new__title">Двери, которые приносят тишину, статус и уверенность в ваш дом</h1>
                            <a class="hero-new__btn btn btn_primary" href="/catalog/">Перейти в каталог <span aria-hidden="true">↗</span></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 2. Промо-слайдер коллекций -->
    <section class="promo-slider" id="promo-slider">
        <div class="promo-slider__slides">
            <!-- Slide 1: Амфора -->
            <div class="promo-slider__slide is-active" data-slide="0">
                <div class="promo__content promo__content_beige">
                    <h2 class="promo__title">Двери Амфора</h2>
                    <p class="promo__text">Оригинальность конструкции, по-настоящему огромная вариативность декорирования и небольшие детали — все вместе собирается в один рецепт красоты</p>
                    <a href="/collections/amfora/" class="btn btn_primary promo__btn">ПОДРОБНЕЕ <span aria-hidden="true">↗</span></a>
                </div>
                <div class="promo__image-wrap">
                    <img class="promo__image" src="<?= SITE_TEMPLATE_PATH ?>/images/news-2.png" alt="Интерьер Амфора">
                </div>
            </div>
            <!-- Slide 2: Альберта -->
            <div class="promo-slider__slide" data-slide="1">
                <div class="promo__content promo__content_beige">
                    <h2 class="promo__title">Двери Альберта</h2>
                    <p class="promo__text">Классический дизайн с современными материалами. Коллекция Альберта — элегантность в каждой детали, непревзойдённое качество отделки</p>
                    <a href="/collections/alberta/" class="btn btn_primary promo__btn">ПОДРОБНЕЕ <span aria-hidden="true">↗</span></a>
                </div>
                <div class="promo__image-wrap">
                    <img class="promo__image" src="<?= SITE_TEMPLATE_PATH ?>/images/Альберта.png" alt="Коллекция Альберта">
                </div>
            </div>
            <!-- Slide 3: Флай -->
            <div class="promo-slider__slide" data-slide="2">
                <div class="promo__content promo__content_beige">
                    <h2 class="promo__title">Двери Флай</h2>
                    <p class="promo__text">Лёгкость форм и воздушность линий. Коллекция Флай — современный дизайн, идеальный для светлых и просторных интерьеров</p>
                    <a href="/collections/flaj/" class="btn btn_primary promo__btn">ПОДРОБНЕЕ <span aria-hidden="true">↗</span></a>
                </div>
                <div class="promo__image-wrap">
                    <img class="promo__image" src="<?= SITE_TEMPLATE_PATH ?>/images/news-3.png" alt="Коллекция Флай">
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

    <!-- 3. Коллекции из инфоблока -->
    <section class="section section_cards">
        <div class="section__head">
            <h2 class="section__title">Коллекции</h2>
            <a href="/collections/" class="section__link">Смотреть все <span>&rarr;</span></a>
        </div>
        <div class="section__cards section__cards_wrap">
            <?php
            // Получить 4 популярные коллекции
            $rsCollections = CIBlockElement::GetList(
                ["SORT" => "ASC"],
                [
                    "IBLOCK_ID" => 1, // ID инфоблока коллекций
                    "ACTIVE" => "Y"
                ],
                false,
                ["nTopCount" => 4],
                ["ID", "NAME", "CODE", "PREVIEW_PICTURE", "PROPERTY_PRICE_FROM"]
            );

            while ($arCollection = $rsCollections->GetNextElement()) {
                $arFields = $arCollection->GetFields();
                $arProps = $arCollection->GetProperties();

                $imageSrc = CFile::GetPath($arFields["PREVIEW_PICTURE"]);
                $priceFrom = $arProps["PRICE_FROM"]["VALUE"] ?? "52 800";
                ?>
                <article class="card">
                    <div class="card__image-wrap">
                        <img class="card__image" src="<?= $imageSrc ?>" alt="<?= htmlspecialcharsbx($arFields["NAME"]) ?>">
                    </div>
                    <div class="card__info">
                        <h3 class="card__title">
                            <a href="/collections/<?= $arFields["CODE"] ?>/"><?= htmlspecialcharsbx($arFields["NAME"]) ?></a>
                        </h3>
                        <p class="card__price"><span class="card__price-prefix">от</span> <?= number_format($priceFrom, 0, ',', ' ') ?> ₽</p>
                    </div>
                </article>
                <?php
            }
            ?>
        </div>
    </section>

    <!-- 5. Блог/Новости -->
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
            <div class="blog__slider-wrap">
                <div class="blog__carousel">
                    <article class="blog-card">
                        <div class="blog-card__img-wrap">
                            <img src="<?= SITE_TEMPLATE_PATH ?>/images/news-1.png" class="blog-card__img" alt="Проект">
                        </div>
                        <p class="blog-card__meta">14.06.2022 · @Натура.ру</p>
                        <h3 class="blog-card__title">Открытие нового шоурума в Чебоксарах</h3>
                    </article>
                    <article class="blog-card">
                        <div class="blog-card__img-wrap">
                            <img src="<?= SITE_TEMPLATE_PATH ?>/images/news-2.png" class="blog-card__img" alt="Проект">
                        </div>
                        <p class="blog-card__meta">18.05.2022 · @Натура.ру</p>
                        <h3 class="blog-card__title">Коллекция MILLENNIUM в натуральном шпоне</h3>
                    </article>
                    <article class="blog-card">
                        <div class="blog-card__img-wrap">
                            <img src="<?= SITE_TEMPLATE_PATH ?>/images/news-3.png" class="blog-card__img" alt="Проект">
                        </div>
                        <p class="blog-card__meta">10.08.2022 · @Натура.ру</p>
                        <h3 class="blog-card__title">Расширение ассортимента скрытых дверей</h3>
                    </article>
                    <article class="blog-card">
                        <div class="blog-card__img-wrap">
                            <img src="<?= SITE_TEMPLATE_PATH ?>/images/news-4.png" class="blog-card__img" alt="Блог">
                        </div>
                        <p class="blog-card__meta">16.09.2022 · @Натура.ру</p>
                        <h3 class="blog-card__title">Дверянинов — лауреат премии «Лучший производитель»</h3>
                    </article>
                </div>
                <button class="blog__nav-btn" aria-label="Вперед">→</button>
            </div>
        </div>
    </section>

    <!-- 6. Промо-блок: Примерка -->
    <section class="promo promo_mirrored">
        <div class="promo__content promo__content_dark">
            <h2 class="promo__title">Примерьте дверь в своём интерьере бесплатно</h2>
            <p class="promo__text">Наш дизайнер приедет к вам, проведёт замеры и покажет, как дверь будет смотреться в вашем интерьере. Полностью бесплатно, без обязательств к покупке.</p>
            <button class="btn btn_primary promo__btn" id="open-fitting-popup">ЗАКАЗАТЬ ПРИМЕРКУ <span aria-hidden="true">↗</span></button>
        </div>
        <div class="promo__image-wrap">
            <img class="promo__image" src="<?= SITE_TEMPLATE_PATH ?>/images/news-3.png" alt="Интерьер с дверью">
        </div>
    </section>
</main>

<script src="<?= SITE_TEMPLATE_PATH ?>/js/slider.js"></script>
<script>
// Инициализация слайдеров на главной
document.addEventListener('DOMContentLoaded', function() {
    // Промо-слайдер
    const promoSlider = document.getElementById('promo-slider');
    if (promoSlider) {
        initPromoSlider();
    }

    // Попап примерки
    const fittingBtn = document.getElementById('open-fitting-popup');
    if (fittingBtn) {
        fittingBtn.addEventListener('click', function() {
            // Открыть попап (логика в вашем JS)
            alert('Открыть попап примерки - интегрировать с вашим JS');
        });
    }
});
</script>

<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
?>
