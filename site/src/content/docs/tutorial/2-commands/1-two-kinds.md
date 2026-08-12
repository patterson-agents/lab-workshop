---
title: Two Kinds Behind the Slash
---
<!-- Ported from the TutorialKit content package 2026-08-12; now canonical here. -->

# Two kinds behind the slash

Everything behind the `/` key in Claude Code is one of two things:

- **Built-in commands**: fixed logic shipped with the tool, like `/clear`, `/permissions`, `/mcp`, `/config`. They manage the session and the machinery around it. You can't write these.
- **Skills**: prompt-based and extensible, from the bundled `/debug` and `/batch` to every custom command you will ever write. These are the subject of Part 3.

Open a session and type `/` with nothing after it. Scroll the list; type a few letters to filter. Entries vary by platform and plan, so your list will not exactly match a colleague's.

:::note
A third source appears once you connect MCP servers (Part 5): servers can expose prompts as commands in the form `/mcp__server__prompt`, discovered dynamically.
:::

:::caution
`/review` was deprecated as a built-in. Its replacement is a plugin: `claude plugin install code-review@claude-plugins-official`, a preview of how Part 4 distributes functionality.
:::
