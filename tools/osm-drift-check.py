#!/usr/bin/env python3
"""Re-ask OpenStreetMap about the facilities we publish, and report what moved.

WHY THIS EXISTS
---------------
Every facility record on clinicfinder.co.za is a snapshot of an OSM object taken
on 2026-04-14 and never re-read. `last_verified` says "2026-04-14" on all 1,076
records because that is literally the last time anybody looked. Nothing watches
it, so the field ages into a false claim: it reads as an assurance of currency
and is in fact a timestamp of the only pull we ever did.

The failure mode is specific and it is the worst one this site has. A clinic that
CLOSES does not break anything. The page keeps returning 200, the build stays
green, the link checker is happy, the numeric-parity gate has nothing to compare,
and the record renders exactly as it did the day it was true. Someone walks or
takes a taxi to a gate that is locked. On a humanitarian directory, silently
serving a dead facility is the defect; every other check here is blind to it.

`facility_id` is `zaf_node_<osm id>`, so the question is directly answerable:
ask OSM for those exact ids and see what comes back.

WHAT IT REPORTS
---------------
  MISSING       the OSM object is gone, or no longer tagged as a healthcare
                facility. The safety signal — this is the closed-clinic case.
  MOVED         coordinates differ by more than --move-metres (default 500).
                Below that is GPS refinement, not relocation.
  NAME_CHANGED  OSM's name no longer matches ours (normalised, case-insensitive).
  ENRICHABLE    OSM now carries a phone / opening_hours / operator we do not
                have. Not a defect — a free answer to TODO #315, whose stated
                blocker (mfl.csir.co.za needs a login) was never the only path.

DELIBERATELY READ-ONLY. It does not touch facilities.json. Auto-merging a remote
community dataset into a health directory is how a vandalised OSM edit becomes
our published address; a human reads the report and decides. This is a detector,
for the reason growth_rate_basis_check.py is a detector.

NETWORK DISCIPLINE. Overpass is a free volunteer service and this asks about
~1,076 objects. The script REFUSES to hit it if the last capture is younger than
--max-age-days (default 30) unless --force is passed, so it is safe to schedule
often and cheap to run: on most days it re-reports the last capture and exits.
A refusal is not a pass — it prints the capture's age and re-reports its verdict.

An unreadable capture is a HARD failure, never "no drift" — absence of a reading
and a clean reading are not the same fact.

RECORDS ARE NOT OBJECTS. `records_checked` counts our published RECORDS and
`osm_objects_checked` counts the distinct OSM objects they resolve to; on
2026-08-21 those are 1,076 and 1,073, because #1228 repointed three facilities
onto an object another record already used. Reporting only the object count
under a "records" label is what made three separate measurements of "how many
facilities are gone from OSM" — a keeper's 4, this check's 1, and a full
sweep's 0 — read as a contradiction when all three were true answers to
different questions (#1351/#1363). A coverage number that reads as "records"
and holds an object count hides exactly the records it drops.

BASELINE. tools/osm-drift-baseline.json holds the MISSING findings already seen
and accepted, keyed by IDENTITY (`slug|reason`), not by COUNT. A count ratchet
stays green when one facility is resolved and a different one vanishes the same
week — which is the exact event this exists to catch. Because the key includes
the reason, a record that goes from "gone" to "retagged as a school" fires again:
that is new information about the same facility. Accepting an entry is a
decision, so each carries a `note` saying who accepted it and why.

Exit 0 = no NEW MISSING facilities. Exit 1 = new MISSING, or the capture could
not be read. Exit 2 = soft skip (no network AND no capture to fall back on).
"""

import argparse
import json
import math
import re
import subprocess
import sys
import time
from datetime import datetime, timezone, timedelta
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
FACILITIES = REPO / "src" / "data" / "facilities.json"
CAPTURE_DIR = REPO / "data" / "capture" / "osm-drift"
BASELINE = REPO / "tools" / "osm-drift-baseline.json"
# Two independent Overpass instances. The free tier hands out a small number of
# query slots and answers an over-quota request with an HTML error PAGE, not JSON
# and not a 429 — so "did not parse as JSON" is the real over-quota signature and
# has to be retried rather than reported as drift.
OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]
RETRIES = 3
BACKOFF_S = 45
INTER_BATCH_S = 8

