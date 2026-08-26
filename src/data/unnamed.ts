/**
 * unnamed.ts — the published records whose `name` is not a name.
 *
 * WHAT WAS FOUND (2026-08-26 21:00 SAST)
 * --------------------------------------
 * Twenty-eight published records carry, in the `name` field, a generic English word
 * for a health facility instead of the facility's name: seventeen say "health care",
 * four say "Clinic", two say "Surgery", and one each say "healthcare", "clinic",
 * "CLINIC", "Medical Centre" and "sick bay". Twenty-three of the twenty-eight ALSO
 * carry no address, no telephone, no email, no website, no operator and no opening
 * hours, so the page has a dot on a map and nothing else a reader can act on.
 *
 * That is not a small cosmetic problem, because the rest of the page speaks about the
 * string as though it were a name and speaks with confidence. Measured on the live
 * page for `/clinics/mpumalanga/health-care-limpopo-4`:
 *
 *   <title>   health care — Clinic in Mpumalanga, Ehlanzeni District
 *   <h1>      health care
 *   editorial "health care is a walk-in primary healthcare facility in Mpumalanga,
 *             Ehlanzeni District district. With five verified services, this is a
 *             well-equipped facility for comprehensive primary care."
 *
 * A reader in the Lowveld is being told, in our own words, that a well-equipped
 * facility called "health care" is nearby. They cannot ring it, they cannot ask for it
 * by name at a taxi rank, and no provincial facility list will confirm it exists.
 *
 * WHY THIS IS A RENDERING FIX AND NOT A DATA FIX
 * ----------------------------------------------
 * There is nothing to correct the field TO. We do not know these facilities' names —
 * that is the whole finding. Inventing one, or copying the nearest named facility's,
 * would be fabrication; blanking the field would only move the same silence somewhere
 * the reader cannot see it. So the record keeps the value its source gave it and the
 * PAGE says what that value is: a generic word standing where a name should be.
 *
 * WHY THE PAGES STAY LIVE
 * -----------------------
 * The same policy `care-role.ts` and `outside-sa.ts` both set out. The coordinate is
 * real — somebody mapped a health facility at that point — and a page that says "there
 * is a facility here and we cannot tell you its name" is more use to a reader than a
 * 404. Nothing here deletes a record, changes a URL, touches the sitemap or sets
 * noindex.
 *
 * WHY A PREDICATE AND NOT A HAND-LISTED SET OF SLUGS
 * -------------------------------------------------
 * `care-role.ts` and `outside-sa.ts` list slugs because each of their entries is a
 * CLAIM ABOUT THE WORLD — that a building is a mortuary, that a hospital is in
 * Lesotho — and a claim about the world needs a source and a human to weigh it.
 * This file makes no claim about the world at all. It observes a property of OUR OWN
 * RECORD: the `name` field holds a common noun. That is checkable from the record
 * itself, needs no source, and cannot be wrong in the way an adjudication can be.
 * Deriving it also means the next bounding-box import that lands an unnamed node gets
 * the notice automatically, rather than publishing a confident page about "health
 * care" until somebody notices again.
 *
 * The list below is therefore EXACT-MATCH ONLY, after trimming, collapsing internal
 * whitespace, lowercasing and dropping surrounding punctuation. No prefix matching, no
 * substring matching, no fuzzy matching. "Clinic" is in the list; "Melvile Clinic",
 * "Bophelong Clinic" and "Think Site Clinic- Adherence Module" are names, are not in
 * the list, and must never be caught by it. A predicate that widened to substrings
 * would flag roughly half the corpus and put a "we do not know this facility's name"
 * notice on top of hundreds of correctly named clinics, which is a far worse error
 * than the one it fixes.
 */

/**
 * Generic words that stand where a facility name should be. Every entry is a term for
 * a KIND of health facility or for health care in general — never a place, a person,
 * an operator or a service.
 *
 * Each of these is present in the corpus today except where marked, and the unmarked
 * ones are included because they are the obvious next arrivals from the same source
 * and cost nothing to cover in advance.
 */
const PLACEHOLDER_NAMES: ReadonlySet<string> = new Set([
  // In the corpus as at 2026-08-26.
  'health care',
  'healthcare',
  'clinic',
  'surgery',
  'medical centre',
  'sick bay',
  // Not in the corpus; same shape, covered in advance.
  'health',
  'medical',
  'clinics',
  'health centre',
  'health center',
  'health post',
  'medical center',
  'hospital',
  'doctor',
  'doctors',
  'pharmacy',
  'dispensary',
  'sickbay',
  'consulting rooms',
]);

/**
 * Normalise a `name` for comparison: trim, collapse internal whitespace, lowercase,
 * and drop punctuation at either end. Nothing else — in particular no stripping of
 * interior words, which is how a substring match would creep back in.
 */
function normalise(name: string): string {
  return name
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')
    .toLowerCase();
}

/**
 * True when the record's `name` field holds a generic word for a health facility
 * rather than the facility's name.
 */
export function nameIsPlaceholder(name: string): boolean {
  return PLACEHOLDER_NAMES.has(normalise(name));
}
