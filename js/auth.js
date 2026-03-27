(function () {
  'use strict';

  var USERS_KEY   = 'dv_users';
  var SESSION_KEY = 'dv_session';
  var ORDERS_KEY  = 'dv_orders';

  /* ---- Storage helpers ---- */
  function parse(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch (e) { return fallback; }
  }
  function store(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  function getUsers()   { return parse(USERS_KEY, []); }
  function setUsers(u)  { store(USERS_KEY, u); }
  function getSession() { return parse(SESSION_KEY, null); }

  /* ---- Preset user ---- */
  (function initPresets() {
    var users = getUsers();
    if (!users.some(function (u) { return u.email === 'konstantin@mail.ru'; })) {
      users.push({
        id: 'u-konstantin',
        name: 'Константин',
        email: 'konstantin@mail.ru',
        password: 'konstantin21'
      });
      setUsers(users);
    }
  }());

  /* ---- Auth API ---- */
  function isLoggedIn()    { return !!getSession(); }
  function getCurrentUser(){ return getSession(); }

  function login(email, password) {
    var users = getUsers();
    var user  = null;
    for (var i = 0; i < users.length; i++) {
      if (users[i].email.toLowerCase() === email.toLowerCase() &&
          users[i].password === password) {
        user = users[i]; break;
      }
    }
    if (!user) return { ok: false, error: 'Неверный логин или пароль' };
    var sess = { id: user.id, name: user.name, email: user.email, phone: user.phone || '' };
    store(SESSION_KEY, sess);
    return { ok: true, user: sess };
  }

  function register(name, email, password) {
    if (!name || !email || !password) return { ok: false, error: 'Заполните все поля' };
    var users = getUsers();
    if (users.some(function (u) { return u.email.toLowerCase() === email.toLowerCase(); })) {
      return { ok: false, error: 'Email уже используется' };
    }
    var user = { id: 'u-' + Date.now(), name: name, email: email, password: password };
    users.push(user);
    setUsers(users);
    var sess = { id: user.id, name: user.name, email: user.email };
    store(SESSION_KEY, sess);
    return { ok: true, user: sess };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'index.html';
  }

  /* ---- Orders ---- */
  function getAllOrders() { return parse(ORDERS_KEY, []); }

  function saveOrder(cartItems) {
    var user = getSession();
    if (!user) return null;
    var orders = getAllOrders();
    var total  = cartItems.reduce(function (s, it) {
      return s + (Number(it.price) || 0) * (Number(it.qty) || 1);
    }, 0);
    var order = {
      id:     'ord-' + Date.now(),
      userId: user.id,
      date:   new Date().toLocaleDateString('ru-RU'),
      items:  cartItems,
      total:  total,
      status: 'Принят'
    };
    orders.unshift(order);
    store(ORDERS_KEY, orders);
    return order;
  }

  function getUserOrders() {
    var user = getSession();
    if (!user) return [];
    return getAllOrders().filter(function (o) { return o.userId === user.id; });
  }

  function updateProfile(newName, newEmail, newPhone, newPassword, currentPassword) {
    var sess  = getSession();
    if (!sess) return { ok: false, error: 'Не авторизован' };
    var users = getUsers();
    var idx   = -1;
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === sess.id) { idx = i; break; }
    }
    if (idx === -1) return { ok: false, error: 'Пользователь не найден' };
    var user = users[idx];
    if (newPassword) {
      if (!currentPassword || user.password !== currentPassword) {
        return { ok: false, error: 'Неверный текущий пароль' };
      }
      user.password = newPassword;
    }
    if (newEmail && newEmail !== user.email) {
      var taken = users.some(function(u, j) {
        return j !== idx && u.email.toLowerCase() === newEmail.toLowerCase();
      });
      if (taken) return { ok: false, error: 'Email уже используется' };
      user.email = newEmail;
    }
    if (newName) user.name = newName;
    if (newPhone !== undefined) user.phone = newPhone;
    users[idx] = user;
    setUsers(users);
    var newSess = { id: user.id, name: user.name, email: user.email, phone: user.phone || '' };
    store(SESSION_KEY, newSess);
    return { ok: true, user: newSess };
  }

  /* ---- HTML escape ---- */
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* ---- Header UI ---- */
  function updateHeaderUI() {
    var btn = document.querySelector('#.header__profile-btn');
    if (!btn) return;
    var user = getSession();
    if (user) {
      var link = document.createElement('a');
      link.className = 'header__icon-btn header__profile-link';
      link.href      = 'account.html';
      link.setAttribute('aria-label', 'Личный кабинет');
      link.innerHTML = '<span class="header__user-name">' + esc(user.name) + '</span>';
      btn.parentNode.replaceChild(link, btn);
    }
  }

  /* ---- Auth modal ---- */
  function openAuthModal(callback) {
    window._dvAuthCb = callback || null;
    var modal = document.querySelector('#auth-modal');
    if (!modal) return;
    // Reset error messages
    modal.querySelectorAll('.auth-form__error').forEach(function (el) { el.textContent = ''; });
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    // Switch to login tab by default
    switchTab(modal, 'login');
    var first = modal.querySelector('[data-auth-panel="login"] input');
    if (first) setTimeout(function () { first.focus(); }, 50);
  }

  function closeAuthModal() {
    var modal = document.querySelector('#auth-modal');
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
  }

  function switchTab(modal, target) {
    modal.querySelectorAll('[data-auth-tab]').forEach(function (t) {
      var active = t.getAttribute('data-auth-tab') === target;
      t.classList.toggle('modal__tab_active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    modal.querySelectorAll('[data-auth-panel]').forEach(function (p) {
      p.hidden = p.getAttribute('data-auth-panel') !== target;
    });
  }

  function afterAuthSuccess() {
    updateHeaderUI();
    closeAuthModal();
    var cb = window._dvAuthCb;
    if (cb) { window._dvAuthCb = null; cb(); }
    else window.location.href = 'account.html';
  }

  function initAuthModal() {
    var modal = document.querySelector('#auth-modal');
    if (!modal) return;

    // Tabs
    modal.querySelectorAll('[data-auth-tab]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        switchTab(modal, tab.getAttribute('data-auth-tab'));
      });
    });

    // Close
    modal.querySelectorAll('[data-close-auth]').forEach(function (btn) {
      btn.addEventListener('click', closeAuthModal);
    });
    var backdrop = modal.querySelector('.auth-modal__backdrop');
    if (backdrop) backdrop.addEventListener('click', closeAuthModal);

    // Login form
    var loginForm = document.querySelector('#login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var emailEl = loginForm.querySelector('[name="email"]');
        var passEl  = loginForm.querySelector('[name="password"]');
        var errEl   = loginForm.querySelector('.auth-form__error');
        var res     = login(emailEl.value.trim(), passEl.value);
        if (!res.ok) { if (errEl) errEl.textContent = res.error; return; }
        if (errEl) errEl.textContent = '';
        afterAuthSuccess();
      });
    }

    // Register form
    var regForm = document.querySelector('#register-form');
    if (regForm) {
      regForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var nameEl  = regForm.querySelector('[name="reg-name"]');
        var emailEl = regForm.querySelector('[name="reg-email"]');
        var passEl  = regForm.querySelector('[name="reg-password"]');
        var errEl   = regForm.querySelector('.auth-form__error');
        var res     = register(nameEl.value.trim(), emailEl.value.trim(), passEl.value);
        if (!res.ok) { if (errEl) errEl.textContent = res.error; return; }
        if (errEl) errEl.textContent = '';
        afterAuthSuccess();
      });
    }

    // ESC to close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
        closeAuthModal();
      }
    });
  }

  /* ---- Profile button global click ---- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.header__profile-btn');
    if (!btn) return;
    e.preventDefault();
    if (isLoggedIn()) {
      window.location.href = 'account.html';
    } else {
      openAuthModal(function () { window.location.href = 'account.html'; });
    }
  });

  /* ---- Public API ---- */
  window.DvAuth = {
    isLoggedIn:     isLoggedIn,
    getCurrentUser: getCurrentUser,
    login:          login,
    register:       register,
    logout:         logout,
    saveOrder:      saveOrder,
    getUserOrders:  getUserOrders,
    updateProfile:  updateProfile,
    openAuthModal:  openAuthModal,
    closeAuthModal: closeAuthModal,
    updateHeaderUI: updateHeaderUI,
    initAuthModal:  initAuthModal
  };

}());
