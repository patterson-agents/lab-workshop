---
title: "Tutorial 04 - Plugins: packaging and distribution"
description: "Module 04 of the workshop track: bundling skills, hooks, and configuration into a shareable plugin."
---


**Module 04 · ~20 minutes · hands-on**

A skill in `.claude/skills/` serves one repo. A **plugin** packages skills (plus hooks, subagents, MCP configs, even LSP servers) into a versioned, namespaced unit you can install anywhere and share with anyone. The rule of thumb: start standalone, convert to a plugin when you want to share.

> **Vendor note.** Plugins and marketplaces are Claude Code mechanisms. The *contents* (skills, MCP configs) remain portable standards; the packaging is vendor-specific.

## Prerequisites

- Tutorial 03 completed (you have at least one skill worth sharing)

## Part A · Build one

### 1. Scaffold

```
$ mkdir -p team-standards/.claude-plugin
$ mkdir -p team-standards/skills
```

**The #1 structural rule:** only `plugin.json` lives inside `.claude-plugin/`. Every component directory (skills/, hooks/, agents/…) sits at the plugin **root**. Getting this backwards is the most common plugin bug.

### 2. Manifest

```json
// team-standards/.claude-plugin/plugin.json
{
  "name": "team-standards",
  "description": "Acme engineering conventions: money handling, review rules.",
  "version": "0.1.0",
  "author": { "name": "Platform Team" }
}
```

`name` is the namespace. `version` is optional: omit it and every git commit ships (SHA-versioned); pin semver for deliberate releases.

### 3. Move your skill in

```
$ cp -r .claude/skills/money-handling team-standards/skills/
```

### 4. Test locally

```
$ claude --plugin-dir ./team-standards
> /skills
```

Expected: the skill now appears namespaced as `team-standards:money-handling`. Namespacing is the point: no conflicts with anyone else's `/deploy`. While iterating, `/reload-plugins` picks up changes without a restart.

### 5. Validate

```
$ claude plugin validate ./team-standards
```

## Part B · Install from marketplaces

### 6. Browse the official catalog

```
> /plugin
```

The official marketplace is available out of the box. Three categories worth knowing:

- **LSP plugins** (`pyright-lsp`, `gopls-lsp`, `typescript-lsp`…): the agent sees type errors after every edit without running the compiler, and navigates by symbol instead of grep. Requires the language server binary on your PATH.
- **Integrations**: bundled MCP servers (`github`, `linear`, `sentry`, `figma`, …).
- **Workflows**: `commit-commands`, `pr-review-toolkit`, `code-review` (the replacement for the deprecated `/review` built-in).

### 7. Install one, with scope

```
> /plugin install github@claude-plugins-official
```

Scopes: **user** (default; all your projects), **project** (written to `.claude/settings.json`, shared with the team via VCS), **local** (this repo, just you). Admins can push **managed** plugins org-wide.

### 8. Team distribution without a marketplace

Commit `extraKnownMarketplaces` to `.claude/settings.json`, or point at a git repo directly:

```
> /plugin marketplace add acme-org/claude-plugins
```

Teammates get a trust prompt on next launch, then install from your catalog.

## Part C · Beyond skills (survey)

A plugin can carry six more component types, each a pointer for later rather than today's exercise:

| Component | File | What it adds |
|---|---|---|
| Hooks | `hooks/hooks.json` | Shell/HTTP/LLM checks at ~30 lifecycle events (PreToolUse can block) |
| Subagents | `agents/*.md` | Specialized agents with their own tools and model |
| MCP servers | `.mcp.json` | Pre-configured connections, start on enable |
| LSP | `.lsp.json` | Live diagnostics + code navigation |
| Monitors | `monitors/monitors.json` | Background processes whose output reaches the agent |
| PATH tools | `bin/` | Executables available to Bash while enabled |

Path rule for anything inside the plugin: use `${CLAUDE_PLUGIN_ROOT}`, because the install location changes on update.

## ✓ Checkpoint

`claude plugin list` shows your plugin; your skill responds at its namespaced name; `claude plugin details team-standards` shows the token-cost inventory (always-on vs on-invoke). Read it and confirm nothing unexpected is always-on.

## Exercises

1. **Ship it.** Push `team-standards` to a git repo, add it as a marketplace, and install it the way a teammate would. Note every prompt they will see.
2. **LSP upgrade.** Install the LSP plugin for your language and make an edit that introduces a type error. Watch the agent see and fix it in the same turn.
3. **Version bump.** Change the skill, ship it both ways (semver bump vs SHA-versioned), and articulate which your team wants for standards (hint: deliberate releases).

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Components not found | Dirs inside `.claude-plugin/` | Only plugin.json goes there; move components to root |
| Skill name collision | Two plugins, same skill name | Namespaces prevent this; invoke the qualified name |
| Changes not appearing | Stale session | `/reload-plugins`; cache clear: `rm -rf ~/.claude/plugins/cache` |
| Hook script silently dead | Not executable | `chmod +x`; check the `/plugin` Errors tab |
| LSP plugin does nothing | Server binary missing | Install the language server separately; it's not bundled |
| Marketplace removed, plugins gone | Removing a marketplace uninstalls its plugins | Re-add the marketplace |

**Security note:** plugins execute arbitrary code with your privileges. The official marketplace is curated; community and git-sourced plugins deserve the same scrutiny as any dependency you `npm install`.
