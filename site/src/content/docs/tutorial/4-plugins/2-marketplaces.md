---
title: Marketplaces & Scopes
---
<!-- Ported from the TutorialKit content package 2026-08-12; now canonical here. -->

# Marketplaces & scopes

A marketplace is a catalog; installing is a two-step: add the catalog, then install plugins from it. The official marketplace is available out of the box; browse it with `/plugin`.

## Three catalog categories worth knowing

- **Language servers**: `pyright-lsp`, `gopls-lsp`, `rust-analyzer-lsp`, `typescript-lsp`… The agent sees type errors after every edit without running the compiler, and navigates by symbol instead of grep. Requires the language-server binary on your PATH.
- **Integrations**: plugins that bundle a pre-configured MCP server (`github`, `gitlab`, `linear`, `sentry`, `figma`, `supabase`). The cleanest way to hand a team a connection.
- **Workflows**: `commit-commands`, `pr-review-toolkit`, `code-review` (the replacement for the deprecated `/review` built-in).

## Install with a scope

```
/plugin install github@claude-plugins-official
```

| Scope | Who gets it |
| --- | --- |
| **user** (default) | You, in all your projects |
| **project** | The team; written to `.claude/settings.json`, shared via VCS |
| **local** | This repo, just you |
| **managed** | Pushed org-wide by admins |

## Team distribution without the public marketplace

Point at a git repo directly, as your own catalog:

```
/plugin marketplace add acme-org/claude-plugins
```

Teammates get a trust prompt on next launch, then install from it. Or commit `extraKnownMarketplaces` to `.claude/settings.json` so the prompt appears automatically.

:::danger
**Security.** Plugins execute arbitrary code with your privileges. The official marketplace is curated by Anthropic; community and git-sourced plugins deserve the same scrutiny as anything you `npm install`. Orgs can restrict sources via managed settings.
:::

## Exercise

Install the LSP plugin for your primary language, make an edit that introduces a type error, and watch the agent see and fix it in the same turn, with no compile step.
