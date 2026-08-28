import { describe, it, expect } from 'vitest';
import { ADMINISTRATIVE_NAMES, administrativeName } from '../src/data/administrative-name';
import {
  ADMIN_NAME_WHAT_XH, ADMIN_NAME_WHAT_ZU,
  ADMIN_NAME_CHROME_EN, ADMIN_NAME_CHROME_XH, ADMIN_NAME_CHROME_ZU,
} from '../src/data/i18n/administrative-name.xh-zu';

/**
 * #1481 — the three locales ship together or not at all.
 *
 * Modelled on tests/care-role-i18n.test.ts, and for the reason #1367 records: the
 * English page carried the correction and /xh and /zu carried none, on 6 of 6 records,
 * with no English fallback. Coverage is DERIVED from ADMINISTRATIVE_NAMES at run time —
 * no count is written down here, because the set grows.
 */
describe('#1481 — administrative-name notice', () => {
  it('every adjudicated record has an isiXhosa and an isiZulu rendering', () => {
    for (const slug of Object.keys(ADMINISTRATIVE_NAMES)) {
      expect(ADMIN_NAME_WHAT_XH[slug], `${slug} has no isiXhosa rendering`).toBeTruthy();
      expect(ADMIN_NAME_WHAT_ZU[slug], `${slug} has no isiZulu rendering`).toBeTruthy();
    }
  });

  it('no rendered string carries a numeral, in any of the three languages', () => {
    // tools/numeric-parity-check.py compares the numeral multiset of a translated page
    // against its English source. A digit here that is not in all three renderings is a
    // parity failure spent on a ward number rather than on a clinical figure.
    const rendered: [string, string][] = [
      ...Object.entries(ADMINISTRATIVE_NAMES).map(([k, v]) => [`${k}.what.en`, v.what] as [string, string]),
      ...Object.entries(ADMIN_NAME_WHAT_XH),
      ...Object.entries(ADMIN_NAME_WHAT_ZU),
      ['chrome.en.heading', ADMIN_NAME_CHROME_EN.heading],
      ['chrome.en.chip', ADMIN_NAME_CHROME_EN.chip],
      ['chrome.en.seeBefore', ADMIN_NAME_CHROME_EN.seeBefore],
      ['chrome.xh.heading', ADMIN_NAME_CHROME_XH.heading],
      ['chrome.xh.chip', ADMIN_NAME_CHROME_XH.chip],
      ['chrome.xh.seeBefore', ADMIN_NAME_CHROME_XH.seeBefore],
      ['chrome.zu.heading', ADMIN_NAME_CHROME_ZU.heading],
      ['chrome.zu.chip', ADMIN_NAME_CHROME_ZU.chip],
      ['chrome.zu.seeBefore', ADMIN_NAME_CHROME_ZU.seeBefore],
    ];
    for (const [label, text] of rendered) {
      expect(text.match(/\d/), `${label} contains a numeral: ${text}`).toBeNull();
    }
  });

  it('every entry carries the evidence that the string is a reference, not a name', () => {
    for (const [slug, entry] of Object.entries(ADMINISTRATIVE_NAMES)) {
      expect(entry.source.length, `${slug} needs a source`).toBeGreaterThan(40);
    }
  });

  it('is a slug lookup and never a predicate over the name field', () => {
    // #1481 forbids widening unnamed.ts, and forbids any prefix/substring rule: "ward"
    // is a legitimate part of a real facility name. An unlisted slug matches nothing.
    expect(administrativeName('tswane-ward-40-tswane')).toBeTruthy();
    expect(administrativeName('berario-clinic-randburg-johannesburg')).toBeNull();
    expect(administrativeName('ward-21-clinic')).toBeNull();
  });
});
