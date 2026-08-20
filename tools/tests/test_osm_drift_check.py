"""Unit tests for tools/osm-drift-check.py.

Everything here runs against synthetic records and a temp baseline — never the
live facilities.json or the live baseline, which change under the test and turn
a real regression into a green run.

The load-bearing test is `test_unaccepted_missing_is_red`: a guard that cannot
go RED is decoration, and this one ships with 8 accepted findings, so the only
proof it still works is that removing one fires.
"""

import importlib.util
import json
import sys
from pathlib import Path

import pytest

MOD_PATH = Path(__file__).resolve().parent.parent / "osm-drift-check.py"
spec = importlib.util.spec_from_file_location("osm_drift_check", MOD_PATH)
odc = importlib.util.module_from_spec(spec)
sys.modules["osm_drift_check"] = odc
spec.loader.exec_module(odc)


class Args:
    json = False


def rec(slug, fid, lat=-26.0, lng=28.0, name="Test Clinic", phone="", raw="", operator=""):
    return {
        "slug": slug, "facility_id": fid, "name": name,
        "coordinates": {"lat": lat, "lng": lng},
        "contact": {"phone": phone}, "operating_hours": {"raw": raw},
        "operator": operator,
    }


# ── id parsing ────────────────────────────────────────────────────────────────

def test_parses_node_way_relation():
    by_type, bad = odc.parse_ids([
        rec("a", "zaf_node_1"), rec("b", "zaf_way_2"), rec("c", "zaf_relation_3")])
    assert set(by_type["node"]) == {1}
    assert set(by_type["way"]) == {2}
    assert set(by_type["relation"]) == {3}
    assert bad == []


def test_plural_nodes_typo_is_parsed_not_exempted():
    """#1243e. 18 of the 1,076 published records carry `zaf_nodes_` (plural) — a
    ONE-CHARACTER typo that this regex, the gate into the entire check, silently
    refused. Those 18 were therefore permanently exempt from the closed-clinic
    detector while every run still printed a pass. The site's own render path
    already matched `^zaf_(way|nodes?)_(\\d+)$`, so the pages resolved these ids
    while the guard did not. This test previously asserted the BUG as intended
    behaviour, which is why it survived review.
    """
    by_type, bad = odc.parse_ids([rec("h", "zaf_nodes_99"), rec("i", "zaf_node_98")])
    assert set(by_type["node"]) == {98, 99}, "plural form must normalise to node"
    assert bad == []


def test_genuinely_unparseable_ids_are_reported_not_dropped():
    """An id in no recognised form must still be REPORTED, never silently skipped:
    a record the check cannot see is not a record it cleared."""
    by_type, bad = odc.parse_ids([rec("j", "garbage"), rec("k", "")])
    assert sum(len(v) for v in by_type.values()) == 0
    assert set(bad) == {"garbage", "k"}  # id when present, else the slug


def test_unparseable_id_fails_the_run(tmp_path, monkeypatch):
    """An unparseable id is now exit 1, not a [note]. Reading as a pass while a
    facility goes unasked-about is the #818 fail-open shape, and on a humanitarian
    directory the unasked facility is the one that has closed."""
    _baseline(tmp_path, monkeypatch, [])
    cap = _capture([])
    cap["unparseable_facility_ids"] = ["zaf_nodez_1"]
    assert odc.report(cap, Args(), fresh=True) == 1


def test_no_unparseable_ids_stays_green(tmp_path, monkeypatch):
    _baseline(tmp_path, monkeypatch, [])
    cap = _capture([])
    cap["unparseable_facility_ids"] = []
    assert odc.report(cap, Args(), fresh=True) == 0


# ── healthcare classification ─────────────────────────────────────────────────

@pytest.mark.parametrize("tags,expected", [
    ({"amenity": "clinic"}, True),
    ({"amenity": "hospital"}, True),
    ({"healthcare": "centre"}, True),
    ({"amenity": "school"}, False),
    ({}, False),
    ({"amenity": None}, False),
])
def test_is_healthcare(tags, expected):
    assert odc.is_healthcare(tags) is expected


def test_retagged_as_school_is_missing_not_a_name_change():
    """elliot-provincial-hospital-eastern-cape, the real 2026-08-19 case: OSM now
    calls it a school. That is the closed-facility signal, and it must not be
    softened into NAME_CHANGED."""
    by_type, _ = odc.parse_ids([rec("elliot", "zaf_way_5", name="Elliot Hospital")])
    found = {"way:5": {"tags": {"amenity": "school", "name": "Elliot Primary"},
                       "lat": -26.0, "lon": 28.0}}
    f = odc.compare(by_type, found, 500.0)
    assert len(f["MISSING"]) == 1
    assert "school" in f["MISSING"][0]["reason"]
    assert f["NAME_CHANGED"] == []


# ── geometry ──────────────────────────────────────────────────────────────────

