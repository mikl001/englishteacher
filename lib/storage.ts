// Работа с localStorage — единая точка чтения/записи слов и текстов.
// На сервере (SSR) localStorage недоступен, поэтому везде проверяем `typeof window`.

import type {
  Word,
  WordStatus,
  ReadingText,
  Exercise,
  DailyProgress,
  ChatMessage,
  ChatSettings,
} from "./types";
import { DEFAULT_SETTINGS } from "./chat";
import defaultWordsData from "@/data/default-words.json";
import defaultTextsData from "@/data/default-texts.json";
import defaultExercisesData from "@/data/default-exercises.json";

const WORDS_KEY = "words";
const TEXTS_KEY = "texts";
const EXERCISES_KEY = "exercises";
const PROGRESS_KEY = "progress";
const CHAT_SETTINGS_KEY = "chat_settings";
const CHAT_HISTORY_KEY = "chat_history";

// Версия дефолтного контента. При увеличении старые кеши слов/текстов/упражнений
// автоматически перезатираются новым набором, прогресс при этом сохраняется.
const DEFAULTS_VERSION = 3;
const VERSION_KEY = "defaults_version";

function maybeMigrateDefaults(): void {
  if (typeof window === "undefined") return;
  const current = Number(window.localStorage.getItem(VERSION_KEY) ?? "0");
  if (current >= DEFAULTS_VERSION) return;
  window.localStorage.removeItem(WORDS_KEY);
  window.localStorage.removeItem(TEXTS_KEY);
  window.localStorage.removeItem(EXERCISES_KEY);
  window.localStorage.setItem(VERSION_KEY, String(DEFAULTS_VERSION));
}

// Полный сброс всех пользовательских данных. Привязан к кнопке на /progress.
// Настройки чата и историю не трогаем — это отдельная область.
export function resetAllData(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(WORDS_KEY);
  window.localStorage.removeItem(TEXTS_KEY);
  window.localStorage.removeItem(EXERCISES_KEY);
  window.localStorage.removeItem(PROGRESS_KEY);
  window.localStorage.setItem(VERSION_KEY, String(DEFAULTS_VERSION));
}

// ===== Чат: настройки =====

export function getChatSettings(): ChatSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  const raw = window.localStorage.getItem(CHAT_SETTINGS_KEY);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(raw) as Partial<ChatSettings>;
    // Мерджим с дефолтами, чтобы новые поля (например, systemPrompt) подхватились
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveChatSettings(settings: ChatSettings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHAT_SETTINGS_KEY, JSON.stringify(settings));
}

// ===== Чат: история сообщений =====

export function getChatHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(CHAT_HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return [];
  }
}

export function saveChatHistory(history: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
}

export function clearChatHistory(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CHAT_HISTORY_KEY);
}

// В default-words.json лежат только базовые поля.
// Статус и счётчик добавляются при первой загрузке.
type DefaultWord = Pick<Word, "id" | "english" | "russian" | "example">;

function initialWords(): Word[] {
  return (defaultWordsData as DefaultWord[]).map((w) => ({
    ...w,
    status: "new" as WordStatus,
    reviewCount: 0,
  }));
}

// В default-texts.json нет поля addedAt — добавляем при первой загрузке.
type DefaultText = Pick<ReadingText, "id" | "title" | "content">;

function initialTexts(): ReadingText[] {
  const now = Date.now();
  return (defaultTextsData as DefaultText[]).map((t) => ({
    ...t,
    addedAt: now,
  }));
}

// Универсальный загрузчик: парсит JSON из localStorage, при отсутствии или ошибке
// инициализирует из переданной функции. Перед чтением выполняет миграцию дефолтов,
// если в коде поднялась DEFAULTS_VERSION.
function loadOrInit<T>(key: string, init: () => T): T {
  if (typeof window === "undefined") return init();
  maybeMigrateDefaults();
  const raw = window.localStorage.getItem(key);
  if (!raw) {
    const value = init();
    window.localStorage.setItem(key, JSON.stringify(value));
    return value;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    const value = init();
    window.localStorage.setItem(key, JSON.stringify(value));
    return value;
  }
}

// ===== Слова =====

export function getWords(): Word[] {
  return loadOrInit(WORDS_KEY, initialWords);
}

export function saveWords(words: Word[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WORDS_KEY, JSON.stringify(words));
}

