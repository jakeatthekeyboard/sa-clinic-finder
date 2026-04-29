/**
 * Facility type editorial content for SA Clinic Finder.
 * Explains each level in the South African public health referral hierarchy:
 * what it can do, what it cannot, typical staffing, when to go there vs. elsewhere.
 *
 * All content follows Kaizen standard: every sentence creates new information.
 * No sentence restates what is visible on the page (type label, service list, etc.).
 */

export interface FacilityTypeEditorial {
  /** One-paragraph description of this facility level — role, capabilities, limitations */
  description: string;
  /** What this facility can typically handle */
  canDo: string[];
  /** What this facility usually cannot do (needs referral up) */
  cannotDo: string[];
  /** Typical staffing — who you will see */
  staffing: string;
  /** When to go here vs. another facility level */
  whenToGo: string;
  /** Position in the referral chain (1 = primary, 4 = central/tertiary) */
  referralLevel: number;
  /** Where this type refers patients to — and from */
  referralFlow: string;
}

export const FACILITY_TYPE_EDITORIAL: Record<string, FacilityTypeEditorial> = {
  clinic: {
    description:
      'A primary healthcare clinic is the front door of the South African public health system. It handles roughly 80% of all public-sector patient contacts — from childhood immunisations to chronic medication refills. Most clinics are nurse-driven: a professional nurse manages the full consultation, and a doctor visits on scheduled days (often once or twice a week, sometimes less in rural areas). Clinics do not admit patients overnight and do not perform surgery. If your condition requires monitoring, imaging, or specialist assessment, the clinic will issue a referral letter to the district hospital.',
    canDo: [
      'Chronic medication dispensing and monitoring (hypertension, diabetes, epilepsy, asthma, HIV)',
      'Immunisations for children and adults (full EPI-SA schedule)',
      'HIV rapid testing, same-day ARV initiation, and ongoing ARV refills',
      'TB sputum collection (sent to lab) and DOTS treatment supervision',
      'Antenatal booking visits and low-risk pregnancy monitoring',
      'Family planning: injectables, pills, implant insertion (where trained), condoms',
      'Minor wound care: cleaning, suturing small lacerations, dressings',
      'Integrated Management of Childhood Illness (IMCI) assessments',
      'Screening for depression and anxiety (PHQ-9/GAD-7) with first-line medication',
      'CCMDD enrolment for stable chronic patients',
    ],
    cannotDo: [
      'Overnight admission or observation beyond a few hours',
      'X-rays, ultrasound, or blood tests requiring laboratory equipment on-site',
      'Surgical procedures of any kind, including caesarean sections',
      'Specialist consultations (orthopaedic, ENT, psychiatric, ophthalmology)',
      'Emergency resuscitation beyond basic life support',
      'Dental extractions (most clinics — a few have dental chairs)',
    ],
    staffing:
      'Typically staffed by 2-6 professional nurses, 1-3 enrolled nurses, and community health workers. A medical officer (doctor) visits on a scheduled rotation — in well-resourced areas this is daily, but in rural clinics it may be weekly or fortnightly. Some clinics have a pharmacist assistant; otherwise nurses dispense medication directly.',
    whenToGo:
      'Go to a clinic for routine and non-emergency care: chronic medication collection, immunisations, HIV/TB testing, family planning, antenatal check-ups, minor injuries, and any new health complaint that does not require immediate emergency treatment. Arrive before 07:00 to avoid long queues — most clinics see walk-ins on a first-come-first-served basis.',
    referralLevel: 1,
    referralFlow:
      'Clinics refer upward to district hospitals for anything requiring admission, surgery, imaging, or specialist assessment. Patients cannot self-refer to a hospital for non-emergency care — a referral letter from a clinic is required. The only exception is a medical emergency, where you can go directly to a hospital casualty department.',
  },

  community_health_centre: {
    description:
      'A community health centre (CHC) sits between a clinic and a district hospital. It offers extended primary care — including 24-hour services, maternity deliveries, and minor procedures — in areas where a full hospital is not viable. CHCs are typically larger than clinics, have a resident medical officer, and can keep patients for short-stay observation (up to 48 hours). In the Western Cape, midwife obstetric units (MOUs) are classified as CHCs and deliver thousands of babies annually. Nationally there are fewer than 300 CHCs, so they are not available in every district.',
    canDo: [
      '24-hour emergency stabilisation and triage',
      'Normal vaginal deliveries by midwives (not caesareans)',
      'Short-stay observation (up to 48 hours)',
      'All primary clinic services plus on-site blood tests (basic haematology, glucose)',
      'Minor surgical procedures: abscess drainage, foreign body removal, wound debridement',
      'Dental extractions (most CHCs have a dental chair)',
      'Mental health screening and first-line psychiatric medication',
      'On-site GeneXpert for rapid TB diagnosis (some CHCs)',
      'Contraceptive implant and IUD insertion by trained providers',
    ],
    cannotDo: [
      'Caesarean sections or any operation requiring general anaesthesia',
      'X-rays (some have ultrasound, most do not have X-ray)',
      'Specialist outpatient clinics',
      'Long-term admission (>48 hours)',
      'Blood transfusions or ICU-level monitoring',
    ],
    staffing:
      'Staffed 24 hours with at least one medical officer (doctor), professional nurses, midwives, and support staff. Larger CHCs may have a dentist, psychologist, or social worker. Community health workers link the CHC to surrounding clinics and communities.',
    whenToGo:
      'Go to a CHC when your clinic is closed (after hours, weekends, public holidays) and your condition is urgent but not life-threatening. CHCs are also the right choice for uncomplicated deliveries if you are booked for a normal vaginal birth. If you need emergency surgery, go to a district hospital instead.',
    referralLevel: 1,
    referralFlow:
      'CHCs refer to district hospitals for surgical cases, complicated deliveries, admissions longer than 48 hours, and any case requiring specialist assessment. Some clinics refer patients to CHCs for services they cannot provide (dental, maternity) before escalating to hospital level.',
  },

  district_hospital: {
    description:
      'A district hospital is the first level of hospital care. It admits patients, performs surgery under general anaesthesia, has X-ray and laboratory facilities, and runs a 24-hour emergency department. South Africa has approximately 260 district hospitals, and they handle the vast majority of surgical, obstetric, and paediatric admissions in the public sector. A district hospital typically serves a defined geographic area and receives referrals from 10-30 surrounding clinics. Bed capacity ranges from 30 beds (small rural hospitals) to 400+ beds (urban district hospitals like Kalafong in Pretoria).',
    canDo: [
      '24-hour emergency department with South African Triage Scale (SATS)',
      'General surgery: appendectomy, hernia repair, caesarean section, fracture reduction',
      'Obstetric care including caesarean sections, vacuum-assisted delivery, and post-partum haemorrhage management',
      'Paediatric admissions for pneumonia, dehydration, malnutrition, and neonatal care (most have a nursery, not NICU)',
      'X-ray, ultrasound, and on-site laboratory (full blood count, chemistry, blood bank)',
      'Internal medicine wards: managing heart failure, diabetic emergencies, renal colic, strokes',
      'Psychiatric observation for 72-hour assessments under the Mental Health Care Act',
      'Dental extractions and emergency dental procedures',
      'Blood transfusions and IV fluid management',
    ],
    cannotDo: [
      'Specialist surgery: neurosurgery, cardiac surgery, orthopaedic implants, laparoscopic procedures',
      'ICU ventilation beyond basic stabilisation (most district hospitals have 0-4 ICU beds)',
      'MRI or CT scan (a few large district hospitals have CT, most do not)',
      'Specialist outpatient clinics (no resident specialists — some visit on rotation)',
      'Neonatal ICU for premature babies under 1.5 kg',
      'Radiation therapy or chemotherapy',
    ],
    staffing:
      'Staffed by medical officers (generalist doctors), professional nurses, midwives, pharmacists, radiographers, and laboratory technicians. Most district hospitals do not have resident specialists — a visiting specialist from the regional hospital may hold outpatient clinics weekly or monthly. Intern doctors (community service year) are common and supervised by medical officers.',
    whenToGo:
      'Go to a district hospital for emergencies (trauma, severe pain, breathing difficulty, heavy bleeding), when your clinic refers you with a referral letter, or when you need admission for a condition that cannot be managed at home. In an emergency, go directly to the casualty department — no referral needed.',
    referralLevel: 2,
    referralFlow:
      'District hospitals receive referrals from clinics and CHCs. They refer upward to regional hospitals for specialist assessment, and to tertiary hospitals for sub-specialist care. Down-referral: after stabilisation or surgery, patients are sent back to their clinic for follow-up and chronic care.',
  },

  regional_hospital: {
    description:
      'A regional hospital provides specialist services that district hospitals cannot. South Africa has approximately 50 regional hospitals, each serving several districts. They have resident specialists in internal medicine, surgery, paediatrics, obstetrics, orthopaedics, and psychiatry. Regional hospitals have CT scanners, larger ICUs, and can perform complex surgeries that district hospitals refer. Examples include Rob Ferreira Hospital (Mpumalanga), Klerksdorp-Tshepong (North West), and King Edward VIII (KZN). Waiting times for elective specialist appointments can be 3-12 months.',
    canDo: [
      'Specialist outpatient clinics: orthopaedics, ENT, ophthalmology, dermatology, urology, psychiatry',
      'Complex surgery: joint replacements, complex fracture fixation, laparoscopic procedures, plastic surgery',
      'CT scanning and advanced imaging (some have MRI)',
      'ICU with ventilation capacity (typically 8-20 beds)',
      'High-risk obstetric care: eclampsia management, complicated caesareans, neonatal ICU',
      'Chemotherapy for common cancers (oncology outpatient)',
      'Renal dialysis (limited — often a long waiting list)',
      'Psychiatric inpatient care beyond 72-hour observation',
    ],
    cannotDo: [
      'Sub-specialist surgery: neurosurgery, cardiac surgery, organ transplantation',
      'MRI (most regional hospitals — a few have it)',
      'Radiation therapy (only at tertiary hospitals)',
      'Burns unit (dedicated units only at tertiary level)',
      'Genetic testing or rare disease management',
    ],
    staffing:
      'Resident specialists in major disciplines (surgery, medicine, O&G, paediatrics, anaesthesia, orthopaedics, psychiatry), registrars (specialist trainees), medical officers, and full allied health teams (physiotherapy, occupational therapy, dietetics, social work). Teaching of medical students may occur.',
    whenToGo:
      'You will usually reach a regional hospital via referral from a district hospital — not directly from home. The exception is a severe emergency (major trauma, stroke) where the regional hospital is closer than the district hospital. Elective specialist appointments are booked through the district hospital outpatient department.',
    referralLevel: 3,
    referralFlow:
      'Regional hospitals receive referrals from district hospitals. They refer to tertiary/central hospitals for sub-specialist care (neurosurgery, cardiac surgery, organ transplant, radiation therapy). After specialist treatment, patients are down-referred to district hospitals and then clinics for ongoing care.',
  },

  tertiary_hospital: {
    description:
      'A tertiary hospital — also called an academic or central hospital — is the highest level of public healthcare in South Africa. There are 10 in total, all attached to medical schools: Groote Schuur and Tygerberg (Western Cape), Charlotte Maxeke and Chris Hani Baragwanath (Gauteng), Inkosi Albert Luthuli and King Edward VIII (KZN), Steve Biko and Kalafong (Gauteng/Tshwane), Nelson Mandela Academic (Eastern Cape), and Universitas (Free State). These hospitals offer sub-specialist services, advanced research, and serve as the final referral point for cases that cannot be managed at regional level. Chris Hani Baragwanath in Soweto is one of the largest hospitals in the world by bed count (approximately 3,200 beds).',
    canDo: [
      'All services available at regional hospitals, plus:',
      'Neurosurgery (brain and spinal surgery)',
      'Cardiac surgery: valve replacements, coronary artery bypass, paediatric cardiac surgery',
      'Organ transplantation: kidney, liver, heart (Groote Schuur pioneered the world\'s first heart transplant in 1967)',
      'Radiation therapy and comprehensive oncology (cancer treatment)',
      'Burns units with dedicated ICU',
      'Neonatal ICU for extremely premature infants',
      'MRI, PET-CT, and advanced imaging',
      'Genetic testing and rare disease clinics',
      'Clinical trials and cutting-edge treatments not available elsewhere in the public sector',
    ],
    cannotDo: [
      'Walk-in primary care — you need a referral from a lower-level facility',
      'Routine chronic medication — this is managed at clinic level',
      'Same-day elective appointments — waiting lists for sub-specialist services are months to years',
    ],
    staffing:
      'Sub-specialists, professors, consultants, registrars, medical officers, interns, and multidisciplinary teams across every health discipline. These are teaching hospitals: medical students, nursing students, and allied health trainees rotate through departments. Research units operate alongside clinical care.',
    whenToGo:
      'You will only reach a tertiary hospital via referral — typically from a regional hospital, sometimes directly from a district hospital in urgent cases. The only exception is presenting at the emergency department with a life-threatening condition. Do not go to a tertiary hospital for primary care — you will be turned away and told to start at a clinic.',
    referralLevel: 4,
    referralFlow:
      'Tertiary hospitals are the end of the referral chain. They receive the most complex cases from regional and district hospitals. After acute treatment, patients are down-referred through regional → district → clinic for rehabilitation and ongoing management. The goal is to treat at the lowest appropriate level — tertiary beds are scarce and expensive.',
  },

  satellite_clinic: {
    description:
      'A satellite clinic is a small, part-time health post linked to a parent clinic or CHC. It operates on specific days (often 2-3 days per week) in communities too remote or small to justify a full-time facility. Services are limited to what a single nurse can provide: immunisations, chronic medication collection, antenatal check-ups, and health education. Satellite clinics are common in the Northern Cape (where distances are vast) and in Western Cape farming communities. They do not have a doctor on-site and cannot handle emergencies.',
    canDo: [
      'Immunisation on scheduled days',
      'Chronic medication collection (pre-packed from the parent clinic)',
      'Basic antenatal visits (BP, weight, urine dipstick)',
      'Growth monitoring and nutrition screening for children under 5',
      'Health education and condom distribution',
      'Wound dressing changes and basic first aid',
    ],
    cannotDo: [
      'Diagnosis of new conditions (limited clinical assessment capability)',
      'Emergency treatment (no resuscitation equipment)',
      'Any procedure beyond basic wound care',
      'Medication dispensing beyond pre-packed chronic packs',
      'HIV or TB initiation (testing may be available, initiation at parent clinic)',
    ],
    staffing:
      'Typically one professional nurse or enrolled nurse, sometimes with a community health worker. The nurse rotates from the parent facility on the days the satellite is open.',
    whenToGo:
      'Go to a satellite clinic for scheduled services: collecting chronic medication, getting your child immunised, or a routine antenatal check. Always confirm operating days in advance — satellite clinics are not open daily. For anything beyond routine care, go to the parent clinic or district hospital.',
    referralLevel: 1,
    referralFlow:
      'Satellite clinics refer everything beyond basic care to their parent clinic. Emergencies bypass the satellite entirely — call 10177 for an ambulance or go directly to the nearest 24-hour facility.',
  },
};

/**
 * Returns the editorial for a facility type, or undefined if the type is not covered.
 */
export function getFacilityTypeEditorial(type: string): FacilityTypeEditorial | undefined {
  return FACILITY_TYPE_EDITORIAL[type];
}

/**
 * Returns the referral hierarchy as an ordered array, useful for rendering
 * a visual referral chain on facility pages.
 */
export const REFERRAL_HIERARCHY = [
  { type: 'satellite_clinic', label: 'Satellite Clinic', level: 1, levelLabel: 'Primary' },
  { type: 'clinic', label: 'Clinic', level: 1, levelLabel: 'Primary' },
  { type: 'community_health_centre', label: 'Community Health Centre', level: 1, levelLabel: 'Primary' },
  { type: 'district_hospital', label: 'District Hospital', level: 2, levelLabel: 'District' },
  { type: 'regional_hospital', label: 'Regional Hospital', level: 3, levelLabel: 'Regional' },
  { type: 'tertiary_hospital', label: 'Tertiary / Central Hospital', level: 4, levelLabel: 'Tertiary' },
] as const;
