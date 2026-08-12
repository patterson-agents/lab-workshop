---
title: Scopes & Precedence
---
<!-- Ported from the TutorialKit content package 2026-08-12; now canonical here. -->

# Scopes & precedence

Skills resolve across three scopes. On a name conflict, the most authoritative wins:

| Scope | Path | Wins conflicts |
| --- | --- | --- |
| **Enterprise** | managed settings | 1st; the org's rules are not optional |
| **Personal** | `~/.claude/skills/<name>/SKILL.md` | 2nd; your habits, every project |
| **Project** | `.claude/skills/<name>/SKILL.md` | 3rd; committed, the whole team gets it on clone |

Plugin skills (Part 4) sit outside this contest entirely: they're namespaced (`plugin-name:skill-name`) and never collide.

## Live reload rules

- Edits to an **existing** SKILL.md apply live within the session
- **New** top-level skill folders need a session restart
- Monorepos: nested `.claude/skills/` directories are discovered on demand as the agent works in those paths

## Where should a skill live?

- A convention specific to one codebase → **project**
- Your personal review checklist → **personal**
- The org's security rules → **enterprise**, pushed by admins

:::tip
Team sharing inside one repo needs no machinery at all: commit `.claude/skills/` to version control. Reach for plugins only when the audience crosses repos.
:::
