# ИНСТРУКЦИЯ ПО ИМПОРТУ ЧЕРЕЗ XML

## 📌 ВАЖНО

CSV-импорт в Битрикс иногда работает нестабильно и может показывать "Импортировано 0 элементов".
**Решение:** Используйте XML-формат для импорта данных.

---

## 📦 Созданные XML-файлы

Все XML-файлы находятся в папке `/bitrix_import/`:

| № | Файл | Размер | Записей | Описание |
|---|------|--------|---------|----------|
| 1 | `1_coatings_import.xml` | 28 KB | 96 | Покрытия (ПВХ, ПЭТ, Эмаль) |
| 2 | `2_glasses_import.xml` | 5.1 KB | 17 | Стёкла и триплексы |
| 3 | `3_opening_types_import.xml` | 578 B | 2 | Варианты открывания |
| 4 | `4_alu_edges_import.xml` | 2.2 KB | 7 | Алюминиевые кромки |
| 5 | `5_moldings_import.xml` | 4.8 KB | 14 | Молдинги |
| 6 | `6_engraving_import.xml` | 1.1 KB | 4 | Варианты гравировки |
| 7 | `7_doors_import.xml` | 121 KB | 199 | Модели дверей |
| 8 | `8_moldings_components_import.xml` | 14 KB | 30 | Погонаж и комплектующие |

**Общий объём:** ~177 KB
**Всего записей:** 369

---

## 🔧 МЕТОДЫ ИМПОРТА XML В БИТРИКС

### Метод 1: Импорт через PHP-скрипт (рекомендуется)

Этот метод самый надёжный для Highload блоков.

#### Для Highload блоков (покрытия, стёкла, фурнитура)

Создайте файл `/local/php_interface/import_highload.php`:

```php
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");

use Bitrix\Main\Loader;
use Bitrix\Highloadblock\HighloadBlockTable;

Loader::includeModule('highloadblock');

function importHighloadFromXML($hlBlockName, $xmlFilePath) {
    // Получаем Highload блок
    $hlblock = HighloadBlockTable::getList([
        'filter' => ['=NAME' => $hlBlockName]
    ])->fetch();

    if (!$hlblock) {
        echo "Highload блок '$hlBlockName' не найден!\n";
        return false;
    }

    $entity = HighloadBlockTable::compileEntity($hlblock);
    $entityDataClass = $entity->getDataClass();

    // Читаем XML
    $xml = simplexml_load_file($xmlFilePath);
    if (!$xml) {
        echo "Не удалось загрузить XML-файл!\n";
        return false;
    }

    $imported = 0;
    $errors = 0;

    // Импортируем каждый элемент
    foreach ($xml->item as $item) {
        $data = [];
        foreach ($item->field as $field) {
            $fieldName = (string)$field['name'];
            $fieldValue = (string)$field;
            $data[$fieldName] = $fieldValue;
        }

        // Проверяем, существует ли элемент с таким XML_ID
        $existing = $entityDataClass::getList([
            'filter' => ['UF_XML_ID' => $data['UF_XML_ID']],
            'select' => ['ID']
        ])->fetch();

        if ($existing) {
            // Обновляем существующий
            $result = $entityDataClass::update($existing['ID'], $data);
        } else {
            // Добавляем новый
            $result = $entityDataClass::add($data);
        }

        if ($result->isSuccess()) {
            $imported++;
        } else {
            $errors++;
            echo "Ошибка: " . implode(', ', $result->getErrorMessages()) . "\n";
        }
    }

    echo "Импорт '$hlBlockName': успешно $imported, ошибок $errors\n";
    return true;
}

// ИМПОРТ ПОКРЫТИЙ
echo "Импорт покрытий...\n";
importHighloadFromXML('Coatings', $_SERVER["DOCUMENT_ROOT"] . '/bitrix_import/1_coatings_import.xml');

// ИМПОРТ СТЁКОЛ
echo "Импорт стёкол...\n";
importHighloadFromXML('Glasses', $_SERVER["DOCUMENT_ROOT"] . '/bitrix_import/2_glasses_import.xml');

// ИМПОРТ ВАРИАНТОВ ОТКРЫВАНИЯ
echo "Импорт вариантов открывания...\n";
importHighloadFromXML('OpeningTypes', $_SERVER["DOCUMENT_ROOT"] . '/bitrix_import/3_opening_types_import.xml');

// ИМПОРТ АЛЮМИНИЕВЫХ КРОМОК
echo "Импорт алюминиевых кромок...\n";
importHighloadFromXML('AluEdges', $_SERVER["DOCUMENT_ROOT"] . '/bitrix_import/4_alu_edges_import.xml');

// ИМПОРТ МОЛДИНГОВ
echo "Импорт молдингов...\n";
importHighloadFromXML('Moldings', $_SERVER["DOCUMENT_ROOT"] . '/bitrix_import/5_moldings_import.xml');

// ИМПОРТ ВАРИАНТОВ ГРАВИРОВКИ
echo "Импорт вариантов гравировки...\n";
importHighloadFromXML('Engraving', $_SERVER["DOCUMENT_ROOT"] . '/bitrix_import/6_engraving_import.xml');

echo "\n✓ Импорт Highload блоков завершён!\n";
```

