#!/usr/bin/env python3
"""emergency-basis.py — derive, and then GUARD, the basis of every published
24-hour emergency claim on ClinicFinder.

WHY (#1349)
-----------
`services.emergency_24h` is true on 500 published facilities and renders as a
"24-hour emergency" chip, in the page title's service list, in the meta
description, in the MedicalClinic schema's medicalSpecialty, on /services/emergency
and in the medical-emergency guide. A reader acts on it at 2am when choosing which
facility to travel to.

It was never a sourced value. Git history settles the basis without guessing:
the initial build inferred the service flags from facility TYPE, and commit
3d5d03c states it plainly — "the flags otherwise track facility TYPE, which is
defensible for South Africa — 485 of 486 district hospitals are marked 24h and
490 of 525 clinics are not". That inference is defensible (SA district hospitals
run 24-hour casualty by national policy) and it is NOT the same thing as a record.

The failure mode is that the page cannot tell the reader which it is looking at.

WHAT THIS DOES, AND DELIBERATELY DOES NOT DO
--------------------------------------------
It does NOT flip `emergency_24h` in either direction. Both directions assert
something unevidenced: OSM's silence is not a denial (only 271 of 500 claimants
carry an `emergency` tag at all, so 46% of the claims are simply untagged, which
is OSM incompleteness rather than contradiction), and setting the flag TRUE on
OSM's say-so would launder a tag into a verified fact. The 17 records whose OSM
element carries an explicit `emergency=no` were the decidable class and were
already corrected by the 2026-08-19 keeper run; today's sweep confirms zero
remain.

What it does is SPLIT the claim by its basis, so the page can say which one it is:
  osm_confirmed  the facility's own OSM element carries emergency=yes
  unevidenced    no emergency tag either way — the claim rests on the type
                 inference alone
  excluded_not_care
                 the facility is adjudicated in src/data/care-role.ts as a place
                 nobody is treated, so it is not in the emergency corpus at all

THE FOURTH BUCKET, AND WHY IT IS NOT A FLIP (#1376)
---------------------------------------------------
Temba SANTA Hospital in Makhanda CLOSED on 2023-07-01 and still claimed 24-hour
emergency, so it was listed on /services/emergency, counted in the emergency
editorial's stated totals and counted in the medical-emergency guide — for a
building that stood empty within a fortnight and has since been stripped. The
obvious repair is `emergency_24h: false`, and the rule above forbids it for a
reason that survives the closure: that flag is a claim about a SERVICE, we have
no evidence about the service either way, and setting it false would assert one.

What we do know is a fact about the PLACE, and care-role.ts already holds it with
the Eastern Cape DoH Annual Report 2023/24, Spotlight and Grocott's Mail behind
it. So the scoping happens there, and it generalises without a special case: a
facility adjudicated in care-role.ts is not somewhere the public is treated, so
it cannot appear in any service listing or count. src/data/helpers.ts's
`providesService` applies the identical rule to the rendered pages. The two must
stay in step, or these totals stop describing the listings they assert.

The record is left exactly as OpenStreetMap has it. Excluded slugs are RECORDED
in `excluded_not_care`, never silently dropped — --check fails if a care-role
facility claims the service and is missing from that list, because "out of the
corpus" and "never looked at" must not read the same.

MODES
-----
  (default)  regenerate src/data/emergency-basis.json from the newest capture
  --check    exit 1 if the committed file disagrees with a fresh derivation, or
             if any facility claims emergency_24h and is absent from it. That
             second arm is the one that matters: it is what stops a future OSM
             refresh from re-admitting an unlabelled claim, which is the ingest
             hole #1349 asked to be settled.

An `emergency=no` element reaching this script is a HARD failure, not a bucket —
it is a live contradiction and belongs in a keeper correction, not in a label.
A capture that exists but does not parse is a hard failure, never "absent"
(feedback_unreadable_is_not_absent).
"""
import argparse, json, pathlib, re, sys

REPO = pathlib.Path(__file__).resolve().parent.parent
FAC = REPO / "src/data/facilities.json"
OUT = REPO / "src/data/emergency-basis.json"
CAPS = REPO / "data/capture/osm-tags"
ID_RE = re.compile(r"^zaf_(node|way|relation|nodes)_(\d+)$")
CARE_ROLE = REPO / "src/data/care-role.ts"
CARE_KEY_RE = re.compile(r"^  '([a-z0-9-]+)': \{$", re.M)


