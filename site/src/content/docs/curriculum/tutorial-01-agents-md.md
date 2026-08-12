---
title: "Tutorial 01 - AGENTS.md: teaching the agent your repo"
description: "Module 01 of the workshop track: write and refine an AGENTS.md file."
---


**Module 01 · ~15 minutes · hands-on**

The agent starts every session knowing nothing about your repository: not your build commands, not your conventions, not the directory you must never touch. AGENTS.md fixes that. It is a single markdown file at the repo root that coding agents read automatically at session start, and of everything in this workbook it is the cheapest configuration with the highest payoff.

> **Vendor note.** AGENTS.md is an open, de facto standard read natively by most agents (Codex, Cursor, Gemini CLI, OpenCode, and others). Claude Code reads `CLAUDE.md`; the standard practice is to keep `AGENTS.md` as the source of truth and symlink `CLAUDE.md` to it.

## Prerequisites

- Claude Code installed and authenticated (`claude --version`)
- A real repository to work in (generated instructions for an empty repo are useless)

## Steps

### 1. Generate a starting file

From your repo root:

```
$ claude
> /init
```

Expected: Claude explores the repo (you will see file reads scroll by) and writes a `CLAUDE.md` describing the stack, build commands, and structure it found.

### 2. Read what it wrote — critically

Open the generated file. `/init` output is a draft, not a deliverable. Look for:

- Commands it guessed wrong (does `npm test` actually run your tests?)
- Conventions it could not know (internal libraries, naming rules, review norms)
- Generic filler that any engineer (and the model) already knows. Delete it.

### 3. Add what only your team knows

The highest-value content is the stuff that is in your head, not in the file tree. Add sections like:

```markdown
## Commands
- Build: `bun run build`
- Test (single file): `bun test path/to/file.test.ts`
- Lint + fix: `bun run lint --fix`

## Conventions
- Use the internal `@acme/http` client — never raw fetch()
- All money values are integer cents, never floats

## Do not
- Do not edit files under `src/generated/` (codegen overwrites them)
- Do not add new dependencies without flagging it in the PR description
```

Every line costs context in **every** session; keep it to what every session needs.

### 4. Make it cross-vendor

```
$ mv CLAUDE.md AGENTS.md
$ ln -s AGENTS.md CLAUDE.md
$ git add AGENTS.md CLAUDE.md && git commit -m "Add AGENTS.md"
```

### 5. Edit in-session whenever it drifts

```
> /memory
```

opens the memory file for editing without leaving the conversation.

## ✓ Checkpoint

Start a **fresh** session and ask: *"What test command should you use in this repo, and which directories are off-limits?"* The agent should answer from your file, without searching. If it searches, the information is missing or buried.

## Exercises

1. **The lie detector.** Add a deliberately wrong build command, start a fresh session, and ask the agent to build. Watch it trust your file. Fix it. Lesson: AGENTS.md is authoritative, so keep it true.
2. **Monorepo scoping.** Create `packages/api/AGENTS.md` with one API-specific rule. Confirm the agent applies it when working in that package (closest file wins).
3. **The audit.** For each line in your AGENTS.md ask: "would the agent get this wrong without it?" Delete every line where the answer is no. Most first drafts shrink by a third.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Agent ignores an instruction | Buried in prose | Make it a short bullet under a clear heading |
| File ballooning past ~100 lines | Procedure creep | Move procedures to skills (Tutorial 03); keep AGENTS.md to what every session needs |
| Other agents don't pick it up | Tool reads a different filename | Keep AGENTS.md canonical; symlink the vendor name to it |
| /init wrote nothing useful | Empty or unusual repo | Write it by hand; /init is a bootstrapper, not a requirement |
