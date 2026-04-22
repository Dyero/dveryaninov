# Настройки ЧПУ (SEO URL) для Bitrix - Dveryaninov

## 1. Настройка URL для инфоблока "Коллекции дверей" (ID: 1)

### В админке Bitrix:
**Путь:** Контент → Инфоблоки типов информации → Каталог → Коллекции дверей → Настройки

#### URL к странице просмотра списка секций:
```
/collections/
```

#### URL к странице просмотра элемента списка:
```
/collections/#ELEMENT_CODE#/
```

#### URL к странице с подробной информацией об элементе:
```
/collections/#ELEMENT_CODE#/
```

---

## 2. Настройка URL для инфоблока "Двери" (ID: 2)

### В админке Bitrix:
**Путь:** Контент → Инфоблоки типов информации → Каталог → Двери → Настройки

#### URL к странице просмотра списка секций:
```
/catalog/
```

#### URL к странице просмотра элемента списка:
```
/catalog/#SECTION_CODE#/#ELEMENT_CODE#/
```

#### URL к странице с подробной информацией об элементе:
```
/catalog/#SECTION_CODE#/#ELEMENT_CODE#/
```

**Примечание:** #SECTION_CODE# здесь соответствует символьному коду коллекции

---

## 3. Настройка URL для инфоблока "Погонаж" (ID: 3)

### В админке Bitrix:
**Путь:** Контент → Инфоблоки типов информации → Каталог → Погонаж → Настройки

#### URL к странице просмотра списка секций:
```
/molding/
```

#### URL к странице просмотра элемента списка:
```
/molding/#ELEMENT_CODE#/
```

#### URL к странице с подробной информацией об элементе:
```
/molding/#ELEMENT_CODE#/
```

---

## 4. Настройка URL для инфоблока "Фурнитура" (ID: 4)

### В админке Bitrix:
**Путь:** Контент → Инфоблоки типов информации → Каталог → Фурнитура → Настройки

#### URL к странице просмотра списка секций:
```
/hardware/
```

#### URL к странице просмотра элемента списка:
```
/hardware/#ELEMENT_CODE#/
```

#### URL к странице с подробной информацией об элементе:
```
/hardware/#ELEMENT_CODE#/
```

---

## 5. Структура страниц и подключение компонентов

### 5.1. Главная страница каталога дверей
**Файл:** `/catalog/index.php`

```php
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Каталог межкомнатных дверей");
$APPLICATION->SetPageProperty("description", "Каталог межкомнатных дверей от производителя Дверянинов");
?>

<?$APPLICATION->IncludeComponent(
    "dveryaninov:doors.catalog",
    "",
    array(
        "IBLOCK_ID" => DOORS_IBLOCK_ID,
        "ELEMENTS_COUNT" => "20",
        "CACHE_TYPE" => "A",
        "CACHE_TIME" => "3600",
    )
);?>

<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
?>
```

### 5.2. Детальная страница двери
**Файл:** `/catalog/.section.php` (для всех разделов)

```php
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Каталог дверей");
?>

<?$APPLICATION->IncludeComponent(
    "dveryaninov:doors.catalog",
    "",
    array(
        "IBLOCK_ID" => DOORS_IBLOCK_ID,
        "SECTION_CODE" => $arResult["VARIABLES"]["SECTION_CODE"],
        "ELEMENTS_COUNT" => "20",
        "CACHE_TYPE" => "A",
        "CACHE_TIME" => "3600",
    )
);?>

<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
?>
```

**Файл:** `/catalog/detail.php` (детальная двери)

```php
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
?>

<?$APPLICATION->IncludeComponent(
    "dveryaninov:door.detail",
    "",
    array(
        "IBLOCK_ID" => DOORS_IBLOCK_ID,
        "ELEMENT_CODE" => $arResult["VARIABLES"]["ELEMENT_CODE"],
        "CACHE_TYPE" => "A",
        "CACHE_TIME" => "3600",
    )
);?>

<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
?>
```

### 5.3. Главная страница коллекций
**Файл:** `/collections/index.php`

