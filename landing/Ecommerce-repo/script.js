const currency = 'R';

const productGrid = document.getElementById('product-grid');
const cartContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const clearCartBtn = document.getElementById('clear-cart');
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('category-filter');
const cartSidebar = document.getElementById('cart');
const checkoutBtn = document.getElementById('checkout-btn');

let productsData = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fetch products
fetch('product.json')
  .then(res => res.json())
  .then(data => {
    productsData = data;
    renderProducts(productsData);
    updateCart();
  })
  .catch(err => {
    productGrid.innerHTML = '<p>Error loading products.</p>';
    console.error(err);
  });

// Render product cards with filtering
function renderProducts(products) {
  const searchTerm = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm);
    const matchesCategory = category === 'all' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  productGrid.innerHTML = '';
  filteredProducts.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p><strong>${currency}${product.price}</strong></p>
      <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;

    productGrid.appendChild(card);
  });

  attachAddToCartEvents();
}

// Add to Cart
function attachAddToCartEvents() {
  const buttons = document.querySelectorAll('.add-to-cart');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const product = productsData.find(p => p.id === id);
      cart.push(product);
      updateCart();
    });
  });
}

// Update cart view
function updateCart() {
  cartContainer.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price;
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `<h4>${item.name}</h4><p>${currency}${item.price}</p>`;
    cartContainer.appendChild(div);
  });

  cartTotal.textContent = total;
  document.getElementById('cart-count').textContent = cart.length;

  localStorage.setItem('cart', JSON.stringify(cart));
}

// Cart toggle
cartBtn.addEventListener('click', () => cartSidebar.classList.add('show'));
closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('show'));

// Clear cart
clearCartBtn.addEventListener('click', () => {
  cart = [];
  updateCart();
});

// Search & category filter
searchInput.addEventListener('input', () => renderProducts(productsData));
categoryFilter.addEventListener('change', () => renderProducts(productsData));

// Mock checkout
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  alert(`Thank you for your purchase! Total: ${currency}${cart.reduce((acc, i) => acc + i.price, 0)}`);
  cart = [];
  updateCart();
});
