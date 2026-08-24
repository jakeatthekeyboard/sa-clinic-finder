/**
 * outside-sa.xh-zu.ts — the isiXhosa and isiZulu renderings of the #1381 "this
 * facility is not in South Africa" notice.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * The same reason `care-role.xh-zu.ts` exists, and it was written in the same commit
 * as the English lane rather than after it, so the gap that file was created to close
 * is never opened here. `src/data/outside-sa.ts` holds the hand-adjudicated English
 * prose for three published records that are health facilities in Maseru, Lesotho. If
 * only the English route carried it, an isiXhosa or isiZulu reader would be shown a
 * Lesotho hospital under a Free State breadcrumb with nothing anywhere on the page
 * saying it is in another country — a positive false claim with a correction withheld,
 * which is exactly the shape #1367 measured and rejected.
 *
 * THE CONTRACT WITH outside-sa.ts
 * -------------------------------
 * Keys here are `OUTSIDE_SOUTH_AFRICA` keys, and `tests/outside-sa-i18n.test.ts`
 * asserts every entry in that file has BOTH renderings, so adding a record without
 * translating it fails the suite rather than silently shipping a half-translated
 * notice. Coverage is derived at run time; no count is written down here, because the
 * set can grow — any further bounding-box import from an enclave lands in the same
 * lane.
 *
 * NO NUMERALS, for the mechanical reason `care-role.xh-zu.ts` and `outside-sa.ts` both
 * give: a digit on one route and not another is a numeric difference between the three
 * pages and fails `tools/numeric-parity-check.py`.
 *
 * TERMINOLOGY — followed, not invented. Every domain word is one the site already
 * renders: xh ikliniki / isibhedlele / unyango / iikliniki nezibhedlele zikarhulumente
 * / umthombo wethu / irekhodi; zu umtholampilo / isibhedlela / ukwelashwa /
 * imitholampilo nezibhedlela zikahulumeni / umthombo wethu / irekhodi. Place names
 * (Maseru, Lesotho, Free State) and facility names stay as the record renders them,
 * because they are signage and join keys.
 *
 * Meaning was preferred over fluency. Every claim of each English entry survives: what
 * the place is, which country it is in, that a passport and a border post stand between
 * a South African reader and it, and why it appeared on this site at all.
 */

/** Notice chrome — the heading, the chip, and the "for care in South Africa, see …" line. */
export interface OutsideSaChrome {
  /** Heading of the notice, given the country name. Mirrors "Not in South Africa — this facility is in Lesotho". */
  heading: (country: string) => string;
  /** The chip beside the <h1>. Mirrors English "Not in South Africa". */
  chip: string;
  /** Text before the province link. Mirrors "For care in South Africa, see the ". */
  seeBefore: string;
  /** The province link's own text, given the English province name. */
  linkText: (province: string) => string;
}

export const OUTSIDE_SA_CHROME_EN = {
  heading: (country: string) => `Not in South Africa — this facility is in ${country}`,
  chip: 'Not in South Africa',
  seeBefore: 'For care in South Africa, see the ',
  linkText: (province: string) => `public clinics and hospitals in ${province}`,
};

export const OUTSIDE_SA_CHROME_XH: OutsideSaChrome = {
  heading: (country) => `Ayikho eMzantsi Afrika — eli ziko lise-${country}`,
  chip: 'Ayikho eMzantsi Afrika',
  seeBefore: 'Ukuze ufumane unyango eMzantsi Afrika, jonga ',
  linkText: (province) => `iikliniki nezibhedlele zikarhulumente e-${province}`,
};

export const OUTSIDE_SA_CHROME_ZU: OutsideSaChrome = {
  heading: (country) => `Ayikho eNingizimu Afrika — lesi sikhungo sise-${country}`,
  chip: 'Ayikho eNingizimu Afrika',
  seeBefore: 'Ukuze uthole ukwelashwa eNingizimu Afrika, bheka ',
  linkText: (province) => `imitholampilo nezibhedlela zikahulumeni e-${province}`,
};

