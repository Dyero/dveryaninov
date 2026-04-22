<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Каталог — Дверянинов");
$APPLICATION->SetPageProperty("description", "Каталог межкомнатных дверей — широкий выбор коллекций, фурнитуры и перегородок");
?>

<?php
// Include site header
$includeHeaderPath = $_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/includes/header.php";
if (file_exists($includeHeaderPath)) {
    include($includeHeaderPath);
}
?>

<main class="catalog-page">
    <nav class="breadcrumbs catalog-page__breadcrumbs" aria-label="Хлебные крошки">
        <a class="breadcrumbs__link" href="/">Главная</a>
        <span class="breadcrumbs__sep">–</span>
        <span class="breadcrumbs__current">Каталог</span>
    </nav>

    <section class="catalog" id="catalog" aria-labelledby="catalog-title">
        <div class="catalog__head">
            <h2 class="catalog__title" id="catalog-title">Каталог</h2>
        </div>

        <!-- Табы категорий -->
        <div class="catalog__categories">
            <button type="button" class="catalog__cat-btn catalog__cat-btn_active" data-category="all">Все</button>
            <button type="button" class="catalog__cat-btn" data-category="doors">Межкомнатные двери</button>
            <button type="button" class="catalog__cat-btn" data-category="hardware">Фурнитура</button>
            <button type="button" class="catalog__cat-btn" data-category="partitions">Перегородки</button>
            <button type="button" class="catalog__cat-btn" data-category="invisible">Скрытые двери (Invisible)</button>
        </div>

        <!-- Mobile filter toggle -->
        <button type="button" class="catalog__filter-toggle" id="catalogFilterToggle">Фильтры</button>

        <div id="catalog-doors-section">
            <div class="catalog__body">
                <!-- Sidebar filters (коллекции) -->
                <aside class="catalog__sidebar" id="catalogSidebar">
                    <div class="catalog__sidebar-head">
                        <h3 class="catalog__sidebar-title">Коллекции</h3>
                        <button type="button" class="catalog__sidebar-close" id="catalogSidebarClose" aria-label="Закрыть фильтры">&times;</button>
                    </div>
                    <div class="catalog__filter-list">
                        <button type="button" class="catalog__filter-btn catalog__filter-btn_active" data-filter-collection="all">Все коллекции</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="avrora">Аврора</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="alberta">Альберта</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="ameri">Амери</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="amfora">Амфора</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="beluni">Белуни</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="blank">Бланк</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="bona">Бона</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="boneko">Бонеко</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="vektor">Вектор</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="verto">Верто</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="vitra">Витра</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="d">Д</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="dekar">Декар</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="dekar-s-bagetom">Декар с багетом</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="kant">Кант</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="kaskad">Каскад</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="kvant">Квант</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="meta">Мета</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="miura">Миура</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="modena">Модена</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="mono">Моно</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="neo">Нео</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="oazis">Оазис</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="palladio">Палладио</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="plisse">Плиссе</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="terra">Терра</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="ultra">Ультра</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="flaj">Флай</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="form">Форм</button>
                        <button type="button" class="catalog__filter-btn" data-filter-collection="eterna">Этерна</button>
                    </div>
                </aside>

                <!-- Cards grid -->
                <div class="section__cards section__cards_wrap catalog__grid">
                    <?php
                    // Получаем все товары из инфоблока "Каталог"
                    // Предполагается что инфоблок с товарами имеет ID = 2
                    $rsProducts = CIBlockElement::GetList(
                        ["SORT" => "ASC", "NAME" => "ASC"],
                        [
                            "IBLOCK_ID" => 2, // ID инфоблока "Каталог" (нужно будет настроить)
                            "ACTIVE" => "Y"
                        ],
                        false,
                        false,
                        ["ID", "NAME", "CODE", "PREVIEW_PICTURE", "PROPERTY_PRICE", "PROPERTY_COLLECTION", "PROPERTY_VARIANT", "PROPERTY_CATEGORY"]
                    );

                    while ($arProduct = $rsProducts->GetNextElement()) {
                        $arFields = $arProduct->GetFields();
                        $arProps = $arProduct->GetProperties();

                        $imageSrc = $arFields["PREVIEW_PICTURE"] ? CFile::GetPath($arFields["PREVIEW_PICTURE"]) : SITE_TEMPLATE_PATH . "/images/card-placeholder.svg";
                        $price = $arProps["PRICE"]["VALUE"] ?? "20 300";
                        $collection = $arProps["COLLECTION"]["VALUE"] ?? "";
                        $variant = $arProps["VARIANT"]["VALUE"] ?? "ПГ / ПО";
                        $category = $arProps["CATEGORY"]["VALUE"] ?? "doors";

                        $collectionCode = strtolower(str_replace([" ", "–", "—"], "-", $collection));
                        ?>
                        <article class="card" data-collection="<?= htmlspecialcharsbx($collectionCode) ?>" data-category="<?= htmlspecialcharsbx($category) ?>">
                            <div class="card__image-wrap">
                                <button class="card__fav" aria-label="В избранное"></button>
                                <img class="card__image" src="<?= $imageSrc ?>" alt="<?= htmlspecialcharsbx($arFields["NAME"]) ?>">
                            </div>
                            <div class="card__info">
                                <div class="card__title-row">
                                    <h3 class="card__title">
                                        <a href="/catalog/<?= $arFields["CODE"] ?>/"><?= htmlspecialcharsbx($arFields["NAME"]) ?></a>
                                    </h3>
                                    <span class="card__variant"><?= htmlspecialcharsbx($variant) ?></span>
                                </div>
                                <p class="card__price"><span class="card__price-prefix">от</span> <?= number_format($price, 0, ',', ' ') ?> ₽</p>
                            </div>
                        </article>
                        <?php
                    }
                    ?>
                </div>
            </div>
        </div>
    </section>
</main>

<script src="<?= SITE_TEMPLATE_PATH ?>/js/shop.js"></script>

<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
?>
