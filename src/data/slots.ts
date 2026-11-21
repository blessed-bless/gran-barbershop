import { masters } from "./masters";

export type DayKey = "today" | "tomorrow";

export type TimeSlot = {
  time: string;
  available: boolean;
};

export type DaySlots = {
  key: DayKey;
  label: string;
  dateIso: string;
  slots: TimeSlot[];
};

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function toDateIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function dayLabel(date: Date, key: DayKey): string {
  if (key === "today") return "Сегодня";
  if (key === "tomorrow") return "Завтра";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
  }).format(date);
}

const BASE_TIMES = [
  "10:00",
  "10:45",
  "11:30",
  "12:15",
  "13:00",
  "13:45",
  "14:30",
  "15:15",
  "16:00",
  "16:45",
  "17:30",
  "18:15",
  "19:00",
  "19:45",
  "20:30",
  "21:15",
];

export function getSlotsForMaster(
  masterId: string,
  now: Date = new Date(),
): DaySlots[] {
  const master = masters.find((m) => m.id === masterId);
  if (!master) return [];

  const days: DaySlots[] = [];
  for (let offset = 0; offset < 2; offset++) {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    const dateIso = toDateIso(date);
    const key: DayKey = offset === 0 ? "today" : "tomorrow";
    const rand = mulberry32(hashSeed(`${masterId}:${dateIso}`));

    const slots: TimeSlot[] = BASE_TIMES.map((time) => {
      const [hh, mm] = time.split(":").map(Number);
      const slotDate = new Date(date);
      slotDate.setHours(hh, mm, 0, 0);

      const past = offset === 0 && slotDate.getTime() <= now.getTime();
      const busy = rand() < 0.38;
      return { time, available: !past && !busy };
    });

    days.push({
      key,
      label: dayLabel(date, key),
      dateIso,
      slots,
    });
  }

  return days;
}

export function getNearestAvailable(
  masterId: string,
  now: Date = new Date(),
): { day: DaySlots; slot: TimeSlot } | null {
  for (const day of getSlotsForMaster(masterId, now)) {
    const slot = day.slots.find((s) => s.available);
    if (slot) return { day, slot };
  }
  return null;
}
