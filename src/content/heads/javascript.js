// JavaScript boshi: manba kod → Ignition bayt-kodi → TurboFan.
// C# dan farqi: JIT bu yerda taxminlar ustiga quriladi va taxmin buzilsa
// optimallashtirilgan kod tashlab yuboriladi.

export const JAVASCRIPT = {
  id: 'javascript',
  name: 'JavaScript',
  file: 'program.js',
  lang: {
    call: 'console.log("Salom")',
    runtime: 'process.stdout.write(...)',
    runtimeName: 'Node.js'
  },
  levels: [
    {
      id: 'js-source',
      kicker: 'MANBA KOD',
      title: 'JavaScript manba kodi',
      scale: '~10⁻² m — ekrandagi harflar',
      lead: 'Hech narsa oldindan ma\'lum emas: turlar ham, obyektlarning shakli ham.',
      body: [
        'JavaScript da o\'zgaruvchi bugun son, ertaga satr bo\'lishi mumkin. Obyektga istalgan paytda yangi maydon qo\'shsa bo\'ladi, o\'chirsa ham bo\'ladi.',
        'Bu kompilyator uchun dahshatli xabar: <code>a + b</code> ni ko\'rib turib, u qo\'shish bo\'ladimi yoki satrlarni ulash bo\'ladimi — bilolmaydi. Har ikkalasiga tayyor turishi kerak.',
        'Yana bir qiyinchilik: kod <b>tarmoq orqali keladi</b>. Kompilyatsiyaga sarflangan har millisekund — sahifa ochilishining kechikishi. Shuning uchun V8 hamma narsani darrov kompilyatsiya qilmaydi: avval faylni <b>yuzaki</b> o\'qib chiqadi va faqat haqiqatan chaqirilgan funksiyalarni to\'liq tahlil qiladi.',
        'Keyingi ikki qatlam — V8 ning shu ikki muammoni qanday hal qilgani haqida.'
      ],
      facts: [
        ['Turlar', 'ish vaqtida, o\'zgaruvchan'],
        ['Obyekt shakli', 'istalgan paytda o\'zgaradi'],
        ['Yuklash', 'tarmoq orqali — tezlik muhim']
      ],
      color: 0xfacc15, color2: 0xfb923c,
      view: { z: 28, y: 0.4, w: 12.5 }
    },
    {
      id: 'js-ignition',
      kicker: 'BAYT-KOD',
      title: 'Ignition, yashirin sinflar va inline kesh',
      scale: 'V8 Ignition — ish vaqti',
      lead: 'V8 dinamik tildan statik ma\'lumot yig\'ishni o\'rganadi.',
      body: [
        '<b>Ignition</b> — V8 ning bayt-kod interpretatori. IL va Python bayt-kodidan farqi: u <b>registrli</b>, stekli emas — komandalar <code>r0</code>, <code>r1</code> kabi virtual registrlarni ko\'rsatadi, shuning uchun komandalar soni kamroq.',
        '<b>Yashirin sinflar (shapes):</b> V8 bir xil tuzilishdagi obyektlarni bitta ichki "sinf"ga bog\'laydi. <code>{x, y}</code> yaratsangiz — shakl <code>S1</code>. Keyin <code>z</code> qo\'shsangiz — yangi shakl <code>S2</code> ga o\'tiladi. Shakl ma\'lum bo\'lsa, maydonni qidirmasdan <b>siljish bo\'yicha</b> o\'qish mumkin.',
        '<b>Inline kesh:</b> har bir xususiyat o\'qish joyi o\'zi ko\'rgan shakllarni eslab qoladi. Doim bitta shakl kelsa — <i>monomorf</i>, eng tez holat. Bir nechta — <i>polimorf</i>. To\'rttadan ko\'p — <i>megamorf</i>, va tezlik keskin tushadi.',
        'Shu sababli bir xil obyektlarni bir xil tartibda qurish JavaScript da real optimizatsiya hisoblanadi: maydonlarni har xil tartibda qo\'shsangiz, V8 uchun ular boshqa-boshqa shakllar bo\'ladi.'
      ],
      facts: [
        ['Bayt-kod', 'registrli (stekli emas)'],
        ['Shakl', 'yashirin sinf → siljish'],
        ['IC', 'mono → poli → megamorf']
      ],
      color: 0x818cf8, color2: 0x38bdf8,
      view: { z: 35, y: -1.2, w: 15.5 }
    },
    {
      id: 'js-turbofan',
      kicker: 'OPTIMIZATSIYA',
      title: 'TurboFan: taxmin va undan qaytish',
      scale: 'TurboFan — qizigan kod',
      lead: 'JIT bu yerda faqat tarjima qilmaydi — u tavakkal qiladi.',
      body: [
        'Funksiya yetarlicha ko\'p chaqirilsa, V8 uni <b>TurboFan</b> ga beradi. U inline kesh yig\'gan ma\'lumotni o\'qiydi va <b>taxmin</b> qiladi: "bu yergacha <code>x</code> doim son bo\'lgan, demak son bo\'lib qolaveradi".',
        'Shu taxmin ustiga juda tez kod quriladi: tur tekshiruvlari olib tashlanadi, obyekt maydonlari to\'g\'ridan-to\'g\'ri siljish bo\'yicha o\'qiladi, funksiyalar ichkariga ko\'chiriladi.',
        'Lekin taxmin buzilishi mumkin. Kimdir o\'sha funksiyaga satr uzatsa, optimallashtirilgan kod <b>yaroqsiz</b> bo\'ladi. Shunda <b>deoptimizatsiya</b> ro\'y beradi: V8 bajarilishni to\'xtatib, holatni bayt-kodga ko\'chiradi va Ignition davom ettiradi.',
        'Deopt qimmat. Agar funksiya doim turini o\'zgartirsa, u optimallashtiriladi, tashlanadi, yana optimallashtiriladi — bunga <i>deopt loop</i> deyiladi va kod sekinlashib qoladi.',
        'C# JIT ham qizigan kodni qayta kompilyatsiya qiladi, lekin turlar oldindan ma\'lum bo\'lgani uchun tavakkal qilishi shart emas. Mana shu — statik va dinamik tillar orasidagi eng katta amaliy farq.'
      ],
      facts: [
        ['Asos', 'IC dan yig\'ilgan taxminlar'],
        ['Taxmin buzilsa', 'deoptimizatsiya'],
        ['Xavf', 'deopt loop']
      ],
      color: 0xf472b6, color2: 0xfacc15,
      view: { z: 35, y: -1.4, w: 16.5 }
    }
  ]
};
