# ARCHITECTURE.md — Техническая основа

## Стек

| Что | Чем | Почему |
|-----|-----|--------|
| Фреймворк | Next.js 14 (App Router) | React + роутинг + удобный деплой |
| Язык | TypeScript | Меньше случайных ошибок |
| Стили | Tailwind CSS | Быстро, без отдельных CSS-файлов |
| Хранилище | localStorage / IndexedDB | Работает без сервера и интернета |
| Деплой | Vercel (бесплатно) | Одна команда — сайт в интернете |

> ⚠️ Никакой базы данных, никакого бекенда на старте.
> Всё хранится в браузере пользователя. Это проще, быстрее и достаточно
> для личного использования.

---

## Структура папок

```
/app
  /page.tsx              — главная страница (дашборд)
  /cards/page.tsx        — карточки со словами
  /reading/page.tsx      — чтение текстов
  /grammar/page.tsx      — грамматические упражнения
  /progress/page.tsx     — прогресс

/components
  /ui/                   — базовые элементы (кнопка, карточка, и т.д.)
  /cards/                — компоненты для карточек
  /reading/              — компоненты для чтения
  /grammar/              — компоненты для упражнений

/lib
  /storage.ts            — работа с localStorage (читать / писать данные)
  /types.ts              — общие типы данных (что такое "слово", "текст" и т.д.)

/data
  /default-words.json    — стартовый набор слов
  /default-texts.json    — стартовые тексты для чтения
```

---

## Модели данных

### Слово (Word)
```typescript
{
  id: string
  english: string        // "apple"
  russian: string        // "яблоко"
  example?: string       // "I eat an apple every day"
  status: 'new' | 'learning' | 'known'
  nextReview: number     // timestamp — когда показать снова
  reviewCount: number    // сколько раз повторяли
}
```

### Текст (Text)
```typescript
{
  id: string
  title: string
  content: string        // полный текст на английском
  addedAt: number        // timestamp
}
```

### Упражнение (Exercise)
```typescript
{
  id: string
  question: string       // "She ___ to school every day."
  options: string[]      // ["go", "goes", "going"]
  answer: string         // "goes"
  explanation: string    // "Третье лицо единственного числа — добавляем -s"
  topic: string          // "Present Simple"
}
```

### Прогресс (Progress)
```typescript
{
  date: string           // "2024-01-15"
  wordsReviewed: number
  wordsLearned: number
  minutesSpent: number
}
```

---

## Порядок разработки

Строим **по одному разделу за раз**, в таком порядке:

1. **Скелет проекта** — создать Next.js проект, настроить Tailwind,
   сделать навигацию между страницами
2. **Карточки** — самая важная функция, начинаем с неё
3. **Хранилище** — написать `storage.ts`, чтобы слова сохранялись
4. **Чтение текстов** — загрузка текста, перевод слова по клику
5. **Грамматика** — упражнения с вариантами ответа
6. **Прогресс** — дашборд с цифрами

Не переходим к следующему пункту без явного «ок» от пользователя.
