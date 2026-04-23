<?php
/**
 * /local/templates/dveryaninov/components/bitrix/blog.post.list/dveryaninov_home/template.php
 * Шаблон списка постов блога для главной страницы (P9).
 * Выводит карусель из 4 карточек в стиле секции "blog" из static index.html.
 */
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

if (empty($arResult['POSTS'])) return;

/** @var array $arResult */
$posts = $arResult['POSTS'];
$blogUrl = htmlspecialchars($arParams['BLOG_URL'] ?? '/blog/');
?>

<div class="blog__slider-wrap">
  <div class="blog__carousel bx-blog-list">
    <?php foreach ($posts as $post):
      $dateFormatted = '';
      if (!empty($post['DATE_PUBLISH_FORMATED'])) {
          $dateFormatted = $post['DATE_PUBLISH_FORMATED'];
      } elseif (!empty($post['DATE_PUBLISH'])) {
          $ts = strtotime($post['DATE_PUBLISH']);
          $dateFormatted = $ts ? date('d.m.Y', $ts) : '';
      }

      $imgPath = '';
      if (!empty($post['IMG']['SRC'])) {
          $imgPath = $post['IMG']['SRC'];
      } elseif (!empty($post['PREVIEW_PICTURE']) && is_int($post['PREVIEW_PICTURE'])) {
          $imgPath = \CFile::GetPath($post['PREVIEW_PICTURE']);
      }

      $title   = htmlspecialchars($post['TITLE'] ?? '');
      $author  = htmlspecialchars($post['AUTHOR']['NAME'] ?? $post['AUTHOR_ID'] ?? '');
      $detailUrl = htmlspecialchars($post['~DETAIL_URL'] ?? $post['DETAIL_URL'] ?? $blogUrl);
    ?>
      <article class="blog-card bx-blog-card">
        <?php if ($imgPath): ?>
        <a href="<?= $detailUrl ?>" class="bx-blog-card__img-wrap blog-card__img-wrap">
          <img src="<?= htmlspecialchars($imgPath) ?>"
               class="bx-blog-card__img blog-card__img"
               alt="<?= $title ?>"
               loading="lazy">
        </a>
        <?php endif; ?>
        <div class="bx-blog-card__body">
          <p class="bx-blog-card__meta blog-card__meta">
            <?= $dateFormatted ?>
            <?php if ($author): ?> &middot; <?= $author ?><?php endif; ?>
          </p>
          <h3 class="bx-blog-card__title blog-card__title">
            <a href="<?= $detailUrl ?>" class="bx-blog-card__link"><?= $title ?></a>
          </h3>
          <a href="<?= $detailUrl ?>" class="bx-blog-card__more">Читать далее &rarr;</a>
        </div>
      </article>
    <?php endforeach; ?>
  </div>

  <?php if (count($posts) > 1): ?>
  <button class="blog__nav-btn" aria-label="Вперёд" id="blog-carousel-next">&rarr;</button>
  <?php endif; ?>
</div>

<script>
(function () {
  var wrap = document.querySelector('.blog__carousel');
  var btn  = document.getElementById('blog-carousel-next');
  if (!wrap || !btn) return;
  var step = wrap.querySelector('.bx-blog-card');
  if (!step) return;
  btn.addEventListener('click', function () {
    var w = step.offsetWidth + parseInt(getComputedStyle(wrap).gap || 24, 10);
    wrap.scrollBy({ left: w, behavior: 'smooth' });
  });
})();
</script>
