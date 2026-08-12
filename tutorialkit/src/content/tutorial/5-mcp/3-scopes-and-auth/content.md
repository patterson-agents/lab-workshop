---
type: lesson
title: Scopes, Auth & Hygiene
focus: /.mcp.json
---

# Scopes, auth & hygiene

## Who gets this server?

| Scope | Lives in | Who sees it |
| --- | --- | --- |
| `local` (default) | `~/.claude.json`, under this project | You, this project |
| `project` | `.mcp.json` at repo root (**commit it**) | The whole team, approval-gated |
| `user` | `~/.claude.json`, top level | You, every project |

Scope is fixed at add time: changing it means remove + re-add with `--scope`.

## A committed .mcp.json carries no secrets

The file in the editor shows the pattern: `${VAR}` expansion (with `${VAR:-default}` supported) keeps keys out of version control. Teammates get an approval prompt before anything launches; `claude mcp reset-project-choices` re-prompts after a rejection.

## OAuth servers

```sh frame="terminal"
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

Then in-session: `/mcp` → select the server → **Authenticate** → browser flow. Tokens are stored securely and auto-refresh.

## The context bill and the trust bill

- **Context:** Tool Search is on by default; full schemas load on demand, not at startup. Output is capped (`MAX_MCP_OUTPUT_TOKENS`, default 25k). Cheapest mitigation: remove servers you stopped using. Run `/context` and find the MCP segment.
- **Trust:** a server that fetches external content (web pages, tickets, emails) can carry **prompt injection** in that content. Treat server trust like dependency trust; prefer official and curated servers for anything that touches credentials.

:::success
**✓ Checkpoint.** A remote and a local server both `✓ Connected`; one tool exercised from each; you can state where `local` vs `project` vs `user` config lands on disk.
:::

## Exercise: the copy-paste audit

List the three systems you most often copy-paste from into an agent (tickets, logs, DB rows…). Check the official integration plugins and the registry for matching servers; add the best one with the right scope. That list is your server shortlist, not whatever's trending.
