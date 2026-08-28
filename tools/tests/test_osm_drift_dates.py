"""#1372 — the osm-drift capture naming basis.

Two things need holding, and they are different failures:

  1. A capture must be NAMED and STAMPED in SAST. The run at 2026-08-21 00:33 SAST was
     written to `2026-08-20.json` because the tool used UTC, so a session told to check
     the 2026-08-21 capture found no such file.

  2. `latest_capture()` picks the newest file by NAME, so the corpus — which now mixes
     UTC-named and SAST-named files, deliberately, because renaming history is worse —
     must still sort chronologically. That is provable rather than lucky: SAST is ahead
     of UTC, so for any instant the SAST name is >= the UTC name for that instant, and
     instants only move forward.

Fixtures only, except for one assertion that reads the real capture directory — that one
is a read, never a write (#883).
"""
import importlib.util
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[2]
SPEC = importlib.util.spec_from_file_location("osm_drift_check", REPO / "tools" / "osm-drift-check.py")
mod = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(mod)


def test_sast_constant_is_utc_plus_two():
    assert mod.SAST == timezone(timedelta(hours=2))


def test_capture_name_would_be_todays_sast_date_not_yesterdays_utc_one():
    """The exact instant #1372 was filed for."""
    instant = datetime(2026, 8, 20, 22, 33, 43, tzinfo=timezone.utc)
    assert instant.date().isoformat() == "2026-08-20"          # what it used to write
    assert instant.astimezone(mod.SAST).date().isoformat() == "2026-08-21"  # what it writes now


def test_sast_naming_never_sorts_before_an_earlier_utc_name():
    """The lexical-order property `latest_capture()` depends on."""
    earlier = datetime(2026, 8, 20, 22, 33, tzinfo=timezone.utc)
    for minutes in range(0, 60 * 24 * 30, 97):
        later = earlier + timedelta(minutes=minutes)
        utc_name = earlier.date().isoformat()
        sast_name = later.astimezone(mod.SAST).date().isoformat()
        assert sast_name >= utc_name, (utc_name, sast_name)


def test_real_capture_dir_is_still_in_chronological_order():
    cap_dir = REPO / "data" / "capture" / "osm-drift"
    files = sorted(p for p in cap_dir.glob("*.json") if p.name != "latest.json")
    if len(files) < 2:
        pytest.skip("fewer than two captures on disk")
    stamps = [datetime.fromisoformat(json.loads(p.read_text())["captured_at"]) for p in files]
    assert stamps == sorted(stamps), "name order disagrees with captured_at order"


def test_the_one_misfiled_capture_is_documented_and_not_renamed():
    """2026-08-20.json really is the 2026-08-21 SAST run. It stays put; the README says so."""
    cap_dir = REPO / "data" / "capture" / "osm-drift"
    readme = cap_dir / "README.md"
    assert readme.exists(), "the mixed-corpus note is the whole remedy for the old files"
    misfiled = cap_dir / "2026-08-20.json"
    if misfiled.exists():
        stamp = datetime.fromisoformat(json.loads(misfiled.read_text())["captured_at"])
        assert stamp.astimezone(mod.SAST).date().isoformat() == "2026-08-21"
        assert "2026-08-20.json" in readme.read_text()
