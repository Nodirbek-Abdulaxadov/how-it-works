// Rust boshi: manba kod → MIR va borrow checker → LLVM va AOT.
// Qiziq tomoni: o'rtadagi qatlam bitta ham mashina komandasi chiqarmaydi.

export const RUST = {
  id: 'rust',
  name: 'Rust',
  file: 'main.rs',
  lang: {
    call: 'println!("Salom")',
    runtime: 'Stdout::write_all(buf)',
    runtimeName: 'std::io'
  },
  levels: [
    {
      id: 'rs-source',
      kicker: 'MANBA KOD',
      title: 'Rust manba kodi va makroslar',
      scale: '~10⁻² m — ekrandagi harflar',
      lead: "Yozgan kodingizning bir qismi kompilyatorgacha ham yetib bormaydi.",
      body: [
        '<code>println!</code> — funksiya emas, <b>makros</b> (undov belgisi shundan). Kompilyatsiyaning eng boshida u <b>yoyiladi</b>: format satri bo\'laklarga bo\'linadi va o\'rniga haqiqiy <code>Stdout</code> chaqiruvlari qo\'yiladi.',
        'Ya\'ni kompilyator ko\'radigan kod siz yozgan koddan boshqacha. Format satridagi xatolar shu bosqichda topiladi — shuning uchun <code>println!("{}", x)</code> dagi argument soni <b>kompilyatsiya paytida</b> tekshiriladi.',
        'Rust da <b>har bir qiymatning bitta egasi</b> bor. O\'zgaruvchini boshqasiga bersangiz, egalik <i>ko\'chadi</i> va eskisi yaroqsiz bo\'lib qoladi. Bu qoida keyingi qatlamda tekshiriladi.',
        'Bu yerda hali GC ham, ish vaqti ham yo\'q — va oxirigacha paydo bo\'lmaydi.'
      ],
      facts: [
        ['Makros', 'kompilyatsiyadan oldin yoyiladi'],
        ['Egalik', 'har qiymatga bitta ega'],
        ['Ish vaqti', 'deyarli yo\'q']
      ],
      color: 0xfb923c, color2: 0xfbbf24,
      view: { z: 28, y: 0.4, w: 12.5 }
    },
    {
      id: 'rs-borrow',
      kicker: 'BORROW CHECKER',
      title: 'MIR va izsiz yo\'qoladigan qatlam',
      scale: 'MIR — kompilyatsiya vaqti',
      lead: 'Bu qatlam bitta ham mashina komandasi chiqarmaydi. Va aynan shuning uchun qimmatli.',
      body: [
        'AST dan keyin kod <b>HIR</b> ga, undan <b>MIR</b> ga tushadi — bu <i>boshqaruv oqimi grafi</i>: bazaviy bloklar va ular orasidagi o\'tishlar. Sikllar, <code>match</code>, <code>?</code> — hammasi oddiy o\'tishlarga yoyiladi.',
        'MIR ustida <b>borrow checker</b> ishlaydi. Uning qoidalari sodda: bir vaqtda <b>yo bir nechta <code>&amp;</code> o\'qish havolasi, yo bitta <code>&amp;mut</code> yozish havolasi</b> bo\'lishi mumkin — ikkovi birga emas. Va hech bir havola egasidan uzoq yashay olmaydi.',
        'Shu ikki qoida "ma\'lumot poygasi" (data race) degan xatolar sinfini <b>kompilyatsiya paytida</b> yo\'q qiladi. C da bu xatolar ish vaqtida, ba\'zan bir yildan keyin chiqadi.',
        'Eng qizig\'i: <b>lifetime\'lar mashina kodiga o\'tmaydi</b>. Tekshiruv tugagach, ular butunlay o\'chiriladi — natijada birorta ham qo\'shimcha komanda qolmaydi. Shuning uchun "zero-cost" deyiladi.',
        'Ya\'ni bu qatlam pastdagi qatlamlarga hech narsa qo\'shmaydi. U faqat <i>noto\'g\'ri dasturlarning pastga tushishiga yo\'l qo\'ymaydi</i>.'
      ],
      facts: [
        ['Ko\'rinish', 'MIR — boshqaruv oqimi grafi'],
        ['Qoida', '&amp; ko\'p yoki &amp;mut bitta'],
        ['Natijadagi hajm', '0 bayt']
      ],
      color: 0xf472b6, color2: 0xfb923c,
      view: { z: 35, y: -1.4, w: 15.5 }
    },
    {
      id: 'rs-codegen',
      kicker: 'KODGENERATSIYA',
      title: 'LLVM va oldindan kompilyatsiya',
      scale: 'LLVM IR → mashina kodi',
      lead: 'JIT ham, bayt-kod ham yo\'q. Kompilyator to\'g\'ridan-to\'g\'ri protsessor komandalarini yozadi.',
      body: [
        'MIR <b>LLVM IR</b> ga o\'giriladi — bu allaqachon registrlar va bazaviy bloklarga o\'xshaydigan past darajali til. LLVM uni o\'nlab o\'tishda optimallashtiradi: o\'lik kodni olib tashlash, sikllarni ochish, inlining, SIMD.',
        '<b>Monomorfizatsiya:</b> generik funksiya har bir aniq tur uchun <b>alohida nusxalanadi</b>. <code>max&lt;i32&gt;</code> va <code>max&lt;f64&gt;</code> — ikki xil funksiya. Shuning uchun generikalar tezlikni pasaytirmaydi, lekin binar hajmi va kompilyatsiya vaqti oshadi.',
        'Natija — tayyor mashina kodi. Ish vaqtida hech narsa kompilyatsiya qilinmaydi, "qizish" davri yo\'q: birinchi chaqiruv ham, milliondinchisi ham bir xil tezlikda.',
        'To\'lov ham bor: C# JIT sizning protsessoringizni <i>bilib turib</i> optimallashtiradi, Rust esa qaysi mashinada ishlashini oldindan bilmaydi va ehtiyotkorroq kod chiqaradi.',
        'Shu yerdan pastda C# bilan Rust ning yo\'llari qo\'shiladi — ikkovi ham bir xil x86-64 baytlariga aylandi.'
      ],
      facts: [
        ['Oraliq', 'LLVM IR'],
        ['Generikalar', 'monomorfizatsiya'],
        ['Qizish davri', 'yo\'q']
      ],
      color: 0xa78bfa, color2: 0x60a5fa,
      view: { z: 34, y: -1, w: 15 }
    }
  ]
};
