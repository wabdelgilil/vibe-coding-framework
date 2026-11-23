import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec, execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const PORTAL_DIR = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(PORTAL_DIR, '..');
const HOST = '127.0.0.1';
const MAX_SCAN_DEPTH = 5;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.md': 'text/markdown; charset=utf-8',
};

const IGNORED_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', '.venv', '__pycache__', 'portal']);

function resolveSafePath(baseDir, requestedRel) {
  const normalized = requestedRel.replace(/\\/g, '/').replace(/^\/+/, '');
  const resolved = path.resolve(baseDir, normalized);
  const rel = path.relative(baseDir, resolved);
  if (rel.startsWith('..') || path.isAbsolute(rel)) return null;
  return resolved;
}

async function readIfExists(relPath) {
  const full = resolveSafePath(PROJECT_ROOT, relPath);
  if (!full) return null;
  try {
    return await fs.readFile(full, 'utf8');
  } catch {
    return null;
  }
}

async function runGit(args) {
  try {
    const { stdout } = await execFileAsync('git', args, { cwd: PROJECT_ROOT, timeout: 4000 });
    return stdout.trim();
  } catch {
    return null;
  }
}

async function getGitTelemetry() {
  const [branch, statusRaw, logRaw] = await Promise.all([
    runGit(['rev-parse', '--abbrev-ref', 'HEAD']),
    runGit(['status', '--porcelain']),
    runGit(['log', '-n', '10', '--pretty=format:%h%x1f%ad%x1f%s', '--date=short']),
  ]);

  if (!branch) return { available: false, branch: null, dirtyCount: 0, commits: [] };
  const dirtyCount = statusRaw ? statusRaw.split(/\r?\n/).filter(Boolean).length : 0;
  const commits = logRaw
    ? logRaw.split(/\r?\n/).filter(Boolean).map((line) => {
        const [hash, date, subject] = line.split('\x1f');
        const typeMatch = (subject || '').match(/^(feat|fix|docs|refactor|perf|test|chore)(\([^)]*\))?:/i);
        return {
          hash: hash || '',
          date: date || '',
          type: typeMatch ? typeMatch[1].toLowerCase() : 'other',
          subject: subject || '',
        };
      })
    : [];
  return { available: true, branch, dirtyCount, commits };
}

