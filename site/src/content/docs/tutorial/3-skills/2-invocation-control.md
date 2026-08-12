---
title: Invocation Control & Arguments
---
<!-- Ported from the TutorialKit content package 2026-08-12; now canonical here. -->

# Invocation control & arguments

By default both you and the model can invoke a skill. Two frontmatter switches change that:

| Frontmatter | Who can invoke | Use for |
| --- | --- | --- |
| *(default)* | You and the model | Most skills: conventions, procedures, reference knowledge |
| `disable-model-invocation: true` | Only you, via `/name` | **Side effects**: /deploy, /commit, /release; the model never decides to run these on its own |
| `user-invocable: false` | Only the model | Background knowledge, hidden from the `/` menu |

The editor shows a user-only `/deploy` skill. Note the combination: a skill the model can't trigger, with steps too fragile to leave to judgment.

:::note
These switches are Claude Code extensions to the standard; `name` + `description` are the portable core that works in every agent.
:::

## Arguments

- `$ARGUMENTS`: everything typed after the command
- `$0`, `$1`: positional; named arguments via an `arguments:` list, with `argument-hint` shown in the menu
- `${CLAUDE_SKILL_DIR}`: absolute path to the skill's folder, and how you reference bundled scripts

## Dynamic injection

`` !`command` `` runs **before** the model reads the prompt and replaces the placeholder with its output; you used it in `/standup`. Multi-line blocks use a fenced ```` ```! ```` block.

## Calibrate control to fragility

Prescriptive, exact commands for fragile sequences ("Run exactly this; do not modify"). Freedom plus *reasons* for flexible tasks. Provide **a default, not a menu**: name one library, mention the fallback, and don't survey five.

:::tip
**✓ Checkpoint.** You have one user-only skill (`disable-model-invocation: true`), and `/skills` shows it; the model never triggers it from natural language.
:::

## Files used in this lesson

- [`.claude/skills/deploy/SKILL.md`](/tutorial-files/3-skills/2-invocation-control/.claude/skills/deploy/SKILL.md)
