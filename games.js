// ============================================================
//  STUDIO — Système Jeux (catalogue + fiche jeu)
//  Version CMS : lecture depuis content/jeux.json (rempli par Sveltia CMS)
//  Seules la SOURCE des données et l'init ont changé. Le rendu est intact.
// ============================================================

// ---- Helpers ----
function gEsc(s){ const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

// ---- Badges (statut commercial du jeu) ----
const GAME_BADGE = {
  available: { label: 'Disponible',       color: '#28c840' },
  early:     { label: 'Accès anticipé',   color: '#56a8f5' },
  soon:      { label: 'Bientôt',          color: '#ff7a3c' },
  proto:     { label: 'Prototype',        color: '#b14bff' },
  dev:       { label: 'En développement', color: '#ff2e7e' },
  onhold:    { label: 'En pause',         color: '#5a5a62' },
};

// ============================================================
//  LECTURE depuis content/jeux.json  (généré par le CMS)
//  -> remplace l'ancien stockage localStorage
// ============================================================
let GAMES_CACHE = null;

function _gSlug(s){
  return (s || '').toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // enlève les accents
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'jeu';
}

async function loadGames(){
  if (GAMES_CACHE) return GAMES_CACHE;
  try {
    const res = await fetch('content/jeux.json', { cache: 'no-cache' });
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.jeux || []);
    // id stable pour les jeux créés via le CMS qui n'en ont pas encore
    const counts = {};
    list.forEach(g => {
      if (!g.id){
        const base = _gSlug(g.name);
        if (counts[base] === undefined){ counts[base] = 0; g.id = base; }
        else { counts[base]++; g.id = base + '-' + counts[base]; }
      }
    });
    // plus récent en premier (si une date est présente)
    list.sort((a, b) => String(b.created || '').localeCompare(String(a.created || '')));
    GAMES_CACHE = list;
  } catch (e){
    console.error('// chargement de content/jeux.json échoué', e);
    GAMES_CACHE = [];
  }
  return GAMES_CACHE;
}

function getGames(){ return GAMES_CACHE || []; }
function getGame(id){ return getGames().find(g => g.id === id) || null; }

// L'édition se fait désormais dans le CMS (page /admin/), plus en localStorage.
// On neutralise donc l'ancien mode admin in-page (boutons éditer/suppr. sur le site public).
function gIsAdmin(){ return false; }

// ============================================================
//  CAROUSEL images + vidéos (auto-suffisant, styles injectés)
// ============================================================
(function injectCarouselCSS(){
  if (document.getElementById('game-carousel-css')) return;
  const css = `
  .game-carousel{position:relative;border-radius:16px;overflow:hidden;border:1px solid var(--line,#26262d);background:#000}
  .game-carousel .gc-track{display:flex;transition:transform .45s cubic-bezier(.4,0,.2,1)}
  .game-carousel .gc-slide{min-width:100%;position:relative;line-height:0}
  .game-carousel .gc-slide img,
  .game-carousel .gc-slide video,
  .game-carousel .gc-slide iframe{width:100%;display:block;aspect-ratio:16/9;object-fit:cover;border:0;background:#000}
  .game-carousel .gc-caption{position:absolute;left:0;right:0;bottom:0;padding:14px 18px;
    font-family:var(--mono,monospace);font-size:12px;color:#fff;line-height:1.4;
    background:linear-gradient(transparent,rgba(0,0,0,.78))}
  .game-carousel .gc-btn{position:absolute;top:50%;transform:translateY(-50%);width:42px;height:42px;
    border:none;border-radius:50%;cursor:pointer;color:#fff;font-size:22px;line-height:1;
    background:linear-gradient(135deg,#ff2e7e,#b14bff 55%,#ff7a3c);display:grid;place-items:center;
    opacity:.9;transition:.15s;z-index:2}
  .game-carousel .gc-btn:hover{opacity:1;transform:translateY(-50%) scale(1.08)}
  .game-carousel .gc-prev{left:14px}
  .game-carousel .gc-next{right:14px}
  .game-carousel .gc-dots{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);
    display:flex;gap:8px;z-index:2}
  .game-carousel .gc-dot{width:8px;height:8px;border-radius:50%;border:none;cursor:pointer;padding:0;
    background:rgba(255,255,255,.4);transition:.15s}
  .game-carousel .gc-dot.active{background:#fff;width:22px;border-radius:4px}
  .game-carousel .gc-tag{position:absolute;top:12px;left:12px;z-index:2;font-family:var(--mono,monospace);
    font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#fff;
    background:rgba(0,0,0,.55);padding:4px 9px;border-radius:6px}
  `;
  const s = document.createElement('style'); s.id = 'game-carousel-css'; s.textContent = css;
  document.head.appendChild(s);
})();

