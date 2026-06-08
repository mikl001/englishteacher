// Тонкая полоска прогресса с градиентным заполнением.
export function ProgressBar({
  value,
  max,
  className = "",
  tone = "indigo",
}: {
  value: number;
  max: number;
  className?: string;
  tone?: "indigo" | "emerald" | "zinc";
}) {
  const pct = max === 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
  const fill =
    tone === "emerald"
      ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
      : tone === "zinc"
      ? "bg-zinc-200"
      : "bg-gradient-to-r from-indigo-500 to-indigo-400";
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-zinc-800 ${className}`}
    >
      <div
        className={`h-full ${fill} transition-all duration-300`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
