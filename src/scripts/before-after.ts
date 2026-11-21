export function initBeforeAfter(root: HTMLElement): void {
  const sliders = root.querySelectorAll<HTMLElement>("[data-compare]");

  sliders.forEach((slider) => {
    const range = slider.querySelector<HTMLInputElement>("[data-compare-range]");
    const after = slider.querySelector<HTMLElement>("[data-compare-after]");
    if (!range || !after) return;

    const sync = (value: string) => {
      const pct = Number(value);
      slider.style.setProperty("--compare", `${pct}%`);
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      range.setAttribute("aria-valuetext", `Показать после на ${pct}%`);
    };

    sync(range.value);

    range.addEventListener("input", () => sync(range.value));
    range.addEventListener("keydown", (event) => {
      const step = event.shiftKey ? 10 : 1;
      let next = Number(range.value);
      if (event.key === "ArrowLeft" || event.key === "ArrowDown") next -= step;
      if (event.key === "ArrowRight" || event.key === "ArrowUp") next += step;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = 100;
      if (next === Number(range.value)) return;
      event.preventDefault();
      range.value = String(Math.min(100, Math.max(0, next)));
      sync(range.value);
    });
  });
}
