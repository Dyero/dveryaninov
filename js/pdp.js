document.addEventListener('DOMContentLoaded', () => {
  /* ================== Gallery Data & Sync ================== */
  const galleryData = {
    "beige": [
      "images/card-door-1.svg",
      "images/card-door-2.svg",
      "images/card-door-3.svg"
    ],
    "grey_light": [
      "images/card-door-2.svg",
      "images/card-door-4.svg"
    ],
    "graphite": [
      "images/card-door-3.svg",
      "images/card-door-1.svg",
      "images/card-door-4.svg"
    ]
  };

  const colorInputs = document.querySelectorAll('input[name="pdp_color"]');
  const sizeInputs = document.querySelectorAll('input[name="pdp_size"]');
  const mainImg = document.getElementById('pdp-main-image');
  const colorNameLabel = document.getElementById('pdp-color-name');
  const thumbsContainer = document.querySelector('.pdp-gallery__thumbs');
  const priceVal = document.getElementById('pdp-price-val');
  
  const basePrice = 52000;

  // Deep Linking processing
  const urlParams = new URLSearchParams(window.location.search);
  const URLcolor = urlParams.get('color');
  if (URLcolor && galleryData[URLcolor]) {
    const input = document.querySelector(\`input[name="pdp_color"][value="\${URLcolor}"]\`);
    if(input) input.checked = true;
  }

  // Preloading images function
  const preloadImages = (urls) => {
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
  };

  function renderGallery(color) {
    const urls = galleryData[color] || galleryData['beige'];
    
    // Crossfade main image
    mainImg.style.opacity = 0;
    setTimeout(() => {
      mainImg.src = urls[0];
      mainImg.style.opacity = 1;
    }, 200);

    // Render thumbs
    thumbsContainer.innerHTML = urls.map((url, i) => \`
      <button class="pdp-gallery__thumb \${i === 0 ? 'is-active' : ''}" data-src="\${url}">
        <img src="\${url}" alt="">
      </button>
    \`).join('');

    // Rebind thumbs
    document.querySelectorAll('.pdp-gallery__thumb').forEach(thumb => {
      thumb.addEventListener('click', function(e) {
        e.preventDefault();
        const src = this.getAttribute('data-src');
        if (src === mainImg.src) return;

        mainImg.style.opacity = 0;
        setTimeout(() => {
          mainImg.src = src;
          mainImg.style.opacity = 1;
        }, 150);

        document.querySelectorAll('.pdp-gallery__thumb').forEach(t => t.classList.remove('is-active'));
        this.classList.add('is-active');
      });
    });
    
    // update label & URL
    const activeLabel = document.querySelector(\`input[name="pdp_color"][value="\${color}"]\`).closest('label').getAttribute('title');
    if (colorNameLabel) colorNameLabel.textContent = activeLabel;
    
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('color', color);
    window.history.replaceState({}, '', newUrl);
  }

  // Initial render
  const initialColor = document.querySelector('input[name="pdp_color"]:checked').value;
  renderGallery(initialColor);

  // Events
  colorInputs.forEach(input => {
    // hover to preload
    input.closest('label').addEventListener('mouseenter', () => {
      if (galleryData[input.value]) preloadImages(galleryData[input.value]);
    });

    // click to switch
    input.addEventListener('change', (e) => {
      document.querySelectorAll('.pdp-color-swatch').forEach(l => l.classList.remove('is-active'));
      e.target.closest('label').classList.add('is-active');
      renderGallery(e.target.value);
    });
  });

  /* Price Recalculation mock */
  sizeInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      let currentPrice = basePrice;
      if(e.target.value === '800x2000') currentPrice += 3000;
      if(e.target.value === 'custom') currentPrice += 15000;
      priceVal.textContent = currentPrice.toLocaleString('ru-RU');
      document.querySelector('.pdp-sticky-cta__price strong').textContent = currentPrice.toLocaleString('ru-RU') + ' ₽';
    });
  });

  /* Setup Mobile Accordions */
  const initMobileAccordions = () => {
    const accs = document.querySelectorAll('.pdp-acc');
    const isMobile = window.innerWidth <= 1024;
    accs.forEach(acc => {
      if (isMobile) {
        acc.removeAttribute('open'); // close by default on mobile
      } else {
        acc.setAttribute('open', ''); // always open on desktop
      }
    });
  };

  window.addEventListener('resize', initMobileAccordions);
  initMobileAccordions();

  /* Desktop and Mobile CTA Configurator Buttons */
  const btnD = document.getElementById('btn-configure-desktop');
  const btnM = document.getElementById('btn-configure-mobile');
  const cfgModal = document.getElementById('dv-config-modal');

  const openCfg = (e) => {
    e.preventDefault();
    cfgModal.setAttribute('aria-hidden', 'false');
    // Lock body scroll
    document.body.style.overflow = 'hidden';
  };
  
  if (btnD) btnD.addEventListener('click', openCfg);
  if (btnM) btnM.addEventListener('click', openCfg);

});

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