```php
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Коллекции межкомнатных дверей");
$APPLICATION->SetPageProperty("description", "Коллекции межкомнатных дверей Дверянинов");
?>

<?$APPLICATION->IncludeComponent(
    "bitrix:catalog.section.list",
    "",
    array(
        "IBLOCK_TYPE" => "catalog",
        "IBLOCK_ID" => COLLECTIONS_IBLOCK_ID,
        "CACHE_TYPE" => "A",
        "CACHE_TIME" => "3600",
    )
);?>

<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
?>
```

### 5.4. Детальная страница коллекции
**Файл:** `/collections/detail.php`

```php
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
?>

<?$APPLICATION->IncludeComponent(
    "dveryaninov:collection.detail",
    "",
    array(
        "IBLOCK_ID" => COLLECTIONS_IBLOCK_ID,
        "ELEMENT_CODE" => $arResult["VARIABLES"]["ELEMENT_CODE"],
        "DOORS_IBLOCK_ID" => DOORS_IBLOCK_ID,
        "CACHE_TYPE" => "A",
        "CACHE_TIME" => "3600",
    )
);?>

<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
?>
```

### 5.5. Страница погонажа
**Файл:** `/molding/index.php`

```php
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Погонаж");
?>

<?$APPLICATION->IncludeComponent(
    "bitrix:catalog.section",
    "",
    array(
        "IBLOCK_ID" => MOLDING_IBLOCK_ID,
        "ELEMENT_SORT_FIELD" => "sort",
        "ELEMENT_SORT_ORDER" => "asc",
        "CACHE_TYPE" => "A",
        "CACHE_TIME" => "3600",
    )
);?>

<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
?>
```

**Файл:** `/molding/detail.php`

```php
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
?>

<?$APPLICATION->IncludeComponent(
    "dveryaninov:product.simple",
    "",
    array(
        "IBLOCK_ID" => MOLDING_IBLOCK_ID,
        "ELEMENT_CODE" => $arResult["VARIABLES"]["ELEMENT_CODE"],
        "CACHE_TYPE" => "A",
        "CACHE_TIME" => "3600",
    )
);?>

<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
?>
```

### 5.6. Страница фурнитуры
**Файл:** `/hardware/index.php`

```php
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Фурнитура");
?>

<?$APPLICATION->IncludeComponent(
    "bitrix:catalog.section",
    "",
    array(
        "IBLOCK_ID" => HARDWARE_IBLOCK_ID,
        "ELEMENT_SORT_FIELD" => "sort",
        "ELEMENT_SORT_ORDER" => "asc",
        "CACHE_TYPE" => "A",
        "CACHE_TIME" => "3600",
    )
);?>

<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
?>
```

**Файл:** `/hardware/detail.php`

```php
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
?>

<?$APPLICATION->IncludeComponent(
    "dveryaninov:product.simple",
    "",
    array(
        "IBLOCK_ID" => HARDWARE_IBLOCK_ID,
        "ELEMENT_CODE" => $arResult["VARIABLES"]["ELEMENT_CODE"],
        "CACHE_TYPE" => "A",
        "CACHE_TIME" => "3600",
    )
);?>

<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
?>
```

---

## 6. Настройка .urlrewrite.php

**Файл:** `/urlrewrite.php` (в корне сайта)

