import type { PhotoKey } from './images';

/**
 * MENU: edit this file to update the website menu.
 * Source: the restaurant's menu on jedelbom.com (checked 11. 11. 2026).
 * Prices are numbers in EUR (shown as "6,10 €").
 * `img` is a key from src/data/photos.json (photos are illustrative).
 */
export type Tag = 'veg' | 'spicy';

export interface MenuItem {
  name: string;
  /** ingredients, lower-case as on the printed menu */
  desc?: string;
  price: number;
  /** e.g. "na kg" */
  unit?: string;
  img: PhotoKey;
  tags?: Tag[];
}

export interface MenuCategory {
  id: string;
  title: string;
  /** one-line intro under the heading */
  intro?: string;
  items: MenuItem[];
}

export const menu: MenuCategory[] = [
  {
    id: 'kebab',
    title: 'Kebab',
    intro: 'Iz 100 % slovenske govedine. Vsak z dvema jogurtovima dressingoma.',
    items: [
      { name: 'Mini kebab', desc: 'trikotna lepinja, cca. 80 g govedina, sveža zelenjava, 2× jogurtov dressing', price: 3.9, img: 'kebab-classic' },
      { name: 'Classic kebab', desc: 'trikotna lepinja, cca. 110 g govedina, sveža zelenjava, 2× jogurtov dressing', price: 4.5, img: 'kebab-classic' },
      { name: 'Hrastniški kebab', desc: 'sezamova lepinja, cca. 140 g govedina, sveža zelenjava, 2× jogurtov dressing', price: 5.0, img: 'kebab-sesame' },
      { name: 'Maxi kebab', desc: 'sezamova lepinja, cca. 140 g govedina, ocvrti sir, sveža zelenjava, 2× jogurtov dressing', price: 6.2, img: 'kebab-maxi' },
      { name: 'Glažar kebab', desc: 'sezamova lepinja, cca. 140 g govedina, krumpantoč, sveža zelenjava, 2× jogurtov dressing', price: 6.3, img: 'kebab-hero' },
      { name: 'Special kebab', desc: 'sezamova lepinja, cca. 140 g govedina, riban sir, sveža zelenjava, 2× jogurtov dressing', price: 5.4, img: 'kebab-special' },
      { name: 'Jufka kebab', desc: 'popečena tortilja, cca. 140 g govedina, sveža zelenjava, 2× jogurtov dressing', price: 5.0, img: 'durum-beef' },
      { name: 'Queen jufka', desc: 'popečena tortilja, cca. 140 g piščančje meso, sveža zelenjava, 2× jogurtov dressing', price: 5.3, img: 'durum-chicken' },
      { name: 'Chicken strips wrap', desc: 'popečena tortilja, piščančji trakci z žara, sveža zelenjava, 2× jogurtov dressing', price: 5.5, img: 'durum-strips' },
      { name: 'Crispy wrap', desc: 'popečena tortilja, chicken crispy nuggets, sveža zelenjava, 2× jogurtov dressing', price: 5.0, img: 'durum-crispy' },
      { name: 'Jufka Exxtra', desc: 'popečena tortilja, cca. 140 g govedina, riban sir, pomfri, sveža zelenjava, 2× jogurtov dressing', price: 6.2, img: 'durum-fries' },
    ],
  },
  {
    id: 'burgerji',
    title: 'Burgerji',
    intro: 'V hišni bombetki, s 160 g 100 % pašne govedine.',
    items: [
      { name: 'Classic', desc: 'hišna bombetka, cca. 160 g 100 % pašna govedina, cheddar sir, ledenka, paradižnik, domača hišna omaka', price: 6.1, img: 'burger-classic' },
      { name: 'Siciljana', desc: 'hišna bombetka, cca. 160 g 100 % pašna govedina, mozzarella, paradižnik, rukola, smetanova omaka', price: 6.5, img: 'burger-mozzarella' },
      { name: 'Golden Crispy Steak', desc: 'hišna bombetka, piščančji file mariniran po hišnem receptu, omaka iz zelja in kumaric', price: 6.7, img: 'burger-chicken-crispy' },
      { name: 'Vila', desc: 'hišna bombetka, cca. 160 g 100 % pašna govedina, jajce, cheddar sir, paradižnik, solata, domača hišna omaka', price: 6.7, img: 'burger-egg' },
      { name: 'Glažar', desc: 'hišna bombetka, cca. 160 g 100 % pašna govedina, krumpantoč, pražena čebula, domača hišna omaka', price: 6.7, img: 'burger-glazar' },
      { name: 'Long Beef Strips Sandwich', desc: 'podolgovata štručka, ramstek trakci, cheddar sir, pražena čebula, nacho sir, popečeni jalapenosi', price: 7.9, img: 'sandwich-long', tags: ['spicy'] },
      { name: 'Extra Long Beef Strips Sandwich', desc: 'podolgovata štručka, ramstek trakci, cheddar sir, pražena čebula, nacho sir, popečeni jalapenosi', price: 8.7, img: 'sandwich-extra-long', tags: ['spicy'] },
    ],
  },
  {
    id: 'pleskavice',
    title: 'Pleskavice',
    intro: 'Z žara, v sezamovi ali domači lepinji.',
    items: [
      { name: 'Natural Chicken Steak', desc: 'sezamova lepinja, piščančji zrezek, cheddar sir, sveža zelenjava', price: 5.4, img: 'burger-schnitzel' },
      { name: 'Hamburger', desc: 'sezamova lepinja, cca. 140 g pleskavica, sveža zelenjava, majoneza, kečap', price: 5.3, img: 'burger-onion' },
      { name: 'Cheese burger', desc: 'sezamova lepinja, cca. 140 g pleskavica, sir gauda, sveža zelenjava, majoneza, kečap', price: 5.3, img: 'burger-cheese' },
      { name: 'Hambi na kvadrat', desc: 'sezamova lepinja, 2× 140 g pleskavica, sveža zelenjava, majoneza, kečap', price: 6.8, img: 'burger-double' },
      { name: 'Mehiški hambi', desc: 'sezamova lepinja, cca. 140 g pleskavica, nacho sir, sveža zelenjava, jalapenosi, čili pipp omaka, majoneza, kečap', price: 5.8, img: 'burger-spicy', tags: ['spicy'] },
      { name: 'Grill hambi', desc: 'sezamova lepinja, cca. 140 g pleskavica, grill omaka, sveža zelenjava, majoneza, salsa omaka', price: 3.5, img: 'burger-onion' },
      { name: 'Reggie na žaru', desc: 'sezamova lepinja, piščančja pleskavica, topljeni sir, sveža zelenjava, majoneza, kečap', price: 3.5, img: 'burger-chicken-long' },
      { name: 'Jake na žaru', desc: 'sezamova lepinja, 2× piščančja pleskavica, topljeni sir, sveža zelenjava, majoneza, kečap', price: 4.5, img: 'burger-schnitzel' },
      { name: 'Pleskavica v domači lepinji', desc: 'cca. 180 g pleskavica, pravi domači ajvar, čebula, suha pekoča paprika', price: 6.2, img: 'pleskavica', tags: ['spicy'] },
    ],
  },
  {
    id: 'hot-dogi',
    title: 'Hot dogi',
    items: [
      { name: 'Vila dog', desc: 'hišna štručka, piščančja hrenovka, majoneza, kečap, zenf', price: 3.4, img: 'hotdog' },
      { name: 'American dog', desc: 'ameriška štručka, piščančja hrenovka, pražena čebula, nacho sir, kumarični namaz', price: 3.3, img: 'hotdog-american' },
      { name: 'Slovenski hodok', desc: 'hišna štručka, 100 % goveja klobasa, kislo zelje, zenf', price: 5.0, img: 'hotdog-sausage' },
      { name: 'Corn dog', desc: '2× dressing po izbiri', price: 3.0, img: 'corndog' },
    ],
  },
  {
    id: 'brezmesno',
    title: 'Brez mesa',
    intro: 'Vegetarijanske jedi.',
    items: [
      { name: 'Vegetarija', desc: 'trikotna lepinja, fitaki sir, sveža zelenjava, 2× jogurtov dressing', price: 4.4, img: 'pita-veg', tags: ['veg'] },
      { name: 'Jufka vegetarija', desc: 'popečena tortilja, fitaki sir, sveža zelenjava, 2× jogurtov dressing', price: 5.0, img: 'durum-veg', tags: ['veg'] },
      { name: 'Vegi burger', desc: 'krompirjeva bombetka, krompirjev zelenjavni polpet, cheddar sir, ledenka, sladko kisle kumare, paradižnik, smetanova omaka', price: 5.4, img: 'burger-veggie', tags: ['veg'] },
      { name: 'Mozzarella', desc: 'sezamova lepinja, ocvrta mozzarella, pomfri, rukola, paradižnik, olive, smetanova omaka', price: 5.8, img: 'burger-fried-cheese', tags: ['veg'] },
    ],
  },
  {
    id: 'burek',
    title: 'Burek',
    intro: 'Hišni burek, tudi cel hleb za domov.',
    items: [
      { name: 'Burek', desc: 'cel hleb + embalaža', price: 12.0, img: 'burek' },
      { name: 'Žepek', price: 3.0, img: 'zepek' },
    ],
  },
  {
    id: 'priloge-solate',
    title: 'Priloge in solate',
    items: [
      { name: 'Pomfri', price: 2.5, img: 'fries', tags: ['veg'] },
      { name: 'Maxi pomfri', desc: 'pomfri, riban sir, kebab meso, dressing', price: 5.0, img: 'fries-loaded' },
      { name: 'Ocvrti sir', desc: 'pomfri, 2 ocvrta sira, tatarska omaka', price: 6.2, img: 'fried-cheese', tags: ['veg'] },
      { name: 'Chicken crispy nuggets, mali', price: 2.7, img: 'nuggets' },
      { name: 'Chicken crispy nuggets, veliki', price: 4.8, img: 'nuggets' },
      { name: 'Solata Exxtra', desc: 'mešana solata, riban sir, kebab meso, dressing', price: 4.9, img: 'salad-feta' },
      { name: 'Solata Mediterana', desc: 'paradižnik, kumare, olive, feta sir, rdeča čebula', price: 5.5, img: 'salad-greek', tags: ['veg'] },
      { name: 'Cezar solata', desc: 'češnjev paradižnik, kumare, piščančje meso, ledenka, preliv cezar', price: 5.5, img: 'salad-caesar' },
      { name: 'Mešana solata', desc: 'sveža zelenjava po izboru solatnega bara, jogurtov dressing', price: 3.6, img: 'salad-mixed', tags: ['veg'] },
      { name: 'Kebab meso, 100 % slovenska govedina', price: 22.0, unit: 'na kg', img: 'kebab-spit' },
    ],
  },
  {
    id: 'sladice',
    title: 'Sladice',
    items: [
      { name: 'Vaflji Bubbles', desc: 's čokolado', price: 3.0, img: 'waffle', tags: ['veg'] },
      { name: 'Churros', desc: 'nutella + sladkor v prahu, 100 g', price: 2.5, img: 'churros', tags: ['veg'] },
    ],
  },
];

/** Local words explained in a small tooltip wherever they appear in a description. */
export const glossary: Record<string, string> = {
  krumpantoč: 'Zasavska domača jed: pretlačen krompir s prepraženo čebulo.',
};

export const menuItemCount = menu.reduce((n, c) => n + c.items.length, 0);
