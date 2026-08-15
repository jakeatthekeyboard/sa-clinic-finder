#!/usr/bin/env python3
"""
Numeric parity between each English page and its translations.

WHY THIS EXISTS
---------------
ClinicFinder is YMYL health content. A dropped or altered digit is the one class of
translation defect the machine-translation disclaimer cannot cover: a reader who is
told to take a pill for "6 months" instead of "6 years", or who reads a triage
threshold with a digit missing, is harmed by a page that otherwise looks perfect and
returns 200. No other check on this site can see it — the build passes, the links
resolve, the schema validates, the page renders.

It has now bitten three times, which is what turned it from a one-off audit into a
committed guard (the repeat-finding rule):
  1. /xh/services/emergency shipped with the whole `emergency_24h` editorial missing —
     10177, 112 and the SATS triage bands simply absent.
  2. "3-fold" and hypertension "Step 1..4" ordinals rendered as isiXhosa words,
     dropping the digits.
  3. Four /xh guides from the first translation commit (44adb36), which predated any
     mechanical check and were verified by eye, each drop 1-4 digits.

WHAT IT COMPARES
----------------
The multiset of numeric tokens in the RENDERED VISIBLE TEXT of an English page against
the same for each translated counterpart. Rendered text, not source: a figure that
survives in a source file but is swallowed by markup is still missing from the reader's
page, and that is the question being asked.

TWO INSTRUMENT BUGS ARE FIXED HERE BY CONSTRUCTION, BOTH OF WHICH ALREADY PRODUCED
FALSE VERDICTS during this work. A checker that cries wolf gets switched off, and a
checker that accuses a CORRECT translation of inventing content is worse than none:

  a) HTML entities must be decoded BEFORE digits are extracted. `&#39;` (an apostrophe)
     read as the number 39 flagged all 26 pages on one agent's first run.
  b) Tags must be stripped with a parser, never `<[^>]+>`. Clinical thresholds are
     written `<10 min`, `<140/90`, `<50 copies/mL`; a regex stripper treats `<10 min...`
     as an unclosed tag and eats the text after it. That happens on the ENGLISH side
     only (translations often render the same threshold in words), so it reports the
     translation as carrying figures English lacks — i.e. it accuses a faithful
     translation of fabricating clinical data.

WHAT COUNTS AS A FAILURE
------------------------
Only digits MISSING from the translation, or PRESENT IN A DIFFERENT QUANTITY. A
translation legitimately renders some standalone numerals as words — isiXhosa and
isiZulu both do this ("oyedwa kwabathathu" = "one in three"), and forcing a digit there
would be worse language, not better data. Those are accepted via an IDENTITY-KEYED
baseline (`page|value|delta`), not a count: a count-only ratchet stays green when one
accepted omission is fixed and a different, real one appears the same night — which is
exactly the event this guard exists to catch. Fixing prose changes the key and
self-clears; a NEW omission mints a new key and fires.

Multi-digit figures are NEVER accepted as number-words. A language may say "one in
three"; none of them spells out 140/90, 10177 or R1,200 in running prose, so an
omission there is always real. The baseline schema enforces this: an entry whose value
has more than one digit is rejected at load.

Exit 1 = new drift, 2 = soft skip (no build to compare), 0 = clean.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from collections import Counter

REPO = Path(__file__).resolve().parent.parent
BASELINE = REPO / "tools" / "numeric-parity-baseline.json"
DIST_CANDIDATES = [REPO / ".vercel" / "output" / "static", REPO / "dist"]

# Locale prefixes, mirroring src/i18n/config.ts. Kept as a literal rather than parsed
# out of the TS so this tool has no build dependency and can run on a bare checkout.
LOCALES = {"xh": "/xh", "zu": "/zu"}

# Blocks whose text is not read by a human as page content.
SKIP_TAGS = {"script", "style", "noscript", "template"}


class VisibleText(HTMLParser):
    """Extracts rendered visible text. Uses a real parser so `<10 min` survives."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self._skip_depth = 0

    def handle_starttag(self, tag, attrs):
        if tag in SKIP_TAGS:
            self._skip_depth += 1

    def handle_endtag(self, tag):
        if tag in SKIP_TAGS and self._skip_depth:
            self._skip_depth -= 1

    def handle_data(self, data):
        if not self._skip_depth:
            self.parts.append(data)

    def text(self) -> str:
        return " ".join(self.parts)


def visible_text(html: str) -> str:
    p = VisibleText()
    # html.parser can raise on genuinely malformed markup; a parse failure must be a
    # loud error, never a silently empty page that would then "match" anything.
    p.feed(html)
    p.close()
    return p.text()


# A numeric token: an integer or decimal, with optional thousands separators.
# Deliberately captures the DIGITS ONLY — not the unit — so "6 months" vs "6 iinyanga"
# compares equal. The unit is prose and is meant to be translated; the figure is not.
NUM = re.compile(r"\d[\d,.]*")


def numeric_tokens(html: str) -> Counter:
    text = visible_text(html)
    out: Counter = Counter()
    for m in NUM.finditer(text):
        tok = m.group(0).rstrip(".,")  # trailing sentence punctuation
        if tok:
            out[tok] += 1
    return out


def find_dist() -> Path | None:
    for d in DIST_CANDIDATES:
        if (d / "index.html").is_file():
            return d
    return None


