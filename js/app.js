/* COMMON ROOM — shared behaviour: layout, cart, ordering, WhatsApp, animations */
(() => {
'use strict';
const { CONFIG: C, CATS, ITEMS, REVIEWS, GALLERY } = CR;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => 'KSh ' + Number(n).toLocaleString('en-US');
const store = { get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
const PAGE = document.body.dataset.page;

/* ---------- icons ---------- */
const P = {
  cart: '<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20.5" r="1.2"/><circle cx="17" cy="20.5" r="1.2"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>', close: '<path d="M6 6l12 12M18 6L6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  wa: '<path d="M20 11.5a8 8 0 0 1-11.9 7L4 20l1.6-4A8 8 0 1 1 20 11.5z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8a4.5 4.5 0 0 1-2-2l.8-1-1-2L9 8.5z"/>',
  bike: '<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="M6 16l4-7h5l3 7M10 9L8.5 6H6M13 9l-2 7"/>',
  bag: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  star: '<path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.300l-5.900 3.300 1.300-6.600L2.500 9.400l6.600-.8z"/>',
  left: '<path d="M15 6l-6 6 6 6"/>', right: '<path d="M9 6l6 6-6 6"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M9 14.500c.5 1 1.500 1.500 3 1.500s2.500-.7 2.500-1.800-1-1.500-2.500-1.900S9.500 11 9.500 9.800 10.500 8 12 8s2.300.5 2.800 1.300M12 6v2M12 16v2"/>',
  food: '<circle cx="12" cy="13" r="7"/><circle cx="12" cy="13" r="3.500"/><path d="M3 3v6M5 3v6M7 3v6M3 9h4M5 9v12M20 3c-2 1.500-2.500 5-1 8h1v10"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  home: '<path d="M3 11l9-7 9 7M5 10v10h14V10"/>'
};
const svg = (n, c = '') => `<svg class="${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;
CR.svg = svg; CR.esc = esc;

/* ---------- WhatsApp ---------- */
const waLink = msg => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`;

/* ---------- cart ---------- */
const Cart = {
  lines: store.get('cr_cart', []).filter(l => CR.byId[l.id]),
  key: l => l.id + '|' + (l.opt || ''),
  find(k) { return this.lines.find(x => this.key(x) === k); },
  add(id, opt, q = 1) { const l = this.find(id + '|' + (opt || '')); l ? l.qty = Math.min(99, l.qty + q) : this.lines.push({ id, opt: opt || '', qty: q }); this.commit(); },
  step(k, d) { const l = this.find(k); if (!l) return; l.qty += d; if (l.qty < 1) this.lines = this.lines.filter(x => x !== l); this.commit(); },
  del(k) { this.lines = this.lines.filter(x => this.key(x) !== k); this.commit(); },
  clear() { this.lines = []; this.commit(); },
  count() { return this.lines.reduce((s, l) => s + l.qty, 0); },
  total() { return this.lines.reduce((s, l) => s + l.qty * CR.byId[l.id].price, 0); },
  commit() { store.set('cr_cart', this.lines); render(); }
};
const thumb = it => `<div class="media th" data-label=""><img onload="this.closest('.media')&&this.closest('.media').classList.add('loaded')" src="${it.img}" data-fb="${it.fb}" alt="" loading="lazy"></div>`;
function linesHtml(withThumb) {
  if (!Cart.lines.length) return `<div class="empty">${svg('bag')}<p>Your cart is empty.</p><a class="btn btn-primary sm" href="menu.html">Browse the menu</a></div>`;
  return Cart.lines.map(l => {
    const it = CR.byId[l.id], k = esc(Cart.key(l));
    return `<div class="line ${withThumb ? '' : 'plain'}">${withThumb ? thumb(it) : ''}<div class="li"><b>${esc(it.name)}</b>${l.opt ? `<small>${esc(l.opt)}</small>` : ''}<span>${money(it.price)} each</span></div>
    <div class="lr"><strong>${money(it.price * l.qty)}</strong><div class="row"><div class="qty sm"><button type="button" data-lk="${k}" data-d="-1" aria-label="Decrease ${esc(it.name)}">${svg('minus')}</button><output>${l.qty}</output><button type="button" data-lk="${k}" data-d="1" aria-label="Increase ${esc(it.name)}">${svg('plus')}</button></div><button type="button" class="del" data-del="${k}" aria-label="Remove ${esc(it.name)}">${svg('trash')}</button></div></div></div>`;
  }).join('');
}
function render() {
  const n = Cart.count();
  $$('[data-count]').forEach(b => { b.textContent = n; b.classList.toggle('has', n > 0); });
  $$('[data-lines]').forEach(el => el.innerHTML = linesHtml(el.dataset.lines !== 'plain'));
  $$('[data-subtotal]').forEach(el => el.textContent = money(Cart.total()));
  $$('[data-checkout]').forEach(el => el.toggleAttribute('disabled', !n));
}

/* ---------- layout (header, nav, drawer, footer) ---------- */
const NAV = [['index.html', 'Home'], ['menu.html', 'Our Menu'], ['order.html', 'Order Online'], ['delivery.html', 'Delivery'], ['about.html', 'About Us'], ['gallery.html', 'Gallery'], ['contact.html', 'Contact Us'], ['faqs.html', 'FAQs']];
function layout() {
  const links = (cls = '') => NAV.map(([h, t], i) => `<a href="${h}" style="--i:${i}" class="${h === PAGE ? 'on' : ''}">${t}</a>`).join('');
  document.body.insertAdjacentHTML('afterbegin', `
  <a class="skip" href="#main">Skip to content</a>
  <div class="pt" aria-hidden="true"><span>COMMON ROOM</span></div>
  <header class="hdr"><div class="wrap">
    <a class="logo" href="index.html" aria-label="Common Room home"><i>CR</i><span>COMMON ROOM</span></a>
    <nav class="nav" aria-label="Main">${links()}</nav>
    <div class="hdr-actions">
      <button class="icon-btn cart-btn" data-cart aria-label="Open cart">${svg('cart')}<b class="badge" data-count>0</b></button>
    </div></div></header>
  `);
  document.body.insertAdjacentHTML('beforeend', `
  <div class="scrim" data-close></div>
  <aside class="drawer" id="drawer" role="dialog" aria-label="Your cart" aria-hidden="true">
    <div class="dr-head"><h3 class="h3">Your order</h3><button class="icon-btn" data-close aria-label="Close cart">${svg('close')}</button></div>
    <div class="dr-body" data-lines></div>
    <div class="dr-foot">
      <div class="sum"><span>Subtotal</span><strong data-subtotal>KSh 0</strong></div>
      <p class="note">Delivery fee (if any) is confirmed by Common Room on WhatsApp.</p>
      <a class="btn btn-primary" data-checkout href="order.html#checkout">Checkout ${svg('arrow', 'arr')}</a>
      <button class="btn btn-ghost" data-close type="button">Continue shopping</button>
    </div>
  </aside>
  <button class="fab" data-cart aria-label="Open cart">${svg('cart')}<b class="badge" data-count>0</b></button>
  <div class="toasts" aria-live="polite"></div>
  <footer class="ftr"><div class="wrap">
    <div class="ftr-grid">
      <div><a class="logo" href="index.html"><i>CR</i><span>COMMON ROOM</span></a>
        <p class="about">Good food. Fair prices. Your campus food spot at Egerton University — order online, skip the queue, get it delivered to your hostel.</p>
        <a class="btn btn-primary sm" href="${waLink('Hi Common Room! ')}" target="_blank" rel="noopener">${svg('wa')}Chat on WhatsApp</a></div>
      <div><h4>Explore</h4><ul>${NAV.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></div>
      <div><h4>Order</h4><ul><li><a href="menu.html">Our menu</a></li><li><a href="order.html">Order online</a></li><li><a href="delivery.html">Delivery information</a></li><li><a href="faqs.html">Help &amp; FAQs</a></li></ul>
        <h4 style="margin-top:1.4rem">Legal</h4><ul><li><button data-modal="terms">Terms &amp; Conditions</button></li><li><button data-modal="cookies">Cookies Policy</button></li></ul></div>
      <div><h4>Visit &amp; contact</h4><ul><li>${esc(C.location)}</li><li>Open daily ${C.hoursLabel}</li><li><a href="tel:${C.phone.replace(/\s/g, '')}">${esc(C.phone)}</a></li><li><a href="mailto:${C.email}">${esc(C.email)}</a></li></ul></div>
    </div>
    <div class="ftr-big" aria-hidden="true">COMMON ROOM</div>
    <div class="ftr-bot"><span>© ${new Date().getFullYear()} Common Room. All rights reserved.</span><span>Made for Egerton University students.</span></div>
  </div></footer>`);
}

/* ---------- overlays ---------- */
const lock = on => document.body.classList.toggle('lock', on);
const openDrawer = () => { document.body.classList.add('drawer-open'); $('#drawer').setAttribute('aria-hidden', 'false'); lock(true); };
const closeDrawer = () => { document.body.classList.remove('drawer-open'); $('#drawer').setAttribute('aria-hidden', 'true'); lock(false); };
function modal(html) {
  closeModal(true);
  const m = document.createElement('div'); m.className = 'modal';
  m.innerHTML = `<div class="m-box" role="dialog" aria-modal="true">${html}<button class="icon-btn m-x" data-mclose aria-label="Close">${svg('close')}</button></div>`;
  document.body.append(m); lock(true); requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add('in'))); return m;
}
function closeModal(now) { $$('.modal').forEach(m => { m.classList.remove('in'); setTimeout(() => m.remove(), now ? 0 : 400); }); if (!$('.drawer-open')) lock(false); }
const MODALS = {
  terms: `<h3>Terms &amp; Conditions</h3><p>By using this website and placing an order with Common Room you agree to the following.</p>
    <h4>Orders</h4><ul><li>Orders are sent to Common Room through WhatsApp and are only confirmed once the restaurant replies to confirm them.</li><li>Meal availability may change during the day. We will tell you if something is unavailable.</li></ul>
    <h4>Prices &amp; payment</h4><ul><li>All prices are in Kenya Shillings (KSh) and may change without notice.</li><li>Delivery fees, where they apply, and payment arrangements are confirmed with you on WhatsApp.</li></ul>
    <h4>Delivery &amp; pickup</h4><ul><li>We deliver to selected hostels around Egerton University. Coverage is confirmed at the time of your order.</li><li>Please give accurate hostel, block, room and phone details so your order reaches you.</li></ul>
    <h4>Changes &amp; cancellations</h4><p>Contact us on WhatsApp as soon as possible if you need to change or cancel an order. Meals already being prepared may not be cancellable.</p>
    <p class="note">Questions? Reach us via the Contact page.</p>`,
  cookies: `<h3>Cookies Policy</h3><p>Common Room keeps things simple. This website uses your browser's local storage (similar to cookies) only to make ordering easier:</p>
    <ul><li><b>Your cart</b> — so your selected meals are still there when you move between pages.</li><li><b>Your details</b> — name, phone and hostel, saved on your own device so repeat orders are quicker.</li><li><b>This notice</b> — to remember that you have seen it.</li></ul>
    <p>We do not use this information for advertising. The map on the Contact page is provided by Google Maps and may set its own cookies. You can clear this data at any time in your browser settings.</p>`
};

function toast(html) {
  const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = `${svg('check')}<span>${html}</span>`;
  $('.toasts').append(t); requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('in')));
  setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 600); }, 2800);
}
CR.toast = toast;

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -5% 0px' });
const watch = (root = document) => $$('.rv:not(.seen)', root).forEach(e => { e.classList.add('seen'); io.observe(e); });
CR.watch = watch;
function initReveal() {
  $$('[data-stagger]').forEach(p => [...p.children].forEach((c, i) => { c.classList.add('rv'); c.style.setProperty('--d', Math.min(i, 8) * 80 + 'ms'); }));
  $$('[data-reveal]').forEach(e => e.classList.add('rv'));
  watch();
}

