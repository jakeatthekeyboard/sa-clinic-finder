/**
 * Generate contextual editorial snippets for individual facility pages
 * based on facility metadata (type, services, province, 24hr status).
 */

interface Facility {
  name: string;
  type: string;
  province: string;
  district: string;
  services: Record<string, boolean>;
  operating_hours: { is_24_hour: boolean; raw: string };
}

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
