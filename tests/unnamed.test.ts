/**
 * unnamed.test.ts — the "we do not know this facility's name" predicate must catch the
 * generic words and must NOT catch a name that merely contains one.
 *
 * WHY THIS SUITE EXISTS
 * ---------------------
 * `nameIsPlaceholder` decides whether a facility page tells its reader that the string
 * at the top of it is not a name. It gets that wrong in two directions, and the two are
 * not equally bad.
 *
 * A MISS leaves a page as it was: confident prose about a facility called "health
 * care". That is the bug being fixed and one more instance of it costs a reader the
 * same as it did yesterday.
 *
 * A FALSE POSITIVE is worse and is why this file exists. The corpus is full of real
 * names that CONTAIN a generic word — "Bophelong Clinic", "Melvile Clinic", "Mseleni
 * Hospital", "Strydom Medi-Centre" — and a predicate that widened to substring
 * matching would put "we do not know this facility's name" on top of hundreds of
 * correctly named public clinics, telling a reader their own local clinic is
 * unidentifiable. So the substring cases below are the point of the suite, not padding.
 *
 * COVERAGE IS DERIVED, NEVER COUNTED. Nothing here asserts a total. The corpus-wide
 * check reads facilities.json at run time and asserts a PROPERTY — that every record
 * the predicate flags has a one-word-ish generic name — rather than a number that goes
 * stale on the next import.
 */
import { describe, it, expect } from 'vitest';
import { nameIsPlaceholder } from '../src/data/unnamed';
import facilities from '../src/data/facilities.json';

describe('nameIsPlaceholder', () => {
  it('catches the generic words actually present in the corpus, in any casing', () => {
    for (const n of ['health care', 'healthcare', 'Clinic', 'clinic', 'CLINIC', 'Surgery', 'Medical Centre', 'sick bay']) {
      expect(nameIsPlaceholder(n), n).toBe(true);
    }
  });

  it('normalises surrounding whitespace and punctuation', () => {
    for (const n of ['  Clinic  ', 'health  care', '"Clinic"', 'Clinic.', ' HEALTH CARE ']) {
      expect(nameIsPlaceholder(n), n).toBe(true);
    }
  });

  it('does NOT catch a real name that contains a generic word', () => {
    for (const n of [
      'Bophelong Clinic',
      'Melvile Clinic',
      'Mseleni Hospital',
      'Strydom Medi-Centre',
      'Think Site Clinic- Adherence Module',
      'Rethabile Community Health Centre',
      'Clicks',
      'Salt River Mortuary',
      'Tower Psychiatric Hospital',
      'Western Cape Blood Service',
    ]) {
      expect(nameIsPlaceholder(n), n).toBe(false);
    }
  });

  it('flags only short generic names across the whole corpus', () => {
    const flagged = (facilities as Array<{ name: string; slug: string }>).filter(f => nameIsPlaceholder(f.name));
    expect(flagged.length).toBeGreaterThan(0);
    for (const f of flagged) {
      // A placeholder is a common noun, never a multi-part proper name. Three words is
      // already generous ("consulting rooms" is two); anything longer is a name and the
      // predicate has drifted.
      expect(f.name.trim().split(/\s+/).length, f.slug).toBeLessThanOrEqual(3);
    }
  });
});
