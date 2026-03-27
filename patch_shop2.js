const fs = require('fs');
let js = fs.readFileSync('/workspaces/dveryaninov/js/shop.js', 'utf8');

const newQtyLogic = `
        if (input) {
          const curr = Number(input.value) || 0;
          const isDecrease = qtyBtn.hasAttribute("data-qty-decrease");
          input.value = isDecrease ? Math.max(0, curr - 1) : curr + 1;
          
          const cfgItem = qtyBtn.closest(".cfg-item");
          if (cfgItem) {
             const list = cfgItem.closest('.config-detail-options');
             if (list && input.value > 0) {
                 list.querySelectorAll('.cfg-item').forEach(item => {
                    if (item !== cfgItem) {
                       item.classList.remove('cfg-item_active');
                       const tempInp = item.querySelector('.cfg-qty-input');
                       if (tempInp) tempInp.value = 0;
                    }
                 });
                 cfgItem.classList.add('cfg-item_active');
                 const title = cfgItem.querySelector('.config-item__title')?.textContent;
                 const headerVal = list.parentElement.querySelector('.config-detail-value');
                 if (headerVal && title) headerVal.textContent = title;
             }
             updateConfigTotal();
          }
`;

js = js.replace(/if \(input\) \{\s*const curr = Number\(input.value\) \|\| 0;\s*input.value = qtyBtn.hasAttribute\("data-qty-decrease"\)\s*\?\s*Math.max\(0, curr - 1\)\s*:\s*curr \+ 1;\s*\/\/ пересчёт суммы для cfg-item или config-item\s*const cfgItem = qtyBtn.closest\("\.cfg-item"\);\s*const configItem = qtyBtn.closest\("\.config-item"\);\s*if \(cfgItem\) updateConfigTotal\(\);\s*else if \(configItem\) updateItemTotal\(configItem\);\s*\}/s, newQtyLogic + '\n          const configItem = qtyBtn.closest(".config-item");\n          if (configItem) updateItemTotal(configItem);\n        }');

fs.writeFileSync('/workspaces/dveryaninov/js/shop.js', js);
