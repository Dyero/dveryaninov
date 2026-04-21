<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Main\Loader;

Loader::includeModule("iblock");

// Определяем ID коллекции
$collectionId = 0;
if (!empty($arParams["ELEMENT_ID"])) {
    $collectionId = intval($arParams["ELEMENT_ID"]);
} elseif (!empty($arParams["ELEMENT_CODE"])) {
    $rsCollection = CIBlockElement::GetList(
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
    if ($arCollection = $rsCollection->Fetch()) {
        $collectionId = $arCollection["ID"];
    }
}

if ($collectionId <= 0) {
    ShowError("Коллекция не найдена");
    return;
}

// Получаем данные коллекции
$rsCollection = CIBlockElement::GetList(
    [],
    ["IBLOCK_ID" => $arParams["IBLOCK_ID"], "ID" => $collectionId, "ACTIVE" => "Y"],
    false,
    false,
    ["ID", "NAME", "CODE", "PREVIEW_TEXT", "DETAIL_TEXT", "PREVIEW_PICTURE", "DETAIL_PICTURE", "PROPERTY_*"]
);

if (!($arResult["COLLECTION"] = $rsCollection->GetNextElement())) {
    ShowError("Коллекция не найдена");
    return;
}

$arResult["COLLECTION"] = $arResult["COLLECTION"]->GetFields();
$arResult["COLLECTION"]["PROPERTIES"] = CIBlockElement::GetProperty(
    $arParams["IBLOCK_ID"],
    $collectionId,
    [],
    []
);

$collectionProperties = [];
while ($prop = $arResult["COLLECTION"]["PROPERTIES"]->Fetch()) {
    $collectionProperties[$prop["CODE"]] = $prop;
}
$arResult["COLLECTION"]["PROPERTIES"] = $collectionProperties;

// Получаем превью картинку
if (!empty($arResult["COLLECTION"]["PREVIEW_PICTURE"])) {
    $arResult["COLLECTION"]["PREVIEW_PICTURE_SRC"] = CFile::GetPath($arResult["COLLECTION"]["PREVIEW_PICTURE"]);
}

// Получаем детальную картинку
if (!empty($arResult["COLLECTION"]["DETAIL_PICTURE"])) {
    $arResult["COLLECTION"]["DETAIL_PICTURE_SRC"] = CFile::GetPath($arResult["COLLECTION"]["DETAIL_PICTURE"]);
}

// Получаем все двери из этой коллекции
$arResult["DOORS"] = [];

$rsDoors = CIBlockElement::GetList(
    ["SORT" => "ASC", "NAME" => "ASC"],
    [
        "IBLOCK_ID" => $arParams["DOORS_IBLOCK_ID"],
        "ACTIVE" => "Y",
        "PROPERTY_COLLECTION" => $collectionId
    ],
    false,
    false,
    [
        "ID", "NAME", "CODE", "PREVIEW_TEXT", "PREVIEW_PICTURE",
        "PROPERTY_PRICE", "PROPERTY_MODEL_CODE", "DETAIL_PAGE_URL"
    ]
);

while ($arDoor = $rsDoors->GetNextElement()) {
    $arDoorFields = $arDoor->GetFields();
    $arDoorProps = $arDoor->GetProperties();

    // Формируем превью картинку
    if (!empty($arDoorFields["PREVIEW_PICTURE"])) {
        $arDoorFields["PREVIEW_PICTURE_SRC"] = CFile::GetPath($arDoorFields["PREVIEW_PICTURE"]);
    }

    // Добавляем свойства
    $arDoorFields["PRICE"] = $arDoorProps["PRICE"]["VALUE"];
    $arDoorFields["MODEL_CODE"] = $arDoorProps["MODEL_CODE"]["VALUE"];

    // Формируем URL к детальной странице
    $arDoorFields["DETAIL_PAGE_URL"] = "/catalog/" . $arResult["COLLECTION"]["CODE"] . "/" . $arDoorFields["CODE"] . "/";

    $arResult["DOORS"][] = $arDoorFields;
}

// Устанавливаем заголовок и мета-теги
$APPLICATION->SetTitle($arResult["COLLECTION"]["NAME"]);
if (!empty($arResult["COLLECTION"]["PREVIEW_TEXT"])) {
    $APPLICATION->SetPageProperty("description", strip_tags($arResult["COLLECTION"]["PREVIEW_TEXT"]));
}

$this->IncludeComponentTemplate();
