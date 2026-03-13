import { useState } from "react";

export default function ConfiguratorStep({ stepId, selections, updateSelection }) {
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (id) => {
    setOpenAccordion(prev => prev === id ? null : id);
  };

  const configData = {
    config: [
      {
        id: "size",
        title: "Размер полотна",
        options: ["2000х600", "2000х700", "2000х800", "2000х900"]
      },
      {
        id: "finish",
        title: "Покрытие",
        options: ["RAL 9003", "Дуб", "Венге", "Орех"]
      },
      {
        id: "glass",
        title: "Остекление",
        options: ["Прозрачное", "Матовое", "Стекло Графит"]
      },
      {
        id: "kromochniy",
        title: "Кромка",
        options: ["Без кромки", "Кромка AL", "Кромка Черная"]
      }
    ],
    molding: [
      {
        id: "moldingType",
        title: "Тип погонажа",
        options: ["Стандартный", "Телескопический"]
      },
      {
        id: "cornice",
        title: "Карниз",
        options: ["Без карниза", "С карнизом"]
      }
    ],
    hardware: [
      {
        id: "lock",
        title: "Тип замка",
        options: ["Магнитный (WC)", "Механический цилиндр", "Под ключ"]
      },
      {
        id: "hinges",
        title: "Петли",
        options: ["Скрытые (Италия)", "Накладные (Бабочка)"]
      },
      {
        id: "handle",
        title: "Ручка",
        options: ["Куба", "Призма", "Сторм"]
      }
    ]
  };

  const fields = configData[stepId] || [];

  return (
    <div className="config-step-panel">
      {fields.map(field => {
        const isOpen = openAccordion === field.id;
        const selectedValue = selections[field.id];

        return (
          <div key={field.id} className="config-detail-item">
            <button
              type="button"
              className="config-detail-toggle"
              aria-expanded={isOpen}
              onClick={() => toggleAccordion(field.id)}
            >
              <h3 className="config-detail-title">{field.title}</h3>
              <span className="config-detail-val">{selectedValue || "Не выбрано"}</span>
              <span className="config-detail-arrow" aria-hidden="true"></span>
            </button>
            <div
              className={`config-detail-options ${isOpen ? "is-open" : ""}`}
              id={`${field.id}-options`}
            >
              <div className="config-detail-grid">
                {field.options.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={`config-chip ${selectedValue === opt ? "config-chip_active" : ""}`}
                    onClick={() => {
                      updateSelection(field.id, opt);
                      // Auto-close on selection to match smooth UI UX
                      setOpenAccordion(null);
                    }}
                  >
                    <span>{opt}</span>
                    <span className="config-chip-price">+ 0 ₽</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}