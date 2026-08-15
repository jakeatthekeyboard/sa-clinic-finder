import type { Locale } from './config';
import { provinceSlug, SERVICE_MAP, facilities } from '../data/helpers';

/**
 * Which pages exist in each locale.
 *
 * Load-bearing in three directions, and never a wish:
 *
 *  1. hreflang — advertising `/xh/...` for a page that 404s makes Google drop the
 *     whole alternates cluster and lands a reader on an error on a health site.
 *  2. The language switcher — it renders on every page in every locale, and shows an
 *     untranslated locale MUTED rather than as a dead link.
 *  3. getStaticPaths on the locale routes — a locale emits a page only once its
 *     content for that page is actually translated. This is what stops a half-English
 *     page shipping under a disclaimer that claims it was translated.
 *
 * FAMILIES, not a path list. The site has ~1,000 facility pages generated from
 * facility metadata plus the facility-type editorial and the shared UI strings — so a
 * locale earns the whole facility family at once, when those shared sources are
 * translated, not one entry per facility. Enumerating 1,000 paths per locale by hand
 * would rot the moment a facility is added to the OSM extract.
 *
 * `tests/i18n-integrity.test.ts` fails the build if anything declared here has no
 * built page, so the manifest cannot drift ahead of reality.
 */

export interface LocaleCoverage {
  /** Exact canonical English paths: static pages, guides, index pages. */
  paths: string[];
  /** Province names (not slugs) whose PROVINCE_EDITORIAL is translated. */
  provinces: string[];
  /** Service keys (SERVICE_MAP keys) whose SERVICE_EDITORIAL is translated. */
  services: string[];
  /**
   * True once the facility-type editorial, the generated facility editorial and the
   * facility-page UI strings are all translated. Unlocks the whole /clinics/<p>/<slug>
   * family for this locale — see the note above on why this is a flag, not a list.
   */
  facilities: boolean;
}

export const COVERAGE: Record<Exclude<Locale, 'en'>, LocaleCoverage> = {
  xh: {
    paths: [
      '/',
      '/guides',
      '/guides/ccmdd-chronic-meds-pickup',
      '/guides/child-immunisation-schedule',
      '/guides/chronic-medication-management',
      '/guides/dental-care-public-clinics',
      '/guides/family-planning-contraception',
      '/guides/find-nearest-clinic',
      '/guides/free-maternity-care',
      '/guides/hiv-testing-guide',
      '/guides/hospital-referral-system',
      '/guides/how-to-get-arvs',
      '/guides/medical-emergency-guide',
      '/guides/mental-health-services',
      '/guides/tb-treatment-what-to-expect',
      '/clinics',
      '/services',
    ],
    // All 9. PROVINCE_EDITORIAL is translated in full in
    // src/data/i18n/province-editorial.xh.ts, so every province page may ship.
    // NAMES, not slugs — these are the data join key (see provinceSlug below).
    provinces: [
      'Eastern Cape',
      'Free State',
      'Gauteng',
      'KwaZulu-Natal',
      'Limpopo',
      'Mpumalanga',
      'North West',
      'Northern Cape',
      'Western Cape',
    ],
    services: [],
    facilities: false,
  },
  zu: {
    paths: [
      '/',
      '/guides',
      '/guides/ccmdd-chronic-meds-pickup',
      '/guides/child-immunisation-schedule',
      '/guides/chronic-medication-management',
      '/guides/dental-care-public-clinics',
      '/guides/family-planning-contraception',
      '/guides/find-nearest-clinic',
      '/guides/free-maternity-care',
      '/guides/hiv-testing-guide',
      '/guides/hospital-referral-system',
      '/guides/how-to-get-arvs',
      '/guides/medical-emergency-guide',
      '/guides/mental-health-services',
      '/guides/tb-treatment-what-to-expect',
      '/clinics',
      '/services',
    ],
    provinces: [
      'Eastern Cape',
      'Free State',
      'Gauteng',
      'KwaZulu-Natal',
      'Limpopo',
      'Mpumalanga',
      'North West',
      'Northern Cape',
      'Western Cape',
    ],
    services: [],
    facilities: false,
  },
};

const FACILITY_PATHS = new Set(
  facilities.map((f: any) => `/clinics/${provinceSlug(f.province)}/${f.slug}`)
);

const SERVICE_PATH_TO_KEY = new Map<string, string>(
  Object.entries(SERVICE_MAP).map(([key, svc]: [string, any]) => [`/services/${svc.slug}`, key])
);

/** Does `basePath` (a canonical English path) have a translation in `locale`? */
export function hasTranslation(basePath: string, locale: Locale): boolean {
  if (locale === 'en') return true;
  const cov = COVERAGE[locale as Exclude<Locale, 'en'>];
  if (!cov) return false;

  if (cov.paths.includes(basePath)) return true;

  const serviceKey = SERVICE_PATH_TO_KEY.get(basePath);
  if (serviceKey) return cov.services.includes(serviceKey);

  if (FACILITY_PATHS.has(basePath)) return cov.facilities;

  const provinceMatch = basePath.match(/^\/clinics\/([^/]+)$/);
  if (provinceMatch) {
    return cov.provinces.some((p) => provinceSlug(p) === provinceMatch[1]);
  }

  return false;
}

/** Locales this page is available in, always including English. */
export function availableLocales(basePath: string): Locale[] {
  return (['en', 'xh', 'zu'] as Locale[]).filter((l) => hasTranslation(basePath, l));
}

/** Province names this locale may emit pages for. */
export function translatedProvinces(locale: Locale): string[] {
  if (locale === 'en') return [];
  return COVERAGE[locale as Exclude<Locale, 'en'>]?.provinces ?? [];
}

/** Service keys this locale may emit pages for. */
export function translatedServices(locale: Locale): string[] {
  if (locale === 'en') return [];
  return COVERAGE[locale as Exclude<Locale, 'en'>]?.services ?? [];
}

/** May this locale emit the ~1,000 facility detail pages yet? */
export function facilitiesTranslated(locale: Locale): boolean {
  if (locale === 'en') return true;
  return COVERAGE[locale as Exclude<Locale, 'en'>]?.facilities ?? false;
}
