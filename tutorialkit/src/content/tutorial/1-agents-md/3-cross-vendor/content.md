---
type: lesson
title: Cross-Vendor + Checkpoint
focus: /AGENTS.md
---

# Make it cross-vendor

Keep `AGENTS.md` canonical and give Claude Code its expected filename via a symlink:

```sh frame="terminal"
mv CLAUDE.md AGENTS.md
ln -s AGENTS.md CLAUDE.md
git add AGENTS.md CLAUDE.md && git commit -m "Add AGENTS.md"
```

One source of truth; every agent on the team, whatever the vendor, reads the same instructions.

## Editing in-session

When the file drifts, you don't need to leave the conversation:

```
/memory
```

opens the memory file for editing directly.

:::success
**✓ Checkpoint.** Start a **fresh** session and ask: *"What test command should you use in this repo, and which directories are off-limits?"* The agent should answer from your file, without searching. If it searches, the information is missing or buried.
:::

## Exercises

1. **The lie detector.** Add a deliberately wrong build command, start a fresh session, and ask the agent to build. Watch it trust your file. Fix it. Lesson: AGENTS.md is authoritative, so keep it true.
2. **Monorepo scoping.** Create `packages/api/AGENTS.md` with one API-specific rule. Confirm the agent applies it when working in that package.
3. **The audit.** For each line, ask: "would the agent get this wrong without it?" Delete every line where the answer is no.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Agent ignores an instruction | Buried in prose | Make it a short bullet under a clear heading |
| File ballooning past ~100 lines | Procedure creep | Move procedures to skills (Part 3) |
| Other agents don't pick it up | Tool reads a different filename | Keep AGENTS.md canonical; symlink the vendor name |
| /init wrote nothing useful | Empty or unusual repo | Write it by hand; /init is a bootstrapper, not a requirement |
