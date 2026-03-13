'use strict';

/* ── Fun Messages ── */
const FUN_STATUS = {
  todo:   ['Ce prospect a BESOIN de toi, il le sait juste pas encore 😏', 'Futur client en approche... 🎯', 'Il galère sans site web, tu vas le sauver 🦸', 'Prochain business à booster sur la liste 📋', 'En file d\'attente pour être accompagné par un boss 😤', 'Tu vas lui montrer comment passer au level supérieur 🧠'],
  called: ['T\'as eu les couilles d\'appeler, respect 🫡', 'Téléphone dégainé comme un cowboy 🤠', 'Appel passé, ce prospect va adorer ton offre 🤞', 'T\'es chaud bouillant là ! 🔥', 'Le téléphone c\'est ta baguette magique 🪄', 'Appel lancé, tu gères comme un patron 👑'],
  nope:   ['Il dit non ? T\'as sûrement pas assez insisté 😤', 'NEXT. T\'aurais pu mieux pitcher, avoue 🫠', 'Refusé ? Retravaille ton approche et reviens plus fort 📈', 'Un refus = une leçon. C\'est TOI qui progresses là 😏', 'Même Ronaldo rate des penaltys, mais il s\'entraîne plus que toi 🏟️', 'Refusé. La prochaine fois prépare mieux ton appel 💅'],
  client: ['BOOOOM BÉBÉ ! CLIENT SIGNÉ ! 💰🔥', 'T\'ES UN MONSTRE, C\'EST SIGNÉ !!! 🏆', 'Jordan Belfort qui ? TOI t\'es le loup 🐺', 'Ka-ching ka-ching, la money rentre ! 💸', 'Appelle ta daronne, t\'as closé un deal ! 📱🎉', 'Client signé, tes concurrents pleurent 😭', 'Tu vends de la glace en Antarctique toi 🧊🔥'],
};
const FUN_LOADING = [
  'On fouille Google comme la PJ fouille un appart... 🕵️',
  'Mode stalker professionnel activé, aucune honte... 👀',
  'On cherche les boomers qui ont pas de site web... 📟',
  'On hack la Matrice... (légalement, relax) 🟢',
  'Nos robots font le taf que t\'as la flemme de faire... 🤖',
  'On scanne le quartier comme un drone du FBI... 🛸',
  'Prospection mode TURBO, tes concurrents dorment... 🚀',
  'On secoue Google jusqu\'à ce qu\'il crache les prospects... 🌳',
  'On domine l\'algorithme de Google... 💀',
  'Internet nous supplie d\'arrêter... on s\'en fout 🫡',
  'Tes rivaux scrollent TikTok, toi tu bosses... 😤',
  'Chargement du fax... nan jdec, on est en 2025 📠',
  'On réveille les prospects qui roupillent... 😴',
  'Le FBI est jaloux de notre recherche... 🕶️',
  'On retourne Google comme une crêpe... 🥞',
  'Détection de business à accompagner... 🎯',
];
const FUN_EMPTY = [
  '0 résultats. T\'as bien tapé ta recherche au moins ? 🤔',
  'Rien trouvé. C\'est sûrement ta niche qui est trop niche 😅',
  'Zéro. Vérifie ton orthographe, on sait jamais avec toi 📝',
  'Le désert. T\'as cherché au bon endroit ? Demande-toi... 🏜️',
  'Aucun résultat — essaie une autre ville, t\'as peut-être mal tapé 🗺️',
  'Rien du tout. Change de mot-clé, celui-là c\'est pas le bon 🧭',
  'T\'as cherché "licorne magique" ou quoi ? Sois plus précis ! 🦄',
  'Vide. Mais c\'est TOI qui choisis les critères hein, nous on fait le taf 🚀',
  '0 résultats. Le problème c\'est pas Google, c\'est ta recherche 💅',
  'Personne trouvé. Réessaie, cette fois concentre-toi 🧘',
];
const FUN_DELETE = [
  'Pouf, DÉGAGÉ ! 🫥', 'Bye bye le nul ! 👋', 'Supprimé sans pitié ni remords 💀', 'Thanos snap, prospect atomisé ! 🫰',
  'Tu méritais pas ma liste de toute façon 🗑️', 'Éjecté comme un videur de boîte de nuit 🚪', 'Adios, t\'étais nul anyway 🇲🇽',
];
const FUN_EXPORT = [
  'Export lancé, t\'es un vrai G ! 📊', 'Fichier prêt, va tout closer ! 🎮', 'C\'est téléchargé chef, régale-toi ! 📁',
  'Excel tremble devant ce fichier 📈', 'Données extraites chirurgicalement 🔬', 'Ton comptable va tomber de sa chaise 🤓',
];
const FUN_PITCH = [
  'L\'IA rédige un pitch de MALADE... ✍️', 'Claude transpire du sang pour toi... 🤖💦', 'Écriture du pitch qui va les convaincre... 🎯',
  'Mode Shakespeare du business activé... 🎭', 'L\'IA écrit mieux que toi, accepte-le... 🤓', 'Préparation du discours parfait... ✨',
];
const FUN_COPY = [
  'Copié ! Va closer ce deal 🔥', 'Ctrl+V et c\'est plié, deal en poche 📋', 'Pitch copié, prospect bientôt convaincu 😎',
  'Copié ! Même ChatGPT est jaloux 🤖', 'C\'est copié frérot, FONCE ! 🏃💨',
];
const FUN_SEARCH_START = [
  'C\'est parti, on va trouver des pépites ! 🚀', 'Mode expert activé, les prospects vont kiffer ! 💪', 'Let\'s go, on scanne tout Internet ! 🌐',
  'Attachez vos ceintures, ça va envoyer du lourd... 🎢', 'La prospection est lancée, aucun prospect oublié ! 🦁', 'On lâche la machine ! ⚡',
];
const FUN_ERROR = [
  'T\'as cliqué trop vite, calme ta puissance 😎', 'Ça bug ? T\'as sûrement mal tapé un truc, avoue 😏', 'Erreur... c\'est pas nous, c\'est toi. Comme d\'hab 💅',
  'Oups, t\'as cassé un truc. Réessaie mieux cette fois 🎮', 'Bug détecté — entre la chaise et le clavier, comme toujours 🪑', 'Raté ! Mais t\'inquiète, même toi tu peux y arriver 💪',
  'Le problème c\'est pas le serveur, c\'est le bonhomme devant l\'écran 🤷', 'T\'as fait une boulette, mais on croit en toi quand même ❤️',
];

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* ── Confetti Effect ── */
function launchConfetti() {
  const colors = ['#00c8f8','#00e5a0','#9d6eff','#ffb800','#ff4141','#fff'];
  for (let i = 0; i < 40; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed;z-index:99999;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      border-radius:${Math.random()>.5?'50%':'2px'};
      left:${40+Math.random()*20}%;top:-10px;
      pointer-events:none;opacity:1;
      animation:confettiFall ${1.5+Math.random()*2}s cubic-bezier(.22,1,.36,1) forwards;
      animation-delay:${Math.random()*.3}s;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

/* ── Toast Notifications ── */
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success: '✓', error: '✗', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('out');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

/* ── Skeleton Loader ── */
function showSkeletonTable(rows = 8) {
  const tbody = document.getElementById('tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  for (let i = 0; i < rows; i++) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="9"><div class="skeleton-row">${'<div class="skeleton-cell"></div>'.repeat(9)}</div></td>`;
    tbody.appendChild(tr);
  }
}

/* ── Auth check ── */
const token = localStorage.getItem('ph_token');
if (!token) window.location.href = '/';

const AUTH_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + token,
  'X-Requested-With': 'XMLHttpRequest',
};

/* ── State ── */
const CIRC = 2 * Math.PI * 22;
const STATUS_CYCLE  = ['todo','called','nope','client'];
const STATUS_LABEL  = { todo:'À appeler', called:'Appelé', nope:'Pas intéressé', client:'Client' };
const STATUS_CLASS  = { todo:'s-todo', called:'s-called', nope:'s-nope', client:'s-client' };

let country         = 'fr';
let searchMode      = 'site';
let prospects       = [];
let currentNiche    = '';
let currentProspect = null;
let sortCol         = 'heat';
let sortDir         = 'desc';
let currentPage     = 1;
const PAGE_SIZE     = 50;
let minStars        = 0;
let filterStatus    = 'all';
let filterAge       = 'all';
let filterNiche     = 'all';
let filterSignals   = 'all';
let socialCheckAvailable = false;
let filterSearchId  = null;
let geoMode         = false;
let geoLat          = null;
let geoLng          = null;
let geoRadius       = 30;
let saveTimer       = null;
let pitchType       = 'appel';
let strictFilter    = false;
let userCredits     = 0;
let userPlan        = 'free';
let selectedIds     = new Set();

/* ── Load user info ── */
async function loadUser() {
  try {
    const res = await fetch('/api/me', { headers: AUTH_HEADERS });
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('ph_token');
      window.location.href = '/';
      return;
    }
    const data = await res.json();
    const user = data.user;
    userCredits = user.credits;
    userPlan = user.plan;

    // Update header
    document.getElementById('hdr-credits').textContent = user.credits;
    const planBadge = document.getElementById('header-plan');
    planBadge.textContent = user.plan.toUpperCase();
    planBadge.className = 'header-badge plan-' + user.plan;

    // Show admin link if admin
    if (user.is_admin) {
      document.getElementById('admin-link').style.display = '';
    }

    // Show upgrade or "Mon abonnement" link
    if (user.plan === 'enterprise') {
      document.getElementById('upgrade-link').style.display = 'none';
      document.getElementById('plan-link').style.display = '';
    } else {
      document.getElementById('upgrade-link').style.display = '';
      document.getElementById('plan-link').style.display = 'none';
    }

    // Load referral info
    loadReferral();

    // Init cities slider based on credits
    updateProspectsSlider();
  } catch {
    console.error('Failed to load user');
  }
}

function logout() {
  localStorage.removeItem('ph_token');
  localStorage.removeItem('ph_user');
  window.location.href = '/';
}

/* ── Load prospects from server ── */
async function loadProspects() {
  try {
    const res = await fetch('/api/prospects', { headers: AUTH_HEADERS });
    if (!res.ok) return;
    const data = await res.json();
    if (data.length) {
      prospects = data.map((p, i) => ({ ...p, _idx: i }));
      document.getElementById('res').style.display = 'block';
      populateNicheFilter();
      renderTable();
      renderStats();
    }
  } catch (e) { console.error('Erreur chargement prospects:', e); }
}

/* ── Niche filter dropdown ── */
function populateNicheFilter() {
  const sel = document.getElementById('filter-niche');
  if (!sel) return;
  const niches = [...new Set(prospects.map(p => p.niche).filter(Boolean))];
  sel.innerHTML = '<option value="all">Toutes</option>';
  niches.forEach(n => {
    const opt = document.createElement('option');
    opt.value = n; opt.textContent = n.charAt(0).toUpperCase() + n.slice(1);
    sel.appendChild(opt);
  });
}

/* ── Search history ── */
const COUNTRY_FLAGS = { fr: '\u{1F1EB}\u{1F1F7}', ch: '\u{1F1E8}\u{1F1ED}', be: '\u{1F1E7}\u{1F1EA}', geo: '📍' };

