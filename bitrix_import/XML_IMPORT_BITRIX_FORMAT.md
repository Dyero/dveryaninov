# ИНСТРУКЦИЯ ПО ИМПОРТУ XML В БИТРИКС (ФОРМАТ HIGHLOAD)

## 📌 ВАЖНО

XML-файлы созданы в стандартном формате экспорта/импорта Highload блоков Битрикс.
Этот формат можно импортировать напрямую через встроенные инструменты Битрикс.

---

## 📦 Созданные XML-файлы в формате Битрикс

Все XML-файлы находятся в папке `/bitrix_import/`:

| № | Файл | ID | Таблица | Записей | Описание |
|---|------|----|---------|---------|----------|
| 1 | `1_coatings_import.xml` | HLBLOCK_1 | b_hlbd_coatings | 96 | Покрытия |
| 2 | `2_glasses_import.xml` | HLBLOCK_2 | b_hlbd_glasses | 17 | Стёкла |
| 3 | `3_opening_types_import.xml` | HLBLOCK_3 | b_hlbd_opening_types | 2 | Варианты открывания |
| 4 | `4_alu_edges_import.xml` | HLBLOCK_4 | b_hlbd_alu_edges | 7 | Алюминиевые кромки |
| 5 | `5_moldings_import.xml` | HLBLOCK_5 | b_hlbd_moldings | 14 | Молдинги |
| 6 | `6_engraving_import.xml` | HLBLOCK_6 | b_hlbd_engraving | 4 | Гравировка |

**Общий объём:** ~2.5 MB (с полной структурой полей)
**Всего записей:** 140 в Highload блоках

---

## 🎯 МЕТОД 1: ИМПОРТ ЧЕРЕЗ АДМИНИСТРАТИВНУЮ ПАНЕЛЬ

Это самый простой способ для Highload блоков.

### Шаг 1: Перейдите в раздел Highload блоков

1. Откройте админ-панель Битрикс
2. Перейдите: **Настройки → Настройки продукта → Настройки модулей → Highload-блоки**

### Шаг 2: Создайте новый Highload блок (если ещё не создан)

Если у вас уже есть Highload блок со стёклами, переходите к Шагу 3.

Если нет, создайте новый:
- Нажмите "Добавить Highload-блок"
- Заполните:
  - **Название:** Glasses (или Coatings, OpeningTypes и т.д.)
  - **Таблица в БД:** `b_hlbd_glasses` (или другое название из таблицы выше)

### Шаг 3: Импортируйте XML-файл

1. Откройте созданный Highload блок
2. Найдите кнопку **"Импорт"** (обычно справа вверху)
3. Выберите **"Импорт из XML"**
4. Загрузите соответствующий XML-файл (например, `2_glasses_import.xml`)
5. Нажмите "Импортировать"

### Шаг 4: Проверьте результат

После импорта:
- Поля должны быть созданы автоматически
- Данные должны появиться в списке элементов
- Проверьте количество записей

---

## 🔧 МЕТОД 2: ИМПОРТ ЧЕРЕЗ PHP-СКРИПТ

Если административная панель не работает, используйте PHP.

### Для Highload блоков

Создайте файл `/local/php_interface/import_highload_xml.php`:

