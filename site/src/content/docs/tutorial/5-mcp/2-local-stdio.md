---
title: Local Servers (stdio)
---
<!-- Ported from the TutorialKit content package 2026-08-12; now canonical here. -->

# Local servers: stdio

Remote HTTP servers cover cloud services. For local processes (browsers, filesystems, databases) the transport is **stdio**: Claude Code launches the server as a child process. (A third transport, SSE, is deprecated.)

## Add Playwright

Browser automation, no account needed (Node 18+):

```sh
claude mcp add playwright -- npx -y @playwright/mcp@latest
```

Two details cause most stdio failures:

- **No `--transport` flag**: stdio is the default when you pass a command
- **The bare `--` separator**: everything after it is the *server's* command line, not Claude's flags. Forgetting it is the #1 add-time failure.

## Use it

```
> Use playwright to open https://example.com and tell me the page title.
```

:::caution
First `claude mcp list` check may show *Failed to connect* while `npx` downloads the package; retry once before debugging.
:::

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `No MCP servers configured` | Added in a different project (local scope) | Re-add with the right `--scope`, or run from the original directory |
| `✗ Failed to connect` (http) | URL / network | `curl -I <url>`: 401/403 means up-but-needs-auth; nothing means network |
| `✗ Failed to connect` (stdio) | Broken command or missing `--` | Run the command directly in your shell; check the separator |
| Hangs then timeout | Slow server start | `MCP_TIMEOUT=60000 claude` |
| Connects, but no tools | Server-side missing env var / key | `claude mcp get <name>`; check the server's own requirements |