/* ---------- food cards ---------- */
const optsHtml = it => `<div class="opts" role="group" aria-label="Choose one">${it.opts.map((o, k) => `<button type="button" data-opt="${o}" aria-pressed="${k === 0}">${o}</button>`).join('')}</div>`;
const catShort = Object.fromEntries(CATS.map(c => [c.id, c.short]));
const foodCard = (it, i = 0) => `<article class="food rv" data-item style="--d:${(i % 4) * 70}ms">
  <div class="media" data-label="${esc(it.name)}"><img onload="this.closest('.media')&&this.closest('.media').classList.add('loaded')" src="${it.img}" data-fb="${it.fb}" alt="${esc(it.name)}" loading="lazy" decoding="async" width="800" height="600"><span class="tag">${catShort[it.cat]}</span><span class="price">${money(it.price)}</span></div>
  <div class="body"><h3>${esc(it.name)}</h3><p>${esc(it.desc)}</p>${it.opts ? optsHtml(it) : ''}
  <div class="buy"><div class="qty" role="group" aria-label="Quantity"><button type="button" data-q="-1" aria-label="Decrease quantity">${svg('minus')}</button><output>1</output><button type="button" data-q="1" aria-label="Increase quantity">${svg('plus')}</button></div><div class="tot"><small>Total</small><b data-total>${money(it.price)}</b></div></div>
  <div class="acts"><button type="button" class="btn btn-primary add" data-add="${it.id}">Add to cart</button><button type="button" class="btn btn-ghost" data-buy="${it.id}">Order now</button></div></div></article>`;
