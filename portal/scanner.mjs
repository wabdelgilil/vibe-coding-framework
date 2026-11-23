import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const MAX_SCAN_DEPTH = 5;
const GOD_FILE_THRESHOLD = 450;

const IGNORED_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', '.next', '.venv', '__pycache__', 'coverage']);
const CODE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.py', '.go', '.rs', '.dart', '.cs', '.java', '.php', '.rb', '.sql', '.css', '.html', '.sh', '.bat']);
const SHORTCUT_RULES = [
  { kind: 'TODO/FIXME', regex: /\b(TODO|FIXME|HACK|XXX)\b/ },
  { kind: 'type-escape', regex: /(\bas\s+any\b|:\s*any\b|@ts-ignore|@ts-nocheck|#\s*type:\s*ignore)/ },
  { kind: 'lint-suppress', regex: /(eslint-disable|#\s*noqa\b)/ },
  { kind: 'empty-catch', regex: /(catch\s*(\([^)]*\))?\s*\{\s*\}|except[^:]*:\s*pass\b)/ },
  { kind: 'debug-log', regex: /\bconsole\.log\s*\(/ },
];
const SENSITIVE_PATTERN = /(^|\/)(\.env|auth|security|rbac|migrations?|package\.json|tsconfig|AGENTS\.md|GEMINI\.md|CLAUDE\.md)/i;

export function resolveSafePath(baseDir, requestedRel) {
  const normalized = String(requestedRel || '').replace(/\\/g, '/').replace(/^\/+/, '');
  const resolved = path.resolve(baseDir, normalized);
  const rel = path.relative(baseDir, resolved);
  if (rel.startsWith('..') || path.isAbsolute(rel)) return null;
  return resolved;
}

export async function readIfExists(projectRoot, relPath) {
  const full = resolveSafePath(projectRoot, relPath);
  if (!full) return null;
  try {
    return await fs.readFile(full, 'utf8');
  } catch {
    return null;
  }
}

async function runGit(projectRoot, args) {
  try {
    const { stdout } = await execFileAsync('git', args, { cwd: projectRoot, timeout: 5000, maxBuffer: 2 * 1024 * 1024 });
    return stdout;
  } catch {
    return null;
  }
}

export async function getGitDetails(projectRoot) {
  const [branchRaw, upstreamRaw, remoteRaw, aheadBehindRaw, statusRaw, numstatRaw, logRaw] = await Promise.all([
    runGit(projectRoot, ['rev-parse', '--abbrev-ref', 'HEAD']),
    runGit(projectRoot, ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}']),
    runGit(projectRoot, ['config', '--get', 'remote.origin.url']),
    runGit(projectRoot, ['rev-list', '--left-right', '--count', 'HEAD...@{u}']),
    runGit(projectRoot, ['status', '--porcelain']),
    runGit(projectRoot, ['diff', '--numstat']),
    runGit(projectRoot, ['log', '-n', '10', '--pretty=format:%h%x1f%ad%x1f%an%x1f%s', '--date=short']),
  ]);

  if (!branchRaw) return { available: false, branch: null, upstream: null, remoteUrl: null, ahead: 0, behind: 0, changes: [], commits: [] };

  let ahead = 0;
  let behind = 0;
  if (aheadBehindRaw) {
    const parts = aheadBehindRaw.trim().split(/\s+/);
    ahead = Number.parseInt(parts[0] || '0', 10) || 0;
    behind = Number.parseInt(parts[1] || '0', 10) || 0;
  }

  const statMap = new Map();
  if (numstatRaw) {
    for (const line of numstatRaw.split(/\r?\n/).filter(Boolean)) {
      const [added, deleted, file] = line.split('\t');
      if (file) statMap.set(file.replace(/\\/g, '/'), { added: Number(added) || 0, deleted: Number(deleted) || 0 });
    }
  }

  const changes = statusRaw
    ? statusRaw.split(/\r?\n/).filter(Boolean).map((line) => {
        const code = line.slice(0, 2).trim() || 'M';
        const filePath = line.slice(3).trim().replace(/\\/g, '/');
        const st = statMap.get(filePath) || { added: 0, deleted: 0 };
        const isTest = /(^|\/)(tests?|__tests__|spec)\b|\.(test|spec)\./i.test(filePath);
        return {
          status: code,
          path: filePath,
          added: st.added,
          deleted: st.deleted,
          sensitive: SENSITIVE_PATTERN.test(filePath) || (isTest && st.deleted > st.added),
        };
      })
    : [];

  const commits = logRaw
    ? logRaw.split(/\r?\n/).filter(Boolean).map((line) => {
        const [hash, date, author, subject] = line.split('\x1f');
        const typeMatch = (subject || '').match(/^(feat|fix|docs|refactor|perf|test|chore)(\([^)]*\))?:/i);
        return { hash: hash || '', date: date || '', author: author || '', type: typeMatch ? typeMatch[1].toLowerCase() : 'other', subject: subject || '' };
      })
    : [];

  return {
    available: true,
    branch: branchRaw.trim(),
    upstream: upstreamRaw ? upstreamRaw.trim() : null,
    remoteUrl: remoteRaw ? remoteRaw.trim().replace(/\.git$/, '') : null,
    ahead,
    behind,
    changes,
    commits,
  };
}

export async function getGitDiffForFile(projectRoot, relPath) {
  const safe = resolveSafePath(projectRoot, relPath);
  if (!safe) return null;
  const diff = await runGit(projectRoot, ['diff', 'HEAD', '--', relPath]);
  if (diff && diff.trim()) return diff;
  const content = await readIfExists(projectRoot, relPath);
  if (content === null) return '';
  return content.split(/\r?\n/).map((l) => `+${l}`).join('\n');
}

export async function getGitCommitDiff(projectRoot, hash) {
  if (!/^[0-9a-f]{5,40}$/i.test(hash || '')) return null;
  return await runGit(projectRoot, ['show', '--stat', '--patch', '--max-count=1', hash]);
}

async function walkTree(projectRoot, relDir, filterFn, depth = 0) {
  if (depth > MAX_SCAN_DEPTH) return [];
  const fullDir = resolveSafePath(projectRoot, relDir);
  if (!fullDir) return [];
  let entries;
  try {
    entries = await fs.readdir(fullDir, { withFileTypes: true });
  } catch {
    return [];
  }

  const out = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (IGNORED_DIRS.has(entry.name) || entry.name.startsWith('.')) continue;
    const childRel = relDir ? `${relDir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      const children = await walkTree(projectRoot, childRel, filterFn, depth + 1);
      if (children.length > 0) out.push({ type: 'dir', name: entry.name, path: childRel, children });
    } else if (filterFn(entry.name, childRel)) {
      let lineCount = 0;
      try {
        const text = await fs.readFile(path.join(fullDir, entry.name), 'utf8');
        lineCount = text.split(/\r?\n/).length;
      } catch {}
      out.push({ type: 'file', name: entry.name, path: childRel, lines: lineCount });
    }
  }
  return out;
}

export async function scanCodebaseRadar(projectRoot) {
  const allCodeFiles = [];
  const shortcuts = [];
  const ratio = { prodLines: 0, testLines: 0, docLines: 0 };
  const langLines = {};

  async function inspectDir(relDir, depth = 0) {
    if (depth > MAX_SCAN_DEPTH) return;
    const fullDir = resolveSafePath(projectRoot, relDir);
    if (!fullDir) return;
    let entries;
    try { entries = await fs.readdir(fullDir, { withFileTypes: true }); } catch { return; }

    for (const entry of entries) {
      if (IGNORED_DIRS.has(entry.name) || entry.name.startsWith('.')) continue;
      const childRel = relDir ? `${relDir}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        await inspectDir(childRel, depth + 1);
        continue;
      }
      const ext = path.extname(entry.name).toLowerCase();
      let content = '';
      try { content = await fs.readFile(path.join(fullDir, entry.name), 'utf8'); } catch { continue; }
      const lines = content.split(/\r?\n/);

      if (ext === '.md') {
        ratio.docLines += lines.length;
        continue;
      }
      if (!CODE_EXTS.has(ext)) continue;

      const isTest = /(^|\/)(tests?|__tests__|spec)\b|\.(test|spec)\./i.test(childRel);
      if (isTest) ratio.testLines += lines.length;
      else ratio.prodLines += lines.length;

      langLines[ext] = (langLines[ext] || 0) + lines.length;
      allCodeFiles.push({ path: childRel, lines: lines.length, isGodFile: lines.length > GOD_FILE_THRESHOLD });

      if (!childRel.startsWith('portal/scanner.mjs')) {
        lines.forEach((lineText, idx) => {
          if (shortcuts.length >= 40) return;
          for (const rule of SHORTCUT_RULES) {
            if (rule.regex.test(lineText)) {
              shortcuts.push({ kind: rule.kind, path: childRel, line: idx + 1, snippet: lineText.trim().slice(0, 90) });
              break;
            }
          }
        });
      }
    }
  }

  await inspectDir('');
  allCodeFiles.sort((a, b) => b.lines - a.lines);

  return {
    totalCodeFiles: allCodeFiles.length,
    godFiles: allCodeFiles.filter((f) => f.isGodFile),
    largestFiles: allCodeFiles.slice(0, 8),
    shortcuts,
    ratio,
    langLines,
  };
}

