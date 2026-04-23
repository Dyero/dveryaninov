<?php
/**
 * /account/index.php
 * Страница «Личный кабинет» — PHP/Битрикс версия.
 * Использует встроенный компонент Sale.PersonalOrderList + Bitrix Auth.
 * Статический account.html остаётся нетронутым.
 */
require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/header.php');
$APPLICATION->SetTitle('Личный кабинет — Дверянинов');
?>

<main class="account-page">
  <nav class="breadcrumbs" aria-label="Хлебные крошки">
    <a class="breadcrumbs__link" href="/">Главная</a>
    <span class="breadcrumbs__sep">–</span>
    <span class="breadcrumbs__current">Личный кабинет</span>
  </nav>

  <h1 class="account-page__title" id="account-page-heading">Личный кабинет</h1>

  <div class="account-layout">
    <!-- Боковое меню -->
    <aside class="account-aside">
      <div class="account-user-greeting">
        <?php
        global $USER;
        if ($USER->IsAuthorized()):
          $userLogin = htmlspecialchars($USER->GetFullName() ?: $USER->GetLogin());
          $userEmail = htmlspecialchars($USER->GetEmail());
        ?>
        <p class="account-user-greeting__name"><?= $userLogin ?></p>
        <p class="account-user-greeting__email"><?= $userEmail ?></p>
        <?php else: ?>
        <p class="account-user-greeting__name">Гость</p>
        <?php endif; ?>
      </div>
      <nav class="account-nav">
        <div class="account-nav__item account-nav__item_active" data-nav="orders">
          <a class="account-nav__link" href="#orders" data-panel="orders" aria-current="page">История заказов</a>
          <span class="account-nav__marker"></span>
        </div>
        <div class="account-nav__item" data-nav="profile">
          <a class="account-nav__link" href="#profile" data-panel="profile">Данные</a>
        </div>
        <div class="account-nav__item">
          <a class="account-nav__link" href="/wishlist/">Избранное</a>
        </div>
        <div class="account-nav__item">
          <a class="account-nav__link" href="/cart/">Корзина</a>
        </div>
        <?php if ($USER->IsAuthorized()): ?>
        <div class="account-nav__item">
          <a class="account-nav__link" href="/auth/?logout=yes&amp;sessid=<?= bitrix_sessid() ?>">Выйти</a>
        </div>
        <?php endif; ?>
      </nav>
    </aside>

    <!-- Контент -->
    <div class="account-content">
      <?php
      $APPLICATION->IncludeComponent(
          'bitrix:sale.personal.order.list',
          '',
          [
              'PATH_TO_DETAIL'   => '/order/detail/#account_number#/',
              'PATH_TO_REORDER'  => '/order/reorder/#account_number#/',
              'PATH_TO_PAYMENT'  => '/pay/order/#account_number#/',
              'SET_TITLE'        => 'N',
              'CACHE_TYPE'       => 'N',
          ]
      );
      ?>
    </div>
  </div>
</main>

<?php require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/footer.php'); ?>
