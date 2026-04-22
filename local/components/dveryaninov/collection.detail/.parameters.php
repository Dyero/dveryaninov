<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

$arComponentParameters = [
    "PARAMETERS" => [
        "IBLOCK_ID" => [
            "PARENT" => "BASE",
            "NAME" => "ID инфоблока коллекций",
            "TYPE" => "STRING",
        ],
        "DOORS_IBLOCK_ID" => [
            "PARENT" => "BASE",
            "NAME" => "ID инфоблока дверей",
            "TYPE" => "STRING",
        ],
        "ELEMENT_ID" => [
            "PARENT" => "BASE",
            "NAME" => "ID элемента",
            "TYPE" => "STRING",
            "DEFAULT" => "={$_REQUEST['ELEMENT_ID']}",
        ],
        "ELEMENT_CODE" => [
            "PARENT" => "BASE",
            "NAME" => "Символьный код элемента",
            "TYPE" => "STRING",
            "DEFAULT" => "={$_REQUEST['ELEMENT_CODE']}",
        ],
        "CACHE_TIME" => [
            "DEFAULT" => 3600
        ],
    ],
];
