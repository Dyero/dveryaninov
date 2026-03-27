const fs = require('fs');
let html = fs.readFileSync('/workspaces/dveryaninov/product.html', 'utf8');

const newSection = `          <div class="config-detail-item">
            <div class="config-detail-header">
              <span class="config-detail-label">Модель ручки</span>
              <span class="config-detail-value">Ручка Название</span>
              <button class="config-detail-toggle" type="button" aria-expanded="true" aria-label="Показать опции"></button>
            </div>
            <div class="config-detail-options is-open" id="cfgHandleSection">

              <!-- Первая карточка -->
              <div class="cfg-item cfg-item_active">
                <div class="cfg-item__thumb" style="background-image: url('images/card-door-1.svg');" aria-hidden="true"></div>
                <div class="cfg-item__info">
                  <span class="cfg-item__name config-item__title">Ручка Название</span>
                  <span class="cfg-item__spec config-item__spec">2500х50х100мм</span>
                </div>
                <div class="cfg-item__qty">
                  <button type="button" class="cfg-qty-btn" data-qty-decrease aria-label="Уменьшить" disabled>−</button>
                  <input type="number" class="cfg-qty-input config-qty-input" value="1" min="1" data-item="handle-1" aria-label="Количество" readonly>
                  <button type="button" class="cfg-qty-btn" data-qty-increase aria-label="Увеличить">+</button>
                </div>
                <div class="cfg-item__price-block">
                  <div class="cfg-item__price">
                    <span class="config-item__amount">1200</span>
                    <span class="cfg-item__currency">₽</span>
                  </div>
                  <div class="cfg-item__old-price">55 799 ₽</div>
                </div>
              </div>

              <!-- Вторая карточка -->
              <div class="cfg-item">
                <div class="cfg-item__thumb" style="background-image: url('images/card-door-1.svg');" aria-hidden="true"></div>
                <div class="cfg-item__info">
                  <span class="cfg-item__name config-item__title">Ручка Другая</span>
                  <span class="cfg-item__spec config-item__spec">Цена по запросу</span>
                </div>
                <div class="cfg-item__qty">
                  <button type="button" class="cfg-qty-btn" data-qty-decrease aria-label="Уменьшить" disabled>−</button>
                  <input type="number" class="cfg-qty-input config-qty-input" value="0" min="0" data-item="handle-2" aria-label="Количество" readonly>
                  <button type="button" class="cfg-qty-btn" data-qty-increase aria-label="Увеличить">+</button>
                </div>
                <div class="cfg-item__price-block">
                  <div class="cfg-item__price">
                    <span class="config-item__amount">0</span>
                    <span class="cfg-item__currency">₽</span>
                  </div>
                </div>
              </div>

            </div>
          </div>`;

html = html.replace(/<div class="cfg-section">[\s\S]*?<div class="cfg-item__price">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/, newSection);

fs.writeFileSync('/workspaces/dveryaninov/product.html', html);