```php
<?php
$arUrlRewrite = array(
    // Детальная страница двери
    array(
        "CONDITION" => "#^/catalog/([^/]+)/([^/]+)/#",
        "RULE" => "SECTION_CODE=$1&ELEMENT_CODE=$2",
        "ID" => "",
        "PATH" => "/catalog/detail.php",
    ),
    // Список дверей по коллекции
    array(
        "CONDITION" => "#^/catalog/([^/]+)/#",
        "RULE" => "SECTION_CODE=$1",
        "ID" => "",
        "PATH" => "/catalog/.section.php",
    ),
    // Каталог дверей
    array(
        "CONDITION" => "#^/catalog/#",
        "RULE" => "",
        "ID" => "",
        "PATH" => "/catalog/index.php",
    ),
    // Детальная страница коллекции
    array(
        "CONDITION" => "#^/collections/([^/]+)/#",
        "RULE" => "ELEMENT_CODE=$1",
        "ID" => "",
        "PATH" => "/collections/detail.php",
    ),
    // Список коллекций
    array(
        "CONDITION" => "#^/collections/#",
        "RULE" => "",
        "ID" => "",
        "PATH" => "/collections/index.php",
    ),
    // Детальная страница погонажа
    array(
        "CONDITION" => "#^/molding/([^/]+)/#",
        "RULE" => "ELEMENT_CODE=$1",
        "ID" => "",
        "PATH" => "/molding/detail.php",
    ),
    // Список погонажа
    array(
        "CONDITION" => "#^/molding/#",
        "RULE" => "",
        "ID" => "",
        "PATH" => "/molding/index.php",
    ),
    // Детальная страница фурнитуры
    array(
        "CONDITION" => "#^/hardware/([^/]+)/#",
        "RULE" => "ELEMENT_CODE=$1",
        "ID" => "",
        "PATH" => "/hardware/detail.php",
    ),
    // Список фурнитуры
    array(
        "CONDITION" => "#^/hardware/#",
        "RULE" => "",
        "ID" => "",
        "PATH" => "/hardware/index.php",
    ),
);
?>
```

---

## 7. Настройка .htaccess

**Файл:** `/.htaccess` (в корне сайта)

Добавить после стандартных правил Bitrix:

```apache
# SEO URLs
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^catalog/([^/]+)/([^/]+)/$ /catalog/detail.php?SECTION_CODE=$1&ELEMENT_CODE=$2 [L,QSA]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^catalog/([^/]+)/$ /catalog/.section.php?SECTION_CODE=$1 [L,QSA]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^collections/([^/]+)/$ /collections/detail.php?ELEMENT_CODE=$1 [L,QSA]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^molding/([^/]+)/$ /molding/detail.php?ELEMENT_CODE=$1 [L,QSA]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^hardware/([^/]+)/$ /hardware/detail.php?ELEMENT_CODE=$1 [L,QSA]
```

---

## 8. Примеры финальных URL

### Коллекции:
- Список: `https://dveryaninov.ru/collections/`
- Детальная: `https://dveryaninov.ru/collections/alberta/`
- Детальная: `https://dveryaninov.ru/collections/ameri/`

### Двери:
- Каталог: `https://dveryaninov.ru/catalog/`
- По коллекции: `https://dveryaninov.ru/catalog/alberta/`
- Детальная: `https://dveryaninov.ru/catalog/alberta/alberta-1/`
- Детальная: `https://dveryaninov.ru/catalog/ameri/ameri-3/`

### Погонаж:
- Список: `https://dveryaninov.ru/molding/`
- Детальная: `https://dveryaninov.ru/molding/nalichnik-pryamoj/`

### Фурнитура:
- Список: `https://dveryaninov.ru/hardware/`
- Детальная: `https://dveryaninov.ru/hardware/ruchka-dvernaya-khrom/`

---

## 9. Настройка в админке Bitrix (пошагово)

### Шаг 1: Включить ЧПУ
1. Зайти в **Настройки → Настройки продукта → Настройки модулей → Главный модуль**
2. Включить опцию **"Использовать ЧПУ"**
3. Сохранить

### Шаг 2: Настроить каждый инфоблок
1. **Контент → Типы инфоблоков → Каталог**
2. Открыть инфоблок (например, "Двери")
3. Вкладка **"Поля"**
4. Включить **"Символьный код"** (обязательно!)
5. Вкладка **"SEO"**
6. Заполнить поля URL (см. разделы 1-4 выше)
7. Сохранить

### Шаг 3: Очистить кеш
1. **Настройки → Производительность → Управление кешем**
2. Очистить весь кеш

---

## 10. Важные замечания

1. **Символьные коды генерируются автоматически** через `/local/php_interface/init.php`
2. Все инфоблоки должны иметь **уникальные символьные коды**
3. При изменении URL необходимо настроить **301 редиректы** со старых адресов
4. Рекомендуется использовать **кеширование компонентов** (CACHE_TYPE = "A")
5. Для SEO важно заполнять **мета-теги** для каждого элемента
