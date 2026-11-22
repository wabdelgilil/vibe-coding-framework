# Architecture Documentation & Decision Records (ADRs)

> **Pillar:** [05_documentation](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Preserve *why* architectural choices were made so future AI sessions and engineers never accidentally revert critical decisions or repeat past design mistakes.

## Mandatory Standards
1. **Living Architecture Overview (`ARCHITECTURE.md`):** Maintain a concise system map documenting major components, layer boundaries, data flow, external integrations, and trust/security boundaries.
2. **Mandatory ADRs for Material Decisions:** Create a numbered ADR (`docs/adrs/ADR-NNN-<slug>.md`) whenever choosing or changing:
   - Core technologies, databases, or architectural patterns.
   - Authentication, authorization, or tenant-isolation models.
   - Major performance/scalability trade-offs or cross-cutting platform frameworks.
3. **Required ADR Structure:** Every ADR MUST capture: *Context*, *Decision*, *Alternatives Considered*, *Consequences/Trade-offs*, and *Status* (`Proposed`, `Accepted`, `Superseded by ADR-XXX`).
4. **Immutable History:** Never silently overwrite an accepted ADR; if a decision changes, create a new ADR and mark the previous one `Superseded`.

## Prohibited Anti-Patterns
- Making major architectural or dependency changes solely inside chat history without persisting an ADR.
- Deleting or rewriting old ADRs in place, erasing the historical rationale.
- Drawing diagrams that omit trust boundaries, persistence layers, or async flows.

## Verification & Audit Checklist
- [ ] `ARCHITECTURE.md` accurately reflects current components, boundaries, and data flows.
- [ ] Every significant architectural decision or trade-off has a numbered ADR in `docs/adrs/`.
- [ ] Superseded decisions link forward to their replacement ADR.
