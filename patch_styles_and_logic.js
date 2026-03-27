const fs = require('fs');

/* ----- CSS FIXES ----- */
const cssFile = '/workspaces/dveryaninov/css/main.css';
let css = fs.readFileSync(cssFile, 'utf8');

if (!css.includes('/* Button reset & styles */')) {
  const btnStyles = `
/* Button reset & styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  text-decoration: none;
  text-align: center;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  padding: 14px 24px;
  transition: all 0.2s ease;
  background: none;
}
.btn_primary {
  background: var(--color-wine, #611025);
  color: #fff;
  border-color: var(--color-wine, #611025);
}
.btn_primary:hover {
  background: #4a0c1a;
  border-color: #4a0c1a;
}
.btn_secondary {
  background: #fff;
  color: var(--color-wine, #611025);
  border-color: #ccc;
}
.btn_secondary:hover {
  border-color: var(--color-wine, #611025);
  background: #fcfcfc;
}
.btn_outline {
  background: transparent;
  color: var(--color-text);
  border-color: currentColor;
}
.btn_outline:hover {
  opacity: 0.7;
}
.btn_lg {
  padding: 18px 32px;
  font-size: 16px;
}
.btn_text {
  padding: 0;
  color: var(--color-wine, #611025);
  border: none;
  background: none;
}

/* Margins between blocks */
.section, .pdp-details, .pdp-reviews, .pdp-main, .cart, .cart-page, .account-page {
  margin-bottom: clamp(80px, 10vw, 130px);
}
`;
  css = btnStyles + css;
  fs.writeFileSync(cssFile, css);
}

/* ----- PDP JS FIX ----- */
const pdpJsFile = '/workspaces/dveryaninov/js/pdp.js';
let pdpJs = fs.readFileSync(pdpJsFile, 'utf8');
pdpJs = pdpJs.replace('.btn-config', '#btn-configure-desktop');
fs.writeFileSync(pdpJsFile, pdpJs);

console.log("Styles and pdp js patched");
