const fs = require('fs');

const path = '/workspaces/dveryaninov/js/pdp.js';
let js = fs.readFileSync(path, 'utf8');

// Patching pdp.js to open modal from mobile CTA and from desktop button
const inject = `
document.addEventListener("DOMContentLoaded", () => {
  const btnDt = document.querySelector(".btn-config");
  const btnMb = document.getElementById("btn-configure-mobile");
  const modal = document.getElementById("dv-config-modal");
  
  function openModal() {
    if (modal) {
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  }
  
  function closeModal() {
    if (modal) {
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  if (btnDt) btnDt.addEventListener("click", openModal);
  if (btnMb) btnMb.addEventListener("click", openModal);
  
  if (modal) {
    modal.querySelectorAll("[data-modal-close]").forEach(el => {
      el.addEventListener("click", closeModal);
    });
  }
});
`;

fs.writeFileSync(path, js + inject);
console.log("Injected modal opening logic in pdp.js");
