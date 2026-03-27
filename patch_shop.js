const fs = require('fs');
let js = fs.readFileSync('/workspaces/dveryaninov/js/shop.js', 'utf8');

const newClickLogic = `
      // Выбор карточки (Radio)
      const cfgItemToSelect = target.closest(".cfg-item");
      if (cfgItemToSelect && !target.closest('.cfg-qty-btn') && !target.closest('.cfg-qty-input')) {
         const list = cfgItemToSelect.closest('.config-detail-options');
         if (list) {
            list.querySelectorAll('.cfg-item').forEach(item => {
               item.classList.remove('cfg-item_active');
               const inp = item.querySelector('.cfg-qty-input');
               if (inp) inp.value = 0;
            });
            cfgItemToSelect.classList.add('cfg-item_active');
            const inp = cfgItemToSelect.querySelector('.cfg-qty-input');
            if (inp) inp.value = 1;
            
            // update header text
            const title = cfgItemToSelect.querySelector('.config-item__title')?.textContent;
            const headerVal = list.parentElement.querySelector('.config-detail-value');
            if (headerVal && title) headerVal.textContent = title;
            updateConfigTotal();
         }
         return;
      }
      
      // Кнопки изменения количества
`;

js = js.replace('// Кнопки изменения количества (cfg-item и config-item)', newClickLogic);
fs.writeFileSync('/workspaces/dveryaninov/js/shop.js', js);
