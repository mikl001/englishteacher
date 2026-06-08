import Link from "next/link";
import { Card } from "@/components/Card";

const features = [
  {
    title: "AI-репетитор",
    description: "Беседа с агентом по-английски. Аккуратно исправляет ошибки и держит разговор живым.",
    icon: "💬",
    href: "/practice",
    tag: "новое",
  },
  {
    title: "Карточки со словами",
    description: "Интервальное повторение: что выучил — уходит в конец, новое всегда впереди.",
    icon: "◫",
    href: "/cards",
  },
  {
    title: "Чтение с переводом",
    description: "Клик по любому слову — перевод и пример. Незнакомое сохраняется в твой словарь.",
    icon: "❝",
    href: "/reading",
  },
  {
    title: "Тренажёр написания",
    description: "По переводу набираешь английский вариант. Без подсказок, проверка по символу.",
    icon: "⌨",
    href: "/typing",
  },
  {
    title: "Грамматика по темам",
    description: "Упражнения с разбором правила. От Present Simple до условных и пассивного залога.",
    icon: "✎",
    href: "/grammar",
  },
  {
    title: "Словарь с фильтрами",
    description: "Все слова в одном месте. Фильтры по статусу, поиск, ручное добавление.",
    icon: "❒",
    href: "/dictionary",
  },
  {
    title: "Прогресс и привычка",
    description: "Серия дней, тепловая карта 35 дней, распределение словаря по статусам.",
    icon: "▦",
    href: "/progress",
  },
];

const stats = [
  { value: "1200", label: "слов в наборе" },
  { value: "120", label: "текстов · A1–B1" },
  { value: "400", label: "упражнений" },
  { value: "7", label: "инструментов" },
];

const stack = [
  { name: "Next.js 16", note: "App Router + Turbopack" },
  { name: "TypeScript", note: "строгие типы" },
  { name: "Tailwind v4", note: "дизайн-система" },
  { name: "localStorage", note: "без бэкенда" },
  { name: "Web Speech API", note: "озвучка" },
  { name: "OpenAI-compatible", note: "Mistral / OpenRouter / Ollama" },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden pt-10 pb-24 sm:pt-20 sm:pb-32">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-[800px] -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-40 -z-10 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />

        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400 backdrop-blur">
            <span className="font-mono text-zinc-500">v1</span>
            <span className="h-1 w-1 rounded-full bg-zinc-700" />
            Личный pet-проект · open source
          </div>

          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-zinc-100 sm:text-6xl md:text-7xl">
            Учи английский{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
              по-своему
            </span>
            .
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl">
            Карточки, чтение с переводом, тренажёр написания и AI-репетитор —
            в одной чистой тёмной оболочке. Без аккаунта, без подписок, работает в браузере.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-gradient-to-b from-indigo-500 to-indigo-600 px-6 text-base font-medium text-white shadow-[0_8px_30px_-8px_rgba(99,102,241,0.6)] transition-all hover:from-indigo-400 hover:to-indigo-500"
            >
              Открыть курс →
            </Link>
            <Link
              href="/about"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900/60 px-6 text-base font-medium text-zinc-100 backdrop-blur transition-all hover:border-zinc-600 hover:bg-zinc-800"
            >
              Гайд по проекту
            </Link>
          </div>

          {/* Метрики под CTA */}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-mono text-3xl font-semibold tracking-tight text-zinc-100">
                  {s.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Мок-превью интерфейса */}
      <section className="pb-24">
        <div className="mx-auto max-w-5xl">
          <Card className="relative overflow-hidden p-2 sm:p-3">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-6 sm:p-10">
              {/* Имитация окна карточки */}
              <div className="mx-auto max-w-md space-y-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-wider text-zinc-500">
                  <span>Карточка 120 из 1200</span>
                  <span>Природа</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full w-[10%] bg-gradient-to-r from-indigo-500 to-indigo-400" />
                </div>

                <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 p-10 backdrop-blur-sm">
                  <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/15 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
                  <div className="relative text-center">
                    <div className="font-mono text-5xl font-semibold tracking-tight text-zinc-100">
                      mountain
                    </div>
                    <div className="mt-8 border-t border-zinc-800 pt-6">
                      <div className="text-2xl text-zinc-200">гора</div>
                      <div className="mt-3 text-sm italic text-zinc-500">
                        We climbed the mountain last summer.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 py-2 text-center text-rose-300">
                    Не знаю
                  </div>
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 py-2 text-center text-amber-300">
                    Сложное
                  </div>
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-2 text-center text-emerald-300">
                    Знаю
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Фичи */}
      <section className="pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
              Семь инструментов под одной крышей
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
              Каждый отвечает за свою сторону языка. Прогресс по карточкам копится в общую статистику.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="group transition-all duration-200 hover:-translate-y-1"
              >
                <Card className="h-full p-6 transition-all group-hover:border-zinc-700 group-hover:bg-zinc-900/80">
                  <div className="flex items-start justify-between">
                    <div className="text-3xl">{f.icon}</div>
                    {f.tag && (
                      <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-300">
                        {f.tag}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 text-lg font-semibold text-zinc-100">
                    {f.title}
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{f.description}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-indigo-400 transition-all group-hover:gap-2">
                    Открыть →
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Стек */}
      <section className="pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <div className="text-xs uppercase tracking-wider text-zinc-500">Стек</div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
              Без бэкенда. Без подписок.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
              Всё работает прямо в браузере. Прогресс и словарь — в твоём{" "}
              <span className="font-mono text-zinc-300">localStorage</span>.
              Можно офлайн.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stack.map((s) => (
              <div
                key={s.name}
                className="flex items-baseline justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3"
              >
                <div className="font-mono text-sm font-semibold text-zinc-100">
                  {s.name}
                </div>
                <div className="text-xs text-zinc-500">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Финальный CTA */}
      <section className="pb-24">
        <div className="mx-auto max-w-3xl">
          <Card className="relative overflow-hidden p-10 text-center glow-indigo">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/10 via-transparent to-fuchsia-500/10" />
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
              Готов начать?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-zinc-400">
              Прогресс сохраняется в твоём браузере. Никакого аккаунта.
              Пять минут — и первая порция слов уже в работе.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-gradient-to-b from-indigo-500 to-indigo-600 px-6 text-base font-medium text-white shadow-[0_8px_30px_-8px_rgba(99,102,241,0.6)] transition-all hover:from-indigo-400 hover:to-indigo-500"
              >
                Открыть курс →
              </Link>
              <Link
                href="/practice"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900/60 px-6 text-base font-medium text-zinc-100 backdrop-blur transition-all hover:border-zinc-600 hover:bg-zinc-800"
              >
                Сразу к чату с AI
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 py-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
          <div className="font-mono">
            english<span className="text-indigo-400">.</span>
          </div>
          <div className="flex gap-5">
            <Link href="/about" className="hover:text-zinc-300">
              О проекте
            </Link>
            <Link href="/dashboard" className="hover:text-zinc-300">
              Курс
            </Link>
            <Link href="/practice" className="hover:text-zinc-300">
              Практика
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
