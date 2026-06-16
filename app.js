// ============ JS partagé (toutes les pages) ============
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Révélation au scroll
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.16 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
  }

  // Parallaxe léger sur les glows de hero
  if (!reduce) {
    const glows = document.querySelectorAll('.hero-glow, .page-hero .glow');
    if (glows.length) {
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          glows.forEach((g) => { g.style.transform = `translateX(-50%) translateY(${y * 0.22}px)`; });
        }
      }, { passive: true });
    }
  }

  // Année automatique dans le footer (élément avec id="year")
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
