"use client";

import { useEffect, useMemo, useState } from "react";
import type { Exercise } from "@/lib/types";
import { getExercises, getUserLevel, meetsLevel } from "@/lib/storage";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";

export default function GrammarPage() {
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    const level = getUserLevel();
    setExercises(getExercises().filter((e) => meetsLevel(e.level, level)));
  }, []);

  const topics = useMemo(() => {
    if (!exercises) return [];
    const map = new Map<string, Exercise[]>();
    for (const ex of exercises) {
      const list = map.get(ex.topic) ?? [];
      list.push(ex);
      map.set(ex.topic, list);
    }
    return Array.from(map.entries()).map(([name, items]) => ({ name, items }));
  }, [exercises]);

  const list = useMemo(() => {
    if (!exercises || !topic) return [];
    return exercises.filter((e) => e.topic === topic);
  }, [exercises, topic]);

  if (exercises === null) {
    return <div className="text-zinc-500">Загрузка…</div>;
  }

  if (topic === null) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
          Грамматика
        </h1>
        <p className="text-sm text-zinc-400">
          Выбери тему — внутри упражнения с пояснением правил.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t) => (
            <button
              key={t.name}
              onClick={() => {
                setTopic(t.name);
                setIndex(0);
                setSelected(null);
                setCorrectCount(0);
              }}
              className="group text-left transition-all duration-200 hover:-translate-y-0.5"
            >
              <Card className="h-full p-5 transition-all group-hover:border-zinc-700 group-hover:bg-zinc-900/80">
                <div className="text-lg font-semibold text-zinc-100">
                  {t.name}
                </div>
                <div className="mt-2 text-xs text-zinc-500">
                  {t.items.length} упражнений
                </div>
              </Card>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (index >= list.length) {
    return (
      <div className="mx-auto max-w-md text-center">
        <div className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          {topic}
        </div>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-100">Готово</h1>
        <p className="mt-2 text-zinc-400">
          Правильно: {correctCount} из {list.length}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button
            onClick={() => {
              setIndex(0);
              setSelected(null);
              setCorrectCount(0);
            }}
          >
            Пройти ещё раз
          </Button>
          <Button variant="secondary" onClick={() => setTopic(null)}>
            К темам
          </Button>
        </div>
      </div>
    );
  }

  const current = list[index];
  const answered = selected !== null;
  const isCorrect = answered && selected === current.answer;

  function choose(option: string) {
    if (answered) return;
    setSelected(option);
    if (option === current.answer) setCorrectCount(correctCount + 1);
  }

  function next() {
    setIndex(index + 1);
    setSelected(null);
  }

  function optionClass(option: string): string {
    const base =
      "w-full rounded-lg border px-4 py-3 text-left text-base transition-all duration-150";
    if (!answered) {
      return `${base} border-zinc-800 bg-zinc-900/60 text-zinc-100 hover:border-zinc-700 hover:bg-zinc-800/60 hover:-translate-y-0.5`;
    }
    if (option === current.answer) {
      return `${base} border-emerald-500/40 bg-emerald-500/10 text-emerald-200`;
    }
    if (option === selected) {
      return `${base} border-rose-500/40 bg-rose-500/10 text-rose-200`;
    }
    return `${base} border-zinc-800/50 bg-zinc-900/30 text-zinc-600`;
  }

  const parts = current.question.split("___");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button
        onClick={() => setTopic(null)}
        className="text-sm text-zinc-500 transition-colors hover:text-zinc-100"
      >
        ← К темам
      </button>

      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-zinc-500">
        <span>
          {topic} · {index + 1}/{list.length}
        </span>
        {current.level && (
          <span className="rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 font-mono">
            {current.level}
          </span>
        )}
      </div>
      <ProgressBar value={index + 1} max={list.length} />

      <Card className="p-8">
        <div className="text-2xl leading-relaxed text-zinc-100">
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {i < parts.length - 1 && (
                <span
                  className={`mx-1 inline-block min-w-[60px] border-b-2 px-2 text-center font-mono ${
                    answered
                      ? "border-emerald-400 text-emerald-300"
                      : "border-zinc-600 text-zinc-600"
                  }`}
                >
                  {answered ? current.answer : "?"}
                </span>
              )}
            </span>
          ))}
        </div>
      </Card>

      <div className="grid gap-3">
        {current.options.map((opt) => (
          <button
            key={opt}
            onClick={() => choose(opt)}
            disabled={answered}
            className={optionClass(opt)}
          >
            <span className="mr-2 font-mono text-sm text-zinc-500">
              {String.fromCharCode(65 + current.options.indexOf(opt))}.
            </span>
            <span className="font-medium">{opt}</span>
          </button>
        ))}
      </div>

      {answered && (
        <div className="animate-fade-in-up">
          <Card
            className={`border-l-4 p-5 ${
              isCorrect
                ? "border-l-emerald-400 bg-emerald-500/5"
                : "border-l-rose-400 bg-rose-500/5"
            }`}
          >
            <div
              className={`text-sm font-semibold ${
                isCorrect ? "text-emerald-300" : "text-rose-300"
              }`}
            >
              {isCorrect ? "Верно" : "Неверно"}
            </div>
            <div className="mt-2 text-sm text-zinc-300">
              {current.explanation}
            </div>
          </Card>
          <div className="mt-4 flex justify-end">
            <Button onClick={next}>Дальше →</Button>
          </div>
        </div>
      )}
    </div>
  );
}