def test_move_under_threshold_is_not_a_relocation():
    by_type, _ = odc.parse_ids([rec("a", "zaf_node_1", lat=-26.0, lng=28.0)])
    # ~110 m north
    found = {"node:1": {"tags": {"amenity": "clinic", "name": "Test Clinic"},
                        "lat": -25.999, "lon": 28.0}}
    assert odc.compare(by_type, found, 500.0)["MOVED"] == []


def test_move_over_threshold_is_flagged():
    by_type, _ = odc.parse_ids([rec("a", "zaf_node_1", lat=-26.0, lng=28.0)])
    found = {"node:1": {"tags": {"amenity": "clinic", "name": "Test Clinic"},
                        "lat": -26.05, "lon": 28.0}}
    moved = odc.compare(by_type, found, 500.0)["MOVED"]
    assert len(moved) == 1 and moved[0]["metres"] > 500


# ── enrichment (TODO #315) ────────────────────────────────────────────────────

def test_enrichable_only_when_we_lack_the_value():
    by_type, _ = odc.parse_ids([
        rec("has", "zaf_node_1", phone="+27 11 000 0000"),
        rec("lacks", "zaf_node_2", phone=""),
    ])
    tags = {"amenity": "clinic", "name": "Test Clinic", "phone": "+27 11 111 1111"}
    found = {"node:1": {"tags": tags, "lat": -26.0, "lon": 28.0},
             "node:2": {"tags": tags, "lat": -26.0, "lon": 28.0}}
    enr = odc.compare(by_type, found, 500.0)["ENRICHABLE"]
    assert [e["slug"] for e in enr] == ["lacks"]
    assert enr[0]["gains"] == ["phone"]


# ── baseline identity, not count ──────────────────────────────────────────────

def _baseline(tmp_path, monkeypatch, entries):
    p = tmp_path / "baseline.json"
    p.write_text(json.dumps({"accepted": entries}), encoding="utf-8")
    monkeypatch.setattr(odc, "BASELINE", p)
    return p


def _capture(missing):
    return {"records_checked": 1, "osm_objects_returned": 1,
            "counts": {"MISSING": len(missing), "MOVED": 0,
                       "NAME_CHANGED": 0, "ENRICHABLE": 0},
            "findings": {"MISSING": missing, "MOVED": [],
                         "NAME_CHANGED": [], "ENRICHABLE": []}}


GONE = {"slug": "a", "name": "A", "osm": "node:1",
        "reason": "object no longer returned by Overpass"}


def test_accepted_missing_is_green(tmp_path, monkeypatch):
    _baseline(tmp_path, monkeypatch, [{"key": odc.missing_key(GONE)}])
    assert odc.report(_capture([GONE]), Args(), fresh=True) == 0


def test_unaccepted_missing_is_red(tmp_path, monkeypatch):
    _baseline(tmp_path, monkeypatch, [])
    assert odc.report(_capture([GONE]), Args(), fresh=True) == 1


def test_same_facility_new_reason_refires(tmp_path, monkeypatch):
    """Key includes the reason on purpose: 'the object vanished' and 'the object
    is now a school' are different facts about the same facility, and the second
    is new information even though the slug was already accepted."""
    _baseline(tmp_path, monkeypatch, [{"key": odc.missing_key(GONE)}])
    retagged = dict(GONE, reason="no longer tagged healthcare (amenity='school')")
    assert odc.report(_capture([retagged]), Args(), fresh=True) == 1


def test_one_resolved_one_new_does_not_net_out(tmp_path, monkeypatch):
    """The reason the baseline is identity-keyed rather than a count: with a count
    ratchet this run is green, because 1 accepted became 1 different one."""
    _baseline(tmp_path, monkeypatch, [{"key": odc.missing_key(GONE)}])
    other = {"slug": "b", "name": "B", "osm": "node:2",
             "reason": "object no longer returned by Overpass"}
    assert odc.report(_capture([other]), Args(), fresh=True) == 1


def test_baseline_applies_to_a_cached_capture_too(tmp_path, monkeypatch):
    """A stored capture must never carry its own verdict. Re-reporting one from
    cache re-applies the CURRENT baseline, so accepting an entry clears it and
    revoking one re-fires it without another network pull."""
    _baseline(tmp_path, monkeypatch, [])
    cap = _capture([GONE])
    assert odc.report(dict(cap), Args(), fresh=False) == 1
    _baseline(tmp_path, monkeypatch, [{"key": odc.missing_key(GONE)}])
    assert odc.report(dict(cap), Args(), fresh=False) == 0


# ── fail-loud paths ───────────────────────────────────────────────────────────

def test_unreadable_baseline_is_a_hard_failure(tmp_path, monkeypatch):
    p = tmp_path / "baseline.json"
    p.write_text("{not json", encoding="utf-8")
    monkeypatch.setattr(odc, "BASELINE", p)
    with pytest.raises(SystemExit):
        odc.report(_capture([GONE]), Args(), fresh=True)


def test_missing_baseline_file_means_nothing_accepted(tmp_path, monkeypatch):
    monkeypatch.setattr(odc, "BASELINE", tmp_path / "absent.json")
    assert odc.report(_capture([GONE]), Args(), fresh=True) == 1


