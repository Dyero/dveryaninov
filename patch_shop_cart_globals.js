const fs = require('fs');

const path = '/workspaces/dveryaninov/js/shop.js';
let js = fs.readFileSync(path, 'utf8');

// replace getCart() inside my injected block with the actual localStorage call
js = js.replace(/getCart\(\)/g, `JSON.parse(localStorage.getItem("dveryaninov_cart_v1") || "[]")`);
js = js.replace(/setCart\((.*?)\)/g, `localStorage.setItem("dveryaninov_cart_v1", JSON.stringify($1))`);

fs.writeFileSync(path, js);
console.log("shop.js cart globals fixed");
