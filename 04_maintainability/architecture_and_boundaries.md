# Architecture, Layer Boundaries & Shared Capabilities

> **Pillar:** [04_maintainability](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Preserve clean separation of concerns so any layer or feature can evolve, be tested in isolation, or be replaced without cascading breakage across the repository.

## Mandatory Standards
1. **Strict Layer Separation:** Keep Presentation/UI, API/Transport, Domain/Business Services, Data Access/Repositories, and External Infrastructure cleanly separated with unidirectional dependencies.
2. **No Direct Data Access From UI or Transport:** UI components and HTTP controllers MUST NOT import database drivers, raw SQL, or low-level storage clients directly; route through domain services and repositories.
3. **Consume Shared Platform Capabilities:** Cross-cutting concerns (authentication, authorization, notifications, audit logging, file storage, configuration, feature flags) MUST live in shared infrastructure modules—individual business features MUST consume them rather than re-implementing them.
4. **Dependency Injection for Testability:** Inject external clients, clocks, and repositories into domain services via interfaces so business logic is testable without live infrastructure.
5. **Isolate Third-Party Adapters:** Wrap external vendor SDKs behind thin internal adapters so vendor changes stay confined to one module.

## Prohibited Anti-Patterns
- Embedding business rules inside UI components, SQL triggers, or HTTP route handlers.
- Re-implementing ad-hoc RBAC, email sending, or audit logging independently inside each module.
- Importing third-party payment, mail, or storage SDKs directly across dozens of business files.

## Verification & Audit Checklist
- [ ] Unidirectional layer boundaries respected (UI → API → Service → Repository).
- [ ] Feature reuses shared platform capabilities instead of duplicating cross-cutting logic.
- [ ] External dependencies are injected or wrapped behind thin adapters.
