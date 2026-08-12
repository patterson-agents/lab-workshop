---
title: "Tutorial 02 - Commands: the slash menu"
description: "Module 02 of the workshop track: built-in commands versus custom commands."
---


**Module 02 · ~15 minutes · hands-on**

Everything behind the `/` key is one of two things: a **built-in command** (fixed logic shipped with Claude Code: `/clear`, `/permissions`, `/mcp`) or a **skill** (prompt-based and extensible, including every custom command you will ever write). This tutorial builds fluency with the built-ins and ends with the fact that sets up the rest of the day: custom commands *are* skills.

## Prerequisites

- Tutorial 01 completed (a repo with an AGENTS.md)

## Steps

### 1. Open the menu

In a session, type `/` and nothing else. Scroll the list. Type a few letters to filter. Note: entries vary by platform and plan, so your list will not exactly match your neighbor's.

### 2. The working set

Run each of these once now:

| Command | What it does | Why it matters |
|---|---|---|
| `/context` | Colored-grid visualization of the context window | *The* tool for understanding what your config costs |
| `/permissions` | Allow/ask/deny rules for tools | The guardrail surface; previews Plugins/MCP |
| `/mcp` | MCP server status + authentication | Module 05 home base |
| `/compact` | Summarize the conversation to free space | Use at natural breakpoints; takes optional focus instructions |
| `/clear` | Wipe history, start fresh | Cheaper than /compact when you don't need the thread |
| `/rewind` | Roll back conversation and/or code | The undo button most people don't know exists |
| `/model` | Switch model / configure effort | — |
| `/skills` | List available skills | Module 03 home base |
| `/doctor` | Diagnose installation and settings | First stop when anything misbehaves |

### 3. Read your context bill

Run `/context` immediately after starting a fresh session in your repo. Identify: system prompt, your AGENTS.md, skill descriptions, MCP tools. This view makes the rest of the day's trade-offs concrete, because everything you add in Tutorials 03–05 shows up here.

### 4. Create a custom command (it's a skill)

```
$ mkdir -p .claude/skills/standup
$ cat > .claude/skills/standup/SKILL.md << 'EOF'
---
description: Summarize my recent work as a standup update. Use when asked for a standup.
---

Summarize the last day of git history by the current author as a
three-bullet standup update: done, in progress, blocked.

!`git log --author="$(git config user.name)" --since=yesterday --oneline`
EOF
```

Restart the session (new top-level skill folders need a restart; edits to existing ones don't), then:

```
> /standup
```

Expected: the git log runs **before** the model sees the prompt (that's the `` !`…` `` dynamic-injection syntax; more in Tutorial 03), and you get a three-bullet update.

### 5. Know the legacy form

`.claude/commands/standup.md` (flat file, no frontmatter required) also creates `/standup`. Commands and skills merged; the skill form wins name conflicts and is the one to write going forward.

## ✓ Checkpoint

You can answer, without looking: where does `/standup` come from, what's the difference between `/clear` and `/compact`, and what does `/context` show that `/cost` doesn't.

## Exercises

1. **Filter intuition.** Find three built-ins you've never used, run them, and decide whether they earn a spot in your working set.
2. **Arguments.** Extend `/standup` to accept a day count: use `$ARGUMENTS` in the body (`--since="$ARGUMENTS days ago"`), declare `argument-hint: <days>`, and run `/standup 3`.
3. **MCP preview.** If any MCP server is already configured, type `/mcp__` and see whether it exposes prompts as commands.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `/standup` doesn't appear | New top-level skill dir mid-session | Restart the session |
| Command exists on a colleague's machine, not yours | Platform/plan-dependent visibility | Compare `claude --version`; check the docs for availability notes |
| `!` injection didn't run | Setting disabled or syntax position | Must be at line start; check `disableSkillShellExecution` |
| `/review` missing | Deprecated as a built-in | `claude plugin install code-review@claude-plugins-official` |
