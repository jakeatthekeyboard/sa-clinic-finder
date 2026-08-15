/**
 * isiZulu translation of src/data/facility-editorial.ts (issue #2).
 *
 * Logic is a mirror of the English module — same branches, same order, same
 * thresholds. Only the STRINGS are translated. Facility names, place names,
 * street names, organisation names, programme/drug names (CCMDD, ART, ARV,
 * DOTS, EPI-SA, SATS, Depo-Provera, Road to Health, …), phone numbers and
 * every digit stay verbatim in English — they are identifiers a reader
 * repeats at a clinic counter.
 *
 * HTML tags and href values are kept EXACTLY as in the English source; a
 * render-time helper rewrites the hrefs per locale. Only link text is
 * translated.
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

interface FacilityOverride {
  /** Replaces the auto-generated context paragraph */
  context: string;
  /** Additional tips specific to this facility (appended to service-based tips) */
  facilityTips: string[];
}

const FACILITY_OVERRIDES_ZU: Record<string, FacilityOverride> = {
  'rethabile-community-health-centre-polokwane': {
    context:
      'IRethabile Community Health Centre ingesinye sezikhungo zokunakekelwa okuyisisekelo ezimatasa kakhulu ePolokwane, isebenza njengesango lokunakekelwa kwezempilo emiphakathini yayo yonke iCapricorn District eLimpopo. Njengesikhungo sezempilo somphakathi, simi phakathi komtholampilo oyisisekelo nesibhedlela sesifunda — sinikeza ukuzinzisa iziguli eziphuthumayo amahora angu-24, ukuphathwa kwemithi yesifo esingamahlalakhona, izinsizakalo zezempilo yezingane, ukuhlela umndeni, ukuhlolwa kwe-HIV, nokugonywa. Isikhungo sisiza indawo efaka izingxenye zaseSeshego, eMankweng, nemijondolo ezungezile, lapho izithuthi zomphakathi eziya ezibhedlela ezinkulu zasePolokwane (Pietersburg Provincial Hospital, Mankweng Hospital) zingathatha ngaphezu kwehora ohambweni ngalunye. IRethabile isebenza usuku lonke nobusuku, okwenza ibe ngenye yezindawo ezimbalwa zokunakekelwa okuyisisekelo zamahora angu-24 kule ndawo ngaphandle kweminyango yeziphuthumayo yezibhedlela. Umugqa wemithi yesifo esingamahlalakhona uvame ukuba mude kakhulu ngoMsombuluko nangoMsombuluko wokuqala wenyanga ngayinye — iziguli ezilanda amaphakethe enyanga kufanele zizame ukuvakasha phakathi nesonto ukunciphisa isikhathi sokulinda. Abantu abaningi baseLimpopo bahlala emakhaya futhi bathembele kakhulu ekunakekelweni kwezempilo komphakathi, futhi izinsizakalo ezelulekiwe zeRethabile (izinsizakalo eziqinisekisiwe ezingu-6 kufaka <a href="/services/emergency">ukunakekelwa okuphuthumayo kwamahora angu-24</a>) zenza sibe yisikhungo esibalulekile emiphakathini okumele ngabe ihamba iye esibhedlela sesifunda ukuze ithole ukunakekelwa ngemva kwamahora omsebenzi.',
    facilityTips: [
      'IRethabile isebenza amahora angu-24 kodwa isikhathi esimatasa kakhulu yikuseni ngoMsombuluko nasekupheleni kwenyanga. Fika ngaphambi kuka-07:00 noma uvakashe phakathi nesonto ukuze imigqa ibe mifushane.',
      'Ekulandeni <a href="/services/chronic-medication">imithi yesifo esingamahlalakhona</a>, buza mayelana nokubhaliswa ku-CCMDD — iziguli ezizinzile zingalanda ekhemisi lasePick n Pay ePolokwane Mall esikhundleni sokuma emugqeni esikhungweni.',
      '<a href="/services/hiv-testing">Ukuhlolwa kwe-HIV</a> kanye <a href="/services/family-planning">nokuhlela umndeni</a> yizinsizakalo zokungena ungabhukhile — akudingeki ukubhuka noma incwadi yokuthunyelwa. Intsha eneminyaka engu-12 nangaphezulu ingakuthola ukuhlela umndeni ngasese ngaphandle kwemvume yomzali.',
      'Uma udinga ukunakekelwa kwamazinyo, iRethabile okwamanje ayinazo izinsizakalo zamazinyo — isikhungo somphakathi samazinyo esiseduze kakhulu sisePietersburg Provincial Hospital (umnyango wamazinyo wangaphandle, uMsombuluko kuya kuLwesihlanu).',
      'Ezimweni ezidinga i-X-ray, i-ultrasound, noma ukuhlinzwa, iRethabile izokhipha incwadi yokuthunyelwa eya ePietersburg Provincial Hospital noma eMankweng Hospital. Gcina incwadi yakho yokuthunyelwa — izibhedlela azikwazi ukubona abantu abangenayo bengaphuthumi ngaphandle kwayo.',
      '<strong>Ukufika lapha ngetekisi:</strong> Usuka esitobhini samatekisi sasePolokwane Central kuDevenish Street noma esitobhini samatekisi sase-Indian Centre, iRethabile useduze ngetekisi elifushane noma uhambo lwezinyawo lwemizuzu engu-10-15 ubheke eningizimu ngoMagazyn Street. Amatekisi asuka eSeshego naseMankweng adlula eCBD — tshela umshayeli ukuthi uya eRethabile kuMagazyn Street. Uma uvela ngaphandle kwePolokwane, amatekisi ahamba ibanga elide afika esitobhini esimaphakathi futhi ungahamba ngezinyawo usuka lapho.',
      '<strong>Ukuvakasha kokuqala — okumele ukuphathe:</strong> (1) Incwadi yakho yomazisi yaseNingizimu Afrika, ikhadi lomazisi elihlakaniphile, noma ipasipoti. (2) Ikhadi lakho lomtholampilo uma unalo elivela esikhungweni sangaphambilini — leli lisiza umhlengikazi ukubona umlando wakho wezempilo. (3) Noma yiziphi iziqukathi zemithi oyisebenzisayo manje noma amaphepha emithi ukuze udokotela abone ukuthi usuvele uphuza ini. (4) Incwadi ye-Road to Health yengane yakho uma uletha ingane izogonywa noma ihlolwe ukukhula. Uma ungenawo umazisi, usengabonwa — umtholampilo awukwazi ukwenqabela muntu ukunakekelwa kwezempilo okuyisisekelo.',
      '<strong>Okulindelekile ekuvakasheni kwakho kokuqala:</strong> Uzoma emugqeni emukelweni ukuze uvulelwe ifayela — umabhalane uzobhala imininingwane yakho akunike ikhadi lomtholampilo. Ube usulinda emugqeni omkhulu ukuze ubone umhlengikazi ohlola ukuqala (umfutho wegazi, izinga lokushisa, isisindo). Kuya ngensizakalo oyidingayo, ungabona umhlengikazi ochwepheshile noma uthunyelwe kudokotela okhona lapho. Ukuvakasha kokuqala kuvame ukuthatha amahora angu-2-4 kufaka nesikhathi sokulinda, ngakho phatha amanzi nokuthile ozokudla. Iziguli zemithi yesifo esingamahlalakhona kufanele zilindele ukubonana nodokotela kokuqala, ukuhlolwa kwegazi, nosuku lokubuya — ngeke uthole imithi yenyanga egcwele ngosuku lokuqala.',
    ],
  },

  'skinner-street-clinic-pretoria': {
    context:
      'ISkinner Street Clinic ingumtholampilo wokunakekelwa kwezempilo okuyisisekelo ePretoria CBD, osiza abantu abahlukahlukene basedolobheni eTshwane. Indawo yawo emaphakathi — kuSkinner Street eduze kwesiteshi sesitimela sasePretoria nezitobhi zamatekisi ezinkulu — yenza ube ngomunye wemitholampilo efinyeleleka kalula kubantu abagibela beya emsebenzini, abathengisi abangahleliwe, nezakhamuzi zezindawo ezizungezile kufaka iSunnyside, i-Arcadia, neMarabastad. Umtholampilo unikeza <a href="/services/family-planning">ukuhlela umndeni</a>, <a href="/services/immunisation">ukugonywa</a>, kanye <a href="/services/hiv-testing">nokuhlolwa kwe-HIV</a> njengezinsizakalo zawo eziyisisekelo eziqinisekisiwe. Imitholampilo yasedolobheni njengeSkinner Street isiza abantu abadlulayo — iziguli eziningi ngabasebenzi abafudukayo, abafuna ukukhoseliswa, nabantu bakwamanye amazwe abasebenza eCBD. Ngaphansi komthetho waseNingizimu Afrika, bonke abantu banelungelo lokunakekelwa kwezempilo okuyisisekelo kungakhathaliseki ubuzwe noma amaphepha abo, futhi iSkinner Street Clinic inikeza izinsizakalo kunoma ubani ongenayo. IGauteng inezikhungo zezempilo zomphakathi eziminyene kunazo zonke eNingizimu Afrika, kodwa ukuminyana kwabantu — ikakhulukazi eTshwane CBD — kusho ukuthi imitholampilo ivame ukusebenza igcwele. Umtholampilo uheha abantu abaningi abahambayo ngenxa yokusondelana kwawo nezithuthi zomphakathi, futhi imigqa yasekuseni ingaqhubekela ngaphandle kwesakhiwo ngo-08:00.',
    facilityTips: [
      'ISkinner Street Clinic imatasa kakhulu phakathi kuka-07:00 no-10:00 ngenxa yabagibeli abangena ngaphambi komsebenzi. Uma ukuvakasha kwakho kungasheshi, ukufika ngemva kuka-10:00 kuvame ukusho ukulinda okufushane.',
      '<a href="/services/hiv-testing">Ukuhlolwa kwe-HIV</a> kuyimfihlo futhi kungenziwa ngokungaziwa — akudingeki unikeze igama lakho langempela noma umazisi. Imiphumela ithatha imizuzu engu-15.',
      'Ekuhleleni <a href="/services/family-planning">umndeni</a>, umtholampilo unikeza imijovo (Depo-Provera, Nur-Isterate), amaphilisi okuvimbela ukukhulelwa, namakhondomu. Ekufakelweni i-implant (Implanon) noma i-IUD, ungadinga ukuthunyelwa e-CHC eseduze noma eTshwane District Hospital.',
      'Uma udinga izinsizakalo ezingaphezu kwalezo iSkinner Street eyinikezayo (imithi yesifo esingamahlalakhona, ama-ARV, ukwelashwa kwe-TB, amazinyo), izikhungo eziphelele eziseduze kakhulu yiPretoria West Hospital (iziphuthumayo, imithi yesifo esingamahlalakhona) neSteve Biko Academic Hospital (ukuthunyelwa kochwepheshe).',
      'Amakhondomu abesilisa nawabesifazane amahhala ayatholakala emukelweni ngaphandle kokubonana nodokotela. Akudingeki ubone umhlengikazi — buza nje etafuleni langaphambili.',
      '<strong>Ukufika lapha ngetekisi:</strong> Kunesitobhi samatekisi (TR067) ngqo kuDr Savage Road lapho umtholampilo ukhona. Isitobhi samatekisi esingaphansi komhlaba saseBloed Street Mall — esikhulu kunazo zonke eCBD — sikude ngamamitha angu-590 (cishe uhambo lwezinyawo lwemizuzu engu-7 ubheke empumalanga ngoBloed Street). ISiteshi sasePretoria sikude ngohambo lwezinyawo lwemizuzu engu-5 ubheke eningizimu. Uma ufika ngetekisi lebanga elide livela ngaphandle kweTshwane, imizila eminingi iphelela ezitobhini zaseBloed Street noma eMarabastad — kunoma yisiphi kuzo, hamba ngezinyawo ubheke eningizimu ngayo noma yimuphi umgwaqo onqamulayo ukuze ufinyelele kuDr Savage Road.',
      '<strong>Ukuvakasha kokuqala — okumele ukuphathe:</strong> (1) Noma yisiphi isazisi — incwadi yomazisi yaseNingizimu Afrika, ikhadi lomazisi elihlakaniphile, ipasipoti, noma imvume yokufuna ukukhoseliswa. Uzokwelashwa noma ungenawo amaphepha, kodwa ukuba nomazisi kusheshisa ukuvulwa kwefayela. (2) Ikhadi lakho lomtholampilo elivela kunoma yisiphi isikhungo sangaphambilini, uma unalo. (3) Noma yimuphi umuthi owuphuzayo manje, kufaka nemithi yesintu — phatha iziqukathi ukuze umhlengikazi ahlole ukungahambisani kwemithi. (4) Ekugonyweni kwezingane, phatha incwadi ye-Road to Health.',
      '<strong>Okulindelekile ekuvakasheni kwakho kokuqala:</strong> Emukelweni uzovula ifayela lesiguli (noma kukhishwe ifayela lakho elikhona uma usuke wavakasha ngaphambili). Ube usulinda ukubona umhlengikazi ohlola izimpawu zomzimba. Ekuhlolweni kwe-HIV, uzothola ukwelulekwa ngaphambi kokuhlolwa, ukuhlolwa okusheshayo ngokuhlatshwa emunweni, nokwelulekwa ngemva kokuhlolwa — yonke inqubo ithatha cishe imizuzu engu-30-45. Ekuhleleni umndeni, umhlengikazi uzoxoxa ngezindlela ozikhethayo futhi angakunika izindlela eziningi ngalo lolo suku. Lindela amahora angu-1-3 esewonke kuya ngokuthi umtholampilo umatasa kangakanani. Fika usudlile — alikho ikhefi, kodwa abathengisi basemgwaqweni basebenza ngaphandle.',
    ],
  },

  'symphony-way-community-day-centre-delft': {
    context:
      'ISymphony Way Community Day Centre isiza umphakathi waseDelft eCape Flats, enye yezindawo eziminyene kakhulu nezingasizwa ngokwanele eNtshonalanga Koloni. IDelft yasungulwa njengephrojekthi yezindlu ngemva kobandlululo ngasekupheleni kwawo-1990 futhi ikhule ngokushesha, inabantu abangaphezu kuka-150,000 — abaningi behlala ezakhiweni ezingekho emthethweni eduze kwezindlu ezisemthethweni ze-RDP. Isikhungo sisebenza njengomtholampilo wokunakekelwa kwezempilo okuyisisekelo onikeza <a href="/services/family-planning">ukuhlela umndeni</a>, <a href="/services/immunisation">ukugonywa</a>, kanye <a href="/services/hiv-testing">nokuhlolwa kwe-HIV</a>. Udlame lwamaqembu ezigelekeqe nokusetshenziswa kabi kwezidakamizwa (ikakhulukazi i-methamphetamine/tik) yizinselelo ezinkulu zezempilo emphakathini waseDelft, futhi isikhungo sibona inani eliphakeme labantu abafika belimele ngaphezu kokunakekelwa okuyisisekelo okujwayelekile. INtshonalanga Koloni inengqalasizinda yezempilo yomphakathi ethuthuke kakhulu ngaphandle kweGauteng, inezindlela eziqinile zokuthunyelwa — iSymphony Way ithumela amacala anzima eDelft Community Health Centre (isikhungo esikhulu esinezinsizakalo ezelulekiwe) noma eKarl Bremer Hospital naseTygerberg Hospital ukuze kutholakale ukunakekelwa kochwepheshe. ICape Flats inamazinga aphakeme kunawo wonke ezweni odlame phakathi kwabantu, futhi izikhungo ezinjengeSymphony Way zivame ukuba yindawo yokuqala yokuthola usizo lwezempilo kwabahlukunyeziwe nabashaywayo emakhaya.',
    facilityTips: [
      'ISymphony Way isebenza ngamahora ajwayelekile omtholampilo (hhayi amahora angu-24). Ezimweni eziphuthumayo ngemva kwamahora omsebenzi, isikhungo esiseduze kakhulu esisebenza amahora angu-24 yiDelft Community Health Centre noma umnyango weziphuthumayo waseKarl Bremer Hospital.',
      '<a href="/services/hiv-testing">Ukuhlolwa kwe-HIV</a> kuyatholakala njengensizakalo yokungena ungabhukhile. Uma utholakala unegciwane, ukuqalwa kwama-ARV ngalo lolo suku kuyatholakala eDelft Community Health Centre — umhlengikazi eSymphony Way uzokusiza ngokuthunyelwa.',
      'Kwabahlukunyeziwe noma abashaywe emakhaya: umtholampilo unganikeza amaphepha okuqala ezempilo (ifomu le-J88 le-SAPS), ukunakekelwa kwamanxeba, nokuthunyelwa eThuthuzela Care Centre eKarl Bremer Hospital ukuze uhlolwe ngokwezomthetho futhi welulekwe.',
      'Umtholampilo unikeza <a href="/services/immunisation">ukugonywa</a> ngokohlelo olugcwele lwe-EPI-SA. Phatha incwadi ye-Road to Health yengane yakho. Uma incwadi ilahlekile, umtholampilo ungakhipha entsha.',
      'Uma udinga imithi yesifo esingamahlalakhona, ukwelashwa kwe-TB, ama-ARV, noma ukunakekelwa kwamazinyo, iDelft Community Health Centre (cishe amakhilomitha angu-2km ukusuka lapha kuDelft Main Road) inikeza uhla olubanzi lwezinsizakalo futhi isebenza amahora angu-24.',
      'Imizila yamabhasi eGolden Arrow nemizila engenisayo yeMyCiTi isiza iDelft. Umtholampilo ufinyeleleka usuka kuSymphony Way — qinisekisa ikheli eliqondile nekhansela lewadi lakini uma uvakasha okokuqala.',
    ],
  },

  'phoenix-assessment-therapy-centre-phoenix': {
    context:
      'IPhoenix Assessment & Therapy Centre yisikhungo esisezingeni lesibhedlela sesifunda ePhoenix, ilokishi elikhulu elisenyakatho yeTheku KwaZulu-Natal. Isikhungo sinikeza ukuphathwa <a href="/services/chronic-medication">kwemithi yesifo esingamahlalakhona</a>, <a href="/services/emergency">izinsizakalo eziphuthumayo zamahora angu-24</a>, ukuhlolwa nokwelashwa <a href="/services/mental-health">kwempilo yengqondo</a>, kanye <a href="/services/immunisation">nokugonywa</a>. Ukugxila kwaso ekuhloleni nasekwelapheni kwenza sihluke ezibhedlela ezijwayelekile — isikhungo sibhekana nokuhlolwa kwengqondo, ukwelashwa ngomsebenzi (occupational therapy), nokuvuselelwa ngaphezu kwezinsizakalo ezijwayelekile zesibhedlela sesifunda. IPhoenix inabantu abacishe babe ngu-500,000, enamazinga aphakeme ezifo ezingamahlalakhona (isifo sikashukela nomfutho wegazi ophakeme kudlange kakhulu emphakathini wamaNdiya aseNingizimu Afrika), izinkinga zokusetshenziswa kabi kwezidakamizwa, nezimo zempilo yengqondo. IKwaZulu-Natal inamazinga aphakeme kunawo wonke emhlabeni okusabalala kwe-HIV, futhi isikhungo simi kahle ukunikeza ukuphathwa okuhlanganisiwe kwezifo ezingamahlalakhona — iziguli eziphuza kokubili ama-ARV nemithi yomfutho wegazi zingalawula izimo zazo esikhungweni esisodwa. Insizakalo yeziphuthumayo yamahora angu-24 yenza iPhoenix Assessment & Therapy Centre ibe yindawo ebalulekile ngemva kwamahora omsebenzi emiphakathini yasePhoenix, eVerulam, nasezindaweni ezizungezile okumele ngabe ihamba iye eMahatma Gandhi Memorial Hospital noma eKing Edward VIII Hospital eThekwini.',
    facilityTips: [
      'Isikhungo sisebenza amahora angu-24 ezimweni eziphuthumayo. Ukubonana okungaphuthumi (ukubuyekezwa kwemithi yesifo esingamahlalakhona, izikhathi zokwelashwa) kungokubhuka ngamahora omsebenzi.',
      '<a href="/services/mental-health">Impilo yengqondo</a> ingamandla ayinhloko yalesi sikhungo. Ungazithumela wena ukuze uhlolelwe impilo yengqondo — akudingeki incwadi yokuthunyelwa evela emtholampilo. Isikhungo sinabelaphi ngomsebenzi nabahlengikazi bengqondo abaqashiwe.',
      'Ekutholeni <a href="/services/chronic-medication">imithi yesifo esingamahlalakhona</a> (umfutho wegazi ophakeme, isifo sikashukela), buza mayelana nokubhaliswa ku-CCMDD ngemva kwezinyanga ezingu-6 zokwelashwa okuzinzile. Izindawo zokulanda ePhoenix naseVerulam zikuvumela ukulanda imithi ngaphandle kokuvakashela isikhungo nyanga zonke.',
      'Uma udinga ukwelashwa ngama-ARV, indawo yomphakathi eseduze kakhulu yokuqalwa kwama-ARV yiMahatma Gandhi Memorial Hospital (amakhilomitha angu-8km eningizimu ku-R102). IPhoenix Assessment & Therapy Centre ingaqapha imithi yesifo esingamahlalakhona kodwa qinisekisa amandla okuqala ama-ARV ngaphambi kokuvakasha ngaleyo njongo ethile.',
      'Ukuhlolwa nokuthunyelwa ngenxa yenkinga yokusebenzisa kabi izidakamizwa kuyatholakala ngomnyango wempilo yengqondo. Isikhungo singathumela ezikhungweni zesifundazwe zokuvuselela abasebenzisa izidakamizwa KwaZulu-Natal — uhlu lokulinda luvame ukuba yizinyanga ezingu-2-4.',
      'Umnyango weziphuthumayo usebenzisa i-South African Triage Scale (SATS). Iziguli ezimakwe ngoluhlaza okotshani (ezingaphuthumi) zingalinda amahora ambalwa, ikakhulukazi ngezimpelasonto. Ekunakekelweni okujwayelekile, vakasha ekuseni phakathi nesonto.',
      '<strong>Ukufika lapha ngetekisi:</strong> Isitobhi samatekisi sasePhoenix Plaza kuParthenon Street (Starwood) siyinhloko yamatekisi ePhoenix — amatekisi ahamba ukusuka lapho aye esikhungweni kuLenhan Drive. Usuka eDurban Central, thatha itekisi eliya ePhoenix Plaza esitobhini saseDurban Station (imizila ihamba kusukela cishe ngo-06:00 kuya ku-23:30). Usuka e-Umhlanga/Gateway, umzila wamatekisi we-Umhlanga-Phoenix uphelela ePhoenix Plaza. Tshela umshayeli ukuthi udinga i-Assessment & Therapy Centre kuLenhan Drive. Ungaphinde ushayele isikhungo ku-+27 31 508 0700 ucele iziqondiso ezisuka endaweni yakho ethile.',
      '<strong>Ukuvakasha kokuqala — okumele ukuphathe:</strong> (1) Incwadi yakho yomazisi yaseNingizimu Afrika, ikhadi lomazisi elihlakaniphile, noma ipasipoti. Uma ungowakwelinye izwe, phatha ipasipoti yakho noma imvume yokufuna ukukhoseliswa — ukwelashwa akunqatshelwa, kodwa amaphepha asiza ukuvula ifayela lakho. (2) Noma yiyiphi incwadi yokuthunyelwa evela emtholampilo noma kudokotela — ekuvakasheni okungaphuthumi, incwadi yokuthunyelwa isheshisa inqubo, nakuba ukuzithumela kwamukelekile ekuhlolweni kwempilo yengqondo. (3) Zonke iziqukathi zemithi oyisebenzisayo manje namaphepha emiphumela yokuhlolwa kwegazi onawo, ikakhulukazi ezifweni ezingamahlalakhona (umfutho wegazi ophakeme, isifo sikashukela, isithuthwane). (4) Incwadi ye-Road to Health yengane yakho uma uletha ingane izogonywa. (5) Ekuvakasheni ngempilo yengqondo, phatha imininingwane yanoma yikuphi ukwelashwa kwengqondo kwangaphambilini, amagama emithi, nezilinganiso zayo.',
      '<strong>Okulindelekile ekuvakasheni kwakho kokuqala:</strong> Ezimweni eziphuthumayo, uzohlungwa ngokushesha kusetshenziswa i-South African Triage Scale enemibala — obomvu (ukuvuselelwa), i-orenji (okuphuthumayo), ophuzi (okusheshayo), oluhlaza okotshani (okujwayelekile). Iziguli zoluhlaza okotshani kufanele zilindele ukulinda amahora ambalwa. Emithini yesifo esingamahlalakhona engaphuthumi, uzobhalisa emukelweni, uvulelwe ifayela, bese ubona udokotela ekubonaneni kokuqala okufaka umfutho wegazi, ushukela egazini, nokuhlolwa kwegazi. Uzothola usuku lokubuya, imvamisa emva kwamasonto angu-2-4, ukuze kubuyekezwe imiphumela uqale imithi. Empilweni yengqondo, ukuhlolwa kokuqala kuthatha imizuzu engu-45-60 nomhlengikazi wengqondo noma umelaphi ngomsebenzi, ozokwakha uhlelo lokwelashwa. Phatha umuntu okuphelezelayo uma uzizwa unovalo ngokuvakasha — ilungu lomndeni lingalinda nawe futhi lijoyine ekubonaneni uma uthanda.',
    ],
  },

  'ethafeni-clinic-tembisa': {
    context:
      'I-Ethafeni Clinic yisikhungo sokunakekelwa kwezempilo okuyisisekelo esisebenza amahora angu-24 esisiza iTembisa, elinye lamalokishi amakhulu kunawo wonke aseGauteng elilinganiselwa kubantu abangaphezu kuka-500,000. Litholakala empumalanga yeGoli eduze kweKempton Park, iTembisa iyindawo yokuhlala eminyene lapho izixhumanisi zezithuthi zomphakathi eziya ezibhedlela ezinkulu zingathatha ngaphezu kwehora. Isimo se-Ethafeni samahora angu-24 senza ibe ngenye yezindawo ezimbalwa zokunakekelwa okuyisisekelo ngemva kwamahora omsebenzi emphakathini waseTembisa ngaphandle komnyango weziphuthumayo weTembisa Provincial Tertiary Hospital. Umtholampilo unikeza <a href="/services/emergency">ukuzinzisa iziguli eziphuthumayo</a>, <a href="/services/family-planning">ukuhlela umndeni</a>, <a href="/services/immunisation">ukugonywa</a>, kanye <a href="/services/hiv-testing">nokuhlolwa kwe-HIV</a>. ITembisa ibhekene nezinselelo ezinkulu zezempilo yomphakathi kufaka ukusabalala okuphezulu kwe-HIV, i-TB, nezifo ezingamahlalakhona zendlela yokuphila — ukufinyeleleka komtholampilo ngemva kwamahora omsebenzi kubalulekile kubasebenzi bamashifu ezindaweni zezimboni eziseduze abangakwazi ukuza ngamahora ajwayelekile omtholampilo.',
    facilityTips: [
      'I-Ethafeni isebenza amahora angu-24 kodwa izinsizakalo ezingaphuthumi (ukuhlela umndeni, ukugonywa) zivame ukutholakala ngamahora ajwayelekile aphakathi nesonto kuphela. Shayela kuqala ku-+27 11 925 6222 uqinisekise uma udinga insizakalo ethile ngemva kwamahora omsebenzi.',
      '<a href="/services/hiv-testing">Ukuhlolwa kwe-HIV</a> kumahhala futhi kuyimfihlo. Uma utholakala unegciwane, buza mayelana nokuqalwa kwe-ART ngalo lolo suku — umhlengikazi angakuqalisa ukwelashwa ngaso leso sikhathi noma akuthumele eTembisa Provincial Tertiary Hospital ukuze uqale ama-ARV.',
      'Emithini yesifo esingamahlalakhona, isikhungo esiseduze kakhulu esinesigaba esizinikele sokukhipha imithi yiTembisa Provincial Tertiary Hospital. Buza abahlengikazi base-Ethafeni mayelana nezindawo zokulanda ze-CCMDD eTembisa uma usuvele uzinzile ekwelashweni.',
      'ITembisa isizwa yimizila eminingi yamatekisi. Umtholampilo ufinyeleleka usuka esitobhini samatekisi esikhulu saseTembisa — qinisekisa indawo eqondile nomshayeli ngoba iTembisa inezikhungo zezempilo eziningi ezisabalele elokishini.',
    ],
  },

  'lilian-ngoyi-community-clinic-johannesburg': {
    context:
      'ILilian Ngoyi Community Clinic isebenza ezingeni lesibhedlela sesifunda eGoli, inikeza izinsizakalo zamahora angu-24 kufaka <a href="/services/emergency">ukunakekelwa okuphuthumayo</a>, ukuphathwa <a href="/services/chronic-medication">kwemithi yesifo esingamahlalakhona</a>, kanye <a href="/services/immunisation">nokugonywa</a>. Iqanjwe ngomlweli wenkululeko uLilian Masediba Ngoyi, isikhungo siqhutshwa uMnyango Wezempilo waseGauteng futhi sisiza imiphakathi kuwo wonke amadolobha asentshonalanga yeGoli nezindawo ezizungezile. Njengesikhungo esisezingeni lesibhedlela sesifunda, simi ngaphezu komtholampilo oyisisekelo ochungechungeni lokuthunyelwa — singalawula izifo ezingamahlalakhona, sizinzise izimo eziphuthumayo, futhi sinikeze izinsizakalo imitholampilo emincane ezungezile ethumela kuzo iziguli. Uhlelo lwezempilo lomphakathi lwaseGoli lubhekana namanani amakhulu eziguli, futhi ukusebenza kweLilian Ngoyi amahora angu-24 kanye namandla ayo emithi yesifo esingamahlalakhona kwenza ibe yindlela ebalulekile eyenye kunemnyango yeziphuthumayo eminyene ezibhedlela ezinkulu njengeChris Hani Baragwanath neCharlotte Maxeke.',
    facilityTips: [
      'Isikhungo sisebenza amahora angu-24 ezimweni eziphuthumayo. Ekulandeni imithi yesifo esingamahlalakhona, fika ekuseni phakathi nesonto — umugqa wasekhemisi mude kakhulu ngoMsombuluko nasekupheleni kwenyanga.',
      'Iziguli <a href="/services/chronic-medication">zemithi yesifo esingamahlalakhona</a> ezizinzile izinyanga ezingu-6 nangaphezulu kufanele zibuze mayelana nokubhaliswa ku-CCMDD. Lolu hlelo lukuvumela ukulanda imithi yakho yenyanga ekhemisi elibambe iqhaza eliseduze nasekhaya.',
      'Ezimweni ezidinga ukunakekelwa kochwepheshe (izifo zamathambo, izifo zenhliziyo, umdlavuza), iLilian Ngoyi izokhipha incwadi yokuthunyelwa eCharlotte Maxeke Johannesburg Academic Hospital noma eChris Hani Baragwanath. Gcina incwadi yakho yokuthunyelwa — ochwepheshe abakwazi ukubona iziguli ezingaphuthumi ngaphandle kwayo.',
      'Xhumana nesikhungo ku-+27 11 933 0202 uqinisekise amahora okusebenza ezinsizakalo ezithile ngaphambi kokuhamba.',
    ],
  },

  'blue-downs-clinic-western-cape': {
    context:
      'IBlue Downs Clinic yisikhungo sokunakekelwa kwezempilo okuyisisekelo esiqhutshwa yiCity of Cape Town, esisiza umphakathi waseBlue Downs endaweni ebanzi yase-Eerste Rivier/Kuilsrivier eNtshonalanga Koloni. IBlue Downs yindawo yokuhlala eseCape Flats enabantu abanamaholo ahlukene, ebekwe eduze kweStellenbosch Arterial phakathi kwe-Eerste Rivier neMfuleni. Umtholampilo unikeza <a href="/services/family-planning">ukuhlela umndeni</a>, <a href="/services/immunisation">ukugonywa</a>, kanye <a href="/services/hiv-testing">nokuhlolwa kwe-HIV</a> njengezinsizakalo zawo eziyisisekelo eziqinisekisiwe. Isikhungo asisebenzi amahora angu-24 — ezimweni eziphuthumayo ngemva kwamahora omsebenzi, izindawo eziseduze kakhulu yi-Eerste Rivier Hospital noma iKarl Bremer Hospital. INtshonalanga Koloni inezindlela zokuthunyelwa ezihleliwe, futhi iBlue Downs Clinic ithumela amacala anzima ezikhungweni zezempilo ze-Khayelitsha/Eastern Sub-structure noma e-Eerste Rivier Hospital ukuze iziguli zilaliswe.',
    facilityTips: [
      'IBlue Downs Clinic isebenza ngamahora ajwayelekile omtholampilo (imvamisa 07:30–16:00 phakathi nesonto). Fika ngaphambi kuka-08:00 ukuze umugqa ube mfushane — ukuvakasha ntambama kuvame ukuthula.',
      '<a href="/services/hiv-testing">Ukuhlolwa kwe-HIV</a> kumahhala, kuyimfihlo, futhi kuyatholakala njengensizakalo yokungena ungabhukhile. Imiphumela ivame ukulunga phakathi kwemizuzu engu-15.',
      '<a href="/services/family-planning">Ukuhlela umndeni</a> kufaka umjovo wokuvimbela ukukhulelwa, amaphilisi, namakhondomu. Ezindleleni ezihlala isikhathi eside (i-implant noma i-IUD), umtholampilo ungakuthumela esikhungweni sezempilo somphakathi esiseduze.',
      'Ezimweni eziphuthumayo ngemva kwamahora omsebenzi, yiya e-Eerste Rivier Hospital (cishe amakhilomitha angu-5km ukusuka lapha) noma ushayele umugqa weziphuthumayo waseNtshonalanga Koloni ku-10177.',
      'Shayela u-+27 21 444 8313 uqinisekise ukuthi umtholampilo uvulile ngaphambi kokuhamba, ikakhulukazi ngamaholide omphakathi.',
    ],
  },

  'idas-valley-clinic-western-cape': {
    context:
      'I-Idas Valley Clinic isiza umphakathi wase-Idas Valley eStellenbosch, eNtshonalanga Koloni. I-Idas Valley yindawo yokuhlala eyayihlalwa abantu ababebizwa ngokuthi ngabaKhaladi ngokomlando, esentshonalanga yeStellenbosch, enenhlanganisela yezindlu ezakhiwa kudala nezindlu zabantu abanamaholo aphansi. Umtholampilo unikeza izinsizakalo zokunakekelwa kwezempilo okuyisisekelo kufaka <a href="/services/family-planning">ukuhlela umndeni</a>, <a href="/services/immunisation">ukugonywa</a>, kanye <a href="/services/hiv-testing">nokuhlolwa kwe-HIV</a>. Isikhungo asisebenzi amahora angu-24. IStellenbosch isizwa uxhaxha lwemitholampilo engenisa eStellenbosch Hospital (izinga lesifunda) emacaleni adinga ukulaliswa, umsebenzi welabhoratri, noma ama-X-ray. IWinelands District inokusabalala kwe-HIV okuphansi kune-Cape Metro, kodwa i-TB isengukukhathazeka okukhulu emiphakathini yasemapulazini — abasebenzi basemapulazini bezinkathi ezithile abadlula kule ndawo bangadinga ukuqhubeka nokunakekelwa, futhi i-Idas Valley Clinic ingasiza ukudluliselwa kwemithi ezinye izikhungo.',
    facilityTips: [
      'Umtholampilo usebenza ngamahora ajwayelekile (phakathi nesonto). Ezimweni eziphuthumayo ngemva kwamahora omsebenzi, iStellenbosch Hospital yisikhungo esiseduze kakhulu esisebenza amahora angu-24 (cishe amakhilomitha angu-3km ukusuka lapha ku-Merriman Avenue).',
      '<a href="/services/immunisation">Ukugonywa kwezingane</a> kulandela uhlelo lukazwelonke lwe-EPI-SA. Phatha incwadi ye-Road to Health yengane yakho. Uma ushiywe umjovo obuhleliwe, umtholampilo unganikeza imijovo yokufica.',
      '<a href="/services/family-planning">Ukuhlela umndeni</a> kuyinsizakalo yokungena ungabhukhile — akudingeki ukubhuka noma incwadi yokuthunyelwa. Kuyatholakala kunoma ubani, kufaka nentsha eneminyaka engu-12 nangaphezulu (kuyimfihlo, akudingeki imvume yomzali).',
      'Uma udinga imithi yesifo esingamahlalakhona, ukwelashwa kwe-TB, noma ukunakekelwa kwamazinyo, iStellenbosch Hospital noma iCloetesville Community Health Clinic (eseduze <a href="/clinics/western-cape/cloetesville-community-health-clinic-stellenbosch">eCloetesville</a>) inikeza uhla olubanzi lwezinsizakalo.',
    ],
  },

  'the-newhaven-cape-town': {
    context:
      'IThe Newhaven yisikhungo esisezingeni lesibhedlela sesifunda eDurbanville, eKapa, esinikeza izinsizakalo zamahora angu-24 kufaka <a href="/services/emergency">ukunakekelwa okuphuthumayo</a>, ukuphathwa <a href="/services/chronic-medication">kwemithi yesifo esingamahlalakhona</a>, ukuhlolwa <a href="/services/mental-health">kwempilo yengqondo</a>, kanye <a href="/services/immunisation">nokugonywa</a>. IDurbanville yidolobhana elisenyakatho yeKapa, futhi iThe Newhaven isiza indawo efaka iBellville, iBrackenfell, iKraaifontein, nemiphakathi ezungezile. Izinsizakalo <a href="/services/mental-health">zempilo yengqondo</a> zesikhungo ziyaphawuleka — sinikeza ukuhlolwa kwengqondo, ukwelulekwa, futhi singaqala ukwelashwa kwezimo ezifaka ukucindezeleka engqondweni, ukukhathazeka, nezinkinga zokusebenzisa kabi izidakamizwa. ENtshonalanga Koloni, izinsizakalo zempilo yengqondo zihlelwe ngamazinga, futhi iThe Newhaven imi ezingeni lesifunda — ingalawula iziguli zengqondo ezizinzile futhi ithumele amacala abucayi eStikland Hospital (isikhungo sengqondo sesifundazwe eBellville) noma eTygerberg Hospital ukuze iziguli zilaliswe zelashwe ngokwengqondo.',
    facilityTips: [
      'IThe Newhaven isebenza amahora angu-24 ezimweni eziphuthumayo. Izinsizakalo ezingaphuthumi (ukubuyekezwa kwemithi yesifo esingamahlalakhona, ukubonana ngempilo yengqondo) ziyatholakala ngamahora omsebenzi ngokubhuka.',
      'Izinsizakalo <a href="/services/mental-health">zempilo yengqondo</a> zifaka ukuhlolwa kokuqala kwengqondo nokuphathwa okuqhubekayo kwemithi. Ungazithumela wena — akudingeki incwadi evela emtholampilo. Ekungeneleleni ezimweni ezibucayi, isikhungo singazinzisa bese sithumela eStikland Hospital uma kudingeka ukulaliswa.',
      'Iziguli <a href="/services/chronic-medication">zemithi yesifo esingamahlalakhona</a> ezizinzile ekwelashweni izinyanga ezingu-6 nangaphezulu kufanele zibuze mayelana ne-CCMDD — izindawo zokulanda endaweni yaseDurbanville/Bellville zikuvumela ukulanda imithi yenyanga ngaphandle kokuvakashela isikhungo.',
      'Xhumana no-+27 21 010 0813 uqinisekise ukutholakala kwezinsizakalo ezithile noma ubhuke ukubonana ngempilo yengqondo.',
      'Insizakalo yeziphuthumayo yamahora angu-24 isebenzisa i-South African Triage Scale (SATS). Abafika bengaphuthumi (oluhlaza okotshani) bangalinda isikhathi eside — ekunakekelweni okujwayelekile, vakasha ekuseni phakathi nesonto.',
    ],
  },

  'orchards-clinic-orange-grove-johannesburg': {
    context:
      'I-Orchards Clinic isiza i-Orange Grove nemiphakathi ezungezile enyakatho-mpumalanga yeGoli, kufaka iNorwood, iHoughton Estate, ne-Observatory. Le ndawo inabantu abahlukahlukene kufaka izakhamuzi ezihlale isikhathi eside, abafundi, nomphakathi omkhulu wabafudukayo. Umtholampilo unikeza <a href="/services/family-planning">ukuhlela umndeni</a>, <a href="/services/immunisation">ukugonywa</a>, kanye <a href="/services/hiv-testing">nokuhlolwa kwe-HIV</a> njengezinsizakalo zawo eziyisisekelo. Ngaphansi komthetho waseNingizimu Afrika, bonke abantu banelungelo lokunakekelwa kwezempilo okuyisisekelo kungakhathaliseki ubuzwe noma amaphepha abo — i-Orchards Clinic isiza noma ubani ongenayo. Isikhungo sisebenza ngamahora ajwayelekile omtholampilo (hhayi amahora angu-24). Ezimweni eziphuthumayo ngemva kwamahora omsebenzi, izibhedlela eziseduze kakhulu yiCharlotte Maxeke Johannesburg Academic Hospital kuJubilee Road (cishe amakhilomitha angu-4km eningizimu) neRahima Moosa Mother and Child Hospital ezimweni eziphuthumayo zokubeletha.',
    facilityTips: [
      'I-Orchards Clinic isebenza ngamahora ajwayelekile aphakathi nesonto. Fika ngaphambi kuka-08:00 ukuze ulinde isikhathi esifushane — umtholampilo usiza indawo enkulu futhi imigqa yasekuseni ikhula ngokushesha.',
      '<a href="/services/hiv-testing">Ukuhlolwa kwe-HIV</a> kumahhala, kuyimfihlo, futhi kuyatholakala ngaphandle kokubhuka. Uma utholakala unegciwane, umhlengikazi uzoxoxa ngokuqalwa kwama-ARV ngalo lolo suku noma akuthumele endaweni yama-ARV eseduze kakhulu.',
      '<a href="/services/family-planning">Ukuhlela umndeni</a> kuyatholakala kubo bonke, kufaka nabangezona izakhamuzi. Izindlela zifaka imijovo, amaphilisi okuvimbela ukukhulelwa, namakhondomu. Ekuvimbeleni ukukhulelwa okuhlala isikhathi eside okuguqukayo (i-implant, i-IUD), ungathunyelwa esikhungweni sezempilo somphakathi.',
      'Emithini yesifo esingamahlalakhona, ekwelashweni kwe-TB, noma ezinsizakalweni zamazinyo, izikhungo eziseduze kakhulu ezinohla olubanzi lwezinsizakalo zifaka iHillbrow Community Health Centre (CHC) noma iCharlotte Maxeke Johannesburg Academic Hospital.',
      'Uma ungenalo iphepha lomazisi, usengakwazi ukuthola zonke izinsizakalo zokunakekelwa kwezempilo okuyisisekelo. Umtholampilo ungacela igama lakho ukuze ubhalwe kodwa awukwazi ukwenqaba insizakalo.',
    ],
  },
};

