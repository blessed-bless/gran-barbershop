# Грань — концепт-сайт барбершопа

Одностраничный сайт вымышленного барбершопа «Грань» (Казань) для портфолио: запись на первом экране, мастера, до/после, блок для владельца. По смыслу стыкуется с Telegram Mini App «Смена» (заявка уходит мастеру, окна — в духе YCLIENTS).

Барбершоп вымышленный, фото — иллюстрации.

Автор: Богдан Щербинин ([dubstepmolitva.ru](https://dubstepmolitva.ru)).

## Стек

- Astro + TypeScript, статическая сборка
- GSAP + Lenis (подключаются после idle / первого скролла)
- Self-hosted Playfair Display / Manrope (woff2, кириллица + латиница)

Других UI-библиотек нет.

## Цифры (Lighthouse mobile, Slow 4G)

| | |
| --- | --- |
| Performance | 100 |
| LCP | 1,5 с (`.hero__poster`, mobile AVIF ~30 КБ) |
| Transfer | ~121 КиБ |
| CLS | 0 |

## Запуск

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

Дополнительно:

- `npm run encode:hero` — петля из `public/media/hero/source.mp4`
- `npm run compose:og` — OG с надписью «ГРАНЬ»
- `npm run subset:playfair` — пересборка subset заголовков (нужны `fonttools` + `brotli`)

## Конфиг

- `astro.config.mjs` → `site` (`https://gran.dubstepmolitva.ru`)
- `src/config.ts` → телефон, адрес, Telegram, Метрика (`id` пустой), CTA владельца

На хостах `*.twc1.net` в `<head>` добавляется `noindex` (проверка hostname). Принудительно: `PUBLIC_NOINDEX=true` на сборке.

## Медиа

Фото: `src/assets/media/` (через `astro:assets`).  
В `public/media/` — карта и видео героя (`cut.webm` / `cut.mp4`).

Скриншоты (390 / 1440): `docs/screenshots/hero-*.png`, `masters-*.png`, `works-*.png`, `owner-*.png`.

## Деплой

Timeweb Cloud Apps, frontend / Astro:

- команда сборки: `npm run build`
- директория сборки: `dist`
- домен: `gran.dubstepmolitva.ru` (CNAME на адрес Apps)
