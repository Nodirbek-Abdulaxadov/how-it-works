// Python boshi: manba kod → bayt-kod → interpretator halqasi.
// Bu yerda zanjir C# dan tubdan farq qiladi: bayt-kod hech qachon mashina
// kodiga aylanmaydi, u allaqachon kompilyatsiya qilingan C kodini boshqaradi.

export const PYTHON = {
  id: 'python',
  name: 'Python',
  file: 'program.py',
  lang: {
    call: 'print("Salom")',
    runtime: 'sys.stdout.write(...)',
    runtimeName: 'CPython'
  },
  levels: [
    {
      id: 'py-source',
      kicker: 'MANBA KOD',
      title: 'Python manba kodi',
      scale: '~10⁻² m — ekrandagi harflar',
      lead: "Kompilyatsiya buyrug'i yo'q. Lekin kompilyatsiya baribir bo'ladi.",
      body: [
        '<code>python program.py</code> deb yozasiz va dastur darrov ishlaydi — <code>build</code> bosqichi ko\'rinmaydi.',
        'Aslida CPython faylni baribir <b>kompilyatsiya qiladi</b>: uni bayt-kodga o\'giradi va natijani <code>__pycache__/program.cpython-313.pyc</code> ga saqlab qo\'yadi. Keyingi safar fayl o\'zgarmagan bo\'lsa, shu keshdan o\'qiladi.',
        'Farqi shundaki, bu bayt-kod <b>mashina kodiga aylanmaydi</b>. U interpretatorga "endi nima qilish kerak" deb ko\'rsatma beradi xolos.',
        'Shuning uchun Python da tur (type) xatolari kompilyatsiya paytida emas, <b>ishga tushganda</b> chiqadi — kompilyator turlarni tekshirmaydi, chunki u hali qaysi qiymat kelishini bilmaydi.'
      ],
      facts: [
        ['Format', 'UTF-8 matn'],
        ['Kesh', '__pycache__/*.pyc'],
        ['Tur tekshiruvi', 'ish vaqtida']
      ],
      color: 0x4ade80, color2: 0xfacc15,
      view: { z: 27, y: 0.5, w: 12 }
    },
    {
      id: 'py-bytecode',
      kicker: 'BAYT-KOD',
      title: 'AST va CPython bayt-kodi',
      scale: 'compile() — kompilyatsiya vaqti',
      lead: 'Matn daraxtga, daraxt esa stek mashinasi komandalariga aylanadi.',
      body: [
        'CPython manbani tokenlarga bo\'ladi, <b>AST</b> quradi va undan <b>bayt-kod</b> chiqaradi. Bu ham C# dagi IL kabi <b>stack-based</b>: qiymatlar stekka qo\'yiladi va yechib olinadi.',
        '<code>dis</code> moduli buni ko\'rsatadi: <code>LOAD_NAME print</code>, <code>LOAD_CONST \'Salom\'</code>, <code>CALL 1</code>, <code>POP_TOP</code>.',
        'Har bir komanda 2 baytdan iborat: <b>opcode</b> va <b>oparg</b>. Ular <code>code object</code> ichida — u yerda konstantalar, o\'zgaruvchi nomlari va qator raqamlari ham saqlanadi.',
        'Shu yergacha hikoya C# ga juda o\'xshaydi. Farq keyingi qatlamda boshlanadi: bu bayt-kodni <b>hech kim mashina kodiga o\'girmaydi</b>.'
      ],
      facts: [
        ['Model', 'Stack mashinasi'],
        ['Komanda', '2 bayt: opcode + oparg'],
        ['Konteyner', 'code object']
      ],
      color: 0xfacc15, color2: 0x4ade80,
      view: { z: 33, y: -0.6, w: 14.5 }
    },
    {
      id: 'py-eval',
      kicker: 'INTERPRETATOR',
      title: 'Halqa: bayt-kod mashina kodiga aylanmaydi',
      scale: 'CPython ceval halqasi — ish vaqti',
      lead: 'Bu qatlam butun sayohatdagi eng katta burilish. Pastga tushish shu yerda to\'xtaydi.',
      body: [
        'CPython ichida <b>bitta ulkan halqa</b> bor (<code>ceval.c</code>): u bayt-kodni birma-bir o\'qiydi va har bir opcode uchun <b>oldindan yozilgan C kodi</b> bo\'lagiga sakraydi.',
        'Ya\'ni sizning bayt-kodingiz mashina kodiga <i>aylanmaydi</i> — u allaqachon mashina kodiga aylantirilgan <b>interpretatorni boshqaradi</b>. Pastdagi qatlamlarda ko\'radigan mashina kodi — sizniki emas, CPython niki.',
        'Narxi ham shundan: bitta <code>a + b</code> uchun o\'nlab mashina komandasi ketadi — opcode o\'qish, turlarni tekshirish, <b>PyObject</b> qutilarini ochish, natijani yangi obyektga o\'rash, hisoblagichlarni yangilash.',
        'Python da <b>hamma narsa obyekt</b>: <code>x = 1</code> ham xotirada sarlavhasi va <b>havolalar hisoblagichi</b> bor qutini yaratadi. Hisoblagich nolga tushsa, obyekt o\'chiriladi.',
        '<b>GIL</b> — global qulf: bir vaqtda faqat bitta oqim bayt-kod bajaradi. Shuning uchun Python da ko\'p oqim I/O ni tezlashtiradi, hisob-kitobni esa yo\'q.',
        'Python 3.11 dan "ixtisoslashuvchi" interpretator qo\'shildi (qaytariladigan joylarda opcode o\'zini almashtiradi), 3.13 da esa tajribaviy JIT paydo bo\'ldi — ya\'ni chegara asta-sekin siljiyapti.'
      ],
      facts: [
        ['Halqa', 'ceval.c — computed goto'],
        ['Har bir qiymat', 'PyObject + refcount'],
        ['GIL', 'bir vaqtda 1 oqim']
      ],
      color: 0x38bdf8, color2: 0xf472b6,
      view: { z: 36, y: -1.6, w: 16 }
    }
  ]
};
