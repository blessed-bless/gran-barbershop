import { site } from "../config";
import { trackGoal } from "./metrika";

export function initOwnerCta(root: HTMLElement): void {
  root.querySelectorAll<HTMLAnchorElement>("[data-owner-cta]").forEach((link) => {
    link.addEventListener("click", () => {
      trackGoal(site.metrika.goals.ownerCta);
    });
  });
}
