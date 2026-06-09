"use client";

import { useEffect, useMemo, useState } from "react";
import type { Word, WordStatus } from "@/lib/types";
import { addWord, getWords } from "@/lib/storage";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { SpeakButton } from "@/components/SpeakButton";

type Filter = "all" | WordStatus;

const filterLabels: Record<Filter, string> = {
  all: "Все",
  new: "Новые",
  learning: "Учу",
  hard: "Сложные",
  known: "Знаю",
};

const filterOrder: Filter[] = ["all", "new", "learning", "hard", "known"];

export default function DictionaryPage() {
  const [words, setWords] = useState<Word[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    setWords(getWords());
  }, []);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: 0,
      new: 0,
      learning: 0,
      hard: 0,
      known: 0,
    };
    if (!words) return c;
    c.all = words.length;
    for (const w of words) c[w.status] += 1;
    return c;
  }, [words]);

  const filtered = useMemo(() => {
    if (!words) return [];
    const q = query.trim().toLowerCase();
    return words
      .filter((w) => filter === "all" || w.status === filter)
      .filter((w) => {
        if (!q) return true;
        return (
          w.english.toLowerCase().includes(q) ||
          w.russian.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.english.localeCompare(b.english));
  }, [words, filter, query]);

  if (words === null) {
    return <div className="text-zinc-500">Загрузка…</div>;
  }

  function handleAdd(english: string, russian: string) {
    addWord(english, russian);
    setWords(getWords());
    setAddOpen(false);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
            Словарь
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {words.length} слов · {counts.known} выучено
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="self-stretch sm:self-auto">
          + Добавить слово
        </Button>
      </div>

      <Card className="p-4">
        <input
          type="search"
          placeholder="Поиск по слову или переводу…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-base text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none sm:text-sm"
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {filterOrder.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-zinc-100 text-zinc-950"
                  : "bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              {filterLabels[f]} · {counts[f]}
            </button>
          ))}
        </div>
      </Card>

      {addOpen && (
        <AddWordForm onAdd={handleAdd} onClose={() => setAddOpen(false)} />
      )}

      {filtered.length === 0 ? (
        <Card className="p-8 text-center text-sm text-zinc-500">
          Ничего не найдено по фильтру и запросу.
        </Card>
      ) : (
        <Card className="divide-y divide-zinc-800">
          {filtered.map((w) => (
            <div
              key={w.id}
              className="flex items-center justify-between gap-3 p-3 transition-colors hover:bg-zinc-800/40 sm:gap-4 sm:p-4"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <StatusDot status={w.status} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-mono text-base font-semibold text-zinc-100">
                      {w.english}
                    </span>
                    <SpeakButton text={w.english} size="sm" />
                  </div>
                  {w.example && (
                    <div className="mt-0.5 truncate text-xs italic text-zinc-500">
                      {w.example}
                    </div>
                  )}
                  <div className="mt-0.5 text-sm text-zinc-300 sm:hidden">
                    {w.russian}
                  </div>
                </div>
              </div>
              <div className="hidden shrink-0 items-center gap-4 text-right sm:flex">
                <div className="text-sm text-zinc-300">{w.russian}</div>
                {w.reviewCount > 0 && (
                  <div className="font-mono text-xs text-zinc-600">
                    {w.reviewCount}×
                  </div>
                )}
              </div>
              {w.reviewCount > 0 && (
                <div className="shrink-0 font-mono text-xs text-zinc-600 sm:hidden">
                  {w.reviewCount}×
                </div>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

function StatusDot({ status }: { status: WordStatus }) {
  const tone =
    status === "known"
      ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]"
      : status === "hard"
      ? "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]"
      : status === "learning"
      ? "bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.5)]"
      : "bg-zinc-600";
  return (
    <div
      className={`h-2.5 w-2.5 shrink-0 rounded-full ${tone}`}
      title={status}
    />
  );
}

function AddWordForm({
  onAdd,
  onClose,
}: {
  onAdd: (english: string, russian: string) => void;
  onClose: () => void;
}) {
  const [english, setEnglish] = useState("");
  const [russian, setRussian] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!english.trim() || !russian.trim()) return;
    onAdd(english, russian);
  }

  return (
    <Card className="animate-fade-in-up p-5">
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <input
          autoFocus
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
          placeholder="english"
          className="rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 font-mono text-base text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none sm:text-sm"
        />
        <input
          value={russian}
          onChange={(e) => setRussian(e.target.value)}
          placeholder="перевод"
          className="rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-base text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none sm:text-sm"
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={!english.trim() || !russian.trim()}>
            Сохранить
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Отмена
          </Button>
        </div>
      </form>
    </Card>
  );
}
