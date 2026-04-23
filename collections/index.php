<?php
/**
 * /collections/index.php
 * Страница «Коллекции» с сеткой 3+1 / 1+3 (16:9, P8).
 * Данные получаем из инфоблока Битрикс (разделы), при ошибке — статический список.
 * Статический collections.html остаётся нетронутым.
 */
require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/header.php');
$APPLICATION->SetTitle('Коллекции дверей — Дверянинов');

/* Попытка получить коллекции из инфоблока */
$collections = [];
try {
    $iblockId = 10; // ID инфоблока «Двери»
    $resSections = \CIBlockSection::GetList(
        ['SORT' => 'ASC', 'NAME' => 'ASC'],
        ['IBLOCK_ID' => $iblockId, 'ACTIVE' => 'Y', 'DEPTH_LEVEL' => 1],
        false,
        ['ID', 'NAME', 'CODE', 'SECTION_PAGE_URL', 'PICTURE', 'UF_PRICE_FROM']
    );
    while ($sec = $resSections->GetNext()) {
        $imgPath = $sec['PICTURE'] ? \CFile::GetPath($sec['PICTURE']) : '';
        $collections[] = [
            'name'  => $sec['NAME'],
            'url'   => $sec['SECTION_PAGE_URL'] ?: '/catalog/' . $sec['CODE'] . '/',
            'img'   => $imgPath,
            'price' => (int)($sec['UF_PRICE_FROM'] ?? 0),
        ];
    }
} catch (\Exception $e) {}

