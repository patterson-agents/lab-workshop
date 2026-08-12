---
description: Summarize my recent work as a standup update. Use when asked for a standup.
argument-hint: ""
---

Summarize the last day of git history by the current author as a
three-bullet standup update: done, in progress, blocked.

!`git log --author="$(git config user.name)" --since=yesterday --oneline`
