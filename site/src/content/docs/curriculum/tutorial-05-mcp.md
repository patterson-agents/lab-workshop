---
title: "Tutorial 05 - MCP servers: tools and live data"
description: "Module 05 of the workshop track: connecting the agent to tools and data outside the repository."
---


**Module 05 · ~30 minutes · hands-on**

Everything so far has been *files*: knowledge the agent reads. MCP (Model Context Protocol) adds *connections*: typed tools and live data from systems outside the agent. The signal that you need one is catching yourself copy-pasting data from another tool into the chat. Skills carry knowledge; MCP carries capability. They compose, and this tutorial ends with skills that build MCP servers.

> **Vendor note.** MCP is an open standard (modelcontextprotocol.io) supported by most agent vendors. Commands below are Claude Code's CLI; the server you connect to is portable.

## Prerequisites

- Claude Code authenticated; Node 18+ for the stdio example
- Tutorials 01–04 give context but are not required

## Part A · First server (remote HTTP)

### 1. Add

From your shell (not inside a session):

```
$ claude mcp add --transport http claude-code-docs https://code.claude.com/docs/mcp
```

Anatomy: `add` · transport (`http` for remote URLs, `stdio` for local processes; SSE is deprecated) · a name you pick · the URL.

### 2. Verify

```
$ claude mcp list
```

The five statuses: `✓ Connected` · `! Needs authentication` · `✗ Failed to connect` · `✗ Connection error` · `⏸ Pending approval`.

### 3. Use

```
$ claude
> Use the claude-code-docs server to look up what MCP_TIMEOUT does.
```

Expected: a permission prompt on first tool use (tool calls are labeled with the server name), then an answer sourced from the live docs.

## Part B · Local stdio server

### 4. Add Playwright (browser automation, no account needed)

```
$ claude mcp add playwright -- npx -y @playwright/mcp@latest
```

Two details cause most failures: there is no `--transport` flag (stdio is the default for commands), and everything after the bare `--` separator is the server's command line, not Claude's flags.

```
> Use playwright to open https://example.com and tell me the page title.
```

First `claude mcp list` check may show *Failed to connect* while `npx` downloads the package; retry once.

## Part C · Scopes, auth, and hygiene

### 5. Scopes: who gets this server?

| Scope | Where it lives | Who sees it |
|---|---|---|
| `local` (default) | `~/.claude.json`, under this project | you, this project |
| `project` | `.mcp.json` at repo root (**commit it**) | the whole team (approval-gated) |
| `user` | `~/.claude.json`, top level | you, every project |

Scope is fixed at add time: changing it means remove + re-add with `--scope`. A committed `.mcp.json` must carry no secrets: use `${VAR}` / `${VAR:-default}` expansion; teammates get an approval prompt before anything launches.

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": { "Authorization": "Bearer ${GITHUB_PAT}" }
    }
  }
}
```

### 6. OAuth servers

```
$ claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
$ claude            # then, in-session:
> /mcp              # select sentry → Authenticate → browser flow
```

Tokens are stored securely and auto-refresh.

### 7. The context bill

Every connected server costs context. Run `/context` and find the MCP segment. Mitigations: Tool Search (on by default; full schemas load on demand), `MAX_MCP_OUTPUT_TOKENS` (default 25k), and the cheapest of all, `claude mcp remove` for servers you stopped using.

**Security:** a server that fetches external content (web pages, tickets, emails) can carry prompt injection in that content. Treat server trust like dependency trust; prefer official/curated servers for anything that touches credentials.

## Part D · Building and publishing (survey + watch-me)

### 8. Skills that build servers

```
> /plugin install mcp-server-dev@claude-plugins-official
> Build an MCP server for our internal weather API
```

The plugin is three composing *skills* (`build-mcp-server`, `build-mcp-app`, `build-mcpb`) that interview you (what it connects to, who uses it, the auth model) and then scaffold the right deployment shape: remote HTTP for cloud APIs, MCPB bundle for local machine access, stdio for prototypes. The standards compose: skills encode the expertise, MCP is the artifact.

### 9. Publishing to the registry (watch-only)

The MCP Registry holds metadata, not code; packages still live on npm:

```
$ npm publish --access public        # package.json carries "mcpName": "io.github.you/weather"
$ mcp-publisher init                  # writes server.json
$ mcp-publisher login github          # device-code flow
$ mcp-publisher publish
```

## ✓ Checkpoint

`claude mcp list` shows a remote and a local server, both `✓ Connected`; you've exercised one tool from each; you can state where `local` vs `project` vs `user` config lands on disk; `/context` shows you what the servers cost.

## Exercises

1. **The copy-paste audit.** List the three systems you most often copy-paste from into an agent (tickets, logs, DB rows…). Check the official integrations and the registry for servers; add the best match with the right scope.
2. **Team server.** Write a `.mcp.json` for your repo with env-var expansion for the secret, commit it, and document the one-line setup (`export GITHUB_PAT=…`) in AGENTS.md.
3. **Tool inventory.** With two servers connected, ask the agent what tools it has from each. Then disconnect one and confirm the tools disappear.
4. **(Stretch) Build one.** Use mcp-server-dev to scaffold a server for any internal HTTP API and connect to it over stdio.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `No MCP servers configured` | Added in a different project (local scope) | Re-add with the right `--scope`, or run from the original directory |
| `✗ Failed to connect` (http) | URL / network | `curl -I <url>`: 401/403 means it's up but needs auth; nothing means network |
| `✗ Failed to connect` (stdio) | Command broken or missing `--` | Run the command directly in your shell; check the separator |
| Hangs then timeout | Slow server start | `MCP_TIMEOUT=60000 claude` |
| `already exists` | Name collision in another scope | `claude mcp remove <name> --scope <scope>`, then re-add |
| Connects, but no tools | Server-side missing env var / key | Check the server's own requirements; `claude mcp get <name>` |
| `.mcp.json` edits ignored | Read at session start | Restart the session |
| Project server never prompts | Previously rejected | `claude mcp reset-project-choices` |
