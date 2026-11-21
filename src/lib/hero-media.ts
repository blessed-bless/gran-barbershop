import { getImage } from "astro:assets";
import heroDesktop from "../assets/media/hero/desktop.jpg";
import heroMobile from "../assets/media/hero/mobile.jpg";

const MOBILE_Q = 45;
const DESKTOP_Q = 58;

export async function buildHeroMedia() {
  const mobile828 = await getImage({
    src: heroMobile,
    width: 828,
    format: "avif",
    quality: MOBILE_Q,
  });
  const mobile1080 = await getImage({
    src: heroMobile,
    width: 1080,
    format: "avif",
    quality: MOBILE_Q,
  });
  const mobile828Webp = await getImage({
    src: heroMobile,
    width: 828,
    format: "webp",
    quality: 50,
  });
  const mobile1080Webp = await getImage({
    src: heroMobile,
    width: 1080,
    format: "webp",
    quality: 50,
  });
  const mobileJpg = await getImage({
    src: heroMobile,
    width: 828,
    format: "jpg",
    quality: 55,
  });

  const desktopWidths = [640, 960, 1280, 1920];
  const desktopAvifParts = await Promise.all(
    desktopWidths.map(async (width) => {
      const img = await getImage({
        src: heroDesktop,
        width,
        format: "avif",
        quality: DESKTOP_Q,
      });
      return `${img.src} ${width}w`;
    }),
  );
  const desktopWebpParts = await Promise.all(
    desktopWidths.map(async (width) => {
      const img = await getImage({
        src: heroDesktop,
        width,
        format: "webp",
        quality: DESKTOP_Q,
      });
      return `${img.src} ${width}w`;
    }),
  );

  const mobileAvifSrcset = `${mobile828.src} 828w, ${mobile1080.src} 1080w`;
  const mobileWebpSrcset = `${mobile828Webp.src} 828w, ${mobile1080Webp.src} 1080w`;

  return {
    mobileAvifSrcset,
    mobileWebpSrcset,
    desktopAvifSrcset: desktopAvifParts.join(", "),
    desktopWebpSrcset: desktopWebpParts.join(", "),
    mobileFallback: mobileJpg,
    mobileLcp: mobile828,
    mobileSizes: {
      "828": mobile828,
      "1080": mobile1080,
    },
  };
}

export type HeroMedia = Awaited<ReturnType<typeof buildHeroMedia>>;
