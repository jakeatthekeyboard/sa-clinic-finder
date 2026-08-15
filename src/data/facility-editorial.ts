/**
 * Generate contextual editorial snippets for individual facility pages
 * based on facility metadata (type, services, province, 24hr status).
 *
 * Per-facility overrides (FACILITY_OVERRIDES) provide deep editorial for
 * high-impression facilities in the GSC striking zone. These replace the
 * generated context paragraph with handwritten, SA-specific content.
 */

interface Facility {
  name: string;
  slug: string;
  type: string;
  province: string;
  district: string;
  services: Record<string, boolean>;
  operating_hours: { is_24_hour: boolean; raw: string };
}

/**
 * Per-facility editorial overrides for high-traffic facility pages.
 * Each override replaces the generated context paragraph and can add
 * facility-specific tips beyond the generic service-based tips.
 */
export interface FacilityOverride {
  /** Replaces the auto-generated context paragraph */
  context: string;
  /** Additional tips specific to this facility (appended to service-based tips) */
  facilityTips: string[];
}

/**
 * Everything this generator says in words, bundled so a LOCALE can supply its own copy
 * without forking the generator.
 *
 * The composition rules — which override wins, which service flags produce which tips,
 * in what order the three context sentences concatenate — are behaviour, and behaviour
 * must stay in ONE place. A second copy is a second thing to keep in step, and the copy
 * that drifts is always the translated one: silently, across ~1,000 pages that nobody
 * reviews in that language. So `generateFacilityEditorial` below remains the only
 * implementation and a locale contributes only strings.
 *
 * `serviceTips` is keyed by the FACILITY SERVICE FLAG, not by SERVICE_MAP key — note
 * `dental_services` and `child_immunisation`, which is what the facility records carry.
 * A missing key produces no tip for that service, exactly as an absent flag does.
 */
export interface FacilityEditorialStrings {
  /** Hand-written per-facility copy, keyed by facility slug. */
  overrides: Record<string, FacilityOverride>;
  /** Phrase describing what this level of facility does, keyed by facility type. */
  typeContext: Record<string, string>;
  /** Province-level access context, keyed by the English province name (a data join key). */
  provinceHealthContext: Record<string, string>;
  /**
   * Phrase used when `typeContext` has no entry for the facility's type — `satellite_clinic`
   * is the live case. Optional only so a locale bundle written before this field existed
   * still type-checks; a locale that omits it falls back to the ENGLISH phrase inside its
   * own sentence, which is exactly the half-translated page this project refuses to ship,
   * so every locale bundle should set it.
   */
  typeContextFallback?: string;
  /** One tip per service flag present on the facility. */
  serviceTips: Record<string, string>;
  /** Sentence 1: names the facility, its level and where it is. */
  sentenceBase: (name: string, typeDesc: string, province: string, district: string) => string;
  /** Appended when the facility is open 24 hours. Keeps its leading space. */
  sentence24h: string;
  /** Appended when 4+ services are verified. Keeps its leading space. */
  sentenceServiceCount: (count: number) => string;
}

