<?php
/**
 * /local/php_interface/init.php
 * Инициализационный файл — Битрикс подключает автоматически при каждом запросе.
 * Содержит вспомогательные функции для работы с HighLoad-блоками.
 */
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

/**
 * Получить все записи HighLoad-блока по имени таблицы.
 *
 * @param string $tableName  Имя таблицы (например, 'b_hlbd_glass')
 * @param array  $filter     Фильтр ORM
 * @param array  $select     Список полей для выборки
 * @return array
 */
function dver_get_hl_data(string $tableName, array $filter = [], array $select = ['*']): array
{
    $result = [];
    try {
        $res    = \Bitrix\Highloadblock\HighloadBlockTable::getList([
            'filter' => ['=TABLE_NAME' => $tableName],
        ]);
        $hlData = $res->fetch();
        if (!$hlData) return $result;

        $entity    = \Bitrix\Highloadblock\HighloadBlockTable::compileEntity($hlData);
        $dataClass = $entity->getDataClass();
        $dbRes = $dataClass::getList([
            'filter' => $filter,
            'select' => $select,
        ]);
        while ($row = $dbRes->fetch()) {
            $result[] = $row;
        }
    } catch (\Exception $e) {}
    return $result;
}

/**
 * Получить данные HighLoad-блока по числовому ID.
 *
 * @param int   $hlId    ID HighLoad-блока
 * @param array $filter  Фильтр ORM
 * @param array $order   Сортировка
 * @return array
 */
function dver_get_hl_by_id(int $hlId, array $filter = [], array $order = ['ID' => 'ASC']): array
{
    $result = [];
    try {
        $hlData = \Bitrix\Highloadblock\HighloadBlockTable::getById($hlId)->fetch();
        if (!$hlData) return $result;

        $entity    = \Bitrix\Highloadblock\HighloadBlockTable::compileEntity($hlData);
        $dataClass = $entity->getDataClass();
        $dbRes = $dataClass::getList([
            'filter' => $filter,
            'order'  => $order,
        ]);
        while ($row = $dbRes->fetch()) {
            if (!empty($row['UF_FILE'])) {
                $row['FILE_PATH'] = \CFile::GetPath($row['UF_FILE']);
            }
            $result[] = $row;
        }
    } catch (\Exception $e) {}
    return $result;
}
