# barnovych.fashion

Сайт-візитка моделі Tetyana Barnovych. Статичний HTML/CSS/JS, без збірки.

## Структура
- `site/` — те, що викладається на хостинг (document root). `index.html` — англійська, `ua/index.html` — українська (спільні CSS/JS/картинки).
- `scripts/build-images.sh` — генерує WebP у `site/img/` з оригіналів (`~/Downloads/fashion/{1,2,3}`).
- `docs/superpowers/specs/` — затверджений дизайн.

## Локально
```
cd site && python3 -m http.server 8765
```
Відкрити http://localhost:8765/

## Деплой
Хостинг — GitHub Pages, репозиторій `yuriybarnovich/tbfashion`.
Кожен пуш у `main` запускає `.github/workflows/deploy.yml`, який публікує папку `site/`.
Статус: https://github.com/yuriybarnovich/tbfashion/actions

Домен `barnovych.fashion` прив'язаний через `site/CNAME` і налаштування Pages (HTTPS примусовий).
DNS на GoDaddy: чотири A-записи `@` → 185.199.108.153 / 109 / 110 / 111, CNAME `www` → `barnovych.fashion`.

## Оновлення контенту
- Параметри/контакти — у `site/index.html` та `site/ua/index.html`, секції `#stats` і `#contact` (правити обидві мови).
- Нові фото: покласти у відповідну папку зйомки, запустити `scripts/build-images.sh`, додати `<a class="gallery__item">` у потрібну галерею в обох HTML (в `ua/` шляхи з префіксом `../`).
- Після змін CSS/JS підняти `?v=N` у посиланнях в `index.html`, щоб скинути кеш.
