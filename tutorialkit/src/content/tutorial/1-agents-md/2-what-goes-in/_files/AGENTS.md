# AGENTS.md

## Commands
- Build: `bun run build`
- Test (single file): `bun test path/to/file.test.ts`
- Lint + fix: `bun run lint --fix`

## Conventions
- Use the internal `@acme/http` client — never raw fetch()
- All money values are integer cents, never floats

## Do not
- Do not edit files under `src/generated/` — codegen owns them
- Do not add new dependencies without flagging it in the PR description
