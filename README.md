# how it works

**Kod kompyuterda qanday ishlaydi — koddan kvant fizikasigacha.**

Interaktiv 3D vizualizatsiya. Bitta chiqarish chaqiruvi qanday qilib kremniydagi
elektronlar harakatiga aylanishini ko'rsatadi: har bir qatlamda bitta abstraksiya
yechiladi, kvant darajasigacha tushiladi, so'ng natija yorug'lik bo'lib qaytadi.

Beshta til: **C# · Python · Rust · Go · JavaScript** — va ularning barchasi
qayerdan kelganini ko'rsatadigan alohida **Tarix** yo'nalishi.

three.js (faqat asosiy modul, qo'shimchalarsiz), qurish bosqichisiz oddiy ES modullar.

## Tuzilish: bosh va umurtqa

Zanjirning pastki qismi tilga bog'liq emas — 05-qatlamdan pastda "til" degan
tushuncha allaqachon yo'qolgan. Shuning uchun loyiha ikkiga bo'lingan:

**Umurtqa** — 12 qatlam, hamma til uchun bir xil, bir marta quriladi:

| Qatlam | Masshtab |
|--------|----------|
| Mashina kodi: opcode, ModR/M, registrlar | RAM dagi baytlar |
| Chaqiruvlar steki: kadr, qaytish manzili, overflow | stek sohasi |
| Yadro: syscall, ring 3 → ring 0, sys_write | imtiyoz chegarasi |
| Jarayon, virtual xotira, MMU va scheduler | operatsion tizim |
| CPU konveyeri, out-of-order, kesh ierarxiyasi | ~10⁻³ m |
| Mantiqiy elementlar, summator, flip-flop, soat | ~10⁻⁵ m |
| Gate ichi: XOR → 4 NAND → 16 tranzistor | ~10⁻⁶ m |
| CMOS tranzistor: MOSFET va invertor | ~10⁻⁸ m |
| Xotira yacheykasi: SRAM · DRAM · NAND flash | ~10⁻⁸ m |
| Kremniy kristalli, doping, PN o'tish | ~10⁻¹⁰ m |
| Zona nazariyasi, \|ψ\|² va kvant tunnellashuvi | kvant darajasi |
| Ekran: rasterizatsiya → subpiksel → foton | yorug'lik |

**Bosh** — har bir tilda o'zicha, chunki yuqori zanjirning *shakli* har xil:

| Til | Bosh qatlamlar |
|-----|----------------|
| **C#** (4) | manba kod → Roslyn va AST → IL va metadata → CLR, JIT, GC |
| **Python** (3) | manba kod → AST va bayt-kod → **interpretator halqasi** |
| **Rust** (3) | manba kod va makroslar → **MIR va borrow checker** → LLVM va AOT |
| **Go** (3) | manba kod → SSA va statik binar → **scheduler va GC** |
| **JavaScript** (3) | manba kod → Ignition, shakllar, IC → **TurboFan va deopt** |
| **Tarix** (11) | al-Xorazmiydan bugungacha — umurtqaga ulanmaydi |

Eng qiziq farqlar aynan shu boshlarda: Python ning bayt-kodi hech qachon mashina
kodiga aylanmaydi (u CPython ni *boshqaradi*), Rust ning borrow checker qatlami
esa bitta ham mashina komandasi chiqarmaydi va izsiz yo'qoladi.

Qatlam raqamlari hisoblab chiqariladi, shuning uchun boshlarning uzunligi har xil
bo'lishi mumkin.

## Tarix yo'nalishi

Oltinchi tugma — **Tarix** — pastga emas, **vaqt bo'ylab** boradi va umurtqaga
ulanmaydi (`standalone: true`). 11 qatlam:

| # | Davr | Nima |
|---|------|------|
| 01 | ~820 | Al-Xorazmiy: algoritm va algebra so'zlarining kelib chiqishi |
| 02 | 1804 | Jakkar dastgohi: perfokarta, apparat va dasturning ajralishi |
| 03 | 1843 | Ada Lavleys, Note G — nashr etilgan birinchi algoritm |
| 04 | 1936 | Turing mashinasi va lambda hisobi; to'xtash muammosi |
| 05 | 1945–48 | ENIAC ni kabel bilan dasturlash → saqlangan dastur g'oyasi |
| 06 | 1945–57 | "Birinchi til qaysi?" — to'rt xil javob, to'rt xil mezon |
| 07 | 1957–64 | FORTRAN · LISP · COBOL · ALGOL |
| 08 | 1970-lar | C va Unix; Smalltalk, Pascal, Prolog |
| 09 | 1983–99 | C++ · Python · Java · JavaScript; bayt-kod va VM |
| 10 | 2000– | C# · Go · Rust · TypeScript: parallellik va xotira xavfsizligi |
| 11 | — | Teskari yo'l: tarix bu sayohatning aynan teskarisi |

Oxirgi qatlam ikkisini bog'laydi: har bir tarixiy qadam odamning qo'lidan bitta
ishni olgan, sayohat esa o'sha bosqichlarni teskari tartibda ochib boradi.

### Aniqlik haqida — tarixiy qism

Bahsli joylar bo'yalmagan, aytib o'tilgan:

- **Al-Xorazmiy** algoritm tushunchasini ixtiro qilmagan — Yevklidda ham
  tartiblangan usullar bor edi. Undan qolgani: usulni umumlashtirish uslubi
  va ikkita so'z (algebra, algoritm).
- **"Birinchi dasturchi kim"** degan bahs tarixchilar orasida hali ham bor:
  Bebbij ham dastur eskizlarini yozgan. Lavleysning asl hissasi boshqa
  joyda — mashina simvol bilan ishlay olishini ko'ra olganida.
- **"Birinchi til"** savolining bitta javobi yo'q: Plankalkül (loyihada, 1945),
  Short Code (ishlaganida, 1949), Autocode (kompilyatorda, 1952),
  FORTRAN (amalda, 1957).

## Ishga tushirish

ES modullar `file://` orqali ishlamaydi — oddiy statik server kerak:

```bash
npx http-server -p 8080 .
# yoki
python3 -m http.server 8080
```

Keyin `http://localhost:8080` ni oching. Til `#python` kabi hash orqali ham
tanlanadi.

**Boshqaruv:** scroll · `↑` `↓` `PageUp` `PageDown` `Home` `End` · o'ngdagi
paneldan qatlam, chapdagi tugmalardan til tanlash · telefonda surish (swipe).

## GitHub Pages

Repozitoriyada deploy workflow bor (`.github/workflows/pages.yml`), lekin
Pages ni birinchi marta **qo'lda yoqish kerak**: `GITHUB_TOKEN` ga sayt
yaratish huquqi berilmagan.

**Settings → Pages → Source: `GitHub Actions`** — tamom. Shundan keyin
`main` ga har push avtomatik deploy qiladi.

Muqobil yo'l: **Source: `Deploy from a branch` → `main` / `/ (root)`**.
Bunda workflow umuman kerak emas (o'chirib tashlash mumkin), chunki sayt
statik va qurish bosqichi yo'q.

## Bitta faylga jamlash

three.js va butun kod bitta o'zi yetarli HTML faylga jamlanadi (tashqi
so'rovlarsiz — CSP cheklovli muhitlarda ham ishlaydi):

```bash
node tools/build-artifact.mjs            # → dist/how-it-works.html
node tools/build-artifact.mjs --full     # → dist/how-it-works.standalone.html
node tools/build-artifact.mjs out.html   # boshqa nomga
```

Ikkita rejim bor:

- **odatdagi** — fragment (`<title>`, `<style>`, kontent, `<script>`); uni o'z
  qobig'iga o'raydigan muhitlar uchun;
- **`--full`** — to'liq HTML hujjat. Bu faylni shunchaki brauzerda ochsangiz
  bo'ldi: server ham, internet ham, `npm install` ham kerak emas.

Skript modullarni bog'liqlik tartibida ulaydi va hammasini bitta blokka
o'raydi — minifikatsiya qilingan three.js dagi bir harfli global nomlar bilan
to'qnashmasligi uchun. Shu sabab modullar **nomlangan** import/export ishlatadi:
`import * as ns` va `export default` bir faylga jamlanmaydi.

## Fayllar

```
index.html            sahna, UI qatlamlari, importmap
styles.css            interfeys (panel, navigatsiya, til tanlagich)
src/
  main.js             kamera sayohati, til almashtirish, moslashuvchan joylashuv
  languages.js        tillar reyestri: bosh + umurtqa yig'iladi
  lib/gfx.js          matn teksturalari, chiziqlar, zarrachalar, yordamchilar
  content/
    spine.js          umumiy 12 qatlamning matni va kadr sozlamalari
    heads/*.js        har bir til uchun matn (csharp, python, rust, go, javascript)
  levels/
    heads/common.js   kod paneli, karta ustuni, oqim o'qi
    heads/*.js        tilga xos 3D sahnalar va tarix sahnalari
    spine/machine.js  mashina kodi va chaqiruvlar steki
    spine/system.js   yadro, virtual xotira, CPU, mantiq
    spine/hardware.js gate ichi, tranzistor, xotira, kremniy, kvant
    spine/output.js   ekran: rasterizatsiya → foton
vendor/               three.js (r169, modul build)
tools/                bitta faylga jamlovchi skript
```

Har bir qatlam `build(meta)` funksiyasi bo'lib, `{ group, update(t, dt) }`
qaytaradi. Umurtqadagi uchta qatlam qo'shimcha `setLang(lang)` beradi — til
almashganda faqat bir nechta yorliq matni yangilanadi, sahna qayta qurilmaydi.
`main.js` faqat joriy qatlam va uning qo'shnilarini yangilaydi.

### Joylashuv qanday hisoblanadi

Har bir qatlam o'z `view` sozlamasini olib yuradi: kamera masofasi (`z`),
vertikal markaz (`y`) va kontentning yarim kengligi (`w`). `resize()` shular
asosida ikki narsani hisoblaydi:

- **surilish** — kontent chapdagi matn paneli bilan kesishmasligi uchun;
- **masshtab** — qatlam kadr kengligiga sig'ishi uchun (tor ekranlarda kichrayadi).

Portret rejimda matn paneli yig'iladi ("Batafsil" tugmasi) va kadr yuqoriga
suriladi, shunda 3D sahnaga joy qoladi.

Sozlash paytida brauzer konsolida `__debug()` chaqirilsa, joriy til, kamera
holati va masshtab qiymatlari ko'rinadi. `__debug([[x, y, qatlam]])` esa world
nuqtasini ekran pikseliga o'giradi.

## Aniqlik haqida

Vizualizatsiya soddalashtirilgan, lekin raqamlar va mexanizmlar haqiqiy:
IL ketma-ketligi `ldc.i4.s / add / stloc.0 / ldstr / box / call`,
`mov rcx, rax` ning kodlanishi `48 89 C8`, Linux x86-64 da `write` ning syscall
raqami 1 va kirish nuqtasi `MSR_LSTAR`, CPython bayt-kodi 2 baytli (opcode +
oparg), NAND = 4 tranzistor va XOR = 4 NAND, DRAM refresh oralig'i ~64 ms,
kremniyning taqiqlangan zonasi 1.12 eV.

Konveyer 5 bosqich sifatida ko'rsatilgan — bu klassik RISC modeli; haqiqiy x86
yadrolarida 15–20 bosqich bor va bu matnda aytib o'tilgan.
