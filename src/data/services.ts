export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMin: number;
};

export const services: Service[] = [
  {
    id: "haircut",
    name: "Стрижка",
    description: "Форма, текстура и финальная укладка под твой стиль.",
    price: 1800,
    durationMin: 45,
  },
  {
    id: "haircut-beard",
    name: "Стрижка + борода",
    description: "Одна сессия: голова и борода в одном ритме.",
    price: 2500,
    durationMin: 70,
  },
  {
    id: "beard",
    name: "Борода",
    description: "Контур, объём и уход — без случайных линий.",
    price: 1200,
    durationMin: 30,
  },
  {
    id: "kids",
    name: "Детская",
    description: "Спокойно и быстро для детей от 5 до 12 лет.",
    price: 1400,
    durationMin: 40,
  },
  {
    id: "camouflage",
    name: "Камуфляж седины",
    description: "Мягкий тон без эффекта «покрашено».",
    price: 1600,
    durationMin: 35,
  },
  {
    id: "royal-shave",
    name: "Королевское бритьё",
    description: "Горячее полотенце, опасная бритва, масло и бальзам.",
    price: 2200,
    durationMin: 50,
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} мин`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} ч` : `${h} ч ${m} мин`;
}