**Запуск:**
1. Загрузите XML-файлы в папку `/bitrix_import/` на сервере
2. Загрузите скрипт в `/local/php_interface/import_highload.php`
3. Откройте в браузере: `https://ваш-сайт.ru/local/php_interface/import_highload.php`
4. Дождитесь завершения импорта

---

#### Для Инфоблоков (двери, погонаж)

Создайте файл `/local/php_interface/import_iblock.php`:

```php
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");

use Bitrix\Main\Loader;

Loader::includeModule('iblock');

function importIblockFromXML($iblockId, $xmlFilePath) {
    $xml = simplexml_load_file($xmlFilePath);
    if (!$xml) {
        echo "Не удалось загрузить XML-файл!\n";
        return false;
    }

    $el = new CIBlockElement;
    $imported = 0;
    $errors = 0;

    foreach ($xml->item as $item) {
        $arFields = ['IBLOCK_ID' => $iblockId];
        $arProps = [];

        foreach ($item->field as $field) {
            $fieldName = (string)$field['name'];
            $fieldValue = (string)$field;

            // Основные поля элемента
            switch ($fieldName) {
                case 'XML_ID':
                    $arFields['XML_ID'] = $fieldValue;
                    break;
                case 'NAME':
                    $arFields['NAME'] = $fieldValue;
                    break;
                case 'SORT':
                    $arFields['SORT'] = $fieldValue;
                    break;
                case 'ACTIVE':
                    $arFields['ACTIVE'] = $fieldValue ? 'Y' : 'N';
                    break;
                case 'COLLECTION':
                    // Найдем раздел по символьному коду
                    $section = CIBlockSection::GetList(
                        [],
                        ['IBLOCK_ID' => $iblockId, 'CODE' => strtolower($fieldValue)],
                        false,
                        ['ID']
                    )->Fetch();
                    if ($section) {
                        $arFields['IBLOCK_SECTION_ID'] = $section['ID'];
                    }
                    break;
                default:
                    // Все остальные - это свойства
                    $arProps[$fieldName] = $fieldValue;
                    break;
            }
        }

        $arFields['PROPERTY_VALUES'] = $arProps;

        // Проверяем, существует ли элемент
        $existing = CIBlockElement::GetList(
            [],
            ['IBLOCK_ID' => $iblockId, 'XML_ID' => $arFields['XML_ID']],
            false,
            false,
            ['ID']
        )->Fetch();

        if ($existing) {
            // Обновляем
            if ($el->Update($existing['ID'], $arFields)) {
                $imported++;
            } else {
                $errors++;
                echo "Ошибка обновления: " . $el->LAST_ERROR . "\n";
            }
        } else {
            // Добавляем
            if ($el->Add($arFields)) {
                $imported++;
            } else {
                $errors++;
                echo "Ошибка добавления: " . $el->LAST_ERROR . "\n";
            }
        }
    }

    echo "Импорт: успешно $imported, ошибок $errors\n";
    return true;
}

// ИМПОРТ ДВЕРЕЙ
// Замените 1 на ID вашего инфоблока "Дверные полотна"
echo "Импорт дверей...\n";
importIblockFromXML(1, $_SERVER["DOCUMENT_ROOT"] . '/bitrix_import/7_doors_import.xml');

// ИМПОРТ ПОГОНАЖА
// Замените 2 на ID вашего инфоблока "Погонаж и комплектующие"
echo "Импорт погонажа...\n";
importIblockFromXML(2, $_SERVER["DOCUMENT_ROOT"] . '/bitrix_import/8_moldings_components_import.xml');

echo "\n✓ Импорт инфоблоков завершён!\n";
```

**Запуск:**
1. Откройте скрипт и замените ID инфоблоков на ваши
2. Загрузите скрипт на сервер
3. Откройте в браузере: `https://ваш-сайт.ru/local/php_interface/import_iblock.php`

---

### Метод 2: Импорт через модуль "Универсальный обмен данными"

Если у вас установлен модуль "Универсальный обмен данными":

1. Админка → Сервис → Универсальный обмен данными
2. Создать новый профиль импорта
3. Тип источника: XML
4. Загрузить XML-файл
5. Настроить соответствие полей
6. Запустить импорт

---

### Метод 3: Ручной импорт через REST API

Для программного импорта можно использовать REST API Битрикс24 или API Битрикс:

```php
<?php
// Пример для одной записи из покрытий
$xml = simplexml_load_file('1_coatings_import.xml');
foreach ($xml->item as $item) {
    $data = [];
    foreach ($item->field as $field) {
        $data[(string)$field['name']] = (string)$field;
    }

    // Вызов REST API или прямое добавление через API
    // ...
}
```

