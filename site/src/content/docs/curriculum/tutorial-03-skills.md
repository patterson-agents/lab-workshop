---
title: "Tutorial 03 - Skills: on-demand knowledge"
description: "Module 03 of the workshop track: anatomy, invocation, scopes, and best practices for Agent Skills."
---


**Module 03 · ~30 minutes · hands-on · the core of the session**

A skill is a folder containing a `SKILL.md`: instructions the agent loads *when relevant*, not on every session. The economics are the whole point. At startup the agent sees only each skill's name and description (~100 tokens); the full body loads only when a task matches. AGENTS.md is your always-loaded baseline; skills are everything that doesn't need to be.

> **Vendor note.** Skills follow the **Agent Skills** open standard (agentskills.io), originally developed by Anthropic and adopted by 20+ agents including Cursor, Codex, Gemini CLI, Copilot, and OpenCode. The same skill folder works across them. Claude Code adds extensions (invocation control, subagent execution, dynamic injection) noted below.

## Prerequisites

- Tutorials 01–02 completed (you already wrote one skill: `/standup`)

## Part A · Anatomy and placement

### 1. The minimal skill

```
.claude/skills/
  money-handling/
    SKILL.md
```

```markdown
---
name: money-handling
description: Conventions for money values in this codebase. Use when writing
  or reviewing code that handles prices, payments, refunds, or currency.
---

# Money handling

- All monetary values are integer cents. Never floats, never strings.
- Use `Money.fromCents()` from `@acme/money` to construct values.
- Rounding: half-even (banker's). `Money.allocate()` for splits.

## Gotchas
- Legacy `orders.total_price` column is DECIMAL dollars — convert at the
  boundary with `Money.fromDecimalString()`, nowhere else.
```

Two frontmatter fields carry the system. Per the spec: `name` must be lowercase-hyphenated, ≤64 chars, **matching the folder name**; `description` (≤1024 chars) must say what it does *and when to use it*, because it is the only thing the model sees before deciding to activate.

### 2. Verify discovery and activation

```
> /skills                     # listed?
> What's our convention for storing prices?
```

Expected: the agent activates `money-handling` and answers from the skill (tool output shows the skill load). Then try a fresh session and a task that *shouldn't* trigger it, and confirm it stays cold.

### 3. The three scopes

| Scope | Path | Wins conflicts |
|---|---|---|
| Enterprise | managed settings | 1st |
| Personal | `~/.claude/skills/<name>/SKILL.md` | 2nd |
| Project | `.claude/skills/<name>/SKILL.md` | 3rd |

Edits to an existing SKILL.md apply live within the session; *new* top-level folders need a restart.

## Part B · Control surfaces (Claude Code extensions)

### 4. Invocation control

```yaml
disable-model-invocation: true   # user-only: /deploy, /commit, side effects
user-invocable: false            # agent-only: background knowledge, hidden from / menu
```

Default = both can invoke. Use `disable-model-invocation` for anything you wouldn't want the model deciding to run on its own.

### 5. Arguments and dynamic injection

```yaml
argument-hint: <ticket-id>
```

- `$ARGUMENTS`: everything after the command; `$0`, `$1` positional; named args via an `arguments:` list
- `` !`git diff HEAD` ``: shell runs **before** the model reads the prompt; output replaces the placeholder
- `${CLAUDE_SKILL_DIR}`: absolute path to the skill folder; how you reference bundled scripts

### 6. Supporting files: progressive disclosure level 3

Keep SKILL.md under 500 lines. Move depth into the folder and **tell the agent when to load each file**:

```
money-handling/
  SKILL.md
  references/tax-rules.md      ← "Read references/tax-rules.md when computing tax"
  scripts/audit-decimals.sh    ← "Run scripts/audit-decimals.sh to find violations"
```

## Part C · Writing skills that work (best practices)

### 7. Start from real expertise

The failure mode of generated skills is vague filler ("handle errors appropriately"). Source material that works: your last ten code-review comments, a runbook, an incident report, the corrections you gave the agent yesterday. **Do the task with the agent once, then write down what you had to correct.**

### 8. Spend context like money

- The test for every line: *"Would the agent get this wrong without this?"* No → delete.
- A default beats a menu: "use pdfplumber" beats a survey of five PDF libraries.
- **Gotchas are the highest-value content**: concrete facts that defy assumptions ("the /health endpoint returns 200 even when the queue is down"). Add one every time you correct the agent.

### 9. Execute, then revise

Run the skill on a real task and read the *trace*, not just the output. If the agent wanders, the instructions are too vague; if it ignores a section, cut the section. One execute-revise pass improves a skill more than any amount of upfront authoring.

### 10. Bundled scripts: design for an agent operator

Agents can't answer interactive prompts; a script that asks "Continue? [y/N]" hangs forever.

- Flags/env/stdin only; missing input → clear error + usage
- `--help` that's concise (it enters context)
- Structured output (JSON/TSV) on stdout, diagnostics on stderr
- Idempotent; `--dry-run` for destructive ops; meaningful exit codes
- One-off commands: pin versions with runners (`npx eslint@9`, `uvx ruff@0.8.0`, `bunx eslint@9` in Bun environments)

## Part D · The skills directory

### 11. Install a community skill

```
$ npx skills add anthropics/skills
```

skills.sh is the public directory (Trending, Official, security Audits); one install command targets ~20 different agents. Notable: `skill-creator` (Anthropic's skill for writing skills), `find-skills`, the document skills (pdf/docx/xlsx/pptx).

## ✓ Checkpoint

You have: a project skill that activates on a natural-language task, a user-only skill (`disable-model-invocation`), and one installed community skill visible in `/skills`. You can state the three context-budget levels (~100 tokens / <5k / on-demand).

## Exercises

1. **The code-review skill.** Take the last recurring nitpick from your team's PRs and write it as a skill with one Gotchas entry. This is the single most valuable skill most teams can write today.
2. **Trigger tuning.** Write a deliberately vague description ("Helps with documents"), observe it failing to trigger, then fix it with concrete trigger words. Keep both versions for your team's training notes.
3. **The audit script.** Bundle a script that finds violations of your skill's rule (grep is fine), reference it from SKILL.md, and have the agent run and summarize it.
4. **(Stretch) Subagent execution.** Add `context: fork` to a task-style skill and compare behavior: when does isolating the work from conversation history help?

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Never triggers | Description lacks trigger words | Rewrite description with the nouns/verbs of the task; test in fresh session |
| Triggers too often | Description too broad | Narrow it, or set `disable-model-invocation: true` |
| Not listed in /skills | New folder mid-session; name/folder mismatch | Restart; folder name must equal `name` |
| Skill loads but agent ignores a rule | Rule buried mid-prose | Bullets under clear headings; move depth to references/ |
| Conflicts with same-named skill | Scope precedence | Enterprise > personal > project; rename or remove the shadowing copy |
| Validation for sharing | — | `skills-ref validate ./my-skill` (reference library) |
