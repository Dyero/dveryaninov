# Руководство по миграции на Bitrix CMS

## Обзор

Данный документ содержит подробное руководство по переносу HTML-шаблонов и данных в систему Bitrix CMS. Миграция включает:
1. Импорт данных из Highload блоков
2. Исправление логики отображения цветов покрытий
3. Добавление заголовков и параметров к элементам погонажа и фурнитуры

---

## Анализ расхождений между экспортированными и импортируемыми данными

### 1. Покрытия (Coatings)

**Экспортированный файл:** `bitrix_import/actually/coatings.xml`
**Импортируемый файл:** `bitrix_import/1_coatings_import.xml` / `1_coatings_import.csv`

**Ключевые различия:**
- Экспортированный файл содержит **87 активных покрытий** с заполненными данными (id 191-278, 279-286)
- Импортируемый CSV содержит **97 покрытий** (включая "Антрацит ПЭТ-1" и другие)
- Экспортированный файл имеет структуру: `UF_XML_ID`, `UF_NAME`, `UF_COLOR_HEX`, `UF_SORT`, `UF_ACTIVE`, `UF_IMAGE`, `UF_TYPE`
- В экспортированном файле есть одно покрытие без изображения: id=256 "Красная бургундия" (`uf_image>0</uf_image>`)

**Рекомендации:**
- ✅ Импортируемый файл готов к использованию
- ⚠️ Проверьте, что все 97 покрытий из CSV имеют изображения
- ⚠️ Убедитесь, что покрытие "Антрацит ПЭТ-1" (отсутствует в экспорте) действительно нужно

### 2. Стёкла (Glasses)

**Экспортированный файл:** `bitrix_import/actually/glaass.xml` (обратите внимание на 3 буквы 'a')
**Импортируемый файл:** `bitrix_import/2_glasses_import.xml`

**Ключевые различия:**
- Экспортированный файл содержит **40 записей** стёкол (id 1-40)
- Много дубликатов с разными XML_ID но одинаковыми названиями
- Импортируемый файл содержит **17 уникальных записей** с правильной структурой
- В экспортированном файле:
  - Поля `UF_DESCRIPTION` (id=83) и `UF_FULL_DESCRIPTION` (id=84) уже существуют
  - Поле `UF_CATEGORY` (id=69, mandatory=Y) присутствует
  - Многие записи имеют пустые значения для `uf_category`, `uf_active`, `uf_sort`

**Проблемы:**
- ❌ Дубликаты: "Флутс графит" (id=25, 31), "Мрамор бежевый" (id=32, 34), "Белый триплекс" (id=35, 36, 37, 38), "Сатинато белое с фацетом" (id=24, 40)
- ❌ Старые записи (id 1-23) имеют случайные XML_ID (например, "jW9Af6I8", "DMqek1Zu")
- ❌ Новые записи (id 24-40) имеют правильные символьные коды (например, "satinato_beloe_s_facetom")

**Рекомендации:**
- ✅ Используйте импортируемый файл `2_glasses_import.xml` - он уже содержит правильную структуру
- ⚠️ После импорта удалите дубликаты вручную через админку Bitrix
- ✅ Импортируемый файл уже содержит поля UF_DESCRIPTION и UF_FULL_DESCRIPTION

### 3. Варианты открывания (OpenVariant)

**Экспортированный файл:** `bitrix_import/actually/open_variant.xml`
**Импортируемый файл:** `bitrix_import/3_opening_types_import.xml`

**Ключевые различия:**
- Экспортированный: 5 записей с полями UF_NAME, UF_FILE, UF_PRICE, UF_XML_ID, UF_DESCRIPTION, UF_FULL_DESCRIPTION, UF_SORT
- Импортируемый: Предположительно аналогичная структура (нужна проверка)
- Все 5 записей имеют случайные XML_ID ("6eA3IE3Q", "SlGWkctZ", "kyEWLTKL", "RuuUZis8", "j4VrNPfA")
- Все значения `uf_sort` пустые

**Рекомендации:**
- ⚠️ Проверьте импортируемый файл и добавьте правильные символьные коды (UF_XML_ID)
- ⚠️ Добавьте значения UF_SORT для правильной сортировки

