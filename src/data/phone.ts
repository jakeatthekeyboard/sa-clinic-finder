/**
 * phone.ts — make the "Call" link on a facility page actually dial.
 *
 * WHAT WAS FOUND (2026-08-28 21:00 SAST)
 * --------------------------------------
 * 582 published facility records carry a telephone number, and the facility page
 * rendered every one of them as `href={`tel:${facility.contact.phone}`}` — the sourced
 * string dropped verbatim into a URI. For 50 of those records the sourced string is not
 * a single number, so the resulting link cannot dial:
 *
 *   - 46 records hold TWO OR MORE numbers separated by `;`, the separator OpenStreetMap
 *     uses for multi-valued tags. `;` is the parameter separator in a `tel:` URI
 *     (RFC 3966 §3), so everything after the first number is read as URI parameters.
 *     Measured on the live page for /clinics/western-cape/citrusdal-hospital-citrusdal:
 *
 *       href="tel:+27 22 921 2153; +27 22 921 2154; +27 22 921 2155"
 *
 *     Citrusdal Hospital publishes three switchboard lines and the page offers a link
 *     that dials none of them reliably.
 *   - 4 records hold a number plus an extension in the OSM `x` form — Gansbaai Clinic
 *     `+27 28 814 3530 x3535`, Montagu Hospital `x8100`, Prince Albert Hospital `x1301`,
 *     Clanwilliam Hospital `x07`. `x3535` is not dialable digits.
 *
 * The same string was also emitted as schema.org `telephone` on all three language
 * routes, so the multi-number form went to search engines as one number too.
 *
 * WHAT THIS CHANGES, AND WHAT IT DELIBERATELY DOES NOT
 * ----------------------------------------------------
 * Nothing in facilities.json is edited and no sourced value changes. What changes is a
 * rendering: the sourced string is SEGMENTED at its own separator and each segment gets
 * its own link, and the `href` is built from the segment's digits rather than from its
 * punctuation. The text a reader SEES is the sourced text, unchanged — including the
 * `x3535`, which is the hospital's own extension and is information the reader needs
 * once the switchboard answers.
 *
 * The extension is deliberately NOT put in the href as RFC 3966 `;ext=`. Handset support
 * for `;ext=` is inconsistent, and a link that dials the switchboard every time beats one
 * that carries the extension on some phones and fails on others. The extension stays
 * visible in the link text.
 *
 * It does not itself repair numbers whose DIGITS are wrong. Three records held a
 * subscriber part of the wrong length — `pietertjie-de-beer-clinic-eastern-cape` `+27-42-555-13221` (ten
 * digits where South African numbers have nine), `rynpark-1-frailcare-rynfield-benoni`
 * `+27 11747705` (eight), `comprehensive-health-care-parow-valley-cape-town`
 * `+27 21 9320 6038` (ten). There is no way to tell which digit was mistyped without a
 * second source, and inventing one would publish a stranger's telephone number on a
 * health directory.
 *
 * #1510 closed those three (2026-09-02). Parow Valley was RE-SOURCED — OSM had already
 * corrected it to `+27 21 933 4545` and we had not re-pulled — and the other two are
 * WITHHELD from every rendered surface by `phone-defect.ts`, which carries the OSM
 * evidence for each. `renderablePhones()` and `telephoneSchema()` at the foot of this
 * file are the single point all three language templates call, so the adjudication
 * cannot be applied in two locales and forgotten in the third.
 */

import { phoneWithheldReason } from './phone-defect';

export interface ParsedPhone {
  /** Exactly as sourced (trimmed), including any extension. This is what a reader sees. */
  display: string;
  /** Dialable `tel:` target: a leading `+` if the source had one, then digits only. */
  href: string;
}

/** Strip an OSM-style extension suffix (` x3535`, ` ext 3535`, ` ext. 3535`). */
function withoutExtension(part: string): string {
  return part.replace(/\s*(?:x|ext\.?|extension)\s*\d+\s*$/i, '');
}

/**
 * Segment a sourced `contact.phone` value into individually dialable numbers.
 *
 * Returns `[]` for an empty value, and skips any segment with no digits at all rather
 * than emitting a link to `tel:`.
 */
export function parsePhones(raw: string): ParsedPhone[] {
  if (!raw) return [];
  return raw
    .split(';')
    .map(part => part.trim())
    .filter(Boolean)
    .map(part => {
      const dialable = withoutExtension(part);
      const digits = dialable.replace(/\D/g, '');
      if (!digits) return null;
      return { display: part, href: `${dialable.trimStart().startsWith('+') ? '+' : ''}${digits}` };
    })
    .filter((p): p is ParsedPhone => p !== null);
}

/**
 * The value for schema.org `telephone`. A single number stays a string; several become
 * an array, which is what schema.org expects for a repeated property — never one string
 * holding three numbers.
 */
export function telephoneSchemaValue(raw: string): string | string[] | undefined {
  const parsed = parsePhones(raw);
  if (parsed.length === 0) return undefined;
  if (parsed.length === 1) return parsed[0].href;
  return parsed.map(p => p.href);
}

/**
 * The phone numbers a facility PAGE may render, in every locale.
 *
 * #1510 — the three language templates each read `facility.contact.phone` and called
 * `parsePhones` on it directly, which is three chances to apply an adjudication in two
 * languages and forget the third. That is the drift `tools/numeric-parity-check.py`
 * exists to catch, and the #1381 remedy is the same one applied here: put the filter at
 * the ONE function all three templates call, so parity holds by construction rather than
 * by everyone remembering.
 *
 * Returns `[]` for a record whose number is withheld in `phone-defect.ts` — no link, no
 * visible number. The sourced value in `facilities.json` is untouched.
 */
export function renderablePhones(facility: { slug: string; contact: { phone: string } }): ParsedPhone[] {
  if (phoneWithheldReason(facility.slug)) return [];
  return parsePhones(facility.contact.phone);
}

/**
 * The schema.org `telephone` value for a facility page, or `undefined` when there is
 * nothing publishable. Withholding has to reach the structured data too: a number we
 * decline to show a reader is not one we should hand to a search engine, which would
 * republish it in a knowledge panel where we cannot correct it.
 */
export function telephoneSchema(facility: { slug: string; contact: { phone: string } }): string | string[] | undefined {
  if (phoneWithheldReason(facility.slug)) return undefined;
  return telephoneSchemaValue(facility.contact.phone);
}
