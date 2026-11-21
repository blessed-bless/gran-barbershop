import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const root = process.cwd();
const srcOg = join(root, "src/assets/media/og/og.jpg");
const outOg = join(root, "public/og.jpg");

mkdirSync(dirname(outOg), { recursive: true });

const base = sharp(srcOg).resize(1200, 630, { fit: "cover", position: "centre" });
const meta = await base.metadata();
const width = meta.width ?? 1200;
const height = meta.height ?? 630;

// Georgia/Times keep Cyrillic on Windows librsvg; placed on the right for brand mark.
const mark = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect x="${width - 320}" y="${height / 2 - 56}" width="268" height="112" rx="4" fill="#EFE8DE" fill-opacity="0.88"/>
  <text x="${width - 186}" y="${height / 2 + 14}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="54" font-weight="700" fill="#1B1713" letter-spacing="0.12em">ГРАНЬ</text>
  <circle cx="${width - 292}" cy="${height / 2}" r="7" fill="#B8742A"/>
</svg>`);

await base
  .composite([{ input: mark, top: 0, left: 0 }])
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(outOg);

console.log(`og composed → ${outOg}`);
