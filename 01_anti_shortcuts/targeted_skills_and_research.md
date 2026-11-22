# Targeted Skills & Research Protocol

> **Pillar:** [01_anti_shortcuts](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Prevent agents from improvising specialized work (especially UI/UX design, modern library APIs, security protocols, or domain-specific workflows) from stale memory when local Skills or authoritative documentation exist—while avoiding wasteful loading on trivial tasks.

## Mandatory Standards
1. **Local Skill Discovery First:** Before starting specialized or multi-step work (UI/UX, design systems, testing architecture, platform deployment, domain workflows), check whether the project or environment already provides a relevant Skill or reference guide and read its primary instruction file.
2. **Verify Volatile & Unfamiliar APIs:** Never guess method signatures, configuration schemas, or security defaults for rapidly evolving libraries or unfamiliar APIs. Verify against official documentation or current codebase usage before writing code.
3. **Cost-Benefit Triage (Proportional Effort):**
   - **Activate Skills / Research:** UI/UX creation or redesign, unfamiliar libraries, security/auth flows, complex architectural choices, or any API uncertainty.
   - **Skip (Direct Execution):** Routine bug fixes, single-parameter edits, or well-established internal patterns already visible in adjacent files.
4. **Targeted Reading Only:** Load only the top-level instruction or specific reference section needed—never ingest entire peripheral directories unnecessarily.

## Prohibited Anti-Patterns
- Designing UI/UX interfaces purely from generic defaults when a design Skill or design system exists in the workspace.
- Hallucinating deprecated flags, non-existent library options, or outdated API endpoints from memory.
- Loading 5 unrelated Skills or running broad web searches for a trivial 3-line local fix.

## Verification & Audit Checklist
- [ ] Checked available workspace/environment Skills before starting specialized work (especially UI/UX).
- [ ] Verified unfamiliar or version-sensitive APIs against authoritative docs or local source.
- [ ] Avoided unnecessary skill/research overhead on trivial routine edits.
