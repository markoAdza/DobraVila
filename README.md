# Dobre Vile – Hitra kuhinja (Hrastnik)

Enostranska spletna stran za hitro kuhinjo Dobre Vile, Trg Franca Kozarja 1, 1430 Hrastnik. Na njej so celoten meni (49 jedi v 8 kategorijah), pijače, delovni čas z živim prikazom, ali je lokal odprt, in kontakt za naročila.

Zgrajeno z [Astro](https://astro.build) kot statična stran, brez strežniške logike. Oblikovna pravila so v [DESIGN.md](DESIGN.md).

## Zagon

Potrebuješ Node.js 22.12 ali novejši.

```bash
npm install
npm run dev       # razvojni strežnik na http://localhost:4321
npm run build     # statična stran v dist/
npm run preview   # predogled builda
npm run check     # preverjanje tipov
```

Mapo `dist/` lahko naložiš na katerikoli statični hosting (Netlify, Vercel, Cloudflare Pages, GitHub Pages ali navaden spletni strežnik).

## Urejanje vsebine

Vsi podatki so v mapi `src/data/`:

| Datoteka | Vsebina |
|---|---|
| `site.ts` | ime, naslov, telefon, Facebook, delovni čas, ocena |
| `menu.ts` | kategorije in jedi: ime, sestavine, cena, fotografija, oznake (`veg`, `spicy`) |
| `drinks.ts` | pijače z velikostmi in cenami |
| `photos.json` | vir, avtor in licenca vsake fotografije |

Cene so zapisane kot števila (`6.1`), na strani se prikažejo kot `6,10 €`.

## Fotografije

Fotografije jedi so simbolične. Vse so z [Wikimedia Commons](https://commons.wikimedia.org) in objavljene pod prostimi licencami (CC0, javna domena, CC BY, CC BY-SA). Avtorji in licence so samodejno navedeni na strani `/fotografije`.

Ko lastnik pripravi prave fotografije, jih zamenjaš tako:

1. Sliko shrani v `src/assets/food/<ključ>.jpg` (na primer `kebab-hero.jpg`).
2. Vnos za ta ključ odstrani iz `src/data/photos.json`, da se na strani `/fotografije` ne izpisuje več.

Za ponovni prenos in optimizacijo slik s Commons zaženi `npm run assets`. Skripta ustvari tudi favicon in `og-image.jpg`.

## Struktura

```
src/
  components/   Nav, Hero, Highlights, Menu, MenuCard, Drinks, Visit, Footer, OpenStatus, Icon
  data/         vsebina (glej zgoraj)
  layouts/      BaseLayout (meta oznake, JSON-LD Restaurant)
  pages/        index, fotografije, 404
  scripts/ui.ts mobilni meni, status odprtosti, aktivna kategorija
  styles/       tokens.css (barve, razmiki), base.css, components.css
```

Status odprtosti lahko preizkusiš za poljuben čas, na primer `/?now=2026-11-15T12:00`.

Vir menija: [jedelbom.com](https://jedelbom.com/menu-dobre-vile-hitra-kuhinja), preverjeno 11. 11. 2026.
