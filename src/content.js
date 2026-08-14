// Har bir qatlam uchun matn (o'zbekcha) va rang sxemasi.
// Tartib: eng abstrakt (kod) -> eng fundamental (kvant fizikasi).

export const LEVELS = [
  {
    id: 'source',
    scale: '~10⁻² m — ekrandagi harflar',
    kicker: '01 — MANBA KOD',
    title: 'C# manba kodi',
    lead: 'Hammasi matndan boshlanadi. Lekin kompyuter uchun bu matn emas — bu baytlar ketma-ketligi.',
    body: [
      'Siz yozgan <b>Program.cs</b> — oddiy matn fayl. Diskda u UTF-8 kodlashda baytlar sifatida yotadi: <code>C</code> harfi = 0x43 = <code>01000011</code>.',
      'Protsessor "o\'zgaruvchi", "metod" yoki "sinf" degan tushunchani bilmaydi. Bu tushunchalar faqat <b>odam uchun</b> — ular pastga tushgan sari yo\'qolib boradi.',
      'Quyidagi 15 qatlam — o\'sha yo\'qolish jarayoni. Har bir qadamda abstraksiya yechiladi va oxirida faqat elektronlar va kvant qonunlari qoladi.'
    ],
    facts: [
      ['Format', 'UTF-8 matn'],
      ['Kim tushunadi', 'Faqat odam va kompilyator'],
      ['Hajm', "~1 KB manba → ~4 KB IL"]
    ],
    color: 0x6ee7ff, color2: 0x9b8cff
  },
  {
    id: 'ast',
    scale: 'Roslyn kompilyatori — kompilyatsiya vaqti',
    kicker: '02 — KOMPILYATOR',
    title: 'Leksik tahlil va sintaksis daraxti',
    lead: 'Roslyn matnni tokenlarga bo\'ladi, undan daraxt quradi va ma\'nosini tekshiradi.',
    body: [
      '<b>Lexer</b> belgilar oqimini tokenlarga ajratadi: <code>var</code>, <code>x</code>, <code>=</code>, <code>42</code>, <code>;</code>.',
      '<b>Parser</b> tokenlardan <b>sintaksis daraxti</b> (AST) quradi — kod endi tekis matn emas, ierarxik struktura.',
      '<b>Semantik tahlil</b> har bir nomni haqiqiy simvolga bog\'laydi: bu <code>x</code> qaysi o\'zgaruvchi? Bu metod qaysi turga tegishli? Turlar mos kelmasa — CS xatosi shu yerda tug\'iladi.',
      'Qiziq: Roslyn ham C#da yozilgan. C# kompilyatorini kompilyatsiya qilish uchun C# kompilyatori kerak — bunga <i>bootstrapping</i> deyiladi.'
    ],
    facts: [
      ['Bosqichlar', 'Lex → Parse → Bind → Emit'],
      ['Natija', 'Syntax tree + symbol jadval'],
      ['Xatolar', 'Sintaktik va semantik']
    ],
    color: 0x8b7cff, color2: 0x6ee7ff
  },
  {
    id: 'il',
    scale: 'Program.dll — diskdagi assembly',
    kicker: '03 — ORALIQ TIL',
    title: 'IL (CIL) va metadata',
    lead: 'Roslyn mashina kodi chiqarmaydi. U stack asosidagi virtual mashina uchun bayt-kod chiqaradi.',
    body: [
      'IL — <b>stack-based</b> til. Registrlar yo\'q, hamma narsa hisob stekida bajariladi: <code>ldstr</code> qatorni stekka qo\'yadi, <code>call</code> uni yechib metodga uzatadi.',
      'Assembly — <b>PE</b> formatidagi fayl (.dll/.exe). Ichida IL baytlari va <b>metadata</b>: qanday turlar, metodlar, imzolar, atributlar bor. Refleksiya aynan shu metadata ustida ishlaydi.',
      'Shuning uchun bitta <code>.dll</code> Windows x64, Linux ARM64 va macOS da bir xil ishlaydi — u hali hech qaysi protsessorga bog\'lanmagan.'
    ],
    facts: [
      ['Model', 'Stack mashinasi'],
      ['Konteyner', 'PE / ECMA-335'],
      ['Portativlik', 'CPU va OS dan mustaqil']
    ],
    color: 0x7dd3fc, color2: 0x22d3ee
  },
  {
    id: 'jit',
    scale: 'CLR ish vaqti — millisekundlar',
    kicker: '04 — ISH VAQTI',
    title: 'CLR va JIT (RyuJIT)',
    lead: 'Dastur ishga tushganda IL aynan shu kompyuter uchun mashina kodiga aylanadi — chaqirilgan paytda.',
    body: [
      '<b>Type loader</b> turlarni yuklaydi, metod jadvallarini quradi. Metod birinchi marta chaqirilganda uning o\'rniga <i>stub</i> turadi — u <b>JIT</b> ni uyg\'otadi.',
      '<b>Tiered compilation:</b> Tier 0 — tez, optimallashtirilmagan kod (dastur tez ishga tushsin). Metod ~30 marta chaqirilsa, "qizigan" deb hisoblanadi va Tier 1 uni to\'liq optimallashtirib qayta kompilyatsiya qiladi: inlining, siklni ochish, SIMD.',
      '<b>GC</b> xotirani boshqaradi: yangi obyektlar Gen 0 da tug\'iladi, omon qolganlari Gen 1 va Gen 2 ga ko\'chadi. Siz <code>free()</code> yozmaysiz — buni GC qiladi.',
      'AOT rejimida (NativeAOT) bu ish oldindan, kompilyatsiya paytida bajariladi — JIT umuman kerak bo\'lmaydi.'
    ],
    facts: [
      ['JIT', 'RyuJIT'],
      ['Tier 0 → Tier 1', "~30 chaqiruvdan keyin"],
      ['Xotira', 'Generatsion GC']
    ],
    color: 0xffb86c, color2: 0xff7ac6
  },
  {
    id: 'machine',
    scale: 'x86-64 baytlari — RAM dagi kod',
    kicker: '05 — MASHINA KODI',
    title: 'Registrlar va opcodelar',
    lead: 'Abstraksiya tugadi. Qolgani — protsessor to\'g\'ridan-to\'g\'ri o\'qiydigan baytlar.',
    body: [
      '<code>mov rcx, rax</code> — bu odam uchun yozuv. Xotirada u atigi 3 bayt: <code>48 89 C8</code>.',
      'Bayt ichida qismlar bor: <b>REX prefiks</b> (48) 64-bitli rejimni yoqadi, <b>opcode</b> (89) "mov" amalini bildiradi, <b>ModR/M</b> (C8) qaysi registrlar ishtirok etishini aytadi.',
      'Registrlar — protsessor ichidagi eng tez xotira: <code>rax</code>, <code>rbx</code>, <code>rcx</code>… Ularga murojaat ~0 taktda, RAM ga esa ~200 taktda tushadi.',
      'Endi "o\'zgaruvchi" degan narsa yo\'q. Faqat registr raqami va xotira manzili bor.'
    ],
    facts: [
      ['Arxitektura', 'x86-64 (yoki ARM64)'],
      ['Komanda uzunligi', '1–15 bayt'],
      ['Registrlar', '16 ta umumiy, 64-bit']
    ],
    color: 0xfbbf24, color2: 0xf97316
  },
  {
    id: 'stack',
    scale: 'Jarayon xotirasi — stek sohasi',
    kicker: '06 — STEK',
    title: 'Chaqiruvlar steki',
    lead: 'Metod boshqa metodni chaqirsa, u qayerga qaytishini kim eslab qoladi?',
    body: [
      'Har bir chaqiruv uchun xotirada <b>kadr</b> (frame) ajratiladi: argumentlar, lokal o\'zgaruvchilar, saqlangan <code>rbp</code> va eng muhimi — <b>qaytish manzili</b>.',
      '<code>call</code> qaytish manzilini stekka qo\'yadi va sakraydi. <code>ret</code> uni yechib olib, o\'sha manzilga qaytadi. Butun sehr shu — boshqa hech narsa yo\'q.',
      'Stek <b>pastga o\'sadi</b>: yangi kadr kichikroq manzillarga tushadi. "Push" aslida shunchaki <code>rsp</code> ni kamaytirish. <code>rsp</code> stek cho\'qqisini, <code>rbp</code> joriy kadrni ko\'rsatib turadi.',
      'Diqqat: bu <b>IL ning hisob steki emas</b>. U — virtual mashina abstraksiyasi edi; bu esa haqiqiy xotirada, haqiqiy manzillarda yotgan soha.',
      'Stek cheklangan (.NET da oqim uchun odatda 1 MB). Cheksiz rekursiya uni to\'ldiradi va <b>himoya sahifasi</b>ga uriladi — natijada <code>StackOverflowException</code>, uni ushlab ham bo\'lmaydi.'
    ],
    facts: [
      ['Kadrda', 'argument · lokal · qaytish manzili'],
      ['O\'sish', 'pastga — manzil kamayadi'],
      ['Hajm', '~1 MB (oqimga)']
    ],
    color: 0x93c5fd, color2: 0x7dd3fc
  },
  {
    id: 'kernel',
    scale: 'Imtiyoz chegarasi — ring 3 / ring 0',
    kicker: '07 — YADRO',
    title: 'Syscall: yadroga o\'tish',
    lead: 'Sizning kodingiz ekranga hech narsa yoza olmaydi. U buni yadrodan so\'rashi kerak.',
    body: [
      'Protsessorda <b>imtiyoz darajalari</b> bor. Dasturingiz <b>ring 3</b> da ishlaydi: u apparatga to\'g\'ridan-to\'g\'ri murojaat qilolmaydi, boshqa jarayonning xotirasini ko\'rolmaydi, diskka o\'zi yozolmaydi.',
      '<code>Console.WriteLine</code> pastga tushib <code>write(1, buf, 6)</code> ga aylanadi va <code>syscall</code> komandasi bajariladi. Bu — <b>ataylab qilingan uzilish</b>: protsessor <b>ring 0</b> ga o\'tadi va oldindan belgilangan bitta manzilga sakraydi.',
      'Muhimi: dastur yadro kodining <i>xohlagan joyiga</i> sakrolmaydi. Kirish nuqtasini yadro o\'zi qo\'ygan (x86-64 da <code>MSR_LSTAR</code> registri) — chegarani xavfsiz qiladigan narsa shu.',
      'Yadroda <code>sys_write</code> ishga tushadi, VFS fayl deskriptori 1 ni topadi, tty drayveri belgilarni terminal buferiga qo\'yadi. So\'ng <code>sysret</code> bilan ring 3 ga qaytiladi — va sizning metodingiz keyingi qatordan davom etadi.',
      '<b>Yadro alohida dastur emas.</b> Bu o\'sha protsessorda, lekin yuqori imtiyoz bilan bajariladigan kod. Unga faqat uchta eshik orqali kiriladi: <b>syscall</b> (dastur so\'raydi), <b>interrupt</b> (apparat chaqiradi), <b>exception</b> (xato yuz beradi).'
    ],
    facts: [
      ['Chegara', 'ring 3 → ring 0'],
      ['Komandalar', 'syscall / sysret'],
      ['Eshiklar', 'syscall · interrupt · exception']
    ],
    color: 0xfb7185, color2: 0xfbbf24
  },
  {
    id: 'os',
    scale: 'Operatsion tizim — jarayon va MMU',
    kicker: '08 — TIZIM',
    title: 'Jarayon va virtual xotira',
    lead: 'Sizning dasturingiz haqiqiy xotirani ko\'rmaydi. U OS to\'qigan illyuziyada yashaydi.',
    body: [
      'OS <b>jarayon</b> yaratadi va unga o\'z <b>virtual manzil fazosi</b>ni beradi. Dastur uchun u butun xotira o\'ziniki — aslida yo\'q.',
      '<b>MMU</b> (protsessor ichidagi blok) har bir murojaatda virtual manzilni <b>sahifa jadvali</b> orqali fizik manzilga aylantiradi. Sahifa odatda 4 KB. Tarjimalar <b>TLB</b> keshida saqlanadi — bo\'lmasa har o\'qish 4 barobar sekinlashardi.',
      'Sahifa RAM da bo\'lmasa — <b>page fault</b>: yadro uni diskdan yuklaydi. Shuning uchun ba\'zan dastur "muzlab" qoladi.',
      '<b>Scheduler</b> yadrolarni jarayonlar orasida bo\'lib beradi. Ekranga yozish esa <b>syscall</b> — foydalanuvchi rejimidan yadro rejimiga o\'tish.'
    ],
    facts: [
      ['Sahifa', '4 KB (yoki 2 MB)'],
      ['Tarjima', 'MMU + TLB'],
      ['Izolyatsiya', 'Har jarayonga o\'z fazosi']
    ],
    color: 0x34d399, color2: 0x22d3ee
  },
  {
    id: 'cpu',
    scale: 'CPU yadrosi — ~10⁻³ m',
    kicker: '09 — MIKROARXITEKTURA',
    title: 'Konveyer va kesh',
    lead: 'Protsessor komandalarni birma-bir bajarmaydi. U ularni konveyerga soladi, tartibini o\'zgartiradi va kelajakni taxmin qiladi.',
    body: [
      '<b>Konveyer:</b> Fetch → Decode → Execute → Memory → Write-back. Bir vaqtda 5 ta (aslida 15–20 ta) komanda turli bosqichlarda bo\'ladi.',
      '<b>Superscalar + out-of-order:</b> yadro har taktda bir nechta komandani boshlaydi va bir-biriga bog\'liq bo\'lmaganlarini tartibsiz bajaradi — natija esa to\'g\'ri tartibda qaytariladi.',
      '<b>Branch prediction:</b> <code>if</code> natijasi hali ma\'lum emas, lekin konveyer to\'xtab turolmaydi — protsessor taxmin qiladi. Xato taxmin ≈ 15–20 takt yo\'qotish.',
      '<b>Kesh ierarxiyasi</b> hammasidan muhim: L1 ~4 takt, L2 ~14, L3 ~40, RAM ~200+. Shuning uchun massiv bo\'ylab ketma-ket yurish tasodifiy sakrashdan 10 barobar tez.'
    ],
    facts: [
      ['Chastota', '~3–5 GHz'],
      ['Konveyer', '15–20 bosqich'],
      ['L1 / RAM', '~1 ns / ~80 ns']
    ],
    color: 0x22d3ee, color2: 0x60a5fa
  },
  {
    id: 'logic',
    scale: 'Raqamli mantiq — ~10⁻⁵ m',
    kicker: '10 — MANTIQ',
    title: 'Gate, summator va soat',
    lead: '"Qo\'shish" degan amal aslida bir nechta mantiqiy elementning ulanishidan iborat.',
    body: [
      'Hamma narsa <b>AND, OR, NOT, XOR</b> dan quriladi. <code>XOR</code> — yig\'indi biti, <code>AND</code> — o\'tkazish (carry). Ikkovi birga = <b>yarim summator</b>.',
      '64-bitli sonlarni qo\'shish uchun 64 ta to\'liq summator zanjiri kerak — minglab gate. Protsessordagi ALU aynan shunday quriladi.',
      '<b>Flip-flop</b> — bir bitni saqlaydigan sxema. Registrlar va kesh yacheykalari shundan yasalgan. Mantiq hisoblaydi, flip-floplar esa <i>eslab qoladi</i>.',
      '<b>Soat signali</b> hammani sinxronlaydi: 4 GHz demak — sekundiga 4 milliard marta "endi qadam tashla" degan buyruq. Bir taktda signal butun sxemani kesib o\'tishga ulgurishi shart.'
    ],
    facts: [
      ['Asos', 'NAND — universal element'],
      ['ALU', 'Minglab gate'],
      ['Xotira', 'Flip-flop / SRAM yacheyka']
    ],
    color: 0xa78bfa, color2: 0xf472b6
  },
  {
    id: 'gates',
    scale: 'Gate ichi — ~10⁻⁶ m',
    kicker: '11 — GATE ICHIDA',
    title: 'XOR ni ochib ko\'ramiz',
    lead: 'Oldingi qatlamdagi uchburchak — shunchaki belgi. Uning ichida nima bor?',
    body: [
      '<b>NAND — universal element:</b> undan AND, OR, NOT — hamma narsani qurish mumkin. Shuning uchun chiplar asosan NAND va NOR dan yig\'iladi.',
      'Bitta <b>XOR</b> = 4 ta NAND. Bitta NAND = <b>4 ta tranzistor</b>: 2 ta PMOS parallel (yuqorida), 2 ta NMOS ketma-ket (pastda). Ya\'ni yig\'indi bitini beradigan bitta XOR ≈ <b>16 tranzistor</b>.',
      'Bir bitli to\'liq summator ≈ <b>28 tranzistor</b>. 64-bitlisi ≈ <b>1800</b>. Butun ALU esa yuz minglab — va bu protsessorning kichkina bir burchagi xolos.',
      'Mana shu yerda "mantiq" tugab, "fizika" boshlanadi. Keyingi qatlamda o\'sha tranzistorlardan bittasini ochamiz.'
    ],
    facts: [
      ['NAND', '4 tranzistor'],
      ['XOR', '4 NAND = 16 tranzistor'],
      ['64-bit summator', '~1800 tranzistor']
    ],
    color: 0xd8b4fe, color2: 0xf0abfc
  },
  {
    id: 'transistor',
    scale: 'Tranzistor — ~10⁻⁸ m (10 nm)',
    kicker: '12 — TRANZISTOR',
    title: 'CMOS: kremniydan yasalgan kalit',
    lead: 'Har bir mantiqiy element — bir nechta tranzistor. Tranzistor esa oddiy boshqariladigan kalit.',
    body: [
      '<b>MOSFET</b> uchta terminaldan iborat: <b>Source</b>, <b>Drain</b> va ularning ustidagi <b>Gate</b>. Gate ga kuchlanish bersak — source va drain orasida o\'tkazuvchi kanal paydo bo\'ladi va tok oqadi.',
      '<b>CMOS invertor</b> — 2 ta tranzistor: PMOS (yuqorida) va NMOS (pastda). Kirish 0 bo\'lsa PMOS ochiladi va chiqish VDD ga (1) ulanadi; kirish 1 bo\'lsa NMOS ochiladi va chiqish yerga (0) tushadi. Mana sizga <code>NOT</code>.',
      'Chiroyli tomoni: <b>statik holatda deyarli tok sarflanmaydi</b> — energiya faqat almashish paytida ketadi. Shuning uchun butun raqamli dunyo CMOS ustida qurilgan.',
      'Zamonaviy protsessorda <b>100 milliarddan ortiq</b> tranzistor bor va ularning har biri sekundiga milliardlab marta ochilib-yopiladi.'
    ],
    facts: [
      ['Element', 'MOSFET / FinFET / GAA'],
      ['NOT', '2 tranzistor'],
      ['Kuchlanish', '0 V = 0, ~0.8 V = 1']
    ],
    color: 0xf472b6, color2: 0xfb923c
  },
  {
    id: 'memory',
    scale: 'Xotira yacheykasi — ~10⁻⁸ m',
    kicker: '13 — XOTIRA',
    title: 'Bit qayerda yotadi',
    lead: 'Kesh, RAM va SSD — uchalasi ham tranzistordan, lekin uchta butunlay boshqa hiyla bilan.',
    body: [
      '<b>SRAM</b> (kesh): 6 ta tranzistor bir-birini ushlab turadi — ikki invertor halqa qilib ulangan. Juda tez (~1 ns), lekin qimmat va katta joy egallaydi. Tok uzilsa yo\'qoladi.',
      '<b>DRAM</b> (RAM): atigi 1 tranzistor + 1 kondensator. Arzon va zich, lekin kondensator <b>oqib ketadi</b> — shuning uchun har ~64 ms da butun xotira <b>refresh</b> qilinadi. Kompyuteringiz hozir ham buni sekundiga o\'n besh marta bajarayapti.',
      '<b>NAND flash</b> (SSD): tranzistorning gate\'i ichida ikkinchi, <b>suzuvchi gate</b> bor. Unga elektron qamab qo\'yiladi va tok uzilsa ham qolaveradi — fayllaringiz shuning uchun saqlanadi.',
      'Eng qizig\'i: elektron o\'sha izolyatsiya qatlamidan <b>tunnellashuv</b> orqali o\'tkaziladi. Oxirgi qatlamlarda shu hodisani yana ko\'rasiz — u yerda u nuqson, bu yerda esa butun sanoat unga tayanadi.'
    ],
    facts: [
      ['SRAM', '6T · ~1 ns · uchuvchan'],
      ['DRAM', '1T1C · refresh kerak'],
      ['Flash', 'suzuvchi gate · tunnellashuv']
    ],
    color: 0x5eead4, color2: 0x22d3ee
  },
  {
    id: 'silicon',
    scale: 'Kristall panjara — ~10⁻¹⁰ m (atomlar)',
    kicker: '14 — MATERIAL',
    title: 'Kremniy, doping va PN o\'tish',
    lead: 'Kalit nima uchun ishlaydi? Chunki kremniy atomlariga boshqa atomlar qo\'shilgan.',
    body: [
      'Sof kremniy — muntazam kristall panjara. Har bir atomning 4 ta valent elektroni qo\'shnilari bilan bog\'langan, ortiqcha erkin zaryad yo\'q. Shuning uchun sof kremniy yomon o\'tkazgich.',
      '<b>Doping:</b> panjaraga fosfor (5 valent elektron) qo\'shsak — bitta ortiqcha <b>elektron</b> erkin qoladi → <b>n-tur</b>. Bor (3 elektron) qo\'shsak — bitta <b>kovak</b> (yetishmovchilik) paydo bo\'ladi → <b>p-tur</b>.',
      '<b>PN o\'tish joyi:</b> ikkovi tutashganda chegarada elektronlar kovaklarni to\'ldiradi va <b>bo\'shash sohasi</b> hosil bo\'ladi — o\'z ichki elektr maydoni bilan. Tok endi faqat bir tomonga oqadi.',
      'Tranzistordagi gate kuchlanishi aynan shu sohani boshqaradi: kanalni ochadi yoki yopadi. Milliard marta sekundiga.'
    ],
    facts: [
      ['Kristall', 'Olmos tipidagi panjara'],
      ['n-tur', 'Fosfor → erkin elektron'],
      ['p-tur', 'Bor → kovak']
    ],
    color: 0x60a5fa, color2: 0xa78bfa
  },
  {
    id: 'quantum',
    scale: 'Kvant darajasi — elektron to\'lqin funksiyasi',
    kicker: '15 — KVANT FIZIKASI',
    title: 'Zona nazariyasi va tunnellashuv',
    lead: 'Eng pastki qavat. Bu yerda "zarracha" degan tushuncha yo\'qoladi va ehtimollik boshlanadi.',
    body: [
      'Elektron — nuqta emas, <b>to\'lqin funksiyasi</b> ψ. Uning qayerdaligini emas, faqat <b>|ψ|² — topilish ehtimolini</b> bilamiz. Atom atrofidagi "orbita" aslida shu ehtimollik buluti.',
      '<b>Nega yarimo\'tkazgich bor?</b> Yolg\'iz atomda energiya sathlari diskret. Milliardlab atom kristallda yaqinlashsa, <b>Pauli prinsipi</b> tufayli sathlar bir-biriga mos kelolmaydi va <b>zonalar</b>ga yoyiladi: valent zona va o\'tkazuvchanlik zonasi, orasida <b>taqiqlangan zona</b>.',
      'Kremniyda bu tirqish <b>1.12 eV</b> — metalldagidek nol emas, izolyatordagidek katta ham emas. Aynan shu "o\'rtacha" qiymat elektronni kuchlanish bilan boshqarish imkonini beradi. <b>Butun raqamli sivilizatsiya shu raqamga tayanadi.</b>',
      '<b>Kvant tunnellashuvi:</b> gate oksidi 1–2 nm ga tushganda elektron energiyasi yetmasa ham to\'siqdan <i>o\'tib ketadi</i> — to\'lqin funksiyasi to\'siq ichida eksponensial so\'nadi, lekin nolga aylanmaydi. Natijada <b>sizib chiqish toki</b> va isish. Moore qonuni aynan shu yerda fizik devorga urildi.'
    ],
    facts: [
      ['Band gap (Si)', '1.12 eV'],
      ['Prinsip', 'Pauli + Schrödinger'],
      ['Chegara', 'Tunnellashuv → sizish toki']
    ],
    color: 0xc084fc, color2: 0x38bdf8
  },
  {
    id: 'screen',
    scale: 'Ekran — bayt yana yorug\'likka aylanadi',
    kicker: '16 — YORUG\'LIK',
    title: 'Baytdan fotongacha',
    lead: 'Pastga sayohat tugadi. Endi natija yuqoriga qaytadi — va yana kvant bilan tugaydi.',
    body: [
      'Terminal buferida "Salom" hali ham baytlar. <b>Rasterizator</b> har bir harfning shrift ichidagi <b>konturini</b> oladi va uni piksellar to\'riga bo\'yaydi, chetlarini silliqlab (antialiasing).',
      'Natija <b>framebuffer</b>ga tushadi — ekrandagi har bir piksel uchun R, G, B qiymatlari yozilgan katta massiv. GPU uni sekundiga 60+ marta panelga uzatadi.',
      'Har bir piksel aslida <b>uchta subpiksel</b>: qizil, yashil, ko\'k. Ularning nisbati rangni beradi; oq harf demak uchalasi ham to\'liq yonadi.',
      '<b>OLED</b> da har bir subpiksel — kichkina organik diod. Kuchlanish berilsa elektron va kovak uchrashib <b>rekombinatsiya</b> qiladi: elektron pastroq energiya sathiga tushadi va farqni <b>foton</b> sifatida chiqaradi.',
      'Ya\'ni ko\'zingizga kelayotgan yorug\'lik — o\'sha zona nazariyasining o\'zi. <code>Console.WriteLine("Salom")</code> dan boshlangan yo\'l elektronning energiya sathidan sakrashi bilan tugaydi.'
    ],
    facts: [
      ['Rasterizatsiya', 'kontur → piksel to\'ri'],
      ['Piksel', '3 subpiksel: R · G · B'],
      ['OLED', 'rekombinatsiya → foton']
    ],
    color: 0xfbbf24, color2: 0xfde68a
  }
];
