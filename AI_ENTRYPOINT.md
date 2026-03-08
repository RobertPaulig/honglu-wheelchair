# Honglu Wheelchair — Сайт-каталог СИ-ВАН

## Что это
Многостраничный сайт-каталог электрокресел Honglu для конечного покупателя на русском языке. Чистый HTML/CSS/JS, без фреймворков.

## Деплой
- GitHub: RobertPaulig/honglu-wheelchair
- Live: https://robertpaulig.github.io/honglu-wheelchair/
- Домен: si-van.ru (CNAME в корне)
- Локальная папка: taihe-wheelchair (legacy name)

## Структура проекта
```
taihe-wheelchair/
├── index.html          — Главная (hero-v2, 4 линейки, популярные модели, CTA)
├── catalog.html        — Каталог (4 линейки: TERRA, VISTA, NEXUS, DELTA)
├── category.html       — Страница линейки (JS рендерит по ?cat=id)
├── product.html        — Страница товара (JS рендерит по ?id=xxx)
├── about.html          — О компании (ООО СИ-ВАН АВТО, ИНН, ОГРН)
├── contacts.html       — Контакты + форма заявки
├── goshelp.html        — Государственная помощь (компенсации ТСР)
├── card-test.html      — Тест дизайна карточек (dev)
├── css/
│   └── style.css       — Все стили (~820 строк), mobile-first
├── js/
│   ├── products.js     — CATEGORIES[] + PRODUCTS[] (42 модели)
│   ├── main.js         — Навигация, рендеринг, карусель, модалка
│   └── form.js         — Валидация формы (alert, без бэкенда)
├── img/
│   ├── original/       — 183+ исходных JPG из PDF каталога
│   ├── products/       — 249 PNG без фона (обработаны через remove.bg API)
│   ├── site/           — favicon.svg, og-image.png (1200x630)
│   ├── png/            — Файлы Photoroom (ручная обработка)
│   └── test/           — Тестовая папка
├── sourses/            — PDF каталог, прайс .xls, мануал FS129F1
├── MODEL-MAPPING.md    — Таблица: артикул Honglu → название на сайте
├── CNAME               — si-van.ru
└── AI_ENTRYPOINT.md    — Этот файл
```

## 4 линейки (42 модели)

### TERRA (9 моделей) — Улица и мобильность
TH103→TERRA 1000, TH103-4→TERRA 1000 Pro, TH103-2→TERRA 1000 Duo,
YH103-1→TERRA 600, TH201W→TERRA Rocker, TH201W-3→TERRA Rocker Off-Road,
TH204W→TERRA Urban, TH201F→TERRA Comfort-S, TH106-B→TERRA Trike

### VISTA (11 моделей) — Дом и комфорт
TH307→VISTA Lift, TH307-5→VISTA Lift Max, TH307-2→VISTA Lift Mini,
TH203→VISTA Hybrid, TH201HK→VISTA Care, TH201→VISTA Fold,
TH201A→VISTA Fold A, TH201K→VISTA Fold K, TH109/TH108→VISTA Fold S,
TH101→VISTA Fold Speed, TH201C→VISTA Micro

### NEXUS (11 моделей) — Работа и социализация
FS129F1→NEXUS 129 Pro, TH306→NEXUS Active, TH303→NEXUS Elite Q1,
TH309→NEXUS Elite Q1F, TH301→NEXUS Elite 301, TH3021→NEXUS Stand H1,
TH3022→NEXUS Stand H2, TH3023→NEXUS Stand H3, TH308→NEXUS Stand H4,
TH601→NEXUS Lite H1, TH305→NEXUS Lite H2

### DELTA (11 моделей) — Реабилитация и ассистивные технологии
TH603→DELTA Care, TH602→DELTA Trainer, TH604→DELTA Trainer Pro,
TH501→DELTA Walk, TH502→DELTA Walk Pro, TH505→DELTA Walk Aid,
TH503→DELTA Walk E, TH509→DELTA Walk S, TH705→DELTA Transfer,
TH704→DELTA Transfer Pro, TH801→DELTA Hygiene

