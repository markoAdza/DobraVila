# DESIGN.md: Dobre Vile · Hitra kuhinja (Hrastnik)

> **Sveža ulična kuhinja.** Hrana je glavna, vse ostalo ji samo naredi prostor. Stran mora odgovoriti na tri vprašanja v petih sekundah: *kaj imate, koliko stane, kako naročim.*

---

## 1. Visual Theme & Atmosphere

**Slog**: Fairy Night Street Food. Navigacija in hero sta temna skrilasta, v barvi podlage logotipa, z vilinskimi iskricami. Pod njima je svetla, pregledna vsebina menija.
**Ključne besede**: čarobno, sveže, živahno, pregledno, krepko, lokalno
**Ton**: neposreden, prijazen, lokalen (Hrastnik, Glažar, krumpantoč); NE korporativen, NE kičast.
**Občutek**: logotip zaživi, ker vila lebdi in s palico posipa iskrice. Jedi se peljejo mimo kot na tekočem traku, vsebina pa ostane čista in hitro berljiva.

**Logotip**: `src/assets/brand/` (vir `logo-source.png`, deli nastanejo z `npm run logo`). Uporablja se **brez** napisa "hitra kuhinja". Vila je ločena slika (`logo-fairy.png`), da lahko lebdi. Geometrija sestave je v `src/data/logo.json`.

**Interakcijski nivo**: **L2 · Lively**. To pomeni iskrice (canvas) v heroju, lebdečo vilo, tekoči trak jedi, mehko pojavljanje sekcij ob drsenju in vrteč se barvni okvir hero fotografije. Brez paralakse, brez scroll-jackinga, brez knjižnic za animacije.
**Odvisnosti**: Astro 7 · Fontsource (self-hosted pisave) · sharp (optimizacija slik). Nič drugega.

**Princip pozornosti**:
1. **Hero (temen)**: logotip z vilo, ki prileti in lebdi, ter iskrice, ki sledijo miški. Pod njim krepek naslov, živa značka odprtosti in magenta CTA.
2. **Tekoči trak jedi**: neskončen trak s fotografijo, imenom in ceno. Ob hoverju ali fokusu se ustavi, klik skoči na kategorijo.
3. **Meni**: lepljivi čipi kategorij in kartice s slikami, ki se mehko pojavijo.
**Majhen detajl**: značka *Odprto · do 21:00* / *Zaprto · odpremo jutri ob 11:00* se računa v živo po slovenskem času. Lokalni izraz *krumpantoč* ima razlago ob prehodu z miško ali fokusu.

## 2. Color Palette & Roles

Barve izhajajo iz logotipa. Vse vrednosti so samo v `src/styles/tokens.css`.

| Vloga | Žeton | Vrednost | Opomba |
|---|---|---|---|
| Nočna podlaga (nav, hero, trak, noga) | `--night` / `--night-2` / `--night-3` | #24383F / #1A2A30 / #2E464E | ozadje logotipa |
| Besedilo na noči | `--on-night` / `--on-night-muted` | #FFF / #B8C7CC | 12:1 / 7:1 |
| Svetla podlaga vsebine | `--bg` / `--surface` / `--surface-alt` | #F6F8F9 / #FFF / #EDF2F4 | |
| Naslovi / telo / opisi | `--ink` / `--ink-soft` / `--ink-muted` | #1D2C32 / #3D4B52 / #5B6A71 | ≥ 4.9:1 |
| **Poudarek (magenta "vile")**: gumbi, cene, aktivni čip, povezave | `--accent` / `--accent-hover` | #C8146F / #A10F59 | 5.5:1 na beli |
| Magenta logotipa (samo dekor) | `--magenta`, `--magenta-light` | #E0177F, #FF5CA8 | |
| **Sekundarna (cian "dobre")**: podčrtaji, iskrice, hover na noči | `--cyan`, `--cyan-light`, `--cyan-ink` | #1BA1DF, #5CC6F2 (tekst na noči), #0A6E9E (tekst na svetlem) | |
| Gorčica (samo zvezdica ocene in "pekoče") | `--mustard` | #F2B705 | |
| Stanja | `--ok`, `--closed`, `--veg` (+ `-soft`) | nespremenjeno | |

Interaktivni elementi imajo eno poudarno barvo (magenta). Cian je dekor ter hover in fokus na temni podlagi.
Dark mode: **ni predviden**, ker je hibrid namerno tak: temna glava, svetla vsebina. `color-scheme: light`.

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

**Okras besedila**: H1 ima **en** poudarjen del ("100 % slovenske") s podčrtajem, ki prehaja iz cian v magento (`background` linear-gradient na dnu). Brez gradientnega besedila, brez senc na besedilu.

