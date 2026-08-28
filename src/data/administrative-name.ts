/**
 * administrative-name.ts — published records whose `name` is an ADMINISTRATIVE
 * REFERENCE (a municipal ward, a district number) rather than a facility name.
 *
 * WHAT WAS FOUND (#1481, adjudicated 2026-08-28)
 * ----------------------------------------------
 * `tswane-ward-40-tswane` renders `<h1>Tswane ward 40</h1>` and editorial that speaks
 * about that string as though it were the clinic's name. It is not. "Tswane ward 40" is
 * a City of Tshwane ward reference — and "Tswane" additionally misspells Tshwane — so a
 * reader is being handed a municipal administrative unit where a name should be. They
 * cannot ask for it at a taxi rank and no provincial facility list will confirm it.
 *
 * THE RECORD IS A REAL, WELL-SURVEYED, WORKING CLINIC AND NOTHING HERE UNPUBLISHES IT.
 * OpenStreetMap node 9057511617 carries operational_status=operational, dispensing=yes,
 * wheelchair=yes, electricity=generator, water_source=water_works,
 * healthcare:speciality=clinical_pathology;community, emergency=no (which agrees with
 * our own services.emergency_24h being false) and a full street address at Thaga Street.
 * The services, the type and the editorial all still stand. Only the NAME is wrong, and
 * only its presentation is fixed here.
 *
 * WHY THIS IS A SEPARATE FILE AND NOT A WIDENING OF unnamed.ts
 * -----------------------------------------------------------
 * `unnamed.ts` holds an EXACT-MATCH set of generic English words for a KIND of health
 * facility — "health care", "Clinic", "sick bay" — and its docstring forbids prefix,
 * substring and fuzzy matching because a widened predicate would flag roughly half the
 * corpus and put a "we do not know this facility's name" notice on hundreds of correctly
 * named clinics. A ward reference is neither generic nor a kind, so it does not belong
 * in that set, and #1481 says in terms that widening that file is the wrong fix. It is
 * also a DIFFERENT statement to the reader: `unnamed.ts` says we do not know whether the
 * public can walk in, which would be false here — we know a great deal about this
 * clinic, we just do not know what it is called.
 *
 * WHY THE NAME IS NOT CORRECTED IN THE DATA
 * -----------------------------------------
 * `src/data/_provenance.json` declares `name` as `sourced`, and there is nothing to
 * correct it TO. Establishing what this clinic is actually called needs the Gauteng
 * Department of Health facility list. Inventing a name, or borrowing the nearest named
 * facility's, would convert a sourced value into a fabrication while it still reads as
 * sourced. So the record keeps the value its source gave it and the PAGE says what that
 * value is. Same reasoning as `unnamed.ts`, same policy as `care-role.ts` and
 * `outside-sa.ts`: the page stays live, the URL does not change, no sourced value is
 * edited.
 *
 * EXACT-MATCH ONLY, AND HAND-LISTED
 * ---------------------------------
 * Unlike `unnamed.ts` this cannot be a derived predicate. "Ward" is a legitimate part of
 * a real facility name — a hospital ward, "Ward 21 Clinic" as a name somebody actually
 * uses — so no property of our own record decides it. Whether a string is an
 * administrative reference rather than a name is a claim about the world, adjudicated
 * one record at a time, which is why this is a slug-keyed set like `care-role.ts` and
 * not a predicate over the name field. Add an entry only with the reasoning for it.
 */

/**
 * A record whose `name` is an administrative reference.
 *
 * A `what` string must contain NO NUMERALS, for the mechanical reason `care-role.ts`
 * gives: it is rendered per locale from a translated sibling, and any digit that ends
 * up on one route and not another is a numeric difference between the English page and
 * its isiXhosa and isiZulu siblings and fails `tools/numeric-parity-check.py` — a guard
 * that exists to catch a dropped clinical figure and must not be spent on a ward number.
 * Name the municipality, not the ward number. (`source` is not rendered and may carry
 * digits.)
 */
export interface AdministrativeNameEntry {
  /** What kind of administrative reference the string is. One sentence, factual. */
  what: string;
  /** The evidence that it is a reference and not a name. */
  source: string;
}

export const ADMINISTRATIVE_NAMES: Record<string, AdministrativeNameEntry> = {
  'tswane-ward-40-tswane': {
    what:
      'The heading on this page is a City of Tshwane municipal ward reference, not the clinic\'s name, and ' +
      '"Tswane" is also a misspelling of Tshwane. This is a real, working public clinic — it dispenses ' +
      'medicines, it is wheelchair accessible and it has its own generator and water supply — but we have not ' +
      'been able to establish what it is called, so we show you the string our source recorded rather than a ' +
      'name we invented.',
    source:
      'OpenStreetMap node 9057511617, name "Tswane ward 40", at Thaga Street. Ward 40 is a City of Tshwane ' +
      'municipal ward; the node carries operational_status=operational, dispensing=yes, wheelchair=yes, ' +
      'electricity=generator, water_source=water_works and healthcare:speciality=clinical_pathology;community. ' +
      'Establishing the facility\'s actual name needs the Gauteng Department of Health facility list.',
  },
};

/** The adjudicated entry for a facility, or null if its name is an ordinary name. */
export function administrativeName(slug: string): AdministrativeNameEntry | null {
  return ADMINISTRATIVE_NAMES[slug] ?? null;
}