const FACILITY_OVERRIDES: Record<string, FacilityOverride> = {
  'rethabile-community-health-centre-polokwane': {
    context:
      'Rethabile Community Health Centre is one of Polokwane\'s busiest primary care facilities, serving as a gateway to healthcare for communities across the Capricorn District in Limpopo. As a community health centre, it sits between a basic clinic and a district hospital — offering 24-hour emergency stabilisation, chronic medication management, child health services, family planning, HIV testing, and immunisation. The facility serves a catchment area that includes parts of Seshego, Mankweng, and surrounding informal settlements, where public transport to Polokwane\'s larger hospitals (Pietersburg Provincial Hospital, Mankweng Hospital) can take over an hour each way. Rethabile operates around the clock, making it one of the few 24-hour primary care options in the area outside of hospital emergency departments. The chronic medication queue is typically longest on Mondays and the first Monday of each month — patients collecting monthly packs should aim for mid-week visits to reduce waiting times. Limpopo\'s largely rural population depends heavily on public healthcare, and Rethabile\'s extended service offering (6 verified services including <a href="/services/emergency">24-hour emergency care</a>) makes it a critical facility for communities that would otherwise need to travel to a district hospital for after-hours care.',
    facilityTips: [
      'Rethabile operates 24 hours but the busiest period is Monday mornings and month-end. Arrive before 07:00 or visit mid-week for shorter queues.',
      'For <a href="/services/chronic-medication">chronic medication</a> collection, ask about CCMDD enrolment — stable patients can collect from Pick n Pay pharmacy in Polokwane Mall instead of queuing at the facility.',
      '<a href="/services/hiv-testing">HIV testing</a> and <a href="/services/family-planning">family planning</a> are walk-in services — no appointment or referral needed. Teens aged 12+ can access family planning confidentially without parental consent.',
      'If you need dental care, Rethabile does not currently have dental services — the nearest public dental facility is at Pietersburg Provincial Hospital (dental outpatient department, Monday-Friday).',
      'For conditions requiring X-ray, ultrasound, or surgery, Rethabile will issue a referral letter to Pietersburg Provincial Hospital or Mankweng Hospital. Keep your referral letter — hospitals cannot see non-emergency walk-ins without one.',
      '<strong>Getting here by taxi:</strong> From the Polokwane Central taxi rank on Devenish Street or the Indian Centre taxi rank, Rethabile is a short taxi ride or 10-15 minute walk south along Magazyn Street. Taxis from Seshego and Mankweng pass through the CBD — tell the driver you are going to Rethabile on Magazyn Street. If you are coming from outside Polokwane, long-distance taxis arrive at the central rank and you can walk from there.',
      '<strong>First visit — what to bring:</strong> (1) Your South African ID book, smart ID card, or passport. (2) Your clinic card if you have one from a previous facility — this helps the nurse see your medical history. (3) Any current medication containers or prescriptions so the doctor can see what you are already taking. (4) Your child\'s Road to Health booklet if you are bringing a child for immunisation or growth monitoring. If you do not have an ID, you can still be seen — the clinic cannot refuse primary healthcare to anyone.',
      '<strong>What to expect on your first visit:</strong> You will queue at reception to open a file — the clerk will record your details and issue a clinic card. You then wait in the main queue to see a nurse for initial screening (blood pressure, temperature, weight). Depending on the service you need, you may see a professional nurse or be referred to a doctor on site. First visits typically take 2-4 hours including waiting time, so bring water and something to eat. Chronic medication patients should expect an initial consultation, blood tests, and a return date — you will not receive a full month\'s supply on day one.',
    ],
  },

  'skinner-street-clinic-pretoria': {
    context:
      'Skinner Street Clinic is a primary healthcare clinic in the Pretoria CBD, serving the diverse inner-city population of Tshwane. Its central location — on Skinner Street near the Pretoria train station and major taxi ranks — makes it one of the most accessible clinics for commuters, informal traders, and residents of the surrounding areas including Sunnyside, Arcadia, and Marabastad. The clinic provides <a href="/services/family-planning">family planning</a>, <a href="/services/immunisation">immunisation</a>, and <a href="/services/hiv-testing">HIV testing</a> as its verified core services. Inner-city clinics like Skinner Street serve a transient population — many patients are migrant workers, asylum seekers, and foreign nationals who work in the CBD. Under South African law, all people are entitled to primary healthcare regardless of nationality or documentation status, and Skinner Street Clinic provides services to anyone who walks in. Gauteng has the densest concentration of public health facilities in South Africa, but high population density — especially in the Tshwane CBD — means clinics often operate at capacity. The clinic draws significant foot traffic due to its proximity to public transport, and morning queues can extend outside the building by 08:00.',
    facilityTips: [
      'Skinner Street Clinic is busiest between 07:00 and 10:00 due to commuters stopping in before work. If your visit is not time-sensitive, arriving after 10:00 usually means a shorter wait.',
      '<a href="/services/hiv-testing">HIV testing</a> is confidential and can be anonymous — you do not need to provide your real name or ID. Results take 15 minutes.',
      'For <a href="/services/family-planning">family planning</a>, the clinic provides injectables (Depo-Provera, Nur-Isterate), oral contraceptive pills, and condoms. For implant (Implanon) or IUD insertion, you may need a referral to a nearby CHC or Tshwane District Hospital.',
      'If you need services beyond what Skinner Street offers (chronic medication, ARVs, TB treatment, dental), the nearest comprehensive facilities are Pretoria West Hospital (emergency, chronic meds) and Steve Biko Academic Hospital (specialist referrals).',
      'Free male and female condoms are available at reception without a consultation. You do not need to see a nurse — just ask at the front desk.',
      '<strong>Getting here by taxi:</strong> There is a taxi rank (TR067) directly on Dr Savage Road where the clinic is located. The Bloed Street Mall underground taxi rank — the CBD\'s largest — is 590 metres away (roughly a 7-minute walk east along Bloed Street). Pretoria Station is a 5-minute walk south. If you are arriving by long-distance taxi from outside Tshwane, most routes terminate at the Bloed Street or Marabastad ranks — from either, walk south along any cross street to reach Dr Savage Road.',
      '<strong>First visit — what to bring:</strong> (1) Any form of identification — SA ID book, smart ID card, passport, or asylum seeker permit. You will be treated even without documents, but having ID speeds up file opening. (2) Your clinic card from any previous facility, if you have one. (3) Any medication you are currently taking, including traditional medicines — bring the containers so the nurse can check for interactions. (4) For child immunisation, bring the Road to Health booklet.',
      '<strong>What to expect on your first visit:</strong> At reception you will open a patient file (or have your existing file retrieved if you have visited before). You then wait to see a nurse for vital signs screening. For HIV testing, you will receive pre-test counselling, a finger-prick rapid test, and post-test counselling — the full process takes about 30-45 minutes. For family planning, the nurse will discuss your options and can provide most methods same-day. Expect 1-3 hours total depending on how busy the clinic is. Arrive having eaten — there is no canteen, but street vendors operate outside.',
    ],
  },

  'symphony-way-community-day-centre-delft': {
    context:
      'Symphony Way Community Day Centre serves the Delft community on the Cape Flats, one of the most densely populated and underserved areas of the Western Cape. Delft was established as a post-apartheid housing project in the late 1990s and has grown rapidly, with a population exceeding 150,000 — many living in informal structures alongside formal RDP housing. The facility operates as a primary healthcare clinic offering <a href="/services/family-planning">family planning</a>, <a href="/services/immunisation">immunisation</a>, and <a href="/services/hiv-testing">HIV testing</a>. Gang violence and substance abuse (particularly methamphetamine/tik) are significant community health challenges in Delft, and the facility sees a high volume of trauma-related presentations alongside routine primary care. The Western Cape has the most developed public health infrastructure outside Gauteng, with strong referral pathways — Symphony Way refers complex cases to Delft Community Health Centre (a larger facility with extended services) or to Karl Bremer Hospital and Tygerberg Hospital for specialist care. The Cape Flats has among the highest rates of interpersonal violence in the country, and facilities like Symphony Way often serve as the first point of medical contact for victims of assault and domestic violence.',
    facilityTips: [
      'Symphony Way operates during standard clinic hours (not 24 hours). For after-hours emergencies, the nearest 24-hour facility is Delft Community Health Centre or Karl Bremer Hospital emergency department.',
      '<a href="/services/hiv-testing">HIV testing</a> is available as a walk-in service. If you test positive, same-day ARV initiation is available at Delft Community Health Centre — the nurse at Symphony Way will facilitate the referral.',
      'For victims of assault or domestic violence: the clinic can provide initial medical documentation (J88 form for SAPS), wound care, and referral to Thuthuzela Care Centre at Karl Bremer Hospital for forensic examination and counselling.',
      'The clinic offers <a href="/services/immunisation">immunisation</a> according to the full EPI-SA schedule. Bring your child\'s Road to Health booklet. If the booklet is lost, the clinic can issue a new one.',
      'If you need chronic medication, TB treatment, ARVs, or dental care, Delft Community Health Centre (approximately 2km away on Delft Main Road) offers a fuller range of services and operates 24 hours.',
      'Golden Arrow bus routes and MyCiTi feeders serve Delft. The clinic is accessible from Symphony Way — confirm the exact address with your local ward councillor if you are visiting for the first time.',
    ],
  },

  'phoenix-assessment-therapy-centre-phoenix': {
    context:
      'Phoenix Assessment & Therapy Centre is a district hospital-level facility in Phoenix, a large township north of Durban in KwaZulu-Natal. The facility provides <a href="/services/chronic-medication">chronic medication</a> management, <a href="/services/emergency">24-hour emergency services</a>, <a href="/services/mental-health">mental health</a> assessment and therapy, and <a href="/services/immunisation">immunisation</a>. Its assessment and therapy focus makes it distinct from general hospitals — the facility handles psychiatric assessments, occupational therapy, and rehabilitation alongside standard district hospital services. Phoenix has a population of approximately 500,000, with high rates of chronic disease (diabetes and hypertension are particularly prevalent in the Indian South African community), substance use disorders, and mental health conditions. KwaZulu-Natal has among the highest HIV prevalence rates in the world, and the facility is well-positioned to provide integrated chronic disease management — patients on both ARVs and hypertension medication can manage their conditions at a single facility. The 24-hour emergency service makes Phoenix Assessment & Therapy Centre a critical after-hours option for communities in Phoenix, Verulam, and surrounding areas who would otherwise need to travel to Mahatma Gandhi Memorial Hospital or King Edward VIII Hospital in Durban.',
    facilityTips: [
      'The facility operates 24 hours for emergencies. Non-emergency consultations (chronic medication reviews, therapy sessions) are by appointment during business hours.',
      '<a href="/services/mental-health">Mental health</a> is a core strength of this facility. You can self-refer for a mental health assessment — no referral letter from a clinic is needed. The facility has occupational therapists and psychiatric nurses on staff.',
      'For <a href="/services/chronic-medication">chronic medication</a> (hypertension, diabetes), ask about CCMDD enrolment after 6 months of stable treatment. Pickup points in Phoenix and Verulam allow you to collect medication without visiting the facility each month.',
      'If you need ARV treatment, the nearest public ARV initiation site is Mahatma Gandhi Memorial Hospital (8km south on the R102). Phoenix Assessment & Therapy Centre can monitor chronic medication but confirm ARV initiation capability before visiting for that specific purpose.',
      'Substance use disorder assessment and referral is available through the mental health department. The facility can refer to the provincial substance rehabilitation centres in KZN — waiting lists are typically 2-4 months.',
      'The emergency department uses the South African Triage Scale (SATS). Green-coded patients (non-urgent) may wait several hours, especially over weekends. For routine care, visit during weekday mornings.',
      '<strong>Getting here by taxi:</strong> The Phoenix Plaza taxi rank on Parthenon Street (Starwood) is the main minibus taxi hub in Phoenix — taxis run from there to the facility on Lenhan Drive. From Durban Central, take a taxi to Phoenix Plaza from the Durban Station rank (routes run from approximately 06:00 to 23:30). From Umhlanga/Gateway, the Umhlanga-Phoenix taxi route terminates at Phoenix Plaza. Tell the driver you need the Assessment & Therapy Centre on Lenhan Drive. You can also phone the facility on +27 31 508 0700 for directions from your specific location.',
      '<strong>First visit — what to bring:</strong> (1) Your South African ID book, smart ID card, or passport. If you are a foreign national, bring your passport or asylum seeker permit — treatment cannot be refused, but documentation helps open your file. (2) Any referral letter from a clinic or doctor — for non-emergency visits, a referral letter speeds up the process, though self-referral is accepted for mental health assessments. (3) All current medication containers and any blood test results you have, especially for chronic conditions (hypertension, diabetes, epilepsy). (4) Your child\'s Road to Health booklet if bringing a child for immunisation. (5) For mental health visits, bring details of any previous psychiatric treatment, medication names, and dosages.',
      '<strong>What to expect on your first visit:</strong> For emergencies, you will be triaged immediately using the colour-coded South African Triage Scale — red (resuscitation), orange (emergency), yellow (urgent), green (routine). Green patients should expect a wait of several hours. For non-emergency chronic medication, you will register at reception, have a file opened, and see a doctor for an initial consultation including blood pressure, blood glucose, and blood tests. You will receive a return date, typically 2-4 weeks later, to review results and start medication. For mental health, the initial assessment takes 45-60 minutes with a psychiatric nurse or occupational therapist, who will develop a treatment plan. Bring a companion if you feel anxious about the visit — a family member can wait with you and join the consultation if you prefer.',
    ],
  },

  'ethafeni-clinic-tembisa': {
    context:
      'Ethafeni Clinic is a 24-hour primary healthcare facility serving Tembisa, one of Gauteng\'s largest townships with an estimated population exceeding 500,000. Located east of Johannesburg near Kempton Park, Tembisa is a high-density residential area where public transport connections to tertiary hospitals can take well over an hour. Ethafeni\'s 24-hour status makes it one of the few after-hours primary care options for the Tembisa community outside of Tembisa Provincial Tertiary Hospital\'s emergency department. The clinic provides <a href="/services/emergency">emergency stabilisation</a>, <a href="/services/family-planning">family planning</a>, <a href="/services/immunisation">immunisation</a>, and <a href="/services/hiv-testing">HIV testing</a>. Tembisa faces significant public health challenges including high HIV prevalence, TB, and chronic lifestyle diseases — the clinic\'s after-hours access is critical for shift workers in nearby industrial areas who cannot attend during standard clinic hours.',
    facilityTips: [
      'Ethafeni operates 24 hours but non-emergency services (family planning, immunisation) are typically available during standard weekday hours only. Phone ahead on +27 11 925 6222 to confirm if you need a specific service after hours.',
      '<a href="/services/hiv-testing">HIV testing</a> is free and confidential. If you test positive, ask about same-day ART initiation — the nurse can start you on treatment immediately or refer you to Tembisa Provincial Tertiary Hospital for ARV initiation.',
      'For chronic medication, the nearest facility with a dedicated chronic dispensing unit is Tembisa Provincial Tertiary Hospital. Ask the Ethafeni nursing staff about CCMDD pick-up points in Tembisa if you are already stable on treatment.',
      'Tembisa is served by multiple taxi routes. The clinic is accessible from the main Tembisa taxi rank — confirm the exact location with the driver as Tembisa has multiple health facilities spread across the township.',
    ],
  },

  'lilian-ngoyi-community-clinic-johannesburg': {
    context:
      'Lilian Ngoyi Community Clinic operates at district hospital level in Johannesburg, providing 24-hour services including <a href="/services/emergency">emergency care</a>, <a href="/services/chronic-medication">chronic medication</a> management, and <a href="/services/immunisation">immunisation</a>. Named after anti-apartheid activist Lilian Masediba Ngoyi, the facility is operated by the Gauteng Department of Health and serves communities across Johannesburg\'s western suburbs and surrounding areas. As a district hospital-level facility, it sits above a basic clinic in the referral chain — it can manage chronic conditions, stabilise emergencies, and provide services that smaller clinics in the surrounding area refer patients to. Johannesburg\'s public health system handles enormous patient volumes, and Lilian Ngoyi\'s 24-hour operation and chronic medication capability make it an important alternative to overcrowded emergency departments at larger hospitals like Chris Hani Baragwanath and Charlotte Maxeke.',
    facilityTips: [
      'The facility operates 24 hours for emergencies. For chronic medication collection, arrive during weekday mornings — the pharmacy queue is longest on Mondays and at month-end.',
      '<a href="/services/chronic-medication">Chronic medication</a> patients who have been stable for 6+ months should ask about CCMDD enrolment. This programme lets you collect your monthly medication from a participating pharmacy closer to home.',
      'For conditions requiring specialist care (orthopaedics, cardiology, oncology), Lilian Ngoyi will issue a referral to Charlotte Maxeke Johannesburg Academic Hospital or Chris Hani Baragwanath. Keep your referral letter — specialists cannot see non-emergency patients without one.',
      'Contact the facility on +27 11 933 0202 to confirm operating hours for specific services before travelling.',
    ],
  },

  'blue-downs-clinic-western-cape': {
    context:
      'Blue Downs Clinic is a primary healthcare facility operated by the City of Cape Town, serving the Blue Downs community in the greater Eerste Rivier/Kuilsrivier area of the Western Cape. Blue Downs is a residential area on the Cape Flats with a mixed-income population, situated along the Stellenbosch Arterial between Eerste Rivier and Mfuleni. The clinic provides <a href="/services/family-planning">family planning</a>, <a href="/services/immunisation">immunisation</a>, and <a href="/services/hiv-testing">HIV testing</a> as its core verified services. The facility does not operate 24 hours — for after-hours emergencies, the nearest options are Eerste Rivier Hospital or Karl Bremer Hospital. The Western Cape has structured referral pathways, and Blue Downs Clinic refers complex cases to the Khayelitsha/Eastern Sub-structure health facilities or Eerste Rivier Hospital for inpatient care.',
    facilityTips: [
      'Blue Downs Clinic operates during standard clinic hours (typically 07:30–16:00 weekdays). Arrive before 08:00 for the shortest queue — afternoon visits are generally quieter.',
      '<a href="/services/hiv-testing">HIV testing</a> is free, confidential, and available as a walk-in service. Results are typically ready within 15 minutes.',
      '<a href="/services/family-planning">Family planning</a> includes injectable contraception, oral pills, and condoms. For long-acting methods (implant or IUD), the clinic can refer you to a nearby community health centre.',
      'For after-hours emergencies, go to Eerste Rivier Hospital (approximately 5km away) or call the Western Cape emergency line on 10177.',
      'Phone +27 21 444 8313 to confirm the clinic is open before travelling, especially on public holidays.',
    ],
  },

  'idas-valley-clinic-western-cape': {
    context:
      'Idas Valley Clinic serves the Idas Valley community in Stellenbosch, Western Cape. Idas Valley is a historically coloured residential area on the western edge of Stellenbosch, with a mix of established homes and lower-income housing. The clinic provides primary healthcare services including <a href="/services/family-planning">family planning</a>, <a href="/services/immunisation">immunisation</a>, and <a href="/services/hiv-testing">HIV testing</a>. The facility does not operate 24 hours. Stellenbosch is served by a network of clinics feeding into Stellenbosch Hospital (district level) for cases requiring inpatient care, lab work, or X-rays. The Winelands District has lower HIV prevalence than the Cape Metro, but TB remains a significant concern in farming communities — seasonal agricultural workers moving through the area may need continuity of care, and Idas Valley Clinic can facilitate medication transfers from other facilities.',
    facilityTips: [
      'The clinic operates during standard hours (weekdays). For after-hours emergencies, Stellenbosch Hospital is the nearest 24-hour facility (approximately 3km away on Merriman Avenue).',
      '<a href="/services/immunisation">Child immunisation</a> follows the national EPI-SA schedule. Bring your child\'s Road to Health booklet. If you\'ve missed a scheduled vaccination, the clinic can administer catch-up doses.',
      '<a href="/services/family-planning">Family planning</a> is a walk-in service — no appointment or referral is needed. Available to anyone, including teens aged 12 and older (confidential, no parental consent required).',
      'If you need chronic medication, TB treatment, or dental care, Stellenbosch Hospital or Cloetesville Community Health Clinic (nearby in <a href="/clinics/western-cape/cloetesville-community-health-clinic-stellenbosch">Cloetesville</a>) offer a broader range of services.',
    ],
  },

  'the-newhaven-cape-town': {
    context:
      'The Newhaven is a district hospital-level facility in Durbanville, Cape Town, providing 24-hour services including <a href="/services/emergency">emergency care</a>, <a href="/services/chronic-medication">chronic medication</a> management, <a href="/services/mental-health">mental health</a> assessment, and <a href="/services/immunisation">immunisation</a>. Durbanville is a northern suburb of Cape Town, and The Newhaven serves a catchment area that includes Bellville, Brackenfell, Kraaifontein, and surrounding communities. The facility\'s <a href="/services/mental-health">mental health</a> services are notable — it provides psychiatric assessment, counselling, and can initiate treatment for conditions including depression, anxiety, and substance use disorders. In the Western Cape, mental health services are structured in tiers, and The Newhaven sits at the district level — it can manage stable psychiatric patients and refer acute cases to Stikland Hospital (the provincial psychiatric facility in Bellville) or Tygerberg Hospital for inpatient psychiatric care.',
    facilityTips: [
      'The Newhaven operates 24 hours for emergencies. Non-emergency services (chronic medication reviews, mental health consultations) are available during business hours by appointment.',
      '<a href="/services/mental-health">Mental health</a> services include initial psychiatric assessment and ongoing medication management. You can self-refer — no letter from a clinic is needed. For crisis intervention, the facility can stabilise and refer to Stikland Hospital if inpatient care is required.',
      '<a href="/services/chronic-medication">Chronic medication</a> patients stable on treatment for 6+ months should ask about CCMDD — pickup points in the Durbanville/Bellville area let you collect monthly medication without visiting the facility.',
      'Contact +27 21 010 0813 to confirm availability of specific services or to book a mental health consultation.',
      'The 24-hour emergency service uses the South African Triage Scale (SATS). Non-urgent (green) presentations may experience long waits — for routine care, visit during weekday mornings.',
    ],
  },

  'orchards-clinic-orange-grove-johannesburg': {
    context:
      'Orchards Clinic serves the Orange Grove and surrounding communities in northeastern Johannesburg, including Norwood, Houghton Estate, and Observatory. This area has a diverse population including long-term residents, students, and a significant migrant community. The clinic provides <a href="/services/family-planning">family planning</a>, <a href="/services/immunisation">immunisation</a>, and <a href="/services/hiv-testing">HIV testing</a> as its core services. Under South African law, all people are entitled to primary healthcare regardless of nationality or documentation status — Orchards Clinic serves anyone who walks in. The facility operates during standard clinic hours (not 24 hours). For after-hours emergencies, the nearest hospitals are Charlotte Maxeke Johannesburg Academic Hospital on Jubilee Road (approximately 4km south) and Rahima Moosa Mother and Child Hospital for obstetric emergencies.',
    facilityTips: [
      'Orchards Clinic operates during standard weekday hours. Arrive before 08:00 for the shortest wait — the clinic serves a large catchment area and morning queues build quickly.',
      '<a href="/services/hiv-testing">HIV testing</a> is free, confidential, and available without an appointment. If you test positive, the nurse will discuss same-day ARV initiation or refer you to the nearest ARV site.',
      '<a href="/services/family-planning">Family planning</a> is available to all, including non-citizens. Methods include injectables, oral contraceptive pills, and condoms. For long-acting reversible contraception (implant, IUD), you may be referred to a community health centre.',
      'For chronic medication, TB treatment, or dental services, the nearest facilities with a broader service range include Hillbrow Community Health Centre (CHC) or Charlotte Maxeke Johannesburg Academic Hospital.',
      'If you do not have an ID document, you can still access all primary healthcare services. The clinic may ask for your name for record-keeping but cannot refuse service.',
    ],
  },
};

