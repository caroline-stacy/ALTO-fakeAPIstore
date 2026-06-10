document.addEventListener("DOMContentLoaded", async () => {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) { window.location.href = 'index.html'; return; }

    await renderProduct(id);

    document.getElementById('to-catalog').addEventListener('click', () => { window.location.href = 'index.html'; });
    document.getElementById('to-cart').addEventListener('click',    () => { window.location.href = 'cart.html'; });
});

async function renderProduct(id) {
    const container = document.getElementById('product-details');
    container.innerHTML = '<p class="loading">Загружаем товар…</p>';

    const data = await getProductById(id);
    const product = new Product(data.id, data.title, data.price, data.description, data.image, data.category, data.rating);
    const catClass = product.getCategoryClass();

    // Определяем цвет бейджа категории
    const catColors = {
        'cat-electronics': { bg: 'var(--c-elec-bg)',   color: 'var(--c-elec)' },
        'cat-jewelry':     { bg: 'var(--c-jewel-bg)',  color: 'var(--c-jewel)' },
        'cat-men':         { bg: 'var(--c-men-bg)',    color: 'var(--c-men)' },
        'cat-women':       { bg: 'var(--c-women-bg)',  color: 'var(--c-women)' },
    };
    const cc = catColors[catClass] || { bg: 'var(--surface-2)', color: 'var(--text-muted)' };

    container.innerHTML = `
        <div class="product-page">
            <div class="product-img-wrapper">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <span class="product-cat-badge" style="background:${cc.bg}; color:${cc.color}">
                    ${product.category}
                </span>
                <h2>${product.title}</h2>
                <div class="product-stars">${product.renderStars()}</div>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-desc">${product.description}</p>
                <button id="add-to-cart-btn" class="btn btn-primary">Добавить в корзину</button>
            </div>
        </div>
    `;

    document.getElementById('add-to-cart-btn').addEventListener('click', () => addToCart(product));
}

function addToCart(product) {
    const cart = Cart.load();
    cart.addItem({ id: product.id, price: product.price, title: product.title, image: product.image });
    cart.save();
    updateCartIcon();

    const btn = document.getElementById('add-to-cart-btn');
    btn.textContent = '✓ Добавлено в корзину';
    btn.classList.add('btn-success');
    btn.disabled = true;
    setTimeout(() => {
        btn.textContent = 'Добавить в корзину';
        btn.classList.remove('btn-success');
        btn.disabled = false;
    }, 2200);
}
