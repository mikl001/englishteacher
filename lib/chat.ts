import type { ChatMessage, ChatSettings } from "./types";

// Стандартный системный промпт для роли репетитора английского.
// Можно изменить в настройках на странице /practice.
export const DEFAULT_SYSTEM_PROMPT = [
  "You are Hermes — a friendly English tutor having a chat with a Russian-speaking learner.",
  "The learner's level is approximately A2–B1.",
  "Rules:",
  "- Reply in English. Keep replies short (1–3 sentences usually).",
  "- Use simple vocabulary and natural grammar.",
  "- Ask one follow-up question to keep the conversation going.",
  "- If the user makes a clear grammar mistake, gently correct it on a new line starting with 'note:' — then continue the conversation in a normal tone.",
  "- If the user writes in Russian, briefly encourage them to try in English, but answer politely either way.",
].join("\n");

export const DEFAULT_SETTINGS: ChatSettings = {
  baseUrl: "https://openrouter.ai/api/v1",
  apiKey: "",
  model: "nousresearch/hermes-3-llama-3.1-405b",
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
};

// Отправляет историю сообщений в /chat/completions и возвращает текст ответа.
// Бросает Error с понятным текстом при ошибке — UI покажет его пользователю.
export async function sendChatMessage(
  messages: ChatMessage[],
  settings: ChatSettings
): Promise<string> {
  if (!settings.apiKey) {
    throw new Error("Не задан API-ключ в настройках.");
  }
  if (!settings.baseUrl) {
    throw new Error("Не задан базовый URL в настройках.");
  }
  if (!settings.model) {
    throw new Error("Не задана модель в настройках.");
  }

  // Гарантируем, что system-промпт первый в массиве
  const withSystem: ChatMessage[] =
    messages[0]?.role === "system"
      ? messages
      : [{ role: "system", content: settings.systemPrompt }, ...messages];

  const url = settings.baseUrl.replace(/\/$/, "") + "/chat/completions";

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({
        model: settings.model,
        messages: withSystem,
        stream: false,
      }),
    });
  } catch (e) {
    throw new Error(
      `Не удалось дозвониться до сервера. Проверь base URL и подключение. (${(e as Error).message})`
    );
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Сервер ответил ${response.status} ${response.statusText}.${text ? ` ${text.slice(0, 200)}` : ""}`
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error("Сервер вернул не JSON — проверь base URL.");
  }

  // Достаём content из стандартного OpenAI-формата
  const content = (data as {
    choices?: Array<{ message?: { content?: string } }>;
  })?.choices?.[0]?.message?.content;

  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Пустой ответ от модели.");
  }
  return content.trim();
}
