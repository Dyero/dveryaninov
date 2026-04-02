#!/usr/bin/env python3
"""Generate collection pages and product card pages for all 30 collections."""
import os
import re
import unicodedata
from urllib.parse import quote

COLLECTIONS_DIR = "images/Коллекции"

# Collections where default variant is ПО (not ПГ)
PO_DEFAULT_COLLECTIONS = {"Альберта"}

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
        
        cards_html += f'''        <article class="card">
          <div class="card__image-wrap">
            <button class="card__fav" aria-label="В избранное"></button>
            <img class="card__image" src="{img_path}" alt="{m['display_name']}">
          </div>
          <div class="card__info">
            <h3 class="card__title"><a href="product-{product_slug}.html">{m['display_name']}</a></h3>
            {f'<p class="card__variant">{variant}</p>' if variant else ''}
            <p class="card__price"><span class="card__price-prefix">от</span> Цена по запросу</p>
          </div>
        </article>
'''

    html = f'''<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Коллекция {coll_name} — Дверянинов</title>
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

def generate_product_page(coll_name, model_num, model_data):
    """Generate a minimal product page for each model."""
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
    
    # Thumbnails
    thumbs_html = ""
    for i, (img_path, alt) in enumerate(images):
        active = " product__thumb_active" if i == 0 else ""
        thumbs_html += f'            <button class="product__thumb{active}" data-thumb="{i}"><img src="{img_path}" alt="{alt}"></button>\n'
    
    coll_slug = slugify(coll_name)
    
    html = f'''<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{model_data['display_name']} — Дверянинов</title>
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
      <a class="breadcrumbs__link" href="collection-{coll_slug}.html">{coll_name}</a>
      <span class="breadcrumbs__sep">–</span>
      <span class="breadcrumbs__current">{model_data['display_name']}</span>
    </nav>

    <div class="product">
      <div class="product__gallery">
        <div class="product__thumbs">
{thumbs_html}        </div>
        <div class="product__main-image">
          <img src="{main_img}" alt="{model_data['display_name']}" id="mainProductImage">
        </div>
      </div>

      <div class="product__info">
        <h1 class="product__title">{model_data['display_name']}</h1>
        <div class="product__status">
          <span class="product__in-stock"><span class="product__in-stock-dot"></span> В наличии</span>
        </div>
        <div class="product__prices">
          <span class="product__price-current">Цена по запросу</span>
        </div>
        <div class="product__actions">
          <button type="button" class="product__btn product__btn_cart btn btn_primary">В КОРЗИНУ</button>
          <button type="button" class="product__btn product__btn_config" data-open-config>
            <img src="images/0203 vuesax 04 conf.svg" alt="" width="20" height="20" aria-hidden="true"> Конструктор
          </button>
        </div>
        <button type="button" class="product__btn product__btn_wishlist" aria-label="В избранное"></button>
      </div>
    </div>
  </main>
  
  <script src="js/shop.js"></script>
  <script>
    // Simple thumb navigation
    document.querySelectorAll("[data-thumb]").forEach(function(btn) {{
      btn.addEventListener("click", function() {{
        document.querySelectorAll(".product__thumb").forEach(function(t) {{ t.classList.remove("product__thumb_active"); }});
        btn.classList.add("product__thumb_active");
        document.getElementById("mainProductImage").src = btn.querySelector("img").src;
      }});
    }});
  </script>
</body>
</html>'''
    
    return filename, html

# Main generation
generated_files = []

for coll_name in sorted(os.listdir(COLLECTIONS_DIR)):
    coll_name = unicodedata.normalize('NFC', coll_name)
    coll_path = os.path.join(COLLECTIONS_DIR, coll_name)
    if not os.path.isdir(coll_path):
        continue
    
    files = sorted(os.listdir(coll_path))
    models = parse_models(coll_name, files)
    
    # Generate collection page
    coll_filename, coll_html = generate_collection_page(coll_name, models)
    with open(coll_filename, 'w', encoding='utf-8') as f:
        f.write(coll_html)
    generated_files.append(coll_filename)
    
    # Generate product pages
    for num, data in models.items():
        if not data['primary_file']:
            continue
        prod_filename, prod_html = generate_product_page(coll_name, num, data)
        with open(prod_filename, 'w', encoding='utf-8') as f:
            f.write(prod_html)
        generated_files.append(prod_filename)

print(f"Generated {len(generated_files)} files:")
for f in sorted(generated_files):
    print(f"  {f}")
