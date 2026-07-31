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

Commit changes with message: `Keeper: <what was done> — clinicfinder.co.za`
Push to main.

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
  "skipped": ["editorial deepening — CF is Settle autopilot, content grinding is out of scope"],
  "commits": []
}
</capture>

Field notes:
- `health.http_status` — the real code from your clinicfinder.co.za homepage check, 100-599. Omit it or
  use 0 if you did not check. Never invent one; an invented code is silently discarded anyway.
- `health.status` — `healthy` / `degraded` / `unknown`.
- `guides_written` / `pages_updated` / `internal_links_added` / `editorial_sections_added` —
  count only what actually CHANGED on a rendered page this run. Zero is a valid answer and
  usually the right one.
- `content_actions[]` — one entry per real content change. This is the field that reaches the
  content log (`data/capture/content-log/content-log.jsonl`); before 2026-07-24 the keeper
  report wrote a differently-named key that no reader looked at, so no keeper content change
  has ever appeared there. `type` terse (`guide_refresh`, `editorial_deep_dive`,
  `data_correction`, `new_guide`), `path` is the URL path, `description` ≤200 chars.
- `issues[]` — real problems only. NEVER add a line that reports the ABSENCE of a problem
  ("0 issues", "Issues: None") — that is the exact bug this replaces.
- `skipped[]` — work deliberately not done, each with its reason.
- `commits[]` — short SHAs pushed this run; empty list if nothing was committed.

## Cron mode — never end the turn with background work pending (TODO #736)

When this skill runs under cron (`CRON_JOB_ID` is set; `claude --print`, non-interactive): the session EXITS the moment your final message ends. Background tasks are killed with it, and there is NO re-invocation when they complete — "the background poll will re-invoke me" is always false here. That assumption silently killed FVS watchdog remediation batches on 2026-06-10 and 2026-06-12 (exit 0, 1 output line, downloads/verdicts vanished).

1. Run every download, extraction, build, or verification step synchronously in the FOREGROUND. Do not launch background work and end the turn "waiting" for it — the completion notification will never arrive.
2. NEVER end your turn while any batch, download, or poll is still pending.
3. If the work genuinely cannot finish in this session, write the exact remaining steps to `/Users/jake/dev/product-pipeline-1/TODO.md` as a `[ ]` Jake's Queue item, then end with an explicit final report of what was done and what was deferred.
4. End-of-turn check: your last paragraph must report completed work — never "waiting on…" / "will continue when…".
