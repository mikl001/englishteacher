"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import {
  getWords,
  getTexts,
  getExercises,
  lastDaysProgress,
  streakDays,
  todayKey,
} from "@/lib/storage";
import type { Word } from "@/lib/types";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 6) return "Доброй ночи";
  if (h < 12) return "Доброе утро";
  if (h < 18) return "Добрый день";
  return "Добрый вечер";
}

type DashboardData = {
  todayReviewed: number;
  todayLearned: number;
  streak: number;
  totalKnown: number;
  totalWords: number;
  totalTexts: number;
  totalExercises: number;
  wordOfDay: Word | null;
};

const sections = [
  { href: "/practice", title: "Практика с агентом", description: "Общайся по-английски с AI-репетитором, исправляет ошибки.", hint: "ai-агент" },
  { href: "/cards", title: "Карточки", description: "Учи слова с интервальным повторением.", hint: "карточки со словами" },
  { href: "/typing", title: "Написание", description: "Тренируй правописание — введи слово по переводу.", hint: "тренажёр" },
  { href: "/reading", title: "Чтение", description: "Тексты с переводом по клику и сохранением в словарь.", hint: "тексты" },
  { href: "/grammar", title: "Грамматика", description: "Упражнения с пояснением правил по темам.", hint: "упражнения" },
  { href: "/dictionary", title: "Словарь", description: "Все слова с фильтрами, поиском и ручным добавлением.", hint: "слов в словаре" },
  { href: "/progress", title: "Прогресс", description: "Серия дней, статистика и тепловая карта активности.", hint: "статистика" },
];

// Начальное состояние с нулями — чтобы не было flash «—» → числа на первом рендере.
// Реальные числа подтянутся через useEffect, плавно перезаписав нули.
const INITIAL_DATA: DashboardData = {
  todayReviewed: 0,
  todayLearned: 0,
  streak: 0,
  totalKnown: 0,
  totalWords: 0,
  totalTexts: 0,
  totalExercises: 0,
  wordOfDay: null,
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>(INITIAL_DATA);

  useEffect(() => {
    const words = getWords();
    const texts = getTexts();
    const exercises = getExercises();
    const last = lastDaysProgress(1)[0] ?? {
      date: todayKey(),
      wordsReviewed: 0,
      wordsLearned: 0,
    };
    const seed = todayKey()
      .split("-")
      .reduce((s, p) => s + Number(p), 0);
    const candidate = words[seed % Math.max(1, words.length)] ?? null;

    setData({
      todayReviewed: last.wordsReviewed,
      todayLearned: last.wordsLearned,
      streak: streakDays(),
      totalKnown: words.filter((w) => w.status === "known").length,
      totalWords: words.length,
      totalTexts: texts.length,
      totalExercises: exercises.length,
      wordOfDay: candidate,
    });
  }, []);

  return (
    <div className="space-y-10">
      <section>
        <div className="text-sm text-zinc-500">{greeting()}.</div>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight text-zinc-100">
          Продолжим{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
            учиться?
          </span>
        </h1>
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Сегодня повторено" value={data.todayReviewed} accent="indigo" />
        <StatCard label="Сегодня выучено" value={data.todayLearned} accent="emerald" />
        <StatCard label="Серия дней" value={data.streak} accent="amber" />
        <StatCard
          label="В словаре"
          value={`${data.totalKnown} / ${data.totalWords}`}
          hint="изучено / всего"
        />
      </section>

      <section>
        <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Разделы
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s, idx) => {
            const counts = countFor(s.hint, data);
            return (
              <Link
                key={s.href}
                href={s.href}
                className="group transition-all duration-200 hover:-translate-y-0.5"
              >
                <Card className="h-full p-5 transition-all group-hover:border-zinc-700 group-hover:bg-zinc-900/80">
                  <div className="flex items-baseline justify-between">
                    <div className="text-lg font-semibold text-zinc-100">{s.title}</div>
                    <div className="font-mono text-xs text-zinc-600">0{idx + 1}</div>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{s.description}</p>
                  {counts && (
                    <div className="mt-4 text-xs text-zinc-500">
                      <span className="font-medium text-zinc-300">{counts}</span>
                    </div>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {data.wordOfDay && (
        <section>
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Слово дня
          </h2>
          <Card className="relative overflow-hidden p-6 glow-indigo">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="relative flex flex-wrap items-baseline justify-between gap-3">
              <div className="font-mono text-4xl font-semibold tracking-tight text-zinc-100">
                {data.wordOfDay.english}
              </div>
              <div className="text-2xl text-zinc-300">{data.wordOfDay.russian}</div>
            </div>
            {data.wordOfDay.example && (
              <div className="relative mt-4 text-zinc-400 italic">
                {data.wordOfDay.example}
              </div>
            )}
          </Card>
        </section>
      )}
    </div>
  );
}

function countFor(hint: string, data: DashboardData): string | null {
  switch (hint) {
    case "ai-агент":
      return "разговорная практика";
    case "карточки со словами":
      return `${data.totalWords} слов`;
    case "тренажёр":
      return `${data.totalWords} слов для тренировки`;
    case "тексты":
      return `${data.totalTexts} текстов`;
    case "упражнения":
      return `${data.totalExercises} упражнений`;
    case "слов в словаре":
      return `${data.totalKnown} выучено · ${data.totalWords} всего`;
    case "статистика":
      return `серия ${data.streak} ${pluralDays(data.streak)}`;
    default:
      return null;
  }
}

function pluralDays(n: number): string {
  const last = n % 10;
  const last2 = n % 100;
  if (last2 >= 11 && last2 <= 14) return "дней";
  if (last === 1) return "день";
  if (last >= 2 && last <= 4) return "дня";
  return "дней";
}
