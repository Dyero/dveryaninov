<?php
/**
 * /local/templates/dveryaninov/footer.php
 * Подвал сайта Дверянинов для 1С-Битрикс
 * НЕ редактировать оригинальный footer.html
 */
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

$tplDir = SITE_TEMPLATE_PATH;
?>

<footer class="footer">
  <div class="footer__top">
    <div class="footer__brand">
      <a href="/"><img class="footer__logo" src="<?= $tplDir ?>/images/logo-footer.svg"
           alt="Дверянинов" width="266" height="81"></a>
      <div class="footer__contact">
        <a class="footer__phone" href="tel:88005508869">8 800 550-88-69</a>
        <p class="footer__hours">с 08:00 до 17:00 по МСК</p>
      </div>
      <div class="footer__social">
        <p class="footer__social-title">Присоединяйтесь</p>
        <div class="footer__social-links"></div>
      </div>
      <div class="footer__email-block">
        <p class="footer__label">По всем вопросам</p>
        <a class="footer__email" href="mailto:info@dveryaninov.ru">info@dveryaninov.ru</a>
      </div>
    </div>
    <div class="footer__columns">
      <div class="footer__column">
        <h4 class="footer__column-title">Каталог</h4>
        <ul class="footer__list">
          <li><a href="/catalog/">Межкомнатные двери</a></li>
          <li><a href="/catalog/vkhodnye/">Входные двери</a></li>
          <li><a href="/catalog/skrytye/">Скрытые двери</a></li>
          <li><a href="/catalog/reyki/">Декоративные рейки</a></li>
          <li><a href="/catalog/paneli/">Стеновые панели</a></li>
          <li><a href="/catalog/furnitura/">Фурнитура</a></li>
        </ul>
      </div>
      <div class="footer__column">
        <h4 class="footer__column-title">Услуги</h4>
        <ul class="footer__list">
          <li><a href="/services/">Выездная консультация</a></li>
          <li><a href="/services/">Доставка и установка</a></li>
        </ul>
      </div>
      <div class="footer__column">
        <h4 class="footer__column-title">Информация</h4>
        <ul class="footer__list">
          <li><a href="/about/payment/">Оплата и гарантия</a></li>
          <li><a href="/about/tips/">Советы и рекомендации</a></li>
          <li><a href="/designers/">Дизайнерам</a></li>
          <li><a href="/partners/">Партнёрам</a></li>
          <li><a href="/contacts/">Адреса салонов</a></li>
          <li><a href="/contacts/">Контакты</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div class="footer__divider"></div>
</footer>

<!-- Нижнее мобильное меню -->
<nav class="mobile-menu" aria-label="Нижнее меню">
  <a class="mobile-menu__item" href="/catalog/">
    <span class="mobile-menu__icon" aria-hidden="true"></span>
    <span class="mobile-menu__label">Каталог</span>
  </a>
  <a class="mobile-menu__item" href="/about/">
    <span class="mobile-menu__icon mobile-menu__icon_about" aria-hidden="true"></span>
    <span class="mobile-menu__label">О компании</span>
  </a>
  <a class="mobile-menu__item" href="/cart/">
    <span class="mobile-menu__icon mobile-menu__icon_cart" aria-hidden="true"></span>
    <span class="mobile-menu__label">Корзина</span>
  </a>
  <a class="mobile-menu__item" href="/contacts/">
    <span class="mobile-menu__icon mobile-menu__icon_contacts" aria-hidden="true"></span>
    <span class="mobile-menu__label">Контакты</span>
  </a>
</nav>

<!-- JS-файлы; CSS берётся из корня /css/ -->
<script src="/js/coatings-data.js"></script>
<script src="/js/auth.js"></script>
<script src="/js/load-components.js"></script>
<script src="/js/shop.js"></script>
<script src="/js/product.js"></script>
<?php $APPLICATION->ShowAjaxHead(); ?>
</body>
</html>
