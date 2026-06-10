const API_URL = "https://fakestoreapi.com";

async function getProducts()                   { return (await fetch(`${API_URL}/products`)).json(); }
async function getProductById(id)              { return (await fetch(`${API_URL}/products/${id}`)).json(); }
async function getCategories()                 { return (await fetch(`${API_URL}/products/categories`)).json(); }
async function getProductsByCategory(category) { return (await fetch(`${API_URL}/products/category/${encodeURIComponent(category)}`)).json(); }
