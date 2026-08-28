# osm-drift captures — the naming basis, and one file that is a day out

Written by `tools/osm-drift-check.py`. One JSON per pull, named for the date of the
pull; `latest.json` is a symlink to the newest.

## The names are SAST from 2026-08-28 onward, and UTC before it (#1372)

The tool originally took `datetime.now(timezone.utc)` and named the capture after the
**UTC** date. Global CLAUDE.md requires `YYYY-MM-DD` in **SAST** everywhere, and the
sibling sweep in `../osm-tags/` already stamped `+02:00`, so the two capture families in
this one lane disagreed about what day it was. Fixed in #1372: `now` is SAST, so both
the `captured_at` stamp and the filename are SAST.

**The pre-existing files are deliberately NOT renamed.** #1351/#1363 and this repo's
commit messages cite them by name, and rewriting a filename that other records point at
buys legibility here and costs it everywhere else.

## The one file whose name is a day behind the clock

| file | `captured_at` (as written) | real SAST instant | SAST date | name correct? |
|---|---|---|---|---|
| `2026-08-19.json` | `2026-08-19T20:19:19+00:00` | 2026-08-19 22:19 SAST | 2026-08-19 | yes |
| `2026-08-20.json` | `2026-08-20T22:33:43+00:00` | **2026-08-21 00:33 SAST** | **2026-08-21** | **NO — one day early** |
| `2026-08-28.json` | `2026-08-28T07:25:41+00:00` | 2026-08-28 09:25 SAST | 2026-08-28 | yes |

So `2026-08-20.json` is the capture taken just after midnight on **2026-08-21**. It is
the only misfiled file in the corpus; every other capture falls on the same date under
either rule. If you are reconciling #1351/#1363, that is the one to line up carefully.

## Why nothing downstream was wrong

`captured_at` has always been a correct ISO-8601 instant with an offset, and the tool's
own age arithmetic reads that field, not the filename. No verdict was ever computed
from a wrong date. This was a legibility defect — which is why #1372 is LOW — and its
cost was paid by humans reading the directory, not by the checker.

## Lexical order still equals chronological order

`latest_capture()` picks `sorted(files)[-1]`, i.e. the newest by NAME, so the mixed
corpus has to stay correctly ordered. It does, and not by luck: SAST is ahead of UTC, so
for any instant the SAST name is greater than or equal to the UTC name for that same
instant, and instants only ever move forward. A SAST-named capture therefore cannot sort
before an earlier UTC-named one. `tools/tests/test_osm_drift_dates.py` asserts this,
including against the real files in this directory.
