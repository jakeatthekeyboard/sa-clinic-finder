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
   * The footer legal strip. These are LABELS for pages that exist in every locale
   * (`/about`, `/contact`, `/privacy`, `/terms`, `/how-this-site-is-made` and their
   * `/xh` and `/zu` siblings are all built), so the label and the href move together —
   * see src/layouts/Base.astro, where each href resolves through `localeHref`.
   *
   * Each non-English label is the string the TARGET PAGE already uses for itself (its
   * own <h1> or <title>), not a fresh translation: a footer link that disagrees with
   * the heading it lands on is worse than no link. Keep them DIGIT-FREE — they render
   * on all 3,360 built pages and tools/numeric-parity-check.py compares the numeral
   * multiset of a page against its English sibling.
   */
  footerAbout: string;
  footerContact: string;
  footerPrivacy: string;
  footerTerms: string;
  footerHowMade: string;
  /** AI disclosure sentence and the link that closes it. */
  footerAiDisclosure: string;
  footerAiDisclosureLink: string;
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
    footerAbout: 'About',
    footerContact: 'Contact',
    footerPrivacy: 'Privacy',
    footerTerms: 'Terms',
    footerHowMade: 'How This Site Is Made',
    footerAiDisclosure:
      'AI disclosure: text on this page is AI-generated and published under human editorial review.',
    footerAiDisclosureLink: 'How this site is made',
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
  xh: {
    brand: 'Clinic Finder SA',
    navProvinces: 'Amaphondo',
    navServices: 'Iinkonzo',
    navSearch: 'Khangela',
    navGuides: 'Izikhokelo',
    switcherLabel: 'Ulwimi',
    footerTagline:
      'Clinic Finder SA — Uluhlu lwasimahla lwamaziko empilo karhulumente aseMzantsi Afrika.',
    footerSource:
      'Idatha ithathwe kwa-OpenStreetMap nakwa-HOTOSM. Ihlaziywe okokugqibela ngo-Aprili 2026. Ayilophepha likarhulumente elisemthethweni.',
    footerNotAdvice:
      'Olu luluhlu lwamaziko, asilocebiso lezonyango. Iinkonzo, imithi ekhoyo namaxesha okuvula ziyahluka kwiziko ngeziko nangosuku ngosuku — nceda ufowune kuqala uqinisekise phambi kokuba uhambe, uze uthethe nomsebenzi wezempilo malunga nonyango.',
    footerCorrections: 'Ukuba inkcazelo ayichanekanga,',
    footerCorrectionsLink: 'sazise',
    // Each label is the isiXhosa page's own title: src/pages/xh/about.astro
    // ("Malunga Nathi"), contact ("Qhagamshelana Nathi"), privacy
    // ("Umgaqo-nkqubo Wabucala"), terms ("Imiqathango Yokusebenzisa") and
    // how-this-site-is-made ("Indlela Eyakhiwe Ngayo Le Sayithi").
    footerAbout: 'Malunga Nathi',
    footerContact: 'Qhagamshelana Nathi',
    footerPrivacy: 'Umgaqo-nkqubo Wabucala',
    footerTerms: 'Imiqathango Yokusebenzisa',
    footerHowMade: 'Indlela Eyakhiwe Ngayo Le Sayithi',
    // Phrasing taken from src/pages/xh/how-this-site-is-made.astro, which already
    // says "ubhalwe yi-AI waza wajongwa ngumntu" of this site's explanatory text.
    footerAiDisclosure:
      'Isaziso se-AI: umbhalo okweli phepha ubhalwe yi-AI waza wajongwa ngumntu ngaphambi kokuba upapashwe.',
    footerAiDisclosureLink: 'Indlela eyakhiwe ngayo le sayithi',
    disclaimerHeading: 'Malunga nolu guqulelo',
    disclaimerMachine:
      'Eli phepha liguqulelwe ngumatshini. ALIKHANGELWANGA ngumntu othetha isiXhosa njengolwimi lwakhe lweenkobe.',
    disclaimerSpelling:
      'Upelo namagama asetyenzisiweyo asenokuba aphosakele okanye angangqinelani. Apho kungekho gama lesiXhosa elimiselweyo lentetho yezonyango, igama lesiNgesi lishiywe phakathi kwezibiyeli.',
    disclaimerAuthoritative: 'Iphepha lesiNgesi lelona lichanekileyo.',
    disclaimerClinical:
      'Musa ukuthatha isigqibo ngonyango usekele kweli phepha. Qinisekisa nomsebenzi wezempilo ekliniki.',
    disclaimerReadEnglish: 'Funda eli phepha ngesiNgesi',
  },
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
    // Each label is the isiZulu page's own title: src/pages/zu/about.astro
    // ("Mayelana Nathi"), contact ("Xhumana Nathi"), privacy
    // ("Inqubomgomo Yobumfihlo"), terms ("Imigomo Yokusebenzisa") and
    // how-this-site-is-made ("Yakhiwe Kanjani Le Sayithi").
    footerAbout: 'Mayelana Nathi',
    footerContact: 'Xhumana Nathi',
    footerPrivacy: 'Inqubomgomo Yobumfihlo',
    footerTerms: 'Imigomo Yokusebenzisa',
    footerHowMade: 'Yakhiwe Kanjani Le Sayithi',
    // Phrasing taken from src/pages/zu/how-this-site-is-made.astro, which already
    // says "ubhalwa yi-AI bese ubuyekezwa umuntu" of this site's explanatory text.
    footerAiDisclosure:
      'Isaziso se-AI: umbhalo okuleli khasi ubhalwe yi-AI wabuyekezwa umuntu ngaphambi kokushicilelwa.',
    footerAiDisclosureLink: 'Yakhiwe kanjani le sayithi',
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
