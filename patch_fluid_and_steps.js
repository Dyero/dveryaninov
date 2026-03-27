const fs = require('fs');
const { JSDOM } = require('jsdom');

async function run() {
  const cssPath = '/workspaces/dveryaninov/css/main.css';
  let css = fs.readFileSync(cssPath, 'utf8');

  // Adjust fluid responsiveness
  css += `
/* Fluid responsiveness fixes */
html {
  font-size: clamp(14px, 1.2vw, 16px);
}
body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
}
.container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 clamp(16px, 3vw, 40px);
}
@media (max-width: 768px) {
  .pdp-sticky-cta {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: clamp(12px, 2vw, 20px) clamp(16px, 4vw, 24px);
    box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
    z-index: 99;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
`;

  fs.writeFileSync(cssPath, css);
  console.log("CSS Patched: Responivness");

  // Read old modal HTML
  const oldHtml = fs.readFileSync('/workspaces/dveryaninov/product-sol-2-pg.html', 'utf8');
  const domOld = new JSDOM(oldHtml);
  const oldModal = domOld.window.document.getElementById('configModal');

  // Read current PDP
  const newHtmlPath = '/workspaces/dveryaninov/product.html';
  let newHtml = fs.readFileSync(newHtmlPath, 'utf8');
  const domNew = new JSDOM(newHtml);
  const docNew = domNew.window.document;

  // Swap out the existing modal with the old modal but keep the id "dv-config-modal" and adapt classes
  const existingModal = docNew.getElementById('dv-config-modal');
  if (existingModal && oldModal) {
    oldModal.id = "dv-config-modal";
    oldModal.classList.add("modal", "pdp-sheet");

    existingModal.replaceWith(oldModal);
    
    fs.writeFileSync(newHtmlPath, domNew.serialize());
    console.log("Modal merged into product.html");
  } else {
    console.log("Modal merge failed. Either existing dv-config-modal or old configModal not found.");
  }
}
run();
