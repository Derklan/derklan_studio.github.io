// ============================================================
//  STUDIO — Système admin devlog (template structuré)
// ============================================================

// MODIFIER : Mot de passe admin (par défaut : "studio2024")
// Pour changer : console → crypto.subtle.digest('SHA-256', new TextEncoder().encode('tonmdp'))
//   .then(b=>console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))
const ADMIN_HASH = '0daab506bc7b67801525e210c0a0325f8296bac8485d75c7d5466425abb7de0a';

// ---- Auth ----
async function hashPwd(pwd) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pwd));
  return [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('');
}
function isLoggedIn() { return sessionStorage.getItem('studio_admin') === 'true'; }
function logout() { sessionStorage.removeItem('studio_admin'); location.reload(); }
async function tryLogin(pwd) {
  const h = await hashPwd(pwd);
  if (h === ADMIN_HASH) { sessionStorage.setItem('studio_admin', 'true'); return true; }
  return false;
}

// ---- CRUD ----
function getPosts() { try { return JSON.parse(localStorage.getItem('studio_posts') || '[]'); } catch { return []; } }
function savePosts(posts) { localStorage.setItem('studio_posts', JSON.stringify(posts)); }
function addPost(post) {
  const posts = getPosts();
  post.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  post.created = new Date().toISOString();
  posts.unshift(post); savePosts(posts); return post;
}
function updatePost(id, data) {
  const posts = getPosts(); const i = posts.findIndex(p => p.id === id);
  if (i === -1) return null;
  posts[i] = { ...posts[i], ...data, updated: new Date().toISOString() };
  savePosts(posts); return posts[i];
}
function deletePost(id) { savePosts(getPosts().filter(p => p.id !== id)); }
function getPost(id) { return getPosts().find(p => p.id === id) || null; }
function esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

// ---- Icônes flat (SVG inline) ----
const ICO = {
  project:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 3v18M3 9h18"/></svg>',
  engine:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M1 12h4M19 12h4M4.2 19.8l2.8-2.8M17 7l2.8-2.8"/></svg>',
  version:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
  done:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
  next:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
  bug:      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 2l1.88 1.88M14.12 3.88L16 2M9 7.13v-1a3 3 0 116 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 014-4h4a4 4 0 014 4v3c0 3.3-2.7 6-6 6z"/><path d="M12 20v-9M6.53 9C4.6 8.8 3 7.1 3 5M17.47 9c1.93-.2 3.53-1.9 3.53-4M6 13H2M22 13h-4M6 17H2M22 17h-4"/></svg>',
  media:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
};

// ---- Status config ----
const STATUS_MAP = {
  concept:     { label: 'Concept',        color: '#8a8a93', desc: 'idéation, recherche' },
  preprod:     { label: 'Pré-production', color: '#ff7a3c', desc: 'prototypage, direction artistique' },
  production:  { label: 'En production',  color: '#ff2e7e', desc: 'développement actif' },
  alpha:       { label: 'Alpha',          color: '#b14bff', desc: 'jouable, features incomplètes' },
  beta:        { label: 'Beta',           color: '#56a8f5', desc: 'feature-complete, polish en cours' },
  rc:          { label: 'Release Candidate', color: '#2aacb8', desc: 'candidat à la sortie' },
  gold:        { label: 'Gold',           color: '#28c840', desc: 'version finale validée' },
  live:        { label: 'Live',           color: '#e0c878', desc: 'sorti, mises à jour actives' },
  onhold:      { label: 'En pause',       color: '#5a5a62', desc: 'projet suspendu' },
};

