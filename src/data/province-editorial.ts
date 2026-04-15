/**
 * Province-level editorial content for SA Clinic Finder.
 * Each province gets an intro paragraph, health tips, and a "what to bring" section.
 * All content follows Kaizen standard: every sentence creates new information.
 */

export interface ProvinceEditorial {
  intro: string;
  healthTips: { title: string; text: string }[];
  whatToBring: { item: string; note: string }[];
}

export const PROVINCE_EDITORIAL: Record<string, ProvinceEditorial> = {
  'Eastern Cape': {
    intro: `The Eastern Cape is home to roughly 6.7 million people, many in deep rural areas where the nearest district hospital can be over 60 km away. The province has 122 public health facilities listed here, including 78 district hospitals and 1 tertiary hospital (Nelson Mandela Academic Hospital in Mthatha). TB remains a major burden — the OR Tambo and Buffalo City districts consistently report some of the highest TB incidence rates nationally. For life-threatening emergencies, the closest 24-hour casualty is usually a district hospital; 82 of the 122 facilities here operate around the clock. If you are in a rural area without transport, call the provincial ambulance service at 10177.`,
    healthTips: [
      { title: 'TB screening', text: 'Eastern Cape has among the highest TB rates in the country. If you have a cough lasting more than two weeks, get screened — sputum tests are free at any clinic. Treatment is 6 months and fully covered.' },
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
  },

  'Free State': {
    intro: `The Free State serves about 2.9 million people across a vast, sparsely populated interior. With 37 public facilities — 20 clinics, 16 district hospitals, and 1 community health centre — coverage is thin. Universitas Academic Hospital in Bloemfontein is the province's only tertiary facility and the referral point for complex cases from across the province. The Free State has a disproportionately high HIV prevalence (roughly 25% of adults) and some of the highest maternal mortality rates in South Africa. For emergencies, 16 facilities offer 24-hour services. Long distances between towns mean that keeping clinic appointments on time takes planning.`,
    healthTips: [
      { title: 'HIV testing and ARVs', text: 'With one of the highest adult HIV prevalence rates in SA, regular testing matters. All clinics offer free rapid HIV tests. If positive, ARV treatment can start the same day under the Universal Test and Treat policy.' },
      { title: 'Farm worker access', text: 'If you work on a farm far from town, you can request chronic medication collection at the nearest clinic rather than travelling to the hospital monthly. Ask about the Central Chronic Medicine Dispensing and Distribution (CCMDD) programme.' },
      { title: 'Winter respiratory illness', text: 'Free State winters are harsh — temperatures in Bloemfontein regularly drop below zero. Pneumonia and flu hospitalisations peak from May to August. Get a flu vaccine at your clinic from March onwards, especially if you are over 65 or HIV-positive.' },
    ],
    whatToBring: [
      { item: 'South African ID or passport', note: 'Needed for file creation. Asylum seekers can use a Section 22 permit.' },
      { item: 'Clinic card', note: 'Your patient record. Bring it to every visit so your history is up to date.' },
      { item: 'Road to Health booklet', note: 'For all children under 5 — immunisation schedules are tracked here.' },
      { item: 'Chronic medication or prescription', note: 'Bring current medication so clinicians can verify doses and avoid duplication.' },
      { item: 'Referral letter', note: 'Needed for hospital visits unless presenting at casualty with an emergency.' },
    ],
  },

  'Gauteng': {
    intro: `Gauteng is South Africa's economic hub and most densely populated province, with over 16 million residents crammed into the smallest provincial land area. The 281 public facilities here — 192 clinics, 78 district hospitals, 8 community health centres, and 2 tertiary hospitals — serve more patients per day than any other province. Charlotte Maxeke Johannesburg Academic Hospital and Steve Biko Academic Hospital in Pretoria handle the most complex referrals. Despite having the most facilities, demand far outstrips supply: some Gauteng clinics see 300+ patients per day. Of the 281 facilities listed, 106 offer 24-hour services. For emergencies, dial 10177 for the provincial ambulance.`,
    healthTips: [
      { title: 'Arrive early', text: 'High-volume Gauteng clinics open at 07:00. Patients who arrive by 06:30 are typically seen before midday. Afternoon queues often mean returning the next day.' },
      { title: 'Air quality and asthma', text: 'Gauteng has some of SA\'s worst air quality, particularly in the Vaal Triangle and Johannesburg South. If you or your child has asthma, ensure your clinic has issued a spacer device and a written action plan.' },
      { title: 'Mental health access', text: 'Gauteng has the most community mental health services in SA, but demand still exceeds supply. If you need counselling or psychiatric follow-up, ask your clinic for a referral to the nearest community health centre with a psychologist.' },
    ],
    whatToBring: [
      { item: 'South African ID, passport, or asylum permit', note: 'Registration requires identification. Foreign nationals are entitled to emergency care and children to full PHC services regardless of documentation.' },
      { item: 'Clinic card', note: 'Gauteng clinics are high-volume — your card helps staff pull your file quickly.' },
      { item: 'Road to Health booklet', note: 'Required for children under 5 at every visit.' },
      { item: 'Chronic medication list', note: 'Bring current medication, especially if transferring between facilities — duplicate prescriptions are a common problem in Gauteng.' },
      { item: 'Proof of address (for new registration)', note: 'Some Gauteng clinics request this for first-time registration, though it is not legally required for care.' },
    ],
  },

  'KwaZulu-Natal': {
    intro: `KwaZulu-Natal (KZN) is South Africa's second most populous province at roughly 11.5 million people, with vast rural areas in the former Transkei and Zululand where access to healthcare is a daily challenge. The province has 201 public facilities in this directory — 117 district hospitals, 73 clinics, 6 community health centres, and 5 regional hospitals. KZN carries one of the highest HIV burdens globally: the uMgungundlovu and eThekwini districts have adult prevalence rates exceeding 30%. For emergencies, 127 facilities are open 24 hours. Inkosi Albert Luthuli Central Hospital in Durban is the province's flagship facility for complex trauma and specialist surgery.`,
    healthTips: [
      { title: 'HIV and TB co-infection', text: 'KZN has extremely high rates of HIV-TB co-infection. If you are HIV-positive, ask your clinic about Isoniazid Preventive Therapy (IPT) to reduce your TB risk by up to 60%. It is a 12-month course of one daily tablet.' },
      { title: 'Malaria in northern KZN', text: 'The Jozini, uMhlabuyalingana, and Big Five Hlabisa areas are malaria zones, especially from September to May. Symptoms include fever, chills, and headache 7-30 days after a mosquito bite. Go to a clinic immediately — malaria is curable if caught early but fatal if delayed.' },
      { title: 'Maternal health', text: 'KZN has high maternal mortality, particularly in rural districts. Pregnant women should register at an antenatal clinic before 20 weeks. All antenatal visits, delivery, and postnatal check-ups are free at public facilities.' },
    ],
    whatToBring: [
      { item: 'South African ID or passport', note: 'For patient registration. Undocumented mothers will still receive maternity care.' },
      { item: 'Clinic card', note: 'Your patient-held record for tracking visits and prescriptions.' },
      { item: 'Road to Health booklet', note: 'Essential for children under 5 — tracks immunisations and growth.' },
      { item: 'Chronic medication or repeat prescription', note: 'KZN has CCMDD pickup points at some clinics — ask about external collection if travel is difficult.' },
      { item: 'Maternity case record (if pregnant)', note: 'Issued at your first antenatal visit. Carry it at all times during pregnancy, including to the delivery facility.' },
    ],
  },

  'Limpopo': {
    intro: `Limpopo is one of South Africa's most rural provinces, with 5.9 million residents spread across bushveld and mountains where villages may be 40+ km from the nearest health facility. The 95 public facilities listed here include 46 district hospitals, 46 clinics, and 3 community health centres. Pietersburg (Polokwane) Hospital is the main referral centre. Limpopo faces a severe shortage of doctors — some district hospitals operate with fewer than 5 medical officers. Malaria is endemic in the Vhembe and Mopani districts near the Mozambique and Zimbabwe borders. Of the 95 facilities, 55 offer 24-hour services. For ambulances, call 10177 — response times in rural Limpopo can exceed 2 hours.`,
    healthTips: [
      { title: 'Malaria prevention', text: 'Vhembe and Mopani districts are high-risk malaria areas from September to May. Sleep under a treated mosquito net, use repellent after dusk, and go to the nearest clinic within 24 hours if you develop fever. Malaria rapid tests and treatment are free.' },
      { title: 'Diarrhoeal disease in children', text: 'Limpopo has high rates of childhood diarrhoea, linked to water quality in rural areas. If your child has watery stools for more than a day, start oral rehydration solution immediately and get to a clinic — dehydration kills quickly in children under 5.' },
      { title: 'Traditional medicine interactions', text: 'Many Limpopo communities use traditional remedies alongside clinic treatment. Inform your clinician about any traditional medicines you are taking — some interact dangerously with ARVs and TB drugs.' },
    ],
    whatToBring: [
      { item: 'South African ID or passport', note: 'For registration. Keep a photocopy at home in case the original is lost.' },
      { item: 'Clinic card', note: 'Rural clinics may not have electronic records — your card is your medical history.' },
      { item: 'Road to Health booklet', note: 'For children under 5. Limpopo has mobile immunisation teams — check dates with your nearest clinic.' },
      { item: 'Chronic medication and pill bottles', note: 'Bring everything you are currently taking, including traditional medicines, so the clinician has the full picture.' },
      { item: 'Referral letter', note: 'Required for hospital visits. In Limpopo, some hospitals are hours apart — an incorrect referral means wasted travel.' },
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
  },

  'North West': {
    intro: `North West province has about 4.1 million residents, with a healthcare landscape shaped by mining communities and rural villages. The 106 public facilities here include 49 clinics, 45 district hospitals, 9 community health centres, and 3 regional hospitals. Job Shimankana Tabane Hospital in Rustenburg and Klerksdorp-Tshepong Hospital complex serve the largest patient loads. The Bojanala Platinum District, centred on Rustenburg, has a highly mobile mining workforce that strains local clinic capacity. HIV prevalence is high across the province. Of the 106 facilities, 56 provide 24-hour services.`,
    healthTips: [
      { title: 'Mining community health', text: 'Platinum miners in the Rustenburg-Brits corridor face elevated risks of silicosis and TB. If you work in mining, you are entitled to annual occupational health screening — but also get a free TB test at your local clinic, as occupational health services do not always follow up.' },
      { title: 'HIV testing for mobile workers', text: 'North West has a large migrant workforce. If you move between facilities, ask about the CCMDD programme for chronic medication collection at pickup points near your workplace, rather than your registered clinic.' },
      { title: 'Water-borne disease', text: 'Several North West municipalities have recurring water quality issues. If your tap water is discoloured or has been interrupted, boil water before drinking and watch for diarrhoea symptoms, especially in young children.' },
    ],
    whatToBring: [
      { item: 'South African ID or passport', note: 'For registration. Mine workers from neighbouring countries can use a valid work permit.' },
      { item: 'Clinic card', note: 'Essential for continuity of care, especially if you visit multiple clinics.' },
      { item: 'Road to Health booklet', note: 'For children under 5.' },
      { item: 'Chronic medication', note: 'Bring current prescriptions. If you are on ARVs and moving between clinics, request a transfer letter.' },
      { item: 'Occupational health records (if applicable)', note: 'Mining and industrial workers should bring their occupational health card or last medical certificate.' },
    ],
  },

  'Northern Cape': {
    intro: `The Northern Cape is South Africa's largest province by area but its least populated, with only 1.3 million people across 373,000 km of arid terrain. The 25 public facilities listed here — 16 district hospitals, 5 clinics, 3 community health centres, and 1 satellite clinic — are spread thinly. Robert Mangaliso Sobukwe Hospital in Kimberley is the main referral centre. Distances between facilities are extreme: patients in the Namakwa or Green Kalahari regions may travel 200+ km to reach a hospital. Despite this, 18 of the 25 facilities offer 24-hour services. For emergencies in remote areas, call 10177 — helicopter EMS is available for critical cases.`,
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
  },

  'Western Cape': {
    intro: `The Western Cape has about 7.4 million residents, with most concentrated in the Cape Town metro. The 140 public facilities listed here include 73 clinics, 54 district hospitals, 10 community health centres, and 3 satellite clinics. Groote Schuur Hospital and Tygerberg Hospital are the tertiary referral centres for the province. While the Western Cape generally has better health infrastructure than most provinces, the Cape Flats and rural Overberg/West Coast areas face significant healthcare access challenges. Gang violence drives high trauma caseloads — Khayelitsha and Mitchell's Plain hospitals are among the busiest trauma units in the world. Of the 140 facilities, 56 operate 24 hours.`,
    healthTips: [
      { title: 'Trauma and violence', text: 'Cape Town has extremely high interpersonal violence rates, particularly on weekends. Know the location of your nearest 24-hour hospital with a trauma unit. Do not go to a small clinic for serious injuries — go directly to a hospital or call 10177.' },
      { title: 'TB in the Cape Flats', text: 'Khayelitsha and Delft have some of the highest TB rates in the world, driven by overcrowded housing. If you live in a densely populated area and develop a persistent cough, get tested. TB is curable with 6 months of free treatment.' },
      { title: 'Substance abuse services', text: 'The Western Cape has the highest methamphetamine use rate in SA. If you or a family member needs help, ask your clinic for a referral to a Community Substance Abuse Centre — these are free and do not require medical aid.' },
    ],
    whatToBring: [
      { item: 'South African ID or passport', note: 'For registration. The Western Cape also accepts refugee permits and asylum documents.' },
      { item: 'Clinic card', note: 'Your patient-held record. The Western Cape is piloting electronic records at some facilities, but bring your card as backup.' },
      { item: 'Road to Health booklet', note: 'For children under 5 — immunisation and growth tracking.' },
      { item: 'Chronic medication list', note: 'Bring your current medication. The Western Cape has a well-established CCMDD programme — ask about pharmacy pickup points if queues at your clinic are long.' },
      { item: 'Referral letter (for hospital visits)', note: 'Groote Schuur and Tygerberg require referral from a clinic or district hospital for non-emergency care.' },
    ],
  },
};
