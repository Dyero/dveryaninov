<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Main\Loader;
use Bitrix\Main\Application;
use Bitrix\Iblock;
use Bitrix\Highloadblock as HL;

Loader::includeModule("iblock");
Loader::includeModule("highloadblock");

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

// Получаем элемент двери
$arSelect = [
    "ID", "NAME", "CODE", "PREVIEW_TEXT", "DETAIL_TEXT",
    "PREVIEW_PICTURE", "DETAIL_PICTURE", "IBLOCK_SECTION_ID",
    "PROPERTY_*"
];

$rsElement = CIBlockElement::GetList(
    [],
    ["IBLOCK_ID" => $arParams["IBLOCK_ID"], "ID" => $elementId, "ACTIVE" => "Y"],
    false,
    false,
    $arSelect
);

if (!($arResult["DOOR"] = $rsElement->GetNextElement())) {
    ShowError("Элемент не найден");
    return;
}

$arResult["DOOR"] = $arResult["DOOR"]->GetFields();
$arResult["DOOR"]["PROPERTIES"] = $arResult["DOOR"]["GetProperties"]();

// Получаем коллекцию
$collectionId = intval($arResult["DOOR"]["PROPERTIES"]["COLLECTION"]["VALUE"]);
if ($collectionId > 0) {
    $rsCollection = CIBlockElement::GetByID($collectionId);
    if ($arCollection = $rsCollection->GetNextElement()) {
        $arResult["COLLECTION"] = $arCollection->GetFields();
        $arResult["COLLECTION"]["PROPERTIES"] = $arCollection->GetProperties();
    }
}

// Функция для получения данных из Highload блока
function getHLData($hlBlockId, $filter = [], $order = ["UF_SORT" => "ASC"]) {
    $hlblock = HL\HighloadBlockTable::getById($hlBlockId)->fetch();
    if (!$hlblock) {
        return [];
    }

    $entity = HL\HighloadBlockTable::compileEntity($hlblock);
    $entityDataClass = $entity->getDataClass();

    $rsData = $entityDataClass::getList([
        "select" => ["*"],
        "filter" => $filter,
        "order" => $order
    ]);

    $result = [];
    while ($item = $rsData->fetch()) {
        $result[] = $item;
    }
    return $result;
}

// Загружаем покрытия из Highload блока (HLBLOCK_4)
$coatingTypes = [];
if (!empty($arResult["COLLECTION"]["PROPERTIES"]["COATING_TYPES"]["VALUE"])) {
    $coatingTypes = $arResult["COLLECTION"]["PROPERTIES"]["COATING_TYPES"]["VALUE"];
}

$coatingFilter = ["UF_ACTIVE" => 1];
if (!empty($coatingTypes)) {
    $coatingFilter["UF_TYPE"] = $coatingTypes;
}
$arResult["COATINGS"] = getHLData(4, $coatingFilter);

// Загружаем стёкла (HLBLOCK_2 или HLBLOCK_6)
$arResult["GLASSES"] = getHLData(2, ["UF_ACTIVE" => 1]);

// Группировка стёкол по категориям
$arResult["GLASSES_BY_CATEGORY"] = [];
foreach ($arResult["GLASSES"] as $glass) {
    $category = !empty($glass["UF_CATEGORY"]) ? $glass["UF_CATEGORY"] : "common";
    $arResult["GLASSES_BY_CATEGORY"][$category][] = $glass;
}

// Загружаем варианты открывания (HLBLOCK_8)
$arResult["OPENING_VARIANTS"] = getHLData(8, []);

// Загружаем алюминиевые кромки (HLBLOCK_9)
$arResult["ALU_EDGES"] = getHLData(9, ["UF_ACTIVE" => 1]);

// Получаем галерею
$arResult["GALLERY"] = [];
if (!empty($arResult["DOOR"]["PROPERTIES"]["GALLERY"]["VALUE"])) {
    $galleryIds = $arResult["DOOR"]["PROPERTIES"]["GALLERY"]["VALUE"];
    if (!is_array($galleryIds)) {
        $galleryIds = [$galleryIds];
    }
    foreach ($galleryIds as $fileId) {
        if ($arFile = CFile::GetFileArray($fileId)) {
            $arResult["GALLERY"][] = $arFile;
        }
    }
}

// Если галерея пустая, используем основное фото
if (empty($arResult["GALLERY"]) && !empty($arResult["DOOR"]["DETAIL_PICTURE"])) {
    if ($arFile = CFile::GetFileArray($arResult["DOOR"]["DETAIL_PICTURE"])) {
        $arResult["GALLERY"][] = $arFile;
    }
}

// Получаем другие модели из коллекции
$arResult["RELATED_DOORS"] = [];
if ($collectionId > 0) {
    $rsRelated = CIBlockElement::GetList(
        ["SORT" => "ASC"],
        [
            "IBLOCK_ID" => $arParams["IBLOCK_ID"],
            "ACTIVE" => "Y",
            "!ID" => $elementId,
            "PROPERTY_COLLECTION" => $collectionId
        ],
        false,
        ["nTopCount" => 4],
        ["ID", "NAME", "CODE", "PREVIEW_PICTURE", "PROPERTY_PRICE", "DETAIL_PAGE_URL"]
    );

    while ($arRelated = $rsRelated->GetNextElement()) {
        $arRelatedFields = $arRelated->GetFields();
        $arRelatedFields["PROPERTIES"] = $arRelated->GetProperties();
        $arResult["RELATED_DOORS"][] = $arRelatedFields;
    }
}

// Формируем доступные размеры
$arResult["AVAILABLE_SIZES"] = [];
if (!empty($arResult["DOOR"]["PROPERTIES"]["AVAILABLE_SIZES"]["VALUE"])) {
    $arResult["AVAILABLE_SIZES"] = $arResult["DOOR"]["PROPERTIES"]["AVAILABLE_SIZES"]["VALUE"];
}

// Базовая цена
$arResult["BASE_PRICE"] = floatval($arResult["DOOR"]["PROPERTIES"]["PRICE"]["VALUE"]);
$arResult["PRICE_PO"] = floatval($arResult["DOOR"]["PROPERTIES"]["PRICE_PO"]["VALUE"]);

$this->IncludeComponentTemplate();
