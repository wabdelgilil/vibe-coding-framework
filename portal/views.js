(function (global) {
  'use strict';

  const P = window.PortalParser;
  const C = window.PortalCharts;

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

  function commitBadgeClass(type) {
    if (type === 'feat') return 'badge badge-ok';
    if (type === 'fix') return 'badge badge-danger';
    if (type === 'docs') return 'badge badge-accent';
    if (type === 'refactor') return 'badge badge-warn';
    return 'badge';
  }

  function countFiles(nodes) {
    let n = 0;
    for (const item of nodes || []) {
      if (item.type === 'file') n++;
      else if (item.children) n += countFiles(item.children);
    }
    return n;
  }

  function renderTree(nodes, q, linesUnit, openDirs, treeId, isRoot = true) {
    const query = (q || '').trim().toLowerCase();
    const items = (nodes || []).reduce((acc, node) => {
      if (node.type === 'dir') {
        const sub = renderTree(node.children, query, linesUnit, openDirs, treeId, false);
        if (!query || node.name.toLowerCase().includes(query) || sub.includes('data-open-file')) {
          const dirKey = `${treeId}:${node.path}`;
          const isOpen = query ? true : openDirs.has(dirKey);
          const totalInDir = countFiles(node.children);
          const toggleChar = isOpen ? '−' : '+';
          acc.push(`
            <li class="tree-node-dir">
              <button class="tree-dir-btn" type="button" data-toggle-dir="${P.escapeHtml(dirKey)}" aria-expanded="${isOpen}">
                <span class="tree-toggle-box">${toggleChar}</span>
                <bdi dir="ltr" class="tree-dir-name">${P.escapeHtml(node.name)}/</bdi>
                <span class="tree-count-pill">${totalInDir}</span>
              </button>
              <div class="tree-children${isOpen ? '' : ' hidden'}">${sub}</div>
            </li>`);
        }
      } else if (!query || node.name.toLowerCase().includes(query) || node.path.toLowerCase().includes(query)) {
        const overCap = (node.lines || 0) > 450;
        const dotIdx = node.name.lastIndexOf('.');
        const ext = dotIdx > 0 ? node.name.slice(dotIdx + 1).toLowerCase() : 'file';
        const extBadge = `<span class="ext-pill ext-${P.escapeHtml(ext)}">${P.escapeHtml(ext)}</span>`;
        const lineTag = node.lines ? `<span class="tree-lines nowrap ${overCap ? 'badge badge-danger' : 'mono'}">${node.lines} ${P.escapeHtml(linesUnit)}</span>` : '';
        acc.push(`
          <li class="tree-file-row">
            <button class="tree-file-btn" type="button" data-open-file="${P.escapeHtml(node.path)}">
              ${extBadge}
              <bdi dir="ltr" class="tree-file-name">${P.escapeHtml(node.name)}</bdi>
            </button>
            ${lineTag}
          </li>`);
      }
      return acc;
    }, []);
    if (items.length === 0) return isRoot ? '<div class="empty-state">—</div>' : '';
    return `<ul class="tree-group${isRoot ? ' tree-root' : ''}">${items.join('')}</ul>`;
  }

  function renderTable(markdown, baseFile, q, extraFilter, emptyMsg) {
    const parsed = P.parseMarkdownTable(markdown);
    if (parsed.rows.length === 0) return `<div class="empty-state">${P.escapeHtml(emptyMsg)}</div>`;
    const query = (q || '').trim().toLowerCase();
    let rows = query ? parsed.rows.filter((r) => r.some((c) => P.stripMarkdown(c).toLowerCase().includes(query))) : parsed.rows;
    if (extraFilter) rows = rows.filter(extraFilter);
    if (rows.length === 0) return `<div class="empty-state">${P.escapeHtml(emptyMsg)}</div>`;

    let html = '<table class="data-table"><thead><tr>';
    parsed.headers.forEach((h) => { html += `<th>${P.escapeHtml(P.stripMarkdown(h))}</th>`; });
    html += '</tr></thead><tbody>';
    for (const row of rows) {
      html += '<tr>';
      row.forEach((cell, idx) => {
        const link = P.extractMarkdownLink(cell);
        const raw = P.stripMarkdown(cell);
        const cls = idx === 0 ? ' class="nowrap"' : '';
        if (link && link.target.endsWith('.md')) {
          const full = resolveRelative(baseFile, link.target);
          html += `<td${cls}><button class="tree-link" type="button" data-open-file="${P.escapeHtml(full)}"><bdi dir="ltr">${P.escapeHtml(link.label)}</bdi></button></td>`;
        } else {
          html += `<td${cls}><bdi dir="auto">${P.escapeHtml(raw)}</bdi></td>`;
        }
      });
      html += '</tr>';
    }
    return html + '</tbody></table>';
  }

  function renderChangesList(changes, t) {
    if (!changes || changes.length === 0) {
      return `<div class="empty-state">${P.escapeHtml(t('workingTreeClean'))}</div>`;
    }
    return `<ul class="change-list">${changes.map((c) => `
      <li class="change-item">
        <span class="badge ${c.status === 'D' ? 'badge-danger' : c.status === '??' ? 'badge-ok' : 'badge-warn'}">${P.escapeHtml(c.status)}</span>
        <button class="tree-link" type="button" data-open-diff="${P.escapeHtml(c.path)}"><bdi dir="ltr">${P.escapeHtml(c.path)}</bdi></button>
        ${c.sensitive ? `<span class="badge badge-danger">${P.escapeHtml(t('sensitiveTag'))}</span>` : ''}
        <span class="diff-nums mono nowrap" dir="ltr"><span class="num-add">+${c.added}</span> <span class="num-del">-${c.deleted}</span></span>
      </li>`).join('')}</ul>`;
  }

  function renderRadar(snap, state, t) {
    const git = snap.git || { changes: [] };
    const radar = snap.radar || { godFiles: [], largestFiles: [], shortcuts: [], ratio: { prodLines: 0, testLines: 0, docLines: 0 } };
    const cl = snap.checklist || { done: 0, total: 0, pct: 0, items: [] };
    const kv = P.parseKeyValues(snap.files.activeContext);

    const q = state.searchQuery.trim().toLowerCase();
    const changes = q ? git.changes.filter((c) => c.path.toLowerCase().includes(q)) : git.changes;
    const shortcuts = q ? radar.shortcuts.filter((s) => s.path.toLowerCase().includes(q) || s.kind.toLowerCase().includes(q)) : radar.shortcuts;

    const kpis = `
      <div class="kpi-strip">
        <div class="kpi-box"><div class="kpi-value ${git.changes.length ? 'text-warn' : ''}">${git.changes.length}</div><div class="kpi-sub">${P.escapeHtml(t('kpiModified'))}</div></div>
        <div class="kpi-box"><div class="kpi-value ${radar.shortcuts.length ? 'text-danger' : 'text-ok'}">${radar.shortcuts.length}</div><div class="kpi-sub">${P.escapeHtml(t('kpiShortcuts'))}</div></div>
        <div class="kpi-box"><div class="kpi-value ${radar.godFiles.length ? 'text-danger' : 'text-ok'}">${radar.godFiles.length}</div><div class="kpi-sub">${P.escapeHtml(t('kpiGodFiles'))}</div></div>
        <div class="kpi-box"><div class="kpi-value">${cl.total > 0 ? `${cl.pct}%` : '—'}</div><div class="kpi-sub">${P.escapeHtml(t('kpiProgress'))} (${cl.done}/${cl.total})</div></div>
      </div>`;

    const shortcutsHtml = shortcuts.length > 0
      ? `<ul class="shortcut-list">${shortcuts.slice(0, 15).map((s) => `
          <li class="shortcut-item">
            <div class="shortcut-head">
              <span class="badge badge-danger">${P.escapeHtml(s.kind)}</span>
              <button class="tree-link" type="button" data-open-file="${P.escapeHtml(s.path)}"><bdi dir="ltr">${P.escapeHtml(s.path)}:${s.line}</bdi></button>
            </div>
            <code class="snippet" dir="ltr">${P.escapeHtml(s.snippet)}</code>
          </li>`).join('')}</ul>`
      : `<div class="empty-state text-ok">${P.escapeHtml(t('shortcutsClean'))}</div>`;

    const ratioHtml = C.renderStackedBar([
      { label: t('prodCode'), count: radar.ratio.prodLines, color: 'var(--accent)' },
      { label: t('testCode'), count: radar.ratio.testLines, color: 'var(--ok)' },
      { label: t('docsCode'), count: radar.ratio.docLines, color: 'var(--warn)' },
    ], t('noData'));

    const progressHtml = cl.total > 0 ? C.renderProgressBar(cl.pct, `${cl.done} / ${cl.total}`, `${cl.pct}%`) : '';
    const kvHtml = kv.length > 0
      ? `<dl class="kv-list">${kv.map((x) => `<dt>${P.escapeHtml(x.key)}</dt><dd>${P.escapeHtml(P.stripMarkdown(x.value))}</dd>`).join('')}</dl>`
      : `<div class="muted-note">${P.escapeHtml(t('noData'))}</div>`;

    return `
      <div class="section-head"><h2>${P.escapeHtml(t('radar'))}</h2></div>
      ${kpis}
      <div class="bento-grid">
        <div class="panel"><h3>${P.escapeHtml(t('workingTreeTitle'))}</h3>${renderChangesList(changes, t)}</div>
        <div class="panel"><h3>${P.escapeHtml(t('shortcutsTitle'))}</h3>${shortcutsHtml}</div>
      </div>
      <div class="bento-grid">
        <div class="panel"><h3>${P.escapeHtml(t('godFilesTitle'))}</h3>${C.renderFileSizeBars(radar.largestFiles, t('linesUnit')) || `<div class="muted-note">${P.escapeHtml(t('noData'))}</div>`}</div>
        <div class="panel"><h3>${P.escapeHtml(t('ratioTitle'))}</h3>${ratioHtml}</div>
      </div>
      <div class="panel"><h3>${P.escapeHtml(t('handoverTitle'))}</h3>${progressHtml}${kvHtml}</div>`;
  }

  function renderGit(snap, state, t) {
    const g = snap.git;
    if (!g || !g.available) {
      return `<div class="section-head"><h2>${P.escapeHtml(t('git'))}</h2></div><div class="empty-state">${P.escapeHtml(t('noGit'))}</div>`;
    }
    const q = state.searchQuery.trim().toLowerCase();
    const commits = q ? g.commits.filter((c) => c.subject.toLowerCase().includes(q) || c.hash.toLowerCase().includes(q) || c.type.includes(q)) : g.commits;
    const isSynced = g.ahead === 0 && g.behind === 0;
    const syncBadge = isSynced
      ? `<span class="badge badge-ok">${P.escapeHtml(t('synced'))}</span>`
      : `<span class="badge badge-warn">↑${g.ahead} / ↓${g.behind} (${P.escapeHtml(t('aheadBehind'))})</span>`;
    const remoteHtml = g.remoteUrl && /^https?:\/\//i.test(g.remoteUrl)
      ? `<a href="${P.escapeHtml(g.remoteUrl)}" target="_blank" rel="noopener noreferrer">${P.escapeHtml(g.remoteUrl)}</a>`
      : `<code>${P.escapeHtml(g.remoteUrl || '—')}</code>`;

    const commitsTable = commits.length > 0
      ? `<table class="data-table"><thead><tr><th>${P.escapeHtml(t('colHash'))}</th><th>${P.escapeHtml(t('colType'))}</th><th>${P.escapeHtml(t('colMessage'))}</th><th>${P.escapeHtml(t('colAuthor'))}</th><th>${P.escapeHtml(t('colDate'))}</th></tr></thead><tbody>
          ${commits.map((c) => `<tr>
            <td class="nowrap"><button class="tree-link" type="button" data-open-commit="${P.escapeHtml(c.hash)}"><bdi dir="ltr">${P.escapeHtml(c.hash)}</bdi></button></td>
            <td class="nowrap"><span class="${commitBadgeClass(c.type)}">${P.escapeHtml(c.type)}</span></td>
            <td><bdi dir="auto">${P.escapeHtml(c.subject)}</bdi></td>
            <td class="muted-note nowrap">${P.escapeHtml(c.author)}</td>
            <td class="mono muted-note nowrap" dir="ltr">${P.escapeHtml(c.date)}</td>
          </tr>`).join('')}
        </tbody></table>`
      : `<div class="empty-state">${P.escapeHtml(t('noData'))}</div>`;

    return `
      <div class="section-head"><h2>${P.escapeHtml(t('git'))}</h2></div>
      <div class="bento-grid">
        <div class="panel">
          <h3>${P.escapeHtml(t('gitSyncTitle'))}</h3>
          <dl class="kv-list">
            <dt>${P.escapeHtml(t('branchLabel'))}</dt><dd><code>${P.escapeHtml(g.branch)}</code></dd>
            <dt>${P.escapeHtml(t('upstreamLabel'))}</dt><dd><code>${P.escapeHtml(g.upstream || 'none')}</code></dd>
            <dt>${P.escapeHtml(t('syncStatusLabel'))}</dt><dd>${syncBadge}</dd>
            <dt>${P.escapeHtml(t('remoteLabel'))}</dt><dd>${remoteHtml}</dd>
          </dl>
        </div>
        <div class="panel">
          <h3>${P.escapeHtml(t('commitDistTitle'))}</h3>
          ${C.renderCommitDistribution(g.commits, t('noData'))}
        </div>
      </div>
      <div class="panel"><h3>${P.escapeHtml(t('workingTreeTitle'))}</h3>${renderChangesList(g.changes, t)}</div>
      <div class="panel"><h3>${P.escapeHtml(t('commitsTitle'))}</h3>${commitsTable}</div>`;
  }

  function renderTrees(snap, state, t) {
    const adminCount = countFiles(snap.trees.adminTree);
    const archCount = countFiles(snap.trees.archTree);
    return `
      <div class="section-head"><h2>${P.escapeHtml(t('trees'))}</h2></div>
      <div class="bento-grid">
        <div class="panel tree-panel">
          <div class="panel-head">
            <h3>${P.escapeHtml(t('adminTreeTitle'))} <span class="badge">${adminCount} ${P.escapeHtml(t('filesCount'))}</span></h3>
            <div class="tree-toolbar">
              <button class="btn btn-sm" type="button" data-tree-expand="admin">${P.escapeHtml(t('expandAll'))}</button>
              <button class="btn btn-sm" type="button" data-tree-collapse="admin">${P.escapeHtml(t('collapseAll'))}</button>
            </div>
          </div>
          ${renderTree(snap.trees.adminTree, state.searchQuery, t('linesUnit'), state.openDirs, 'admin')}
        </div>
        <div class="panel tree-panel">
          <div class="panel-head">
            <h3>${P.escapeHtml(t('archTreeTitle'))} <span class="badge">${archCount} ${P.escapeHtml(t('filesCount'))}</span></h3>
            <div class="tree-toolbar">
              <button class="btn btn-sm" type="button" data-tree-expand="arch">${P.escapeHtml(t('expandAll'))}</button>
              <button class="btn btn-sm" type="button" data-tree-collapse="arch">${P.escapeHtml(t('collapseAll'))}</button>
            </div>
          </div>
          ${renderTree(snap.trees.archTree, state.searchQuery, t('linesUnit'), state.openDirs, 'arch')}
        </div>
      </div>`;
  }

  function renderDebtArchive(snap, state, t) {
    const rows = P.parseMarkdownTable(snap.files.techDebt).rows;
    const stats = { high: 0, medium: 0, low: 0, closed: 0 };
    rows.forEach((r) => {
      const st = (r[r.length - 1] || '').toLowerCase();
      const sev = (r[1] || r[2] || '').toLowerCase();
      if (st.includes('closed')) stats.closed++;
      else if (sev.includes('high') || sev.includes('crit')) stats.high++;
      else if (sev.includes('med')) stats.medium++;
      else stats.low++;
    });

    const filterFn = (row) => {
      const closed = /closed/i.test(row[row.length - 1] || '');
      if (state.debtFilter === 'open') return !closed;
      if (state.debtFilter === 'closed') return closed;
      return true;
    };

    return `
      <div class="section-head">
        <h2>${P.escapeHtml(t('debt'))}</h2>
        <div class="filter-pills">
          <button class="pill-btn ${state.debtFilter === 'all' ? 'active' : ''}" data-debt-filter="all" type="button">${P.escapeHtml(t('filterAll'))}</button>
          <button class="pill-btn ${state.debtFilter === 'open' ? 'active' : ''}" data-debt-filter="open" type="button">${P.escapeHtml(t('filterOpen'))}</button>
          <button class="pill-btn ${state.debtFilter === 'closed' ? 'active' : ''}" data-debt-filter="closed" type="button">${P.escapeHtml(t('filterClosed'))}</button>
        </div>
      </div>
      <div class="panel">
        <h3>${P.escapeHtml(t('debtTitle'))}</h3>
        ${C.renderStackedBar([
          { label: t('high'), count: stats.high, color: 'var(--danger)' },
          { label: t('medium'), count: stats.medium, color: 'var(--warn)' },
          { label: t('low'), count: stats.low, color: 'var(--accent)' },
          { label: t('filterClosed'), count: stats.closed, color: 'var(--ok)' },
        ], t('noData'))}
        <div class="spacer"></div>
        ${renderTable(snap.files.techDebt, 'project_management/TECH_DEBT_REGISTER.md', state.searchQuery, filterFn, t('noData'))}
      </div>
      <div class="panel">
        <h3>${P.escapeHtml(t('completedTitle'))}</h3>
        ${renderTable(snap.files.completedWork, 'project_management/COMPLETED_WORK.md', state.searchQuery, null, t('noData'))}
      </div>`;
  }

  function renderMemoryDocs(snap, state, t) {
    const scriptsHtml = (snap.scripts || []).length > 0
      ? `<ul class="cmd-list">${snap.scripts.map((s) => `
          <li class="cmd-item">
            <code dir="ltr">npm run ${P.escapeHtml(s.name)}</code>
            <span class="muted-note mono" dir="ltr">${P.escapeHtml(s.cmd)}</span>
            <button class="btn btn-sm" type="button" data-copy-cmd="npm run ${P.escapeHtml(s.name)}">${P.escapeHtml(t('copyCmd'))}</button>
          </li>`).join('')}</ul>`
      : `<div class="muted-note">${P.escapeHtml(t('noScripts'))}</div>`;

    const coreLinks = ['SRS.md', 'AGENTS.md', 'README.md', 'project_management/MASTER_PLAN.md', 'project_management/ACTIVE_CONTEXT.md']
      .map((p) => `<li class="tree-file-row"><button class="tree-file-btn" type="button" data-open-file="${p}"><span class="ext-pill ext-md">md</span><bdi dir="ltr" class="tree-file-name">${p}</bdi></button></li>`).join('');
    const extraSpecs = [...(snap.trees.specsTree || []), ...(snap.trees.adrsTree || [])];
    const extraSpecsHtml = extraSpecs.length > 0 ? renderTree(extraSpecs, state.searchQuery, t('linesUnit'), state.openDirs, 'specs') : '';

    return `
      <div class="section-head"><h2>${P.escapeHtml(t('memory'))}</h2></div>
      <div class="bento-grid">
        <div class="panel"><h3>${P.escapeHtml(t('memoryTitle'))}</h3>${renderTree(snap.trees.memoryTree, state.searchQuery, t('linesUnit'), state.openDirs, 'mem')}</div>
        <div class="panel"><h3>${P.escapeHtml(t('specsTitle'))}</h3><ul class="tree-group tree-root">${coreLinks}</ul>${extraSpecsHtml}</div>
      </div>
      <div class="panel"><h3>${P.escapeHtml(t('commandsTitle'))}</h3>${scriptsHtml}</div>`;
  }

  global.PortalViews = {
    resolveRelative,
    renderRadar,
    renderGit,
    renderTrees,
    renderDebtArchive,
    renderMemoryDocs,
  };
})(window);
