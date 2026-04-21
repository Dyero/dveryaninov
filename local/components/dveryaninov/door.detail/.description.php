<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

$arComponentDescription = [
    "NAME" => "Карточка двери",
    "DESCRIPTION" => "Отображает детальную информацию о двери с конфигуратором",
    "ICON" => "/images/icon.gif",
    "SORT" => 10,
    "PATH" => [
        "ID" => "dveryaninov",
        "NAME" => "Дверянинов",
        "CHILD" => [
            "ID" => "catalog",
            "NAME" => "Каталог"
        ]
    ],
];