# An object still counts as a healthcare facility if it carries any of these.
HEALTHCARE_TAGS = {
    "amenity": {"clinic", "hospital", "doctors", "health_post", "pharmacy", "dentist"},
    "healthcare": None,  # any value
}
# `nodes` (plural) is a ONE-CHARACTER TYPO in 18 of the 1,076 published records,
# and it is not cosmetic: this regex is the gate into the whole check, so every id
# it fails to parse is a facility PERMANENTLY EXEMPT from the closed-clinic
# detector — the one defect this file exists to catch — while the run still
# prints a pass. It surfaced only as a `[note] N facility_id(s) ... not checked`
# line nobody read (#1243e). The site's own render path already tolerates it:
# `src/pages/clinics/[province]/[slug].astro` matches `^zaf_(way|nodes?)_(\d+)$`
# to build its OSM link, so the pages were resolving these ids while the guard
# was not. Match what RENDERS (feedback_scan_the_rendered_field) and normalise
# `nodes` -> `node` so the Overpass query is still well-formed.
ID_RE = re.compile(r"^zaf_(node|nodes|way|relation)_(\d+)$")
# Anything this regex cannot parse is now a HARD failure rather than a note. An
# unparseable id is indistinguishable, from the outside, from a facility that was
# checked and found healthy — the fail-open shape of #818, on a humanitarian
# directory. 0 unparseable at ship (2026-08-19), so this is green on introduction.


def norm(s):
    return re.sub(r"[^a-z0-9]+", " ", (s or "").lower()).strip()


def haversine_m(a_lat, a_lon, b_lat, b_lon):
    r = 6371000.0
    p1, p2 = math.radians(a_lat), math.radians(b_lat)
    dp = math.radians(b_lat - a_lat)
    dl = math.radians(b_lon - a_lon)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))


def load_facilities():
    if not FACILITIES.exists():
        raise SoftSkip(f"no facilities.json at {FACILITIES}")
    return json.loads(FACILITIES.read_text(encoding="utf-8"))


class SoftSkip(Exception):
    pass


def parse_ids(facilities):
    """Group our records by OSM element type. Unparseable ids are REPORTED.

    The value is a LIST of records, not one record, because TWO OF OUR RECORDS
    CAN SHARE ONE OSM OBJECT. This was `by_type[etype][id] = r`, a plain
    assignment, so the second record to arrive SILENTLY OVERWROTE the first and
    was never compared against OSM at all — not for MISSING, not for MOVED, not
    for NAME_CHANGED. No count moved, because the dropped record vanished from
    the denominator as well as the numerator: the run reported "1073 records
    checked" and 1073 was the number of distinct OBJECTS, so the arithmetic was
    self-consistent and 3 of 1,076 records were invisible.

    It is not hypothetical and it was created by the fix to a different item:
    #1228 repointed 8 facilities onto the OSM object that still carried them,
    and three of those landed on an object another record already used —
    ha-grove-hospital-mpumalanga / ha-grove-hospital-belfast-mpumalanga
    (way:468966258), tower-psychiatric-hospital-eastern-cape /
    tower-psychiatric-hospital-fort-beaufort (way:218396423), and
    elliot-provincial-hospital-eastern-cape / elliot-hospital-elliot
    (way:461683581). `src/data/facility-quality.mjs` handles the collision for
    PUBLISHING (it withholds the weaker page, keyed on facility_id); nothing
    handled it for CHECKING. The two records in a pair carry DIFFERENT names, so
    NAME_CHANGED is the bucket that was actually losing findings.

    Found 2026-08-21 while reconciling #1351/#1363, which is the reason a
    coverage number that reads as "records" must never be an object count.
    """
    by_type, unparseable = {"node": {}, "way": {}, "relation": {}}, []
    for r in facilities:
        m = ID_RE.match(r.get("facility_id", ""))
        if not m:
            unparseable.append(r.get("facility_id") or r.get("slug"))
            continue
        etype = "node" if m.group(1) == "nodes" else m.group(1)
        by_type[etype].setdefault(int(m.group(2)), []).append(r)
    return by_type, unparseable


def _one_query(q, timeout):
    """Run one Overpass query, trying each endpoint with backoff.

    Raises SoftSkip only after every endpoint and every retry has failed — a
    transient quota refusal must never reach compare() as 'the object is gone'.
    """
    last = None
    for attempt in range(RETRIES):
        for url in OVERPASS_ENDPOINTS:
            out = subprocess.run(
                ["curl", "-s", "--max-time", str(timeout + 20),
                 "-A", "clinicfinder.co.za OSM drift check (hello@clinicfinder.co.za)",
                 "--data-urlencode", f"data={q}", url],
                capture_output=True, text=True)
            if out.returncode != 0 or not out.stdout.strip():
                last = f"{url}: curl rc={out.returncode}"
                continue
            try:
                return json.loads(out.stdout)
            except json.JSONDecodeError:
                last = f"{url}: non-JSON reply (likely over quota): {out.stdout[:100]!r}"
        if attempt < RETRIES - 1:
            time.sleep(BACKOFF_S * (attempt + 1))
    raise SoftSkip(f"overpass unavailable after {RETRIES} rounds — {last}")


