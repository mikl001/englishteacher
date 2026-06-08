# Английский — личный курс с AI-репетитором

> Pet-project. Карточки с интервальным повторением, чтение с переводом по клику, грамматика по темам, тренажёр написания и чат с AI-репетитором — в одной тёмной оболочке. Без аккаунта, без бэкенда, всё в браузере.

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

## Демо

🚀 **Live:** [TODO: добавь Vercel-ссылку после деплоя]
📘 **Гайд / о проекте:** `/about` внутри приложения

## Что внутри

| Раздел | Что делает |
|---|---|
| `/practice` | Чат с AI-репетитором (Hermes-промпт). Любой OpenAI-совместимый API — Mistral, OpenRouter, Ollama. |
| `/cards` | Карточки со словами с простой SRS-логикой: «знаю» → в конец очереди. Озвучка через Web Speech API. |
| `/typing` | Тренажёр написания: перевод → набираешь английский. Enter проверяет. |
| `/reading` | 18 текстов A1–B1. Клик по любому слову → popover с переводом, добавление в словарь одной кнопкой. |
| `/grammar` | 45 упражнений по 16 темам: Present/Past/Future Simple, Continuous, Perfect, артикли, модальные, условные, пассивный залог, question tags и т.д. |
| `/dictionary` | 120 слов с фильтрами и поиском. Можно добавлять свои. |
| `/progress` | Тепловая карта 35 дней, серия активных дней, распределение словаря по статусам. |

## Стек

- **Next.js 16** — App Router, Turbopack, серверные и клиентские компоненты
- **TypeScript** — строгие типы для всей доменной модели
- **Tailwind v4** — настройка прямо в CSS через `@theme inline`, без `tailwind.config.*`
- **next/font** — Inter (UI) + JetBrains Mono (английский), с кириллической подкою
- **localStorage** — версионирование контента (`DEFAULTS_VERSION`), прогресс не теряется при обновлении дефолтов
- **Web Speech API** — озвучка без зависимостей и внешних сервисов
- **OpenAI-compatible chat** — один универсальный клиент к любой LLM

Никаких зависимостей за пределами `next`, `react`, `react-dom` и `tailwindcss`.

## Локальный запуск

```bash
git clone <repo>
cd englishteacher
npm install
npm run dev
# открой http://localhost:3000
```

Для чата с AI: зайди в `/practice → Настройки` и впиши свой `Base URL`, `API key`, `Model`. Ключ хранится только в твоём `localStorage`.

## Деплой на Vercel

1. Запушь репозиторий на GitHub.
2. На [vercel.com](https://vercel.com) → New Project → выбери репо.
3. Vercel сам определит Next.js, никаких env-переменных не нужно.
4. Каждый push в `main` = новый продакшн-деплой.

## Структура

```
app/
├── page.tsx          лендинг
├── about/            гайд (этот README в виде страницы)
├── dashboard/        учебный экран — приветствие, KPI, витрина разделов
├── practice/         чат с AI
├── cards/            карточки SRS
├── typing/           тренажёр написания
├── reading/          чтение с popover
├── grammar/          упражнения по темам
├── dictionary/       словарь, фильтры, поиск
├── progress/         heatmap и статистика
├── layout.tsx        шрифты, шапка, мета-теги
└── globals.css       палитра, градиент, keyframes

components/           Card, Button, Nav, StatCard, ProgressBar,
                      SpeakButton, Heatmap

lib/
├── types.ts          типы доменной модели
├── storage.ts        чтение/запись localStorage + миграции
├── chat.ts           OpenAI-compatible клиент
└── speech.ts         Web Speech API обёртка

data/
├── default-words.json      120 слов по 10 темам
├── default-texts.json      18 текстов с тегом уровня
└── default-exercises.json  45 упражнений по 16 темам
```

## Решения, на которые стоит обратить внимание

- **`DEFAULTS_VERSION` в `lib/storage.ts`** — простой механизм миграции: при бампе версии старый кеш слов/текстов/упражнений автоматически перезаписывается новым набором, прогресс пользователя при этом не страдает.
- **Один `loadOrInit<T>` хелпер** — все три типа дефолтов используют общий код, без дублирования.
- **Popover в чтении** — позиционируется относительно конкретного `<span>` слова, а не фиксированно внизу. Закрывается по Esc и клику вне.
- **Heatmap без библиотек** — обычный CSS-грид + tone-функция на `wordsReviewed`.
- **Универсальный chat-клиент** — один `sendChatMessage(messages, settings)` работает с Mistral, OpenRouter, Ollama, OpenAI и любым другим OpenAI-совместимым endpoint.

## Лицензия

MIT — делай что хочешь, только сошлись.
