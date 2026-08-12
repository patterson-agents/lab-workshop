---
name: deploy
description: Deploy the current branch to staging. Use only when explicitly asked to deploy.
disable-model-invocation: true
argument-hint: "<environment>"
---

Deploy the current branch. Run exactly this sequence — do not modify or reorder:

1. `bun run build`
2. `bun test` — abort on any failure
3. `./scripts/deploy.sh $ARGUMENTS`

If any step fails, stop and report the failing step's output. Never retry
the deploy script automatically.
