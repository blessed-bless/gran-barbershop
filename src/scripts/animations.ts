import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { prefersReducedMotion } from "./env";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initMotion(): void {
  if (prefersReducedMotion()) return;

  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const heroTitle = document.querySelector<HTMLElement>("[data-hero-title]");
  if (heroTitle) {
    // Keep title paintable for LCP: no mask / autoAlpha:0 on first paint.
    SplitText.create(heroTitle, {
      type: "lines",
      linesClass: "hero__line",
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          y: 28,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.07,
          delay: 0.05,
          clearProps: "transform",
        });
      },
    });
  }

  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 18,
      duration: 0.7,
      ease: "power2.out",
      clearProps: "transform",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        once: true,
      },
    });
  });

  const phone = document.querySelector<HTMLElement>("[data-phone-mock]");
  if (phone) {
    gsap.from(phone, {
      y: 28,
      duration: 0.8,
      ease: "power3.out",
      clearProps: "transform",
      scrollTrigger: {
        trigger: phone,
        start: "top 85%",
        once: true,
      },
    });

    const toast = phone.querySelector<HTMLElement>("[data-phone-toast]");
    if (toast) {
      gsap.from(toast, {
        y: 16,
        duration: 0.55,
        delay: 0.2,
        ease: "power2.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: phone,
          start: "top 80%",
          once: true,
        },
      });
    }
  }
}
