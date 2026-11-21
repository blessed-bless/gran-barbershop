export function initServicesUi(root: HTMLElement): void {
  root.addEventListener("click", (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-service-pick]");
    if (!btn) return;
    const serviceId = btn.dataset.servicePick;
    if (!serviceId) return;
    document.dispatchEvent(
      new CustomEvent("gran:select-service", { detail: { serviceId } }),
    );
  });
}
