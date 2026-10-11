# barnovych.fashion

Сайт-візитка моделі Tetyana Barnovych. Статичний HTML/CSS/JS, без збірки.

## Структура
- `site/` — те, що викладається на хостинг (document root).
- `scripts/build-images.sh` — генерує WebP у `site/img/` з оригіналів (`~/Downloads/fashion/{1,2,3}`).
- `docs/superpowers/specs/` — затверджений дизайн.

## Локально
```
cd site && python3 -m http.server 8765
```
Відкрити http://localhost:8765/

## Деплой на HostPro
1. У панелі HostPro додати домен `barnovych.fashion` (мультисайт-тариф → "Домени" → додати, папка `barnovych.fashion/public_html` або аналогічна).
2. Залити вміст `site/` (включно з `.htaccess` та `img/`) у document root домену через FTP/SFTP або файловий менеджер панелі.
3. Випустити безкоштовний SSL (Let's Encrypt) у панелі; після цього розкоментувати редірект на HTTPS у `.htaccess`.

## DNS на GoDaddy
Варіант A (простіший): змінити nameservers домену на NS HostPro (їх видно в панелі / листі про активацію).
Варіант B: лишити DNS на GoDaddy і додати A-запис `@` → IP сервера HostPro та CNAME `www` → `barnovych.fashion`.

## Оновлення контенту
- Параметри/контакти — у `site/index.html`, секції `#stats` і `#contact`.
- Нові фото: покласти у відповідну папку зйомки, запустити `scripts/build-images.sh`, додати `<a class="gallery__item">` у потрібну галерею.
- Після змін CSS/JS підняти `?v=N` у посиланнях в `index.html`, щоб скинути кеш.