const TYPE_CONTEXT_ZU: Record<string, string> = {
  clinic: 'ukunakekelwa kwezempilo okuyisisekelo kwabangena bengabhukhile',
  community_health_centre: 'ukunakekelwa okuyisisekelo okusekelwe emphakathini okunezinsizakalo ezelulekiwe — okuvame ukufaka ukubeletha, imithi yesifo esingamahlalakhona, nezinqubo ezincane',
  district_hospital: 'ukunakekelwa kwezinga lesifunda kweziguli ezilaliswayo nezingalaliswa, kufaka izinsizakalo eziphuthumayo, ukuhlinzwa, nokuthunyelwa kochwepheshe',
  regional_hospital: 'isibhedlela sokuthunyelwa sesifunda esikhulu esinemnyango yochwepheshe, ukuxilongwa okuthuthukile, namandla okuhlinza',
  tertiary_hospital: 'ukunakekelwa kochwepheshe okuthuthukile, ukufundisa, nocwaningo — imvamisa yindawo yokuthunyelwa amacala anzima avela ezibhedlela zesifunda nezesifunda esikhulu',
  central_hospital: 'izinga eliphezulu kunawo wonke lokunakekelwa kwezempilo komphakathi, elinikeza izinsizakalo zochwepheshe abakhethekile, ucwaningo oluthuthukile, namandla okuthunyelwa kuzwelonke',
  specialised_hospital: 'ukunakekelwa okukhethekile kwezimo ezithile — ukwelashwa kwengqondo, i-TB, ukuvuselelwa, noma ukulawulwa kwezifo ezithathelwanayo',
  mobile_clinic: 'iyunithi yezempilo ehambayo ejikeleza izindawo ezingasizwa ngokwanele ngokohlelo olubekiwe — qinisekisa izinsuku zokuvakasha ngaphambi kokuhamba',
};

