// Общие типы данных проекта.

export type Level = "A1" | "A2" | "B1";

// Статус слова с точки зрения изучения.
// 'new' — пользователь ещё не оценивал слово.
// 'learning' — поставил «не знаю».
// 'hard' — поставил «сложное».
// 'known' — поставил «знаю».
export type WordStatus = "new" | "learning" | "hard" | "known";

export type Word = {
  id: string;
  english: string;
  russian: string;
  example?: string;
  topic?: string;
  status: WordStatus;
  reviewCount: number;
};

// Имя ReadingText (а не Text), чтобы не конфликтовать с глобальным DOM Text.
export type ReadingText = {
  id: string;
  title: string;
  content: string;
  level?: Level;
  addedAt: number;
};

export type Exercise = {
  id: string;
  question: string;       // предложение с пропуском (___), например "She ___ to school every day."
  options: string[];      // варианты ответа
  answer: string;         // правильный вариант (один из options)
  explanation: string;    // объяснение правила на русском
  topic: string;          // тема, например "Present Simple"
  level?: Level;
};

// Дневная статистика занятий. Имя DailyProgress, чтобы не путать с DOM <progress>.
export type DailyProgress = {
  date: string;           // YYYY-MM-DD (локальное время)
  wordsReviewed: number;  // сколько раз нажали кнопку оценки в карточках
  wordsLearned: number;   // сколько слов сегодня впервые стали 'known'
};

// === Чат с AI-агентом ===

export type ChatRole = "system" | "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

// Настройки подключения к OpenAI-совместимому endpoint.
// Подходит для OpenRouter, Ollama, vLLM, OpenAI, любого совместимого сервера.
export type ChatSettings = {
  baseUrl: string;        // например, https://openrouter.ai/api/v1
  apiKey: string;         // токен пользователя
  model: string;          // например, nousresearch/hermes-3-llama-3.1-405b
  systemPrompt: string;   // роль агента
};
