export function initFab(fab: HTMLElement, booking: HTMLElement, hero: HTMLElement): void {
  const update = () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const bookingRect = booking.getBoundingClientRect();
    const bookingVisible =
      bookingRect.top < window.innerHeight * 0.85 && bookingRect.bottom > window.innerHeight * 0.15;
    const pastHero = heroBottom < 80;
    fab.classList.toggle("is-visible", pastHero && !bookingVisible);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}
