import type { DailyProgress } from "@/lib/types";

// Сетка активности 35 дней — на тёмном фоне используем индиго-шкалу.
export function Heatmap({ days }: { days: DailyProgress[] }) {
  function tone(n: number): string {
    if (n === 0) return "bg-zinc-800/70 ring-1 ring-inset ring-zinc-800";
    if (n < 4) return "bg-indigo-500/30";
    if (n < 10) return "bg-indigo-500/55";
    if (n < 20) return "bg-indigo-500/80";
    return "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]";
  }

  const ordered = [...days].reverse();

  return (
    <div className="space-y-3">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${ordered.length}, minmax(0, 1fr))`,
        }}
      >
        {ordered.map((d) => (
          <div
            key={d.date}
            title={`${d.date}: ${d.wordsReviewed} повторений`}
            className={`aspect-square rounded-[3px] transition-all ${tone(d.wordsReviewed)}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-end gap-1.5 text-xs text-zinc-500 sm:gap-2">
        <span>меньше</span>
        <div className="h-3 w-3 rounded-sm bg-zinc-800/70 ring-1 ring-inset ring-zinc-800" />
        <div className="h-3 w-3 rounded-sm bg-indigo-500/30" />
        <div className="h-3 w-3 rounded-sm bg-indigo-500/55" />
        <div className="h-3 w-3 rounded-sm bg-indigo-500/80" />
        <div className="h-3 w-3 rounded-sm bg-indigo-400" />
        <span>больше</span>
      </div>
    </div>
  );
}
