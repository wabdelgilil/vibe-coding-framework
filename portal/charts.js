(function (global) {
  'use strict';

  function esc(s) {
    return window.PortalParser.escapeHtml(s);
  }

  function renderStackedBar(segments, emptyLabel) {
    const total = segments.reduce((sum, s) => sum + s.count, 0);
    if (total === 0) return `<div class="muted-note">${esc(emptyLabel)}</div>`;
    const bars = segments
      .filter((s) => s.count > 0)
      .map((s) => {
        const pct = ((s.count / total) * 100).toFixed(1);
        return `<div class="stack-seg" style="width:${pct}%;background:${s.color}" title="${esc(s.label)}: ${s.count} (${pct}%)"></div>`;
      })
      .join('');
    const legend = segments
      .map((s) => {
        const pct = Math.round((s.count / total) * 100);
        return `<span class="legend-item"><span class="legend-dot" style="background:${s.color}"></span>${esc(s.label)}: <strong>${s.count.toLocaleString()}</strong> (${pct}%)</span>`;
      })
      .join('');
    return `<div class="stack-track">${bars}</div><div class="legend-row">${legend}</div>`;
  }

  function renderProgressBar(pct, labelLeft, labelRight) {
    const clamped = Math.max(0, Math.min(100, Number(pct) || 0));
    const fillCol = clamped >= 100 ? 'var(--ok)' : 'var(--accent)';
    return `
      <div class="prog-wrap">
        <div class="prog-head"><span>${esc(labelLeft)}</span><span class="mono">${esc(labelRight)}</span></div>
        <div class="meter-track"><div class="meter-fill" style="width:${clamped}%;background:${fillCol}"></div></div>
      </div>`;
  }

  function renderFileSizeBars(files, linesUnit) {
    if (!files || files.length === 0) return '';
    return `<div class="size-list">${files.map((f) => {
      const pct = Math.min(100, Math.round((f.lines / 500) * 100));
      const color = f.lines > 450 ? 'var(--danger)' : f.lines > 350 ? 'var(--warn)' : 'var(--accent)';
      return `
        <div class="size-row">
          <div class="size-head">
            <button class="tree-link" type="button" data-open-file="${esc(f.path)}">${esc(f.path)}</button>
            <span class="mono ${f.lines > 450 ? 'text-danger' : ''}">${f.lines} ${esc(linesUnit)}</span>
          </div>
          <div class="meter-track"><div class="meter-fill" style="width:${pct}%;background:${color}"></div></div>
        </div>`;
    }).join('')}</div>`;
  }

  function renderCommitDistribution(commits, emptyLabel) {
    if (!commits || commits.length === 0) return `<div class="muted-note">${esc(emptyLabel)}</div>`;
    const counts = { feat: 0, fix: 0, docs: 0, refactor: 0, other: 0 };
    commits.forEach((c) => {
      if (Object.prototype.hasOwnProperty.call(counts, c.type)) counts[c.type]++;
      else counts.other++;
    });
    return renderStackedBar([
      { label: 'feat', count: counts.feat, color: 'var(--ok)' },
      { label: 'fix', count: counts.fix, color: 'var(--danger)' },
      { label: 'docs', count: counts.docs, color: 'var(--accent)' },
      { label: 'refactor', count: counts.refactor, color: 'var(--warn)' },
      { label: 'other', count: counts.other, color: 'var(--muted)' },
    ].filter((s) => s.count > 0), emptyLabel);
  }

  function renderColoredDiff(diffText) {
    if (!diffText || !diffText.trim()) return '<div class="muted-note">No diff content.</div>';
    const lines = diffText.split(/\r?\n/).slice(0, 600);
    const html = lines.map((line) => {
      const safe = esc(line);
      if (line.startsWith('+++') || line.startsWith('---') || line.startsWith('diff --git')) {
        return `<div class="diff-meta">${safe}</div>`;
      }
      if (line.startsWith('@@')) return `<div class="diff-hunk">${safe}</div>`;
      if (line.startsWith('+')) return `<div class="diff-add">${safe}</div>`;
      if (line.startsWith('-')) return `<div class="diff-del">${safe}</div>`;
      return `<div class="diff-ctx">${safe}</div>`;
    }).join('');
    return `<div class="diff-view" dir="ltr">${html}</div>`;
  }

  global.PortalCharts = {
    renderStackedBar,
    renderProgressBar,
    renderFileSizeBars,
    renderCommitDistribution,
    renderColoredDiff,
  };
})(window);
