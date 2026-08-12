---
title: "Lesson plan and presenter's guide"
description: "Presenter's guide for TechDays: AI Fluency - Agentic Agents -- audience, timing, arc, and Q&A for all five modules."
---


A hands-on training for a mixed-experience engineering audience.
Five modules: **AGENTS.md · Commands · Skills · Plugins · MCP Servers**.

Reference tool: **Claude Code**. Where the underlying standard is open (AGENTS.md, Agent Skills, MCP), each module includes a vendor-agnostic note so the material transfers to Cursor, Codex, Gemini CLI, OpenCode, Copilot, and others.

---

## Audience & framing

- **Who:** engineers of mixed experience; some live in agents daily, some have never opened one. Every module starts with fundamentals before going deep.
- **Afterlife:** materials are written to be shared org-wide after the session. Slides carry full sentences, not presenter shorthand; the workbook is self-contained.
- **Mode:** hands-on. Every module ends with a checkpoint exercise from the Lab Workbook.

## Prerequisites & environment checklist

Send to attendees ahead of the session:

| # | Requirement | Verify with |
|---|---|---|
| 1 | Claude Code installed (latest) | `claude --version` |
| 2 | Authenticated | `claude` starts a session without error |
| 3 | Node 18+ (for `npx`-based installs and stdio MCP servers) | `node --version` |
| 4 | git + a scratch repository to experiment in | `git status` |
| 5 | A GitHub account (Module 5 registry demo is watch-only) | — |
| 6 | Optional: `gh` CLI for the PR-related commands | `gh --version` |

Presenter setup: a scratch repo with a real codebase (not empty; AGENTS.md and /init need something to describe), terminal font at demo size, `claude --version` confirmed against the latest docs before the session.

## Pedagogical arc

The five modules form a deliberate ladder, from *always-loaded context* to *external capability*:

1. **AGENTS.md**, the baseline: one file, always in context, and the cheapest configuration with the highest return.
2. **Commands**, the interface: what the `/` menu actually is, and the discovery that custom commands are just skills.
3. **Skills**, the core of the session: on-demand procedural knowledge and the open standard.
4. **Plugins**, distribution: how skills (and hooks, agents, MCP configs) get packaged, versioned, and shared with a team.
5. **MCP**, capability: tools and live data from outside the agent, and the only module that adds *connections* rather than *files*.

Throughout, the recurring question "**which layer does this belong in?**" By the close, attendees should be able to place any configuration need into the right layer unprompted.

---

## Module 00 — Welcome

**Goal:** shared vocabulary before any configuration talk.

Beats:
1. An agent = model + instructions + tools + context, in a loop. No magic.
2. The five extension layers, one sentence each. Always-loaded (AGENTS.md) → invoked (commands) → on-demand (skills) → packaged (plugins) → connected (MCP).
3. Ground rule: type along. Every module has a checkpoint exercise.

**Anticipated questions**
- *"Is this Claude Code specific?"* The reference tool is Claude Code; AGENTS.md, Agent Skills, and MCP are open standards adopted across vendors. Plugins and the command set are Claude Code's, but every vendor has an equivalent; the concepts transfer.
- *"Do I need to know how LLMs work?"* No. The session is about configuration, not model internals.

## Module 01 — AGENTS.md

**Goal:** every attendee can write a useful AGENTS.md and knows what does *not* belong in it.

Beats:
1. The problem: agents start every session knowing nothing about your repo's conventions.
2. AGENTS.md: one markdown file at repo root, read automatically. De facto cross-vendor standard; Claude Code reads CLAUDE.md (symlink them).
3. What goes in: build/test/lint commands, stack and conventions, house style, what NOT to touch, pointers to deeper docs.
4. What stays out: anything the agent already knows, prose essays, content better placed in an on-demand skill. Every line costs context on every session.
5. Monorepos: nested AGENTS.md, closest file wins.
6. `/init` generates a starting file; `/memory` edits it in-session.

