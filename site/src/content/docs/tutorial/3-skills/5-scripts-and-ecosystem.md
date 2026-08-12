---
title: Scripts & the Skills Directory
---
<!-- Ported from the TutorialKit content package 2026-08-12; now canonical here. -->

# Scripts & the skills directory

## Design scripts for an agent operator

A bundled script's operator is an agent, and agents can't answer interactive prompts. A script that asks `Continue? [y/N]` hangs forever.

- Flags, env vars, and stdin only; missing input → clear error + usage
- A concise `--help` (it enters context)
- Structured output (JSON/TSV) on **stdout**, diagnostics on **stderr**
- Idempotent, because agents retry; `--dry-run` for anything destructive; meaningful exit codes

Reference scripts from SKILL.md by relative path, with a one-line purpose each, and run them via `${CLAUDE_SKILL_DIR}`.

## One-off commands: pin versions with runners

```sh
npx eslint@9 --fix .        # Node
uvx ruff@0.8.0 check .      # Python (ships with uv)
bunx eslint@9 --fix .       # Bun environments
```

Runners resolve dependencies on demand, so no `scripts/` folder is needed for simple cases. Always pin the version: the agent's run next month should match yours today.

## The skills directory

```sh
npx skills add anthropics/skills
```

[skills.sh](https://skills.sh) is the public directory (trending lists, official collections, security audits), and the one install command targets ~20 different agents. Worth knowing: `skill-creator` (Anthropic's skill for writing skills) and the document skills (pdf, docx, xlsx, pptx).

:::tip
**✓ Checkpoint for Part 3.** You have: a project skill that triggers on natural language, a user-only skill, one installed community skill, and you can name the three context budgets (~100 tokens / <5k / on-demand).
:::

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Never triggers | Description lacks trigger words | Rewrite with the nouns/verbs of the task; test in a fresh session |
| Triggers too often | Description too broad | Narrow it, or `disable-model-invocation: true` |
| Not listed in /skills | New folder mid-session; name/folder mismatch | Restart; folder name must equal `name` |
| Loads but a rule is ignored | Rule buried mid-prose | Bullets under clear headings; depth into references/ |
| Same-name conflict | Scope precedence | Enterprise > personal > project |

## Files used in this lesson

- [`.claude/skills/audit-money/SKILL.md`](/tutorial-files/3-skills/5-scripts-and-ecosystem/.claude/skills/audit-money/SKILL.md)
- [`.claude/skills/audit-money/scripts/audit-decimals.sh`](/tutorial-files/3-skills/5-scripts-and-ecosystem/.claude/skills/audit-money/scripts/audit-decimals.sh)
