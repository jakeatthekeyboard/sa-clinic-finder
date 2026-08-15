/**
 * isiXhosa display labels for the two shared vocabularies the site renders everywhere:
 * facility types (`typeLabel`) and services (`SERVICE_MAP`).
 *
 * These are LOCALE VARIANTS, never edits. `src/data/helpers.ts` holds the English
 * values and is consumed by the English routes and by the isiZulu routes; translating
 * a label in place there would silently corrupt both. The slugs, the record keys and
 * every URL stay English — they are the join keys for the data, the sitemap and the
 * language switcher.
 *
 * The type and service wordings match those already live on /xh (see
 * src/pages/xh/clinics/index.astro and src/pages/xh/services/index.astro), so a reader
 * moving from the provinces hub to a province page sees the same word for the same thing.
 */

/** isiXhosa facility-type labels, keyed by the `type` field on a facility record. */
export const TYPE_LABEL_XH: Record<string, string> = {
  clinic: 'Ikliniki',
  district_hospital: 'Isibhedlele Sesithili',
  community_health_centre: 'Iziko Lempilo Loluntu',
  regional_hospital: 'Isibhedlele Sengingqi',
  tertiary_hospital: 'Isibhedlele Esiphakamileyo',
  central_hospital: 'Isibhedlele Esiphakathi',
  specialised_hospital: 'Isibhedlele Esikhethekileyo',
  mobile_clinic: 'Ikliniki Ehambayo',
  satellite_clinic: 'Ikliniki Esecaleni',
};

/**
 * isiXhosa equivalent of `typeLabel()` in src/data/helpers.ts. Falls back to the raw
 * type, de-underscored, exactly as the English helper does — an unmapped type must
 * still render something rather than blank.
 */
export function typeLabelXh(type: string): string {
  return TYPE_LABEL_XH[type] || type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * isiXhosa service names, keyed by SERVICE_MAP key.
 * `plain` is the reader-facing name used in chips, lists and headings.
 * `label` is the formal name used in headings and schema.org `medicalSpecialty`.
 */
export const SERVICE_LABEL_XH: Record<string, { plain: string; label: string }> = {
  arv_treatment: { plain: 'HIV / ARVs', label: 'Unyango lwe-ARV' },
  tb_treatment: { plain: 'Unyango lwe-TB', label: 'Unyango lwe-TB' },
  maternity_antenatal: { plain: 'Ukuzala umntwana', label: 'Ukubeleka' },
  chronic_medication: { plain: 'Amayeza aqhubekayo', label: 'Amayeza Aqhubekayo' },
  emergency_24h: { plain: 'Ingxaki engxamisekileyo yeeyure ezingama-24', label: 'Ungxamiseko lweeyure ezingama-24' },
  dental: { plain: 'Unyango lwamazinyo', label: 'Amazinyo' },
  mental_health: { plain: 'Impilo yengqondo', label: 'Impilo Yengqondo' },
  child_health: { plain: 'Impilo yomntwana', label: 'Impilo Yomntwana' },
  family_planning: { plain: 'Ucwangciso losapho', label: 'Ucwangciso Losapho' },
  immunisation: { plain: 'Izitofu zokugonya', label: 'Ukugonywa' },
  hiv_testing: { plain: 'Uvavanyo lwe-HIV', label: 'Uvavanyo lwe-HIV' },
};

/** The reader-facing isiXhosa name for a service key, falling back to the key itself. */
export function servicePlainXh(key: string, fallback?: string): string {
  return SERVICE_LABEL_XH[key]?.plain ?? fallback ?? key;
}

/** The formal isiXhosa name for a service key, falling back to the key itself. */
export function serviceLabelXh(key: string, fallback?: string): string {
  return SERVICE_LABEL_XH[key]?.label ?? fallback ?? key;
}
