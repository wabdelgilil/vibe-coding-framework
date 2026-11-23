# Gated Engineering Lifecycle (Zero-Command Auto-Scaled Flow)

> **Pillar:** [07_project_management_and_context](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Replace both chaotic ad-hoc coding and tedious multi-command spec workflows (`/specify`, `/plan`, `/tasks`, `/implement`) with one natural-language lifecycle that scales automatically to change size.

## Mandatory Standards
1. **Six Sequential Stages (Driven Automatically Without Slash Commands):**
   - **Stage 1 — Discover & Batch-Clarify:** Read existing code and relevant local Skills first. If real ambiguity exists, ask **1 concise batch** (max 3–5 high-leverage questions with recommended defaults); skip if clear.
   - **Stage 2 — Spec/Delta & Impact:** Define requirements (or a Spec Delta for existing features), edge cases, and cross-layer impact.
   - **Stage 3 — Deep Plan & Single Sign-Off:** Produce a file-level plan scaled to complexity and present a brief executive summary (≤ 10 lines) for one sign-off before coding.
   - **Stage 4 — Wave-Bounded Build:** Implement cleanly with strict types, security controls, and real behavior tests.
   - **Stage 5 — Dual Verify & Adversarial Audit:** Run automated checks + direct reading/sampling + adversarial review + living docs & Tier-0 staleness sync.
   - **Stage 6 — Close & Archive:** Update `SRS.md`/`CHANGELOG.md`/`ACTIVE_CONTEXT.md`, move closed plan folder to `archive/`, record in `COMPLETED_WORK.md`, and prune `MASTER_PLAN.md`.
2. **Automatic Scale-Proportional Ceremony (No Special Trigger Required):**
   - *Small Change (1–2 files, low risk):* Brief root-cause statement → Build → Dual Verify → Sync affected doc.
   - *Medium Feature (1–3 phases):* Single batched clarify → Single consolidated sign-off → Autonomous execution through closure.
   - *Large Epic (4+ phases / broad architecture shift):* Execute **one Wave per turn/batch**, updating `ACTIVE_CONTEXT.md` between waves and pausing for review/context compaction to prevent silent drift and context saturation.

## Prohibited Anti-Patterns
- Forcing users to memorize or invoke separate manual commands for each lifecycle stage.
- Running a 5+ phase epic autonomously in one unbroken pass without wave checkpoints.
- Skipping discovery, impact analysis, or verification on multi-file features.

## Verification & Audit Checklist
- [ ] Ceremony depth matched actual change size automatically (Small / Medium / Large Wave).
- [ ] Single consolidated sign-off obtained before coding on medium/large work.
- [ ] Build, dual verification, living docs sync, `ACTIVE_CONTEXT.md`, and archival completed before closure.
