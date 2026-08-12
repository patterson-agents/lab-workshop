---
type: lesson
title: What Goes In, What Stays Out
focus: /AGENTS.md
---

# What goes in, what stays out

Every line of AGENTS.md costs context in **every** session. The discipline of keeping it short matters more than any particular section heading.

## Belongs in

- **Commands**: build, test, lint, *exactly* as your team runs them
- **Conventions** an outsider couldn't guess: internal libraries to prefer, naming rules, "money is integer cents"
- **Prohibitions**: directories never to touch, dependencies never to add silently
- **Pointers** to deeper docs, so detail lives elsewhere

## Stays out

- Anything the model already knows: what a PDF is, how git works
- Prose essays and project history
- **Procedures.** The moment a section becomes step-by-step instructions for an *occasional* task, it belongs in a skill (Part 3), paid for only when used

## Your turn

Edit the `AGENTS.md` in the editor: add one convention and one prohibition that are true of a repo you actually work on. Then audit what's there: delete any line the agent would get right anyway.

## Monorepos

Nested `AGENTS.md` files scope instructions per package; the **closest file wins**. Keep the root file global, push specifics down:

```text
repo/
├── AGENTS.md                  ← global: stack, top-level commands
└── packages/
    └── api/
        └── AGENTS.md          ← API-specific rules only
```

:::warn
**Gotcha:** the agent trusts this file completely. An AGENTS.md that lies (a stale build command, a renamed directory) is worse than none. When it drifts, fix it in-session with `/memory`.
:::