const orderRow = (it, i = 0) => `<div class="orow rv" data-item style="--d:${(i % 4) * 60}ms">${thumb(it)}
  <div><h3>${esc(it.name)}</h3><span class="op">${money(it.price)}</span>${it.opts ? optsHtml(it) : ''}</div>
  <button type="button" class="btn btn-primary sm add" data-add="${it.id}" aria-label="Add ${esc(it.name)} to order">${svg('plus')}Add</button></div>`;
const refreshAdd = card => { const b = $('.add', card), t = $('[data-total]', card), o = $('output', card); if (t && o) t.textContent = money(CR.byId[b.dataset.add].price * +o.textContent); };

function fly(from) {
  const tgt = $$('.cart-btn,.fab').find(e => { const r = e.getBoundingClientRect(); return r.width && r.bottom > 0 && r.top < innerHeight && (!e.classList.contains('fab') || e.classList.contains('show')); });
  if (!tgt) return;
  const a = from.getBoundingClientRect(), b = tgt.getBoundingClientRect(), d = document.createElement('i'); d.className = 'fly'; document.body.append(d);
  const x1 = a.left + a.width / 2, y1 = a.top + a.height / 2, x2 = b.left + b.width / 2, y2 = b.top + b.height / 2;
  d.animate([{ transform: `translate(${x1}px,${y1}px) scale(1)` }, { transform: `translate(${(x1 + x2) / 2}px,${Math.min(y1, y2) - 90}px) scale(1.3)`, offset: .5 }, { transform: `translate(${x2}px,${y2}px) scale(.3)`, opacity: .5 }], { duration: 750, easing: 'cubic-bezier(.4,0,.2,1)' })
    .onfinish = () => { d.remove(); tgt.classList.remove('bump'); void tgt.offsetWidth; tgt.classList.add('bump'); };
}
function addFrom(btn, buy) {
  const card = btn.closest('[data-item]'), it = CR.byId[btn.dataset.add || btn.dataset.buy], out = $('output', card), q = out ? +out.textContent : 1;
  const o = $('.opts [aria-pressed=true]', card), opt = o ? o.dataset.opt : '';
  Cart.add(it.id, opt, q);
  if (buy) { if ($('#checkout')) { $('#checkout').scrollIntoView({ behavior: 'smooth' }); toast(`<b>${q}× ${esc(it.name)}</b> added — complete your details`); } else leave('order.html#checkout'); return; }
  fly(btn);
  toast(`<b>${q}× ${esc(it.name)}</b>${opt ? ' (' + opt + ')' : ''} added`);
  const h0 = btn.innerHTML; btn.classList.add('done'); btn.innerHTML = svg('check') + 'Added';
  if (out) out.textContent = 1;
  refreshAdd(card); setTimeout(() => { btn.classList.remove('done'); btn.innerHTML = h0; }, 1100);
}

