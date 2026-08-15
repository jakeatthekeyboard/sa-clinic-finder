/**
 * isiZulu locale variants of the SHARED label data and the link helper used by the
 * /zu routes.
 *
 * Why the labels live here and not in `src/data/helpers.ts`: `SERVICE_MAP.plain`,
 * `SERVICE_MAP.label` and `typeLabel()` are consumed by the English pages, the isiXhosa
 * pages and the JSON-LD on all three. Translating a value in place would silently
 * corrupt every other locale, so each locale adds a variant keyed on the SAME join key
 * and the shared English values are never edited.
 *
 * Slugs are deliberately NOT translated — the slug is the join key for the language
 * switcher, hreflang pairing and the disclaimer's link home (see src/i18n/config.ts).
 */
import { SERVICE_MAP, typeLabel } from '../helpers';
import { localePath } from '../../i18n/config';
import { hasTranslation } from '../../i18n/translated';

/** Facility-type labels — isiZulu variant of `typeLabel()`. */
const TYPE_LABEL_ZU: Record<string, string> = {
  clinic: 'Umtholampilo',
  district_hospital: 'Isibhedlela Sesifunda',
  community_health_centre: 'Isikhungo Sezempilo Somphakathi',
  regional_hospital: 'Isibhedlela Sesifunda Esikhulu',
  tertiary_hospital: 'Isibhedlela Esikhulu',
  central_hospital: 'Isibhedlela Esiphakathi',
  specialised_hospital: 'Isibhedlela Esikhethekile',
  mobile_clinic: 'Umtholampilo Ohambayo',
  satellite_clinic: 'Umtholampilo Oyingxenye',
};

/** isiZulu facility-type label, falling back to the shared English one. */
export function typeLabelZu(type: string): string {
  return TYPE_LABEL_ZU[type] || typeLabel(type);
}

/**
 * Service labels — isiZulu variants of `SERVICE_MAP[key].plain` / `.label`.
 * Keys mirror SERVICE_MAP exactly.
 */
const SERVICE_ZU: Record<string, { plain: string; label: string }> = {
  arv_treatment: { plain: 'I-HIV / ama-ARV', label: 'Ukwelashwa Ngama-ARV' },
  tb_treatment: { plain: 'Ukwelashwa kwe-TB', label: 'Ukwelashwa Kwe-TB' },
  maternity_antenatal: { plain: 'Ukuzala ingane', label: 'Ukubeletha' },
  chronic_medication: {
    plain: 'Imithi yesifo esingamahlalakhona',
    label: 'Imithi Yesifo Esingamahlalakhona',
  },
  emergency_24h: {
    plain: 'Iziphuthumayo zamahora angu-24',
    label: 'Iziphuthumayo Zamahora angu-24',
  },
  dental: { plain: 'Ukunakekelwa kwamazinyo', label: 'Amazinyo' },
  mental_health: { plain: 'Impilo yengqondo', label: 'Impilo Yengqondo' },
  child_health: { plain: 'Impilo yengane', label: 'Impilo Yengane' },
  family_planning: { plain: 'Ukuhlela umndeni', label: 'Ukuhlela Umndeni' },
  immunisation: { plain: 'Imijovo', label: 'Imijovo' },
  hiv_testing: { plain: 'Ukuhlolelwa i-HIV', label: 'Ukuhlolelwa I-HIV' },
};

/** Plain-language isiZulu service name, falling back to the shared English one. */
export function servicePlainZu(key: string): string {
  return SERVICE_ZU[key]?.plain || SERVICE_MAP[key]?.plain || key;
}

/** Formal isiZulu service label, falling back to the shared English one. */
export function serviceLabelZu(key: string): string {
  return SERVICE_ZU[key]?.label || SERVICE_MAP[key]?.label || key;
}

/**
 * Guide titles in isiZulu, keyed on the guide slug. Taken verbatim from
 * src/pages/zu/guides/index.astro so a guide is named the same wherever it is linked.
 */
export const GUIDE_TITLE_ZU: Record<string, string> = {
  'find-nearest-clinic': 'Ungawuthola Kanjani Umtholampilo Oseduze Nawe',
  'how-to-get-arvs': 'Ungawathola Kanjani Ama-ARV Emtholampilo Womphakathi',
  'tb-treatment-what-to-expect': 'Ukwelashwa Kwe-TB — Okufanele Ukulindele',
  'free-maternity-care': 'Ukunakekelwa Kokubeletha Mahhala Ezibhedlela Zomphakathi',
  'ccmdd-chronic-meds-pickup':
    'I-CCMDD — Ukulanda Imithi Yesifo Esingamahlalakhona Ngaphandle Komugqa',
  'mental-health-services': 'Izinsizakalo Zempilo Yengqondo Emitholampilo Yomphakathi',
  'child-immunisation-schedule': 'Ishejuli Yemijovo Yezingane (ENingizimu Afrika)',
  'medical-emergency-guide': 'Okufanele Ukwenze Esimweni Esiphuthumayo Sezempilo',
  'hospital-referral-system': 'Ukusebenza Kokuthunyelwa Esibhedlela ENingizimu Afrika',
  'family-planning-contraception': 'Ukuhlela Umndeni Nezindlela Zokuvimbela Ukukhulelwa',
  'dental-care-public-clinics': 'Ukunakekelwa Kwamazinyo Emitholampilo Yomphakathi',
  'hiv-testing-guide': 'Ukuhlolela I-HIV — Kuphi, Kanjani & Okufanele Ukulindele',
  'chronic-medication-management': 'Imithi Yesifo Esingamahlalakhona Emitholampilo Yomphakathi',
};

/** isiZulu title for a guide slug, falling back to the slug's English title if unknown. */
export function guideTitleZu(slug: string, fallback: string): string {
  return GUIDE_TITLE_ZU[slug] || fallback;
}

/**
 * Href for a canonical English path, in isiZulu WHERE THAT PAGE EXISTS.
 *
 * The coverage gate is the point: `/zu` must never link to a page it has not built.
 * Until a family is translated the link degrades to the English page — a working page
 * in the wrong language — rather than a 404. Once COVERAGE.zu declares the family the
 * same call starts returning the /zu path, with no edit to any page.
 */
export function zuHref(path: string): string {
  return hasTranslation(path, 'zu') ? localePath(path, 'zu') : path;
}

/**
 * Rewrite every root-relative href in an editorial HTML string through `zuHref`.
 *
 * The editorial data files carry the ENGLISH paths verbatim (`href="/guides/…"`), which
 * keeps the isiZulu prose files a pure translation of their English originals — no
 * locale prefix is hardcoded in content, so a pathing change in src/i18n/config.ts
 * cannot leave a thousand stale links behind in prose nobody re-reads.
 */
export function zuLinks(html: string): string {
  return html.replace(/href="(\/[^"#?]*)"/g, (_m, p) => `href="${zuHref(p)}"`);
}
