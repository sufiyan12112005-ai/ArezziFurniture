'use strict';
const AREZZI = window.AREZZI = {};
AREZZI.base = location.pathname.includes('/internal/') ? '../' : '';
AREZZI.url = path => AREZZI.base + path;
AREZZI.escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
AREZZI.configured = value => Boolean(value && !value.startsWith('PASTE_'));
AREZZI.track = (name, detail = {}) => {
  // No tracking provider is installed. Subscribe to this event after your privacy review.
  document.dispatchEvent(new CustomEvent('arezzi:analytics', { detail: { name, ...detail } }));
};
AREZZI.icon = (type = 'sofa') => {
  const paths = {sofa:'M5 13V8a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v5M5 13H3v11h26V13h-2M5 13v6h22v-6M6 24v4m20-4v4',bed:'M4 9v19m24-19v19M4 22h24M4 17h24V9H4m4 8v-5h6v5m4 0v-5h6v5',table:'M3 12h26v4H3zm4 4v12m18-12v12M8 12l1-5h14l1 5',craft:'M7 26L23 6m-8-1 12 10M5 24l3 3m2-20L5 12l15 15 5-5z',pin:'M16 29S6 20 6 12a10 10 0 0 1 20 0c0 8-10 17-10 17zm0-12a5 5 0 1 0 0-10 5 5 0 0 0 0 10',measure:'M3 11h26v11H3zm5 0v6m5-6v4m5-4v6m5-6v4',fabric:'M5 5h22v22H5zm0 7h22M5 19h22M12 5v22M19 5v22',delivery:'M2 9h17v15H2zm17 5h7l4 6v4H19M9 25a3 3 0 1 1-6 0 3 3 0 0 1 6 0m18 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0'};
  return `<svg class="line-icon" viewBox="0 0 32 32" aria-hidden="true"><path d="${paths[type] || paths.sofa}"/></svg>`;
};
AREZZI.picture = (name, alt, extra = '') => `<img src="${AREZZI.url('assets/images/' + name + '.webp')}" srcset="${AREZZI.url('assets/images/' + name + '-640.webp')} 640w, ${AREZZI.url('assets/images/' + name + '.webp')} 1440w" sizes="(max-width: 767px) 92vw, 45vw" width="1440" height="810" alt="${AREZZI.escape(alt)}" loading="lazy" decoding="async" ${extra}>`;
AREZZI.brand = () => `<a class="brand" href="${AREZZI.url('index.html')}" aria-label="Arezzi Furniture home">AREZZI<small>FURNITURE</small></a>`;
AREZZI.contactLinks = (root = document) => {
  root.querySelectorAll('[data-contact]').forEach(a => {
    const kind = a.dataset.contact;
    const value = kind === 'maps' ? SITE_CONFIG.googleMaps : kind === 'phone' ? SITE_CONFIG.phone : kind === 'email' ? SITE_CONFIG.email : kind === 'whatsapp' ? SITE_CONFIG.whatsapp : SITE_CONFIG.social[kind];
    let valid = AREZZI.configured(value), href = '';
    if (valid && kind === 'phone') { valid = /^[+\d\s()-]{7,20}$/.test(value); href = 'tel:' + value.replace(/[^+\d]/g, ''); }
    else if (valid && kind === 'email') { valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); href = 'mailto:' + value; }
    else if (valid && kind === 'whatsapp') { valid = /^\d{7,15}$/.test(value.replace(/\D/g, '')); href = 'https://wa.me/' + value.replace(/\D/g, '') + '?text=' + encodeURIComponent(a.dataset.message || 'Hello Arezzi Furniture, I would like to know more about your custom furniture.'); }
    else if (valid) { try { const url = new URL(value); valid = url.protocol === 'https:' || url.protocol === 'http:'; href = url.href; } catch { valid = false; } }
    a.classList.toggle('unavailable', !valid);
    if (valid) { a.href = href; a.removeAttribute('aria-disabled'); a.removeAttribute('title'); if (href.startsWith('http')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } }
    else { a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); a.title = 'Contact detail will be available once supplied by Arezzi Furniture'; }
  });
};
AREZZI.setupDialog = dialog => {
  dialog.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { document.body.classList.remove('locked'); dialog._opener?.focus(); });
};
AREZZI.openDialog = (dialog, opener) => { dialog._opener = opener || document.activeElement; dialog.showModal(); document.body.classList.add('locked'); dialog.querySelector('[data-close]')?.focus(); };
document.addEventListener('DOMContentLoaded', () => {
  const pageImage={'sofas.html':'sofas/arezzi-l-shape-sofa-beige','beds.html':'beds/arezzi-king-upholstered-bed','tables.html':'tables/arezzi-walnut-dining-table','about.html':'craftsmanship/arezzi-furniture-craftsmanship','gallery.html':'sofas/arezzi-chesterfield-sofa-green','projects.html':'tables/arezzi-walnut-dining-table','book-consultation.html':'sofas/arezzi-l-shape-sofa-beige'}[location.pathname.split('/').pop()];
  const intro=document.querySelector('.page-intro');if(pageImage&&intro){intro.classList.add('image-intro');intro.style.setProperty('--intro-photo',`url('${AREZZI.url('assets/images/'+pageImage+'.webp')}')`);}
  const nav = [['Home','index.html'],['About','about.html'],['Gallery','gallery.html'],['Projects','projects.html'],['Services','services.html'],['Contact','contact.html']];
  const navLink = ([label, path]) => `<a href="${AREZZI.url(path)}" ${location.pathname.endsWith(path) || (path === 'index.html' && location.pathname.endsWith('/')) ? 'aria-current="page"' : ''}>${label}</a>`;
  const header = document.querySelector('#site-header');
  if (header) header.innerHTML = `<div class="header-inner">${AREZZI.brand()}<a class="mobile-chat" data-contact="whatsapp">WhatsApp ↗</a><button class="menu-toggle" aria-label="Open navigation" aria-controls="primary-nav" aria-expanded="false">☰</button><nav class="nav-links" id="primary-nav" aria-label="Main navigation"><button class="menu-close" aria-label="Close navigation">×</button>${nav.slice(0,2).map(navLink).join('')}<details><summary>Furniture</summary><div class="dropdown">${[['Sofas','sofas.html'],['Beds','beds.html'],['Tables','tables.html']].map(navLink).join('')}</div></details>${nav.slice(2).map(navLink).join('')}</nav><a class="header-chat" data-contact="whatsapp">WhatsApp ↗</a><a class="btn header-quote" href="${AREZZI.url('request-quote.html')}">Enquire Now ↗</a></div>`;
  const footer = document.querySelector('#site-footer');
  if (footer) footer.innerHTML = `<div class="container"><div class="footer-grid"><div>${AREZZI.brand()}<p>Custom furniture crafted for spaces across Bengaluru.</p><p>Made around your space.<br>Made to feel like home.</p></div><div><h3>Quick links</h3><ul>${[['Home','index.html'],['About','about.html'],['Sofas','sofas.html'],['Beds','beds.html'],['Tables','tables.html']].map(x=>'<li>'+navLink(x)+'</li>').join('')}</ul></div><div><h3>Customer support</h3><ul>${[['Enquire Now','request-quote.html'],['Request a Home Visit','book-consultation.html'],['Contact','contact.html'],['FAQ','faq.html'],['Privacy Policy','privacy-policy.html'],['Terms','terms.html']].map(x=>'<li>'+navLink(x)+'</li>').join('')}</ul></div><div><h3>Let’s talk furniture</h3><ul><li><a data-contact="phone">${AREZZI.configured(SITE_CONFIG.phone)?AREZZI.escape(SITE_CONFIG.phone):'Phone to be provided'}</a></li><li><a data-contact="whatsapp">WhatsApp${AREZZI.configured(SITE_CONFIG.whatsapp)?'':' — number to be provided'}</a></li><li><a data-contact="email">${AREZZI.configured(SITE_CONFIG.email)?AREZZI.escape(SITE_CONFIG.email):'Email to be provided'}</a></li><li>${AREZZI.configured(SITE_CONFIG.address)?AREZZI.escape(SITE_CONFIG.address):'Bengaluru, Karnataka · address to be provided'}</li><li>${AREZZI.escape(SITE_CONFIG.businessHours)}</li></ul><div class="socials">${Object.keys(SOCIAL_LINKS).filter(k=>AREZZI.configured(SOCIAL_LINKS[k])).map(k=>`<a data-contact="${k}">${k[0].toUpperCase()+k.slice(1)}</a>`).join('')}</div></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Arezzi Furniture. All rights reserved.</span><span><a href="${AREZZI.url('privacy-policy.html')}">Privacy Policy</a> &nbsp; / &nbsp; <a href="${AREZZI.url('terms.html')}">Terms and Conditions</a></span></div><p class="small muted" style="margin-top:18px;color:#bfb6ac">Generated visuals are design inspiration, not photographs of Arezzi products or installations.</p></div>`;
  document.querySelectorAll('[data-icon]').forEach(el => el.innerHTML = AREZZI.icon(el.dataset.icon));
  document.querySelectorAll('[data-picture]').forEach(el => el.innerHTML = AREZZI.picture(el.dataset.picture, el.dataset.alt || 'Furniture design inspiration'));
  document.querySelectorAll('[data-business]').forEach(el => { const value = SITE_CONFIG[el.dataset.business]; if (AREZZI.configured(value)) el.textContent = value; });
  if(!/request-quote|enquiry|contact|book|internal|bill/.test(location.pathname)) document.body.insertAdjacentHTML('beforeend', `<aside class="floating-contact" aria-label="Contact Arezzi"><a data-contact="whatsapp" aria-label="Chat on WhatsApp" title="Chat on WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.3A8.5 8.5 0 1 1 20 11.5Z"/><path d="M8 7c0 5 4 8 8 8l1-2-3-1-1 1c-2-1-3-2-3-3l1-1-1-2Z"/></svg></a><a data-contact="phone" aria-label="Call Arezzi" title="Call Arezzi"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3 3 5c0 8 8 16 16 16l2-3-5-3-2 2c-3-1-6-4-7-7l2-2Z"/></svg></a></aside>`);
  AREZZI.contactLinks();
  const menu = document.querySelector('#primary-nav'), toggle = document.querySelector('.menu-toggle');
  const closeMenu = () => { menu?.classList.remove('open'); toggle?.setAttribute('aria-expanded','false'); document.body.classList.remove('locked'); if (menu?.contains(document.activeElement)) toggle.focus(); };
  toggle?.addEventListener('click', () => { const open = !menu.classList.contains('open'); if (!open) return closeMenu(); menu.classList.add('open'); toggle.setAttribute('aria-expanded','true'); document.body.classList.add('locked'); menu.querySelector('.menu-close').focus(); });
  menu?.querySelector('.menu-close')?.addEventListener('click',closeMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { if(menu?.classList.contains('open')) closeMenu(); document.querySelectorAll('.nav-links details[open]').forEach(d=>{d.open=false;d.querySelector('summary').focus();}); } if (e.key === 'Tab' && menu?.classList.contains('open')) { const nodes = [...menu.querySelectorAll('a,button,summary')].filter(x=>x.getClientRects().length); const first=nodes[0],last=nodes.at(-1); if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();} } });
  const scrollHeader = () => header?.classList.toggle('scrolled', scrollY > 30); scrollHeader(); window.addEventListener('scroll', scrollHeader, { passive: true });
  window.addEventListener('resize',()=>{ if(innerWidth>1020&&menu?.classList.contains('open'))closeMenu(); });
  const logoMedia = matchMedia('(max-width:767px)');
  function setLogos(){document.querySelectorAll('.brand').forEach(el=>{el.innerHTML=`<img src="${AREZZI.url('assets/images/brand/logo-mark.png')}" alt="" width="90" height="90"><span>AREZZI<small>FURNITURE</small><em>SPACES THAT FEEL LIKE YOU</em></span>`;});}
  setLogos();

  document.addEventListener('click',e=>{ const a=e.target.closest('a');if(!a)return;if(a.getAttribute('aria-disabled')==='true'){e.preventDefault();return;}if(a.dataset.contact==='whatsapp')AREZZI.track('whatsapp_click');if(a.dataset.contact==='phone')AREZZI.track('phone_click');if(a.getAttribute('href')?.includes('request-quote.html'))AREZZI.track('request_quote_click'); });
  const heroVideo=document.querySelector('#hero-video');
  if(heroVideo && heroVideo.dataset.source){heroVideo.src=AREZZI.url(heroVideo.dataset.source);heroVideo.hidden=false; if(!matchMedia('(prefers-reduced-motion:reduce)').matches)heroVideo.play().catch(()=>{heroVideo.hidden=true;});document.querySelector('#motion-toggle')?.addEventListener('click',e=>{if(heroVideo.paused){heroVideo.play();e.target.textContent='Pause film';}else{heroVideo.pause();e.target.textContent='Play film';}});}
  const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');reveal.unobserve(entry.target);}}),{threshold:.06});
  if(!matchMedia('(prefers-reduced-motion:reduce)').matches)document.querySelectorAll('.section-head,.split,.value').forEach(el=>{el.classList.add('reveal');reveal.observe(el);});
  if(document.querySelector('#thank-you-content')){let receipt;try{receipt=JSON.parse(sessionStorage.getItem('arezzi-receipt')||'null');}catch{}const target=document.querySelector('#thank-you-content');if(receipt&&receipt.success===true&&Date.now()-receipt.at<3600000){target.querySelector('h1').textContent='Your request has been received.';target.querySelector('[data-next]').textContent=receipt.type==='consultation'?'Our team will contact you to confirm consultation availability.':'Our team will review your requirements and contact you to discuss the next steps.';target.querySelector('[data-reference]').textContent=receipt.reference?'Enquiry reference: '+receipt.reference:'No reference ID was returned.';target.querySelector('.success-icon').textContent='✓';}else{target.querySelector('h1').textContent='Let’s start with your requirements.';target.querySelector('[data-next]').textContent='A confirmed submission will appear here after your request is received.';target.querySelector('[data-reference]').textContent='';target.querySelector('.success-icon').textContent='↗';}}
});
