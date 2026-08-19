---
name: site-keeper
description: Autonomous ClinicFinder site maintenance — health checks + editorial deepening (province intros, guides, service pages). Self-throttles via keeper-log.json.
user_invocable: true
---

# ClinicFinder Site Keeper

Autonomous maintenance for clinicfinder.co.za. Pick the highest-priority task that hasn't been run recently and execute it.

## Self-Throttling

Read `ops/keeper-log.json` first. Only run if enough time has passed since the last run (default: 2.5 hours). After completing, update the log with what you did and when.

If the file doesn't exist, create it:
```json
{
  "lastRun": null,
  "editorialLastRun": null,
  "guidesWritten": [],
  "provincesWithIntros": [],
  "runIntervalHours": 2.5,
  "runs": []
}
```

## Task Priority (highest first)

### 1. Health Check (every run)

Quick non-destructive checks:
1. `curl -sI https://clinicfinder.co.za/ | head -3` — expect 200
2. `curl -sI https://clinicfinder.co.za/sitemap-index.xml | head -3` — expect 200
3. `curl -sI https://clinicfinder.co.za/robots.txt | head -3` — expect 200
4. Spot-check 3 random facility pages — expect 200
5. Spot-check 1 province page and 1 guide page — expect 200

If any fail, log the failure and stop. Do not attempt fixes — create a TODO item in the pipeline repo.

### 2. Province Editorial Intros (if < 9 provinces have intros)

Check `src/data/province-editorial.ts` for which provinces have editorial content. Write intros for provinces that lack them. Each intro: 2-3 paragraphs covering healthcare infrastructure, key hospitals, clinic density, and access challenges specific to that province. Use real data from facilities.json.

### 3. Guide Articles (rotating)

Check `src/pages/guides/` for existing guides. Write new guides on topics relevant to SA public healthcare users:
- How to find your nearest clinic
- Emergency vs non-emergency: where to go
- Children's vaccination schedule explained
- Chronic medication collection (CCMDD)
- TB treatment process
- Mental health services access

Only write 1 guide per run. Skip if all planned topics are covered.

### 4. Service Page Depth

Check `src/pages/services/` pages for content quality. Add editorial depth where pages are thin — real facility counts by province, wait time expectations, what documents to bring, common questions.

### 5. Internal Linking Audit

Check that province pages link to relevant guides, guides link back to province/service pages, and the search page is accessible from all key pages.

## Output

After each run, append to `ops/keeper-log.json`:
```json
{
  "timestamp": "2026-04-20T21:30:00+02:00",
  "task": "health-check",
  "result": "pass",
  "details": "All 6 checks pass. 1095 sitemap URLs."
}
```

## Commit and deploy

**Stage by explicit path. NEVER `git add -A`, `git add .`, `git add -u`, or `git commit -a`.**

