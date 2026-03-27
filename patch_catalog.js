const fs = require('fs');

// Patch 1: Updated card styles and Bento categories
let css = fs.readFileSync('/workspaces/dveryaninov/css/main.css', 'utf8');

const newCardCss = `
/* --- New Minimalist Card Anatomy --- */
.card {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  transition: all 0.3s ease;
  min-width: 0;
}

.card__image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4; /* ~ 75-80% height ratio */
  background: var(--color-bg-card, #F7F7F7);
  overflow: hidden;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card__image {
  width: auto;
  height: 90%;
  object-fit: contain;
  transition: transform 0.4s ease;
}

.card:hover .card__image {
  transform: scale(1.05); /* Hover effect: scale image */
}

/* Text badge top-left */
.card__badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--color-white);
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  z-index: 2;
}

/* Fav icon top-right */
.card__fav {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 24px;
  height: 24px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333' stroke-width='1.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.228 9 12 9 12s9-4.772 9-12z' /%3E%3C/svg%3E") no-repeat center;
  background-size: contain;
  border: none;
  cursor: pointer;
  z-index: 2;
  transition: transform 0.2s;
}

.card__fav:hover {
  transform: scale(1.1);
}

.card__fav.is-active {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23611025'%3E%3Cpath d='M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z' /%3E%3C/svg%3E") no-repeat center;
}

.card__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card__title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text);
  line-height: 1.3;
}

.card__title a {
  color: inherit;
  text-decoration: none;
}

.card__price {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.card__price-prefix {
  font-size: 12px;
  font-weight: 400;
  color: var(--color-text-light);
}

/* --- Bento Grid Categories --- */
.bento-categories {
  margin-bottom: clamp(40px, 6vw, 80px);
}

.bento-categories__head {
  margin-bottom: clamp(20px, 3vw, 40px);
}

.bento-categories__title {
  font-size: clamp(24px, 3vw, 36px);
  margin: 0;
}

.bento-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 250px;
}

/* For mobile, stack perfectly */
@media (max-width: 768px) {
  .bento-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: 200px;
  }
}

.bento-card {
  position: relative;
  display: block;
  overflow: hidden;
  background: #EAEAEA;
  text-decoration: none;
}

@media (min-width: 769px) {
  .bento-card_large { grid-column: span 2; grid-row: span 2; }
  .bento-card_wide  { grid-column: span 2; grid-row: span 1; }
  .bento-card_tall  { grid-column: span 1; grid-row: span 2; }
  .bento-card_box   { grid-column: span 1; grid-row: span 1; }
}

.bento-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.bento-card:hover .bento-card__img {
  transform: scale(1.05); /* Zoom on hover */
}

/* Overlay gradient for text readability if needed */
.bento-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 40%);
  pointer-events: none;
}

.bento-card__content {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bento-card__title {
  color: #FFF;
  font-size: 20px;
  margin: 0;
  font-weight: 500;
}

.bento-card__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(4px);
  color: #FFF;
  transition: background 0.3s;
}

.bento-card:hover .bento-card__arrow {
  background: rgba(255,255,255,0.4);
}
`;

// Regex replacing old Card css completely
css = css.replace(/\/\* Card \*\/[\s\S]*?\.card__action \{[\s\S]*?\}/, newCardCss);
fs.writeFileSync('/workspaces/dveryaninov/css/main.css', css);