def overpass_fetch(by_type, timeout, batch):
    """Ask Overpass about our exact ids. Batched so one long URL cannot fail all."""
    found = {}
    for etype, records in by_type.items():
        ids = sorted(records)
        for i in range(0, len(ids), batch):
            chunk = ids[i:i + batch]
            q = (f"[out:json][timeout:{timeout}];"
                 f"{etype}(id:{','.join(str(x) for x in chunk)});"
                 f"out tags center;")
            payload = _one_query(q, timeout)
            for el in payload.get("elements", []):
                lat = el.get("lat", (el.get("center") or {}).get("lat"))
                lon = el.get("lon", (el.get("center") or {}).get("lon"))
                found[f"{el['type']}:{el['id']}"] = {
                    "tags": el.get("tags", {}), "lat": lat, "lon": lon}
            time.sleep(INTER_BATCH_S)  # be a good Overpass citizen
    return found


def is_healthcare(tags):
    if "healthcare" in tags:
        return True
    return tags.get("amenity") in HEALTHCARE_TAGS["amenity"]


def compare(by_type, found, move_metres):
    findings = {"MISSING": [], "MOVED": [], "NAME_CHANGED": [], "ENRICHABLE": []}
    for etype, records in by_type.items():
        for osm_id, recs in records.items():
            key = f"{etype}:{osm_id}"
            el = found.get(key)
            # Every record on this object is compared, not just the last one
            # parsed. Two records sharing an object produce two findings — which
            # is correct: they are two published PAGES, the baseline is keyed on
            # slug, and each needs its own disposition.
            for rec in recs:
                _compare_one(findings, key, rec, el, move_metres)
    return findings


def _compare_one(findings, key, rec, el, move_metres):
    slug = rec.get("slug")
    if el is None:
        findings["MISSING"].append(
            {"slug": slug, "name": rec.get("name"), "osm": key,
             "reason": "object no longer returned by Overpass"})
        return
    tags = el["tags"]
    if not is_healthcare(tags):
        findings["MISSING"].append(
            {"slug": slug, "name": rec.get("name"), "osm": key,
             "reason": f"no longer tagged healthcare (amenity={tags.get('amenity')!r})"})
        return
    c = rec.get("coordinates") or {}
    if el["lat"] is not None and c.get("lat") is not None:
        d = haversine_m(c["lat"], c["lng" if "lng" in c else "lon"], el["lat"], el["lon"])
        if d > move_metres:
            findings["MOVED"].append(
                {"slug": slug, "osm": key, "metres": round(d)})
    if tags.get("name") and norm(tags["name"]) != norm(rec.get("name")):
        findings["NAME_CHANGED"].append(
            {"slug": slug, "ours": rec.get("name"), "osm_name": tags["name"]})
    gains = []
    contact = rec.get("contact") or {}
    if not (contact.get("phone") or "").strip() and (tags.get("phone") or tags.get("contact:phone")):
        gains.append("phone")
    if not ((rec.get("operating_hours") or {}).get("raw") or "").strip() and tags.get("opening_hours"):
        gains.append("opening_hours")
    if not (rec.get("operator") or "").strip() and tags.get("operator"):
        gains.append("operator")
    if gains:
        findings["ENRICHABLE"].append({"slug": slug, "gains": gains})


