export type Master = {
  id: string;
  name: string;
  experienceYears: number;
  specialty: string;
};

export function experienceLabel(years: number): string {
  const mod10 = years % 10;
  const mod100 = years % 100;
  if (mod10 === 1 && mod100 !== 11) return `${years} год стажа`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${years} года стажа`;
  }
  return `${years} лет стажа`;
}

export const masters: Master[] = [
  {
    id: "artem",
    name: "Артём",
    experienceYears: 8,
    specialty: "Текстурные стрижки, fade",
  },
  {
    id: "ilya",
    name: "Илья",
    experienceYears: 6,
    specialty: "Борода и бритьё",
  },
  {
    id: "timur",
    name: "Тимур",
    experienceYears: 5,
    specialty: "Классика и камуфляж",
  },
  {
    id: "kirill",
    name: "Кирилл",
    experienceYears: 4,
    specialty: "Детские и семейные визиты",
  },
];