const TYPE_CONTEXT: Record<string, string> = {
  clinic: 'walk-in primary healthcare',
  community_health_centre: 'community-based primary care with extended services — often including maternity, chronic medication, and minor procedures',
  district_hospital: 'district-level inpatient and outpatient care, including emergency services, surgery, and specialist referrals',
  regional_hospital: 'regional referral hospital with specialist departments, advanced diagnostics, and surgical capacity',
  tertiary_hospital: 'advanced specialist care, teaching, and research — typically a referral destination for complex cases from district and regional hospitals',
  central_hospital: 'the highest level of public healthcare, providing sub-specialist services, advanced research, and national referral capacity',
  specialised_hospital: 'specialised care for specific conditions — psychiatric, TB, rehabilitation, or infectious disease management',
  mobile_clinic: 'a mobile health unit that rotates through underserved areas on a scheduled basis — confirm visit days before travelling',
};

const PROVINCE_HEALTH_CONTEXT: Record<string, string> = {
  'Eastern Cape': 'The Eastern Cape faces significant healthcare access challenges, particularly in rural areas of the former Transkei. Many communities rely on a handful of clinics serving large populations, making each facility a critical lifeline.',
  'Free State': 'Free State facilities serve a mix of urban and farming communities. Mining-related health conditions and agricultural injuries are common presentations alongside routine primary care.',
  'Gauteng': 'Gauteng has the densest concentration of public health facilities in South Africa, but high population density means clinics often operate at capacity. Arriving early is strongly recommended.',
  'KwaZulu-Natal': 'KwaZulu-Natal has among the highest HIV prevalence rates in the world, making ARV access a critical service. TB co-infection is also widespread, and many facilities run dedicated TB programmes.',
  'Limpopo': 'Limpopo\'s largely rural population depends heavily on public healthcare. Travel distances to facilities can be significant — confirm services are available before making a long trip.',
  'Mpumalanga': 'Mpumalanga bridges urban and rural healthcare needs, with facilities in the Lowveld serving both local communities and seasonal agricultural workers.',
  'North West': 'North West Province facilities serve mining communities alongside rural populations. Occupational health screenings and chronic disease management are common service lines.',
  'Northern Cape': 'The Northern Cape is South Africa\'s largest province by area but has the smallest population. Facilities are widely spaced — patients in remote areas may travel hours to reach a clinic.',
  'Western Cape': 'The Western Cape has the most developed public health infrastructure outside Gauteng, with strong referral pathways from community clinics to Tygerberg and Groote Schuur hospitals.',
};

