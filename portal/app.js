(function () {
  'use strict';

  const P = window.PortalParser;
  const C = window.PortalCharts;
  const V = window.PortalViews;
  const I18N = window.PortalI18N;

  const state = {
    lang: localStorage.getItem('portal_lang') || 'en',
    theme: localStorage.getItem('portal_theme') || 'light',
    view: 'radar',
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
      return await (await (await curr.getFileHandle(parts[parts.length - 1])).getFile()).text();
    } catch { return null; }
  }

  async function scanHandleTree(rootHandle, relDir, depth = 0) {
    if (depth > 4) return [];
    let dir = rootHandle;
    try {
      for (const part of relDir.split('/').filter(Boolean)) dir = await dir.getDirectoryHandle(part);
    } catch { return []; }
    const out = [];
    for await (const [name, handle] of dir.entries()) {
      if (name.startsWith('.') || name === 'node_modules' || name === 'dist' || name === 'build') continue;
      const childPath = relDir ? `${relDir}/${name}` : name;
      if (handle.kind === 'directory') {
        const children = await scanHandleTree(rootHandle, childPath, depth + 1);
        if (children.length > 0) out.push({ type: 'dir', name, path: childPath, children });
      } else {
        out.push({ type: 'file', name, path: childPath, lines: 0 });
      }
    }
    return out.sort((a, b) => a.name.localeCompare(b.name));
  }

  async function loadFromFolderHandle() {
    if (!state.dirHandle) { showBanner(t('folderPrompt')); return; }
    showBanner('');
    const h = state.dirHandle;
    const [masterPlan, activeContext, techDebt, completedWork, srs, agents, readme, pmTree, memoryTree, archTree] = await Promise.all([
      readHandleFile(h, 'project_management/MASTER_PLAN.md'),
      readHandleFile(h, 'project_management/ACTIVE_CONTEXT.md'),
      readHandleFile(h, 'project_management/TECH_DEBT_REGISTER.md'),
      readHandleFile(h, 'project_management/COMPLETED_WORK.md'),
      readHandleFile(h, 'SRS.md'),
      readHandleFile(h, 'AGENTS.md'),
      readHandleFile(h, 'README.md'),
      scanHandleTree(h, 'project_management'),
      scanHandleTree(h, 'docs/memory'),
      scanHandleTree(h, ''),
    ]);
    state.snapshot = {
      projectName: h.name,
      generatedAt: new Date().toISOString(),
      mode: 'folder',
      git: { available: false, changes: [], commits: [] },
      radar: { totalCodeFiles: 0, godFiles: [], largestFiles: [], shortcuts: [], ratio: { prodLines: 0, testLines: 0, docLines: 0 } },
      checklist: { done: 0, total: 0, pct: 0, items: [] },
      scripts: [],
      tier0Lines: agents ? agents.split(/\r?\n/).length : 0,
      files: { masterPlan, activeContext, techDebt, completedWork, srs, agents, readme },
      trees: {
        adminTree: [{ type: 'dir', name: 'project_management', path: 'project_management', children: pmTree }],
        archTree,
        memoryTree,
        specsTree: [],
        adrsTree: [],
      },
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

  function showDrawer(title, subtitle, htmlContent) {
    document.getElementById('drawer-title').textContent = title;
    document.getElementById('drawer-path').textContent = subtitle;
    document.getElementById('drawer-body').innerHTML = htmlContent;
    document.getElementById('reader-drawer').classList.remove('hidden');
  }

  async function openFile(relPath) {
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
    const html = clean.endsWith('.md')
      ? P.renderMarkdownToHtml(content)
      : `<pre dir="ltr"><code>${P.escapeHtml(content)}</code></pre>`;
    showDrawer(clean.split('/').pop(), clean, html);
  }

  async function openDiff(relPath) {
    const res = await fetch(`/api/diff?path=${encodeURIComponent(relPath)}`, { cache: 'no-store' });
    if (!res.ok) return;
    const payload = await res.json();
    showDrawer(`Diff: ${relPath.split('/').pop()}`, relPath, C.renderColoredDiff(payload.diff));
  }

  async function openCommit(hash) {
    const res = await fetch(`/api/commit?hash=${encodeURIComponent(hash)}`, { cache: 'no-store' });
    if (!res.ok) return;
    const payload = await res.json();
    showDrawer(`Commit ${hash}`, hash, C.renderColoredDiff(payload.diff));
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
      const syncTag = snap.git.ahead === 0 && snap.git.behind === 0 ? 'synced' : `↑${snap.git.ahead}/↓${snap.git.behind}`;
      gitBadge.textContent = `${snap.git.branch} · ${syncTag}`;
      gitBadge.className = snap.git.ahead === 0 && snap.git.behind === 0 ? 'badge badge-ok' : 'badge badge-warn';
      gitBadge.classList.remove('hidden');
    } else {
      gitBadge.classList.add('hidden');
    }

    const meter = document.getElementById('tier0-meter');
    if (snap.tier0Lines > 0) {
      const pct = Math.min(100, Math.round((snap.tier0Lines / 90) * 100));
      meter.innerHTML = `<div class="meter-head"><span>${P.escapeHtml(t('tier0Budget'))}</span><span>${snap.tier0Lines}/90</span></div>
        <div class="meter-track"><div class="meter-fill" style="width:${pct}%"></div></div>`;
      meter.classList.remove('hidden');
    } else {
      meter.classList.add('hidden');
    }

    if (state.view === 'radar') root.innerHTML = V.renderRadar(snap, state, t);
    else if (state.view === 'git') root.innerHTML = V.renderGit(snap, state, t);
    else if (state.view === 'trees') root.innerHTML = V.renderTrees(snap, state, t);
    else if (state.view === 'debt') root.innerHTML = V.renderDebtArchive(snap, state, t);
    else if (state.view === 'memory') root.innerHTML = V.renderMemoryDocs(snap, state, t);
  }

  document.addEventListener('click', (e) => {
    const fileBtn = e.target.closest('[data-open-file], [data-open-md]');
    if (fileBtn) {
      const raw = fileBtn.getAttribute('data-open-file') || fileBtn.getAttribute('data-open-md');
      const target = state.activeDocPath && raw.startsWith('.') ? V.resolveRelative(state.activeDocPath, raw) : raw;
      openFile(target);
      return;
    }
    const diffBtn = e.target.closest('[data-open-diff]');
    if (diffBtn) { openDiff(diffBtn.getAttribute('data-open-diff')); return; }

    const commitBtn = e.target.closest('[data-open-commit]');
    if (commitBtn) { openCommit(commitBtn.getAttribute('data-open-commit')); return; }

    const debtBtn = e.target.closest('[data-debt-filter]');
    if (debtBtn) { state.debtFilter = debtBtn.getAttribute('data-debt-filter'); render(); return; }

    const copyBtn = e.target.closest('[data-copy-cmd]');
    if (copyBtn && navigator.clipboard) {
      navigator.clipboard.writeText(copyBtn.getAttribute('data-copy-cmd')).then(() => {
        copyBtn.textContent = t('copied');
        setTimeout(() => { copyBtn.textContent = t('copyCmd'); }, 1200);
      });
    }
  });

  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => { state.view = btn.dataset.view; render(); });
  });

  document.getElementById('global-search').addEventListener('input', (e) => { state.searchQuery = e.target.value; render(); });

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
    } catch (err) {
      if (err && err.name !== 'AbortError') showBanner(t('unsupportedFs'));
    }
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
