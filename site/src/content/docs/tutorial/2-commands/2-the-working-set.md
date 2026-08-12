---
title: The Working Set
---
<!-- Ported from the TutorialKit content package 2026-08-12; now canonical here. -->

# The working set

Nine commands are worth memorizing; run each one now in a session on your machine:

| Command | What it does | Why it matters |
| --- | --- | --- |
| `/context` | Colored-grid visualization of the context window | *The* tool for understanding what your config costs |
| `/permissions` | Allow / ask / deny rules for tools | The guardrail surface; previews Parts 4–5 |
| `/mcp` | MCP server status + authentication | Part 5 home base |
| `/compact` | Summarize the conversation to free space | Use at natural breakpoints; takes optional focus instructions |
| `/clear` | Wipe history, start fresh | Cheaper than /compact when you don't need the thread |
| `/rewind` | Roll back conversation and/or code | The undo button most people don't know exists |
| `/model` | Switch model / configure effort | — |
| `/skills` | List available skills | Part 3 home base |
| `/doctor` | Diagnose installation and settings | First stop when anything misbehaves |

…plus `/init` and `/memory` from Part 1.

## Read your context bill

Run `/context` immediately after starting a fresh session in your repo. Identify the segments: system prompt, your AGENTS.md, skill descriptions, MCP tools. Everything you add in Parts 3–5 shows up in this view, which makes the rest of the course's trade-offs concrete.

:::tip
`/clear` vs `/compact`: clear wipes the conversation entirely; compact summarizes it to free space while keeping the thread. Reach for compact at natural breakpoints in long sessions.
:::