```php
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");

use Bitrix\Main\Loader;
use Bitrix\Highloadblock\HighloadBlockTable;

Loader::includeModule('highloadblock');

function importHighloadFromBitrixXML($xmlFilePath) {
    $xml = simplexml_load_file($xmlFilePath);
    if (!$xml) {
        echo "Не удалось загрузить XML-файл!\n";
        return false;
    }

    // Получаем информацию о блоке
    $hlblockName = (string)$xml->hiblock->name;
    $tableName = (string)$xml->hiblock->table_name;

    echo "Импорт Highload блока: $hlblockName ($tableName)\n";

    // Проверяем, существует ли блок
    $hlblock = HighloadBlockTable::getList([
        'filter' => ['=TABLE_NAME' => $tableName]
    ])->fetch();

    if (!$hlblock) {
        // Создаём новый блок
        $result = HighloadBlockTable::add([
            'NAME' => $hlblockName,
            'TABLE_NAME' => $tableName,
        ]);

        if ($result->isSuccess()) {
            $hlblockId = $result->getId();
            echo "Создан Highload блок ID: $hlblockId\n";

            $hlblock = HighloadBlockTable::getById($hlblockId)->fetch();
        } else {
            echo "Ошибка создания блока: " . implode(', ', $result->getErrorMessages()) . "\n";
            return false;
        }
    } else {
        echo "Highload блок уже существует, ID: {$hlblock['ID']}\n";
    }

    $entity = HighloadBlockTable::compileEntity($hlblock);
    $entityDataClass = $entity->getDataClass();

    // Импортируем поля (если нужно)
    // Это сложная часть, обычно поля создаются вручную через админку

    // Импортируем данные
    $imported = 0;
    $updated = 0;
    $errors = 0;

    foreach ($xml->items->item as $item) {
        $data = [];
        foreach ($item as $key => $value) {
            $fieldName = strtoupper((string)$key);
            $data[$fieldName] = (string)$value;
        }

        // Проверяем по UF_XML_ID
        $existing = null;
        if (!empty($data['UF_XML_ID'])) {
            $existing = $entityDataClass::getList([
                'filter' => ['UF_XML_ID' => $data['UF_XML_ID']],
                'select' => ['ID']
            ])->fetch();
        }

        unset($data['ID']); // Не импортируем старый ID

        if ($existing) {
            $result = $entityDataClass::update($existing['ID'], $data);
            if ($result->isSuccess()) {
                $updated++;
            } else {
                $errors++;
                echo "Ошибка обновления ID {$existing['ID']}: " . implode(', ', $result->getErrorMessages()) . "\n";
            }
        } else {
            $result = $entityDataClass::add($data);
            if ($result->isSuccess()) {
                $imported++;
            } else {
                $errors++;
                echo "Ошибка добавления: " . implode(', ', $result->getErrorMessages()) . "\n";
            }
        }
    }

    echo "Импорт завершён: добавлено $imported, обновлено $updated, ошибок $errors\n";
    return true;
}

// ИМПОРТИРУЙТЕ НУЖНЫЕ ФАЙЛЫ
echo "=== ИМПОРТ СТЁКОЛ ===\n";
importHighloadFromBitrixXML($_SERVER["DOCUMENT_ROOT"] . '/bitrix_import/2_glasses_import.xml');

echo "\n=== ИМПОРТ ПОКРЫТИЙ ===\n";
importHighloadFromBitrixXML($_SERVER["DOCUMENT_ROOT"] . '/bitrix_import/1_coatings_import.xml');

echo "\n✓ Импорт завершён!\n";
```

**Запуск:**
Откройте в браузере: `https://ваш-сайт.ru/local/php_interface/import_highload_xml.php`

---

## 📋 ПОРЯДОК ИМПОРТА

### Вариант A: Если Highload блоки уже созданы

1. Просто импортируйте XML-файлы через админку
2. Битрикс сопоставит поля автоматически
3. Данные будут добавлены или обновлены

### Вариант B: Если Highload блоков нет

1. **Создайте блоки вручную** через админку:
   ```
   Название: Glasses      → Таблица: b_hlbd_glasses
   Название: Coatings     → Таблица: b_hlbd_coatings
   Название: OpeningTypes → Таблица: b_hlbd_opening_types
   Название: AluEdges     → Таблица: b_hlbd_alu_edges
   Название: Moldings     → Таблица: b_hlbd_moldings
   Название: Engraving    → Таблица: b_hlbd_engraving
   ```

2. **Импортируйте XML** для каждого блока
   - Откройте блок → Импорт → Из XML
   - Загрузите соответствующий файл

3. **Проверьте поля**
   - Поля должны создаться автоматически из XML
   - Если нет - создайте вручную (см. структуру в XML)

4. **Проверьте данные**
   - Откройте список элементов
   - Убедитесь, что всё импортировано

---

## 🎨 СТРУКТУРА XML-ФАЙЛА (для справки)

```xml
<?xml version="1.0" encoding="utf-8"?>
<hiblock>
    <!-- Информация о блоке -->
    <hiblock>
        <id>2</id>
        <name>Glasses</name>
        <table_name>b_hlbd_glasses</table_name>
    </hiblock>

    <!-- Языки (пусто) -->
    <langs/>

    <!-- Определение полей -->
    <fields>
        <field>
            <id>1</id>
            <entity_id>HLBLOCK_2</entity_id>
            <field_name>UF_XML_ID</field_name>
            <user_type_id>string</user_type_id>
            <mandatory>Y</mandatory>
            <!-- ... -->
        </field>
        <!-- ... больше полей -->
    </fields>

    <!-- Данные -->
    <items>
        <item>
            <id>1</id>
            <uf_xml_id>satinato_beloe</uf_xml_id>
            <uf_name>Сатинато белое</uf_name>
            <uf_price>0</uf_price>
            <!-- ... -->
        </item>
        <!-- ... больше элементов -->
    </items>
</hiblock>
```

---

