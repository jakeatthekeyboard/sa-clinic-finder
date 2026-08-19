/**
 * care-role.ts — the small set of published records that are NOT places a member
 * of the public can walk into for care.
 *
 * WHY THIS EXISTS (#1002)
 * -----------------------
 * "This facility has no service data" and "this is not a care facility" are two
 * different defects and they have different remedies. The first is an absence in
 * OpenStreetMap and is fixed by better source data. The second cannot be fixed by
 * any amount of enrichment: Salt River Mortuary is a state forensic pathology
 * service, Grayston Mews is an office building, and Mattress Medi Centre sells
 * beds. All three are tagged `healthcare` in OSM, so no re-query will ever
 * separate them from a clinic — only adjudication against a second source does,
 * and that judgement belongs in code, next to facility-quality.mjs, NOT in
 * facilities.json, which holds sourced values only.
 *
 * WHAT IT DELIBERATELY DOES NOT DO
 * --------------------------------
 * It does not delete a record, change a URL, touch the sitemap or set noindex.
 * Salt River Mortuary draws ~390 impressions/28d: people genuinely search for it
 * and land here, and the useful answer for them is a page that says plainly what
 * the place is and where to go for treatment instead — not a 404 and not a page
 * that has been hidden from Google. Removing the pages is the scope question
 * still open in #1002; this file is the correctness fix that is true either way.
 *
 * Entries are hand-adjudicated one at a time, each carrying the source that
 * settled it. An entry is a claim about the world, so it needs the same evidence
 * an operator_type correction needs.
 */

export interface CareRoleEntry {
  /** What the place actually is. One sentence, factual, no hedging. */
  what: string;
  /** The source that settled it. */
  source: string;
}

export const NOT_WALK_IN_CARE: Record<string, CareRoleEntry> = {
  'salt-river-mortuary-western-cape': {
    what:
      'This is the Salt River Forensic Pathology Service — a Western Cape Government state mortuary where post-mortem examinations are carried out. ' +
      'It is not a clinic and nobody is treated here. Families attend by appointment to identify a body or to collect documents; ' +
      'the forensic pathology service is reached through the police officer or the funeral undertaker handling the case, not by walking in.',
    source: 'https://www.westerncape.gov.za/health-wellness/facility/salt-river-forensic-pathology-service',
  },
  'grayston-mews-gauteng': {
    what:
      'Grayston Mews is a commercial building on Grayston Drive in Sandton. Individual private practices rent rooms in it, ' +
      'but the building itself is not a health facility and has no reception, no hours and no services of its own.',
    source: 'OpenStreetMap way 677588515 (building=yes, healthcare=yes); building tenancy listings for 134 Grayston Drive, Sandton.',
  },
  'mattress-medi-centre-gauteng': {
    what:
      'Mattress Medi Centre is a bedding retailer, not a health facility. It appears on this site because its OpenStreetMap entry ' +
      'carries a healthcare tag, which is a mistake in the source data rather than a description of the business.',
    source: 'https://vaalio.co.za/mattress-medi-centre',
  },
};

/** The adjudicated entry for a facility, or null if it is an ordinary facility. */
export function careRole(slug: string): CareRoleEntry | null {
  return NOT_WALK_IN_CARE[slug] ?? null;
}
