# AGENTS.md

> [!WARNING]
> **Staleness (documented 2026-08-12).** This repository is a claude.ai/design handoff export,
> not the full predecessor project. `archive/`, `reference/`, `screenshots/`, and
> `.claude/skills/` — all described below — are **absent from this export**. Additionally:
> `uploads/` was present in the export but excluded here (reference-only per its own note in this
> file, and the `.pptx` it carries is duplicated in the `patterson-design-system` bundle); and the
> font binaries the `_ds/` note below says "all resolve" were stripped from `_ds/…/assets/fonts/`
> (licensing of self-hosted Proxima Nova is unconfirmed — see the root [README](README.md)). Treat
> every claim below about those five paths as describing the *source* project, not this checkout.
>
> **TutorialKit removed (2026-08-12).** `tutorialkit/`, `tk-app/`, `tutorialkit-preview.html`, and
> `scripts/build-tutorial.ts` are gone. `@tutorialkit/astro@1.6.0` hard-pins Astro 4, which carries
> unpatched XSS/SSRF advisories and has no upstream Astro-5+ path. The 5 parts and 18 lessons were
> ported to Starlight and are now canonical, committed content under
> `site/src/content/docs/tutorial/`, with each lesson's starter files in
> `site/public/tutorial-files/`.

Training materials for **"TechDays: AI Fluency - Agentic Agents,"** a half-day hands-on lab on
configuring AI coding agents (AGENTS.md · Commands · Skills · Plugins · MCP).

Everything here is static HTML, CSS, and markdown. There is no build step, no `package.json`, no
framework, and no test suite.

## Running it locally

Serve the project root over HTTP and open the HTML files. Any static server will do.

The workbook and lesson plan `fetch()` their markdown at runtime, so opening them from `file://`
renders blank pages. HTTP is the only requirement.

## Layout

| Path | What it is |
|---|---|
| `ai-fluency-agentic-agents.html` + `.css` + `ai-fluency-tweaks.jsx` | The projected slide deck, 35 slides, Patterson light + navy themes |
| `ai-fluency-executive-deck.html` | Executive pitch deck, 6 slides |
| `executive-deck-template.html` | Unbranded 6-slide scaffold for spinning up a new executive deck |
| `techdays-executive-meeting.html` | Executive meeting deck, 7 slides; the one file that uses the Patterson design system stylesheet directly |
| `lab-workbook.html` + `lab-workbook-app.js` | Attendee workbook; renders `curriculum/tutorial-0*.md` |
| `lesson-plan.html` | Presenter guide; renders `curriculum/lesson-plan.md` |
| `skill-studio/` | Self-contained "Patterson — Skill Studio" companion app; carries its own copy of the logo and a `ds-base.js` design-system shim |
| `deck-stage.js`, `tweaks-panel.jsx`, `image-slot.js` | Shared components: slide staging, the presenter tweaks panel, and the image placeholder used by the meeting deck |
| `curriculum/` | **Source of truth for all workbook and lesson-plan prose** |
| `site/` | Astro/Starlight site. `src/content/docs/tutorial/` holds the 5 parts and 18 lessons; `public/tutorial-files/` holds each lesson's starter files |
| `assets/brand/` | Patterson logos (navy / white / sky / square), wave background, value-prop image |
| `reference/` | Background research, plus predecessor-project material — see `archive/README.md` |
| `screenshots/` | Visual QA baseline, one or more per deliverable. Referenced by nothing; kept so a reviewer can tell whether a change broke a layout |
| `archive/` | **A different, superseded project.** Read `archive/README.md` before assuming otherwise |
| `uploads/` | Third-party and user-supplied material carried along for reference. Not part of any deliverable |

## The design system

Five files reference the Patterson design system at a single normalized path:

```
_ds/patterson-design-system-3534f94f-a7e6-4612-81d4-6e830716f07d/
```

That folder is **bound in this project** (Proxima Nova, the icon font, the token stylesheets and
`_ds_bundle.js` all resolve). If it goes missing, Proxima Nova falls back to the stack's next font
and `techdays-executive-meeting.html` loses its stylesheet.

Files carrying that path: `ai-fluency-agentic-agents.css`, `lab-workbook.html`,
`lesson-plan.html`, `skill-studio/ds-base.js`, `techdays-executive-meeting.html`. If a re-apply
binds to a different folder name, those five are the complete list to repoint.

One of them is relative to somewhere other than this project root, and is already correct:
`skill-studio/ds-base.js` uses `../_ds/…` because it loads from a subdirectory.

Note that the slide deck runs its own visual system (Terminal / Paper themes, oklch accent) defined
in `ai-fluency-agentic-agents.css`; it consumes the design system for typography only. The
`designing-agents-lab` skill has the palette and type scale.

## Conventions

- Root HTML deliverables are kebab-case (`lab-workbook.html`).
- Workbook and lesson-plan prose lives in `curriculum/*.md`. Edit the markdown, not the HTML wrappers.
- Tutorial lesson prose lives in `site/src/content/docs/tutorial/**` and is edited in place. The
  sidebar autogenerates from the folder, so adding a lesson needs no config change.
- Each lesson's starter files live in `site/public/tutorial-files/<part>/<lesson>/**`, and a lesson
  often starts where the previous one ended. Identical files across two lessons are intentional,
  not duplication.
- American spelling. Em-dashes are rationed: one or two per document, deliberately. No "not X but Y"
  antithesis stacking, no sentence fragments as rhetoric. The prose was audited to this standard;
  keep it there.
- Significant revision of a deliverable: keep the live filename stable.

## Do not

- Do not edit `archive/` or `uploads/`. Both are historical records, and `archive/` documents content
  that never made it into the current curriculum.
- Do not commit generated bundles. Single-file "standalone" exports and `.docx` conversions are
  outputs; regenerate them after the design system is applied rather than storing them here.
- Do not rename root deliverables without updating the materials table in `curriculum/lesson-plan.md`.
- Do not add speaker notes, slides, or curriculum sections without being asked.

## Deeper procedures

Procedures live in skills under `.claude/skills/`, not here:

| Skill | Covers |
|---|---|
| `designing-agents-lab` | The visual system: palette, type scale, slide frame |
| `implementing-agents-lab` | Architecture and editing mechanics |
| `creating-agents-lab-curriculum` | Workbook and lesson-plan content |
| `creating-tutorials-for-lab` | Tutorial lessons |
| `writing-style` | The prose standard the material was audited against |

`HANDOFF.md` is a one-shot prompt written to hand this repository to a Claude Code session that
would stand up a real TutorialKit scaffold and deploy it. **That plan was abandoned on 2026-08-12**
(see the staleness warning above); the lessons ship from Starlight instead. `HANDOFF.md` is kept as
a historical record, not a task brief, and `AGENTS.md` wins wherever the two disagree.
