/**
 * care-role.ts — the small set of published records that are NOT places a member
 * of the public can walk into for care.
 *
 * WHY THIS EXISTS (#1002, extended #1350)
 * ----------------------------------------
 * "This facility has no service data" and "this is not a care facility" are two
 * different defects and they have different remedies. The first is an absence in
 * OpenStreetMap and is fixed by better source data. The second cannot be fixed by
 * any amount of enrichment: Salt River Mortuary is a state forensic pathology
 * service, Grayston Mews is an office building, Mattress Medi Centre sells beds,
 * Mothibistad Shophhing Centre is a shopping centre, Panorama Animal Clinic treats
 * pets, and Old Welkom Provincial is a decommissioned building. Every one of them
 * is tagged `healthcare` in OSM, so no re-query will ever separate them from a
 * clinic — only adjudication against a second source does, and that judgement
 * belongs in code, next to facility-quality.mjs, NOT in facilities.json, which
 * holds sourced values only.
 *
 * THAT LAST CLAIM IS NOW MEASURED, NOT ASSUMED (#1350, 2026-08-20)
 * ---------------------------------------------------------------
 * #1350 was filed on the premise that non-facility nodes could be separated by
 * "verifying each against the OSM object's own tags". They cannot. A full Overpass
 * sweep of all 1,076 published records on 2026-08-20 (captured at
 * data/capture/osm-tags/2026-08-20.json) returned tags for every one, and ALL 1,076
 * still carry either a `healthcare` key or a health `amenity` value. The count of
 * records a tag re-query would flag is ZERO. A shopping centre and a district
 * hospital are indistinguishable at the tag layer by construction, which is exactly
 * why this file exists and why it is hand-adjudicated.
 *
 * What DOES find them is the NAME, read against a second source. The three entries
 * added by #1350 were surfaced by scanning the 1,076 published names for words that
 * cannot describe a public health facility (shopping/mall/animal/vet/church/
 * mortuary/"not in use"/retail chains), and that scan re-found all three of the
 * #1002 entries, which is the only evidence available that the method works. It is
 * a candidate generator, not a verdict: of 12 name hits, 3 were already adjudicated,
 * 3 are the new entries, and the remaining 6 were deliberately NOT added because a
 * second source did not settle them — see the UNRESOLVED list below.
 *
 * UNRESOLVED CANDIDATES — do not add these without a second source
 * ---------------------------------------------------------------
 * Each is a name that reads wrong against a `healthcare` tag, and in each case the
 * honest answer today is "not established". Guessing is the failure mode this file
 * is built against.
 *   afm-steynville-church-northern-cape       OSM way 608975659, name "AFM Steynville
 *     Church", amenity=clinic. A church hall genuinely may host a clinic; no source
 *     found either way.
 *   western-cape-blood-service-george-regional-office-the-medical-centre-courtenay-s
 *     A blood donor service. Nobody is treated there, but the public does walk in,
 *     so "not walk-in care" is the wrong label without deciding what it is instead.
 *   swellendam-school-clinic-western-cape     A school clinic may be a real public
 *     service point with restricted access.
 *   health-worx-medical-centre-centurion-mall-centurion  A private medical centre
 *     published as a District Hospital. This is an operator_type/type question
 *     (#1150 territory), not a care-role one.
 *   the-local-choice-pharmacy-plett-medicine-depot  A retail pharmacy; covered by
 *     the 2026-08-19 operator_type correction rather than by this file.
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

/**
 * A `what` string must contain NO NUMERALS. It renders on the English facility page
 * and, by the deliberate policy above, on no other, so any digit in it shows up as a
 * numeric difference between the English page and its isiXhosa and isiZulu siblings
 * and fails tools/numeric-parity-check.py — a guard that exists to catch a dropped
 * clinical figure and must not be spent on a distance nobody needs. Name the town,
 * not the kilometres. (Measured 2026-08-20: "about 9 km away" did exactly this.)
 */
export interface CareRoleEntry {
  /** What the place actually is. One sentence, factual, no hedging. */
  what: string;
  /** The source that settled it. */
  source: string;
}

export const NOT_WALK_IN_CARE: Record<string, CareRoleEntry> = {
  'mothibistad-shophhing-centre-northern-cape': {
    what:
      'This is a shopping centre in Mothibistad, not a hospital. Its OpenStreetMap entry is a building polygon named ' +
      '"Mothibistad Shophhing Centre" that also carries a hospital tag, which is a mistake in the source data rather than ' +
      'a description of the building. The nearest public hospitals are Kuruman Provincial Hospital, in Kuruman, and ' +
      'Tshwarango District Hospital.',
    source:
      'OpenStreetMap way 940675693 (name "Mothibistad Shophhing Centre", amenity=hospital, emergency=no; last edited ' +
      '2022-04-11, changeset 119567176). An Overpass query for every named feature within 250 m returns two schools and ' +
      'three residential streets and no hospital infrastructure; the district hospitals serving Ga-Segonyana are in ' +
      'Kuruman and Batlharos.',
  },
  'panorama-animal-clinic-centurionpretoria': {
    what:
      'Panorama Animal Clinic is a veterinary practice for pets in The Reeds, Centurion. It is not a hospital and no ' +
      'person is treated here. Its OpenStreetMap entry carries a hospital tag, which is a mistake in the source data ' +
      'rather than a description of the practice.',
    source:
      'https://panoramaanimalclinic.com/ and the SAVET veterinary directory, both giving 209 Panorama Road, The Reeds, ' +
      'Centurion and telephone +27 12 661 6041 — the same address and number as OpenStreetMap way 792097221, whose ' +
      'contact email is panovet@yahoo.com.',
  },
  'old-welkom-provincial-not-in-use-free-state': {
    what:
      'This is the old Welkom provincial hospital building, also known as Kopano Hospital. It is out of service and ' +
      'nobody is treated here — its own OpenStreetMap name records it as not in use. The public hospital serving ' +
      'Welkom and the wider Matjhabeng area is Bongani Regional Hospital, in Thabong.',
    source:
      'OpenStreetMap way 792484409 (name "Old Welkom Provincial ( Not in Use)", emergency=no). A 2020 public petition ' +
      'to the Free State Department of Health asks for Kopano Hospital, the old Welkom hospital, to be refurbished to ' +
      'relieve pressure on Bongani Regional Hospital, which it describes as the only public hospital in Matjhabeng: ' +
      'https://www.change.org/p/free-state-department-of-health-a-new-public-hospital-in-welkom',
  },
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