def page_file(dist: Path, path: str) -> Path | None:
    rel = "index.html" if path == "/" else path.lstrip("/")
    for cand in (dist / (rel + ".html"), dist / rel / "index.html", dist / rel):
        if cand.is_file():
            return cand
    return None


def english_pages(dist: Path) -> list[str]:
    """Every built English page path, i.e. everything not under a locale prefix."""
    prefixes = tuple(p.lstrip("/") for p in LOCALES.values())
    pages = []
    for f in dist.rglob("*.html"):
        rel = f.relative_to(dist).as_posix()
        top = rel.split("/", 1)[0]
        if top in prefixes:
            continue
        path = "/" + rel[: -len("/index.html")] if rel.endswith("/index.html") else "/" + rel[:-5]
        pages.append("/" if path in ("/index", "/") else path)
    return sorted(set(pages))


def load_baseline() -> set[str]:
    if not BASELINE.is_file():
        return set()
    try:
        raw = json.loads(BASELINE.read_text())
    except (json.JSONDecodeError, OSError) as e:
        # An unreadable baseline disarms the guard for every page at once. That is a
        # hard failure, never a soft skip — see feedback_unreadable_is_not_absent.
        print(f"[FAILED] baseline unreadable: {e}", file=sys.stderr)
        sys.exit(1)
    accepted = set()
    for entry in raw.get("accepted", []):
        key = entry.get("key", "")
        value = key.split("|")[1] if key.count("|") >= 2 else ""
        digits = re.sub(r"\D", "", value)
        if len(digits) > 1:
            print(
                f"[FAILED] baseline entry {key!r} accepts a MULTI-DIGIT omission. "
                "No language spells 140/90 or 10177 as words in running prose; a "
                "missing multi-digit figure is always a real defect.",
                file=sys.stderr,
            )
            sys.exit(1)
        accepted.add(key)
    return accepted


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--only", help="restrict to page paths containing this substring (e.g. /guides/)")
    ap.add_argument("--write-baseline", action="store_true", help="accept current single-digit omissions")
    args = ap.parse_args()

    dist = find_dist()
    if dist is None:
        print("[SKIP] no build output — run `astro build` first", file=sys.stderr)
        return 2

    accepted = set() if args.write_baseline else load_baseline()
    findings = []
    compared = 0

    for path in english_pages(dist):
        if args.only and args.only not in path:
            continue
        en_file = page_file(dist, path)
        if en_file is None:
            continue
        en_tokens = numeric_tokens(en_file.read_text(encoding="utf-8", errors="replace"))

        for code, prefix in LOCALES.items():
            t_path = prefix if path == "/" else prefix + path
            t_file = page_file(dist, t_path)
            if t_file is None:
                continue  # not translated yet — coverage guard's job, not this one
            compared += 1
            t_tokens = numeric_tokens(t_file.read_text(encoding="utf-8", errors="replace"))

            missing = en_tokens - t_tokens
            extra = t_tokens - en_tokens
            for value, count in sorted(missing.items()):
                key = f"{t_path}|{value}|-{count}"
                if key in accepted:
                    continue
                findings.append({
                    "page": t_path, "locale": code, "kind": "missing",
                    "value": value, "count": count, "key": key,
                    "detail": f"English has {value!r} {en_tokens[value]}x, {code} has {t_tokens[value]}x",
                })
            for value, count in sorted(extra.items()):
                key = f"{t_path}|{value}|+{count}"
                if key in accepted:
                    continue
                findings.append({
                    "page": t_path, "locale": code, "kind": "extra",
                    "value": value, "count": count, "key": key,
                    "detail": f"{code} has {value!r} {t_tokens[value]}x, English has {en_tokens[value]}x",
                })

    if args.write_baseline:
        singles = [f for f in findings if len(re.sub(r"\D", "", f["value"])) <= 1]
        multis = [f for f in findings if len(re.sub(r"\D", "", f["value"])) > 1]
        BASELINE.write_text(json.dumps({
            "_comment": "Accepted numeric-parity differences, identity-keyed as page|value|delta. "
                        "A language may render a STANDALONE numeral as a word; multi-digit figures "
                        "are never acceptable as words and cannot be baselined.",
            "accepted": [{"key": f["key"], "reason": "numeral rendered as a word in this language"} for f in sorted(singles, key=lambda x: x["key"])],
        }, indent=2) + "\n")
        print(f"[baseline] accepted {len(singles)} single-digit difference(s); "
              f"{len(multis)} multi-digit difference(s) NOT baselined and remain failures")
        findings = multis

    if args.json:
        print(json.dumps({"compared": compared, "findings": findings}, indent=2))
    else:
        print(f"[numeric-parity] compared {compared} translated page(s) against their English source")
        if not findings:
            print("[OK] every translated page carries exactly the figures of its English source")
        else:
            by_page: dict[str, list] = {}
            for f in findings:
                by_page.setdefault(f["page"], []).append(f)
            print(f"[FAILED] {len(findings)} numeric difference(s) across {len(by_page)} page(s)\n")
            for page, fs in sorted(by_page.items()):
                print(f"  {page}")
                for f in fs:
                    sign = "MISSING from" if f["kind"] == "missing" else "EXTRA in"
                    print(f"    {f['value']!r} x{f['count']} {sign} translation — {f['detail']}")

    return 1 if findings else 0


if __name__ == "__main__":
    sys.exit(main())
