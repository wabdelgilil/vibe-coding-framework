# Continuous Learning & Preference Memory (Two-Bucket Model)

> **Pillar:** [07_project_management_and_context](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Ensure AI agents remember recurring user preferences and corrections across sessions without allowing rules or context windows to grow unbounded.

## Mandatory Standards
1. **Learn-on-Correction Trigger:** Whenever the user expresses a standing preference or recurring correction (e.g., *"no emojis in UI/docs"*, *"always use pnpm"*, *"prefer neutral monochrome palettes"*), persist it immediately into the appropriate bucket and append a concise 1-line confirmation (`Learned & saved: <rule> -> <path>`).
2. **Two-Bucket Anti-Bloat Architecture:**
   - **Bucket A — Always-On Standing Preferences (Tier-0, Hard Cap = 10 One-Liners):** Reserve the `Standing User Preferences` section in the primary Tier-0 rule file strictly for universal, every-turn rules. When all 10 slots are full, merge overlapping rules or demote domain-specific items to Bucket B—never exceed 10 lines.
   - **Bucket B — Trigger-Loaded Domain Memory (`docs/memory/`, ≤ 80 lines per file):** Store contextual preferences in focused topic files (`style_and_ui.md`, `stack_and_tooling.md`, `domain_rules.md`, `anti_patterns.md`) linked from the Tier-0 Trigger Table so they load only when touching that domain.
3. **Replace, Never Append Diaries:** When a new preference overrides or refines an older one, replace the existing line in place—never keep a chronological log of contradictory rules.
4. **Periodic Compaction:** Keep every `docs/memory/*.md` file concise and deduplicated (≤ 80 lines); split into a sub-folder only if a domain genuinely requires distinct sub-topics.

## Prohibited Anti-Patterns
- Appending every one-off session remark into `AGENTS.md` / `GEMINI.md` until Tier-0 exceeds 90 lines.
- Obeying a recurring correction only for the current turn without persisting it for future sessions.
- Keeping contradictory old and new preferences in the same memory file.

## Verification & Audit Checklist
- [ ] Recurring user preference persisted to Bucket A (universal, ≤ 10 lines) or Bucket B (`docs/memory/<topic>.md`).
- [ ] Superseded preferences replaced cleanly in place with zero contradictions.
- [ ] Primary Tier-0 rule file remains strictly ≤ 90 lines after the update.