const PROVINCE_HEALTH_CONTEXT_ZU: Record<string, string> = {
  'Eastern Cape': 'I-Eastern Cape ibhekene nezinselelo ezinkulu zokufinyelela ekunakekelweni kwezempilo, ikakhulukazi ezindaweni zasemakhaya zeTranskei yakudala. Imiphakathi eminingi ithembele emitholampilo embalwa esiza abantu abaningi, okwenza isikhungo ngasinye sibe yithemba elibalulekile.',
  'Free State': 'Izikhungo zeFree State zisiza inhlanganisela yemiphakathi yasemadolobheni neyasemapulazini. Izifo ezihambisana nezimayini nokulimala kwezolimo yizinto ezivamile ezibonwayo ngaphezu kokunakekelwa okuyisisekelo okujwayelekile.',
  'Gauteng': 'IGauteng inezikhungo zezempilo zomphakathi eziminyene kunazo zonke eNingizimu Afrika, kodwa ukuminyana kwabantu kusho ukuthi imitholampilo ivame ukusebenza igcwele. Kunconywa kakhulu ukufika ekuseni.',
  'KwaZulu-Natal': 'IKwaZulu-Natal inamazinga aphakeme kunawo wonke emhlabeni okusabalala kwe-HIV, okwenza ukutholakala kwama-ARV kube yinsizakalo ebalulekile. Ukuhlaselwa yi-TB ngesikhathi esifanayo nakho kusabalele, futhi izikhungo eziningi zinezinhlelo ezizinikele ze-TB.',
  'Limpopo': 'Abantu abaningi baseLimpopo bahlala emakhaya futhi bathembele kakhulu ekunakekelweni kwezempilo komphakathi. Amabanga okuhamba aya ezikhungweni angaba made — qinisekisa ukuthi izinsizakalo ziyatholakala ngaphambi kokwenza uhambo olude.',
  'Mpumalanga': 'IMpumalanga ixhumanisa izidingo zezempilo zasemadolobheni nezasemakhaya, izikhungo zaseLowveld zisiza kokubili imiphakathi yendawo nabasebenzi bezolimo bezinkathi ezithile.',
  'North West': 'Izikhungo zeNorth West Province zisiza imiphakathi yezimayini kanye nabantu basemakhaya. Ukuhlolwa kwempilo emsebenzini nokulawulwa kwezifo ezingamahlalakhona yizinsizakalo ezivamile.',
  'Northern Cape': 'INorthern Cape yisifundazwe esikhulu kunazo zonke eNingizimu Afrika ngobubanzi kodwa esinabantu abambalwa kunazo zonke. Izikhungo zikude komunye nomunye — iziguli ezindaweni ezikude zingahamba amahora ukuze zifinyelele emtholampilo.',
  'Western Cape': 'INtshonalanga Koloni inengqalasizinda yezempilo yomphakathi ethuthuke kakhulu ngaphandle kweGauteng, inezindlela eziqinile zokuthunyelwa ezisuka emitholampilo yomphakathi ziye ezibhedlela iTygerberg neGroote Schuur.',
};