// ---- Rendu d'un post structuré (carte devlog) ----
function renderPostCard(p) {
  const d = new Date(p.created);
  const date = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  const st = STATUS_MAP[p.status] || STATUS_MAP.alpha;

  let html = '<div class="devlog-card">';
  // Header
  html += '<div class="dl-header">';
  html += '<div class="dl-date mono">' + date + '</div>';
  html += '<span class="dl-status" style="--st-color:' + st.color + '">' + st.label + '</span>';
  html += '</div>';
  // Projet + Engine + Version
  html += '<h3 class="dl-title">' + ICO.project + ' ' + esc(p.project || 'Sans titre') + '</h3>';
  if (p.pitch) html += '<p class="dl-pitch">' + esc(p.pitch) + '</p>';
  html += '<div class="dl-meta">';
  if (p.engine) html += '<span>' + ICO.engine + ' ' + esc(p.engine) + '</span>';
  if (p.version) html += '<span>' + ICO.version + ' v' + esc(p.version) + '</span>';
  html += '</div>';
  // Sections
  if (p.done) {
    html += '<div class="dl-section"><h4>' + ICO.done + ' Nouvelles fonctionnalités</h4>';
    html += '<ul>' + p.done.split('\n').filter(Boolean).map(l => '<li>' + esc(l) + '</li>').join('') + '</ul></div>';
  }
  if (p.next) {
    html += '<div class="dl-section"><h4>' + ICO.next + ' À venir</h4>';
    html += '<ul>' + p.next.split('\n').filter(Boolean).map(l => '<li>' + esc(l) + '</li>').join('') + '</ul></div>';
  }

  // Médias : carousel
  var mediaArr = [];
  try { mediaArr = JSON.parse(p.media || '[]'); } catch(e) { mediaArr = []; }
  if (mediaArr.length > 0) {
    var cid = 'carousel-' + (p.id || Math.random().toString(36).slice(2));
    html += '<div class="dl-section"><h4>' + ICO.media + ' Médias</h4>';
    html += '<div class="carousel" id="' + cid + '">';
    html += '<div class="carousel-track">';
    mediaArr.forEach(function(m) {
      html += '<div class="carousel-slide">';
      html += '<img src="' + esc(m.url) + '" alt="' + esc(m.desc || '') + '" loading="lazy" onerror="this.style.display=\'none\'" />';
      if (m.desc) html += '<div class="carousel-caption">' + esc(m.desc) + '</div>';
      html += '</div>';
    });
    html += '</div>';
    if (mediaArr.length > 1) {
      html += '<button class="carousel-btn carousel-prev" onclick="carouselNav(\'' + cid + '\',-1)">‹</button>';
      html += '<button class="carousel-btn carousel-next" onclick="carouselNav(\'' + cid + '\',1)">›</button>';
      html += '<div class="carousel-dots">';
      mediaArr.forEach(function(_,i) {
        html += '<button class="carousel-dot' + (i===0?' active':'') + '" onclick="carouselGo(\'' + cid + '\',' + i + ')"></button>';
      });
      html += '</div>';
    }
    html += '</div></div>';
  }
  html += '</div>';
  return html;
}

// ---- Rendu liste devlog (actualites.html) ----
function renderDevlog() {
  const container = document.getElementById('devlog-posts');
  if (!container) return;
  const posts = getPosts();
  if (posts.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--muted);font-family:var(--mono);padding:60px 0">// aucun devlog pour le moment</p>';
    return;
  }
  container.innerHTML = posts.map(p => '<a class="devlog-link reveal in" href="article.html?id=' + p.id + '">' + renderPostCard(p) + '</a>').join('');
}

// ---- Rendu article unique (article.html) ----
function renderArticle() {
  const container = document.getElementById('article-content');
  if (!container) return;
  const id = new URLSearchParams(location.search).get('id');
  const post = id ? getPost(id) : null;
  if (!post) { container.innerHTML = '<p style="text-align:center;color:var(--muted);padding:80px 0">Article introuvable.</p>'; return; }
  document.title = (post.project || 'Devlog') + ' — STUDIO';
  container.innerHTML = renderPostCard(post)
    + '<div style="margin-top:48px;padding-top:28px;border-top:1px solid var(--line)">'
    + '<a class="btn-link" href="actualites.html">← retour au devlog</a></div>';
}


// ---- Carousel navigation ----
window.carouselNav = function(id, dir) {
  var el = document.getElementById(id);
  if (!el) return;
  var track = el.querySelector('.carousel-track');
  var slides = track.querySelectorAll('.carousel-slide');
  var dots = el.querySelectorAll('.carousel-dot');
  var current = parseInt(track.dataset.current || '0');
  current = (current + dir + slides.length) % slides.length;
  track.style.transform = 'translateX(-' + (current * 100) + '%)';
  track.dataset.current = current;
  dots.forEach(function(d, i) { d.classList.toggle('active', i === current); });
};
window.carouselGo = function(id, index) {
  var el = document.getElementById(id);
  if (!el) return;
  var track = el.querySelector('.carousel-track');
  var dots = el.querySelectorAll('.carousel-dot');
  track.style.transform = 'translateX(-' + (index * 100) + '%)';
  track.dataset.current = index;
  dots.forEach(function(d, i) { d.classList.toggle('active', i === index); });
};

document.addEventListener('DOMContentLoaded', () => { renderDevlog(); renderArticle(); });