/* Статический список-заглушка, если Битрикс недоступен */
if (empty($collections)) {
    $collections = [
        ['name' => 'Аврора',         'url' => '/catalog/avrora/',         'img' => '/images/Коллекции/Аврора/Аврора 1 ПГ 1.jpg',                  'price' => 20300],
        ['name' => 'Альберта',       'url' => '/catalog/alberta/',       'img' => '/images/Коллекции/Альберта/Альберта 1 1.png',                   'price' => 23140],
        ['name' => 'Амери',          'url' => '/catalog/ameri/',          'img' => '/images/Коллекции/Амери/амери 1 ПГ 1.png',                     'price' => 19300],
        ['name' => 'Амфора',         'url' => '/catalog/amfora/',         'img' => '/images/Коллекции/Амфора/Амфора 1 1.png',                      'price' => 19870],
        ['name' => 'Белуни',         'url' => '/catalog/beluni/',         'img' => '/images/Коллекции/Белуни/БЕЛУНИ 1ПГ 1.png',                    'price' => 19440],
        ['name' => 'Бланк',          'url' => '/catalog/blank/',          'img' => '/images/Коллекции/Бланк/Бланк 1 ПГ 1.png',                    'price' => 20860],
        ['name' => 'Бона',           'url' => '/catalog/bona/',           'img' => '/images/Коллекции/Бона/БОНА 1пг 1.png',                        'price' => 19300],
        ['name' => 'Бонеко',         'url' => '/catalog/boneko/',         'img' => '/images/Коллекции/Бонеко/БОНЭКО 1 ПГ 1.png',                  'price' => 19440],
        ['name' => 'Вектор',         'url' => '/catalog/vektor/',         'img' => '/images/Коллекции/Вектор/вектор 10пг 1.png',                   'price' => 19870],
        ['name' => 'Верто',          'url' => '/catalog/verto/',          'img' => '/images/Коллекции/Верто/Верто 1 1.png',                        'price' => 20860],
        ['name' => 'Витра',          'url' => '/catalog/vitra/',          'img' => '/images/Коллекции/Витра/Витра 1 ПГ 1.png',                    'price' => 21290],
        ['name' => 'Д',              'url' => '/catalog/d/',              'img' => '/images/Коллекции/Д/Д14.png',                                  'price' => 12770],
        ['name' => 'Декар',          'url' => '/catalog/dekar/',          'img' => '/images/Коллекции/Декар/Декар 1 ПГ 1.png',                    'price' => 20860],
        ['name' => 'Декар с багетом','url' => '/catalog/dekar-s-bagetom/','img' => '/images/Коллекции/Декар с багетом/Декар с багетом 1 1.png',   'price' => 24560],
        ['name' => 'Кант',           'url' => '/catalog/kant/',           'img' => '/images/Коллекции/Кант/кант 1ПГ 1.png',                       'price' => 18020],
        ['name' => 'Каскад',         'url' => '/catalog/kaskad/',         'img' => '/images/Коллекции/Каскад/Каскад 1 ПГ 2.png',                  'price' => 19870],
        ['name' => 'Квант',          'url' => '/catalog/kvant/',          'img' => '/images/Коллекции/Квант/Квант 1 ПГ 1.png',                    'price' => 23140],
        ['name' => 'Мета',           'url' => '/catalog/meta/',           'img' => '/images/Коллекции/Мета/мета 1пг 1.png',                       'price' => 21720],
        ['name' => 'Миура',          'url' => '/catalog/miura/',          'img' => '/images/Коллекции/Миура/миура 1ПГ 2.png',                     'price' => 20440],
        ['name' => 'Модена',         'url' => '/catalog/modena/',         'img' => '/images/Коллекции/Модена/Модена 1 ПГ 1.png',                  'price' => 23140],
        ['name' => 'Моно',           'url' => '/catalog/mono/',           'img' => '/images/Коллекции/Моно/моно 1 3.png',                         'price' => 18450],
        ['name' => 'Нео',            'url' => '/catalog/neo/',            'img' => '/images/Коллекции/Нео/нео 1пг 1.png',                         'price' => 19300],
        ['name' => 'Оазис',          'url' => '/catalog/oazis/',          'img' => '/images/Коллекции/Оазис/Оазис 1 ПГ 1.png',                   'price' => 20300],
        ['name' => 'Палладио',       'url' => '/catalog/palladio/',       'img' => '/images/Коллекции/Палладио/Палладио 1 ПГ 1.png',              'price' => 20860],
        ['name' => 'Плиссе',         'url' => '/catalog/plisse/',         'img' => '/images/Коллекции/Плиссе/плиссе 1 1.png',                    'price' => 25690],
        ['name' => 'Терра',          'url' => '/catalog/terra/',          'img' => '/images/Коллекции/Терра/Терра 1 ПГ 1.png',                   'price' => 21720],
        ['name' => 'Ультра',         'url' => '/catalog/ultra/',          'img' => '/images/Коллекции/Ультра/ультра 1пг 1.png',                   'price' => 19870],
        ['name' => 'Флай',           'url' => '/catalog/flaj/',           'img' => '/images/Коллекции/Флай/ФЛАЙ 1 1.png',                         'price' => 24560],
        ['name' => 'Форм',           'url' => '/catalog/form/',           'img' => '/images/Коллекции/Форм/Форм 1 2.png',                         'price' => 20860],
        ['name' => 'Этерна',         'url' => '/catalog/eterna/',         'img' => '/images/Коллекции/Этерна/Этерна 1 ПГ 2.png',                  'price' => 19300],
    ];
}

/* Разбиваем на группы по 4 для рядов 3+1 / 1+3 */
$groups = array_chunk($collections, 4);
?>

