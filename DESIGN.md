# DESIGN.md — Dobre Vile · Hitra kuhinja (Hrastnik)

> **Sveža ulična kuhinja.** Hrana je glavna, vse ostalo ji samo naredi prostor. Stran mora odgovoriti na tri vprašanja v petih sekundah: *kaj imate, koliko stane, kako naročim.*

---

## 1. Visual Theme & Atmosphere

**Slog**: Warm Clean Street Food (svetla krem podlaga + en sam topel poudarek)
**Ključne besede**: sveže, toplo, pregledno, krepko, domače, hitro
**Ton**: neposreden, prijazen, lokalen (Hrastnik, Glažar, krumpantoč); NE korporativen, NE "premium črno-zlat", NE kičast
**Občutek**: čist, natisnjen meni na kremnem papirju, kjer cene izstopajo v paprika rdeči.

**Interakcijski nivo**: **L1 · Refined Static**: mehak vstop hero vsebine, hover dvig kartic in rahel zoom slik, barvni prehodi gumbov. Brez scroll animacij, brez paralakse, brez knjižnic za animacije.
**Odvisnosti**: Astro 7 · Fontsource (self-hosted pisave) · sharp (optimizacija slik). Nič drugega.

**Princip pozornosti (namerno zmanjšan)**: uporabnik je zahteval *zelo preprosto*, zato stran nima 3 velikih "wow" efektov. Namesto tega:
1. **Hero**: velik krepek naslov + velika fotografija kebaba + živa značka odprtosti.
2. **Prvi scroll**: trak s 4 prednostmi (dostava, prevzem, kartica, Google ocena), takoj uporaben.
3. **Meni**: lepljivi čipi kategorij + kartice s slikami; jasnost pred efekti.
**Majhen detajl**: značka *Odprto · do 21:00* / *Zaprto · odpremo jutri ob 11:00* se računa v živo po slovenskem času, današnji dan v urniku je poudarjen; lokalni izraz *krumpantoč* ima majhno razlago ob prehodu z miško / fokusu.

## 2. Color Palette & Roles

```css
:root {
  /* Podlage */
  --bg: #FAF6EF;            /* krem: podlaga strani */
  --surface: #FFFFFF;       /* kartice, navigacija */
  --surface-alt: #F3ECE0;   /* izmenične sekcije (pijače, trak prednosti) */
  --surface-hover: #FFF9F1; /* kartica ob hoverju */

  /* Linije */
  --line: #E6DCCD;          /* tanke ločnice */
  --line-strong: #CDBFA9;   /* obrobe čipov, sekundarni gumb */

  /* Besedilo */
  --ink: #1B1712;           /* naslovi, cene na temni */
  --ink-soft: #4A4239;      /* telo besedila */
  --ink-muted: #675E53;     /* opisi sestavin, meta (5.4:1 na --surface-alt) */
  --on-accent: #FFFFFF;     /* besedilo na paprika rdeči */

  /* Poudarek: paprika */
  --accent: #C0321A;        /* gumbi, cene, aktivni čip, povezave (4.8:1 na --surface-alt) */
  --accent-hover: #9C2812;  /* hover/active */
  --accent-soft: #FBE4DC;   /* ozadje značk, focus halo */

  /* Dekorativno: gorčica */
  --mustard: #F2B705;       /* podčrtaji, zvezdica ocene (samo dekor, ne besedilo) */
  --mustard-soft: #FDF1C7;  /* ozadje značke "pekoče" */

  /* Stanje */
  --ok: #286C40;            /* "Odprto" (5.4:1 na --ok-soft) */
  --ok-soft: #E2F1E6;
  --closed: #8A4B12;        /* "Zaprto" */
  --closed-soft: #F7E6D4;
  --veg: #356B28;           /* značka "brez mesa" */
  --veg-soft: #E5F0DF;

  /* RGB pomočniki za rgba() */
  --ink-rgb: 27, 23, 18;
  --accent-rgb: 192, 50, 26;
  --bg-rgb: 250, 246, 239;
  --mustard-rgb: 242, 183, 5;
}
```

