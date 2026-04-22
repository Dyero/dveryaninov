<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Доставка и оплата");
$APPLICATION->SetPageProperty("description", "Доставка межкомнатных дверей по всей России. Удобные способы оплаты.");
?>

<main class="page-content">
    <nav class="breadcrumbs" aria-label="Хлебные крошки">
        <a class="breadcrumbs__link" href="/">Главная</a>
        <span class="breadcrumbs__sep">–</span>
        <span class="breadcrumbs__current">Доставка и оплата</span>
    </nav>

    <h1>Доставка и оплата</h1>

    <section class="content-section">
        <h2>Способы доставки</h2>

        <div class="delivery-option">
            <h3>Самовывоз</h3>
            <p>Вы можете забрать заказ самостоятельно из нашего офиса и шоурума по адресу: г. Новочебоксарск, Промышленная ул., 53, этаж 1, офис 4</p>
            <p><strong>Стоимость:</strong> Бесплатно</p>
        </div>

        <div class="delivery-option">
            <h3>Доставка по Чебоксарам и Новочебоксарску</h3>
            <p>Доставка в пределах города осуществляется нашей службой доставки в течение 1-2 рабочих дней после готовности заказа.</p>
            <p><strong>Стоимость:</strong> 500 ₽</p>
        </div>

        <div class="delivery-option">
            <h3>Доставка по России</h3>
            <p>Доставка в другие города России осуществляется транспортными компаниями (ПЭК, Деловые Линии, СДЭК и др.).</p>
            <p><strong>Стоимость:</strong> Рассчитывается индивидуально</p>
            <p><strong>Срок:</strong> От 3 до 14 рабочих дней в зависимости от региона</p>
        </div>
    </section>

    <section class="content-section">
        <h2>Способы оплаты</h2>

        <ul class="payment-list">
            <li><strong>Наличными</strong> при получении заказа</li>
            <li><strong>Банковской картой</strong> при получении или онлайн на сайте</li>
            <li><strong>Безналичный расчёт</strong> для юридических лиц (по выставленному счёту)</li>
            <li><strong>Онлайн-оплата</strong> через платёжные системы</li>
        </ul>
    </section>

    <section class="content-section">
        <h2>Важная информация</h2>

        <ul class="info-list">
            <li>Точная стоимость и срок доставки уточняются менеджером при оформлении заказа</li>
            <li>Перед отправкой заказ проходит контроль качества</li>
            <li>Вы можете отследить статус доставки в личном кабинете</li>
            <li>При получении обязательно проверьте комплектность и целостность товара</li>
        </ul>
    </section>

    <section class="cta-section">
        <h2>Нужна консультация?</h2>
        <p>Наши менеджеры ответят на все вопросы по доставке и оплате</p>
        <p><a href="tel:88005508869" class="btn btn_primary">8 800 550-88-69</a></p>
    </section>
</main>

<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
?>
