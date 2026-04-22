<?php
/**
 * /local/components/dveryaninov/configurator/.parameters.php
 * Описание параметров компонента конфигуратора
 */
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

$arComponentParameters = [
    'PARAMETERS' => [
        'IBLOCK_ID' => [
            'NAME'    => 'ID инфоблока Двери',
            'TYPE'    => 'STRING',
            'DEFAULT' => '10',
        ],
        'ELEMENT_ID' => [
            'NAME'    => 'ID элемента',
            'TYPE'    => 'STRING',
            'DEFAULT' => '',
        ],
        'ELEMENT_CODE' => [
            'NAME'    => 'Символьный код элемента',
            'TYPE'    => 'STRING',
            'DEFAULT' => '',
        ],
    ],
];
