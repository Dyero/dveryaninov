import { useState } from 'react';
import { Link } from 'react-router-dom';

const SEARCH_PRODUCTS = [
  { title: 'Флай 8 ПГ', url: '/product/1', desc: 'Межкомнатная дверь' },
  { title: 'Ультра 5 ПГ', url: '/product/2', desc: 'Межкомнатная дверь' },
  { title: 'Мета 1 ПГ Престиж', url: '/product/3', desc: 'Межкомнатная дверь' },
  { title: 'Сол 2 ПГ', url: '/product/4', desc: 'Межкомнатная дверь' }
];

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  
  if (!isOpen) return null;

  const matches = query.trim()
    ? SEARCH_PRODUCTS.filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || p.desc.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Поиск">
      <div className="search-overlay__backdrop" onClick={onClose}></div>
      <div className="search-overlay__panel">
        <div className="search-overlay__field">
          <input 
            className="search-overlay__input" 
            type="search" 
            placeholder="Поиск по моделям дверей..." 
            autoComplete="off" 
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" className="search-overlay__close" onClick={onClose} aria-label="Закрыть поиск">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
              <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
        
        <ul className="search-overlay__results" role="listbox">
          {query.trim() && matches.length === 0 && (
            <li className="search-overlay__no-results">Ничего не найдено</li>
          )}
          {matches.map((p, i) => (
            <li key={i} className="search-overlay__item" role="option">
              <Link className="search-overlay__link" to={p.url} onClick={onClose}>
                <span className="search-overlay__item-title">{p.title}</span>
                <span className="search-overlay__item-desc">{p.desc}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}