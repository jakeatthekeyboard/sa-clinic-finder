/**
 * i18n configuration for ClinicFinder.
 *
 * Pathing decision (2026-08-15): PATH PREFIX, English un-prefixed.
 *
 *   English (canonical)      isiXhosa                    isiZulu
 *   /                        /xh                         /zu
 *   /guides/how-to-get-arvs  /xh/guides/how-to-get-arvs  /zu/guides/how-to-get-arvs
 *
 * English keeps its existing URLs. CF earns ~1,099 clicks/28d on autopilot and a
 * sitewide 301 to /en/ would put that at risk for a symmetry that buys nothing.
 * Translated pages mirror the English slug 1:1 — the slug is the join key for the
 * language switcher, hreflang pairing and the disclaimer's link home, so translating
 * slugs would break all three at once with no first-language reviewer to check them.
 */

export type Locale = 'en' | 'xh' | 'zu';

export const DEFAULT_LOCALE: Locale = 'en';

export interface LocaleMeta {
  /** BCP-47 tag for hreflang and <html lang>. */
  tag: string;
  /** Endonym — what speakers call the language. Shown in the switcher. */
  label: string;
  /** URL segment. Empty for the default locale, which is un-prefixed. */
  prefix: string;
}

export const LOCALES: Record<Locale, LocaleMeta> = {
  en: { tag: 'en-ZA', label: 'English', prefix: '' },
  xh: { tag: 'xh-ZA', label: 'isiXhosa', prefix: '/xh' },
  zu: { tag: 'zu-ZA', label: 'isiZulu', prefix: '/zu' },
};

export const LOCALE_CODES = Object.keys(LOCALES) as Locale[];

/** Ordered longest-prefix-first so /xh is matched before ''. */
const PREFIXED = LOCALE_CODES.filter((c) => LOCALES[c].prefix !== '');

/**
 * Strip a locale prefix off a path, returning the canonical English path.
 * `/xh/guides/how-to-get-arvs` -> `/guides/how-to-get-arvs`
 * `/xh`                        -> `/`
 */
export function stripLocale(path: string): string {
  for (const code of PREFIXED) {
    const prefix = LOCALES[code].prefix;
    if (path === prefix) return '/';
    if (path.startsWith(prefix + '/')) return path.slice(prefix.length);
  }
  return path;
}

/** Which locale a path belongs to, read from its prefix. */
export function localeOf(path: string): Locale {
  for (const code of PREFIXED) {
    const prefix = LOCALES[code].prefix;
    if (path === prefix || path.startsWith(prefix + '/')) return code;
  }
  return DEFAULT_LOCALE;
}

/**
 * Build the path for `basePath` (a canonical English path) in `locale`.
 * `localePath('/guides', 'xh')` -> `/xh/guides`
 * `localePath('/', 'xh')`       -> `/xh`
 */
export function localePath(basePath: string, locale: Locale): string {
  const base = stripLocale(basePath);
  const prefix = LOCALES[locale].prefix;
  if (base === '/') return prefix || '/';
  return prefix + base;
}
