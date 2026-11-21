export type Review = {
  id: string;
  name: string;
  date: string;
  rating: number;
  text: string;
};

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Максим К.",
    date: "2026-02-14",
    rating: 5,
    text: "Пришёл «просто подровнять» — ушёл с формой, которой раньше не было. Артём сразу понял, что нужно.",
  },
  {
    id: "r2",
    name: "Денис В.",
    date: "2026-02-02",
    rating: 5,
    text: "Записался через Telegram за пару минут. Напоминание пришло вовремя, очереди не было.",
  },
  {
    id: "r3",
    name: "Руслан М.",
    date: "2026-01-21",
    rating: 5,
    text: "Королевское бритьё — это отдельный ритуал. Тихо, чисто, без спешки.",
  },
  {
    id: "r4",
    name: "Андрей С.",
    date: "2026-01-11",
    rating: 5,
    text: "Борода наконец легла ровно. Илья объяснил, как поддерживать дома — реально помогло.",
  },
  {
    id: "r5",
    name: "Елена П.",
    date: "2025-12-28",
    rating: 5,
    text: "Водила сына к Кириллу. Ребёнок не нервничал, стрижка аккуратная, цена честная.",
  },
  {
    id: "r6",
    name: "Игорь Т.",
    date: "2025-12-09",
    rating: 4,
    text: "Атмосфера спокойная, без лишнего шума. Единственное — хотелось бы чуть больше окон вечером в пятницу.",
  },
];

export function formatReviewDate(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