def not_care_facilities():
    """The slugs adjudicated in care-role.ts as places nobody is treated.

    They are excluded from the emergency corpus. A closed hospital, a state
    mortuary or a bedding retailer cannot run a 24-hour casualty, and the site
    must not list one — but the remedy is NOT to flip `emergency_24h`, which
    would assert something about a SERVICE that we do not know (#1349). What we
    know is that the FACILITY is not a place of care, which is a fact about the
    place, sourced in care-role.ts. See src/data/helpers.ts `providesService`,
    which applies the identical rule to the rendered listings; the two must
    agree or the guard's totals stop matching the pages they assert.

    An unreadable or empty registry is a HARD failure. Reading zero slugs out of
    a file that exists would silently re-admit every adjudicated non-facility to
    the emergency corpus, and the guard would go green on it
    (feedback_unreadable_is_not_absent).
    """
    if not CARE_ROLE.exists():
        print(f"[FAILED] {CARE_ROLE.relative_to(REPO)} is missing — the emergency "
              "corpus cannot be scoped and would re-admit closed facilities",
              file=sys.stderr)
        raise SystemExit(1)
    text = CARE_ROLE.read_text(encoding="utf-8")
    body = text[text.index("export const NOT_WALK_IN_CARE"):] \
        if "export const NOT_WALK_IN_CARE" in text else ""
    if not body:
        print(f"[FAILED] {CARE_ROLE.relative_to(REPO)} has no NOT_WALK_IN_CARE map "
              "— its shape changed and this parse is stale", file=sys.stderr)
        raise SystemExit(1)
    slugs = set(CARE_KEY_RE.findall(body))
    if not slugs:
        print(f"[FAILED] parsed ZERO slugs out of {CARE_ROLE.relative_to(REPO)} — "
              "the entry format changed; fix this parse rather than shipping an "
              "unscoped emergency corpus", file=sys.stderr)
        raise SystemExit(1)
    return slugs


def osm_key(rec):
    m = ID_RE.match(rec.get("facility_id", "") or "")
    if not m:
        return None
    return f"{'node' if m.group(1) == 'nodes' else m.group(1)}:{m.group(2)}"


def newest_capture():
    caps = sorted(CAPS.glob("*.json")) if CAPS.exists() else []
    if not caps:
        print("[SKIP] no OSM tag capture under data/capture/osm-tags — "
              "run the Overpass sweep first", file=sys.stderr)
        raise SystemExit(2)
    return caps[-1]


def derive():
    cap_path = newest_capture()
    cap = json.loads(cap_path.read_text(encoding="utf-8"))
    tags = cap["tags"]
    facs = json.loads(FAC.read_text(encoding="utf-8"))

    not_care = not_care_facilities()
    confirmed, unevidenced, denied, unresolvable, excluded = [], [], [], [], []
    for r in facs:
        if not r["services"]["emergency_24h"]:
            continue
        if r["slug"] in not_care:
            excluded.append(r["slug"])
            continue
        k = osm_key(r)
        if k is None or k not in tags:
            unresolvable.append(r["slug"])
            continue
        e = tags[k].get("emergency")
        if e == "yes":
            confirmed.append(r["slug"])
        elif e == "no":
            denied.append(r["slug"])
        else:
            unevidenced.append(r["slug"])

    if denied:
        print("[FAILED] these records claim 24-hour emergency while their own OSM "
              "element says emergency=no. That is a contradiction, not a basis "
              "label — correct the record:\n  " + "\n  ".join(sorted(denied)),
              file=sys.stderr)
        raise SystemExit(1)

    return {
        "_comment": "GENERATED by tools/emergency-basis.py — do not hand-edit. "
                    "Basis of each published 24-hour emergency claim (#1349). "
                    "'unevidenced' means OpenStreetMap records no emergency tag "
                    "either way; the claim rests on the facility-type inference "
                    "described in commit 3d5d03c. It is NOT a denial.",
        "derived_from": cap_path.name,
        "captured_at": cap["captured_at"],
        "counts": {"osm_confirmed": len(confirmed),
                   "unevidenced": len(unevidenced),
                   "unresolvable": len(unresolvable),
                   "excluded_not_care": len(excluded)},
        "osm_confirmed": sorted(confirmed),
        "unevidenced": sorted(unevidenced),
        "unresolvable": sorted(unresolvable),
        "excluded_not_care": sorted(excluded),
    }, facs



EDITORIAL = REPO / "src/data/service-editorial.ts"


