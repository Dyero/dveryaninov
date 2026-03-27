const fs = require('fs');

function updateCards(html) {
  return html.replace(/<article class="card">[\s\S]*?<\/article>/g, (match) => {
    // Keep link and title
    let titleMatch = match.match(/<h3 class="card__title"><a href="([^"]+)">(.*?)<\/a><\/h3>/);
    let href = titleMatch ? titleMatch[1] : '#';
    let title = titleMatch ? titleMatch[2] : 'Дверь';

    let imgMatch = match.match(/<img class="card__image" src="([^"]+)" alt="([^"]+)"[^>]*>/);
    let imgSrc = imgMatch ? imgMatch[1] : 'images/card-door-1.svg';
    let imgAlt = imgMatch ? imgMatch[2] : title;

    let priceMatch = match.match(/<p class="card__price">(.*?)<\/p>/);
    let priceFull = priceMatch ? priceMatch[1] : 'от 58 600 ₽';
    let digits = priceFull.replace(/[^\d\s₽]/g, '').trim();

    return `<article class="card">
          <div class="card__image-wrap">
            <span class="card__badge">Новинка</span>
            <button class="card__fav" aria-label="В избранное"></button>
            <img class="card__image" src="${imgSrc}" alt="${imgAlt}">
          </div>
          <div class="card__info">
            <h3 class="card__title"><a href="${href}">${title}</a></h3>
            <p class="card__price"><span class="card__price-prefix">от</span> ${digits}</p>
          </div>
        </article>`;
  });
}

function updateBento(html) {
  const bentoGrid = `
    <section class="bento-categories" aria-labelledby="collections-title">
      <div class="bento-categories__head">
        <h2 class="bento-categories__title" id="collections-title">Категории</h2>
      </div>
      <div class="bento-grid">
        <a class="bento-card bento-card_large" href="#catalog">
          <img class="bento-card__img" src="images/hero-bg.svg" alt="Межкомнатные двери">
          <div class="bento-card__content">
            <h3 class="bento-card__title">Межкомнатные двери</h3>
            <span class="bento-card__arrow">→</span>
          </div>
        </a>
        <a class="bento-card bento-card_wide" href="#catalog">
          <img class="bento-card__img" src="images/hero-bg.svg" alt="Перегородки">
          <div class="bento-card__content">
            <h3 class="bento-card__title">Перегородки</h3>
            <span class="bento-card__arrow">→</span>
          </div>
        </a>
        <a class="bento-card bento-card_box" href="#catalog">
          <img class="bento-card__img" src="images/hero-bg.svg" alt="Скрытые двери">
          <div class="bento-card__content">
            <h3 class="bento-card__title">Скрытые двери</h3>
            <span class="bento-card__arrow">→</span>
          </div>
        </a>
        <a class="bento-card bento-card_box" href="#catalog">
          <img class="bento-card__img" src="images/hero-bg.svg" alt="Фурнитура">
          <div class="bento-card__content">
            <h3 class="bento-card__title">Фурнитура</h3>
            <span class="bento-card__arrow">→</span>
          </div>
        </a>
      </div>
    </section>
  `;
  return html.replace(/<section class="collections" aria-labelledby="collections-title">[\s\S]*?<\/section>/, bentoGrid);
}

// 1. Patch catalog.html
let catHtml = fs.readFileSync('/workspaces/dveryaninov/catalog.html', 'utf8');
catHtml = updateBento(catHtml);
catHtml = updateCards(catHtml);
fs.writeFileSync('/workspaces/dveryaninov/catalog.html', catHtml);

// 2. Patch index.html (Products in stock && novelties + Bento if exists)
let indexHtml = fs.readFileSync('/workspaces/dveryaninov/index.html', 'utf8');
indexHtml = updateCards(indexHtml);
fs.writeFileSync('/workspaces/dveryaninov/index.html', indexHtml);