/* ---------- meal photo viewer ---------- */
let fv, fvIds = [], fvI = 0;
function showFv(n, quick) {
  fvI = (n + fvIds.length) % fvIds.length; const it = CR.byId[fvIds[fvI]], st = $('.stage', fv);
  const set = () => { st.classList.remove('noimg'); st.dataset.label = it.name; st.innerHTML = `<img onload="this.closest('.media').classList.add('loaded')" src="${it.img}" data-fb="${it.fb}" alt="${esc(it.name)}">`; $('figcaption b', fv).textContent = it.name; $('figcaption span', fv).textContent = money(it.price);
    $('.fv-act', fv).innerHTML = `${it.opts ? optsHtml(it) : ''}<button class="btn btn-primary" data-fv-add>Add to cart</button><button class="btn btn-ghost" data-fv-buy>Order now</button>`; st.classList.remove('swap'); };
  if (quick) set(); else { st.classList.add('swap'); setTimeout(set, 200); }
}
function closeViewer() { if (fv) { fv.classList.remove('open'); lock(false); } }
function viewer(card) {
  fvIds = $$('[data-item]').map(c => $('[data-add]', c)).filter(Boolean).map(b => b.dataset.add);
  fvI = Math.max(0, fvIds.indexOf($('[data-add]', card).dataset.add));
  if (!fv) {
    document.body.insertAdjacentHTML('beforeend', `<div class="lb fv" role="dialog" aria-modal="true" aria-label="Meal photo"><button class="icon-btn x" aria-label="Close">${svg('close')}</button><button class="icon-btn pv" aria-label="Previous meal">${svg('left')}</button><button class="icon-btn nx" aria-label="Next meal">${svg('right')}</button><figure><div class="stage media"></div><figcaption><b></b><span></span></figcaption><div class="fv-act"></div></figure></div>`);
    fv = $('.lb.fv'); $('.x', fv).onclick = closeViewer; $('.pv', fv).onclick = () => showFv(fvI - 1); $('.nx', fv).onclick = () => showFv(fvI + 1);
    fv.addEventListener('click', e => {
      if (e.target === fv) return closeViewer();
      const add = e.target.closest('[data-fv-add]'), buy = e.target.closest('[data-fv-buy]'); if (!add && !buy) return;
      const it = CR.byId[fvIds[fvI]], o = $('.opts [aria-pressed=true]', fv); Cart.add(it.id, o ? o.dataset.opt : '', 1);
      if (add) { toast(`<b>${esc(it.name)}</b>${o ? ' (' + o.dataset.opt + ')' : ''} added`); return; }
      closeViewer(); if ($('#checkout')) $('#checkout').scrollIntoView({ behavior: 'smooth' }); else leave('order.html#checkout');
    });
    let x0 = null; fv.addEventListener('pointerdown', e => x0 = e.clientX); fv.addEventListener('pointerup', e => { if (x0 != null && Math.abs(e.clientX - x0) > 50) showFv(fvI + (e.clientX < x0 ? 1 : -1)); x0 = null; });
    document.addEventListener('keydown', e => { if (!fv.classList.contains('open')) return; if (e.key === 'Escape') closeViewer(); if (e.key === 'ArrowLeft') showFv(fvI - 1); if (e.key === 'ArrowRight') showFv(fvI + 1); });
  }
  showFv(fvI, true); fv.classList.add('open'); lock(true); $('.x', fv).focus();
}

