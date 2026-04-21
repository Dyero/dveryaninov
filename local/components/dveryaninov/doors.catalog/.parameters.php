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
        ],
        "SECTION_ID" => [
            "PARENT" => "BASE",
            "NAME" => "ID раздела (коллекции)",
            "TYPE" => "STRING",
            "DEFAULT" => "={$_REQUEST['SECTION_ID']}",
        ],
        "SECTION_CODE" => [
            "PARENT" => "BASE",
            "NAME" => "Код раздела (коллекции)",
            "TYPE" => "STRING",
            "DEFAULT" => "={$_REQUEST['SECTION_CODE']}",
        ],
        "ELEMENT_COUNT" => [
            "PARENT" => "BASE",
            "NAME" => "Количество элементов на странице",
            "TYPE" => "STRING",
            "DEFAULT" => "12",
        ],
        "CACHE_TIME" => ["DEFAULT" => 3600],
    ],
];
