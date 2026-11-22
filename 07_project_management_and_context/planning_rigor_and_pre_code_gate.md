# Planning Rigor & Pre-Code Gate

> **Pillar:** [07_project_management_and_context](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Eliminate premature coding and superficial wish-list plans. Applies to every feature, refactor, schema change, and multi-file modification.

## Mandatory Standards
1. **Hard Stop Before Code:** Agents MUST NOT create or modify production code until a verified plan exists proportional to the change size.
2. **Five Required Plan Elements (No Superficial Lists):**
   - *Codebase-First Discovery:* Read existing affected modules and contracts before assuming anything.
   - *Ambiguity & Assumption Resolution:* Surface every unclear requirement or trade-off and resolve it with the user first.
   - *Impact, Edge Cases & Rollback:* Map affected layers, failure modes, and safe recovery steps.
   - *File-Level & Contract Blueprint:* List exact files to create/modify, interfaces/schemas affected, and atomic step order.
   - *Testable Acceptance Criteria:* Define objective proof required to mark each step done.
3. **Plan Sign-Off Gate:** For medium/large features, architectural changes, or breaking schema updates, pause and obtain explicit user approval of the plan before writing code.
4. **Proportional Depth:** A 1-file trivial bug fix requires a brief root-cause statement—not a multi-file planning tree.

## Prohibited Anti-Patterns
- Jumping straight into editing files after a high-level user prompt.
- Writing vague 3-bullet plans ("1. Update DB, 2. Build API, 3. Test") without reading existing code.
- Making silent product, pricing, or schema assumptions instead of asking.

## Verification & Audit Checklist
- [ ] Existing code and contracts inspected before drafting the plan.
- [ ] Ambiguities resolved, impact/edge cases mapped, and file-level blueprint written.
- [ ] Explicit user sign-off obtained for non-trivial or architectural plans prior to coding.
