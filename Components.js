// ============================================================
//  STUDIO — Composants partagés (header + footer)
//  Charge header.html et footer.html via fetch
//  MODIFIER : édite header.html et footer.html directement
// ============================================================

(function() {
  var page = document.body.getAttribute('data-page') || '';

  // Charge le header
  var headerEl = document.getElementById('header');
  if (headerEl) {
    fetch('header.html')
      .then(function(r) { return r.text(); })
      .then(function(html) {
        headerEl.innerHTML = html;
        // Marque le lien actif
        var links = headerEl.querySelectorAll('.nav-links a');
        links.forEach(function(a) {
          var href = a.getAttribute('href').replace('.html', '');
          if (href === page || (href === 'jeux' && page === 'jeu') ||
              (href === 'studio' && page === 'fondateurs') ||
              (href === 'actualites' && page === 'article')) {
            a.classList.add('active');
          }
        });
      })
      .catch(function(e) { console.error('Header load failed:', e); });
  }

  // Charge le footer
  var footerEl = document.getElementById('footer');
  if (footerEl) {
    fetch('footer.html')
      .then(function(r) { return r.text(); })
      .then(function(html) {
        footerEl.innerHTML = html;
        // Année auto
        var copy = footerEl.querySelector('.copyright');
        if (copy) copy.textContent = '© ' + new Date().getFullYear() + ' STUDIO - tous droits réservés.';
      })
      .catch(function(e) { console.error('Footer load failed:', e); });
  }
})();