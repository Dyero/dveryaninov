import { useState } from "react";
import { Link } from "react-router-dom";
import ConfiguratorModal from "../components/modals/ConfiguratorModal";

export default function Product() {
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeSize, setActiveSize] = useState("2000х600");
  const [activeColor, setActiveColor] = useState("RAL 9003");
  const [isConfigOpen, setConfigOpen] = useState(false);
  const [configStep, setConfigStep] = useState("config");

  const thumbs = [
    "/images/Альберта.png",
    "/images/Альберта 6 1.png",
    "/images/Альберта 7 3.png"
  ];

  const handleOpenConfig = (step = "config") => {
    setConfigStep(step);
    setConfigOpen(true);
  };

  return (
    <main className="product-page">
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <Link className="breadcrumbs__link" to="/">Главная</Link>
        <span className="breadcrumbs__sep">–</span>
        <Link className="breadcrumbs__link" to="/catalog">Каталог</Link>
        <span className="breadcrumbs__sep">–</span>
        <span className="breadcrumbs__current">Дверь Альберта 1</span>
      </nav>

      <div className="product">
        <div className="product__gallery product__gallery-col">
          <div className="product__thumbs">
            {thumbs.map((img, i) => (
              <button 
                key={i}
                type="button" 
                className={`product__thumb ${activeThumb === i ? 'product__thumb_active' : ''}`}
                aria-pressed={activeThumb === i}
                onClick={() => setActiveThumb(i)}
                title={`Вид ${i + 1}`}
              >
                <img src={img} alt={`Вид ${i + 1}`} width="100" height="100" />
              </button>
            ))}
          </div>
          <div className="product__main-image" role="region" aria-label="Основное изображение">
            <button 
              type="button" 
              className="product__arrow product__arrow_prev" 
              aria-label="Показать предыдущее фото"
              onClick={() => setActiveThumb(Math.max(0, activeThumb - 1))}
            ></button>
            <img src={thumbs[activeThumb]} alt="Основной вид" width="560" height="560" loading="lazy" />
            <button 
              type="button" 
              className="product__arrow product__arrow_next" 
              aria-label="Показать следующее фото"
              onClick={() => setActiveThumb(Math.min(thumbs.length - 1, activeThumb + 1))}
            ></button>
          </div>
        </div>

        <div className="product__info product__info-col">
          <div className="product__badges">
            <span className="product__badge product__badge_border">Новинка</span>
            <span className="product__badge product__badge_fill">Акция</span>
            <span className="product__badge product__badge_fill">Хит</span>
          </div>

          <h1 className="product__title">Дверь Альберта 1</h1>

          <div className="product__status">
            <span className="product__in-stock">
              <span className="product__in-stock-dot"></span>
              Товар в наличии
            </span>
            <a className="product__reviews" href="#reviews">5 отзывов</a>
          </div>

          <div className="product__option">
            <div className="product__option-header">
              <span className="product__option-label">Размер полотна:</span>
              <span className="product__option-value">{activeSize}</span>
            </div>
            <a className="product__option-link" href="#">Нужна консультация</a>
            <p className="product__option-hint">Данная модель изготавливается в размерах от 2000х600 до 2400х900 мм</p>
            <div className="product__sizes">
              {['2000х800', '2000х700', '2000х600', '2000х900'].map(size => (
                <button 
                  key={size}
                  type="button" 
                  className={`product__size ${activeSize === size ? 'product__size_active' : ''}`}
                  onClick={() => setActiveSize(size)}
                >
                  {size}
                </button>
              ))}
              <button type="button" className="product__size product__size_measure">Нужен замер</button>
              <button type="button" className="product__size product__size_own">Свой размер</button>
            </div>
          </div>

          <div className="product__option">
            <div className="product__option-header">
              <span className="product__option-label">Покрытие:</span>
              <span className="product__option-value">{activeColor}</span>
            </div>
            <div className="product__colors">
              <button 
                type="button" 
                className={`product__color ${activeColor === 'RAL 9003' ? 'product__color_active' : ''}`}
                style={{ '--color-swatch': '#F5F5DC' }} 
                aria-label="RAL 9003"
                onClick={() => setActiveColor('RAL 9003')}
              >
                <span className="product__color-inner" style={{ background: '#F5F5DC' }}></span>
              </button>
              <button 
                type="button" 
                className={`product__color ${activeColor === 'Дуб' ? 'product__color_active' : ''}`}
                style={{ '--color-swatch': '#8B4513' }} 
                aria-label="Дуб"
                onClick={() => setActiveColor('Дуб')}
              >
                <span className="product__color-inner" style={{ background: '#8B4513' }}></span>
              </button>
              <button 
                type="button" 
                className={`product__color ${activeColor === 'Венге' ? 'product__color_active' : ''}`}
                style={{ '--color-swatch': '#2F2F2F' }} 
                aria-label="Венге"
                onClick={() => setActiveColor('Венге')}
              >
                <span className="product__color-inner" style={{ background: '#2F2F2F' }}></span>
              </button>
              <button 
                type="button" 
                className={`product__color ${activeColor === 'Орех' ? 'product__color_active' : ''}`}
                style={{ '--color-swatch': '#C4A77D' }} 
                aria-label="Орех"
                onClick={() => setActiveColor('Орех')}
              >
                <span className="product__color-inner" style={{ background: '#C4A77D' }}></span>
              </button>
              <button type="button" className="product__color product__color_more" aria-label="Ещё 3 цвета">+3</button>
              <div className="product__color-custom-wrap">
                <button type="button" className="product__size product__size_own">Свой цвет</button>
              </div>
            </div>
          </div>

          <div className="product__price-block">
            <p className="product__price">от 52 000 ₽</p>
            <div className="product__actions">
              <button type="button" className="product__btn product__btn_cart">
                <span className="product__btn-icon product__btn-icon_cart" aria-hidden="true"></span>
                Добавить в корзину
              </button>
              <button type="button" className="product__btn product__btn_wishlist" aria-label="В избранное"></button>
            </div>
            <button type="button" className="product__btn product__btn_config" onClick={() => handleOpenConfig('config')}>Конфигуратор</button>
          </div>

          <div className="product__extra">
            <h3 className="product__extra-title">Вам может понадобиться</h3>
            <button className="product__extra-link" onClick={() => handleOpenConfig('hardware')}>
              <span className="product__extra-icon" aria-hidden="true"></span>
              <span className="product__extra-text">Выбрать фурнитуру</span>
              <span className="product__extra-arrow" aria-hidden="true"></span>
            </button>
            <button className="product__extra-link" onClick={() => handleOpenConfig('molding')}>
              <span className="product__extra-icon" aria-hidden="true"></span>
              <span className="product__extra-text">Выбрать погонаж</span>
              <span className="product__extra-arrow" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>

      <ConfiguratorModal 
        isOpen={isConfigOpen} 
        onClose={() => setConfigOpen(false)} 
        initialStep={configStep}
        initialSize={activeSize}
        initialFinish={activeColor}
      />
    </main>
  );
}