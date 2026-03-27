const fs = require('fs');
const cssPath = '/workspaces/dveryaninov/css/main.css';
let css = fs.readFileSync(cssPath, 'utf8');

if (!css.includes('.section__cards::-webkit-scrollbar')) {
    css += `

/* --- Mobile Swipe Carousels for Card Shelves --- */
@media (max-width: 768px) {
  .section__cards {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    gap: 12px;
    padding-bottom: 20px; /* space for scroll if visible */
    /* Ensure cards partially show next item */
    padding-left: 16px;
    padding-right: 16px;
    margin-left: -16px;
    margin-right: -16px;
  }
  
  .section__cards::-webkit-scrollbar {
    display: none;
  }
  
  .section__cards {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .section__cards > .card {
    scroll-snap-align: start;
    min-width: 240px; /* Example swipe width */
    flex: 0 0 auto;
  }
}
`;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('Mobile swipe layout added');
} else {
    console.log('Scroll layout exists');
}
