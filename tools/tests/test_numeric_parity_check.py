"""
Unit tests for tools/numeric-parity-check.py.

Every test builds a SYNTHETIC dist in tmp_path. None of them read the live build —
a guard tested against the corpus it guards goes green for the wrong reason the day
the corpus changes, and can never be shown to go red on demand.

The first two tests are the point of the file: a guard that cannot go RED is
decoration. They reproduce the exact defect class this tool was written for.
"""
import importlib.util
import json
import sys
from pathlib import Path

import pytest

TOOL = Path(__file__).resolve().parent.parent / "numeric-parity-check.py"
spec = importlib.util.spec_from_file_location("numeric_parity_check", TOOL)
npc = importlib.util.module_from_spec(spec)
sys.modules["numeric_parity_check"] = npc
spec.loader.exec_module(npc)


def build_dist(tmp_path: Path, pages: dict[str, str]) -> Path:
    """pages maps a site path ('/guides/x') to raw HTML."""
    dist = tmp_path / "dist"
    for path, html in pages.items():
        rel = "index.html" if path == "/" else path.lstrip("/") + "/index.html"
        f = dist / rel
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(html, encoding="utf-8")
    (dist / "index.html").parent.mkdir(parents=True, exist_ok=True)
    if not (dist / "index.html").exists():
        (dist / "index.html").write_text("<html><body>home</body></html>")
    return dist


def run(monkeypatch, tmp_path, dist, baseline=None, argv=("prog",)):
    monkeypatch.setattr(npc, "DIST_CANDIDATES", [dist])
    bfile = tmp_path / "baseline.json"
    if baseline is not None:
        bfile.write_text(json.dumps(baseline))
    monkeypatch.setattr(npc, "BASELINE", bfile)
    monkeypatch.setattr(sys, "argv", list(argv))
    return npc.main()


# ── the defect this exists to catch ──────────────────────────────────────────

def test_red_on_a_dropped_multi_digit_figure(monkeypatch, tmp_path, capsys):
    """A dosage that lost a digit in translation. This MUST fail."""
    dist = build_dist(tmp_path, {
        "/guides/tb": "<html><body><p>Treatment lasts 6 months. Call 10177.</p></body></html>",
        "/xh/guides/tb": "<html><body><p>Unyango luthatha iinyanga ezi-6. Biza 1017.</p></body></html>",
    })
    assert run(monkeypatch, tmp_path, dist) == 1
    out = capsys.readouterr().out
    assert "10177" in out and "MISSING" in out


def test_red_when_a_whole_editorial_block_is_absent(monkeypatch, tmp_path, capsys):
    """The /xh/services/emergency case: an entire section, and its numbers, missing."""
    dist = build_dist(tmp_path, {
        "/services/emergency": "<html><body><p>Call 10177 or 112. Triage: red 0 min, orange 10 min.</p></body></html>",
        "/xh/services/emergency": "<html><body><p>Ungxamiseko.</p></body></html>",
    })
    assert run(monkeypatch, tmp_path, dist) == 1
    out = capsys.readouterr().out
    for figure in ("10177", "112", "10"):
        assert figure in out


# ── the two instrument bugs that produced false verdicts in the field ────────

def test_html_entities_are_decoded_before_digits_are_read(monkeypatch, tmp_path):
    """`&#39;` must not be counted as the number 39 (flagged all 26 pages once)."""
    dist = build_dist(tmp_path, {
        "/a": "<html><body><p>South Africa&#39;s programme covers 5 people.</p></body></html>",
        "/xh/a": "<html><body><p>Inkqubo yoMzantsi Afrika igubungela abantu aba-5.</p></body></html>",
    })
    assert run(monkeypatch, tmp_path, dist) == 0


def test_a_less_than_threshold_does_not_eat_the_rest_of_the_page(monkeypatch, tmp_path):
    """
    `<50 copies/mL` is literal text, not a tag. A regex tag-stripper swallows
    everything after it on the ENGLISH side only, which then reports the
    translation as having INVENTED clinical figures.
    """
    en = "<html><body><p>Undetectable is &lt;50 copies/mL. Target BP &lt;140/90. Review at 6 months.</p></body></html>"
    xh = "<html><body><p>Ayibonakali ngu-&lt;50 copies/mL. Ujoliso lwe-BP &lt;140/90. Uphononongo kwiinyanga ezi-6.</p></body></html>"
    dist = build_dist(tmp_path, {"/b": en, "/xh/b": xh})
    assert run(monkeypatch, tmp_path, dist) == 0


