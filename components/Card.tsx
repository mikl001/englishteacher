import { ReactNode } from "react";

// Универсальная тёмная поверхность с лёгкой подсветкой через border.
export function Card({
  children,
  className = "",
  as: Component = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return (
    <Component
      className={`rounded-xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm shadow-[0_4px_20px_-8px_rgba(0,0,0,0.5)] ${className}`}
    >
      {children}
    </Component>
  );
}
