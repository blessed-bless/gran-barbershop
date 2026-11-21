import { site } from "../config";
import { experienceLabel, masters } from "../data/masters";
import {
  formatDuration,
  formatPrice,
  services,
  type Service,
} from "../data/services";
import { getSlotsForMaster, type DayKey, type DaySlots } from "../data/slots";
import { trackGoal } from "./metrika";

type BookingState = {
  step: 1 | 2 | 3 | 4 | 5;
  masterId: string | null;
  serviceId: string | null;
  dayKey: DayKey | null;
  dateIso: string | null;
  time: string | null;
};

const STEP_LABELS = [
  "Выберите мастера",
  "Выберите услугу",
  "Выберите время",
  "Подтвердите запись",
  "Готово",
];

function createInitialState(): BookingState {
  return {
    step: 1,
    masterId: null,
    serviceId: null,
    dayKey: null,
    dateIso: null,
    time: null,
  };
}

export function initBooking(root: HTMLElement): void {
  const state = createInitialState();
  const live = root.querySelector<HTMLElement>("[data-booking-live]");
  const progress = root.querySelector<HTMLElement>("[data-booking-progress]");
  const panels = {
    1: root.querySelector<HTMLElement>('[data-booking-panel="1"]'),
    2: root.querySelector<HTMLElement>('[data-booking-panel="2"]'),
    3: root.querySelector<HTMLElement>('[data-booking-panel="3"]'),
    4: root.querySelector<HTMLElement>('[data-booking-panel="4"]'),
    5: root.querySelector<HTMLElement>('[data-booking-panel="5"]'),
  };
  const mastersMount = root.querySelector<HTMLElement>("[data-booking-masters]");
  const servicesMount = root.querySelector<HTMLElement>("[data-booking-services]");
  const daysMount = root.querySelector<HTMLElement>("[data-booking-days]");
  const timesMount = root.querySelector<HTMLElement>("[data-booking-times]");
  const summaryMount = root.querySelector<HTMLElement>("[data-booking-summary]");
  const backBtn = root.querySelector<HTMLButtonElement>("[data-booking-back]");
  const nextBtn = root.querySelector<HTMLButtonElement>("[data-booking-next]");
  const confirmBtn = root.querySelector<HTMLButtonElement>("[data-booking-confirm]");
  const tgLink = root.querySelector<HTMLAnchorElement>("[data-booking-tg]");

  if (
    !live ||
    !progress ||
    !mastersMount ||
    !servicesMount ||
    !daysMount ||
    !timesMount ||
    !summaryMount ||
    !backBtn ||
    !nextBtn ||
    !confirmBtn ||
    !tgLink
  ) {
    return;
  }

  function announce(message: string): void {
    live!.textContent = message;
  }

  function canGoNext(): boolean {
    if (state.step === 1) return Boolean(state.masterId);
    if (state.step === 2) return Boolean(state.serviceId);
    if (state.step === 3) return Boolean(state.time);
    return false;
  }

  function syncNav(): void {
    const hideBack = state.step === 1 || state.step === 5;
    backBtn!.hidden = hideBack;
    backBtn!.setAttribute("aria-hidden", String(hideBack));

    const showNext = state.step >= 1 && state.step <= 3;
    nextBtn!.hidden = !showNext;
    nextBtn!.setAttribute("aria-hidden", String(!showNext));
    nextBtn!.disabled = !canGoNext();
  }

  function setStep(step: BookingState["step"]): void {
    state.step = step;
    const visualStep = Math.min(step, 4);
    progress!.style.setProperty("--booking-progress", `${(visualStep / 4) * 100}%`);
    progress!.setAttribute("aria-valuenow", String(visualStep));

    (Object.keys(panels) as unknown as Array<keyof typeof panels>).forEach((key) => {
      const panel = panels[key];
      if (!panel) return;
      const active = Number(key) === step;
      panel.hidden = !active;
      panel.toggleAttribute("inert", !active);
      panel.classList.toggle("is-active", active);
    });

    syncNav();
    announce(STEP_LABELS[step - 1]);
    trackGoal(site.metrika.goals.bookingStep, { step });
  }

  function masterPhotoMap(): Record<string, string> {
    const node = root.querySelector("[data-booking-master-photos]");
    if (!node?.textContent) return {};
    try {
      return JSON.parse(node.textContent) as Record<string, string>;
    } catch {
      return {};
    }
  }

  function paintMasterAvatars(): void {
    const photos = masterPhotoMap();
    mastersMount!.querySelectorAll<HTMLElement>("[data-master-avatar]").forEach((avatar) => {
      const id = avatar.dataset.masterAvatar;
      const photo = id ? photos[id] : "";
      if (!photo) return;
      avatar.style.backgroundImage = `url('${photo}')`;
    });
  }

  function renderMasters(): void {
    mastersMount!.innerHTML = masters
      .map(
        (master) => `
      <button type="button" class="booking-option booking-option--master" data-master-id="${master.id}" aria-pressed="${state.masterId === master.id}">
        <span class="booking-option__avatar" data-master-avatar="${master.id}" aria-hidden="true"></span>
        <span class="booking-option__body">
          <span class="booking-option__title">${master.name}</span>
          <span class="booking-option__meta">${master.specialty}</span>
        </span>
        <span class="booking-option__years">стаж ${experienceLabel(master.experienceYears).replace(" стажа", "")}</span>
      </button>`,
      )
      .join("");

    // Avatars well after LCP window.
    const run = () => paintMasterAvatars();
    if (document.readyState === "complete") {
      window.setTimeout(run, 1500);
    } else {
      window.addEventListener(
        "load",
        () => {
          window.setTimeout(run, 1500);
        },
        { once: true },
      );
    }
  }

  function renderServices(): void {
    servicesMount!.innerHTML = services
      .map((service) => {
        const selected = state.serviceId === service.id;
        return `
      <button type="button" class="booking-option" data-service-id="${service.id}" aria-pressed="${selected}">
        <span class="booking-option__row">
          <span class="booking-option__title">${service.name}</span>
          <span class="booking-option__price">${formatPrice(service.price)}</span>
        </span>
        <span class="booking-option__meta">${formatDuration(service.durationMin)}</span>
      </button>`;
      })
      .join("");
  }

  function renderSlots(): void {
    if (!state.masterId) return;
    const days = getSlotsForMaster(state.masterId);
    if (!state.dayKey) {
      const firstOpen = days.find((d) => d.slots.some((s) => s.available));
      state.dayKey = firstOpen?.key ?? "today";
      state.dateIso = firstOpen?.dateIso ?? days[0]?.dateIso ?? null;
    }

    daysMount!.innerHTML = days
      .map((day) => {
        const pressed = state.dayKey === day.key;
        return `<button type="button" class="booking-chip" data-day-key="${day.key}" data-date-iso="${day.dateIso}" aria-pressed="${pressed}">${day.label}</button>`;
      })
      .join("");

    const activeDay: DaySlots | undefined = days.find((d) => d.key === state.dayKey);
    timesMount!.innerHTML = (activeDay?.slots ?? [])
      .map((slot) => {
        const selected = state.time === slot.time;
        return `<button type="button" class="booking-chip booking-chip--time" data-time="${slot.time}" ${slot.available ? "" : "disabled"} aria-pressed="${selected}">${slot.time}</button>`;
      })
      .join("");
  }

  function selectedService(): Service | undefined {
    return services.find((s) => s.id === state.serviceId);
  }

  function selectedMasterName(): string {
    return masters.find((m) => m.id === state.masterId)?.name ?? "—";
  }

  function renderSummary(): void {
    const service = selectedService();
    summaryMount!.innerHTML = `
      <dl class="booking-summary">
        <div><dt>Мастер</dt><dd>${selectedMasterName()}</dd></div>
        <div><dt>Услуга</dt><dd>${service?.name ?? "—"}</dd></div>
        <div><dt>Цена</dt><dd>${service ? formatPrice(service.price) : "—"}</dd></div>
        <div><dt>Длительность</dt><dd>${service ? formatDuration(service.durationMin) : "—"}</dd></div>
        <div><dt>Когда</dt><dd>${state.dayKey === "today" ? "Сегодня" : "Завтра"}, ${state.time ?? "—"}</dd></div>
      </dl>`;
  }

  function goToBookingCard(): void {
    root.scrollIntoView({ behavior: "smooth", block: "center" });
    root.focus({ preventScroll: true });
  }

  function applyExternalSelection(detail: {
    masterId?: string;
    serviceId?: string;
  }): void {
    if (detail.masterId) state.masterId = detail.masterId;
    if (detail.serviceId) state.serviceId = detail.serviceId;

    if (state.masterId && state.serviceId) {
      state.dayKey = null;
      state.dateIso = null;
      state.time = null;
      renderSlots();
      setStep(3);
    } else if (state.masterId) {
      renderServices();
      setStep(2);
    } else if (state.serviceId) {
      renderMasters();
      setStep(1);
    }
    goToBookingCard();
  }

  function goNext(): void {
    if (state.step === 1 && state.masterId) {
      renderServices();
      setStep(2);
      return;
    }
    if (state.step === 2 && state.serviceId) {
      renderSlots();
      setStep(3);
      return;
    }
    if (state.step === 3 && state.time) {
      renderSummary();
      setStep(4);
    }
  }

  mastersMount.addEventListener("click", (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-master-id]");
    if (!btn) return;
    state.masterId = btn.dataset.masterId ?? null;
    state.dayKey = null;
    state.dateIso = null;
    state.time = null;
    renderMasters();
    syncNav();
  });

  servicesMount.addEventListener("click", (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-service-id]");
    if (!btn) return;
    state.serviceId = btn.dataset.serviceId ?? null;
    state.dayKey = null;
    state.dateIso = null;
    state.time = null;
    renderServices();
    syncNav();
  });

  daysMount.addEventListener("click", (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-day-key]");
    if (!btn) return;
    state.dayKey = (btn.dataset.dayKey as DayKey) ?? null;
    state.dateIso = btn.dataset.dateIso ?? null;
    state.time = null;
    renderSlots();
    syncNav();
  });

  timesMount.addEventListener("click", (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-time]");
    if (!btn || btn.disabled) return;
    state.time = btn.dataset.time ?? null;
    renderSlots();
    syncNav();
  });

  nextBtn.addEventListener("click", () => {
    goNext();
  });

  backBtn.addEventListener("click", () => {
    if (state.step === 2) setStep(1);
    else if (state.step === 3) setStep(2);
    else if (state.step === 4) setStep(3);
  });

  confirmBtn.addEventListener("click", () => {
    if (!state.masterId || !state.serviceId || !state.time) return;
    setStep(5);
    trackGoal(site.metrika.goals.bookingDone, {
      masterId: state.masterId,
      serviceId: state.serviceId,
      time: state.time,
    });
  });

  tgLink.addEventListener("click", () => {
    trackGoal(site.metrika.goals.tgClick, { from: "booking_card" });
  });

  document.addEventListener("gran:select-master", ((event: CustomEvent<{ masterId: string }>) => {
    applyExternalSelection({ masterId: event.detail.masterId });
  }) as EventListener);

  document.addEventListener("gran:select-service", ((event: CustomEvent<{ serviceId: string }>) => {
    applyExternalSelection({ serviceId: event.detail.serviceId });
  }) as EventListener);

  renderMasters();
  setStep(1);
}
