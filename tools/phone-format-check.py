#!/usr/bin/env python3
"""phone-format-check.py — every telephone number we PUBLISH is dialable.

WHY (#1510)
-----------
582 of 1,076 facility records carry a `contact.phone`, and the facility page renders each
one as a `tel:` link on a public health directory. Three held a subscriber part of the
WRONG LENGTH, so a reader who tapped "Call" reached nobody:

    pietertjie-de-beer-clinic-eastern-cape      +27-42-555-13221   ten digits, needs nine
    rynpark-1-frailcare-rynfield-benoni         +27 11747705       eight digits
    comprehensive-health-care-parow-valley…     +27 21 9320 6038   ten digits

Nothing in the repo could see them. `phone.ts` segments a multi-valued OSM tag and strips
an extension so the `href` is dialable PUNCTUATION-wise; it never asked whether the digits
add up. The Playwright link crawler follows `href="/..."` and does not visit `tel:`. The
build is happy, the page returns 200, every test is green, and the only symptom is a sick
person who dials and gets nothing — the same class of harm as a wrong address, and worse,
because the reader believes they have a working contact.

WHAT IS ASSERTED, AND WHY IT IS SAFE TO ASSERT
----------------------------------------------
South African subscriber numbers are NINE digits after the +27 country code, or ten
written nationally with the leading 0. That is a numbering-plan fact, not a judgement, so
this is arithmetic and not a heuristic — which is what makes it a gate rather than an
advisory. It reasons on the RENDERED set: it segments at `;` and strips extensions exactly
as `phone.ts` does (a fixture test pins the two to each other), because the reader's
surface is what matters, not the raw tag.

IT NEVER PROPOSES A CORRECTION, and that is the design. Padding or truncating a number to
the right length manufactures a plausible WRONG number, which is strictly worse than an
obviously broken one: a broken number fails visibly, and a plausible one connects a sick
person to an unrelated household. #1510 forbids it explicitly.

RECOVERING A HIT — two routes, and only two:
  1. Re-source it. Read the OSM object's own `phone`/`contact:phone`. That is how the
     Parow Valley number was fixed: a mapper had already corrected it to +27 21 933 4545
     in changeset 182687941 on 2026-05-15 and we had not re-pulled.
  2. If OSM is silent or equally malformed, WITHHOLD it — add the slug to
     `src/data/phone-defect.ts` with the evidence — and the number stops rendering in all
     three languages.
A withheld record is not a finding here: it is not published, so there is nothing to
dial. The two entries in `phone-defect.ts` are therefore not "accepted debt" in the
count-ratchet sense — they are records with no published number at all.

SHIPS GREEN at 0 findings over 633 published segments, and is PROVED RED: replayed
against the pre-fix corpus (`--facilities <path>` at HEAD~) it reports all three.

Exit 0 = every published number is well-formed, 1 = a finding or an unreadable corpus
(an unreadable corpus is never an empty one — [[feedback_unreadable_is_not_absent]]),
2 = soft skip (corpus absent).
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
FACILITIES = REPO / "src" / "data" / "facilities.json"
PHONE_DEFECT = REPO / "src" / "data" / "phone-defect.ts"

#: Mirrors phone.ts `withoutExtension`. Pinned by a unit test.
EXTENSION_RE = re.compile(r"\s*(?:x|ext\.?|extension)\s*\d+\s*$", re.IGNORECASE)

#: South African subscriber length, per the national numbering plan.
SUBSCRIBER_DIGITS = 9


def segments(raw: str) -> list[str]:
    """Split a sourced `contact.phone` the way `phone.ts` does: at `;`, extension off."""
    if not raw:
        return []
    out = []
    for part in raw.split(";"):
        part = part.strip()
        if not part:
            continue
        out.append(EXTENSION_RE.sub("", part))
    return out


def subscriber_length(segment: str) -> int | None:
    """Digits after the country/trunk prefix, or None when the shape is unrecognised."""
    digits = re.sub(r"\D", "", segment)
    if not digits:
        return None
    if segment.lstrip().startswith("+"):
        if not digits.startswith("27"):
            return None
        return len(digits) - 2
    if digits.startswith("27"):
        return len(digits) - 2
    if digits.startswith("0"):
        return len(digits) - 1
    return None


def withheld_slugs(path: Path = PHONE_DEFECT) -> set[str]:
    """Slugs whose number is withheld from every rendered surface.

    Parsed from the adjudication module rather than imported, so this stays a pure Python
    gate with no node dependency. A MISSING module is a hard failure, not an empty set:
    reading "nothing is withheld" from a file we could not open would turn two adjudicated
    records into two findings and send someone to re-adjudicate them.
    """
    if not path.exists():
        raise SystemExit(f"[FAILED] {path} is missing — cannot tell which numbers are withheld")
    text = path.read_text(encoding="utf-8")
    block = re.search(
        r"export const PHONE_WITHHELD:[^=]*=\s*\{(.*?)^\};", text, re.S | re.M
    )
    if not block:
        raise SystemExit(f"[FAILED] {path} has no parseable PHONE_WITHHELD block")
    return set(re.findall(r"^\s*'([a-z0-9-]+)':", block.group(1), re.M))


def scan(facilities_path: Path, defect_path: Path) -> tuple[list[dict], int, int]:
    if not facilities_path.exists():
        return [], 0, -1
    try:
        records = json.loads(facilities_path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as exc:
        raise SystemExit(f"[FAILED] {facilities_path} exists but does not parse: {exc}")

    withheld = withheld_slugs(defect_path)
    findings, published, with_phone = [], 0, 0
    for rec in records:
        slug = rec.get("slug", "")
        raw = (rec.get("contact") or {}).get("phone") or ""
        if raw:
            with_phone += 1
        if slug in withheld:
            continue  # not published — nothing for a reader to dial
        for seg in segments(raw):
            published += 1
            length = subscriber_length(seg)
            if length is None:
                findings.append({"slug": slug, "segment": seg, "reason": "unrecognised-shape"})
            elif length != SUBSCRIBER_DIGITS:
                findings.append(
                    {
                        "slug": slug,
                        "segment": seg,
                        "reason": f"subscriber part is {length} digits, expected {SUBSCRIBER_DIGITS}",
                    }
                )
    return findings, published, with_phone


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--facilities", type=Path, default=FACILITIES)
    ap.add_argument("--phone-defect", type=Path, default=PHONE_DEFECT)
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    findings, published, with_phone = scan(args.facilities, args.phone_defect)
    if with_phone == -1:
        print(f"[SKIP] no facilities corpus at {args.facilities}")
        return 2

    withheld = sorted(withheld_slugs(args.phone_defect))
    if args.json:
        print(json.dumps({
            "findings": findings, "published_segments": published,
            "records_with_a_phone": with_phone, "withheld": withheld,
        }, indent=1))
    elif findings:
        print(f"[FAILED] {len(findings)} published telephone number(s) cannot be dialled:")
        for f in findings:
            print(f"    {f['slug']}: {f['segment']!r} — {f['reason']}")
        print("\n    Do NOT pad or truncate to the right length — that publishes a plausible")
        print("    WRONG number. Re-source from the record's OSM object, or withhold it in")
        print("    src/data/phone-defect.ts with the evidence.")
    else:
        print(
            f"[PASS] {published} published telephone segment(s) across {with_phone} record(s) "
            f"with a number are well-formed; {len(withheld)} withheld in phone-defect.ts"
        )
    return 1 if findings else 0


if __name__ == "__main__":
    sys.exit(main())
