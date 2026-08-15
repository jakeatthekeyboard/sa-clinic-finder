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
  zu: {
    brand: 'Clinic Finder SA',
    navProvinces: 'Izifundazwe',
    navServices: 'Izinsizakalo',
    navSearch: 'Sesha',
    navGuides: 'Imihlahlandlela',
    switcherLabel: 'Ulimi',
    footerTagline:
      'Clinic Finder SA — Uhlu lwamahhala lwezikhungo zezempilo zomphakathi zaseNingizimu Afrika.',
    footerSource:
      'Imininingwane ithathwe ku-OpenStreetMap naku-HOTOSM. Igcine ukubuyekezwa ngo-April 2026. Leli akulona iwebhusayithi esemthethweni kahulumeni.',
    footerNotAdvice:
      'Lolu uhlu lwezikhungo, akusiyo iseluleko sezokwelapha. Izinsizakalo, isitoko semithi namahora okusebenza kuyehluka ngokwesikhungo nangosuku — sicela ushayele ucingo kuqala uqinisekise ngaphambi kokuhamba, futhi ukhulume nesisebenzi sezempilo mayelana nokwelashwa.',
    footerCorrections: 'Uma imininingwane ingalungile,',
    footerCorrectionsLink: 'sazise',
    disclaimerHeading: 'Mayelana nalolu humusho',
    disclaimerMachine:
      'Leli khasi lihunyushwe umshini. ALIKAHLOLWA umuntu okuyisiZulu ulimi lwakhe lwebele.',
    disclaimerSpelling:
      'Upelo namagama angase abe ngalungile noma angafani ndawonye. Lapho kungekho igama lesiZulu elivunyelwene ngalo legama lezokwelapha, igama lesiNgisi lishiywe kubakaki.',
    disclaimerAuthoritative: 'Ikhasi lesiNgisi yilona elilungile.',
    disclaimerClinical:
      'Ungathathi isinqumo sokwelashwa ngokusekelwe kuleli khasi. Qinisekisa nesisebenzi sezempilo emtholampilo.',
    disclaimerReadEnglish: 'Funda leli khasi ngesiNgisi',
  },
};

/** Chrome strings for `locale`, falling back to English where a locale is unfinished. */
export function strings(locale: Locale): ChromeStrings {
  return STRINGS[locale] ?? (STRINGS.en as ChromeStrings);
}