// ---- CSS des contrôles admin (conservé, mais inactif car gIsAdmin()=false) ----
(function injectAdminUICSS(){
  if (document.getElementById('game-admin-css')) return;
  const css = `
  .gc-admin-link{position:fixed;right:18px;bottom:18px;z-index:60;font-family:var(--mono,monospace);
    font-size:12px;color:#fff;text-decoration:none;display:inline-flex;align-items:center;gap:8px;
    padding:9px 15px;border-radius:999px;background:rgba(20,20,24,.85);border:1px solid var(--line,#26262d);
    backdrop-filter:blur(8px);transition:.15s}
  .gc-admin-link:hover{border-color:var(--violet,#b14bff)}
  .gc-admin-link .dot{width:7px;height:7px;border-radius:50%;background:linear-gradient(135deg,#ff2e7e,#b14bff)}
  .card{position:relative}
  .card-admin{position:absolute;top:10px;right:10px;z-index:5;display:flex;gap:6px;opacity:0;transition:.15s}
  .card:hover .card-admin{opacity:1}
  .card-admin button{font-family:var(--mono,monospace);font-size:11px;cursor:pointer;
    padding:6px 10px;border-radius:8px;color:#fff;background:rgba(10,10,12,.82);border:1px solid rgba(255,255,255,.16)}
  .card-admin button.edit:hover{background:#b14bff;border-color:#b14bff}
  .card-admin button.del:hover{background:#ff3b5c;border-color:#ff3b5c}
  .game-admin-bar{position:sticky;top:0;z-index:40;display:flex;gap:10px;align-items:center;
    padding:12px 24px;background:rgba(10,10,12,.88);backdrop-filter:blur(10px);border-bottom:1px solid var(--line,#26262d)}
  .game-admin-bar .lbl{margin-right:auto;font-family:var(--mono,monospace);font-size:12px;color:var(--magenta,#ff2e7e)}
  .game-admin-bar a,.game-admin-bar button{font-family:var(--mono,monospace);font-size:12px;cursor:pointer;
    text-decoration:none;padding:8px 14px;border-radius:9px;border:1px solid var(--line,#26262d);
    background:rgba(20,20,24,.8);color:#fff}
  .game-admin-bar .edit:hover{border-color:#b14bff}
  .game-admin-bar .del:hover{border-color:#ff3b5c;color:#ff5a72}
  `;
  const s = document.createElement('style'); s.id = 'game-admin-css'; s.textContent = css;
  document.head.appendChild(s);
})();

// ---- Lien flottant vers le CMS (présent sur jeux.html / jeu.html) ----
function injectAdminLink(){
  if (document.getElementById('gc-admin-link')) return;
  const a = document.createElement('a');
  a.id = 'gc-admin-link';
  a.className = 'gc-admin-link';
  a.href = 'admin/';                 // <- pointe vers le nouveau CMS Sveltia
  a.innerHTML = '<span class="dot"></span>admin';
  document.body.appendChild(a);
}

// Détecte le type de média
function gMediaType(m){
  if (m.type === 'video') return 'video';
  if (m.type === 'image') return 'image';
  if (/youtu\.?be/.test(m.url) || /\.(mp4|webm|ogg)(\?|$)/i.test(m.url) || /vimeo\.com/.test(m.url)) return 'video';
  return 'image';
}
function gYouTubeId(url){
  let m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&]+)/) || url.match(/youtube\.com\/embed\/([^?&]+)/);
  return m ? m[1] : '';
}
function gVimeoId(url){ const m = url.match(/vimeo\.com\/(\d+)/); return m ? m[1] : ''; }

// Construit le HTML d'un carousel pour une liste de médias
function buildGameCarousel(media, idPrefix){
  if (!media || media.length === 0) return '';
  const cid = (idPrefix || 'gc') + '-' + Math.random().toString(36).slice(2, 7);
  let slides = '';
  media.forEach(m => {
    const type = gMediaType(m);
    let inner = '';
    let tag = 'IMAGE';
    if (type === 'video'){
      tag = 'VIDÉO';
      const yt = gYouTubeId(m.url);
      const vm = gVimeoId(m.url);
      if (yt){
        inner = `<iframe src="https://www.youtube.com/embed/${gEsc(yt)}" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
      } else if (vm){
        inner = `<iframe src="https://player.vimeo.com/video/${gEsc(vm)}" allow="autoplay;fullscreen;picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
      } else {
        inner = `<video controls preload="metadata" src="${gEsc(m.url)}"></video>`;
      }
    } else {
      inner = `<img src="${gEsc(m.url)}" alt="${gEsc(m.desc || '')}" loading="lazy" onerror="this.style.display='none'" />`;
    }
    slides += `<div class="gc-slide"><span class="gc-tag">${tag}</span>${inner}`
            + (m.desc ? `<div class="gc-caption">${gEsc(m.desc)}</div>` : '')
            + `</div>`;
  });

  let html = `<div class="game-carousel" id="${cid}"><div class="gc-track" data-current="0">${slides}</div>`;
  if (media.length > 1){
    html += `<button class="gc-btn gc-prev" onclick="gameCarousel('${cid}',-1)">‹</button>`;
    html += `<button class="gc-btn gc-next" onclick="gameCarousel('${cid}',1)">›</button>`;
    html += `<div class="gc-dots">`;
    media.forEach((_, i) => { html += `<button class="gc-dot${i===0?' active':''}" onclick="gameCarouselGo('${cid}',${i})"></button>`; });
    html += `</div>`;
  }
  html += `</div>`;
  return html;
}

