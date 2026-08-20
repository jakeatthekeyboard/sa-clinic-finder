/**
 * emergency-basis.ts — is a facility's 24-hour emergency listing a RECORD or an
 * INFERENCE? (#1349)
 *
 * `services.emergency_24h` renders in five places: the service chip, the page
 * title's service list, the meta description, the MedicalClinic schema's
 * medicalSpecialty, and the /services/emergency listing. A reader acts on it at
 * 2am when choosing which facility to travel to, so the page owes them the
 * difference between "OpenStreetMap records an emergency department here" and
 * "South African district hospitals run casualty around the clock, and this is a
 * district hospital".
 *
 * Both are legitimate reasons to list a facility. Only one of them is a record.
 *
 * The split is DERIVED, not hand-maintained: tools/emergency-basis.py reads the
 * newest Overpass capture under data/capture/osm-tags/ and writes the JSON this
 * module imports, and its --check mode fails when a facility claims the service
 * with no basis entry — which is what stops the next OSM refresh from quietly
 * re-admitting an unlabelled claim.
 *
 * NOTHING HERE CHANGES A FLAG. The claim is not withdrawn and not asserted; it is
 * labelled. Withdrawing it would delete a listing that national policy supports;
 * asserting it on OSM's silence would invent a record. The one decidable class —
 * an element carrying an explicit emergency=no — is a contradiction rather than a
 * basis, is corrected in the record itself, and the generator refuses to label it.
 */
import basis from './emergency-basis.json';

export type EmergencyBasis = 'osm_confirmed' | 'unevidenced' | 'unresolvable';

const CONFIRMED = new Set(basis.osm_confirmed as string[]);
const UNEVIDENCED = new Set(basis.unevidenced as string[]);
const UNRESOLVABLE = new Set(basis.unresolvable as string[]);

/** The basis of this facility's 24-hour emergency listing, or null if it makes none. */
export function emergencyBasis(slug: string): EmergencyBasis | null {
  if (CONFIRMED.has(slug)) return 'osm_confirmed';
  if (UNEVIDENCED.has(slug)) return 'unevidenced';
  if (UNRESOLVABLE.has(slug)) return 'unresolvable';
  return null;
}

/** True when the listing rests on the facility-type inference alone. */
export function emergencyIsInferred(slug: string): boolean {
  const b = emergencyBasis(slug);
  return b === 'unevidenced' || b === 'unresolvable';
}

export const EMERGENCY_BASIS_COUNTS = basis.counts as {
  osm_confirmed: number; unevidenced: number; unresolvable: number;
};
