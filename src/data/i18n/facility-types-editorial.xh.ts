import type { FacilityTypeEditorial } from '../facility-types-editorial';

export const FACILITY_TYPE_EDITORIAL_XH: Record<string, FacilityTypeEditorial> = {
  clinic: {
    description:
      'Ikliniki yempilo esisiseko ingumnyango wokungena wenkqubo yempilo kawonke-wonke yase-South Africa. Ijongana malunga ne-80% yazo zonke iindibano nezigulane kwicandelo likawonke-wonke — ukusuka kugonyo lwabantwana ukuya ekulandeni kwakhona kwamayeza axesha elide (chronic medication). Iikliniki ezininzi ziqhutywa ngabongikazi: umongikazi ochwephesheyo uqhuba udliwano-ndlebe lonke, kwaye ugqirha utyelela ngeentsuku ezimiselweyo (ngokuqhelekileyo kanye okanye kabini ngeveki, ngamanye amaxesha kancinci kwiindawo zasemaphandleni). Iikliniki azizilalisi izigulane ubusuku bonke kwaye azenzi tyando. Ukuba imeko yakho ifuna ukubekwa esweni, imifanekiso yangaphakathi (imaging), okanye uvavanyo lwengcali, ikliniki iza kukhupha incwadi yokuthunyelwa (referral letter) esibhedlele sesithili.',
    canDo: [
      'Ukukhutshwa nokubekwa esweni kwamayeza axesha elide (uxinzelelo lwegazi, iswekile, isifo sokuwa, umbefu, i-HIV)',
      '<a href="/guides/child-immunisation-schedule">Ugonyo</a> lwabantwana nolwabantu abadala (ishedyuli epheleleyo ye-EPI-SA)',
      '<a href="/guides/hiv-testing-guide">Uvavanyo olukhawulezileyo lwe-HIV</a>, <a href="/guides/how-to-get-arvs">ukuqaliswa kwe-ARV</a> ngayo loo mini, kunye nokulandwa okuqhubekayo kwee-ARVs',
      '<a href="/guides/tb-treatment-what-to-expect">Ukuqokelelwa kwesikhohlela se-TB</a> (sithunyelwa kwilebhu) nolawulo lonyango lwe-DOTS',
      '<a href="/guides/free-maternity-care">Utyelelo lokubhalisa lwabakhulelweyo</a> nokubekwa esweni kokukhulelwa okungenamngcipheko',
      '<a href="/guides/family-planning-contraception">Ukucwangcisa usapho</a>: iinaliti, iipilisi, ukufakwa kwesifakelo (apho kuqeqeshelwe khona), iikhondom',
      'Unyango lwamanxeba amancinci: ukucoca, ukuthunga imisiki emincinci, ukubopha amanxeba',
      'Uvavanyo lwe-Integrated Management of Childhood Illness (IMCI)',
      'Ukuhlolwa <a href="/guides/mental-health-services">kwedandatheku noxinezeleko</a> (PHQ-9/GAD-7) kunye namayeza okuqala',
      '<a href="/guides/ccmdd-chronic-meds-pickup">Ukubhaliswa kwi-CCMDD</a> kwizigulane ezizinzileyo zamayeza axesha elide',
    ],
    cannotDo: [
      'Ukulaliswa okanye ukubekwa esweni ubusuku bonke ngaphaya kweeyure ezimbalwa',
      'Ii-X-ray, i-ultrasound, okanye uvavanyo lwegazi olufuna izixhobo zelebhoratri apho esikhungweni',
      'Utyando lwalo naluphi na uhlobo, kubandakanya utyando lokubeleka (caesarean section)',
      'Udliwano-ndlebe neengcali (unyango lwamathambo, i-ENT, unyango lwengqondo, unyango lwamehlo)',
      'Ukuvuselelwa kwesigulane esifayo ngaphaya konyango olusisiseko lokusindisa ubomi',
      'Ukurhoxiswa kwamazinyo (iikliniki ezininzi — ezimbalwa zinezitulo zamazinyo)',
    ],
    staffing:
      'Ngokuqhelekileyo isebenza ngabongikazi abachwephesheyo aba-2-6, abongikazi ababhalisiweyo aba-1-3, kunye nabasebenzi bezempilo basekuhlaleni. Igqirha (medical officer) lityelela ngokujikeleza okumiselweyo — kwiindawo ezinezibonelelo ezaneleyo oku kwenzeka yonke imihla, kodwa kwiikliniki zasemaphandleni kunokwenzeka kanye ngeveki okanye kanye kwiiveki ezimbini. Ezinye iikliniki zinomncedisi wekhemesti; kungenjalo abongikazi banikezela ngamayeza ngokwabo.',
    whenToGo:
      'Yiya ekliniki ukuze ufumane unyango oluqhelekileyo nolungelolongxamiseko: <a href="/guides/chronic-medication-management">ukulandwa kwamayeza axesha elide</a>, ugonyo, uvavanyo lwe-HIV/TB, ukucwangcisa usapho, uhlolo lwabakhulelweyo, ukwenzakala okuncinci, kunye nayo nayiphi na ingxaki yempilo entsha engafuni <a href="/guides/medical-emergency-guide">unyango longxamiseko</a> ngoko nangoko. Fika phambi ko-07:00 ukuze uphephe imigca emide — iikliniki ezininzi zibona abantu abangabhukishanga ngokulandelelana kokufika kwabo.',
    referralLevel: 1,
    referralFlow:
      'Iikliniki zithumela phezulu kwizibhedlele zesithili nakuphi na okufuna ukulaliswa, utyando, imifanekiso yangaphakathi, okanye uvavanyo lwengcali. Izigulane azinakuzithumela ngokwazo esibhedlele kunyango olungelolongxamiseko — <a href="/guides/hospital-referral-system">incwadi yokuthunyelwa</a> evela ekliniki iyafuneka. Okuphuma kulo mgaqo kuphela yingxamiseko yezonyango, apho unokuya ngqo kwicandelo lokugula kakhulu (casualty) esibhedlele.',
  },

  community_health_centre: {
    description:
      'Iziko lempilo loluntu (CHC) lihlala phakathi kwekliniki nesibhedlele sesithili. Linika unyango olusisiseko olwandisiweyo — kubandakanya iinkonzo zeeyure ezingama-24, ukubelekisa, kunye nemisebenzi emincinci — kwiindawo apho isibhedlele esipheleleyo singenakwenzeka khona. Ii-CHC ngokuqhelekileyo zinkulu kunathi iikliniki, zinegqirha elihlala apho, kwaye zinako ukugcina izigulane zibekwe esweni ixesha elifutshane (ukuya kwiiyure ezingama-48). E-Western Cape, ii-midwife obstetric units (MOUs) zibalwa njengee-CHC kwaye zibelekisa amawaka eentsana minyaka le. Kwilizwe lonke ii-CHC zingaphantsi kwama-300, ngoko azifumaneki kuso sonke isithili.',
    canDo: [
      'Ukuzinziswa kwengxamiseko nokuhlelwa kwezigulane iiyure ezingama-24',
      'Ukubeleka okuqhelekileyo ngo<a href="/guides/free-maternity-care">ababelekisi</a> (hayi utyando lokubeleka)',
      'Ukubekwa esweni ixesha elifutshane (ukuya kwiiyure ezingama-48)',
      'Zonke iinkonzo zekliniki ezisisiseko kunye novavanyo lwegazi apho esikhungweni (i-haematology esisiseko, iswekile)',
      'Utyando oluncinci: ukukhutshwa kwethumba, ukususwa kwento engenileyo emzimbeni, ukucocwa kwenxeba',
      '<a href="/guides/dental-care-public-clinics">Ukurhoxiswa kwamazinyo</a> (uninzi lwee-CHC lunesitulo samazinyo)',
      '<a href="/guides/mental-health-services">Uhlolo lwempilo yengqondo</a> namayeza okuqala engqondo',
      'I-GeneXpert ekhoyo apho esikhungweni yokufumanisa i-TB ngokukhawuleza (ezinye ii-CHC)',
      'Ukufakwa kwesifakelo sokucwangcisa nese-IUD ngababoneleli abaqeqeshiweyo',
    ],
    cannotDo: [
      'Utyando lokubeleka okanye nawuphi na umsebenzi ofuna ukulaliswa ngokupheleleyo (general anaesthesia)',
      'Ii-X-ray (ezinye zine-ultrasound, uninzi alunayo i-X-ray)',
      'Iikliniki zeengcali zabangalaliswanga',
      'Ukulaliswa ixesha elide (>48 iiyure)',
      'Ukufakwa kwegazi okanye ukubekwa esweni kwinqanaba le-ICU',
    ],
    staffing:
      'Isebenza iiyure ezingama-24 inegqirha elinye ubuncinane (medical officer), abongikazi abachwephesheyo, ababelekisi, kunye nabasebenzi bencedo. Ii-CHC ezinkulu zinokuba nogqirha wamazinyo, ingcali yengqondo, okanye unontlalontle. Abasebenzi bezempilo basekuhlaleni badibanisa i-CHC neekliniki noluntu olungqongileyo.',
    whenToGo:
      'Yiya kwi-CHC xa ikliniki yakho ivaliwe (emva kweeyure zomsebenzi, ngeempelaveki, ngeeholide zikawonke-wonke) kwaye imeko yakho ingxamisekile kodwa ingasongeli bomi. Ii-CHC zikwalikhetho elifanelekileyo lokubeleka okungenazingxaki ukuba ubhukishelwe ukubeleka ngokwendalo. Ukuba ufuna utyando longxamiseko, yiya esibhedlele sesithili endaweni yoko.',
    referralLevel: 1,
    referralFlow:
      'Ii-CHC zithumela kwizibhedlele zesithili iimeko zotyando, ukubeleka okunengxaki, ukulaliswa okungaphaya kweeyure ezingama-48, nayo nayiphi na imeko efuna uvavanyo lwengcali. Ezinye iikliniki zithumela izigulane kwii-CHC kwiinkonzo ezingenakuzinika (amazinyo, ukubelekisa) phambi kokuba zizinyusele kwinqanaba lesibhedlele.',
  },

  district_hospital: {
    description:
      'Isibhedlele sesithili linqanaba lokuqala lonyango lwasesibhedlele. Silalisa izigulane, senza utyando phantsi kokulaliswa ngokupheleleyo, sine-X-ray nezixhobo zelebhoratri, kwaye siqhuba icandelo longxamiseko leeyure ezingama-24. I-South Africa inezibhedlele zesithili ezimalunga nama-260, kwaye zijongana nesininzi esikhulu sokulaliswa kotyando, kokubelekisa, nakwabantwana kwicandelo likawonke-wonke. Isibhedlele sesithili ngokuqhelekileyo sikhonza indawo emiselweyo kwaye sifumana izigulane ezithunyelwe zizikliniki ezingqongileyo ezili-10-30. Ubungakanani beebhedi busuka kwiibhedi ezingama-30 (izibhedlele ezincinci zasemaphandleni) ukuya kwiibhedi ezingama-400+ (izibhedlele zesithili zasezidolophini ezifana ne-Kalafong e-Pretoria).',
    canDo: [
      'Icandelo longxamiseko leeyure ezingama-24 elisebenzisa i-South African Triage Scale (SATS)',
      'Utyando ngokubanzi: ukukhutshwa kwe-appendix, ukulungiswa kwe-hernia, utyando lokubeleka, ukulungiswa kwethambo elaphukileyo',
      'Unyango lokubeleka kubandakanya utyando lokubeleka, ukubelekisa ngomatshini otsalayo (vacuum), nolawulo lokopha emva kokubeleka',
      'Ukulaliswa kwabantwana ngenxa yomkhuhlane wemiphunga, ukoma kwamanzi emzimbeni, ukungondleki, kunye nonyango lweentsana ezisandula ukuzalwa (uninzi lunegumbi leentsana, hayi i-NICU)',
      'I-X-ray, i-ultrasound, kunye nelebhoratri ekhoyo apho esikhungweni (ukubalwa kwegazi ngokupheleleyo, ikhemistri, ibhanki yegazi)',
      'Amawadi onyango lwangaphakathi: ukujongana nokusilela kwentliziyo, iingxamiseko zeswekile, iintlungu zezintso, ukuqhawuka kwemithambo yobuchopho',
      'Ukubekwa esweni kwengqondo kuvavanyo lweeyure ezingama-72 phantsi komthetho i-Mental Health Care Act',
      '<a href="/guides/dental-care-public-clinics">Ukurhoxiswa kwamazinyo</a> kunye nemisebenzi yamazinyo yongxamiseko',
      'Ukufakwa kwegazi nolawulo lwamanzi angena emithanjeni (IV)',
    ],
    cannotDo: [
      'Utyando lweengcali: utyando lobuchopho, utyando lwentliziyo, izifakelo zamathambo, imisebenzi ye-laparoscopic',
      'Ukuphefumliswa ngomatshini kwi-ICU ngaphaya kokuzinziswa okusisiseko (uninzi lwezibhedlele zesithili luneebhedi ze-ICU ezingama-0-4)',
      'I-MRI okanye i-CT scan (izibhedlele zesithili ezimbalwa ezinkulu zine-CT, uninzi alunayo)',
      'Iikliniki zeengcali zabangalaliswanga (akukho ngcali zihlala apho — ezinye ziyatyelela ngokujikeleza)',
      'I-ICU yeentsana ezizalwe ngaphambi kwexesha ezingaphantsi kwe-1.5 kg',
      'Unyango lwemitha (radiation therapy) okanye i-chemotherapy',
    ],
    staffing:
      'Isebenza ngoogqirha jikelele (medical officers), abongikazi abachwephesheyo, ababelekisi, oosokhemisti, abathathi bemifanekiso (radiographers), kunye nezingcali zelebhoratri. Uninzi lwezibhedlele zesithili alunazo iingcali ezihlala apho — ingcali etyelelayo evela kwisibhedlele sengingqi inokubamba iikliniki zabangalaliswanga qho ngeveki okanye ngenyanga. Oogqirha abakwinternshiphu (unyaka wenkonzo yoluntu) baxhaphakile kwaye bajongwa ngoogqirha jikelele.',
    whenToGo:
      'Yiya esibhedlele sesithili <a href="/guides/medical-emergency-guide">kwiingxamiseko</a> (ukwenzakala, iintlungu ezikhulu, ubunzima bokuphefumla, ukopha okukhulu), xa ikliniki yakho ikuthumela ne<a href="/guides/hospital-referral-system">ncwadi yokuthunyelwa</a>, okanye xa udinga ukulaliswa ngenxa yemeko engenakulawulwa ekhaya. Kwingxamiseko, yiya ngqo kwicandelo lokugula kakhulu (casualty) — akukho ncwadi yokuthunyelwa ifunekayo.',
    referralLevel: 2,
    referralFlow:
      'Izibhedlele zesithili zifumana izigulane ezithunyelwe zizikliniki nezii-CHC. Zithumela phezulu kwizibhedlele zengingqi kuvavanyo lwengcali, nakwizibhedlele eziphakamileyo kunyango lweengcali ezikhethekileyo. Ukuthunyelwa ezantsi: emva kokuzinziswa okanye utyando, izigulane zibuyiselwa kwiikliniki zazo ukuze zilandelelwe kwaye zifumane unyango lwexesha elide.',
  },

  regional_hospital: {
    description:
      'Isibhedlele sengingqi sinika iinkonzo zeengcali ezingenakunikwa zizibhedlele zesithili. I-South Africa inezibhedlele zengingqi ezimalunga nama-50, nganye ikhonza izithili ezininzi. Zineengcali ezihlala apho kunyango lwangaphakathi, utyando, unyango lwabantwana, ukubelekisa, unyango lwamathambo, kunye nonyango lwengqondo. Izibhedlele zengingqi zinoomatshini be-CT, ii-ICU ezinkulu, kwaye zinako ukwenza utyando olunzima izibhedlele zesithili ezilithumela phezulu. Imizekelo iquka i-Rob Ferreira Hospital (Mpumalanga), i-Klerksdorp-Tshepong (North West), kunye ne-King Edward VIII (KZN). Amaxesha okulinda amadinga eengcali angangxamisekanga anokuba ziinyanga ezi-3-12.',
    canDo: [
      'Iikliniki zeengcali zabangalaliswanga: unyango lwamathambo (orthopaedics), i-ENT, unyango lwamehlo (ophthalmology), unyango lwesikhumba (dermatology), unyango lwendlela yomchamo (urology), unyango lwengqondo (psychiatry)',
      'Utyando olunzima: ukutshintshwa kwamalungu omzimba (joint replacements), ukulungiswa kwamathambo aphuke kakubi, imisebenzi ye-laparoscopic, utyando lokulungisa umzimba (plastic surgery)',
      'Ukuskena kwe-CT nemifanekiso ephucukileyo (ezinye zine-MRI)',
      'I-ICU enamandla okuphefumlisa (ngokuqhelekileyo iibhedi ezisi-8-20)',
      'Unyango lokubeleka olunomngcipheko omkhulu: ulawulo lwe-eclampsia, utyando lokubeleka olunzima, i-ICU yeentsana',
      'I-chemotherapy yomhlaza oqhelekileyo (i-oncology yabangalaliswanga)',
      'Ukuhlanjululwa kwegazi kwizintso (dialysis) (kunciphile — ihlala ineluhlu olude lokulinda)',
      'Ukulaliswa kunyango lwengqondo ngaphaya kokubekwa esweni kweeyure ezingama-72',
    ],
    cannotDo: [
      'Utyando lweengcali ezikhethekileyo: utyando lobuchopho, utyando lwentliziyo, ukufakelwa kwamalungu omzimba',
      'I-MRI (uninzi lwezibhedlele zengingqi — ezimbalwa zinayo)',
      'Unyango lwemitha (radiation therapy) (kwizibhedlele eziphakamileyo kuphela)',
      'Icandelo labatshileyo (burns unit) (amacandelo azinikeleyo akwinqanaba eliphakamileyo kuphela)',
      'Uvavanyo lwemfuza (genetic testing) okanye ulawulo lwezifo ezinqabileyo',
    ],
    staffing:
      'Iingcali ezihlala apho kumacandelo aphambili (utyando, unyango lwangaphakathi, i-O&G, unyango lwabantwana, ukulaliswa (anaesthesia), unyango lwamathambo, unyango lwengqondo), oorejistra (abaqeqeshelwa ubungcali), oogqirha jikelele, kunye namaqela apheleleyo oncedo lwezempilo (i-physiotherapy, unyango lomsebenzi, ukutya okusempilweni, ezentlalo). Ukufundiswa kwabafundi bezonyango kunokwenzeka.',
    whenToGo:
      'Ngokuqhelekileyo uya kufika esibhedlele sengingqi ngokuthunyelwa sisibhedlele sesithili — hayi ngqo usuka ekhaya. Okuphuma kulo mgaqo yingxamiseko enkulu (ukwenzakala okukhulu, ukuqhawuka kwemithambo yobuchopho) apho isibhedlele sengingqi sikufuphi kunesibhedlele sesithili. Amadinga eengcali angangxamisekanga abhukishwa kwicandelo labangalaliswanga lesibhedlele sesithili.',
    referralLevel: 3,
    referralFlow:
      'Izibhedlele zengingqi zifumana izigulane ezithunyelwe zizibhedlele zesithili. Zithumela kwizibhedlele eziphakamileyo/eziphakathi kunyango lweengcali ezikhethekileyo (utyando lobuchopho, utyando lwentliziyo, ukufakelwa kwamalungu omzimba, unyango lwemitha). Emva konyango lwengcali, izigulane zithunyelwa ezantsi kwizibhedlele zesithili emva koko kwiikliniki ukuze zifumane unyango oluqhubekayo.',
  },

  tertiary_hospital: {
    description:
      'Isibhedlele esiphakamileyo — esikwabizwa ngokuba sisibhedlele sezemfundo okanye esiphakathi — linqanaba eliphezulu lonyango lukawonke-wonke e-South Africa. Zili-10 zizonke, zonke ziqhagamshelwe kwizikolo zezonyango: i-Groote Schuur ne-Tygerberg (Western Cape), i-Charlotte Maxeke ne-Chris Hani Baragwanath (Gauteng), i-Inkosi Albert Luthuli ne-King Edward VIII (KZN), i-Steve Biko ne-Kalafong (Gauteng/Tshwane), i-Nelson Mandela Academic (Eastern Cape), kunye ne-Universitas (Free State). Ezi zibhedlele zinika iinkonzo zeengcali ezikhethekileyo, uphando oluphucukileyo, kwaye zisebenza njengendawo yokugqibela yokuthunyelwa kwiimeko ezingenakulawulwa kwinqanaba lengingqi. I-Chris Hani Baragwanath e-Soweto sesinye sezibhedlele ezinkulu kunazo zonke ehlabathini ngokwenani leebhedi (malunga neebhedi ezingama-3,200).',
    canDo: [
      'Zonke iinkonzo ezifumaneka kwizibhedlele zengingqi, kunye:',
      'Utyando lobuchopho (utyando lwengqondo nomqolo)',
      'Utyando lwentliziyo: ukutshintshwa kweevalvu, i-coronary artery bypass, utyando lwentliziyo lwabantwana',
      'Ukufakelwa kwamalungu omzimba: izintso, isibindi, intliziyo (i-Groote Schuur yenza utyando lokuqala ehlabathini lokufakelwa kwentliziyo ngo-1967)',
      'Unyango lwemitha (radiation therapy) nonyango olubanzi lomhlaza (oncology)',
      'Amacandelo abatshileyo anee-ICU ezizinikeleyo',
      'I-ICU yeentsana ezizalwe kwangaphambili kakhulu',
      'I-MRI, i-PET-CT, nemifanekiso ephucukileyo',
      'Uvavanyo lwemfuza neekliniki zezifo ezinqabileyo',
      'Uvavanyo lonyango (clinical trials) nonyango olutsha olungafumaneki kwenye indawo kwicandelo likawonke-wonke',
    ],
    cannotDo: [
      'Unyango olusisiseko lokungena ungabhukishanga — ufuna ukuthunyelwa sisikhungo esikwinqanaba elisezantsi',
      'Amayeza aqhelekileyo axesha elide — oku kulawulwa kwinqanaba lekliniki',
      'Amadinga angangxamisekanga angaloo mini — uluhlu lokulinda iinkonzo zeengcali ezikhethekileyo ziinyanga ukuya kwiminyaka',
    ],
    staffing:
      'Iingcali ezikhethekileyo, oonjingalwazi, oogqirha abakhokelayo, oorejistra, oogqirha jikelele, ii-intern, kunye namaqela avela kuwo onke amacandelo ezempilo. Ezi zizibhedlele zezemfundo: abafundi bezonyango, abafundi bobungikazi, kunye nabaqeqeshwayo boncedo lwezempilo bajikeleza kumacandelo. Amaziko ophando asebenza ecaleni konyango.',
    whenToGo:
      'Uya kufika kuphela esibhedlele esiphakamileyo ngokuthunyelwa — ngokuqhelekileyo usuka kwisibhedlele sengingqi, ngamanye amaxesha ngqo usuka kwisibhedlele sesithili kwiimeko ezingxamisekileyo. Okuphuma kulo mgaqo kuphela kukufika kwicandelo longxamiseko unemeko esongela ubomi. Musa ukuya esibhedlele esiphakamileyo ufuna unyango olusisiseko — uya kubuyiselwa uxelelwe ukuba uqale ekliniki.',
    referralLevel: 4,
    referralFlow:
      'Izibhedlele eziphakamileyo sisiphelo somjelo wokuthunyelwa. Zifumana iimeko ezinzima kunazo zonke ezivela kwizibhedlele zengingqi nezesithili. Emva konyango olungxamisekileyo, izigulane zithunyelwa ezantsi zidlula kwezengingqi → ezesithili → ekliniki ukuze zifumane uhlaziyo nolawulo oluqhubekayo. Injongo kukunyanga kwinqanaba elisezantsi elifanelekileyo — iibhedi zezibhedlele eziphakamileyo zinqabile kwaye ziyabiza.',
  },

  satellite_clinic: {
    description:
      'Ikliniki esecaleni sisikhungo sempilo esincinci, esisebenza ixesha elithile, esiqhagamshelwe kwikliniki enkulu okanye kwi-CHC. Isebenza ngeentsuku ezithile (ngokuqhelekileyo iintsuku ezi-2-3 ngeveki) kuluntu olukude kakhulu okanye oluncinci kakhulu ukuba lungaba nesikhungo esisebenza ngokupheleleyo. Iinkonzo zilinganiselwe koko umongikazi omnye anokukunika: ugonyo, ukulandwa kwamayeza axesha elide, uhlolo lwabakhulelweyo, kunye nemfundo ngempilo. Iikliniki ezisecaleni ziqhelekile e-Northern Cape (apho imigama mikhulu) nakwiindawo zolimo ze-Western Cape. Azinagqirha apho kwaye azikwazi ukujongana neengxamiseko.',
    canDo: [
      'Ugonyo ngeentsuku ezimiselweyo',
      'Ukulandwa kwamayeza axesha elide (apakishwe kwangaphambili kwikliniki enkulu)',
      'Utyelelo olusisiseko lwabakhulelweyo (uxinzelelo lwegazi, ubunzima, uvavanyo lomchamo)',
      'Ukubekwa esweni kokukhula novavanyo lokutya kwabantwana abangaphantsi kweminyaka emi-5',
      'Imfundo ngempilo nokusasazwa kweekhondom',
      'Ukutshintshwa kwamabhandeji amanxeba noncedo lokuqala olusisiseko',
    ],
    cannotDo: [
      'Ukufumaniswa kwezifo ezintsha (amandla ovavanyo lonyango alinganiselwe)',
      'Unyango longxamiseko (akukho zixhobo zokuvuselela)',
      'Nawuphi na umsebenzi ongaphaya konyango olusisiseko lwamanxeba',
      'Ukunikezelwa kwamayeza ngaphaya kweepakethe zamayeza axesha elide ezipakishwe kwangaphambili',
      'Ukuqaliswa konyango lwe-HIV okanye lwe-TB (uvavanyo lunokufumaneka, ukuqaliswa kwenzeka kwikliniki enkulu)',
    ],
    staffing:
      'Ngokuqhelekileyo ngumongikazi omnye ochwephesheyo okanye umongikazi obhalisiweyo, ngamanye amaxesha enomsebenzi wezempilo wasekuhlaleni. Umongikazi ujikeleza esuka kwisikhungo esikhulu ngeentsuku ekuvulwe ngazo ikliniki esecaleni.',
    whenToGo:
      'Yiya ekliniki esecaleni ukuze ufumane iinkonzo ezicwangcisiweyo: ukulanda amayeza axesha elide, ukugonyisa umntwana wakho, okanye uhlolo oluqhelekileyo lwabakhulelweyo. Soloko uqinisekisa iintsuku zokusebenza kwangaphambili — iikliniki ezisecaleni azivuli yonke imihla. Nakuphi na okungaphaya konyango oluqhelekileyo, yiya ekliniki enkulu okanye esibhedlele sesithili.',
    referralLevel: 1,
    referralFlow:
      'Iikliniki ezisecaleni zithumela yonke into engaphaya konyango olusisiseko kwikliniki yazo enkulu. Iingxamiseko zitsiba ikliniki esecaleni ngokupheleleyo — tsalela u-10177 ufuna i-ambhulensi okanye uye ngqo kwisikhungo esikufuphi esisebenza iiyure ezingama-24.',
  },
};

export function getFacilityTypeEditorialXh(type: string): FacilityTypeEditorial | undefined {
  return FACILITY_TYPE_EDITORIAL_XH[type];
}

/** isiXhosa labels for the referral hierarchy. Keys mirror REFERRAL_HIERARCHY entries in the English module. */
export const REFERRAL_HIERARCHY_XH = [
  { type: 'satellite_clinic', label: 'Ikliniki Esecaleni', level: 1, levelLabel: 'Eyesiseko' },
  { type: 'clinic', label: 'Ikliniki', level: 1, levelLabel: 'Eyesiseko' },
  { type: 'community_health_centre', label: 'Iziko Lempilo Loluntu', level: 1, levelLabel: 'Eyesiseko' },
  { type: 'district_hospital', label: 'Isibhedlele Sesithili', level: 2, levelLabel: 'Esesithili' },
  { type: 'regional_hospital', label: 'Isibhedlele Sengingqi', level: 3, levelLabel: 'Esengingqi' },
  { type: 'tertiary_hospital', label: 'Isibhedlele Esiphakamileyo / Esiphakathi', level: 4, levelLabel: 'Esiphakamileyo' },
] as const;
