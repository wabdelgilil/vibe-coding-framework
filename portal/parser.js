(function (global) {
  'use strict';

  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function stripMarkdown(text) {
    return String(text || '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/~~([^~]+)~~/g, '$1')
      .trim();
  }

  function extractMarkdownLink(cell) {
    const match = String(cell || '').match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (!match) return null;
    return { label: match[1].trim(), target: match[2].trim() };
  }

  function parseMarkdownTable(markdown) {
    if (!markdown) return { headers: [], rows: [] };
    const lines = markdown.split(/\r?\n/);
    for (let i = 0; i < lines.length - 1; i++) {
      const headerLine = lines[i].trim();
      const sepLine = lines[i + 1].trim();
      if (!headerLine.startsWith('|') || !sepLine.startsWith('|')) continue;
      if (!/^\|[\s:|-]+\|$/.test(sepLine)) continue;

      const splitRow = (line) =>
        line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());

      const headers = splitRow(headerLine);
      const rows = [];
      for (let j = i + 2; j < lines.length; j++) {
        const rowLine = lines[j].trim();
        if (!rowLine.startsWith('|')) break;
        rows.push(splitRow(rowLine));
      }
      return { headers, rows };
    }
    return { headers: [], rows: [] };
  }

  function parseKeyValues(markdown) {
    if (!markdown) return [];
    const items = [];
    const lines = markdown.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(/^\s*-\s+\*\*([^*]+?):\*\*\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        const parts = [];
        if (match[2].trim()) parts.push(match[2].trim());
        while (i + 1 < lines.length && /^\s{2,}-\s+/.test(lines[i + 1])) {
          i++;
          parts.push(lines[i].replace(/^\s*-\s+/, '').trim());
        }
        items.push({ key, value: parts.join(' | ') || '—' });
      }
    }
    return items;
  }

  function formatInline(raw) {
    let safe = escapeHtml(raw);
    safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');
    safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    safe = safe.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
      if (/^https?:\/\//i.test(href)) {
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
      }
      if (href.endsWith('.md')) {
        return `<button class="tree-link" type="button" data-open-md="${href}">${label}</button>`;
      }
      return label;
    });
    return safe;
  }

  function renderMarkdownToHtml(markdown) {
    if (!markdown) return '';
    const lines = markdown.split(/\r?\n/);
    const out = [];
    let inCode = false;
    let codeBuf = [];
    let inList = false;
    let tableBuf = [];

    const flushList = () => {
      if (inList) { out.push('</ul>'); inList = false; }
    };

    const flushTable = () => {
      if (tableBuf.length < 2) {
        tableBuf.forEach((l) => out.push(`<p>${formatInline(l)}</p>`));
        tableBuf = [];
        return;
      }
      const split = (l) => l.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
      const headers = split(tableBuf[0]);
      const body = tableBuf.slice(2).map(split);
      let html = '<table class="data-table"><thead><tr>';
      headers.forEach((h) => { html += `<th>${formatInline(h)}</th>`; });
      html += '</tr></thead><tbody>';
      body.forEach((r) => {
        html += '<tr>';
        r.forEach((c) => { html += `<td>${formatInline(c)}</td>`; });
        html += '</tr>';
      });
      html += '</tbody></table>';
      out.push(html);
      tableBuf = [];
    };

    for (const line of lines) {
      if (line.trim().startsWith('```')) {
        flushList();
        flushTable();
        if (inCode) {
          out.push(`<pre><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>`);
          codeBuf = [];
          inCode = false;
        } else {
          inCode = true;
        }
        continue;
      }
      if (inCode) { codeBuf.push(line); continue; }

      const trimmed = line.trim();
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        flushList();
        tableBuf.push(trimmed);
        continue;
      }
      if (tableBuf.length > 0) flushTable();

      if (!trimmed) { flushList(); continue; }
      if (/^---+$/.test(trimmed)) { flushList(); out.push('<hr />'); continue; }

      const heading = trimmed.match(/^(#{1,3})\s+(.*)$/);
      if (heading) {
        flushList();
        const lvl = heading[1].length;
        out.push(`<h${lvl}>${formatInline(heading[2])}</h${lvl}>`);
        continue;
      }

      if (trimmed.startsWith('>')) {
        flushList();
        out.push(`<blockquote>${formatInline(trimmed.replace(/^>\s?/, ''))}</blockquote>`);
        continue;
      }

      const listItem = trimmed.match(/^[-*]\s+(.*)$/);
      if (listItem) {
        if (!inList) { out.push('<ul>'); inList = true; }
        out.push(`<li>${formatInline(listItem[1])}</li>`);
        continue;
      }

      flushList();
      out.push(`<p>${formatInline(trimmed)}</p>`);
    }

    flushList();
    flushTable();
    if (inCode) {
      out.push(`<pre><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>`);
    }
    return out.join('\n');
  }

  global.PortalParser = {
    escapeHtml,
    stripMarkdown,
    extractMarkdownLink,
    parseMarkdownTable,
    parseKeyValues,
    renderMarkdownToHtml,
  };
})(window);
