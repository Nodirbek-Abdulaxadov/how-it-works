# how it works

**C# kod kompyuterda qanday ishlaydi — koddan kvant fizikasigacha.**

Interaktiv 3D vizualizatsiya. `Console.WriteLine("Salom")` chaqiruvi qanday qilib
kremniydagi elektronlar harakatiga aylanishini 12 qatlamda ko'rsatadi. Har bir
qatlamda bitta abstraksiya yechiladi — eng oxirida faqat to'lqin funksiyalari qoladi.

three.js (faqat asosiy modul, qo'shimchalarsiz), qurish bosqichisiz oddiy ES modullar.

## Qatlamlar

| # | Qatlam | Masshtab |
|---|--------|----------|
| 01 | C# manba kodi — matn va UTF-8 baytlar | ~10⁻² m |
| 02 | Roslyn: leksik tahlil va sintaksis daraxti | kompilyatsiya vaqti |
| 03 | IL (CIL), metadata va PE assembly | Program.dll |
| 04 | CLR, RyuJIT, tiered compilation, GC | ish vaqti |
| 05 | x86-64 mashina kodi: opcode, ModR/M, registrlar | RAM dagi baytlar |
| 06 | Yadro: syscall, ring 3 → ring 0, sys_write | imtiyoz chegarasi |
| 07 | Jarayon, virtual xotira, MMU va scheduler | operatsion tizim |
| 08 | CPU konveyeri, out-of-order, kesh ierarxiyasi | ~10⁻³ m |
| 09 | Mantiqiy elementlar, summator, flip-flop, soat | ~10⁻⁵ m |
| 10 | CMOS tranzistor: MOSFET va invertor | ~10⁻⁸ m |
| 11 | Kremniy kristalli, doping, PN o'tish | ~10⁻¹⁰ m |
| 12 | Zona nazariyasi, \|ψ\|² va kvant tunnellashuvi | kvant darajasi |

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
node tools/build-artifact.mjs out.html   # boshqa nomga
```

## Tuzilma

```
index.html            sahna, UI qatlamlari, importmap
styles.css            interfeys (panel, navigatsiya, kirish ekrani)
src/
  main.js             kamera sayohati, scroll boshqaruvi, moslashuvchan joylashuv
  content.js          har bir qatlam matni va rang sxemasi
  lib/gfx.js          matn teksturalari, chiziqlar, zarrachalar, yordamchilar
  levels/
    software.js       01–05: manba kod → AST → IL → JIT → mashina kodi
    system.js         06–09: yadro/syscall → virtual xotira → CPU → mantiq
    hardware.js       10–12: tranzistor → kremniy → kvant fizikasi
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
syscall raqami 1 va kirish nuqtasi `MSR_LSTAR`, kremniyning taqiqlangan
zonasi 1.12 eV. Konveyer 5 bosqich sifatida ko'rsatilgan — bu klassik RISC modeli;
haqiqiy x86 yadrolarida 15–20 bosqich bor va bu matnda aytib o'tilgan.