window.gameCarousel = function(id, dir){
  const el = document.getElementById(id); if (!el) return;
  const track = el.querySelector('.gc-track');
  const slides = track.querySelectorAll('.gc-slide');
  const dots = el.querySelectorAll('.gc-dot');
  let cur = parseInt(track.dataset.current || '0');
  cur = (cur + dir + slides.length) % slides.length;
  track.style.transform = `translateX(-${cur * 100}%)`;
  track.dataset.current = cur;
  dots.forEach((d, i) => d.classList.toggle('active', i === cur));
};
window.gameCarouselGo = function(id, index){
  const el = document.getElementById(id); if (!el) return;
  const track = el.querySelector('.gc-track');
  const dots = el.querySelectorAll('.gc-dot');
  track.style.transform = `translateX(-${index * 100}%)`;
  track.dataset.current = index;
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
};

// ============================================================
//  RENDU PUBLIC  (inchangé)
// ============================================================

// ---- Grille catalogue (jeux.html → #games-grid) ----
function renderGamesGrid(){
  const c = document.getElementById('games-grid');
  if (!c) return;
  const games = getGames();
  if (games.length === 0){
    c.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--muted);font-family:var(--mono);padding:60px 0">// aucun jeu pour le moment</p>';
    return;
  }
  c.innerHTML = games.map(g => {
    const b = GAME_BADGE[g.badge] || GAME_BADGE.dev;
    const bg = g.cover
      ? `style="background-image:url('${gEsc(g.cover)}');background-size:cover;background-position:center"`
      : '';
    return `<a class="card reveal in" href="jeu.html?id=${g.id}">
      <div class="art" ${bg}></div>
      <div class="body">
        <p class="gen">${gEsc((g.genre || '').toUpperCase())}</p>
        <h4>${gEsc(g.name || 'Sans titre')}</h4>
        <p class="desc">${gEsc(g.pitch || '')}</p>
        <span class="badge" style="border-color:${b.color};color:${b.color}">${b.label}</span>
      </div>
    </a>`;
  }).join('');
}

// ---- Mise en avant accueil (index.html → #featured-games) ----
(function injectFeaturedCSS(){
  if (document.getElementById('game-featured-css')) return;
  const css = `
  .featured-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;max-width:1100px;margin:0 auto}
  .featured-grid[data-count="1"]{grid-template-columns:1fr;max-width:680px}
  .featured-grid[data-count="3"] > *:nth-child(3){grid-column:1 / -1}
  .featured-grid .featured-tag{position:absolute;top:12px;left:12px;z-index:4;font-family:var(--mono,monospace);
    font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#fff;
    background:linear-gradient(135deg,#ff2e7e,#b14bff);padding:4px 10px;border-radius:6px}
  @media(max-width:720px){
    .featured-grid,.featured-grid[data-count="1"]{grid-template-columns:1fr}
    .featured-grid[data-count="3"] > *:nth-child(3){grid-column:auto}
  }`;
  const s = document.createElement('style'); s.id = 'game-featured-css'; s.textContent = css;
  document.head.appendChild(s);
})();

function renderFeaturedGames(){
  const c = document.getElementById('featured-games');
  if (!c) return;
  const section = document.getElementById('featured-section');
  const feat = getGames().filter(g => g.featured).slice(0, 3); // max 3
  if (feat.length === 0){
    c.innerHTML = '';
    if (section) section.style.display = 'none';   // rien si aucun jeu promu
    return;
  }
  if (section) section.style.display = '';
  c.innerHTML = '<div class="featured-grid" data-count="' + feat.length + '">' +
    feat.map(g => {
      const b = GAME_BADGE[g.badge] || GAME_BADGE.dev;
      const bg = g.cover
        ? `style="background-image:url('${gEsc(g.cover)}');background-size:cover;background-position:center"`
        : '';
      return `<a class="card reveal in" href="jeu.html?id=${g.id}">
        <span class="featured-tag">à la une</span>
        <div class="art" ${bg}></div>
        <div class="body">
          <p class="gen">${gEsc((g.genre || '').toUpperCase())}</p>
          <h4>${gEsc(g.name || 'Sans titre')}</h4>
          <p class="desc">${gEsc(g.pitch || '')}</p>
          <span class="badge" style="border-color:${b.color};color:${b.color}">${b.label}</span>
        </div></a>`;
    }).join('') + '</div>';
}

