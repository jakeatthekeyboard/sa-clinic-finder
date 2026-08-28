/**
 * administrative-name.xh-zu.ts — the isiXhosa and isiZulu renderings of the #1481
 * "this heading is a ward reference, not a name" notice.
 *
 * WHY THIS FILE EXISTS, AND WHY IN THE SAME COMMIT AS THE ENGLISH
 * ---------------------------------------------------------------
 * The reason `care-role.xh-zu.ts` and `unnamed.xh-zu.ts` both exist, and the reason
 * #1367 had to be filed at all: the English facility page carried the correction and
 * `/xh/...` and `/zu/...` for the SAME record carried none, so a reader in either of
 * those languages was shown a confident page about a facility called "Tswane ward 40"
 * with nothing anywhere on it saying that is not a name. Measured then: the notice on
 * 6 of 6 English pages and 0 of 6 in each other locale, with no English fallback. That
 * gap is not repeated here — the three locales ship together or not at all, and
 * `tests/administrative-name-i18n.test.ts` fails the pre-push hook if a record is added
 * to `ADMINISTRATIVE_NAMES` without both renderings.
 *
 * WHAT IT MUST NOT SAY
 * --------------------
 * Not the `unnamed.ts` sentence. That notice says we do not know whether the public can
 * walk in, which would be FALSE here: this is a surveyed, operational, dispensing public
 * clinic. The only thing we do not know is what it is called.
 *
 * NO NUMERALS, for the mechanical reason the sibling files give: a digit present on one
 * route and not another is a numeric difference between the three pages and fails
 * `tools/numeric-parity-check.py`, a guard that exists to catch a dropped clinical
 * figure and must not be spent on a ward number. The ward number is in the record's
 * `name`, which renders identically on all three routes, so it is parity-neutral there
 * and must not be repeated in the notice.
 *
 * TERMINOLOGY — followed, not invented. Every domain word here is one the site already
 * renders: xh iziko / ikliniki / igama / umthombo wethu / irekhodi / iikliniki
 * nezibhedlele zikarhulumente; zu isikhungo / umtholampilo / igama / umthombo wethu /
 * irekhodi / imitholampilo nezibhedlela zikahulumeni. "Masipala" (municipality) is the
 * standard term in both languages.
 */

export interface AdministrativeNameChrome {
  /** Heading of the notice. Mirrors "This heading is a ward number, not a name". */
  heading: string;
  /** The chip beside the <h1>. Mirrors English "Name not recorded". */
  chip: string;
  /** Text before the province link. Mirrors "Before travelling, see the ". */
  seeBefore: string;
  /** The province link's own text, given the English province name. */
  linkText: (province: string) => string;
}

export const ADMIN_NAME_CHROME_EN: AdministrativeNameChrome = {
  heading: 'This heading is a ward reference, not the facility\'s name',
  chip: 'Name not recorded',
  seeBefore: 'This is a real clinic. To find it and other facilities near you, see the ',
  linkText: (province: string) => `public clinics and hospitals in ${province}`,
};

export const ADMIN_NAME_CHROME_XH: AdministrativeNameChrome = {
  heading: 'Esi sihloko sisalathiso sewadi, asilogama leli ziko',
  chip: 'Igama alaziwa',
  // The pairing "jonga " + "iikliniki nezibhedlele zikarhulumente e-…" is the one
  // CARE_ROLE_CHROME_XH and UNNAMED_CHROME_XH already render, reused rather than
  // re-worded — a reader moving between these notices meets the same phrase.
  seeBefore: 'Le yikliniki yokwenene. Ukuyifumana kunye namanye amaziko akufuphi nawe, jonga ',
  linkText: (province: string) => `iikliniki nezibhedlele zikarhulumente e-${province}`,
};

export const ADMIN_NAME_CHROME_ZU: AdministrativeNameChrome = {
  heading: 'Lesi sihloko siyinkomba yewadi, akulona igama lesikhungo',
  chip: 'Igama alaziwa',
  seeBefore: 'Lona ngumtholampilo wangempela. Ukuwuthola kanye nezinye izikhungo eziseduze nawe, bheka ',
  linkText: (province: string) => `imitholampilo nezibhedlela zikahulumeni e-${province}`,
};

/** isiXhosa rendering of each `ADMINISTRATIVE_NAMES[slug].what`. */
export const ADMIN_NAME_WHAT_XH: Record<string, string> = {
  'tswane-ward-40-tswane':
    'Isihloko esiphezulu kweli phepha sisalathiso sewadi kamasipala waseTshwane, asilogama lekliniki, kwaye ' +
    'igama elithi "Tswane" likwabhalwe gwenxa — kufuneka libe nguTshwane. Le yikliniki yokwenene ' +
    'karhulumente esebenzayo — inikezela ngamayeza, ifikeleleka kwabasebenzisa isitulo esinamavili, kwaye ' +
    'inejeneretha yayo namanzi ayo — kodwa asikwazanga ukufumanisa ukuba ibizwa ngantoni. Ngoko sikubonisa ' +
    'oko kurekhodwe ngumthombo wethu, endaweni yegama esiliqambileyo.',
};

/** isiZulu rendering of each `ADMINISTRATIVE_NAMES[slug].what`. */
export const ADMIN_NAME_WHAT_ZU: Record<string, string> = {
  'tswane-ward-40-tswane':
    'Isihloko esiphezulu kuleli khasi siyinkomba yewadi kamasipala waseTshwane, akulona igama lomtholampilo, ' +
    'futhi igama elithi "Tswane" libhalwe ngokungeyikho — kufanele kube nguTshwane. Lona ngumtholampilo ' +
    'wangempela kahulumeni osebenzayo — ukhipha imithi, ufinyeleleka kwabasebenzisa isihlalo esinamasondo, ' +
    'futhi unejeneretha yawo namanzi awo — kodwa asikwazanga ukuthola ukuthi ubizwa ngani. Ngakho sikukhombisa ' +
    'lokho okuqoshwe umthombo wethu, esikhundleni segama esiliqambile.',
};

export function adminNameWhatXh(slug: string): string | null {
  return ADMIN_NAME_WHAT_XH[slug] ?? null;
}

export function adminNameWhatZu(slug: string): string | null {
  return ADMIN_NAME_WHAT_ZU[slug] ?? null;
}
