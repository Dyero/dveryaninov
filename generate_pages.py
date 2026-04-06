#!/usr/bin/env python3
"""Generate collection pages and product card pages for all 30 collections."""
import os
import re
import unicodedata
from urllib.parse import quote

COLLECTIONS_DIR = "images/Коллекции"

# Collections where default variant is ПО (not ПГ)
PO_DEFAULT_COLLECTIONS = {"Альберта"}

# All 91 ПВХ/ПЭТ coatings: (name, hex_color)
COATINGS = [
    ("Бэйсик вайт ПЭТ", "#F5F5F0"),
    ("Лайт грэй ПЭТ", "#D3D3D3"),
    ("Текстура грей ПЭТ", "#A9A9A9"),
    ("Браш блю ПЭТ", "#6B8FAD"),
    ("Мени грин ПЭТ", "#5B7A5E"),
    ("Антрацит ПЭТ", "#383838"),
    ("Сноу ПЭТ", "#FFFAFA"),
    ("Керамик матовый", "#E8E0D8"),
    ("Бланж", "#F0E6D8"),
    ("Белый матовый", "#F5F5F5"),
    ("Керамик белый", "#F0EBE3"),
    ("Тальк", "#F0EDE5"),
    ("Велутто ваниль", "#F3E5AB"),
    ("Керамик капучино", "#C4A882"),
    ("Манила", "#FFDB8B"),
    ("Керамик серый", "#B8B0A8"),
    ("Оливин", "#9AB973"),
    ("Керамик какао", "#8B6F5E"),
    ("Мерино", "#F5EEDC"),
    ("Платина", "#E5E4E2"),
    ("Лофт", "#7A7267"),
    ("Графит темный", "#4A4A4A"),
    ("Вена", "#C8B898"),
    ("Антрацит", "#3B3B3B"),
    ("Неаполь", "#FADA5E"),
    ("Мидори", "#4DB560"),
    ("Океания", "#4A90A4"),
    ("Квазар", "#5C5470"),
    ("Терракот", "#CC6B49"),
    ("Токио", "#8B4049"),
    ("Нефрит", "#00A86B"),
    ("Скай софт", "#87CEEB"),
    ("Горчица", "#FFDB58"),
    ("Атлантик софт", "#4B6F8F"),
    ("Красная бургундия", "#800020"),
    ("Кварц айс", "#F0F0F0"),
    ("Кварц лайт грей", "#D0D0D0"),
    ("Кварц беж", "#E8DCC8"),
    ("Кварц грей", "#9E9E9E"),
    ("Спирея белая", "#FAFAF5"),
    ("Ясень белый софт", "#F0EAE0"),
    ("Дуб молочный", "#E8D5B7"),
    ("Дуб крем", "#EBD9B4"),
    ("Сканди айвори", "#FFFFF0"),
    ("Вуд сильвер", "#C0B8A8"),
    ("Вяз милк", "#EDE3D0"),
    ("Вяз грей", "#B0A89C"),
    ("Дуб сиена серый", "#9E8E7E"),
    ("Дуб сиена серый диагональ", "#9A8A7A"),
    ("Дуб сиена янтарный", "#C89050"),
    ("Дуб сиена янтарный диагональ", "#C48C4C"),
    ("Орех пекан сливочный стронг", "#C8A87C"),
    ("Платан шоколад", "#5C4030"),
    ("Монте рустик", "#8B7355"),
    ("Монте тиберио", "#6B5B4B"),
    ("Липа оливьера", "#9A8F68"),
    ("Дуб бодега светлый", "#CFC0A8"),
    ("Дуб мавелла", "#A08060"),
    ("Орех светлый", "#C4A77D"),
    ("Дуб бодега натуральный", "#B5A088"),
    ("Карагач светлый", "#C8A878"),
    ("Софора давиди", "#837050"),
    ("Липа амурская", "#B0A080"),
    ("Софора конзати", "#70603C"),
    ("Дуб бодега золотой", "#C8A848"),
    ("Мербау", "#7B3F00"),
    ("Орех пекан медовый", "#D4A04C"),
    ("Орех пекан шоколад", "#6B4423"),
    ("Вяз графит", "#5A5A52"),
    ("Махагон классический", "#C04000"),
    ("Дуб с патиной", "#A89060"),
    ("Шпон ясеня голд", "#C8AA58"),
    ("Маккасар", "#3C2820"),
    ("Венге премиум", "#2F1B14"),
    ("Ясень капучино", "#B09878"),
    ("Ясень грей", "#8F8478"),
    ("Ясень графит", "#58524A"),
    ("Ясень черный софт", "#3A3630"),
    ("Дуб пудра", "#D4C4B0"),
    ("Дуб аквамарин", "#7FBAAD"),
    ("Дуб болотный", "#5E6E50"),
    ("Дюна норд", "#E8D8C0"),
    ("Дюна бриз", "#D0C8B8"),
    ("Дюна мистраль", "#C8BCA8"),
    ("Сланец белый", "#E8E4E0"),
    ("Сланец черный", "#343434"),
    ("Марра", "#785040"),
    ("Кроскат", "#A89880"),
    ("Твил флай", "#B0A090"),
    ("Твил беж", "#C8B8A0"),
    ("Твил лен", "#D8CDB8"),
]

