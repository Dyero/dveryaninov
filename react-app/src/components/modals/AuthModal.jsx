import { useState } from 'react';

export default function AuthModal({ isOpen, onClose }) {
  const [tab, setTab] = useState('login'); // 'login' or 'register'

  if (!isOpen) return null;

  return (
    <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <div className="auth-modal__backdrop" onClick={onClose}></div>
      <div className="auth-modal__panel">
        <div className="auth-modal__header">
          <h2 className="auth-modal__title" id="auth-modal-title">Личный кабинет</h2>
          <button type="button" className="auth-modal__close" onClick={onClose} aria-label="Закрыть">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
              <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className="auth-modal__tabs">
          <button 
            className={`modal__tab ${tab === 'login' ? 'modal__tab_active' : ''}`}
            type="button" 
            onClick={() => setTab('login')}
          >
            Войти
          </button>
          <button 
            className={`modal__tab ${tab === 'register' ? 'modal__tab_active' : ''}`}
            type="button" 
            onClick={() => setTab('register')}
          >
            Регистрация
          </button>
        </div>

        {tab === 'login' && (
          <div>
            <form className="auth-form" noValidate>
              <div className="auth-form__field">
                <label className="auth-form__label" htmlFor="login-email">Email</label>
                <input className="auth-form__input" type="email" id="login-email" name="email" autoComplete="email" required />
              </div>
              <div className="auth-form__field">
                <label className="auth-form__label" htmlFor="login-password">Пароль</label>
                <input className="auth-form__input" type="password" id="login-password" name="password" autoComplete="current-password" required />
              </div>
              <button type="submit" className="auth-form__btn">Войти</button>
            </form>
          </div>
        )}

        {tab === 'register' && (
          <div>
            <form className="auth-form" noValidate>
              <div className="auth-form__field">
                <label className="auth-form__label" htmlFor="reg-name">Имя</label>
                <input className="auth-form__input" type="text" id="reg-name" name="name" autoComplete="name" required />
              </div>
              <div className="auth-form__field">
                <label className="auth-form__label" htmlFor="reg-email">Email</label>
                <input className="auth-form__input" type="email" id="reg-email" name="email" autoComplete="email" required />
              </div>
              <div className="auth-form__field">
                <label className="auth-form__label" htmlFor="reg-password">Пароль</label>
                <input className="auth-form__input" type="password" id="reg-password" name="password" autoComplete="new-password" required />
              </div>
              <button type="submit" className="auth-form__btn">Зарегистрироваться</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}