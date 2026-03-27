const fs = require('fs');
const htmlPath = '/workspaces/dveryaninov/product.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// replace the button content and add same size logic
html = html.replace(
  '<button type="button" class="btn btn_secondary pdp-actions__fav" aria-label="В избранное">♥</button>',
  '<button type="button" class="btn btn_secondary pdp-actions__fav card__fav" style="position:relative; top:0; right:0; width:56px; height:56px; border:1px solid #ccc; background-color:#fff;" aria-label="В избранное"></button>'
);
fs.writeFileSync(htmlPath, html);

const cssPath = '/workspaces/dveryaninov/css/main.css';
let css = fs.readFileSync(cssPath, 'utf8');
if(!css.includes('.pdp-actions__fav.is-active')) {
  css += `
.pdp-actions__fav.is-active {
  background-color: #fdf5f6 !important;
  border-color: var(--color-wine) !important;
}
`;
  fs.writeFileSync(cssPath, css);
}

console.log("Patched product.html wishlist to use SVG");
