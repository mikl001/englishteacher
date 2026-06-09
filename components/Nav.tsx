"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Дашборд" },
  { href: "/practice", label: "Практика" },
  { href: "/cards", label: "Карточки" },
  { href: "/typing", label: "Написание" },
  { href: "/reading", label: "Чтение" },
  { href: "/grammar", label: "Грамматика" },
  { href: "/dictionary", label: "Словарь" },
  { href: "/progress", label: "Прогресс" },
];

// Маршруты, на которых учебная навигация не показывается
// (там своя промо-шапка / лендинг-стиль)
const HIDDEN_ON = ["/", "/about"];

export function Nav() {
  const pathname = usePathname();

  if (HIDDEN_ON.includes(pathname)) return <LandingHeader />;

  function isActive(href: string): boolean {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:gap-6 sm:px-6">
        <Link
          href="/"
          className="shrink-0 font-mono text-sm font-semibold tracking-tight text-zinc-100"
          title="На лендинг"
        >
          english
          <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
            .
          </span>
        </Link>
        {/* Обёртка нужна для градиент-затухания справа на узких экранах */}
        <div className="relative min-w-0 flex-1">
          <nav className="no-scrollbar flex items-center gap-1 overflow-x-auto">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-zinc-100 text-zinc-950 shadow-[0_0_20px_-4px_rgba(255,255,255,0.2)]"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          {/* Подсказка о скрытом контенте — fade-out у правого края */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-zinc-950/80 to-transparent sm:hidden" />
        </div>
      </div>
    </header>
  );
}

// Облегчённая промо-шапка для лендинга и страницы «О проекте».
function LandingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/60 bg-zinc-950/60 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight text-zinc-100"
        >
          english
          <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
            .
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/about"
            className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-zinc-100 sm:inline-flex"
          >
            Гайд
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 rounded-md bg-gradient-to-b from-indigo-500 to-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-[0_4px_14px_-2px_rgba(99,102,241,0.4)] transition-all hover:from-indigo-400 hover:to-indigo-500"
          >
            Открыть курс →
          </Link>
        </div>
      </div>
    </header>
  );
}
