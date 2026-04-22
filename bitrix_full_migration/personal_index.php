<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Личный кабинет");

// Проверка авторизации
if (!$USER->IsAuthorized()) {
    LocalRedirect("/");
}
?>

<main class="account-page">
    <nav class="breadcrumbs">
        <a class="breadcrumbs__link" href="/">Главная</a>
        <span class="breadcrumbs__sep">–</span>
        <span class="breadcrumbs__current">Личный кабинет</span>
    </nav>

    <h1 class="account-page__title" id="account-page-heading">Личный кабинет</h1>

    <div class="account-layout">
        <!-- Боковое меню -->
        <aside class="account-aside">
            <div class="account-user-greeting">
                <p class="account-user-greeting__name"><?= htmlspecialcharsbx($USER->GetFullName()) ?: "Пользователь" ?></p>
                <p class="account-user-greeting__email"><?= htmlspecialcharsbx($USER->GetEmail()) ?></p>
            </div>
            <nav class="account-nav">
                <div class="account-nav__item account-nav__item_active">
                    <a class="account-nav__link" href="/personal/" aria-current="page">История заказов</a>
                    <span class="account-nav__marker"></span>
                </div>
                <div class="account-nav__item">
                    <a class="account-nav__link" href="/personal/profile/">Данные</a>
                </div>
                <div class="account-nav__item">
                    <a class="account-nav__link" href="/personal/cart/">Корзина</a>
                </div>
                <form method="post" action="?logout=yes" style="margin: 0;">
                    <input type="hidden" name="logout" value="yes">
                    <?= bitrix_sessid_post() ?>
                    <button type="submit" class="account-nav__logout">Выйти</button>
                </form>
            </nav>
        </aside>

        <!-- Правая колонка: список заказов -->
        <div class="account-content">
            <section class="account-orders" id="panel-orders" aria-label="Список заказов">
                <?if (CModule::IncludeModule("sale")):?>
                    <?$APPLICATION->IncludeComponent(
                        "bitrix:sale.personal.order.list",
                        "",
                        array(
                            "ORDERS_PER_PAGE" => "20",
                            "PATH_TO_DETAIL" => "/personal/orders/#ID#/",
                            "PATH_TO_CANCEL" => "/personal/orders/cancel/",
                            "PATH_TO_CATALOG" => "/catalog/",
                            "PATH_TO_PAYMENT" => "/personal/payment/",
                            "SAVE_IN_SESSION" => "Y",
                            "SET_TITLE" => "N",
                            "CACHE_TYPE" => "A",
                            "CACHE_TIME" => "3600",
                        )
                    );?>
                <?else:?>
                    <p>Модуль интернет-магазина не установлен</p>
                <?endif;?>
            </section>
        </div>
    </div>
</main>

<?php
// Обработка выхода
if ($_REQUEST["logout"] == "yes" && check_bitrix_sessid()) {
    $USER->Logout();
    LocalRedirect("/");
}
?>

<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
?>
