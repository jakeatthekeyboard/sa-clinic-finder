/**
 * Province-level editorial content for SA Clinic Finder.
 * Each province gets an intro paragraph, health tips, and a "what to bring" section.
 * All content follows Kaizen standard: every sentence creates new information.
 */

export interface ProvinceEditorial {
  intro: string;
  healthTips: { title: string; text: string }[];
  whatToBring: { item: string; note: string }[];
  /** Provincial health department and emergency contact details */
  contacts: {
    healthDeptPhone: string;
    healthDeptName: string;
    ambulance: string;
    /** Provincial HIV/AIDS helpline or relevant crisis line, if distinct from national */
    crisisLine?: string;
    /** Complaints or patient rights hotline */
    complaintsLine?: string;
  };
  /** Key health districts with facility density context */
  districtHighlights: { name: string; context: string }[];
  /** In-depth editorial sections: infrastructure, access, disease burden */
  deepDive?: { heading: string; body: string }[];
}

export const PROVINCE_EDITORIAL: Record<string, ProvinceEditorial> = {
  'Eastern Cape': {
    intro: `The Eastern Cape is home to roughly 6.7 million people, many in deep rural areas where the nearest district hospital can be over 60 km away. The province has 122 public health facilities listed here, including 78 district hospitals and 1 tertiary hospital (Nelson Mandela Academic Hospital in Mthatha). TB remains a major burden — the OR Tambo and Buffalo City districts consistently report some of the highest TB incidence rates nationally. For life-threatening emergencies, the closest <a href="/services/emergency">24-hour casualty</a> is usually a district hospital; 82 of the 122 facilities here operate around the clock. If you are in a rural area without transport, call the provincial ambulance service at 10177.`,
    healthTips: [
      { title: 'TB screening', text: 'Eastern Cape has among the highest <a href="/services/tb">TB rates</a> in the country. If you have a cough lasting more than two weeks, get screened — sputum tests are free at any clinic. Treatment is 6 months and fully covered.' },
      { title: 'Rural transport', text: 'Many Eastern Cape clinics serve communities 30+ km away. Ask your clinic about outreach days when mobile teams visit local areas, or about patient transport for hospital appointments.' },
      { title: 'Initiation season injuries', text: 'During June/July and November/December initiation seasons, hospitals in the Eastern Cape see a spike in admissions. Families should know the location of the nearest hospital with a surgical unit before the season starts.' },
    ],
    whatToBring: [
      { item: 'South African ID or passport', note: 'Required for registration. No one will be turned away without ID, but it speeds up the process.' },
      { item: 'Clinic card (patient-held record)', note: 'Your green clinic card tracks your visit history. If you have lost it, ask the clinic to issue a new one.' },
      { item: 'Road to Health booklet', note: 'Mandatory for all children under 5. Tracks immunisations, growth, and developmental milestones.' },
      { item: 'Chronic medication list or pill bottles', note: 'If you take chronic medication, bring the packaging or a list of names and dosages so the clinician can check for interactions.' },
      { item: 'Referral letter (if applicable)', note: 'District hospitals require a referral from a clinic or CHC unless it is an emergency.' },
    ],
    contacts: {
      healthDeptPhone: '040 608 1000',
      healthDeptName: 'Eastern Cape Department of Health (Bhisho)',
      ambulance: '10177',
      complaintsLine: '040 608 1735',
    },
    districtHighlights: [
      { name: 'OR Tambo', context: 'Deepest rural healthcare challenge in the province. Covers Mthatha, Lusikisiki, and surrounding areas where some communities are 80+ km from the nearest hospital. Nelson Mandela Academic Hospital is the only tertiary facility for this entire region.' },
      { name: 'Buffalo City', context: 'Urban metro centred on East London. Frere Hospital and Cecilia Makiwane Hospital handle the bulk of surgical and emergency referrals. TB and HIV co-infection rates are among the highest in the province.' },
      { name: 'Nelson Mandela Bay', context: 'Metro covering Port Elizabeth and Uitenhage. Livingstone Tertiary Hospital and Dora Nginza Hospital are the main referral points. The metro has better facility density than rural districts but still faces severe staff shortages.' },
      { name: 'Amathole', context: 'Covers Fort Beaufort, Alice, and Keiskammahoek. A mix of small-town hospitals and deep rural clinics. Victoria Hospital in Alice is a key facility for the central Eastern Cape.' },
    ],
  },

  'Free State': {
    intro: `The Free State serves about 2.9 million people across a vast, sparsely populated interior. With 37 public facilities — 20 clinics, 16 district hospitals, and 1 community health centre — coverage is thin. Universitas Academic Hospital in Bloemfontein is the province's only tertiary facility and the referral point for complex cases from across the province. The Free State has a disproportionately high HIV prevalence (roughly 25% of adults) and some of the highest <a href="/services/maternity">maternal mortality</a> rates in South Africa. For emergencies, 16 facilities offer <a href="/services/emergency">24-hour services</a>. Long distances between towns mean that keeping clinic appointments on time takes planning.`,
    healthTips: [
      { title: 'HIV testing and ARVs', text: 'With one of the highest adult HIV prevalence rates in SA, regular testing matters. All clinics offer free rapid HIV tests. If positive, <a href="/services/arvs">ARV treatment</a> can start the same day under the Universal Test and Treat policy.' },
      { title: 'Farm worker access', text: 'If you work on a farm far from town, you can request <a href="/services/chronic-medication">chronic medication</a> collection at the nearest clinic rather than travelling to the hospital monthly. Ask about the Central Chronic Medicine Dispensing and Distribution (CCMDD) programme.' },
      { title: 'Winter respiratory illness', text: 'Free State winters are harsh — temperatures in Bloemfontein regularly drop below zero. Pneumonia and flu hospitalisations peak from May to August. Get a flu vaccine at your clinic from March onwards, especially if you are over 65 or HIV-positive.' },
    ],
    whatToBring: [
      { item: 'South African ID or passport', note: 'Needed for file creation. Asylum seekers can use a Section 22 permit.' },
      { item: 'Clinic card', note: 'Your patient record. Bring it to every visit so your history is up to date.' },
      { item: 'Road to Health booklet', note: 'For all children under 5 — immunisation schedules are tracked here.' },
      { item: 'Chronic medication or prescription', note: 'Bring current medication so clinicians can verify doses and avoid duplication.' },
      { item: 'Referral letter', note: 'Needed for hospital visits unless presenting at casualty with an emergency.' },
    ],
    contacts: {
      healthDeptPhone: '051 408 1000',
      healthDeptName: 'Free State Department of Health (Bloemfontein)',
      ambulance: '10177',
      complaintsLine: '051 408 1126',
    },
    districtHighlights: [
      { name: 'Mangaung', context: 'Metro district covering Bloemfontein, Botshabelo, and Thaba Nchu. Universitas Academic Hospital is here — the only tertiary facility in the province. Pelonomi Hospital handles district-level emergencies and overflow.' },
      { name: 'Lejweleputswa', context: 'Gold mining district covering Welkom and Virginia. High HIV prevalence among mine workers and surrounding communities. Mining-related lung disease (silicosis) is a significant occupational health burden.' },
      { name: 'Thabo Mofutsanyana', context: 'Eastern Free State covering Bethlehem, QwaQwa, and Harrismith. Mountainous terrain makes ambulance access slow — some communities in QwaQwa are accessible only by gravel road in dry weather.' },
    ],
  },

  'Gauteng': {
    intro: `Gauteng is South Africa's economic hub and most densely populated province, with over 16 million residents crammed into the smallest provincial land area. The 281 public facilities here — 192 clinics, 78 district hospitals, 8 community health centres, and 2 tertiary hospitals — serve more patients per day than any other province. Charlotte Maxeke Johannesburg Academic Hospital and Steve Biko Academic Hospital in Pretoria handle the most complex referrals. Despite having the most facilities, demand far outstrips supply: some Gauteng clinics see 300+ patients per day. Of the 281 facilities listed, 106 offer <a href="/services/emergency">24-hour services</a>. For emergencies, dial 10177 for the provincial ambulance.`,
    healthTips: [
      { title: 'Arrive early', text: 'High-volume Gauteng clinics open at 07:00. Patients who arrive by 06:30 are typically seen before midday. Afternoon queues often mean returning the next day.' },
      { title: 'Air quality and asthma', text: 'Gauteng has some of SA\'s worst air quality, particularly in the Vaal Triangle and Johannesburg South. If you or your child has asthma, ensure your clinic has issued a spacer device and a written action plan.' },
      { title: 'Mental health access', text: 'Gauteng has the most community <a href="/guides/mental-health-services">mental health services</a> in SA, but demand still exceeds supply. If you need counselling or psychiatric follow-up, ask your clinic for a referral to the nearest community health centre with a psychologist.' },
    ],
    whatToBring: [
      { item: 'South African ID, passport, or asylum permit', note: 'Registration requires identification. Foreign nationals are entitled to emergency care and children to full PHC services regardless of documentation.' },
      { item: 'Clinic card', note: 'Gauteng clinics are high-volume — your card helps staff pull your file quickly.' },
      { item: 'Road to Health booklet', note: 'Required for children under 5 at every visit.' },
      { item: 'Chronic medication list', note: 'Bring current medication, especially if transferring between facilities — duplicate prescriptions are a common problem in Gauteng.' },
      { item: 'Proof of address (for new registration)', note: 'Some Gauteng clinics request this for first-time registration, though it is not legally required for care.' },
    ],
    contacts: {
      healthDeptPhone: '011 355 3000',
      healthDeptName: 'Gauteng Department of Health (Johannesburg)',
      ambulance: '10177',
      crisisLine: '0800 012 322 (Gauteng mental health crisis line)',
      complaintsLine: '011 355 3015',
    },
    districtHighlights: [
      { name: 'City of Johannesburg', context: 'The most populous metro in SA. Chris Hani Baragwanath (Bara) in Soweto is one of the largest hospitals in the world with ~3,200 beds. Charlotte Maxeke Johannesburg Academic is the main tertiary referral. Hillbrow, Alexandra, and Soweto clinics are among the busiest in the country.' },
      { name: 'City of Tshwane', context: 'Pretoria metro with Steve Biko Academic Hospital and Kalafong Hospital as tertiary referral points. Mamelodi and Atteridgeville clinics serve dense communities. Tshwane has relatively better specialist access than other metros due to dual tertiary hospitals.' },
      { name: 'Ekurhuleni', context: 'East Rand metro covering Germiston, Benoni, Springs, and Tembisa. Tembisa Hospital is one of the busiest district hospitals in SA. Industrial injuries from the manufacturing sector are a significant caseload.' },
      { name: 'Sedibeng', context: 'Vaal Triangle district covering Vereeniging, Vanderbijlpark, and Sebokeng. Severe air pollution from heavy industry contributes to high respiratory disease rates. Sebokeng Hospital handles most emergency referrals.' },
    ],
    deepDive: [
      {
        heading: 'Healthcare infrastructure under pressure',
        body: `Gauteng has more public health facilities than any other province, yet demand consistently overwhelms capacity because 16 million people share infrastructure originally designed for fewer than 8 million. The doctor-to-patient ratio in public facilities sits around 1:4,200 — nearly double the national benchmark of 1:2,300 recommended by the WHO. Charlotte Maxeke Johannesburg Academic and Steve Biko Academic in Pretoria are the only two tertiary hospitals, meaning the entire province funnels complex oncology, neurosurgery, cardiothoracic, and organ transplant cases through just two referral points. Chris Hani Baragwanath ("Bara") in Soweto is a district hospital by classification, but functions as a de facto tertiary centre with ~3,200 beds and 6,000+ staff — the third-largest hospital globally. For patients, this means specialist waiting times can stretch to 6-12 months for non-urgent procedures. District hospitals like Tembisa (East Rand), Leratong (West Rand), and Kalafong (Pretoria West) operate well above their bed-capacity daily. Tembisa Hospital alone delivers over 1,600 babies per month, making it one of the highest-volume maternity units in the southern hemisphere. Community health centres like Chiawelo, Discoverers, and Zola CHC provide extended-hour primary care and can handle minor procedures — these are often a faster option than going straight to a hospital outpatient department.`,
      },
      {
        heading: 'Getting to a clinic: transport realities in Gauteng',
        body: `Unlike rural provinces, distance is rarely the barrier in Gauteng — congestion and cost are. Most Gauteng residents live within 5 km of a public facility, but minibus taxi fares eat into household budgets, particularly for patients on chronic medication who visit monthly. A return trip from Soweto to Charlotte Maxeke costs R50-80 by taxi, unaffordable for many grant recipients. The Rea Vaya and A Re Yeng BRT systems serve limited corridors — Soweto to Joburg CBD and Pretoria CBD respectively — and do not connect directly to most hospitals. Gautrain reaches only Hatfield (near Steve Biko) and Park Station (far from any hospital). For emergency transport, 10177 provincial ambulances in Gauteng average 40-60 minute response times due to traffic, compared to a national target of 15 minutes in urban areas. In practice, many trauma patients arrive at hospitals by private car or taxi, not ambulance. The <a href="/services/emergency">24-hour</a> casualty departments at Bara, Charlotte Maxeke, Helen Joseph, and Kalafong are the highest-volume trauma reception points — Helen Joseph alone sees 200+ trauma cases per weekend. Patients in the Vaal Triangle (Sedibeng district) face the longest intra-provincial journeys: transfer from Sebokeng Hospital to a Johannesburg tertiary facility takes 60-90 minutes by road ambulance.`,
      },
      {
        heading: 'Gauteng\'s distinct health burden',
        body: `Gauteng carries the heaviest trauma burden of any South African province. Interpersonal violence, motor vehicle accidents, and industrial injuries drive a caseload that peaks sharply on Friday and Saturday nights — Bara\'s trauma unit sees a 300% volume increase on weekends compared to weekdays. Gunshot and stab wounds account for over 40% of trauma admissions at Johannesburg and Tshwane facilities. Beyond trauma, Gauteng has unique health pressures linked to its density and air quality. The Vaal Triangle and Johannesburg South — downwind of Eskom power stations and industrial emitters — record PM2.5 levels regularly exceeding WHO guidelines by 3-5x, driving chronic obstructive pulmonary disease (COPD) and childhood asthma rates significantly above the national average. HIV prevalence in Gauteng sits around 17% among adults, lower than KwaZulu-Natal but significant in absolute numbers: roughly 2.7 million people living with HIV in the province. The inner-city areas — Hillbrow, Yeoville, Berea — have concentrated HIV and TB co-infection linked to overcrowded residential buildings. Non-communicable diseases are an escalating crisis: Gauteng has the highest diabetes prevalence in SA (roughly 12% of adults), driven by urbanised diets and sedentary lifestyles. Tshwane District specifically reports the highest hypertension screening rates in the country, with over 30% of adults screened showing elevated blood pressure.`,
      },
    ],
  },

  'KwaZulu-Natal': {
    intro: `KwaZulu-Natal (KZN) is South Africa's second most populous province at roughly 11.5 million people, with vast rural areas in the former Transkei and Zululand where access to healthcare is a daily challenge. The province has 201 public facilities in this directory — 117 district hospitals, 73 clinics, 6 community health centres, and 5 regional hospitals. KZN carries one of the highest HIV burdens globally: the uMgungundlovu and eThekwini districts have adult prevalence rates exceeding 30%. For emergencies, 127 facilities are open 24 hours. Inkosi Albert Luthuli Central Hospital in Durban is the province's flagship facility for complex trauma and specialist surgery.`,
    healthTips: [
      { title: 'HIV and TB co-infection', text: 'KZN has extremely high rates of HIV-TB co-infection. If you are HIV-positive, ask your clinic about Isoniazid Preventive Therapy (IPT) to reduce your TB risk by up to 60%. It is a 12-month course of one daily tablet.' },
      { title: 'Malaria in northern KZN', text: 'The Jozini, uMhlabuyalingana, and Big Five Hlabisa areas are malaria zones, especially from September to May. Symptoms include fever, chills, and headache 7-30 days after a mosquito bite. Go to a clinic immediately — malaria is curable if caught early but fatal if delayed.' },
      { title: 'Maternal health', text: 'KZN has high <a href="/services/maternity">maternal mortality</a>, particularly in rural districts. Pregnant women should register at an antenatal clinic before 20 weeks. All antenatal visits, delivery, and postnatal check-ups are free at public facilities.' },
    ],
    whatToBring: [
      { item: 'South African ID or passport', note: 'For patient registration. Undocumented mothers will still receive maternity care.' },
      { item: 'Clinic card', note: 'Your patient-held record for tracking visits and prescriptions.' },
      { item: 'Road to Health booklet', note: 'Essential for children under 5 — tracks immunisations and growth.' },
      { item: 'Chronic medication or repeat prescription', note: 'KZN has CCMDD pickup points at some clinics — ask about external collection if travel is difficult.' },
      { item: 'Maternity case record (if pregnant)', note: 'Issued at your first antenatal visit. Carry it at all times during pregnancy, including to the delivery facility.' },
    ],
    contacts: {
      healthDeptPhone: '033 395 2111',
      healthDeptName: 'KwaZulu-Natal Department of Health (Pietermaritzburg)',
      ambulance: '10177',
      crisisLine: '0800 567 567 (SADAG — 24/7 mental health crisis)',
      complaintsLine: '033 395 2180',
    },
    districtHighlights: [
      { name: 'eThekwini', context: 'Durban metro — the busiest health district in KZN. Inkosi Albert Luthuli Central Hospital is the flagship for complex surgery and trauma. King Edward VIII Hospital handles high-risk obstetrics. Extremely high HIV prevalence: ~30% adult rate.' },
      { name: 'uMgungundlovu', context: 'Pietermaritzburg and surrounding areas. Grey\'s Hospital is the regional referral centre. This district has some of the highest HIV prevalence figures nationally and a well-established ARV programme.' },
      { name: 'Zululand', context: 'Rural northern KZN covering Ulundi, Nongoma, and Pongola. Facilities are widely spaced across hilly terrain. Malaria risk in the eastern lowlands near Mozambique border. Traditional healing practices are widespread — clinics work alongside traditional health practitioners.' },
      { name: 'uMkhanyakude', context: 'Most remote district in KZN, bordering Mozambique and Eswatini. Includes Hlabisa, Jozini, and Mtubatuba. Some of the highest HIV prevalence rates in the world (>40% in some sub-districts). Malaria endemic. The Africa Health Research Institute in Somkhele conducts world-leading HIV research here.' },
    ],
    deepDive: [
      {
        heading: 'Healthcare infrastructure: a province of extremes',
        body: `KwaZulu-Natal\'s 201 public facilities mask a stark urban-rural divide. The eThekwini metro (Durban) has one public facility per ~35,000 people, while uMkhanyakude district — bordering Mozambique — drops to one facility per ~70,000. Inkosi Albert Luthuli Central Hospital (IALCH) in Durban is the only Level 1 central hospital in the province and one of only six in the country, handling neurosurgery, organ transplants, cardiothoracic surgery, and the province\'s only dedicated burns unit. Grey\'s Hospital in Pietermaritzburg serves as the regional referral for the inland half of the province but lacks several specialist units available at IALCH, forcing patients from as far as Kokstad or Ladysmith to travel 3-4 hours to Durban for specialist care. District hospitals in rural Zululand and uMkhanyakude operate with doctor-to-patient ratios as poor as 1:10,000, compared to ~1:2,800 in eThekwini. The province graduates ~800 doctors annually from UKZN medical school, but rural hospitals struggle to retain them beyond their compulsory community service year. KZN\'s community health centres — including KwaMashu CHC, Phoenix CHC, and Mpumalanga CHC (near Hammarsdale) — are critical intermediate-level facilities that handle minor surgery, 24-hour maternity, and chronic disease management, reducing pressure on district hospitals.`,
      },
      {
        heading: 'Transport and access in rural KZN',
        body: `For patients in rural KwaZulu-Natal, reaching a health facility is often the hardest part of getting care. In the uMkhanyakude, Zululand, and Harry Gwala districts, communities routinely travel 30-80 km to reach the nearest clinic, much of it on unpaved roads that become impassable during the summer rains (October to March). Minibus taxis are the primary transport mode — a one-way trip from Jozini to Manguzi Hospital costs R80-120, a significant fraction of the R370 child support grant that many households depend on. Provincial ambulance response times in rural KZN average 90-120 minutes, compared to 30-45 minutes in eThekwini. The KZN Department of Health operates a Planned Patient Transport (PPT) system for scheduled hospital transfers, but vehicles are limited and patients frequently wait 6+ hours for collection. Mobile clinic teams — known as outreach teams — visit fixed points on rotating schedules, typically covering each point every 2-4 weeks. These teams provide <a href="/services/immunisation">immunisations</a>, <a href="/services/antenatal">antenatal</a> check-ups, <a href="/services/chronic-medication">chronic medication</a> refills, and TB sputum collection, but cannot handle emergencies or complex diagnoses. Pregnant women in rural KZN are encouraged to move to a Maternity Waiting Home (MWH) near their delivery hospital from 38 weeks — facilities at Mseleni, Bethesda, and Mosvold hospitals offer these. The alternative is delivering at home with untrained birth attendants, which remains common in remote communities and contributes to KZN\'s maternal mortality rate of ~140 per 100,000 live births, nearly double the national average.`,
      },
      {
        heading: 'KZN\'s health crisis: HIV, TB, and the dual epidemic',
        body: `KwaZulu-Natal carries the heaviest HIV burden of any province globally. Adult HIV prevalence exceeds 27% province-wide, but in hotspot districts — uMgungundlovu (Pietermaritzburg), eThekwini (Durban), and uMkhanyakude — prevalence reaches 35-44% among adults aged 15-49. This translates to roughly 2.1 million people living with HIV in KZN alone, more than the entire HIV-positive populations of most countries. The province\'s ARV programme is correspondingly massive: over 1.2 million patients are on active antiretroviral treatment, managed through a decentralised model where even small rural clinics initiate and maintain ARV therapy. TB co-infection is the deadliest complication — KZN has the highest TB incidence in South Africa (~685 per 100,000 people), and an estimated 60% of TB patients are HIV co-infected. The province was the epicentre of the XDR-TB (extensively drug-resistant TB) outbreak first identified at Church of Scotland Hospital in Tugela Ferry in 2005, which killed 52 of 53 patients within weeks. Since then, KZN has established dedicated drug-resistant TB treatment centres at King Dinuzulu Hospital in Durban and the former Jose Pearson TB Hospital (now part of the provincial MDR-TB programme). Beyond the dual HIV-TB epidemic, KZN faces a growing non-communicable disease burden: cervical cancer rates are the highest nationally (linked to HIV-driven HPV co-infection), and the province has prioritised HPV vaccination for girls aged 9-12 through the school health programme. Northern KZN\'s malaria belt — Jozini, Hlabisa, uMhlabuyalingana — adds a seasonal layer, with 8,000-12,000 confirmed cases annually during the wet season.`,
      },
    ],
  },

  'Limpopo': {
    intro: `Limpopo is one of South Africa's most rural provinces, with 5.9 million residents spread across bushveld and mountains where villages may be 40+ km from the nearest health facility. The 95 public facilities listed here include 46 district hospitals, 46 clinics, and 3 community health centres. Pietersburg (Polokwane) Hospital is the main referral centre. Limpopo faces a severe shortage of doctors — some district hospitals operate with fewer than 5 medical officers. Malaria is endemic in the Vhembe and Mopani districts near the Mozambique and Zimbabwe borders. Of the 95 facilities, 55 offer <a href="/services/emergency">24-hour services</a>. For ambulances, call 10177 — response times in rural Limpopo can exceed 2 hours.`,
    healthTips: [
      { title: 'Malaria prevention', text: 'Vhembe and Mopani districts are high-risk malaria areas from September to May. Sleep under a treated mosquito net, use repellent after dusk, and go to the nearest clinic within 24 hours if you develop fever. Malaria rapid tests and treatment are free.' },
      { title: 'Diarrhoeal disease in children', text: 'Limpopo has high rates of childhood diarrhoea, linked to water quality in rural areas. If your child has watery stools for more than a day, start oral rehydration solution immediately and get to a clinic — dehydration kills quickly in children under 5.' },
      { title: 'Traditional medicine interactions', text: 'Many Limpopo communities use traditional remedies alongside clinic treatment. Inform your clinician about any traditional medicines you are taking — some interact dangerously with <a href="/services/arvs">ARVs</a> and TB drugs.' },
    ],
    whatToBring: [
      { item: 'South African ID or passport', note: 'For registration. Keep a photocopy at home in case the original is lost.' },
      { item: 'Clinic card', note: 'Rural clinics may not have electronic records — your card is your medical history.' },
      { item: 'Road to Health booklet', note: 'For children under 5. Limpopo has mobile immunisation teams — check dates with your nearest clinic.' },
      { item: 'Chronic medication and pill bottles', note: 'Bring everything you are currently taking, including traditional medicines, so the clinician has the full picture.' },
      { item: 'Referral letter', note: 'Required for hospital visits. In Limpopo, some hospitals are hours apart — an incorrect referral means wasted travel.' },
    ],
    contacts: {
      healthDeptPhone: '015 293 6000',
      healthDeptName: 'Limpopo Department of Health (Polokwane)',
      ambulance: '10177',
      complaintsLine: '015 293 6036',
    },
    districtHighlights: [
      { name: 'Vhembe', context: 'Northernmost district bordering Zimbabwe and Mozambique. Covers Thohoyandou, Musina, and Louis Trichardt. Malaria endemic zone. Tshilidzini Hospital is the main facility. Cross-border patient flow from Zimbabwe strains capacity.' },
      { name: 'Mopani', context: 'Eastern Limpopo covering Tzaneen, Phalaborwa, and Giyani. Mix of agricultural and mining communities. Malaria risk area. Letaba Hospital in Tzaneen is the key referral point. High rates of TB in farming communities.' },
      { name: 'Capricorn', context: 'Central district covering Polokwane — Limpopo\'s capital. Pietersburg Hospital is the provincial referral centre and the only facility offering some specialist services. The best-resourced district in the province but still severely doctor-short.' },
      { name: 'Sekhukhune', context: 'Southwestern Limpopo, platinum mining belt. Covers Groblersdal and Jane Furse. Mining-related injuries and silicosis are significant. Communities are spread across mountainous terrain, making ambulance access difficult.' },
    ],
  },

  'Mpumalanga': {
    intro: `Mpumalanga has roughly 4.7 million residents, with communities spread between the Highveld coal belt and the subtropical Lowveld near Kruger National Park. The province has 50 public facilities in this directory — 27 district hospitals, 20 clinics, and 3 community health centres. Rob Ferreira Hospital in Nelspruit (Mbombela) is the main referral point, and Witbank Hospital serves the Highveld. Mpumalanga's eastern Lowveld (Ehlanzeni district) is a malaria zone, while the western Highveld has severe air pollution from coal-fired power stations. Of the 50 facilities, 33 offer round-the-clock services.`,
    healthTips: [
      { title: 'Malaria in the Lowveld', text: 'Ehlanzeni district — including Mbombela, Nkomazi, and Bushbuckridge — is malaria-endemic from September to May. If you develop fever, headache, or body aches after being in the Lowveld, get a malaria test at any clinic immediately. Same-day treatment is critical.' },
      { title: 'Respiratory disease on the Highveld', text: 'The eMalahleni (Witbank) and Steve Tshwete (Middelburg) areas have severe air pollution from coal plants and mines. Chronic respiratory conditions like asthma and bronchitis are common. Get your children screened if they have persistent coughs.' },
      { title: 'Burn injuries in winter', text: 'Mpumalanga has high rates of paraffin and open-fire burns during winter, particularly among children. Keep paraffin stoves out of children\'s reach, and know your nearest 24-hour facility — burn treatment needs to start within hours.' },
    ],
    whatToBring: [
      { item: 'South African ID or passport', note: 'For registration at any facility.' },
      { item: 'Clinic card', note: 'Your patient-held record. Replace it at the clinic if lost.' },
      { item: 'Road to Health booklet', note: 'For children under 5 — tracks vaccinations and growth monitoring.' },
      { item: 'Chronic medication', note: 'Bring current medication to every visit, especially if you collect from different facilities.' },
      { item: 'Referral letter', note: 'District hospitals require a referral for non-emergency visits.' },
    ],
    contacts: {
      healthDeptPhone: '013 766 3753',
      healthDeptName: 'Mpumalanga Department of Health (Mbombela)',
      ambulance: '10177',
      complaintsLine: '013 766 3078',
    },
    districtHighlights: [
      { name: 'Ehlanzeni', context: 'Lowveld district covering Mbombela (Nelspruit), Bushbuckridge, and Nkomazi. Rob Ferreira Hospital is the provincial referral centre. Malaria endemic zone. Bushbuckridge has among the worst facility-to-population ratios in SA — large communities with few clinics.' },
      { name: 'Nkangala', context: 'Highveld coal belt covering eMalahleni (Witbank), Middelburg, and Standerton. Witbank Hospital handles high-volume trauma from mining injuries and road accidents on the N4. Air pollution from Eskom\'s coal-fired power stations is a major health determinant.' },
      { name: 'Gert Sibande', context: 'Southern Mpumalanga covering Ermelo, Standerton, and Piet Retief. Predominantly agricultural with seasonal worker influxes. Ermelo Hospital and Piet Retief Hospital are the main facilities. Long distances between towns make transport a critical barrier.' },
    ],
  },

  'North West': {
    intro: `North West province has about 4.1 million residents, with a healthcare landscape shaped by mining communities and rural villages. The 106 public facilities here include 49 clinics, 45 district hospitals, 9 community health centres, and 3 regional hospitals. Job Shimankana Tabane Hospital in Rustenburg and Klerksdorp-Tshepong Hospital complex serve the largest patient loads. The Bojanala Platinum District, centred on Rustenburg, has a highly mobile mining workforce that strains local clinic capacity. HIV prevalence is high across the province. Of the 106 facilities, 56 provide <a href="/services/emergency">24-hour services</a>.`,
    healthTips: [
      { title: 'Mining community health', text: 'Platinum miners in the Rustenburg-Brits corridor face elevated risks of silicosis and TB. If you work in mining, you are entitled to annual occupational health screening — but also get a free <a href="/services/tb">TB test</a> at your local clinic, as occupational health services do not always follow up.' },
      { title: 'HIV testing for mobile workers', text: 'North West has a large migrant workforce. If you move between facilities, ask about the CCMDD programme for <a href="/services/chronic-medication">chronic medication</a> collection at pickup points near your workplace, rather than your registered clinic.' },
      { title: 'Water-borne disease', text: 'Several North West municipalities have recurring water quality issues. If your tap water is discoloured or has been interrupted, boil water before drinking and watch for diarrhoea symptoms, especially in young children.' },
    ],
    whatToBring: [
      { item: 'South African ID or passport', note: 'For registration. Mine workers from neighbouring countries can use a valid work permit.' },
      { item: 'Clinic card', note: 'Essential for continuity of care, especially if you visit multiple clinics.' },
      { item: 'Road to Health booklet', note: 'For children under 5.' },
      { item: 'Chronic medication', note: 'Bring current prescriptions. If you are on ARVs and moving between clinics, request a transfer letter.' },
      { item: 'Occupational health records (if applicable)', note: 'Mining and industrial workers should bring their occupational health card or last medical certificate.' },
    ],
    contacts: {
      healthDeptPhone: '018 391 4320',
      healthDeptName: 'North West Department of Health (Mahikeng)',
      ambulance: '10177',
      complaintsLine: '018 391 4490',
    },
    districtHighlights: [
      { name: 'Bojanala Platinum', context: 'The platinum belt around Rustenburg, Brits, and Mogwase. Job Shimankana Tabane Hospital is the main referral. Highly mobile mining population creates unique challenges: workers from Lesotho, Mozambique, and Eastern Cape need continuity of care across facilities. Silicosis and TB rates are elevated.' },
      { name: 'Dr Kenneth Kaunda', context: 'Covers Klerksdorp, Potchefstroom, and Stilfontein. Klerksdorp-Tshepong Hospital complex is one of the largest in the province. Gold mining decline has left behind communities with high unemployment and persistent occupational lung disease.' },
      { name: 'Ngaka Modiri Molema', context: 'Mahikeng (Mafikeng) district — seat of the provincial government. Mahikeng Provincial Hospital is the main facility. Rural villages south of Mahikeng have limited access. Cross-border patient flow from Botswana occurs at facilities near the border.' },
    ],
  },

  'Northern Cape': {
    intro: `The Northern Cape is South Africa's largest province by area but its least populated, with only 1.3 million people across 373,000 km of arid terrain. The 25 public facilities listed here — 16 district hospitals, 5 clinics, 3 community health centres, and 1 satellite clinic — are spread thinly. Robert Mangaliso Sobukwe Hospital in Kimberley is the main referral centre. Distances between facilities are extreme: patients in the Namakwa or Green Kalahari regions may travel 200+ km to reach a hospital. Despite this, 18 of the 25 facilities offer <a href="/services/emergency">24-hour services</a>. For emergencies in remote areas, call 10177 — helicopter EMS is available for critical cases.`,
    healthTips: [
      { title: 'Travel planning for appointments', text: 'In the Northern Cape, missing a clinic appointment can mean waiting weeks for the next one. Plan transport in advance, and ask your clinic about telephonic consultations for follow-ups that do not require a physical exam.' },
      { title: 'Extreme heat and dehydration', text: 'Summer temperatures in the Northern Cape regularly exceed 40 degrees Celsius. Dehydration and heat stroke are real risks, especially for the elderly and children. Drink water constantly and seek shade — clinics see a spike in heat-related illness from November to February.' },
      { title: 'Foetal Alcohol Spectrum Disorder', text: 'Parts of the Northern Cape have among the highest FASD prevalence rates in the world. If you are pregnant, avoid all alcohol — there is no safe amount. Clinics can connect you with support programmes.' },
    ],
    whatToBring: [
      { item: 'South African ID or passport', note: 'For registration. In remote areas, clinic staff may accept alternative identification for emergency care.' },
      { item: 'Clinic card', note: 'Your medical record travels with you — critical when facilities are far apart.' },
      { item: 'Road to Health booklet', note: 'For children under 5.' },
      { item: 'Chronic medication and a cooler bag', note: 'Some medications (like insulin) degrade in extreme heat. Transport them in a cooler bag if travelling long distances.' },
      { item: 'Water and food for the journey', note: 'Hospital visits may require a full day of travel. Bring water and food, especially for children.' },
    ],
    contacts: {
      healthDeptPhone: '053 830 0500',
      healthDeptName: 'Northern Cape Department of Health (Kimberley)',
      ambulance: '10177',
      complaintsLine: '053 830 0571',
    },
    districtHighlights: [
      { name: 'Frances Baard', context: 'Kimberley district — the provincial capital and best-resourced area. Robert Mangaliso Sobukwe Hospital is the main referral centre for the entire province. Despite being the "urban" district, Kimberley itself has fewer than 300,000 people.' },
      { name: 'Namakwa', context: 'The most sparsely populated district in South Africa. Covers Springbok, Port Nolloth, and the Richtersveld. Some communities are 150+ km from the nearest hospital. Extreme heat in summer, cold desert nights in winter. Helicopter EMS is the only viable emergency response for some areas.' },
      { name: 'Pixley Ka Seme', context: 'Central Karoo covering De Aar, Colesberg, and Hanover. The N1 highway runs through this district, generating road accident trauma. Facilities are widely spaced across semi-arid terrain. FASD prevalence is among the highest nationally, linked to historical farm-worker alcohol payment practices.' },
    ],
  },

  'Western Cape': {
    intro: `The Western Cape has about 7.4 million residents, with most concentrated in the Cape Town metro. The 140 public facilities listed here include 73 clinics, 54 district hospitals, 10 community health centres, and 3 satellite clinics. Groote Schuur Hospital and Tygerberg Hospital are the tertiary referral centres for the province. While the Western Cape generally has better health infrastructure than most provinces, the Cape Flats and rural Overberg/West Coast areas face significant healthcare access challenges. Gang violence drives high trauma caseloads — Khayelitsha and Mitchell's Plain hospitals are among the busiest trauma units in the world. Of the 140 facilities, 56 operate 24 hours.`,
    healthTips: [
      { title: 'Trauma and violence', text: 'Cape Town has extremely high interpersonal violence rates, particularly on weekends. Know the location of your nearest 24-hour hospital with a trauma unit. Do not go to a small clinic for serious injuries — go directly to a hospital or call 10177.' },
      { title: 'TB in the Cape Flats', text: 'Khayelitsha and Delft have some of the highest <a href="/services/tb">TB rates</a> in the world, driven by overcrowded housing. If you live in a densely populated area and develop a persistent cough, get tested. TB is curable with 6 months of free treatment.' },
      { title: 'Substance abuse services', text: 'The Western Cape has the highest methamphetamine use rate in SA. If you or a family member needs help, ask your clinic for a referral to a Community Substance Abuse Centre — these are free and do not require medical aid.' },
    ],
    whatToBring: [
      { item: 'South African ID or passport', note: 'For registration. The Western Cape also accepts refugee permits and asylum documents.' },
      { item: 'Clinic card', note: 'Your patient-held record. The Western Cape is piloting electronic records at some facilities, but bring your card as backup.' },
      { item: 'Road to Health booklet', note: 'For children under 5 — immunisation and growth tracking.' },
      { item: 'Chronic medication list', note: 'Bring your current medication. The Western Cape has a well-established CCMDD programme — ask about pharmacy pickup points if queues at your clinic are long.' },
      { item: 'Referral letter (for hospital visits)', note: 'Groote Schuur and Tygerberg require referral from a clinic or district hospital for non-emergency care.' },
    ],
    contacts: {
      healthDeptPhone: '021 483 3455',
      healthDeptName: 'Western Cape Government Health (Cape Town)',
      ambulance: '10177',
      crisisLine: '021 726 8200 (Western Cape substance abuse helpline)',
      complaintsLine: '021 483 4474',
    },
    districtHighlights: [
      { name: 'City of Cape Town', context: 'The metro handles >70% of the province\'s patient load. Groote Schuur (home of the first heart transplant, 1967) and Tygerberg are the tertiary referral centres. Khayelitsha District Hospital, GF Jooste, and Mitchell\'s Plain are among the busiest trauma and emergency units in the world. Weekend violence spikes overwhelm emergency departments.' },
      { name: 'Cape Winelands', context: 'Covers Paarl, Stellenbosch, and Worcester. Paarl Hospital and Worcester Hospital are the main facilities. High FASD rates in farming communities linked to the historic "dop system" (paying workers with wine). Seasonal fruit-picking workers need mobile clinic access.' },
      { name: 'Garden Route', context: 'Southern Cape from Mossel Bay to Plettenberg Bay. George Hospital is the regional referral point. Tourism industry means seasonal population spikes that strain facilities. The N2 highway generates significant road trauma.' },
      { name: 'Overberg', context: 'Remote coastal and inland area from Hermanus to Bredasdorp. Otto du Plessis Hospital in Bredasdorp and Hermanus Hospital serve scattered rural communities. Limited specialist access — most specialist care requires travel to Cape Town (2+ hours).' },
    ],
    deepDive: [
      {
        heading: 'Healthcare infrastructure: best-resourced, still strained',
        body: `The Western Cape has the best public health infrastructure in South Africa by most measures — highest doctor-to-patient ratio (~1:2,100 in public facilities), highest nursing density, and the most functional equipment per facility. Yet the province is under severe strain from three forces: rapid in-migration (the Western Cape gains ~100,000 new residents annually, many from the Eastern Cape and beyond), a concentrated trauma burden that monopolises surgical capacity, and the ongoing TB epidemic. Groote Schuur Hospital — where Christiaan Barnard performed the world\'s first heart transplant in 1967 — remains the flagship tertiary facility, offering neurosurgery, transplant surgery, cardiology, and oncology. Tygerberg Hospital in Parow serves as the second tertiary referral centre and is the teaching hospital for Stellenbosch University\'s medical school. Red Cross War Memorial Children\'s Hospital in Rondebosch is the only dedicated public paediatric hospital in sub-Saharan Africa, handling complex paediatric surgery, oncology, and trauma referrals from across the continent. Below the tertiary level, district hospitals like Khayelitsha, Mitchell\'s Plain, Karl Bremer, and Victoria Hospital handle the bulk of emergency and maternity cases. Khayelitsha Hospital, opened in 2012, was purpose-built with a 300-bed capacity but regularly operates at 120-140% occupancy. The Western Cape\'s community health centres — such as Mitchells Plain CHC, Gugulethu CHC, Delft CHC, and Retreat CHC — function as extended-hour primary care facilities with X-ray, emergency stabilisation, and 24-hour maternity services, making them a critical layer between clinics and hospitals.`,
      },
      {
        heading: 'Transport and access: the metro-rural split',
        body: `Within Cape Town, public transport connections to health facilities are better than in any other South African metro, but still present barriers. MyCiTi buses serve the western corridor (Khayelitsha to CBD) and the northern suburbs, with stops near Groote Schuur, Karl Bremer, and several clinics. Golden Arrow buses and the Metrorail system cover broader routes, but Metrorail\'s unreliability — cancellation rates exceeding 30% on some lines — makes it a poor option for scheduled appointments. Minibus taxis remain the primary mode for patients from Khayelitsha, Gugulethu, and Nyanga, with typical fares of R15-25 per trip. The real access challenge is outside Cape Town. The Garden Route (Mossel Bay to Plettenberg Bay), West Coast (Citrusdal to Clanwilliam), and Central Karoo (Beaufort West, Laingsburg) have facility densities closer to the Northern Cape than to Cape Town. George Hospital is the only regional referral point for the entire Garden Route — patients from Knysna or Plettenberg Bay needing specialist care must travel there first, then potentially onward to Cape Town (5+ hours by road). Emergency medical services in the Western Cape are the most developed in the country: the province operates the only fully functional helicopter EMS programme in SA, with bases in Cape Town, Worcester, and George. Response times in the Cape Town metro average 25-35 minutes, but in the Central Karoo, ground ambulances can take 2+ hours to reach remote farms and settlements.`,
      },
      {
        heading: 'TB, trauma, and substance abuse: the Western Cape triad',
        body: `The Western Cape\'s disease burden is shaped by three intersecting crises that share underlying drivers. TB incidence in the province is roughly 681 per 100,000 — the highest in South Africa and among the highest globally. Khayelitsha and the surrounding Cape Flats suburbs (Delft, Mfuleni, Philippi) consistently record incidence above 1,500 per 100,000, driven by overcrowded informal housing where 5-8 people share a single room, creating ideal conditions for airborne transmission. Drug-resistant TB is a particular problem: the Western Cape has the highest MDR-TB case count nationally, and Brooklyn Chest Hospital in Ysterplaat is the province\'s main DR-TB treatment facility. Interpersonal violence makes the Western Cape the "trauma capital" of South Africa. Cape Town\'s murder rate of ~66 per 100,000 is roughly 10x the global average. The trauma units at Groote Schuur, Tygerberg, Khayelitsha, and Karl Bremer hospitals operate in what trauma surgeons describe as "mass casualty mode" every weekend, with gunshot and stab wounds accounting for 60-70% of weekend surgical admissions. This trauma load diverts surgical capacity from elective procedures — patients awaiting hip replacements, cataract surgery, or hernia repair routinely wait 12-24 months. Methamphetamine ("tik") abuse is the third pillar of the crisis. The Western Cape has the highest methamphetamine prevalence in Africa — an estimated 6-8% of the adult population in the Cape Flats has used the drug. Tik drives a secondary wave of violence, psychiatric emergencies, and child neglect. Valkenberg Psychiatric Hospital and Lentegeur Hospital (Mitchell\'s Plain) are the main acute psychiatric admission points, both operating well above capacity. For patients seeking help, the Western Cape\'s network of 26 community substance abuse centres offers free outpatient counselling and referral to inpatient treatment — ask at any clinic for the nearest centre.`,
      },
    ],
  },
};
