/**
 * Service-level editorial content for SA Clinic Finder.
 * Each service gets an intro, what-to-expect steps, eligibility notes, and a related guide link.
 * All content follows Kaizen standard: every sentence creates new information that didn't exist before.
 */

export interface ServiceEditorial {
  intro: string;
  whatToExpect: { step: string; detail: string }[];
  eligibility: string;
  guideSlug?: string;
  guideName?: string;
  keyFact: string;
}

export const SERVICE_EDITORIAL: Record<string, ServiceEditorial> = {
  arv_treatment: {
    intro: `South Africa runs the world's largest antiretroviral treatment programme — over 5.7 million people on ARVs as of 2024. Since September 2017, all public clinics offer same-day initiation: you can test positive and start treatment the same day, without waiting for blood results. The standard first-line regimen is TLD (tenofovir + lamivudine + dolutegravir), a single pill taken once daily. Viral suppression rates in SA's public programme exceed 90% for patients who stay on treatment — matching private-sector outcomes. Treatment is lifelong, free, and available at every clinic listed below.`,
    whatToExpect: [
      { step: 'HIV test (15 minutes)', detail: 'A rapid finger-prick test with results in 15 minutes. Two tests are done — if both are reactive, you are HIV positive. Testing is confidential and can be anonymous.' },
      { step: 'Same-day initiation assessment', detail: 'A nurse checks for TB symptoms, takes blood for baseline tests (CD4, creatinine, hepatitis B), and assesses readiness. If no red flags, you start ARVs the same day.' },
      { step: 'Start TLD (one pill, once daily)', detail: 'You receive a 1-month supply. Take it at the same time every day. Common early side effects — insomnia, headache — usually resolve within 2-4 weeks.' },
      { step: 'Follow-up at 1 month, 3 months', detail: 'Check for side effects, review adherence, repeat blood tests. By 3 months, 85% of patients achieve viral suppression.' },
      { step: 'Ongoing collection every 2-3 months', detail: 'Once stable (viral load undetectable for 12 months), you can collect medication from a CCMDD pickup point instead of the clinic.' },
    ],
    eligibility: 'Every person living with HIV in South Africa is eligible for ARVs, regardless of CD4 count, nationality, or documentation status. Children, pregnant women, and people with TB are fast-tracked. There is no means test — treatment is free.',
    guideSlug: 'how-to-get-arvs',
    guideName: 'How to Get ARVs at a Public Clinic',
    keyFact: 'South Africa distributes ARVs to more people than any other country — more than the next three countries combined.',
  },

  tb_treatment: {
    intro: `South Africa has the sixth-highest TB incidence in the world and the highest burden of HIV/TB co-infection. In 2023, an estimated 300,000 new TB cases occurred, with about 56,000 deaths — many of them preventable. Diagnosis has improved dramatically since the rollout of GeneXpert machines: results now come back in 2 hours instead of 6-8 weeks with sputum microscopy. Treatment is free and provided under Directly Observed Therapy (DOTS) at every public clinic. The standard regimen is 6 months (2 months intensive + 4 months continuation) and cures over 85% of drug-sensitive cases.`,
    whatToExpect: [
      { step: 'Sputum test or GeneXpert', detail: 'You cough up sputum into a container. GeneXpert gives results in 2 hours and also detects rifampicin resistance. Not all clinics have GeneXpert — if yours does not, the sample is sent to a central lab (48-72 hours).' },
      { step: 'Start treatment (RHZE regimen)', detail: 'Four drugs for 2 months (rifampicin, isoniazid, pyrazinamide, ethambutol), then two drugs for 4 months (rifampicin, isoniazid). All free.' },
      { step: 'DOTS — daily observed doses', detail: 'For the first 2 months, a treatment supporter watches you take each dose. This can be a clinic nurse, community health worker, family member, or workplace colleague.' },
      { step: 'Monthly sputum checks', detail: 'Month 2 and month 5 sputum tests confirm the bacteria are clearing. If month 2 is still positive, the intensive phase may be extended.' },
      { step: 'Completion at 6 months', detail: 'If both follow-up sputums are negative and you have taken all doses, you are declared cured. Do not stop early — incomplete treatment breeds drug resistance.' },
    ],
    eligibility: 'Anyone with symptoms (cough >2 weeks, weight loss, night sweats, fever) should be screened. Treatment is free for everyone — citizens, foreign nationals, undocumented persons. TB is a notifiable disease and treating it protects the entire community.',
    guideSlug: 'tb-treatment-what-to-expect',
    guideName: 'TB Treatment — What to Expect',
    keyFact: 'GeneXpert reduced TB diagnosis time from 6 weeks to 2 hours — South Africa now has over 300 GeneXpert machines in public facilities.',
  },

  maternity_antenatal: {
    intro: `All maternity care in the public sector is free — from the first antenatal booking visit through delivery and postnatal check-ups. South Africa's maternal mortality ratio has dropped from 176 per 100,000 live births in 2012 to approximately 100 in 2023, largely due to expanded access to antenatal care and prevention of mother-to-child HIV transmission (PMTCT). The guideline is a minimum of 8 antenatal visits, with the first ideally before 12 weeks of pregnancy. Most uncomplicated deliveries happen at midwife obstetric units (MOUs) or district hospitals; complications are referred to regional or tertiary hospitals.`,
    whatToExpect: [
      { step: 'Booking visit (before 12 weeks)', detail: 'Full assessment: blood pressure, weight, urine test, HIV test, syphilis screening (RPR), blood group and Rh factor, haemoglobin. You receive a maternity case record.' },
      { step: 'Ongoing antenatal visits (8 total)', detail: 'Monthly until 28 weeks, then every 2 weeks until 36 weeks, then weekly. Each visit: BP, urine, fundal height, baby heart rate. Ultrasound at 18-22 weeks where available.' },
      { step: 'PMTCT for HIV-positive mothers', detail: 'If HIV-positive: start or continue ARVs immediately. Baby receives nevirapine syrup from birth. With treatment, transmission risk drops below 2%.' },
      { step: 'Delivery', detail: 'Present at the facility when contractions are 5 minutes apart or your water breaks. Bring your maternity case record, ID, baby clothes, and sanitary pads. Caesarean sections are available at district hospitals and above.' },
      { step: 'Postnatal care', detail: '6-hour, 3-day, and 6-week check-ups for mother and baby. Baby BCG and oral polio vaccine given at birth. Breastfeeding support and contraception counselling.' },
    ],
    eligibility: 'All pregnant women, regardless of nationality, documentation, or medical aid status. You do not need a referral — walk into any clinic or MOU offering maternity services. Minors (under 18) have full rights to maternity care without parental consent.',
    guideSlug: 'free-maternity-care',
    guideName: 'Free Maternity Care at Public Hospitals',
    keyFact: 'South Africa reduced mother-to-child HIV transmission from 25% in 2002 to under 2% in 2024 through the PMTCT programme.',
  },

  chronic_medication: {
    intro: `Non-communicable diseases (NCDs) are now South Africa's second-leading cause of death. Hypertension alone affects 1 in 3 adults, and diabetes prevalence has doubled in 15 years. Public clinics manage these conditions for free — including consultation, blood tests, and all medication on the Essential Drugs List. The biggest challenge is not access but adherence: studies show only 50-60% of chronic patients in the public sector take medication consistently. The CCMDD programme (Central Chronic Medicine Dispensing and Distribution) now serves 4.9 million patients, allowing stable chronic patients to collect medication from convenient pickup points instead of waiting at the clinic.`,
    whatToExpect: [
      { step: 'Diagnosis and baseline tests', detail: 'A doctor or nurse diagnoses the condition and runs baseline blood work (fasting glucose, HbA1c for diabetes; creatinine and lipids for hypertension). Treatment starts immediately.' },
      { step: 'Monthly medication collection', detail: 'Return monthly or bi-monthly to collect pre-packaged medication. Quick vital signs check (BP, weight) at each visit.' },
      { step: 'Quarterly review', detail: 'Every 3 months: deeper consultation, adherence review, dose adjustment if needed, possible blood tests.' },
      { step: 'Annual comprehensive review', detail: 'Full blood panel, eye screening referral (diabetes), foot exam, prescription renewal for the year.' },
      { step: 'CCMDD enrolment (after 6-12 months)', detail: 'Once stable, your medication can be collected from a pharmacy, community pickup point, or adherence club — no clinic queue.' },
    ],
    eligibility: 'Anyone diagnosed with a chronic condition at a public facility. The most common: hypertension, diabetes (type 2), epilepsy, asthma, depression, and HIV (managed as a chronic condition). No means test — medication is free.',
    guideSlug: 'chronic-medication-management',
    guideName: 'Chronic Medication at Public Clinics',
    keyFact: 'CCMDD serves 4.9 million patients — collecting chronic meds from a pharmacy or pickup point instead of waiting at the clinic.',
  },

  emergency_24h: {
    intro: `Section 27 of the South African Constitution guarantees the right to emergency medical treatment — no facility can turn you away, regardless of your ability to pay or documentation status. Emergency departments use the South African Triage Scale (SATS) to prioritise patients: red (immediate, life-threatening), orange (very urgent, <10 min), yellow (urgent, <60 min), green (routine, may wait hours). Arriving by ambulance does not guarantee faster treatment — triage is based on clinical severity, not mode of arrival. The national emergency number is 10177 for public ambulances, or 112 from any mobile phone.`,
    whatToExpect: [
      { step: 'Triage assessment', detail: 'A trained triage nurse assesses you within minutes of arrival and assigns a colour code. Red = immediate resuscitation. Green = non-urgent, you may wait several hours.' },
      { step: 'Treatment', detail: 'Emergency stabilisation, pain management, diagnostics (X-ray, blood tests, ECG). The goal is to stabilise, not necessarily to complete treatment — you may be admitted or referred.' },
      { step: 'Admission or discharge', detail: 'If your condition requires monitoring or surgery, you are admitted to a ward. If you are stable, you are discharged with a follow-up date and medication.' },
      { step: 'Referral if needed', detail: 'District hospitals handle most emergencies. If you need specialist care (neurosurgery, burns, ICU), you are transferred to a regional or tertiary hospital.' },
    ],
    eligibility: 'Everyone. No exceptions. Emergency treatment cannot be refused or delayed for documentation, payment, or any other reason. This is a constitutional right under Section 27(3).',
    guideSlug: 'medical-emergency-guide',
    guideName: 'What to Do in a Medical Emergency',
    keyFact: 'The SA Triage Scale (SATS) is now used in 50+ countries — it was developed in Cape Town and is optimised for resource-limited settings.',
  },

  dental: {
    intro: `South Africa has approximately 1 public dentist per 10,000 people — compared to 1 per 2,000 in the private sector. This shortage means long waiting times for non-emergency dental care, but emergency treatment (extractions, abscess drainage, severe pain) is available at most facilities listed below. The National Oral Health Strategy prioritises preventive care for children and emergency treatment for adults. Dental training hospitals attached to universities (Wits, Pretoria, Western Cape, KZN, Sefako Makgatho, Limpopo) often have shorter waiting times because dental students need patients — and treatment is supervised by qualified dentists.`,
    whatToExpect: [
      { step: 'Walk-in or appointment', detail: 'Emergency dental: walk in before 07:00 — slots fill fast. Routine care: ask reception to add you to the dental waiting list. Wait times vary from weeks to months.' },
      { step: 'Assessment', detail: 'A dental therapist or dentist examines your teeth, may take X-rays, and recommends treatment. Most emergency visits result in extraction or temporary filling.' },
      { step: 'Treatment', detail: 'Extractions, basic fillings, scaling, and abscess drainage are done on-site. Dentures require multiple visits over months. Complex procedures (root canals, crowns) are generally not available.' },
      { step: 'Follow-up', detail: 'Post-extraction check-up after 1 week. Denture patients: fitting, adjustments, and possible rebasing at 3-6 month intervals.' },
    ],
    eligibility: 'All South African residents. Children are prioritised for preventive care. Emergency dental treatment is free for everyone, including foreign nationals. For routine care, you may be asked for an ID and placed on a waiting list.',
    guideSlug: 'dental-care-public-clinics',
    guideName: 'Dental Care at Public Clinics',
    keyFact: 'Dental training hospitals often have shorter waits — students need patients, and all treatment is supervised by qualified dentists.',
  },

  mental_health: {
    intro: `One in three South Africans will experience a mental health condition in their lifetime, but fewer than 25% receive any treatment. The Mental Health Care Act (2002) guarantees the right to mental health services at every level of the public health system. At primary clinic level, nurses can screen for depression and anxiety using validated tools (PHQ-9, GAD-7) and prescribe first-line medication (fluoxetine for depression, amitriptyline for chronic pain with depression). Specialist referral — psychologist, psychiatrist, occupational therapist — is available at district and regional hospitals. Crisis support is available 24/7 through SADAG (South African Depression and Anxiety Group) at 0800 567 567.`,
    whatToExpect: [
      { step: 'Screening at clinic level', detail: 'Tell the nurse you are struggling with mood, anxiety, sleep, or thoughts of self-harm. They will use a screening tool (PHQ-9 for depression, GAD-7 for anxiety) — this takes 5 minutes.' },
      { step: 'Diagnosis and first-line treatment', detail: 'Mild-moderate depression/anxiety: medication (fluoxetine 20mg daily) + counselling if available. Severe cases: same-day referral to hospital.' },
      { step: 'Counselling', detail: 'Some clinics have lay counsellors or social workers. Hospital-level care includes clinical psychologists. Coverage is inconsistent — ask what is available at your facility.' },
      { step: 'Ongoing management', detail: 'Medication review every 3 months for the first year, then every 6 months. Treatment continues minimum 12 months after symptoms resolve. Stopping early increases relapse risk by 50%.' },
    ],
    eligibility: 'Everyone. Mental health is a constitutional right. You do not need a referral to access primary mental health care at a clinic. For psychiatric admission, a referral is usually required unless it is a psychiatric emergency (psychosis, active suicidal intent).',
    guideSlug: 'mental-health-services',
    guideName: 'Mental Health Services at Public Clinics',
    keyFact: 'SADAG crisis line (0800 567 567) handles over 600 calls per day — it is free, confidential, and available 24/7.',
  },

  child_health: {
    intro: `South Africa's under-5 mortality rate has dropped from 56 per 1,000 live births in 2009 to 28 in 2023, driven by expanded immunisation coverage, PMTCT, and nutrition programmes. Every child under 6 is entitled to free healthcare at any public facility — no means test, no documentation requirement. The Road to Health booklet (issued at birth) is the child's medical passport: it tracks immunisations, growth curves, and developmental milestones. The Integrated School Health Programme (ISHP) provides screening, deworming, and referrals at schools, though coverage remains patchy. Malnutrition screening uses mid-upper arm circumference (MUAC) — any child with MUAC below 11.5cm is classified as severe acute malnutrition and requires hospital admission.`,
    whatToExpect: [
      { step: 'Well-baby visits (birth to 5 years)', detail: 'Monthly for the first year, then at 18 months, 2 years, 3 years, 4 years, 5 years. Each visit: weight, length/height, head circumference, developmental milestones, vitamin A supplementation, deworming.' },
      { step: 'Immunisation (EPI-SA schedule)', detail: 'Vaccines from birth to 12 years. Bring the Road to Health booklet every time. Catch-up doses available for missed vaccines — there is no maximum age for catch-up.' },
      { step: 'Growth monitoring and nutrition', detail: 'Weight-for-age and height-for-age plotted on WHO growth curves. Children falling below -2 z-scores are flagged for nutritional supplementation. Children below -3 z-scores are referred to hospital.' },
      { step: 'Sick child assessment (IMCI)', detail: 'Integrated Management of Childhood Illness (IMCI) protocol: a systematic check for danger signs (unable to drink, persistent vomiting, convulsions, lethargy). Any danger sign = immediate referral.' },
    ],
    eligibility: 'All children under 6 receive completely free healthcare. Children 6-18 also qualify for free care at the facility level. No ID or documentation is required for a child to receive treatment. Bring the Road to Health booklet if you have it.',
    guideSlug: 'child-immunisation-schedule',
    guideName: 'Child Immunisation Schedule (South Africa)',
    keyFact: 'Under-5 mortality halved in 14 years (56 to 28 per 1,000) — immunisation and PMTCT were the biggest drivers.',
  },

  family_planning: {
    intro: `Every public clinic in South Africa offers free family planning services — no medical aid, no referral, and no parental consent needed for anyone aged 12 or older (Children's Act, Section 134). The most popular method is the injectable (Depo-Provera or Nur-Isterate), used by over 40% of South African contraception users. Since 2014, the subdermal implant (Implanon NXT) has been available free at public clinics — it lasts 3 years and is 99.95% effective, making it the most effective reversible method available. South Africa's unmet need for contraception is estimated at 18% — meaning nearly 1 in 5 women who want to avoid pregnancy are not using any method.`,
    whatToExpect: [
      { step: 'Walk in — no appointment needed', detail: 'Tell the nurse you want family planning. No referral needed. Teens aged 12+ do not need parental consent or notification.' },
      { step: 'Brief health check', detail: 'Blood pressure, pregnancy test (to confirm you are not currently pregnant), brief medical history. Takes 10-15 minutes.' },
      { step: 'Choose your method', detail: 'The nurse explains all options: injectable (2-3 monthly), pill (daily), implant (3 years), IUD (5-10 years), condoms, emergency contraception. No pressure — you can change your mind at any time.' },
      { step: 'Start the same day', detail: 'Most methods can begin immediately. Implant and IUD insertion require a trained provider — if your clinic does not have one, they refer you.' },
      { step: 'Follow-up at 3 months', detail: 'Check-up to confirm the method is working and you are comfortable. Ongoing: return for injections every 2-3 months, or for pill refills. Implant and IUD: no return needed until removal.' },
    ],
    eligibility: 'Anyone who wants contraception. No age minimum for condoms. Age 12+ for hormonal methods and implant (no parental consent). Men can access condoms, STI testing, VMMC, and vasectomy referral.',
    guideSlug: 'family-planning-contraception',
    guideName: 'Family Planning & Contraception',
    keyFact: 'The Implanon implant is free at public clinics but costs R3,000-R5,000 privately — it lasts 3 years and is 99.95% effective.',
  },

  immunisation: {
    intro: `South Africa's Expanded Programme on Immunisation (EPI-SA) provides free vaccines from birth through childhood, protecting against 13 diseases. National immunisation coverage for the primary series is approximately 82% — above the African average but below the 95% target needed for herd immunity. The programme includes vaccines not available in many African countries: rotavirus (preventing diarrhoeal death, the leading killer of under-5s), pneumococcal conjugate (preventing pneumonia and meningitis), and HPV vaccine for girls in Grade 5 (preventing cervical cancer, which kills 3,000 South African women annually). Catch-up immunisation is available at any age — there is no "too late" for missed vaccines.`,
    whatToExpect: [
      { step: 'Bring the Road to Health booklet', detail: 'The nurse checks which vaccines are due based on the child\'s age and vaccination history. No appointment needed — walk in during clinic hours.' },
      { step: 'Vaccination', detail: 'Most vaccines are injections in the thigh (infants) or upper arm (older children). Oral vaccines: rotavirus and polio drops. HPV is given at school (Grade 5 girls) or at the clinic.' },
      { step: 'Wait 15 minutes after injection', detail: 'Standard precaution for allergic reactions (extremely rare: 1 in 1 million). The nurse observes the child before you leave.' },
      { step: 'Record in Road to Health booklet', detail: 'The nurse stamps and dates each vaccine given. Keep this booklet — it is your child\'s vaccination proof for school registration and future healthcare.' },
    ],
    eligibility: 'All children in South Africa, regardless of nationality, documentation, or medical aid status. Adults can receive catch-up vaccines (hepatitis B, tetanus, flu) at most clinics. Pregnant women receive tetanus toxoid.',
    guideSlug: 'child-immunisation-schedule',
    guideName: 'Child Immunisation Schedule (South Africa)',
    keyFact: 'The HPV vaccine (given free at schools) prevents cervical cancer — which kills 3,000 South African women every year.',
  },

  hiv_testing: {
    intro: `South Africa has 7.8 million people living with HIV — the largest HIV-positive population in the world. But the country also leads in testing: over 20 million HIV tests are conducted annually through public facilities. Rapid finger-prick tests give results in 15 minutes. Since 2016, HIV self-test kits have been available (free at some clinics, or R90-R150 at pharmacies), allowing people to test privately at home. If you test positive, same-day ARV initiation means you can be on treatment within hours. Testing is confidential, free, and can be anonymous — the clinic does not need your real name or ID.`,
    whatToExpect: [
      { step: 'Pre-test counselling (5 minutes)', detail: 'A counsellor explains the test, what the results mean, and what happens next. You give informed consent — testing is never forced.' },
      { step: 'Rapid finger-prick test', detail: 'A small blood sample from your finger. Results in 15 minutes. If the first test is reactive, a second confirmatory test is done immediately.' },
      { step: 'Post-test counselling', detail: 'If negative: advice on staying negative, PrEP eligibility assessment, condom provision. If positive: emotional support, explanation of ARV treatment, immediate referral for same-day initiation.' },
      { step: 'Self-test option', detail: 'Oral fluid self-test kits (like OraQuick) available at some clinics and pharmacies. You swab your gums and read the result in 20 minutes. A reactive self-test must be confirmed at a clinic.' },
    ],
    eligibility: 'Everyone. No age restriction (children can be tested with guardian consent, or independently from age 12 per Children\'s Act). No ID required. Anonymous testing available. Couples testing is encouraged — test together for mutual support.',
    guideSlug: 'hiv-testing-guide',
    guideName: 'HIV Testing — Where, How & What to Expect',
    keyFact: 'Over 20 million HIV tests are done annually in SA\'s public system — more per capita than almost any country.',
  },
};
