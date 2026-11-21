export function initHeader(header: HTMLElement): void {
  const onScroll = () => {
    header.classList.toggle("is-compact", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const inkSections = document.querySelectorAll<HTMLElement>(".section--ink");
  if (!inkSections.length || !("IntersectionObserver" in window)) return;

  const inkUnderHeader = new Set<Element>();

  const syncInkTone = () => {
    header.classList.toggle("is-on-ink", inkUnderHeader.size > 0);
  };

  let io: IntersectionObserver | null = null;

  const observeInkBand = () => {
    io?.disconnect();
    inkUnderHeader.clear();

    const headerH = Math.max(1, Math.round(header.getBoundingClientRect().height));
    const bottomClip = Math.max(0, window.innerHeight - headerH - 1);

    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inkUnderHeader.add(entry.target);
          else inkUnderHeader.delete(entry.target);
        }
        syncInkTone();
      },
      {
        root: null,
        rootMargin: `-${headerH}px 0px -${bottomClip}px 0px`,
        threshold: 0,
      },
    );

    inkSections.forEach((section) => io?.observe(section));
    syncInkTone();
  };

  observeInkBand();
  window.addEventListener("resize", observeInkBand, { passive: true });
}
