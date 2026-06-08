import { ReactNode } from "react";
import { Card } from "./Card";

// KPI-карточка. Цветной маркер слева добавляет семантику.
export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: ReactNode;
  accent?: "indigo" | "emerald" | "amber" | "rose";
}) {
  const accentGradient =
    accent === "indigo"
      ? "from-indigo-500 to-indigo-300"
      : accent === "emerald"
      ? "from-emerald-500 to-emerald-300"
      : accent === "amber"
      ? "from-amber-500 to-amber-300"
      : accent === "rose"
      ? "from-rose-500 to-rose-300"
      : null;

  return (
    <Card className="relative overflow-hidden p-5">
      {accentGradient && (
        <div
          className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${accentGradient}`}
        />
      )}
      <div className="text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-zinc-500">{hint}</div>}
    </Card>
  );
}
