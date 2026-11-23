import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

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
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    return null;
  }
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
      if (children.length > 0) {
        results.push({ type: 'dir', name: entry.name, path: childRel, children });
      }
    } else if (entry.name.endsWith('.md')) {
      results.push({ type: 'file', name: entry.name, path: childRel });
    }
  }
  return results;
}

async function buildProjectSnapshot() {
  const [masterPlan, activeContext, techDebt, completedWork, srs, agents, readme] = await Promise.all([
    readIfExists('project_management/MASTER_PLAN.md'),
    readIfExists('project_management/ACTIVE_CONTEXT.md'),
    readIfExists('project_management/TECH_DEBT_REGISTER.md'),
    readIfExists('project_management/COMPLETED_WORK.md'),
    readIfExists('SRS.md'),
    readIfExists('AGENTS.md'),
    readIfExists('README.md'),
  ]);

  const [activePlans, archivedPlans, memoryTree, specsTree, adrsTree] = await Promise.all([
    scanMarkdownTree('project_management/plans'),
    scanMarkdownTree('project_management/archive'),
    scanMarkdownTree('docs/memory'),
    scanMarkdownTree('docs/specs'),
    scanMarkdownTree('docs/adrs'),
  ]);

  return {
    projectName: path.basename(PROJECT_ROOT),
    generatedAt: new Date().toISOString(),
    mode: 'live',
    files: { masterPlan, activeContext, techDebt, completedWork, srs, agents, readme },
    trees: { activePlans, archivedPlans, memoryTree, specsTree, adrsTree },
  };
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(payload));
}

function openBrowser(url) {
  const platform = process.platform;
  const cmd = platform === 'win32'
    ? `start "" "${url}"`
    : platform === 'darwin'
      ? `open "${url}"`
      : `xdg-open "${url}"`;
  exec(cmd, () => { /* non-fatal if headless environment cannot open browser */ });
}

const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = new URL(req.url || '/', `http://${HOST}`);
    if (req.method !== 'GET') {
      return sendJson(res, 405, { error: 'Method not allowed' });
    }

    if (reqUrl.pathname === '/api/project') {
      const snapshot = await buildProjectSnapshot();
      return sendJson(res, 200, snapshot);
    }

    if (reqUrl.pathname === '/api/file') {
      const requested = reqUrl.searchParams.get('path') || '';
      if (!requested || !requested.endsWith('.md')) {
        return sendJson(res, 400, { error: 'Valid relative .md path required' });
      }
      const safeFull = resolveSafePath(PROJECT_ROOT, requested);
      if (!safeFull) {
        return sendJson(res, 403, { error: 'Access outside project root is forbidden' });
      }
      try {
        const content = await fs.readFile(safeFull, 'utf8');
        return sendJson(res, 200, { path: requested, content });
      } catch {
        return sendJson(res, 404, { error: 'File not found' });
      }
    }

    const staticRel = reqUrl.pathname === '/' ? 'index.html' : reqUrl.pathname;
    const safeAsset = resolveSafePath(PORTAL_DIR, staticRel);
    if (!safeAsset) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Forbidden');
    }

    try {
      const data = await fs.readFile(safeAsset);
      const ext = path.extname(safeAsset).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      res.end(data);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
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
