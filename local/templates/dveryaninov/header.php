<?php
/**
 * /local/templates/dveryaninov/header.php
 * Шапка сайта Дверянинов для 1С-Битрикс
 * НЕ редактировать оригинальный header.html
 */
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

$tplDir = SITE_TEMPLATE_PATH; // /local/templates/dveryaninov
?>
<!DOCTYPE html>
<html lang="ru" data-bitrix>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $APPLICATION->GetTitle() ?></title>
  <?php $APPLICATION->ShowHead(); ?>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/main.css">
  <link rel="stylesheet" href="/css/responsive.css">
  <link rel="stylesheet" href="/local/templates/dveryaninov/css/bitrix.css">
</head>
<body class="page">
<?php $APPLICATION->ShowPanel(); ?>

<header class="header">
  <div class="header__level header__level_1">
    <div class="header__top-row">
      <div class="header__location">
        <img src="<?= $tplDir ?>/images/icon-location.svg" alt="" width="24" height="24" class="header__icon-img">
        <span class="header__city">Новочебоксарск</span>
      </div>
      <a class="header__link" href="/contacts/">Адреса салонов</a>
      <a class="header__link" href="/about/">О компании</a>
      <a class="header__link" href="/contacts/">Контакты</a>
      <div class="header__right">
        <a class="header__link" href="/blog/">Блог</a>
        <a class="header__link" href="/projects/">Проекты</a>
      </div>
    </div>
  </div>

  <div class="header__level header__level_2">
    <nav class="header__nav">
      <a class="header__nav-item" href="/catalog/">Каталог</a>
      <a class="header__nav-item" href="/collections/">Коллекции</a>
      <a class="header__nav-item" href="/services/">Услуги</a>
    </nav>
    <a class="header__logo" href="/">
      <img src="<?= $tplDir ?>/images/logo.svg" alt="Дверянинов" width="196" height="59">
    </a>
    <div class="header__actions">
      <a class="header__phone" href="tel:88005508869">8 800 550-88-69</a>
      <button type="button" class="header__icon-btn header__profile-btn" aria-label="Профиль">
        <img src="<?= $tplDir ?>/images/icon-user.svg" alt="" width="24" height="24">
      </button>
      <a href="/wishlist/" id="header-wishlist-btn" class="header__icon-btn" aria-label="Избранное" style="position:relative">
        <img src="<?= $tplDir ?>/images/icon-heart.svg" alt="" width="24" height="24">
      </a>
      <a href="/cart/" class="header__icon-btn" aria-label="Корзина">
        <img src="<?= $tplDir ?>/images/icon-bag.svg" alt="" width="24" height="24">
      </a>
      <button type="button" class="header__icon-btn" aria-label="Поиск">
        <img src="<?= $tplDir ?>/images/icon-search.svg" alt="" width="24" height="24">
      </button>
    </div>
  </div>
</header>

<!-- Auth modal — доступен на всех страницах -->
<div class="auth-modal" id="auth-modal" role="dialog" aria-modal="true"
     aria-labelledby="auth-modal-title" aria-hidden="true">
  <div class="auth-modal__backdrop"></div>
  <div class="auth-modal__panel">
    <div class="auth-modal__header">
      <h2 class="auth-modal__title" id="auth-modal-title">Личный кабинет</h2>
      <button type="button" class="auth-modal__close" data-close-auth aria-label="Закрыть">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
          <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    </div>
    <div class="auth-modal__tabs">
      <button class="modal__tab modal__tab_active" type="button" data-auth-tab="login" aria-selected="true">Войти</button>
      <button class="modal__tab" type="button" data-auth-tab="register" aria-selected="false">Регистрация</button>
    </div>
    <div data-auth-panel="login">
      <form class="auth-form" id="login-form" novalidate>
        <div class="auth-form__field">
          <label class="auth-form__label" for="login-email">Email</label>
          <input class="auth-form__input" type="email" id="login-email" name="email"
                 autocomplete="email" required>
        </div>
        <div class="auth-form__field">
          <label class="auth-form__label" for="login-password">Пароль</label>
          <input class="auth-form__input" type="password" id="login-password" name="password"
                 autocomplete="current-password" required>
        </div>
        <div class="auth-form__error" aria-live="polite"></div>
        <button type="submit" class="auth-form__btn">Войти</button>
      </form>
    </div>
    <div data-auth-panel="register" hidden>
      <form class="auth-form" id="register-form" novalidate>
        <div class="auth-form__field">
          <label class="auth-form__label" for="reg-name">Имя</label>
          <input class="auth-form__input" type="text" id="reg-name" name="reg-name"
                 autocomplete="name" required>
        </div>
        <div class="auth-form__field">
          <label class="auth-form__label" for="reg-email">Email</label>
          <input class="auth-form__input" type="email" id="reg-email" name="reg-email"
                 autocomplete="email" required>
        </div>
        <div class="auth-form__field">
          <label class="auth-form__label" for="reg-password">Пароль</label>
          <input class="auth-form__input" type="password" id="reg-password" name="reg-password"
                 autocomplete="new-password" required>
        </div>
        <div class="auth-form__error" aria-live="polite"></div>
        <button type="submit" class="auth-form__btn">Зарегистрироваться</button>
      </form>
    </div>
  </div>
</div>
