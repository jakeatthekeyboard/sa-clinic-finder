# Git hooks (versioned)

This directory holds the project's git hooks **tracked in git** so edits are
reviewable and propagate to every clone — unlike the historical un-versioned
`.git/hooks/pre-push`, which lived only on one machine and silently drifted.

## Activate (run once per clone)

```bash
git config core.hooksPath .githooks
```

`core.hooksPath` is stored in `.git/config` (not tracked), so each fresh clone
runs that one line once. After that, `git push` uses `.githooks/pre-push`.

## What `pre-push` does

Blocks the push unless data-integrity tests pass, the site builds, and the
**dead-link scan** (`tools/dead-link-scan.py` in the pipeline repo) finds zero
broken internal links over the built output — catching inline-editorial 404s
that unit tests miss.
