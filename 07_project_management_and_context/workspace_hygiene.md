# Workspace, Path & Git Hygiene

> **Pillar:** [07_project_management_and_context](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Maintain a pristine, auditable, cross-platform repository layout free of stray files, broken local paths, subjective filenames, and messy Git history.

## Mandatory Standards
1. **Pristine Root Directory:** Only standard operational files (`README.md`, `SRS.md`, `INDEX.md`, agent rules file, `.gitignore`, `.env.example`, package manifests) may reside at the repository root. Place code in `src/`, docs in `docs/`, scripts in `scripts/`, and plans in `project_management/`.
2. **100% Repository-Relative Links:** Every Markdown link inside repository files MUST use relative paths (`../docs/SRS.md`). Hardcoded local machine paths (`file:///C:/...`, `file:///d:/...`) are strictly forbidden.
3. **Deterministic Naming:** Never use subjective suffixes (`_final`, `_new`, `_latest`, `_v2_updated`, `_temp`). Use Semantic Versioning for releases and deterministic domain slugs for files.
4. **Atomic, Clean Commits:** Keep commits focused on one logical change with Conventional Commit messages (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`), zero untracked scratch artifacts, and zero AI co-author tags.

## Prohibited Anti-Patterns
- Dropping temporary debug scripts, CSV dumps, or scratch notes in the repository root.
- Committing files named `report_final_v2_new.md` or broken `file:///` links.
- Bundling unrelated refactors, feature code, and formatting noise into one giant commit.

## Verification & Audit Checklist
- [ ] Root directory contains only approved operational files.
- [ ] Zero hardcoded `file:///` paths and zero subjective filename suffixes.
- [ ] Git status clean of scratch files; commits are atomic and follow Conventional Commits.
