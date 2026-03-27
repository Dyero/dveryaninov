const fs = require('fs');

cssToAppend = `
/* ==================== Index Page Layout Redesign ==================== */

/* 1. Hero Block */
.hero-new {
  position: relative;
  width: 100%;
  height: clamp(500px, 80vh, 800px);
  display: flex;
  align-items: center;
  padding: 0 clamp(16px, 4vw, 40px);
}

.hero-new__bg {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: url('../images/card-door-1.svg') center/cover no-repeat;
  z-index: -1;
}
.hero-new__bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%);
}

.hero-new__content {
  max-width: 800px;
  color: #fff;
  z-index: 1;
}

.hero-new__subtitle {
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 16px;
  opacity: 0.9;
}

.hero-new__title {
  font-family: var(--font-heading);
  font-size: clamp(32px, 5vw, 64px);
  line-height: 1.1;
  font-weight: 500;
  margin-bottom: 40px;
}

/* 2. Promo Blocks (Амфора и Примерка) */
.promo {
  display: flex;
  flex-direction: column;
  width: 100%;
}

@media (min-width: 768px) {
  .promo {
    flex-direction: row;
    min-height: 600px;
  }
}

.promo_mirrored {
  flex-direction: column-reverse;
}

@media (min-width: 768px) {
  .promo_mirrored {
    flex-direction: row;
  }
}

.promo__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(40px, 6vw, 80px) clamp(20px, 4vw, 60px);
}

@media (min-width: 768px) {
  .promo__content {
    flex: 0 0 50%;
  }
}

.promo__content_beige { background: #F7F5F0; color: #333; }
.promo__content_pink { background: #FDF6F7; color: #333; }

.promo__title {
  font-family: var(--font-heading);
  font-size: clamp(28px, 4vw, 42px);
  margin-bottom: 24px;
}

.promo__text {
  font-size: clamp(16px, 2vw, 18px);
  line-height: 1.5;
  margin-bottom: 40px;
  max-width: 480px;
}

.promo__btn { align-self: flex-start; }

.promo__image-wrap {
  flex: 1;
  height: 400px;
  overflow: hidden;
}

@media (min-width: 768px) {
  .promo__image-wrap {
    height: auto;
    flex: 0 0 50%;
  }
}

.promo__image {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
}

/* 5. Информационный блок / Блог */
.blog {
  background: #F4EFF2;
  padding: clamp(60px, 8vw, 120px) 0;
  overflow: hidden;
}

.blog__container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 clamp(16px, 3vw, 40px);
}

.blog__header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
  gap: 20px;
}

.blog__title {
  font-family: var(--font-heading);
  font-size: clamp(28px, 4vw, 40px);
  max-width: 500px;
}

.blog__tabs {
  display: flex;
  gap: 24px;
}

.blog__tab {
  font-size: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding-bottom: 8px;
  border-bottom: 2px solid transparent;
  color: #666;
}

.blog__tab.is-active, .blog__tab:hover {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.blog__slider-wrap {
  position: relative;
}

.blog__carousel {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 20px;
  /* hide scrollbar */
  scrollbar-width: none;
}
.blog__carousel::-webkit-scrollbar { display: none; }

.blog-card {
  flex: 0 0 80%;
  max-width: 400px;
  scroll-snap-align: start;
}

@media (min-width: 768px) {
  .blog-card { flex: 0 0 30%; }
}

.blog-card__img-wrap {
  aspect-ratio: 16/9;
  overflow: hidden;
  margin-bottom: 16px;
  background: #EAEAEA;
}

.blog-card__img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.blog-card:hover .blog-card__img { transform: scale(1.05); }

.blog-card__meta {
  font-size: 12px;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 8px;
}

.blog-card__title {
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog__nav-btn {
  position: absolute;
  top: 40%;
  right: -20px;
  width: 48px; height: 48px;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: none;
}
@media (min-width: 1024px) { .blog__nav-btn { display: flex; align-items: center; justify-content: center; } }


/* 7. Лид-форма / Консультация */
.lead { margin-bottom: 60px; }

.lead__panorama {
  width: 100%;
  height: clamp(200px, 30vw, 300px);
  background: url('../images/card-door-2.svg') center/cover;
}

.lead__container {
  max-width: 1000px;
  margin: -60px auto 0;
  background: #fff;
  padding: clamp(40px, 6vw, 80px) clamp(20px, 4vw, 60px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.05);
  position: relative;
  text-align: center;
}

.lead__title {
  font-family: var(--font-heading);
  font-size: clamp(24px, 4vw, 36px);
  margin-bottom: 16px;
}

.lead__subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 40px;
}

.lead__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

@media (min-width: 768px) {
  .lead__form {
    flex-direction: row;
  }
}

.lead__input {
  flex: 1;
  padding: 16px 20px;
  border: 1px solid var(--color-border);
  font-family: var(--font-main);
  font-size: 16px;
  outline: none;
}
.lead__input:focus { border-color: var(--color-primary); }

.lead__submit {
  padding: 16px 32px;
  white-space: nowrap;
}

.lead__policy {
  font-size: 12px;
  color: #888;
}
.lead__policy a {
  color: var(--color-primary);
  text-decoration: underline;
}

`;

fs.appendFileSync('/workspaces/dveryaninov/css/main.css', cssToAppend);
console.log('CSS appended!');
