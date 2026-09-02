#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Guard: a province intro may not state a HAND-TYPED COUNT OF FACILITIES.

WHAT IT ASSERTS, AND WHY IT ASSERTS ABSENCE RATHER THAN AGREEMENT
----------------------------------------------------------------
`src/pages/clinics/[province].astro` (and its /xh and /zu twins) render, two lines
apart on the same page:

    <p>{provFacilities.length} government health facilities</p>     <- COMPUTED
    <p set:html={editorial.intro} />                                 <- HAND-TYPED

Until #1562 every one of the nine intros stated a total of its own, and all nine
disagreed with the computed one directly above them, in all three languages: Free
State prose 37 against a computed 52, KwaZulu-Natal 201 against 173, Mpumalanga 50
against 78, North West 106 against 73, Northern Cape 25 against 48, Western Cape 140
against 156, Gauteng 281 against 277, Limpopo 95 against 81, Eastern Cape 122 against
123. Each intro also stated a TYPE BREAKDOWN summing to its own wrong total and a
24-hour subcount (Eastern Cape claimed 82 of its facilities were open around the
clock; the corpus says 3), and the same wrong figure reached the HowToStep JSON-LD.

The repair is NOT to sync the integer. That is the blind-sync shape shipped and
reverted at `31821c5`, and here it is wrong twice over: the breakdown has to be
re-derived with it, and in isiXhosa and isiZulu the numeral carries a CONCORD PREFIX
that agrees with the numeral itself (`ali-140` but `angama-281`, `ezili-16` but
`ezingu-78`), so substituting a digit into a fixed prefix publishes broken grammar on
a humanitarian health directory. The durable repair is the `todo-header-scalar-check.py`
lesson: DELETE the hand copy. A hand-copied scalar sitting beside a machine-derived one
is stale the day after it is written, and the page already publishes the total, the full
type breakdown (the chips) and the 24-hour count (FAQ 1) computed from the corpus, in
every locale — so the prose figure was duplicating a derived surface, not adding to it.

So the rule is: NO COUNT AT ALL. This guard checks that there is no number, never that
a number is right — the same reason `todo-header-scalar-check.py` gives: a correct
frozen scalar today is what produces the wrong one tomorrow.

THE RULE, AND WHY IT NEEDS NO GRAMMAR
-------------------------------------
A number in an intro is a FINDING when its window carries a FACILITY NOUN and no UNIT.
Both halves are load-bearing:

  * facility noun, no unit   ->  "122 public health facilities", "amaziko angama-281",
                                 "izikhungo zomphakathi ezingu-140"   -> FINDING
  * a unit within reach      ->  "60 km", "24-hour casualty", "iiyure ezingama-24",
                                 "izigidi ezingu-6.7", "25% of adults"  -> accepted
  * no facility noun         ->  not about facilities at all           -> accepted

That is decidable on sight in three languages without knowing any of them, and it does
not depend on a phrase list of ways to word a count claim — which is the #1261 defect:
a novel wording of a count claim still has a facility noun and still has no unit, so it
still fires. Units are a closed vocabulary; ways of saying "there are N of them" are not.

SCOPE is the `intro` field only, deliberately. The intro is the paragraph that sits
directly beneath the computed subtitle, and that adjacency is what makes the pair a
self-contradiction a reader can see. The deepDive bodies are long-form prose full of
legitimate real-world integers (bed counts, distances, ratios, percentages), where the
same rule would ship a baseline of hundreds of entries nobody would read; the two
directory-derived deepDive claims that existed (the Free State facility density and the
Northern Cape "one facility per 52,000") were corrected by hand in #1562 and are named
in the item.

