const fs = require('fs');

let html = fs.readFileSync('/workspaces/dveryaninov/index.html', 'utf8');

// Fix products shelf 1 (Popular)
html = html.replace(/<article class="card">[\s\S]*?Дверь Ультра 5 ПГ[\s\S]*?<\/article>/, `<article class="card">
          <div class="card__image-wrap">
            <span class="card__badge">Новинка</span>
            <button class="card__fav" aria-label="В избранное"></button>
            <img class="card__image" src="images/card-door-2.svg" alt="Дверь Ультра 5 ПГ">
          </div>
          <div class="card__info">
            <h3 class="card__title"><a href="product.html?id=2">Дверь Ультра 5 ПГ</a></h3>
            <p class="card__price"><span class="card__price-prefix">от</span> 49 100 ₽</p>
          </div>
        </article>`);

// Rebuild Shelf 1 explicitly
const shelf1 = `        <article class="card">
          <div class="card__image-wrap">
            <span class="card__badge">Новинка</span>
            <button class="card__fav" aria-label="В избранное"></button>
            <img class="card__image" src="images/card-door-1.svg" alt="Дверь Флай 8 ПГ">
          </div>
          <div class="card__info">
            <h3 class="card__title"><a href="product-fly-8-pg.html">Дверь Флай 8 ПГ</a></h3>
            <p class="card__price"><span class="card__price-prefix">от</span> 58 600 ₽</p>
          </div>
        </article>
        <article class="card">
          <div class="card__image-wrap">
            <span class="card__badge">Хит</span>
            <button class="card__fav" aria-label="В избранное"></button>
            <img class="card__image" src="images/card-door-2.svg" alt="Дверь Ультра 5 ПГ">
          </div>
          <div class="card__info">
            <h3 class="card__title"><a href="product-ultra-5-pg.html">Дверь Ультра 5 ПГ</a></h3>
            <p class="card__price"><span class="card__price-prefix">от</span> 49 100 ₽</p>
          </div>
        </article>
        <article class="card">
          <div class="card__image-wrap">
            <button class="card__fav" aria-label="В избранное"></button>
            <img class="card__image" src="images/card-door-3.svg" alt="Дверь Кат 5 ПО">
          </div>
          <div class="card__info">
            <h3 class="card__title"><a href="product.html">Дверь Кат 5 ПО</a></h3>
            <p class="card__price"><span class="card__price-prefix">от</span> 62 400 ₽</p>
          </div>
        </article>
        <article class="card">
          <div class="card__image-wrap">
            <button class="card__fav" aria-label="В избранное"></button>
            <img class="card__image" src="images/card-door-4.svg" alt="Дверь Терра 5 ПГ">
          </div>
          <div class="card__info">
            <h3 class="card__title"><a href="product.html">Дверь Терра 5 ПГ</a></h3>
            <p class="card__price"><span class="card__price-prefix">от</span> 51 000 ₽</p>
          </div>
        </article>`;

html = html.replace(/<div class="section__cards section__cards_wrap">[\s\S]*?<\/section>/, `<div class="section__cards section__cards_wrap">
${shelf1}
      </div>
    </section>`);

