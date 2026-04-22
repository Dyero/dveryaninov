<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Коллекции");
?>

<main class="collections-page">
    <nav class="breadcrumbs">
        <a class="breadcrumbs__link" href="/">Главная</a>
        <span class="breadcrumbs__sep">–</span>
        <span class="breadcrumbs__current">Коллекции</span>
    </nav>

    <h1>Коллекции межкомнатных дверей</h1>

    <div class="section__cards section__cards_wrap">
        <?php
        // Вывести все коллекции из инфоблока
        $rsCollections = CIBlockElement::GetList(
            ["SORT" => "ASC", "NAME" => "ASC"],
            [
                "IBLOCK_ID" => 1,
                "ACTIVE" => "Y"
            ],
            false,
            false,
            ["ID", "NAME", "CODE", "PREVIEW_PICTURE", "PROPERTY_PRICE_FROM"]
        );

        while ($arCollection = $rsCollections->GetNextElement()) {
            $arFields = $arCollection->GetFields();
            $arProps = $arCollection->GetProperties();

            $imageSrc = CFile::GetPath($arFields["PREVIEW_PICTURE"]);
            $priceFrom = $arProps["PRICE_FROM"]["VALUE"] ?? "52 800";
            ?>
            <article class="card">
                <div class="card__image-wrap">
                    <img class="card__image" src="<?= $imageSrc ?>" alt="<?= htmlspecialcharsbx($arFields["NAME"]) ?>">
                </div>
                <div class="card__info">
                    <h3 class="card__title">
                        <a href="/collections/<?= $arFields["CODE"] ?>/"><?= htmlspecialcharsbx($arFields["NAME"]) ?></a>
                    </h3>
                    <p class="card__price"><span class="card__price-prefix">от</span> <?= number_format($priceFrom, 0, ',', ' ') ?> ₽</p>
                </div>
            </article>
            <?php
        }
        ?>
    </div>
</main>

<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
?>
