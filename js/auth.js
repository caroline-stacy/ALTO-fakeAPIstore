document.addEventListener("DOMContentLoaded", () => {
    if (getCurrentUser()) { window.location.href = 'index.html'; return; }
    setupTabs();
    setupForms();
});

function setupTabs() {
    const showLogin    = document.getElementById('show-login');
    const showRegister = document.getElementById('show-register');
    const loginForm    = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    showLogin.addEventListener('click', () => {
        showLogin.classList.add('active'); showRegister.classList.remove('active');
        loginForm.style.display = 'block'; registerForm.style.display = 'none';
        clearErrors();
    });
    showRegister.addEventListener('click', () => {
        showRegister.classList.add('active'); showLogin.classList.remove('active');
        registerForm.style.display = 'block'; loginForm.style.display = 'none';
        clearErrors();
    });
    showLogin.classList.add('active');
}

function setupForms() {
    document.getElementById('login-btn').addEventListener('click', () => {
        loginUser(document.getElementById('login-email').value.trim(),
                  document.getElementById('login-password').value);
    });
    document.getElementById('register-btn').addEventListener('click', () => {
        registerUser(document.getElementById('reg-name').value.trim(),
                     document.getElementById('reg-email').value.trim(),
                     document.getElementById('reg-password').value);
    });
    document.getElementById('login-password').addEventListener('keydown',  e => { if (e.key === 'Enter') document.getElementById('login-btn').click(); });
    document.getElementById('reg-password').addEventListener('keydown',    e => { if (e.key === 'Enter') document.getElementById('register-btn').click(); });
}

function registerUser(name, email, password) {
    if (!name || !email || !password)     { showError('reg-error', 'Заполните все поля'); return; }
    if (!isValidEmail(email))             { showError('reg-error', 'Некорректный email'); return; }
    if (password.length < 6)             { showError('reg-error', 'Пароль — минимум 6 символов'); return; }
    const users = getStoredUsers();
    if (users.find(u => u.email === email)) { showError('reg-error', 'Email уже занят'); return; }
    const user = new User(name, email, password);
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    setCurrentUser(user);
    window.location.href = 'index.html';
}

function loginUser(email, password) {
    if (!email || !password) { showError('login-error', 'Введите email и пароль'); return; }
    const stored = getStoredUsers().find(u => u.email === email);
    if (!stored)             { showError('login-error', 'Пользователь не найден'); return; }
    if (!new User(stored.name, stored.email, stored.password).checkPassword(password)) {
        showError('login-error', 'Неверный пароль'); return;
    }
    setCurrentUser(stored);
    window.location.href = 'index.html';
}

function getStoredUsers() {
    try { return JSON.parse(localStorage.getItem('users') || '[]'); } catch { return []; }
}
function showError(id, msg) { const el = document.getElementById(id); if (el) el.textContent = msg; }
function clearErrors() { ['login-error','reg-error'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = ''; }); }
function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
