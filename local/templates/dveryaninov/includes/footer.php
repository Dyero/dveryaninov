<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
?>
<footer class="footer">
    <div class="footer__top">
        <div class="footer__brand">
            <a href="/"><img class="footer__logo" src="<?= SITE_TEMPLATE_PATH ?>/images/logo-footer.svg" alt="Дверянинов" width="266" height="81"></a>
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
                    <li><a href="/collections/">Коллекции</a></li>
                    <li><a href="/molding/">Погонаж</a></li>
                    <li><a href="/hardware/">Фурнитура</a></li>
                </ul>
            </div>
            <div class="footer__column">
                <h4 class="footer__column-title">Услуги</h4>
                <ul class="footer__list">
                    <li><a href="/service/">Выездная консультация</a></li>
                    <li><a href="/delivery/">Доставка и установка</a></li>
                </ul>
            </div>
            <div class="footer__column">
                <h4 class="footer__column-title">Информация</h4>
                <ul class="footer__list">
                    <li><a href="/guarantee/">Оплата и гарантия</a></li>
                    <li><a href="/about/">О компании</a></li>
                    <li><a href="/contacts/">Адреса салонов</a></li>
                    <li><a href="/contacts/">Контакты</a></li>
                    <li><a href="/privacy/">Политика конфиденциальности</a></li>
                </ul>
            </div>
        </div>
    </div>
    <div class="footer__divider"></div>
    <div class="footer__bottom">
        <p class="footer__copyright">© <?= date("Y") ?> Дверянинов. Все права защищены.</p>
    </div>
</footer>
