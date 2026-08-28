/**
 * private-subject.mjs — the adjudicated records whose SUBJECT is a private person's
 * property, and which we therefore stop volunteering to a search engine.
 *
 * THE DECISION THIS FILE CARRIES (#1482, decided 2026-08-28)
 * ---------------------------------------------------------
 * #1002 left one question open and #1482 closed it: should a record adjudicated in
 * `care-role.ts` as NOT a health facility also leave the submitted sitemap? The answer
 * is NO for the class and YES for one narrow exception, and the two halves are decided
 * on DIFFERENT grounds. That split is the finding, not a compromise.
 *
 * THE DEFAULT IS: STAY IN THE SITEMAP, STAY INDEXABLE.
 * Measured over 2026-07-30..2026-08-26 (Search Console, page dimension, 1,480 pages
 * with impressions), the twelve care-role records earn 780 impressions and 10 clicks,
 * and THREE of them earn clicks: salt-river-mortuary 580/7, mattress-medi-centre 38/1,
 * mothibistad-shophhing-centre 17/2. Those are people who searched for a place by name,
 * were shown our page, chose it over the alternatives, and read a page that told them
 * the truth about what the place is and where to go instead. That is the correction
 * WORKING, and it works only because the page is indexed. Withholding the class would
 * delete the delivery mechanism for the very correction the class exists to deliver —
 * and note that `withheldKeys` sets noindex as well as dropping the sitemap entry, so
 * "just the sitemap" is not on offer. The portfolio's own sitemap canon points the same
 * way: `tools/sitemap-manifest-check.py` records that under-declaring PROVEN pages
 * forfeits free coverage, and that pruning a URL to move a ratio is a forbidden
 * incentive inversion.
 *
 * THE EXCEPTION IS DECIDED ON PRIVACY, NOT ON SEO.
 * `ali-is-siek-gauteng` is a private individual's house on a named residential street,
 * published with its coordinates, because a first-time OpenStreetMap contributor put
 * their friend's house on the map while working through the editor's tutorial. The
 * public interest that justifies the default — somebody looking for a known place gets
 * the truth about it — does not exist here: nobody searches for "Ali is siek" (4
 * impressions, 0 clicks in the same window), and the place is not a public place at
 * all. The objection is not that the page performs badly. It is that a page about a
 * stranger's home should not be advertised to a search engine by us, whatever it earns.
 *
 * SO THE DISCRIMINATOR IS NOT THE IMPRESSION COUNT. Impressions move; a threshold on
 * them would silently re-decide this question every month, and would eventually withhold
 * a mortuary that people genuinely search for or publish a house that happened to tick
 * over. The discriminator is a fact about the SUBJECT — is it a private person's
 * property — which is stable, is decidable from the same evidence the care-role entry
 * already carries, and cannot drift.
 *
 * WHAT THE EXCEPTION DOES AND DOES NOT DO
 * ---------------------------------------
 * It withholds the page from the submitted sitemap and marks it noindex, which are the
 * two things `withheldKeys` does and which agree with each other by construction (that
 * agreement is what keeps `tools/noindex-inventory-check.py` from reporting a
 * SITEMAP_CONFLICT). It does NOT unpublish, does NOT 404, does NOT change the URL and
 * does NOT touch a sourced value. The page stays live and keeps its "Not a clinic"
 * notice in all three languages, so anyone arriving from OpenStreetMap, from an internal
 * link or from a bookmark still gets the correction. We stop advertising it; we do not
 * withdraw it. Deleting the page would delete the correction with it, which is the one
 * remedy #1482 rules out explicitly.
 *
 * ADDING AN ENTRY
 * ---------------
 * An entry is a claim about the world — that a mapped object is a private person's
 * property — so it needs the same evidence a `care-role.ts` entry needs, and in practice
 * it needs the care-role entry itself: `tests/facility-quality.test.ts` asserts that
 * every slug here is also adjudicated in `NOT_WALK_IN_CARE`. Do not add a slug here to
 * suppress a page that merely performs badly, and do not add one on a name that merely
 * looks residential — "Ali house" (OSM way 1491884321) is named in the care-role source
 * and is NOT in our corpus, so it is not here either.
 */

/**
 * Slugs whose subject is a private person's property. Withheld from the sitemap and
 * marked noindex by `withheldKeys`; still published, still corrected.
 */
export const PRIVATE_SUBJECT_SLUGS = new Set([
  // OpenStreetMap node 13672144145, created by a first-time account whose own changeset
  // comment reads "i added my friends house to the map", moved two hours later with
  // "i changed my friends house location". The same account created "Ali house" and
  // "Ali braai" in the same yard in the same changesets. Full source in care-role.ts.
  'ali-is-siek-gauteng',
]);

/** True when this record's subject is a private person's property (#1482). */
export function isPrivateSubject(slug) {
  return PRIVATE_SUBJECT_SLUGS.has(slug);
}
