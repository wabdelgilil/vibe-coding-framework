# Design & Architecture: Local Human Portal (`portal/`)

> **Parent Plan:** [INDEX.md](INDEX.md)  
> **Rules Applied:** [domain_and_impact_integrity.md](../../../04_maintainability/domain_and_impact_integrity.md) | [input_validation_and_defense.md](../../../06_security_and_reliability/input_validation_and_defense.md)

---

## 1. Dual-Mode Runtime & Smart Launcher Flow

```text
User runs start_portal.bat (Windows) or start_portal.sh (macOS/Linux)
  ├── Reads portal/.portal-pref (gitignored) if present ("node" | "python" | "browser")
  ├── If no saved preference:
  │     ├── Node.js found?  ──► Offer [1] Local Live Server via Node (Recommended) / [2] Direct Browser Mode
  │     ├── Python found?   ──► Offer [1] Local Live Server via Python / [2] Direct Browser Mode
  │     └── Neither found?  ──► Offer [1] Direct Browser Mode (Zero Install) / [2] Show Node.js Install Link
  │     └── Save chosen mode to portal/.portal-pref (user can reset anytime with `--reset`)
  └── Launch:
        ├── Node mode:   node portal/server.mjs -> binds 127.0.0.1:<free_port>, exposes /api/project + opens browser
        ├── Python mode: python -m http.server --bind 127.0.0.1 <free_port> -> opens portal/index.html
        └── Browser mode: opens portal/index.html directly -> File System Access API folder picker
```

### Security & Reliability Controls
- **Loopback Only:** Bind strictly to `127.0.0.1` (never `0.0.0.0`).
- **Path Traversal Guard:** Canonicalize every requested path in `server.mjs` and reject anything outside the project root (`403`).
- **XSS-Safe Rendering:** Escape all raw HTML from Markdown before rendering (`textContent` / strict allowlisted Markdown-to-DOM rendering; zero raw `innerHTML` on untrusted strings).
- **Graceful Parser Fallback:** If an agent varies a Markdown table layout, fall back cleanly to formatted raw Markdown rather than throwing or showing blank cards.

---

## 2. Intentional Visual Design System (Engineering Workbench Aesthetic)

Grounded in an **architectural control ledger** — crisp, legible, and calm for reading specs and tracking initiatives without generic AI SaaS card bloat:

- **Palette (Light / Dark Semantic Tokens):**
  - Light: Paper Canvas `#F7F8FA`, Elevated Surface `#FFFFFF`, Structural Hairline `#E2E6ED`, Ink Primary `#111827`, Ink Muted `#525C6B`, Primary Steel Blue `#1D4ED8`, Status Emerald `#0F766E`, Amber `#B45309`, Crimson `#B91C1C`.
  - Dark: Slate Obsidian `#0F141B`, Elevated Panel `#161D27`, Hairline `#253040`, Ink Primary `#EDF2F7`, Ink Muted `#94A3B8`, Primary Sky `#3B82F6`, Status Teal `#14B8A6`, Amber `#F59E0B`, Rose `#F87171`.
- **Typography:** Clean system UI stack (`Segoe UI`, `Inter`, `Tahoma`/`Cairo` fallback for Arabic) + monospace (`Consolas`, `JetBrains Mono`) strictly for file paths, Rule IDs, and Git status—no ALL-CAPS eyebrow clutter, no gradient washes.
- **Layout (Sidebar + Focused Reading/Status Canvas):**
  - Top bar: Project title, live mode badge (`Live 127.0.0.1` vs `Local Folder`), `Refresh`, `EN / العربية` (`LTR`/`RTL`), `Light / Dark`.
  - Left navigation rail: `Overview (Active Context + Radar)`, `Plans Tree`, `Tech Debt`, `Completed Archive`, `Memory & SRS`.
  - Main canvas: Single focused view with generous breathing room, hairline dividers, and a slide-over/inline Markdown reader for clicking any linked plan or spec file.
