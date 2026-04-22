<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

$arComponentDescription = [
    "NAME" => "Каталог дверей",
    "DESCRIPTION" => "Отображает список дверей с фильтрами",
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