/* ---------- global events ---------- */
function leave(url) { closeDrawer(); document.body.classList.add('leaving'); setTimeout(() => { location.href = url; }, 480); }
function events() {
  document.addEventListener('click', e => {
    const t = e.target;
    let el;
    if ((el = t.closest('.food .media, .orow .th'))) { viewer(el.closest('[data-item]')); return; }
    if ((el = t.closest('[data-q]'))) { const o = $('output', el.parentElement), n = Math.max(1, Math.min(20, +o.textContent + +el.dataset.q)); o.textContent = n; refreshAdd(el.closest('[data-item]')); return; }
    if ((el = t.closest('.opts button'))) { $$('button', el.parentElement).forEach(b => b.setAttribute('aria-pressed', b === el)); return; }
    if ((el = t.closest('[data-buy]'))) { addFrom(el, true); return; }
    if ((el = t.closest('[data-add]'))) { addFrom(el); return; }
    if ((el = t.closest('[data-lk]'))) { Cart.step(el.dataset.lk, +el.dataset.d); return; }
    if ((el = t.closest('[data-del]'))) { Cart.del(el.dataset.del); return; }
    if (t.closest('[data-cart]')) { openDrawer(); return; }
    if (t.closest('[data-close]')) { closeDrawer(); return; }
    if ((el = t.closest('[data-modal]'))) { modal(MODALS[el.dataset.modal]); return; }
    if (t.closest('[data-mclose]') || t.classList.contains('modal')) { closeModal(); return; }
    const a = t.closest('a[href]');
    if (a && !e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && !a.target && !a.hasAttribute('download')) {
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || !/(\.html?|\/)$/.test(u.pathname)) return;
      if (u.pathname === location.pathname && u.search === location.search) {
        if (a.matches('[data-checkout]') && $('#checkout')) { e.preventDefault(); closeDrawer(); setTimeout(() => $('#checkout').scrollIntoView({ behavior: 'smooth' }), 300); }
        return;
      }
      e.preventDefault(); leave(u.href);
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDrawer(); closeModal(); closeViewer(); } });
  window.addEventListener('pageshow', e => { if (e.persisted) document.body.classList.remove('leaving'); });
  const fab = $('.fab'); const sc = () => fab.classList.toggle('show', scrollY > 380 || Cart.count() > 0 && scrollY > 120); sc(); addEventListener('scroll', sc, { passive: true });
  $$('img').forEach(i => { if (i.complete && !i.naturalWidth) imgFail(i); else if (i.complete) i.closest('.media')?.classList.add('loaded'); });
  addEventListener('error', e => { if (e.target && e.target.tagName === 'IMG') imgFail(e.target); }, true);
}
function imgFail(t) {
  if (t.dataset.fb && !t.dataset.tried) { t.dataset.tried = 1; t.src = t.dataset.fb; return; }
  const m = t.closest('.media'); if (m) m.classList.add('noimg');
}

