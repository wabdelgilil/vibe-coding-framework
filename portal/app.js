(function () {
  'use strict';

  const P = window.PortalParser;
  const C = window.PortalCharts;
  const I18N = window.PortalI18N;

  const state = {
    lang: localStorage.getItem('portal_lang') || 'en',
    theme: localStorage.getItem('portal_theme') || 'light',
    view: 'overview',
    mode: window.location.protocol === 'file:' ? 'folder' : 'live',
    autoRefresh: false,
    autoTimer: null,
    searchQuery: '',
    debtFilter: 'all',
    dirHandle: null,
    snapshot: null,
    activeDocPath: null,
  };

  const t = (key) => (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || key;

  function applyChrome() {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dataset.theme = state.theme;

    document.getElementById('btn-lang').textContent = state.lang === 'ar' ? 'English' : 'العربية';
    document.getElementById('btn-theme').textContent = state.theme === 'dark' ? t('light') : t('dark');
    document.getElementById('btn-refresh').textContent = t('refresh');
    document.getElementById('btn-folder').textContent = t('chooseFolder');
    document.getElementById('drawer-close').textContent = t('close');
    document.getElementById('global-search').placeholder = t('searchPlaceholder');

    const autoBtn = document.getElementById('btn-auto');
    autoBtn.textContent = state.autoRefresh ? t('autoOn') : t('autoOff');
    autoBtn.setAttribute('aria-pressed', String(state.autoRefresh));
    autoBtn.classList.toggle('btn-active', state.autoRefresh);
    autoBtn.classList.toggle('hidden', state.mode !== 'live');

    document.querySelectorAll('.nav-item').forEach((btn) => {
      btn.textContent = t(btn.dataset.view);
      btn.classList.toggle('active', btn.dataset.view === state.view);
    });

    const badge = document.getElementById('mode-badge');
    if (state.mode === 'live') {
      badge.textContent = t('liveMode');
      badge.className = 'badge badge-ok';
      document.getElementById('btn-folder').classList.add('hidden');
    } else {
      badge.textContent = state.dirHandle ? t('folderMode') : t('waitingFolder');
      badge.className = state.dirHandle ? 'badge badge-accent' : 'badge badge-warn';
      document.getElementById('btn-folder').classList.remove('hidden');
    }
  }

  function showBanner(msg) {
    const el = document.getElementById('banner');
    if (!msg) { el.classList.add('hidden'); el.textContent = ''; return; }
    el.textContent = msg;
    el.classList.remove('hidden');
  }

  async function readHandleFile(rootHandle, relPath) {
    try {
      const parts = relPath.split('/').filter(Boolean);
      let curr = rootHandle;
      for (let i = 0; i < parts.length - 1; i++) curr = await curr.getDirectoryHandle(parts[i]);
      const fh = await curr.getFileHandle(parts[parts.length - 1]);
      return await (await fh.getFile()).text();
    } catch { return null; }
  }

  async function scanHandleTree(rootHandle, relDir, depth = 0) {
    if (depth > 5) return [];
    let dir = rootHandle;
    try {
      for (const part of relDir.split('/').filter(Boolean)) dir = await dir.getDirectoryHandle(part);
    } catch { return []; }
    const out = [];
    for await (const [name, handle] of dir.entries()) {
      if (name.startsWith('.') || name === 'node_modules' || name === 'portal') continue;
      const childPath = `${relDir}/${name}`;
      if (handle.kind === 'directory') {
        const children = await scanHandleTree(rootHandle, childPath, depth + 1);
        if (children.length > 0) out.push({ type: 'dir', name, path: childPath, children });
      } else if (name.endsWith('.md')) {
        out.push({ type: 'file', name, path: childPath });
      }
    }
    return out.sort((a, b) => a.name.localeCompare(b.name));
  }

  function computeLocalHealth(files, trees) {
    const tier0Text = files.agents || null;
    const tier0Lines = tier0Text ? tier0Text.split(/\r?\n/).length : 0;
    const tier0Tokens = tier0Text ? Math.round(tier0Text.length / 4) : 0;
    const activeLines = files.activeContext ? files.activeContext.split(/\r?\n/).length : 0;
    const checks = [
      { label: 'Tier-0 Rules (≤ 90 lines)', ok: Boolean(tier0Text) && tier0Lines <= 90, detail: tier0Text ? `${tier0Lines} lines / ~${tier0Tokens} tok` : 'Missing' },
      { label: 'Living SRS.md', ok: Boolean(files.srs), detail: files.srs ? 'Present' : 'Missing' },
      { label: 'Lean MASTER_PLAN.md', ok: Boolean(files.masterPlan), detail: files.masterPlan ? `${files.masterPlan.split(/\r?\n/).length} lines` : 'Missing' },
      { label: 'ACTIVE_CONTEXT.md (≤ 30 lines)', ok: Boolean(files.activeContext) && activeLines <= 30, detail: files.activeContext ? `${activeLines} lines` : 'Missing' },
      { label: 'TECH_DEBT_REGISTER.md', ok: Boolean(files.techDebt), detail: files.techDebt ? 'Present' : 'Missing' },
      { label: 'COMPLETED_WORK.md', ok: Boolean(files.completedWork), detail: files.completedWork ? 'Present' : 'Missing' },
      { label: 'Learning Memory (docs/memory/)', ok: trees.memoryTree.length > 0, detail: `${trees.memoryTree.length} items` },
    ];
    const passed = checks.filter((c) => c.ok).length;
    const score = Math.round((passed / checks.length) * 100);
    const grade = score >= 95 ? 'A+' : score >= 88 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : 'F';
    return { score, grade, passed, total: checks.length, tier0Name: 'AGENTS.md', tier0Lines, tier0Tokens, srsVersion: null, checks };
  }

  async function loadFromFolderHandle() {
    if (!state.dirHandle) { showBanner(t('folderPrompt')); return; }
    showBanner('');
    const h = state.dirHandle;
    const [masterPlan, activeContext, techDebt, completedWork, srs, agents, readme] = await Promise.all([
      readHandleFile(h, 'project_management/MASTER_PLAN.md'),
      readHandleFile(h, 'project_management/ACTIVE_CONTEXT.md'),
      readHandleFile(h, 'project_management/TECH_DEBT_REGISTER.md'),
      readHandleFile(h, 'project_management/COMPLETED_WORK.md'),
      readHandleFile(h, 'SRS.md'),
      readHandleFile(h, 'AGENTS.md'),
      readHandleFile(h, 'README.md'),
    ]);
    const [activePlans, archivedPlans, memoryTree, specsTree, adrsTree] = await Promise.all([
      scanHandleTree(h, 'project_management/plans'),
      scanHandleTree(h, 'project_management/archive'),
      scanHandleTree(h, 'docs/memory'),
      scanHandleTree(h, 'docs/specs'),
      scanHandleTree(h, 'docs/adrs'),
    ]);
    const files = { masterPlan, activeContext, techDebt, completedWork, srs, agents, readme };
    const trees = { activePlans, archivedPlans, memoryTree, specsTree, adrsTree };
    state.snapshot = {
      projectName: h.name,
      generatedAt: new Date().toISOString(),
      mode: 'folder',
      git: { available: false, branch: null, dirtyCount: 0, commits: [] },
      health: computeLocalHealth(files, trees),
      files,
      trees,
    };
    render();
  }

  async function loadData() {
    if (state.mode === 'folder') return loadFromFolderHandle();
    try {
      const res = await fetch('/api/project', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      state.snapshot = await res.json();
      showBanner('');
      render();
    } catch {
      state.mode = 'folder';
      applyChrome();
      showBanner(t('folderPrompt'));
    }
  }

  async function openMarkdownFile(relPath) {
    const clean = relPath.replace(/\\/g, '/').replace(/^\.\//, '');
    let content = null;
    if (state.mode === 'live') {
      const res = await fetch(`/api/file?path=${encodeURIComponent(clean)}`, { cache: 'no-store' });
      if (res.ok) content = (await res.json()).content;
    } else if (state.dirHandle) {
      content = await readHandleFile(state.dirHandle, clean);
    }
    if (content === null) return;
    state.activeDocPath = clean;
    document.getElementById('drawer-title').textContent = clean.split('/').pop();
    document.getElementById('drawer-path').textContent = clean;
    document.getElementById('drawer-body').innerHTML = P.renderMarkdownToHtml(content);
    document.getElementById('reader-drawer').classList.remove('hidden');
  }

  function resolveRelative(baseFile, target) {
    if (!baseFile || !target.startsWith('.')) return target;
    const baseParts = baseFile.split('/').slice(0, -1);
    for (const seg of target.split('/')) {
      if (seg === '.' || !seg) continue;
      if (seg === '..') baseParts.pop();
      else baseParts.push(seg);
    }
    return baseParts.join('/');
  }

  function filterRows(rows) {
    const q = state.searchQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.some((cell) => P.stripMarkdown(cell).toLowerCase().includes(q)));
  }

  function renderTreeHtml(nodes, isRoot = true) {
    const q = state.searchQuery.trim().toLowerCase();
    const filtered = (nodes || []).reduce((acc, node) => {
      if (node.type === 'dir') {
        const sub = renderTreeHtml(node.children, false);
        if (!q || node.name.toLowerCase().includes(q) || sub.includes('data-open-md')) {
          acc.push(`<li class="tree-dir">${P.escapeHtml(node.name)}/${sub}</li>`);
        }
      } else if (!q || node.name.toLowerCase().includes(q) || node.path.toLowerCase().includes(q)) {
        acc.push(`<li><button class="tree-link" type="button" data-open-md="${P.escapeHtml(node.path)}">${P.escapeHtml(node.name)}</button></li>`);
      }
      return acc;
    }, []);
    if (filtered.length === 0) return isRoot ? `<div class="empty-state">${P.escapeHtml(t('noData'))}</div>` : '';
    return `<ul class="tree-group${isRoot ? ' tree-root' : ''}">${filtered.join('')}</ul>`;
  }

  function renderTableOrFallback(markdown, baseFile, extraRowFilter) {
    const parsed = P.parseMarkdownTable(markdown);
    if (parsed.rows.length === 0) {
      return markdown ? `<div class="md-content">${P.renderMarkdownToHtml(markdown)}</div>` : `<div class="empty-state">${P.escapeHtml(t('noData'))}</div>`;
    }
    let rows = filterRows(parsed.rows);
    if (extraRowFilter) rows = rows.filter(extraRowFilter);
    if (rows.length === 0) return `<div class="empty-state">${P.escapeHtml(t('noData'))}</div>`;

    let html = '<table class="data-table"><thead><tr>';
    parsed.headers.forEach((h) => { html += `<th>${P.escapeHtml(P.stripMarkdown(h))}</th>`; });
    html += '</tr></thead><tbody>';
    for (const row of rows) {
      html += '<tr>';
      row.forEach((cell) => {
        const link = P.extractMarkdownLink(cell);
        if (link && link.target.endsWith('.md')) {
          const full = resolveRelative(baseFile, link.target);
          html += `<td><button class="tree-link" type="button" data-open-md="${P.escapeHtml(full)}">${P.escapeHtml(link.label)}</button></td>`;
        } else {
          html += `<td>${P.escapeHtml(P.stripMarkdown(cell))}</td>`;
        }
      });
      html += '</tr>';
    }
    return html + '</tbody></table>';
  }

  function getDebtStats(debtMd) {
    const rows = P.parseMarkdownTable(debtMd).rows;
    const stats = { high: 0, medium: 0, low: 0, closed: 0, open: 0 };
    for (const r of rows) {
      const status = (r[r.length - 1] || '').toLowerCase();
      const sev = (r[1] || r[2] || '').toLowerCase();
      if (status.includes('closed')) { stats.closed++; continue; }
      stats.open++;
      if (sev.includes('high') || sev.includes('crit')) stats.high++;
      else if (sev.includes('med')) stats.medium++;
      else stats.low++;
    }
    return stats;
  }

  function commitBadgeClass(type) {
    if (type === 'feat') return 'badge badge-ok';
    if (type === 'fix') return 'badge badge-danger';
    if (type === 'docs') return 'badge badge-accent';
    if (type === 'refactor') return 'badge badge-warn';
    return 'badge';
  }

  function renderOverview(snap) {
    const master = P.parseMarkdownTable(snap.files.masterPlan);
    const completed = P.parseMarkdownTable(snap.files.completedWork);
    const debtStats = getDebtStats(snap.files.techDebt);
    const kv = P.parseKeyValues(snap.files.activeContext);
    const h = snap.health;

    const kpis = `
      <div class="kpi-strip">
        <div class="kpi-box"><div class="kpi-value">${master.rows.length}</div><div class="kpi-sub">${P.escapeHtml(t('activePlansCount'))}</div></div>
        <div class="kpi-box"><div class="kpi-value">${snap.trees.archivedPlans.length}</div><div class="kpi-sub">${P.escapeHtml(t('archivedCount'))}</div></div>
        <div class="kpi-box"><div class="kpi-value">${debtStats.open}</div><div class="kpi-sub">${P.escapeHtml(t('openDebtCount'))}</div></div>
        <div class="kpi-box"><div class="kpi-value">${completed.rows.length}</div><div class="kpi-sub">${P.escapeHtml(t('completedCount'))}</div></div>
      </div>`;

    const checksHtml = `<ul class="check-list">${h.checks.map((c) => `
      <li>
        <span><span class="${c.ok ? 'check-ok' : 'check-fail'}">${c.ok ? 'PASS' : 'MISS'}</span> ${P.escapeHtml(c.label)}</span>
        <span class="check-detail">${P.escapeHtml(c.detail)}</span>
      </li>`).join('')}</ul>`;

    const debtChart = C.renderStackedBar([
      { label: t('high'), count: debtStats.high, color: 'var(--danger)' },
      { label: t('medium'), count: debtStats.medium, color: 'var(--warn)' },
      { label: t('low'), count: debtStats.low, color: 'var(--accent)' },
      { label: t('filterClosed'), count: debtStats.closed, color: 'var(--ok)' },
    ], t('noData'));

    const commits = (snap.git && snap.git.commits) || [];
    const gitHtml = commits.length > 0
      ? `${C.renderCommitDistribution(commits, t('noGit'))}
         <ul class="commit-list">${commits.slice(0, 6).map((c) => `
           <li class="commit-item">
             <code>${P.escapeHtml(c.hash)}</code>
             <span class="${commitBadgeClass(c.type)}">${P.escapeHtml(c.type)}</span>
             <span class="commit-subject" title="${P.escapeHtml(c.subject)}">${P.escapeHtml(c.subject)}</span>
             <span class="commit-date">${P.escapeHtml(c.date)}</span>
           </li>`).join('')}</ul>`
      : `<div class="muted-note">${P.escapeHtml(t('noGit'))}</div>`;

    const activeCtxHtml = kv.length > 0
      ? `<dl class="kv-list">${kv.map((x) => `<dt>${P.escapeHtml(x.key)}</dt><dd>${P.escapeHtml(P.stripMarkdown(x.value))}</dd>`).join('')}</dl>`
      : `<div class="empty-state">${P.escapeHtml(t('noData'))}</div>`;

    return `
      <div class="section-head"><h2>${P.escapeHtml(t('overview'))}</h2></div>
      ${kpis}
      <div class="bento-grid">
        <div class="panel">
          <h3>${P.escapeHtml(t('healthTitle'))}</h3>
          <div class="health-layout">${C.renderHealthRing(h.score, h.grade)}${checksHtml}</div>
        </div>
        <div class="panel">
          <h3>${P.escapeHtml(t('gitTitle'))}</h3>
          ${gitHtml}
        </div>
      </div>
      <div class="bento-grid">
        <div class="panel"><h3>${P.escapeHtml(t('sessionHandover'))}</h3>${activeCtxHtml}</div>
        <div class="panel"><h3>${P.escapeHtml(t('debtBreakdown'))}</h3>${debtChart}</div>
      </div>
      <div class="panel">
        <h3>${P.escapeHtml(t('activeInitiatives'))}</h3>
        ${master.rows.length ? renderTableOrFallback(snap.files.masterPlan, 'project_management/MASTER_PLAN.md') : `<div class="empty-state">${P.escapeHtml(t('noActive'))}</div>`}
      </div>`;
  }

  function render() {
    applyChrome();
    const root = document.getElementById('view-root');
    const snap = state.snapshot;
    if (!snap) {
      root.innerHTML = `<div class="empty-state">${P.escapeHtml(t('folderPrompt'))}</div>`;
      return;
    }

    document.getElementById('project-title').textContent = snap.projectName;
    document.getElementById('sync-meta').textContent = `${t('updatedAt')} ${new Date(snap.generatedAt).toLocaleTimeString()}`;

    const gitBadge = document.getElementById('git-badge');
    if (snap.git && snap.git.available) {
      gitBadge.textContent = `${snap.git.branch} (${snap.git.dirtyCount === 0 ? t('cleanTree') : `${snap.git.dirtyCount} ${t('dirtyTree')}`})`;
      gitBadge.className = snap.git.dirtyCount === 0 ? 'badge badge-ok' : 'badge badge-warn';
      gitBadge.classList.remove('hidden');
    } else {
      gitBadge.classList.add('hidden');
    }

    const verBadge = document.getElementById('version-badge');
    if (snap.health && snap.health.srsVersion) {
      verBadge.textContent = `SRS v${snap.health.srsVersion.replace(/^v/i, '')}`;
      verBadge.classList.remove('hidden');
    } else {
      verBadge.classList.add('hidden');
    }

    const meter = document.getElementById('tier0-meter');
    if (snap.health && snap.health.tier0Lines > 0) {
      const pct = Math.min(100, Math.round((snap.health.tier0Lines / 90) * 100));
      meter.innerHTML = `<div class="meter-head"><span>${P.escapeHtml(t('tier0Budget'))}</span><span>${snap.health.tier0Lines}/90</span></div>
        <div class="meter-track"><div class="meter-fill" style="width:${pct}%"></div></div>`;
      meter.classList.remove('hidden');
    } else {
      meter.classList.add('hidden');
    }

    if (state.view === 'overview') {
      root.innerHTML = renderOverview(snap);
    } else if (state.view === 'plans') {
      root.innerHTML = `
        <div class="section-head"><h2>${P.escapeHtml(t('plans'))}</h2></div>
        <div class="panel"><h3>${P.escapeHtml(t('activeTreeTitle'))}</h3>${renderTreeHtml(snap.trees.activePlans)}</div>
        <div class="panel"><h3>${P.escapeHtml(t('archiveTreeTitle'))}</h3>${renderTreeHtml(snap.trees.archivedPlans)}</div>`;
    } else if (state.view === 'debt') {
      const filterFn = (row) => {
        const isClosed = /closed/i.test(row[row.length - 1] || '');
        if (state.debtFilter === 'open') return !isClosed;
        if (state.debtFilter === 'closed') return isClosed;
        return true;
      };
      root.innerHTML = `
        <div class="section-head">
          <h2>${P.escapeHtml(t('debt'))}</h2>
          <div class="filter-pills">
            <button class="pill-btn ${state.debtFilter === 'all' ? 'active' : ''}" data-debt-filter="all" type="button">${P.escapeHtml(t('filterAll'))}</button>
            <button class="pill-btn ${state.debtFilter === 'open' ? 'active' : ''}" data-debt-filter="open" type="button">${P.escapeHtml(t('filterOpen'))}</button>
            <button class="pill-btn ${state.debtFilter === 'closed' ? 'active' : ''}" data-debt-filter="closed" type="button">${P.escapeHtml(t('filterClosed'))}</button>
          </div>
        </div>
        <div class="panel">${renderTableOrFallback(snap.files.techDebt, 'project_management/TECH_DEBT_REGISTER.md', filterFn)}</div>`;
    } else if (state.view === 'completed') {
      root.innerHTML = `
        <div class="section-head"><h2>${P.escapeHtml(t('completed'))}</h2></div>
        <div class="panel">${renderTableOrFallback(snap.files.completedWork, 'project_management/COMPLETED_WORK.md')}</div>`;
    } else if (state.view === 'docs') {
      const coreLinks = ['SRS.md', 'AGENTS.md', 'README.md', 'project_management/MASTER_PLAN.md', 'project_management/ACTIVE_CONTEXT.md']
        .map((p) => `<li><button class="tree-link" type="button" data-open-md="${p}">${p}</button></li>`).join('');
      root.innerHTML = `
        <div class="section-head"><h2>${P.escapeHtml(t('docs'))}</h2></div>
        <div class="panel"><h3>${P.escapeHtml(t('coreDocsTitle'))}</h3><ul class="tree-group tree-root">${coreLinks}</ul></div>
        <div class="panel"><h3>${P.escapeHtml(t('memoryTreeTitle'))}</h3>${renderTreeHtml(snap.trees.memoryTree)}</div>
        <div class="panel"><h3>${P.escapeHtml(t('specsTreeTitle'))}</h3>${renderTreeHtml([...snap.trees.specsTree, ...snap.trees.adrsTree])}</div>`;
    }
  }

  document.addEventListener('click', (e) => {
    const mdBtn = e.target.closest('[data-open-md]');
    if (mdBtn) {
      const target = mdBtn.getAttribute('data-open-md');
      const resolved = state.activeDocPath && target.startsWith('.') ? resolveRelative(state.activeDocPath, target) : target;
      openMarkdownFile(resolved);
      return;
    }
    const debtBtn = e.target.closest('[data-debt-filter]');
    if (debtBtn) {
      state.debtFilter = debtBtn.getAttribute('data-debt-filter');
      render();
    }
  });

  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => { state.view = btn.dataset.view; render(); });
  });

  document.getElementById('global-search').addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    render();
  });

  document.getElementById('btn-auto').addEventListener('click', () => {
    state.autoRefresh = !state.autoRefresh;
    if (state.autoTimer) { clearInterval(state.autoTimer); state.autoTimer = null; }
    if (state.autoRefresh) state.autoTimer = setInterval(() => loadData(), 5000);
    applyChrome();
  });

  document.getElementById('btn-lang').addEventListener('click', () => {
    state.lang = state.lang === 'en' ? 'ar' : 'en';
    localStorage.setItem('portal_lang', state.lang);
    render();
  });

  document.getElementById('btn-theme').addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('portal_theme', state.theme);
    applyChrome();
  });

  document.getElementById('btn-refresh').addEventListener('click', () => loadData());

  document.getElementById('btn-folder').addEventListener('click', async () => {
    if (typeof window.showDirectoryPicker !== 'function') { showBanner(t('unsupportedFs')); return; }
    try {
      state.dirHandle = await window.showDirectoryPicker({ mode: 'read' });
      await loadFromFolderHandle();
    } catch {}
  });

  const closeDrawer = () => {
    document.getElementById('reader-drawer').classList.add('hidden');
    state.activeDocPath = null;
  };
  document.getElementById('drawer-close').addEventListener('click', closeDrawer);
  document.getElementById('drawer-backdrop').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

  applyChrome();
  loadData();
})();