/** isiXhosa rendering of each `OUTSIDE_SOUTH_AFRICA[slug].what`. */
export const OUTSIDE_SA_WHAT_XH: Record<string, string> = {
  'siga-clinic-north-west':
    'ISiga Clinic iseBotswana, kufuphi neRamotswa, ayikho kwiphondo laseNorth West. Ukuya kuyo usuka ' +
    'eMzantsi Afrika kuthetha ukuwela umda wamazwe kwisikhululo somda unepasipoti esebenzayo, kwaye ayiyonxalenye ' +
    'yenkqubo yezempilo karhulumente waseMzantsi Afrika. Ibidweliswe phantsi kweNorth West ngempazamo, kuba ' +
    'imephu esiyisebenzisayo isikwe yangunxantathu ojikeleze uMzantsi Afrika, kwaye loo nxantathu udlulela ' +
    'ngaphaya komda.',
  'siga-home-based-care-north-west':
    'ISiga Home Based Care iseBotswana, kufuphi neRamotswa, ayikho kwiphondo laseNorth West. Ukuya kuyo usuka ' +
    'eMzantsi Afrika kuthetha ukuwela umda wamazwe kwisikhululo somda unepasipoti esebenzayo, kwaye ayiyonxalenye ' +
    'yenkqubo yezempilo karhulumente waseMzantsi Afrika. Ibidweliswe phantsi kweNorth West ngempazamo, kuba ' +
    'imephu esiyisebenzisayo isikwe yangunxantathu ojikeleze uMzantsi Afrika, kwaye loo nxantathu udlulela ' +
    'ngaphaya komda.',
  'bokspits-clinic-northern-cape':
    'IBokspits Clinic ikwilali yaseBotswana ebizwa ngokuba yiBokspits, kwiKgalagadi District, ayikho kwiNorthern ' +
    'Cape. Eli gama lisetyenziswa macala omabini omda, yiloo nto le nto ilula ukuphazamisa: kukho abantu abahlala ' +
    'kumacala omabini omlambo iNossob, kwaye le kliniki isecaleni laseBotswana. Ukuya kuyo usuka eMzantsi Afrika ' +
    'kuthetha ukuwela umda wamazwe kwisikhululo somda unepasipoti esebenzayo.',
  'centro-de-saude-de-ressano-garcia-mpumalanga':
    'ICentro de Saude de Ressano Garcia iseRessano Garcia, eMozambiki — idolophu ekwelinye icala lesikhululo somda ' +
    'iLebombo ukusuka eKomatipoort. Liziko lezempilo laseMozambiki, ayilolo laseMpumalanga, kwaye ukuya khona ' +
    'kuthetha ukudlula kwisikhululo somda wamazwe unepasipoti esebenzayo. Ibidweliswe phantsi kweMpumalanga ' +
    'ngempazamo, kuba imephu esiyisebenzisayo isikwe yangunxantathu ojikeleze uMzantsi Afrika, kwaye loo ' +
    'nxantathu udlulela ngaphaya komda.',
  'centro-de-saude-de-catuane-kwazulu-natal':
    'ICentro de Saude de Catuane iseCatuane, kwisithili saseMatutuine eMozambiki, ayikho kwaZulu-Natal. Liziko ' +
    'lezempilo laseMozambiki, kwaye ukuya khona kuthetha ukudlula kwisikhululo somda wamazwe unepasipoti ' +
    'esebenzayo. Ibidweliswe phantsi kwaZulu-Natal ngempazamo, kuba imephu esiyisebenzisayo isikwe ' +
    'yangunxantathu ojikeleze uMzantsi Afrika, kwaye loo nxantathu udlulela ngaphaya komda.',
  'premier-services-medical-aid-society-limpopo':
    'Eli liziko lePremier Service Medical Aid Society eBeitbridge, eZimbabwe, ngasentla komlambo iLimpopo — ' +
    'alilolo ziko elikwiphondo laseLimpopo. Loo mbutho ngumbutho wenkxaso-mali yezempilo waseZimbabwe, kwaye ' +
    'amalungu awo ngabo abanyangwayo; ayiyonxalenye yenkqubo yezempilo karhulumente waseMzantsi Afrika, kwaye ' +
    'ukuya khona kuthetha ukudlula kwisikhululo somda iBeitbridge unepasipoti esebenzayo.',
  'mafumahali-hospital-maseru':
    'IMafumahali Hospital iseMaseru, eLesotho, kwisitrato iLancers Road. Yikliniki jikelele kwelinye ilizwe, ' +
    'ayilolo ziko lezempilo likarhulumente waseMzantsi Afrika. Ukuya kuyo usuka eMzantsi Afrika kuthetha ' +
    'ukuwela umda wamazwe kwisikhululo somda unepasipoti esebenzayo, kwaye unyango apho alusimahla kubemi ' +
    'baseMzantsi Afrika. Ibidweliswe phantsi kweFree State ngempazamo, kuba imephu esiyisebenzisayo isikwe ' +
    'yangunxantathu ojikeleze uMzantsi Afrika, kwaye loo nxantathu uquka iLesotho iphela.',
  'domiciliary-clinic-free-state':
    'IDomiciliary Clinic iseMaseru, eLesotho, kwisitrato iAirport Road, kwaye iqhutywa ngumnyango wezempilo ' +
    'welo lizwe. Ayilolo ziko lezempilo likarhulumente waseMzantsi Afrika, kwaye ukuya kuyo usuka eMzantsi ' +
    'Afrika kuthetha ukuwela umda wamazwe kwisikhululo somda unepasipoti esebenzayo. Ibidweliswe phantsi ' +
    'kweFree State ngempazamo, kuba imephu esiyisebenzisayo isikwe yangunxantathu ojikeleze uMzantsi Afrika, ' +
    'kwaye loo nxantathu uquka iLesotho iphela.',
  'queen-ii-training-and-domitory-free-state':
    'Le yinxalenye yendawo yesibhedlele iQueen Elizabeth the Second eMaseru, eLesotho — sisakhiwo soqeqesho ' +
    'nesokuhlala, esibhaliswe kwidatha yemephu ngegama elifutshaniswe lesibhedlele. Ikwelinye ilizwe, ayikho ' +
    'kwiFree State, kwaye ukuya kuyo usuka eMzantsi Afrika kuthetha ukuwela umda wamazwe kwisikhululo somda ' +
    'unepasipoti esebenzayo. Ibidweliswe phantsi kweFree State ngempazamo, kuba imephu esiyisebenzisayo ' +
    'isikwe yangunxantathu ojikeleze uMzantsi Afrika, kwaye loo nxantathu uquka iLesotho iphela.',
};

