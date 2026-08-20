/**
 * care-role.xh-zu.ts — the isiXhosa and isiZulu renderings of the #1002 "this is not
 * a care facility" notice.
 *
 * WHY THIS FILE EXISTS (#1367)
 * ----------------------------
 * `src/data/care-role.ts` holds the hand-adjudicated English `what` prose for every
 * published record that is NOT a place a member of the public can be treated. The
 * English facility route renders it inside a red notice headed "Not a clinic — you
 * cannot be treated here". `/xh/...` and `/zu/...` rendered NEITHER, under the rule
 * #1361 reversed:
 *
 *   "a safety notice has to be written by a speaker of the language, not
 *    machine-phrased on a humanitarian site."
 *
 * That rule is refuted by the pages it was applied to. `src/i18n/strings.ts` renders
 * a machine-phrased isiXhosa and isiZulu safety notice ABOVE THE FOLD on the very
 * same pages — "Musa ukuthatha isigqibo ngonyango usekele kweli phepha" / "Ungathathi
 * isinqumo sokwelashwa ngokusekelwe kuleli khasi" — and says so, in the reader's own
 * language. The site already publishes machine-phrased safety text.
 *
 * And here the withheld text is not a caveat on a true claim, which is what #1361
 * was. It is the CORRECTION of a false one. Measured from built output on
 * 2026-08-21, before this file existed: six records, three pages each, the notice on
 * 6 of 6 English pages and 0 of 6 isiXhosa and 0 of 6 isiZulu pages, with no English
 * fallback of any kind — so an isiXhosa reader arriving at
 * /xh/clinics/western-cape/salt-river-mortuary-western-cape saw a state forensic
 * mortuary presented under "Clinic Finder SA", in a province breadcrumb, above a
 * list headed "Amaziko akufuphi" (nearby facilities), with nothing anywhere on the
 * page saying it is not one. Absence was the larger harm, and it was a positive
 * false claim rather than a missing qualification.
 *
 * First-language review of ALL isiXhosa and isiZulu safety copy is still the right
 * remedy and is owned separately as #1369. It is not a reason to keep publishing the
 * claim while withholding the correction.
 *
 * THE CONTRACT WITH care-role.ts
 * ------------------------------
 * Keys here are `NOT_WALK_IN_CARE` keys. `tests/care-role-i18n.test.ts` asserts every
 * entry in that file has BOTH renderings, so adding a record without translating it
 * fails the pre-push hook rather than silently shipping a half-translated notice.
 * Coverage is derived from `care-role.ts` at run time; no count is written down here,
 * because the set grows, and it grew three times during this one piece of work: six
 * records when the gap was measured, eight when #1362 merged, nine when #1281 added
 * a CLOSED TB hospital an hour later. The suite caught that last one on rebase,
 * which is the whole reason it exists.
 *
 * Extra keys are tolerated and are not an error: the two #1362 records below were
 * translated here BEFORE that lane merged, precisely so its merge cannot open the
 * gap this file closes. `careRoleWhatXh`/`careRoleWhatZu` are only ever called for a
 * slug `careRole()` already matched, so an unmatched key renders nothing.
 *
 * NO NUMERALS, for the same mechanical reason `care-role.ts` gives for the English:
 * a digit present on one route and not another is a numeric difference between the
 * three pages and fails `tools/numeric-parity-check.py` — a guard that exists to
 * catch a dropped clinical figure and must not be spent on a house number.
 *
 * TERMINOLOGY — followed, not invented
 * ------------------------------------
 * Every domain word is one the site already renders, so a reader moving between
 * pages meets the same word for the same thing:
 *   xh  ikliniki / isibhedlele / iziko / amaziko (labels.xh.ts), iikliniki
 *       nezibhedlele zikarhulumente (xh/clinics/index.astro), unyango, ugqirha,
 *       ikhemisti, iivenkile, izilwanyana, igazi, irekhodi + uphawu + "umthombo
 *       wethu" (the #1361 notice), i-appointment, indawo, uluhlu.
 *   zu  umtholampilo / isibhedlela / isikhungo / izikhungo (zu.ts), imitholampilo
 *       nezibhedlela zikahulumeni + zomphakathi (zu/clinics/index.astro),
 *       ukwelashwa, udokotela, ikhemisi, izilwanyana, igazi, ihhovisi, isakhiwo,
 *       irekhodi + uphawu + "umthombo wethu", i-appointment, indawo, uhlu.
 * Province names are left in English because that is what the record renders on
 * these routes ("Free State, Lejweleputswa District"), as are facility names, which
 * are join keys and signage a reader has to match on the ground.
 *
 * Meaning was preferred over fluency throughout. Nothing is softened, shortened or
 * embellished: every claim of each English entry survives — what the place is, that
 * nobody is treated there, why it appears on a health directory at all, and where to
 * go instead.
 */

