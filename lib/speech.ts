// Тонкая обёртка над Web Speech API. Безопасно работает в любом окружении —
// если API недоступен, просто молча ничего не делает.

export function speechAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, lang = "en-US"): void {
  if (!speechAvailable()) return;
  // Отменяем предыдущий запрос — иначе кнопка не реагирует при частых нажатиях
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}
