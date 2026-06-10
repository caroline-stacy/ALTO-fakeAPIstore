function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}
function setCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}
function logoutUser() {
    localStorage.removeItem("currentUser");
}

function updateCartIcon() {
    const badge = document.getElementById('cart-count');
    if (!badge || typeof Cart === 'undefined') return;
    const count = Cart.load().getTotalCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
}

function renderHeader() {
    const header = document.getElementById("header");
    if (!header) return;
    const user = getCurrentUser();

    header.innerHTML = `
        <div class="header-inner">
            <a href="index.html" class="brand-name">ALTO</a>
            <nav>
                <a href="index.html">Каталог</a>
                <a href="cart.html" class="cart-link">
                    Корзина
                    <span id="cart-count" class="cart-badge"></span>
                </a>
                ${user
                    ? `<span class="user-greeting">Привет, ${user.name}</span>
                       <button id="logout-btn">Выйти</button>`
                    : `<a href="auth.html">Войти</a>`
                }
            </nav>
        </div>
    `;

    if (user) {
        document.getElementById("logout-btn").addEventListener("click", () => {
            logoutUser();
            window.location.reload();
        });
    }
    updateCartIcon();
}

function renderFooter() {
    const footer = document.getElementById("footer");
    if (!footer) return;
    footer.innerHTML = `
        <div class="footer-inner">
            <span class="footer-brand">ALTO</span>
            <span class="footer-divider">·</span>
            <span class="footer-note">Учебный проект на Fake Store API</span>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
});
