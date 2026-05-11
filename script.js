// ===== Products =====
const products = [
  { id:'sospiro-vibratto', name:'Sospiro Vibratto', tagline:'Cítricos · Jazmín · Limon', category:'Unisex', size:'100 ml', price:300, image:'assets/sospirovibrato.webp' },
  { id:'jpg-le-beau', name:'Jean Paul Gaultier Le Beau', tagline:'Coco · Tonka · Madera de guayaco', category:'Hombre', size:'125 ml', price:110, image:'assets/perfume-6.avif' },
  { id:'azzaro-most-wanted', name:'Azzaro The Most Wanted', tagline:'Cardamomo · Toffee · Ámbar oscuro', category:'Hombre', size:'100 ml', price:95, image:'assets/lazaro.png' },
  { id:'lv-imagination', name:'Louis Vuitton Imagination', tagline:'Bergamota · Té negro · Cedro', category:'Unisex', size:'100 ml', price:280, image:'assets/perfume-7.webp' },
  { id:'bleu-de-chanel', name:'Bleu de Chanel', tagline:'Cítricos · Incienso · Sándalo', category:'Hombre', size:'100 ml', price:135, image:'assets/perfume-8.avif' },
  { id:'savage-de-dior', name:'Savage de Dior', tagline:'Cítricos · Lavanda · Lima', category:'Hombre', size:'100 ml', price:175, image:'assets/perfume-5.webp' },
  { id:'tom-ford-vanilla', name:'Tom Ford Vanilla', tagline:'Vainilla · Canela · Maderas', category:'Hombre', size:'50 ml', price:220, image:'assets/perfume-9.webp' },
  { id:'miss-dior', name:'Miss Dior', tagline:'Cítricos · Rosa · Lavanda', category:'Mujer', size:'100 ml', price:160, image:'assets/perfume-10.webp' },
  { id:'carolina-herrera-cool-girl', name:'Carolina Herrera Cool Girl', tagline:'Cítricos · Rosa · Lavanda', category:'Mujer', size:'80 ml', price:100, image:'assets/perfume-11.webp' }
];

const catalogProducts = products.filter(p => p.id !== 'sospiro-vibratto');

// ===== Render catalog =====
const grid = document.getElementById('product-grid');
grid.innerHTML = catalogProducts.map(p => `
  <article class="card reveal" data-id="${p.id}">
    <div class="card-img">
      <img src="${p.image}" alt="${p.name}" loading="lazy" />
      <span class="card-badge">${p.category}</span>
      <button class="card-add" aria-label="Añadir ${p.name}" data-add="${p.id}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25"><path d="M12 5v14M5 12h14"/></svg>
      </button>
    </div>
    <div class="card-foot">
      <div>
        <h3>${p.name}</h3>
        <p class="tagline">${p.tagline}</p>
        <p class="size">${p.size}</p>
      </div>
      <p class="price">$${p.price}</p>
    </div>
  </article>
`).join('');

// ===== Cart =====
const STORAGE = 'essence-cart';
let cart = JSON.parse(localStorage.getItem(STORAGE) || '[]');

function save(){ localStorage.setItem(STORAGE, JSON.stringify(cart)); }
function add(id){
  const p = products.find(x => x.id === id); if(!p) return;
  const ex = cart.find(x => x.id === id);
  if(ex) ex.qty++; else cart.push({...p, qty:1});
  save(); render(); openCart();
}
function remove(id){ cart = cart.filter(x => x.id !== id); save(); render(); }
function setQty(id, q){ const it = cart.find(x => x.id === id); if(!it) return; it.qty = Math.max(1, q); save(); render(); }

function render(){
  const count = cart.reduce((s,i) => s+i.qty, 0);
  const total = cart.reduce((s,i) => s+i.qty*i.price, 0);
  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-total').textContent = '$' + total;
  const wrap = document.getElementById('cart-items');
  if(cart.length === 0){ wrap.innerHTML = '<p class="cart-empty">Tu bolsa está vacía.</p>'; return; }
  wrap.innerHTML = cart.map(i => `
    <div class="cart-item">
      <img src="${i.image}" alt="${i.name}" />
      <div>
        <h4>${i.name}</h4>
        <p class="tagline">${i.size}</p>
        <div class="cart-qty">
          <button data-dec="${i.id}">−</button>
          <span>${i.qty}</span>
          <button data-inc="${i.id}">+</button>
        </div>
        <a class="remove" data-rm="${i.id}" href="#">Eliminar</a>
      </div>
      <p class="item-price">$${i.qty*i.price}</p>
    </div>
  `).join('');
}
render();

// ===== Cart events =====
const drawer = document.getElementById('cart-drawer');
const overlay = document.getElementById('cart-overlay');
function openCart(){ drawer.classList.add('open'); overlay.classList.add('open'); drawer.setAttribute('aria-hidden','false'); }
function closeCart(){ drawer.classList.remove('open'); overlay.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); }
document.getElementById('cart-btn').addEventListener('click', openCart);
document.getElementById('cart-close').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-add]'); if(a){ e.preventDefault(); add(a.dataset.add); return; }
  const inc = e.target.closest('[data-inc]'); if(inc){ const it = cart.find(x => x.id === inc.dataset.inc); if(it) setQty(it.id, it.qty+1); return; }
  const dec = e.target.closest('[data-dec]'); if(dec){ const it = cart.find(x => x.id === dec.dataset.dec); if(it) setQty(it.id, it.qty-1); return; }
  const rm = e.target.closest('[data-rm]'); if(rm){ e.preventDefault(); remove(rm.dataset.rm); return; }
});
document.querySelector('[data-add-featured]').addEventListener('click', () => add('sospiro-vibratto'));

// ===== Header scroll =====
const header = document.getElementById('site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
onScroll(); window.addEventListener('scroll', onScroll, { passive:true });

// ===== Mobile menu =====
const menuBtn = document.getElementById('menu-btn');
const navMobile = document.getElementById('nav-mobile');
menuBtn.addEventListener('click', () => navMobile.classList.toggle('open'));
navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMobile.classList.remove('open')));

// ===== Reveal on scroll =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); } });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