// Fix Shelf 2 (In Stock)
const shelf2 = `        <article class="card">
          <div class="card__image-wrap">
            <button class="card__fav" aria-label="В избранное"></button>
            <img class="card__image" src="images/card-placeholder.svg" alt="Дверь Флай 8 ПГ">
          </div>
          <div class="card__info">
            <h3 class="card__title"><a href="product-fly-8-pg.html">Дверь ДВ 1 ПГ</a></h3>
            <p class="card__price"><span class="card__price-prefix">от</span> 45 200 ₽</p>
          </div>
        </article>
        <article class="card">
          <div class="card__image-wrap">
            <span class="card__badge" style="background:#555;">Скидка -10%</span>
            <button class="card__fav" aria-label="В избранное"></button>
            <img class="card__image" src="images/card-placeholder.svg" alt="Дверь">
          </div>
          <div class="card__info">
            <h3 class="card__title"><a href="product.html">Дверь ДВ 2 ПО</a></h3>
            <p class="card__price"><span class="card__price-prefix">от</span> 39 900 ₽</p>
          </div>
        </article>
        <article class="card">
          <div class="card__image-wrap">
            <button class="card__fav" aria-label="В избранное"></button>
            <img class="card__image" src="images/card-placeholder.svg" alt="Дверь">
          </div>
          <div class="card__info">
            <h3 class="card__title"><a href="product.html">Дверь ДВ 3 ПГ</a></h3>
            <p class="card__price"><span class="card__price-prefix">от</span> 54 000 ₽</p>
          </div>
        </article>
        <article class="card">
          <div class="card__image-wrap">
            <button class="card__fav" aria-label="В избранное"></button>
            <img class="card__image" src="images/card-placeholder.svg" alt="Дверь">
          </div>
          <div class="card__info">
            <h3 class="card__title"><a href="product.html">Дверь ДВ 4 ПО</a></h3>
            <p class="card__price"><span class="card__price-prefix">от</span> 48 500 ₽</p>
          </div>
        </article>`;

html = html.replace(/<div class="section__cards">[\s\S]*?<\/section>/, `<div class="section__cards">
${shelf2}
      </div>
    </section>`);

// Fix blog
html = html.replace(/<div class="blog__carousel">[\s\S]*?<\/div>\s*<button class="blog__nav-btn"/, `<div class="blog__carousel">
            <article class="blog-card">
              <div class="blog-card__img-wrap">
                <img src="images/news-1.png" class="blog-card__img" alt="Blog">
              </div>
              <p class="blog-card__meta">16.09.2022 · Новости</p>
              <h3 class="blog-card__title">Как выбрать дверь для спальни, чтобы ничто не мешало сну</h3>
            </article>
            <article class="blog-card">
              <div class="blog-card__img-wrap">
                <img src="images/news-2.png" class="blog-card__img" alt="Blog">
              </div>
              <p class="blog-card__meta">16.09.2022 · Новости</p>
              <h3 class="blog-card__title">Обновление коллекции: новые оттенки и фактуры</h3>
            </article>
            <article class="blog-card">
              <div class="blog-card__img-wrap">
                <img src="images/news-3.png" class="blog-card__img" alt="Blog">
              </div>
              <p class="blog-card__meta">16.09.2022 · Новости</p>
              <h3 class="blog-card__title">Скрытые двери: тренд, который останется с нами надолго</h3>
            </article>
            <article class="blog-card blog-card_hint">
              <div class="blog-card__img-wrap">
                <img src="images/news-4.png" class="blog-card__img" alt="Blog">
              </div>
              <p class="blog-card__meta">16.09.2022 · Новости</p>
              <h3 class="blog-card__title">Шумоизоляция дверей: мифы и реальность</h3>
            </article>
          </div>
          <button class="blog__nav-btn"`);

// Fix images for promo blocks
html = html.replace('src="images/card-door-1.svg" alt="Коллекция Амфора"', 'src="images/Альберта.png" alt="Коллекция Амфора"');
html = html.replace('src="images/card-door-2.svg" alt="Примерка двери"', 'src="images/hero-bg.svg" alt="Примерка двери"');

fs.writeFileSync('/workspaces/dveryaninov/index.html', html, 'utf8');
console.log('index.html fixed');

// Fix CSS for backgrounds
let css = fs.readFileSync('/workspaces/dveryaninov/css/main.css', 'utf8');
css = css.replace(/background: url\('\.\.\/images\/card-door-1\.svg'\) center\/cover no-repeat;/, `background: url('../images/hero-bg.svg') center/cover no-repeat;`);
css = css.replace(/background: url\('\.\.\/images\/card-door-2\.svg'\) center\/cover;/, `background: url('../images/news-1.png') center/cover;`);

fs.writeFileSync('/workspaces/dveryaninov/css/main.css', css, 'utf8');
console.log('CSS backgrounds fixed');