/**
 * The service tips, keyed by the facility service FLAG that switches each one on.
 * Order matters — it is the order the tips render in — so this is an ordered list of
 * keys plus a lookup, not a bare object iteration, which would tie the reader-facing
 * order to a JS property-enumeration detail.
 */
const SERVICE_TIP_ORDER = [
  'arv_treatment',
  'tb_treatment',
  'maternity_antenatal',
  'chronic_medication',
  'dental_services',
  'mental_health',
  'family_planning',
  'child_immunisation',
] as const;

const SERVICE_TIPS_EN: Record<string, string> = {
  arv_treatment: 'This facility provides <a href="/services/arvs">ARV treatment</a>. You can initiate same-day ART — bring your ID document and arrive before 10am for the shortest wait. Read our <a href="/guides/how-to-get-arvs">guide to starting ARVs</a> for what to expect.',
  tb_treatment: 'TB screening and treatment is available here through the <a href="/services/tb">DOTS programme</a>. Sputum tests take 2-3 days for results. If you have a persistent cough lasting more than two weeks, get tested — early treatment dramatically improves outcomes.',
  maternity_antenatal: '<a href="/services/maternity">Maternity and antenatal care</a> is available. Register as early as possible in your pregnancy — before 20 weeks is recommended. Bring your ID and any previous pregnancy records. Read our <a href="/guides/free-maternity-care">free maternity care guide</a> for a complete checklist.',
  chronic_medication: 'This facility dispenses <a href="/services/chronic-medication">chronic medication</a>. If you\'re stable on treatment, ask about the <a href="/guides/ccmdd-chronic-meds-pickup">CCMDD programme</a> — it lets you collect medication from a pharmacy or pickup point closer to home instead of queuing at the clinic each month.',
  dental_services: '<a href="/services/dental">Dental services</a> are available. Public dental care focuses on extractions and emergency treatment — arrive early as dental queues fill fast. See our <a href="/guides/dental-care-public-clinics">dental care guide</a> for what public clinics cover.',
  mental_health: 'This facility offers <a href="/services/mental-health">mental health services</a>. You can self-refer for an initial assessment — no referral letter needed. Our <a href="/guides/mental-health-services">mental health services guide</a> explains what support is available at each level of care.',
  family_planning: '<a href="/services/family-planning">Family planning services</a> are available, including contraception counselling and provision. No appointment or referral needed. See our <a href="/guides/family-planning-contraception">contraception guide</a> for available methods.',
  child_immunisation: '<a href="/services/immunisation">Child immunisation</a> is provided according to the national schedule. Bring your child\'s Road to Health booklet. Our <a href="/guides/child-immunisation-schedule">immunisation schedule guide</a> shows which vaccines are due at each age.',
};

