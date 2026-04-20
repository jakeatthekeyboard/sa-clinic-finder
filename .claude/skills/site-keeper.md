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
