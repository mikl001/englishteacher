"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ChatMessage, ChatSettings } from "@/lib/types";
import {
  clearChatHistory,
  getChatHistory,
  getChatSettings,
  saveChatHistory,
  saveChatSettings,
} from "@/lib/storage";
import { DEFAULT_SETTINGS, sendChatMessage } from "@/lib/chat";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { SpeakButton } from "@/components/SpeakButton";

export default function PracticePage() {
  const [settings, setSettings] = useState<ChatSettings | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setSettings(getChatSettings());
    setHistory(getChatHistory());
  }, []);

  useEffect(() => {
    // При появлении нового сообщения — скроллим вниз
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, pending]);

  if (settings === null) {
    return <div className="text-zinc-500">Загрузка…</div>;
  }

  const ready = settings.apiKey.trim().length > 0;

  async function send() {
    const text = input.trim();
    if (!text || pending || !settings) return;

    setError(null);
    const next: ChatMessage[] = [...history, { role: "user", content: text }];
    setHistory(next);
    saveChatHistory(next);
    setInput("");
    setPending(true);

    try {
      const reply = await sendChatMessage(next, settings);
      const after: ChatMessage[] = [
        ...next,
        { role: "assistant", content: reply },
      ];
      setHistory(after);
      saveChatHistory(after);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPending(false);
      inputRef.current?.focus();
    }
  }

  function reset() {
    if (!confirm("Очистить историю разговора?")) return;
    setHistory([]);
    clearChatHistory();
    setError(null);
  }

  function handleSaveSettings(s: ChatSettings) {
    saveChatSettings(s);
    setSettings(s);
    setSettingsOpen(false);
    setError(null);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-3xl flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
            Практика с агентом
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Общайся с AI-репетитором по-английски. Он исправляет ошибки и держит беседу.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setSettingsOpen(true)}>
            Настройки
          </Button>
          {history.length > 0 && (
            <Button variant="ghost" onClick={reset}>
              Очистить
            </Button>
          )}
        </div>
      </div>

      {settingsOpen && (
        <SettingsForm
          initial={settings}
          onSave={handleSaveSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {!ready && !settingsOpen && (
        <Card className="p-6">
          <div className="text-sm font-medium text-zinc-100">
            Нужен API-ключ
          </div>
          <p className="mt-2 text-sm text-zinc-400">
            Чат работает с любым OpenAI-совместимым endpoint:{" "}
            <span className="font-mono text-zinc-300">OpenRouter</span>,{" "}
            <span className="font-mono text-zinc-300">Ollama</span>,{" "}
            <span className="font-mono text-zinc-300">vLLM</span>, OpenAI и т.п.
            Введи свой URL, ключ и имя модели — настройки сохраняются локально, в браузере.
          </p>
          <div className="mt-4">
            <Button onClick={() => setSettingsOpen(true)}>
              Открыть настройки
            </Button>
          </div>
        </Card>
      )}

      {ready && (
        <>
          <Card className="flex flex-1 flex-col overflow-hidden p-0">
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {history.length === 0 && (
                <div className="flex h-full items-center justify-center text-center text-sm text-zinc-500">
                  <div>
                    <div className="mb-2">Начни разговор по-английски.</div>
                    <div className="text-xs text-zinc-600">
                      Например:{" "}
                      <span className="font-mono text-zinc-400">
                        Hi! Can we talk about hobbies?
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {history
                .filter((m) => m.role !== "system")
                .map((m, i) => (
                  <Message key={i} role={m.role} content={m.content} />
                ))}
              {pending && <TypingIndicator />}
              {error && (
                <div className="rounded-md border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-300">
                  {error}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-zinc-800 bg-zinc-950/40 p-4">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows={1}
                  placeholder="Type in English… (Enter — send, Shift+Enter — new line)"
                  className="max-h-32 min-h-[40px] flex-1 resize-none rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
                />
                <Button onClick={send} disabled={pending || !input.trim()}>
                  Send
                </Button>
              </div>
            </div>
          </Card>
          <div className="text-center text-xs text-zinc-600">
            Модель: <span className="font-mono">{settings.model}</span>
          </div>
        </>
      )}
    </div>
  );
}

function Message({
  role,
  content,
}: {
  role: "user" | "assistant" | "system";
  content: string;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 font-mono text-xs font-bold text-white">
          H
        </div>
      )}
      <div
        className={`group max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
          isUser
            ? "bg-indigo-500/20 text-indigo-50 border border-indigo-500/30"
            : "bg-zinc-800/60 text-zinc-100 border border-zinc-800"
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{content}</div>
        {!isUser && (
          <div className="mt-1 -mb-1 flex justify-end opacity-0 transition-opacity group-hover:opacity-100">
            <SpeakButton text={content} size="sm" />
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 font-mono text-xs text-zinc-300">
          Я
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 font-mono text-xs font-bold text-white">
        H
      </div>
      <div className="flex items-center gap-1 rounded-2xl border border-zinc-800 bg-zinc-800/60 px-4 py-3">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500" style={{ animationDelay: "0ms" }} />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500" style={{ animationDelay: "200ms" }} />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500" style={{ animationDelay: "400ms" }} />
      </div>
    </div>
  );
}

function SettingsForm({
  initial,
  onSave,
  onClose,
}: {
  initial: ChatSettings;
  onSave: (s: ChatSettings) => void;
  onClose: () => void;
}) {
  const [baseUrl, setBaseUrl] = useState(initial.baseUrl);
  const [apiKey, setApiKey] = useState(initial.apiKey);
  const [model, setModel] = useState(initial.model);
  const [systemPrompt, setSystemPrompt] = useState(initial.systemPrompt);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      baseUrl: baseUrl.trim(),
      apiKey: apiKey.trim(),
      model: model.trim(),
      systemPrompt: systemPrompt.trim() || initial.systemPrompt,
    });
  }

  function resetPrompt() {
    setSystemPrompt(DEFAULT_SETTINGS.systemPrompt);
  }

  return (
    <Card className="animate-fade-in-up p-5">
      <form onSubmit={submit} className="space-y-3">
        <div>
          <Label>Base URL</Label>
          <input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://openrouter.ai/api/v1"
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
          />
          <Hint>Любой OpenAI-совместимый endpoint. Без хвостового слэша.</Hint>
        </div>
        <div>
          <Label>API key</Label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            autoComplete="off"
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
          />
          <Hint>Хранится локально в твоём браузере и никуда не уходит, кроме указанного выше URL.</Hint>
        </div>
        <div>
          <Label>Model</Label>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="nousresearch/hermes-3-llama-3.1-405b"
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
          />
          <Hint>
            Например: <span className="font-mono">nousresearch/hermes-3-llama-3.1-405b</span> (OpenRouter),{" "}
            <span className="font-mono">hermes3</span> (Ollama локально).
          </Hint>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label>System prompt</Label>
            <button
              type="button"
              onClick={resetPrompt}
              className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Сбросить к стандартному
            </button>
          </div>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={6}
            className="mt-1 w-full resize-y rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
          />
          <Hint>Роль агента. Можно поменять, например, на «носитель из Лондона, говорит сленгом».</Hint>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" disabled={!baseUrl.trim() || !apiKey.trim() || !model.trim()}>
            Сохранить
          </Button>
        </div>
      </form>
    </Card>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">
      {children}
    </label>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <div className="mt-1 text-xs text-zinc-600">{children}</div>;
}