## 🔍 ПРОВЕРКА ИМПОРТА

После импорта проверьте:

### Через админку:
```
1. Настройки → Highload-блоки → Glasses → Должно быть 17 записей
2. Настройки → Highload-блоки → Coatings → Должно быть 96 записей
3. Настройки → Highload-блоки → OpeningTypes → Должно быть 2 записи
```

### Через SQL:
```sql
-- Стёкла
SELECT COUNT(*) FROM b_hlbd_glasses;  -- Должно быть 17

-- Покрытия
SELECT COUNT(*) FROM b_hlbd_coatings;  -- Должно быть 96

-- Варианты открывания
SELECT COUNT(*) FROM b_hlbd_opening_types;  -- Должно быть 2
```

---

## ⚠️ ВОЗМОЖНЫЕ ПРОБЛЕМЫ И РЕШЕНИЯ

### Проблема 1: "Таблица уже существует"
**Решение:**
- Используйте существующую таблицу
- Или измените название таблицы в XML перед импортом

### Проблема 2: "Поля не создались"
**Решение:**
- Создайте поля вручную через админку
- Используйте имена полей из XML (UF_XML_ID, UF_NAME и т.д.)
- Затем импортируйте только данные

### Проблема 3: "Кодировка нарушена"
**Решение:**
- Все XML-файлы уже в UTF-8
- Проверьте настройки БД (должна быть UTF-8)

### Проблема 4: "Дублирование данных"
**Решение:**
- XML содержит UF_XML_ID для каждого элемента
- При повторном импорте элементы обновляются, а не дублируются
- Или очистите таблицу перед импортом: `TRUNCATE TABLE b_hlbd_glasses;`

### Проблема 5: "Не могу найти кнопку Импорт"
**Решение:**
- Возможно, в вашей версии Битрикс нет встроенного импорта Highload
- Используйте PHP-скрипт (Метод 2)

---

## 💡 ДОПОЛНИТЕЛЬНЫЕ СОВЕТЫ

1. **Делайте резервные копии**
   - Перед импортом сделайте backup БД
   - Или импортируйте сначала на тестовую копию сайта

2. **Импортируйте по очереди**
   - Сначала 1 блок для проверки
   - Если всё ок - импортируйте остальные

3. **Проверяйте ID блоков**
   - ID в XML (HLBLOCK_1, HLBLOCK_2) - это просто примеры
   - Битрикс назначит свои ID при создании

4. **Файлы изображений**
   - XML не содержит сами файлы изображений
   - Поле `UF_IMAGE` пустое - загрузите картинки вручную потом
   - Или используйте поле `uf_file` с путями (как в glasses.xml)

5. **Сравнение с вашим glasses.xml**
   - Ваш файл имеет ID полей (38, 39, 40, 54, 56, 57)
   - Наши файлы имеют последовательные ID (1, 2, 3...)
   - Это нормально - Битрикс назначит свои ID

---

## 📞 СЛЕДУЮЩИЕ ШАГИ

После успешного импорта XML:

1. ✓ Проверьте количество импортированных записей
2. ✓ Проверьте, что все поля созданы правильно
3. ✓ Загрузите изображения для покрытий (через админку)
4. ✓ Загрузите изображения для стёкол (через админку)
5. ✓ Протестируйте конфигуратор

---

## 🆚 СРАВНЕНИЕ: НАШ XML vs ВАШ XML

**Ваш glasses.xml:**
- ID блока: 6
- Таблица: b_hlbd_glass
- 5 полей: UF_NAME, UF_FILE, UF_PRICE, UF_XML_ID, UF_DESCRIPTION, UF_FULL_DESCRIPTION
- 23 элемента с изображениями (uf/464/566qehwpw2wk6mnbv8wm1yuywhw9um2i.jpg)

**Наш 2_glasses_import.xml:**
- ID блока: 2 (пример)
- Таблица: b_hlbd_glasses
- 7 полей: UF_XML_ID, UF_NAME, UF_PRICE, UF_IMAGE, UF_CATEGORY, UF_SORT, UF_ACTIVE
- 17 элементов из нашей базы данных

**Различия:**
- У вас больше стёкол (23 vs 17) - можете объединить данные
- У вас есть пути к изображениям - отлично!
- У нас есть UF_CATEGORY и UF_SORT - для фильтрации

**Рекомендация:**
- Используйте ваш glasses.xml как есть - он уже готов
- Или добавьте UF_CATEGORY в ваш файл для фильтрации по типам стёкол

---

**✅ XML-файлы в формате Битрикс готовы к импорту!**
**Начните с импорта через админку (Метод 1) - это проще всего.**
