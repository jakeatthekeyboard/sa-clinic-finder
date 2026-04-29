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
interface FacilityOverride {
  /** Replaces the auto-generated context paragraph */
  context: string;
  /** Additional tips specific to this facility (appended to service-based tips) */
  facilityTips: string[];
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
      'The clinic is a 5-minute walk from Pretoria Station and the Bloed Street taxi rank. If you are commuting from outside the CBD, confirm operating hours before travelling — the clinic does not operate 24 hours.',
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

function getServiceTips(services: Record<string, boolean>): string[] {
  const tips: string[] = [];

  if (services.arv_treatment) {
    tips.push('This facility provides <a href="/services/arvs">ARV treatment</a>. You can initiate same-day ART — bring your ID document and arrive before 10am for the shortest wait. Read our <a href="/guides/how-to-get-arvs">guide to starting ARVs</a> for what to expect.');
  }

  if (services.tb_treatment) {
    tips.push('TB screening and treatment is available here through the <a href="/services/tb">DOTS programme</a>. Sputum tests take 2-3 days for results. If you have a persistent cough lasting more than two weeks, get tested — early treatment dramatically improves outcomes.');
  }

  if (services.maternity_antenatal) {
    tips.push('<a href="/services/maternity">Maternity and antenatal care</a> is available. Register as early as possible in your pregnancy — before 20 weeks is recommended. Bring your ID and any previous pregnancy records. Read our <a href="/guides/free-maternity-care">free maternity care guide</a> for a complete checklist.');
  }

  if (services.chronic_medication) {
    tips.push('This facility dispenses <a href="/services/chronic-medication">chronic medication</a>. If you\'re stable on treatment, ask about the <a href="/guides/ccmdd-chronic-meds-pickup">CCMDD programme</a> — it lets you collect medication from a pharmacy or pickup point closer to home instead of queuing at the clinic each month.');
  }

  if (services.dental_services) {
    tips.push('<a href="/services/dental">Dental services</a> are available. Public dental care focuses on extractions and emergency treatment — arrive early as dental queues fill fast. See our <a href="/guides/dental-care-public-clinics">dental care guide</a> for what public clinics cover.');
  }

  if (services.mental_health) {
    tips.push('This facility offers <a href="/services/mental-health">mental health services</a>. You can self-refer for an initial assessment — no referral letter needed. Our <a href="/guides/mental-health-services">mental health services guide</a> explains what support is available at each level of care.');
  }

  if (services.family_planning) {
    tips.push('<a href="/services/family-planning">Family planning services</a> are available, including contraception counselling and provision. No appointment or referral needed. See our <a href="/guides/family-planning-contraception">contraception guide</a> for available methods.');
  }

  if (services.child_immunisation) {
    tips.push('<a href="/services/immunisation">Child immunisation</a> is provided according to the national schedule. Bring your child\'s Road to Health booklet. Our <a href="/guides/child-immunisation-schedule">immunisation schedule guide</a> shows which vaccines are due at each age.');
  }

  return tips;
}

export function generateFacilityEditorial(facility: Facility): { context: string; tips: string[] } {
  // Check for per-facility editorial override
  const override = FACILITY_OVERRIDES[facility.slug];
  if (override) {
    const serviceTips = getServiceTips(facility.services);
    return {
      context: override.context,
      tips: [...serviceTips, ...override.facilityTips],
    };
  }

  // Default: generate from metadata
  const typeDesc = TYPE_CONTEXT[facility.type] || 'public healthcare';
  const provinceContext = PROVINCE_HEALTH_CONTEXT[facility.province] || '';

  const activeServiceCount = Object.values(facility.services).filter(Boolean).length;

  let context = `${facility.name} is a ${typeDesc} facility in ${facility.province}${facility.district ? ', ' + facility.district + ' district' : ''}.`;

  if (facility.operating_hours.is_24_hour) {
    context += ' The facility operates 24 hours, including weekends and public holidays — no appointment is needed for emergencies.';
  }

  if (activeServiceCount >= 4) {
    context += ` With ${activeServiceCount} verified services, this is a well-equipped facility for comprehensive primary care.`;
  }

  if (provinceContext) {
    context += ' ' + provinceContext;
  }

  const tips = getServiceTips(facility.services);

  return { context, tips };
}
