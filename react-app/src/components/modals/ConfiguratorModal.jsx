import { useState, useEffect } from "react";
import ConfiguratorStep from "./ConfiguratorStep";

export default function ConfiguratorModal({ isOpen, onClose, initialStep = 'config', initialSize, initialFinish }) {
  const [activeStep, setActiveStep] = useState(initialStep);
  const [selections, setSelections] = useState({
    size: initialSize || "",
    finish: initialFinish || "",
    edge: "",
    glass: "",
    lock: "",
    moldingQty: 1
  });

  useEffect(() => {
    if (isOpen) {
      setActiveStep(initialStep);
    }
  }, [isOpen, initialStep]);

  if (!isOpen) return null;

  const handleUpdateSelection = (key, value) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  };

  const steps = [
    { id: "config", label: "Конфигурация" },
    { id: "molding", label: "Погонаж" },
    { id: "hardware", label: "Фурнитура" },
  ];

  return (
    <div className={`modal modal_open`} id="configModal" aria-modal="true" role="dialog" aria-labelledby="configModalTitle">
      <div className="modal__overlay" onClick={onClose} aria-label="Закрыть окно"></div>
      <div className="modal__content modal__content_wide">
        <button type="button" className="modal__close" onClick={onClose} aria-label="Закрыть"></button>
        <h2 id="configModalTitle" className="modal__title">Конфигуратор двери</h2>
        
        <div className="cfg-stepper">
          {steps.map((step, i) => (
            <button 
              key={step.id} 
              className={`cfg-stepper__step ${activeStep === step.id ? 'cfg-stepper__step_active' : ''}`}
              role="tab" 
              aria-selected={activeStep === step.id}
              onClick={() => setActiveStep(step.id)}
            >
              <span className="cfg-stepper__step-num">{i + 1}</span>
              <span className="cfg-stepper__step-text">{step.label}</span>
            </button>
          ))}
        </div>

        <div className="config-panels">
          {activeStep === "config" && (
            <ConfiguratorStep 
              stepId="config" 
              selections={selections} 
              updateSelection={handleUpdateSelection}
            />
          )}
          {activeStep === "molding" && (
            <ConfiguratorStep 
              stepId="molding" 
              selections={selections} 
              updateSelection={handleUpdateSelection}
            />
          )}
          {activeStep === "hardware" && (
            <ConfiguratorStep 
              stepId="hardware" 
              selections={selections} 
              updateSelection={handleUpdateSelection}
            />
          )}
        </div>

        <div className="config-footer">
          <div className="config-footer__total-box">
            <span className="config-footer__total-label">Итого:</span>
            <span className="config-footer__total-price">85 400 ₽</span>
          </div>
          <button type="button" className="product__btn product__btn_cart">Добавить в корзину</button>
        </div>
      </div>
    </div>
  );
}