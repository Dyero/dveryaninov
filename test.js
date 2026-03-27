require('jsdom-global')();
try {
  require('./js/auth.js');
  require('./js/load-components.js');
  require('./js/shop.js');
  console.log("No syntax errors");
} catch(e) {
  console.log("Error:", e);
}
