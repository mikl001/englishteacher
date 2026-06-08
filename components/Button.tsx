import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  // Главный CTA — яркий, чтобы выделяться на тёмном фоне
  primary:
    "bg-gradient-to-b from-indigo-500 to-indigo-600 text-white hover:from-indigo-400 hover:to-indigo-500 active:from-indigo-600 active:to-indigo-700 shadow-[0_4px_14px_-2px_rgba(99,102,241,0.4)]",
  secondary:
    "border border-zinc-700 bg-zinc-900/80 text-zinc-100 hover:border-zinc-600 hover:bg-zinc-800 active:bg-zinc-800/80",
  ghost: "text-zinc-300 hover:bg-zinc-800/80 hover:text-zinc-100 active:bg-zinc-800",
  danger:
    "bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/15 hover:border-rose-500/50 active:bg-rose-500/20",
  success:
    "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/15 hover:border-emerald-500/50 active:bg-emerald-500/20",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none";
  return (
    <button
      className={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
