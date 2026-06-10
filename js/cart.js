document.addEventListener("DOMContentLoaded", () => { renderCart(); });

function renderCart() {
    const cart = Cart.load();
    const container = document.getElementById('cart-items');
    const totalEl   = document.getElementById('cart-total');

    if (cart.items.length === 0) {
        container.innerHTML = `
            <div class="empty">
                <span>Корзина пуста</span>
                <a href="index.html">Перейти в каталог</a>
            </div>`;
        totalEl.textContent = '$0.00';
        return;
    }

    container.innerHTML = '';
    cart.items.forEach(item => {
        const shortTitle = item.title.length > 58 ? item.title.slice(0, 58) + '…' : item.title;
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-info">
                <h3 title="${item.title}">${shortTitle}</h3>
                <p>$${item.price.toFixed(2)} × ${item.quantity} = <b>$${item.getTotalPrice().toFixed(2)}</b></p>
            </div>
            <div class="cart-item-actions">
                <button class="btn-qty" data-id="${item.productId}" data-action="dec">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="btn-qty" data-id="${item.productId}" data-action="inc">+</button>
                <button class="btn-remove" data-id="${item.productId}">Удалить</button>
            </div>
        `;
        container.appendChild(el);
    });

    totalEl.textContent = '$' + cart.getTotal().toFixed(2);

    document.querySelectorAll('.btn-remove').forEach(btn =>
        btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.id))));
    document.querySelectorAll('.btn-qty').forEach(btn =>
        btn.addEventListener('click', () => changeQuantity(Number(btn.dataset.id), btn.dataset.action)));
}

function removeFromCart(productId) {
    const cart = Cart.load(); cart.removeItem(productId); cart.save(); updateCartIcon(); renderCart();
}

function changeQuantity(productId, action) {
    const cart = Cart.load();
    const item = cart.items.find(i => i.productId === productId);
    if (!item) return;
    if (action === 'inc') item.quantity++;
    else { item.quantity--; if (item.quantity <= 0) cart.removeItem(productId); }
    cart.save(); updateCartIcon(); renderCart();
}