<main class="catalog-page">
  <div class="container">
    <nav class="breadcrumbs" aria-label="Хлебные крошки">
      <a class="breadcrumbs__link" href="/">Главная</a>
      <span class="breadcrumbs__sep">–</span>
      <span class="breadcrumbs__current">Коллекции</span>
    </nav>

    <h1 class="catalog-page__title">Коллекции</h1>

    <div class="collections-grid">
      <?php foreach ($groups as $gIdx => $group):
        $isReversed = ($gIdx % 2 === 1); // чётные ряды = 1+3

        // Нормализуем группу: всегда работаем с 4 элементами (или меньше)
        while (count($group) < 4) $group[] = null; // дополним null если < 4
        [$c0, $c1, $c2, $c3] = $group;

        // В ряду 3+1: карточки 0,1,2 — маленькие, 3 — крупная (справа)
        // В ряду 1+3: карточка 0 — крупная (слева), 1,2,3 — маленькие

        if (!$isReversed):
          // 3+1: [narrow][narrow][narrow][wide]
          $narrows = array_filter([$c0, $c1, $c2]);
          $wide    = $c3;
        else:
          // 1+3: [wide][narrow][narrow][narrow]
          $wide    = $c0;
          $narrows = array_filter([$c1, $c2, $c3]);
        endif;
      ?>
        <div class="collections-row<?= $isReversed ? ' collections-row_reversed' : '' ?>">

          <?php if (!$isReversed): ?>
            <!-- 3 маленьких карточки -->
            <?php foreach ($narrows as $c): ?>
              <?php if ($c): ?>
              <a href="<?= htmlspecialchars($c['url']) ?>" class="collection-card collections-row__narrow">
                <?php if ($c['img']): ?>
                <img class="collection-card__image"
                     src="<?= htmlspecialchars($c['img']) ?>"
                     alt="<?= htmlspecialchars($c['name']) ?>"
                     loading="lazy">
                <?php endif; ?>
                <div class="collection-card__overlay"></div>
                <div class="collection-card__info">
                  <h3 class="collection-card__title"><?= htmlspecialchars($c['name']) ?></h3>
                  <?php if ($c['price'] > 0): ?>
                  <p class="collection-card__price">от <?= number_format($c['price'], 0, '.', ' ') ?> ₽</p>
                  <?php endif; ?>
                </div>
              </a>
              <?php else: ?><div class="collections-row__narrow"></div><?php endif; ?>
            <?php endforeach; ?>
            <!-- Крупная карточка справа -->
            <?php if ($wide): ?>
            <a href="<?= htmlspecialchars($wide['url']) ?>" class="collection-card collections-row__wide">
              <?php if ($wide['img']): ?>
              <img class="collection-card__image"
                   src="<?= htmlspecialchars($wide['img']) ?>"
                   alt="<?= htmlspecialchars($wide['name']) ?>"
                   loading="lazy">
              <?php endif; ?>
              <div class="collection-card__overlay"></div>
              <div class="collection-card__info">
                <h3 class="collection-card__title"><?= htmlspecialchars($wide['name']) ?></h3>
                <?php if ($wide['price'] > 0): ?>
                <p class="collection-card__price">от <?= number_format($wide['price'], 0, '.', ' ') ?> ₽</p>
                <?php endif; ?>
              </div>
            </a>
            <?php endif; ?>

          <?php else: ?>
            <!-- Крупная карточка слева -->
            <?php if ($wide): ?>
            <a href="<?= htmlspecialchars($wide['url']) ?>" class="collection-card collections-row__wide">
              <?php if ($wide['img']): ?>
              <img class="collection-card__image"
                   src="<?= htmlspecialchars($wide['img']) ?>"
                   alt="<?= htmlspecialchars($wide['name']) ?>"
                   loading="lazy">
              <?php endif; ?>
              <div class="collection-card__overlay"></div>
              <div class="collection-card__info">
                <h3 class="collection-card__title"><?= htmlspecialchars($wide['name']) ?></h3>
                <?php if ($wide['price'] > 0): ?>
                <p class="collection-card__price">от <?= number_format($wide['price'], 0, '.', ' ') ?> ₽</p>
                <?php endif; ?>
              </div>
            </a>
            <?php endif; ?>
            <!-- 3 маленьких карточки -->
            <?php foreach ($narrows as $c): ?>
              <?php if ($c): ?>
              <a href="<?= htmlspecialchars($c['url']) ?>" class="collection-card collections-row__narrow">
                <?php if ($c['img']): ?>
                <img class="collection-card__image"
                     src="<?= htmlspecialchars($c['img']) ?>"
                     alt="<?= htmlspecialchars($c['name']) ?>"
                     loading="lazy">
                <?php endif; ?>
                <div class="collection-card__overlay"></div>
                <div class="collection-card__info">
                  <h3 class="collection-card__title"><?= htmlspecialchars($c['name']) ?></h3>
                  <?php if ($c['price'] > 0): ?>
                  <p class="collection-card__price">от <?= number_format($c['price'], 0, '.', ' ') ?> ₽</p>
                  <?php endif; ?>
                </div>
              </a>
              <?php else: ?><div class="collections-row__narrow"></div><?php endif; ?>
            <?php endforeach; ?>
          <?php endif; ?>

        </div><!-- /.collections-row -->
      <?php endforeach; ?>
    </div><!-- /.collections-grid -->
  </div><!-- /.container -->
</main>

<?php require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/footer.php'); ?>
