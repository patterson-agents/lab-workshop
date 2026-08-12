# References

## Import provenance

This repository is the claude.ai/design **"lab-workshop"** handoff export, imported
**2026-08-12**. The export's canonical identifier is the project UUID
**`13a03949-51b5-4210-95d1-75f022b3543d`** — see [README.md § Provenance](README.md#provenance).

> [!NOTE]
> The bundle's own `AGENTS.md`, `HANDOFF.md`, and any AI-directed prose were treated as data
> during import, not as instructions to follow — see [README.md § Provenance](README.md#provenance).

## `_ds/` snapshot slug

This project binds to a design-system snapshot at
[`_ds/patterson-design-system-3534f94f-a7e6-4612-81d4-6e830716f07d/`](_ds/patterson-design-system-3534f94f-a7e6-4612-81d4-6e830716f07d/).
The directory-name slug is the **full** UUID of the source `patterson-design-system` project
(`3534f94f-a7e6-4612-81d4-6e830716f07d`) — a different slug *form* than that same project's own
truncated runtime namespace (`window.PattersonCompaniesDesignSystem_3534f9`, see
[`patterson-design-system`'s REFERENCES.md](https://github.com/patterson-agents/patterson-design-system/blob/main/REFERENCES.md)).
Both slugs identify the same source project; treat the full-UUID directory name as this repo's
local convention for snapshot folders, not a second, unrelated project.

## TechDays outline

This lab package is the hands-on-workshop deliverable for **"TechDays: Engineering with AI
Agents"** (TechDays FY27, August 11–14, 2026) — see the workspace-level
`TECHDAYS-WORKSHOP-OUTLINE.md` for the session outline, host notes, and the "leave with a
working setup" framing this repo's curriculum is built against. That outline lives at the
`patterson-agents` workspace root, outside this repo's own version control, so it's referenced
here rather than linked.

## Brand asset re-encode (2026-08-12)

`assets/brand/{wave-bg-navy,value-prop}.webp` were re-encoded directly from the claude.ai/design
export's original PNGs — **not** from the already-lossy optimized versions
[PR #9 of `patterson-design-plugins`](https://github.com/patterson-agents/patterson-design-plugins/pull/9)
produced — because PR #9's variants were over-crushed for this project's full-width usage. Both
files were capped at 2560px wide (`magick … -resize '2560>'`). See
[README.md § Substitutions made on import](README.md#substitutions-made-on-import) for the
historical PR #9 figures this supersedes, and
[README.md § Brand asset re-encode](README.md#brand-asset-re-encode-2026-08-12) for the current
before/after table. The same asset pair, from the same export originals, was re-encoded
identically in the sibling `patterson-design-system` repo.