**Anticipated questions**
- *"AGENTS.md vs README?"* README is for humans; AGENTS.md is operational instructions for an agent: exact commands, conventions, prohibitions. Overlap is fine; audience differs.
- *"How long is too long?"* If a section has grown into a procedure, move it to a skill. Rule of thumb: AGENTS.md is what *every* session needs.
- *"CLAUDE.md or AGENTS.md?"* AGENTS.md as source of truth, CLAUDE.md as a symlink, so non-Claude agents read the same file.

## Module 02 — Commands

**Goal:** fluency with the `/` menu; understanding that custom commands and skills converged.

Beats:
1. Type `/` and see two kinds of entries: built-in commands (fixed logic) and skills (prompt-based).
2. The working set worth memorizing: `/init`, `/permissions`, `/mcp`, `/context`, `/compact`, `/clear`, `/rewind`, `/model`, `/doctor`, `/skills`, `/plugin`.
3. `/context` live demo: the colored-grid view of what's eating the window. It is the best live demo in the deck.
4. Custom commands are skills: `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both produce `/deploy`. Skills win on name conflicts.
5. MCP servers can expose prompts as commands too: `/mcp__server__prompt`.

**Anticipated questions**
- *"Difference between /clear and /compact?"* /clear wipes the conversation; /compact summarizes it to free space while keeping the thread.
- *"Are commands shareable?"* That's modules 3 and 4: as skills, then as plugins.

## Module 03 — Skills · the core

**Goal:** every attendee writes, places, and triggers a skill; seniors leave with the best-practices checklist.

Beats:
1. Definition: a folder with a SKILL.md, holding instructions the agent loads *when relevant*. The key economic fact: only name + description (~100 tokens) load at startup; the body loads on activation. Contrast with AGENTS.md (always loaded).
2. Progressive disclosure: discovery → activation → execution. Three context budgets: ~100 tokens / <5k tokens / unlimited (referenced files).
3. Anatomy walk-through: frontmatter (`name` and `description`, the two that matter; description is the trigger), body, optional `scripts/` `references/` `assets/`.
4. Invocation control: default (both), `disable-model-invocation: true` (user-only: deploys, commits), `user-invocable: false` (agent-only background knowledge).
5. Arguments (`$ARGUMENTS`, named args) and dynamic context injection (`` !`git diff HEAD` `` runs *before* the model sees the prompt).
6. Scopes and precedence: enterprise > personal (`~/.claude/skills/`) > project (`.claude/skills/`). Live reload within a session.
7. Best practices (senior material): start from real expertise, not generated filler; the test "would the agent get this wrong without this line?"; gotchas sections are the highest-value content; defaults over menus; one execute-then-revise pass.
8. Bundled scripts: pinned one-off runners (`npx`/`uvx`/`bunx`), and script design for agents: no interactive prompts, structured output, idempotent, meaningful exit codes.
9. The skills.sh directory: `npx skills add <owner/repo>`, one install command across ~20 agents. Anthropic's own skill-creator and frontend-design as examples.

**Anticipated questions**
- *"Skill vs AGENTS.md section?"* Frequency. What every session needs goes in AGENTS.md; what some sessions need goes in a skill. The context bill is the deciding factor.
- *"Why isn't my skill triggering?"* The description. It's the only thing the model sees before activation; put the trigger words in it. (Workbook troubleshooting table covers this.)
- *"Can a skill call another skill?"* Skills compose through the agent: one skill's instructions can tell the agent to use another. There's no direct call mechanism.
- *"Are these prompts or programs?"* Prompts, with optional bundled programs. The skill instructs; scripts execute.

## Module 04 — Plugins

**Goal:** attendees can package a skill as a plugin, install one from a marketplace, and know the team-distribution path.

Beats:
1. The problem plugins solve: `.claude/skills/` works for one repo; plugins version, namespace, and distribute across repos and teammates.
2. Anatomy: `.claude-plugin/plugin.json` manifest + component dirs at plugin **root** (skills/, agents/, hooks/, .mcp.json, …). The #1 structural mistake: putting components inside `.claude-plugin/`.
3. Dev loop: `claude plugin init`, `claude --plugin-dir ./my-plugin`, `/reload-plugins`, `claude plugin validate`.
4. Marketplaces: official (curated, auto-available) and community; `/plugin` browse + install; scopes (user / project / local / managed).
5. What's in the official catalog worth knowing: LSP plugins (live diagnostics after every edit), integration plugins (GitHub, Linear, Sentry…), workflow plugins (commit-commands, pr-review-toolkit).
6. Versioning: semver in the manifest (deliberate releases) vs git-SHA (every commit ships).
7. Security: plugins execute arbitrary code with your privileges. Install from trusted sources; orgs can restrict via managed settings.

**Anticipated questions**
- *"Plugin vs just committing .claude/skills/?"* Same-repo team sharing: commit the folder. Cross-repo, versioned, or community sharing: plugin.
- *"Can a plugin ship an MCP server?"* Yes: a plugin can bundle .mcp.json, which is the cleanest way to hand a team a pre-configured server.
- *"Who reviews marketplace plugins?"* The official marketplace is curated by Anthropic; the community marketplace is not. Treat it like any third-party dependency.

## Module 05 — MCP Servers

**Goal:** attendees add, verify, scope, and debug an MCP server; understand context cost and the security model; see the build-and-publish path.

Beats:
1. When to reach for MCP: the moment you catch yourself copy-pasting data from another tool into the chat. Skills carry *knowledge*; MCP carries *capability* (tools, live data). They compose.
2. Anatomy of an add: `claude mcp add --transport http <name> <url>`, then the stdio form with the `--` separator. The two transports that matter (HTTP remote, stdio local; SSE deprecated).
3. Verify: `claude mcp list` and the five status symbols. First-use permission prompt.
4. Scopes: local (default, private) / project (`.mcp.json`, committed, approval-gated) / user (all your projects). Where each lands on disk.
5. OAuth: `/mcp` → Authenticate → browser flow. Demo with a real remote server.
6. Context economics: every server costs context; Tool Search loads schemas on demand; `MAX_MCP_OUTPUT_TOKENS`. Remove servers you don't use.
7. Security: an MCP server that fetches external content is a prompt-injection vector. Trust the server like you'd trust a dependency.
8. Building: the mcp-server-dev plugin, whose skills interview you and scaffold a server (the standards compose: skills build MCP servers).
9. Publishing: registry quickstart. `mcpName` in package.json, then `mcp-publisher init/login/publish`. Watch-only demo.

**Anticipated questions**
- *"MCP vs API call in a script?"* A script the agent runs is fine for one-shot reads. MCP gives typed tools, auth handling, and reuse across sessions and agents.
- *"Why is my stdio server 'failed to connect'?"* Usually the missing `--` separator, or `npx` still downloading on first run. The workbook has the full triage table.
- *"Is .mcp.json safe in version control?"* Yes, if it carries no secrets: use `${VAR}` expansion for keys; teammates get an approval prompt before anything runs.
- *"Can the agent itself be a server?"* Yes: `claude mcp serve` exposes Claude Code as an MCP server to other clients.

## Module 06 — Close

Beats:
1. The layer model, one slide: **always-loaded** (AGENTS.md) → **invoked** (commands) → **on-demand** (skills) → **packaged** (plugins) → **connected** (MCP). Which layer does X belong in?
2. Homework that compounds: add an AGENTS.md to one real repo; write one skill from a real code-review correction; add one MCP server you'll actually use.
3. Where the materials live; workbook is self-contained for self-paced completion.

---

## Materials

| Artifact | File | Use |
|---|---|---|
| Slide deck | `ai-fluency-agentic-agents.html` | Projected during session; shareable after |
| Lesson plan (this doc) | `curriculum/lesson-plan.md` + `lesson-plan.html` | Presenter prep; printable |
| Lab Workbook | `curriculum/tutorial-01…05.md` + `lab-workbook.html` | Attendee hands-on steps, checkpoints, exercises, troubleshooting |

## Presenter checklist

- [ ] `claude --version` reports current
- [ ] Scratch repo open with a real codebase
- [ ] `/context` demo rehearsed (Module 02)
- [ ] A deliberately broken skill description on hand for the Module 03 troubleshooting beat
- [ ] Remote MCP server with OAuth ready for the Module 05 demo
- [ ] Workbook link posted in the session channel
