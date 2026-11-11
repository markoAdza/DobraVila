/**
 * SITE: basic business info. Edit here; every page reads from this file.
 */
export interface DayHours {
  /** JS weekday: 0 = Sunday … 6 = Saturday */
  day: number;
  label: string;
  /** "HH:MM" 24h, or null when closed all day */
  open: string | null;
  close: string | null;
}

export const site = {
  name: 'Dobre Vile',
  fullName: 'Dobre Vile – Hitra kuhinja',
  tagline: 'Hitra kuhinja v središču Hrastnika',
  description:
    'Dobre Vile v Hrastniku: kebab iz 100 % slovenske govedine, burgerji, pleskavice, hot dogi, burek in solate. Dostava, osebni prevzem in plačilo s kartico. Pokličite 070 153 575.',
  phone: '070 153 575',
  phoneHref: 'tel:+38670153575',
  address: {
    street: 'Trg Franca Kozarja 1',
    postcode: '1430',
    city: 'Hrastnik',
    country: 'SI',
  },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Dobre+Vile+Trg+Franca+Kozarja+1+1430+Hrastnik',
  facebook: 'https://www.facebook.com/dobrevileHrastnik',
  rating: { value: 4.2, count: 25, source: 'Google' },
  services: {
    delivery: true,
    pickup: true,
    card: true,
  },
  timeZone: 'Europe/Ljubljana',
  /** Monday first (display order). */
  hours: [
    { day: 1, label: 'Ponedeljek', open: '11:00', close: '21:00' },
    { day: 2, label: 'Torek', open: '11:00', close: '21:00' },
    { day: 3, label: 'Sreda', open: '11:00', close: '21:00' },
    { day: 4, label: 'Četrtek', open: '11:00', close: '21:00' },
    { day: 5, label: 'Petek', open: '11:00', close: '21:00' },
    { day: 6, label: 'Sobota', open: '11:00', close: '21:00' },
    { day: 0, label: 'Nedelja', open: '14:00', close: '21:00' },
  ] satisfies DayHours[],
} as const;

/** "6,1" → "6,10 €" (Slovenian decimal comma, non-breaking space before €). */
export function formatPrice(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} €`;
}
