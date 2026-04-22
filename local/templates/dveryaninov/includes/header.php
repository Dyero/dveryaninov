<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
?>
<header class="header">
    <div class="header__level header__level_1">
        <div class="header__top-row">
            <div class="header__location">
                <img src="<?= SITE_TEMPLATE_PATH ?>/images/icon-location.svg" alt="" width="24" height="24" class="header__icon-img">
                <span class="header__city">Новочебоксарск</span>
            </div>
            <a class="header__link" href="/contacts/">Адреса салонов</a>
            <a class="header__link" href="/about/">О компании</a>
            <a class="header__link" href="/contacts/">Контакты</a>
            <div class="header__right">
                <a class="header__link" href="#">Блог</a>
                <a class="header__link" href="#">Проекты</a>
            </div>
        </div>
    </div>
    <div class="header__level header__level_2">
        <nav class="header__nav">
            <a class="header__nav-item" href="/catalog/">Каталог</a>
            <a class="header__nav-item" href="/collections/">Коллекции</a>
            <a class="header__nav-item" href="/service/">Услуги</a>
        </nav>
        <a class="header__logo" href="/">
            <img src="<?= SITE_TEMPLATE_PATH ?>/images/logo.svg" alt="Дверянинов" width="196" height="59">
        </a>
        <div class="header__actions">
            <a class="header__phone" href="tel:88005508869">8 800 550-88-69</a>
            <?php if ($USER->IsAuthorized()): ?>
                <a href="/personal/" class="header__icon-btn header__profile-btn" aria-label="Профиль">
                    <img src="<?= SITE_TEMPLATE_PATH ?>/images/icon-user.svg" alt="" width="24" height="24">
                </a>
            <?php else: ?>
                <button type="button" class="header__icon-btn header__profile-btn" aria-label="Профиль" onclick="openAuthPopup()">
                    <img src="<?= SITE_TEMPLATE_PATH ?>/images/icon-user.svg" alt="" width="24" height="24">
                </button>
            <?php endif; ?>
            <a href="/wishlist/" id="header-wishlist-btn" class="header__icon-btn" aria-label="Избранное" style="position:relative">
                <img src="<?= SITE_TEMPLATE_PATH ?>/images/icon-heart.svg" alt="" width="24" height="24">
            </a>
            <a href="/personal/cart/" class="header__icon-btn" aria-label="Корзина">
                <img src="<?= SITE_TEMPLATE_PATH ?>/images/icon-bag.svg" alt="" width="24" height="24">
                <span class="header__cart-count" data-cart-count style="display:none">0</span>
            </a>
            <button type="button" class="header__icon-btn" aria-label="Поиск">
                <img src="<?= SITE_TEMPLATE_PATH ?>/images/icon-search.svg" alt="" width="24" height="24">
            </button>
        </div>
    </div>
</header>
