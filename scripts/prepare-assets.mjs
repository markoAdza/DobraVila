#!/usr/bin/env node
/**
 * Prepares every image the site uses.
 *
 *   npm run assets
 *
 * 1. Downloads the food photos listed in src/data/photos.json from Wikimedia Commons
 *    (free licences: CC0 / public domain / CC BY / CC BY-SA) → .asset-cache/commons/   (cached)
 * 2. Optimises them into src/assets/food/<key>.jpg (max 1400 px, Astro then serves AVIF/WebP)
 *
 * Brand assets (logo parts, favicons, og-image) come from scripts/prepare-logo.mjs.
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

/* Favicons + og-image are generated from the logo: npm run logo (scripts/prepare-logo.mjs). */
