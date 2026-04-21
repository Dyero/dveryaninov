<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Main\Loader;

Loader::includeModule("iblock");

$arIBlockType = CIBlockParameters::GetIBlockTypes();

$arIBlock = [];
$rsIBlock = CIBlock::GetList(["SORT" => "ASC"], ["TYPE" => $arCurrentValues["IBLOCK_TYPE"], "ACTIVE" => "Y"]);
while ($arr = $rsIBlock->Fetch()) {
    $arIBlock[$arr["ID"]] = "[" . $arr["ID"] . "] " . $arr["NAME"];
}

$arComponentParameters = [
    "GROUPS" => [],
    "PARAMETERS" => [
        "IBLOCK_TYPE" => [
            "PARENT" => "BASE",
            "NAME" => "Тип инфоблока",
            "TYPE" => "LIST",
            "VALUES" => $arIBlockType,
            "REFRESH" => "Y",
        ],
        "IBLOCK_ID" => [
            "PARENT" => "BASE",
            "NAME" => "Инфоблок",
            "TYPE" => "LIST",
            "VALUES" => $arIBlock,
            "REFRESH" => "Y",
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
        "CACHE_TIME" => ["DEFAULT" => 3600],
        "CACHE_GROUPS" => [
            "PARENT" => "CACHE_SETTINGS",
            "NAME" => "Учитывать права доступа",
            "TYPE" => "CHECKBOX",
            "DEFAULT" => "Y",
        ],
    ],
];
