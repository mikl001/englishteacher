"use client";

import { useEffect, useState } from "react";
import type { Level } from "@/lib/types";
import { getUserLevel, setUserLevel } from "@/lib/storage";

const LEVELS: { value: Level; hint: string }[] = [
  { value: "A1", hint: "начальный" },
  { value: "A2", hint: "элементарный" },
  { value: "B1", hint: "средний" },
  { value: "B2", hint: "выше среднего" },
  { value: "C1", hint: "продвинутый" },
];

// Глобальный селектор уровня. Сохраняется в localStorage.
// При смене вызывает onChange — страницы могут перезагрузить свои списки.
export function LevelSelector({
  onChange,
  compact = false,
}: {
  onChange?: (level: Level) => void;
  compact?: boolean;
}) {
  const [level, setLevel] = useState<Level | null>(null);

  useEffect(() => {
    setLevel(getUserLevel());
  }, []);

  function change(l: Level) {
    setLevel(l);
    setUserLevel(l);
    onChange?.(l);
  }

  if (level === null) {
    // Заглушка для SSR — рисуем «скелет» из пяти плашек, чтобы не было flash
    return (
      <div className="flex flex-wrap gap-2">
        {LEVELS.map((l) => (
          <div
            key={l.value}
            className="h-10 w-14 animate-pulse rounded-lg bg-zinc-800/60"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {LEVELS.map((l) => {
        const active = level === l.value;
        return (
          <button
            key={l.value}
            onClick={() => change(l.value)}
            title={l.hint}
            className={`relative flex flex-col items-center justify-center rounded-lg px-4 transition-all duration-150 ${
              compact ? "py-1.5" : "py-2"
            } ${
              active
                ? "bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-[0_4px_14px_-2px_rgba(99,102,241,0.5)]"
                : "border border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800"
            }`}
          >
            <span className="font-mono text-sm font-semibold">{l.value}</span>
            {!compact && (
              <span
                className={`text-[10px] ${
                  active ? "text-indigo-100" : "text-zinc-500"
                }`}
              >
                {l.hint}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
