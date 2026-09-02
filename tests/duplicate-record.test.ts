/**
 * #1509 — one facility is published once.
 *
 * These assert the INVARIANTS, not the current numbers: a count assertion goes stale the
 * next time OpenStreetMap gains a clinic, and a gate that has to be re-tuned to stay
 * green gets disabled.
 */
import { describe, it, expect } from 'vitest';
import {
  facilities,
  allFacilityRecords,
  isDuplicateOfAnotherRecord,
  nearbyFacilities,
} from '../src/data/helpers';
import { DUPLICATE_OF, duplicateOf } from '../src/data/duplicate-record';
import { PROVINCES } from '../src/data/helpers';

describe('#1509 — the directory publishes each facility once', () => {
  it('no two directory records resolve to the same OpenStreetMap object', () => {
    const seen = new Map<string, string>();
    for (const f of facilities) {
      const id = (f.facility_id || '').trim();
      if (!id) continue;
      expect(seen.has(id), `${f.slug} and ${seen.get(id)} are both ${id}`).toBe(false);
      seen.set(id, f.slug);
    }
  });

  it('no adjudicated duplicate is still in the directory', () => {
    for (const slug of Object.keys(DUPLICATE_OF)) {
      expect(facilities.some(f => f.slug === slug), `${slug} is retired but still listed`).toBe(false);
    }
  });

  it('every survivor named in an adjudication exists AND is itself in the directory', () => {
    // A survivor that was itself retired would delete the facility from the site
    // altogether — the #226/#1228 harm arriving by transitivity.
    for (const [retired, adj] of Object.entries(DUPLICATE_OF)) {
      const survivor = facilities.find(f => f.slug === adj.survivor);
      expect(survivor, `${retired} names survivor ${adj.survivor}, which is not in the directory`).toBeDefined();
      expect(duplicateOf(adj.survivor), `${adj.survivor} is a survivor AND retired`).toBeNull();
    }
  });

  it('a retired record and its survivor are the same facility — under 2 km apart', () => {
    // The distance gate #1509 requires. A "duplicate" 40 km away is two clinics.
    for (const [retired, adj] of Object.entries(DUPLICATE_OF)) {
      const a = allFacilityRecords.find(f => f.slug === retired)!;
      const b = allFacilityRecords.find(f => f.slug === adj.survivor)!;
      const R = 6371;
      const dLat = (b.coordinates.lat - a.coordinates.lat) * Math.PI / 180;
      const dLon = (b.coordinates.lng - a.coordinates.lng) * Math.PI / 180;
      const h = Math.sin(dLat / 2) ** 2 +
        Math.cos(a.coordinates.lat * Math.PI / 180) * Math.cos(b.coordinates.lat * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
      const km = R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
      expect(km, `${retired} is ${km.toFixed(2)} km from ${adj.survivor}`).toBeLessThan(2);
    }
  });

  it('every adjudication carries its OSM evidence', () => {
    for (const [retired, adj] of Object.entries(DUPLICATE_OF)) {
      expect(adj.retiredObject, retired).toMatch(/^(node|way|relation) \d+$/);
      expect(adj.survivorObject, retired).toMatch(/^(node|way|relation) \d+$/);
      expect(adj.evidence.length, `${retired} has no evidence`).toBeGreaterThan(120);
    }
  });

  it('NAME EQUALITY IS NOT A REASON — same-name records far apart stay published', () => {
    // #1509: "The eleven other same-name groups ARE separate facilities and must be left
    // alone ... any deduplication written for this must be distance-gated, never
    // name-gated." facility-quality.mjs withholds these from the SITEMAP by name; the
    // DIRECTORY must still carry them, or eleven real clinics vanish from the site.
    const mustStay = [
      'kwamsane-clinic-kwazulu-natal',
      'phomolong-clinic-tshwane',
      'tayler-bequest-hospital-tlokoeng',
      'bophelong-clinic-ivory-park',
      'mseleni-hospital-kwazulu-natal-2',
      'clinic-limpopo-3',
    ];
    for (const slug of mustStay) {
      expect(allFacilityRecords.some(f => f.slug === slug), `${slug} left the corpus`).toBe(true);
      expect(facilities.some(f => f.slug === slug), `${slug} was dropped from the directory`).toBe(true);
    }
  });

  it('a retired record is never offered as its survivor\'s nearby facility', () => {
    // The three adjudicated pairs are two DIFFERENT OSM objects, so nearbyFacilities'
    // own facility_id test cannot exclude them. This is the arm that needed the fix.
    for (const [retired, adj] of Object.entries(DUPLICATE_OF)) {
      const survivor = facilities.find(f => f.slug === adj.survivor)!;
      const slugs = nearbyFacilities(survivor, 5).map(f => f.slug);
      expect(slugs, `${adj.survivor} still offers ${retired} as nearby`).not.toContain(retired);
    }
  });

  it('retiring never removes a page — every retired record keeps its record and route', () => {
    for (const slug of Object.keys(DUPLICATE_OF)) {
      const f = allFacilityRecords.find(r => r.slug === slug);
      expect(f, `${slug} was deleted from the corpus`).toBeDefined();
      expect(f!.url_path).toMatch(/^\/clinics\//);
      expect(PROVINCES).toContain(f!.province as any);
    }
  });

  it('isDuplicateOfAnotherRecord covers the identity pairs the name rule cannot see', () => {
    // "Ha Grove Hospital"/"H.A. Grove Hospital" and "Elliot Provincial Hospital"/"Elliot
    // Hospital" are one OSM object each under two different names.
    for (const slug of ['ha-grove-hospital-mpumalanga', 'elliot-provincial-hospital-eastern-cape',
                        'tower-psychiatric-hospital-eastern-cape']) {
      const f = allFacilityRecords.find(r => r.slug === slug)!;
      expect(isDuplicateOfAnotherRecord(f), `${slug}`).toBe(true);
      expect(duplicateOf(slug), `${slug} is an identity pair, not a named adjudication`).toBeNull();
    }
  });
});
