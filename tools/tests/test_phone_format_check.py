"""Tests for tools/phone-format-check.py (#1510).

Fixtures are written into tmp_path only — never the live corpus, which other lanes and
the nightly keeper rewrite while a test runs (#883), and which this guard is supposed to
be able to fail on.

The suite is led by a verbatim reconstruction of the three numbers #1510 found, because a
guard that cannot be shown to go RED is decoration (#1140).
"""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

import pytest

MODULE_PATH = Path(__file__).resolve().parents[1] / "phone-format-check.py"
REPO = Path(__file__).resolve().parents[2]


def _load():
    spec = importlib.util.spec_from_file_location("phone_format_check", MODULE_PATH)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


chk = _load()


def _corpus(tmp_path: Path, records) -> Path:
    p = tmp_path / "facilities.json"
    p.write_text(json.dumps(records), encoding="utf-8")
    return p


def _defect(tmp_path: Path, slugs) -> Path:
    body = "".join(f"  '{s}': 'because',\n" for s in slugs)
    p = tmp_path / "phone-defect.ts"
    p.write_text(
        "export const PHONE_WITHHELD: Record<string, string> = {\n" + body + "};\n",
        encoding="utf-8",
    )
    return p


def rec(slug: str, phone: str) -> dict:
    return {"slug": slug, "contact": {"phone": phone}}


# ── the three real numbers ────────────────────────────────────────────────────

THE_THREE = [
    rec("pietertjie-de-beer-clinic-eastern-cape", "+27-42-555-13221"),
    rec("rynpark-1-frailcare-rynfield-benoni", "+27 11747705"),
    rec("comprehensive-health-care-parow-valley-cape-town", "+27 21 9320 6038"),
]


def test_red_on_the_three_numbers_1510_found(tmp_path):
    findings, published, with_phone = chk.scan(
        _corpus(tmp_path, THE_THREE), _defect(tmp_path, [])
    )
    assert len(findings) == 3
    assert published == 3 and with_phone == 3
    assert {f["slug"] for f in findings} == {r["slug"] for r in THE_THREE}


def test_reports_the_actual_digit_count_not_just_that_it_is_wrong(tmp_path):
    findings, _, _ = chk.scan(_corpus(tmp_path, THE_THREE), _defect(tmp_path, []))
    by_slug = {f["slug"]: f["reason"] for f in findings}
    assert "10 digits" in by_slug["pietertjie-de-beer-clinic-eastern-cape"]
    assert "8 digits" in by_slug["rynpark-1-frailcare-rynfield-benoni"]
    assert "10 digits" in by_slug["comprehensive-health-care-parow-valley-cape-town"]


def test_the_parow_resource_clears_it(tmp_path):
    """The value OSM way 740437416 actually carries must pass."""
    findings, _, _ = chk.scan(
        _corpus(tmp_path, [rec("comprehensive-health-care-parow-valley-cape-town", "+27 21 933 4545")]),
        _defect(tmp_path, []),
    )
    assert findings == []


def test_withholding_clears_a_finding_and_removes_it_from_the_published_count(tmp_path):
    findings, published, with_phone = chk.scan(
        _corpus(tmp_path, THE_THREE),
        _defect(tmp_path, ["pietertjie-de-beer-clinic-eastern-cape",
                           "rynpark-1-frailcare-rynfield-benoni"]),
    )
    assert [f["slug"] for f in findings] == ["comprehensive-health-care-parow-valley-cape-town"]
    # A withheld record still HAS a number; it just has no published segment.
    assert published == 1 and with_phone == 3


# ── shapes that must pass ─────────────────────────────────────────────────────

@pytest.mark.parametrize("phone", [
    "+27 21 933 4545",          # international, spaced
    "+27-46-645-1122",          # international, hyphenated
    "+27466451122",             # international, unspaced
    "021 933 4545",             # national with trunk 0
    "0219334545",
])
def test_well_formed_numbers_pass(tmp_path, phone):
    findings, published, _ = chk.scan(_corpus(tmp_path, [rec("x", phone)]), _defect(tmp_path, []))
    assert findings == [], phone
    assert published == 1


def test_multi_valued_osm_tag_is_segmented_like_phone_ts(tmp_path):
    """Citrusdal publishes three switchboard lines in one `;`-separated tag."""
    phone = "+27 22 921 2153; +27 22 921 2154; +27 22 921 2155"
    findings, published, _ = chk.scan(_corpus(tmp_path, [rec("citrusdal", phone)]), _defect(tmp_path, []))
    assert findings == []
    assert published == 3, "each segment is a number a reader can dial, so each is checked"


