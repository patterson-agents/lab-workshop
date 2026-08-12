---
title: Beyond Skills
---
<!-- Ported from the TutorialKit content package 2026-08-12; now canonical here. -->

# Beyond skills

A plugin can carry six component types. Today you ship skills; the rest are pointers; each is a tutorial of its own.

| Component | File | What it adds |
| --- | --- | --- |
| Skills | `skills/*/SKILL.md` | Everything from Part 3, namespaced |
| Hooks | `hooks/hooks.json` | Checks at ~30 lifecycle events; `PreToolUse` can block a call before it runs |
| Subagents | `agents/*.md` | Specialized agents with their own tools, model, and isolation |
| MCP servers | `.mcp.json` | Connections that start when the plugin is enabled (Part 5) |
| LSP | `.lsp.json` | Live diagnostics + code navigation |
| PATH tools | `bin/` | Executables available to the agent's shell while enabled |

Two path variables matter for anything inside a plugin:

- `${CLAUDE_PLUGIN_ROOT}`: the install directory. It **changes on update**; never hardcode.
- `${CLAUDE_PLUGIN_DATA}`: persistent state that survives updates.

## Versioning: two deliberate choices

- **Semver in the manifest**: you must bump to ship; consumers get deliberate releases. Right for team standards.
- **No version field**: every commit ships, SHA-versioned. Right for fast-moving internal tooling.

:::tip
**✓ Checkpoint for Part 4.** Push `team-standards` to a git repo, add it as a marketplace, and install it the way a teammate would. Note every prompt they will see; that's their onboarding experience.
:::
