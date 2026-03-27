const fs = require('fs');

const breadcrumbsHtml = `
      <nav class="pdp-breadcrumbs" aria-label="Хлебные крошки" style="padding: 16px clamp(16px, 3vw, 40px); max-width: 1440px; margin: 0 auto; width: 100%;">
        <div class="pdp-breadcrumbs__desktop">
          <a class="pdp-breadcrumbs__link" href="index.html">Главная</a>
          <span class="pdp-breadcrumbs__sep">></span>
          <span class="pdp-breadcrumbs__current">Каталог межкомнатных дверей</span>
        </div>
      </nav>
`;

let catalog = fs.readFileSync('/workspaces/dveryaninov/catalog.html', 'utf8');
if(!catalog.includes('pdp-breadcrumbs')) {
  catalog = catalog.replace('<main>', '<main>' + breadcrumbsHtml);
  fs.writeFileSync('/workspaces/dveryaninov/catalog.html', catalog);
}