**Prepovedano**: serifne pisave, script/handwritten pisave (script je samo v sliki logotipa), Comic, več kot 2 družini, ALL CAPS za imena jedi v telesu (vir ima vse z velikimi, na strani jih pišemo v Title/Sentence case razen kratic).

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
.nav { position: sticky; top: 0; z-index: 50; height: 68px;
       background: rgba(var(--night-rgb), .92); backdrop-filter: blur(10px);
       border-bottom: 1px solid var(--night-line); }
.brand__logo { height: 46px; } /* logo-wordmark.png, ob hoverju rahlo zasuk */
.nav__link { color: var(--on-night-muted); padding: .75rem .25rem; min-height: 44px; }
.nav__link:hover { color: var(--on-night); box-shadow: inset 0 -2px 0 var(--cyan); }
.nav__link:focus-visible { outline: 3px solid var(--cyan-light); outline-offset: 2px; border-radius: 6px; }
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

**Nivo: L2 · Lively.** Vse animacije so CSS ali en majhen canvas in spreminjajo samo `transform`, `opacity` ali `translate`.

| Element | Kje | Kako |
|---|---|---|
| Iskrice | `src/scripts/sparkles.ts`, `<canvas data-sparkles>` v heroju | Zvezdice in pikice (bela, cian, magenta) lebdijo navzgor in utripajo. `pointermove` pušča sled vilinskega prahu, klik ali tap naredi izbruh, konica palice (`[data-wand-tip]`) posipa iskrice. DPR ≤ 2, gostota sledi površini. Ustavi se, ko hero ni viden ali je zavihek skrit. |
| Vila | `Hero.astro` `.lockup__fairy` | ob nalaganju `fly-in` (1.6 s), nato `float` (5.5 s) v neskončnost |
| Okvir fotografije | `.hero__frame` | conic-gradient iz cian v magento, ki se vrti (`@property --angle`, 8 s) |
| Cenovna značka | `.hero__price` | rahlo pozibavanje (`bob`, 4 s) |
| Tekoči trak jedi | `DishMarquee.astro` | podvojen seznam, `translateX(-50%)` 55 s linearno; ob `:hover` ali `:focus-within` se ustavi; kopija je `aria-hidden`, njene povezave imajo `tabindex=-1` |
| Pojavljanje ob drsenju | `[data-reveal]` + `initReveal()` v `ui.ts` | `opacity` + `translate` 0.7 s, stopnjevanje prek `--i`; element je skrit samo, ko ima `<html>` razred `js` |
| Vstop heroja | `[data-rise]` | `rise` 0.7 s s stopnjevanjem |
| Status | `.status__dot` | `pulse` 2 s |

Atributa `data-reveal` ne dajaj elementom, ki imajo lasten `transform` hover efekt (npr. `.dish`). Daj ga ovoju (mreži).

### Hover & Focus States
- Gumbi: barva + dvig 1px (0.2s). Primarni CTA v heroju ima magenta sij (`--shadow-glow`).
- Kartice jedi: dvig 2px + `--shadow-md` + zoom slike 1.05 (0.5s).
- Navigacija (temna): cian spodnji poudarek.
- Fokus: povsod `outline: 3px` z odmikom, na svetlem v `--accent`, na temnem v `--cyan-light`. Nikoli `outline: none` brez nadomestka.

### Reduced Motion
Globalno pravilo v `base.css` skrajša vse CSS animacije. `sparkles.ts` se ne zažene, trak postane navaden vodoravno drsen seznam (brez kopije), `[data-reveal]` pa je takoj viden.

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
1. Temna podlaga je samo `--night` (nav, hero, trak, noga). Vsebina menija ostane svetla. Brez neonskih ozadij, gradientnih naslovov ali steklenih kartic.
2. Ne dodajaj scroll-jackinga, paralakse ali GSAP/Lenis. Animacije ob drsenju samo prek `[data-reveal]`.
3. Ne uporabljaj emojijev kot ikon; ikone so inline SVG (lucide slog, 1.75px črta).
4. Ne uporabljaj sivih blokov kot nadomestnih slik.
5. Ne skrivaj cen za "Več"/accordion; vse cene so vidne brez klika.
6. Ne nalagaj Google Maps iframe (zasebnost, hitrost); samo povezava "Navodila za pot".
7. Ne izmišljuj podatkov (e-pošta, minimalno naročilo, cena dostave), ki jih vir nima.
8. Ne uporabljaj več kot ene poudarne barve za interaktivne elemente (magenta). Cian je dekor.
9. Logotipa ne prerisuj s pisavo; uporabljaj slike iz `src/assets/brand/`.

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
