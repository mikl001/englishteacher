"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Word } from "@/lib/types";
import { getUserLevel, getWords, meetsLevel, recordReview } from "@/lib/storage";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";
import { SpeakButton } from "@/components/SpeakButton";

function sortForTraining(words: Word[]): Word[] {
  const unknown = words.filter((w) => w.status !== "known");
  const known = words.filter((w) => w.status === "known");
  return [...unknown, ...known];
}

type Verdict = "idle" | "correct" | "wrong";

export default function TypingPage() {
  const [words, setWords] = useState<Word[] | null>(null);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [verdict, setVerdict] = useState<Verdict>("idle");
  const [correctCount, setCorrectCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const level = getUserLevel();
    const all = getWords().filter((w) => meetsLevel(w.level, level));
    setWords(sortForTraining(all));
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [index]);

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
          Тренировка окончена
        </h1>
        <p className="mt-2 text-zinc-400">
          Правильно: {correctCount} из {words.length}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button
            onClick={() => {
              const level = getUserLevel();
              const all = getWords().filter((w) => meetsLevel(w.level, level));
              setWords(sortForTraining(all));
              setIndex(0);
              setInput("");
              setVerdict("idle");
              setCorrectCount(0);
            }}
          >
            Ещё раз
          </Button>
          <Link href="/">
            <Button variant="secondary">На главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  const current = words[index];

  function check() {
    if (verdict !== "idle") {
      next();
      return;
    }
    const answer = input.trim().toLowerCase();
    const target = current.english.toLowerCase();
    if (answer === target) {
      setVerdict("correct");
      setCorrectCount(correctCount + 1);
      recordReview(false);
    } else {
      setVerdict("wrong");
      recordReview(false);
    }
  }

  function next() {
    setIndex(index + 1);
    setInput("");
    setVerdict("idle");
  }

  const inputClass =
    verdict === "correct"
      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
      : verdict === "wrong"
      ? "border-rose-500/50 bg-rose-500/10 text-rose-200"
      : "border-zinc-700 bg-zinc-950/60 text-zinc-100 focus:border-indigo-500";

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-zinc-500">
        <span>Написание {index + 1}/{words.length}</span>
        <span>Правильно: {correctCount}</span>
      </div>
      <ProgressBar value={index + 1} max={words.length} tone="emerald" />

      <Card className="relative overflow-hidden p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative text-center">
          <div className="text-xs uppercase tracking-wider text-zinc-500">
            Переведи на английский
          </div>
          <div className="mt-3 text-3xl font-semibold text-zinc-100">
            {current.russian}
          </div>
          {current.example && verdict !== "idle" && (
            <div className="animate-fade-in-up mt-3 text-sm italic text-zinc-500">
              {current.example}
            </div>
          )}
        </div>

        <div className="mt-8">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") check();
            }}
            disabled={verdict !== "idle"}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            placeholder="набери английский вариант"
            className={`w-full rounded-lg border-2 px-4 py-3 text-center font-mono text-2xl tracking-wide outline-none transition-colors placeholder:text-zinc-600 ${inputClass}`}
          />
        </div>

        {verdict === "wrong" && (
          <div className="animate-fade-in-up mt-4 text-center text-sm text-zinc-300">
            Правильно:{" "}
            <span className="font-mono font-semibold text-zinc-100">
              {current.english}
            </span>
            <SpeakButton text={current.english} size="sm" className="ml-1" />
          </div>
        )}
        {verdict === "correct" && (
          <div className="animate-fade-in-up mt-4 text-center text-sm font-medium text-emerald-300">
            Верно!
          </div>
        )}
      </Card>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={next}>
          Пропустить
        </Button>
        <Button onClick={check}>
          {verdict === "idle" ? "Проверить" : "Дальше →"}
        </Button>
      </div>
      <div className="text-center text-xs text-zinc-600">
        Enter — проверить и идти дальше
      </div>
    </div>
  );
}
