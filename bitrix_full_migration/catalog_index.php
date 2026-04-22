<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Каталог межкомнатных дверей");
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

        <!-- ВАЖНО: Компонент doors.catalog должен выводить товары из инфоблока -->
        <?$APPLICATION->IncludeComponent(
            "dveryaninov:doors.catalog",
            "",
            array(
                "IBLOCK_ID" => 6, // ID инфоблока "Двери"
                "ELEMENTS_COUNT" => "20",
                "SHOW_FILTER" => "Y",
                "CACHE_TYPE" => "A",
                "CACHE_TIME" => "3600",
                "PAGER_SHOW_ALWAYS" => "N",
                "PAGER_TEMPLATE" => ".default",
            )
        );?>
    </section>
</main>

<?php
// Include site footer
$includeFooterPath = $_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/includes/footer.php";
if (file_exists($includeFooterPath)) {
    include($includeFooterPath);
}
?>

<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
?>
