<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Main\Loader;

Loader::includeModule("iblock");

// Фильтр
$arFilter = [
    "IBLOCK_ID" => $arParams["IBLOCK_ID"],
    "ACTIVE" => "Y"
];

// Фильтр по коллекции (разделу)
if (!empty($arParams["SECTION_ID"])) {
    $arFilter["PROPERTY_COLLECTION"] = intval($arParams["SECTION_ID"]);
} elseif (!empty($arParams["SECTION_CODE"])) {
    // Получаем ID коллекции по коду
    $rsSection = CIBlockElement::GetList(
        [],
        [
            "IBLOCK_TYPE" => "catalog",
            "CODE" => $arParams["SECTION_CODE"],
            "ACTIVE" => "Y"
        ],
        false,
        false,
        ["ID"]
    );
    if ($arSection = $rsSection->Fetch()) {
        $arFilter["PROPERTY_COLLECTION"] = $arSection["ID"];
        $arResult["COLLECTION_ID"] = $arSection["ID"];
    }
}

// Пагинация
$navParams = [
    "nPageSize" => intval($arParams["ELEMENT_COUNT"]) ?: 12,
    "bShowAll" => false
];

// Выборка элементов
$arSelect = [
    "ID", "NAME", "CODE", "PREVIEW_PICTURE", "PREVIEW_TEXT",
    "DETAIL_PAGE_URL", "PROPERTY_PRICE", "PROPERTY_MODEL_CODE"
];

$rsElements = CIBlockElement::GetList(
    ["SORT" => "ASC", "NAME" => "ASC"],
    $arFilter,
    false,
    $navParams,
    $arSelect
);

$arResult["ITEMS"] = [];
while ($arElement = $rsElements->GetNextElement()) {
    $arFields = $arElement->GetFields();
    $arFields["PROPERTIES"] = $arElement->GetProperties();
    $arResult["ITEMS"][] = $arFields;
}

$arResult["NAV_STRING"] = $rsElements->GetPageNavStringEx($navComponentObject, "Двери", "", false);

$this->IncludeComponentTemplate();
