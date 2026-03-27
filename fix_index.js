const fs = require('fs');

// Fix 1: Remove the hardcoded account link from header.html
let header = fs.readFileSync('/workspaces/dveryaninov/header.html', 'utf8');
header = header.replace(/<a href="account\.html"[^>]*>[\s\S]*?<\/a>\s*<a href="cart\.html"/, '<a href="cart.html"');
fs.writeFileSync('/workspaces/dveryaninov/header.html', header);

console.log("Fixed header.html");