/** isiZulu rendering of each `OUTSIDE_SOUTH_AFRICA[slug].what`. */
export const OUTSIDE_SA_WHAT_ZU: Record<string, string> = {
  'siga-clinic-north-west':
    'ISiga Clinic iseBotswana, eduze kweRamotswa, ayikho esifundazweni saseNorth West. Ukuya kuyo usuka ' +
    'eNingizimu Afrika kusho ukuwela umngcele wamazwe esikhungweni somngcele unepasipoti esebenzayo, futhi ' +
    'akuyona ingxenye yohlelo lwezempilo lukahulumeni waseNingizimu Afrika. Ibibhaliswe ngaphansi kweNorth West ' +
    'ngephutha, ngoba imephu esiyisebenzisayo isikwe yaba unxande ozungeze iNingizimu Afrika, futhi lowo nxande ' +
    'wedlulela ngaphesheya komngcele.',
  'siga-home-based-care-north-west':
    'ISiga Home Based Care iseBotswana, eduze kweRamotswa, ayikho esifundazweni saseNorth West. Ukuya kuyo usuka ' +
    'eNingizimu Afrika kusho ukuwela umngcele wamazwe esikhungweni somngcele unepasipoti esebenzayo, futhi ' +
    'akuyona ingxenye yohlelo lwezempilo lukahulumeni waseNingizimu Afrika. Ibibhaliswe ngaphansi kweNorth West ' +
    'ngephutha, ngoba imephu esiyisebenzisayo isikwe yaba unxande ozungeze iNingizimu Afrika, futhi lowo nxande ' +
    'wedlulela ngaphesheya komngcele.',
  'bokspits-clinic-northern-cape':
    'IBokspits Clinic isemzaneni waseBotswana obizwa ngeBokspits, esifundeni saseKgalagadi, ayikho eNorthern ' +
    'Cape. Leli gama lisetshenziswa nhlangothi zombili zomngcele, yingakho lokhu kulula ukudideka: kunabantu ' +
    'abahlala nhlangothi zombili zomfula iNossob, futhi lo mtholampilo usohlangothini lwaseBotswana. Ukuya kuwo ' +
    'usuka eNingizimu Afrika kusho ukuwela umngcele wamazwe esikhungweni somngcele unepasipoti esebenzayo.',
  'centro-de-saude-de-ressano-garcia-mpumalanga':
    'ICentro de Saude de Ressano Garcia iseRessano Garcia, eMozambiki — idolobha elingaphesheya kwesikhungo ' +
    'somngcele iLebombo usuka eKomatipoort. Yisikhungo sezempilo saseMozambiki, akusona esaseMpumalanga, futhi ' +
    'ukuya khona kusho ukudlula esikhungweni somngcele wamazwe unepasipoti esebenzayo. Ibibhaliswe ngaphansi ' +
    'kweMpumalanga ngephutha, ngoba imephu esiyisebenzisayo isikwe yaba unxande ozungeze iNingizimu Afrika, ' +
    'futhi lowo nxande wedlulela ngaphesheya komngcele.',
  'centro-de-saude-de-catuane-kwazulu-natal':
    'ICentro de Saude de Catuane iseCatuane, esifundeni saseMatutuine eMozambiki, ayikho KwaZulu-Natal. ' +
    'Yisikhungo sezempilo saseMozambiki, futhi ukuya khona kusho ukudlula esikhungweni somngcele wamazwe ' +
    'unepasipoti esebenzayo. Ibibhaliswe ngaphansi kweKwaZulu-Natal ngephutha, ngoba imephu esiyisebenzisayo ' +
    'isikwe yaba unxande ozungeze iNingizimu Afrika, futhi lowo nxande wedlulela ngaphesheya komngcele.',
  'premier-services-medical-aid-society-limpopo':
    'Lesi yisikhungo sePremier Service Medical Aid Society eBeitbridge, eZimbabwe, enyakatho yomfula iLimpopo — ' +
    'akusona isikhungo esisesifundazweni saseLimpopo. Leyo nhlangano iyinhlangano yosizo lwezempilo yaseZimbabwe, ' +
    'futhi amalungu ayo yiwo elashwayo; akuyona ingxenye yohlelo lwezempilo lukahulumeni waseNingizimu Afrika, ' +
    'futhi ukuya khona kusho ukudlula esikhungweni somngcele iBeitbridge unepasipoti esebenzayo.',
  'mafumahali-hospital-maseru':
    'IMafumahali Hospital iseMaseru, eLesotho, emgwaqweni iLancers Road. Ingumtholampilo ojwayelekile ' +
    'kwelinye izwe, akusona isikhungo sezempilo sikahulumeni waseNingizimu Afrika. Ukuya kuyo usuka ' +
    'eNingizimu Afrika kusho ukuwela umngcele wamazwe esikhungweni somngcele unepasipoti esebenzayo, futhi ' +
    'ukwelashwa lapho akumahhala kwizakhamuzi zaseNingizimu Afrika. Ibibhaliswe ngaphansi kweFree State ' +
    'ngephutha, ngoba imephu esiyisebenzisayo isikwe yaba unxande ozungeze iNingizimu Afrika, futhi lowo ' +
    'nxande uhlanganisa iLesotho lonke.',
  'domiciliary-clinic-free-state':
    'IDomiciliary Clinic iseMaseru, eLesotho, emgwaqweni iAirport Road, futhi iphethwe umnyango wezempilo ' +
    'walelo zwe. Akusona isikhungo sezempilo sikahulumeni waseNingizimu Afrika, futhi ukuya kuyo usuka ' +
    'eNingizimu Afrika kusho ukuwela umngcele wamazwe esikhungweni somngcele unepasipoti esebenzayo. ' +
    'Ibibhaliswe ngaphansi kweFree State ngephutha, ngoba imephu esiyisebenzisayo isikwe yaba unxande ' +
    'ozungeze iNingizimu Afrika, futhi lowo nxande uhlanganisa iLesotho lonke.',
  'queen-ii-training-and-domitory-free-state':
    'Lena ingxenye yendawo yesibhedlela iQueen Elizabeth the Second eMaseru, eLesotho — yisakhiwo ' +
    'sokuqeqesha nesokuhlala, esibhaliswe kudatha yemephu ngegama elifushanisiwe lesibhedlela. Ikwelinye ' +
    'izwe, ayikho eFree State, futhi ukuya kuyo usuka eNingizimu Afrika kusho ukuwela umngcele wamazwe ' +
    'esikhungweni somngcele unepasipoti esebenzayo. Ibibhaliswe ngaphansi kweFree State ngephutha, ngoba ' +
    'imephu esiyisebenzisayo isikwe yaba unxande ozungeze iNingizimu Afrika, futhi lowo nxande uhlanganisa ' +
    'iLesotho lonke.',
};

/** The isiXhosa `what` for a slug, or null. Only ever called for a matched slug. */
export function outsideSaWhatXh(slug: string): string | null {
  return OUTSIDE_SA_WHAT_XH[slug] ?? null;
}

/** The isiZulu `what` for a slug, or null. Same contract as `outsideSaWhatXh`. */
export function outsideSaWhatZu(slug: string): string | null {
  return OUTSIDE_SA_WHAT_ZU[slug] ?? null;
}
