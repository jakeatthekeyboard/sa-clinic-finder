/**
 * isiZulu translation of src/data/facility-types-editorial.ts.
 *
 * Keys (clinic, community_health_centre, …) are join keys and stay in English.
 * Hospital names, place names, programme/drug/statute names (CCMDD, EPI-SA, DOTS,
 * GeneXpert, ARV, TB, HIV, IMCI, PHQ-9, GAD-7, SATS, ICU, NICU, MRI, PET-CT, CT,
 * ENT, O&G, Mental Health Care Act) stay verbatim in English.
 * href values are kept exactly as in English — a render-time helper rewrites them per locale.
 */

import type { FacilityTypeEditorial } from '../facility-types-editorial';

export const FACILITY_TYPE_EDITORIAL_ZU: Record<string, FacilityTypeEditorial> = {
  clinic: {
    description:
      'Umtholampilo wokunakekelwa kwezempilo okuyisisekelo uyisango lokungena lohlelo lwezempilo lomphakathi laseNingizimu Afrika. Ubhekana cishe namaphesenti angu-80% awo wonke amathuba okuxhumana neziguli emkhakheni womphakathi — kusukela emijovweni yezingane kuya ekulandweni kabusha kwemithi yesifo esingamahlalakhona. Imitholampilo eminingi iqhutshwa abahlengikazi: umhlengikazi ochwepheshile uphatha yonke inkonzo yokubonana, futhi udokotela uvakasha ngezinsuku ezihleliwe (ngokuvamile kanye noma kabili ngesonto, kwesinye isikhathi kancane ezindaweni zasemakhaya). Imitholampilo ayizilalisi iziguli ubusuku futhi ayenzi ukuhlinzwa. Uma isimo sakho sidinga ukulandelelwa, ukuthwetshulwa kwezithombe, noma ukuhlolwa uchwepheshe, umtholampilo uzokhipha incwadi yokuthunyelwa esibhedlela sesifunda.',
    canDo: [
      'Ukukhishwa nokulandelelwa kwemithi yesifo esingamahlalakhona (umfutho wegazi ophezulu, ushukela, isithuthwane, umbefu, i-HIV)',
      '<a href="/guides/child-immunisation-schedule">Imijovo</a> yezingane nabantu abadala (ishejuli ephelele ye-EPI-SA)',
      '<a href="/guides/hiv-testing-guide">Ukuhlolelwa i-HIV okusheshayo</a>, <a href="/guides/how-to-get-arvs">ukuqalwa kwama-ARV</a> ngalo lolo suku, nokulandwa kabusha kwama-ARV okuqhubekayo',
      '<a href="/guides/tb-treatment-what-to-expect">Ukuqoqwa kwamathe esifo sofuba (TB)</a> (athunyelwa elabhoratri) nokugadwa kokwelashwa kwe-DOTS',
      '<a href="/guides/free-maternity-care">Ukubhaliswa kokunakekelwa kwabakhulelwe</a> nokulandelelwa kokukhulelwa okungenabungozi obukhulu',
      '<a href="/guides/family-planning-contraception">Ukuhlela umndeni</a>: imijovo, amaphilisi, ukufakwa kwe-implant (lapho kunabaqeqeshiwe), amakhondomu',
      'Ukunakekelwa kwamanxeba amancane: ukuwahlanza, ukuthungwa kwamanxeba amancane, ukubopha',
      'Ukuhlolwa kwe-Integrated Management of Childhood Illness (IMCI)',
      'Ukuhlolelwa <a href="/guides/mental-health-services">ukucindezeleka nokukhathazeka</a> (PHQ-9/GAD-7) kanye nemithi yokuqala',
      '<a href="/guides/ccmdd-chronic-meds-pickup">Ukubhaliswa ku-CCMDD</a> kweziguli ezizinzile ezinesifo esingamahlalakhona',
    ],
    cannotDo: [
      'Ukulaliswa ubusuku noma ukubhekwa okudlula amahora ambalwa',
      'Ama-X-ray, i-ultrasound, noma ukuhlolwa kwegazi okudinga imishini yelabhoratri esikhungweni',
      'Izinqubo zokuhlinzwa zanoma yiluphi uhlobo, kufaka phakathi ukuhlinzwa kokubeletha (caesarean sections)',
      'Ukubonana nochwepheshe (orthopaedic, ENT, psychiatric, ophthalmology)',
      'Ukuvuselelwa okuphuthumayo okudlula usizo lwempilo oluyisisekelo',
      'Ukukhishwa kwamazinyo (imitholampilo eminingi — embalwa enezihlalo zamazinyo)',
    ],
    staffing:
      'Ngokuvamile isetshenzwa abahlengikazi abachwepheshile abangu-2-6, abahlengikazi ababhalisiwe abangu-1-3, nezisebenzi zezempilo zomphakathi. Isikhulu sezokwelapha (udokotela) sivakasha ngokushintshana okuhleliwe — ezindaweni ezinezinsiza ezanele lokhu kwenzeka nsuku zonke, kodwa emitholampilo yasemakhaya kungenzeka kwenzeke kanye ngesonto noma emasontweni amabili. Eminye imitholampilo inomsizi wesikhungo semithi; ngaphandle kwalokho abahlengikazi bakhipha imithi ngokuqondile.',
    whenToGo:
      'Yiya emtholampilo ukuze uthole ukunakekelwa okujwayelekile nokungaphuthumi: <a href="/guides/chronic-medication-management">ukulanda imithi yesifo esingamahlalakhona</a>, imijovo, ukuhlolelwa i-HIV/TB, ukuhlela umndeni, ukuhlolwa kwabakhulelwe, ukulimala okuncane, nanoma yisiphi isikhalazo esisha sezempilo esingadingi <a href="/guides/medical-emergency-guide">ukwelashwa okuphuthumayo</a> ngokushesha. Fika ngaphambi kuka-07:00 ukugwema imigqa emide — imitholampilo eminingi ibona abangenayo ngokulandelana kokufika.',
    referralLevel: 1,
    referralFlow:
      'Imitholampilo ithumela phezulu ezibhedlela zesifunda kunoma yini edinga ukulaliswa, ukuhlinzwa, ukuthwetshulwa kwezithombe, noma ukuhlolwa uchwepheshe. Iziguli azikwazi ukuzithumela zona esibhedlela zizele ukunakekelwa okungaphuthumi — kudingeka <a href="/guides/hospital-referral-system">incwadi yokuthunyelwa</a> evela emtholampilo. Okuwukuphela kokuhlukile isimo esiphuthumayo sezempilo, lapho ungaya khona ngqo emnyangweni weziphuthumayo wesibhedlela.',
  },

  community_health_centre: {
    description:
      'Isikhungo sezempilo somphakathi (CHC) sihlala phakathi komtholampilo nesibhedlela sesifunda. Sinikeza ukunakekelwa okuyisisekelo okwelulekiwe — kufaka phakathi izinsizakalo zamahora angu-24, ukubeletha, nezinqubo ezincane — ezindaweni lapho isibhedlela esigcwele singenakwenzeka khona. Ama-CHC ngokuvamile makhulu kunemitholampilo, anesikhulu sezokwelapha esihlala khona, futhi angagcina iziguli ukuze zibhekwe isikhashana (kufika emahoreni angu-48). ENtshonalanga Kapa, amayunithi okubeletha abelusi bezisu (ama-MOU) ahlukaniswa njengama-CHC futhi abelethisa izinkulungwane zezingane minyaka yonke. Kuzwelonke kunama-CHC angaphansi kwangu-300, ngakho awatholakali kuzo zonke izifunda.',
    canDo: [
      'Ukuqiniswa kwesimo esiphuthumayo nokuhlungwa kweziguli amahora angu-24',
      'Ukubeletha okujwayelekile ngabelusi <a href="/guides/free-maternity-care">bezisu</a> (hhayi ukuhlinzwa kokubeletha)',
      'Ukubhekwa isikhashana (kufika emahoreni angu-48)',
      'Zonke izinsizakalo zomtholampilo oyisisekelo kanye nokuhlolwa kwegazi esikhungweni (i-haematology eyisisekelo, ushukela)',
      'Izinqudo ezincane zokuhlinzwa: ukukhishwa kobomvu ethumbeni, ukukhishwa kwezinto ezingaphakathi emzimbeni, ukususwa kwenyama efile enxebeni',
      '<a href="/guides/dental-care-public-clinics">Ukukhishwa kwamazinyo</a> (ama-CHC amaningi anesihlalo samazinyo)',
      '<a href="/guides/mental-health-services">Ukuhlolwa kwempilo yengqondo</a> nemithi yokuqala ye-psychiatric',
      'I-GeneXpert esikhungweni yokuhlonza i-TB ngokushesha (amanye ama-CHC)',
      'Ukufakwa kwe-implant yokuvimbela ukukhulelwa nowe-IUD ngabahlinzeki abaqeqeshiwe',
    ],
    cannotDo: [
      'Ukuhlinzwa kokubeletha (caesarean sections) noma noma yikuphi ukuhlinzwa okudinga ukudakwa okuphelele',
      'Ama-X-ray (amanye ane-ultrasound, amaningi awanayo i-X-ray)',
      'Imitholampilo yochwepheshe yabangalaliswa',
      'Ukulaliswa isikhathi eside (ngaphezu kwamahora angu-48)',
      'Ukumpompelwa kwegazi noma ukulandelelwa okusezingeni le-ICU',
    ],
    staffing:
      'Sisebenza amahora angu-24 sinesikhulu sezokwelapha esisodwa okungenani (udokotela), abahlengikazi abachwepheshile, abelusi bezisu, nabasebenzi bokusekela. Ama-CHC amakhulu angaba nodokotela wamazinyo, usosayensi wengqondo, noma usonhlalakahle. Izisebenzi zezempilo zomphakathi zixhumanisa i-CHC nemitholampilo nemiphakathi ezungezile.',
    whenToGo:
      'Yiya e-CHC uma umtholampilo wakho uvaliwe (ngemva kwamahora, ngempelasonto, ngamaholidi omphakathi) futhi isimo sakho siphuthuma kodwa singasongeli impilo. Ama-CHC nawo ayisinqumo esifanele ekubelethweni okungenazinkinga uma ubhaliselwe ukubeletha okujwayelekile. Uma udinga ukuhlinzwa okuphuthumayo, yiya esibhedlela sesifunda kunalokho.',
    referralLevel: 1,
    referralFlow:
      'Ama-CHC athumela ezibhedlela zesifunda amacala okuhlinzwa, ukubeletha okunezinkinga, ukulaliswa okudlula amahora angu-48, nanoma yiliphi icala elidinga ukuhlolwa uchwepheshe. Eminye imitholampilo ithumela iziguli kuma-CHC ukuze zithole izinsizakalo engenakuzinikeza (amazinyo, ukubeletha) ngaphambi kokukhuphukela ezingeni lesibhedlela.',
  },

  district_hospital: {
    description:
      'Isibhedlela sesifunda yizinga lokuqala lokunakekelwa kwesibhedlela. Silalisa iziguli, senza ukuhlinzwa ngaphansi kokudakwa okuphelele, sinezinsiza ze-X-ray nelabhoratri, futhi siqhuba umnyango weziphuthumayo wamahora angu-24. INingizimu Afrika inezibhedlela zesifunda ezicishe zibe ngu-260, futhi zibhekana neningi ngokweqile lokulaliswa kokuhlinzwa, kokubeletha, nokwezingane emkhakheni womphakathi. Isibhedlela sesifunda ngokuvamile sisiza indawo ethile echaziwe futhi sithola ukuthunyelwa okuvela emitholampilo engu-10-30 ezungezile. Amandla emibhede asukela emibhedeni engu-30 (izibhedlela ezincane zasemakhaya) aye emibhedeni engu-400+ (izibhedlela zesifunda zasemadolobheni ezinjenge-Kalafong ePitoli).',
    canDo: [
      'Umnyango weziphuthumayo wamahora angu-24 osebenzisa i-South African Triage Scale (SATS)',
      'Ukuhlinzwa okujwayelekile: ukukhishwa kwe-appendix, ukulungiswa kwe-hernia, ukuhlinzwa kokubeletha (caesarean section), ukubuyiselwa esikhundleni kwethambo elephukile',
      'Ukunakekelwa kokubeletha kufaka phakathi ukuhlinzwa kokubeletha, ukubelethisa kusetshenziswa i-vacuum, nokulawulwa kokopha ngemva kokubeletha',
      'Ukulaliswa kwezingane ngenxa ye-pneumonia, ukushiswa amanzi emzimbeni, ukungondleki, nokunakekelwa kwezingane ezisanda kuzalwa (eziningi zinekamelo lezingane, hhayi i-NICU)',
      'I-X-ray, i-ultrasound, nelabhoratri lasesikhungweni (ukubalwa okuphelele kwegazi, i-chemistry, ibhange legazi)',
      'Amawodi ezokwelapha zangaphakathi: ukulawula ukwehluleka kwenhliziyo, izimo eziphuthumayo zikashukela, ubuhlungu bezinso, ustroke',
      'Ukubhekwa kwe-psychiatric ukuze kwenziwe ukuhlolwa kwamahora angu-72 ngaphansi koMental Health Care Act',
      '<a href="/guides/dental-care-public-clinics">Ukukhishwa kwamazinyo</a> nezinqubo zamazinyo eziphuthumayo',
      'Ukumpompelwa kwegazi nokulawulwa koketshezi lwe-IV',
    ],
    cannotDo: [
      'Ukuhlinzwa kochwepheshe: ukuhlinzwa kobuchopho (neurosurgery), ukuhlinzwa kwenhliziyo (cardiac surgery), ukufakelwa kwamathambo (orthopaedic implants), izinqubo ze-laparoscopic',
      'Ukuphefumulelwa kwe-ICU okudlula ukuqiniswa kwesimo okuyisisekelo (izibhedlela zesifunda eziningi zinemibhede ye-ICU engu-0-4)',
      'I-MRI noma i-CT scan (izibhedlela zesifunda ezinkulu ezimbalwa zine-CT, eziningi azinayo)',
      'Imitholampilo yochwepheshe yabangalaliswa (abekho ochwepheshe abahlala khona — abanye bayavakasha ngokushintshana)',
      'I-Neonatal ICU yezingane ezizalwe zingakafiki ezingaphansi kuka-1.5 kg',
      'Ukwelashwa ngemisebe noma i-chemotherapy',
    ],
    staffing:
      'Sisetshenzwa yizikhulu zezokwelapha (odokotela abajwayelekile), abahlengikazi abachwepheshile, abelusi bezisu, osokhemisi, abathwebuli bezithombe ze-X-ray, nochwepheshe belabhoratri. Izibhedlela zesifunda eziningi azinabo ochwepheshe abahlala khona — uchwepheshe ovakashayo ovela esibhedlela sesifunda esikhulu angabamba imitholampilo yabangalaliswa masonto onke noma nyanga zonke. Odokotela abasafundela umsebenzi (unyaka wenkonzo yomphakathi) bajwayelekile futhi bagadwa yizikhulu zezokwelapha.',
    whenToGo:
      'Yiya esibhedlela sesifunda uma une-<a href="/guides/medical-emergency-guide">zimo eziphuthumayo</a> (ukulimala, ubuhlungu obukhulu, ukuphefumula kanzima, ukopha okukhulu), uma umtholampilo wakho ukuthumela ne-<a href="/guides/hospital-referral-system">ncwadi yokuthunyelwa</a>, noma uma udinga ukulaliswa ngenxa yesimo esingenakulawulwa ekhaya. Esimweni esiphuthumayo, yiya ngqo emnyangweni weziphuthumayo — ayidingeki incwadi yokuthunyelwa.',
    referralLevel: 2,
    referralFlow:
      'Izibhedlela zesifunda zithola ukuthunyelwa okuvela emitholampilo nakuma-CHC. Zithumela phezulu ezibhedlela zesifunda esikhulu ukuze kuhlolwe ochwepheshe, nasezibhedlela ezinkulu ukuze kutholakale ukunakekelwa kochwepheshe abakhethekile. Ukuthunyelwa phansi: ngemva kokuqiniswa kwesimo noma ukuhlinzwa, iziguli zibuyiselwa emtholampilo wazo ukuze zilandelelwe futhi zithole ukunakekelwa kwesifo esingamahlalakhona.',
  },

  regional_hospital: {
    description:
      'Isibhedlela sesifunda esikhulu sinikeza izinsizakalo zochwepheshe izibhedlela zesifunda ezingakwazi ukuzinikeza. INingizimu Afrika inezibhedlela zesifunda esikhulu ezicishe zibe ngu-50, ngasinye sisiza izifunda eziningana. Zinochwepheshe abahlala khona kwezokwelapha zangaphakathi, ukuhlinzwa, ezezingane, ezokubeletha, ezamathambo, nezengqondo. Izibhedlela zesifunda esikhulu zinemishini ye-CT scan, ama-ICU amakhulu, futhi zingenza ukuhlinzwa okunzima izibhedlela zesifunda ezikuthumelayo. Izibonelo zifaka i-Rob Ferreira Hospital (eMpumalanga), i-Klerksdorp-Tshepong (eNyakatho Ntshonalanga), ne-King Edward VIII (KZN). Isikhathi sokulinda ukubonana nochwepheshe okuhleliwe singaba yizinyanga ezingu-3-12.',
    canDo: [
      'Imitholampilo yochwepheshe yabangalaliswa: ezamathambo, i-ENT, i-ophthalmology, i-dermatology, i-urology, ezengqondo',
      'Ukuhlinzwa okunzima: ukushintshwa kwamalungu omzimba, ukulungiswa kwamathambo ephukile ngendlela enzima, izinqubo ze-laparoscopic, ukuhlinzwa kokuvuselela isimo somzimba',
      'I-CT scanning nokuthwetshulwa kwezithombe okuthuthukile (ezinye zine-MRI)',
      'I-ICU enamandla okuphefumulela (ngokuvamile imibhede engu-8-20)',
      'Ukunakekelwa kokubeletha okunobungozi obukhulu: ukulawulwa kwe-eclampsia, ukuhlinzwa kokubeletha okunezinkinga, i-neonatal ICU',
      'I-Chemotherapy yomdlavuza ojwayelekile (i-oncology yabangalaliswa)',
      'Ukuhlanzwa kwezinso (kunomkhawulo — imvamisa kunohlu olude lokulinda)',
      'Ukunakekelwa kwabalaliswayo bezengqondo okudlula ukubhekwa kwamahora angu-72',
    ],
    cannotDo: [
      'Ukuhlinzwa kochwepheshe abakhethekile: ukuhlinzwa kobuchopho (neurosurgery), ukuhlinzwa kwenhliziyo (cardiac surgery), ukufakelwa izitho zomzimba',
      'I-MRI (izibhedlela zesifunda esikhulu eziningi — ezimbalwa zinayo)',
      'Ukwelashwa ngemisebe (kuphela ezibhedlela ezinkulu)',
      'Iyunithi yabashile (amayunithi akhethekile asezingeni lezibhedlela ezinkulu kuphela)',
      'Ukuhlolwa kwezakhi zofuzo noma ukulawulwa kwezifo ezingavamile',
    ],
    staffing:
      'Ochwepheshe abahlala khona emikhakheni emikhulu (ukuhlinzwa, ezokwelapha, i-O&G, ezezingane, ukudakwa, ezamathambo, ezengqondo), ama-registrar (abaqeqeshelwa ubuchwepheshe), izikhulu zezokwelapha, namaqembu aphelele ezempilo ahlobene (ukuvuselelwa komzimba, ukwelashwa ngomsebenzi, ezokudla, ezenhlalakahle). Kungenzeka kufundiswe abafundi bezokwelapha.',
    whenToGo:
      'Ngokuvamile uzofinyelela esibhedlela sesifunda esikhulu ngokuthunyelwa okuvela esibhedlela sesifunda — hhayi ngqo usuka ekhaya. Okuhlukile isimo esiphuthumayo esibucayi (ukulimala okukhulu, ustroke) lapho isibhedlela sesifunda esikhulu siseduze kunesibhedlela sesifunda. Ukubonana nochwepheshe okuhleliwe kubhukhwa ngomnyango wabangalaliswa wesibhedlela sesifunda.',
    referralLevel: 3,
    referralFlow:
      'Izibhedlela zesifunda esikhulu zithola ukuthunyelwa okuvela ezibhedlela zesifunda. Zithumela ezibhedlela ezinkulu/eziphakathi ukuze kutholakale ukunakekelwa kochwepheshe abakhethekile (ukuhlinzwa kobuchopho, ukuhlinzwa kwenhliziyo, ukufakelwa izitho zomzimba, ukwelashwa ngemisebe). Ngemva kokwelashwa uchwepheshe, iziguli zithunyelwa phansi ezibhedlela zesifunda bese ziya emitholampilo ukuze zilandelelwe.',
  },

  tertiary_hospital: {
    description:
      'Isibhedlela esikhulu — esibizwa nangokuthi isibhedlela sezemfundo noma esiphakathi — yizinga eliphezulu kunawo wonke lokunakekelwa kwezempilo komphakathi eNingizimu Afrika. Sekukonke zingu-10, zonke zixhunywe ezikoleni zezokwelapha: i-Groote Schuur ne-Tygerberg (eNtshonalanga Kapa), i-Charlotte Maxeke ne-Chris Hani Baragwanath (eGauteng), i-Inkosi Albert Luthuli ne-King Edward VIII (KZN), i-Steve Biko ne-Kalafong (eGauteng/eTshwane), i-Nelson Mandela Academic (eMpumalanga Kapa), ne-Universitas (eFree State). Lezi zibhedlela zinikeza izinsizakalo zochwepheshe abakhethekile, ucwaningo oluthuthukile, futhi ziyindawo yokugcina yokuthunyelwa kwamacala angenakulawulwa ezingeni lesifunda esikhulu. I-Chris Hani Baragwanath eSoweto ingesinye sezibhedlela ezinkulu kunazo zonke emhlabeni ngokubalwa kwemibhede (cishe imibhede engu-3,200).',
    canDo: [
      'Zonke izinsizakalo ezitholakala ezibhedlela zesifunda esikhulu, kanye nalezi:',
      'Ukuhlinzwa kobuchopho (neurosurgery) (ukuhlinzwa kobuchopho nomgogodla)',
      'Ukuhlinzwa kwenhliziyo: ukushintshwa kwamavalve, i-coronary artery bypass, ukuhlinzwa kwenhliziyo kwezingane',
      'Ukufakelwa izitho zomzimba: izinso, isibindi, inhliziyo (i-Groote Schuur yaba ngeyokuqala emhlabeni ekufakelweni kwenhliziyo ngo-1967)',
      'Ukwelashwa ngemisebe ne-oncology ephelele (ukwelashwa komdlavuza)',
      'Amayunithi abashile anayo i-ICU ekhethekile',
      'I-Neonatal ICU yezingane ezizalwe zingakafiki kakhulu',
      'I-MRI, i-PET-CT, nokuthwetshulwa kwezithombe okuthuthukile',
      'Ukuhlolwa kwezakhi zofuzo nemitholampilo yezifo ezingavamile',
      'Izivivinyo zemitholampilo nokwelashwa kwesimanje okungatholakali kwenye indawo emkhakheni womphakathi',
    ],
    cannotDo: [
      'Ukunakekelwa okuyisisekelo kwabangenayo nje — udinga incwadi yokuthunyelwa evela esikhungweni sezinga eliphansi',
      'Imithi ejwayelekile yesifo esingamahlalakhona — lokhu kulawulwa ezingeni lomtholampilo',
      'Ukubonana okuhleliwe ngalo lolo suku — izinhlu zokulinda zezinsizakalo zochwepheshe abakhethekile ziyizinyanga kuya eminyakeni',
    ],
    staffing:
      'Ochwepheshe abakhethekile, oprofesa, abeluleki, ama-registrar, izikhulu zezokwelapha, odokotela abasafundela umsebenzi, namaqembu emikhakha eminingi kuyo yonke imikhakha yezempilo. Lezi yizibhedlela zokufundisa: abafundi bezokwelapha, abafundi bobuhlengikazi, nabaqeqeshwa kwezempilo ezihlobene bashintshana ngokudlula eminyangweni. Amayunithi ocwaningo asebenza eceleni kokunakekelwa kwezempilo.',
    whenToGo:
      'Uzofinyelela esibhedlela esikhulu ngokuthunyelwa kuphela — ngokuvamile kusuka esibhedlela sesifunda esikhulu, kwesinye isikhathi ngqo kusuka esibhedlela sesifunda emacaleni aphuthumayo. Okuwukuphela kokuhlukile ukufika emnyangweni weziphuthumayo unesimo esisongela impilo. Ungayi esibhedlela esikhulu uzele ukunakekelwa okuyisisekelo — uzobuyiselwa emuva bese utshelwa ukuthi uqale emtholampilo.',
    referralLevel: 4,
    referralFlow:
      'Izibhedlela ezinkulu ziyisiphetho sohla lokuthunyelwa. Zithola amacala anzima kunawo wonke avela ezibhedlela zesifunda esikhulu nezesifunda. Ngemva kokwelashwa okuphuthumayo, iziguli zithunyelwa phansi zidlula esifundeni esikhulu → esifundeni → emtholampilo ukuze zivuselelwe futhi zilawulwe ngokuqhubekayo. Inhloso ukwelapha ezingeni eliphansi elifanele — imibhede yezibhedlela ezinkulu iyivelakancane futhi iyabiza.',
  },

  satellite_clinic: {
    description:
      'Umtholampilo oyingxenye uyisikhungo sezempilo esincane esisebenza isikhathi esithile esixhunywe emtholampilo omkhulu noma e-CHC. Usebenza ngezinsuku ezithile (imvamisa izinsuku ezingu-2-3 ngesonto) emiphakathini ekude kakhulu noma emincane kakhulu ukuthi ifanelwe yisikhungo esisebenza ngokugcwele. Izinsizakalo zilinganiselwe kulokho umhlengikazi oyedwa angakwazi ukukunikeza: imijovo, ukulandwa kwemithi yesifo esingamahlalakhona, ukuhlolwa kwabakhulelwe, nemfundo yezempilo. Imitholampilo eyingxenye ijwayelekile eNyakatho Kapa (lapho amabanga ekude kakhulu) nasemiphakathini yamapulazi aseNtshonalanga Kapa. Ayinaye udokotela esikhungweni futhi ayikwazi ukubhekana nezimo eziphuthumayo.',
    canDo: [
      'Imijovo ngezinsuku ezihleliwe',
      'Ukulandwa kwemithi yesifo esingamahlalakhona (epakishwe ngaphambili emtholampilo omkhulu)',
      'Ukuhlolwa okuyisisekelo kwabakhulelwe (umfutho wegazi, isisindo, ukuhlolwa komchamo)',
      'Ukulandelelwa kokukhula nokuhlolelwa ukudla okunomsoco ezinganeni ezingaphansi kwe-5',
      'Imfundo yezempilo nokusatshalaliswa kwamakhondomu',
      'Ukushintshwa kokubotshwa kwamanxeba nosizo lokuqala oluyisisekelo',
    ],
    cannotDo: [
      'Ukuhlonzwa kwezifo ezintsha (amandla okuhlola kwezokwelapha alinganiselwe)',
      'Ukwelashwa okuphuthumayo (ayikho imishini yokuvuselela)',
      'Noma yiyiphi inqubo edlula ukunakekelwa kwamanxeba okuyisisekelo',
      'Ukukhishwa kwemithi okudlula amaphakethe emithi yesifo esingamahlalakhona apakishwe ngaphambili',
      'Ukuqalwa kwe-HIV noma i-TB (ukuhlolwa kungatholakala, ukuqalwa kwenziwa emtholampilo omkhulu)',
    ],
    staffing:
      'Ngokuvamile umhlengikazi oyedwa ochwepheshile noma umhlengikazi obhalisiwe, kwesinye isikhathi enesisebenzi sezempilo somphakathi. Umhlengikazi ushintshana esuka esikhungweni esikhulu ngezinsuku umtholampilo oyingxenye ovuleke ngazo.',
    whenToGo:
      'Yiya emtholampilo oyingxenye ukuze uthole izinsizakalo ezihleliwe: ukulanda imithi yesifo esingamahlalakhona, ukugonywa kwengane yakho, noma ukuhlolwa okujwayelekile kwabakhulelwe. Hlala uqinisekisa izinsuku zokusebenza kusenesikhathi — imitholampilo eyingxenye ayivuliwe nsuku zonke. Kunoma yini edlula ukunakekelwa okujwayelekile, yiya emtholampilo omkhulu noma esibhedlela sesifunda.',
    referralLevel: 1,
    referralFlow:
      'Imitholampilo eyingxenye ithumela konke okudlula ukunakekelwa okuyisisekelo emtholampilo wayo omkhulu. Izimo eziphuthumayo zeqa umtholampilo oyingxenye ngokuphelele — shayela u-10177 ucele i-ambulensi noma uye ngqo esikhungweni esiseduze esisebenza amahora angu-24.',
  },
};

