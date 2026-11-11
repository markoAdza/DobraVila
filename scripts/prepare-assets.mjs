#!/usr/bin/env node
/**
 * Prepares every image the site uses.
 *
 *   npm run assets
 *
 * 1. Downloads the food photos listed in src/data/photos.json from Wikimedia Commons
 *    (free licences: CC0 / public domain / CC BY / CC BY-SA) → .asset-cache/commons/   (cached)
 * 2. Optimises them into src/assets/food/<key>.jpg (max 1400 px, Astro then serves AVIF/WebP)
 * 3. Writes favicons + og-image.jpg → public/
 *
 * To swap a photo: change its entry in src/data/photos.json (file, page, author, licence) and re-run.
 * Authors and licences are listed on the /fotografije page automatically.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = (...s) => path.join(root, ...s);
const UA = 'DobreVileWebsite/1.0 (static restaurant site; image build script)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** @type {Record<string, { file: string; author: string; license: string }>} */
const photos = JSON.parse(await readFile(p('src', 'data', 'photos.json'), 'utf8'));

await mkdir(p('.asset-cache', 'commons'), { recursive: true });
await mkdir(p('src', 'assets', 'food'), { recursive: true });
await mkdir(p('public'), { recursive: true });

async function download(file, dest) {
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1600`;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
    if (res.ok) {
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
      return;
    }
    if (res.status === 429 || res.status >= 500) {
      await sleep(4000 * attempt);
      continue;
    }
    throw new Error(`${file}: HTTP ${res.status}`);
  }
  throw new Error(`${file}: too many retries`);
}

let fetched = 0;
for (const [key, photo] of Object.entries(photos)) {
  const cached = p('.asset-cache', 'commons', `${key}${path.extname(photo.file).toLowerCase() || '.jpg'}`);
  if (!existsSync(cached)) {
    await download(photo.file, cached);
    fetched++;
    await sleep(1200);
  }
  await sharp(cached)
    .rotate()
    .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(p('src', 'assets', 'food', `${key}.jpg`));
}
console.log(`photos: ${Object.keys(photos).length} optimised (${fetched} downloaded)`);

/* Favicon: paprika-red rounded square with a cream "V" monogram. */
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#C0321A"/>
  <path d="M17 17h8.6l6.4 20.5L38.4 17H47L36.6 47h-9.2z" fill="#FAF6EF"/>
</svg>`;
await writeFile(p('public', 'favicon.svg'), faviconSvg);
await sharp(Buffer.from(faviconSvg)).resize(180, 180).png().toFile(p('public', 'apple-touch-icon.png'));
await sharp(Buffer.from(faviconSvg)).resize(32, 32).png().toFile(p('public', 'favicon-32.png'));

/* OG image: hero photo cropped to 1200×630. */
await sharp(p('src', 'assets', 'food', 'kebab-hero.jpg'))
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(p('public', 'og-image.jpg'));
console.log('favicons + og-image written');
