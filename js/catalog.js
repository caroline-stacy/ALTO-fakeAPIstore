let allProducts = [];
let activeCategory = 'all';

document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("catalog").innerHTML = '<p class="loading">Загружаем товары…</p>';
    allProducts = await getProducts();
    renderCatalog(allProducts);
    await setupCategoryFilter();
    setupSearch();
});

function renderCatalog(products) {
    const container = document.getElementById("catalog");
    if (!products || products.length === 0) {
        container.innerHTML = '<p class="empty">Товары не найдены</p>';
        return;
    }
    container.innerHTML = products.map(p =>
        new Product(p.id, p.title, p.price, p.description, p.image, p.category, p.rating).renderCard()
    ).join('');
}

async function setupCategoryFilter() {
    const wrap = document.getElementById("category-filter");
    if (!wrap) return;
    const categories = await getCategories();
    wrap.innerHTML =
        `<button class="filter-btn active" data-category="all">Все</button>` +
        categories.map(c => `<button class="filter-btn" data-category="${c}">${c}</button>`).join('');

    wrap.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            wrap.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.dataset.category;
            applyFilters();
        });
    });
}

function setupSearch() {
    const input = document.getElementById('search-input');
    if (input) input.addEventListener('input', applyFilters);
}

function applyFilters() {
    let list = activeCategory === 'all'
        ? allProducts
        : allProducts.filter(p => p.category === activeCategory);
    const q = document.getElementById('search-input')?.value.toLowerCase().trim();
    if (q) list = list.filter(p => p.title.toLowerCase().includes(q));
    renderCatalog(list);
}
