#!/usr/bin/env node
/**
 * Builds every brand asset from the original logo.
 *
 *   npm run logo
 *
 * Input:  src/assets/brand/logo-source.png  (logo on its dark slate background, 960×960)
 * Output: src/assets/brand/logo-wordmark.png  stars + "dobre vile" (transparent, without "hitra kuhinja")
 *         src/assets/brand/logo-fairy.png     the big fairy with her wand (transparent, animated separately)
 *         src/data/logo.json                  geometry to reassemble both parts + the wand tip position
 *         public/favicon.svg, favicon-32.png, apple-touch-icon.png, og-image.jpg
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = (...s) => path.join(root, ...s);

const { data, info } = await sharp(p('src', 'assets', 'brand', 'logo-source.png'))
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const at = (x, y) => (y * W + x) * 3;

/* Background colour, sampled from the top-left corner. */
const BG = [data[at(4, 4)], data[at(4, 4) + 1], data[at(4, 4) + 2]];
const hex = (c) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');

/* Coordinates below are for the 960 px source; scale them if the source size changes. */
const k = W / 960;
const sc = (v) => Math.round(v * k);

/* 1. Remove "• hitra kuhinja •" by painting it with the background colour. */
const erase = { x0: sc(316), y0: sc(364), x1: sc(583), y1: sc(421) };
for (let y = erase.y0; y < erase.y1; y++)
  for (let x = erase.x0; x < erase.x1; x++) data.set(BG, at(x, y));

/* 2. Split into fairy (with wand + wand sparkles) and wordmark (stars + lettering + small fairies). */
const isMagenta = (i) => data[i] > 150 && data[i + 1] < 110 && data[i + 2] > 70;
const isFairy = (x, y) => x >= sc(756) || (x >= sc(600) && y < sc(440) && !isMagenta(at(x, y)));

/* 3. Un-blend from the background: alpha from the strongest channel difference, colour = B + (P-B)/a. */
const T = 140;
function extract(keep) {
  const out = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = at(x, y);
      const o = (y * W + x) * 4;
      if (!keep(x, y)) continue;
      const d = [data[i] - BG[0], data[i + 1] - BG[1], data[i + 2] - BG[2]];
      const m = Math.max(Math.abs(d[0]), Math.abs(d[1]), Math.abs(d[2]));
      const a = Math.min(1, Math.max(0, (m - 12) / (T - 12)));
      if (a <= 0) continue;
      for (let c = 0; c < 3; c++) out[o + c] = Math.max(0, Math.min(255, Math.round(BG[c] + d[c] / a)));
      out[o + 3] = Math.round(a * 255);
    }
  }
  return out;
}

async function save(buf, file) {
  const img = sharp(buf, { raw: { width: W, height: H, channels: 4 } });
  const { info: t } = await img.clone().png().trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
  await img.png().trim({ threshold: 1 }).png({ compressionLevel: 9 }).toFile(file);
  // trimOffsetLeft/Top are negative offsets of the crop inside the original canvas
  return { x: -t.trimOffsetLeft, y: -t.trimOffsetTop, w: t.width, h: t.height };
}

const wordBuf = extract((x, y) => !isFairy(x, y));
const fairyBuf = extract(isFairy);
const word = await save(wordBuf, p('src', 'assets', 'brand', 'logo-wordmark.png'));
const fairy = await save(fairyBuf, p('src', 'assets', 'brand', 'logo-fairy.png'));

/* Full lockup bounding box (both parts) in source pixels. */
const box = {
  x: Math.min(word.x, fairy.x),
  y: Math.min(word.y, fairy.y),
  w: Math.max(word.x + word.w, fairy.x + fairy.w) - Math.min(word.x, fairy.x),
  h: Math.max(word.y + word.h, fairy.y + fairy.h) - Math.min(word.y, fairy.y),
};
const pct = (v, total) => +((v / total) * 100).toFixed(3);
const rel = (r) => ({
  left: pct(r.x - box.x, box.w),
  top: pct(r.y - box.y, box.h),
  width: pct(r.w, box.w),
  height: pct(r.h, box.h),
});
/* Wand tip (top-left end of the wand), relative to the fairy crop. */
const tip = { x: sc(630), y: sc(383) };
const geometry = {
  background: hex(BG),
  aspect: +(box.w / box.h).toFixed(4),
  wordmark: rel(word),
  fairy: rel(fairy),
  wandTip: { left: pct(tip.x - fairy.x, fairy.w), top: pct(tip.y - fairy.y, fairy.h) },
};
await writeFile(p('src', 'data', 'logo.json'), JSON.stringify(geometry, null, 2) + '\n');
console.log('logo parts written', geometry);

/* Full transparent lockup (for OG image + apple icon). */
const fullBuf = extract(() => true);
const full = await sharp(fullBuf, { raw: { width: W, height: H, channels: 4 } })
  .extract({ left: box.x, top: box.y, width: box.w, height: box.h })
  .png()
  .toBuffer();

/* Favicon: slate rounded square with the logo's magenta star. */
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="${hex(BG)}"/>
  <path d="M32 9.5l6.6 13.4 14.8 2.2-10.7 10.4 2.5 14.7L32 43.3l-13.2 6.9 2.5-14.7L10.6 25.1l14.8-2.2z" fill="none" stroke="#E0177F" stroke-width="5.5" stroke-linejoin="round"/>
  <circle cx="51" cy="51" r="3.2" fill="#1BA1DF"/>
  <circle cx="12" cy="52" r="2.2" fill="#ffffff"/>
</svg>`;
await writeFile(p('public', 'favicon.svg'), faviconSvg);
await sharp(Buffer.from(faviconSvg)).resize(32, 32).png().toFile(p('public', 'favicon-32.png'));

/* Apple touch icon: the fairy on slate. */
const fairyIcon = await sharp(p('src', 'assets', 'brand', 'logo-fairy.png'))
  .resize(150, 150, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 3, background: hex(BG) } })
  .composite([{ input: fairyIcon, gravity: 'center' }])
  .png()
  .toFile(p('public', 'apple-touch-icon.png'));

/* OG image: full logo centred on slate, 1200×630. */
const ogLogo = await sharp(full).resize(1000, 520, { fit: 'inside' }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: hex(BG) } })
  .composite([{ input: ogLogo, gravity: 'center' }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(p('public', 'og-image.jpg'));
console.log('favicons + og-image written');