export async function scanChecklistProgress(projectRoot) {
  let done = 0;
  let pending = 0;
  const items = [];
  const planTree = await walkTree(projectRoot, 'project_management/plans', (n) => n.endsWith('.md'));

  async function collect(nodes) {
    for (const n of nodes) {
      if (n.type === 'dir') { await collect(n.children); continue; }
      const text = await readIfExists(projectRoot, n.path);
      if (!text) continue;
      for (const line of text.split(/\r?\n/)) {
        const m = line.match(/^\s*-\s+\[([ xX])\]\s+(.*)$/);
        if (m) {
          const isDone = m[1].toLowerCase() === 'x';
          if (isDone) done++;
          else pending++;
          if (items.length < 15) items.push({ done: isDone, text: m[2].trim(), path: n.path });
        }
      }
    }
  }
  await collect(planTree);
  const total = done + pending;
  return { done, pending, total, pct: total > 0 ? Math.round((done / total) * 100) : 0, items };
}

export async function buildFullSnapshot(projectRoot) {
  const [masterPlan, activeContext, techDebt, completedWork, srs, agents, gemini, claude, readme, pkgRaw, git, radar, checklist] = await Promise.all([
    readIfExists(projectRoot, 'project_management/MASTER_PLAN.md'),
    readIfExists(projectRoot, 'project_management/ACTIVE_CONTEXT.md'),
    readIfExists(projectRoot, 'project_management/TECH_DEBT_REGISTER.md'),
    readIfExists(projectRoot, 'project_management/COMPLETED_WORK.md'),
    readIfExists(projectRoot, 'SRS.md'),
    readIfExists(projectRoot, 'AGENTS.md'),
    readIfExists(projectRoot, 'GEMINI.md'),
    readIfExists(projectRoot, 'CLAUDE.md'),
    readIfExists(projectRoot, 'README.md'),
    readIfExists(projectRoot, 'package.json'),
    getGitDetails(projectRoot),
    scanCodebaseRadar(projectRoot),
    scanChecklistProgress(projectRoot),
  ]);

  const [pmTree, memoryTree, specsTree, adrsTree, archTree] = await Promise.all([
    walkTree(projectRoot, 'project_management', (n) => n.endsWith('.md')),
    walkTree(projectRoot, 'docs/memory', (n) => n.endsWith('.md')),
    walkTree(projectRoot, 'docs/specs', (n) => n.endsWith('.md')),
    walkTree(projectRoot, 'docs/adrs', (n) => n.endsWith('.md')),
    walkTree(projectRoot, '', (n, rel) => !rel.startsWith('project_management/') && !rel.startsWith('docs/')),
  ]);

  let scripts = [];
  if (pkgRaw) {
    try {
      const parsed = JSON.parse(pkgRaw);
      if (parsed.scripts && typeof parsed.scripts === 'object') {
        scripts = Object.entries(parsed.scripts).map(([name, cmd]) => ({ name, cmd: String(cmd) }));
      }
    } catch {}
  }

  const tier0Text = agents || gemini || claude || '';
  const tier0Lines = tier0Text ? tier0Text.split(/\r?\n/).length : 0;

  return {
    projectName: path.basename(projectRoot),
    generatedAt: new Date().toISOString(),
    mode: 'live',
    git,
    radar,
    checklist,
    scripts,
    tier0Lines,
    files: { masterPlan, activeContext, techDebt, completedWork, srs, agents: tier0Text || null, readme },
    trees: {
      adminTree: [
        { type: 'dir', name: 'project_management', path: 'project_management', children: pmTree },
        ...(memoryTree.length ? [{ type: 'dir', name: 'docs/memory', path: 'docs/memory', children: memoryTree }] : []),
        ...(specsTree.length ? [{ type: 'dir', name: 'docs/specs', path: 'docs/specs', children: specsTree }] : []),
        ...(adrsTree.length ? [{ type: 'dir', name: 'docs/adrs', path: 'docs/adrs', children: adrsTree }] : []),
      ],
      archTree,
      memoryTree,
      specsTree,
      adrsTree,
    },
  };
}
