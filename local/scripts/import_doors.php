<?php
/**
 * Скрипт импорта дверей из HTML файлов в Bitrix
 * Запуск: php -f import_doors.php
 */

require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php");

use Bitrix\Main\Loader;

Loader::includeModule("iblock");

// ID инфоблоков (настроить после создания)
define("COLLECTIONS_IBLOCK_ID", 1); // Инфоблок коллекций
define("DOORS_IBLOCK_ID", 2);       // Инфоблок дверей

// Карта коллекций: имя файла => данные коллекции
$collections = [
    "alberta" => ["NAME" => "Альберта", "CODE" => "alberta"],
    "ameri" => ["NAME" => "Амери", "CODE" => "ameri"],
    "amfora" => ["NAME" => "Амфора", "CODE" => "amfora"],
    "avrora" => ["NAME" => "Аврора", "CODE" => "avrora"],
    "beluni" => ["NAME" => "Белуни", "CODE" => "beluni"],
    "blank" => ["NAME" => "Бланк", "CODE" => "blank"],
    "bona" => ["NAME" => "Бона", "CODE" => "bona"],
    "boneko" => ["NAME" => "Бонеко", "CODE" => "boneko"],
    "d" => ["NAME" => "Д", "CODE" => "d"],
    "dekar" => ["NAME" => "Декар", "CODE" => "dekar"],
    "eterna" => ["NAME" => "Этерна", "CODE" => "eterna"],
    "flaj" => ["NAME" => "Флай", "CODE" => "flaj"],
    "form" => ["NAME" => "Форм", "CODE" => "form"],
    // Добавьте остальные коллекции...
];

// Шаг 1: Создаём коллекции
echo "=== Создание коллекций ===\n";
$collectionIds = [];

foreach ($collections as $code => $collData) {
    // Проверяем, есть ли уже такая коллекция
    $rsExist = CIBlockElement::GetList(
        [],
        ["IBLOCK_ID" => COLLECTIONS_IBLOCK_ID, "CODE" => $collData["CODE"]],
        false,
        false,
        ["ID"]
    );

    if ($arExist = $rsExist->Fetch()) {
        $collectionIds[$code] = $arExist["ID"];
        echo "Коллекция '{$collData['NAME']}' уже существует (ID: {$arExist['ID']})\n";
        continue;
    }

    $el = new CIBlockElement;
    $arFields = [
        "IBLOCK_ID" => COLLECTIONS_IBLOCK_ID,
        "NAME" => $collData["NAME"],
        "CODE" => $collData["CODE"],
        "ACTIVE" => "Y",
        "PREVIEW_TEXT" => "Коллекция " . $collData["NAME"],
        "PROPERTY_VALUES" => [
            "COATING_TYPES" => ["ПВХ", "ПЭТ", "Эмаль"], // По умолчанию все типы
        ]
    ];

    if ($collectionId = $el->Add($arFields)) {
        $collectionIds[$code] = $collectionId;
        echo "Создана коллекция '{$collData['NAME']}' (ID: $collectionId)\n";
    } else {
        echo "Ошибка создания коллекции '{$collData['NAME']}': " . $el->LAST_ERROR . "\n";
    }
}

// Шаг 2: Импортируем двери из HTML файлов
echo "\n=== Импорт дверей ===\n";

$htmlDir = $_SERVER["DOCUMENT_ROOT"];
$files = glob($htmlDir . "/product-*.html");

$importCount = 0;
$errorCount = 0;

foreach ($files as $file) {
    $filename = basename($file, ".html");

    // Пропускаем файлы с "-pg" (глухие двери обрабатываем отдельно)
    if (strpos($filename, "-pg") !== false) {
        continue;
    }

    // Парсим имя файла: product-alberta-1.html
    // Формат: product-{collection}-{model}.html
    $parts = explode("-", $filename);

    if (count($parts) < 3) {
        echo "Пропускаем файл: $filename (неверный формат)\n";
        continue;
    }

    array_shift($parts); // Убираем "product"
    $collectionCode = array_shift($parts);
    $modelNumber = implode("-", $parts);

    if (!isset($collectionIds[$collectionCode])) {
        echo "Пропускаем файл: $filename (неизвестная коллекция: $collectionCode)\n";
        continue;
    }

    // Читаем HTML файл
    $html = file_get_contents($file);

    // Извлекаем данные
    preg_match('/<h1[^>]*class="product__title"[^>]*>(.*?)<\/h1>/s', $html, $titleMatch);
    preg_match('/<p[^>]*class="product__price"[^>]*>от\s*([0-9\s]+)\s*₽<\/p>/s', $html, $priceMatch);
    preg_match('/<p[^>]*class="product-section__text"[^>]*>(.*?)<\/p>/s', $html, $descMatch);

    $doorName = isset($titleMatch[1]) ? trim($titleMatch[1]) : ucfirst($collectionCode) . " " . $modelNumber;
    $basePrice = isset($priceMatch[1]) ? intval(str_replace(" ", "", $priceMatch[1])) : 0;
    $description = isset($descMatch[1]) ? trim(strip_tags($descMatch[1])) : "";

    // Проверяем, есть ли уже такая дверь
    $doorCode = $collectionCode . "-" . $modelNumber;
    $rsExist = CIBlockElement::GetList(
        [],
        ["IBLOCK_ID" => DOORS_IBLOCK_ID, "CODE" => $doorCode],
        false,
        false,
        ["ID"]
    );

    if ($arExist = $rsExist->Fetch()) {
        echo "Дверь '$doorName' уже существует (ID: {$arExist['ID']})\n";
        continue;
    }

    // Создаём элемент двери
    $el = new CIBlockElement;
    $arFields = [
        "IBLOCK_ID" => DOORS_IBLOCK_ID,
        "NAME" => $doorName,
        "CODE" => $doorCode,
        "ACTIVE" => "Y",
        "PREVIEW_TEXT" => $description,
        "DETAIL_TEXT" => $description,
        "PROPERTY_VALUES" => [
            "COLLECTION" => $collectionIds[$collectionCode],
            "MODEL_CODE" => strtoupper($doorCode),
            "DOOR_TYPE" => "ПО", // Остеклённое по умолчанию
            "PRICE" => $basePrice,
            "PRICE_PO" => $basePrice + 1420, // Наценка за остекление
            "AVAILABLE_SIZES" => ["2000×600", "2000×700", "2000×800", "2000×900"],
        ]
    ];

    if ($doorId = $el->Add($arFields)) {
        $importCount++;
        echo "Импортирована дверь '$doorName' (ID: $doorId)\n";
    } else {
        $errorCount++;
        echo "Ошибка импорта '$doorName': " . $el->LAST_ERROR . "\n";
    }
}

echo "\n=== Итого ===\n";
echo "Импортировано дверей: $importCount\n";
echo "Ошибок: $errorCount\n";
echo "Файлов обработано: " . count($files) . "\n";

echo "\nГотово!\n";