/** The English copy bundle. The default, so every existing caller is unchanged. */
export const FACILITY_EDITORIAL_EN: FacilityEditorialStrings = {
  overrides: FACILITY_OVERRIDES,
  typeContext: TYPE_CONTEXT,
  provinceHealthContext: PROVINCE_HEALTH_CONTEXT,
  typeContextFallback: 'public healthcare',
  serviceTips: SERVICE_TIPS_EN,
  sentenceBase: (name, typeDesc, province, district) =>
    `${name} is a ${typeDesc} facility in ${province}${district ? ', ' + district + ' district' : ''}.`,
  sentence24h:
    ' The facility operates 24 hours, including weekends and public holidays — no appointment is needed for emergencies.',
  sentenceServiceCount: (count) =>
    ` With ${count} verified services, this is a well-equipped facility for comprehensive primary care.`,
};

function getServiceTips(services: Record<string, boolean>, strings: FacilityEditorialStrings): string[] {
  const tips: string[] = [];
  for (const key of SERVICE_TIP_ORDER) {
    if (services[key] && strings.serviceTips[key]) tips.push(strings.serviceTips[key]);
  }
  return tips;
}

export function generateFacilityEditorial(
  facility: Facility,
  strings: FacilityEditorialStrings = FACILITY_EDITORIAL_EN,
): { context: string; tips: string[] } {
  // Check for per-facility editorial override
  const override = strings.overrides[facility.slug];
  if (override) {
    const serviceTips = getServiceTips(facility.services, strings);
    return {
      context: override.context,
      tips: [...serviceTips, ...override.facilityTips],
    };
  }

  // Default: generate from metadata
  const typeDesc = strings.typeContext[facility.type] || strings.typeContextFallback || 'public healthcare';
  const provinceContext = strings.provinceHealthContext[facility.province] || '';

  const activeServiceCount = Object.values(facility.services).filter(Boolean).length;

  let context = strings.sentenceBase(facility.name, typeDesc, facility.province, facility.district);

  if (facility.operating_hours.is_24_hour) {
    context += strings.sentence24h;
  }

  if (activeServiceCount >= 4) {
    context += strings.sentenceServiceCount(activeServiceCount);
  }

  if (provinceContext) {
    context += ' ' + provinceContext;
  }

  const tips = getServiceTips(facility.services, strings);

  return { context, tips };
}