def scalar_problems(facs):
    """The emergency editorial states its own totals as HAND-TYPED numerals.

    Those numbers went stale the moment the 2026-08-19 keeper cleared 17
    contradicted claims: the page still said 517 facilities, 465 of them district
    hospitals, on the day the corpus held 500 and 449. Nothing could see it,
    because a frozen scalar in prose has no producer to disagree with
    (feedback_frozen_scalar_in_prose_rots). Deriving the sentence is not worth the
    churn — asserting it is.

    Deliberately narrow: it checks the TOTAL and the per-type counts the emergency
    editorial actually states, not every number on the page. The triage timings,
    the ambulance numbers and the constitutional section are facts about the world
    and must not move with our corpus.
    """
    if not EDITORIAL.exists():
        return [f"MISSING_EDITORIAL {EDITORIAL.name} is gone — the stated totals cannot be checked"]
    text = EDITORIAL.read_text(encoding="utf-8")
    block = text[text.index("emergency_24h: {"):] if "emergency_24h: {" in text else ""
    if not block:
        return ["MISSING_EDITORIAL no emergency_24h entry in service-editorial.ts"]
    block = block[:block.index("\n  },")]

    not_care = not_care_facilities()
    e = [r for r in facs if r["services"]["emergency_24h"] and r["slug"] not in not_care]
    by = {}
    for r in e:
        by[r["type"]] = by.get(r["type"], 0) + 1
    expect = {
        "total": len(e),
        "district_hospital": by.get("district_hospital", 0),
        "community_health_centre": by.get("community_health_centre", 0),
        "clinic": by.get("clinic", 0),
        "hospitals": len(e) - by.get("community_health_centre", 0) - by.get("clinic", 0),
        "primary": by.get("community_health_centre", 0) + by.get("clinic", 0),
    }
    allowed = {str(v) for v in expect.values()}
    # A numeral counts ONLY when it is bound to a facility-counting construction.
    # A blanket 3-digit scan was written first and measured: it flagged 084/555/777
    # (helpline numbers), 112 and 911 (emergency and Netcare ambulance numbers), 100
    # and 300 (the patient fee band) — 8 findings, 8 of them false. A guard that
    # ships eight false positives is switched off in a week, and the numbers it
    # would have you "fix" are facts about the world, not about our corpus. So the
    # numeral must ABUT the noun it counts.
    NOUN = (r"facilit(?:y|ies)|public hospitals and clinics|district hospitals|"
            r"community health centres|clinics|hospitals|regional|tertiary")
    out = []
    for m in re.finditer(rf"(?<![\d,])(\d{{2,4}})(?![\d,])"
                         rf"(?:</strong>)?\s+(?:of the\s+)?(?:are\s+)?"
                         rf"(?:<strong>)?({NOUN})\b", block):
        tok = m.group(1)
        if tok not in allowed:
            out.append(f"STALE_SCALAR      the emergency editorial says "
                       f"{tok!r} {m.group(2)!r}, which no current count supports "
                       f"(corpus: {expect})")
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()

    fresh, facs = derive()
    _not_care = not_care_facilities()
    claimed = {r["slug"] for r in facs
               if r["services"]["emergency_24h"] and r["slug"] not in _not_care}

    if not a.check:
        OUT.write_text(json.dumps(fresh, indent=1) + "\n", encoding="utf-8")
        print(f"[OK] wrote {OUT.relative_to(REPO)} — "
              f"{fresh['counts']['osm_confirmed']} OSM-confirmed, "
              f"{fresh['counts']['unevidenced']} unevidenced, "
              f"{fresh['counts']['unresolvable']} unresolvable")
        return 0

    if not OUT.exists():
        print(f"[FAILED] {OUT.relative_to(REPO)} is missing — every published "
              "24-hour emergency claim is unlabelled", file=sys.stderr)
        return 1
    try:
        have = json.loads(OUT.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"[FAILED] {OUT.relative_to(REPO)} exists but does not parse: {e}",
              file=sys.stderr)
        return 1

    labelled = set(have.get("osm_confirmed", [])) | set(have.get("unevidenced", [])) \
        | set(have.get("unresolvable", []))
    problems = []
    # A record excluded as not-a-care-facility must be RECORDED as excluded, never
    # silently dropped: "not in the corpus" and "never looked at" must not read the same.
    for s_ in sorted((_not_care & {r["slug"] for r in facs if r["services"]["emergency_24h"]})
                     - set(have.get("excluded_not_care", []))):
        problems.append(f"UNRECORDED_EXCLUSION {s_} is adjudicated in care-role.ts and "
                        f"claims 24-hour emergency, but is not in excluded_not_care")
    for s in sorted(claimed - labelled):
        problems.append(f"UNLABELLED_CLAIM  {s} claims 24-hour emergency and has no basis entry")
    for s in sorted(labelled - claimed):
        problems.append(f"STALE_LABEL       {s} carries a basis entry but no longer claims it")
    for bucket in ("osm_confirmed", "unevidenced"):
        moved = set(fresh[bucket]) ^ set(have.get(bucket, []))
        for s in sorted(moved & claimed):
            problems.append(f"BASIS_MOVED       {s} — OSM now disagrees with the committed basis ({bucket})")

    problems += scalar_problems(facs)

    if a.json:
        print(json.dumps({"ok": not problems, "problems": problems,
                          "claims": len(claimed)}, indent=1))
    if problems:
        print(f"[FAILED] emergency-basis: {len(problems)} problem(s)", file=sys.stderr)
        for p in problems:
            print("  " + p, file=sys.stderr)
        print("  Regenerate with: python3 tools/emergency-basis.py", file=sys.stderr)
        return 1
    print(f"[PASS] emergency-basis — all {len(claimed)} published 24-hour "
          f"emergency claims carry a basis, it matches {fresh['derived_from']}, "
          f"and the stated totals in the emergency editorial agree with the corpus")
    return 0


if __name__ == "__main__":
    sys.exit(main())
