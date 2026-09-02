/**
 * phone-defect.ts — the telephone numbers we decline to publish, and why.
 *
 * THE FINDING (#1510)
 * -------------------
 * A South African telephone number has NINE digits after the `+27` country code (or ten
 * digits written nationally, with the leading `0`). Sweeping all 1,076 records — 582 of
 * which carry a `contact.phone`, segmenting each at `;` exactly as `phone.ts` does, 635
 * dialable segments in total — finds exactly THREE whose subscriber part is the wrong
 * length. That is the whole corpus, not a sample, and the count matches what #1510
 * reported: this class is three records, not a hidden inventory.
 *
 * Each of the three was a live `tel:` link on a public health directory, so a reader who
 * tapped "Call" reached nobody, or reached a stranger. On a site whose whole purpose is
 * sending a sick person to a real building, a broken contact is the same class of harm as
 * a wrong address — worse, because the reader believes they have a working number.
 *
 * WHAT WAS DONE WITH EACH, AND ON WHAT EVIDENCE
 * ---------------------------------------------
 * Every one was checked against the OpenStreetMap object the record is sourced from, read
 * live from the OSM API on 2026-09-02. The three did not have the same answer, and that is
 * why they are not handled by one rule.
 *
 * 1. comprehensive-health-care-parow-valley-cape-town — CORRECTED AT SOURCE, NOT HERE.
 *    Our record held `+27 21 9320 6038` (ten digits after +27). OSM way 740437416 now
 *    carries `contact:phone = +27 21 933 4545` — nine digits, Cape Town area code 021 —
 *    set in changeset 182687941 by user `rdwade` on 2026-05-15, a month AFTER our
 *    `last_verified` of 2026-04-14. A mapper had already fixed it and we had not
 *    re-pulled. So the repair is a RE-SOURCE: `facilities.json` now holds the current OSM
 *    value, the field stays `sourced`, and this file does not mention it. It is recorded
 *    here only so a future reader knows why one of #1510's three is absent below.
 *
 * 2. pietertjie-de-beer-clinic-eastern-cape — WITHHELD. OSM node 6930126785 carries
 *    `contact:phone = +27-42-555-13221`, byte-identical to ours, last touched in changeset
 *    82656028 (2020-03-26). Ten digits after +27 where nine belong. `042` is a real
 *    Eastern Cape area code, so the defect is in the seven-digit subscriber part, which is
 *    written as eight: `555-13221`. There is no way to know whether the extra digit is a
 *    doubled `1`, a doubled `2`, or a transposition — `042 555 1322` and `042 551 3221`
 *    are both plausible readings and both would be OUR invention.
 *
 * 3. rynpark-1-frailcare-rynfield-benoni — WITHHELD. OSM node 9038418318 carries
 *    `contact:phone = +27 11747705`, byte-identical to ours, changeset 143536112
 *    (2023-11-02). EIGHT digits after +27 where nine belong: `011 747 70__` is a digit
 *    short and there is nothing in the record, the OSM object or its history that says
 *    which digit is missing or where.
 *
 * WHY WITHHOLDING RATHER THAN REPAIRING
 * -------------------------------------
 * Padding or truncating a number to the right length manufactures a plausible WRONG
 * number, which is strictly worse than an obviously broken one: a broken number fails
 * visibly and a plausible one connects a sick person to an unrelated household. #1510 says
 * this in as many words — "which digit was mistyped is undeterminable without a second
 * source, and a guessed correction publishes some unrelated person's number".
 *
 * WHAT WITHHOLDING DOES AND DOES NOT DO
 * -------------------------------------
 * It suppresses the RENDERED contact — no `tel:` link, no visible number, and no
 * schema.org `telephone` on any of the three language routes. It does NOT edit
 * `facilities.json`: the sourced string stays exactly as OpenStreetMap has it, which is
 * the same discipline `care-role.ts` applies to a wrong `name` and `unnamed.ts` to a
 * missing one. Nothing is deleted, no page changes URL, no page 404s, and the rest of the
 * record — address, coordinates, services, the map link — renders untouched. We stop
 * offering a number we cannot stand behind; we do not withdraw the facility.
 *
 * Displaying the number unlinked was considered and rejected. #1510's own instruction is
 * to "withhold the link", but a reader who can see a number will dial it whether or not it
 * is a link, so hiding the link alone leaves the harm and removes only the convenience.
 *
 * RECOVERING AN ENTRY
 * -------------------
 * Delete the entry when a second source settles the number — the provincial Department of
 * Health facility list, Medpages, or a corrected OSM tag — and put the settled value in
 * `facilities.json` with that source named in the commit. Do NOT delete an entry to make
 * a gate pass: `tools/phone-format-check.py` fails on any renderable number of the wrong
 * length that is not adjudicated here, so removing an entry without fixing the number
 * turns the gate red, which is the intended pressure.
 */

/** Slug -> why this record's telephone number is not published. */
export const PHONE_WITHHELD: Record<string, string> = {
  'pietertjie-de-beer-clinic-eastern-cape':
    'OSM node 6930126785 gives +27-42-555-13221 — ten digits after +27 where South African numbers have nine. No second source settles which digit is wrong.',
  'rynpark-1-frailcare-rynfield-benoni':
    'OSM node 9038418318 gives +27 11747705 — eight digits after +27 where South African numbers have nine. No second source supplies the missing digit.',
};

/** The reason this record's telephone number is withheld, or null if it is published. */
export function phoneWithheldReason(slug: string): string | null {
  return PHONE_WITHHELD[slug] ?? null;
}
