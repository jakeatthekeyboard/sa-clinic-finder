/**
 * outside-sa.ts — the published records that are NOT in South Africa.
 *
 * WHY THIS EXISTS (#1381)
 * -----------------------
 * Nine published records are health facilities in another country — three in Maseru
 * (LESOTHO), three in BOTSWANA, two in MOZAMBIQUE and one in Beitbridge (ZIMBABWE).
 * Every one was carried under a South African province, published at
 * `/clinics/<province>/...`, counted in that province's totals, listed among its
 * facilities and eligible as a "nearby facility" on other pages. A reader in Ladybrand
 * or Komatipoort looking for their nearest clinic was being offered one across an
 * international border, which needs a passport and is not free to a South African
 * citizen.
 *
 * WHY THE `province` FIELD COULD NOT SIMPLY BE CORRECTED
 * ------------------------------------------------------
 * There is no province to correct it TO. The record is not misfiled within South
 * Africa; it is outside it. `facilities.json` holds sourced values, and the source has
 * no error here either — OpenStreetMap describes three real clinics in Maseru
 * accurately. The mistake is OURS, in the import: the HOTOSM extract these three came
 * from is a `zaf_nodes_*` country export clipped to a BOUNDING BOX, and South Africa's
 * bounding box wholly contains Lesotho. Everything inside the enclave that carries a
 * healthcare tag arrives labelled South African. So the adjudication is a judgement
 * about our corpus, and it lives in code beside `care-role.ts`, in the same shape and
 * for the same reason.
 *
 * WHY NOT `care-role.ts` ITSELF
 * -----------------------------
 * Because it would say something false. That lane's notice reads "Not a clinic — you
 * cannot be treated here", and Queen Elizabeth II is a national referral hospital where
 * people very much are treated. These places ARE care; they are care in another
 * country. The two lanes are separate predicates and a record could in principle be in
 * both.
 *
 * WHY THE PAGES STAY LIVE
 * -----------------------
 * Same policy `care-role.ts` sets out: people search for these places by name, and the
 * useful answer is a page that says plainly where the place is and where a South
 * African reader should go instead. Deleting the record would answer with a 404 and
 * lose the correction. What changes is that they leave the South African directory —
 * the province listings, every count, the service corpus, the search index and the
 * nearby-facility suggestions — and the page itself now says which country it is in.
 *
 * HOW THE OTHER SIX WERE FOUND — by fixing the check that already knew
 * ---------------------------------------------------------------------
 * The three Lesotho records were found by hand, off the back of an osm-drift finding
 * that happened to name a Maseru clinic. The other six were found by
 * `ops/validate-province-by-coords.py`, which has point-in-polygon tested every record
 * against the South African district boundaries since 2026-08-14 and which had the
 * evidence all along: its `if p and p != province` treated "located in no district at
 * all" as nothing to report, so a record in Botswana was indistinguishable from a
 * record that was fine. That script now reports them, and skips the ones adjudicated
 * here, so the next import from over a border is a failing check rather than a
 * published clinic.
 *
 * HOW EACH ONE WAS SETTLED — two independent sources, never the coordinates alone
 * -------------------------------------------------------------------------------
 * A point-in-country test is one source and it is the one most likely to be wrong at a
 * border, so each record was also read against its OWN OpenStreetMap tags and name,
 * which carry country evidence no reverse geocoder supplied: a `+266` telephone number,
 * a Maseru postcode, a national ministry as operator, two Portuguese facility names in
 * Mozambican towns, a Botswana B-numbered road, and a Zimbabwean medical aid society in
 * its own name. Both sources agree on all nine. Bokspits was the hardest and got the
 * most work: the name exists on BOTH banks of the Nossob, so the polygon verdict alone
 * would have been boundary noise, and it is the Botswana place hierarchy and road
 * number under the node that settle it.
 *
 * The twenty-two other published records that fall inside the Lesotho or Eswatini
 * bounding boxes were reverse-geocoded in the same sweep and every one came back South
 * African — Kokstad, Barberton, Sterkspruit and the rest are correctly ours and are NOT
 * listed here. This file names the exceptions; it is not a border.
 *
 * A `what` string must contain NO NUMERALS, for the reason `care-role.ts` gives at
 * length: it renders on the English facility page only, so a digit here is a numeric
 * difference between the English page and its isiXhosa and isiZulu siblings and fails
 * `tools/numeric-parity-check.py`. Name the town, not the kilometres — and note that
 * this is why the `+266` dialling code that settled Mafumahali is described in this
 * comment and not in the prose a reader sees.
 */
