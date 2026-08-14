// C# / .NET boshi: manba kod → Roslyn → IL → CLR va JIT.
// Undan pastda umumiy umurtqa boshlanadi (src/content/spine.js).

export const CSHARP = {
  id: 'csharp',
  name: 'C#',
  file: 'Program.cs',
  // Umumiy qatlamlarda ishlatiladigan tilga xos satrlar
  lang: {
    call: 'Console.WriteLine("Salom")',
    runtime: 'Stream.Write(bytes)',
    runtimeName: '.NET runtime',
    stackNote: '.NET da oqim uchun odatda 1 MB'
  },
  levels: [
  {
    id: "source",
    kicker: "MANBA KOD",
    title: "C# manba kodi",
    scale: "~10⁻² m — ekrandagi harflar",
    lead: "Hammasi matndan boshlanadi. Lekin kompyuter uchun bu matn emas — bu baytlar ketma-ketligi.",
    body: [
      "Siz yozgan <b>Program.cs</b> — oddiy matn fayl. Diskda u UTF-8 kodlashda baytlar sifatida yotadi: <code>C</code> harfi = 0x43 = <code>01000011</code>.",
      "Protsessor \"o'zgaruvchi\", \"metod\" yoki \"sinf\" degan tushunchani bilmaydi. Bu tushunchalar faqat <b>odam uchun</b> — ular pastga tushgan sari yo'qolib boradi.",
      "Quyidagi 15 qatlam — o'sha yo'qolish jarayoni. Har bir qadamda abstraksiya yechiladi va oxirida faqat elektronlar va kvant qonunlari qoladi."
    ],
    facts: [
      ["Format", "UTF-8 matn"],
      ["Kim tushunadi", "Faqat odam va kompilyator"],
      ["Hajm", "~1 KB manba → ~4 KB IL"]
    ],
    color: 0x6ee7ff, color2: 0x9b8cff,
    view: { z: 27, y: 0.5, w: 11.5 }
  },
  {
    id: "ast",
    kicker: "KOMPILYATOR",
    title: "Leksik tahlil va sintaksis daraxti",
    scale: "Roslyn kompilyatori — kompilyatsiya vaqti",
    lead: "Roslyn matnni tokenlarga bo'ladi, undan daraxt quradi va ma'nosini tekshiradi.",
    body: [
      "<b>Lexer</b> belgilar oqimini tokenlarga ajratadi: <code>var</code>, <code>x</code>, <code>=</code>, <code>42</code>, <code>;</code>.",
      "<b>Parser</b> tokenlardan <b>sintaksis daraxti</b> (AST) quradi — kod endi tekis matn emas, ierarxik struktura.",
      "<b>Semantik tahlil</b> har bir nomni haqiqiy simvolga bog'laydi: bu <code>x</code> qaysi o'zgaruvchi? Bu metod qaysi turga tegishli? Turlar mos kelmasa — CS xatosi shu yerda tug'iladi.",
      "Qiziq: Roslyn ham C#da yozilgan. C# kompilyatorini kompilyatsiya qilish uchun C# kompilyatori kerak — bunga <i>bootstrapping</i> deyiladi."
    ],
    facts: [
      ["Bosqichlar", "Lex → Parse → Bind → Emit"],
      ["Natija", "Syntax tree + symbol jadval"],
      ["Xatolar", "Sintaktik va semantik"]
    ],
    color: 0x8b7cff, color2: 0x6ee7ff,
    view: { z: 31, y: 2.4, w: 10 }
  },
  {
    id: "il",
    kicker: "ORALIQ TIL",
    title: "IL (CIL) va metadata",
    scale: "Program.dll — diskdagi assembly",
    lead: "Roslyn mashina kodi chiqarmaydi. U stack asosidagi virtual mashina uchun bayt-kod chiqaradi.",
    body: [
      "IL — <b>stack-based</b> til. Registrlar yo'q, hamma narsa hisob stekida bajariladi: <code>ldstr</code> qatorni stekka qo'yadi, <code>call</code> uni yechib metodga uzatadi.",
      "Assembly — <b>PE</b> formatidagi fayl (.dll/.exe). Ichida IL baytlari va <b>metadata</b>: qanday turlar, metodlar, imzolar, atributlar bor. Refleksiya aynan shu metadata ustida ishlaydi.",
      "Shuning uchun bitta <code>.dll</code> Windows x64, Linux ARM64 va macOS da bir xil ishlaydi — u hali hech qaysi protsessorga bog'lanmagan."
    ],
    facts: [
      ["Model", "Stack mashinasi"],
      ["Konteyner", "PE / ECMA-335"],
      ["Portativlik", "CPU va OS dan mustaqil"]
    ],
    color: 0x7dd3fc, color2: 0x22d3ee,
    view: { z: 32, y: 0.6, w: 13.5 }
  },
  {
    id: "jit",
    kicker: "ISH VAQTI",
    title: "CLR va JIT (RyuJIT)",
    scale: "CLR ish vaqti — millisekundlar",
    lead: "Dastur ishga tushganda IL aynan shu kompyuter uchun mashina kodiga aylanadi — chaqirilgan paytda.",
    body: [
      "<b>Type loader</b> turlarni yuklaydi, metod jadvallarini quradi. Metod birinchi marta chaqirilganda uning o'rniga <i>stub</i> turadi — u <b>JIT</b> ni uyg'otadi.",
      "<b>Tiered compilation:</b> Tier 0 — tez, optimallashtirilmagan kod (dastur tez ishga tushsin). Metod ~30 marta chaqirilsa, \"qizigan\" deb hisoblanadi va Tier 1 uni to'liq optimallashtirib qayta kompilyatsiya qiladi: inlining, siklni ochish, SIMD.",
      "<b>GC</b> xotirani boshqaradi: yangi obyektlar Gen 0 da tug'iladi, omon qolganlari Gen 1 va Gen 2 ga ko'chadi. Siz <code>free()</code> yozmaysiz — buni GC qiladi.",
      "AOT rejimida (NativeAOT) bu ish oldindan, kompilyatsiya paytida bajariladi — JIT umuman kerak bo'lmaydi."
    ],
    facts: [
      ["JIT", "RyuJIT"],
      ["Tier 0 → Tier 1", "~30 chaqiruvdan keyin"],
      ["Xotira", "Generatsion GC"]
    ],
    color: 0xffb86c, color2: 0xff7ac6,
    view: { z: 33, y: -1.4, w: 15 }
  }
  ]
};
