/**
 * outside-sa-i18n.test.ts — the #1381 "this facility is not in South Africa" notice
 * must reach an isiXhosa and an isiZulu reader, not only an English one.
 *
 * WHY THIS SUITE EXISTS
 * ---------------------
 * The same failure mode `care-role-i18n.test.ts` was written for, one lane over.
 * `src/data/outside-sa.ts` is the set of published records that are health facilities
 * in another country — today three clinics in Maseru that a bounding-box map extract
 * delivered labelled "Free State". It is a set that can GROW: any future import from
 * the same extract lands in it. Its translations live in a DIFFERENT file, and adding
 * an entry to the first without the second is a single-line edit no other gate can
 * see. The build passes, links resolve, numeric parity holds (there are no digits),
 * and the only symptom is an isiXhosa page presenting a Lesotho hospital under a Free
 * State breadcrumb with nothing saying it is in another country.
 *
 * COVERAGE IS DERIVED, NEVER COUNTED. Nothing here asserts "three". The expected set
 * IS `OUTSIDE_SOUTH_AFRICA`'s key set at run time.
 *
 * The reverse direction is deliberately NOT an error: a translation may exist for a
 * slug not yet adjudicated, so a translation can land before the record does.
 */
import { describe, it, expect } from 'vitest';
import { OUTSIDE_SOUTH_AFRICA } from '../src/data/outside-sa';
import {
  OUTSIDE_SA_WHAT_XH,
  OUTSIDE_SA_WHAT_ZU,
  OUTSIDE_SA_CHROME_EN,
  OUTSIDE_SA_CHROME_XH,
  OUTSIDE_SA_CHROME_ZU,
  outsideSaWhatXh,
  outsideSaWhatZu,
} from '../src/data/i18n/outside-sa.xh-zu';
import { firstSentence } from '../src/data/i18n/care-role.xh-zu';

const slugs = Object.keys(OUTSIDE_SOUTH_AFRICA);

describe('outside-SA notice: isiXhosa and isiZulu coverage', () => {
  it('has at least one adjudicated record to check', () => {
    expect(slugs.length).toBeGreaterThan(0);
  });

  it.each(slugs)('%s has an isiXhosa rendering', (slug) => {
    const what = outsideSaWhatXh(slug);
    expect(what, `no isiXhosa \`what\` for ${slug} — add it to src/data/i18n/outside-sa.xh-zu.ts`).toBeTruthy();
    expect(what!.length).toBeGreaterThan(40);
  });

  it.each(slugs)('%s has an isiZulu rendering', (slug) => {
    const what = outsideSaWhatZu(slug);
    expect(what, `no isiZulu \`what\` for ${slug} — add it to src/data/i18n/outside-sa.xh-zu.ts`).toBeTruthy();
    expect(what!.length).toBeGreaterThan(40);
  });

  it('an unmatched slug renders nothing rather than English', () => {
    expect(outsideSaWhatXh('no-such-facility')).toBeNull();
    expect(outsideSaWhatZu('no-such-facility')).toBeNull();
  });
});

describe('outside-SA notice: mechanical constraints', () => {
  /**
   * A digit on one route and not another is a numeric difference between the three
   * pages and fails tools/numeric-parity-check.py. `outside-sa.ts` states the rule for
   * the English prose; it binds every locale, and is asserted here so it fails at test
   * time rather than at the end of a full build. The `+266` dialling code and the node
   * ids that settled these records live in `source` and in comments, which render
   * nowhere, precisely so this stays true.
   */
  const all = [
    ...slugs.map((k) => [`en:${k}`, OUTSIDE_SOUTH_AFRICA[k].what] as const),
    ...Object.entries(OUTSIDE_SA_WHAT_XH).map(([k, v]) => [`xh:${k}`, v] as const),
    ...Object.entries(OUTSIDE_SA_WHAT_ZU).map(([k, v]) => [`zu:${k}`, v] as const),
    ['en:heading', OUTSIDE_SA_CHROME_EN.heading('Lesotho')] as const,
    ['xh:heading', OUTSIDE_SA_CHROME_XH.heading('Lesotho')] as const,
    ['zu:heading', OUTSIDE_SA_CHROME_ZU.heading('Lesotho')] as const,
    ['en:chip', OUTSIDE_SA_CHROME_EN.chip] as const,
    ['xh:chip', OUTSIDE_SA_CHROME_XH.chip] as const,
    ['zu:chip', OUTSIDE_SA_CHROME_ZU.chip] as const,
    ['en:seeBefore', OUTSIDE_SA_CHROME_EN.seeBefore] as const,
    ['xh:seeBefore', OUTSIDE_SA_CHROME_XH.seeBefore] as const,
    ['zu:seeBefore', OUTSIDE_SA_CHROME_ZU.seeBefore] as const,
    ['en:linkText', OUTSIDE_SA_CHROME_EN.linkText('Free State')] as const,
    ['xh:linkText', OUTSIDE_SA_CHROME_XH.linkText('Free State')] as const,
    ['zu:linkText', OUTSIDE_SA_CHROME_ZU.linkText('Free State')] as const,
  ];

  it.each(all)('%s contains no numeral', (_key, text) => {
    expect(text).not.toMatch(/\d/);
  });

  /**
   * The meta description and JSON-LD on all three routes publish the first sentence.
   * A `what` whose first sentence cannot be cut leaves those fields describing the
   * place as nothing in particular.
   */
  it.each(all.filter(([k]) => k.includes('-')))('%s yields a first sentence', (_key, text) => {
    expect(firstSentence(text).length).toBeGreaterThan(10);
  });

  it.each(slugs)('%s names the country it is in, and an ISO code for it', (slug) => {
    const e = OUTSIDE_SOUTH_AFRICA[slug];
    expect(e.country.length).toBeGreaterThan(2);
    expect(e.countryCode).toMatch(/^[A-Z]{2}$/);
    expect(e.countryCode).not.toBe('ZA');
    // The audit trail is the point of the lane; an entry without a source is a guess.
    expect(e.source.length).toBeGreaterThan(40);
  });
});

describe('outside-SA records leave the South African directory but keep their pages', () => {
  it('none of them appear in the directory corpus', async () => {
    const { facilities, allFacilityRecords, serviceCorpus } = await import('../src/data/helpers');
    for (const slug of slugs) {
      expect(facilities.find((f) => f.slug === slug), `${slug} still in \`facilities\``).toBeUndefined();
      expect(serviceCorpus.find((f) => f.slug === slug), `${slug} still in \`serviceCorpus\``).toBeUndefined();
      // …and is still a record, so `facilityPaths()` still builds its page. A 404
      // would delete the correction along with the false listing.
      expect(allFacilityRecords.find((f) => f.slug === slug), `${slug} lost from the corpus`).toBeDefined();
    }
  });

  it('provides no service to a reader of a South African directory', async () => {
    const { allFacilityRecords, providesService } = await import('../src/data/helpers');
    for (const slug of slugs) {
      const f = allFacilityRecords.find((r) => r.slug === slug)!;
      for (const key of Object.keys(f.services)) {
        expect(providesService(f, key), `${slug} still listed as providing ${key}`).toBe(false);
      }
    }
  });
});
