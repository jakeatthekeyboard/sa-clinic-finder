/**
 * care-role-i18n.test.ts — the #1002 "this is not a care facility" notice must reach
 * an isiXhosa and an isiZulu reader, not only an English one (#1367).
 *
 * WHY THIS SUITE EXISTS
 * ---------------------
 * `src/data/care-role.ts` is the set of published records that are NOT places anyone
 * can be treated — a state forensic mortuary, an office block, a bedding retailer, a
 * shopping centre, a veterinary practice, a decommissioned hospital. It is a GROWING
 * set, hand-adjudicated one record at a time by whichever lane happens to settle a
 * candidate. Its translations live in a DIFFERENT file, `care-role.xh-zu.ts`, and
 * adding an entry to the first without the second is a single-line edit that no
 * other gate can see: the build passes, every link resolves, numeric parity holds
 * (there are no digits), and the only symptom is an isiXhosa page that presents a
 * mortuary as a facility. That is exactly the state this item was filed to end, so
 * it must not be reachable again by omission.
 *
 * COVERAGE IS DERIVED, NEVER COUNTED. Nothing here asserts "six" or "eight". The
 * expected set IS `NOT_WALK_IN_CARE`'s key set at run time, so a record added by
 * another lane is in scope the moment it is added.
 *
 * The reverse direction is deliberately NOT an error: `care-role.xh-zu.ts` may hold
 * a translation for a slug not yet adjudicated, which is how a translation lands
 * BEFORE the record does and the merge cannot open a gap.
 */
import { describe, it, expect } from 'vitest';
import { NOT_WALK_IN_CARE } from '../src/data/care-role';
import {
  CARE_ROLE_WHAT_XH,
  CARE_ROLE_WHAT_ZU,
  CARE_ROLE_CHROME_XH,
  CARE_ROLE_CHROME_ZU,
  careRoleWhatXh,
  careRoleWhatZu,
  firstSentence,
} from '../src/data/i18n/care-role.xh-zu';

const slugs = Object.keys(NOT_WALK_IN_CARE);

describe('care-role notice: isiXhosa and isiZulu coverage', () => {
  it('has at least one adjudicated record to check', () => {
    expect(slugs.length).toBeGreaterThan(0);
  });

  it.each(slugs)('%s has an isiXhosa rendering', (slug) => {
    const what = careRoleWhatXh(slug);
    expect(what, `no isiXhosa \`what\` for ${slug} — add it to src/data/i18n/care-role.xh-zu.ts`).toBeTruthy();
    expect(what!.length).toBeGreaterThan(40);
  });

  it.each(slugs)('%s has an isiZulu rendering', (slug) => {
    const what = careRoleWhatZu(slug);
    expect(what, `no isiZulu \`what\` for ${slug} — add it to src/data/i18n/care-role.xh-zu.ts`).toBeTruthy();
    expect(what!.length).toBeGreaterThan(40);
  });
});

describe('care-role notice: mechanical constraints', () => {
  /**
   * A digit on one route and not another is a numeric difference between the three
   * pages and fails tools/numeric-parity-check.py — a guard that exists to catch a
   * dropped clinical figure and must not be spent on a house number. This is the
   * same rule care-role.ts states for the English prose; it binds the translations
   * for the same reason, and it is asserted here so it fails at test time rather
   * than at the end of a full build.
   */
  const all = [
    ...Object.entries(CARE_ROLE_WHAT_XH).map(([k, v]) => [`xh:${k}`, v] as const),
    ...Object.entries(CARE_ROLE_WHAT_ZU).map(([k, v]) => [`zu:${k}`, v] as const),
    ['xh:heading', CARE_ROLE_CHROME_XH.heading] as const,
    ['zu:heading', CARE_ROLE_CHROME_ZU.heading] as const,
    ['xh:seeBefore', CARE_ROLE_CHROME_XH.seeBefore] as const,
    ['zu:seeBefore', CARE_ROLE_CHROME_ZU.seeBefore] as const,
    ['xh:linkText', CARE_ROLE_CHROME_XH.linkText('Western Cape')] as const,
    ['zu:linkText', CARE_ROLE_CHROME_ZU.linkText('Western Cape')] as const,
  ];

  it.each(all)('%s contains no numeral', (_key, text) => {
    expect(text).not.toMatch(/\d/);
  });

  /**
   * The meta description and JSON-LD on both locale routes publish the first
   * sentence, mirroring the English route. A `what` whose first sentence cannot be
   * cut leaves those fields describing a mortuary as nothing in particular.
   */
  it.each(all.filter(([k]) => k.includes('-')))('%s yields a first sentence', (_key, text) => {
    expect(firstSentence(text).length).toBeGreaterThan(10);
  });

  it('an unmatched slug renders nothing rather than English', () => {
    expect(careRoleWhatXh('no-such-facility')).toBeNull();
    expect(careRoleWhatZu('no-such-facility')).toBeNull();
    expect(firstSentence(null)).toBe('');
  });
});
