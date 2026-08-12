---
title: The Instruction File
---
<!-- Ported from the TutorialKit content package 2026-08-12; now canonical here. -->

# The instruction file

The agent starts every session knowing nothing about your repository: not your build commands, not your conventions, not the directory you must never touch. **AGENTS.md** fixes that: a single markdown file at the repo root that coding agents read automatically at session start. No other configuration in this course costs so little or pays back so much.

A README explains the project to humans. AGENTS.md tells an agent how to *operate*: exact commands, conventions, prohibitions, and where deeper docs live. It loads on **every** session, which is both its power and its budget.

:::note
**Vendor note.** AGENTS.md is an open, de facto standard read natively by most agents (Codex, Cursor, Gemini CLI, OpenCode, and others). Claude Code reads `CLAUDE.md`; standard practice is to keep `AGENTS.md` as the source of truth and symlink `CLAUDE.md` to it; lesson 3 covers this.
:::

## Generate a starting draft

From the root of a **real** repository on your machine (generated instructions for an empty repo are useless):

```sh
claude
```

Then, inside the session:

```
/init
```

Claude explores the repo (you will see file reads scroll by) and writes a `CLAUDE.md` describing the stack, build commands, and structure it found.

## Read it critically

`/init` output is a draft, not a deliverable. Open the generated file and look for:

- Commands it guessed wrong: does `npm test` actually run *your* tests?
- Conventions it could not know: internal libraries, naming rules, review norms
- Generic filler any engineer (and the model) already knows. Delete it.

The file open in the editor on the right is a worked example of the shape that works. Note what it does **not** contain: no project history, no explanations of standard tools, no prose.

:::tip
The test for every line: *"Would the agent get this wrong without this?"* If the answer is no, delete the line. Most first drafts shrink by a third.
:::

## Files used in this lesson

- [`AGENTS.md`](/tutorial-files/1-agents-md/1-the-instruction-file/AGENTS.md)
