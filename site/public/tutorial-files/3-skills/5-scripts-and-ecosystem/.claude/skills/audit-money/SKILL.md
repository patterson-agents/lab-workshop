---
name: audit-money
description: Find and fix violations of the integer-cents money convention.
  Use when auditing or migrating money handling code.
---

# Money audit

Run the bundled checker first; fix what it finds; re-run until clean.

Scripts:
- `scripts/audit-decimals.sh` — finds float money usage. `--json` for
  structured output, `--dir` to scope. Exit 1 means violations found.

```
${CLAUDE_SKILL_DIR}/scripts/audit-decimals.sh --json
```

Fix pattern: replace `parseFloat(x.price)` with
`Money.fromDecimalString(x.price)` at the boundary; integer cents inside.
