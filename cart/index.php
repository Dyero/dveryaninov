<?php
/**
 * /cart/index.php
 * Страница «Корзина» — PHP/Битрикс версия.
 * Использует компонент sale.basket.basket.
 * Статический cart.html остаётся нетронутым.
 */
require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/header.php');
$APPLICATION->SetTitle('Корзина — Дверянинов');
?>

<main class="cart-page">
  <nav class="breadcrumbs" aria-label="Хлебные крошки">
    <a class="breadcrumbs__link" href="/">Главная</a>
    <span class="breadcrumbs__sep">–</span>
    <span class="breadcrumbs__current">Корзина</span>
  </nav>

  <h1 class="cart-page__title">Корзина</h1>

  <?php
  $APPLICATION->IncludeComponent(
      'bitrix:sale.basket.basket',
      '',
      [
          'PATH_TO_CHECKOUT' => '/order/make/',
          'PATH_TO_STORE'    => '/catalog/',
          'COLUMNS'          => ['image', 'name', 'price', 'quantity', 'sum'],
          'SET_TITLE'        => 'N',
          'CACHE_TYPE'       => 'N',
          'SHOW_EMPTY_BASKET'=> 'Y',
          'BASKET_URL'       => '/cart/',
      ]
  );
  ?>
</main>

<script src="/js/shop.js"></script>
<script src="/js/cart.js"></script>

<?php require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/footer.php'); ?>
