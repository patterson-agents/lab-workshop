# Contributing to lab-workshop

This repo follows the same house conventions as
[`patterson-corp/CONTRIBUTING.md`](https://github.com/patterson-agents/patterson-corp/blob/main/CONTRIBUTING.md)
— conventional commits, no emoji on brand surfaces, `[TBD: …]` instead of an invented answer.
Read that document first; this one only covers what's specific to this training package.

## Repo-specific notes

- **This is a training deliverable, not a production app.** Everything is static HTML, CSS, and
  markdown — no build step, no `package.json` at the root, no framework, no test suite. See
  [README.md § What this is](README.md#what-this-is) and [AGENTS.md](AGENTS.md) for the full
  file-by-file layout.
- **`curriculum/*.md` is the source of truth** for the attendee workbook and presenter lesson
  plan — `lab-workbook.html` and `lesson-plan.html` render it at runtime via `fetch()`. Edit the
  markdown, not the rendered HTML directly.
- **This export is a subset of a larger predecessor project** — see
  [README.md § Staleness](README.md#staleness). `AGENTS.md` documents exactly what's missing
  (`archive/`, `reference/`, `screenshots/`, `.claude/skills/`).
- **Skill Studio needs a live-app screenshot.** The capture attempted during this pass came back
  blank (a single flat color, zero content) and was removed rather than committed — see
  [README.md § Screenshots](README.md#screenshots). If you're touching `skill-studio/`, capture
  it against a fully-loaded, interacted-with instance.
- **Raster brand assets are capped at 2560px wide and shipped as `.webp`**, re-encoded from the
  original export PNGs — see [README.md § Brand asset re-encode](README.md#brand-asset-re-encode-2026-08-12)
  and [REFERENCES.md](REFERENCES.md).
- **Font binaries are excluded pending a license ruling** on self-hosted Proxima Nova — see
  [README.md § Exclusions](README.md#exclusions).

## Before opening a PR

There is no build step and no test suite here — verify by hand:

```bash
npx serve .                                    # smoke-test the static pages
grep -oE '<img src="[^"]+"' README.md           # confirm every embedded image path
```
