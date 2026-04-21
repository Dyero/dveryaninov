<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
?>

    <!-- Footer -->
    <footer class="footer" role="contentinfo">
        <div class="footer__wrapper">
            <div class="footer__top">
                <div class="footer__col footer__col_logo">
                    <a href="/" class="footer__logo">
                        <img src="<?= SITE_TEMPLATE_PATH ?>/images/logo.svg" alt="Дверянинов" width="160" height="40">
                    </a>
                    <p class="footer__text">Производитель межкомнатных дверей</p>
                </div>

                <div class="footer__col">
                    <h3 class="footer__title">Каталог</h3>
                    <ul class="footer__list">
                        <li><a href="/catalog/" class="footer__link">Все двери</a></li>
                        <li><a href="/collections/" class="footer__link">Коллекции</a></li>
                        <li><a href="/molding/" class="footer__link">Погонаж</a></li>
                        <li><a href="/hardware/" class="footer__link">Фурнитура</a></li>
                    </ul>
                </div>

                <div class="footer__col">
                    <h3 class="footer__title">Компания</h3>
                    <ul class="footer__list">
                        <li><a href="/about/" class="footer__link">О компании</a></li>
                        <li><a href="/contacts/" class="footer__link">Контакты</a></li>
                        <li><a href="/delivery/" class="footer__link">Доставка</a></li>
                        <li><a href="/guarantee/" class="footer__link">Гарантия</a></li>
                    </ul>
                </div>

                <div class="footer__col">
                    <h3 class="footer__title">Контакты</h3>
                    <ul class="footer__list">
                        <li><a href="tel:+74951234567" class="footer__link">+7 (495) 123-45-67</a></li>
                        <li><a href="mailto:info@dveryaninov.ru" class="footer__link">info@dveryaninov.ru</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer__bottom">
                <p class="footer__copyright">© <?= date("Y") ?> Дверянинов. Все права защищены.</p>
                <a href="/privacy/" class="footer__link">Политика конфиденциальности</a>
            </div>
        </div>
    </footer>

    <!-- Mobile Menu -->
    <nav class="mobile-menu" aria-label="Нижнее меню">
        <a class="mobile-menu__item" href="/catalog/">
            <span class="mobile-menu__icon" aria-hidden="true"></span>
            <span class="mobile-menu__label">Каталог</span>
        </a>
        <a class="mobile-menu__item" href="/about/">
            <span class="mobile-menu__icon mobile-menu__icon_about" aria-hidden="true"></span>
            <span class="mobile-menu__label">О компании</span>
        </a>
        <a class="mobile-menu__item" href="/contacts/">
            <span class="mobile-menu__icon mobile-menu__icon_contacts" aria-hidden="true"></span>
            <span class="mobile-menu__label">Контакты</span>
        </a>
        <a class="mobile-menu__item" href="/personal/">
            <span class="mobile-menu__icon mobile-menu__icon_profile" aria-hidden="true"></span>
            <span class="mobile-menu__label">Профиль</span>
        </a>
    </nav>

</body>
</html>