Up to ten other sessions edit this repo concurrently while this keeper runs. A broad add
stages THEIR half-finished work into THIS run's commit, exits 0, and reports success — the
failure is completely silent. It has already happened for real (#1144): a keeper's
`git add -A src/` swept live Lemon Squeezy payment-path edits into an FDD data-quality
commit, so `git revert` on the data fix would also revert someone else's payment code, and
the commit message describes only the data fix. A second run the same week nearly committed
a working copy that would have deleted another session's edit.

Files this keeper typically writes (stage only the ones you actually changed this run):
- `src/data/province-editorial.ts`, `src/data/cities.json`
- `ops/keeper-log.json` — the run log

```bash
# 1. Stage ONLY what you changed, by name.
git add <path> [<path> ...]

# 2. Verify. The first listing is exactly what the commit in step 3 will contain,
#    because that pathspec bounds it. The second shows what ELSE is sitting in this
#    shared index right now — another session's half-finished work. It is neither
#    yours to commit nor yours to discard; the pathspec is what keeps it out.
git diff --cached --name-only -- <path> [<path> ...]
git diff --cached --name-only

# 3. Message to a file, then -F. NEVER `git commit -m` — in zsh a double-quoted -m
#    string runs backticks and expands $1, silently.
cat > /tmp/keeper-commit-msg.txt <<'MSG'
Sitekeeper: <action> for clinicfinder.co.za (YYYY-MM-DD)

<why this change was made>

Files: <the exact paths staged above>
Revert: git revert this commit
MSG
git commit -F /tmp/keeper-commit-msg.txt -- <path> [<path> ...]
# The `-- <paths>` is NOT optional (#1272). `git commit` with no pathspec commits the
# whole INDEX, and this checkout has one index shared by every session in it. An
# unpathspecced commit therefore records whatever a concurrent grind session happened
# to have staged, exits 0, and describes only your own change in the message — the
# same silent failure as `git add -A`, arriving one command later. Repeat the exact
# paths from step 1. `tools/broad-staging-check.py` in the pipeline repo enforces this,
# so it does not depend on this paragraph surviving a future edit of this file.

# 4. ONE push per run, at the END of the run — not per task section (#1300).
#    A push to this repo is one production build against a free-tier cap of 100 per
#    rolling 24h shared by all four sites and by every cron and agent. That cap has
#    been exhausted twice. On the night of 2026-07-31 the four keepers' per-section
#    pushes produced 138 builds between them (7 from this site) and exhausted both
#    the 100-deploy cap and the separate file-upload cap. Gate the push: exit 0 = push, exit 1 = DEFER (these commits
#    change nothing a reader sees). On a DEFER, hold the push, re-check later, and
#    push before the run ends — never end a run on an unpushed commit
#    (`tools/unpushed-commit-check.py` watches for that).
#    `--repo` takes a PATH, not a repo name. A bare name resolves against the
#    pipeline dir, does not exist, and the gate SOFT-SKIPS exit 0 — a fail-open
#    that reads exactly like an approval. Pass the absolute path.
python3 /Users/jake/dev/product-pipeline-1/tools/deploy-budget-gate.py --repo /Users/jake/dev/sa-clinic-finder
git pull --rebase origin master
git push origin master
```

**Foreign changes are neither yours to commit nor yours to discard.** Leave them unstaged.
If one genuinely blocks your work, `git stash push --include-untracked -- <their paths>` and
restore it when you are done; never `git checkout --` or `git restore` over another session's
working copy. If you cannot proceed without touching their files, do not improvise — record it
in `issues[]` and stop.

## Regulatory & legislative scan (weekly, portfolio-wide) — spec §9

**Gate first, and usually skip.** Read `~/dev/product-pipeline-1/data/capture/regulatory-scan/latest.json`.
If `scan_date` is within 7 days, SKIP this section entirely and say so in one line. This runs
ONCE PER WEEK ACROSS THE WHOLE PORTFOLIO, not once per site — the first keeper to run in a new
week does it and the other three skip. Do not run it because it looks undone.

**Canonical scope, process and output schema: `~/dev/product-pipeline-1/.claude/skills/smoke-sitekeeper/spec.md` §9.**
Read that file when the gate opens; it is the single source of truth and this section is
deliberately a pointer, not a copy — four copies would drift, which is the bug that killed this
scan in the first place (see below).

**Why this section exists here rather than only in the spec (#961, 2026-07-31):** §9 was written
into `smoke-sitekeeper/spec.md`, a file **no keeper cron loads**. `cron-runner.sh` resolves
`/site-keeper` to THIS file, and none of the four per-site copies contained a regulatory section —
so the scan ran exactly once (2026-07-19, by hand), its own `next_scan_due: 2026-07-26` passed
unnoticed, and the `regulatory-scan-fresh` check has been firing against an artifact with no live
producer ever since. Same shape as #930. The scan is worth reviving on its own record: it was
created because the EU AI Act Art.50 deadline (applicable 2026-08-02) was found only incidentally,
two weeks out, with nothing watching.

**Write the result** to `~/dev/product-pipeline-1/data/capture/regulatory-scan/YYYY-MM-DD.json` and
repoint `latest.json` at it (`ln -sfn`, it is a symlink). A run that finds nothing new still writes
the file with `findings: []` — that is what keeps the freshness check honest rather than silent.

## End-of-run capture block (MANDATORY — the last thing you print)

The final thing printed to stdout must be a JSON object wrapped in `<capture>…</capture>`
fences. Nothing after `</capture>` — no prose, no closing markdown fence. The human-readable
summary above it stays exactly as it is; this block is the authoritative source that
`/Users/jake/dev/product-pipeline-1/tools/capture/post-run.py` records into
`data/capture/keeper-runs/clinicfinder/<date>.json`.

**Why this exists (#890).** Until 2026-07-24 the capture layer regex-scraped these numbers
out of whatever prose a run happened to print. Its separators matched newlines, so a count on
one line bound to a noun on the next and it recorded `guides_written: 52` on nights when one
guide was refreshed — for 98 days, summed across keepers into a nightly "103 guides written"
in the 06:30 Slack briefing. Two sibling defects in the same function banked 492/675/195 as
"HTTP statuses" and logged a clean run's own "0 issues" line as an issue. Tightening those
regexes only narrows the next accident; a run that STATES its own numbers cannot be misread.
If this block is missing the parser falls back to the old scraper and stamps
`capture_source: "regex"` on the capture, which a guard now flags.

**A no-op run is a CORRECT outcome and must STILL emit the block, with zeros.** Do not
inflate, do not round up, do not count a file you opened but did not change. Since the
2026-07-17 decision, "nothing valuable to do" is an expected keeper result on a
waterfall-exhausted, protect-mode site — a zero here is the signal working. It is also the
only way anyone can see it: a fabricated 103 is precisely what hid 98 days of correct noops.

<capture>
{
  "health": {"status": "healthy", "http_status": 200, "total_pages": 921, "sitemap_urls": 921},
  "guides_written": 0,
  "pages_updated": 0,
  "internal_links_added": 0,
  "editorial_sections_added": 0,
  "content_actions": [
    {"type": "editorial_deep_dive", "path": "/province/gauteng", "description": "CCMDD pickup-point context"}
  ],
  "issues": [],
  "checks": [],
  "skipped": ["editorial deepening — CF is Settle autopilot, content grinding is out of scope"],
  "commits": []
}
</capture>

Field notes:
- `health.http_status` — the real code from your clinicfinder.co.za homepage check, 100-599. Omit it or
  use 0 if you did not check. Never invent one; an invented code is silently discarded anyway.
- `health.status` — `healthy` / `degraded` / `unknown`.
- `guides_written` / `pages_updated` / `internal_links_added` / `editorial_sections_added` —
  count the EDITS YOU AUTHORED, never the pages those edits happen to reach. Zero is a
  valid answer and usually the right one.
  **A template change affecting N pages is ONE change, not N.** This is not a nuance — it
  is the specific way these counters have gone wrong. On 2026-08-12 the DCG keeper made a
  single commit editing a single file (`src/pages/county/[county].astro`, 106 lines) that
  renders on 560 county pages, and declared `editorial_sections_added: 560`. Nothing was
  scraped and nothing was misparsed: the keeper stated that number itself, in its own
  `<capture>` block, having counted pages AFFECTED as units of WORK (#1155). The earlier
  wording here — "count what actually CHANGED on a rendered page" — reads as an
  instruction to do exactly that, since 560 rendered pages did change.
  The rule: if one edit reaches many pages, the counter is 1 and the reach belongs in
  `content_actions[]` or the run summary. `pages_updated` is the ONE field that legitimately
  counts pages, and it is separately bounded by the site's own page count.
  `tools/keeper-capture-sanity.py` enforces per-run ceilings on all of these and a number
  above a ceiling is reported as fabricated, so an inflated counter does not flatter the
  overnight summary — it fails a check.
- `content_actions[]` — one entry per real content change. This is the field that reaches the
  content log (`data/capture/content-log/content-log.jsonl`); before 2026-07-24 the keeper
  report wrote a differently-named key that no reader looked at, so no keeper content change
  has ever appeared there. `type` terse (`guide_refresh`, `editorial_deep_dive`,
  `data_correction`, `new_guide`), `path` is the URL path, `description` ≤200 chars.
- `issues[]` — real problems only. NEVER add a line that reports the ABSENCE of a problem
  ("0 issues", "Issues: None") — that is the exact bug this replaces.
  **Each entry MUST be an OBJECT, not a bare string:**
  `{"severity": "high"|"medium"|"low", "title": "<one line>", "detail": "<full reasoning>",
  "produced_by": "<what raised it>", "target": "<file or field it is about>"}`.
  `severity` is your own grading of whether this needs a human: `high` = a reader is being
  shown something wrong right now; `medium` = real but not reader-facing yet, or blocked on
  something you could not reach; `low` = worth recording, fine to leave.
  **Why the object shape is mandatory (#915).** Your `issues[]` array is the most expensive
  output of this run — it is your judgement about what you found and consciously did not fix.
  Today it is a dead end: nothing reads it, and a finding survives only if a human happens to
  open the capture the next morning. Measured 2026-07-31 across 435 stored entries, only 12
  (3%) carried any grading at all, because nothing ever asked for one. A routing check cannot
  triage what it cannot grade, so an ungraded finding is indistinguishable from a note and
  gets dropped. Write the object even when severity is `low`.
  **`produced_by` and `target` are mandatory too (#1295), and they are the half a prose
  title cannot carry.** `produced_by` names WHAT raised the finding — the script, gate or
  task, e.g. `quality/growth_rate_basis_check.py`, `tools/editorial-fee-drift-check.py`,
  `manual: spot-check step 2`, `npm run build`. `target` names WHAT IT IS ABOUT, as a path
  or a record key: `src/data/narratives/snap-on.json`, `src/data/cities.json →
  salt-lake-city.editorial.real_cost`, `/compare/chick-fil-a-vs-circle-k`. Measured
  2026-08-19 across all 129 stored entries: the only keys present were `severity`, `title`
  and `detail` (plus `verdict` twice). Nothing recorded who found a thing or where it lives,
  so every consumer had only a regenerated English sentence to work with. Two concrete uses:
  the router's fuzzy matcher (#1076) gets a STABLE key beside the drifting title, and a
  reader can go straight to the file instead of re-deriving it. If you genuinely cannot name
  a producer, write `manual: <what you were doing>` — never omit the key, and never invent a
  script name you did not run.
  **This does NOT mean a finding can be auto-closed.** A closure proposer was built and
  withdrawn on 2026-08-19 (#1211 → #1233): it made two proposals in its life and both were
  false, because a heuristic cannot tell FIXED from NO LONGER MEASURED. `produced_by` and
  `target` are identity, not evidence of resolution. Do not write anything into `issues[]`
  implying an entry is done.
  **The `title` is an IDENTITY, so keep it STABLE across nights (#1076).** The router
  fingerprints a finding by its title, so **never embed a recurrence counter in it** — no
  "for a third consecutive night", no "blocked a 4th night", no "still". One FVS finding was
  re-logged under four different titles on four consecutive nights, three of them carrying a
  night counter: it entered the state file as four separate findings with four fresh clocks,
  two were routed by hand to the SAME item (#1052), and a title that counts its own
  recurrences can never match its predecessor by construction. **The count belongs in
  `detail`** ("unresolved since 2026-08-02, 4th run") where it is useful and harmless. When
  you re-log an unresolved issue, re-use the SAME wording you used last night wherever you
  can — the router now falls back to fuzzy title matching, but an unchanged title is exact
  and free.
  Put the full reasoning in `detail` — it is capped at 2,000 chars and any cut is marked, so
  length is safe; brevity is what loses the diagnosis.
  **If the finding is about a specific VALUE, `detail` MUST name the FILE and RECORD KEY you
  found it in** — `src/data/cities.json → salt-lake-city.editorial.real_cost`, not "the UT
  editorial says $X". Measured 2026-07-31 (#932): three of three unreconciled-figure findings
  from one run were MISATTRIBUTED, each costing a full verification pass to disprove. One
  credited a $1,000 to a dispenser licence because it sat ~90 characters after the word
  "dispensary"; another blamed Utah for $3,325 (a TEXAS fee) and $2,685 (a DELAWARE
  POPULATION). The cause is matching values across the whole corpus and crediting them to
  whatever the run is about — and a record key makes that impossible to do silently, because
  you cannot write a Texas record under a Utah heading without noticing. Keep reporting these:
  the same three findings surfaced two genuine live errors. Only the attribution was broken.
- `skipped[]` — work deliberately not done, each with its reason.
- `checks[]` — what you RAN this run and what it said, one entry per check:
  `{"check": "<script or gate you invoked>", "verdict": "pass"|"fail"|"skip"|"error",
  "detail": "<one line, optional>"}`. This is a record of what was MEASURED, and it exists
  because the captures carried no such channel at all (#1295): a finding that stops appearing
  is indistinguishable from a check that stopped running, and 49 consecutive captures gave no
  way to tell them apart. A `skip` is as important as a `fail` — say why. Empty list is
  honest if you ran no checks; do NOT list a check you did not actually invoke.
  **A clean `checks[]` is not a closure signal.** Nothing may infer from it that an open
  `issues[]` finding is resolved (#1233).
- `commits[]` — short SHAs pushed this run; empty list if nothing was committed.

## Cron mode — never end the turn with background work pending (TODO #736)

When this skill runs under cron (`CRON_JOB_ID` is set; `claude --print`, non-interactive): the session EXITS the moment your final message ends. Background tasks are killed with it, and there is NO re-invocation when they complete — "the background poll will re-invoke me" is always false here. That assumption silently killed FVS watchdog remediation batches on 2026-06-10 and 2026-06-12 (exit 0, 1 output line, downloads/verdicts vanished).

1. Run every download, extraction, build, or verification step synchronously in the FOREGROUND. Do not launch background work and end the turn "waiting" for it — the completion notification will never arrive.
2. NEVER end your turn while any batch, download, or poll is still pending.
3. If the work genuinely cannot finish in this session, write the exact remaining steps to `/Users/jake/dev/product-pipeline-1/TODO.md` as a `[ ]` Jake's Queue item, then end with an explicit final report of what was done and what was deferred.
4. End-of-turn check: your last paragraph must report completed work — never "waiting on…" / "will continue when…".
