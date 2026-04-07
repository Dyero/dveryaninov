/**
 * CONFIGURATOR SPEC — Дверянинов
 * Данные зависимостей, цен, ограничений
 * Версия 1.0
 */
window.DVERYANINOV_CFG = (function () {

  /* ────────────────────────────────────────────
   * 0. Покрытие: допустимые типы по коллекциям
   * ──────────────────────────────────────────── */
  var COATING_RULES = {
    "Д":      ["ПВХ"],
    "Плиссе": ["ПВХ"],
    "Флай":   ["ПВХ"],
    "Мета":   ["ПВХ", "ПЭТ"],
    "Модена": ["ПВХ", "ПЭТ"],
    _default: ["ПВХ", "ПЭТ", "Эмаль"]
  };

  /* Наценка за Эмаль поверх базовой цены */
  var ENAMEL_SURCHARGE = { pg: 12780, po: 14200 };

  /* ────────────────────────────────────────────
   * 0.2  45 цветов ПВХ для коллекции Флай
   * ──────────────────────────────────────────── */
  var FLY_PVH_COLORS = [
    "Керамик матовый","Бланж","Белый матовый","Велутто ваниль","Оливин",
    "Керамик капучино","Мерино","Керамик серый","Керамик какао","Платина",
    "Антрацит","Лофт","Квазар","Кварц айс","Кварц лайт грей",
    "Кварц беж","Кварц грей","Ясень белый софт","Сканди айвори","Дуб сиена белый",
    "Платан шоколадный","Монте рустик","Монте тиберио","Дуб бодега светлый","Дуб мавелла",
    "Орех светлый","Дуб бодега натуральный","Карагач светлый","Липа амурская","Дуб бодега золотой",
    "Мербау","Орех пекан медовый","Орех пекан шоколад","Шпон ясеня голд","Макассар",
    "Венге премиум","Ясень капучино","Ясень грей","Ясень графит","Дуб пудра",
    "Дуб аквамарин","Дуб болотный","Дюна норд","Дюна бриз","Дюна мистраль"
  ];

  /* ────────────────────────────────────────────
   * 1.1  Размер полотна
   * ──────────────────────────────────────────── */
  var SIZES = [
    "2000×400","2000×550","2000×580","2000×590","2000×600",
    "2000×680","2000×690","2000×700","2000×780","2000×790","2000×800","2000×900",
    "Свой размер"
  ];

  /* Наценка за ширину 900 мм при остеклении */
  var WIDTH_900_PO_SURCHARGE = 860;

  /* Ограничение высоты по коллекции */
  var MAX_HEIGHT = { "Флай": 2100, _default: 2750 };

  /* ────────────────────────────────────────────
   * 1.2  Остекление
   * ──────────────────────────────────────────── */
  var GLASSES_COMMON = [
    { name: "Сатинато белое",      price: 0,     img: "images/Стёкла/Сатинато белое 1.png" },
    { name: "Сатинато бронза",     price: 0,     img: "images/Стёкла/Сатинато бронза 1.png" },
    { name: "Сатинато графит",     price: 0,     img: "images/Стёкла/Сатинато графит 1.png" },
    { name: "Рефлектив серебро",   price: 0,     img: "images/Стёкла/Рефлектив серебро 1.png" },
    { name: "Бронза",              price: 0,     img: "images/Стёкла/Бронза 1.png" },
    { name: "Грей",                price: 0,     img: "images/Стёкла/Грей 1.png" },
    { name: "Флутс прозрачный",    price: 12400, img: "images/Стёкла/Флутс прозрачный 1.png" },
    { name: "Флутс графит",        price: 12400, img: "images/Стёкла/Флутс грей 1.png" }
  ];

  var GLASSES_MARBLE = [
    { name: "Мрамор белый",   price: 0, img: "" },
    { name: "Мрамор чёрный",  price: 0, img: "" },
    { name: "Мрамор бежевый", price: 0, img: "" }
  ];

  /* Коллекция Д — специальные стёкла (Черный/Белый триплекс) */
  var GLASSES_D_EXTRA = {
    "Д4-Д22":  [
      { name: "Черный триплекс", price: 2790, img: "" },
      { name: "Белый триплекс",  price: 2790, img: "" }
    ],
    "Д36-Д50": [
      { name: "Черный триплекс", price: 1550, img: "" },
      { name: "Белый триплекс",  price: 1550, img: "" }
    ]
  };

  /* Амери — допы */
  var GLASSES_AMERI_EXTRA = [
    { name: "Рефлект с фацетом",          price: 4650, img: "" },
    { name: "Сатинато белое с фацетом",    price: 4650, img: "" }
  ];

  /**
   * Возвращает набор доступных стёкол для данной коллекции и модели.
   * @param {string} coll  — название коллекции
   * @param {string} model — название модели (напр. «Ультра 4», «Д14»)
   * @returns {Array<{name,price,img}>}
   */
  function getGlasses(coll, model) {
    // Ультра 4 / 5 — только Мрамор
    if (/^Ультра\s*(4|5)$/i.test(model)) return GLASSES_MARBLE.slice();

    // Альберта — pending
    if (coll === "Альберта") return [];

    var list = [];

    // Д — свой набор
    if (coll === "Д") {
      var base = GLASSES_COMMON.filter(function (g) {
        return /Сатинато|Рефлектив/.test(g.name);
      });
      list = list.concat(base);
      // определяем диапазон модели
      var num = parseInt((model.match(/\d+/) || ["0"])[0], 10);
      if (num >= 4 && num <= 22) list = list.concat(GLASSES_D_EXTRA["Д4-Д22"]);
      else if (num >= 36 && num <= 50) list = list.concat(GLASSES_D_EXTRA["Д36-Д50"]);
      return list;
    }

    // Флай — без Флутс, без Мрамор
    if (coll === "Флай") {
      return GLASSES_COMMON.filter(function (g) {
        return !/Флутс|Мрамор/.test(g.name);
      });
    }

    // Амери — стандартные + фацеты
    if (coll === "Амери") {
      return GLASSES_COMMON.concat(GLASSES_AMERI_EXTRA);
    }

    // Все остальные — полный набор
    return GLASSES_COMMON.slice();
  }

  /* ────────────────────────────────────────────
   * 1.3  Гравировка
   * ──────────────────────────────────────────── */
  var ENGRAVING_COLLECTIONS = [
    "Бона","Белуни","Бонеко","Декар","Декар с багетом",
    "Кант","Каскад","Квант","Нео","Оазис","Ультра","Этерна"
  ];
  var ENGRAVING_OPTIONS = [
    { name: "Контур",              price: 1860 },
    { name: "Английская решётка",  price: 1860 },
    { name: "Ромб",                price: 1860 },
    { name: "Без гравировки",      price: 0 }
  ];

  function isEngravingAvailable(coll, glazingName) {
    if (ENGRAVING_COLLECTIONS.indexOf(coll) === -1) return false;
    return /Сатинато/i.test(glazingName || "");
  }

  /* ────────────────────────────────────────────
   * 1.4  Алюминиевая кромка
   * ──────────────────────────────────────────── */
  var ALU_BLOCKED = ["Флай", "Д", "Плиссе"];

  var ALU_EDGE = [
    { type: "Продольная", color: "Матовый хром",   price: 1710 },
    { type: "Продольная", color: "Чёрный",         price: 2170 },
    { type: "Продольная", color: "Матовое золото", price: 2640 },
    { type: "По периметру", color: "Матовый хром",   price: 2640 },
    { type: "По периметру", color: "Чёрный",         price: 3100 },
    { type: "По периметру", color: "Матовое золото", price: 3570 },
    { type: "Без кромки",   color: "",               price: 0 }
  ];

  /* ────────────────────────────────────────────
   * 1.5  Молдинги
   * ──────────────────────────────────────────── */
  var MOLDINGS_RULES = {
    "Амфора":    [
      { color: "Матовый хром", price: 0 },
      { color: "Чёрный",       price: 0 },  // уточнить
      { color: "Матовое золото", price: 470 },
      { color: "Шампань",      price: 0 }   // уточнить
    ],
    "Квант":     [
      { color: "Матовый хром", price: 0 },
      { color: "Чёрный",       price: 0 },  // уточнить
      { color: "Матовое золото", price: 0 }  // уточнить
    ],
    "Моно 1-8":  [
      { color: "Матовый хром", price: 0 },
      { color: "Чёрный",       price: 0 },  // уточнить
      { color: "Матовое золото", price: 470 },
      { color: "Шампань",      price: 0 }   // уточнить
    ],
    "Моно 9-12": [
      { color: "Матовый хром", price: 0 },
      { color: "Чёрный",       price: 470 },
      { color: "Матовое золото", price: 0 }  // уточнить
    ]
  };

  /**
   * @param {string} coll
   * @param {string} model — «Моно 3», «Моно 10», «Амфора 2»
   */
  function getMoldings(coll, model) {
    if (coll === "Амфора") return MOLDINGS_RULES["Амфора"];
    if (coll === "Квант")  return MOLDINGS_RULES["Квант"];
    if (coll === "Моно") {
      var n = parseInt((model.match(/\d+/) || ["0"])[0], 10);
      return n >= 9 ? MOLDINGS_RULES["Моно 9-12"] : MOLDINGS_RULES["Моно 1-8"];
    }
    return null; // скрыть
  }

  /* ────────────────────────────────────────────
   * 1.6  Вариант открывания
   * ──────────────────────────────────────────── */
  var OPENING = [
    { name: "Распашная",   price: 0 },
    { name: "Раздвижная",  price: 5000 }
  ];

  /* ────────────────────────────────────────────
   * 2.  ПОГОНАЖ
   * ──────────────────────────────────────────── */

  /* 2.1  Стойка короба */
  var BOX_TYPES = {
    pvh: [
      { name: "Телескопическая (комплект 2.5 шт)", price: 3450 },
      { name: "Компланарная (комплект 2.5 шт)",    price: 3680 }
    ],
    enamel: [
      { name: "Телескопическая (комплект 2.5 шт)", price: 4980 },
      { name: "Компланарная (комплект 2.5 шт)",    price: 5380 }
    ]
  };

  /* 2.2 / 2.3  Наличники */
  /* Ключ: "{boxType}_{coatingGroup}_{collection_group}" */
  /* collection_group: "standard", "dekar", "avrora_ameri" */
  /* Для "Декар" и "Декар с багетом": dekar */
  /* Для "Аврора" и "Амери": avrora_ameri */

  var CASINGS = {
    /* ── Телескоп ПВХ/ПЭТ ── */
    "tele_pvh_standard": [
      { name: "Телескоп (2200×80) прод. + попер.", price: 2030 }
    ],
    "tele_pvh_dekar": [
      { name: "Телескоп (2200×80) прод. + попер.",       price: 2030 },
      { name: "Телескоп плюс (2200×80) прод. + попер.",  price: 2130 },
      { name: "Телескоп (2200×100) прод. + попер.",      price: 2900 },
      { name: "Телескоп декоративный (2200×70)",         price: 3850 }
    ],
    "tele_pvh_avrora_ameri": [
      { name: "Телескоп плюс (2200×80) прод. + попер.",  price: 2130 },
      { name: "Телескоп (2200×100) прод. + попер.",      price: 2900 },
      { name: "Телескоп декоративный тип 11 (2400×100)", price: 7580 },
      { name: "Телескоп декоративный тип 10 (2200×100)", price: 5510 }
    ],

    /* ── Телескоп Эмаль ── */
    "tele_enamel_standard": [
      { name: "Телескоп (2200×80) прод. + попер.", price: 3150 }
    ],
    "tele_enamel_dekar": [
      { name: "Телескоп (2200×80) прод. + попер.",       price: 3150 },
      { name: "Телескоп плюс (2200×80) прод. + попер.",  price: 3200 },
      { name: "Телескоп (2200×100) прод. + попер.",      price: 4780 },
      { name: "Телескоп декоративный (2200×70)",         price: 5600 }
    ],
    "tele_enamel_avrora_ameri": [
      { name: "Телескоп плюс (2200×80) прод. + попер.",  price: 3200 },
      { name: "Телескоп (2200×100) прод. + попер.",      price: 4780 },
      { name: "Телескоп декоративный тип 11 (2400×100)", price: 10590 },
      { name: "Телескоп декоративный тип 10 (2200×100)", price: 8530 }
    ],

    /* ── Компланар ПВХ/ПЭТ ── */
    "comp_pvh_standard": [
      { name: "Компланар (2200×80)", price: 2030 }
    ],

    /* ── Компланар Эмаль ── */
    "comp_enamel_standard": [
      { name: "Компланар (2200×80)", price: 3230 }
    ]
  };

  /* 2.3 — Вторая сторона наличника */
  var CASINGS_SIDE2 = {
    /* Телескоп ПВХ/ПЭТ */
    "tele_pvh_standard_s2": [
      { name: "Телескоп (2200×80) прод. + попер.", price: 2030 },
      { name: "Без наличника", price: 0 }
    ],
    "tele_pvh_avrora_ameri_s2": [
      { name: "Телескоп (2200×80) прод. + попер.",       price: 2030 },
      { name: "Телескоп плюс (2200×80) прод. + попер.",  price: 2130 },
      { name: "Телескоп (2200×100) прод. + попер.",      price: 2900 },
      { name: "Телескоп декоративный (2200×70)",         price: 3850 },
      { name: "Телескоп декоративный тип 10 (2200×100)", price: 5510 },
      { name: "Без наличника", price: 0 }
    ],
    /* Телескоп Эмаль */
    "tele_enamel_standard_s2": [
      { name: "Телескоп (2200×80) прод. + попер.", price: 3150 },
      { name: "Без наличника", price: 0 }
    ],
    "tele_enamel_avrora_ameri_s2": [
      { name: "Телескоп (2200×80) прод. + попер.",       price: 3150 },
      { name: "Телескоп плюс (2200×80) прод. + попер.",  price: 3200 },
      { name: "Телескоп (2200×100) прод. + попер.",      price: 4780 },
      { name: "Телескоп декоративный (2200×70)",         price: 5600 },
      { name: "Телескоп декоративный тип 10 (2200×100)", price: 8530 },
      { name: "Без наличника", price: 0 }
    ],
    /* Компланар ПВХ/ПЭТ */
    "comp_pvh_standard_s2": [
      { name: "Телескоп (2200×80) прод. + попер.",      price: 2030 },
      { name: "Телескоп плюс (2200×80) прод. + попер.", price: 2130 },
      { name: "Без наличника", price: 0 }
    ],
    /* Компланар Эмаль */
    "comp_enamel_standard_s2": [
      { name: "Телескоп (2200×80) прод. + попер.",      price: 3200 },
      { name: "Телескоп плюс (2200×80) прод. + попер.", price: 3150 },
      { name: "Без наличника", price: 0 }
    ]
  };

  /**
   * Определить группу коллекции для наличников
   */
  function casingCollGroup(coll) {
    if (coll === "Декар" || coll === "Декар с багетом") return "dekar";
    if (coll === "Аврора" || coll === "Амери") return "avrora_ameri";
    return "standard";
  }

  /**
   * Получить ключ для выбора наличника
   * @param {string} boxType — "Телескопическая" | "Компланарная"
   * @param {string} coatingType — "ПВХ" | "ПЭТ" | "Эмаль"
   * @param {string} coll — название коллекции
   * @param {boolean} side2 — вторая сторона?
   * @returns {string} ключ для CASINGS / CASINGS_SIDE2
   */
  function casingKey(boxType, coatingType, coll, side2) {
    var box = /Компланар/i.test(boxType) ? "comp" : "tele";
    var ct = coatingType === "Эмаль" ? "enamel" : "pvh";
    var grp = box === "comp" ? "standard" : casingCollGroup(coll);
    var key = box + "_" + ct + "_" + grp;
    if (side2) key += "_s2";
    return key;
  }

  function getCasings(boxType, coatingType, coll) {
    var key = casingKey(boxType, coatingType, coll, false);
    return CASINGS[key] || CASINGS["tele_pvh_standard"];
  }

  function getCasingsSide2(boxType, coatingType, coll) {
    var key = casingKey(boxType, coatingType, coll, true);
    return CASINGS_SIDE2[key] || CASINGS_SIDE2["tele_pvh_standard_s2"];
  }

  /* 2.4  Добор */
  var DOBOR = {
    pvh: [
      { name: "Телескопический тип 2 (2200×100×10), компл. 3 шт", price: 2880 },
      { name: "Телескопический тип 2 (2200×150×10), компл. 3 шт", price: 3960 },
      { name: "Телескопический тип 2 (2200×200×10), компл. 3 шт", price: 4890 },
      { name: "Телескопический тип 2 (Свой размер), компл. 3 шт", price: 0, priceRequest: true },
      { name: "Без добора", price: 0 }
    ],
    enamel: [
      { name: "Телескопический тип 2 (2200×100×10), компл. 3 шт", price: 4620 },
      { name: "Телескопический тип 2 (2200×150×10), компл. 3 шт", price: 6930 },
      { name: "Телескопический тип 2 (2200×200×10), компл. 3 шт", price: 9240 },
      { name: "Телескопический тип 2 (Свой размер), компл. 3 шт", price: 0, priceRequest: true },
      { name: "Без добора", price: 0 }
    ]
  };

  /* 2.5  Д дополнительно */
  var EXTRAS = {
    pvh: {
      porog:   { name: "Порог (2200×75×35 мм), шт",    price: 1330 },
      plintus: { name: "Плинтус (2070×80×12 мм), шт",  price: 1150 }
    },
    enamel: {
      porog:   { name: "Порог (2200×75×35 мм), шт",    price: 1940 },
      plintus: { name: "Плинтус (2070×80×12 мм), шт",  price: 1900 }
    }
  };

  /* Порог — только при телескопической стойке */
  function isPorogAvailable(boxType) {
    return /Телескоп/i.test(boxType);
  }

  /* ────────────────────────────────────────────
   * Утилиты
   * ──────────────────────────────────────────── */
  function coatingGroup(coatingType) {
    return coatingType === "Эмаль" ? "enamel" : "pvh";
  }

  function getAllowedCoatings(coll) {
    return COATING_RULES[coll] || COATING_RULES._default;
  }

  /* ────────────────────────────────────────────
   * Публичный API
   * ──────────────────────────────────────────── */
  return {
    COATING_RULES: COATING_RULES,
    ENAMEL_SURCHARGE: ENAMEL_SURCHARGE,
    FLY_PVH_COLORS: FLY_PVH_COLORS,
    SIZES: SIZES,
    WIDTH_900_PO_SURCHARGE: WIDTH_900_PO_SURCHARGE,
    MAX_HEIGHT: MAX_HEIGHT,
    GLASSES_COMMON: GLASSES_COMMON,
    GLASSES_MARBLE: GLASSES_MARBLE,
    GLASSES_D_EXTRA: GLASSES_D_EXTRA,
    GLASSES_AMERI_EXTRA: GLASSES_AMERI_EXTRA,
    ENGRAVING_COLLECTIONS: ENGRAVING_COLLECTIONS,
    ENGRAVING_OPTIONS: ENGRAVING_OPTIONS,
    ALU_BLOCKED: ALU_BLOCKED,
    ALU_EDGE: ALU_EDGE,
    MOLDINGS_RULES: MOLDINGS_RULES,
    OPENING: OPENING,
    BOX_TYPES: BOX_TYPES,
    CASINGS: CASINGS,
    CASINGS_SIDE2: CASINGS_SIDE2,
    DOBOR: DOBOR,
    EXTRAS: EXTRAS,

    getGlasses: getGlasses,
    isEngravingAvailable: isEngravingAvailable,
    getMoldings: getMoldings,
    getCasings: getCasings,
    getCasingsSide2: getCasingsSide2,
    isPorogAvailable: isPorogAvailable,
    coatingGroup: coatingGroup,
    getAllowedCoatings: getAllowedCoatings,
    casingKey: casingKey
  };
})();