/* ---------- open / closed badge ---------- */
function openBadge() {
  const h = parseInt(new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Nairobi', hour: 'numeric', hourCycle: 'h23' }).format(new Date()), 10);
  const open = h >= C.open && h < C.close;
  $$('[data-open-badge]').forEach(b => { b.classList.toggle('closed', !open); b.innerHTML = `<i></i>${open ? 'Open now · until 10PM' : 'Closed · opens 8AM'}`; });
}

/* ---------- reviews ---------- */
function reviews() {
  $$('[data-reviews]').forEach(el => {
    const list = el.dataset.reviews === 'short' ? REVIEWS.slice(0, 3) : REVIEWS;
    el.innerHTML = list.map(r => `<figure class="card review"><div class="stars" aria-label="Rated ${r.r} out of 5">${svg('star').repeat(5)}<b class="rate">${r.r}</b></div><q>${esc(r.q)}</q><figcaption class="who"><i>${svg('user')}</i><span>${esc(r.n)}<br><small class="note">${esc(r.c)}</small></span></figcaption></figure>`).join('');
    el.classList.add('rv-set'); [...el.children].forEach((c, i) => { c.classList.add('rv'); c.style.setProperty('--d', i * 80 + 'ms'); }); watch(el);
  });
  $$('[data-review-note]').forEach(n => { n.innerHTML = (C.sampleReviewsNotice ? 'Sample feedback shown while we collect real student reviews. ' : '') + `<a class="lnk" style="color:var(--c7);text-decoration:underline" href="${waLink('Hi Common Room! Here is my review: ')}" target="_blank" rel="noopener">Share your review on WhatsApp</a>`; });
}

/* ---------- home ---------- */
function home() {
  const root = $('[data-show]'); if (!root) return;
  $('.slides', root).innerHTML = CR.HERO.map((n, k) => { const it = CR.find(n); return `<figure class="slide media ${k ? '' : 'on'}" data-label="${esc(n)}"><img onload="this.closest('.media')&&this.closest('.media').classList.add('loaded')" src="images/hero/hero-${k + 1}.jpg" data-fb="${it.img}" alt="${esc(n)}" ${k ? 'loading="lazy"' : 'fetchpriority="high"'}><figcaption class="cap"><small>On the menu</small><b>${esc(n)}</b><span>${money(it.price)}</span><a class="btn btn-primary sm" href="menu.html?q=${encodeURIComponent(n)}">Order this ${svg('arrow', 'arr')}</a></figcaption></figure>`; }).join('');
  $('.dots', root).innerHTML = CR.HERO.map((n, k) => `<button class="dot ${k ? '' : 'on'}" aria-label="Show slide ${k + 1}"></button>`).join('');
  const slides = $$('.slide', root), dots = $$('.dot', root); let i = 0, tm;
  const go = n => { i = (n + slides.length) % slides.length; slides.forEach((s, k) => s.classList.toggle('on', k === i)); dots.forEach((d, k) => d.classList.toggle('on', k === i)); };
  const play = () => { clearInterval(tm); tm = setInterval(() => go(i + 1), 5500); };
  dots.forEach((d, k) => d.onclick = () => { go(k); play(); });
  $('[data-prev]', root).onclick = () => { go(i - 1); play(); }; $('[data-next]', root).onclick = () => { go(i + 1); play(); };
  let x0 = null; root.addEventListener('pointerdown', e => x0 = e.clientX); root.addEventListener('pointerup', e => { if (x0 != null && Math.abs(e.clientX - x0) > 45) { go(i + (e.clientX < x0 ? 1 : -1)); play(); } x0 = null; });
  play();
  const m = $('.marq div'); if (m) m.innerHTML += m.innerHTML;
  const pop = $('[data-popular]'); if (pop) { pop.innerHTML = CR.POPULAR.map((n, k) => foodCard(CR.find(n), k)).join(''); watch(pop); }
  const cats = $('[data-cats]'); if (cats) { cats.innerHTML = CATS.map((c, k) => `<a class="tile" href="menu.html?cat=${c.id}"><span class="no">0${k + 1}</span><h3>${c.name}</h3><p>${c.blurb}</p><span class="go">${ITEMS.filter(i => i.cat === c.id).length} items ${svg('arrow')}</span></a>`).join(''); }
}

/* ---------- menu page ---------- */
function menu() {
  const grid = $('#menuGrid'); if (!grid) return;
  const params = new URLSearchParams(location.search), state = { cat: CATS.some(c => c.id === params.get('cat')) ? params.get('cat') : 'all', q: params.get('q') || '' };
  const chips = $('#chips'), input = $('#q'), sbox = $('.search'), count = $('#count');
  const drawChips = () => { chips.innerHTML = [{ id: 'all', name: 'All meals' }, ...CATS].map(c => `<button class="chip ${state.cat === c.id ? 'on' : ''}" data-cat="${c.id}">${c.name}<small>${c.id === 'all' ? ITEMS.length : ITEMS.filter(i => i.cat === c.id).length}</small></button>`).join(''); };
  const draw = () => {
    const q = state.q.trim().toLowerCase();
    const list = ITEMS.filter(i => (state.cat === 'all' || i.cat === state.cat) && (!q || (i.name + ' ' + i.desc).toLowerCase().includes(q)));
    const groups = CATS.map(c => ({ c, items: list.filter(i => i.cat === c.id) })).filter(g => g.items.length);
    grid.innerHTML = groups.length ? groups.map(g => `<section class="mgroup" id="${g.c.id}"><div class="mg-head"><h2 class="h3">${g.c.name}</h2><span>${g.items.length} ${g.items.length === 1 ? 'meal' : 'meals'}</span></div><div class="grid-food">${g.items.map(foodCard).join('')}</div></section>`).join('')
      : `<div class="empty big">${svg('search')}<h3 class="h3">No meals found</h3><p>Nothing matches “${esc(state.q)}”. Try another word or category.</p><button class="btn btn-ghost" data-reset>Clear filters</button></div>`;
    count.textContent = groups.length ? `Showing ${list.length} of ${ITEMS.length} meals` : '';
    sbox.classList.toggle('has', !!state.q); watch(grid);
  };
  chips.addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (!b) return; state.cat = b.dataset.cat; drawChips(); draw(); b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); });
  input.value = state.q; input.addEventListener('input', () => { state.q = input.value; draw(); });
  $('.search .x').onclick = () => { state.q = ''; input.value = ''; draw(); input.focus(); };
  grid.addEventListener('click', e => { if (e.target.closest('[data-reset]')) { state.cat = 'all'; state.q = ''; input.value = ''; drawChips(); draw(); } });
  drawChips(); draw();
}