export interface OutsideSaEntry {
  /** The country the facility is actually in. Renders in the notice heading. */
  country: string;
  /**
   * ISO 3166-1 alpha-2 for that country, for schema.org `addressCountry`. Carried as
   * a field rather than mapped from `country` in the template: the page used to emit
   * a hardcoded "ZA" for these records, and replacing one hardcoded country code with
   * another in the template would leave the next entry in this file with the same bug.
   */
  countryCode: string;
  /** What the place is and where it is. One or two sentences, factual, no numerals. */
  what: string;
  /** The sources that settled it. Not rendered; this is the audit trail. */
  source: string;
}

export const OUTSIDE_SOUTH_AFRICA: Record<string, OutsideSaEntry> = {
  // ── Lesotho ───────────────────────────────────────────────────────────────
  'mafumahali-hospital-maseru': {
    country: 'Lesotho',
    countryCode: 'LS',
    what:
      'Mafumahali Hospital is in Maseru, in Lesotho, on Lancers Road. It is a general clinic in another ' +
      'country, not a South African public health facility. Reaching it from South Africa means ' +
      'crossing an international border post with a valid passport, and treatment there is not free to ' +
      'South African citizens. It was listed under the Free State by mistake, because the map extract this ' +
      'site imports is cut to a rectangle around South Africa and that rectangle contains the whole of ' +
      'Lesotho.',
    source:
      'OpenStreetMap node 11119507335 (amenity=clinic, addr:city=Maseru, addr:street=Lancers Road, ' +
      'contact:phone="+266 5617 4203" — the +266 dialling code is Lesotho; check_date 2023-04-27). ' +
      'Nominatim reverse geocode of its own coordinates returns country_code "ls", Maseru District, Lesotho.',
  },
  'domiciliary-clinic-free-state': {
    country: 'Lesotho',
    countryCode: 'LS',
    what:
      'Domiciliary Clinic is in Maseru, in Lesotho, on Airport Road, and is run by that country\'s ministry ' +
      'of health. It is not a South African public health facility, and going there from South Africa means ' +
      'crossing an international border post with a valid passport. It was listed under the Free State by ' +
      'mistake, because the map extract this site imports is cut to a rectangle around South Africa and that ' +
      'rectangle contains the whole of Lesotho.',
    source:
      'OpenStreetMap node 4686199910 (amenity=clinic, healthcare=clinic, operator="ministry of health", ' +
      'addr:street=Airport Road, addr:postcode=100 — Maseru; South African public facilities are run by ' +
      'provincial Departments of Health, not by a ministry). Nominatim reverse geocode of its own ' +
      'coordinates returns country_code "ls", Maseru District, Lesotho.',
  },
  'queen-ii-training-and-domitory-free-state': {
    country: 'Lesotho',
    countryCode: 'LS',
    what:
      'This is part of the Queen Elizabeth the Second hospital site in Maseru, in Lesotho — the training and ' +
      'dormitory building, recorded in the map data under a shortened form of the hospital\'s name. It is in ' +
      'another country, not in the Free State, and reaching it from South Africa means crossing an ' +
      'international border post with a valid passport. It was listed under the Free State by mistake, ' +
      'because the map extract this site imports is cut to a rectangle around South Africa and that ' +
      'rectangle contains the whole of Lesotho.',
    source:
      'OpenStreetMap node 13475435243 (amenity=hospital, healthcare=hospital, name="Queen II Training and ' +
      'Domitory", check_date 2026-01-22), on the Queen Elizabeth II hospital site in central Maseru. ' +
      'Nominatim reverse geocode of its own coordinates returns country_code "ls", Maseru District, Lesotho.',
  },
// ── Botswana ──────────────────────────────────────────────────────────────
  'siga-clinic-north-west': {
    country: 'Botswana',
    countryCode: 'BW',
    what:
      'Siga Clinic is in Botswana, near Ramotswa, not in the North West province. Reaching it from South ' +
      'Africa means crossing an international border post with a valid passport, and it is not part of the ' +
      'South African public health system. It was listed under the North West by mistake, because the map ' +
      'extract this site imports is cut to a rectangle around South Africa and that rectangle reaches over ' +
      'the border.',
    source:
      'OpenStreetMap node 3446745596 (amenity=clinic, name="Siga Clinic", opening_hours 24/7). Nominatim ' +
      'reverse geocode of its own coordinates returns country_code "bw", Ramotswa, South-East District, ' +
      'Botswana — well north of the Ngotwane, which is the border here, not a point on it.',
  },
  'siga-home-based-care-north-west': {
    country: 'Botswana',
    countryCode: 'BW',
    what:
      'Siga Home Based Care is in Botswana, near Ramotswa, not in the North West province. Reaching it from ' +
      'South Africa means crossing an international border post with a valid passport, and it is not part of ' +
      'the South African public health system. It was listed under the North West by mistake, because the map ' +
      'extract this site imports is cut to a rectangle around South Africa and that rectangle reaches over ' +
      'the border.',
    source:
      'OpenStreetMap node 3446745595 (amenity=clinic, name="Siga Home Based Care"), beside Siga Clinic. ' +
      'Nominatim reverse geocode of its own coordinates returns country_code "bw", Ramotswa, South-East ' +
      'District, Botswana.',
  },
  'bokspits-clinic-northern-cape': {
    country: 'Botswana',
    countryCode: 'BW',
    what:
      'Bokspits Clinic is in the Botswana village of Bokspits, in the Kgalagadi District, not in the Northern ' +
      'Cape. The name is shared across the border, which is what makes this one easy to mistake: there is ' +
      'settlement on both banks of the Nossob, and this clinic is on the Botswana bank. Reaching it from ' +
      'South Africa means crossing an international border post with a valid passport.',
    source:
      'OpenStreetMap node 8337426617 (amenity=clinic, healthcare=clinic, name="Bokspits Clinic"). Nominatim ' +
      'reverse geocode at building zoom returns "Bokspits Clinic, B211, Bokspits, Tsabong Sub-district, ' +
      'Kgalagadi District, Botswana" — a Botswana B-numbered road and a Botswana place hierarchy, not a ' +
      'boundary-noise verdict from the polygon alone. This is the record in this file closest to a border ' +
      'and it was the one checked hardest.',
  },
  // ── Mozambique ────────────────────────────────────────────────────────────
  'centro-de-saude-de-ressano-garcia-mpumalanga': {
    country: 'Mozambique',
    countryCode: 'MZ',
    what:
      'Centro de Saude de Ressano Garcia is in Ressano Garcia, in Mozambique — the town on the far side of ' +
      'the Lebombo border post from Komatipoort. It is a Mozambican health centre, not a Mpumalanga one, and ' +
      'going there means clearing an international border post with a valid passport. It was listed under ' +
      'Mpumalanga by mistake, because the map extract this site imports is cut to a rectangle around South ' +
      'Africa and that rectangle reaches over the border.',
    source:
      'OpenStreetMap node 6476197721 (amenity=clinic, name="Centro de Saude de Ressano Garcia", alt_name ' +
      '"Ressano Garcia Centro de Saude II", source=MSFsurvey, source:date 2017). Nominatim reverse geocode ' +
      'of its own coordinates returns "Ressano Garcia, Moamba, Maputo, Moçambique", country_code "mz". The ' +
      'name is Portuguese, which is a second signal in the record itself.',
  },
  'centro-de-saude-de-catuane-kwazulu-natal': {
    country: 'Mozambique',
    countryCode: 'MZ',
    what:
      'Centro de Saude de Catuane is in Catuane, in the Matutuine district of Mozambique, not in ' +
      'KwaZulu-Natal. It is a Mozambican health centre, and going there means clearing an international ' +
      'border post with a valid passport. It was listed under KwaZulu-Natal by mistake, because the map ' +
      'extract this site imports is cut to a rectangle around South Africa and that rectangle reaches over ' +
      'the border.',
    source:
      'OpenStreetMap node 6476180457 (amenity=clinic, name="Centro de Saude de Catuane", source=MSFsurvey, ' +
      'source:date 2017). Nominatim reverse geocode of its own coordinates returns "Matutuíne, Maputo, ' +
      'Moçambique", country_code "mz". The name is Portuguese, which is a second signal in the record itself.',
  },
  // ── Zimbabwe ──────────────────────────────────────────────────────────────
  'premier-services-medical-aid-society-limpopo': {
    country: 'Zimbabwe',
    countryCode: 'ZW',
    what:
      'This is a Premier Service Medical Aid Society facility in Beitbridge, in Zimbabwe, north of the ' +
      'Limpopo river — not a facility in the Limpopo province. That society is a Zimbabwean medical aid ' +
      'scheme, and its members are its patients; it is not part of the South African public health system, ' +
      'and reaching it means clearing the Beitbridge border post with a valid passport.',
    source:
      'OpenStreetMap node 9992014523 (amenity=clinic, healthcare=clinic, name="Premier Services Medical Aid ' +
      'Society"). Nominatim reverse geocode of its own coordinates returns "Vhembe Heights, Municipality of ' +
      'Beitbridge, Matabeleland South, Zimbabwe", country_code "zw". The operator name is the second source: ' +
      'PSMAS is a Zimbabwean medical aid society, with no South African public facilities.',
  },
};

/** The adjudication for `slug`, or null if the record is in South Africa. */
export function outsideSouthAfrica(slug: string): OutsideSaEntry | null {
  return OUTSIDE_SOUTH_AFRICA[slug] ?? null;
}