async function loadSearchHistory() {
  const list = document.getElementById('history-list');
  if (!list) return;
  try {
    const res = await fetch('/api/prospects/searches', { headers: AUTH_HEADERS });
    if (!res.ok) return;
    const searches = await res.json();
    if (!searches.length) { list.innerHTML = '<div style="text-align:center;color:var(--muted);padding:1rem;font-size:.85rem;">Aucune recherche pour le moment</div>'; return; }
    list.innerHTML = searches.map(function(s) {
      var flag = COUNTRY_FLAGS[s.country] || '';
      var ago = timeAgo(s.created_at);
      return '<div class="history-row" onclick="filterBySearch(' + s.id + ',\'' + esc(s.niche).replace(/'/g, "\\'") + '\')">'
        + '<div class="history-left">'
        + '<span class="history-flag">' + flag + '</span>'
        + '<span class="history-niche">' + esc(s.niche) + '</span>'
        + '</div>'
        + '<div class="history-right">'
        + '<span class="history-count">' + (s.results_count || 0) + '</span>'
        + '<span class="history-ago">' + ago + '</span>'
        + '</div></div>';
    }).join('');
  } catch (e) { console.error('[history] error:', e); list.innerHTML = '<div style="color:red;padding:.5rem;">Erreur: ' + e.message + '</div>'; }
}

function filterBySearch(searchId, niche) {
  filterSearchId = searchId;
  filterNiche = niche || 'all';
  if (niche) currentNiche = niche;
  const fnEl = document.getElementById('filter-niche');
  if (fnEl) fnEl.value = niche || 'all';
  const cfBtn = document.getElementById('btn-clear-filter');
  if (cfBtn) cfBtn.style.display = '';
  renderTable();
  renderStats();
  loadSearchHistory(); // re-render to highlight active
}

function clearSearchFilter() {
  filterSearchId = null;
  filterNiche = 'all';
  const fnEl2 = document.getElementById('filter-niche');
  if (fnEl2) fnEl2.value = 'all';
  const cfBtn2 = document.getElementById('btn-clear-filter');
  if (cfBtn2) cfBtn2.style.display = 'none';
  renderTable();
  renderStats();
  loadSearchHistory();
}

/* ── Prospects slider ── */
function updateProspectsSlider() {
  const slider = document.getElementById('prospects-slider');
  const multiplier = searchMode === 'both' ? 2 : 1;
  const maxAllowed = Math.min(100, Math.max(1, Math.floor((userCredits || 1) / multiplier)));
  slider.max = maxAllowed;
  if (parseInt(slider.value) > maxAllowed) slider.value = maxAllowed;
  const val = parseInt(slider.value);
  const creditsCost = val * multiplier;
  document.getElementById('prospects-count').textContent = val;
  document.getElementById('credits-cost').textContent = creditsCost;
  document.getElementById('prospects-max-label').textContent = maxAllowed + ' prospects (max)';
}

/* ── Niche categories ── */
const NICHE_DATA = {
  '🔧 BTP': ['Plombier','Électricien','Peintre en bâtiment','Maçon','Couvreur','Carreleur','Serrurier','Menuisier','Chauffagiste','Climatisation'],
  '💇 Beauté': ['Coiffeur','Barbier','Institut de beauté','Onglerie','Salon de massage','Tatoueur','Esthéticienne'],
  '🍽️ Restauration': ['Restaurant','Boulangerie','Pâtisserie','Pizzeria','Traiteur','Food truck','Bar','Kebab','Sushi'],
  '🏥 Santé': ['Dentiste','Ostéopathe','Kinésithérapeute','Opticien','Vétérinaire','Podologue','Psychologue'],
  '🚗 Auto': ['Garage automobile','Carrossier','Lavage auto','Auto-école','Contrôle technique','Vitrage auto'],
  '🏠 Services': ['Agent immobilier','Déménageur','Photographe','Coach sportif','Jardinier','Paysagiste','Nettoyage'],
  '🛍️ Commerce': ['Fleuriste','Bijouterie','Pressing','Cordonnerie','Animalerie','Caviste','Épicerie fine','Prêt-à-porter'],
  '✏️ Autre': ['__custom__']
};

let selectedCat = null;

function initNicheCategories() {
  const container = document.getElementById('niche-cats');
  container.innerHTML = Object.keys(NICHE_DATA).map(cat =>
    `<button class="niche-cat" onclick="selectNicheCategory('${cat}')">${cat}</button>`
  ).join('');
}

function selectNicheCategory(cat) {
  selectedCat = cat;
  document.querySelectorAll('.niche-cat').forEach(b => b.classList.toggle('on', b.textContent === cat));
  const dropdown = document.getElementById('niche-dropdown');
  const customDiv = document.getElementById('niche-custom');

  if (cat === '✏️ Autre') {
    dropdown.style.display = 'none';
    customDiv.classList.add('show');
    const inp = document.getElementById('niche-custom-input');
    inp.value = '';
    inp.focus();
    inp.oninput = () => { document.getElementById('niche').value = inp.value; };
    document.getElementById('niche').value = '';
  } else {
    dropdown.style.display = '';
    customDiv.classList.remove('show');
    const niches = NICHE_DATA[cat];
    dropdown.innerHTML = '<option value="" disabled selected>Choisis une niche…</option>' +
      niches.map(n => `<option value="${n}">${n}</option>`).join('');
  }
}

function onNicheSelect(val) {
  document.getElementById('niche').value = val;
}

initNicheCategories();

/* ── Advanced Options Toggle ── */
function toggleAdvanced() {
  const el = document.getElementById('advanced-options');
  const tog = document.getElementById('advanced-toggle');
  if (el.style.display === 'none') {
    el.style.display = 'block';
    tog.textContent = 'Options avancées \u25B2';
  } else {
    el.style.display = 'none';
    tog.textContent = 'Options avancées \u25BC';
  }
}

/* ── Search Mode ── */
function setSearchMode(mode) {
  // Block click on disabled modes
  if ((mode === 'social' || mode === 'both') && !socialCheckAvailable) return;
  searchMode = mode;
  document.querySelectorAll('.search-mode').forEach(b => b.classList.toggle('on', b.dataset.mode === mode));
  const hints = {
    site: 'Trouve les entreprises qui n\'ont pas de site internet.',
    social: 'Trouve les entreprises qui n\'ont pas de réseaux sociaux (Facebook, Instagram, TikTok).',
    both: 'Trouve les entreprises sans site web ET sans réseaux sociaux. Coût ×2.',
    fewreviews: 'Trouve les entreprises avec moins de 10 avis Google — besoin de visibilité.',
    new: 'Trouve les business tout récents (< 5 avis) — ils ont besoin de tout.',
  };
  document.getElementById('mode-hint').textContent = hints[mode] || '';
  updateProspectsSlider();
}

function checkSearchModes() {
  fetch('/api/search/modes', { headers: AUTH_HEADERS })
    .then(r => r.json())
    .then(data => {
      socialCheckAvailable = data.socialCheckAvailable;
      if (!socialCheckAvailable) {
        document.getElementById('mode-social').classList.add('disabled');
        document.getElementById('mode-both').classList.add('disabled');
        document.getElementById('mode-hint').textContent = '⚠️ Modes réseaux indisponibles — GOOGLE_CSE_ID non configuré.';
      }
    })
    .catch(e => console.error('Erreur modes:', e));
}

/* ── Country / Geolocation ── */
function setCountry(c) {
  country = c;
  geoMode = false;
  geoLat = null;
  geoLng = null;
  ['fr','ch','be'].forEach(x => document.getElementById('btn-'+x).classList.toggle('on', x === c));
  document.getElementById('btn-geo').classList.remove('on');
  document.getElementById('geo-options').style.display = 'none';
}

function activateGeoloc() {
  if (!navigator.geolocation) {
    return showAlert('Votre navigateur ne supporte pas la géolocalisation.');
  }
  setLoader(true, 'Détection de votre position…', 'Autorisez la géolocalisation dans votre navigateur.');
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      geoLat = pos.coords.latitude;
      geoLng = pos.coords.longitude;
      geoMode = true;
      geoRadius = parseInt(document.getElementById('geo-radius').value);

      // UI: highlight geo button, unhighlight countries
      ['fr','ch','be'].forEach(x => document.getElementById('btn-'+x).classList.remove('on'));
      document.getElementById('btn-geo').classList.add('on');
      document.getElementById('geo-options').style.display = 'block';

      // Reverse geocode to show city name
      fetchCityName(geoLat, geoLng);
      setLoader(false);
    },
    (err) => {
      setLoader(false);
      showAlert('Impossible de vous localiser. Vérifiez les permissions de votre navigateur.');
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

async function fetchCityName(lat, lng) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=fr`);
    const d = await r.json();
    const city = d.address?.city || d.address?.town || d.address?.village || d.address?.municipality || '';
    const dept = d.address?.county || d.address?.state || '';
    document.getElementById('geo-city').textContent = city ? `${city}${dept ? ', ' + dept : ''}` : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (e) {
    console.error('Erreur fetchCityName:', e);
    document.getElementById('geo-city').textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

function updateRadiusLabel() {
  const val = parseInt(document.getElementById('geo-radius').value);
  geoRadius = val;
  document.getElementById('geo-radius-label').textContent = val + ' km';
}

function toggleVis(id) {
  const i = document.getElementById(id);
  i.type = i.type === 'password' ? 'text' : 'password';
}

function showAlert(msg) {
  document.getElementById('alert-msg').textContent = msg;
  document.getElementById('alert').classList.add('on');
}
function hideAlert() { document.getElementById('alert').classList.remove('on'); }

function setLoader(show, title, sub) {
  document.getElementById('loader').classList.toggle('on', show);
  if (title !== undefined) document.getElementById('l-title').textContent = title;
  if (sub   !== undefined) document.getElementById('l-sub').textContent   = sub;
}

/* ── SEARCH (server-side) ── */
async function runSearch() {
  const niche = document.getElementById('niche').value.trim();
  hideAlert();
  if (!niche) return showAlert("T'as oublié de taper ta niche... On peut pas deviner pour toi 🤦");

  if (userCredits <= 0) {
    return showAlert('T\'as plus de crédits ! Fallait mieux les gérer... va recharger 💸');
  }

  currentNiche = niche;
  const btn = document.getElementById('btn-go');
  btn.disabled = true;

  // Load smart keywords if filter enabled
  let smartKw = [];
  if (strictFilter) {
    setLoader(true, 'L\'IA analyse ta niche...', 'Claude réfléchit plus vite que toi 🧠');
    try {
      const kwRes = await fetch('/api/pitch/keywords', {
        method: 'POST',
        headers: AUTH_HEADERS,
        body: JSON.stringify({ niche }),
      });
      const kwData = await kwRes.json();
      if (kwData.keywords && kwData.keywords.length) {
        smartKw = kwData.keywords;
        setLoader(true, `${smartKw.length} mots-clés trouvés`, 'Mode sniper activé, les imposteurs vont dégager 🎯');
        await new Promise(r => setTimeout(r, 800));
      }
    } catch { smartKw = []; }
  }

  const numProspects = parseInt(document.getElementById('prospects-slider').value);
  const geoLabel = geoMode ? ` autour de vous (${geoRadius} km)` : '';
  const modeLabel = searchMode === 'social' ? ' + vérification réseaux sociaux' : searchMode === 'both' ? ' + vérification complète' : '';
  setLoader(true, `Recherche « ${niche} » en cours…${geoLabel}`, randomFrom(FUN_LOADING));
  // Rotate fun loading messages
  const loadingInterval = setInterval(() => {
    const sub = document.getElementById('l-sub');
    if (sub && document.getElementById('loader').classList.contains('on')) {
      sub.style.opacity = '0';
      setTimeout(() => { sub.textContent = randomFrom(FUN_LOADING); sub.style.opacity = '1'; }, 300);
    } else clearInterval(loadingInterval);
  }, 3500);

  document.getElementById('res').style.display = 'block';
  document.getElementById('empty').classList.remove('on');
  document.getElementById('counter').textContent = '...';
  document.getElementById('ring-fill').style.strokeDashoffset = CIRC;
  const msEl = document.getElementById('min-stars');
  if (msEl) msEl.value = '0';
  sortCol = 'heat'; sortDir = 'desc'; minStars = 0;
  showSkeletonTable(6);
  updateSortHeaders();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90000);
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: AUTH_HEADERS,
      signal: controller.signal,
      body: JSON.stringify({
        niche,
        country,
        smartKeywords: smartKw,
        numProspects: parseInt(document.getElementById('prospects-slider').value),
        searchMode,
        geoMode,
        geoLat,
        geoLng,
        geoRadius,
      }),
    });
    clearTimeout(timeout);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);

    // Update credits in header + slider
    userCredits = data.credits;
    document.getElementById('hdr-credits').textContent = data.credits;
    updateProspectsSlider();

    // Reload full prospects list from server (includes IDs from DB)
    await loadProspects();
    await loadSearchHistory();

    setLoader(false);

    // Post-search: toast + analytics refresh + milestone check
    showToast(`✅ ${data.count} nouveau${data.count > 1 ? 'x' : ''} prospect${data.count > 1 ? 's' : ''} trouvé${data.count > 1 ? 's' : ''} pour "${niche}"`, 'success', 4000);
    if (analyticsOpen) renderAnalytics();
    checkMilestones();

    if (!prospects.length) {
      document.getElementById('res').style.display = 'none';
      document.getElementById('empty').classList.add('on');
      const emptyMsg = document.getElementById('empty-msg');
      if (emptyMsg) emptyMsg.innerHTML = randomFrom(FUN_EMPTY);
    }
  } catch (err) {
    setLoader(false);
    const msg = err.name === 'AbortError' ? 'La recherche a pris trop de temps. Réessaie avec moins de prospects.' : (err.message || '');
    showAlert(randomFrom(FUN_ERROR) + '<br>' + msg);
  } finally {
    clearInterval(loadingInterval);
    btn.disabled = false;
    loadSearchHistory();
  }
}

/* ── Heat score ── */
const HEAT_DATA = [
  { label:'Glacial 🥶',   cls:'h-cold', score:0 },
  { label:'Tiède',         cls:'h-mild', score:1 },
  { label:'Chaud 🔥',      cls:'h-warm', score:2 },
  { label:'BRÛLANT 🌋',    cls:'h-hot',  score:3 },
];

/*
 * HEAT SCORE — Probabilité que le prospect ACHÈTE un site web
 *
 * Logique : le meilleur prospect c'est un BON business qui est INVISIBLE en ligne.
 * - Bonne note = business sérieux, il a les moyens de payer → +points
 * - Peu d'avis = invisible sur Google, il a BESOIN de visibilité → +points
 * - Pas de site web = besoin évident → +points
 * - Pas de réseaux sociaux = encore plus invisible → +points
 * - Beaucoup d'avis = déjà connu, moins besoin → -points
 *
 * Score sur 10, converti en 4 niveaux :
 *   0-3 = Glacial | 4-5 = Tiède | 6-7 = Chaud | 8-10 = BRÛLANT
 */
function heatScore(p) {
  let score = 0;
  const r = p.rating ?? 0;
  const v = p.reviews ?? 0;

  // ── Note Google : sweet spot 4.0-4.8 = business sérieux avec moyens ──
  // Source : conversion +44% par étoile, sweet spot confiance = 4.2-4.5
  if (r >= 4.0 && r <= 4.8) score += 3;      // sweet spot parfait
  else if (r >= 3.5 && r < 4.0) score += 1;  // correct
  else if (r >= 4.8) score += 2;              // très bien mais peut sembler "trop parfait"
  // < 3.5 = business en difficulté, 0 points

  // ── Avis : moyenne locale = 39 avis. Moins = invisible = BESOIN de toi ──
  // Source : business avec 200+ avis = 2x revenus (déjà établis)
  if (v <= 10) score += 3;       // quasi inconnu → prospect en or
  else if (v <= 39) score += 2;  // sous la moyenne → mal visible
  else if (v <= 80) score += 1;  // dans la moyenne
  // > 80 = bien visible, 0 points

  // ── Pas de site web = 31% des clients potentiels perdus ──
  if (!p.website_url) score += 2;

  // ── Pas de réseaux sociaux = encore plus invisible ──
  if (p.has_facebook === 0) score += 0.5;
  if (p.has_instagram === 0) score += 0.5;
  if (p.has_tiktok === 0) score += 0.5;

  // ── Malus : trop d'avis = déjà bien installé, 2x revenus ──
  if (v > 200) score -= 2;
  else if (v > 100) score -= 1;

  // Clamp et convertir en 0-3
  score = Math.max(0, Math.min(10, score));
  if (score >= 8) return 3;  // BRÛLANT
  if (score >= 6) return 2;  // Chaud
  if (score >= 4) return 1;  // Tiède
  return 0;                  // Glacial
}

function renderHeat(p) {
  const s = heatScore(p);
  const h = HEAT_DATA[s];
  const r = p.rating != null ? p.rating.toFixed(1) + '/5' : 'pas de note';
  const v = p.reviews > 0 ? p.reviews + ' avis' : 'aucun avis';
  const site = p.website_url ? 'a un site' : 'pas de site';
  const tips = [];
  if (s === 3) tips.push('Bon business + invisible = prospect en OR');
  else if (s === 2) tips.push('Bon profil, a besoin de visibilité');
  else if (s === 1) tips.push('Potentiel moyen');
  else tips.push('Déjà visible ou business fragile');
  return `<span class="heat ${h.cls}" title="${tips[0]} — ${r}, ${v}, ${site}">${h.label}</span>`;
}

/* ── Table ── */
function renderSignals(p) {
  let badges = '';
  const mode = p.search_mode || 'site';
  // Badge site — seulement en mode site ou both
  if ((mode === 'site' || mode === 'both') && !p.website_url) {
    badges += '<span class="badge-sig badge-nosite">🔴 Pas de site</span>';
  }
  // Badge réseaux — seulement si le mode a vérifié les réseaux
  if (mode === 'social' || mode === 'both') {
    if (p.has_facebook === 0 && p.has_instagram === 0 && p.has_tiktok === 0) {
      badges += '<span class="badge-sig badge-nosocial">🟠 Pas de réseaux</span>';
    } else if (p.has_facebook === 1 || p.has_instagram === 1 || p.has_tiktok === 1) {
      const found = [];
      if (p.has_facebook === 1) found.push('FB');
      if (p.has_instagram === 1) found.push('IG');
      if (p.has_tiktok === 1) found.push('TK');
      badges += '<span class="badge-sig" style="background:rgba(46,204,113,.12);color:#2ecc71;font-size:.6rem;padding:.15rem .4rem;border-radius:4px">✅ ' + found.join(', ') + '</span>';
    } else {
      badges += '<span class="badge-sig badge-nosocial">🟠 Sans réseaux</span>';
    }
  }
  // Badge avis
  if ((p.reviews || 0) < 5) badges += '<span class="badge-sig badge-fewreviews">🟡 &lt; 5 avis</span>';
  return '<div class="badge-signals">' + (badges || '<span style="color:var(--muted);font-size:.65rem">—</span>') + '</div>';
}

function getFilteredProspects() {
  return prospects.filter(p => {
    if (filterSearchId && p.search_id !== filterSearchId) return false;
    if (filterNiche !== 'all' && p.niche !== filterNiche) return false;
    if (minStars > 0 && (p.rating == null || p.rating < minStars)) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterAge === 'new' && (p.reviews || 0) >= 50) return false;
    if (filterAge === 'mid' && ((p.reviews || 0) < 50 || (p.reviews || 0) >= 200)) return false;
    if (filterAge === 'old' && (p.reviews || 0) < 200) return false;
    if (filterSignals === 'nosite' && p.website_url) return false;
    if (filterSignals === 'nosocial' && !(p.has_facebook === 0 && p.has_instagram === 0 && p.has_tiktok === 0)) return false;
    if (filterSignals === 'fewreviews' && (p.reviews || 0) >= 5) return false;
    return true;
  });
}

function renderTable() {
  let list = getFilteredProspects();
  if (sortCol) {
    list = [...list].sort((a, b) => {
      const av = sortCol === 'heat' ? heatScore(a) : (a[sortCol] ?? -1);
      const bv = sortCol === 'heat' ? heatScore(b) : (b[sortCol] ?? -1);
      return sortDir === 'desc' ? bv - av : av - bv;
    });
  }
  const totalFiltered = list.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const pageList = list.slice(startIdx, startIdx + PAGE_SIZE);

  const tbody = document.getElementById('tbody');
  tbody.innerHTML = '';

  // Remove stale selections (ids no longer on this page)
  const pageIds = new Set(pageList.map(p => p.id));

  pageList.forEach((p, i) => {
    const tr = document.createElement('tr');
    if (selectedIds.has(p.id)) tr.classList.add('row-selected');
    tr.dataset.pid = p.id;
    tr.innerHTML = `
      <td class="c-check"><input type="checkbox" class="row-check" data-id="${p.id}" ${selectedIds.has(p.id) ? 'checked' : ''}></td>
      <td class="c-n">${startIdx + i + 1}</td>
      <td class="c-name"><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(decodeHtml(p.name) + ' ' + p.address)}" target="_blank" rel="noopener" class="map-link" title="Voir sur Google Maps">${decodeHtml(p.name)} <span class="map-icon">📍</span></a></td>
      <td class="c-tel"><a href="tel:${p.phone.replace(/\s/g,'')}" class="phone-link" data-pid="${p.id}">${esc(p.phone)}</a></td>
      <td class="c-addr">${esc(p.address)}</td>
      <td>${renderStars(p.rating)}</td>
      <td>${p.reviews > 0 ? p.reviews.toLocaleString('fr-FR') : '<span class="nd">—</span>'}</td>
      <td>${renderHeat(p)}</td>
      <td>
        <select class="status-select ${STATUS_CLASS[p.status]}" data-pid="${p.id}">
          ${STATUS_CYCLE.map(s => `<option value="${s}"${p.status===s?' selected':''}>${STATUS_LABEL[s]}</option>`).join('')}
        </select>
      </td>
      <td>
        <div class="row-actions">
          <a class="btn-call" href="tel:${p.phone.replace(/\s/g,'')}" data-pid="${p.id}" title="Appeler">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.22 2 2 0 012.22.04L5.22.04a2 2 0 012 1.72c.13 1 .36 1.97.72 2.9a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.14-1.14a2 2 0 012.11-.45c.93.36 1.9.59 2.9.72a2 2 0 011.76 2.03z"/>
            </svg>
          </a>
          <button class="btn-fiche" data-pid="${p.id}" data-tab="fiche" title="Fiche prospect">F</button>
          <button class="btn-pitch" data-pid="${p.id}" data-tab="pitch" title="Générer pitch IA">P</button>
          <button class="btn-del" data-pid="${p.id}" title="Supprimer">&#10005;</button>
        </div>
      </td>`;
    tbody.appendChild(tr);
  });

  // Update select-all checkbox state
  const selectAllEl = document.getElementById('select-all');
  if (selectAllEl) {
    const allOnPageSelected = pageList.length > 0 && pageList.every(p => selectedIds.has(p.id));
    selectAllEl.checked = allOnPageSelected;
    selectAllEl.indeterminate = !allOnPageSelected && pageList.some(p => selectedIds.has(p.id));
  }

  updateBulkBar();
  document.getElementById('counter').textContent = totalFiltered > PAGE_SIZE ? pageList.length + ' / ' + totalFiltered : totalFiltered;
  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const container = document.getElementById('pagination');
  if (!container) return;
  if (totalPages <= 1) { container.innerHTML = ''; return; }

  const btnStyle = 'background:var(--surface);border:1px solid var(--border2);color:var(--dim);border-radius:8px;padding:6px 12px;cursor:pointer;font-size:.8rem;';
  const activeStyle = 'background:rgba(237,237,237,.1);border:1px solid rgba(237,237,237,.3);color:var(--text);border-radius:8px;padding:6px 12px;cursor:pointer;font-size:.8rem;font-weight:600;';
  const disabledStyle = 'background:var(--surface);border:1px solid var(--border2);color:var(--muted);border-radius:8px;padding:6px 12px;cursor:default;font-size:.8rem;opacity:.4;';

  let html = '';
  html += `<button style="${currentPage === 1 ? disabledStyle : btnStyle}" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>&laquo; Préc</button>`;

  const maxBtns = 7;
  let startP = Math.max(1, currentPage - Math.floor(maxBtns / 2));
  let endP = Math.min(totalPages, startP + maxBtns - 1);
  if (endP - startP < maxBtns - 1) startP = Math.max(1, endP - maxBtns + 1);

  if (startP > 1) {
    html += `<button style="${btnStyle}" onclick="goToPage(1)">1</button>`;
    if (startP > 2) html += `<span style="color:var(--muted);font-size:.8rem">…</span>`;
  }
  for (let i = startP; i <= endP; i++) {
    html += `<button style="${i === currentPage ? activeStyle : btnStyle}" onclick="goToPage(${i})">${i}</button>`;
  }
  if (endP < totalPages) {
    if (endP < totalPages - 1) html += `<span style="color:var(--muted);font-size:.8rem">…</span>`;
    html += `<button style="${btnStyle}" onclick="goToPage(${totalPages})">${totalPages}</button>`;
  }

  html += `<button style="${currentPage === totalPages ? disabledStyle : btnStyle}" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Suiv &raquo;</button>`;
  container.innerHTML = html;
}

function goToPage(page) {
  currentPage = page;
  renderTable();
  document.getElementById('tbody')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function sortBy(col) {
  sortDir = sortCol === col && sortDir === 'desc' ? 'asc' : 'desc';
  sortCol = col;
  currentPage = 1;
  updateSortHeaders();
  renderTable();
}
function updateSortHeaders() {
  ['rating','reviews','heat'].forEach(col => {
    const th = document.getElementById(`th-${col}`);
    const si = document.getElementById(`si-${col}`);
    if (!th||!si) return;
    th.classList.toggle('active', sortCol === col);
    si.textContent = sortCol !== col ? '\u2195' : sortDir === 'desc' ? '\u2193' : '\u2191';
  });
}
function dashFilter(status) {
  const sel = document.getElementById('filter-status');
  if (sel) sel.value = status === 'all' ? 'all' : status;
  // Highlight active card
  document.querySelectorAll('.dash-card').forEach(c => c.classList.remove('dash-active'));
  if (status !== 'all') {
    const map = { called: 'dc-called', client: 'dc-client', nope: 'dc-rate', todo: 'dc-total' };
    const active = document.querySelector(`.dash-card.${map[status]}`);
    if (active) active.classList.add('dash-active');
  }
  applyFilter();
}

function applyFilter() {
  currentPage = 1;
  const minStarsEl = document.getElementById('min-stars');
  minStars = minStarsEl ? (parseFloat(minStarsEl.value) || 0) : 0;
  const filterStatusEl = document.getElementById('filter-status');
  filterStatus = filterStatusEl ? filterStatusEl.value : 'all';
  const filterAgeEl = document.getElementById('filter-age');
  filterAge = filterAgeEl ? filterAgeEl.value : 'all';
  const filterSignalsEl = document.getElementById('filter-signals');
  filterSignals = filterSignalsEl ? filterSignalsEl.value : 'all';
  const filterNicheEl = document.getElementById('filter-niche');
  const nicheVal = filterNicheEl ? filterNicheEl.value : 'all';
  if (nicheVal !== filterNiche) {
    filterNiche = nicheVal;
    filterSearchId = null; // reset search filter when niche changes manually
    const clearBtn = document.getElementById('btn-clear-filter');
    if (clearBtn) clearBtn.style.display = filterNiche !== 'all' ? '' : 'none';
    loadSearchHistory();
  }
  renderTable();
}

/* ── Status select (API) ── */
async function setStatus(id, newStatus, el) {
  const p = prospects.find(x => x.id === id);
  if (!p) return;
  p.status = newStatus;
  el.className = 'status-select ' + (STATUS_CLASS[newStatus] || '');
  renderStats();
  const funMsg = randomFrom(FUN_STATUS[newStatus] || [`${STATUS_LABEL[newStatus]}`]);
  const toastType = newStatus === 'client' ? 'success' : newStatus === 'nope' ? 'error' : 'info';
  showToast(`${p.name} — ${funMsg}`, toastType, 2500);
  if (newStatus === 'client') launchConfetti();
  try {
    await fetch(`/api/prospects/${id}/status`, {
      method: 'PUT', headers: AUTH_HEADERS,
      body: JSON.stringify({ status: newStatus }),
    });
  } catch (e) { console.error('Erreur statut:', e); }
}

function scrollStatus(id, event) {
  event.preventDefault();
  event.stopPropagation();
  const p = prospects.find(x => x.id === id);
  if (!p) return;
  const dir = event.deltaY < 0 ? -1 : 1;
  const idx = STATUS_CYCLE.indexOf(p.status);
  const newIdx = (idx + dir + STATUS_CYCLE.length) % STATUS_CYCLE.length;
  const newStatus = STATUS_CYCLE[newIdx];
  p.status = newStatus;
  renderTable();
  renderStats();
  showToast(`${p.name} — ${randomFrom(FUN_STATUS[newStatus] || [STATUS_LABEL[newStatus]])}`, newStatus === 'client' ? 'success' : 'info', 2000);
  fetch(`/api/prospects/${id}/status`, {
    method: 'PUT', headers: AUTH_HEADERS,
    body: JSON.stringify({ status: newStatus }),
  }).catch(e => console.error('Erreur statut:', e));
}

async function cycleStatus(id, event) {
  if (event) event.stopPropagation();
  const p = prospects.find(x => x.id === id);
  if (!p) return;
  const newStatus = STATUS_CYCLE[(STATUS_CYCLE.indexOf(p.status) + 1) % STATUS_CYCLE.length];
  p.status = newStatus;
  renderTable();
  renderStats();
  showToast(`${p.name} — ${randomFrom(FUN_STATUS[newStatus] || [STATUS_LABEL[newStatus]])}`, newStatus === 'client' ? 'success' : 'info', 2000);
  try {
    await fetch(`/api/prospects/${id}/status`, {
      method: 'PUT',
      headers: AUTH_HEADERS,
      body: JSON.stringify({ status: newStatus }),
    });
  } catch (e) { console.error('Erreur mise à jour statut:', e); }
}

/* ── Delete prospect (API) ── */
async function deleteProspect(id, event) {
  if (event) event.stopPropagation();
  if (!confirm('Supprimer ce prospect ?')) return;
  try {
    await fetch(`/api/prospects/${id}`, {
      method: 'DELETE',
      headers: AUTH_HEADERS,
    });
    const name = prospects.find(p => p.id === id)?.name || 'Prospect';
    prospects = prospects.filter(p => p.id !== id);
    renderTable();
    renderStats();
    showToast(`${name} — ${randomFrom(FUN_DELETE)}`, 'info', 2000);
  } catch (e) { console.error('Erreur suppression:', e); }
}

/* ── Modal ── */
function openModal(id, tab) {
  currentProspect = prospects.find(x => x.id === id);
  if (!currentProspect) return;
  const p = currentProspect;
  document.getElementById('m-name').textContent = p.name;
  document.getElementById('m-meta').textContent = `${p.phone} · ${p.city || ''}${p.rating ? ' · ' + p.rating.toFixed(1) : ''}`;
  document.getElementById('m-notes').value  = p.notes  || '';
  document.getElementById('m-rappel').value = p.rappel || '';
  document.getElementById('pitch-zone').innerHTML = '';
  document.getElementById('fiche-zone').innerHTML = '';
  document.getElementById('modal-bd').classList.add('on');
  showTab(tab || 'calc');
}
function closeModal() {
  document.getElementById('modal-bd').classList.remove('on');
  currentProspect = null;
}
function showTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('on', t.dataset.tab === name));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('on', p.dataset.tab === name));
  if (name === 'calc' && currentProspect) renderCalc(currentProspect);
}

/* ── Calculator ── */
/* ── Sector-specific data (avg ticket, conversion rates, search multipliers) ── */
const SECTOR_DATA = {
  // BTP / Artisans
  'plombier':          { ticket: 280, conv: .08, searchMult: 1.4, label: 'Plomberie' },
  'electricien':       { ticket: 250, conv: .07, searchMult: 1.3, label: 'Electricite' },
  'peintre':           { ticket: 1200, conv: .05, searchMult: .9, label: 'Peinture' },
  'macon':             { ticket: 3000, conv: .04, searchMult: .8, label: 'Maconnerie' },
  'maçon':             { ticket: 3000, conv: .04, searchMult: .8, label: 'Maconnerie' },
  'couvreur':          { ticket: 2500, conv: .04, searchMult: .9, label: 'Couverture' },
  'carreleur':         { ticket: 1500, conv: .05, searchMult: .8, label: 'Carrelage' },
  'serrurier':         { ticket: 180, conv: .10, searchMult: 1.6, label: 'Serrurerie' },
  'menuisier':         { ticket: 1800, conv: .05, searchMult: .9, label: 'Menuiserie' },
  'chauffagiste':      { ticket: 350, conv: .07, searchMult: 1.2, label: 'Chauffage' },
  'climatisation':     { ticket: 800, conv: .06, searchMult: 1.1, label: 'Climatisation' },
  // Beaute
  'coiffeur':          { ticket: 45, conv: .12, searchMult: 1.5, label: 'Coiffure' },
  'barbier':           { ticket: 30, conv: .14, searchMult: 1.6, label: 'Barbier' },
  'beaute':            { ticket: 65, conv: .10, searchMult: 1.3, label: 'Beaute' },
  'institut':          { ticket: 65, conv: .10, searchMult: 1.3, label: 'Institut beaute' },
  'onglerie':          { ticket: 40, conv: .12, searchMult: 1.4, label: 'Onglerie' },
  'massage':           { ticket: 70, conv: .09, searchMult: 1.1, label: 'Massage' },
  'tatoueur':          { ticket: 150, conv: .06, searchMult: 1.0, label: 'Tatouage' },
  'estheticienne':     { ticket: 55, conv: .10, searchMult: 1.3, label: 'Esthetique' },
  'esthéticienne':     { ticket: 55, conv: .10, searchMult: 1.3, label: 'Esthetique' },
  // Restauration
  'restaurant':        { ticket: 25, conv: .15, searchMult: 2.0, label: 'Restauration' },
  'boulangerie':       { ticket: 8, conv: .20, searchMult: 1.8, label: 'Boulangerie' },
  'patisserie':        { ticket: 12, conv: .18, searchMult: 1.5, label: 'Patisserie' },
  'pâtisserie':        { ticket: 12, conv: .18, searchMult: 1.5, label: 'Patisserie' },
  'pizzeria':          { ticket: 20, conv: .16, searchMult: 1.9, label: 'Pizzeria' },
  'traiteur':          { ticket: 45, conv: .08, searchMult: 1.0, label: 'Traiteur' },
  'food truck':        { ticket: 12, conv: .14, searchMult: 1.2, label: 'Food truck' },
  'bar':               { ticket: 15, conv: .12, searchMult: 1.4, label: 'Bar' },
  'kebab':             { ticket: 10, conv: .18, searchMult: 1.7, label: 'Kebab' },
  'sushi':             { ticket: 22, conv: .14, searchMult: 1.6, label: 'Sushi' },
  // Sante
  'dentiste':          { ticket: 120, conv: .10, searchMult: 1.8, label: 'Dentiste' },
  'osteopathe':        { ticket: 60, conv: .09, searchMult: 1.3, label: 'Osteopathie' },
  'ostéopathe':        { ticket: 60, conv: .09, searchMult: 1.3, label: 'Osteopathie' },
  'kinesitherapeute':  { ticket: 50, conv: .08, searchMult: 1.2, label: 'Kinesitherapie' },
  'kinésithérapeute':  { ticket: 50, conv: .08, searchMult: 1.2, label: 'Kinesitherapie' },
  'opticien':          { ticket: 200, conv: .07, searchMult: 1.1, label: 'Optique' },
  'veterinaire':       { ticket: 80, conv: .09, searchMult: 1.4, label: 'Veterinaire' },
  'vétérinaire':       { ticket: 80, conv: .09, searchMult: 1.4, label: 'Veterinaire' },
  'podologue':         { ticket: 45, conv: .08, searchMult: 1.0, label: 'Podologie' },
  'psychologue':       { ticket: 60, conv: .07, searchMult: 1.1, label: 'Psychologie' },
  // Auto
  'garage':            { ticket: 350, conv: .08, searchMult: 1.5, label: 'Garage auto' },
  'carrossier':        { ticket: 600, conv: .06, searchMult: 1.1, label: 'Carrosserie' },
  'lavage':            { ticket: 18, conv: .15, searchMult: 1.3, label: 'Lavage auto' },
  'auto-ecole':        { ticket: 1200, conv: .05, searchMult: 1.2, label: 'Auto-ecole' },
  'auto-école':        { ticket: 1200, conv: .05, searchMult: 1.2, label: 'Auto-ecole' },
  'controle technique':{ ticket: 75, conv: .12, searchMult: 1.4, label: 'Controle technique' },
  'contrôle technique':{ ticket: 75, conv: .12, searchMult: 1.4, label: 'Controle technique' },
  // Services
  'agent immobilier':  { ticket: 5000, conv: .03, searchMult: 1.1, label: 'Immobilier' },
  'immobilier':        { ticket: 5000, conv: .03, searchMult: 1.1, label: 'Immobilier' },
  'demenageur':        { ticket: 800, conv: .06, searchMult: 1.2, label: 'Demenagement' },
  'déménageur':        { ticket: 800, conv: .06, searchMult: 1.2, label: 'Demenagement' },
  'photographe':       { ticket: 300, conv: .05, searchMult: .8, label: 'Photographie' },
  'coach sportif':     { ticket: 50, conv: .08, searchMult: 1.0, label: 'Coach sportif' },
  'jardinier':         { ticket: 150, conv: .07, searchMult: 1.0, label: 'Jardinage' },
  'paysagiste':        { ticket: 500, conv: .05, searchMult: .9, label: 'Paysagiste' },
  'nettoyage':         { ticket: 120, conv: .08, searchMult: 1.1, label: 'Nettoyage' },
  // Commerce
  'fleuriste':         { ticket: 35, conv: .12, searchMult: 1.3, label: 'Fleuriste' },
  'bijouterie':        { ticket: 120, conv: .06, searchMult: 1.0, label: 'Bijouterie' },
  'pressing':          { ticket: 15, conv: .14, searchMult: 1.2, label: 'Pressing' },
  'cordonnerie':       { ticket: 20, conv: .12, searchMult: 1.0, label: 'Cordonnerie' },
  'animalerie':        { ticket: 40, conv: .10, searchMult: 1.1, label: 'Animalerie' },
  'caviste':           { ticket: 30, conv: .09, searchMult: 1.0, label: 'Caviste' },
  'epicerie':          { ticket: 18, conv: .15, searchMult: 1.3, label: 'Epicerie' },
  'épicerie':          { ticket: 18, conv: .15, searchMult: 1.3, label: 'Epicerie' },
};

function findSectorData(niche) {
  if (!niche) return null;
  const n = niche.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // Exact match first
  for (const [key, val] of Object.entries(SECTOR_DATA)) {
    const k = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (n === k || n.includes(k) || k.includes(n)) return val;
  }
  // Partial match
  for (const [key, val] of Object.entries(SECTOR_DATA)) {
    const k = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const words = k.split(/\s+/);
    if (words.some(w => w.length > 3 && n.includes(w))) return val;
  }
  return null;
}

function calculateLoss(p) {
  const reviews = p.reviews || 0;
  const rating  = p.rating  || 3.5;
  const niche = p.niche || currentNiche || '';
  const sector = findSectorData(niche);

  // ── Step 1: Monthly impressions on Google Maps ──
  // Based on BrightLocal 2024: avg local business gets 1,260 views/month
  // Adjusted by: number of reviews (social proof → more visibility)
  //              rating (Google ranks higher-rated businesses)
  //              sector search volume multiplier
  const searchMult = sector ? sector.searchMult : 1.0;
  const ratingBoost = rating >= 4.5 ? 1.4 : rating >= 4.0 ? 1.2 : rating >= 3.5 ? 1.0 : 0.7;
  const reviewBoost = reviews >= 200 ? 2.0 : reviews >= 100 ? 1.6 : reviews >= 50 ? 1.3 : reviews >= 20 ? 1.1 : reviews >= 5 ? 0.9 : 0.6;
  const baseImpressions = 400; // conservative base for a local business
  const monthlyImpressions = Math.max(100, Math.round(baseImpressions * searchMult * ratingBoost * reviewBoost));

  // ── Step 2: Actions (clicks, calls, directions) ──
  // Google data: ~5% of views lead to an action (click website, call, directions)
  // BrightLocal 2024: 56% of actions on GBP are website clicks
  const totalActions = Math.round(monthlyImpressions * 0.05);
  const websiteClicks = Math.round(totalActions * 0.56);

  // ── Step 3: Lost opportunities without a website ──
  // 75% of people who click "website" and find nothing → leave (SOCi study)
  // They search for a competitor instead
  const lostVisitors = Math.round(websiteClicks * 0.75);

  // ── Step 4: Conversion rate → lost clients ──
  // Avg local business website converts 2-8% depending on sector
  const convRate = sector ? sector.conv : 0.06;
  const lostClients = Math.max(1, Math.round(lostVisitors * convRate));

  // ── Step 5: Lost revenue ──
  // Based on sector average ticket
  const avgTicket = sector ? sector.ticket : 80;
  // Recurring factor: some clients come back (1.5x for services, 3x for restaurants)
  const recurFactor = avgTicket < 30 ? 3.0 : avgTicket < 100 ? 2.0 : avgTicket < 500 ? 1.5 : 1.0;
  const lostRevenue = Math.round(lostClients * avgTicket * recurFactor);

  // ── Step 6: Annual projection ──
  const annualLoss = lostRevenue * 12;

  return {
    monthlyImpressions,
    totalActions,
    websiteClicks,
    lostVisitors,
    lostClients,
    lostRevenue,
    annualLoss,
    avgTicket,
    convRate,
    recurFactor,
    sector,
    rating,
    reviews,
  };
}

function renderCalc(p) {
  const r = calculateLoss(p);
  const sectorLabel = r.sector ? r.sector.label : (p.niche || currentNiche || 'Commerce local');
  const convPct = (r.convRate * 100).toFixed(1);
  const recurLabel = r.recurFactor >= 2.5 ? 'Clients recurrents (frequentation reguliere)' : r.recurFactor >= 1.5 ? 'Clients semi-recurrents' : 'Clients ponctuels';

  document.getElementById('calc-content').innerHTML = `
    <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:1rem;padding:.6rem 1rem;background:rgba(237,237,237,.06);border:1px solid rgba(237,237,237,.12);border-radius:10px;">
      <span style="font-size:1.1rem;">📊</span>
      <span style="font-size:.82rem;font-weight:700;color:var(--text);">Analyse pour : ${esc(sectorLabel)}</span>
      <span style="font-size:.7rem;color:var(--dim);margin-left:auto;">${r.rating}/5 · ${r.reviews} avis</span>
    </div>

    <div class="calc-grid">
      <div class="calc-card">
        <div class="calc-n">${r.monthlyImpressions.toLocaleString('fr-FR')}</div>
        <div class="calc-l">Vues Google Maps / mois</div>
        <div style="font-size:.65rem;color:var(--dim);margin-top:.3rem;">Visibilite dans la recherche locale</div>
      </div>
      <div class="calc-card">
        <div class="calc-n">${r.totalActions.toLocaleString('fr-FR')}</div>
        <div class="calc-l">Actions utilisateurs / mois</div>
        <div style="font-size:.65rem;color:var(--dim);margin-top:.3rem;">Clics, appels, itineraires (5% des vues)</div>
      </div>
      <div class="calc-card">
        <div class="calc-n" style="color:var(--text)">${r.websiteClicks.toLocaleString('fr-FR')}</div>
        <div class="calc-l">Cherchent le site web</div>
        <div style="font-size:.65rem;color:var(--dim);margin-top:.3rem;">56% des actions = clic sur "Site web"</div>
      </div>
      <div class="calc-card">
        <div class="calc-n" style="color:var(--red-tx)">${r.lostVisitors.toLocaleString('fr-FR')}</div>
        <div class="calc-l">Repartent chez un concurrent</div>
        <div style="font-size:.65rem;color:var(--dim);margin-top:.3rem;">75% abandonnent sans site web</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0;">
      <div class="calc-card hi">
        <div class="calc-n">${r.lostClients}</div>
        <div class="calc-l">Clients perdus / mois</div>
        <div style="font-size:.65rem;color:var(--dim);margin-top:.3rem;">Taux conversion secteur : ${convPct}%</div>
      </div>
      <div class="calc-card" style="border-color:rgba(237,237,237,.2);border-width:1px;">
        <div class="calc-n" style="color:var(--text)">${r.avgTicket.toLocaleString('fr-FR')} &euro;</div>
        <div class="calc-l">Panier moyen du secteur</div>
        <div style="font-size:.65rem;color:var(--dim);margin-top:.3rem;">${recurLabel}</div>
      </div>
    </div>

    <div class="calc-card hi" style="margin-bottom:.5rem;text-align:center;border:2px solid rgba(255,65,65,.3);background:rgba(255,65,65,.05);">
      <div style="font-size:.75rem;font-weight:700;color:var(--red-tx);margin-bottom:.4rem;">MANQUE A GAGNER ESTIME</div>
      <div class="calc-n" style="font-size:2.2rem;color:var(--red-tx);">~${r.lostRevenue.toLocaleString('fr-FR')} &euro; <span style="font-size:.9rem;font-weight:600;">/mois</span></div>
      <div style="font-size:1rem;font-weight:800;color:var(--text);margin-top:.5rem;">~${r.annualLoss.toLocaleString('fr-FR')} &euro; /an</div>
    </div>

    <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:.8rem 1rem;margin-top:1rem;">
      <div style="font-size:.72rem;font-weight:700;color:var(--text2);margin-bottom:.5rem;">📐 Methodologie</div>
      <div style="font-size:.68rem;color:var(--dim);line-height:1.6;">
        <strong>1.</strong> Vues Google Maps estimees selon le nombre d'avis, la note et le volume de recherche du secteur (source : BrightLocal 2024)<br>
        <strong>2.</strong> 5% des vues generent une action — appel, itineraire ou clic site web (source : Google Business Profile Insights)<br>
        <strong>3.</strong> 56% des actions = clic sur le bouton "Site web" (source : BrightLocal)<br>
        <strong>4.</strong> 75% des utilisateurs quittent si aucun site n'est trouve (source : SOCi, Stanford Web Credibility)<br>
        <strong>5.</strong> Taux de conversion ${convPct}% et panier moyen ${r.avgTicket}&euro; bases sur les moyennes du secteur ${esc(sectorLabel)}
      </div>
    </div>`;
}

/* ── CRM save (API) ── */
function debounceSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveCrmNow, 800);
}
async function saveCrmNow() {
  if (!currentProspect) return;
  const notes  = document.getElementById('m-notes').value;
  const rappel = document.getElementById('m-rappel').value;
  currentProspect.notes  = notes;
  currentProspect.rappel = rappel;
  try {
    await fetch(`/api/prospects/${currentProspect.id}/notes`, {
      method: 'PUT',
      headers: AUTH_HEADERS,
      body: JSON.stringify({ notes, rappel }),
    });
    const saved = document.getElementById('crm-saved');
    saved.classList.add('show');
    setTimeout(() => saved.classList.remove('show'), 2000);
  } catch (e) { console.error('Erreur sauvegarde CRM:', e); }
}

/* ── Pitch type ── */
function setPitchType(type) {
  pitchType = type;
  document.querySelectorAll('.pitch-type-btn').forEach(b => b.classList.toggle('on', b.dataset.type === type));
}

/* ── Pitch generation (server uses stored API key) ── */
async function generatePitch() {
  const btn = document.getElementById('btn-gen');
  btn.disabled = true;
  document.getElementById('pitch-zone').innerHTML = `<div class="pitch-loading"><div class="mini-spin"></div> ${randomFrom(FUN_PITCH)}</div>`;
  try {
    const res = await fetch('/api/pitch', {
      method: 'POST',
      headers: AUTH_HEADERS,
      body: JSON.stringify({ prospect: currentProspect, niche: currentNiche || currentProspect?.niche || currentProspect.name, pitchType }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || data.error || `Erreur ${res.status}`);
    const text = data.content?.[0]?.text || '';
    if (!text) throw new Error('Réponse vide de Claude');
    document.getElementById('pitch-zone').innerHTML = `
      <div class="pitch-out on" id="pitch-text">${esc(text).replace(/\n/g,'<br>')}</div>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;">
        <button class="btn-copy" onclick="copyPitch()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          Copier le script
        </button>
        <button class="btn-copy" onclick="downloadPitch()" style="border-color:rgba(237,237,237,.15);color:var(--text2);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Télécharger .txt
        </button>
        <button class="btn-regen" onclick="generatePitch()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
          </svg>
          Régénérer
        </button>
      </div>`;
    document.getElementById('pitch-text').dataset.raw = text;
  } catch (err) {
    document.getElementById('pitch-zone').innerHTML = `<div class="pitch-err">${esc(err.message)}</div>`;
  } finally {
    btn.disabled = false;
  }
}

/* ── Fiche generation (server uses stored API key) ── */
async function generateFiche() {
  const btn = document.getElementById('btn-fiche-gen');
  btn.disabled = true;
  document.getElementById('fiche-zone').innerHTML = `<div class="pitch-loading"><div class="mini-spin"></div> On stalke ce prospect pour toi... 👀</div>`;
  try {
    const res = await fetch('/api/pitch', {
      method: 'POST',
      headers: AUTH_HEADERS,
      body: JSON.stringify({ prospect: currentProspect, niche: currentNiche || (currentProspect && currentProspect.niche) || currentProspect.name, pitchType: 'fiche' }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || data.error || `Erreur ${res.status}`);
    const text = data.content?.[0]?.text || '';
    if (!text) throw new Error('Réponse vide de Claude');
    document.getElementById('fiche-zone').innerHTML = `
      <div class="fiche-out">${esc(text).replace(/\n/g,'<br>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')}</div>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.75rem;">
        <button class="btn-copy" onclick="copyFiche()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          Copier la fiche
        </button>
        <button class="btn-regen" onclick="generateFiche()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
          </svg>
          Relancer
        </button>
      </div>`;
    document.getElementById('fiche-zone').querySelector('.fiche-out').dataset.raw = text;
  } catch (err) {
    document.getElementById('fiche-zone').innerHTML = `<div class="pitch-err">${esc(err.message)}</div>`;
  } finally {
    btn.disabled = false;
  }
}

function copyFiche() {
  const el = document.querySelector('.fiche-out');
  if (!el) return;
  navigator.clipboard.writeText(el.dataset.raw || el.innerText).then(() => {
    const btn = document.querySelector('#fiche-zone .btn-copy');
    if (btn) {
      btn.textContent = '\u2713 Copié !';
      setTimeout(() => btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copier la fiche`, 2500);
    }
    showToast('Fiche copiée ! Tu sais tout sur ta proie maintenant 🕵️', 'success', 2000);
  });
}

