# Медиа в public

Здесь только то, что отдаётся как статичные URL:

- `map-placeholder.png` — заглушка карты (ссылка ведёт на Яндекс Карты)
- `hero/source.mp4` — исходник (в `.gitignore`), кодируется в `cut.webm` / `cut.mp4`
- `hero/cut.webm`, `hero/cut.mp4`, `hero/poster.avif` — петля героя

Фото сайта живут в `src/assets/media/` и проходят через `astro:assets`.
