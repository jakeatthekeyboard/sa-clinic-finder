import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { PRIVATE_SUBJECT_SLUGS, isPrivateSubject } from '../src/data/private-subject.mjs';
import { withheldKeys } from '../src/data/facility-quality.mjs';
import { NOT_WALK_IN_CARE } from '../src/data/care-role';

const facilities = JSON.parse(readFileSync(new URL('../src/data/facilities.json', import.meta.url), 'utf-8'));

/**
 * #1482 — the gate on the decision recorded in src/data/private-subject.mjs.
 *
 * The decision is SPLIT and both halves need holding, because each is undone by a
 * different plausible mistake: the default is undone by somebody deciding that "not a
 * clinic" ought to mean "not in the sitemap", and the exception is undone by somebody
 * generalising it to low-traffic pages. Every assertion below pins one of those.
 */
describe('#1482 — private-subject withholding', () => {
  it('withholds the one adjudicated private residence, with its own reason', () => {
    const w = withheldKeys(facilities);
    for (const slug of PRIVATE_SUBJECT_SLUGS) {
      const f = facilities.find((x: any) => x.slug === slug);
      expect(f, `${slug} must still be a published record`).toBeTruthy();
      expect(w.get(`${f.province}|${f.slug}`)).toBe('private-subject');
    }
  });

  it('does NOT withhold the other adjudicated non-facilities — that is the default half', () => {
    const w = withheldKeys(facilities);
    // Every care-role record that is not a private subject must stay in the sitemap and
    // stay indexable, UNLESS an unrelated #929/#1228 rule already withholds it (the
    // covid-testing record is a name-cluster duplicate and was already withheld before
    // #1482 existed — that is not this policy acting).
    const otherReasons = new Set(['all-lowercase', 'generic-noun', 'empty', 'duplicate', 'duplicate-osm-object']);
    for (const slug of Object.keys(NOT_WALK_IN_CARE)) {
      if (isPrivateSubject(slug)) continue;
      const f = facilities.find((x: any) => x.slug === slug);
      if (!f) continue;
      const reason = w.get(`${f.province}|${f.slug}`);
      expect(
        reason === undefined || otherReasons.has(reason),
        `${slug} is withheld as "${reason}" — being adjudicated a non-facility is NOT a reason to withhold (#1482)`
      ).toBe(true);
    }
  });

  it('withholds nothing merely for being adjudicated a non-facility', () => {
    const w = withheldKeys(facilities);
    expect([...w.values()].filter((r) => r === 'care-role')).toHaveLength(0);
  });

  it('every private-subject slug is also adjudicated in care-role.ts, with a source', () => {
    // The claim "this is a private person's property" needs the same evidence a
    // care-role entry needs. Without this, a slug could be added here to bury a page.
    for (const slug of PRIVATE_SUBJECT_SLUGS) {
      const entry = NOT_WALK_IN_CARE[slug];
      expect(entry, `${slug} must be adjudicated in NOT_WALK_IN_CARE`).toBeTruthy();
      expect(entry.source.length).toBeGreaterThan(40);
    }
  });

  it('every private-subject slug is a real published record — the page stays LIVE', () => {
    // Withholding is "stop advertising", never "unpublish". If the record vanished from
    // facilities.json the page would 404 and the correction would go with it.
    for (const slug of PRIVATE_SUBJECT_SLUGS) {
      expect(facilities.some((x: any) => x.slug === slug), `${slug} must still be published`).toBe(true);
    }
  });
});
