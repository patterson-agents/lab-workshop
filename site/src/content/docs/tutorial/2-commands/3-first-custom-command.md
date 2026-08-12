---
title: Your First Custom Command
---
<!-- Ported from the TutorialKit content package 2026-08-12; now canonical here. -->

# Your first custom command is a skill

Custom commands and skills converged: `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both create `/deploy`. The skill form wins name conflicts and is the one to write going forward.

The editor shows a complete `/standup` command. Create it in your repo:

```sh
mkdir -p .claude/skills/standup
# then copy SKILL.md from the editor pane
```

Restart the session (**new** top-level skill folders need a restart; edits to existing ones apply live), then:

```
/standup
```

## The interesting line

```text "!`"
!`git log --author="$(git config user.name)" --since=yesterday --oneline`
```

The `` !`…` `` syntax runs the shell command **before** the model sees the prompt: its output replaces the placeholder. The model receives your actual git history, not an instruction to go fetch it. Part 3 covers this and the rest of the skill machinery properly.

:::tip
**✓ Checkpoint.** `/standup` runs and produces three bullets, and you can explain where the git log came from and why the model never had to run a tool to get it.
:::

## Exercises

1. **Arguments.** Extend `/standup` to accept a day count: use `$ARGUMENTS` in the body (`--since="$ARGUMENTS days ago"`), declare `argument-hint: <days>`, and run `/standup 3`.
2. **Filter intuition.** Find three built-ins you've never used, run them, and decide whether they earn a spot in your working set.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `/standup` doesn't appear | New top-level skill dir mid-session | Restart the session |
| `!` injection didn't run | Syntax position or disabled setting | Must be at line start; check `disableSkillShellExecution` |
| Command exists on a colleague's machine, not yours | Platform/plan visibility | Compare `claude --version` |

## Files used in this lesson

- [`.claude/skills/standup/SKILL.md`](/tutorial-files/2-commands/3-first-custom-command/.claude/skills/standup/SKILL.md)