### 4. Алюминиевые кромки (AluEdges)

**Экспортированный файл:** `bitrix_import/actually/alu_edges.xml`
**Импортируемый файл:** `bitrix_import/4_alu_edges_import.xml`

**Ключевые различия:**
- Экспортированный: 7 записей с полной структурой
- Структура: UF_XML_ID, UF_TYPE, UF_COLOR, UF_PRICE, UF_SORT, UF_ACTIVE, UF_FILE
- Все записи имеют правильные символьные коды (например, "alu_edge_long_silver", "alu_edge_perim_gold")

**Рекомендации:**
- ✅ Экспортированные данные выглядят хорошо
- ✅ Проверьте соответствие с импортируемым файлом

### 5. Наценка (PriceNacenka)

**Экспортированный файл:** `bitrix_import/actually/nacenka.xml`
**Импортируемый файл:** Нет соответствующего файла (нужно создать)

**Структура:**
- 3 записи: surcharge_enamel_pg (12780), surcharge_enamel_po (14200), engraving_base (1860)
- Поля: UF_XML_ID, UF_NAME, UF_PRICE

**Рекомендации:**
- ⚠️ Создайте файл импорта для наценок или используйте экспортированный файл

---

## Исправленные проблемы

### ✅ Проблема 2: Дублирование покрытия вместо перемещения

**Расположение:** `js/product.js:82-92`

**Проблема:**
Функция `reorderProductColors()` использовала `insertBefore()` без предварительного удаления элемента, что приводило к дублированию кнопки выбранного покрытия.

**Исправление:**
```javascript
function reorderProductColors(selectedBtn) {
  var container = selectedBtn.closest(".product__colors");
  if (!container) return;
  var firstChild = container.firstElementChild;
  if (firstChild !== selectedBtn) {
    // Удаляем из текущей позиции и вставляем в начало
    selectedBtn.remove();
    container.insertBefore(selectedBtn, firstChild);
  }
}
```

**Что изменилось:**
- Добавлен вызов `selectedBtn.remove()` перед `insertBefore()`
- Теперь элемент перемещается, а не дублируется
- Сортировка сохраняется корректно

---

## Задачи для выполнения

### ⏳ Задача 3: Добавление заголовков и параметров к элементам погонажа и фурнитуры

**Текущая структура (constructor-template.html):**

Погонаж (lines 221-271):
- Стойка короба (box) - динамически заполняется
- Наличник первая сторона (casing-side1) - динамически заполняется
- Наличник вторая сторона (casing-side2) - динамически заполняется
- Добор (dobor) - динамически заполняется
- Дополнительно (extras):
  - Порог (porog) - hardcoded: "2200×75×35 мм"
  - Плинтус (pli

ntus) - не видно в прочитанном фрагменте

**Что нужно сделать:**
1. Создать Highload блок для компонентов погонажа со следующими полями:
   - UF_XML_ID (string, обязательное)
   - UF_NAME (string, обязательное) - например "Наличник"
   - UF_SUBTYPE (string) - например "телескоп", "прямой"
   - UF_CATEGORY (string, обязательное) - "box", "casing", "dobor", "porog", "plintus"
   - UF_DIMENSIONS (string) - например "2200×75×35 мм"
   - UF_PRICE (double, обязательное)
   - UF_IMAGE (file)
   - UF_SORT (double)
   - UF_ACTIVE (boolean)

2. Импортировать данные:
   - Стойка короба: различные типы с размерами
   - Наличник: телескоп, прямой с размерами
   - Добор: различные ширины с размерами
   - Порог: "2200×75×35 мм"
   - Плинтус: размеры

3. Модифицировать JavaScript для динамического отображения:
   - Добавить отображение подзаголовка (UF_SUBTYPE)
   - Добавить отображение размеров (UF_DIMENSIONS)
   - Пример HTML структуры:
     ```html
     <div class="cfg-item">
       <div class="cfg-item__thumb"><img src="..." alt="..."></div>
       <div class="cfg-item__info">
         <span class="cfg-item__name config-item__title">Наличник</span>
         <span class="cfg-item__subtype">телескоп</span>
         <span class="cfg-item__spec config-item__spec">2070×80×12 мм</span>
       </div>
       <div class="cfg-item__price">...</div>
     </div>
     ```

