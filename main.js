/* ============================================================
   PADILHA CREATIONS — main.js
   ============================================================ */

// ── STATE ──────────────────────────────────────────────────
const cart = [];

// Product SVG thumbnails for the cart drawer
const productSVGs = {
  1: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <defs><pattern id="ct1" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 4 Q2 2 4 4 Q6 6 8 4" stroke="#a08060" stroke-width="1.2" fill="none"/>
        </pattern></defs>
        <path d="M65 80 Q70 20 100 20 Q130 20 135 80" stroke="#8b6b4a" stroke-width="10" fill="none" stroke-linecap="round"/>
        <rect x="45" y="78" width="110" height="130" rx="14" fill="url(#ct1)" stroke="#8b6b4a" stroke-width="2"/>
        <circle cx="100" cy="118" r="6" fill="#c4a882" stroke="#8b6b4a" stroke-width="1.5"/>
      </svg>`,
  2: `<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <defs><pattern id="ct2" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M0 5 Q2.5 2 5 5 Q7.5 8 10 5" stroke="#9a7550" stroke-width="1.3" fill="none"/>
        </pattern></defs>
        <path d="M72 85 Q68 18 88 15" stroke="#7a5535" stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M128 85 Q132 18 112 15" stroke="#7a5535" stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M42 85 Q38 200 50 230 Q70 248 100 248 Q130 248 150 230 Q162 200 158 85 Z" fill="url(#ct2)" stroke="#7a5535" stroke-width="2"/>
      </svg>`,
  3: `<svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <defs><pattern id="ct3" x="0" y="0" width="7" height="7" patternUnits="userSpaceOnUse">
          <path d="M0 3.5 Q1.75 1 3.5 3.5 Q5.25 6 7 3.5" stroke="#a58555" stroke-width="1.1" fill="none"/>
        </pattern></defs>
        <rect x="30" y="60" width="135" height="95" rx="12" fill="url(#ct3)" stroke="#7a5535" stroke-width="2"/>
        <path d="M30 60 Q32 95 97.5 100 Q163 95 170 60 Z" fill="#c4a06a" stroke="#7a5535" stroke-width="1.5"/>
      </svg>`,
};

// ── NAV SCROLL ──────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── MOBILE MENU ─────────────────────────────────────────────
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

function closeMenu() {
  mobileMenu.classList.remove('open');
  const spans = burger.querySelectorAll('span');
  spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}

// ── CART ────────────────────────────────────────────────────
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartCountEl = document.getElementById('cartCount');
const cartItemsEl = document.getElementById('cartItems');
const cartFooterEl = document.getElementById('cartFooter');
const cartTotalEl = document.getElementById('cartTotal');

function toggleCart() {
  cartDrawer.classList.toggle('open');
  cartOverlay.classList.toggle('open');
  document.body.style.overflow = cartDrawer.classList.contains('open') ? 'hidden' : '';
}

document.getElementById('cartBtn').addEventListener('click', toggleCart);

function addToCart(id, name, price) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  updateCart();
  showToast(`${name} added to your bag`);
}

function removeFromCart(id) {
  const idx = cart.findIndex(item => item.id === id);
  if (idx > -1) cart.splice(idx, 1);
  updateCart();
}

function updateCart() {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  // Update count badge
  cartCountEl.textContent = count;
  cartCountEl.classList.toggle('visible', count > 0);

  // Render items
  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <p>Your cart is empty.</p>
        <a href="#shop" onclick="toggleCart()" class="btn btn--outline">Browse the Collection</a>
      </div>`;
    cartFooterEl.style.display = 'none';
  } else {
    cartItemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item__img">${productSVGs[item.id] || ''}</div>
        <div class="cart-item__info">
          <div class="cart-item__name">${item.name}</div>
          <div class="cart-item__price">$${item.price} × ${item.qty}</div>
        </div>
        <button class="cart-item__remove" onclick="removeFromCart(${item.id})" aria-label="Remove">×</button>
      </div>
    `).join('');
    cartFooterEl.style.display = 'block';
    cartTotalEl.textContent = `$${total}`;
  }
}

// ── TOAST ───────────────────────────────────────────────────
const toastEl = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2800);
}

// ── CONTACT FORM ────────────────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();
  const successEl = document.getElementById('formSuccess');
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Simulate async send
  setTimeout(() => {
    e.target.reset();
    btn.textContent = 'Send Message';
    btn.disabled = false;
    successEl.classList.add('show');
    setTimeout(() => successEl.classList.remove('show'), 5000);
  }, 1200);
}

// ── INTERSECTION OBSERVER (fade-in on scroll) ───────────────
const observerOpts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, observerOpts);

document.querySelectorAll(
  '.product-card, .unique__pillar, .photo-grid__item, .story__stat, .story__img'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  observer.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {});

// Add CSS class for observed elements
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .in-view {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    .product-card--featured.in-view {
      transform: scale(1.03) translateY(0) !important;
    }
  </style>
`);
