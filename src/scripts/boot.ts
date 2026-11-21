import { initBeforeAfter } from "./before-after";
import { initBooking } from "./booking";
import { initFab } from "./fab";
import { initHeader } from "./header";
import { initHeroVideo } from "./hero-video";
import { initMasters } from "./masters";
import { initOwnerCta } from "./owner-cta";
import { initServicesUi } from "./services-ui";

function idle(fn: () => void): void {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => fn(), { timeout: 1800 });
  } else {
    window.setTimeout(fn, 300);
  }
}

function bootCriticalUi(): void {
  const header = document.querySelector<HTMLElement>("[data-header]");
  const booking = document.querySelector<HTMLElement>("[data-booking]");
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  const fab = document.querySelector<HTMLElement>("[data-fab]");

  if (header) initHeader(header);
  if (booking) initBooking(booking);
  if (hero) initHeroVideo(hero);
  if (fab && booking && hero) initFab(fab, booking, hero);
}

function bootDeferredUi(): void {
  const services = document.querySelector<HTMLElement>("[data-services]");
  const masters = document.querySelector<HTMLElement>("[data-masters]");
  const works = document.querySelector<HTMLElement>("[data-works]");
  const owner = document.querySelector<HTMLElement>("[data-owner]");

  if (services) initServicesUi(services);
  if (masters) initMasters(masters);
  if (works) initBeforeAfter(works);
  if (owner) initOwnerCta(owner);
}

function loadSemiboldManrope(): void {
  if (document.querySelector('link[data-font="manrope-600"]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/fonts/manrope-600.css";
  link.dataset.font = "manrope-600";
  document.head.appendChild(link);
}

bootCriticalUi();
idle(bootDeferredUi);
idle(loadSemiboldManrope);

let motionStarted = false;

async function startMotion(): Promise<void> {
  if (motionStarted) return;
  motionStarted = true;
  const { initMotion } = await import("./animations");
  initMotion();
}

const onFirstScroll = () => {
  void startMotion();
};

window.addEventListener("scroll", onFirstScroll, { once: true, passive: true });

idle(() => {
  window.setTimeout(() => {
    void startMotion();
  }, 4000);
});
