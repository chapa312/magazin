// Cart utility functions shared across pages
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
  const list = document.getElementById('drawer-list');
  const sumEl = document.getElementById('drawer-sum');
  const btn = document.getElementById('cart-button');
  if (!list || !sumEl || !btn) return;
  list.innerHTML = '';
  let sum = 0;
  const grouped = {};
  cart.forEach(item => {
    const key = item.id + '|' + item.size;
    if (!grouped[key]) grouped[key] = { item, qty: 0 };
    grouped[key].qty++;
  });
  Object.values(grouped).forEach(({ item, qty }) => {
    sum += item.price * qty;
    const row = document.createElement('div');
    row.className = 'drawer-item';
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="item-info">
        <div class="title">${item.name}</div>
        <div class="subtitle">Артикул: ${item.id} | Размер: ${item.size}</div>
      </div>
      <div class="item-controls">
        <button onclick="changeQty('${item.id}|${item.size}',-1)">−</button>
        <span class="qty">${qty}</span>
        <button onclick="changeQty('${item.id}|${item.size}',+1)">+</button>
        <span class="price">${item.price * qty} ₽</span>
        <button class="remove-btn" onclick="removeItem('${item.id}|${item.size}')">×</button>
      </div>`;
    list.append(row);
  });
  sumEl.textContent = sum;
  btn.textContent = `Корзина (${cart.length})`;
}

function changeQty(key, delta) {
  const [id, size] = key.split('|');
  if (delta > 0) {
    const found = cart.find(x => x.id == id && x.size === size);
    if (found) cart.push(found);
  } else {
    const idx = cart.findIndex(x => x.id == id && x.size === size);
    if (idx > -1) cart.splice(idx, 1);
  }
  saveCart();
  updateCartUI();
}

function removeItem(key) {
  const [id, size] = key.split('|');
  cart = cart.filter(x => !(x.id == id && x.size === size));
  saveCart();
  updateCartUI();
}

function openDrawer() {
  const el = document.getElementById('cart-drawer');
  if (el) el.classList.add('open');
}

function closeDrawer() {
  const el = document.getElementById('cart-drawer');
  if (el) el.classList.remove('open');
}

function onCheckout() {
  closeDrawer();
  window.location.href = 'checkout.html';
}

document.addEventListener('DOMContentLoaded', updateCartUI);