def test_a_bad_segment_inside_a_good_multi_value_is_still_caught(tmp_path):
    phone = "+27 22 921 2153; +27 22 921 21"
    findings, _, _ = chk.scan(_corpus(tmp_path, [rec("x", phone)]), _defect(tmp_path, []))
    assert len(findings) == 1, "a wrong number does not become right by sitting beside a right one"


def test_extension_is_stripped_before_counting(tmp_path):
    """Gansbaai holds `+27 28 814 3530 x3535`; the extension is not subscriber digits."""
    for phone in ["+27 28 814 3530 x3535", "+27 28 814 3530 ext 3535", "+27 28 814 3530 ext. 3535"]:
        findings, _, _ = chk.scan(_corpus(tmp_path, [rec("x", phone)]), _defect(tmp_path, []))
        assert findings == [], phone


def test_empty_phone_is_not_a_finding(tmp_path):
    findings, published, with_phone = chk.scan(
        _corpus(tmp_path, [rec("x", ""), rec("y", "")]), _defect(tmp_path, [])
    )
    assert findings == [] and published == 0 and with_phone == 0


def test_unrecognised_shape_is_reported_not_silently_passed(tmp_path):
    """A number that is neither +27 nor trunk-0 cannot be judged, so it is a finding."""
    findings, _, _ = chk.scan(_corpus(tmp_path, [rec("x", "+44 20 7946 0958")]), _defect(tmp_path, []))
    assert [f["reason"] for f in findings] == ["unrecognised-shape"]


# ── fail-loud properties ──────────────────────────────────────────────────────

def test_missing_corpus_is_a_soft_skip_not_a_pass(tmp_path):
    findings, published, with_phone = chk.scan(tmp_path / "nope.json", _defect(tmp_path, []))
    assert with_phone == -1, "the caller must be able to tell 'absent' from 'clean'"


def test_unparseable_corpus_raises_rather_than_reading_as_empty(tmp_path):
    p = tmp_path / "facilities.json"
    p.write_text("{not json", encoding="utf-8")
    with pytest.raises(SystemExit):
        chk.scan(p, _defect(tmp_path, []))


def test_missing_adjudication_module_raises_rather_than_withholding_nothing(tmp_path):
    """Reading 'nothing is withheld' off a file we could not open would re-file two
    adjudicated records as findings."""
    with pytest.raises(SystemExit):
        chk.scan(_corpus(tmp_path, THE_THREE), tmp_path / "absent.ts")


def test_unparseable_adjudication_module_raises(tmp_path):
    p = tmp_path / "phone-defect.ts"
    p.write_text("export const SOMETHING_ELSE = {};\n", encoding="utf-8")
    with pytest.raises(SystemExit):
        chk.scan(_corpus(tmp_path, THE_THREE), p)


# ── the guard must not drift from its producer ────────────────────────────────

def test_extension_pattern_matches_phone_ts(tmp_path):
    """`phone.ts` strips the extension before building the href; if that rule changes
    there and not here, this gate starts counting extension digits as subscriber digits
    ([[feedback_guard_table_narrower_than_corpus]])."""
    src = (REPO / "src" / "data" / "phone.ts").read_text(encoding="utf-8")
    assert r"/\s*(?:x|ext\.?|extension)\s*\d+\s*$/i" in src, (
        "phone.ts's extension rule moved — update EXTENSION_RE in phone-format-check.py"
    )


def test_live_corpus_is_green():
    """Ships GREEN (#875). If this fails, a number was published that cannot be dialled."""
    findings, published, with_phone = chk.scan(chk.FACILITIES, chk.PHONE_DEFECT)
    assert findings == [], findings
    assert published > 500, "sanity: the guard must actually be looking at the corpus"


def test_every_withheld_slug_still_exists_in_the_corpus():
    """A withheld slug that has left the corpus is a stale precondition — the entry now
    suppresses nothing and its evidence rots unread
    ([[feedback_stale_precondition_disables_guard]])."""
    records = json.loads(chk.FACILITIES.read_text(encoding="utf-8"))
    slugs = {r["slug"] for r in records}
    for s in chk.withheld_slugs(chk.PHONE_DEFECT):
        assert s in slugs, f"{s} is withheld in phone-defect.ts but is not in the corpus"


def test_every_withheld_number_would_actually_fail_the_gate():
    """An entry must be earning its place. If a withheld number is in fact well-formed,
    it should be published, not suppressed."""
    records = {r["slug"]: r for r in json.loads(chk.FACILITIES.read_text(encoding="utf-8"))}
    for s in chk.withheld_slugs(chk.PHONE_DEFECT):
        raw = (records[s].get("contact") or {}).get("phone") or ""
        lengths = [chk.subscriber_length(seg) for seg in chk.segments(raw)]
        assert any(l != chk.SUBSCRIBER_DIGITS for l in lengths), (
            f"{s} is withheld but its number is well-formed — publish it instead"
        )
