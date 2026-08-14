# how it works

**C# kod kompyuterda qanday ishlaydi — koddan kvant fizikasigacha.**

Interaktiv 3D vizualizatsiya. `Console.WriteLine("Salom")` chaqiruvi qanday qilib
kremniydagi elektronlar harakatiga aylanishini 16 qatlamda ko'rsatadi. Har bir
qatlamda bitta abstraksiya yechiladi — kvant darajasigacha, so'ng natija
yorug'lik bo'lib qaytadi.

three.js (faqat asosiy modul, qo'shimchalarsiz), qurish bosqichisiz oddiy ES modullar.

## Qatlamlar

| # | Qatlam | Masshtab |
|---|--------|----------|
| 01 | C# manba kodi — matn va UTF-8 baytlar | ~10⁻² m |
| 02 | Roslyn: leksik tahlil va sintaksis daraxti | kompilyatsiya vaqti |
| 03 | IL (CIL), metadata va PE assembly | Program.dll |
| 04 | CLR, RyuJIT, tiered compilation, GC | ish vaqti |
| 05 | x86-64 mashina kodi: opcode, ModR/M, registrlar | RAM dagi baytlar |
| 06 | Chaqiruvlar steki: kadr, qaytish manzili, overflow | stek sohasi |
| 07 | Yadro: syscall, ring 3 → ring 0, sys_write | imtiyoz chegarasi |
| 08 | Jarayon, virtual xotira, MMU va scheduler | operatsion tizim |
| 09 | CPU konveyeri, out-of-order, kesh ierarxiyasi | ~10⁻³ m |
| 10 | Mantiqiy elementlar, summator, flip-flop, soat | ~10⁻⁵ m |
| 11 | Gate ichi: XOR → 4 NAND → 16 tranzistor | ~10⁻⁶ m |
| 12 | CMOS tranzistor: MOSFET va invertor | ~10⁻⁸ m |
| 13 | Xotira yacheykasi: SRAM · DRAM · NAND flash | ~10⁻⁸ m |
| 14 | Kremniy kristalli, doping, PN o'tish | ~10⁻¹⁰ m |
| 15 | Zona nazariyasi, \|ψ\|² va kvant tunnellashuvi | kvant darajasi |
| 16 | Ekran: rasterizatsiya → subpiksel → foton | yorug'lik |

Zanjir pastga tushib kvant darajasida tugamaydi: oxirgi qatlam natijani
yuqoriga qaytaradi va yana kvantga keladi — ko'zingizga yetib kelayotgan
foton o'sha zona nazariyasining o'zi.

## Ishga tushirish

ES modullar `file://` orqali ishlamaydi — oddiy statik server kerak:

```bash
npx http-server -p 8080 .
# yoki
python3 -m http.server 8080
```

Keyin `http://localhost:8080` ni oching.

**Boshqaruv:** scroll · `↑` `↓` `PageUp` `PageDown` `Home` `End` · o'ngdagi
paneldan qatlam tanlash · telefonda surish (swipe).

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
  bo'ldi: server ham, internet ham, `npm install` ham kerak emas. Elektron
  pochtaga ilova qilib yuborsa ham ishlaydi.

## Tuzilma

```
index.html            sahna, UI qatlamlari, importmap
styles.css            interfeys (panel, navigatsiya, kirish ekrani)
src/
  main.js             kamera sayohati, scroll boshqaruvi, moslashuvchan joylashuv
  content.js          har bir qatlam matni va rang sxemasi
  lib/gfx.js          matn teksturalari, chiziqlar, zarrachalar, yordamchilar
  levels/
    software.js       01–06: manba kod → AST → IL → JIT → mashina kodi → stek
    system.js         07–10: yadro/syscall → virtual xotira → CPU → mantiq
    hardware.js       11–15: gate ichi → tranzistor → xotira → kremniy → kvant
    output.js         16: rasterizatsiya → subpiksel → foton
vendor/               three.js (r169, modul build)
tools/                bitta faylga jamlovchi skript
```

Har bir qatlam `build(meta)` funksiyasi bo'lib, `{ group, update(t, dt) }`
qaytaradi. `main.js` faqat joriy qatlam va uning qo'shnilarini yangilaydi.

### Joylashuv qanday hisoblanadi

`src/main.js` dagi `VIEW` massivida har bir qatlam uchun kamera masofasi (`z`),
vertikal markaz (`y`) va kontentning yarim kengligi (`w`) turadi. `resize()`
shular asosida ikki narsani hisoblaydi:

- **surilish** — kontent chapdagi matn paneli bilan kesishmasligi uchun;
- **masshtab** — qatlam kadr kengligiga sig'ishi uchun (tor ekranlarda kichrayadi).

Portret rejimda matn paneli yig'iladi ("Batafsil" tugmasi) va kadr yuqoriga
suriladi, shunda 3D sahnaga joy qoladi.

Sozlash paytida brauzer konsolida `__debug()` chaqirilsa, joriy kamera holati,
masshtab va surilish qiymatlari ko'rinadi. `__debug([[x, y, qatlam]])` esa
world nuqtasini ekran pikseliga o'giradi.

## Aniqlik haqida

Vizualizatsiya soddalashtirilgan, lekin raqamlar va mexanizmlar haqiqiy:
IL komandalar ketma-ketligi `ldc.i4.s / add / stloc.0 / ldstr / box / call`,
`mov rcx, rax` ning kodlanishi `48 89 C8`, Linux x86-64 da `write` ning
syscall raqami 1 va kirish nuqtasi `MSR_LSTAR`, NAND = 4 tranzistor va
XOR = 4 NAND, DRAM refresh oralig'i ~64 ms, kremniyning taqiqlangan
zonasi 1.12 eV. Konveyer 5 bosqich sifatida ko'rsatilgan — bu klassik RISC modeli;
haqiqiy x86 yadrolarida 15–20 bosqich bor va bu matnda aytib o'tilgan.