COATINGS_VISIBLE = 8  # Show first 8 swatches

# Price data: (collection_name, [model_nums], pg_price_or_None, po_price_or_None)
_PRICE_DATA = [
    # Аврора
    ("Аврора", ["1", "2"], 20300, 23140),
    ("Аврора", ["3", "4", "5"], None, 23140),
    # Альберта
    ("Альберта", ["1", "2", "3"], None, 23140),
    ("Альберта", ["4", "5", "6", "7"], None, 24560),
    # Амери
    ("Амери", [str(i) for i in range(1, 11)], 19300, 21860),
    # Амфора
    ("Амфора", [str(i) for i in range(1, 10)], 19870, None),
    # Белуни
    ("Белуни", [str(i) for i in range(1, 9)], 19440, 22000),
    # Бланк
    ("Бланк", [str(i) for i in range(1, 6)], 20860, 23700),
    # Бона
    ("Бона", [str(i) for i in range(1, 7)], 19300, 22000),
    # Бонеко
    ("Бонеко", [str(i) for i in range(1, 7)], 19440, 22280),
    # Вектор
    ("Вектор", ["1", "2", "3", "5", "6"], 19870, 22710),
    ("Вектор", ["4", "7", "8", "9", "10", "11"], 19870, None),
    # Верто
    ("Верто", [str(i) for i in range(1, 10)], 20860, None),
    # Витра
    ("Витра", ["1", "2"], 22710, None),
    ("Витра", ["3", "4", "5", "6", "7"], 21290, None),
    # Д
    ("Д", ["4", "14", "22"], None, 13620),
    ("Д", ["16", "36", "43", "44", "48", "49", "50"], None, 13200),
    ("Д", ["17"], 12770, None),
    # Декар
    ("Декар", [str(i) for i in range(1, 6)], 20860, 23420),
    # Декар с багетом
    ("Декар с багетом", [str(i) for i in range(1, 6)], 24560, 27400),
    # Кант
    ("Кант", [str(i) for i in range(1, 6)], 18020, 20860),
    # Каскад
    ("Каскад", [str(i) for i in range(1, 6)], 19870, 22280),
    # Квант
    ("Квант", [str(i) for i in range(1, 5)], 23140, 25550),
    # Мета
    ("Мета", [str(i) for i in range(1, 6)], 21720, None),
    # Миура
    ("Миура", [str(i) for i in range(1, 6)], 20440, 22710),
    # Модена
    ("Модена", ["1"], 23140, 32520),
    ("Модена", ["2", "3", "4", "5"], 23140, 31230),
    # Моно
    ("Моно", [str(i) for i in range(1, 9)], 18450, None),
    ("Моно", ["9", "10", "11", "12"], None, 19020),
    # Нео
    ("Нео", [str(i) for i in range(1, 7)], 19300, 22000),
    # Оазис
    ("Оазис", [str(i) for i in range(1, 6)], 20300, 22710),
    # Палладио
    ("Палладио", [str(i) for i in range(1, 7)], 20860, None),
    # Плиссе (от 25 690 — минимальная из серий 80/120 мм)
    ("Плиссе", ["1", "2", "3"], 25690, None),
    # Терра
    ("Терра", [str(i) for i in range(1, 6)], 21720, None),
    # Ультра
    ("Ультра", ["1", "2", "3"], 19870, 22570),
    ("Ультра", ["4", "5"], 19870, 24700),
    # Флай
    ("Флай", [str(i) for i in range(1, 9)], None, 24560),
    # Форм
    ("Форм", [str(i) for i in range(1, 6)], 20860, None),
    # Этерна
    ("Этерна", [str(i) for i in range(1, 6)], 19300, 22000),
]

PRICES = {}
for _coll, _models, _pg, _po in _PRICE_DATA:
    for _m in _models:
        PRICES[(_coll, _m)] = (_pg, _po)

def format_price(price):
    """19300 → '19 300'"""
    return f"{price:,}".replace(",", " ")

def get_min_price(coll_name, model_num):
    """Return (min_price, pg_price, po_price) or (None, None, None)."""
    pg, po = PRICES.get((coll_name, str(model_num)), (None, None))
    prices = [p for p in (pg, po) if p]
    return (min(prices) if prices else None, pg, po)

# Folder name aliases — where folder name ≠ filename prefix
COLL_ALIASES = {
    "Бонеко": ["БОНЭКО", "Бонэко", "бонэко"],
}

def slugify(name):
    """Create URL-safe slug from Russian name."""
    tr = {
        'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh',
        'з':'z','и':'i','й':'j','к':'k','л':'l','м':'m','н':'n','о':'o',
        'п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts',
        'ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu',
        'я':'ya',' ':'-','_':'-'
    }
    slug = ""
    for c in name.lower():
        slug += tr.get(c, c)
    slug = re.sub(r'[^a-z0-9-]', '', slug)
    slug = re.sub(r'-+', '-', slug).strip('-')
    return slug

