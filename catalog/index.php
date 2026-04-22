<?php
/**
 * /catalog/index.php
 * Страница каталога — список товаров из инфоблока Битрикс.
 * Аналог статического catalog.html, но динамический.
 * Статический catalog.html остаётся нетронутым.
 *
 * URL: /catalog/  или  /catalog/{SECTION_CODE}/
 */

require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/header.php');

/** @var CMain $APPLICATION */
$APPLICATION->SetTitle('Каталог дверей');

$APPLICATION->IncludeComponent(
    'bitrix:catalog.section',
    'dveryaninov',               // шаблон из /local/templates/dveryaninov/components/bitrix/catalog.section/dveryaninov/
    [
        'IBLOCK_TYPE'     => 'DOORS_CATALOG',
        'IBLOCK_ID'       => 10,             // ← ID инфоблока «Двери»
        'SECTION_CODE'    => $_REQUEST['SECTION_CODE'] ?? '',
        'DETAIL_URL'      => '/catalog/#CODE#/',
        'SECTION_URL'     => '/catalog/#SECTION_CODE#/',
        'ELEMENT_URL'     => '/catalog/#CODE#/',
        'SET_TITLE'       => 'Y',
        'ADD_SECTIONS_CHAIN' => 'Y',
        'CACHE_TYPE'      => 'A',
        'CACHE_TIME'      => 3600,
        'CACHE_GROUPS'    => 'Y',
        'SECTION_COUNT'   => 50,
        'ELEMENT_COUNT'   => 100,
        'SORT_BY1'        => 'SORT',
        'SORT_ORDER1'     => 'ASC',
        'SORT_BY2'        => 'NAME',
        'SORT_ORDER2'     => 'ASC',
        'INCLUDE_SUBSECTIONS' => 'Y',
        'DISPLAY_TOP_PAGER'   => 'N',
        'DISPLAY_BOTTOM_PAGER' => 'Y',
        'PAGER_TITLE'         => 'Страница',
        'PAGER_SHOW_ALL'      => 'N',
        'LINE_COUNT'          => 4,         // 4 товара в ряд на десктопе
        'COLUMN_COUNT'        => 4,
    ]
);

require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/footer.php');