def test_script_and_style_contents_are_not_page_text(monkeypatch, tmp_path):
    """Analytics ids and CSS lengths are not figures a reader sees."""
    dist = build_dist(tmp_path, {
        "/c": '<html><head><script>var id=99887;</script><style>.x{width:42px}</style></head><body><p>3 clinics</p></body></html>',
        "/xh/c": '<html><head><script>var id=11111;</script></head><body><p>iikliniki ezi-3</p></body></html>',
    })
    assert run(monkeypatch, tmp_path, dist) == 0


# ── acceptance semantics ─────────────────────────────────────────────────────

def test_numeral_as_a_word_can_be_baselined(monkeypatch, tmp_path):
    dist = build_dist(tmp_path, {
        "/d": "<html><body><p>1 in 3 adults.</p></body></html>",
        "/xh/d": "<html><body><p>omnye kwabathathu abantu abadala.</p></body></html>",
    })
    assert run(monkeypatch, tmp_path, dist) == 1
    baseline = {"accepted": [
        {"key": "/xh/d|1|-1", "reason": "omnye"},
        {"key": "/xh/d|3|-1", "reason": "kwabathathu"},
    ]}
    assert run(monkeypatch, tmp_path, dist, baseline=baseline) == 0


def test_a_multi_digit_omission_can_never_be_baselined(monkeypatch, tmp_path, capsys):
    """
    The escape hatch that would defeat the whole guard. No language writes 10177
    as a word, so accepting one can only ever hide a real defect.
    """
    dist = build_dist(tmp_path, {
        "/e": "<html><body><p>Call 10177.</p></body></html>",
        "/xh/e": "<html><body><p>Biza.</p></body></html>",
    })
    baseline = {"accepted": [{"key": "/xh/e|10177|-1", "reason": "trying to sweep this away"}]}
    with pytest.raises(SystemExit) as exc:
        run(monkeypatch, tmp_path, dist, baseline=baseline)
    assert exc.value.code == 1
    assert "MULTI-DIGIT" in capsys.readouterr().err


def test_baseline_key_is_identity_not_a_count(monkeypatch, tmp_path):
    """
    A count-only ratchet stays green when one accepted omission is fixed and a
    different, real one appears the same run. The identity key must fire instead.
    """
    baseline = {"accepted": [{"key": "/xh/f|1|-1", "reason": "omnye"}]}
    fixed_but_new_defect = build_dist(tmp_path, {
        "/f": "<html><body><p>1 in 3 adults, 6 month course.</p></body></html>",
        # the '1' omission is fixed; a NEW '6' omission appears. Same total count.
        "/xh/f": "<html><body><p>1 kwabathathu abantu abadala, inyanga ezintathu.</p></body></html>",
    })
    assert run(monkeypatch, tmp_path, fixed_but_new_defect, baseline=baseline) == 1


def test_an_unreadable_baseline_is_a_hard_failure_not_a_skip(monkeypatch, tmp_path, capsys):
    """A baseline that silently fails to parse disarms the guard for every page."""
    dist = build_dist(tmp_path, {"/g": "<html><body>1</body></html>"})
    bfile = tmp_path / "baseline.json"
    bfile.write_text("{ not json")
    monkeypatch.setattr(npc, "DIST_CANDIDATES", [dist])
    monkeypatch.setattr(npc, "BASELINE", bfile)
    monkeypatch.setattr(sys, "argv", ["prog"])
    with pytest.raises(SystemExit) as exc:
        npc.main()
    assert exc.value.code == 1
    assert "unreadable" in capsys.readouterr().err


def test_no_build_is_a_soft_skip(monkeypatch, tmp_path):
    monkeypatch.setattr(npc, "DIST_CANDIDATES", [tmp_path / "nope"])
    monkeypatch.setattr(sys, "argv", ["prog"])
    assert npc.main() == 2


def test_untranslated_pages_are_not_a_parity_failure(monkeypatch, tmp_path):
    """Coverage is a different guard's job; absence here must not be reported."""
    dist = build_dist(tmp_path, {"/h": "<html><body><p>7 clinics</p></body></html>"})
    assert run(monkeypatch, tmp_path, dist) == 0


def test_units_may_be_translated_but_figures_may_not(monkeypatch, tmp_path):
    dist = build_dist(tmp_path, {
        "/i": "<html><body><p>Wait 6 months for R1,200.</p></body></html>",
        "/zu/i": "<html><body><p>Linda izinyanga ezingu-6 nge-R1,200.</p></body></html>",
    })
    assert run(monkeypatch, tmp_path, dist) == 0
