# -*- coding: utf-8 -*-
"""Unit tests for tools/province-scalar-check.py (#1562).

Every fixture is synthesised in tmp_path. The live editorial modules are never
read, never written, and never asserted against: ten writers touch this repo and
a suite that fails when real data legitimately changes is a suite people learn to
ignore (#883).

The RED cases are reconstructions of the live pre-fix prose in all three
languages, because a guard that cannot be shown to go red is decoration (#1140).
"""
import importlib.util
import json
import os
import sys

import pytest

_HERE = os.path.dirname(os.path.abspath(__file__))
_SPEC = importlib.util.spec_from_file_location(
    'province_scalar_check', os.path.join(_HERE, '..', 'province-scalar-check.py'))
psc = importlib.util.module_from_spec(_SPEC)
_SPEC.loader.exec_module(psc)


EN_REL = 'src/data/province-editorial.ts'
XH_REL = 'src/data/i18n/province-editorial.xh.ts'
ZU_REL = 'src/data/i18n/province-editorial.zu.ts'


def write_module(tmp_path, rel, entries):
    """entries: [(province, intro)] -> a file shaped like the real TS module."""
    path = tmp_path / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    body = ['export const PROVINCE_EDITORIAL = {']
    for province, intro in entries:
        body.append("  '%s': {" % province)
        body.append('    intro: `%s`,' % intro)
        body.append('    healthTips: [],')
        body.append('  },')
    body.append('};')
    path.write_text('\n'.join(body) + '\n', encoding='utf-8')
    return path


def run(tmp_path, argv_extra=()):
    argv = ['--repo', str(tmp_path),
            '--baseline', str(tmp_path / 'baseline.json')] + list(argv_extra)
    return psc.main(argv)


# ---------------------------------------------------------------- RED cases

def test_english_prefix_prose_is_red(tmp_path, capsys):
    """The verbatim Eastern Cape sentence that shipped until #1562."""
    write_module(tmp_path, EN_REL, [(
        'Eastern Cape',
        'The province has 122 public health facilities listed here, including 78 '
        'district hospitals and 1 tertiary hospital (Nelson Mandela Academic '
        'Hospital in Mthatha).')])
    assert run(tmp_path) == 1
    out = capsys.readouterr().out
    assert '122' in out and '78' in out


def test_isixhosa_prefix_prose_is_red(tmp_path, capsys):
    """The same claim in isiXhosa, where the numeral carries a concord prefix.

    A rule keyed on English wording is blind here; a facility noun with no unit
    is not.
    """
    write_module(tmp_path, XH_REL, [(
        'Western Cape',
        'Amaziko kawonke-wonke ali-140 adweliswe apha aquka iikliniki ezingama-73, '
        'izibhedlele zesithili ezingama-54.')])
    assert run(tmp_path) == 1
    out = capsys.readouterr().out
    assert '140' in out and '73' in out and '54' in out


def test_isizulu_prefix_prose_is_red(tmp_path, capsys):
    write_module(tmp_path, ZU_REL, [(
        'Free State',
        'Ngezikhungo zomphakathi ezingu-37 — imitholampilo engu-20, izibhedlela '
        'zesifunda ezingu-16 — ukumboza kuncane.')])
    assert run(tmp_path) == 1
    assert '37' in capsys.readouterr().out


def test_twenty_four_hour_subcount_is_red(tmp_path):
    """Eastern Cape claimed 82 of its facilities were open around the clock; 3 are."""
    write_module(tmp_path, EN_REL, [(
        'Eastern Cape',
        'The closest 24-hour casualty is usually a district hospital; 82 of the 122 '
        'facilities here operate around the clock.')])
    assert run(tmp_path) == 1


def test_a_novel_wording_still_fires(tmp_path):
    """The rule is a noun/unit structure, not a phrase list (the #1261 defect)."""
    write_module(tmp_path, EN_REL, [(
        'Limpopo',
        'Our directory currently carries a shade over 81 clinics and hospitals.')])
    assert run(tmp_path) == 1


# --------------------------------------------------------------- GREEN cases

def test_corrected_prose_is_green(tmp_path):
    """The post-#1562 wording: substance kept, every count deleted."""
    write_module(tmp_path, EN_REL, [(
        'Eastern Cape',
        'The Eastern Cape is home to roughly 6.7 million people, many in deep rural '
        'areas where the nearest district hospital can be over 60 km away. The '
        'provincial listing is dominated by district hospitals, and the only tertiary '
        'hospital is Nelson Mandela Academic Hospital in Mthatha. For life-threatening '
        'emergencies, the closest <a href="/services/emergency">24-hour casualty</a> '
        'is usually a district hospital. Call the ambulance service at 10177.')])
    assert run(tmp_path) == 0


def test_units_are_not_counts(tmp_path):
    """km, %, million, hours, beds and staff are measurements, not facility counts."""
    write_module(tmp_path, EN_REL, [(
        'Free State',
        'A 900-bed hospital 220 km away serves 2.9 million people; roughly 25% of '
        'adults are affected, and some district hospitals run with fewer than 5 '
        'medical officers.')])
    assert run(tmp_path) == 0


