"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Word, WordStatus } from "@/lib/types";
import { getWords, updateWordStatus } from "@/lib/storage";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";
import { SpeakButton } from "@/components/SpeakButton";

function sortForReview(words: Word[]): Word[] {
  const unknown = words.filter((w) => w.status !== "known");
  const known = words.filter((w) => w.status === "known");
  return [...unknown, ...known];
}

export default function CardsPage() {
  const [words, setWords] = useState<Word[] | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setWords(sortForReview(getWords()));
  }, []);

  if (words === null) {
    return <div className="text-zinc-500">Загрузка…</div>;
  }

  if (words.length === 0) {
    return (
      <Card className="mx-auto max-w-md p-8 text-center">
        <h1 className="text-2xl font-semibold text-zinc-100">Словарь пуст</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Добавь слова в{" "}
          <Link href="/dictionary" className="text-indigo-400 hover:underline">
            словаре
          </Link>{" "}
          или через клик по слову в{" "}
          <Link href="/reading" className="text-indigo-400 hover:underline">
            чтении
          </Link>
          .
        </p>
      </Card>
    );
  }

  if (index >= words.length) {
    return (
      <div className="mx-auto max-w-md text-center">
        <div className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          Готово
        </div>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-100">
          Все слова просмотрены
        </h1>
        <p className="mt-2 text-zinc-400">В этой сессии: {words.length} слов.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button
            onClick={() => {
              setWords(sortForReview(getWords()));
              setIndex(0);
              setRevealed(false);
            }}
          >
            Начать заново
          </Button>
          <Link href="/">
            <Button variant="secondary">На главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  const current = words[index];

  function rate(status: WordStatus) {
    updateWordStatus(current.id, status);
    setIndex(index + 1);
    setRevealed(false);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-zinc-500">
        <span>
          Карточка {index + 1} из {words.length}
        </span>
        {current.topic && <span>{current.topic}</span>}
      </div>
      <ProgressBar value={index + 1} max={words.length} />

      <Card className="relative overflow-hidden p-10">
        {/* Декоративные блобы для глубины */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />

        <div className="absolute right-4 top-4">
          <SpeakButton text={current.english} />
        </div>

        <div className="relative flex flex-col items-center text-center">
          <div className="font-mono text-5xl font-semibold tracking-tight text-zinc-100">
            {current.english}
          </div>

          {revealed ? (
            <div className="animate-fade-in-up mt-8 w-full border-t border-zinc-800 pt-6">
              <div className="text-2xl text-zinc-200">{current.russian}</div>
              {current.example && (
                <div className="mt-3 text-sm italic text-zinc-500">
                  {current.example}
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={() => setRevealed(true)}
              variant="secondary"
              size="lg"
              className="mt-8"
            >
              Показать перевод
            </Button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Button variant="danger" size="lg" onClick={() => rate("learning")} disabled={!revealed}>
          Не знаю
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => rate("hard")}
          disabled={!revealed}
          className="border-amber-500/30 bg-amber-500/10 text-amber-300 hover:border-amber-500/50 hover:bg-amber-500/15"
        >
          Сложное
        </Button>
        <Button variant="success" size="lg" onClick={() => rate("known")} disabled={!revealed}>
          Знаю
        </Button>
      </div>
      <div className="text-center text-xs text-zinc-600">
        Сначала покажи перевод, потом оцени.
      </div>
    </div>
  );
}