def parse_models(coll_name, files):
    """Parse files into unique product models.
    
    Rules:
    - "Аврора 1 ПГ 1.jpg" and "Аврора 1 ПО 1.jpg" are same product (model 1)
    - Without ПО/ПГ suffix, default is ПГ (except Альберта = ПО)
    - Model number "1" should not appear in title for models with number
    - Special cases: Д (e.g. "Д14.png"), Плиссе, etc.
    """
    models = {}  # model_num -> {pg_file, po_file, display_name}
    
    # Build list of prefixes to strip (collection name + aliases)
    prefixes_to_strip = [coll_name]
    if coll_name in COLL_ALIASES:
        prefixes_to_strip.extend(COLL_ALIASES[coll_name])
    
    for f in files:
        name = f.rsplit('.', 1)[0]  # strip extension
        ext = f.rsplit('.', 1)[1] if '.' in f else 'png'
        
        # Normalize Unicode to NFC
        name = unicodedata.normalize('NFC', name)
        
        # Normalize: remove trailing " 1", " 2", " 3" etc (photo variant number)
        base = re.sub(r'\s+\d+$', '', name)
        
        # Detect ПГ/ПО
        is_pg = bool(re.search(r'[пП][гГ]', base))
        is_po = bool(re.search(r'[пП][оО]', base))
        
        # Extract model number
        # Remove collection name and ПГ/ПО
        clean = base
        # Remove known prefixes (case insensitive), try all aliases
        for prefix in prefixes_to_strip:
            nfc_prefix = unicodedata.normalize('NFC', prefix)
            clean = re.sub(re.escape(nfc_prefix), '', clean, flags=re.IGNORECASE).strip()
        # Remove ПГ/ПО markers
        clean = re.sub(r'\s*[пП][гГ]\s*', '', clean)
        clean = re.sub(r'\s*[пП][оО]\s*', '', clean)
        # Remove "вставка" and similar suffixes
        clean = re.sub(r'\s*вставка\s*', '', clean, flags=re.IGNORECASE)
        # Remove "с багетом" for Декар с багетом
        if coll_name == "Декар с багетом":
            clean = re.sub(r's*с багетом\s*', '', clean, flags=re.IGNORECASE)
        clean = clean.strip()
        
        # For Д collection: "Д14" -> model_num = "14"
        if coll_name == "Д":
            match = re.search(r'\d+', base)
            model_num = match.group() if match else clean
        # For Плиссе: "плиссе 1 80.png" -> has size variant
        elif coll_name == "Плиссе":
            match = re.match(r'(\d+)', clean)
            model_num = match.group(1) if match else clean
        else:
            model_num = clean if clean else "1"
        
        if model_num not in models:
            models[model_num] = {
                'pg_file': None, 'po_file': None,
                'display_name': '', 'extra_files': []
            }
        
        if is_pg:
            models[model_num]['pg_file'] = f
        elif is_po:
            models[model_num]['po_file'] = f
        else:
            # No ПГ/ПО marker — this is the default variant
            if coll_name in PO_DEFAULT_COLLECTIONS:
                if not models[model_num]['po_file']:
                    models[model_num]['po_file'] = f
            else:
                if not models[model_num]['pg_file']:
                    models[model_num]['pg_file'] = f
            # Also might be a "вставка" or size variant
            if 'вставка' in name.lower() or (coll_name == "Плиссе" and '80' in name):
                models[model_num]['extra_files'].append(f)
    
    # Build display names
    for num, data in models.items():
        if coll_name == "Д":
            data['display_name'] = f"Д{num}"
        elif coll_name == "Декар с багетом":
            data['display_name'] = f"Декар с багетом {num}"
        else:
            data['display_name'] = f"{coll_name} {num}"
        
        # Choose primary image (prefer ПГ)
        data['primary_file'] = data['pg_file'] or data['po_file'] or (data['extra_files'][0] if data['extra_files'] else None)
    
    return models

