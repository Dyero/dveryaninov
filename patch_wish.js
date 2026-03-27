const fs = require('fs');

let shopJs = fs.readFileSync('js/shop.js', 'utf8');

const wishRenderCode = `
  function initWishlistPage() {
    const grid = document.getElementById('wishlist-grid');
    const empty = document.getElementById('wishlist-empty');
    if (!grid) return;

    function render() {
      const items = getWishlist();
      grid.innerHTML = '';
      
      if (items.length === 0) {
        grid.hidden = true;
        if (empty) empty.hidden = false;
        return;
      }
      
      grid.hidden = false;
      if (empty) empty.hidden = true;

      items.forEach(item => {
        const card = document.createElement('article');
        card.className = 'card card_wishlist';
        
        card.innerHTML = \`<a href='\${item.id === 'Товар' ? '#' : item.id + '.html'}' class='card__link'><div class='card__image-wrap'><img src='\${item.image || 'images/card-door-1.svg'}' alt='\${item.title}' class='card__image' loading='lazy'><div class='card__badges'><span class='card__badge card__badge_hit'>Хит</span></div></div><div class='card__info'><h3 class='card__title'>\${item.title}</h3><div class='card__price-row'><span class='card__price'>\${new Intl.NumberFormat('ru-RU').format(item.price)} ₽</span></div></div></a><button class='card__fav is-active' aria-label='Убрать из избранного' onclick='window.removeWishlistItem("\${item.id}")'></button>\`;
        
        card.style.position = 'relative';
        const fav = card.querySelector('.card__fav');
        if (fav) {
           fav.style.position = 'absolute';
           fav.style.top = '12px';
           fav.style.right = '12px';
           fav.style.backgroundColor = 'var(--color-primary, #e21836)';
           fav.style.borderColor = 'var(--color-primary, #e21836)';
        }

        grid.appendChild(card);
      });
    }

    window.removeWishlistItem = (id) => {
      const items = getWishlist();
      const newItems = items.filter(x => x.id !== id);
      setWishlist(newItems);
      render();
      if (typeof updateWishlistBadge === 'function') updateWishlistBadge();
    };

    render();
  }

  initWishlistPage();
`;

if (!shopJs.includes('initWishlistPage')) {
  shopJs = shopJs.replace('  initCartPage();', '  initCartPage();\n' + wishRenderCode);
  fs.writeFileSync('js/shop.js', shopJs);
}