function getServiceTipsZu(services: Record<string, boolean>): string[] {
  const tips: string[] = [];

  if (services.arv_treatment) {
    tips.push('Lesi sikhungo sinikeza <a href="/services/arvs">ukwelashwa ngama-ARV</a>. Ungaqala i-ART ngalo lolo suku — phatha iphepha lakho lomazisi futhi ufike ngaphambi kuka-10am ukuze ulinde isikhathi esifushane. Funda <a href="/guides/how-to-get-arvs">umhlahlandlela wethu wokuqala ama-ARV</a> ukuze wazi okulindelekile.');
  }

  if (services.tb_treatment) {
    tips.push('Ukuhlolelwa i-TB nokwelashwa kuyatholakala lapha ngo-<a href="/services/tb">hlelo lwe-DOTS</a>. Ukuhlolwa kwesikhwehlela kuthatha izinsuku ezingu-2-3 ukuthola imiphumela. Uma unokukhwehlela okungapheli okuthatha ngaphezu kwamasonto amabili, hlolwa — ukwelashwa kusenesikhathi kuthuthukisa kakhulu imiphumela.');
  }

  if (services.maternity_antenatal) {
    tips.push('<a href="/services/maternity">Ukunakekelwa kwabakhulelwe nokubeletha</a> kuyatholakala. Bhalisa ngokushesha ngangokunokwenzeka ekukhulelweni kwakho — ngaphambi kwamasonto angu-20 kuyanconywa. Phatha umazisi wakho namarekhodi anoma yikuphi ukukhulelwa kwangaphambilini. Funda <a href="/guides/free-maternity-care">umhlahlandlela wethu wokunakekelwa kwabakhulelwe mahhala</a> ukuze uthole uhlu olugcwele.');
  }

  if (services.chronic_medication) {
    tips.push('Lesi sikhungo sikhipha <a href="/services/chronic-medication">imithi yesifo esingamahlalakhona</a>. Uma uzinzile ekwelashweni, buza mayelana <a href="/guides/ccmdd-chronic-meds-pickup">nohlelo lwe-CCMDD</a> — lukuvumela ukulanda imithi ekhemisi noma endaweni yokulanda eseduze nasekhaya esikhundleni sokuma emugqeni emtholampilo nyanga zonke.');
  }

  if (services.dental_services) {
    tips.push('<a href="/services/dental">Izinsizakalo zamazinyo</a> ziyatholakala. Ukunakekelwa kwamazinyo komphakathi kugxile ekukhipheni amazinyo nasekwelashweni okuphuthumayo — fika ekuseni ngoba imigqa yamazinyo igcwala masinyane. Bheka <a href="/guides/dental-care-public-clinics">umhlahlandlela wethu wokunakekelwa kwamazinyo</a> ukuze wazi ukuthi imitholampilo yomphakathi ihlinzeka ngani.');
  }

  if (services.mental_health) {
    tips.push('Lesi sikhungo sinikeza <a href="/services/mental-health">izinsizakalo zempilo yengqondo</a>. Ungazithumela wena ukuze uhlolwe kokuqala — akudingeki incwadi yokuthunyelwa. <a href="/guides/mental-health-services">Umhlahlandlela wethu wezinsizakalo zempilo yengqondo</a> uchaza ukuthi yiluphi usizo olutholakalayo ezingeni ngalinye lokunakekelwa.');
  }

  if (services.family_planning) {
    tips.push('<a href="/services/family-planning">Izinsizakalo zokuhlela umndeni</a> ziyatholakala, kufaka ukwelulekwa nokunikezwa kwezindlela zokuvimbela ukukhulelwa. Akudingeki ukubhuka noma incwadi yokuthunyelwa. Bheka <a href="/guides/family-planning-contraception">umhlahlandlela wethu wokuvimbela ukukhulelwa</a> ukuze wazi izindlela ezitholakalayo.');
  }

  if (services.child_immunisation) {
    tips.push('<a href="/services/immunisation">Ukugonywa kwezingane</a> kunikezwa ngokohlelo lukazwelonke. Phatha incwadi ye-Road to Health yengane yakho. <a href="/guides/child-immunisation-schedule">Umhlahlandlela wethu wohlelo lokugonya</a> ukhombisa ukuthi yimiphi imijovo edingekayo eminyakeni ngayinye.');
  }

  return tips;
}