/**
 * Ibuyisa okubhaliwe kohlobo lwesikhungo, noma undefined uma uhlobo lungahlanganisiwe.
 */
export function getFacilityTypeEditorialZu(type: string): FacilityTypeEditorial | undefined {
  return FACILITY_TYPE_EDITORIAL_ZU[type];
}

/**
 * Ibuyisa uhla lokuthunyelwa njenge-array ehleliwe, oluwusizo ekubonisweni
 * koketango lokuthunyelwa emakhasini ezikhungo.
 */
export const REFERRAL_HIERARCHY_ZU = [
  { type: 'satellite_clinic', label: 'Umtholampilo Oyingxenye', level: 1, levelLabel: 'Okuyisisekelo' },
  { type: 'clinic', label: 'Umtholampilo', level: 1, levelLabel: 'Okuyisisekelo' },
  { type: 'community_health_centre', label: 'Isikhungo Sezempilo Somphakathi', level: 1, levelLabel: 'Okuyisisekelo' },
  { type: 'district_hospital', label: 'Isibhedlela Sesifunda', level: 2, levelLabel: 'Isifunda' },
  { type: 'regional_hospital', label: 'Isibhedlela Sesifunda Esikhulu', level: 3, levelLabel: 'Isifunda Esikhulu' },
  { type: 'tertiary_hospital', label: 'Isibhedlela Esikhulu / Esiphakathi', level: 4, levelLabel: 'Esikhulu' },
] as const;
