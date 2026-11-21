import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const root = process.cwd();

async function solidJpeg(path, w, h, color, label) {
  mkdirSync(dirname(path), { recursive: true });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" fill="#6B6158" font-family="Georgia,serif" font-size="${Math.round(w * 0.04)}" text-anchor="middle" dominant-baseline="middle">${label}</text>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toFile(path);
}

async function solidPng(path, w, h, label) {
  mkdirSync(dirname(path), { recursive: true });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="100%" height="100%" fill="#E4DACB"/>
    <rect x="48" y="48" width="${w - 96}" height="${h - 96}" rx="4" fill="none" stroke="#1B1713" stroke-opacity="0.15" stroke-width="2"/>
    <circle cx="${w / 2}" cy="${h / 2 - 20}" r="14" fill="#B8742A"/>
    <text x="50%" y="58%" fill="#1B1713" font-family="Georgia,serif" font-size="32" text-anchor="middle">${label}</text>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path);
}

const media = join(root, "src/assets/media");
const masters = ["artem", "ilya", "timur", "kirill"];
const colors = ["#CBBFAF", "#B7AB9A", "#D2C6B4", "#AFA391"];

for (const [i, id] of masters.entries()) {
  await solidJpeg(join(media, "masters", `${id}.jpg`), 1200, 1500, colors[i], id);
  for (let w = 1; w <= 3; w++) {
    await solidJpeg(
      join(media, "works", `${id}-${w}.jpg`),
      1200,
      1500,
      colors[(i + w) % 4],
      `${id} ${w}`,
    );
  }
}

for (let i = 1; i <= 4; i++) {
  await solidJpeg(join(media, "before-after", `before-${i}.jpg`), 1600, 1200, "#B7AB9A", `before ${i}`);
  await solidJpeg(join(media, "before-after", `after-${i}.jpg`), 1600, 1200, "#CBBFAF", `after ${i}`);
}

await solidJpeg(join(media, "hero", "desktop.jpg"), 2400, 1600, "#CBBFAF", "hero");
await solidJpeg(join(media, "hero", "mobile.jpg"), 1080, 1350, "#CBBFAF", "hero mobile");
await solidJpeg(join(media, "interior", "interior.jpg"), 2400, 1600, "#D2C6B4", "interior");
await solidJpeg(join(media, "og", "og.jpg"), 1200, 630, "#EFE8DE", "og");
await solidPng(join(root, "public/media/map-placeholder.png"), 1200, 720, "Карта · Баумана, 42");

console.log("placeholders written to src/assets/media");