/* ---------- order page ---------- */
function order() {
  const list = $('#orderList'); if (!list) return;
  const state = { cat: 'all', q: '' }, chips = $('#chips'), input = $('#q'), sbox = $('.search');
  const drawChips = () => { chips.innerHTML = [{ id: 'all', name: 'All' }, ...CATS].map(c => `<button class="chip ${state.cat === c.id ? 'on' : ''}" data-cat="${c.id}">${c.name}</button>`).join(''); };
  const draw = () => {
    const q = state.q.trim().toLowerCase();
    const groups = CATS.map(c => ({ c, items: ITEMS.filter(i => i.cat === c.id && (state.cat === 'all' || state.cat === c.id) && (!q || (i.name + ' ' + i.desc).toLowerCase().includes(q))) })).filter(g => g.items.length);
    list.innerHTML = groups.length ? groups.map(g => `<h3 class="og-title">${g.c.name}</h3>${g.items.map(orderRow).join('')}`).join('') : `<div class="empty big">${svg('search')}<p>No meals match “${esc(state.q)}”.</p></div>`;
    sbox.classList.toggle('has', !!state.q); watch(list);
  };
  chips.addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (!b) return; state.cat = b.dataset.cat; drawChips(); draw(); });
  input.addEventListener('input', () => { state.q = input.value; draw(); });
  $('.search .x').onclick = () => { state.q = ''; input.value = ''; draw(); };
  drawChips(); draw();

  const f = $('#orderForm'), me = store.get('cr_me', {});
  ['name', 'phone', 'hostel', 'block', 'room'].forEach(k => { if (me[k] && f.elements[k]) f.elements[k].value = me[k]; });
  const box = $('.reveal-box', f);
  const mode = () => f.elements.mode.value;
  const sync = () => { const d = mode() === 'delivery'; box.classList.toggle('off', !d); $$('input,textarea', box).forEach(i => i.tabIndex = d ? 0 : -1); };
  $$('[name=mode]', f).forEach(r => r.addEventListener('change', sync)); sync();
  $$('input,textarea', f).forEach(i => i.addEventListener('input', () => i.closest('.field')?.classList.remove('bad')));

  function validate() {
    const R = { name: v => v.trim().length >= 2 || 'Please enter your name.', phone: v => /^(?:\+?254|0)?[17]\d{8}$/.test(v.replace(/[\s-]/g, '')) || 'Enter a valid Kenyan phone number, e.g. 0712 345 678.' };
    if (mode() === 'delivery') { R.hostel = v => v.trim().length >= 2 || 'Tell us your hostel name.'; R.room = v => v.trim().length > 0 || 'Add your room number.'; }
    let first = null;
    $$('.field', f).forEach(w => w.classList.remove('bad'));
    for (const [k, fn] of Object.entries(R)) { const el = f.elements[k], r = fn(el.value), w = el.closest('.field'); if (r !== true) { w.classList.add('bad'); $('.err', w).textContent = r; first = first || el; } }
    if (!Cart.lines.length) { toast('Add at least one meal to your order first.'); $('#orderList').scrollIntoView({ behavior: 'smooth' }); return false; }
    if (first) { first.focus(); return false; }
    return true;
  }
  function message(d) {
    const L = Cart.lines.map((l, i) => { const it = CR.byId[l.id]; return `${i + 1}. ${it.name}${l.opt ? ' (' + l.opt + ')' : ''}\n    ${l.qty} x ${money(it.price)} = ${money(it.price * l.qty)}`; }).join('\n');
    const del = d.mode === 'delivery';
    return `*NEW ORDER - COMMON ROOM*\n\n*Name:* ${d.name}\n*Phone:* ${d.phone}\n\n*Order:*\n${L}\n\n*Subtotal: ${money(Cart.total())}*\n(Delivery fee, if any, to be confirmed)\n\n*Type:* ${del ? 'Delivery' : 'Pickup'}` +
      (del ? `\n*Hostel:* ${d.hostel}\n*Block/Building:* ${d.block || '-'}\n*Room:* ${d.room}` : '') + `\n*Notes:* ${d.notes || '-'}\n\nPlease confirm my order. Thank you!`;
  }
  f.addEventListener('submit', e => {
    e.preventDefault(); if (!validate()) return;
    const d = Object.fromEntries(new FormData(f).entries()); store.set('cr_me', { name: d.name, phone: d.phone, hostel: d.hostel, block: d.block, room: d.room });
    const url = waLink(message(d)); const w = window.open(url, '_blank'); if (!w) location.href = url; else w.opener = null;
    const m = modal(`<h3>Almost there!</h3><p>WhatsApp has opened with your order ready. <b>Press send</b> to place it.</p><p>Common Room will reply on WhatsApp to confirm your order${d.mode === 'delivery' ? ', your delivery arrangements and any delivery fee' : ' and when it will be ready for pickup'}.</p>
      <div class="m-actions"><a class="btn btn-primary" href="${url}" target="_blank" rel="noopener">${svg('wa')}Open WhatsApp again</a><button class="btn btn-ghost" data-sent>I've sent it — clear my cart</button><button class="btn btn-ghost" data-mclose>Back to my order</button></div>`);
    $('[data-sent]', m).onclick = () => { Cart.clear(); closeModal(); toast('Cart cleared. Enjoy your meal!'); };
  });
}

/* ---------- FAQ ---------- */
function faq() {
  $$('.faq > button').forEach(b => b.addEventListener('click', () => { const f = b.parentElement, o = f.classList.toggle('open'); b.setAttribute('aria-expanded', o); }));
}

