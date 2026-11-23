# Blueprint: Domain Learning Memory Tree (`docs/memory/`)

> **Pillar:** [09_output_blueprints](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Structure (Trigger-Loaded Bucket B — ≤ 80 Lines Per File)

```text
docs/memory/
├── INDEX.md                  # Tiny router (<= 20 lines) mapping domain triggers to files
├── style_and_ui.md           # Formatting, copy tone, UI/UX preferences, visual rules
├── stack_and_tooling.md      # Preferred/banned libraries, package manager, CLI commands
├── domain_rules.md           # Project-specific business conventions and invariants
└── anti_patterns.md          # Past mistakes never to repeat (AP-NNN)
```

## Topic File Template (`docs/memory/<topic>.md`)

```markdown
# Learned Preferences: <Domain Topic>

> **Rule:** Replace superseded entries in place (never append contradictory history). Keep <= 80 lines.

## Standing Rules
- **<Short Label>:** <Concrete, actionable preference or constraint>
```
