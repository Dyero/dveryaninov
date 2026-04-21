<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

$arComponentDescription = [
    "NAME" => "Простая карточка товара",
    "DESCRIPTION" => "Упрощённая карточка для погонажа и фурнитуры",
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
