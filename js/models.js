class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
    checkPassword(password) { return this.password === password; }
}

class Product {
    constructor(id, title, price, description, image, category, rating = null) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.image = image;
        this.category = category;
        this.rating = rating; // { rate: 3.9, count: 120 }
    }

    // CSS-класс по категории
    getCategoryClass() {
        const map = {
            'electronics':    'cat-electronics',
            'jewelery':       'cat-jewelry',
            "men's clothing": 'cat-men',
            "women's clothing": 'cat-women',
        };
        return map[this.category] || '';
    }

    // Звёздочки — заполненные поверх пустых
    renderStars() {
        if (!this.rating) return '';
        const pct = Math.round((this.rating.rate / 5) * 100);
        return `
            <div class="stars-row">
                <div class="stars-track">
                    <span class="stars-empty">★★★★★</span>
                    <span class="stars-filled" style="width:${pct}%">★★★★★</span>
                </div>
                <span class="rating-text">${this.rating.rate} · ${this.rating.count} отз.</span>
            </div>
        `;
    }

    renderCard() {
        const shortTitle = this.title.length > 48
            ? this.title.slice(0, 48) + '…'
            : this.title;
        const catClass = this.getCategoryClass();

        return `
            <div class="card ${catClass}">
                <div class="card-accent"></div>
                <a href="product.html?id=${this.id}" class="card-link">
                    <div class="card-img-wrapper">
                        <img src="${this.image}" alt="${this.title}" loading="lazy">
                    </div>
                    <div class="card-body">
                        <span class="card-category">${this.category}</span>
                        <h3 class="card-title" title="${this.title}">${shortTitle}</h3>
                        ${this.renderStars()}
                        <p class="card-price">$${this.price.toFixed(2)}</p>
                    </div>
                </a>
                <a href="product.html?id=${this.id}" class="btn btn-primary card-btn">Подробнее</a>
            </div>
        `;
    }
}

class CartItem {
    constructor(productId, price, title, image, quantity = 1) {
        this.productId = productId;
        this.price = price;
        this.title = title;
        this.image = image;
        this.quantity = quantity;
    }
    getTotalPrice() { return this.price * this.quantity; }
}

class Cart {
    constructor(items = []) { this.items = items; }

    addItem(product) {
        const existing = this.items.find(i => i.productId === product.id);
        if (existing) {
            existing.quantity++;
        } else {
            this.items.push(new CartItem(product.id, product.price, product.title, product.image));
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(i => i.productId !== productId);
    }

    getTotal() {
        return this.items.reduce((s, i) => s + i.getTotalPrice(), 0);
    }

    getTotalCount() {
        return this.items.reduce((s, i) => s + i.quantity, 0);
    }

    clear() { this.items = []; }

    save() { localStorage.setItem('cart', JSON.stringify(this.items)); }

    static load() {
        try {
            const raw = JSON.parse(localStorage.getItem('cart') || '[]');
            return new Cart(raw.map(i => new CartItem(i.productId, i.price, i.title, i.image, i.quantity)));
        } catch { return new Cart(); }
    }
}
