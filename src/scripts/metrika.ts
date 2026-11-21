import { site } from "../config";

declare global {
  interface Window {
    ym?: (id: number | string, method: string, ...args: unknown[]) => void;
  }
}

export function trackGoal(goal: string, params?: Record<string, unknown>): void {
  const id = site.metrika.id;
  if (!id || typeof window.ym !== "function") return;
  window.ym(id, "reachGoal", goal, params);
}
