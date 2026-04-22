<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Корзина");

// Проверяем, установлен ли модуль Sale
if (!CModule::IncludeModule("sale")) {
    ShowError("Модуль Интернет-магазин не установлен");
    require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
    return;
}
?>

<main class="cart-page">
    <nav class="breadcrumbs">
        <a class="breadcrumbs__link" href="/">Главная</a>
        <span class="breadcrumbs__sep">–</span>
        <span class="breadcrumbs__current">Корзина</span>
    </nav>

    <h1 class="cart-page__title">Корзина</h1>

    <div class="cart-meta" id="cart-meta"></div>

    <!-- Компонент корзины Bitrix с вашим шаблоном -->
    <?$APPLICATION->IncludeComponent(
        "bitrix:sale.basket.basket",
        "dveryaninov", // Ваш шаблон (нужно создать)
        array(
            "PATH_TO_ORDER" => "/personal/order/",
            "HIDE_COUPON" => "N",
            "COLUMNS_LIST" => array("NAME", "PROPS", "DELETE", "PRICE", "QUANTITY", "SUM"),
            "PRICE_VAT_SHOW_VALUE" => "N",
            "USE_PREPAYMENT" => "N",
            "QUANTITY_FLOAT" => "N",
            "SET_TITLE" => "Y",
        )
    );?>
</main>

<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
?>
