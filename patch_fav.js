const fs = require('fs');

let js = fs.readFileSync('/workspaces/dveryaninov/js/shop.js', 'utf8');

const favLogic = `
      // Лайк (Избранное)
      const favBtn = target.closest(".card__fav");
      if (favBtn) {
        e.preventDefault();
        favBtn.classList.toggle("is-active");
        return;
      }
`;

// Insert after `document.addEventListener("click", function(e) {`
js = js.replace(/document\.addEventListener\("click", \(e\) => \{/, 'document.addEventListener("click", (e) => {\n' + favLogic);

fs.writeFileSync('/workspaces/dveryaninov/js/shop.js', js);