// ---- Fiche jeu (jeu.html → #game-detail) ----
function renderGamePage(){
  const c = document.getElementById('game-detail');
  if (!c) return;
  const id = new URLSearchParams(location.search).get('id');
  const g = id ? getGame(id) : null;

  if (!g){
    c.innerHTML = `<section class="section" style="padding-top:120px"><div class="wrap" style="text-align:center">
      <p style="color:var(--muted);font-family:var(--mono)">// jeu introuvable</p>
      <p style="margin-top:22px"><a class="btn-ghost" href="jeux.html">← retour au catalogue</a></p>
    </div></section>`;
    return;
  }
  document.title = (g.name || 'Jeu') + ' — STUDIO';
  const b = GAME_BADGE[g.badge] || GAME_BADGE.dev;

  // Hero
  const heroBg = g.cover
    ? `style="background-image:linear-gradient(105deg,rgba(10,10,12,.85) 0%,rgba(10,10,12,.5) 55%,rgba(10,10,12,.25) 100%),url('${gEsc(g.cover)}');background-size:cover;background-position:center"`
    : '';
  let storeBtns = '';
  if (g.steamUrl)   storeBtns += `<a class="btn-primary" href="${gEsc(g.steamUrl)}" target="_blank" rel="noopener">WISHLIST STEAM</a>`;
  if (g.trailerUrl) storeBtns += `<a class="btn-ghost" href="${gEsc(g.trailerUrl)}" target="_blank" rel="noopener">// bande-annonce</a>`;

  let html = `<section class="section" style="padding-top:96px"><div class="wrap reveal in">
    <div class="game-hero">
      <div class="art-bg" ${heroBg}></div>
      <div class="inner">
        <p class="kick mono">// ${gEsc(g.genre || '')}</p>
        <h1>${gEsc(g.name || 'Sans titre')}</h1>
        <p class="tag">${gEsc(g.pitch || '')}</p>
        <p style="margin:-6px 0 14px">
          <span class="badge" style="border-color:${b.color};color:${b.color}">${b.label}</span></p>
        ${storeBtns ? `<div class="store-btns">${storeBtns}</div>` : ''}
      </div>
    </div>
  </div></section>`;

  // Carousel médias
  const carousel = buildGameCarousel(g.media || [], 'game');
  if (carousel){
    html += `<section class="section" style="padding-top:0"><div class="wrap reveal in">${carousel}</div></section>`;
  }

  // Description + features + fiche technique
  const paras = (g.description || '').split('\n').filter(l => l.trim());
  const feats = (g.features || '').split('\n').filter(l => l.trim());
  const specs = (g.specs || []).filter(s => s.value && s.value.trim());

  html += `<section class="section" style="padding-top:0"><div class="wrap split">
    <div class="prose reveal in">`;
  if (paras.length) html += paras.map(p => `<p>${gEsc(p)}</p>`).join('');
  if (feats.length){
    html += `<h3 style="font-family:var(--mono);font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin:14px 0 18px">// features</h3>`;
    html += `<ul class="feature-list">` + feats.map(f => `<li>${gEsc(f)}</li>`).join('') + `</ul>`;
  }
  html += `</div>`;

  html += `<aside class="spec reveal in"><h3>// fiche technique</h3>`;
  if (specs.length){
    html += specs.map(s => `<div class="spec-row"><span>${gEsc(s.label)}</span><span>${gEsc(s.value)}</span></div>`).join('');
  } else {
    html += `<p style="color:var(--muted);font-family:var(--mono);font-size:12px">// non renseignée</p>`;
  }
  if (g.steamUrl){
    html += `<div style="margin-top:20px"><a class="btn-primary" href="${gEsc(g.steamUrl)}" target="_blank" rel="noopener" style="display:block;text-align:center">WISHLIST</a></div>`;
  }
  html += `</aside></div></section>`;

  c.innerHTML = html;
}

// ---- Init : on charge d'abord les données, PUIS on rend ----
document.addEventListener('DOMContentLoaded', async () => {
  await loadGames();              // <- lit content/jeux.json une seule fois
  renderFeaturedGames();
  renderGamesGrid();
  renderGamePage();
  if (document.getElementById('games-grid') || document.getElementById('game-detail')){
    injectAdminLink();
  }
});
