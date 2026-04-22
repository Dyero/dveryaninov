<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Main\Page\Asset;
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php
    $APPLICATION->ShowHead();
    Asset::getInstance()->addCss(SITE_TEMPLATE_PATH . "/css/main.css");
    Asset::getInstance()->addCss(SITE_TEMPLATE_PATH . "/css/responsive.css");

    // ИСПРАВЛЕНИЕ: Добавить все необходимые JS
    Asset::getInstance()->addJs(SITE_TEMPLATE_PATH . "/js/auth.js");
    Asset::getInstance()->addJs(SITE_TEMPLATE_PATH . "/js/load-components.js");
    Asset::getInstance()->addJs(SITE_TEMPLATE_PATH . "/js/cart.js");
    Asset::getInstance()->addJs(SITE_TEMPLATE_PATH . "/js/product.js");
    Asset::getInstance()->addJs(SITE_TEMPLATE_PATH . "/js/coatings-data.js");
    Asset::getInstance()->addJs(SITE_TEMPLATE_PATH . "/js/configurator-data.js");
    ?>
    <title><?php $APPLICATION->ShowTitle(); ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet">
</head>
<body class="page">
    <?php $APPLICATION->ShowPanel(); ?>

    <?php
    // Include site header component
    $APPLICATION->IncludeComponent(
        "bitrix:main.include",
        "",
        array(
            "AREA_FILE_SHOW" => "file",
            "PATH" => SITE_TEMPLATE_PATH . "/includes/header.php",
            "EDIT_TEMPLATE" => ""
        )
    );
    ?>