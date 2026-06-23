// ============ STUDIO — JS partagé (fusion) ============

// ====================================================================
// MODIFIER : Active/désactive la modal "Work in Progress" PAGE PAR PAGE
// true  = la modal s'affiche sur cette page
// false = la page est accessible normalement
//
// Le nom correspond au fichier HTML (sans le .html)
// Ajoute une ligne si tu crées une nouvelle page
const WIP = {
  'index':       false,
  'jeux':        true,
  'jeu':         true,
  'studio':      false,
  'fondateurs':  false,
  'actualites':  true,
  'article':     true,
  'presse':      true,
  'contact':     true,
  'admin':       false,   // admin toujours accessible
  '404':         false,   // 404 toujours accessible
};
// ====================================================================

// Signale au CSS que le JS est chargé → active les animations reveal
document.documentElement.classList.add('js');

// ============ Modal Work in Progress ============
(function () {
  // Détecte la page courante depuis le nom du fichier
  const path = location.pathname.split('/').pop().replace('.html', '') || 'index';
  const showWip = WIP[path] === true;

  if (!showWip) return;

  const overlay = document.createElement('div');
  overlay.id = 'wip-overlay';
  overlay.innerHTML = `
    <div class="wip-box">
      <div class="wip-dots"><i></i><i></i><i></i></div>
      <p class="wip-label">// status</p>
      <h2 class="wip-title">Work in <span>Progress</span></h2>
      <p class="wip-sub">Ce site est en cours de construction.<br>Revenez bientôt.</p>
      <div class="wip-bar"><div class="wip-fill"></div></div>
      <button class="wip-btn" id="wip-close">ENTRER QUAND MÊME</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  document.getElementById('wip-close').onclick = function () {
    overlay.style.opacity = '0';
    document.body.style.overflow = '';
    setTimeout(function () { overlay.remove(); }, 400);
  };
})();

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