// Обновить статус одного слова, увеличить счётчик и зафиксировать активность в прогрессе.
export function updateWordStatus(id: string, status: WordStatus): Word[] {
  const words = getWords();
  const target = words.find((w) => w.id === id);
  if (!target) return words;
  // «Впервые выучено» — статус был не 'known', стал 'known'
  const justLearned = target.status !== "known" && status === "known";
  const updated = words.map((w) =>
    w.id === id ? { ...w, status, reviewCount: w.reviewCount + 1 } : w
  );
  saveWords(updated);
  recordReview(justLearned);
  return updated;
}

// Найти слово по английскому написанию (без учёта регистра и пробелов по краям).
export function findWordByEnglish(english: string): Word | undefined {
  const needle = english.toLowerCase().trim();
  return getWords().find((w) => w.english.toLowerCase() === needle);
}

// Добавить новое слово в словарь. Если уже есть — обновляет перевод.
// Возвращает обновлённый список.
export function addWord(english: string, russian: string): Word[] {
  const cleaned = english.toLowerCase().trim();
  const words = getWords();
  const existing = words.findIndex((w) => w.english.toLowerCase() === cleaned);
  if (existing >= 0) {
    const updated = [...words];
    updated[existing] = { ...updated[existing], russian: russian.trim() };
    saveWords(updated);
    return updated;
  }
  const newWord: Word = {
    id: `w${Date.now()}`,
    english: cleaned,
    russian: russian.trim(),
    status: "new",
    reviewCount: 0,
  };
  const updated = [...words, newWord];
  saveWords(updated);
  return updated;
}

// ===== Тексты =====

export function getTexts(): ReadingText[] {
  return loadOrInit(TEXTS_KEY, initialTexts);
}

// ===== Упражнения =====

function initialExercises(): Exercise[] {
  return defaultExercisesData as Exercise[];
}

export function getExercises(): Exercise[] {
  return loadOrInit(EXERCISES_KEY, initialExercises);
}

// ===== Прогресс =====

// Ключ дня в локальном времени, формат YYYY-MM-DD
function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return dateKey(new Date());
}

function subtractDayKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  return dateKey(date);
}

export function getProgress(): DailyProgress[] {
  return loadOrInit<DailyProgress[]>(PROGRESS_KEY, () => []);
}

function saveProgress(items: DailyProgress[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(items));
}

// Зафиксировать одно повторение в сегодняшней записи. Если записи нет — создаст.
export function recordReview(justLearned: boolean): void {
  const items = getProgress();
  const today = todayKey();
  const idx = items.findIndex((p) => p.date === today);
  if (idx >= 0) {
    items[idx] = {
      ...items[idx],
      wordsReviewed: items[idx].wordsReviewed + 1,
      wordsLearned: items[idx].wordsLearned + (justLearned ? 1 : 0),
    };
  } else {
    items.push({
      date: today,
      wordsReviewed: 1,
      wordsLearned: justLearned ? 1 : 0,
    });
  }
  saveProgress(items);
}

// Серия активных дней до сегодня (включительно).
// Если сегодня ещё ничего не делали, серия не обрывается — считаем с последнего активного дня назад.
export function streakDays(): number {
  const items = getProgress();
  const map = new Map(items.map((p) => [p.date, p]));
  let cursor = todayKey();
  const todayEntry = map.get(cursor);
  if (!todayEntry || todayEntry.wordsReviewed === 0) {
    cursor = subtractDayKey(cursor);
  }
  let count = 0;
  while (true) {
    const entry = map.get(cursor);
    if (entry && entry.wordsReviewed > 0) {
      count++;
      cursor = subtractDayKey(cursor);
    } else {
      break;
    }
  }
  return count;
}

// Прогресс за последние N дней, упорядоченный от сегодня к прошлому.
// Дни без записи заполняются нулями, чтобы показать пропуски.
export function lastDaysProgress(n: number): DailyProgress[] {
  const items = getProgress();
  const map = new Map(items.map((p) => [p.date, p]));
  const result: DailyProgress[] = [];
  let cursor = todayKey();
  for (let i = 0; i < n; i++) {
    const entry = map.get(cursor);
    result.push(
      entry ?? { date: cursor, wordsReviewed: 0, wordsLearned: 0 }
    );
    cursor = subtractDayKey(cursor);
  }
  return result;
}
