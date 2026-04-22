<?php
/**
 * /local/components/dveryaninov/configurator/class.php
 * Компонент конфигуратора — загружает данные из HighLoad-блоков
 * и инфоблоков, передаёт в шаблон.
 */
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Highloadblock\HighloadBlockTable;
use Bitrix\Main\Loader;

class DverConfiguratorComponent extends CBitrixComponent
{
    public function onPrepareComponentParams($arParams): array
    {
        $arParams['IBLOCK_ID']    = (int)($arParams['IBLOCK_ID'] ?? 0);
        $arParams['ELEMENT_ID']   = (int)($arParams['ELEMENT_ID'] ?? 0);
        $arParams['ELEMENT_CODE'] = trim($arParams['ELEMENT_CODE'] ?? '');
        return $arParams;
    }

    public function executeComponent(): void
    {
        Loader::includeModule('highloadblock');
        Loader::includeModule('iblock');

        $this->arResult['GLASSES']       = $this->loadHLBlockById(6);   // Glass
        $this->arResult['SURCHARGES']    = $this->loadSurcharges();       // PriceNacenka
        $this->arResult['OPEN_VARIANTS'] = $this->loadHLBlockById(8);   // OpenVariant
        $this->arResult['ALU_EDGES']     = $this->loadHLBlockById(9);   // AluEdges
        $this->arResult['COATINGS']      = $this->loadCoatings();        // Coatings (по имени таблицы)
        $this->arResult['MOLDING']       = $this->loadIBlock('molding');
        $this->arResult['HARDWARE']      = $this->loadIBlock('hardware');

        $this->includeComponentTemplate();
    }

    /**
     * Загрузить все записи HighLoad-блока по числовому ID.
     * Поле UF_FILE автоматически конвертируется в FILE_PATH.
     */
    private function loadHLBlockById(int $id): array
    {
        $result = [];
        try {
            $hlData = HighloadBlockTable::getById($id)->fetch();
            if (!$hlData) return $result;

            $entity    = HighloadBlockTable::compileEntity($hlData);
            $dataClass = $entity->getDataClass();
            $res = $dataClass::getList([
                'order' => ['UF_SORT' => 'ASC', 'ID' => 'ASC'],
            ]);
            while ($row = $res->fetch()) {
                if (!empty($row['UF_FILE'])) {
                    $row['FILE_PATH'] = \CFile::GetPath($row['UF_FILE']);
                }
                $result[] = $row;
            }
        } catch (\Exception $e) {
            // HL-блок не найден или ошибка — вернуть пустой массив
        }
        return $result;
    }

    /**
     * Наценки — возвращать как ассоциативный массив по UF_XML_ID.
     */
    private function loadSurcharges(): array
    {
        $items  = $this->loadHLBlockById(7);
        $result = [];
        foreach ($items as $item) {
            $result[$item['UF_XML_ID']] = [
                'name'  => $item['UF_NAME'],
                'price' => (float)$item['UF_PRICE'],
            ];
        }
        return $result;
    }

    /**
     * Покрытия из HL-блока b_hlbd_coatings (ищет по имени таблицы).
     * Добавляет поле COATING_TYPE: pvc / pet / enamel
     */
    private function loadCoatings(): array
    {
        $result = [];
        try {
            $res    = HighloadBlockTable::getList(['filter' => ['=TABLE_NAME' => 'b_hlbd_coatings']]);
            $hlData = $res->fetch();
            if (!$hlData) return $result;

            $entity    = HighloadBlockTable::compileEntity($hlData);
            $dataClass = $entity->getDataClass();
            $dbRes = $dataClass::getList(['order' => ['ID' => 'ASC']]);
            while ($row = $dbRes->fetch()) {
                if (!empty($row['UF_FILE'])) {
                    $row['FILE_PATH'] = \CFile::GetPath($row['UF_FILE']);
                }
                $name = mb_strtolower($row['UF_NAME'] ?? '');
                if (mb_strpos($name, 'пэт') !== false || mb_strpos($name, 'pet') !== false) {
                    $row['COATING_TYPE'] = 'pet';
                } elseif (mb_strpos($name, 'эмаль') !== false) {
                    $row['COATING_TYPE'] = 'enamel';
                } else {
                    $row['COATING_TYPE'] = 'pvc';
                }
                $result[] = $row;
            }
        } catch (\Exception $e) {}
        return $result;
    }

    /**
     * Загрузить элементы инфоблока по символьному коду.
     * Используется для «Погонаж» и «Фурнитура».
     */
    private function loadIBlock(string $iblockCode): array
    {
        $result = [];
        $res = \CIBlockElement::GetList(
            ['SORT' => 'ASC'],
            ['IBLOCK_CODE' => $iblockCode, 'ACTIVE' => 'Y'],
            false,
            false,
            ['ID', 'NAME', 'CODE', 'PREVIEW_PICTURE',
             'PROPERTY_SYSTEM_TYPE', 'PROPERTY_PRICE_PVC', 'PROPERTY_PRICE_ENAMEL',
             'PROPERTY_PHOTO', 'PROPERTY_DOBOR_WIDTH',
             'PROPERTY_HW_GROUP', 'PROPERTY_HW_COLOR', 'PROPERTY_PRICE']
        );
        while ($row = $res->GetNext()) {
            $photoId = $row['PREVIEW_PICTURE'] ?: ($row['PROPERTY_PHOTO_VALUE'] ?? null);
            $row['PHOTO_PATH'] = $photoId ? \CFile::GetPath($photoId) : '';
            $result[] = $row;
        }
        return $result;
    }
}
