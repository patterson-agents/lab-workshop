---
type: lesson
title: Anatomy of a Skill
focus: /.claude/skills/money-handling/SKILL.md
---

# Anatomy of a skill

A skill is a folder containing a `SKILL.md`: instructions the agent loads *when relevant*, not on every session. The economics are the whole point:

1. **Discovery** (~100 tokens): at startup, only each skill's name and description load
2. **Activation** (<5k tokens): a task matches the description, and the full body enters context
3. **Execution** (as needed): bundled scripts run and referenced files load only when the work calls for them

AGENTS.md is your always-loaded baseline; skills are everything that doesn't need to be. The rule: *every* session needs it → AGENTS.md. *Some* sessions need it → skill.

:::info
**Vendor note.** Skills follow the **Agent Skills** open standard ([agentskills.io](https://agentskills.io)), originally developed by Anthropic and adopted by 20+ agents including Cursor, Codex, Gemini CLI, Copilot, and OpenCode. The same skill folder works across them.
:::

## Two fields carry the system

The editor shows a complete project skill. Per the spec:

- **`name`**: lowercase, hyphenated, ≤64 chars, and it must **match the folder name**
- **`description`**: what it does *and when to use it*, ≤1024 chars, containing the trigger words of the task. It is the only thing the model sees before deciding to activate.

> "Helps with PDFs" never triggers. "Extracts text and tables from PDF files — use when working with PDF documents" does.

The body is plain markdown: steps, one worked example, and a Gotchas section. Keep it under 500 lines; push depth into `references/` and tell the agent *when* to read each file.

## Create and verify

Copy the skill into a real repo, then:

```
/skills
```

confirms discovery. Now trigger it with natural language (*"What's our convention for storing prices?"*) and watch the skill load. Then start a fresh session and ask something unrelated: confirm it stays cold.

:::success
**✓ Checkpoint.** The skill activates on a matching task, stays cold on an unrelated one, and appears in `/skills`.
:::