async function scanMarkdownTree(relDir, depth = 0) {
  if (depth > MAX_SCAN_DEPTH) return [];
  const fullDir = resolveSafePath(PROJECT_ROOT, relDir);
  if (!fullDir) return [];
  let entries;
  try {
    entries = await fs.readdir(fullDir, { withFileTypes: true });
  } catch {
    return [];
  }
  const results = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (IGNORED_DIRS.has(entry.name) || entry.name.startsWith('.')) continue;
    const childRel = relDir ? `${relDir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      const children = await scanMarkdownTree(childRel, depth + 1);
      if (children.length > 0) results.push({ type: 'dir', name: entry.name, path: childRel, children });
    } else if (entry.name.endsWith('.md')) {
      results.push({ type: 'file', name: entry.name, path: childRel });
    }
  }
  return results;
}

function countTreeFiles(nodes) {
  let count = 0;
  for (const n of nodes || []) {
    if (n.type === 'file') count++;
    else if (n.children) count += countTreeFiles(n.children);
  }
  return count;
}

function computeGovernanceHealth(files, trees) {
  const tier0Text = files.agents || files.gemini || files.claude || null;
  const tier0Name = files.agents ? 'AGENTS.md' : files.gemini ? 'GEMINI.md' : files.claude ? 'CLAUDE.md' : 'None';
  const tier0Lines = tier0Text ? tier0Text.split(/\r?\n/).length : 0;
  const tier0Tokens = tier0Text ? Math.round(tier0Text.length / 4) : 0;
  const activeLines = files.activeContext ? files.activeContext.split(/\r?\n/).length : 0;
  const srsVersionMatch = (files.srs || '').match(/Version:\*\*\s*([^\s|]+)/i);

  const checks = [
    { id: 'tier0', label: 'Tier-0 Rules (≤ 90 lines)', ok: Boolean(tier0Text) && tier0Lines <= 90, detail: tier0Text ? `${tier0Name} (${tier0Lines} lines / ~${tier0Tokens} tok)` : 'Missing' },
    { id: 'srs', label: 'Living SRS.md', ok: Boolean(files.srs), detail: srsVersionMatch ? `v${srsVersionMatch[1].replace(/^v/i, '')}` : (files.srs ? 'Present' : 'Missing') },
    { id: 'master', label: 'Lean MASTER_PLAN.md', ok: Boolean(files.masterPlan), detail: files.masterPlan ? `${files.masterPlan.split(/\r?\n/).length} lines` : 'Missing' },
    { id: 'active', label: 'ACTIVE_CONTEXT.md (≤ 30 lines)', ok: Boolean(files.activeContext) && activeLines <= 30, detail: files.activeContext ? `${activeLines} lines` : 'Missing' },
    { id: 'debt', label: 'TECH_DEBT_REGISTER.md', ok: Boolean(files.techDebt), detail: files.techDebt ? 'Present' : 'Missing' },
    { id: 'completed', label: 'COMPLETED_WORK.md', ok: Boolean(files.completedWork), detail: files.completedWork ? 'Present' : 'Missing' },
    { id: 'memory', label: 'Learning Memory (docs/memory/)', ok: countTreeFiles(trees.memoryTree) > 0, detail: `${countTreeFiles(trees.memoryTree)} files` },
    { id: 'gitignore', label: '.gitignore Hygiene', ok: Boolean(files.gitignore), detail: files.gitignore ? 'Present' : 'Missing' },
  ];

  const passed = checks.filter((c) => c.ok).length;
  const score = Math.round((passed / checks.length) * 100);
  const grade = score >= 95 ? 'A+' : score >= 88 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : 'F';

  return { score, grade, passed, total: checks.length, tier0Name, tier0Lines, tier0Tokens, srsVersion: srsVersionMatch ? srsVersionMatch[1] : null, checks };
}

async function buildProjectSnapshot() {
  const [masterPlan, activeContext, techDebt, completedWork, srs, agents, gemini, claude, readme, gitignore, git] = await Promise.all([
    readIfExists('project_management/MASTER_PLAN.md'),
    readIfExists('project_management/ACTIVE_CONTEXT.md'),
    readIfExists('project_management/TECH_DEBT_REGISTER.md'),
    readIfExists('project_management/COMPLETED_WORK.md'),
    readIfExists('SRS.md'),
    readIfExists('AGENTS.md'),
    readIfExists('GEMINI.md'),
    readIfExists('CLAUDE.md'),
    readIfExists('README.md'),
    readIfExists('.gitignore'),
    getGitTelemetry(),
  ]);

  const [activePlans, archivedPlans, memoryTree, specsTree, adrsTree] = await Promise.all([
    scanMarkdownTree('project_management/plans'),
    scanMarkdownTree('project_management/archive'),
    scanMarkdownTree('docs/memory'),
    scanMarkdownTree('docs/specs'),
    scanMarkdownTree('docs/adrs'),
  ]);

  const files = { masterPlan, activeContext, techDebt, completedWork, srs, agents, gemini, claude, readme, gitignore };
  const trees = { activePlans, archivedPlans, memoryTree, specsTree, adrsTree };
  const health = computeGovernanceHealth(files, trees);

  return {
    projectName: path.basename(PROJECT_ROOT),
    generatedAt: new Date().toISOString(),
    mode: 'live',
    git,
    health,
    files: { masterPlan, activeContext, techDebt, completedWork, srs, agents: agents || gemini || claude, readme },
    trees,
  };
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(payload));
}

function openBrowser(url) {
  const cmd = process.platform === 'win32' ? `start "" "${url}"` : process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
  exec(cmd, () => {});
}

const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = new URL(req.url || '/', `http://${HOST}`);
    if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });

    if (reqUrl.pathname === '/api/project') {
      return sendJson(res, 200, await buildProjectSnapshot());
    }

    if (reqUrl.pathname === '/api/file') {
      const requested = reqUrl.searchParams.get('path') || '';
      if (!requested || !requested.endsWith('.md')) return sendJson(res, 400, { error: 'Valid relative .md path required' });
      const safeFull = resolveSafePath(PROJECT_ROOT, requested);
      if (!safeFull) return sendJson(res, 403, { error: 'Access outside project root is forbidden' });
      try {
        const content = await fs.readFile(safeFull, 'utf8');
        return sendJson(res, 200, { path: requested, content });
      } catch {
        return sendJson(res, 404, { error: 'File not found' });
      }
    }

    const staticRel = reqUrl.pathname === '/' ? 'index.html' : reqUrl.pathname;
    const safeAsset = resolveSafePath(PORTAL_DIR, staticRel);
    if (!safeAsset) { res.writeHead(403); return res.end('Forbidden'); }
    try {
      const data = await fs.readFile(safeAsset);
      const ext = path.extname(safeAsset).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('Not Found');
    }
  } catch (err) {
    sendJson(res, 500, { error: 'Internal portal server error', detail: err instanceof Error ? err.message : 'Unknown' });
  }
});

const requestedPort = Number.parseInt(process.env.PORTAL_PORT || '0', 10);
const shouldOpen = !process.argv.includes('--no-open');

server.listen(Number.isNaN(requestedPort) ? 0 : requestedPort, HOST, () => {
  const addr = server.address();
  const port = typeof addr === 'object' && addr ? addr.port : requestedPort;
  const url = `http://${HOST}:${port}`;
  console.log(`Project Portal running at ${url}`);
  console.log(`Serving project root: ${PROJECT_ROOT}`);
  console.log('Press Ctrl+C to stop.');
  if (shouldOpen) openBrowser(url);
});