/* ---------- gallery ---------- */
function gallery() {
  const g = $('#gal'); if (!g) return;
  const cats = [['all', 'All'], ['chicken-fish', 'Chicken & Fish'], ['stews', 'Beef & Stews'], ['rice', 'Rice & Pilau'], ['breakfast', 'Breakfast & Drinks']];
  let cur = 'all', shown = GALLERY, idx = 0;
  const chips = $('#gchips'); chips.innerHTML = cats.map(([id, n]) => `<button class="chip ${id === 'all' ? 'on' : ''}" data-c="${id}">${n}</button>`).join('');
  const draw = () => { shown = GALLERY.filter(x => cur === 'all' || x.cat === cur); g.innerHTML = shown.map((x, i) => `<button class="g rv ${x.cls}" data-i="${i}" data-cap="${esc(x.cap)}" style="--d:${(i % 6) * 60}ms" aria-label="Open photo: ${esc(x.cap)}"><div class="media" data-label="${esc(x.cap)}"><img onload="this.closest('.media')&&this.closest('.media').classList.add('loaded')" src="${x.src}" alt="${esc(x.cap)}" loading="lazy"></div></button>`).join(''); watch(g); };
  chips.addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (!b) return; cur = b.dataset.c; $$('.chip', chips).forEach(c => c.classList.toggle('on', c === b)); draw(); });
  document.body.insertAdjacentHTML('beforeend', `<div class="lb" role="dialog" aria-modal="true" aria-label="Photo viewer"><button class="icon-btn x" aria-label="Close">${svg('close')}</button><button class="icon-btn pv" aria-label="Previous photo">${svg('left')}</button><button class="icon-btn nx" aria-label="Next photo">${svg('right')}</button><figure><div class="stage media"></div><figcaption><b></b><span></span></figcaption></figure></div>`);
  const lb = $('.lb'), stage = $('.stage', lb);
  const show = (n, quick) => {
    idx = (n + shown.length) % shown.length; const x = shown[idx];
    const set = () => { stage.classList.remove('noimg'); stage.dataset.label = x.cap; stage.innerHTML = `<img onload="this.closest('.media')&&this.closest('.media').classList.add('loaded')" src="${x.src}" alt="${esc(x.cap)}">`; $('b', lb).textContent = x.cap; $('span', lb).textContent = `${idx + 1} / ${shown.length}`; stage.classList.remove('swap'); };
    if (quick) set(); else { stage.classList.add('swap'); setTimeout(set, 220); }
  };
  const close = () => { lb.classList.remove('open'); lock(false); };
  g.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b) return; show(+b.dataset.i, true); lb.classList.add('open'); lock(true); $('.x', lb).focus(); });
  $('.x', lb).onclick = close; $('.pv', lb).onclick = () => show(idx - 1); $('.nx', lb).onclick = () => show(idx + 1);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1); });
  let x0 = null; lb.addEventListener('pointerdown', e => x0 = e.clientX); lb.addEventListener('pointerup', e => { if (x0 != null && Math.abs(e.clientX - x0) > 50) show(idx + (e.clientX < x0 ? 1 : -1)); x0 = null; });
  draw();
}

/* ---------- contact & delivery ---------- */
function contact() {
  $$('[data-wa-form]').forEach(f => {
    f.addEventListener('submit', e => {
      e.preventDefault(); let ok = true;
      $$('[data-req]', f).forEach(el => { const w = el.closest('.field'), bad = el.value.trim().length < (+el.dataset.req || 2); w.classList.toggle('bad', bad); if (bad) { ok = false; $('.err', w).textContent = el.dataset.msg || 'This field is required.'; } });
      if (!ok) return;
      const v = n => (f.elements[n] ? f.elements[n].value.trim() : '');
      const msg = f.dataset.waForm === 'hostel' ? `Hi Common Room! Do you deliver to ${v('hostel')}?` : `Hi Common Room! My name is ${v('name')}.${v('phone') ? ' Phone: ' + v('phone') + '.' : ''}\n\n${v('message')}`;
      const w = window.open(waLink(msg), '_blank'); if (!w) location.href = waLink(msg);
      toast('Opening WhatsApp…'); f.reset();
    });
    $$('input,textarea', f).forEach(i => i.addEventListener('input', () => i.closest('.field')?.classList.remove('bad')));
  });
  const hrs = $('#hours'); if (hrs) {
    const today = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Nairobi', weekday: 'long' });
    hrs.innerHTML = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => `<li class="${d === today ? 'today' : ''}"><span>${d}${d === today ? ' · today' : ''}</span><span>${C.hoursLabel}</span></li>`).join('');
  }
  const z = $('#zones'); if (z) z.innerHTML = C.delivery.zones.map(x => `<div class="card zone"><div><h3>${esc(x.zone)}</h3><p>${esc(x.note)}</p></div><span class="fee">${esc(x.fee)}</span></div>`).join('');
  $$('[data-cfg]').forEach(el => { const v = el.dataset.cfg; el.textContent = v === 'minOrder' ? C.delivery.minOrder : v === 'time' ? C.delivery.time : ''; });
  $$('[data-wa]').forEach(a => { a.href = waLink(a.dataset.wa || 'Hi Common Room! '); a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-tel]').forEach(a => { a.href = 'tel:' + C.phone.replace(/\s/g, ''); a.textContent = C.phone; });
  $$('[data-mail]').forEach(a => { a.href = 'mailto:' + C.email; a.textContent = C.email; });
  $$('[data-loc]').forEach(a => a.textContent = C.location);
}

/* ---------- cookie notice ---------- */
function cookie() {
  if (store.get('cr_ck', false)) return;
  document.body.insertAdjacentHTML('beforeend', `<div class="cookie" role="region" aria-label="Cookie notice"><p>We save your cart and details on your device to make ordering easier. <button class="lnk" data-modal="cookies">Cookies policy</button></p><button class="btn btn-primary sm" data-ck>Got it</button></div>`);
  const c = $('.cookie'); setTimeout(() => c.classList.add('in'), 1600);
  $('[data-ck]', c).onclick = () => { store.set('cr_ck', true); c.classList.remove('in'); setTimeout(() => c.remove(), 700); };
}

/* ---------- boot ---------- */
layout(); events(); render(); initReveal(); openBadge(); reviews(); home(); menu(); order(); faq(); gallery(); contact(); cookie();
const ready = () => requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('ready')));
document.readyState === 'complete' ? ready() : addEventListener('load', ready); setTimeout(ready, 1800);
})();