/** Notice chrome — the heading and the "for medical care, see …" line. */
export interface CareRoleChrome {
  /** Heading of the red notice. Mirrors "Not a clinic — you cannot be treated here". */
  heading: string;
  /** Text before the province link. Mirrors "For medical care, see the ". */
  seeBefore: string;
  /** The province link's own text, given the English province name. */
  linkText: (province: string) => string;
}

export const CARE_ROLE_CHROME_XH: CareRoleChrome = {
  heading: 'Ayiyiyo ikliniki — awunakunyangwa apha',
  seeBefore: 'Ukuze ufumane unyango, jonga ',
  linkText: (province) => `iikliniki nezibhedlele zikarhulumente e-${province}`,
};

export const CARE_ROLE_CHROME_ZU: CareRoleChrome = {
  heading: 'Akuwona umtholampilo — awukwazi ukwelashwa lapha',
  seeBefore: 'Ukuze uthole ukwelashwa, bheka ',
  linkText: (province) => `imitholampilo nezibhedlela zikahulumeni e-${province}`,
};

/** isiXhosa rendering of each `NOT_WALK_IN_CARE[slug].what`. */
export const CARE_ROLE_WHAT_XH: Record<string, string> = {
  'mothibistad-shophhing-centre-northern-cape':
    'Le yindawo yeevenkile eMothibistad, ayisiyo isibhedlele. Kwi-OpenStreetMap, umthombo wethu, irekhodi ' +
    'yayo sisakhiwo esinegama elithi "Mothibistad Shophhing Centre", kwaye esi sakhiwo sikwaphethe uphawu ' +
    'lwesibhedlele — oko yimpazamo kwidatha yomthombo, ayisiyo inkcazelo yale ndawo. Izibhedlele ' +
    'zikarhulumente ezikufuphi yiKuruman Provincial Hospital, eKuruman, kunye neTshwarango District Hospital.',

  'panorama-animal-clinic-centurionpretoria':
    'IPanorama Animal Clinic yindawo yonyango lwezilwanyana zasekhaya eThe Reeds, eCenturion. Ayisiyo ' +
    'isibhedlele ' +
    'kwaye akukho mntu unyangwa apha. Kwi-OpenStreetMap, umthombo wethu, irekhodi yayo iphethe uphawu ' +
    'lwesibhedlele — oko yimpazamo kwidatha yomthombo, ayisiyo inkcazelo yale ndawo yezilwanyana.',

  'old-welkom-provincial-not-in-use-free-state':
    'Esi sisakhiwo sesibhedlele esidala saseWelkom, esaziwa nangokuba yiKopano Hospital. Asisasebenzi kwaye ' +
    'akukho mntu unyangwa apha — igama laso kwi-OpenStreetMap ngokwalo libhala ukuba asisasetyenziswa. ' +
    'Isibhedlele sikarhulumente esinceda iWelkom nommandla wonke waseMatjhabeng yiBongani Regional Hospital, ' +
    'eThabong.',

  'salt-river-mortuary-western-cape':
    'Le yiSalt River Forensic Pathology Service — indawo karhulumente waseWestern Cape apho kuhlolwa khona ' +
    'imizimba yabantu abasweleke. Ayiyiyo ikliniki kwaye akukho mntu unyangwa apha. Iintsapho ziza apha ' +
    'nge-appointment ukuze zichonge umzimba womntu wakowabo okanye zilande amaxwebhu; ufikelela kule nkonzo ' +
    'ngegosa lamapolisa okanye ngumngcwabi ophethe eli tyala, kungekhona ngokungena nje.',

  'grayston-mews-gauteng':
    'IGrayston Mews sisakhiwo see-ofisi kuGrayston Drive eSandton. Oogqirha abazimeleyo ngabanye baqeshisa ' +
    'amagumbi kuso, kodwa isakhiwo ngokwaso asiloziko lempilo: asinandawo yokwamkela abantu, asinamaxesha ' +
    'okuvula, kwaye asinazo iinkonzo zaso.',

  'mattress-medi-centre-gauteng':
    'IMattress Medi Centre yivenkile ethengisa imibhede nezinto zokulala, ayisiloziko lempilo. Ivela kolu ' +
    'luhlu lwethu kuba irekhodi yayo kwi-OpenStreetMap iphethe uphawu lwempilo — oko yimpazamo kwidatha ' +
    'yomthombo, ayisiyo inkcazelo yale venkile.',

  // #1281 — a CLOSED TB hospital whose record still carries a telephone number.
  'temba-santa-hospital-grahamstown':
    'ITemba TB Hospital eMakhanda ivaliwe kwaye akukho mntu unyangwa apha. ISebe lezeMpilo laseEastern ' +
    'Cape laphelisa ilisi lesakhiwo seGrahamstown TB Association ebelisetyenziswa, lafudusela izigulana ' +
    'nabasebenzi balo kwiphiko leSettlers Hospital, kuMilner Street eMakhanda, apho unyango lwe-TB ' +
    'lokulaliswa esibhedlele lwenzeka khona ngoku kule dolophu. Ezi zakhiwo zashiywa zingenamntu kwiiveki ' +
    'nje ezimbini emva kokuvalwa, kwaye ukususela ngoko izinto zazo zibiwe ngamasela. Musa ukuza apha, ' +
    'kwaye ungafowuneli inombolo yomnxeba ekweli phepha.',
  // #1362, translated ahead of that lane's merge so the merge cannot reopen this gap.
  'western-cape-blood-service-george-regional-office-the-medical-centre-courtenay-s':
    'Le yiWestern Cape Blood Service eGeorge — indawo yokunikela ngegazi kunye ne-ofisi yengingqi yale ' +
    'nkonzo, kwiThe Medical Centre kuCourtenay Street. Uluntu luyangena apha, kodwa lungena luzokunikela ' +
    'ngegazi, kungekhona ukuza kunyangwa: ayiyiyo ikliniki, ayinawo amagumbi okubonana nogqirha, kwaye ' +
    'ayinikezi khathalelo lwempilo lokuqala. Ukuze ufumane unyango lukarhulumente eGeorge, yiya kwiGeorge ' +
    'Provincial Hospital eHeatherlands okanye kwiGeneva Clinic.',

  'the-local-choice-pharmacy-plett-medicine-depot':
    'ILocal Choice Pharmacy Plett Medicine Depot yikhemisti ethengisayo ePlettenberg Bay, elinye lamasebe ' +
    'omzi weekhemisti osebenza kulo lonke elaseMzantsi Afrika. Ungathenga khona amayeza nezinto zempilo ' +
    'ezithengiswa ngaphandle kwencwadi kagqirha, kodwa ayiyiyo ikliniki karhulumente, akukho mntu unyangwa ' +
    'apha, kwaye akukho khathalelo lwempilo lwasimahla lukarhulumente olunikezwayo. Ikliniki karhulumente ' +
    'enceda iPlettenberg Bay yiKwanokuthula Community Day Centre, eKwanokuthula.',
};

