const fs = require('fs');

const path = '/workspaces/dveryaninov/js/account.js';
let js = fs.readFileSync(path, 'utf8');

js = js.replace('var orders = auth ? auth.getUserOrders()  : [];', 
`var orders = window.safeJsonParse ? safeJsonParse(localStorage.getItem("dveryaninov_orders_v1"), []) : JSON.parse(localStorage.getItem("dveryaninov_orders_v1") || "[]");`);

fs.writeFileSync(path, js);
console.log("account.js patched to show dveryaninov_orders_v1 from localStorage");
