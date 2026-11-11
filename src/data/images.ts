import type { ImageMetadata } from 'astro';
import photoMeta from './photos.json';

/**
 * Food photos (illustrative). Source files: src/assets/food/<key>.jpg, produced by `npm run assets`
 * from the Wikimedia Commons files listed in photos.json (authors + licences shown on /fotografije).
 */
export type PhotoKey = keyof typeof photoMeta;

export interface PhotoCredit {
  file: string;
  page: string;
  author: string;
  license: string;
  licenseUrl: string;
}

const modules = import.meta.glob<{ default: ImageMetadata }>('../assets/food/*.jpg', { eager: true });

export function photo(key: PhotoKey): ImageMetadata {
  const mod = modules[`../assets/food/${key}.jpg`];
  if (!mod) throw new Error(`Missing photo "${key}". Run \`npm run assets\`.`);
  return mod.default;
}

export const credits = photoMeta as Record<PhotoKey, PhotoCredit>;
