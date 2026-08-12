---
type: lesson
title: Your First Server
editor: false
---

# Your first server

Everything so far has been *files*: knowledge the agent reads. MCP (Model Context Protocol) adds *connections*: typed tools and live data from systems outside the agent. The signal that you need one is catching yourself **copy-pasting data from another tool into the chat**. Skills carry knowledge; MCP carries capability. They compose, and this part ends with skills that build MCP servers.

:::info
**Vendor note.** MCP is an open standard ([modelcontextprotocol.io](https://modelcontextprotocol.io)) supported by most agent vendors. The commands below are Claude Code's CLI; the server you connect to is portable.
:::

## Add a remote server

From your shell (not inside a session):

```sh frame="terminal"
claude mcp add --transport http claude-code-docs https://code.claude.com/docs/mcp
```

Anatomy: `add` · transport (`http` for remote URLs) · a name you pick · the URL.

## Verify

```sh frame="terminal"
claude mcp list
```

Five statuses: `✓ Connected` · `! Needs authentication` · `✗ Failed to connect` · `✗ Connection error` · `⏸ Pending approval`.

## Use it

```
> Use the claude-code-docs server to look up what MCP_TIMEOUT does.
```

First tool use prompts for permission; tool calls are labeled with the server name.

:::success
**✓ Checkpoint.** The docs server shows `✓ Connected` and answered a question from live documentation: content the model couldn't know on its own.
:::

:::tip
Every connected server costs context. When the experiment is over: `claude mcp remove claude-code-docs`.
:::
