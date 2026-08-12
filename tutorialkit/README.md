# TechDays: AI Fluency - Agentic Agents — TutorialKit Package

Drop-in content for a [TutorialKit](https://tutorialkit.dev) project. Five parts mirror the five training modules: **AGENTS.md · Commands · Skills · Plugins · MCP Servers**.

## How to use

1. Scaffold a TutorialKit project:

   ```sh
   npm create tutorialkit@latest ai-fluency-agentic-agents
   ```

2. Replace the generated content and theme with this package:

   ```sh
   rm -rf ai-fluency-agentic-agents/src/content/tutorial
   cp -r tutorialkit/src/content/tutorial ai-fluency-agentic-agents/src/content/tutorial
   cp -r tutorialkit/src/templates/scratch ai-fluency-agentic-agents/src/templates/scratch
   cp tutorialkit/theme.css ai-fluency-agentic-agents/theme.css
   ```

3. (Optional) Replace `public/logo.svg` / `public/logo-dark.svg` with your org's mark.

4. Run it:

   ```sh
   cd ai-fluency-agentic-agents && npm install && npm run dev
   ```

## Design notes

- **The terminal in these lessons is a scratchpad, not the lab bench.** Claude Code runs on the learner's *machine*, not inside the browser's WebContainer. Lessons show commands as copyable code blocks; the embedded editor displays the artifact files (AGENTS.md, SKILL.md, plugin.json, .mcp.json) and the Solve button reveals completed versions where a lesson has one.
- **Structure**: parts → lessons (chapters omitted — the hierarchy is flat enough not to need them). Lesson numbering controls order; folder names are URL slugs.
- **Theme**: `theme.css` carries the training's two palettes — "Terminal" (dark, default feel of the deck) and "Paper" (light). TutorialKit's built-in theme toggle switches between them.
- **Checkpoints** map to `:::success` callouts, **vendor notes** to `:::info`, **gotchas** to `:::warn`.

## Related materials in this project

- `ai-fluency-agentic-agents.html` — the projected slide deck
- `curriculum/lesson-plan.md` — presenter's guide (timing, arc, Q&A)
- `curriculum/tutorial-0*.md` — the workbook source the lessons were adapted from