def load_baseline():
    """Accepted MISSING findings. A malformed baseline is a HARD failure: a guard
    that silently loses its baseline re-reports everything and gets muted."""
    if not BASELINE.exists():
        return {}
    try:
        raw = json.loads(BASELINE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as e:
        raise SystemExit(f"[FAILED] baseline {BASELINE} exists but could not be read: {e}")
    return {e["key"]: e for e in raw.get("accepted", [])}


def missing_key(f):
    return f"{f['slug']}|{f['reason']}"


def latest_capture():
    if not CAPTURE_DIR.exists():
        return None, None
    files = sorted(p for p in CAPTURE_DIR.glob("*.json") if p.name != "latest.json")
    if not files:
        return None, None
    p = files[-1]
    try:
        return p, json.loads(p.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as e:
        # An unreadable capture is NOT "no drift" — feedback_unreadable_is_not_absent.
        raise SystemExit(f"[FAILED] capture {p} exists but could not be read: {e}")


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--max-age-days", type=int, default=30,
                    help="skip the network if the newest capture is younger than this")
    ap.add_argument("--force", action="store_true", help="pull regardless of capture age")
    ap.add_argument("--move-metres", type=float, default=500.0)
    ap.add_argument("--timeout", type=int, default=90)
    ap.add_argument("--batch", type=int, default=250)
    ap.add_argument("--no-record", action="store_true")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    now = datetime.now(timezone.utc)
    cap_path, cap = latest_capture()

    if cap and not args.force:
        try:
            age = now - datetime.fromisoformat(cap["captured_at"])
        except (KeyError, ValueError):
            age = timedelta(days=10 ** 4)
        if age < timedelta(days=args.max_age_days):
            cap["reused"] = True
            cap["capture_age_days"] = round(age.total_seconds() / 86400, 1)
            return report(cap, args, fresh=False)

    try:
        facilities = load_facilities()
        by_type, unparseable = parse_ids(facilities)
        found = overpass_fetch(by_type, args.timeout, args.batch)
        findings = compare(by_type, found, args.move_metres)
    except SoftSkip as e:
        if cap:
            print(f"[WARN] could not refresh ({e}); re-reporting capture {cap_path.name}")
            cap["reused"] = True
            return report(cap, args, fresh=False)
        print(f"[SKIP] {e} — and no capture to fall back on")
        return 2

    result = {
        "captured_at": now.isoformat(),
        # RECORDS, not objects — these differ whenever two records share an OSM
        # object (3 of 1,076 do, all created by the #1228 repointing). This key
        # has always been named "records" and used to hold the object count.
        "records_checked": sum(len(rs) for v in by_type.values() for rs in v.values()),
        "osm_objects_checked": sum(len(v) for v in by_type.values()),
        "osm_objects_returned": len(found),
        "unparseable_facility_ids": unparseable,
        "move_threshold_metres": args.move_metres,
        "counts": {k: len(v) for k, v in findings.items()},
        "findings": findings,
    }
    if not args.no_record:
        CAPTURE_DIR.mkdir(parents=True, exist_ok=True)
        out = CAPTURE_DIR / f"{now.date().isoformat()}.json"
        out.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        link = CAPTURE_DIR / "latest.json"
        if link.is_symlink() or link.exists():
            link.unlink()
        link.symlink_to(out.name)
    return report(result, args, fresh=True)


def report(result, args, fresh):
    # The baseline is applied HERE, on every report, fresh or cached — never baked
    # into the stored capture. A capture written before an entry was accepted must
    # go green the moment it is accepted, and a capture written before an entry was
    # REVOKED must go red again. Storing the verdict alongside the observation would
    # also mean an old capture lacking the field read as "nothing new", which is a
    # fail-open wearing a pass's uniform (the #818 shape).
    if "findings" not in result or "MISSING" not in (result.get("findings") or {}):
        raise SystemExit("[FAILED] capture has no MISSING findings list — cannot tell "
                         "'no drift' from 'not measured'")
    baseline = load_baseline()
    result["new_missing"] = [f for f in result["findings"]["MISSING"]
                             if missing_key(f) not in baseline]

    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        c = result["counts"]
        age = result.get("capture_age_days")
        tag = "fresh pull" if fresh else f"cached capture, {age}d old"
        objs = result.get("osm_objects_checked")
        # A capture written before osm_objects_checked existed does not get a
        # made-up value — the clause is simply absent, so the line never asserts
        # a distinct-object count nobody measured.
        over = f" over {objs} distinct OSM objects" if objs is not None else ""
        print(f"[osm-drift] {result['records_checked']} records{over} checked against OSM "
              f"({tag}); {result['osm_objects_returned']} objects returned")
        for k in ("MISSING", "MOVED", "NAME_CHANGED", "ENRICHABLE"):
            print(f"  {k:14} {c.get(k, 0)}")
        acc = result["counts"].get("MISSING", 0) - len(result.get("new_missing", []))
        if acc:
            print(f"  ({acc} MISSING already accepted in {BASELINE.name} — burn-down list)")
        for f in result["findings"]["MISSING"][:20]:
            print(f"    [MISSING] {f['slug']} — {f['reason']}")
        if result.get("unparseable_facility_ids"):
            print(f"  [note] {len(result['unparseable_facility_ids'])} facility_id(s) "
                  f"not in zaf_<type>_<id> form, not checked")
    unparseable = result.get("unparseable_facility_ids") or []
    if unparseable:
        print(f"\n[FAILED] {len(unparseable)} facility_id(s) do not parse as "
              f"zaf_<type>_<id>, so those facilities were NOT asked about and CANNOT be "
              f"reported MISSING. A record this check cannot see is not a record it "
              f"cleared (#1243e). Fix the id in src/data/facilities.json, or widen ID_RE "
              f"if the form is legitimate — do NOT accept it as a note.")
        for fid in unparseable[:20]:
            print(f"    [UNPARSEABLE] {fid}")
        return 1

    new = result.get("new_missing", [])
    if new:
        print(f"\n[FAILED] {len(new)} NEW published facility/ies are no longer a healthcare "
              f"object in OSM. Verify each by hand before removing — an OSM deletion can be "
              f"vandalism or a retag, not a closure. Accept with a note in "
              f"{BASELINE.name} once adjudicated.")
        for f in new:
            print(f"    [NEW] {f['slug']} — {f['reason']}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
