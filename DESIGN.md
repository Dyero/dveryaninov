# DESIGN.md — Дверянинов: Фабрика Дверей

> AI agents: read this file before generating any UI for this project.
> This is the single source of truth for all visual decisions on dveryaninov.ru.

---

## 1. Visual Theme & Atmosphere

**Brand essence:** Russian premium door manufacturer. The UI must feel like a high-end interior showroom — curated, calm, confident. Not a marketplace, not a tech startup.

**Design philosophy:**
- Warmth over coldness. Beige, ivory, warm whites — never clinical pure white.
- Restraint over decoration. Door photography carries the visual weight; UI steps back.
- Editorial over e-commerce. Cards feel like magazine spreads, not product listings.
- Single typeface. Manrope is used for everything — headings, body, UI, prices. No serif mixing.
- Trust signals present but never pushy — phone, rating, reviews visible without screaming.

**Mood:** Quiet luxury. A calm Scandinavian-Russian interior with a burgundy accent — like a wax seal on fine stationery.

**Density:** Medium-low. Generous whitespace. Sections breathe. Never cluttered.

---

## 2. Color Palette & Roles

| Token Name               | Hex       | Role                                                              |
|--------------------------|-----------|-------------------------------------------------------------------|
| `--color-bg`             | `#FFFFFF` | Primary page background, right panel of configurator             |
| `--color-bg-warm`        | `#F7F5F2` | Secondary sections, filter panels, alternating sections           |
| `--color-bg-blush`       | `#F0E8EA` | Feature/collection blocks, projects section background            |
| `--color-bg-configurator`| `#EFEDEA` | Left (image) panel of the product configurator                   |
| `--color-text-primary`   | `#1A1A1A` | Body text, headings, accordion values, active stepper label       |
| `--color-text-secondary` | `#6B6B6B` | Accordion property labels, captions, breadcrumbs                  |
| `--color-text-muted`     | `#9E9E9E` | Placeholders, disabled states, timestamps, collection labels      |
| `--color-accent`         | `#8C1F3B` | CTAs, active states, primary buttons, star fill, brand mark       |
| `--color-accent-hover`   | `#6E1630` | Button hover / pressed state                                      |
| `--color-accent-light`   | `#F4E8EC` | Tag backgrounds, soft accent highlights                           |
| `--color-border`         | `#E0DDDA` | Card borders, dividers, accordion rows, input outlines            |
| `--color-border-dark`    | `#BFBAB6` | Focused input, stronger dividers                                  |
| `--color-footer-bg`      | `#1C1C1C` | Footer background                                                 |
| `--color-footer-text`    | `#A09A96` | Footer secondary links                                            |
| `--color-footer-heading` | `#FFFFFF` | Footer column headings                                            |
| `--color-star`           | `#C8102E` | Rating stars (filled)                                             |
| `--color-star-empty`     | `#D9D5D1` | Rating stars (empty)                                              |

**Rules:**
- Never use pure `#000000` — use `--color-text-primary` (`#1A1A1A`).
- Accent `#8C1F3B` only on interactive elements and brand marks — never as decorative fill.
- Section backgrounds alternate: white → warm → blush → white. Never two blush in a row.
- Configurator left panel always uses `--color-bg-configurator`, never white.

---

## 3. Typography Rules

**Single font family — Manrope everywhere:**
```css
--font-base: 'Manrope', 'Helvetica Neue', Arial, sans-serif;
```

Manrope is a geometric sans-serif. Use weight variation — not different fonts — to create hierarchy.

**Type scale:**