/** isiZulu rendering of each `NOT_WALK_IN_CARE[slug].what`. */
export const CARE_ROLE_WHAT_ZU: Record<string, string> = {
  'mothibistad-shophhing-centre-northern-cape':
    'Lena yindawo yezitolo eMothibistad, akulona isibhedlela. Ku-OpenStreetMap, umthombo wethu, irekhodi ' +
    'yayo yisakhiwo esinegama elithi "Mothibistad Shophhing Centre", futhi lesi sakhiwo siphethe nophawu ' +
    'lwesibhedlela — lokho kuyiphutha kumthombo wemininingwane, akusiyo incazelo yale ndawo. Izibhedlela ' +
    'zikahulumeni eziseduze yiKuruman Provincial Hospital, eKuruman, neTshwarango District Hospital.',

  'panorama-animal-clinic-centurionpretoria':
    'I-Panorama Animal Clinic yindawo yokwelapha izilwanyana zasekhaya eThe Reeds, eCenturion. Akulona ' +
    'isibhedlela futhi akekho umuntu owelashwa lapha. Ku-OpenStreetMap, umthombo wethu, irekhodi yayo ' +
    'iphethe uphawu lwesibhedlela — lokho kuyiphutha kumthombo wemininingwane, akusiyo incazelo yale ' +
    'ndawo yezilwanyana.',

  'old-welkom-provincial-not-in-use-free-state':
    'Lesi yisakhiwo sesibhedlela esidala saseWelkom, esaziwa nangokuthi yiKopano Hospital. Asisasebenzi ' +
    'futhi akekho umuntu owelashwa lapha — igama laso ku-OpenStreetMap ngokwalo libhala ukuthi ' +
    'asisasetshenziswa. Isibhedlela sikahulumeni esisiza iWelkom nendawo yonke yaseMatjhabeng yiBongani ' +
    'Regional Hospital, eThabong.',

  'salt-river-mortuary-western-cape':
    'Lena yiSalt River Forensic Pathology Service — indawo kahulumeni waseWestern Cape lapho kuhlolwa khona ' +
    'imizimba yabantu abashonile. Akuwona umtholampilo futhi akekho umuntu owelashwa lapha. Imindeni iza ' +
    'lapha nge-appointment ukuze ikhombe umzimba womuntu wakubo noma ilande amaphepha; ufinyelela kule ' +
    'nsizakalo ngephoyisa noma ngomngcwabi ophethe leli cala, hhayi ngokungena nje.',

  'grayston-mews-gauteng':
    'I-Grayston Mews yisakhiwo samahhovisi kuGrayston Drive eSandton. Odokotela abazimele ngabanye baqasha ' +
    'amakamelo kuso, kodwa isakhiwo ngokwaso akusona isikhungo sezempilo: asinayo indawo yokwamukela ' +
    'abantu, asinawo amahora okuvula, futhi asinazo izinsizakalo zaso.',

  'mattress-medi-centre-gauteng':
    'I-Mattress Medi Centre yisitolo esithengisa imibhede nezinto zokulala, akusona isikhungo sezempilo. ' +
    'Ivela kulolu hlu lwethu ngoba irekhodi yayo ku-OpenStreetMap iphethe uphawu lwezempilo — lokho ' +
    'kuyiphutha kumthombo wemininingwane, akusiyo incazelo yalesi sitolo.',

  // #1281 — a CLOSED TB hospital whose record still carries a telephone number.
  'temba-santa-hospital-grahamstown':
    'ITemba TB Hospital eMakhanda ivaliwe futhi akekho umuntu owelashwa lapha. UMnyango Wezempilo ' +
    'wase-Eastern Cape waqeda ilisi lesakhiwo seGrahamstown TB Association esasisisebenzisa, wathuthela ' +
    'iziguli nabasebenzi bawo ophikweni lweSettlers Hospital, eMilner Street eMakhanda, lapho ukwelashwa ' +
    'kwe-TB kweziguli ezilaliswayo kwenzeka khona manje kuleli dolobha. Lezi zakhiwo zashiywa ' +
    'zingenamuntu emasontweni amabili nje ngemva kokuvalwa, futhi kusukela lapho izinto zazo zebiwe ' +
    'yizigebengu. Ungezi lapha, futhi ungayishayeli ucingo inombolo esekuleli khasi.',
  // #1362, translated ahead of that lane's merge so the merge cannot reopen this gap.
  'western-cape-blood-service-george-regional-office-the-medical-centre-courtenay-s':
    'Lena yiWestern Cape Blood Service eGeorge — indawo yokunikela ngegazi kanye nehhovisi lesifunda lale ' +
    'nsizakalo, kuThe Medical Centre eCourtenay Street. Umphakathi uyangena lapha, kodwa ungena uzonikela ' +
    'ngegazi, hhayi ukuzokwelashwa: akuwona umtholampilo, awunawo amakamelo okubonana nodokotela, futhi ' +
    'awunikezi ukunakekelwa kwezempilo okuyisisekelo. Ukuze uthole ukwelashwa kukahulumeni eGeorge, yiya ' +
    'eGeorge Provincial Hospital eHeatherlands noma eGeneva Clinic.',

  'the-local-choice-pharmacy-plett-medicine-depot':
    'I-Local Choice Pharmacy Plett Medicine Depot yikhemisi elithengisayo ePlettenberg Bay, elinye ' +
    'lamagatsha enkampani yamakhemisi esebenza kulo lonke elaseNingizimu Afrika. Ungathenga khona imithi ' +
    'nezimpahla zezempilo ezithengiswa ngaphandle kwencwadi kadokotela, kodwa akuwona umtholampilo ' +
    'kahulumeni, akekho umuntu owelashwa lapha, futhi akukho ukunakekelwa kwezempilo kwamahhala ' +
    'kukahulumeni okunikezwayo. Umtholampilo kahulumeni osiza iPlettenberg Bay yiKwanokuthula Community ' +
    'Day Centre, eKwanokuthula.',
};

/**
 * The isiXhosa `what` for a slug, or null.
 *
 * Null renders NOTHING rather than falling back to the English prose. An English
 * paragraph on an isiXhosa page is a ninth English string on a route that has
 * exactly eight, and it would read as translated text to a reader who cannot check.
 * The heading and the "for medical care" line still render, so a null degrades to a
 * page that says less, never to one that says the wrong thing — and
 * tests/care-role-i18n.test.ts fails the push before a null can ever reach a reader.
 */
export function careRoleWhatXh(slug: string): string | null {
  return CARE_ROLE_WHAT_XH[slug] ?? null;
}

/** The isiZulu `what` for a slug, or null. Same contract as `careRoleWhatXh`. */
export function careRoleWhatZu(slug: string): string | null {
  return CARE_ROLE_WHAT_ZU[slug] ?? null;
}

/** First sentence of a translated `what`, for the meta description and JSON-LD. */
export function firstSentence(what: string | null): string {
  return what ? (what.match(/^[^.]*\./)?.[0] ?? '') : '';
}