---

## 📋 ПОРЯДОК ИМПОРТА

### Шаг 1: Highload блоки (обязательно первыми!)

```
1. 1_coatings_import.xml       → Highload блок "Покрытия"
2. 2_glasses_import.xml         → Highload блок "Стёкла"
3. 3_opening_types_import.xml   → Highload блок "Варианты открывания"
4. 4_alu_edges_import.xml       → Highload блок "Алюминиевые кромки"
5. 5_moldings_import.xml        → Highload блок "Молдинги"
6. 6_engraving_import.xml       → Highload блок "Гравировка"
```

### Шаг 2: Создание разделов (коллекций)

Перед импортом дверей создайте 30 разделов в инфоблоке "Дверные полотна":

```
Alberta, Ameri, Amfora, Avrora, Beluni, Blank, Bona, Boneko, D, Dekar,
DekarSBagetom, Eterna, Fly, Form, Kant, Kaskad, Kvant, Meta, Miura,
Modena, Mono, Neo, Oazis, Palladio, Plisse, Terra, Ultra, Vektor, Verto, Vitra
```

**Символьные коды:** в нижнем регистре (alberta, ameri, и т.д.)

### Шаг 3: Инфоблоки

```
7. 7_doors_import.xml                    → Инфоблок "Дверные полотна"
8. 8_moldings_components_import.xml      → Инфоблок "Погонаж и комплектующие"
```

### Шаг 4: Загрузка изображений

После импорта данных привяжите изображения вручную через админ-панель (см. STAGE_2_INSTRUCTION.md).

---

## 🔍 ПРОВЕРКА ИМПОРТА

После импорта проверьте:

### Через админку:
```
1. Настройки → Highload-блоки → Покрытия → Должно быть 96 записей
2. Настройки → Highload-блоки → Стёкла → Должно быть 17 записей
3. Контент → Инфоблоки → Дверные полотна → Должно быть 199 записей
```

### Через SQL:
```sql
-- Покрытия
SELECT COUNT(*) FROM b_hlbd_coatings;  -- Должно быть 96

-- Стёкла
SELECT COUNT(*) FROM b_hlbd_glasses;   -- Должно быть 17

-- Двери (замените X на ID вашего инфоблока)
SELECT COUNT(*) FROM b_iblock_element WHERE IBLOCK_ID = X;  -- Должно быть 199
```

---

## ⚠️ ВОЗМОЖНЫЕ ПРОБЛЕМЫ И РЕШЕНИЯ

### Проблема 1: "Highload блок не найден"
**Решение:** Проверьте название Highload блока в скрипте. Оно должно точно совпадать с названием в админке.

### Проблема 2: "Не удалось загрузить XML-файл"
**Решение:**
- Проверьте путь к файлу
- Убедитесь, что файл загружен на сервер
- Проверьте права доступа к файлу (должно быть 644)

### Проблема 3: Кодировка нарушена (кракозябры)
**Решение:** Все XML-файлы уже в UTF-8. Если проблема осталась:
```php
// Добавьте в начало скрипта
header('Content-Type: text/html; charset=utf-8');
```

### Проблема 4: "Ошибка: поле не найдено"
**Решение:** Убедитесь, что все поля созданы в Highload блоке/инфоблоке ДО импорта. Названия полей должны точно совпадать.

### Проблема 5: Дублирование записей
**Решение:** Скрипт автоматически проверяет UF_XML_ID/XML_ID и обновляет существующие записи вместо создания дубликатов.

---

## 💡 ДОПОЛНИТЕЛЬНЫЕ СОВЕТЫ

1. **Тестируйте на одном элементе**
   - Сначала импортируйте 1-2 записи
   - Проверьте результат
   - Затем импортируйте всё

2. **Делайте бэкапы**
   - Перед импортом сделайте резервную копию БД
   - Или используйте тестовую копию сайта

3. **Логируйте ошибки**
   - Все ошибки выводятся в консоль
   - Можете направить вывод в файл: `>> import_log.txt`

4. **Увеличьте лимиты PHP**
   - В php.ini установите:
   ```
   max_execution_time = 300
   memory_limit = 256M
   ```

5. **Импортируйте частями**
   - Если файл большой (7_doors_import.xml - 121KB)
   - Разбейте его на несколько частей по 50 записей

---

## 📞 СЛЕДУЮЩИЕ ШАГИ

После успешного импорта XML:

1. ✓ Проверьте количество импортированных записей
2. ✓ Загрузите изображения для покрытий
3. ✓ Загрузите изображения для стёкол
4. ✓ Загрузите изображения для дверей
5. ✓ Протестируйте конфигуратор

---

**✅ XML-файлы готовы к импорту!**
**Начните с метода 1 (PHP-скрипт) - он самый надёжный.**