| Role                   | Size desktop | Size mobile | Weight | Style    | Line-height | Letter-spacing |
|------------------------|--------------|-------------|--------|----------|-------------|----------------|
| Hero heading (H1)      | 48–56px      | 28–32px     | 700    | normal   | 1.15        | -0.02em        |
| Section heading (H2)   | 32–36px      | 22–24px     | 600    | normal   | 1.25        | -0.01em        |
| Sub-heading (H3)       | 20–24px      | 18–20px     | 600    | normal   | 1.3         | 0              |
| Card product name      | 14–15px      | 13px        | 400    | *italic* | 1.4         | 0              |
| Body text              | 15–16px      | 14–15px     | 400    | normal   | 1.65        | 0              |
| Price «от X р»         | 15–16px      | 14px        | 600    | normal   | 1.2         | 0              |
| Configurator price     | 22–24px      | 20px        | 700    | normal   | 1.2         | -0.01em        |
| Accordion label        | 14px         | 13px        | 400    | normal   | 1.4         | 0              |
| Accordion value        | 14px         | 13px        | 600    | normal   | 1.4         | 0              |
| Button text            | 13–14px      | 13px        | 600    | normal   | 1           | 0.06em         |
| Nav link               | 13–14px      | —           | 400    | normal   | 1           | 0              |
| Utility bar            | 12px         | —           | 400    | normal   | 1           | 0              |
| Collection label/tag   | 11px         | 10px        | 500    | normal   | 1.4         | 0.08em         |
| Caption / timestamp    | 12px         | 11px        | 400    | normal   | 1.4         | 0              |
| Hardware item name     | 14px         | 13px        | 600    | normal   | 1.3         | 0              |
| Hardware item meta     | 12px         | 11px        | 400    | normal   | 1.4         | 0              |

**Rules:**
- Product names in cards are **always italic** — brand signature, never remove.
- Buttons use ALL-CAPS text with letter-spacing 0.06em.
- Collection labels above card names: ALL-CAPS, 11px, `--color-text-muted`, letter-spacing 0.08em.
- In prices: «от» is regular weight (400); the number and «р» are semibold (600).
- Manrope 700 only for hero H1 and configurator large price. Don't overuse bold.

---

## 4. Component Stylings

### Navigation

**Top utility bar:**
- Background: `--color-bg-warm`
- Height: 32px
- Content left: city selector (Чебоксары), address, contacts. Right: Blog + Promo.
- Font: 12px Manrope 400, `--color-text-secondary`

**Main navigation:**
- Background: `#FFFFFF`
- Height: 60–64px
- Left: nav links (Каталог, Услуги, Партнёры). Center: logo. Right: phone + icon group (♡, account, cart, search).
- Logo: custom wordmark «ДВЕРЯНИНОВ» + tagline «ФАБРИКА ДВЕРЕЙ»
- Nav links: 13–14px Manrope 400, hover → `--color-accent`
- Border-bottom: 1px `--color-border`. Sticky on scroll.

**Mobile bottom tab bar:**
- Fixed bottom, `#FFFFFF`, border-top: 1px `--color-border`, height: 56px
- 5 tabs: Главная · Каталог · Корзина · Избранное · Меню
- Icon (line style) + label 10px Manrope 500 below
- Active: `--color-accent`. Inactive: `--color-text-muted`

---

### Buttons

**Primary (filled — burgundy):**
```css
background: var(--color-accent);
color: #FFFFFF;
border: none;
border-radius: 2px;
padding: 13px 24px;
font: 600 13px/1 'Manrope', sans-serif;
letter-spacing: 0.06em;
text-transform: uppercase;
transition: background 0.2s ease;
/* hover: background: var(--color-accent-hover) */
```

**Secondary (outlined):**
```css
background: transparent;
color: var(--color-text-primary);
border: 1px solid var(--color-text-primary);
border-radius: 2px;
padding: 12px 24px;
font: 600 13px/1 'Manrope', sans-serif;
letter-spacing: 0.06em;
text-transform: uppercase;
/* hover: border-color + color → var(--color-accent) */
```
Used for «ДОБАВИТЬ В КОРЗИНУ» — often with cart icon (🛒) prepended.

**Ghost / text link:**
```css
background: transparent;
border: none;
font: 500 13px 'Manrope';
text-decoration: underline;
color: var(--color-text-primary);
```

**«Смотреть все →» link:** right-aligned, 13px Manrope 400, `--color-text-secondary`, hover → `--color-accent`.

---

### Product Card

```
┌─────────────────────┐
│  [BADGE]      ♡     │  ← badge top-left, wishlist top-right
│                     │
│   [door image]      │  ← portrait, 2:3, full-width
│                     │
└─────────────────────┘
  КОЛЛЕКЦИЯ МЕТ А       ← ALL-CAPS, 11px Manrope 500, muted, ls 0.08em
  Дверь Альберта 1 5/Г  ← italic 14px Manrope 400
  от 58 600 р           ← «от» weight 400, number weight 600
```

