import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const root = process.cwd();
const ffmpeg =
  process.env.FFMPEG_PATH ||
  (existsSync(join(root, "tools/ffmpeg/bin/ffmpeg.exe"))
    ? join(root, "tools/ffmpeg/bin/ffmpeg.exe")
    : "ffmpeg");

const source = join(root, "public/media/hero/source.mp4");
const outDir = join(root, "public/media/hero");
const mp4 = join(outDir, "cut.mp4");
const webm = join(outDir, "cut.webm");
const posterAvif = join(outDir, "poster.avif");
const posterPng = join(outDir, "poster-frame.png");

if (!existsSync(source)) {
  console.error(`Missing ${source}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

function run(args) {
  const result = spawnSync(ffmpeg, args, { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`ffmpeg failed: ${args.join(" ")}`);
  }
}

const trim = [
  "-y",
  "-i",
  source,
  "-t",
  "9",
  "-an",
  "-vf",
  "scale=1280:-2:flags=lanczos,fps=24",
];

run([
  ...trim,
  "-c:v",
  "libx264",
  "-pix_fmt",
  "yuv420p",
  "-profile:v",
  "main",
  "-crf",
  "28",
  "-movflags",
  "+faststart",
  mp4,
]);

run([
  ...trim,
  "-c:v",
  "libvpx-vp9",
  "-b:v",
  "0",
  "-crf",
  "34",
  "-row-mt",
  "1",
  webm,
]);

run(["-y", "-i", mp4, "-frames:v", "1", posterPng]);

await sharp(posterPng)
  .resize(1280, null, { withoutEnlargement: true })
  .avif({ quality: 55 })
  .toFile(posterAvif);

const mp4Kb = Math.round(statSync(mp4).size / 1024);
const webmKb = Math.round(statSync(webm).size / 1024);
console.log(`cut.mp4 ${mp4Kb} KB`);
console.log(`cut.webm ${webmKb} KB`);
console.log(`poster.avif ready`);

if (statSync(mp4).size > 1.5 * 1024 * 1024 || statSync(webm).size > 1.5 * 1024 * 1024) {
  console.warn("Warning: one of the cuts exceeds 1.5 MB — re-encode with higher CRF.");
}