---

## Пошаговая инструкция по импорту

### Шаг 1: Подготовка Bitrix

1. Войдите в административную панель Bitrix
2. Перейдите в раздел: **Контент → Highload блоки**
3. Проверьте наличие следующих блоков:
   - Coatings (Покрытия) - HLBLOCK_4
   - Glasses (Стёкла) - HLBLOCK_2 или HLBLOCK_6
   - OpenVariant (Варианты открывания) - HLBLOCK_8
   - AluEdges (Алюминиевые кромки) - HLBLOCK_9
   - PriceNacenka (Наценка) - HLBLOCK_7

### Шаг 2: Импорт покрытий (Coatings)

1. Откройте Highload блок "Coatings"
2. Нажмите кнопку **"Импорт"**
3. Выберите файл: `bitrix_import/1_coatings_import.xml`
4. Настройки импорта:
   - Формат: XML
   - Кодировка: UTF-8
   - Режим: Добавить новые и обновить существующие (по UF_XML_ID)
5. Запустите импорт
6. После импорта проверьте:
   - Количество записей: должно быть 97
   - Все изображения загружены
   - Все цвета (UF_COLOR_HEX) корректно отображаются

### Шаг 3: Импорт стёкол (Glasses)

⚠️ **ВАЖНО:** Перед импортом необходимо очистить дубликаты!

1. Откройте Highload блок "Glass" или "Glasses"
2. Вручную удалите дублирующиеся записи:
   - Оставьте только записи с правильными символьными кодами (вида "satinato_beloe", "fluts_grafit")
   - Удалите старые записи с XML_ID вида "jW9Af6I8", "DMqek1Zu"
3. После очистки запустите импорт:
   - Файл: `bitrix_import/2_glasses_import.xml`
   - Режим: Добавить новые и обновить существующие
4. Проверьте результат:
   - Должно быть 17 уникальных записей
   - Все категории (UF_CATEGORY) заполнены: "common", "marble", "d_extra_4_22", "d_extra_36_50", "ameri_extra"
   - Поля UF_DESCRIPTION и UF_FULL_DESCRIPTION пустые (для будущего использования)

### Шаг 4: Импорт вариантов открывания (OpenVariant)

1. Откройте файл `bitrix_import/3_opening_types_import.xml` в текстовом редакторе
2. Проверьте и исправьте XML_ID на осмысленные коды:
   ```xml
   <uf_xml_id>raspashnye_pryamye</uf_xml_id>
   <uf_xml_id>raspashnye_dvuhstvorchatye</uf_xml_id>
   <uf_xml_id>razdvizhnye_skrytye</uf_xml_id>
   <uf_xml_id>kompakt_knizhka</uf_xml_id>
   <uf_xml_id>kompakt_libra</uf_xml_id>
   ```
3. Добавьте значения сортировки (UF_SORT): 10, 20, 30, 40, 50
4. Сохраните файл и импортируйте через Bitrix

### Шаг 5: Импорт алюминиевых кромок (AluEdges)

1. Откройте Highload блок "AluEdges"
2. Импортируйте файл: `bitrix_import/4_alu_edges_import.xml`
3. Проверьте:
   - 7 записей
   - Все изображения загружены
   - Типы (UF_TYPE): "Продольная", "По периметру", "Без кромки"
   - Цвета (UF_COLOR): "Серебро", "Чёрный", "Золото", пусто для "Без кромки"

### Шаг 6: Импорт наценок (PriceNacenka)

1. Откройте Highload блок "PriceNacenka"
2. Импортируйте файл: `bitrix_import/actually/nacenka.xml` (используйте экспортированный файл)
3. Проверьте 3 записи:
   - surcharge_enamel_pg: 12780
   - surcharge_enamel_po: 14200
   - engraving_base: 1860

### Шаг 7: Создание компонентов погонажа

⚠️ **Этот блок нужно создать с нуля!**

1. Создайте новый Highload блок:
   - Название: "MoldingComponents" или "Pogonazh"
   - Символьный код таблицы: `b_hlbd_molding_components`