def generate_collection_page(coll_name, models):
    """Generate a collection page HTML."""
    slug = slugify(coll_name)
    filename = f"collection-{slug}.html"
    
    # Find first image for hero
    first_model = list(models.values())[0] if models else None
    hero_img = f"images/Коллекции/{coll_name}/{first_model['primary_file']}" if first_model and first_model['primary_file'] else "images/card-placeholder.svg"
    
    # Compute collection min price
    coll_prices = []
    for num in models:
        min_p, _, _ = get_min_price(coll_name, num)
        if min_p:
            coll_prices.append(min_p)
    coll_min_price = min(coll_prices) if coll_prices else None
    coll_price_str = f'<p class="collection-hero__price">от {format_price(coll_min_price)} ₽</p>' if coll_min_price else ''
    
    # Product cards HTML
    cards_html = ""
    for num in sorted(models.keys(), key=lambda x: (len(x), x)):
        m = models[num]
        if not m['primary_file']:
            continue
        img_path = f"images/Коллекции/{coll_name}/{m['primary_file']}"
        product_slug = slugify(m['display_name'])
        
        # Determine variant label
        has_pg = m['pg_file'] is not None
        has_po = m['po_file'] is not None
        variant = ""
        if has_pg and has_po:
            variant = "ПГ / ПО"
        elif has_pg:
            variant = "ПГ"
        elif has_po:
            variant = "ПО"
        
        # Get price for this model
        min_p, _, _ = get_min_price(coll_name, num)
        card_price = f'<span class="card__price-prefix">от</span> {format_price(min_p)} ₽' if min_p else 'Цена по запросу'
        
        variant_html = f'<span class="card__variant">{variant}</span>' if variant else ''
        
        cards_html += f'''        <article class="card">
          <div class="card__image-wrap">
            <button class="card__fav" aria-label="В избранное"></button>
            <img class="card__image" src="{img_path}" alt="{m['display_name']}">
          </div>
          <div class="card__info">
            <div class="card__title-row">
              <h3 class="card__title"><a href="product-{product_slug}.html">{m['display_name']}</a></h3>
              {variant_html}
            </div>
            <p class="card__price">{card_price}</p>
          </div>
        </article>
'''

    html = f'''<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Коллекция {coll_name} — Дверянинов</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/responsive.css">
  <script src="js/auth.js"></script>
  <script src="js/load-components.js"></script>
</head>
<body class="page page_collection">
  
  <main>
    <!-- Hero -->
    <section class="collection-hero">
      <div class="collection-hero__content">
        <nav class="breadcrumbs" aria-label="Хлебные крошки">
          <a class="breadcrumbs__link" href="index.html">Главная</a>
          <span class="breadcrumbs__sep">–</span>
          <a class="breadcrumbs__link" href="catalog.html">Каталог</a>
          <span class="breadcrumbs__sep">–</span>
          <span class="breadcrumbs__current">{coll_name}</span>
        </nav>
        <h1 class="collection-hero__title">Коллекция {coll_name}</h1>
        {coll_price_str}
      </div>
      <div class="collection-hero__image">
        <img src="{hero_img}" alt="Коллекция {coll_name}">
      </div>
    </section>

    <!-- Товары коллекции -->
    <section class="section section_cards collection-products">
      <div class="section__head">
        <h2 class="section__title">Двери коллекции {coll_name}</h2>
      </div>
      <div class="section__cards section__cards_wrap">
{cards_html}      </div>
    </section>
  </main>
  
  <script src="js/shop.js"></script>
</body>
</html>'''
    
    return filename, html

