import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';
import { buildFullSnapshot, getGitCommitDiff, getGitDiffForFile, resolveSafePath } from './scanner.mjs';

const __filename = fileURLToPath(import.meta.url);
const PORTAL_DIR = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(PORTAL_DIR, '..');
const HOST = '127.0.0.1';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

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
      return sendJson(res, 200, await buildFullSnapshot(PROJECT_ROOT));
    }

    if (reqUrl.pathname === '/api/file') {
      const requested = reqUrl.searchParams.get('path') || '';
      if (!requested) return sendJson(res, 400, { error: 'Relative path required' });
      const safeFull = resolveSafePath(PROJECT_ROOT, requested);
      if (!safeFull) return sendJson(res, 403, { error: 'Access outside project root is forbidden' });
      try {
        const content = await fs.readFile(safeFull, 'utf8');
        return sendJson(res, 200, { path: requested, content });
      } catch {
        return sendJson(res, 404, { error: 'File not found' });
      }
    }

    if (reqUrl.pathname === '/api/diff') {
      const requested = reqUrl.searchParams.get('path') || '';
      if (!requested) return sendJson(res, 400, { error: 'Relative path required' });
      const diff = await getGitDiffForFile(PROJECT_ROOT, requested);
      if (diff === null) return sendJson(res, 403, { error: 'Access outside project root is forbidden' });
      return sendJson(res, 200, { path: requested, diff });
    }

    if (reqUrl.pathname === '/api/commit') {
      const hash = reqUrl.searchParams.get('hash') || '';
      const diff = await getGitCommitDiff(PROJECT_ROOT, hash);
      if (diff === null) return sendJson(res, 400, { error: 'Invalid commit hash' });
      return sendJson(res, 200, { hash, diff });
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
