// ============ STUDIO — JS partagé (fusion) ============
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Révélation au scroll
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.14 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else { document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in')); }

  // Parallaxe doux sur les glows
  if (!reduce) {
    const glows = document.querySelectorAll('.hero-bg, .page-hero .glow');
    if (glows.length) {
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < window.innerHeight) glows.forEach((g) => { g.style.transform = `translateY(${y * 0.18}px)`; });
      }, { passive: true });
    }
  }

  // Année auto
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// ============ Menu mobile (injecté automatiquement) ============
(function () {
  const navInner = document.querySelector('.nav-inner');
  const links = document.querySelector('.nav-links');
  if (!navInner || !links) return;

  const burger = document.createElement('button');
  burger.className = 'burger'; burger.setAttribute('aria-label', 'Menu');
  burger.innerHTML = '<span></span><span></span>';
  navInner.appendChild(burger);

  const menu = document.createElement('div');
  menu.className = 'm-menu';
  links.querySelectorAll('a').forEach((a) => menu.appendChild(a.cloneNode(true)));
  const cta = document.querySelector('.nav-cta');
  if (cta) { const c = cta.cloneNode(true); c.className = 'm-cta'; menu.appendChild(c); }
  document.body.appendChild(menu);

  const close = () => { menu.classList.remove('open'); burger.classList.remove('open'); document.body.style.overflow = ''; };
  const toggle = () => {
    const o = menu.classList.toggle('open'); burger.classList.toggle('open', o);
    document.body.style.overflow = o ? 'hidden' : '';
  };
  burger.addEventListener('click', toggle);
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 760) close(); });
})();
