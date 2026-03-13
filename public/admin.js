/* ProspectHunter — Admin Page Logic */

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

const token = localStorage.getItem('ph_token');
if (!token) window.location.href = '/login';

const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token, 'X-Requested-With': 'XMLHttpRequest' };

async function loadAll() {
  try {
    const [statsRes, usersRes, searchesRes, revenueRes, dailyRes, topRes] = await Promise.all([
      fetch('/api/admin/stats', { headers }),
      fetch('/api/admin/users', { headers }),
      fetch('/api/admin/searches', { headers }),
      fetch('/api/admin/stats/revenue', { headers }),
      fetch('/api/admin/stats/daily', { headers }),
      fetch('/api/admin/stats/top-users', { headers }),
    ]);

    if (statsRes.status === 403 || usersRes.status === 403) {
      alert('Accès refusé. Vous devez être administrateur.');
      window.location.href = '/';
      return;
    }

    const stats = await statsRes.json();
    const users = await usersRes.json();
    const searches = await searchesRes.json();
    const revenue = await revenueRes.json();
    const daily = await dailyRes.json();
    const top = await topRes.json();

    // KPIs
    document.getElementById('s-users').textContent = stats.totalUsers;
    document.getElementById('s-searches').textContent = stats.totalSearches;
    document.getElementById('s-prospects').textContent = stats.totalProspects;
    const proPlus = (stats.planCounts || []).filter(p => p.plan !== 'free').reduce((a, b) => a + b.c, 0);
    document.getElementById('s-pro').textContent = proPlus;
    document.getElementById('s-mrr').textContent = revenue.mrr + ' \u20ac';

    // Charts
    renderChart('chart-registrations', daily.registrations, 'bar-cyan');
    renderChart('chart-searches', daily.searches, 'bar-emerald');

    // Top users
    renderTopTable('top-searches', top.bySearches);
    renderTopTable('top-prospects', top.byProspects);

    // Users table
    document.getElementById('users-body').innerHTML = users.map(u => `
      <tr>
        <td style="color:var(--muted)">${parseInt(u.id)}</td>
        <td style="font-weight:600">${esc(u.email)}</td>
        <td>
          <select class="plan-select" onchange="changePlan(${parseInt(u.id)}, this.value)">
            <option value="free" ${u.plan==='free'?'selected':''}>Free</option>
            <option value="pro" ${u.plan==='pro'?'selected':''}>Pro</option>
            <option value="enterprise" ${u.plan==='enterprise'?'selected':''}>Enterprise</option>
          </select>
        </td>
        <td>
          <input class="credits-input" type="number" value="${parseInt(u.credits)||0}" id="credits-${parseInt(u.id)}" min="0">
          <button class="btn-sm btn-cyan" onclick="setCredits(${parseInt(u.id)})">OK</button>
        </td>
        <td>${parseInt(u.total_searches)||0}</td>
        <td>${parseInt(u.total_prospects)||0}</td>
        <td style="color:var(--muted);font-size:.8rem">${new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
        <td>
          <button class="btn-sm ${u.is_admin ? 'btn-amber' : 'btn-emerald'}" onclick="toggleAdmin(${parseInt(u.id)}, ${u.is_admin ? 0 : 1})">
            ${u.is_admin ? 'Retirer admin' : 'Rendre admin'}
          </button>
        </td>
      </tr>
    `).join('');

    // Searches table
    document.getElementById('searches-body').innerHTML = searches.slice(0, 50).map(s => `
      <tr>
        <td style="font-weight:600">${esc(s.email)}</td>
        <td>${esc(s.niche)}</td>
        <td>${esc((s.country||'').toUpperCase())}</td>
        <td>${parseInt(s.results_count)||0}</td>
        <td style="color:var(--muted);font-size:.8rem">${new Date(s.created_at).toLocaleString('fr-FR')}</td>
      </tr>
    `).join('');

  } catch (err) {
    console.error(err);
    alert('Erreur lors du chargement.');
  }
}

function renderChart(containerId, data, barClass) {
  const container = document.getElementById(containerId);
  if (!data || data.length === 0) {
    container.innerHTML = '<span style="color:var(--muted);font-size:.8rem">Pas de données</span>';
    return;
  }
  const max = Math.max(...data.map(d => d.count), 1);
  container.innerHTML = data.map(d => {
    const pct = (parseInt(d.count)||0) / max * 100;
    const day = esc(String(d.day).slice(5));
    return `<div class="bar-col">
      <div class="bar ${barClass}" style="height:${Math.max(pct, 2)}%" title="${esc(d.day)}: ${parseInt(d.count)||0}"></div>
      <span class="bar-date">${day}</span>
    </div>`;
  }).join('');
}

function renderTopTable(containerId, data) {
  const container = document.getElementById(containerId);
  if (!data || data.length === 0) {
    container.innerHTML = '<tr><td colspan="3" style="color:var(--muted);text-align:center">Aucune donnée</td></tr>';
    return;
  }
  container.innerHTML = data.map(u => `
    <tr>
      <td style="font-weight:600">${esc(u.email)}</td>
      <td><span class="plan-badge plan-${esc(u.plan)}">${esc(u.plan)}</span></td>
      <td style="font-weight:700">${parseInt(u.total)||0}</td>
    </tr>
  `).join('');
}

async function setCredits(userId) {
  const val = parseInt(document.getElementById('credits-' + userId).value);
  if (isNaN(val) || val < 0) return;
  await fetch('/api/admin/users/' + userId + '/credits', {
    method: 'PUT', headers, body: JSON.stringify({ credits: val }),
  });
  loadAll();
}

async function changePlan(userId, plan) {
  if (!confirm('Changer le plan de cet utilisateur vers ' + plan + ' ?')) { loadAll(); return; }
  await fetch('/api/admin/users/' + userId + '/plan', {
    method: 'PUT', headers, body: JSON.stringify({ plan }),
  });
  loadAll();
}

async function toggleAdmin(userId, isAdmin) {
  const action = isAdmin ? 'Rendre cet utilisateur admin' : 'Retirer les droits admin de cet utilisateur';
  if (!confirm(action + ' ?')) return;
  await fetch('/api/admin/users/' + userId + '/admin', {
    method: 'PUT', headers, body: JSON.stringify({ is_admin: isAdmin }),
  });
  loadAll();
}

loadAll();
