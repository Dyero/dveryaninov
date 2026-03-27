const fs = require('fs');

const path = '/workspaces/dveryaninov/header.html';
let html = fs.readFileSync(path, 'utf8');

if (!html.includes('account.html')) {
  html = html.replace('<a href="cart.html" class="header__icon-btn" aria-label="Корзина">', 
  `<a href="account.html" class="header__icon-btn" aria-label="Личный кабинет">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="header__icon">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
    <a href="cart.html" class="header__icon-btn" aria-label="Корзина">`);
  fs.writeFileSync(path, html);
  console.log("Account link added to header");
} else {
  console.log("Account link already exists");
}
