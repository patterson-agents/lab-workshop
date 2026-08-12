# HANDOFF.md — Claude Code handoff

> [!WARNING]
> **Superseded 2026-08-12 — do not execute this brief.** It asks for a real TutorialKit scaffold.
> TutorialKit was retired because `@tutorialkit/astro@1.6.0` hard-pins Astro 4, which carries
> unpatched XSS/SSRF advisories with no upstream Astro-5+ path. The 5 parts and 18 lessons were
> ported to Astro/Starlight and now ship from `site/` as committed content. This file is kept as a
> historical record of the original plan. See [AGENTS.md](AGENTS.md) for the current state.

A one-shot prompt for a Claude Code session. Paste the **PROMPT** section into a fresh Claude Code conversation with this directory as the working directory. Once the build is verified, this file can be deleted or moved to `archive/`.

---

## PROMPT

You are taking over the "TechDays: AI Fluency - Agentic Agents" training lab. Read `AGENTS.md` first; it carries the layout, conventions, and prohibitions, and it points at four skills in `.claude/skills/` with the deeper procedures. When this document and `AGENTS.md` disagree, `AGENTS.md` wins.

### What you are starting from

The HTML files in this repository are **finished design references, not production code**. They are high-fidelity: typography, spacing, color tokens, slide layouts, and copy are final and were audited for prose quality. Your task is to productionize *around* them, not to redesign them.

| Artifact | Status |
|---|---|
| `ai-fluency-agentic-agents.html` + `.css` + `ai-fluency-tweaks.jsx` | Final deck, 35 slides, Patterson light + navy themes |
| `curriculum/*.md` | Final source of truth for workbook + lesson plan prose |
| `lab-workbook.html`, `lesson-plan.html` | Final shells that fetch and render the curriculum markdown |
| `tutorialkit/` | Final drop-in content package: 5 parts, 18 lessons, `_files`, theme |
| `tutorialkit-preview.html` + `tk-app/` | Browser-only preview of that package; a stopgap, replaced by the real scaffold below |
| `archive/`, `reference/`, `uploads/` | Historical / read-only; not part of the build |

### Goal

Stand up the real interactive course and a deployable home for all session materials:

1. **Scaffold TutorialKit** (`npm create tutorialkit@latest ai-fluency-agentic-agents`) and install the content package exactly as `tutorialkit/README.md` prescribes (replace generated tutorial content, copy the `scratch` template and `theme.css`).
2. **Verify every lesson** renders in the real scaffold: 18 lessons across 5 parts, frontmatter `focus` files opening in the editor, `:::` callouts styled, the two-palette theme working with TutorialKit's toggle.
3. **Host the static materials alongside it**: the deck, workbook, and lesson plan served from the same deployment, linked from a small index page. They must be served over HTTP (the wrappers `fetch()` markdown; `file://` renders empty).
4. **Wire deployment** (static hosting of your choice; Cloudflare Pages or similar). One URL for the course, one for the deck, one for the workbook, one for the lesson plan.

### Constraints

- Markdown stays the source of truth. Do not fork curriculum prose into the TutorialKit copies beyond what already exists; factual changes propagate to all three surfaces (see the `creating-agents-lab-curriculum` skill).
- The visual system is settled. Match `ai-fluency-agentic-agents.css` tokens if you build any new chrome (index page, nav). The `designing-agents-lab` skill has the palette and type scale.
- The browser terminal in lessons is a scratchpad; Claude Code runs on the learner's machine. Do not script lesson commands into the WebContainer.
- Keep kebab-case filenames for anything user-facing.
- Prose standard: American spelling, em-dashes rationed, no antithesis stacking. New copy (index page, deploy notes) is held to the same standard as the audited material.

### Verification

- All 18 lessons load in the scaffolded TutorialKit dev server with no console errors.
- The deck plays start to finish with keyboard nav; both themes; tweaks panel works.
- Workbook and lesson plan render all five tutorials / all modules over HTTP.
- A fresh clone + documented setup commands reproduce the deployment.

### Checkpoint discipline

After the TutorialKit scaffold runs locally with the content installed (step 2), **stop and check in** before wiring deployment. Show what works, what surprised you, and any TutorialKit version drift from the README's instructions (the scaffold's API may have moved since the package was written; the content format is the stable contract).

---

End of prompt.