| Vloga | Žeton | Kontrast |
|---|---|---|
| Naslovi | `--ink` na `--bg` | 17:1 |
| Telo | `--ink-soft` na `--bg` | 9:1 |
| Opisi | `--ink-muted` na `--surface-alt` | ≥ 4.5:1 |
| Cena / povezava | `--accent` na `--surface` | ≥ 5:1 |
| Gumb | `--on-accent` na `--accent` | ≥ 5:1 |

Dark mode: **ni predviden** (restavracijska stran, en enoten videz). `color-scheme: light`.

## 3. Typography Rules

```css
/* Fontsource (self-hosted, latin + latin-ext za č/š/ž) */
@import '@fontsource-variable/bricolage-grotesque';
@import '@fontsource-variable/inter';

--font-display: 'Bricolage Grotesque Variable', 'Arial Narrow', system-ui, sans-serif;
--font-body: 'Inter Variable', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
```

| Nivo | Pisava | Velikost | Teža | Vrstični razmik | Spacing |
|---|---|---|---|---|---|
| H1 (hero) | display | `clamp(2.6rem, 6.4vw, 4.75rem)` | 800 | 1.0 | -0.025em |
| H2 (sekcija/kategorija) | display | `clamp(1.75rem, 3.4vw, 2.5rem)` | 750 | 1.08 | -0.02em |
| H3 (ime jedi) | display | 1.125rem | 700 | 1.2 | -0.005em |
| Cena | display | 1.25rem | 800 | 1 | 0, `tabular-nums` |
| Eyebrow | body | 0.8125rem | 600 | 1.4 | 0.08em, uppercase |
| Telo | body | 1rem (16px) | 400 | 1.6 | 0 |
| Opis sestavin | body | 0.9375rem | 400 | 1.5 | 0 |
| Gumb / čip | body | 0.9375rem | 600 | 1 | 0 |

**Okras besedila** (text-decoration-rules): H1 ima **en** poudarjen del ("100 % slovenske") z gorčičnim podčrtajem (`background` linear-gradient na dnu, ne `text-decoration`). Brez gradientnega besedila, brez senc na besedilu.

**Prepovedano**: serifne pisave, script/handwritten pisave, Comic, več kot 2 družini, ALL CAPS za imena jedi v telesu (vir ima vse z velikimi, na strani jih pišemo v Title/Sentence case razen kratic).

## 4. Component Stylings

### Buttons
```css
.btn {
  display: inline-flex; align-items: center; gap: .5rem;
  min-height: 48px; padding: 0 1.375rem; border-radius: 999px;
  font: 600 .9375rem/1 var(--font-body); text-decoration: none;
  border: 1.5px solid transparent; cursor: pointer;
  transition: background-color .2s ease, color .2s ease, border-color .2s ease, transform .2s ease;
}
.btn--primary { background: var(--accent); color: var(--on-accent); }
.btn--primary:hover { background: var(--accent-hover); transform: translateY(-1px); }
.btn--primary:active { transform: translateY(0); background: var(--accent-hover); }
.btn--ghost { background: transparent; color: var(--ink); border-color: var(--line-strong); }
.btn--ghost:hover { border-color: var(--ink); background: var(--surface); }
.btn--ghost:active { background: var(--surface-alt); }
.btn:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
.btn[aria-disabled="true"], .btn:disabled { opacity: .45; pointer-events: none; }
```

### Cards (kartica jedi)
```css
.dish {
  display: grid; grid-template-columns: 112px 1fr; gap: 1rem; padding: .75rem;
  background: var(--surface); border: 1px solid var(--line); border-radius: 18px;
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}
.dish__img { aspect-ratio: 1; border-radius: 12px; overflow: hidden; }
.dish__img img { transition: transform .5s ease; }
.dish:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); border-color: var(--line-strong); }
.dish:hover .dish__img img { transform: scale(1.05); }
.dish:focus-within { border-color: var(--accent); }
/* Kartica ni klikabilna (meni je informativen), zato nima active/disabled stanja kot gumb;
   "ni na voljo" stanje: .dish[data-unavailable] { opacity: .5 } + značka "Trenutno ni na voljo". */
```

### Navigation
```css
.nav { position: sticky; top: 0; z-index: 50; background: var(--bg); /* polno neprozorno */
       border-bottom: 1px solid var(--line); height: 68px; }
.nav__link { color: var(--ink-soft); padding: .75rem .25rem; min-height: 44px; }
.nav__link:hover { color: var(--ink); box-shadow: inset 0 -2px 0 var(--mustard); }
.nav__link:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; border-radius: 6px; }
.nav__link[aria-current="true"] { color: var(--ink); }
/* Mobilno (< 760px): povezave v spustnem panelu, gumb "Meni" z aria-expanded. */
```

