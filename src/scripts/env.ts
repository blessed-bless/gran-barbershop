export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function connectionSaveData(): boolean {
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
  };
  return Boolean(nav.connection?.saveData);
}

export function isNarrowViewport(): boolean {
  return window.matchMedia("(max-width: 767px)").matches;
}

export function shouldPlayHeroVideo(): boolean {
  return !prefersReducedMotion() && !connectionSaveData() && !isNarrowViewport();
}
