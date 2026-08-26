/**
 * unnamed.xh-zu.ts — the isiXhosa and isiZulu renderings of the "we do not know this
 * facility's name" notice defined by `src/data/unnamed.ts`.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * The reason `care-role.xh-zu.ts` and `outside-sa.xh-zu.ts` both exist, and it is
 * written in the same commit as the English lane rather than after it. The English
 * facility page for an unnamed record would carry the correction and the isiXhosa and
 * isiZulu pages for the SAME record would not, so a reader in either of those
 * languages would be shown a confident description of a facility called "health care"
 * with nothing anywhere on the page saying that is not its name.
 *
 * Unlike the two files above, this notice is NOT keyed by slug and needs no per-record
 * translation: it says the same thing on every page it appears on, and the only
 * variable in it is the province name, which stays as the record renders it. So there
 * is nothing here that can fall out of step with a growing set, and no coverage test
 * is needed to prove it has not.
 *
 * NO NUMERALS, for the mechanical reason the sibling files give: a digit on one route
 * and not another is a numeric difference between the three pages and fails
 * `tools/numeric-parity-check.py`.
 *
 * TERMINOLOGY — followed, not invented. Every domain word here is one the site already
 * renders: xh iziko / igama / umthombo wethu / irekhodi / iikliniki nezibhedlele
 * zikarhulumente; zu isikhungo / igama / umthombo wethu / irekhodi / imitholampilo
 * nezibhedlela zikahulumeni.
 */

export interface UnnamedChrome {
  /** Heading of the notice. Mirrors "We do not know this facility's name". */
  heading: string;
  /** The chip beside the <h1>. Mirrors English "Name not recorded". */
  chip: string;
  /** First paragraph: the heading at the top of the page is not a name. */
  body: string;
  /** Second paragraph, up to the province link. */
  seeBefore: string;
  /** The province link's own text, given the English province name. */
  linkText: (province: string) => string;
}

export const UNNAMED_CHROME_EN: UnnamedChrome = {
  heading: "We do not know this facility's name",
  chip: 'Name not recorded',
  body:
    'The heading at the top of this page is not a name. OpenStreetMap, our source, records a health facility at ' +
    'this location but leaves the name field holding a general word for a health facility, and that general word ' +
    'is what you are seeing. We have not confirmed what this place is called, who runs it, or whether the public ' +
    'can walk in. Everything else on this page comes from the same record and describes a facility we cannot ' +
    'identify by name.',
  seeBefore: 'Before travelling, find a facility you can ask for by name among the ',
  linkText: (province: string) => `public clinics and hospitals in ${province}`,
};

export const UNNAMED_CHROME_XH: UnnamedChrome = {
  heading: 'Asilazi igama leli ziko',
  chip: 'Igama alaziwa',
  body:
    'Isihloko esiphezulu kweli phepha asilogama. Umthombo wethu, i-OpenStreetMap, urekhoda iziko lezempilo kule ' +
    'ndawo kodwa ushiya indawo yegama inegama eliqhelekileyo leziko lezempilo, kwaye lelo gama liqhelekileyo lelo ' +
    'ulibonayo. Asiqinisekisanga ukuba le ndawo ibizwa ngantoni, ilawulwa ngubani, okanye uwonke-wonke uyakwazi na ' +
    'ukungena. Konke okunye okukweli phepha kuvela kwirekhodi enye kwaye kuchaza iziko esingakwaziyo ukulichonga ' +
    'ngegama.',
  // "jonga " + "iikliniki nezibhedlele zikarhulumente e-…" is the exact pairing
  // OUTSIDE_SA_CHROME_XH already renders, reused rather than re-worded. The English
  // lane's "you can ask for by name" clause is dropped here deliberately: rendering it
  // needs a locative concord on the link text, and a concord bolted onto a
  // string-concatenated link reads as "kwi ikliniki". Proven copy beats a nuance.
  seeBefore: 'Phambi kokuba uhambe, jonga ',
  linkText: (province: string) => `iikliniki nezibhedlele zikarhulumente e-${province}`,
};

export const UNNAMED_CHROME_ZU: UnnamedChrome = {
  heading: 'Asilazi igama lalesi sikhungo',
  chip: 'Igama alaziwa',
  body:
    'Isihloko esiphezulu kuleli khasi akulona igama. Umthombo wethu, i-OpenStreetMap, uqopha isikhungo sezempilo ' +
    'kule ndawo kodwa ushiya inkambu yegama inegama elivamile lesikhungo sezempilo, futhi lelo gama elivamile ' +
    'yilona olibonayo. Asiqinisekisanga ukuthi le ndawo ibizwa ngani, iphathwa ubani, noma umphakathi ungangena ' +
    'yini. Konke okunye kuleli khasi kuvela kurekhodi efanayo futhi kuchaza isikhungo esingakwazi ukusibona ' +
    'ngegama.',
  // Same reasoning as the isiXhosa entry above: OUTSIDE_SA_CHROME_ZU's proven pairing.
  seeBefore: 'Ngaphambi kokuhamba, bheka ',
  linkText: (province: string) => `imitholampilo nezibhedlela zikahulumeni e-${province}`,
};
