export const site = {
  name: "Грань",
  nameLatin: "Gran",
  tagline: "Барбершоп в Казани",
  url: "https://gran.dubstepmolitva.ru",
  locale: "ru_RU",
  phone: "+7 (843) 200-00-00",
  phoneHref: "tel:+78432000000",
  email: "hello@gran.dubstepmolitva.ru",
  address: {
    street: "ул. Баумана, 42",
    city: "Казань",
    region: "Республика Татарстан",
    postalCode: "420111",
    country: "RU",
    full: "Казань, ул. Баумана, 42",
  },
  geo: {
    lat: 55.7887,
    lng: 49.1221,
  },
  hours: {
    weekdays: "10:00–22:00",
    weekend: "10:00–22:00",
    opens: "10:00",
    closes: "22:00",
    label: "открыто до 22:00",
  },
  rating: {
    value: 4.9,
    count: 312,
    source: "Яндекс Карты",
  },
  mapsUrl: "https://yandex.ru/maps/?text=Казань%2C%20ул.%20Баумана%2C%2042",
  telegramBot: "https://t.me/smena_demo_bot",
  ownerCta: "https://t.me/ketasonx",
  author: {
    name: "Богдан",
    site: "https://dubstepmolitva.ru",
    label: "Сделано Богданом — dubstepmolitva.ru",
  },
  social: {
    telegram: "https://t.me/smena_demo_bot",
    vk: "",
  },
  metrika: {
    id: "",
    goals: {
      bookingStep: "booking_step",
      bookingDone: "booking_done",
      tgClick: "tg_click",
      ownerCta: "owner_cta",
    },
  },
} as const;

export type SiteConfig = typeof site;