## Текущий дизайн (v4, март 2026)
- **Шрифт**: Manrope (Google Fonts)
- **Primary (dark)**: #1c2331 — хедер, подвал, тело карточек товаров, CTA
- **Accent**: #3a7ca5 (steel-blue) — кнопки, ссылки, active-состояния
- **Accent-2**: #7eb8d0 — subtitle линеек, счётчики
- **Фон**: #f4f5f7 (светло-серый)
- **Карточки товаров**: тёмное тело + светлый gradient для фото + border 1px rgba(255,255,255,0.18)
- **Карточки линеек**: тёмные, на мобилке горизонтальные (фото слева), на планшете вертикальные
- **Скругления**: 8/12/16/24px
- **Breakpoints**: 480px, 600px, 992px, 1200px

### История дизайна
1. Inter + blue #2563eb + cyan #00d2ff (исходный)
2. DM Sans + purple #6c5ce7 (full dark) → отклонён
3. DM Sans + coral #e8563a (light) → "ядовитые цвета"
4. **Manrope + steel-blue #3a7ca5** → текущий ✓
5. System font + Yandex yellow #ffcc00 → "ЖУТЬ" → откатили к v4

## CSS архитектура (style.css, ~820 строк)
- 31 CSS-переменная в :root
- Секции: header, hero, hero-v2, lines-grid, why-cards, buttons, sections, product-cards-v6, category-cards, carousel, specs-table, features, options, trust, company, sticky-bar, CTA, form, contacts, about, breadcrumb, page-header, footer, site-sticky-bar, modal, scroll-top
- 4 медиа-запроса: 480px, 600px, 992px, 1200px

## JS архитектура

### main.js
- Карусель: touch swipe, thumbnails, counter, навигация стрелками
- Путь к фото: `img/xxx.jpg` → `img/products/xxx.png` (автозамена)
- renderHome(): hero-v2, линейки (split "Name — Subtitle"), популярные модели
- renderCatalog(): все 4 линейки
- renderCategory(): товары одной линейки
- renderProduct(): полная страница товара (карусель, характеристики, фичи)
- Модальное окно заявки
- Sticky bottom bar на страницах товара (мобилка)
- Burger-меню (мобилка)

### products.js
- CATEGORIES[]: {id, name, img, desc} — 4 линейки
- PRODUCTS[]: 42 объекта — {id, name, category, shortDesc, description, features[], specs{}, options[], images[], price, catalogPage}
- images[] используют "img/xxx.jpg" (main.js конвертирует в products/*.png)

## Изображения
- Источник: PDF каталог (41 стр.), извлечены автоматически в sourses/images/
- Обработка фона: remove.bg API (5 ключей по 50 кредитов = 250 обработок)
- 249 PNG в img/products/ (прозрачный фон)
- Порядок фото: первая — основное фото модели, корзина/аксессуары — в конец
- OG image: img/site/og-image.png (1200x630, тёмный фон, брендинг)
- Favicon: img/site/favicon.svg (коляска + молния)

## Источники данных
- PDF: sourses/Taihe Wheelchair Catalogue 9.6.pdf (41 стр.)
- Мануал: sourses/FS129F1 Power Wheelchair.pdf
- Прайс: sourses/quotation 3-1.xls (FS129F1: 14475 RMB при MOQ 100)
- Курс: ~20 руб/юань (настраивается пользователем)

## Контакты на сайте
- Компания: ООО «СИ-ВАН АВТО»
- ИНН: 7810924927, ОГРН: 1217800121604
- Телефон: +7 (921) 405-22-44
- Telegram: @Magadancanen
- WhatsApp: +7 (921) 405-22-44
- Email: info@conecargo.ru
- Адрес: СПб, пр-кт Юрия Гагарина, 41/28

## Важные правила
- НЕ упоминать "Taihe" нигде на сайте — только Honglu / СИ-ВАН
- Все страницы должны содержать "Госпомощь" в навигации
- После изменений — всегда пушить (пользователь проверяет на live)
- Mobile-first — главный приоритет
- Максимум характеристик в каждом товаре