- No default shadow. Hover: `box-shadow: 0 2px 12px rgba(0,0,0,0.08)` + `transform: translateY(-2px)`
- Border-radius: 0. Wishlist heart: outlined → filled accent when active.
- Badge: `background: --color-accent`, white text, 10px Manrope 600, ALL-CAPS, padding 3px 6px.

---

### Category Grid (Catalog landing)

- Large lifestyle photographs (16:9 or freeform)
- Label below image: Manrope 500 16–18px + ↗ in `--color-accent`
- Hover: `filter: brightness(1.04)`, 0.2s transition
- 2-column grid, some cells full-width. Gap: 16–24px.

---

### Hero Section

- Full-width or 50/50 split (image right, text left)
- H1: Manrope 700, white or `--color-text-primary`
- Sub-heading: Manrope 400 15–16px, muted
- CTA: Primary button. Min-height 500px desktop, 320px mobile.
- No gradient overlays — position text on naturally dark image areas.

---

### Feature / Collection Block

- Left: heading (Manrope 600) + body text (400) + CTA
- Right: large lifestyle photograph
- Label above heading: ALL-CAPS 11px `--color-accent` («НОВАЯ КОЛЛЕКЦИЯ»)
- Background: `--color-bg-warm` or `--color-bg-blush`. Padding: 64px vertical.

---

### Product Configurator (3-step overlay)

Full-screen overlay for purchase configuration.

**Split layout:**
```
┌──────────────────────────┬─────────────────────────────────┐
│                          │  [Stepper 1 — 2 — 3]           │
│   Product preview image  │  [Accordion option rows]        │
│   centered on warm bg    │                                 │
│                          │  [Price]                        │
│   bg: #EFEDEA            │  [Button row]                   │
└──────────────────────────┴─────────────────────────────────┘
```
- Left 55%: `background: #EFEDEA`, product image centered, no shadow on image
- Right 45%: `background: #FFFFFF`, padding 40–48px, scrollable content
- «Закрыть ✕» top-right: 13px Manrope 400, `--color-text-secondary`

**3-Step Stepper:**
- Circle: 28px, border: 1.5px solid `--color-border`, border-radius: 50%
- Active circle: border-color `--color-text-primary`, number Manrope 600 13px
- Inactive: `--color-text-muted`
- Step label: active Manrope 600 14px `--color-text-primary`; inactive 400 `--color-text-muted`
- Connector: 40–60px horizontal line, 1px `--color-border`
- Steps: «1 Конфигурация двери» — «2 Погонаж» — «3 Фурнитура»

**Accordion option rows:**
```css
.accordion-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
}
.accordion-label { font: 400 14px/1.4 'Manrope'; color: var(--color-text-secondary); }
.accordion-value { font: 600 14px/1.4 'Manrope'; color: var(--color-text-primary); margin-left: 8px; }
.accordion-icon  { font-size: 18px; color: var(--color-text-secondary); margin-left: auto; padding-left: 16px; }
```
- Some rows have inline sub-options: «Без порога · Автоматический порог · С порогом»
  - Active sub-option: Manrope 600, primary. Inactive: Manrope 400, muted.
- Some rows show two data columns (e.g. «Наличник: Телескоп+» + «Комментарий: ...»)

**Hardware (Фурнитура) item rows:**
```
┌──────┬──────────────────────────────────────────┐
│ img  │ Ручка Название          [−] 1 [+]        │
│ 60px │ Размер: 2500×50×100мм   1200 р   55 799р │
└──────┴──────────────────────────────────────────┘
```
- Image: 60×60px, border-radius 2px, border: 1px `--color-border`
- Name: Manrope 600 14px. Meta: Manrope 400 12px `--color-text-secondary`
- Quantity stepper: [−] 1 [+] inline, border: 1px `--color-border`, border-radius 2px
- Unit price + total price, Manrope 600 14px. «Цена по запросу»: italic muted.

**Configurator price + buttons (sticky bottom of right panel):**
```
Цена:  от 52 000 р
[ДОБАВИТЬ В КОРЗИНУ]    [ВЫБРАТЬ ПОГОНАЖ →]
```
- «Цена:» Manrope 400 16px muted. «от 52 000 р» Manrope 700 22–24px primary.
- Left button: outlined secondary. Right button: filled primary. Equal or 40/60 width split.