### Category chips (lepljiva vrstica kategorij)
```css
.chip { min-height: 44px; padding: 0 1rem; border-radius: 999px; border: 1.5px solid var(--line-strong);
        background: var(--surface); color: var(--ink-soft); font-weight: 600; white-space: nowrap; }
.chip:hover { border-color: var(--ink); color: var(--ink); }
.chip:active { background: var(--surface-alt); }
.chip:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
.chip[aria-current="true"] { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
```

### Links
```css
a { color: var(--accent); text-underline-offset: .2em; text-decoration-thickness: 1.5px; }
a:hover { color: var(--accent-hover); }
a:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; border-radius: 4px; }
a:active { color: var(--ink); }
```

### Tags / Badges
```css
.badge { display: inline-flex; align-items: center; gap: .3rem; padding: .2rem .55rem;
         border-radius: 999px; font: 600 .75rem/1.2 var(--font-body); }
.badge--veg   { background: var(--veg-soft); color: var(--veg); }
.badge--spicy { background: var(--mustard-soft); color: var(--closed); }
.badge--note  { background: var(--surface-alt); color: var(--ink-muted); }
.status--open   { background: var(--ok-soft); color: var(--ok); }
.status--closed { background: var(--closed-soft); color: var(--closed); }
```

### Drink row
Vrstica tabele: ime levo, velikosti in cene desno (`0,33 l · 1,50 €`). Ločnica `--line`. Hover: ozadje `--surface-hover`.

### Info card (Kontakt / Urnik)
`--surface`, radij 20px, padding 1.5rem, ikona v krogu `--accent-soft`/`--accent`. Današnji dan v urniku: krepko + leva črta `--accent`.

## 5. Layout Principles

- **Container**: `max-width: 1200px; padding-inline: clamp(16px, 4vw, 32px)`.
- **Razmiki (8px lestvica)**: `--s-1: 4px` `--s-2: 8px` `--s-3: 12px` `--s-4: 16px` `--s-5: 24px` `--s-6: 32px` `--s-7: 48px` `--s-8: 64px` `--s-9: 96px`.
- **Sekcije**: `padding-block: clamp(56px, 8vw, 96px)`.
- **Hero**: 2 stolpca (besedilo 1.05fr, slika 1fr) na ≥ 900px; spodaj ena kolona, slika pod besedilom.
- **Meni**: kartice v mreži `repeat(auto-fill, minmax(340px, 1fr))` → 3 stolpci desktop, 2 tablica, 1 mobilno.
- **Kategorija**: H2 + število jedi + mreža; razmik med kategorijami 64px.
- **Pijače**: 2 stolpca tabele na ≥ 760px.
- **Kontakt**: 3 kartice (naslov, urnik, naročila) v vrsti / ena pod drugo.
- **Radiji**: `--r-sm: 8px` `--r-md: 12px` `--r-lg: 18px` `--r-xl: 24px` `--r-pill: 999px`.

## 6. Depth & Elevation

```css
--shadow-sm: 0 1px 2px rgba(var(--ink-rgb), .06);
--shadow-md: 0 10px 24px -12px rgba(var(--ink-rgb), .22), 0 2px 6px rgba(var(--ink-rgb), .05);
--shadow-lg: 0 30px 60px -30px rgba(var(--ink-rgb), .35);
```
- Nivo 0: podlaga (`--bg`), sekcije (`--surface-alt`).
- Nivo 1: kartice (`--surface` + obroba `--line`, brez sence).
- Nivo 2: kartica ob hoverju (`--shadow-md`), lepljivi čipi pri drsenju (`--shadow-sm`).
- Nivo 3: hero slika (`--shadow-lg`), mobilni meni.
Obrobe so primarni ločevalnik; sence samo za interakcijo in hero.

## 7. Animation & Interaction

**Nivo: L1 · Refined Static**

### Dependencies
Brez. Čisti CSS + ~60 vrstic TypeScripta (mobilni meni, status odprtosti, aktivni čip).