def generate_product_page(coll_name, model_num, model_data, all_models):
    """Generate a full product page matching the reference layout (product-fly-8-pg.html)."""
    product_slug = slugify(model_data['display_name'])
    filename = f"product-{product_slug}.html"
    
    # Get images
    images = []
    if model_data['pg_file']:
        images.append((f"images/Коллекции/{coll_name}/{model_data['pg_file']}", f"{model_data['display_name']} ПГ"))
    if model_data['po_file']:
        images.append((f"images/Коллекции/{coll_name}/{model_data['po_file']}", f"{model_data['display_name']} ПО"))
    for ef in model_data.get('extra_files', []):
        if ef != model_data['pg_file'] and ef != model_data['po_file']:
            images.append((f"images/Коллекции/{coll_name}/{ef}", f"{model_data['display_name']}"))
    
    if not images and model_data['primary_file']:
        images.append((f"images/Коллекции/{coll_name}/{model_data['primary_file']}", model_data['display_name']))
    
    main_img = images[0][0] if images else "images/card-placeholder.svg"
    
    # Thumbnails with proper attrs
    thumbs_html = ""
    for i, (img_path, alt) in enumerate(images):
        if i == 0:
            thumbs_html += f'          <button type="button" class="product__thumb product__thumb_active" aria-pressed="true" tabindex="0" title="Вид {i+1}">\n'
        else:
            thumbs_html += f'          <button type="button" class="product__thumb" aria-pressed="false" tabindex="-1" title="Вид {i+1}">\n'
        thumbs_html += f'            <img src="{img_path}" alt="{alt}" width="100" height="100">\n'
        thumbs_html += f'          </button>\n'
    
    coll_slug = slugify(coll_name)
    display = model_data['display_name']
    
    # Build coatings swatches HTML
    visible = COATINGS[:COATINGS_VISIBLE]
    remaining = len(COATINGS) - COATINGS_VISIBLE
    coatings_html = ""
    for i, (c_name, c_hex) in enumerate(visible):
        if i == 0:
            coatings_html += f'            <button type="button" class="product__color product__color_active" style="--color-swatch: {c_hex};" aria-label="{c_name}" title="{c_name}">\n'
        else:
            coatings_html += f'            <button type="button" class="product__color" style="--color-swatch: {c_hex};" aria-label="{c_name}" title="{c_name}">\n'
        coatings_html += f'              <span class="product__color-inner" style="background: {c_hex};"></span>\n'
        coatings_html += f'            </button>\n'
    coatings_html += f'            <button type="button" class="product__color product__color_more" aria-label="Ещё {remaining} покрытий">+{remaining}</button>\n'
    coatings_html += f'            <div class="product__color-custom-wrap">\n'
    coatings_html += f'              <button type="button" class="product__size product__size_own">Свой цвет</button>\n'
    coatings_html += f'            </div>\n'
    default_coating = COATINGS[0][0]
    
    # Get price for this model
    min_p, _, _ = get_min_price(coll_name, model_num)
    price_text = f"от {format_price(min_p)} ₽" if min_p else "Цена по запросу"
    
    # Related products (other models from same collection, max 4)
    related_html = ""
    count = 0
    for num, m in all_models.items():
        if num == model_num or not m['primary_file']:
            continue
        if count >= 4:
            break
        rslug = slugify(m['display_name'])
        rimg = f"images/Коллекции/{coll_name}/{m['primary_file']}"
        rmin, _, _ = get_min_price(coll_name, num)
        rprice = f"от {format_price(rmin)} ₽" if rmin else "Цена по запросу"
        related_html += f'''        <article class="card">
          <div class="card__image-wrap">
            <img class="card__image" src="{rimg}" alt="{m['display_name']}" width="288" height="320">
          </div>
          <div class="card__info">
            <h3 class="card__title"><a href="product-{rslug}.html">{m['display_name']}</a></h3>
            <p class="card__price">{rprice}</p>
          </div>
        </article>
'''
        count += 1
    
    html = f'''<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{display} — Дверянинов</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/responsive.css">
  <script src="js/auth.js"></script>
  <script src="js/load-components.js"></script>
</head>
<body class="page page_product">
  
  <main class="product-page">
    <nav class="breadcrumbs" aria-label="Хлебные крошки">
      <a class="breadcrumbs__link" href="index.html">Главная</a>
      <span class="breadcrumbs__sep">–</span>
      <a class="breadcrumbs__link" href="catalog.html">Каталог</a>
      <span class="breadcrumbs__sep">–</span>
      <a class="breadcrumbs__link" href="collection-{coll_slug}.html">Коллекция «{coll_name}»</a>
      <span class="breadcrumbs__sep">–</span>
      <span class="breadcrumbs__current">{display}</span>
    </nav>

    <div class="product">
      <div class="product__gallery product__gallery-col">
        <div class="product__thumbs">
{thumbs_html}        </div>
        <div class="product__main-image" role="region" aria-label="Основное изображение">
          <button type="button" class="product__arrow product__arrow_prev" aria-label="Показать предыдущее фото"></button>
          <img src="{main_img}" alt="{display}" width="560" height="560" loading="lazy">
          <button type="button" class="product__arrow product__arrow_next" aria-label="Показать следующее фото"></button>
        </div>
      </div>

      <div class="product__info product__info-col">
        <h1 class="product__title">{display}</h1>

        <div class="product__option">
          <div class="product__option-header">
            <span class="product__option-label">Размер полотна:</span>
            <span class="product__option-value">2000х600</span>
          </div>
          <div class="product__sizes">
            <button type="button" class="product__size">2000х800</button>
            <button type="button" class="product__size">2000х700</button>
            <button type="button" class="product__size product__size_active">2000х600</button>
            <button type="button" class="product__size">2000х900</button>
            <button type="button" class="product__size product__size_measure">Нужен замер</button>
            <button type="button" class="product__size product__size_own">Свой размер</button>
          </div>
        </div>

        <div class="product__option product__option_coating">
          <div class="product__option-header">
            <span class="product__option-label">Покрытие:</span>
            <span class="product__option-value">{default_coating}</span>
          </div>
          <div class="product__colors">
{coatings_html}          </div>
        </div>

        <div class="product__price-block">
          <p class="product__price">{price_text}</p>
          <span class="product__price-note">цена за полотно</span>
          <div class="product__actions">
            <button type="button" class="product__btn product__btn_cart">
              <span class="product__btn-icon product__btn-icon_cart" aria-hidden="true"></span>
              Добавить в корзину
            </button>
            <button type="button" class="product__btn product__btn_wishlist" aria-label="В избранное"></button>
          </div>
          <button type="button" class="product__btn product__btn_config" data-open-config><img src="images/0203 vuesax 04 conf.svg" alt="" width="20" height="20" aria-hidden="true"> Конструктор</button>
        </div>
      </div>
    </div>

    <section class="product-section product-section_desc">
      <h2 class="product-section__title">Описание</h2>
      <p class="product-section__text">
        {display} — межкомнатная дверь коллекции «{coll_name}» от фабрики Дверянинов. Высокое качество материалов и современный дизайн. Подходит для жилых и коммерческих помещений.
      </p>
    </section>

    <section class="product-section product-section_specs">
      <h2 class="product-section__title">Характеристики двери</h2>
      <div class="product-specs">
        <div class="product-specs__row">
          <div class="product-specs__label">Высота</div>
          <div class="product-specs__value">1900–2200 мм</div>
        </div>
        <div class="product-specs__row">
          <div class="product-specs__label">Ширина</div>
          <div class="product-specs__value">600–900 мм</div>
        </div>
        <div class="product-specs__row">
          <div class="product-specs__label">Толщина</div>
          <div class="product-specs__value">40 мм</div>
        </div>
      </div>
    </section>

    <section class="product-section product-section_related">
      <h2 class="product-section__title">Другие модели в коллекции</h2>
      <div class="section__cards section__cards_wrap product-section__cards">
{related_html}      </div>
    </section>

    <section class="product-help">
      <div class="product-help__content">
        <p class="product-help__kicker">Консультация специалиста</p>
        <h2 class="product-help__title">Нужна помощь?</h2>
        <p class="product-help__text">Ответим на все вопросы и поможем<br>сделать правильный выбор</p>
        <button type="button" class="product-help__btn product__btn product__btn_cart">Нужна помощь</button>
      </div>
      <div class="product-help__image-wrap" aria-hidden="true">
        <img class="product-help__image" src="images/hero-bg.svg" alt="" width="960" height="360">
      </div>
    </section>
  </main>

  <nav class="mobile-menu" aria-label="Нижнее меню">
    <a class="mobile-menu__item" href="catalog.html">
      <span class="mobile-menu__icon" aria-hidden="true"></span>
      <span class="mobile-menu__label">Каталог</span>
    </a>
    <a class="mobile-menu__item" href="about.html">
      <span class="mobile-menu__icon mobile-menu__icon_about" aria-hidden="true"></span>
      <span class="mobile-menu__label">О компании</span>
    </a>
    <a class="mobile-menu__item" href="contacts.html">
      <span class="mobile-menu__icon mobile-menu__icon_contacts" aria-hidden="true"></span>
      <span class="mobile-menu__label">Контакты</span>
    </a>
    <a class="mobile-menu__item" href="cart.html">
      <span class="mobile-menu__icon mobile-menu__icon_cart" aria-hidden="true"></span>
      <span class="mobile-menu__label">Корзина</span>
    </a>
  </nav>

  <!-- Модалка: заказать замер -->
  <div class="modal" id="measureModal" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Заказать замер">
    <div class="modal__backdrop" data-close-measure></div>
    <div class="modal__panel" style="width: min(480px, calc(100vw - 32px)); max-height: 520px; grid-template-rows: auto 1fr;">
      <div class="modal__header">
        <h2 class="modal__title">Заказать замер</h2>
        <button class="modal__close" type="button" data-close-measure aria-label="Закрыть">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal__body" style="padding: 24px 16px; overflow-y: auto;">
        <p style="margin: 0 0 20px; font-size: 14px; color: #666; line-height: 1.5;">Наш специалист приедет к вам, чтобы точно измерить дверной проём и подобрать оптимальное решение</p>
        <form id="measureForm" style="display: flex; flex-direction: column; gap: 14px;">
          <input type="text" name="name" placeholder="Ваше имя*" required style="width: 100%; padding: 14px 16px; border: 1px solid #ddd; font-size: 15px; font-family: inherit; box-sizing: border-box;">
          <input type="tel" name="phone" placeholder="Ваш телефон*" required style="width: 100%; padding: 14px 16px; border: 1px solid #ddd; font-size: 15px; font-family: inherit; box-sizing: border-box;">
          <textarea name="comment" placeholder="Комментарий (необязательно)" rows="3" style="width: 100%; padding: 14px 16px; border: 1px solid #ddd; font-size: 15px; font-family: inherit; resize: vertical; box-sizing: border-box;"></textarea>
          <button type="submit" class="btn btn_primary" style="width: 100%; padding: 16px; font-size: 15px; letter-spacing: 0.05em;">ЗАКАЗАТЬ ЗАМЕР</button>
          <p style="margin: 0; font-size: 12px; color: #999; text-align: center;">Отправляя заявку, вы даёте согласие на обработку <a href="#" style="color: inherit; text-decoration: underline;">персональных данных</a></p>
        </form>
        <div id="measureSuccess" style="display: none; text-align: center; padding: 40px 0;">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style="margin-bottom: 16px;"><circle cx="24" cy="24" r="24" fill="#E8F5E9"/><path d="M15 25l6 6 12-14" stroke="#4CAF50" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <h3 style="margin: 0 0 8px; font-size: 18px;">Заявка отправлена!</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">Мы свяжемся с вами в ближайшее рабочее время</p>
        </div>
      </div>
    </div>
  </div>

  <script src="js/coatings-data.js"></script>
  <script src="js/product.js"></script>
  <script src="js/shop.js"></script>
</body>
</html>'''
    
    return filename, html

