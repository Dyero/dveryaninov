<?php
/**
 * Инициализационный файл для настройки Bitrix
 * Автогенерация символьных кодов, события, константы
 */

// Автоматическая генерация символьного кода при создании/обновлении элемента
AddEventHandler("iblock", "OnBeforeIBlockElementAdd", "generateSymbolCode");
AddEventHandler("iblock", "OnBeforeIBlockElementUpdate", "generateSymbolCode");

function generateSymbolCode(&$arFields) {
    // Генерируем код только если он пустой и есть название
    if (empty($arFields["CODE"]) && !empty($arFields["NAME"])) {
        $arFields["CODE"] = CUtil::translit(
            $arFields["NAME"],
            "ru",
            [
                "max_len" => 100,
                "change_case" => "L",  // Lowercase
                "replace_space" => "-",
                "replace_other" => "-",
                "delete_repeat_replace" => true,
                "use_google" => false,
            ]
        );
    }
}

// Автоматическая генерация детального URL для дверей
AddEventHandler("iblock", "OnAfterIBlockElementAdd", "generateDoorDetailUrl");
AddEventHandler("iblock", "OnAfterIBlockElementUpdate", "generateDoorDetailUrl");

function generateDoorDetailUrl($arFields) {
    // ID инфоблока дверей (настроить после создания)
    $DOORS_IBLOCK_ID = 2;

    if ($arFields["IBLOCK_ID"] != $DOORS_IBLOCK_ID) {
        return;
    }

    CIBlockElement::SetPropertyValuesEx(
        $arFields["ID"],
        $DOORS_IBLOCK_ID,
        ["DETAIL_PAGE_URL" => "/catalog/#SECTION_CODE#/#ELEMENT_CODE#/"]
    );
}

// Константы для ID инфоблоков
// После создания инфоблоков через админку, обновите эти значения
define("COLLECTIONS_IBLOCK_ID", 1);  // Коллекции дверей
define("DOORS_IBLOCK_ID", 2);        // Двери
define("MOLDING_IBLOCK_ID", 3);      // Погонаж
define("HARDWARE_IBLOCK_ID", 4);     // Фурнитура

// Константы для Highload блоков
define("HL_COATINGS", 4);            // Покрытия
define("HL_GLASSES", 2);             // Стёкла
define("HL_OPENING_VARIANTS", 8);    // Варианты открывания
define("HL_ALU_EDGES", 9);           // Алюминиевые кромки
define("HL_PRICE_NACENKA", 7);       // Наценки

// Функция для получения данных из Highload блока
function getHLBlockData($hlBlockId, $filter = [], $order = ["UF_SORT" => "ASC"]) {
    if (!CModule::IncludeModule("highloadblock")) {
        return [];
    }

    $hlblock = Bitrix\Highloadblock\HighloadBlockTable::getById($hlBlockId)->fetch();
    if (!$hlblock) {
        return [];
    }

    $entity = Bitrix\Highloadblock\HighloadBlockTable::compileEntity($hlblock);
    $entityDataClass = $entity->getDataClass();

    $rsData = $entityDataClass::getList([
        "select" => ["*"],
        "filter" => $filter,
        "order" => $order
    ]);

    $result = [];
    while ($item = $rsData->fetch()) {
        // Обработка файлов
        if (!empty($item["UF_IMAGE"]) && is_numeric($item["UF_IMAGE"])) {
            $item["UF_IMAGE_SRC"] = CFile::GetPath($item["UF_IMAGE"]);
        }
        if (!empty($item["UF_FILE"]) && is_numeric($item["UF_FILE"])) {
            $item["UF_FILE_SRC"] = CFile::GetPath($item["UF_FILE"]);
        }
        $result[] = $item;
    }

    return $result;
}

// Подключение дополнительных обработчиков
// require_once __DIR__ . "/custom_handlers.php";
