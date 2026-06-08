"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { DailyProgress, Word } from "@/lib/types";
import {
  getWords,
  lastDaysProgress,
  resetAllData,
  streakDays,
  todayKey,
} from "@/lib/storage";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/Button";
import { Heatmap } from "@/components/Heatmap";
import { SpeakButton } from "@/components/SpeakButton";

type Stats = {
  today: DailyProgress;
  streak: number;
  lastDays: DailyProgress[];
  words: Word[];
};

export default function ProgressPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    const lastDays = lastDaysProgress(35);
    const today =
      lastDays[0] ?? { date: todayKey(), wordsReviewed: 0, wordsLearned: 0 };
    setStats({
      today,
      streak: streakDays(),
      lastDays,
      words: getWords(),
    });
  }

  if (stats === null) {
    return <div className="text-zinc-500">Загрузка…</div>;
  }

  const totalKnown = stats.words.filter((w) => w.status === "known").length;
  const totalLearning = stats.words.filter((w) => w.status === "learning").length;
  const totalHard = stats.words.filter((w) => w.status === "hard").length;
  const totalNew = stats.words.filter((w) => w.status === "new").length;

  const recentKnown = [...stats.words]
    .filter((w) => w.status === "known")
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
        Прогресс
      </h1>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Сегодня повторено" value={stats.today.wordsReviewed} accent="indigo" />
        <StatCard label="Сегодня выучено" value={stats.today.wordsLearned} accent="emerald" />
        <StatCard label="Серия дней" value={stats.streak} accent="amber" />
        <StatCard
          label="Знаю слов"
          value={`${totalKnown} / ${stats.words.length}`}
          hint="из всего словаря"
        />
      </section>

      <section>
        <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Активность за 35 дней
        </h2>
        <Card className="p-5">
          <Heatmap days={stats.lastDays} />
        </Card>
      </section>

      <section>
        <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Распределение словаря
        </h2>
        <Card className="p-5">
          <StatusBar
            counts={{
              known: totalKnown,
              hard: totalHard,
              learning: totalLearning,
              new: totalNew,
            }}
          />
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <LegendItem color="bg-emerald-400" label="Знаю" value={totalKnown} />
            <LegendItem color="bg-amber-400" label="Сложные" value={totalHard} />
            <LegendItem color="bg-rose-400" label="Учу" value={totalLearning} />
            <LegendItem color="bg-zinc-600" label="Новые" value={totalNew} />
          </div>
        </Card>
      </section>

      {recentKnown.length > 0 && (
        <section>
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Что я уже знаю
          </h2>
          <Card className="divide-y divide-zinc-800">
            {recentKnown.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-semibold text-zinc-100">
                    {w.english}
                  </span>
                  <SpeakButton text={w.english} size="sm" />
                </div>
                <div className="text-sm text-zinc-400">{w.russian}</div>
              </div>
            ))}
          </Card>
        </section>
      )}

      {stats.today.wordsReviewed === 0 && (
        <Card className="p-5">
          <p className="text-sm text-zinc-400">
            Сегодня ещё не было повторений. Открой{" "}
            <Link href="/cards" className="text-indigo-400 hover:underline">
              карточки
            </Link>{" "}
            и оцени несколько слов — статистика появится здесь.
          </p>
        </Card>
      )}

      <section className="border-t border-zinc-800 pt-6">
        <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Управление данными
        </h2>
        <p className="mb-4 text-sm text-zinc-400">
          Сбросить весь словарь, тексты, упражнения и прогресс — вернёт сайт к
          дефолтному набору.
        </p>
        <Button
          variant="danger"
          onClick={() => {
            if (
              confirm(
                "Удалить все данные и вернуться к дефолтным? Прогресс будет потерян."
              )
            ) {
              resetAllData();
              refresh();
            }
          }}
        >
          Сбросить все данные
        </Button>
      </section>
    </div>
  );
}

function StatusBar({
  counts,
}: {
  counts: { known: number; hard: number; learning: number; new: number };
}) {
  const total = Math.max(
    1,
    counts.known + counts.hard + counts.learning + counts.new
  );
  const seg = (n: number) => `${(n / total) * 100}%`;
  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full bg-zinc-800">
      {counts.known > 0 && (
        <div
          className="bg-gradient-to-r from-emerald-500 to-emerald-400"
          style={{ width: seg(counts.known) }}
        />
      )}
      {counts.hard > 0 && (
        <div
          className="bg-gradient-to-r from-amber-500 to-amber-400"
          style={{ width: seg(counts.hard) }}
        />
      )}
      {counts.learning > 0 && (
        <div
          className="bg-gradient-to-r from-rose-500 to-rose-400"
          style={{ width: seg(counts.learning) }}
        />
      )}
      {counts.new > 0 && (
        <div className="bg-zinc-600" style={{ width: seg(counts.new) }} />
      )}
    </div>
  );
}

function LegendItem({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-3 w-3 rounded-sm ${color}`} />
      <span className="text-zinc-300">{label}</span>
      <span className="ml-auto font-medium text-zinc-100">{value}</span>
    </div>
  );
}