def test_capture_without_findings_is_a_hard_failure(tmp_path, monkeypatch):
    """'No drift' and 'not measured' are different facts. A capture from an older
    shape must not read as a clean run — feedback_unreadable_is_not_absent."""
    _baseline(tmp_path, monkeypatch, [])
    with pytest.raises(SystemExit):
        odc.report({"counts": {}}, Args(), fresh=False)


def test_clean_run_is_green(tmp_path, monkeypatch):
    _baseline(tmp_path, monkeypatch, [])
    assert odc.report(_capture([]), Args(), fresh=True) == 0


# ── two records on one OSM object (#1351/#1363 reconciliation) ────────────────
#
# `parse_ids` used to do `by_type[etype][id] = r`, so the second record to land
# on an id silently replaced the first and was never compared. It was invisible
# because the dropped record left the denominator too: the run said "1073
# records checked" and 1073 was the count of distinct OBJECTS.
#
# The collision is real and was created by the fix to #1228, which repointed 8
# facilities onto the object that still carried them; three landed on an object
# another record already used. These tests are led by a verbatim reconstruction
# of the H.A. Grove pair, whose NAME_CHANGED finding was actually being lost.

HA_GROVE = "way:468966258"


def _grove_pair():
    return [
        rec("ha-grove-hospital-mpumalanga", "zaf_way_468966258", name="Ha Grove Hospital"),
        rec("ha-grove-hospital-belfast-mpumalanga", "zaf_way_468966258",
            name="H.A. Grove Hospital"),
    ]


def _el(name, lat=-26.0, lon=28.0, **tags):
    return {"lat": lat, "lon": lon, "tags": {"amenity": "hospital", "name": name, **tags}}


def test_two_records_on_one_object_are_both_parsed():
    by_type, bad = odc.parse_ids(_grove_pair())
    assert bad == []
    assert list(by_type["way"]) == [468966258]
    assert len(by_type["way"][468966258]) == 2, "the second record must not overwrite the first"


def test_records_and_objects_are_counted_separately():
    """The mislabel that hid this: a coverage number reading 'records' held an
    object count, so 1,076 records over 1,073 objects was self-consistent at
    1073 and three records were missing from both sides of the ratio."""
    by_type, _ = odc.parse_ids(_grove_pair() + [rec("solo", "zaf_node_7")])
    records = sum(len(rs) for v in by_type.values() for rs in v.values())
    objects = sum(len(v) for v in by_type.values())
    assert (records, objects) == (3, 2)


def test_shared_object_name_drift_is_not_lost():
    """The finding that was actually being dropped on the live corpus: OSM says
    'H.A. Grove Hospital', one of our two records says 'Ha Grove Hospital', and
    it never appeared in the 2026-08-19 capture because the other record won the
    dict slot."""
    by_type, _ = odc.parse_ids(_grove_pair())
    findings = odc.compare(by_type, {HA_GROVE: _el("H.A. Grove Hospital")}, 500.0)
    drifted = [f["slug"] for f in findings["NAME_CHANGED"]]
    assert drifted == ["ha-grove-hospital-mpumalanga"]


def test_shared_object_gone_reports_both_slugs():
    """Two published pages describe the object, so a vanished object is two
    findings — the baseline is keyed on slug and each page needs its own
    disposition. Netting them to one would accept both by accepting either."""
    by_type, _ = odc.parse_ids(_grove_pair())
    findings = odc.compare(by_type, {}, 500.0)
    assert sorted(f["slug"] for f in findings["MISSING"]) == [
        "ha-grove-hospital-belfast-mpumalanga", "ha-grove-hospital-mpumalanga"]
    assert {f["reason"] for f in findings["MISSING"]} == {
        "object no longer returned by Overpass"}


def test_shared_object_retagged_reports_both_slugs():
    by_type, _ = odc.parse_ids(_grove_pair())
    el = {"lat": -26.0, "lon": 28.0, "tags": {"amenity": "school", "name": "X"}}
    findings = odc.compare(by_type, {HA_GROVE: el}, 500.0)
    assert len(findings["MISSING"]) == 2
    assert all("no longer tagged healthcare" in f["reason"] for f in findings["MISSING"])


def test_report_omits_object_clause_on_a_pre_change_capture(capsys, tmp_path, monkeypatch):
    """An old capture has no osm_objects_checked. It must not be given a made-up
    one — the clause is absent rather than asserting a count nobody measured."""
    _baseline(tmp_path, monkeypatch, [])
    odc.report(_capture([]), Args(), fresh=False)
    line = capsys.readouterr().out.splitlines()[0]
    assert "distinct OSM objects" not in line


def test_report_shows_both_counts_when_measured(capsys, tmp_path, monkeypatch):
    _baseline(tmp_path, monkeypatch, [])
    cap = _capture([])
    cap["records_checked"], cap["osm_objects_checked"] = 1076, 1073
    odc.report(cap, Args(), fresh=True)
    line = capsys.readouterr().out.splitlines()[0]
    assert "1076 records over 1073 distinct OSM objects" in line