### Base Setup
```css
html { scroll-behavior: smooth; scroll-padding-top: 140px; } /* nav + lepljivi čipi */
:root { --ease-out: cubic-bezier(.22, 1, .36, 1); }
```

### Entrance Animation (samo hero, ob nalaganju)
```css
@keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
.hero [data-rise] { animation: rise .7s var(--ease-out) both; animation-delay: calc(var(--i, 0) * 80ms); }
.hero__media { animation: rise .9s var(--ease-out) .15s both; }
```

### Scroll Behavior
Ni scroll animacij. Lepljivi čipi kategorij dobijo `--shadow-sm`, ko se prilepijo (IntersectionObserver na sentinel). Aktivni čip sledi vidni kategoriji (IntersectionObserver, `rootMargin: -45% 0 -50% 0`) in se samodejno pomakne v vidno polje vrstice.

### Hover & Focus States
- Gumbi: barva + dvig 1px (0.2s).
- Kartice jedi: dvig 2px + `--shadow-md` + zoom slike 1.05 (0.5s).
- Povezave/navigacija: gorčični spodnji poudarek.
- Fokus: povsod `outline: 3px solid var(--accent)` + offset; nikoli `outline: none` brez nadomestka.

### Special Effects
Živa značka odprtosti s pulzirajočo piko (`@keyframes pulse` 2s, samo `opacity/transform`).

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important;
                           transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
```

## 8. Do's and Don'ts

### Do
1. Vse barve iz `tokens.css` prek `var(--…)`; nobenega hex v komponentah.
2. Cena je vedno desno/spodaj, v `--accent`, `tabular-nums`, format `6,10 €` (slovenska decimalna vejica, nedeljivi presledek pred €).
3. Telefon `070 153 575` je vedno klikabilen (`tel:070153575`) in viden v navigaciji na vseh širinah.
4. Vsaka fotografija ima slovenski `alt`, `width/height` (brez CLS) in `loading="lazy"` razen hero.
5. Vsaka fotografija ima navedenega avtorja in licenco na strani `/fotografije` (pogoj CC BY / CC BY-SA).
6. Opise sestavin piši v malih črkah, kot na meniju; imena jedi v Title Case.
7. Tap tarče ≥ 44 × 44 px.
8. Opozori, da so fotografije simbolične.
9. Podatke (meni, pijače, urnik) hrani samo v `src/data/*`, da jih lastnik zlahka posodobi.

### Don't
1. Ne uporabljaj temnih/neonskih ozadij, gradientnih naslovov ali steklenih kartic (glassmorphism).
2. Ne dodajaj scroll-jackinga, paralakse, GSAP/Lenis ali animacij ob drsenju (L1!).
3. Ne uporabljaj emojijev kot ikon; ikone so inline SVG (lucide slog, 1.75px črta).
4. Ne uporabljaj sivih blokov kot nadomestnih slik.
5. Ne skrivaj cen za "Več"/accordion; vse cene so vidne brez klika.
6. Ne nalagaj Google Maps iframe (zasebnost, hitrost); samo povezava "Navodila za pot".
7. Ne izmišljuj podatkov (e-pošta, minimalno naročilo, cena dostave), ki jih vir nima.
8. Ne uporabljaj več kot ene poudarne barve za interaktivne elemente (samo paprika).

## 9. Responsive Behavior

| Prelom | Širina | Spremembe |
|---|---|---|
| Mobile | < 600px | 1 kolona; hero slika pod besedilom (razmerje 4:3); kartica jedi 92px slika; nav: logo + gumb telefona (ikona) + gumb "Meni" |
| Tablet | 600–899px | meni 2 kolone; hero še vedno 1 kolona |
| Desktop | ≥ 900px | hero 2 koloni; meni 3 kolone (auto-fill 340px); polna navigacija s povezavami |
| Wide | ≥ 1280px | vsebina omejena na 1200px |

- **Lepljivi čipi**: na vseh širinah vodoravni scroll (`overflow-x: auto`, `scroll-snap-type: x proximity`), skrit scrollbar, mehka maska na robovih.
- **Touch**: tap tarče ≥ 44px; hover efekti samo pod `@media (hover: hover)`.
- **Brez vodoravnega preliva** pri 320px.
- **Slike**: Astro `<Picture>` → AVIF/WebP, `sizes` glede na mrežo.