# Main generation
generated_files = []
all_collections = {}  # coll_name -> models dict

for coll_name in sorted(os.listdir(COLLECTIONS_DIR)):
    coll_name = unicodedata.normalize('NFC', coll_name)
    coll_path = os.path.join(COLLECTIONS_DIR, coll_name)
    if not os.path.isdir(coll_path):
        continue
    
    files = sorted(os.listdir(coll_path))
    models = parse_models(coll_name, files)
    all_collections[coll_name] = models
    
    # Generate collection page
    coll_filename, coll_html = generate_collection_page(coll_name, models)
    with open(coll_filename, 'w', encoding='utf-8') as f:
        f.write(coll_html)
    generated_files.append(coll_filename)
    
    # Generate product pages
    for num, data in models.items():
        if not data['primary_file']:
            continue
        prod_filename, prod_html = generate_product_page(coll_name, num, data, models)
        with open(prod_filename, 'w', encoding='utf-8') as f:
            f.write(prod_html)
        generated_files.append(prod_filename)

# Generate catalog.html — flat list of ALL doors across all collections
catalog_cards = ""
catalog_collections = set()
for coll_name in sorted(all_collections.keys()):
    models = all_collections[coll_name]
    for num in sorted(models.keys(), key=lambda x: (len(x), x)):
        m = models[num]
        if not m['primary_file']:
            continue
        catalog_collections.add(coll_name)
        coll_slug = slugify(coll_name)
        img_path = f"images/Коллекции/{coll_name}/{m['primary_file']}"
        product_slug = slugify(m['display_name'])
        min_p, _, _ = get_min_price(coll_name, num)
        card_price = f'<span class="card__price-prefix">от</span> {format_price(min_p)} ₽' if min_p else 'Цена по запросу'
        has_pg = m['pg_file'] is not None
        has_po = m['po_file'] is not None
        variant = ""
        if has_pg and has_po:
            variant = "ПГ / ПО"
        elif has_pg:
            variant = "ПГ"
        elif has_po:
            variant = "ПО"
        variant_html = f'<span class="card__variant">{variant}</span>' if variant else ''
        catalog_cards += f'''        <article class="card" data-collection="{coll_slug}">
          <div class="card__image-wrap">
            <button class="card__fav" aria-label="В избранное"></button>
            <img class="card__image" src="{img_path}" alt="{m['display_name']}">
          </div>
          <div class="card__info">
            <div class="card__title-row">
              <h3 class="card__title"><a href="product-{product_slug}.html">{m['display_name']}</a></h3>
              {variant_html}
            </div>
            <p class="card__price">{card_price}</p>
          </div>
        </article>
'''