export function generateFacilityEditorialZu(facility: Facility): { context: string; tips: string[] } {
  // Check for per-facility editorial override
  const override = FACILITY_OVERRIDES_ZU[facility.slug];
  if (override) {
    const serviceTips = getServiceTipsZu(facility.services);
    return {
      context: override.context,
      tips: [...serviceTips, ...override.facilityTips],
    };
  }

  // Default: generate from metadata
  const typeDesc = TYPE_CONTEXT_ZU[facility.type] || 'ukunakekelwa kwezempilo komphakathi';
  const provinceContext = PROVINCE_HEALTH_CONTEXT_ZU[facility.province] || '';

  const activeServiceCount = Object.values(facility.services).filter(Boolean).length;

  let context = `${facility.name} yisikhungo esinikeza ${typeDesc}, esifundazweni ${facility.province}${facility.district ? ', esifundeni ' + facility.district : ''}.`;

  if (facility.operating_hours.is_24_hour) {
    context += ' Isikhungo sisebenza amahora angu-24, kufaka nezimpelasonto namaholide omphakathi — akudingeki ukubhuka ezimweni eziphuthumayo.';
  }

  if (activeServiceCount >= 4) {
    context += ` Ngezinsizakalo eziqinisekisiwe ezingu-${activeServiceCount}, lesi yisikhungo esihlome kahle sokunakekelwa okuyisisekelo okuphelele.`;
  }

  if (provinceContext) {
    context += ' ' + provinceContext;
  }

  const tips = getServiceTipsZu(facility.services);

  return { context, tips };
}
