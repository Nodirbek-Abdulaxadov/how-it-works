// Go boshi: manba kod → SSA va AOT → ish vaqti (scheduler + GC).
// Rust dan farqi: Go ham AOT kompilyatsiya qiladi, lekin natijaga
// butun boshli ish vaqtini qo'shib yuboradi.

export const GO = {
  id: 'go',
  name: 'Go',
  file: 'main.go',
  lang: {
    call: 'fmt.Println("Salom")',
    runtime: 'os.Stdout.Write(buf)',
    runtimeName: 'Go runtime'
  },
  levels: [
    {
      id: 'go-source',
      kicker: 'MANBA KOD',
      title: 'Go manba kodi',
      scale: '~10⁻² m — ekrandagi harflar',
      lead: 'Til ataylab kichik: kompilyator ham, o\'quvchi ham tez tushunsin deb.',
      body: [
        'Go da atigi <b>25 ta kalit so\'z</b> bor (C# da 100 dan ortiq). Generikalar 2022 yilgacha umuman yo\'q edi, makros va operator qayta yuklash hali ham yo\'q.',
        'Bu qasddan qilingan: til qancha sodda bo\'lsa, kompilyator shuncha tez ishlaydi. Yirik Go loyihalari sekundlarda kompilyatsiya bo\'ladi.',
        '<code>go</code> kalit so\'zi funksiyani <b>goroutine</b> da ishga tushiradi. Bu OS oqimi emas — bu ish vaqti o\'zi boshqaradigan yengil bajarilish oqimi. Bittasi ~2 KB dan boshlanadi, shuning uchun ularni yuz minglab yaratsa bo\'ladi.',
        '<code>chan</code> — kanal: goroutine\'lar bir-biriga xotira orqali emas, xabar orqali murojaat qiladi.'
      ],
      facts: [
        ['Kalit so\'zlar', '25 ta'],
        ['Goroutine', '~2 KB dan boshlanadi'],
        ['Aloqa', 'kanallar orqali']
      ],
      color: 0x22d3ee, color2: 0x7dd3fc,
      view: { z: 28, y: 0.4, w: 12.5 }
    },
    {
      id: 'go-compile',
      kicker: 'KOMPILYATOR',
      title: 'SSA va bitta binar fayl',
      scale: 'go build — kompilyatsiya vaqti',
      lead: 'Chiqishda bitta fayl: sizning kodingiz, kutubxonalar va ish vaqti — hammasi ichida.',
      body: [
        'Go kompilyatori AST dan <b>SSA</b> shakliga o\'tadi (har bir o\'zgaruvchiga bir marta qiymat beriladi). Bu optimizatsiyani osonlashtiradi va deyarli barcha zamonaviy kompilyatorlar shu shaklni ishlatadi.',
        'Muhim optimizatsiyalardan biri — <b>escape analysis</b>: kompilyator obyektning funksiyadan "qochib chiqishi"ni tekshiradi. Qochmasa — <b>stekda</b> joylashtiriladi va GC ga umuman tegmaydi. Qochsa — uyumga.',
        'LLVM ishlatilmaydi: Go o\'z backend\'ini yozgan. Sifat biroz pastroq, lekin tezlik ancha yuqori — kompilyatsiya vaqti tilning asosiy va\'dalaridan biri.',
        'Natija — <b>statik binar</b>. Ichida sizning kodingiz bilan bir qatorda <b>ish vaqti</b> ham bor: rejalashtiruvchi, GC, xotira ajratgich. Shuning uchun "Salom" chiqaradigan dastur ham ~2 MB bo\'ladi — lekin uni hech qanday bog\'liqliksiz ko\'chirsa bo\'ladi.'
      ],
      facts: [
        ['Oraliq', 'SSA (o\'z backend\'i)'],
        ['Escape analysis', 'stek yoki uyum'],
        ['Natija', 'bitta statik binar']
      ],
      color: 0x60a5fa, color2: 0x22d3ee,
      view: { z: 33, y: -0.8, w: 14.5 }
    },
    {
      id: 'go-runtime',
      kicker: 'ISH VAQTI',
      title: 'Scheduler va GC — binar ichida',
      scale: 'Go runtime — ish vaqti',
      lead: 'Rust da bu qatlam yo\'q edi. Go da u sizning binaringiz ichida yashaydi.',
      body: [
        'Go <b>M:N rejalashtirish</b> ishlatadi: minglab goroutine (<b>G</b>) bir nechta OS oqimi (<b>M</b>) ustida ishlaydi. Orada <b>P</b> — protsessor konteksti, ularning soni odatda yadrolar soniga teng.',
        'Goroutine kanalda yoki tarmoqda kutib qolsa, rejalashtiruvchi uni <b>chetga surib</b>, o\'sha OS oqimiga boshqa goroutine\'ni beradi. OS oqimi hech qachon bo\'sh turmaydi — bu Go ning tarmoq serverlaridagi kuchining asosi.',
        'Goroutine steki <b>o\'sadi</b>: 2 KB dan boshlanib, kerak bo\'lsa ko\'chiriladi va kattalashadi. Shuning uchun oldindan katta stek ajratish shart emas.',
        '<b>GC</b> — parallel mark-and-sweep, dastur bilan <i>bir vaqtda</i> ishlaydi. To\'xtash (stop-the-world) pauzalari odatda <b>millisekundning ondan biri</b>. Buning evaziga o\'tkazuvchanlikdan biroz yutqaziladi — Go ataylab kechikishni tanlagan.',
        'Va bularning hammasi — sizning binaringiz ichidagi kod. Pastdagi qatlamlar uchun bu shunchaki yana bir mashina kodi.'
      ],
      facts: [
        ['Model', 'G · M · P (M:N)'],
        ['Stek', '2 KB → o\'sadi'],
        ['GC pauzasi', '< 1 ms']
      ],
      color: 0x34d399, color2: 0xa78bfa,
      view: { z: 36, y: -1.6, w: 16 }
    }
  ]
};