# Build sidebar filter HTML
filter_buttons = ""
for cn in sorted(catalog_collections):
    cs = slugify(cn)
    filter_buttons += f'        <button type="button" class="catalog__filter-btn" data-filter-collection="{cs}">{cn}</button>\n'

catalog_html = f'''<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Каталог — Дверянинов</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/responsive.css">
  <script src="js/auth.js"></script>
  <script src="js/load-components.js"></script>
</head>
<body class="page page_catalog">
  
  <main class="catalog-page">
    <nav class="breadcrumbs catalog-page__breadcrumbs" aria-label="Хлебные крошки">
      <a class="breadcrumbs__link" href="index.html">Главная</a>
      <span class="breadcrumbs__sep">–</span>
      <span class="breadcrumbs__current">Каталог</span>
    </nav>

    <section class="catalog" id="catalog" aria-labelledby="catalog-title">
      <div class="catalog__head">
        <h2 class="catalog__title" id="catalog-title">Каталог</h2>
      </div>

      <div class="catalog__categories">
        <button type="button" class="catalog__cat-btn catalog__cat-btn_active" data-category="all">Все</button>
        <button type="button" class="catalog__cat-btn" data-category="doors">Межкомнатные двери</button>
        <button type="button" class="catalog__cat-btn" data-category="hardware">Фурнитура</button>
        <button type="button" class="catalog__cat-btn" data-category="partitions">Перегородки</button>
        <button type="button" class="catalog__cat-btn" data-category="invisible">Скрытые двери (Invisible)</button>
      </div>

      <!-- Mobile filter toggle -->
      <button type="button" class="catalog__filter-toggle" id="catalogFilterToggle">Фильтры</button>

      <div class="catalog__body">
        <!-- Sidebar filters -->
        <aside class="catalog__sidebar" id="catalogSidebar">
          <div class="catalog__sidebar-head">
            <h3 class="catalog__sidebar-title">Коллекции</h3>
            <button type="button" class="catalog__sidebar-close" id="catalogSidebarClose" aria-label="Закрыть фильтры">&times;</button>
          </div>
          <div class="catalog__filter-list">
            <button type="button" class="catalog__filter-btn catalog__filter-btn_active" data-filter-collection="all">Все коллекции</button>
{filter_buttons}          </div>
        </aside>

        <!-- Cards grid -->
        <div class="section__cards section__cards_wrap catalog__grid">
{catalog_cards}        </div>
      </div>
    </section>
  </main>

  <nav class="mobile-menu" aria-label="Нижнее меню">
    <a class="mobile-menu__item" href="index.html">
      <span class="mobile-menu__icon" aria-hidden="true"></span>
      <span class="mobile-menu__label">Главная</span>
    </a>
    <a class="mobile-menu__item mobile-menu__item_active" href="catalog.html" aria-current="page">
      <span class="mobile-menu__icon mobile-menu__icon_catalog" aria-hidden="true"></span>
      <span class="mobile-menu__label">Каталог</span>
    </a>
    <a class="mobile-menu__item" href="about.html">
      <span class="mobile-menu__icon mobile-menu__icon_about" aria-hidden="true"></span>
      <span class="mobile-menu__label">О компании</span>
    </a>
    <a class="mobile-menu__item" href="contacts.html">
      <span class="mobile-menu__icon mobile-menu__icon_contacts" aria-hidden="true"></span>
      <span class="mobile-menu__label">Контакты</span>
    </a>
    <a class="mobile-menu__item" href="cart.html">
      <span class="mobile-menu__icon mobile-menu__icon_cart" aria-hidden="true"></span>
      <span class="mobile-menu__label">Корзина</span>
    </a>
  </nav>

  <script src="js/shop.js"></script>
</body>
</html>'''

