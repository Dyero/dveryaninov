<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
?>

    <!-- Auth modal -->
    <div class="auth-modal" id="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" aria-hidden="true">
        <div class="auth-modal__backdrop"></div>
        <div class="auth-modal__panel">
            <div class="auth-modal__header">
                <h2 class="auth-modal__title" id="auth-modal-title">Личный кабинет</h2>
                <button type="button" class="auth-modal__close" data-close-auth aria-label="Закрыть">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                        <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </button>
            </div>
            <div class="auth-modal__tabs">
                <button class="modal__tab modal__tab_active" type="button" data-auth-tab="login" aria-selected="true">Войти</button>
                <button class="modal__tab" type="button" data-auth-tab="register" aria-selected="false">Регистрация</button>
            </div>
            <div data-auth-panel="login">
                <form class="auth-form" id="login-form" novalidate>
                    <div class="auth-form__field">
                        <label class="auth-form__label" for="login-email">Email</label>
                        <input class="auth-form__input" type="email" id="login-email" name="email" autocomplete="email" required>
                    </div>
                    <div class="auth-form__field">
                        <label class="auth-form__label" for="login-password">Пароль</label>
                        <input class="auth-form__input" type="password" id="login-password" name="password" autocomplete="current-password" required>
                    </div>
                    <div class="auth-form__error" aria-live="polite"></div>
                    <button type="submit" class="auth-form__btn">Войти</button>
                </form>
            </div>
            <div data-auth-panel="register" hidden>
                <form class="auth-form" id="register-form" novalidate>
                    <div class="auth-form__field">
                        <label class="auth-form__label" for="reg-name">Имя</label>
                        <input class="auth-form__input" type="text" id="reg-name" name="reg-name" autocomplete="name" required>
                    </div>
                    <div class="auth-form__field">
                        <label class="auth-form__label" for="reg-email">Email</label>
                        <input class="auth-form__input" type="email" id="reg-email" name="reg-email" autocomplete="email" required>
                    </div>
                    <div class="auth-form__field">
                        <label class="auth-form__label" for="reg-password">Пароль</label>
                        <input class="auth-form__input" type="password" id="reg-password" name="reg-password" autocomplete="new-password" required>
                    </div>
                    <div class="auth-form__error" aria-live="polite"></div>
                    <button type="submit" class="auth-form__btn">Зарегистрироваться</button>
                </form>
            </div>
        </div>
    </div>

</body>
</html>
