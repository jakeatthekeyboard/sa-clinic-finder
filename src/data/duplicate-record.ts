/**
 * duplicate-record.ts — the records that describe a facility ANOTHER record already
 * describes, adjudicated one pair at a time against OpenStreetMap.
 *
 * THE FINDING (#1509)
 * -------------------
 * Six pairs of records in `facilities.json` are one real hospital each. A reader
 * searching a province was shown the same hospital twice, the province total counted it
 * twice, and — for the pairs that are two distinct OSM objects — the facility was offered
 * as its own nearest neighbour 230 metres away.
 *
 * WHY THIS FILE EXISTS RATHER THAN A RULE
 * ---------------------------------------
 * `facility-quality.mjs` already withholds one member of each of these pairs from the
 * sitemap, and it would have been cheap to reuse that verdict here. IT WOULD ALSO HAVE
 * BEEN WRONG, and measurably so: its `duplicate` rule groups on NAME within a province,
 * which withholds 20 records, and only 6 of those are duplicates. The other 14 are
 * genuinely separate facilities that happen to share a name — kwamsane-clinic 41.8 km
 * apart, phomolong-clinic 38.0 km, tayler-bequest-hospital 48.3 km, bophelong-clinic
 * 29.3 km, mseleni-hospital 4.2 km, five "THINK site clinic" records, two "Clinic"
 * records in Limpopo 286 km apart. Withholding those from a SITEMAP is a defensible
 * conservatism (#929: we merely stop volunteering a page we cannot stand behind).
 * Dropping them from the DIRECTORY is a different act entirely — it hides eleven real
 * clinics from the readers of a humanitarian health directory, which is the harm
 * #226/#1228 forbid, arriving as a side effect of a fix for something else.
 *
 * #1509 says it in as many words: "any deduplication written for this must be
 * distance-gated, never name-gated". So the directory is narrowed by exactly two things,
 * and neither of them is a name:
 *
 *   1. IDENTITY. Two records carrying the SAME `facility_id` are the same OpenStreetMap
 *      object — that is not a heuristic, it is what an OSM id means. Handled in
 *      `helpers.ts` off the id itself, so it needs no entry here and cannot go stale.
 *   2. THIS FILE. Two DIFFERENT OSM objects mapped over one facility. Nothing mechanical
 *      can decide that, so each pair is named, adjudicated and evidenced below.
 *
 * HOW EACH PAIR WAS DECIDED (OSM API, read 2026-09-02)
 * ----------------------------------------------------
 * The deciding evidence in all three cases turned out to be GEOMETRY, not tag richness:
 * in every pair the retired object lies physically INSIDE the surviving one, which
 * settles "one facility or two" without needing a provincial facility list.
 *
 * The survivor is the object a person can act on — the one carrying the street address
 * and the telephone number — and the retired record's page stays live either way.
 *
 * WHAT RETIRING DOES NOT DO
 * -------------------------
 * It does not delete a record, a page or a sourced value. `src/data/pages/paths.ts`
 * builds routes from `allFacilityRecords`, so every retired record keeps its URL in all
 * three languages, keeps its hreflang alternates, keeps its coordinates and keeps its
 * OSM attribution. What changes is that the directory — counts, province listings,
 * search, service listings, "nearby facilities" — stops presenting one hospital as two.
 */

export interface DuplicateAdjudication {
  /** Slug of the record that keeps its place in the directory. */
  survivor: string;
  /** OSM object of the retired record, and of the survivor. */
  retiredObject: string;
  survivorObject: string;
  /** Why these two objects are one facility, and why the survivor is the survivor. */
  evidence: string;
}

