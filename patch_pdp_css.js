const fs = require('fs');

const cssToAdd = `
/* ==================== PDP Layout Redesign ==================== */

.product-wrap {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 clamp(16px, 3vw, 40px);
}

/* Breadcrumbs */
.pdp-breadcrumbs {
  padding: 16px 0;
  font-size: 14px;
  color: #888;
}

.pdp-breadcrumbs__link {
  color: #888;
  text-decoration: none;
}
.pdp-breadcrumbs__link:hover { color: var(--color-primary); }

.pdp-breadcrumbs__sep {
  margin: 0 8px;
  color: #ccc;
}

.pdp-breadcrumbs__current {
  color: #333;
}

.pdp-breadcrumbs__link_mobile-back {
  display: none;
  font-weight: 500;
  color: #333;
}

@media (max-width: 768px) {
  .pdp-breadcrumbs__desktop { display: none; }
  .pdp-breadcrumbs__link_mobile-back { display: inline-flex; align-items: center; }
  .pdp-breadcrumbs__link_mobile-back::before {
    content: "<";
    margin-right: 8px;
  }
}

/* Main Layout */
.pdp-main {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-bottom: 60px;
}

@media (min-width: 1024px) {
  .pdp-main {
    grid-template-columns: 1.2fr 1fr;
    gap: 80px;
  }
}

/* Gallery */
.pdp-gallery {
  display: flex;
  gap: 20px;
  position: relative;
}

.pdp-gallery__badges {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.badge {
  background: var(--color-primary);
  color: #fff;
  padding: 4px 12px;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .pdp-gallery { flex-direction: column-reverse; }
}

.pdp-gallery__thumbs {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 80px;
}

@media (max-width: 1024px) {
  .pdp-gallery__thumbs { display: none; } /* Hide thumbs on mobile */
}

.pdp-gallery__thumb {
  width: 100%;
  aspect-ratio: 3/4;
  border: 1px solid transparent;
  padding: 0;
  cursor: pointer;
  position: relative;
  background: #f5f5f5;
  transition: opacity 0.3s ease;
}

.pdp-gallery__thumb img {
  width: 100%; height: 100%; object-fit: cover;
}

.pdp-gallery__thumb.is-active {
  border-color: var(--color-primary);
}

.pdp-gallery__thumb_video::after {
  content: "";
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 24px; height: 24px;
  background: rgba(0,0,0,0.6) url('../images/icon-play.svg') center/12px no-repeat;
  border-radius: 50%;
}

.pdp-gallery__main-wrap {
  flex: 1;
  position: relative;
  background: #f7f7f7;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pdp-gallery__main-fig {
  width: 100%;
  margin: 0;
  aspect-ratio: 3/4;
}

.pdp-gallery__main-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.pdp-gallery__nav {
  position: absolute;
  top: 50%; transform: translateY(-50%);
  width: 40px; height: 40px;
  background: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: none;
}

@media (min-width: 1024px) { .pdp-gallery__nav { display: block; } }

.pdp-gallery__nav_prev { left: 20px; }
.pdp-gallery__nav_next { right: 20px; }

/* Mobile dots */
.pdp-gallery__dots {
  display: none;
}
@media (max-width: 1024px) {
  .pdp-gallery__dots {
    display: flex;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    gap: 8px;
  }
  .pdp-gallery__dot {
    width: 8px; height: 8px;
    background: rgba(0,0,0,0.2);
    border-radius: 50%;
  }
  .pdp-gallery__dot.is-active { background: var(--color-primary); }
  
  .pdp-gallery__mobile-count {
    position: absolute;
    top: 20px; right: 20px;
    background: rgba(255,255,255,0.8);
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }
}
@media (min-width: 1025px) { .pdp-gallery__mobile-count { display: none; } }

/* Info Column */
.pdp-info {
  display: flex;
  flex-direction: column;
}

.pdp-info__title {
  font-family: var(--font-heading);
  font-size: clamp(28px, 4vw, 40px);
  margin-bottom: 12px;
  line-height: 1.1;
}

.pdp-info__meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.status_instock {
  color: #2F8A43;
  font-weight: 500;
  font-size: 14px;
}

.pdp-info__rating {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-size: 14px;
  color: #888;
}

.stars { color: #f4c150; }

.pdp-info__price {
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 600;
  margin-bottom: 32px;
}

.pdp-fieldset {
  border: none;
  margin: 0 0 32px 0;
  padding: 0;
}

.pdp-fieldset__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.pdp-fieldset__legend {
  font-weight: 600;
  font-size: 16px;
}

.pdp-fieldset__hint {
  font-size: 14px;
  color: #888;
  text-decoration: underline;
}

/* Horizontal scroll for chips/colors on mobile */
.pdp-options-scroll {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .pdp-options-scroll {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 12px;
    scrollbar-width: none;
  }
}

.pdp-chip {
  cursor: pointer;
  user-select: none;
}
.pdp-chip input { display: none; }

.pdp-chip__label {
  display: inline-block;
  padding: 12px 20px;
  border: 1px solid #ddd;
  background: #fff;
  transition: all 0.2s;
  white-space: nowrap;
}

.pdp-chip input:checked + .pdp-chip__label {
  border-color: var(--color-primary);
  background: #fafafa;
  font-weight: 500;
}

/* Colors Grid */
.pdp-colors {
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
}
@media (min-width: 768px) { .pdp-colors { flex-wrap: wrap; } }

.pdp-color-swatch {
  cursor: pointer;
  display: inline-block;
}
.pdp-color-swatch input { display: none; }

.swatch-fill {
  display: inline-block;
  width: 48px; height: 48px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: transform 0.2s;
}

.pdp-color-swatch input:checked + .swatch-fill {
  border-color: var(--color-primary);
  transform: scale(1.1);
  box-shadow: 0 0 0 2px #fff inset;
}

.pdp-color-more {
  width: 48px; height: 48px;
  border-radius: 50%;
  border: 1px solid #ccc;
  background: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
}

/* Desktop Actions */
.pdp-actions_desktop {
  display: flex;
  gap: 16px;
}

.pdp-actions__btn {
  flex: 1;
}

.pdp-actions__fav {
  width: 56px; height: 56px;
  font-size: 24px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
}

@media (max-width: 768px) {
  .pdp-actions_desktop { display: none; }
}

/* Details Accordion */
.pdp-details {
  margin-top: 40px;
  border-top: 1px solid #eee;
}

.pdp-acc {
  border-bottom: 1px solid #eee;
}

.pdp-acc__summary {
  padding: 24px 0;
  cursor: pointer;
  list-style: none; /* remove marker */
  position: relative;
}
.pdp-acc__summary::-webkit-details-marker { display: none; }
.pdp-acc__summary::after {
  content: "+";
  position: absolute;
  right: 0;
  top: 50%; transform: translateY(-50%);
  font-size: 24px;
  color: #666;
}
.pdp-acc[open] .pdp-acc__summary::after { content: "−"; }

@media (min-width: 1024px) {
  .pdp-acc__summary { cursor: default; }
  .pdp-acc__summary::after { display: none; }
}

.pdp-acc__content {
  padding-bottom: 24px;
  line-height: 1.6;
  color: #444;
}

.pdp-specs-list {
  list-style: none; padding: 0; margin: 0;
}
.pdp-specs-list li {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px dashed #eaeaea;
}
.spec-name { color: #888; }
.spec-val { font-weight: 500; text-align: right; max-width: 60%; }

/* Sticky CTA Mobile */
.pdp-sticky-cta {
  display: none;
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background: #fff;
  padding: 16px;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
  z-index: 100;
  align-items: center;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .pdp-sticky-cta { display: flex; }
}

.pdp-sticky-cta__price strong {
  font-size: 20px;
}

/* Reviews UGC */
.pdp-reviews {
  padding: 60px 0;
}
.pdp-reviews__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}
.pdp-reviews__title-wrap { display: flex; align-items: baseline; gap: 12px; }
.pdp-reviews__count { color: #888; font-size: 18px; }

.pdp-reviews__ugc-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 16px;
}
.ugc-photo {
  width: 160px; height: 160px;
  object-fit: cover;
  border-radius: 8px;
}

.review-card {
  border: 1px solid #eee;
  padding: 24px;
  border-radius: 8px;
  margin-top: 32px;
}
.review-card__header { display: flex; justify-content: space-between; margin-bottom: 16px; }

/* Configurator Bottom Sheet Mobile */
@media (max-width: 768px) {
  .pdp-sheet__window {
    align-items: flex-end;
    padding: 0;
  }
  .pdp-sheet__window > .modal__content {
    background: #fff;
    width: 100%;
    height: 90vh; /* Bottom sheet style */
    border-radius: 24px 24px 0 0;
    display: flex;
    flex-direction: column;
  }
  .pdp-sheet__body {
    flex: 1;
    overflow-y: auto;
  }
}
`;

fs.appendFileSync('/workspaces/dveryaninov/css/main.css', cssToAdd);
console.log('PDP CSS appended.');
