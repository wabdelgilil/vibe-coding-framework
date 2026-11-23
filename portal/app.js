(function () {
  'use strict';

  const P = window.PortalParser;
  const I18N = {
    en: {
      overview: 'Overview',
      plans: 'Plans Tree',
      debt: 'Tech Debt',
      completed: 'Completed Archive',
      docs: 'Specs & Memory',
      refresh: 'Refresh',
      chooseFolder: 'Select Project Folder',
      dark: 'Dark',
      light: 'Light',
      close: 'Close',
      liveMode: 'Live Local Server',
      folderMode: 'Direct Folder Mode',
      waitingFolder: 'Select Folder',
      activeInitiatives: 'Active Initiatives',
      activePlansCount: 'Active Plans',
      archivedCount: 'Archived Plans',
      openDebtCount: 'Open Tech Debt',
      completedCount: 'Closed Milestones',
      sessionHandover: 'Live Session Context (ACTIVE_CONTEXT.md)',
      noActive: 'No active initiatives in MASTER_PLAN.md.',
      noData: 'No entries found.',
      activeTreeTitle: 'Active Plan Trees (project_management/plans/)',
      archiveTreeTitle: 'Archived Plan Trees (project_management/archive/)',
      coreDocsTitle: 'Core Governance & Specification Files',
      memoryTreeTitle: 'Learned Preferences (docs/memory/)',
      specsTreeTitle: 'Feature Specs & ADRs (docs/)',
      folderPrompt: 'Running in direct browser mode (no local server). Click "Select Project Folder" to load your project root.',
      unsupportedFs: 'This browser does not support File System Access API. Run start_portal.bat (or start_portal.sh) with Node or Python, or use Chrome/Edge.',
      updatedAt: 'Updated:',
    },
    ar: {
      overview: 'نظرة عامة',
      plans: 'شجرة الخطط',
      debt: 'الديون التقنية',
      completed: 'أرشيف المنجزات',
      docs: 'المواصفات والذاكرة',
      refresh: 'تحديث',
      chooseFolder: 'اختر مجلد المشروع',
      dark: 'داكن',
      light: 'فاتح',
      close: 'إغلاق',
      liveMode: 'خادم محلي حي',
      folderMode: 'وضع المجلد المباشر',
      waitingFolder: 'اختر مجلداً',
      activeInitiatives: 'المبادرات النشطة',
      activePlansCount: 'الخطط النشطة',
      archivedCount: 'الخطط المؤرشفة',
      openDebtCount: 'ديون تقنية مفتوحة',
      completedCount: 'إنجازات مغلقة',
      sessionHandover: 'سياق الجلسة الحي (ACTIVE_CONTEXT.md)',
      noActive: 'لا توجد مبادرات نشطة في MASTER_PLAN.md.',
      noData: 'لا توجد عناصر مسجلة.',
      activeTreeTitle: 'أشجار الخطط النشطة (project_management/plans/)',
      archiveTreeTitle: 'أشجار الخطط المؤرشفة (project_management/archive/)',
      coreDocsTitle: 'ملفات الحوكمة والمواصفات الأساسية',
      memoryTreeTitle: 'ذاكرة التفضيلات المتعلّمة (docs/memory/)',
      specsTreeTitle: 'مواصفات الميزات وسجل القرارات (docs/)',
      folderPrompt: 'تعمل الآن بوضع المتصفح المباشر بدون خادم محلي. اضغط "اختر مجلد المشروع" لتحميل جذر مشروعك.',
      unsupportedFs: 'هذا المتصفح لا يدعم قراءة المجلدات مباشرة. شغّل start_portal.bat (أو start_portal.sh) عبر Node أو Python، أو استخدم Chrome/Edge.',
      updatedAt: 'آخر تحديث:',
    },
  };

  const state = {
    lang: localStorage.getItem('portal_lang') || 'en',
    theme: localStorage.getItem('portal_theme') || 'light',
    view: 'overview',
    mode: window.location.protocol === 'file:' ? 'folder' : 'live',
    dirHandle: null,
    localFiles: new Map(),
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
      for (let i = 0; i < parts.length - 1; i++) {
        curr = await curr.getDirectoryHandle(parts[i]);
      }
      const fh = await curr.getFileHandle(parts[parts.length - 1]);
      const file = await fh.getFile();
      return await file.text();
    } catch {
      return null;
    }
  }

  async function scanHandleTree(rootHandle, relDir, depth = 0) {
    if (depth > 5) return [];
    let dir = rootHandle;
    try {
      for (const part of relDir.split('/').filter(Boolean)) {
        dir = await dir.getDirectoryHandle(part);
      }
    } catch {
      return [];
    }
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

  async function loadFromFolderHandle() {
    if (!state.dirHandle) {
      showBanner(t('folderPrompt'));
      return;
    }
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
    state.snapshot = {
      projectName: h.name,
      generatedAt: new Date().toISOString(),
      mode: 'folder',
      files: { masterPlan, activeContext, techDebt, completedWork, srs, agents, readme },
      trees: { activePlans, archivedPlans, memoryTree, specsTree, adrsTree },
    };
    render();
  }

  async function loadData() {
    if (state.mode === 'folder') {
      return loadFromFolderHandle();
    }
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
      if (res.ok) {
        const payload = await res.json();
        content = payload.content;
      }
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

  function renderTreeHtml(nodes, isRoot = true) {
    if (!nodes || nodes.length === 0) return `<div class="empty-state">${P.escapeHtml(t('noData'))}</div>`;
    let html = `<ul class="tree-group${isRoot ? ' tree-root' : ''}">`;
    for (const node of nodes) {
      if (node.type === 'dir') {
        html += `<li class="tree-dir">${P.escapeHtml(node.name)}/${renderTreeHtml(node.children, false)}</li>`;
      } else {
        html += `<li><button class="tree-link" type="button" data-open-md="${P.escapeHtml(node.path)}">${P.escapeHtml(node.name)}</button></li>`;
      }
    }
    html += '</ul>';
    return html;
  }

  function renderTableOrFallback(markdown, baseFile) {
    const parsed = P.parseMarkdownTable(markdown);
    if (parsed.rows.length === 0) {
      return markdown ? `<div class="md-content">${P.renderMarkdownToHtml(markdown)}</div>` : `<div class="empty-state">${P.escapeHtml(t('noData'))}</div>`;
    }
    let html = '<table class="data-table"><thead><tr>';
    parsed.headers.forEach((h) => { html += `<th>${P.escapeHtml(P.stripMarkdown(h))}</th>`; });
    html += '</tr></thead><tbody>';
    for (const row of parsed.rows) {
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
    html += '</tbody></table>';
    return html;
  }

  function renderOverview(snap) {
    const master = P.parseMarkdownTable(snap.files.masterPlan);
    const debt = P.parseMarkdownTable(snap.files.techDebt);
    const completed = P.parseMarkdownTable(snap.files.completedWork);
    const openDebt = debt.rows.filter((r) => !/closed/i.test(r[r.length - 1] || '')).length;
    const kv = P.parseKeyValues(snap.files.activeContext);

    const kpis = `
      <div class="kpi-strip">
        <div class="kpi-box"><div class="kpi-value">${master.rows.length}</div><div class="kpi-label">${P.escapeHtml(t('activePlansCount'))}</div></div>
        <div class="kpi-box"><div class="kpi-value">${snap.trees.archivedPlans.length}</div><div class="kpi-label">${P.escapeHtml(t('archivedCount'))}</div></div>
        <div class="kpi-box"><div class="kpi-value">${openDebt}</div><div class="kpi-label">${P.escapeHtml(t('openDebtCount'))}</div></div>
        <div class="kpi-box"><div class="kpi-value">${completed.rows.length}</div><div class="kpi-label">${P.escapeHtml(t('completedCount'))}</div></div>
      </div>`;

    const activeCtxHtml = kv.length > 0
      ? `<dl class="kv-list">${kv.map((x) => `<dt>${P.escapeHtml(x.key)}</dt><dd>${P.escapeHtml(P.stripMarkdown(x.value))}</dd>`).join('')}</dl>`
      : `<div class="empty-state">${P.escapeHtml(t('noData'))}</div>`;

    return `
      <div class="section-head"><h2>${P.escapeHtml(t('overview'))}</h2></div>
      ${kpis}
      <div class="panel"><h3>${P.escapeHtml(t('sessionHandover'))}</h3>${activeCtxHtml}</div>
      <div class="panel"><h3>${P.escapeHtml(t('activeInitiatives'))}</h3>${master.rows.length ? renderTableOrFallback(snap.files.masterPlan, 'project_management/MASTER_PLAN.md') : `<div class="empty-state">${P.escapeHtml(t('noActive'))}</div>`}</div>`;
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

    if (state.view === 'overview') {
      root.innerHTML = renderOverview(snap);
    } else if (state.view === 'plans') {
      root.innerHTML = `
        <div class="section-head"><h2>${P.escapeHtml(t('plans'))}</h2></div>
        <div class="panel"><h3>${P.escapeHtml(t('activeTreeTitle'))}</h3>${renderTreeHtml(snap.trees.activePlans)}</div>
        <div class="panel"><h3>${P.escapeHtml(t('archiveTreeTitle'))}</h3>${renderTreeHtml(snap.trees.archivedPlans)}</div>`;
    } else if (state.view === 'debt') {
      root.innerHTML = `
        <div class="section-head"><h2>${P.escapeHtml(t('debt'))}</h2></div>
        <div class="panel">${renderTableOrFallback(snap.files.techDebt, 'project_management/TECH_DEBT_REGISTER.md')}</div>`;
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
    }
  });

  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.view = btn.dataset.view;
      render();
    });
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
    if (typeof window.showDirectoryPicker !== 'function') {
      showBanner(t('unsupportedFs'));
      return;
    }
    try {
      state.dirHandle = await window.showDirectoryPicker({ mode: 'read' });
      await loadFromFolderHandle();
    } catch { /* user cancelled picker */ }
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
