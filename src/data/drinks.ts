/**
 * DRINKS: non-alcoholic drinks price list (source: jedelbom.com, checked 11. 11. 2026).
 * Each drink lists its sizes; a drink with one size has one entry.
 */
export interface Drink {
  name: string;
  sizes: { size?: string; price: number }[];
}

export const drinks: Drink[] = [
  { name: 'Coca-Cola', sizes: [{ size: '0,33 l', price: 1.5 }, { size: '0,5 l', price: 2.0 }] },
  { name: 'Sprite', sizes: [{ size: '0,33 l', price: 1.5 }, { size: '0,5 l', price: 2.0 }] },
  { name: 'Fanta', sizes: [{ size: '0,33 l', price: 1.5 }, { size: '0,5 l', price: 2.0 }] },
  { name: 'Schweppes', sizes: [{ size: '0,33 l', price: 1.5 }, { size: '0,5 l', price: 2.0 }] },
  { name: 'Cockta', sizes: [{ size: '0,5 l', price: 2.0 }] },
  { name: 'Ora', sizes: [{ size: '0,33 l', price: 1.5 }] },
  { name: 'Fuze Tea', sizes: [{ size: '0,5 l', price: 2.0 }] },
  { name: 'Multi Sola', sizes: [{ size: '0,5 l', price: 2.0 }] },
  { name: 'Fructal sok', sizes: [{ size: '0,2 l', price: 1.6 }] },
  { name: 'Voda', sizes: [{ size: '0,5 l', price: 1.5 }] },
  { name: 'Voda z okusom', sizes: [{ price: 1.6 }] },
  { name: 'Energy', sizes: [{ price: 2.8 }] },
  { name: 'Jogurt', sizes: [{ price: 1.8 }] },
];

export const drinkCount = drinks.reduce((n, d) => n + d.sizes.length, 0);
