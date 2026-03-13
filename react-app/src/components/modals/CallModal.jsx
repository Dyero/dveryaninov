import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CallModal({ isOpen, onClose }) {
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    // Add real API logic here
  };

  if (!isOpen) return null;

  return (
    <div className="call-modal" role="dialog" aria-modal="true" aria-labelledby="call-modal-title">
      <div className="call-modal__backdrop" onClick={onClose}></div>
      <div className="call-modal__panel">
        <button type="button" className="call-modal__close" onClick={onClose} aria-label="Закрыть">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
            <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
        <div className="call-modal__icon" aria-hidden="true">
          <img src="/images/0203 vuesax 04 phone.svg" alt="" width="40" height="40" />
        </div>
        <h2 className="call-modal__title" id="call-modal-title">Заказать звонок</h2>
        <p className="call-modal__subtitle">Оставьте свои данные, и мы перезвоним вам в течение 30 минут</p>
        
        <form className="call-modal__form" onSubmit={handleSubmit} noValidate>
          <div className="call-modal__field">
            <label className="call-modal__label" htmlFor="call-name">Ваше имя</label>
            <input className="call-modal__input" type="text" id="call-name" name="name" autoComplete="name" placeholder="Иван Иванов" required />
          </div>
          <div className="call-modal__field">
            <label className="call-modal__label" htmlFor="call-phone">Номер телефона</label>
            <input className="call-modal__input call-modal__input_phone" type="tel" id="call-phone" name="phone" autoComplete="tel" placeholder="+7 (___) ___-__-__" required />
          </div>
          <button type="submit" className="call-modal__submit">Перезвоните мне</button>
        </form>

        {success && (
          <div className="call-modal__success">
            <div className="call-modal__success-icon" aria-hidden="true">&#10003;</div>
            <p className="call-modal__success-text">Заявка принята! Мы перезвоним вам в течение 30 минут.</p>
          </div>
        )}
      </div>
    </div>
  );
}