with open('catalog.html', 'w', encoding='utf-8') as f:
    f.write(catalog_html)
generated_files.append('catalog.html')

# Generate collections.html — page listing all collections with min price
coll_cards = ""
for coll_name in sorted(all_collections.keys()):
    models = all_collections[coll_name]
    coll_slug = slugify(coll_name)
    # Find first image for collection card
    first_model = next((m for m in models.values() if m['primary_file']), None)
    hero_img = f"images/Коллекции/{coll_name}/{first_model['primary_file']}" if first_model else "images/card-placeholder.svg"
    # Find min price across all models in collection
    coll_prices = []
    for num in models:
        min_p, _, _ = get_min_price(coll_name, num)
        if min_p:
            coll_prices.append(min_p)
    coll_min = min(coll_prices) if coll_prices else None
    coll_price_str = f'<span class="card__price-prefix">от</span> {format_price(coll_min)} ₽' if coll_min else 'Цена по запросу'
    coll_cards += f'''        <article class="card">
          <div class="card__image-wrap">
            <img class="card__image" src="{hero_img}" alt="{coll_name}">
          </div>
          <div class="card__info">
            <h3 class="card__title"><a href="collection-{coll_slug}.html">{coll_name}</a></h3>
            <p class="card__price">{coll_price_str}</p>
          </div>
        </article>
'''

collections_html = f'''<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Коллекции — Дверянинов</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/responsive.css">
  <script src="js/auth.js"></script>
  <script src="js/load-components.js"></script>
</head>
<body class="page page_catalog">
  
  <main class="catalog-page">
    <nav class="breadcrumbs catalog-page__breadcrumbs" aria-label="Хлебные крошки">
      <a class="breadcrumbs__link" href="index.html">Главная</a>
      <span class="breadcrumbs__sep">–</span>
      <span class="breadcrumbs__current">Коллекции</span>
    </nav>

    <section class="catalog" id="catalog" aria-labelledby="collections-title">
      <div class="catalog__head">
        <h2 class="catalog__title" id="collections-title">Коллекции</h2>
      </div>

      <div class="section__cards section__cards_wrap catalog__grid">
{coll_cards}      </div>
    </section>
  </main>

  <nav class="mobile-menu" aria-label="Нижнее меню">
    <a class="mobile-menu__item" href="index.html">
      <span class="mobile-menu__icon" aria-hidden="true"></span>
      <span class="mobile-menu__label">Главная</span>
    </a>
    <a class="mobile-menu__item" href="catalog.html">
      <span class="mobile-menu__icon mobile-menu__icon_catalog" aria-hidden="true"></span>
      <span class="mobile-menu__label">Каталог</span>
    </a>
    <a class="mobile-menu__item" href="about.html">
      <span class="mobile-menu__icon mobile-menu__icon_about" aria-hidden="true"></span>
      <span class="mobile-menu__label">О компании</span>
    </a>
    <a class="mobile-menu__item" href="contacts.html">
      <span class="mobile-menu__icon mobile-menu__icon_contacts" aria-hidden="true"></span>
      <span class="mobile-menu__label">Контакты</span>
    </a>
    <a class="mobile-menu__item" href="cart.html">
      <span class="mobile-menu__icon mobile-menu__icon_cart" aria-hidden="true"></span>
      <span class="mobile-menu__label">Корзина</span>
    </a>
  </nav>

  <script src="js/shop.js"></script>
</body>
</html>'''

with open('collections.html', 'w', encoding='utf-8') as f:
    f.write(collections_html)
generated_files.append('collections.html')

print(f"Generated {len(generated_files)} files:")
for f in sorted(generated_files):
    print(f"  {f}")