def test_nguni_units_are_not_counts(tmp_path):
    """The unit may PRECEDE the numeral in isiXhosa and isiZulu."""
    write_module(tmp_path, XH_REL, [(
        'Limpopo',
        'iilali zinokuba ngaphezu kwe-40 km ukusuka kwiziko lempilo elikufuphi, '
        'kwaye amaziko avulekile iiyure ezingama-24.')])
    write_module(tmp_path, ZU_REL, [(
        'Northern Cape',
        'endaweni eyomile engamakhilomitha angu-373,000, iziguli zingahamba '
        'amakhilomitha angu-200 ukufinyelela isibhedlela.')])
    assert run(tmp_path) == 0


def test_emergency_numbers_are_dialled_not_counted(tmp_path):
    write_module(tmp_path, EN_REL, [(
        'Gauteng',
        'For emergencies at any facility, dial 10177, or 112 from a mobile.')])
    assert run(tmp_path) == 0


def test_number_with_no_facility_noun_is_ignored(tmp_path):
    write_module(tmp_path, EN_REL, [(
        'Gauteng',
        'Gang violence and road trauma peak between 18 and 24 on a Friday night in '
        'the metro, according to a 2023 provincial audit of trauma admissions.')])
    assert run(tmp_path) == 0


# ------------------------------------------------------------- baseline shape

def test_accepted_key_suppresses_and_prose_edit_self_clears(tmp_path):
    write_module(tmp_path, EN_REL, [('Limpopo', 'The 81 facilities listed here.')])
    assert run(tmp_path) == 1
    assert run(tmp_path, ['--write-baseline']) == 0
    accepted = json.loads((tmp_path / 'baseline.json').read_text(encoding='utf-8'))['accepted']
    assert len(accepted) == 1
    key = list(accepted)[0]
    assert 'Limpopo' in key and '81' in key
    assert run(tmp_path) == 0

    # Editing the prose mints a different key, so the acceptance does not carry over.
    write_module(tmp_path, EN_REL, [('Limpopo', 'The 82 facilities listed here.')])
    assert run(tmp_path) == 1


def test_a_new_count_under_an_accepted_province_still_fires(tmp_path):
    """Identity-keyed, never a count: fixing one and adding another is not green."""
    write_module(tmp_path, EN_REL, [('Limpopo', 'The 81 facilities listed here.')])
    run(tmp_path, ['--write-baseline'])
    write_module(tmp_path, EN_REL, [(
        'Limpopo', 'The 81 facilities listed here. Of those, 4 clinics open at night.')])
    assert run(tmp_path) == 1


# ------------------------------------------------------------------ failures

def test_unreadable_baseline_is_a_hard_failure(tmp_path):
    write_module(tmp_path, EN_REL, [('Limpopo', 'A quiet province.')])
    (tmp_path / 'baseline.json').write_text('{ not json', encoding='utf-8')
    assert run(tmp_path) == 1


def test_module_without_an_intro_is_a_hard_failure(tmp_path, capsys):
    """A corpus that exists but does not parse is never a pass ([[feedback_unreadable_is_not_absent]])."""
    path = tmp_path / EN_REL
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("export const PROVINCE_EDITORIAL = {\n  'Limpopo': {\n  },\n};\n",
                    encoding='utf-8')
    assert run(tmp_path) == 1
    assert 'no `intro:`' in capsys.readouterr().out


def test_province_and_intro_counts_must_agree(tmp_path, capsys):
    path = tmp_path / EN_REL
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        "export const PROVINCE_EDITORIAL = {\n"
        "  'Limpopo': {\n    intro: `Quiet.`,\n  },\n"
        "  'Gauteng': {\n  },\n"
        "  'Free State': {\n    intro: `Quiet.`,\n  },\n};\n", encoding='utf-8')
    assert run(tmp_path) == 1
    assert 'cannot bind a finding to a province' in capsys.readouterr().out


def test_absent_corpus_is_a_soft_skip(tmp_path):
    assert run(tmp_path) == 2


# ------------------------------------------------------------------ mechanics

def test_markup_is_stripped_before_windows_are_measured(tmp_path):
    """~40 characters of href soup would turn adjacency into proximity."""
    write_module(tmp_path, EN_REL, [(
        'Gauteng',
        'Not every facility is open <a href="/services/emergency" class="x">24 hours'
        '</a> — check the listing.')])
    assert run(tmp_path) == 0


def test_all_three_locale_modules_are_in_the_default_scope(tmp_path):
    assert psc.DEFAULT_FILES == [EN_REL, XH_REL, ZU_REL]


def test_json_output_reports_the_denominator(tmp_path, capsys):
    write_module(tmp_path, EN_REL, [('Limpopo', 'Quiet.'), ('Gauteng', 'Quiet.')])
    assert run(tmp_path, ['--json']) == 0
    payload = capsys.readouterr().out.split('\n[PASS]')[0]
    assert json.loads(payload)['intros_scanned'] == 2
