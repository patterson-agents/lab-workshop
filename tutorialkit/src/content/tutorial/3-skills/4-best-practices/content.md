---
type: lesson
title: Writing Skills That Work
focus: /.claude/skills/money-handling/SKILL.md
---

# Writing skills that work

The failure mode of generated skills is vague filler: "handle errors appropriately" helps no one. Write from scar tissue, not imagination.

## Start from real expertise

Source material that works: your last ten code-review comments, a runbook, an incident report, the corrections you gave the agent yesterday. **Do the task with the agent once, then write down what you had to correct.**

## Spend context like money

- The test for every line: *"Would the agent get this wrong without this?"* No → delete.
- Defaults, not menus: "use pdfplumber" beats a survey of five PDF libraries.
- One coherent unit per skill: query-and-format is one skill; adding database administration makes it two.

:::warn
**Gotchas are the highest-value content.** Concrete facts that defy assumptions: "the `/health` endpoint returns 200 even when the queue is down." Add one every time you correct the agent; the skill in the editor has an example.
:::

## Execute, then revise (once)

Run the skill on a real task and read the **trace**, not just the output:

- The agent wanders → instructions too vague
- It ignores a section → cut the section
- It pauses on choices → you offered a menu where a default belonged

One execute-revise pass improves a skill more than any amount of upfront authoring.

:::success
**✓ Checkpoint.** Take the most recurring nitpick from your team's code reviews and write it as a skill with one Gotchas entry. This is the single most valuable skill most teams can write today.
:::

## Exercises

1. **Trigger tuning.** Write a deliberately vague description ("Helps with documents"), watch it fail to trigger, then fix it with concrete trigger words. Keep both versions for your team's notes.
2. **Subagent execution (stretch).** Add `context: fork` to a task-style skill and compare behavior: when does isolating work from conversation history help?
