import type { Locale } from './config';

/**
 * Which pages actually EXIST in each locale, keyed by canonical English path.
 *
 * This manifest is load-bearing in two directions and must never be a wish:
 *
 *  1. hreflang. Advertising `xh-ZA -> /xh/guides/hiv-testing-guide` for a page that
 *     404s is worse than advertising nothing — Google drops the whole alternates
 *     cluster and the reader lands on an error on a health site.
 *  2. The language switcher. A switcher that always links to the translated path
 *     sends readers to 404s for every page not yet done; one that always links home
 *     loses their place. It reads this manifest and degrades to the English page
 *     (marked "English") only where no translation exists.
 *
 * A translation agent adds its paths HERE in the same commit that adds the pages.
 * `tests/i18n-integrity.test.ts` fails the build if a listed path has no built page,
 * so the manifest cannot drift ahead of reality.
 */
export const TRANSLATED: Record<Exclude<Locale, 'en'>, string[]> = {
  xh: [],
  zu: [],
};

const SETS: Record<string, Set<string>> = Object.fromEntries(
  Object.entries(TRANSLATED).map(([code, paths]) => [code, new Set(paths)])
);

/** Does `basePath` (canonical English path) have a translation in `locale`? */
export function hasTranslation(basePath: string, locale: Locale): boolean {
  if (locale === 'en') return true;
  return SETS[locale]?.has(basePath) ?? false;
}

/** Locales this page is available in, always including English. */
export function availableLocales(basePath: string): Locale[] {
  return (['en', 'xh', 'zu'] as Locale[]).filter((l) => hasTranslation(basePath, l));
}
