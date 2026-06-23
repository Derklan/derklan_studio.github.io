// ============================================================
//  STUDIO — Composants partagés (header + footer)
//  Charge header.html et footer.html via fetch
// ============================================================

(function() {
  const currentPage = document.body.getAttribute('data-page') || '';

  // Charge le header
  const headerEl = document.getElementById('header');
  if (headerEl) {
    fetch('./components/header.html')
      .then(r => {
        if (!r.ok) throw new Error('Header load failed: ' + r.status);
        return r.text();
      })
      .then(html => {
        headerEl.innerHTML = html;
        // Marque le lien actif
        const links = headerEl.querySelectorAll('.nav-link');
        links.forEach(link => {
          const page = link.getAttribute('data-page');
          if (page === currentPage) {
            link.classList.add('active');
          }
        });
      })
      .catch(e => console.error('Header load failed:', e));
  }

  // Charge le footer
  const footerEl = document.getElementById('footer');
  if (footerEl) {
    fetch('./components/footer.html')
      .then(r => {
        if (!r.ok) throw new Error('Footer load failed: ' + r.status);
        return r.text();
      })
      .then(html => {
        footerEl.innerHTML = html;
        // Année auto
        const yearEl = footerEl.querySelector('#year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
      })
      .catch(e => console.error('Footer load failed:', e));
  }
})();