/** Retired slug -> the adjudication that retired it. */
export const DUPLICATE_OF: Record<string, DuplicateAdjudication> = {
  'shongwe-hospital-mpumalanga': {
    survivor: 'shongwe-hospital-schoemansdal',
    retiredObject: 'node 4181180093',
    survivorObject: 'way 461210947',
    evidence:
      'The retired object is a bare point — three tags (amenity, healthcare, name), last ' +
      'touched in changeset 116980527 on 2022-02-03 — and it lies INSIDE the footprint of ' +
      'way 461210947, a 390 m x 668 m hospital polygon. One hospital, mapped once as a ' +
      'point and once as a building, 0.233 km apart. The surviving way carries fourteen ' +
      'tags including the street address in Schoemansdal, +27 13 781 3000, a fax number, ' +
      'seven specialities and operator "Mpumalanga Department of Health", and was last ' +
      'edited in changeset 186054012 on 2026-07-20. The retired record holds nothing the ' +
      'survivor lacks: its three service flags are a subset of the survivor\'s seven.',
  },
  'madadeni-provincial-hospital-kwazulu-natal': {
    survivor: 'madadeni-provincial-hospital-madadeninew-castle',
    retiredObject: 'node 2123577985',
    survivorObject: 'way 555009559',
    evidence:
      'Both objects were created by the SAME mapper in the SAME changeset — 119942531, ' +
      'user Khathucry, 2022-04-20 — which is the signature of someone drawing the building ' +
      'and leaving the old point behind rather than of two facilities being surveyed. The ' +
      'point lies inside the 1,429 m x 850 m polygon, 0.282 km from its centroid. The ' +
      'surviving way carries twelve tags including Section 5, Madadeni, postcode 2951, ' +
      '1,620 beds and +27 34 328 8000; the retired point carries three. The retired ' +
      'record\'s five service flags are a subset of the survivor\'s six.',
  },
  'witrand-psychiatric-hospital-north-west': {
    survivor: 'witrand-psychiatric-hospital-potchefstroom',
    retiredObject: 'way 1237566253',
    survivorObject: 'way 792194033',
    evidence:
      '#1509 flagged this pair as the one that "could genuinely be two buildings on one ' +
      'campus" at 0.876 km. The geometry settles it and it is neither: way 1237566253 is a ' +
      '1,609 m x 1,952 m polygon — the hospital GROUNDS — and way 792194033 is a ' +
      '90 m x 202 m building whose entire footprint lies inside it. The 0.876 km is the ' +
      'distance between a campus centroid and a building centroid, not between two sites. ' +
      'The building survives because it is the object a visitor can act on: Deppe Street, ' +
      'Potchefstroom, +27 18 294 9100, info@witrandhospital.co.za, opening hours ' +
      'Mo-Sa 07:00-16:00, last edited 2026-07-30 (changeset 186634468). The campus way is ' +
      'v1 from 2024-01-06 with five tags and no address.\n' +
      'PRESERVED, DELIBERATELY NOT MERGED: the retired campus way is the only one of the ' +
      'two carrying operator="North-West Dept of Health", and the surviving record\'s ' +
      '`operator` is empty. It is recorded here rather than copied into the survivor ' +
      'because `_provenance.json` declares `operator` as SOURCED, and a value taken from a ' +
      'different OSM object than the one the record is keyed to would still read as ' +
      'sourced while no longer being sourced from that record\'s own object. The honest ' +
      'repair is upstream: add operator to way 792194033 in OpenStreetMap, then re-pull. ' +
      'The retired record also carries arv_treatment, emergency_24h and tb_treatment where ' +
      'the survivor does not, and those are NOT preserved on purpose — they are inferred ' +
      'from facility type (commit 3d5d03c), while the survivor\'s narrower set agrees with ' +
      'its own OSM tags emergency=no and opening_hours=Mo-Sa 07:00-16:00. Importing them ' +
      'would replace a sourced answer with an inferred one.',
  },
};

/** The adjudication retiring this record from the directory, or null if it stands. */
export function duplicateOf(slug: string): DuplicateAdjudication | null {
  return DUPLICATE_OF[slug] ?? null;
}
