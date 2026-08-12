---
type: lesson
title: Building & Publishing
editor: false
---

# Building & publishing

## The standards compose: skills that build servers

The `mcp-server-dev` plugin is three composing *skills* that interview you (what the server connects to, who uses it, how it authenticates) and then scaffold the right deployment shape:

```
> /plugin install mcp-server-dev@claude-plugins-official
> Build an MCP server for our internal weather API
```

Deployment shapes it chooses between: **remote HTTP** for cloud APIs (zero install, OAuth works), **MCPB bundles** for local machine access without runtime setup, **stdio** for prototypes.

This is the course's full circle: skills encode the expertise, MCP is the artifact, plugins distribute both.

## Publishing to the registry

The MCP Registry holds **metadata, not code**: your package still lives on npm, with an `mcpName` field tying the two together:

```sh frame="terminal"
npm publish --access public     # package.json carries "mcpName": "io.github.you/weather"
mcp-publisher init              # writes server.json
mcp-publisher login github      # device-code flow
mcp-publisher publish
```

Verify:

```sh frame="terminal"
curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=weather"
```

:::success
**✓ Checkpoint for the course.** One question now routes everything: *which layer does this belong in?* Build commands → AGENTS.md. A review checklist on request → skill. Org-wide conventions → plugin. Reading tickets without copy-paste → MCP server.
:::

## Homework: three steps that compound

1. **One AGENTS.md** on a real repo (twenty minutes)
2. **One skill** from your last real code-review correction
3. **One MCP server** from your copy-paste audit

In that order, this week. The anti-goal: installing ten plugins you never open again.