2. Добавьте поля:
   ```
   UF_XML_ID        - строка, обязательное
   UF_NAME          - строка, обязательное (Наличник, Стойка короба, Добор, Порог, Плинтус)
   UF_SUBTYPE       - строка (телескоп, прямой, и т.д.)
   UF_CATEGORY      - строка, обязательное (box, casing, dobor, porog, plintus, etc.)
   UF_DIMENSIONS    - строка (2200×75×35 мм)
   UF_PRICE         - число (double), обязательное
   UF_IMAGE         - файл
   UF_SORT          - число (double)
   UF_ACTIVE        - логический (boolean)
   ```
3. Импортируйте данные из `bitrix_import/8_moldings_components_import.xml` (проверьте наличие файла)

---

## Интеграция с Bitrix шаблонами

### Создание компонента для конфигуратора

1. Создайте компонент Bitrix в: `/local/components/dveryaninov/door.configurator/`
2. Структура компонента:
   ```
   /local/components/dveryaninov/door.configurator/
   ├── .description.php
   ├── .parameters.php
   ├── component.php
   ├── templates/
   │   └── .default/
   │       ├── template.php
   │       ├── style.css
   │       ├── script.js
   │       └── lang/
   │           └── ru/
   │               └── template.php
   ```

### component.php - Загрузка данных из Highload блоков

```php
<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Main\Loader;
use Bitrix\Highloadblock as HL;
use Bitrix\Main\Entity;

Loader::includeModule("highloadblock");

// Функция для получения данных из Highload блока
function getHLData($hlBlockId, $filter = [], $order = ['UF_SORT' => 'ASC']) {
    $hlblock = HL\HighloadBlockTable::getById($hlBlockId)->fetch();
    $entity = HL\HighloadBlockTable::compileEntity($hlblock);
    $entityDataClass = $entity->getDataClass();

    $rsData = $entityDataClass::getList([
        'select' => ['*'],
        'filter' => $filter,
        'order' => $order
    ]);

    $result = [];
    while ($item = $rsData->fetch()) {
        $result[] = $item;
    }
    return $result;
}

// Загрузка покрытий
$arResult['COATINGS'] = getHLData(4, ['UF_ACTIVE' => 1]); // HLBLOCK_4

// Загрузка стёкол
$arResult['GLASSES'] = getHLData(2, ['UF_ACTIVE' => 1]); // HLBLOCK_2 или 6

// Загрузка вариантов открывания
$arResult['OPENING_VARIANTS'] = getHLData(8, ['UF_ACTIVE' => 1]); // HLBLOCK_8

// Загрузка алюминиевых кромок
$arResult['ALU_EDGES'] = getHLData(9, ['UF_ACTIVE' => 1]); // HLBLOCK_9

// Загрузка компонентов погонажа
$arResult['MOLDING_COMPONENTS'] = getHLData(10, ['UF_ACTIVE' => 1]); // HLBLOCK_10 (новый)

// Группировка стёкол по категориям
$arResult['GLASSES_BY_CATEGORY'] = [];
foreach ($arResult['GLASSES'] as $glass) {
    $category = $glass['UF_CATEGORY'] ?: 'common';
    $arResult['GLASSES_BY_CATEGORY'][$category][] = $glass;
}

// Группировка погонажа по категориям
$arResult['MOLDING_BY_CATEGORY'] = [];
foreach ($arResult['MOLDING_COMPONENTS'] as $component) {
    $category = $component['UF_CATEGORY'];
    $arResult['MOLDING_BY_CATEGORY'][$category][] = $component;
}

$this->IncludeComponentTemplate();
```

### templates/.default/template.php - Рендеринг данных

