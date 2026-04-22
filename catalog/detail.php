<?php
/**
 * /catalog/detail.php
 * Динамическая карточка товара из инфоблока Битрикс.
 * Аналог статических product-*.html, но генерируется автоматически.
 * Статические файлы НЕ трогаются и остаются как резервная копия.
 *
 * URL: /catalog/{CODE}/  (настраивается через urlrewrite.php)
 */

require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/header.php');

/** @var CMain $APPLICATION */
$APPLICATION->SetTitle('Карточка двери');

$APPLICATION->IncludeComponent(
    'bitrix:catalog.element',
    'dveryaninov',               // шаблон из /local/templates/dveryaninov/components/bitrix/catalog.element/dveryaninov/
    [
        'IBLOCK_TYPE'         => 'DOORS_CATALOG',
        'IBLOCK_ID'           => 10,             // ← ID инфоблока «Двери» из п.3.3 (уточнить после создания)
        'ELEMENT_CODE'        => $_REQUEST['ELEMENT_CODE'] ?? '',
        'SECTION_CODE'        => $_REQUEST['SECTION_CODE'] ?? '',
        'SET_TITLE'           => 'Y',
        'SET_CANONICAL_URL'   => 'Y',
        'GENERATE_LINKS'      => 'Y',
        'DETAIL_URL'          => '/catalog/#CODE#/',
        'SECTION_URL'         => '/catalog/#SECTION_CODE#/',
        'ADD_SECTIONS_CHAIN'  => 'Y',
        'HIDE_DETAIL_URL'     => 'N',
        'CACHE_TYPE'          => 'A',
        'CACHE_TIME'          => 3600,
        'CACHE_GROUPS'        => 'Y',
    ]
);

require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/footer.php');