WHY NOT `tools/self-contradiction-check.py` (the pipeline's own answer to "does a page
contradict itself"): its rules are pairs of MUTUALLY EXCLUSIVE CLAIMS both present in
the scanned text. Here family B — the computed total — exists only in BUILT OUTPUT; it
is `provFacilities.length` in an Astro template, not a sentence anywhere. That tool also
has no corpus for CF, and CF's prose lives in TypeScript data modules rather than in the
JSON/astro corpora it reads. Adding it there would have meant teaching it to evaluate a
template. This is also not a contradicting-pair rule at all: it is a NO-SCALAR rule, the
`todo-header-scalar-check.py` shape. So it lives in the CF pre-push hook, beside the
other nine CF gates, where the corpus it guards is.

Accepted debt is IDENTITY-KEYED (`file|province|value|snippet`), never a count: a count
ratchet stays green when one hand-typed total is deleted and another is added the same
night, which is exactly the event this exists to catch. Editing the prose changes the
snippet and self-clears the key.

Exit 0 = clean, 1 = a hand-typed facility count (or an unreadable corpus), 2 = soft skip
(no editorial module found).
"""
import argparse
import json
import os
import re
import sys

DEFAULT_FILES = [
    'src/data/province-editorial.ts',
    'src/data/i18n/province-editorial.xh.ts',
    'src/data/i18n/province-editorial.zu.ts',
]

# A noun naming a health facility, in the three published languages. Substring match,
# case-insensitive — these are stems, so plural/locative forms are covered.
FACILITY_NOUNS = [
    # English
    'facilit', 'clinic', 'hospital', 'health centre',
    # isiXhosa
    'maziko', 'iziko', 'kliniki', 'sibhedlele', 'zibhedlele', 'bhedlele',
    # isiZulu
    'zikhungo', 'sikhungo', 'khungo', 'tholampilo', 'sibhedlela', 'zibhedlela', 'bhedlela',
]

# A unit or measure. If one of these sits close to the number, the number is measuring
# something rather than counting facilities. Closed vocabulary, on purpose.
UNITS = [
    'km', '%', 'percent',
    'million', 'billion', 'izigidi', 'zigidi',
    'hour', 'iyure', 'iiyure', 'yure', 'hora', 'amahora', 'usuku',
    'minute', 'imizuzu',
    'bed', 'mibhede', 'mbede',
    'patient', 'iziguli', 'izigulane', 'zigulane', 'ziguli',
    'resident', 'people', 'abantu', 'bemi', 'bahlali',
    'week', 'month', 'year', 'iveki', 'inyanga', 'unyaka',
    'ratio', 'isilinganiso', 'umgangatho',
    'khilomitha',                                    # isiZulu for km: 'amakhilomitha angu-40'
    'medical', 'doctor', 'nurse', 'ogqirha', 'dokotela', 'gosa',  # staff, not facilities
]

# Emergency numbers are dialled, not counted.
PHONE_LITERALS = {'10177', '112', '911', '107'}

PRE_WINDOW = 30    # a Nguni numeral follows its noun: "izigulane ezingaphezu kwe-300"
POST_WINDOW = 12   # an English numeral precedes its unit: "60 km", "24-hour"
NOUN_WINDOW = 40

NUM_RE = re.compile(r'\d[\d,.]*')
PROV_RE = re.compile(r"^\s{2,4}'([A-Za-z][A-Za-z \-']*)':\s*\{", re.M)
INTRO_RE = re.compile(r'intro:\s*`(.*?)`,\s*$', re.M | re.S)


class CorpusError(Exception):
    """The corpus exists but cannot be read as expected — a hard failure, never a skip."""


def strip_markup(s):
    """Drop HTML tags so an attribute is never mistaken for prose context.

    Tags are replaced by a single space rather than removed: every window below is
    measured in CHARACTERS, and ~40 characters of href soup turns adjacency into
    proximity (the lesson `prose_attribution.py` records).
    """
    return re.sub(r'<[^>]+>', ' ', s)


def intros(path):
    """[(province, intro_text)] in file order. Raises if the two lists disagree."""
    try:
        with open(path, encoding='utf-8') as fh:
            src = fh.read()
    except OSError as exc:
        raise CorpusError('%s: %s' % (path, exc))
    provinces = PROV_RE.findall(src)
    bodies = INTRO_RE.findall(src)
    if not bodies:
        raise CorpusError('%s: no `intro:` template literal found' % path)
    if len(provinces) != len(bodies):
        raise CorpusError(
            '%s: %d province keys but %d intros — cannot bind a finding to a province'
            % (path, len(provinces), len(bodies)))
    return list(zip(provinces, bodies))


def findings_in(text):
    """Numbers in `text` that count facilities. Returns [(value, snippet)]."""
    clean = strip_markup(text)
    low = clean.lower()
    out = []
    for m in NUM_RE.finditer(clean):
        raw = m.group(0).rstrip('.,')
        if raw in PHONE_LITERALS:
            continue
        pre = low[max(0, m.start() - PRE_WINDOW):m.start()]
        post = low[m.end():m.end() + POST_WINDOW]
        if any(u in pre or u in post for u in UNITS):
            continue
        noun = low[max(0, m.start() - NOUN_WINDOW):m.end() + NOUN_WINDOW]
        if not any(n in noun for n in FACILITY_NOUNS):
            continue
        snippet = ' '.join(clean[max(0, m.start() - 45):m.end() + 45].split())
        out.append((raw, snippet))
    return out


def key(path, province, value, snippet):
    return '%s|%s|%s|%s' % (os.path.basename(path), province, value, snippet)


def load_baseline(path):
    if path is None or not os.path.exists(path):
        return {}
    try:
        with open(path, encoding='utf-8') as fh:
            data = json.load(fh)
    except (OSError, ValueError) as exc:
        raise CorpusError('baseline %s is unreadable: %s' % (path, exc))
    accepted = data.get('accepted', {})
    if not isinstance(accepted, dict):
        raise CorpusError('baseline %s: "accepted" must be an object' % path)
    return accepted


def scan(repo, files, baseline_path):
    accepted = load_baseline(baseline_path)
    new, known, scanned = [], [], 0
    for rel in files:
        path = os.path.join(repo, rel)
        if not os.path.exists(path):
            continue
        for province, body in intros(path):
            scanned += 1
            for value, snippet in findings_in(body):
                k = key(path, province, value, snippet)
                (known if k in accepted else new).append((k, rel, province, value, snippet))
    return new, known, scanned


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[1])
    ap.add_argument('--repo', default=os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    ap.add_argument('--baseline', default=None)
    ap.add_argument('--file', action='append', dest='files')
    ap.add_argument('--list', action='store_true')
    ap.add_argument('--json', action='store_true')
    ap.add_argument('--write-baseline', action='store_true')
    args = ap.parse_args(argv)

    files = args.files or DEFAULT_FILES
    baseline = args.baseline
    if baseline is None:
        baseline = os.path.join(args.repo, 'tools', 'province-scalar-baseline.json')

    if not any(os.path.exists(os.path.join(args.repo, f)) for f in files):
        print('[SKIP] province-scalar: no province editorial module under %s' % args.repo)
        return 2

    try:
        new, known, scanned = scan(args.repo, files, baseline)
    except CorpusError as exc:
        print('[FAILED] province-scalar: %s' % exc)
        return 1

    if args.write_baseline:
        payload = {
            '_comment': ('Accepted hand-typed facility counts in province intros. '
                         'Written by tools/province-scalar-check.py --write-baseline. '
                         'Identity-keyed (file|province|value|snippet), never a count: '
                         'editing the prose self-clears the key.'),
            'accepted': {k: 'ACCEPTED WITHOUT A REASON — replace this string'
                         for k, _, _, _, _ in new + known},
        }
        with open(baseline, 'w', encoding='utf-8') as fh:
            json.dump(payload, fh, indent=2, ensure_ascii=False)
            fh.write('\n')
        print('[WROTE] %s (%d entries)' % (baseline, len(new) + len(known)))
        return 0

    if args.json:
        print(json.dumps({
            'intros_scanned': scanned,
            'new': [{'key': k, 'file': f, 'province': p, 'value': v, 'snippet': s}
                    for k, f, p, v, s in new],
            'accepted': len(known),
        }, indent=2, ensure_ascii=False))
    elif args.list or new:
        for k, f, p, v, s in new:
            print('[FAIL] %s / %s states %s: %s' % (f, p, v, s))
        if args.list:
            for k, f, p, v, s in known:
                print('[accepted] %s / %s states %s: %s' % (f, p, v, s))

    if new:
        print('[FAILED] province-scalar: %d hand-typed facility count(s) in province '
              'intros across %d intros. The page computes the total, the type breakdown '
              'and the 24-hour count already — delete the prose figure, do not update it.'
              % (len(new), scanned))
        return 1
    print('[PASS] province-scalar: %d intros, 0 hand-typed facility counts (%d accepted)'
          % (scanned, len(known)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
