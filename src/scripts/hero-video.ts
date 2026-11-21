import { shouldPlayHeroVideo } from "./env";

export function initHeroVideo(hero: HTMLElement): void {
  if (!shouldPlayHeroVideo()) {
    hero.classList.add("is-still");
    return;
  }

  const sourcesTpl = hero.querySelector<HTMLTemplateElement>("[data-hero-video-sources]");
  const media = hero.querySelector<HTMLElement>(".hero__media");
  if (!sourcesTpl || !media) {
    hero.classList.add("is-still");
    return;
  }

  const video = document.createElement("video");
  video.className = "hero__video";
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.preload = "metadata";
  video.setAttribute("data-hero-video", "");

  const fragment = sourcesTpl.content.cloneNode(true);
  video.append(fragment);
  media.prepend(video);

  void video
    .play()
    .then(() => {
      video.preload = "auto";
    })
    .catch(() => {
      hero.classList.add("is-still");
      video.remove();
    });
}