```php
<?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>

<div class="cfg-modal" id="configModal">
  <!-- ... существующая структура ... -->

  <!-- Секция покрытий -->
  <div class="cfg-section">
    <div class="cfg-section__header">
      <span class="config-detail-label">Тип покрытия</span>
    </div>
    <div class="cfg-section__body">
      <?php foreach ($arResult['COATINGS'] as $coating): ?>
        <?php
        $imageSrc = CFile::GetPath($coating['UF_IMAGE']);
        ?>
        <div class="cfg-item"
             data-coating-type="<?= htmlspecialchars($coating['UF_TYPE']) ?>"
             data-coating-id="<?= htmlspecialchars($coating['UF_XML_ID']) ?>">
          <div class="cfg-item__thumb">
            <img src="<?= $imageSrc ?>" alt="<?= htmlspecialchars($coating['UF_NAME']) ?>" loading="lazy">
          </div>
          <div class="cfg-item__info">
            <span class="cfg-item__name"><?= htmlspecialchars($coating['UF_NAME']) ?></span>
            <span class="cfg-item__color" style="background-color: <?= htmlspecialchars($coating['UF_COLOR_HEX']) ?>"></span>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>

  <!-- Секция стёкол -->
  <div class="cfg-section" id="cfgGlassSection">
    <div class="cfg-section__header">
      <span class="config-detail-label">Остекление</span>
    </div>
    <div class="cfg-section__body" id="cfgGlassOptions">
      <?php foreach ($arResult['GLASSES_BY_CATEGORY']['common'] as $glass): ?>
        <?php
        $imageSrc = $glass['UF_IMAGE'] ? CFile::GetPath($glass['UF_IMAGE']) : '';
        $price = (float)$glass['UF_PRICE'];
        ?>
        <div class="cfg-item"
             data-glass-id="<?= htmlspecialchars($glass['UF_XML_ID']) ?>"
             data-price="<?= $price ?>">
          <?php if ($imageSrc): ?>
          <div class="cfg-item__thumb">
            <img src="<?= $imageSrc ?>" alt="<?= htmlspecialchars($glass['UF_NAME']) ?>" loading="lazy">
          </div>
          <?php endif; ?>
          <div class="cfg-item__info">
            <span class="cfg-item__name"><?= htmlspecialchars($glass['UF_NAME']) ?></span>
            <?php if ($price > 0): ?>
            <span class="cfg-item__spec">+<?= number_format($price, 0, ',', ' ') ?> ₽</span>
            <?php endif; ?>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>

  <!-- Секция погонажа с заголовками и параметрами -->
  <section class="config-step" data-step="molding">

    <!-- Стойка короба -->
    <div class="cfg-section">
      <div class="cfg-section__header">
        <span class="config-detail-label">Стойка короба</span>
      </div>
      <div class="cfg-section__body" id="cfgBoxOptions">
        <?php foreach ($arResult['MOLDING_BY_CATEGORY']['box'] as $item): ?>
          <?php
          $imageSrc = CFile::GetPath($item['UF_IMAGE']);
          $price = (float)$item['UF_PRICE'];
          ?>
          <div class="cfg-item" data-price="<?= $price ?>">
            <div class="cfg-item__thumb">
              <img src="<?= $imageSrc ?>" alt="<?= htmlspecialchars($item['UF_NAME']) ?>" loading="lazy">
            </div>
            <div class="cfg-item__info">
              <span class="cfg-item__name config-item__title"><?= htmlspecialchars($item['UF_NAME']) ?></span>
              <?php if ($item['UF_SUBTYPE']): ?>
              <span class="cfg-item__subtype"><?= htmlspecialchars($item['UF_SUBTYPE']) ?></span>
              <?php endif; ?>
              <?php if ($item['UF_DIMENSIONS']): ?>
              <span class="cfg-item__spec config-item__spec"><?= htmlspecialchars($item['UF_DIMENSIONS']) ?></span>
              <?php endif; ?>
            </div>
            <div class="cfg-item__price">
              <span class="config-item__amount"><?= number_format($price, 0, ',', ' ') ?></span>
              <span class="cfg-item__currency">₽/шт</span>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>

    <!-- Наличник -->
    <div class="cfg-section">
      <div class="cfg-section__header">
        <span class="config-detail-label">Наличник</span>
      </div>
      <div class="cfg-section__body" id="cfgCasingOptions">
        <?php foreach ($arResult['MOLDING_BY_CATEGORY']['casing'] as $item): ?>
          <?php
          $imageSrc = CFile::GetPath($item['UF_IMAGE']);
          $price = (float)$item['UF_PRICE'];
          ?>
          <div class="cfg-item" data-price="<?= $price ?>">
            <div class="cfg-item__thumb">
              <img src="<?= $imageSrc ?>" alt="<?= htmlspecialchars($item['UF_NAME']) ?>" loading="lazy">
            </div>
            <div class="cfg-item__info">
              <span class="cfg-item__name config-item__title"><?= htmlspecialchars($item['UF_NAME']) ?></span>
              <?php if ($item['UF_SUBTYPE']): ?>
              <span class="cfg-item__subtype"><?= htmlspecialchars($item['UF_SUBTYPE']) ?></span>
              <?php endif; ?>
              <?php if ($item['UF_DIMENSIONS']): ?>
              <span class="cfg-item__spec config-item__spec"><?= htmlspecialchars($item['UF_DIMENSIONS']) ?></span>
              <?php endif; ?>
            </div>
            <div class="cfg-item__price">
              <span class="config-item__amount"><?= number_format($price, 0, ',', ' ') ?></span>
              <span class="cfg-item__currency">₽/п.м</span>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>

  </section>

</div>
```