---

### Color / Size Selectors (Product page)

**Color swatches:**
```css
.swatch { width: 28px; height: 28px; border-radius: 2px; border: 1px solid var(--color-border); }
.swatch.active { box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--color-accent); }
```
Label «Покрытие» above: 12px Manrope 400 muted. «+3 Свой цвет» link in `--color-accent`.

**Size buttons:**
```css
.size-btn { padding: 8px 14px; border: 1px solid var(--color-border); border-radius: 2px; font: 400 13px 'Manrope'; }
.size-btn.active { border-color: var(--color-accent); background: var(--color-accent); color: #fff; }
```
Options: 2000×600, 2000×700, 2000×800, 2000×900, «Свой размер», «Нужен замер»

---

### Characteristics Table

```css
.char-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--color-border); }
.char-label { color: var(--color-text-secondary); font-weight: 400; }
.char-value { color: var(--color-text-primary); font-weight: 500; }
/* font: 14px Manrope throughout, no zebra striping */
```

---

### Reviews Section

- Tabs: «О модели X» | «О коллекции Y» — underline tab style
- Rating stars: `--color-star` filled, `--color-star-empty` empty
- «Написать отзыв»: outlined primary, right-aligned
- Customer photos: 60×60px, border-radius 4px
- Reviewer: Manrope 600 14px. Date: Manrope 400 12px muted, right-aligned.
- Review body: Manrope 400 14px secondary, 1.65 line-height
- «Читать полностью»: `--color-accent` text link. «Показать все отзывы ↓»: ghost button centered.

---

### Contact / Lead Form

```
[Ваше имя*]   [Ваш телефон]   [ОТПРАВИТЬ →]
```
- Input: border 1px `--color-border`, border-radius 2px, padding 13px 16px, Manrope 400 14px
- Focus: `border-color: --color-border-dark`. Submit: Primary button, same height.
- Privacy: 11px Manrope 400 muted below. Mobile: stacked single column.

---

### Breadcrumbs

- Font: 12px Manrope 400, `--color-text-muted`. Separator: ` – `. Current page: primary, not linked.

---

### Quantity Stepper

```css
.stepper { display: flex; align-items: center; border: 1px solid var(--color-border); border-radius: 2px; }
.stepper button { width: 32px; height: 32px; background: none; border: none; font: 600 16px 'Manrope'; }
.stepper-value { width: 32px; text-align: center; font: 600 14px 'Manrope'; }
```

---

## 5. Layout Principles

**Container:** max-width 1320px, centered, 24px side padding.

**Grids:**
- Desktop: 12-col, 24px gutter
- Tablet: 8-col, 16px gutter
- Mobile: 4-col, 16px side padding
- Product grids: 4 col desktop → 3 tablet → **always 2 on mobile** (never 1)

**Spacing scale (8px base):**
```
4px  — icon-to-text micro gap
8px  — swatch gap, badge padding
12px — char table row padding
16px — card padding, input padding, accordion row (mobile)
24px — card grid gap, gutter
32px — heading margin, component separation
40px — configurator panel padding
48px — section padding top/bottom
64px — section-to-section gap (desktop)
96px — hero and major feature block padding
```

---

## 6. Depth & Elevation

| Level | Usage                            | CSS                                      |
|-------|----------------------------------|------------------------------------------|
| 0     | Default cards                    | `none`                                   |
| 1     | Card hover, dropdowns            | `0 2px 12px rgba(0,0,0,0.08)`          |
| 2     | Configurator overlay, sticky nav | `0 4px 24px rgba(0,0,0,0.12)`          |
| 3     | Toast, modal dialog              | `0 8px 32px rgba(0,0,0,0.16)`          |

No colorful shadows. No neumorphism. Flat by default.

---

## 7. Do's and Don'ts

### ✅ Do

- Use **Manrope** for every text element — no other typefaces
- Italicize product names in cards — brand signature
- Show doors at large portrait sizes, never crop the door
- Format prices as «от X р» with «от» in regular, number in semibold
- Bottom tab bar on mobile (5 items, fixed)
- Configurator left panel: `#EFEDEA` background
- Accordion rows separated by 1px border lines
- Alternate section backgrounds: white → warm → blush → white

