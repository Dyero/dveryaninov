<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Main\Loader;

Loader::includeModule("iblock");

// Определяем ID элемента
$elementId = 0;
if (!empty($arParams["ELEMENT_ID"])) {
    $elementId = intval($arParams["ELEMENT_ID"]);
} elseif (!empty($arParams["ELEMENT_CODE"])) {
    $rsElement = CIBlockElement::GetList(
        [],
        [
            "IBLOCK_ID" => $arParams["IBLOCK_ID"],
            "CODE" => $arParams["ELEMENT_CODE"],
            "ACTIVE" => "Y"
        ],
        false,
        false,
        ["ID"]
    );
    if ($arElement = $rsElement->Fetch()) {
        $elementId = $arElement["ID"];
    }
}

if ($elementId <= 0) {
    ShowError("Элемент не найден");
    return;
}

// Получаем элемент
$arSelect = [
    "ID", "NAME", "CODE", "PREVIEW_TEXT", "DETAIL_TEXT",
    "PREVIEW_PICTURE", "DETAIL_PICTURE", "PROPERTY_*"
];

$rsElement = CIBlockElement::GetList(
    [],
    ["IBLOCK_ID" => $arParams["IBLOCK_ID"], "ID" => $elementId, "ACTIVE" => "Y"],
    false,
    false,
    $arSelect
);

if ($arElement = $rsElement->GetNextElement()) {
    $arResult["ITEM"] = $arElement->GetFields();
    $arResult["ITEM"]["PROPERTIES"] = $arElement->GetProperties();
} else {
    ShowError("Элемент не найден");
    return;
}

// Цена и единицы измерения
$arResult["PRICE"] = floatval($arResult["ITEM"]["PROPERTIES"]["PRICE"]["VALUE"]);
$arResult["UNIT"] = $arResult["ITEM"]["PROPERTIES"]["UNIT"]["VALUE"] ?: "шт";

// Размеры/параметры
$arResult["DIMENSIONS"] = $arResult["ITEM"]["PROPERTIES"]["DIMENSIONS"]["VALUE"];
$arResult["SUBTYPE"] = $arResult["ITEM"]["PROPERTIES"]["SUBTYPE"]["VALUE"];

$this->IncludeComponentTemplate();