function copyPitch() {
  const el = document.getElementById('pitch-text');
  if (!el) return;
  navigator.clipboard.writeText(el.dataset.raw || el.innerText).then(() => {
    const btn = document.querySelector('#pitch-zone .btn-copy');
    if (btn) {
      btn.textContent = '\u2713 Copié !';
      setTimeout(() => btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copier le script`, 2500);
    }
    showToast(randomFrom(FUN_COPY), 'success', 2000);
  });
}

function downloadPitch() {
  const el = document.getElementById('pitch-text');
  if (!el) return;
  const text = el.dataset.raw || el.innerText;
  const name = currentProspect ? currentProspect.name.replace(/[^a-zA-Z0-9àâäéèêëïîôùûüçÀÂÄÉÈÊËÏÎÔÙÛÜÇ -]/g, '') : 'prospect';
  const filename = `${pitchType}_${name}.txt`;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── Stats Dashboard ── */
function renderStats() {
  const total  = prospects.length;
  const todo   = prospects.filter(p => p.status === 'todo').length;
  const called = prospects.filter(p => p.status === 'called').length;
  const client = prospects.filter(p => p.status === 'client').length;
  const nope   = prospects.filter(p => p.status === 'nope').length;
  const contacted = called + client + nope;
  const convRate = contacted > 0 ? Math.round((client / contacted) * 100) : 0;

  document.getElementById('stat-total').textContent  = total;
  document.getElementById('stat-called').textContent = called;
  document.getElementById('stat-client').textContent = client;
  document.getElementById('stat-rate').textContent   = convRate + '%';
  const todoEl = document.getElementById('dash-todo-detail');
  if (todoEl) todoEl.textContent = `${todo} à appeler`;
  const nopeEl = document.getElementById('dash-nope-detail');
  if (nopeEl) nopeEl.textContent = `${nope} refusés`;

  // Progress bars
  const calledPct = total > 0 ? Math.round((contacted / total) * 100) : 0;
  const clientPct = total > 0 ? Math.round((client / total) * 100) : 0;
  const progCalled = document.getElementById('progress-called');
  if (progCalled) progCalled.style.width = calledPct + '%';
  const progClient = document.getElementById('progress-client');
  if (progClient) progClient.style.width = clientPct + '%';
  updateRappelBadge();
}

function renderStars(r) {
  if (r == null) return '<span class="nd">\u2014</span>';
  const n = Math.round(r);
  return `<span class="stars">${'\u2605'.repeat(n)}${'\u2606'.repeat(5-n)}</span><span class="rval">${r.toFixed(1)}</span>`;
}
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function decodeHtml(s) {
  const el = document.createElement('textarea');
  el.innerHTML = s;
  return el.value;
}

/* ── Export CSV ── */
/* runOwnerExtraction removed — owners mode now uses normal search flow */

function exportCSV() {
  let filtered = getFilteredProspects();
  if (currentNiche) filtered = filtered.filter(p => p.niche === currentNiche);
  if (!filtered.length) { showToast('T\'as 0 prospect, tu veux exporter du VENT ? 💨', 'error'); return; }
  const header = ['#','Nom','Téléphone','Adresse','Ville','Note','Nb d\'avis','Site web','Facebook','Instagram','TikTok','Chaleur','Statut','Notes CRM','Rappel'];
  const heatLabels = {3:'Très chaud',2:'Chaud',1:'Tiède',0:'Froid'};
  const socialLabel = v => v === 1 ? 'Oui' : v === 0 ? 'Non' : '?';
  const rows = filtered.map((p,i) => {
    const s = heatScore(p);
    return [
      i+1, p.name, p.phone, p.address, p.city || '',
      p.rating != null ? p.rating.toFixed(1) : '',
      p.reviews,
      p.website_url || 'Non',
      socialLabel(p.has_facebook),
      socialLabel(p.has_instagram),
      socialLabel(p.has_tiktok),
      heatLabels[s] || '\u2014',
      STATUS_LABEL[p.status],
      p.notes || '',
      p.rappel || '',
    ];
  });

  let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
  html += '<head><meta charset="utf-8"/><style>td,th{padding:6px 10px;border:1px solid #ccc;font-family:Calibri,Arial;font-size:12pt} th{background:#0078d4;color:#fff;font-weight:bold} tr:nth-child(even){background:#f2f7fc}</style></head><body><table>';
  html += '<tr>' + header.map(h => `<th>${h}</th>`).join('') + '</tr>';
  rows.forEach(r => {
    html += '<tr>' + r.map(c => `<td>${String(c).replace(/</g,'&lt;').replace(/>/g,'&gt;')}</td>`).join('') + '</tr>';
  });
  html += '</table></body></html>';

  const blob = new Blob(['\uFEFF' + html], { type:'application/vnd.ms-excel;charset=utf-8' });
  const niche = document.getElementById('niche').value.replace(/\s+/g,'_') || 'prospects';
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: `prospects_${niche}_${new Date().toISOString().slice(0,10)}.xls`
  });
  a.click();
  URL.revokeObjectURL(a.href);
  showToast(randomFrom(FUN_EXPORT), 'success');
}

/* ── Export PDF ── */
function exportPDF() {
  let filtered = getFilteredProspects();
  if (currentNiche) filtered = filtered.filter(p => p.niche === currentNiche);
  if (!filtered.length) { showToast('T\'as 0 prospect, tu veux exporter du VENT ? 💨', 'error'); return; }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  const niche = currentNiche || (filterNiche !== 'all' && filterNiche) || document.getElementById('niche').value || 'Prospects';
  const date = new Date().toLocaleDateString('fr-FR');
  const heatLabels = {3:'Tres chaud',2:'Chaud',1:'Tiede',0:'Froid'};

  // Title
  doc.setFontSize(18);
  doc.setTextColor(22, 33, 62);
  doc.text(`ProspectHunter — ${niche}`, 14, 16);
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`${filtered.length} prospects · Exporte le ${date}`, 14, 22);

  // Table
  const head = [['#', 'Nom', 'Telephone', 'Ville', 'Adresse', 'Note', 'Avis', 'Chaleur', 'Statut']];
  const body = filtered.map((p, i) => [
    i + 1,
    p.name,
    p.phone,
    p.city || '',
    p.address,
    p.rating != null ? p.rating.toFixed(1) : '-',
    p.reviews,
    heatLabels[heatScore(p)] || '-',
    STATUS_LABEL[p.status] || p.status
  ]);

  doc.autoTable({
    startY: 27,
    head,
    body,
    theme: 'grid',
    headStyles: {
      fillColor: [22, 33, 62],
      textColor: 255,
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 30, 30],
      cellPadding: 2.5
    },
    alternateRowStyles: { fillColor: [240, 247, 255] },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 45, fontStyle: 'bold' },
      2: { cellWidth: 28 },
      3: { cellWidth: 28 },
      4: { cellWidth: 55 },
      5: { cellWidth: 12, halign: 'center' },
      6: { cellWidth: 12, halign: 'center' },
      7: { cellWidth: 22, halign: 'center' },
      8: { cellWidth: 22, halign: 'center' }
    },
    styles: { overflow: 'linebreak' },
    margin: { left: 14, right: 14 },
    didParseCell: function(data) {
      // Couleurs chaleur
      if (data.section === 'body' && data.column.index === 7) {
        const v = data.cell.raw;
        if (v === 'Tres chaud') { data.cell.styles.textColor = [220, 50, 50]; data.cell.styles.fontStyle = 'bold'; }
        else if (v === 'Chaud') data.cell.styles.textColor = [0, 140, 210];
        else if (v === 'Tiede') data.cell.styles.textColor = [200, 150, 0];
        else data.cell.styles.textColor = [150, 150, 150];
      }
      // Couleurs statut
      if (data.section === 'body' && data.column.index === 8) {
        const v = data.cell.raw;
        if (v === 'Client') { data.cell.styles.textColor = [0, 160, 110]; data.cell.styles.fontStyle = 'bold'; }
        else if (v === 'Appele') data.cell.styles.textColor = [200, 150, 0];
        else if (v === 'Pas interesse') data.cell.styles.textColor = [200, 70, 70];
      }
      // Telephone en bleu
      if (data.section === 'body' && data.column.index === 2) {
        data.cell.styles.textColor = [0, 120, 210];
      }
    },
    didDrawPage: function() {
      doc.setFontSize(7);
      doc.setTextColor(160,160,160);
      doc.text(`ProspectHunter — Page ${doc.internal.getNumberOfPages()}`, 14, doc.internal.pageSize.height - 7);
    }
  });

  const filename = `prospects_${niche.replace(/\s+/g,'_')}_${new Date().toISOString().slice(0,10)}.pdf`;
  doc.save(filename);
  showToast(randomFrom(FUN_EXPORT), 'success');
}

/* ── Referral ── */
async function loadReferral() {
  try {
    const res = await fetch('/api/referral', { headers: AUTH_HEADERS });
    if (!res.ok) return;
    const data = await res.json();
    const section = document.getElementById('referral-section');
    section.style.display = '';
    document.getElementById('ref-link').value = location.origin + '/login?ref=' + data.referral_code;
    document.getElementById('ref-count').textContent = data.total_referrals || 0;
    document.getElementById('ref-credits').textContent = data.credits_earned || 0;
  } catch (e) { console.error('Erreur parrainage:', e); }
}

function copyRefLink() {
  const inp = document.getElementById('ref-link');
  inp.select();
  navigator.clipboard.writeText(inp.value).then(() => {
    const btn = inp.nextElementSibling;
    btn.textContent = 'Copié !';
    setTimeout(() => btn.textContent = 'Copier le lien', 2000);
    showToast('Lien copié ! Va recruter tes soldats 🫡', 'success', 2000);
  });
}

/* ── Theme toggle (dark/light) ── */
function toggleTheme() {
  const body = document.body;
  const isLight = body.classList.toggle('light');
  localStorage.setItem('ph_theme', isLight ? 'light' : 'dark');
  document.getElementById('theme-toggle').textContent = isLight ? '🌞' : '🌙';
}
function initTheme() {
  const saved = localStorage.getItem('ph_theme');
  if (saved === 'light') {
    document.body.classList.add('light');
    document.getElementById('theme-toggle').textContent = '🌞';
  }
}

/* ── Batch Pitch ── */
async function batchPitch() {
  const todoProspects = prospects.filter(p => p.status === 'todo').slice(0, 20);
  if (todoProspects.length === 0) {
    showToast('T\'as 0 prospect "À appeler", lance une recherche d\'abord génie 🧠', 'info');
    return;
  }

  const count = todoProspects.length;
  if (!confirm(`Générer un pitch pour ${count} prospect${count > 1 ? 's' : ''} "À appeler" ?\n\nType : ${pitchType}\nCela peut prendre quelques minutes.`)) return;

  const btn = document.getElementById('btn-batch');
  btn.disabled = true;
  btn.textContent = `Génération 0/${count}...`;

  try {
    const res = await fetch('/api/pitch/batch', {
      method: 'POST',
      headers: AUTH_HEADERS,
      body: JSON.stringify({
        prospects: todoProspects,
        niche: currentNiche || todoProspects[0]?.niche || '',
        pitchType,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur batch');

    // Download all pitches as a single file
    let content = `PITCHS BATCH — ${new Date().toLocaleDateString('fr-FR')}\nType : ${pitchType}\n${'='.repeat(60)}\n\n`;
    for (const r of data.results) {
      content += `── ${r.name || 'Prospect'} ──\n`;
      if (r.error) {
        content += `[Erreur : ${r.error}]\n\n`;
      } else {
        content += r.pitch + '\n\n';
      }
      content += '─'.repeat(40) + '\n\n';
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `pitchs_batch_${pitchType}_${new Date().toISOString().slice(0,10)}.txt`
    });
    a.click();
    URL.revokeObjectURL(a.href);

    showToast(`${data.success}/${data.total} pitchs générés ! L'IA a tout donné pour toi 🤖🔥`, 'success');
  } catch (err) {
    showToast(randomFrom(FUN_ERROR), 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg> Pitch batch IA`;
  }
}

/* ── Rappel Panel ── */
let rappelTab = 'today';

function toggleRappelPanel() {
  const overlay = document.getElementById('rappel-overlay');
  overlay.classList.toggle('on');
  if (overlay.classList.contains('on')) renderRappelList();
}

function switchRappelTab(tab) {
  rappelTab = tab;
  document.querySelectorAll('.rappel-tab').forEach(t => t.classList.toggle('on', t.dataset.rtab === tab));
  renderRappelList();
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getRappelProspects() {
  const today = getToday();
  const withRappel = prospects.filter(p => p.rappel);

  const overdue = withRappel.filter(p => p.rappel < today && p.status !== 'client' && p.status !== 'nope');
  const todayList = withRappel.filter(p => p.rappel === today && p.status !== 'client' && p.status !== 'nope');
  const upcoming = withRappel.filter(p => p.rappel > today && p.status !== 'client' && p.status !== 'nope');
  const history = withRappel.filter(p => p.status === 'client' || p.status === 'nope');

  return { overdue, today: todayList, upcoming, history };
}

function updateRappelBadge() {
  const badge = document.getElementById('rappel-badge');
  if (!badge) return;
  const { overdue, today: todayList } = getRappelProspects();
  const count = overdue.length + todayList.length;
  if (count > 0) {
    badge.textContent = count;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

function renderRappelList() {
  const list = document.getElementById('rappel-list');
  if (!list) return;
  const groups = getRappelProspects();
  let items;
  switch (rappelTab) {
    case 'overdue': items = groups.overdue; break;
    case 'today': items = groups.today; break;
    case 'upcoming': items = groups.upcoming; break;
    case 'history': items = groups.history; break;
    default: items = groups.today;
  }

  if (items.length === 0) {
    const msgs = {
      today: "Journée tranquille... pour l'instant. Va chercher des proies ! 🐺",
      overdue: 'Aucun retard ?! T\'es pas humain, t\'es une MACHINE 🤖',
      upcoming: 'Rien de prévu... c\'est le calme avant le massacre commercial 🌪️',
      history: 'Zéro historique. Ton téléphone prend la poussière là 📞💀',
    };
    list.innerHTML = `<div class="rappel-empty">${msgs[rappelTab]}</div>`;
    return;
  }

  // Sort
  items.sort((a, b) => (a.rappel || '').localeCompare(b.rappel || ''));

  const today = getToday();
  list.innerHTML = items.map(p => {
    const dateClass = p.rappel < today ? 'overdue' : p.rappel === today ? 'today' : 'upcoming';
    const itemClass = rappelTab === 'history' ? 'done' : dateClass;
    const dateLabel = formatRappelDate(p.rappel);
    const lastLog = getLastCallLog(p.notes);
    const statusLabel = STATUS_LABEL[p.status] || p.status;
    const statusClass = STATUS_CLASS[p.status] || '';
    return `
      <div class="rappel-item ${itemClass}" onclick="openRappelProspect(${p.id})">
        <div class="rappel-item-top">
          <span class="rappel-item-name">${esc(p.name)}</span>
          <span class="rappel-item-status ${statusClass}">${statusLabel}</span>
        </div>
        <div class="rappel-item-mid">
          <span>${esc(p.phone || '')}</span>
          <span>${esc(p.city || '')}</span>
        </div>
        <div class="rappel-item-date ${dateClass}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          ${dateLabel}
        </div>
        ${lastLog ? `<div class="rappel-item-log">${esc(lastLog)}</div>` : ''}
        <div class="rappel-item-actions">
          <a class="rappel-action-btn call" href="tel:${(p.phone || '').replace(/\s/g, '')}" onclick="event.stopPropagation();openCallTracker(${p.id})">Appeler</a>
          <button class="rappel-action-btn" onclick="event.stopPropagation();openProspectModal(${p.id})">Voir fiche</button>
        </div>
      </div>`;
  }).join('');
}

function formatRappelDate(dateStr) {
  if (!dateStr) return '';
  const today = getToday();
  const d = new Date(dateStr + 'T00:00:00');
  const label = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  if (dateStr === today) return "Aujourd'hui";
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  if (dateStr === yesterday.toISOString().slice(0, 10)) return 'Hier';
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  if (dateStr === tomorrow.toISOString().slice(0, 10)) return 'Demain';
  const diff = Math.round((new Date(dateStr) - new Date(today)) / 86400000);
  if (diff < 0) return `${label} (${Math.abs(diff)}j en retard)`;
  return label;
}

function getLastCallLog(notes) {
  if (!notes) return '';
  const lines = notes.split('\n').filter(l => l.startsWith('['));
  return lines.length > 0 ? lines[lines.length - 1] : '';
}

function openRappelProspect(id) {
  toggleRappelPanel();
  const p = prospects.find(x => x.id === id);
  if (p) openCallTracker(id);
}

function openProspectModal(id) {
  const p = prospects.find(x => x.id === id);
  if (!p) return;
  toggleRappelPanel();
  openModal(p.id, 'fiche');
}

/* ── Call Tracker ── */
let callTrackProspect = null;

function openCallTracker(prospectId) {
  callTrackProspect = prospects.find(x => x.id === prospectId);
  if (!callTrackProspect) return;
  document.getElementById('call-prospect-name').textContent = callTrackProspect.name + (callTrackProspect.phone ? ' — ' + callTrackProspect.phone : '');
  // Reset steps
  document.querySelectorAll('.call-step').forEach(s => s.classList.remove('on'));
  document.getElementById('call-step-1').classList.add('on');
  document.getElementById('call-obj-custom').value = '';
  document.querySelectorAll('.call-obj-btn').forEach(b => b.classList.remove('sel'));
  document.getElementById('call-rappel-date').value = '';
  document.getElementById('call-retry-date').value = '';
  // Set default dates to tomorrow
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const tStr = tomorrow.toISOString().slice(0,10);
  document.getElementById('call-rappel-date').value = tStr;
  document.getElementById('call-retry-date').value = tStr;
  document.getElementById('call-overlay').classList.add('on');
}

function closeCallTracker() {
  document.getElementById('call-overlay').classList.remove('on');
  callTrackProspect = null;
}

function showCallStep(id) {
  document.querySelectorAll('.call-step').forEach(s => s.classList.remove('on'));
  document.getElementById(id).classList.add('on');
}

function callAnswer(answered) {
  if (answered) {
    showCallStep('call-step-2');
  } else {
    // Pas répondu → proposer un rappel
    addCallLog('Pas de réponse');
    showCallStep('call-step-noanswer');
  }
}

function callPositive(positive) {
  if (positive) {
    showCallStep('call-step-rappel');
  } else {
    showCallStep('call-step-obj');
  }
}

function selectObj(btn) {
  document.querySelectorAll('.call-obj-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  document.getElementById('call-obj-custom').value = '';
}
function clearObjBtns() {
  document.querySelectorAll('.call-obj-btn').forEach(b => b.classList.remove('sel'));
}

function confirmObj() {
  const selected = document.querySelector('.call-obj-btn.sel');
  const custom = document.getElementById('call-obj-custom').value.trim();
  const objection = custom || (selected ? selected.textContent : 'Non précisée');
  addCallLog('Réponse négative — Objection : ' + objection);
  updateProspectStatus('nope');
  showDone('😤', `L'ingrat a dit non... sa perte !<br>Excuse bidon : ${objection}`);
}

function confirmRappel() {
  const date = document.getElementById('call-rappel-date').value;
  addCallLog('Réponse positive — Intéressé' + (date ? ' — Rappel le ' + formatDateFR(date) : ''));
  updateProspectStatus('client');
  if (date) callTrackProspect.rappel = date;
  saveCallCRM();
  launchConfetti();
  showDone('🎉', `BOOOOM BÉBÉ ! CLIENT CLOSÉ ! 🔥💰` + (date ? `<br>RDV le ${formatDateFR(date)} pour encaisser 💸` : ''));
}

function confirmRetry() {
  const date = document.getElementById('call-retry-date').value;
  addCallLog('Pas de réponse' + (date ? ' — Rappel le ' + formatDateFR(date) : ''));
  updateProspectStatus('called');
  if (date) callTrackProspect.rappel = date;
  saveCallCRM();
  showDone('📞', `Il fuit... mais on le retrouvera ! 🎯` + (date ? `<br>Embuscade programmée le ${formatDateFR(date)} 🫡` : ''));
}

function addCallLog(msg) {
  if (!callTrackProspect) return;
  const now = new Date();
  const ts = now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'});
  const logLine = `[${ts}] ${msg}`;
  callTrackProspect.notes = callTrackProspect.notes
    ? callTrackProspect.notes + '\n' + logLine
    : logLine;
}

function updateProspectStatus(status) {
  if (!callTrackProspect) return;
  callTrackProspect.status = status;
  renderTable();
  renderStats();
  fetch(`/api/prospects/${callTrackProspect.id}/status`, {
    method: 'PUT', headers: AUTH_HEADERS,
    body: JSON.stringify({ status }),
  }).catch(e => console.error('Erreur statut:', e));
}

async function saveCallCRM() {
  if (!callTrackProspect) return;
  try {
    await fetch(`/api/prospects/${callTrackProspect.id}/notes`, {
      method: 'PUT', headers: AUTH_HEADERS,
      body: JSON.stringify({ notes: callTrackProspect.notes, rappel: callTrackProspect.rappel || '' }),
    });
  } catch (e) { console.error('Erreur CRM:', e); }
}

function showDone(icon, msg) {
  document.getElementById('call-done-icon').textContent = icon;
  document.getElementById('call-done-msg').innerHTML = msg;
  showCallStep('call-step-done');
  saveCallCRM();
  updateRappelBadge();
  setTimeout(closeCallTracker, 2200);
}

function formatDateFR(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });
}

/* ── Keyboard shortcuts ── */
document.getElementById('niche-custom-input').addEventListener('keydown', e => { if (e.key==='Enter') runSearch(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('call-overlay').classList.contains('on')) closeCallTracker();
    else if (document.getElementById('settings-bd').classList.contains('on')) closeSettings();
    else if (document.getElementById('modal-bd').classList.contains('on')) closeModal();
  }
});

/* ── Bulk Actions ── */
function toggleRowSelect(id, el) {
  if (el.checked) {
    selectedIds.add(id);
    el.closest('tr').classList.add('row-selected');
  } else {
    selectedIds.delete(id);
    el.closest('tr').classList.remove('row-selected');
  }
  // Update select-all state
  const checkboxes = document.querySelectorAll('.row-check');
  const selectAllEl = document.getElementById('select-all');
  if (selectAllEl) {
    const allChecked = checkboxes.length > 0 && [...checkboxes].every(c => c.checked);
    selectAllEl.checked = allChecked;
    selectAllEl.indeterminate = !allChecked && [...checkboxes].some(c => c.checked);
  }
  updateBulkBar();
}

function toggleSelectAll(el) {
  const checkboxes = document.querySelectorAll('.row-check');
  checkboxes.forEach(cb => {
    const id = parseInt(cb.dataset.id, 10);
    if (el.checked) {
      selectedIds.add(id);
      cb.checked = true;
      cb.closest('tr').classList.add('row-selected');
    } else {
      selectedIds.delete(id);
      cb.checked = false;
      cb.closest('tr').classList.remove('row-selected');
    }
  });
  updateBulkBar();
}

function clearSelection() {
  selectedIds.clear();
  document.querySelectorAll('.row-check').forEach(cb => {
    cb.checked = false;
    cb.closest('tr').classList.remove('row-selected');
  });
  const selectAllEl = document.getElementById('select-all');
  if (selectAllEl) { selectAllEl.checked = false; selectAllEl.indeterminate = false; }
  updateBulkBar();
}

function updateBulkBar() {
  const bar = document.getElementById('bulk-bar');
  if (!bar) return;
  const count = selectedIds.size;
  if (count > 0) {
    bar.classList.add('on');
    document.getElementById('bulk-count').textContent = `${count} selectionne${count > 1 ? 's' : ''}`;
  } else {
    bar.classList.remove('on');
  }
}

async function bulkSetStatus() {
  const sel = document.getElementById('bulk-status-select');
  const status = sel.value;
  if (!status) return;
  const ids = [...selectedIds];
  if (ids.length === 0) return;

  try {
    const res = await fetch('/api/prospects/bulk/status', {
      method: 'PUT',
      headers: AUTH_HEADERS,
      body: JSON.stringify({ ids, status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur');

    // Update local state
    ids.forEach(id => {
      const p = prospects.find(x => x.id === id);
      if (p) p.status = status;
    });
    clearSelection();
    sel.value = '';
    renderTable();
    renderStats();
    showToast(`${data.updated} prospect${data.updated > 1 ? 's' : ''} écrasé${data.updated > 1 ? 's' : ''} 💪`, 'success');
  } catch (e) {
    showToast(randomFrom(FUN_ERROR), 'error');
  }
}

async function bulkDelete() {
  const ids = [...selectedIds];
  if (ids.length === 0) return;
  if (!confirm(`Exterminer ${ids.length} prospect${ids.length > 1 ? 's' : ''} ? Pas de retour en arrière ! 💀`)) return;

  try {
    const res = await fetch('/api/prospects/bulk', {
      method: 'DELETE',
      headers: AUTH_HEADERS,
      body: JSON.stringify({ ids }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur');

    // Update local state
    prospects = prospects.filter(p => !selectedIds.has(p.id));
    clearSelection();
    renderTable();
    renderStats();
    showToast(`${data.deleted} prospect${data.deleted > 1 ? 's' : ''} exterminé${data.deleted > 1 ? 's' : ''} ! Thanos approuve 🫰`, 'success');
  } catch (e) {
    showToast(randomFrom(FUN_ERROR), 'error');
  }
}

/* ── Event delegation for table rows ── */
document.getElementById('tbody').addEventListener('click', function(e) {
  const target = e.target;
  // Delete button
  const delBtn = target.closest('.btn-del');
  if (delBtn) { e.stopPropagation(); deleteProspect(parseInt(delBtn.dataset.pid, 10), e); return; }
  // Fiche button
  const ficheBtn = target.closest('.btn-fiche');
  if (ficheBtn) { e.stopPropagation(); openModal(parseInt(ficheBtn.dataset.pid, 10), 'fiche'); return; }
  // Pitch button
  const pitchBtn = target.closest('.btn-pitch');
  if (pitchBtn) { e.stopPropagation(); openModal(parseInt(pitchBtn.dataset.pid, 10), 'pitch'); return; }
  // Call button
  const callBtn = target.closest('.btn-call');
  if (callBtn) { e.stopPropagation(); openCallTracker(parseInt(callBtn.dataset.pid, 10)); return; }
  // Phone link
  const phoneLink = target.closest('.phone-link');
  if (phoneLink) { e.stopPropagation(); openCallTracker(parseInt(phoneLink.dataset.pid, 10)); return; }
  // Row click (open modal)
  const row = target.closest('tr');
  if (row && row.dataset.pid && !target.closest('.row-actions') && !target.closest('.status-select') && !target.closest('.row-check') && !target.closest('a')) {
    openModal(parseInt(row.dataset.pid, 10), 'calc');
  }
});

document.getElementById('tbody').addEventListener('change', function(e) {
  const target = e.target;
  // Checkbox
  if (target.classList.contains('row-check')) {
    toggleRowSelect(parseInt(target.dataset.id, 10), target);
    return;
  }
  // Status select
  if (target.classList.contains('status-select')) {
    setStatus(parseInt(target.dataset.pid, 10), target.value, target);
    return;
  }
});

/* ── ANALYTICS ── */
let analyticsOpen = false;

function toggleAnalytics() {
  analyticsOpen = !analyticsOpen;
  const body = document.getElementById('analytics-body');
  const chevron = document.getElementById('analytics-chevron');
  if (analyticsOpen) {
    body.style.display = 'block';
    chevron.classList.add('open');
    renderAnalytics();
  } else {
    body.style.display = 'none';
    chevron.classList.remove('open');
  }
}

async function renderAnalytics() {
  try {
    const res = await fetch('/api/prospects/analytics', { headers: AUTH_HEADERS });
    if (!res.ok) return;
    const data = await res.json();

    // Show section
    document.getElementById('analytics-section').style.display = 'block';

    // Totals
    const totals = data.totals || { total: 0, called: 0, client: 0, nope: 0 };
    document.getElementById('analytics-totals').innerHTML = `
      <div class="analytics-total-card"><div class="analytics-total-val">${totals.total || 0}</div><div class="analytics-total-label">Total prospects</div></div>
      <div class="analytics-total-card"><div class="analytics-total-val">${totals.called || 0}</div><div class="analytics-total-label">Contactés</div></div>
      <div class="analytics-total-card"><div class="analytics-total-val">${totals.client || 0}</div><div class="analytics-total-label">Clients</div></div>
      <div class="analytics-total-card"><div class="analytics-total-val">${totals.total > 0 ? Math.round(((totals.client || 0) / totals.total) * 100) : 0}%</div><div class="analytics-total-label">Conversion</div></div>
    `;

    // Daily bar chart
    renderDailyChart(data.dailyStats || []);

    // Weekly line chart
    renderWeeklyChart(data.weeklyConversion || []);

    // Activity timeline
    renderTimeline(data.activityLog || []);
  } catch (e) { console.error('Analytics error:', e); }
}

function renderDailyChart(stats) {
  const svg = document.getElementById('chart-daily');
  if (!svg) return;

  // Fill in missing days
  const days = [];
  const dayLabels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const found = stats.find(s => s.day === key);
    days.push({ label: dayLabels[d.getDay()], count: found ? found.count : 0 });
  }

  const max = Math.max(...days.map(d => d.count), 1);
  const barW = 30, gap = 16, startX = 30, chartH = 120, baseY = 140;

  let html = '';
  // Y axis labels
  for (let i = 0; i <= 4; i++) {
    const y = baseY - (chartH / 4) * i;
    const val = Math.round((max / 4) * i);
    html += `<line x1="${startX}" y1="${y}" x2="310" y2="${y}" stroke="rgba(255,255,255,.05)" stroke-width="1"/>`;
    html += `<text x="${startX - 6}" y="${y + 3}" fill="#666" font-size="9" text-anchor="end">${val}</text>`;
  }

  days.forEach((d, i) => {
    const x = startX + i * (barW + gap);
    const h = (d.count / max) * chartH;
    const y = baseY - h;
    html += `<rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="3" fill="#a1a1a1" opacity=".7"/>`;
    html += `<text x="${x + barW / 2}" y="${baseY + 14}" fill="#666" font-size="9" text-anchor="middle">${d.label}</text>`;
    if (d.count > 0) html += `<text x="${x + barW / 2}" y="${y - 4}" fill="#ededed" font-size="10" font-weight="600" text-anchor="middle">${d.count}</text>`;
  });

  svg.innerHTML = html;
}

function renderWeeklyChart(weeks) {
  const svg = document.getElementById('chart-weekly');
  if (!svg) return;

  if (weeks.length === 0) {
    svg.innerHTML = '<text x="160" y="80" fill="#666" font-size="11" text-anchor="middle">Pas encore de données</text>';
    return;
  }

  // Pad to 4 weeks
  while (weeks.length < 4) weeks.unshift({ week: '?', called: 0, client: 0, total: 0 });
  const last4 = weeks.slice(-4);

  const max = Math.max(...last4.map(w => w.total), 1);
  const chartH = 100, baseY = 130, startX = 50, stepX = 75;

  let html = '';
  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const y = baseY - (chartH / 4) * i;
    html += `<line x1="${startX}" y1="${y}" x2="${startX + stepX * 3}" y2="${y}" stroke="rgba(255,255,255,.05)"/>`;
  }

  // Total line
  const totalPts = last4.map((w, i) => `${startX + i * stepX},${baseY - (w.total / max) * chartH}`);
  html += `<polyline points="${totalPts.join(' ')}" fill="none" stroke="#a1a1a1" stroke-width="2"/>`;

  // Client line
  const clientPts = last4.map((w, i) => `${startX + i * stepX},${baseY - ((w.client || 0) / max) * chartH}`);
  html += `<polyline points="${clientPts.join(' ')}" fill="none" stroke="#ededed" stroke-width="2"/>`;

  // Points + labels
  last4.forEach((w, i) => {
    const x = startX + i * stepX;
    const yT = baseY - (w.total / max) * chartH;
    const yC = baseY - ((w.client || 0) / max) * chartH;
    html += `<circle cx="${x}" cy="${yT}" r="3" fill="#a1a1a1"/>`;
    html += `<circle cx="${x}" cy="${yC}" r="3" fill="#ededed"/>`;
    html += `<text x="${x}" y="${baseY + 14}" fill="#666" font-size="9" text-anchor="middle">S${w.week}</text>`;
    html += `<text x="${x}" y="${yT - 6}" fill="#a1a1a1" font-size="9" text-anchor="middle">${w.total}</text>`;
  });

  // Legend
  html += `<circle cx="60" cy="152" r="3" fill="#a1a1a1"/><text x="68" y="155" fill="#666" font-size="9">Total</text>`;
  html += `<circle cx="110" cy="152" r="3" fill="#ededed"/><text x="118" y="155" fill="#666" font-size="9">Clients</text>`;

  svg.innerHTML = html;
}

function renderTimeline(log) {
  const el = document.getElementById('analytics-timeline');
  if (!el) return;

  if (!log.length) {
    el.innerHTML = '<div style="text-align:center;color:var(--muted);font-size:.82rem;padding:1rem;">Aucune activité pour le moment</div>';
    return;
  }

  const icons = { search: '🔍', status_change: '📋', pitch_generated: '🎯', prospect_exported: '📊', prospect_added: '➕' };

  el.innerHTML = log.map(item => {
    const icon = icons[item.action] || '📌';
    let text = item.action;
    try {
      const d = JSON.parse(item.details || '{}');
      if (item.action === 'search') text = `Recherche "${d.niche}" — ${d.count} résultats`;
      else if (item.action === 'status_change') text = `Statut changé → ${d.status}`;
      else if (item.action === 'pitch_generated') text = `Pitch généré pour ${d.prospect}`;
      else if (item.action === 'prospect_exported') text = `Export de prospects`;
    } catch {}
    return `<div class="at-item"><span class="at-icon">${icon}</span><span class="at-text">${text}</span><span class="at-time">${timeAgo(item.created_at)}</span></div>`;
  }).join('');
}

function timeAgo(input) {
  const now = new Date();
  let then;
  if (input instanceof Date) { then = input; }
  else { const s = String(input); then = new Date(s + (s.includes('Z') ? '' : 'Z')); }
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'à l\'instant';
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `il y a ${Math.floor(diff / 86400)}j`;
  return then.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

/* ── RAPPEL ALERTS ── */
function checkRappelAlerts() {
  if (!prospects.length) return;
  const today = new Date().toISOString().split('T')[0];
  const due = prospects.filter(p => p.rappel && p.rappel <= today);
  if (due.length === 0) return;

  const banner = document.getElementById('rappel-alert-banner');
  const text = document.getElementById('rappel-alert-text');
  if (!banner || !text) return;

  const overdue = due.filter(p => p.rappel < today).length;
  let msg = `${due.length} rappel${due.length > 1 ? 's' : ''} en attente`;
  if (overdue > 0) msg += ` (${overdue} en retard !)`;
  text.textContent = msg;
  banner.style.display = 'flex';

  // Browser notifications
  sendRappelNotifications(due);
}

function dismissRappelAlert() {
  const banner = document.getElementById('rappel-alert-banner');
  if (banner) banner.style.display = 'none';
}

/* ── BROWSER NOTIFICATIONS ── */
function requestNotificationPermission() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function sendRappelNotifications(dueProspects) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const notifKey = 'ph_notif_' + new Date().toISOString().split('T')[0];
  if (localStorage.getItem(notifKey)) return;
  localStorage.setItem(notifKey, '1');

  const count = dueProspects.length;
  new Notification('ProspectHunter — Rappels', {
    body: `${count} prospect${count > 1 ? 's' : ''} à rappeler aujourd'hui !`,
    icon: '/favicon.ico',
  });
}

/* ── MILESTONES ── */
function checkMilestones() {
  if (!prospects.length) return;

  const achieved = JSON.parse(localStorage.getItem('ph_milestones') || '[]');
  const total = prospects.length;
  const clients = prospects.filter(p => p.status === 'client').length;
  const called = prospects.filter(p => p.status === 'called').length;

  const milestones = [
    { id: 'first_prospect', cond: total >= 1, msg: 'Premier prospect trouvé !' },
    { id: '10_prospects', cond: total >= 10, msg: '10 prospects dans ta base !' },
    { id: '50_prospects', cond: total >= 50, msg: '50 prospects — machine de guerre !' },
    { id: '100_prospects', cond: total >= 100, msg: '100 prospects — tu domines !' },
    { id: 'first_call', cond: called >= 1, msg: 'Premier appel passé !' },
    { id: 'first_client', cond: clients >= 1, msg: 'Premier client signé !' },
    { id: '5_clients', cond: clients >= 5, msg: '5 clients — t\'es un boss !' },
    { id: '10_clients', cond: clients >= 10, msg: '10 clients — légende vivante !' },
  ];

  for (const m of milestones) {
    if (m.cond && !achieved.includes(m.id)) {
      achieved.push(m.id);
      localStorage.setItem('ph_milestones', JSON.stringify(achieved));
      showMilestoneCelebration(m.msg);
      break; // one at a time
    }
  }
}

function showMilestoneCelebration(msg) {
  showToast(`🎉 ${msg}`, 'success', 5000);
  launchConfetti();
}

/* ── Init ── */
console.log('[APP] init start v3');
initTheme();
loadUser();
loadProspects().then(() => {
  checkRappelAlerts();
  checkMilestones();
});
loadSearchHistory();
checkSearchModes();
setSearchMode('site');
requestNotificationPermission();