### ❌ Don't

- Don't use any serif font
- Don't use gradients — flat color only
- Don't use border-radius > 4px
- Don't use accent as background for large areas
- Don't show prices without «от»
- Don't show > 4 cards per row
- Don't make footer lighter than `#1C1C1C`
- Don't use transitions > 0.2s ease

---

## 8. Responsive Behavior

**Breakpoints:**
```
xs:  0–575px      mobile portrait
sm:  576–767px    mobile landscape
md:  768–1023px   tablet
lg:  1024–1279px  small desktop
xl:  1280–1439px  desktop
2xl: 1440px+      wide (container caps at 1320px)
```

**Mobile navigation:**
- Single header row: logo center, cart + burger flanking
- Persistent bottom tab bar (5 tabs, fixed, 56px)
- Burger → left slide-in drawer

**Configurator on mobile:**
- Stacked: image top (~200px, collapsed), options below (scrollable)
- Price + buttons: sticky bottom bar

**Product page mobile (390px):**
- Images: full-width swipeable gallery
- Size/color selectors: horizontal scroll rows
- Add-to-cart: sticky bottom bar — price left, button right
- Tabs (О модели / О коллекции): full-width underline tabs
- «Другие модели»: 2-column grid

**Typography scaling:**
```
Hero H1:        56px → 28px
Section H2:     36px → 22px
Body:           16px → 14px
Configurator ₽: 24px → 20px
```

Touch targets: minimum 44×44px everywhere.

---

## 9. Agent Prompt Guide

### Quick reference
```
Accent:       #8C1F3B   (burgundy)
BG primary:   #FFFFFF
BG warm:      #F7F5F2
BG blush:     #F0E8EA
BG config:    #EFEDEA
Text:         #1A1A1A / #6B6B6B / #9E9E9E
Border:       #E0DDDA
Footer:       #1C1C1C

Font: 'Manrope' — weights 400 / 500 / 600 / 700 only
```

### Ready-to-use prompts

**Product card:**
> Build a product card following DESIGN.md. Badge top-left (#8C1F3B, white text, ALL-CAPS 10px), wishlist heart top-right. Door image portrait 2:3. Below: collection label ALL-CAPS 11px muted ls 0.08em, product name italic Manrope 400 14px, price «от X р» semibold number. No border-radius. Hover: shadow + translateY(-2px).

**Configurator step:**
> Build configurator step 1 following DESIGN.md. Full-screen split: left 55% bg #EFEDEA, centered door image; right 45% white, 40px padding. Top: 3-step stepper (28px circles + line connectors + labels, active bold). Below: accordion rows (gray label + bold value + [+], separated by 1px #E0DDDA). Sticky bottom: «Цена: от 52 000 р» (Manrope 700 24px) + two buttons (outlined + filled). Font: Manrope throughout.

**Accordion row:**
> Flex row, padding 16px 0, border-bottom 1px #E0DDDA. Left: «Размер полотна:» Manrope 400 14px #6B6B6B + «2000×600» Manrope 600 14px #1A1A1A. Right: «+» 18px #6B6B6B. Cursor pointer.

**Section heading:**
> Flex row space-between baseline. Left: Manrope 600 32px «Название». Right: «Смотреть все →» Manrope 400 13px #6B6B6B.

**Mobile bottom tab bar:**
> Fixed bottom, 56px, white, border-top 1px #E0DDDA. 5 equal tabs: Главная / Каталог / Корзина / Избранное / Меню. Icon (line style) + 10px Manrope 500 label. Active: #8C1F3B. Inactive: #9E9E9E.

**Category grid:**
> 2-column grid. Each cell: lifestyle door photo full-bleed, Manrope 500 17px label + ↗ #8C1F3B below. Hover: brightness(1.04). Some cells full-width. Title «Каталог Дверянинов» Manrope 700 above.

**Footer:**
> 4-column, bg #1C1C1C. Col 1: logo + phone Manrope 600 18px white + email. Cols 2–4: heading Manrope 600 11px ALL-CAPS white, links Manrope 400 13px #A09A96. Bottom: 12px copyright. All Manrope.

---

*Generated from visual analysis of dveryaninov.ru desktop and mobile (390px) screens. Last reviewed: 2026.*