### Добавление CSS для новых элементов

```css
/* Подзаголовок элемента (например "телескоп") */
.cfg-item__subtype {
  display: block;
  font-size: 12px;
  color: #666;
  margin-top: 2px;
  font-style: italic;
}

/* Размеры элемента */
.cfg-item__spec {
  display: block;
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}
```

---

## Чек-лист проверки после миграции

### Общие проверки

- [ ] Все Highload блоки созданы и заполнены данными
- [ ] Количество записей соответствует ожиданиям
- [ ] Все изображения загружены и отображаются
- [ ] Все символьные коды (UF_XML_ID) заполнены правильно
- [ ] Все обязательные поля заполнены
- [ ] Сортировка (UF_SORT) работает корректно

### Покрытия

- [ ] 97 покрытий импортировано
- [ ] Все типы покрытий отображаются: pet, pvc, enamel, custom
- [ ] Цвета (UF_COLOR_HEX) корректны и отображаются
- [ ] Изображения загружены для всех кроме "Свой цвет по RAL и NCS"

### Стёкла

- [ ] 17 уникальных стёкол без дубликатов
- [ ] Категории заполнены: common, marble, d_extra_4_22, d_extra_36_50, ameri_extra
- [ ] Цены корректны (0 для базовых, 12400 для флутс, и т.д.)
- [ ] Поля UF_DESCRIPTION и UF_FULL_DESCRIPTION доступны для будущего использования

### Конфигуратор

- [ ] Выбор покрытия перемещает кнопку в начало (не дублирует)
- [ ] Фильтрация стёкол по коллекции работает
- [ ] Фильтрация покрытий по типу работает
- [ ] Все секции погонажа отображают заголовки и параметры
- [ ] Расчёт цены работает корректно
- [ ] Динамическая загрузка данных из Bitrix работает

### Компоненты погонажа

- [ ] Все элементы имеют заголовки (UF_NAME)
- [ ] Подзаголовки (UF_SUBTYPE) отображаются где необходимо
- [ ] Размеры (UF_DIMENSIONS) отображаются корректно
- [ ] Цены корректны и отображаются в правильном формате

---

## Дополнительные рекомендации

### Производительность

1. Используйте кеширование компонента Bitrix (время: 3600 секунд)
2. Создайте индексы на поля UF_XML_ID, UF_ACTIVE, UF_SORT в Highload блоках
3. Оптимизируйте изображения (WebP формат, сжатие)

### Безопасность

1. Экранируйте все выходные данные через `htmlspecialchars()`
2. Не доверяйте пользовательскому вводу
3. Используйте CSRF токены для форм

### SEO

1. Добавьте атрибуты `alt` ко всем изображениям
2. Используйте семантическую разметку (section, article)
3. Добавьте микроразметку Schema.org для товаров

---

## Контакты для поддержки

При возникновении проблем во время миграции обращайтесь к разработчикам Bitrix или проверьте официальную документацию:
- https://dev.1c-bitrix.ru/learning/course/index.php?COURSE_ID=43&LESSON_ID=3493 (Highload блоки)
- https://dev.1c-bitrix.ru/api_help/main/general/prolog_before.php (Компоненты)

---

**Версия документа:** 1.0
**Дата создания:** 2026-04-21
**Статус:** Готово к использованию
