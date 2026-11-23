(function (global) {
  'use strict';

  function renderHealthRing(score, grade) {
    const r = 42;
    const c = 2 * Math.PI * r;
    const clamped = Math.max(0, Math.min(100, Number(score) || 0));
    const offset = c - (clamped / 100) * c;
    const strokeVar = clamped >= 88 ? 'var(--ok)' : clamped >= 70 ? 'var(--warn)' : 'var(--danger)';

    return `
      <div class="health-ring-wrap">
        <svg class="health-svg" viewBox="0 0 108 108" width="108" height="108" role="img" aria-label="Governance health ${clamped}%">
          <circle cx="54" cy="54" r="${r}" fill="none" stroke="var(--surface-subtle)" stroke-width="9"></circle>
          <circle cx="54" cy="54" r="${r}" fill="none" stroke="${strokeVar}" stroke-width="9"
            stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}"
            transform="rotate(-90 54 54)"></circle>
          <text x="54" y="50" text-anchor="middle" class="ring-grade">${grade}</text>
          <text x="54" y="68" text-anchor="middle" class="ring-pct">${clamped}%</text>
        </svg>
      </div>`;
  }

  function renderStackedBar(segments, emptyLabel) {
    const total = segments.reduce((sum, s) => sum + s.count, 0);
    if (total === 0) {
      return `<div class="muted-note">${emptyLabel}</div>`;
    }
    const bars = segments
      .filter((s) => s.count > 0)
      .map((s) => {
        const pct = ((s.count / total) * 100).toFixed(1);
        return `<div class="stack-seg" style="width:${pct}%;background:${s.color}" title="${s.label}: ${s.count}"></div>`;
      })
      .join('');

    const legend = segments
      .map((s) => `<span class="legend-item"><span class="legend-dot" style="background:${s.color}"></span>${s.label}: <strong>${s.count}</strong></span>`)
      .join('');

    return `
      <div class="stack-track">${bars}</div>
      <div class="legend-row">${legend}</div>`;
  }

  function renderCommitDistribution(commits, emptyLabel) {
    if (!commits || commits.length === 0) {
      return `<div class="muted-note">${emptyLabel}</div>`;
    }
    const counts = { feat: 0, fix: 0, docs: 0, refactor: 0, other: 0 };
    commits.forEach((c) => {
      if (Object.prototype.hasOwnProperty.call(counts, c.type)) counts[c.type]++;
      else counts.other++;
    });

    const segments = [
      { label: 'feat', count: counts.feat, color: 'var(--ok)' },
      { label: 'fix', count: counts.fix, color: 'var(--danger)' },
      { label: 'docs', count: counts.docs, color: 'var(--accent)' },
      { label: 'refactor', count: counts.refactor, color: 'var(--warn)' },
      { label: 'other', count: counts.other, color: 'var(--muted)' },
    ].filter((s) => s.count > 0);

    return renderStackedBar(segments, emptyLabel);
  }

  global.PortalCharts = {
    renderHealthRing,
    renderStackedBar,
    renderCommitDistribution,
  };
})(window);
