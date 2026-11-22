# Long-Term Impact & Standards Compliance Gate

> **Pillar:** [01_anti_shortcuts](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Eliminate myopic "patch-to-pass" engineering where solutions only satisfy the immediate prompt while introducing long-term architectural damage. Applies to every feature design, refactor, and non-trivial bug fix.

## Mandatory Standards
1. **3-Question Pre-Solution Gate:** Before implementing any solution, evaluate and satisfy:
   - *Root vs. Symptom:* Does this resolve the underlying cause or merely silence the immediate error?
   - *6–12 Month Horizon:* How does this behave as data volume, user concurrency, and feature count grow? Does it tighten coupling or complicate future migrations?
   - *Standards Compliance:* Does it strictly obey SOLID, separation of concerns, security boundaries, and the project constitution?
2. **Standard Solution Over Easiest Path:** When multiple implementations exist, select the architecturally sound, standard solution—never default to the shortest hack.
3. **Explicit Trade-Off Recording:** If an unavoidable architectural trade-off exists (e.g., performance vs. consistency), present options to the user and record the chosen decision in an ADR.

## Prohibited Anti-Patterns
- Reaching across layer boundaries (e.g., querying the database directly from UI or controllers) to "save time."
- Adding special-case `if` branches for one edge scenario instead of fixing the broken abstraction.
- Introducing unpinned, redundant, or poorly maintained dependencies for trivial logic.
- Deferring structural correctness indefinitely under the excuse of "we will clean it up later."

## Verification & Audit Checklist
- [ ] Solution evaluated against 6–12 month extensibility, coupling, and data growth.
- [ ] Zero architectural boundary or project constitution violations introduced.
- [ ] Any material trade-off escalated to the user and recorded in an ADR.
