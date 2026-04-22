<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Main\Page\Asset;
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php
    $APPLICATION->ShowHead();
    Asset::getInstance()->addCss(SITE_TEMPLATE_PATH . "/css/main.css");
    Asset::getInstance()->addCss(SITE_TEMPLATE_PATH . "/css/responsive.css");

    // ИСПРАВЛЕНИЕ: Добавить все необходимые JS
    Asset::getInstance()->addJs(SITE_TEMPLATE_PATH . "/js/auth.js");
    Asset::getInstance()->addJs(SITE_TEMPLATE_PATH . "/js/load-components.js");
    Asset::getInstance()->addJs(SITE_TEMPLATE_PATH . "/js/cart.js");
    Asset::getInstance()->addJs(SITE_TEMPLATE_PATH . "/js/product.js");
    Asset::getInstance()->addJs(SITE_TEMPLATE_PATH . "/js/coatings-data.js");
    Asset::getInstance()->addJs(SITE_TEMPLATE_PATH . "/js/configurator-data.js");
    ?>
    <title><?php $APPLICATION->ShowTitle(); ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet">
</head>
<body class="page">
    <?php $APPLICATION->ShowPanel(); ?>

    <!-- Header -->
    <header class="header" role="banner">
        <div class="header__wrapper">
            <a href="/" class="header__logo" aria-label="Логотип Дверянинов">
                <img src="<?= SITE_TEMPLATE_PATH ?>/images/logo.svg" alt="Дверянинов" width="160" height="40">
            </a>

            <nav class="header__nav" role="navigation" aria-label="Основная навигация">
                <a class="header__link" href="/catalog/">Каталог</a>
                <a class="header__link" href="/collections/">Коллекции</a>
                <a class="header__link" href="/about/">О компании</a>
                <a class="header__link" href="/contacts/">Контакты</a>
            </nav>

            <div class="header__actions">
                <button type="button" class="header__action header__action_search" aria-label="Поиск"></button>

                <?php if ($USER->IsAuthorized()): ?>
                    <a href="/personal/" class="header__action header__action_profile" aria-label="Личный кабинет"></a>
                <?php else: ?>
                    <button type="button" class="header__action header__action_profile" aria-label="Войти" onclick="openAuthPopup()"></button>
                <?php endif; ?>

                <a href="/personal/cart/" class="header__action header__action_cart" aria-label="Корзина">
                    <span class="header__cart-count" data-cart-count>0</span>
                </a>
            </div>

            <button type="button" class="header__burger" aria-label="Открыть меню" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </header>
