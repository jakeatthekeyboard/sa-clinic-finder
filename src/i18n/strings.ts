import type { Locale } from './config';

/**
 * Site chrome strings — nav, footer, switcher, disclaimer.
 *
 * `null` means "not translated yet", NOT "same as English". The distinction matters:
 * a translation agent fills these in, and `tests/i18n-integrity.test.ts` fails if a
 * locale ships pages while any of its chrome strings is still null. Falling back to
 * English silently would leave a half-English page that looks finished.
 */
export interface ChromeStrings {
  brand: string;
  navProvinces: string;
  navServices: string;
  navSearch: string;
  navGuides: string;
  switcherLabel: string;
  footerTagline: string;
  footerSource: string;
  footerNotAdvice: string;
  footerCorrections: string;
  footerCorrectionsLink: string;
  /**
   * Translation disclaimer, rendered above the fold on every non-English page.
   * See src/components/TranslationDisclaimer.astro for why each clause is required.
   */
  disclaimerHeading: string;
  disclaimerMachine: string;
  disclaimerSpelling: string;
  disclaimerAuthoritative: string;
  disclaimerClinical: string;
  disclaimerReadEnglish: string;
}

export const STRINGS: Record<Locale, ChromeStrings | null> = {
  en: {
    brand: 'Clinic Finder SA',
    navProvinces: 'Provinces',
    navServices: 'Services',
    navSearch: 'Search',
    navGuides: 'Guides',
    switcherLabel: 'Language',
    footerTagline: "Clinic Finder SA — Free directory of South Africa's public health facilities.",
    footerSource:
      'Data sourced from OpenStreetMap and HOTOSM. Last updated April 2026. Not an official government site.',
    footerNotAdvice:
      'This is a directory, not medical advice. Services, stock and operating hours vary by facility and by day — please phone ahead to confirm before travelling, and speak to a healthcare professional about treatment.',
    footerCorrections: 'If information is incorrect,',
    footerCorrectionsLink: 'let us know',
    disclaimerHeading: 'About this translation',
    disclaimerMachine:
      'This page was translated by machine. It has NOT been checked by a first-language speaker.',
    disclaimerSpelling:
      'Spelling and wording may be wrong or inconsistent. Where there is no settled term for a medical word, the English word is kept in brackets.',
    disclaimerAuthoritative: 'The English page is the correct version.',
    disclaimerClinical:
      'Do not make a treatment decision from this page. Confirm with a health worker at the clinic.',
    disclaimerReadEnglish: 'Read this page in English',
  },
  xh: null,
  zu: null,
};

/** Chrome strings for `locale`, falling back to English where a locale is unfinished. */
export function strings(locale: Locale): ChromeStrings {
  return STRINGS[locale] ?? (STRINGS.en as ChromeStrings);
}
