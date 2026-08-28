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
 * THE SIX UNRESOLVED CANDIDATES, ADJUDICATED (#1362, 2026-08-21)
 * ---------------------------------------------------------------
 * #1362 was filed because the six candidates below had been LEFT, each published as
 * a health facility with no second source either way. Each was then researched
 * individually against sources whose HOST was checked first — a search result
 * corroborating our own data has twice turned out to be our own site, so
 * clinicfinder.co.za, mapcarta.com, openalfa, waze and worldplaces were all
 * discarded as OSM mirrors or as us before anything was concluded. Four settled,
 * two did not. The two that did not are still published and still unsettled, and
 * that is the honest state, not a gap to fill with a guess.
 *
 * SETTLED — added to NOT_WALK_IN_CARE below, each with its source:
 *   western-cape-blood-service-george-regional-office-…  A blood donation centre and
 *     the service's regional office. #1362 said "not walk-in care" was the wrong
 *     label without deciding what it IS instead; wcbs.org.za names both a "George
 *     Regional Office" and a "George Blood Bank" with donor hours at this building,
 *     which decides it. You walk in to give blood; nobody is treated.
 *   the-local-choice-pharmacy-plett-medicine-depot  A retail pharmacy branch.
 *     #1362 said to verify rather than assume the 2026-08-19 operator_type
 *     correction covered it: it did NOT — the record is `private` but still typed
 *     `clinic` and still presented as a place to get care. Medpages categorises it
 *     "Pharmacies - Retail".
 *
 * SETTLED AS REAL CARE — NOT care-role cases, routed to the type/operator_type lane:
 *   health-worx-medical-centre-centurion-mall-centurion  A PRIVATE general practice
 *     and dental centre in a shopping mall (health-worx.co.za's own service list;
 *     Medpages categorises "HEALth-WorX Centurion" as "General Practice (GP)"; a
 *     third listing carries our exact telephone 012 683 3000). It is genuine care,
 *     so it does not belong in this file — but we publish it as a PUBLIC DISTRICT
 *     HOSPITAL, which is wrong in both fields. Worth noting for whoever takes that:
 *     Centurion Mall is absent from the operator's own current branch list, so the
 *     branch may have closed or moved to Raslouw.
 *   strydom-medi-centre-mulbarton-johannesburg  A real PRIVATE clinic, not a sibling
 *     of Mattress Medi Centre. Medpages categorises "Strydom Medi-Centre" as
 *     "Clinics - Private" at Mulbarton Shopping Centre, 4 True North Road, with our
 *     record's exact telephone +27 11 432 2410. We publish it as `public`.
 *
 * THE #1415 SIX, AND WHY ITS PROPOSED GATE CANNOT WORK (#1414/#1415/#1416, 2026-08-28)
 * ------------------------------------------------------------------------------------
 * #1415 named six records and asked for a gate on a signal "about the SUBJECT rather
 * than the string" — specifically: require an OSM amenity/healthcare tag consistent
 * with the assigned type, and hard-withhold on `amenity=veterinary`, on `disused:*` /
 * `was:*` prefixes, and on shop/leisure tags. That gate was MEASURED against a fresh
 * full-corpus Overpass tag capture on 2026-08-28
 * (data/capture/osm-tags/2026-08-28.json, 1,073 objects, 1,072 returned) and it flags
 * ZERO records — including zero of the six it was proposed for:
 *
 *   amenity=veterinary or healthcare=veterinary  0
 *   disused: / was: / abandoned: prefixed keys   0
 *   shop or leisure tag with no health tag       0
 *   no healthcare key and no health amenity      0
 *
 * Panorama Animal Clinic is `amenity=hospital`, not `amenity=veterinary`. Old Welkom
 * announces its disuse in its NAME, not in a `disused:` prefix. "Ali is siek" is
 * `amenity=hospital` + `healthcare=hospital`. This re-measures, on today's data, the
 * claim #1350 made on 2026-08-20, and reaches the same answer: a shopping centre and
 * a district hospital are indistinguishable at the tag layer, so no build-time gate
 * reading tags can separate them. The method that DOES work is the one this file
 * already uses — scan NAMES, then adjudicate each candidate against the OSM object's
 * own EDIT HISTORY and a sweep of what else is mapped within a couple of hundred
 * metres — and that is a research procedure, not a gate. Do not re-propose the tag
 * gate; the measurement is above and it is reproducible from the capture.
 *
 * THREE OF THE SIX WERE ALREADY HERE (#1002/#1350): mothibistad-shophhing-centre,
 * panorama-animal-clinic and old-welkom-provincial. Two of the remaining three are
 * added below. The sixth is not a care-role case:
 *
 *   tswane-ward-40-tswane  KEPT, AND IT IS REAL CARE. OpenStreetMap node 9057511617
 *     carries operational_status=operational, dispensing=yes, wheelchair=yes,
 *     electricity=generator, water_source=water_works,
 *     healthcare:speciality=clinical_pathology;community, emergency=no (which agrees
 *     with our own services.emergency_24h being false) and a full street address at
 *     Thaga Street. That is a well-surveyed working public clinic. What is wrong with
 *     it is its NAME: "Tswane ward 40" is a municipal ward reference, not a facility
 *     name, and "Tswane" is a misspelling of Tshwane. That is the src/data/unnamed.ts
 *     problem rather than this one — but unnamed.ts is deliberately an EXACT-MATCH set
 *     of generic words for a KIND of facility, and a ward reference is neither generic
 *     nor a kind, so it does not belong in that set either. Filed separately; nothing
 *     here unpublishes a real clinic over a bad name.
 *
 * STILL UNRESOLVED — do NOT add these without a second source, and do NOT unpublish
 * them either. "No source found" is not evidence that a place is not a clinic, and
 * removing a clinic that exists is the one error this humanitarian site cannot
 * afford. What is recorded here is what was searched, so the next session does not
 * repeat it:
 *   afm-steynville-church-northern-cape  OSM way 608975659. The clinic tags are
 *     OLDER than the church name — E Vos created the object with amenity=clinic and
 *     NO name in 2018, and the name "AFM Steynville Church" was added in 2022 by a
 *     "#maproulette South Africa - COVID 19 Hospital Mapping" task. So the name was
 *     attached to something already tagged a clinic, which weakens the reading that
 *     someone mapped a church and mis-tagged it, without settling anything. No
 *     independent source places a clinic at the AFM church, and none refutes one:
 *     a Hopetown business directory lists only Wege Hospital, on Cross Street in
 *     Steynville — a different facility at a different street — and Medpages
 *     returned no details for Hopetown clinic service codes. Needs a Northern Cape
 *     DoH facility list.
 *   swellendam-school-clinic-western-cape  Established: it is NOT a Western Cape
 *     DoH facility. The province lists exactly two in Swellendam — Swellendam PHC
 *     Clinic, 18 Drostdy Street, and Swellendam Hospital — both at roughly
 *     -34.0243, 20.4500, about 1.1 km east of our coordinate. NOT established: what
 *     is at our coordinate. A school clinic can be a real service point that is
 *     simply not on the provincial facility list, so absence from that list decides
 *     the operator question and not the existence question.
 *   medi-centre-pretoria  Nothing found either way. The name is generic and the
 *     record carries no address and no telephone, so there is nothing to bind a
 *     search to; the named facilities near the coordinate (Mediclinic Medforum,
 *     Mediclinic Arcadia) are neither at it nor called this. Unsettled, published,
 *     and flagged here rather than guessed at.
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
  'temba-santa-hospital-grahamstown': {
    what:
      'Temba TB Hospital in Makhanda is CLOSED and nobody is treated here. The Eastern Cape Department of Health ended ' +
      'the lease on the Grahamstown TB Association building it occupied and moved its patients and its staff into a wing ' +
      'of Settlers Hospital, in Milner Street, Makhanda, which is where TB inpatient care in this town now happens. ' +
      'These buildings stood empty within a fortnight of the closure and have since been stripped by thieves. Do not ' +
      'travel here, and do not ring the telephone number on this page.',
    source:
      'The Eastern Cape Department of Health\'s own Annual Report 2023/24 says, under the heading "Temba TB Hospital": ' +
      '"The hospital has been moved from Temba hospital premises which was being rented under Grahamstown TB Association ' +
      'and has been relocated to Settler\'s hospital." Spotlight (SECTION27 health journalism), 2023-09-13: "On 1 July ' +
      'this year, Makhanda\'s only TB hospital, Temba TB Hospital, also shut its doors" ' +
      '(https://www.spotlightnsp.co.za/2023/09/13/in-depth-why-an-eastern-cape-tb-hospital-closed-and-what-comes-next/). ' +
      'Grocott\'s Mail (Rhodes University, Makhanda), 2023-07-13: "When Grocott\'s Mail visited the Temba Santa TB ' +
      'hospital on 12 July, the buildings were deserted", and the department "says the TB patients will be accommodated ' +
      'in a wing at the busy Settler\'s Hospital, and the 31 staff will also be moved to Settler\'s" ' +
      '(https://grocotts.ru.ac.za/2023/07/13/temba-santa-tb-hospital-shuts-down-abruptly/); a follow-up on 2024-10-24 is ' +
      'headlined "Community steps up to save vandalized Themba TB Hospital". Three spellings are in circulation and all ' +
      'three are kept findable: "Temba TB Hospital" (the department\'s own string), "Temba SANTA Hospital" (ours, and ' +
      'the name most local searchers still use) and "Themba TB Hospital" (also in the department\'s report). The record ' +
      'still carries services.emergency_24h — that is NOT corrected here: it sits in emergency-basis.json\'s ' +
      '`unevidenced` list, and #1349 says explicitly not to resolve such a claim by flipping the flag.',
  },
  'western-cape-blood-service-george-regional-office-the-medical-centre-courtenay-s': {
    what:
      'This is the Western Cape Blood Service in George — a blood donation centre together with the service\'s regional ' +
      'office, in The Medical Centre on Courtenay Street. Members of the public do walk in here, but to give blood, not ' +
      'to be treated: it is not a clinic, it has no consulting rooms and it provides no primary care. For public health ' +
      'care in George, go to George Provincial Hospital in Heatherlands or Geneva Clinic.',
    source:
      'The Western Cape Blood Service\'s own contact page, https://www.wcbs.org.za/contact-us/, lists TWO entries at this ' +
      'building: "George Regional Office", The Medical Centre, Courtenay Street, George, telephone 044 874 2074; and ' +
      '"George Blood Bank", Medical Centre, 33 Courtenay Street, George, telephone 044 884 0581, georgebb@wcbs.org.za, ' +
      'open Mondays-Fridays 8:00-22:00 and weekends 8:00-16:00. Medpages (orgcode 95070) lists "Western Cape Blood ' +
      'Services - George Regional Office" under the category "Blood Transfusion Services" at The Medical Centre, 33 ' +
      'Courtenay Street, George, telephone +27 44 874 2074. NOTE for anyone re-checking this: the Western Cape Blood ' +
      'Service is NOT part of SANBS. SANBS serves eight of the nine provinces and the Western Cape is served ' +
      'independently by WCBS; the 2025 joint donor-recruitment campaign between them is not a merger, and no merger ' +
      'source exists. Do not "correct" this entry to SANBS.',
  },
  'ali-is-siek-gauteng': {
    what:
      'This is a private house on a residential street north of Pretoria. It is not a hospital, nobody is ' +
      'treated here and there is no emergency department. The person who put it on OpenStreetMap says so in ' +
      'their own edit description: it was their first ever edit, made while working through the map ' +
      'editor\'s tutorial, and they gave the same hospital label to the braai in the same yard. For public ' +
      'hospital care in this part of Tshwane, go to Tshwane District Hospital or Steve Biko Academic ' +
      'Hospital, both in Pretoria.',
    source:
      'OpenStreetMap node 13672144145, created 2026-03-23 16:20 UTC in changeset 180313578 by a first-time ' +
      'account (changesets_count=1, ideditor:walkthrough_started=yes) whose own changeset comment reads "i ' +
      'added my friends house to the map", and moved two hours later in changeset 180320016, comment "i ' +
      'changed my friends house location". The node has never carried any name but "Ali is siek" (Afrikaans ' +
      'for "Ali is sick") and has no address, telephone, operator or opening hours. The same account, in the ' +
      'same changesets, created way 1491884321 "Ali house" (also amenity=hospital, healthcare=hospital) and ' +
      'way 1491884322 "Ali braai" (amenity=restaurant) in the same yard. An Overpass query for every named ' +
      'feature within 250 m returns only suburban streets (Gwarriebos, Dadelpalm, Dikbas, Driedoring, ' +
      'Blinkblaar and Apiesdoring Avenue), a guest house, an estate agency and a one-person physiotherapy ' +
      'practice — no hospital infrastructure of any kind. NOTE for the next OSM refresh: way 1491884321 is ' +
      'the same mis-tagging and is NOT in our corpus only because it postdates the 2026-04-14 extract; if it ' +
      'ever arrives, it belongs here too.',
  },
  'fairlands-scout-hall-gauteng': {
    what:
      'This is a scout hall in Berario, Johannesburg, not a clinic. Its OpenStreetMap entry carried the ' +
      'name for years before anyone attached clinic labels to it, and the hall itself is recorded a second ' +
      'time, as a building simply named Scout Hall. The public clinic in this street is Berario Clinic, run ' +
      'by the Gauteng Department of Health, which stands a few doors away and has its own page on this site.',
    source:
      'OpenStreetMap node 3071850290 was created 2014-09-11 (changeset 25368350, user AmyWootton) carrying ' +
      'name="Fairland\'s Scout Hall" and NO health tags of any kind; amenity=clinic and healthcare=clinic ' +
      'were added on top of it more than seven years later, on 2022-01-13 (changeset 116091504, user ' +
      'Khathucry). The name is therefore older than the clinic tags, which is the inverse of the ' +
      'afm-steynville case below and is what settles this one. An Overpass query for every named feature ' +
      'within 250 m returns way 302904029, a building named "Scout Hall", and — 58 m from our node — both ' +
      'node 3071892811 "Berario Clinic" (amenity=clinic, healthcare=clinic, operator="Gauteng Department of ' +
      'Health") and its building way 302904055 of the same name. Berario Clinic is already published here as ' +
      'berario-clinic-randburg-johannesburg.',
  },
  'covid-testing-drive-through-johannesburg': {
    what:
      'This was a drive-through coronavirus testing site on Winnie Mandela Drive in Johannesburg, set up ' +
      'during the pandemic. It is gone: no testing and no treatment happens here, and there is nothing at ' +
      'this spot to travel to. For public health care in this part of Johannesburg, go to Greenside Clinic ' +
      'in Greenside; any public clinic will test for HIV and TB without an appointment.',
    source:
      'OpenStreetMap node 8599351361 was created 2021-04-06 by user Biker69 as "COVID TESTING - ' +
      'Drive-Through" with opening_hours "Mo-Fr 09:00-16:00" at 49 William Nicol Drive (later renamed Winnie ' +
      'Mandela Drive), and was DELETED on 2026-08-23 08:52 UTC in changeset 187874964, a single-object ' +
      'changeset whose comment is "Deleted a clinic", made with the field-survey app Every Door Android 6.0 ' +
      '— i.e. by a mapper standing at the place, not a bulk edit and not vandalism. The OSM API answers HTTP ' +
      '410 Gone for the node. An Overpass query for every named feature within 250 m returns a fuel station, ' +
      'a fast-food outlet, a convenience store and George Lea Park, and no health facility at all. This is ' +
      'the one genuine deletion in the 2026-08-28 full-corpus drift sweep (1,076 records over 1,073 OSM ' +
      'objects; 1,072 returned).',
  },
  'the-local-choice-pharmacy-plett-medicine-depot': {
    what:
      'The Local Choice Pharmacy Plett Medicine Depot is a retail pharmacy in Plettenberg Bay, one branch of a national ' +
      'pharmacy franchise. You can buy medicines and over-the-counter health products there, but it is not a public ' +
      'clinic, nobody is treated there and no free public health care is provided. The public clinic serving ' +
      'Plettenberg Bay is Kwanokuthula Community Day Centre, in Kwanokuthula.',
    source:
      'Medpages (orgcode 87713) lists "The Local Choice Pharmacy - Plettenberg Bay" under the category "Pharmacies - ' +
      'Retail" at Shop 12A Atmar Centre, 11 High Street, Plettenberg Bay, 6600. A second directory listing carries our ' +
      'record\'s exact name, "The Local Choice Pharmacy Plett Medicine Depot", at High St, Atmar Centre, Plettenberg ' +
      'Bay, with our record\'s exact telephone 044 533 2298 (Medpages gives 044 533 2278 for the same branch, which is ' +
      'a second line, not a different business). The Local Choice describes itself as "an aligned, like-minded group of ' +
      'independent pharmacists" with "more than 180 stores throughout South Africa".',
  },
};

/** The adjudicated entry for a facility, or null if it is an ordinary facility. */
export function careRole(slug: string): CareRoleEntry | null {
  return NOT_WALK_IN_CARE[slug] ?? null;
}
