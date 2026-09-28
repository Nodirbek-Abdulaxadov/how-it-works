// Tarix yo'nalishi: al-Xorazmiydan bugungi tillargacha.
// Bu yo'nalish umurtqasiz (standalone) — u pastga emas, vaqt bo'ylab boradi.

export const HISTORY = {
  id: 'history',
  name: 'Tarix',
  kind: 'history',
  standalone: true,          // mashina kodi → kvant umurtqasi qo'shilmaydi
  file: null,
  lang: { call: 'algoritm', runtime: '—', runtimeName: '—' },
  levels: [
    {
      id: 'h-khwarizmi',
      kicker: 'AL-XORAZMIY',
      title: 'Algoritm so\'zi qayerdan kelgan',
      scale: 'Xorazm → Bag\'dod · IX asr',
      lead: 'Bu zanjirning birinchi bo\'g\'ini mashinadan ming yil oldin paydo bo\'lgan.',
      body: [
        'Muhammad ibn Muso <b>al-Xorazmiy</b> — Xorazmda tug\'ilgan, Bag\'doddagi "Bayt ul-hikma" da ishlagan olim. Taxminan 820-yilda "Al-kitob al-muxtasar fi hisob <b>al-jabr</b> va-l-muqobala" asarini yozgan.',
        'Kitob nomidagi <b>al-jabr</b> Yevropa tillariga <b>algebra</b> bo\'lib o\'tgan. Muallifning nomi esa lotinchada <i>Algoritmi</i> deb yozilgan — <b>algoritm</b> so\'zi shundan.',
        'Nega aynan u? Chunki al-Xorazmiy masalani "mana bunday yechiladi" deb emas, <b>bosqichma-bosqich, har qanday sonlar uchun takrorlanadigan tartib</b> sifatida yozgan. Bugungi tilda buni protsedura deymiz.',
        'Adolat yuzasidan: algoritm tushunchasini u ixtiro qilmagan. Bobilliklarda ham, Yevklidda ham (EKUB usuli, mil. avv. ~300) tartiblangan usullar bo\'lgan. Al-Xorazmiy bergani — usulni <b>umumlashtirish</b> va uni yozib qoldirish uslubi. So\'z esa uning nomidan qolgan.',
        'U yana hind raqamlari va pozitsion sanoq haqida yozgan — Yevropaga o\'nlik sanoq shu orqali kirgan. Ikkilik sanoqqa hali ming yil bor edi.'
      ],
      facts: [
        ['Asar', '~820 — "al-jabr"'],
        ['Algebra', 'al-jabr → algebra'],
        ['Algoritm', 'Algoritmi → algorithm']
      ],
      color: 0xfbbf24, color2: 0xf59e0b,
      view: { z: 31, y: -0.4, w: 12.5 }
    },
    {
      id: 'h-jacquard',
      kicker: 'PERFOKARTA',
      title: 'Jakkar dastgohi: birinchi programmalanadigan mashina',
      scale: 'Lion, Fransiya · 1804',
      lead: 'Hisoblash emas — to\'qish. Lekin g\'oya aynan o\'sha: mashinaga qog\'ozda buyruq berish.',
      body: [
        'Jozef Mari Jakkar to\'quv dastgohiga <b>perfokarta</b> ulagan: kartadagi teshiklar qaysi iplar ko\'tarilishini belgilaydi, kartalar ketma-ketligi esa butun naqshni beradi.',
        'Eng muhimi: yangi naqsh uchun dastgohni qayta qurish shart emas — <b>kartalar to\'plamini almashtirish</b> yetarli. Mana shu apparat va dasturning ajralishi.',
        'Perfokarta g\'oyasi hayratlanarli darajada uzoq yashadi: Xollerit 1890-yilgi AQSH aholi ro\'yxatida, IBM butun XX asr davomida, universitetlarda esa 1970-yillargacha dasturlar aynan shu kartalarga teshilgan.',
        'Ya\'ni bugungi <code>.pyc</code> fayl ham, o\'sha karta ham mohiyatan bitta narsa: mashinaga beriladigan, mashinadan ajralgan ko\'rsatmalar to\'plami.'
      ],
      facts: [
        ['Yil', '1804'],
        ['Muhit', 'perfokarta'],
        ['Umri', '~170 yil']
      ],
      color: 0xfb923c, color2: 0xfbbf24,
      view: { z: 32, y: -0.6, w: 14.5 }
    },
    {
      id: 'h-lovelace',
      kicker: 'BIRINCHI DASTUR',
      title: 'Ada Lavleys va hech qachon qurilmagan mashina',
      scale: 'London · 1837–1843',
      lead: 'Mashina qog\'ozda qolgan, lekin unga yozilgan dastur saqlanib qolgan.',
      body: [
        'Charlz Bebbij <b>Analitik mashina</b> ni loyihalagan: perfokarta bilan boshqariladigan, xotirasi (<i>store</i>) va hisoblash bloki (<i>mill</i>) bor umumiy maqsadli hisoblagich. U hech qachon to\'liq qurilmagan.',
        '1843-yilda <b>Ada Lavleys</b> italyan muhandisi Menabrea maqolasini tarjima qilib, unga o\'z izohlarini qo\'shgan — izohlar maqolaning o\'zidan uch barobar uzun chiqqan.',
        'Oxirgi izohda (<b>Note G</b>) Bernulli sonlarini hisoblaydigan to\'liq tartib bor: o\'zgaruvchilar, sikl, shartli o\'tish. Bu — mashina uchun yozilgan va <b>nashr etilgan birinchi algoritm</b>.',
        'Halollik uchun: Bebbij ham undan oldin dastur eskizlarini yozgan, va "birinchi dasturchi kim" degan bahs tarixchilar orasida hali ham bor. Lekin Lavleysning asl hissasi boshqa joyda: u mashina faqat sonlar bilan emas, <b>har qanday simvollar</b> bilan ishlay olishini — hatto musiqa yoza olishini — ko\'ra olgan.',
        'Shu fikr bugungi hamma narsaning urug\'i: kompyuter son emas, <b>ma\'no biriktirilgan belgi</b> bilan ishlaydi.'
      ],
      facts: [
        ['Yil', '1843'],
        ['Nima', 'Note G — Bernulli sonlari'],
        ['G\'oya', 'mashina simvol bilan ishlaydi']
      ],
      color: 0xfb7185, color2: 0xfbbf24,
      view: { z: 34, y: -1, w: 15 }
    },
    {
      id: 'h-turing',
      kicker: 'NAZARIYA',
      title: 'Turing va Cherch: hisoblash nima?',
      scale: '1936 · Kembrij va Prinston',
      lead: 'Mashina qurilishidan oldin "mashina nima qila oladi" degan savolga javob kerak edi.',
      body: [
        '1936-yil. Alan Turing "On Computable Numbers" maqolasida <b>Turing mashinasi</b> ni tasvirlaydi: cheksiz lenta, bitta o\'qish-yozish boshi va oddiy qoidalar jadvali. Ajablanarlisi — shu qadar sodda qurilma har qanday hisoblanadigan masalani yecha oladi.',
        'O\'sha yili Alonzo Cherch <b>lambda hisobi</b> ni taklif qiladi: mashina emas, faqat funksiyalar bilan ishlaydigan butunlay boshqa formalizm. Keyin ma\'lum bo\'ladiki, ikkovi <b>aynan bir xil kuchga ega</b>.',
        'Shu ikki ildizdan ikki oila o\'sib chiqqan: Turing mashinasidan — <b>imperativ</b> tillar (o\'zgaruvchi, holat, ketma-ketlik), lambda hisobidan — <b>funksional</b> tillar (Lisp, ML, Haskell). C# dagi <code>x => x * 2</code> ham o\'sha 1936-yilgi lambda.',
        'Va yana bir natija: <b>hamma masala ham hisoblanmaydi</b>. To\'xtash muammosi — ixtiyoriy dastur to\'xtaydimi yoki cheksiz ishlaydimi degan savolga javob beradigan umumiy algoritm mavjud emas. Bu chegara texnologiyaga emas, matematikaga tegishli.'
      ],
      facts: [
        ['Yil', '1936'],
        ['Ikki ildiz', 'Turing mashinasi · lambda'],
        ['Chegara', 'to\'xtash muammosi']
      ],
      color: 0xa78bfa, color2: 0x818cf8,
      view: { z: 35, y: -1.2, w: 15.5 }
    },
    {
      id: 'h-eniac',
      kicker: 'SIMLAR BILAN',
      title: 'ENIAC va saqlangan dastur g\'oyasi',
      scale: '1945–1948 · Filadelfiya va Manchester',
      lead: 'Birinchi kompyuterlarda dastur yozilmasdi — u qo\'l bilan ulanardi.',
      body: [
        '<b>ENIAC</b> (1945) da "dasturlash" degani — kabellarni qayta ulash va yuzlab kalitni burash. Bitta masaladan boshqasiga o\'tish kunlar, ba\'zan haftalar olardi.',
        'Bu ishni oltita matematik ayol bajargan: Key MakNalti, Betti Jennings, Betti Snayder, Marlin Meltser, Fran Bilas va Rut Lixterman. Ular mashinaning ichki tuzilishini o\'rganib, hisob yo\'lini qo\'lda "simlab" chiqishardi.',
        '1945-yilda fon Neyman EDVAC hisobotida <b>saqlangan dastur</b> g\'oyasini bayon qiladi: dastur ham, ma\'lumot ham bir xil xotirada yotsin. Shunda dasturni almashtirish simni emas, <b>xotiradagi sonlarni</b> almashtirish bo\'ladi.',
        '1948-yil 21-iyun: Manchesterdagi "Baby" xotirada saqlangan dasturni birinchi marta bajaradi. Shu kundan boshlab dastur — <b>matn</b>: uni yozish, nusxalash, saqlash va o\'zgartirish mumkin.',
        'Bu g\'oya shu qadar asosiyki, bizning sayohatimizdagi "mashina kodi RAM da yotadi" degan qatlam to\'g\'ridan-to\'g\'ri o\'sha 1945-yilgi hisobotdan kelib chiqqan.'
      ],
      facts: [
        ['ENIAC', 'kabel va kalitlar'],
        ['EDVAC hisoboti', '1945'],
        ['Baby', '1948 — birinchi bajarilish']
      ],
      color: 0x22d3ee, color2: 0x60a5fa,
      view: { z: 36, y: -1.4, w: 16 }
    },
    {
      id: 'h-first',
      kicker: 'BIRINCHI TIL',
      title: 'Birinchi dasturlash tili — to\'rt xil javob',
      scale: '1945–1957',
      lead: 'Savol sodda ko\'rinadi, lekin javob mezonga bog\'liq.',
      body: [
        '<b>Plankalkül (1942–1945)</b> — Konrad Suze urush yillarida yozgan, haqiqiy yuqori darajali til: massivlar, tarkibiy turlar, shartlar. Lekin kompilyatori o\'sha paytda yozilmagan va til faqat 1970-yillarda ishga tushirilgan. Ya\'ni <b>birinchi loyihalangan</b>, lekin ishlamagan.',
        '<b>Short Code (1949)</b> — Jon Mokli g\'oyasi, Uilyam Shmitt amalga oshirgan. Formulalar belgilar bilan yozilib, ularni interpretator bajarardi. Sekin, lekin <b>birinchi bo\'lib haqiqatan ishlagan</b>.',
        '<b>Autocode (1952)</b> — Alik Glenni, Manchester Mark 1 uchun: matnni avval mashina kodiga o\'girib, keyin bajargan. Ya\'ni <b>birinchi kompilyator</b>. O\'sha yili Greys Xopper <b>A-0</b> ni yaratadi — tayyor bo\'laklarni yig\'ib bitta dastur qiladigan vosita; "kompilyator" so\'zi ham shundan.',
        '<b>FORTRAN (1957)</b> — Jon Bekus boshchiligidagi IBM guruhi. Bu <b>birinchi keng tarqalgan</b> til, va eng muhimi: uning optimallashtiruvchi kompilyatori qo\'lda yozilgan assembler bilan tenglasha oldi. Shu daqiqagacha ko\'pchilik "kompilyator hech qachon odamdek yozolmaydi" deb ishonardi.',
        'Demak javob mezonga qarab o\'zgaradi: loyihada — Plankalkül, ishlaganida — Short Code, kompilyatorda — Autocode, amalda — FORTRAN.'
      ],
      facts: [
        ['Loyihada', 'Plankalkül · 1945'],
        ['Ishlaganida', 'Short Code · 1949'],
        ['Amalda', 'FORTRAN · 1957']
      ],
      color: 0x34d399, color2: 0x22d3ee,
      view: { z: 35, y: -1, w: 15.5 }
    },
    {
      id: 'h-boom',
      kicker: 'PORTLASH',
      title: 'To\'rt g\'oya, to\'rt oila',
      scale: '1957–1964',
      lead: 'Olti yil ichida bugungi tillarning deyarli barcha asosiy g\'oyalari paydo bo\'ldi.',
      body: [
        '<b>FORTRAN (1957)</b> — "formula tarjimoni". Ilm-fan va muhandislik hisoblari. Hali ham superkompyuterlarda ishlaydi.',
        '<b>LISP (1958)</b> — Jon Makkarti, to\'g\'ridan-to\'g\'ri lambda hisobidan o\'sgan. Ro\'yxatlar, rekursiya va <b>axlat yig\'uvchi (GC)</b> — hammasi birinchi marta shu yerda. Va kod ham ro\'yxat bo\'lgani uchun dastur o\'z-o\'zini o\'zgartira oladi.',
        '<b>COBOL (1959)</b> — biznes uchun, ataylab inglizchaga yaqin sintaksis. Greys Xopperning g\'oyalari asos bo\'lgan. Bugun ham banklarda milliardlab qator COBOL ishlab turibdi.',
        '<b>ALGOL 60</b> — o\'zi keng tarqalmadi, lekin uning <b>sintaksisi</b> deyarli hammaning ajdodi: blok tuzilishi, rekursiya, qavslar ierarxiyasi. Uning grammatikasini yozish uchun <b>BNF</b> ixtiro qilindi — tillar bugun ham shu bilan ta\'riflanadi.',
        '1964-yilda BASIC chiqadi. Maqsadi — dasturlashni mutaxassis bo\'lmaganlarga ochish; keyinchalik shaxsiy kompyuterlar avlodini aynan u tarbiyalagan.'
      ],
      facts: [
        ['FORTRAN', 'hisob-kitob'],
        ['LISP', 'GC va rekursiya'],
        ['ALGOL', 'sintaksis ajdodi']
      ],
      color: 0x38bdf8, color2: 0x34d399,
      view: { z: 35, y: -1.2, w: 16 }
    },
    {
      id: 'h-c',
      kicker: 'POYDEVOR',
      title: 'C, Unix va bugungi hamma narsaning tagi',
      scale: '1970–1979 · Bell Labs va Xerox PARC',
      lead: 'Bu o\'n yillikda yozilgan kod hali ham sizning kompyuteringizda ishlayapti.',
      body: [
        '<b>C (1972)</b> — Dennis Ritchi, Bell Labs. Maqsad: operatsion tizimni assemblerda emas, ko\'chiriladigan tilda yozish. 1973-yilda Unix C ga qayta yozildi va boshqa mashinaga <b>ko\'chirilishi mumkin bo\'lgan birinchi OS</b> bo\'ldi.',
        'C ning ta\'siri bugun ham to\'g\'ridan-to\'g\'ri: Linux yadrosi, CPython interpretatori, V8 dvigateli, Go ning ish vaqti — hammasi C yoki C++ da yozilgan. Ya\'ni Python yozganingizda ham, pastda C ishlayapti.',
        '<b>Smalltalk (1972)</b> — Alan Key, Xerox PARC. "Obyektga yo\'naltirilgan" atamasi shu yerdan. Keyning asl g\'oyasi sinflar emas edi: obyektlar bir-biriga <b>xabar yuboradi</b>, qolgani ularning ichki ishi.',
        '<b>Pascal (1970)</b> — Niklaus Virt, o\'qitish uchun tuzilgan tartibli til. <b>Prolog (1972)</b> — mantiqiy dasturlash: siz faktlar va qoidalarni yozasiz, javobni tizim o\'zi qidiradi.',
        '1978-yilda Kernigan va Ritchining C kitobi chiqadi — undagi <code>hello, world</code> dasturlashdagi eng mashhur jumlaga aylanadi.'
      ],
      facts: [
        ['C', '1972 — Dennis Ritchi'],
        ['Unix', '1973 da C ga ko\'chdi'],
        ['Smalltalk', 'obyekt va xabar']
      ],
      color: 0x60a5fa, color2: 0x38bdf8,
      view: { z: 35, y: -1.2, w: 15.5 }
    },
    {
      id: 'h-web',
      kicker: 'KO\'PCHILIK UCHUN',
      title: 'Abstraksiya, virtual mashina va internet',
      scale: '1983–1999',
      lead: 'Kompyuter avval stolga, keyin tarmoqqa chiqdi — tillar ham shunga moslashdi.',
      body: [
        '<b>C++ (1983)</b> — Byarne Stroustrup: C ning tezligi ustiga obyektlar. Shiori "ishlatmasangiz — to\'lamaysiz": abstraksiya ish vaqtida tekin bo\'lsin degan talab.',
        '<b>Python (1991)</b> — Gvido van Rossum. O\'qilishi birinchi o\'rinda: qavs o\'rniga <b>bo\'shliq bilan blok</b>. 1989-yilning Rojdestvo ta\'tilida boshlangan shaxsiy loyiha edi.',
        '<b>Java (1995)</b> — Sun. Asosiy g\'oya: kod <b>bayt-kodga</b> kompilyatsiya qilinsin, uni esa har bir platformada <b>virtual mashina</b> bajarsin. "Bir marta yoz, hamma joyda ishlat". C# yo\'nalishimizdagi IL qatlami aynan shu g\'oyaning davomi.',
        '<b>JavaScript (1995)</b> — Brendan Ayx uni Netscape da <b>o\'n kun</b> ichida yozgan. Shoshilinch qaror bo\'lgani uning ko\'p g\'alati joylarini tushuntiradi — va shunga qaramay u dunyodagi eng ko\'p ishlatiladigan tilga aylandi.',
        'Xuddi shu yili PHP va Ruby ham chiqadi. Sabab bitta: <b>veb</b>. Endi dastur bitta mashinada emas, millionlab noma\'lum brauzerda ishlashi kerak edi.'
      ],
      facts: [
        ['Java', 'bayt-kod + VM'],
        ['JavaScript', '10 kunda yozilgan'],
        ['Sabab', 'veb va ko\'chma kod']
      ],
      color: 0x818cf8, color2: 0xf472b6,
      view: { z: 35, y: -1.2, w: 15.5 }
    },
    {
      id: 'h-safety',
      kicker: 'XAVFSIZLIK',
      title: 'Yadrolar ko\'paydi, xotira xatolari qoldi',
      scale: '2000 — bugun',
      lead: 'Ikki muammo tillarning yangi avlodini tug\'dirdi.',
      body: [
        '2005-yildan protsessorlar tezlashishdan to\'xtab, <b>yadro soni</b> bilan o\'sa boshladi. Endi tezlik dasturchidan parallellikni talab qildi — parallellik esa eng qiyin xatolar manbai.',
        'Ikkinchi muammo — xotira xatolari. Microsoft va Google mustaqil ravishda hisoblab chiqqan: ularning C/C++ kodidagi jiddiy xavfsizlik nuqsonlarining <b>~70% i</b> xotira bilan bog\'liq.',
        '<b>C# (2000)</b> — Anders Hejlsberg: boshqariladigan xotira, JIT, keyinchalik <code>async</code>/<code>await</code> — parallel kodni ketma-ket kod kabi yozish usuli.',
        '<b>Go (2009)</b> — Griesemer, Payk va <b>Ken Tompson</b> (o\'sha, Unix va C davridan). Maqsad: tarmoq serverlari uchun sodda til. Goroutine va kanallar parallellikni arzon qildi.',
        '<b>Rust (2010, 1.0 — 2015)</b> — Greydon Xoar. Borrow checker GC siz ham xotira xavfsizligini beradi. 2022-yildan Rust Linux yadrosiga ham kira boshladi — C ning ellik yillik monopoliyasidagi birinchi yoriq.',
        '<b>TypeScript (2012)</b> — JavaScript ga turlarni qaytardi. Qiziq aylana: 1950-yillarda tillar turlarni qo\'shgan, 1990-larda veb ularni tashlagan, 2010-larda esa qaytarib olib kelingan.'
      ],
      facts: [
        ['Sabab', 'ko\'p yadro + xotira xatolari'],
        ['Rust', 'GC siz xavfsizlik'],
        ['Yo\'nalish', 'kompilyator ko\'proq tekshiradi']
      ],
      color: 0xf472b6, color2: 0xa78bfa,
      view: { z: 35, y: -1.4, w: 16 }
    },
    {
      id: 'h-mirror',
      kicker: 'TESKARI YO\'L',
      title: 'Tarix — bu sayohatning teskarisi',
      scale: '820 — 2026 · va 16 qatlam',
      lead: 'Biz pastga tushib abstraksiyalarni yechdik. Tarix esa o\'sha abstraksiyalarni qurib kelgan.',
      body: [
        'Har bir tarixiy qadam odamning qo\'lidan bitta ishni olib qo\'ygan: kabel ulash → mashina kodi → assembler → yuqori darajali til → boshqariladigan xotira → borrow checker.',
        'Sayohatimizdagi qatlamlar aynan shu bosqichlarni <b>teskari tartibda</b> ochadi. Kompilyator qatlami — 1957-yilgi FORTRAN g\'alabasi. Bayt-kod qatlami — 1995-yilgi Java. RAM dagi mashina kodi — 1945-yilgi EDVAC hisoboti. Imtiyoz chegarasi — 1960-yillardagi ko\'p foydalanuvchili tizimlar.',
        'Ya\'ni har bir abstraksiya kimdir bir paytda <b>qo\'lda qilgan ishining</b> o\'rniga qo\'yilgan. Ular tekin emas — faqat narxi allaqachon to\'langan.',
        'Va zanjirning eng uchi o\'zgarmagan: al-Xorazmiy yozgan narsa ham, bugungi kod ham mohiyatan bitta — <b>bosqichma-bosqich, aniq, takrorlanadigan tartib</b>. Faqat uni bajaruvchi endi odam emas, kremniy.'
      ],
      facts: [
        ['820', 'bosqichma-bosqich tartib'],
        ['2026', 'o\'sha tartib, kremniyda'],
        ['Orada', '~1200 yil']
      ],
      color: 0xe9d5ff, color2: 0x6ee7ff,
      view: { z: 36, y: -1.4, w: 16 }
    }
  ]
};
