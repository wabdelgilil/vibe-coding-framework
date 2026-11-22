# Contributing to Vibe Coding Framework

Contributions that sharpen engineering rigor, fix gaps discovered in real-world AI coding sessions, or improve clarity are welcome.

## Non-Negotiable Contribution Standards

Every Pull Request is validated automatically by [`.github/workflows/verify-links.yml`](.github/workflows/verify-links.yml) and reviewed against these rules:

1. **Pure Markdown Only:** Keep the framework 100% pure Markdown with zero runtime scripts or build dependencies.
2. **Language-Agnostic Core:** Do not hardcode specific programming languages or vendor libraries into Pillars `01`–`08`.
3. **Strict Context Budget:**
   - Pillar & sub-branch routers (`README.md` / `INDEX.md`) MUST stay **≤ 35 lines**.
   - Micro-leaf rule files MUST stay **≤ 120 lines** (target 40–90 lines). Split broad topics into recursive sub-branches instead of growing long files.
   - Generated Tier-0 rule templates MUST stay **≤ 90 lines**.
4. **4-Part Pillar Anatomy:** Every non-template micro-leaf MUST include:
   - `## Objective & Scope`
   - `## Mandatory Standards`
   - `## Prohibited Anti-Patterns`
   - `## Verification & Audit Checklist`
5. **100% Relative Links & Zero AI Footprint:** Use repository-relative Markdown links only (`0` hardcoded local paths) and clean, authoritative engineering prose with Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`).

## Submitting Changes

1. Fork the repository and create a focused branch (`feat/<topic>` or `fix/<topic>`).
2. Add or update the relevant Pillar micro-leaf and its Pillar `README.md` Rule ID table.
3. Verify zero broken links and line-budget compliance before opening a Pull Request.
