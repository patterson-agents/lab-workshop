---
type: lesson
title: Build a Plugin
focus: /team-standards/.claude-plugin/plugin.json
---

# Build a plugin

A skill in `.claude/skills/` serves one repo. A **plugin** packages skills (plus hooks, subagents, and MCP configs) into a versioned, namespaced unit you can install anywhere. Rule of thumb: start standalone, convert when you want to share across repos.

:::info
**Vendor note.** Plugins and marketplaces are Claude Code mechanisms. The *contents* (skills, MCP configs) remain portable standards; the packaging is vendor-specific.
:::

## The #1 structural rule

Only `plugin.json` lives inside `.claude-plugin/`. Every component directory (`skills/`, `hooks/`, `agents/`) sits at the plugin **root**. Getting this backwards is the most common plugin bug, per the official docs. The file tree in the editor shows the correct shape.

In the manifest: `name` is the namespace; `version` pins releases (omit it and the git SHA versions every commit).

## The dev loop

```sh frame="terminal"
claude plugin init team-standards        # scaffold (or build by hand)
claude --plugin-dir ./team-standards     # load from disk for this session
claude plugin validate ./team-standards  # check structure before sharing
```

Inside the session, confirm the skill now appears **namespaced**:

```
/skills        →  team-standards:money-handling
```

Namespacing is the point: no collisions with anyone else's `/money-handling`. While iterating, `/reload-plugins` picks up changes without a restart.

:::success
**✓ Checkpoint.** Your skill responds at its namespaced name, and `claude plugin details team-standards` shows nothing unexpected in the always-on token column.
:::

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Components not found | Dirs inside `.claude-plugin/` | Only plugin.json goes there; move components to root |
| Changes not appearing | Stale session | `/reload-plugins`; cache: `rm -rf ~/.claude/plugins/cache` |
| Hook script silently dead | Not executable | `chmod +x`; check the `/plugin` Errors tab |
