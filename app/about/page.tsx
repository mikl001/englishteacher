import Link from "next/link";
import { Card } from "@/components/Card";

export const metadata = {
  title: "О проекте — Английский",
  description:
    "Личный курс английского: карточки, чтение, грамматика, AI-репетитор. Сделано как pet-проект на Next.js 16 + Tailwind v4 без бэкенда.",
};

const principles = [
  {
    title: "Минимум кода",
    body: "Меньше кода — меньше того, что может сломаться. Никаких ORM, библиотек состояния, формовых хелперов. React + Tailwind + localStorage.",
  },
  {
    title: "Без бэкенда",
    body: "Всё хранится в браузере пользователя. Деплой одной кнопкой на Vercel, нет серверного состояния и платежей за БД.",
  },
  {
    title: "Один пользователь",
    body: "Это не SaaS, это личный курс. Никаких аккаунтов, регистраций, общего доступа. Свобода интерфейса без UX-компромиссов под массового пользователя.",
  },
  {
    title: "Дизайн-система",
    body: "Шесть переиспользуемых компонентов (Card, Button, StatCard, ProgressBar, SpeakButton, Heatmap) и одна палитра. Цвета, отступы, скругления — единые везде.",
  },
];

const features = [
  {
    title: "AI-репетитор (Hermes)",
    body: "Чат с языковой моделью через OpenAI-совместимый API. Можно подключить Mistral, OpenRouter, Ollama локально — всё одной формой настроек. Системный промпт настроен на роль терпеливого репетитора уровня A2–B1.",
    files: "app/practice/page.tsx, lib/chat.ts",
  },
  {
    title: "Карточки с интервальным повторением",
    body: "Простая SRS-логика без таймштампов: что отметил «знаю» — уходит в конец очереди. Перезагрузка страницы сохраняет приоритет. Озвучка через Web Speech API.",
    files: "app/cards/page.tsx, components/SpeakButton.tsx",
  },
  {
    title: "Чтение с popover-переводом",
    body: "Текст разбивается регуляркой на токены. Клик по слову — поповер появляется рядом со словом (а не внизу), Esc и клик-вне закрывают. Незнакомое слово сохраняется в общий словарь одним нажатием.",
    files: "app/reading/page.tsx",
  },
  {
    title: "Тренажёр написания",
    body: "Показывается русский перевод — набираешь английский. Enter проверяет и переходит дальше. Прогресс пишется в общий heatmap.",
    files: "app/typing/page.tsx",
  },
  {
    title: "Грамматика по темам",
    body: "16 тем (от Present Simple до пассивного залога и условных). На входе — экран выбора темы. Правильный ответ подсвечивается зелёным, неверный — розовым, объяснение в выделенном блоке.",
    files: "app/grammar/page.tsx, data/default-exercises.json",
  },
  {
    title: "Словарь с фильтрами",
    body: "120 слов по 10 темам. Фильтры по статусам, поиск по строке, форма добавления своих слов. Статус подсвечивается светящейся точкой.",
    files: "app/dictionary/page.tsx",
  },
  {
    title: "Прогресс с heatmap",
    body: "Тепловая карта 35 дней (как GitHub contributions), распределение словаря стек-баром, серия активных дней. Считается из обычного массива записей `DailyProgress` в localStorage.",
    files: "app/progress/page.tsx, components/Heatmap.tsx",
  },
];

const stack = [
  { name: "Next.js 16", body: "App Router, Turbopack, Server + Client Components." },
  { name: "TypeScript", body: "Строгие типы, никаких any. Типы доменной модели в lib/types.ts." },
  { name: "Tailwind v4", body: "@theme inline для шрифтов next/font, без tailwind.config.* — настройка прямо в CSS." },
  { name: "next/font", body: "Inter (UI) и JetBrains Mono (английские слова) с display: swap и кириллицей." },
  { name: "localStorage", body: "Версионирование контента через DEFAULTS_VERSION. Прогресс не теряется при обновлении дефолтов." },
  { name: "Web Speech API", body: "Озвучка без зависимостей и API-ключей. Деградирует молча, если в браузере нет голоса." },
  { name: "OpenAI-compatible chat", body: "Один универсальный клиент для Mistral, OpenRouter, Ollama, vLLM. Настройки в localStorage." },
];

const tree = [
  "app/",
  "├── page.tsx           — лендинг",
  "├── about/             — этот гайд",
  "├── dashboard/         — приветствие, KPI, витрина",
  "├── practice/          — чат с AI",
  "├── cards/             — карточки SRS",
  "├── typing/            — тренажёр написания",
  "├── reading/           — чтение с поповером",
  "├── grammar/           — упражнения по темам",
  "├── dictionary/        — словарь, фильтры, поиск",
  "├── progress/          — heatmap и статистика",
  "├── layout.tsx         — шрифты, шапка, мета",
  "└── globals.css        — палитра, градиент, keyframes",
  "",
  "components/             — Card, Button, Nav, StatCard,",
  "                          ProgressBar, SpeakButton, Heatmap",
  "lib/                    — storage.ts, chat.ts, speech.ts, types.ts",
  "data/                   — default-words.json (120),",
  "                          default-texts.json (18),",
  "                          default-exercises.json (45)",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12">
      {/* Заголовок */}
      <section>
        <div className="text-xs uppercase tracking-wider text-zinc-500">
          Гайд
        </div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
          О проекте
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          Личный курс английского. Один пользователь, ноль аккаунтов, всё в браузере.
          Сделан как pet-проект — отрабатывал дизайн-систему, App Router и
          интеграцию с разными LLM через один OpenAI-совместимый клиент.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-b from-indigo-500 to-indigo-600 px-5 text-sm font-medium text-white shadow-[0_8px_30px_-8px_rgba(99,102,241,0.6)] transition-all hover:from-indigo-400 hover:to-indigo-500"
          >
            Открыть курс →
          </Link>
          <Link
            href="/practice"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900/60 px-5 text-sm font-medium text-zinc-100 transition-all hover:border-zinc-600 hover:bg-zinc-800"
          >
            Попробовать чат с AI
          </Link>
        </div>
      </section>

      {/* Принципы */}
      <section>
        <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Принципы
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {principles.map((p) => (
            <Card key={p.title} className="p-5">
              <div className="text-sm font-semibold text-zinc-100">{p.title}</div>
              <p className="mt-2 text-sm text-zinc-400">{p.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Фичи */}
      <section>
        <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Что внутри
        </h2>
        <div className="mt-4 space-y-3">
          {features.map((f, idx) => (
            <Card key={f.title} className="p-5">
              <div className="flex items-baseline justify-between gap-3">
                <div className="text-base font-semibold text-zinc-100">
                  {f.title}
                </div>
                <div className="font-mono text-xs text-zinc-600">
                  0{idx + 1}
                </div>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{f.body}</p>
              <div className="mt-3 font-mono text-xs text-zinc-500">
                {f.files}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Стек */}
      <section>
        <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Стек
        </h2>
        <Card className="mt-4 divide-y divide-zinc-800">
          {stack.map((s) => (
            <div key={s.name} className="flex items-baseline gap-4 p-4">
              <div className="w-40 shrink-0 font-mono text-sm font-semibold text-zinc-100">
                {s.name}
              </div>
              <div className="text-sm text-zinc-400">{s.body}</div>
            </div>
          ))}
        </Card>
      </section>

      {/* Структура */}
      <section>
        <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Структура
        </h2>
        <Card className="mt-4 p-5">
          <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-zinc-400">
            {tree.join("\n")}
          </pre>
        </Card>
      </section>

      {/* Как запустить */}
      <section>
        <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Как запустить локально
        </h2>
        <Card className="mt-4 p-5">
          <pre className="overflow-x-auto rounded-md bg-zinc-950/60 p-4 font-mono text-xs leading-relaxed text-zinc-300">
{`git clone <repo>
cd englishteacher
npm install
npm run dev
# open http://localhost:3000`}
          </pre>
          <p className="mt-3 text-sm text-zinc-400">
            Для чата с AI зайди в <span className="font-mono text-zinc-300">/practice → Настройки</span>{" "}
            и впиши свой ключ от Mistral / OpenRouter / Ollama. Ключ хранится только в твоём браузере.
          </p>
        </Card>
      </section>

      {/* Деплой */}
      <section>
        <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Деплой на Vercel
        </h2>
        <Card className="mt-4 p-5">
          <ol className="space-y-2 text-sm text-zinc-300">
            <li>
              <span className="mr-2 font-mono text-xs text-zinc-500">01</span>
              Запушь репозиторий на GitHub.
            </li>
            <li>
              <span className="mr-2 font-mono text-xs text-zinc-500">02</span>
              На <span className="font-mono">vercel.com</span> → New Project → выбери репо.
            </li>
            <li>
              <span className="mr-2 font-mono text-xs text-zinc-500">03</span>
              Vercel сам определит Next.js. Никаких env-переменных не нужно — бэкенда нет.
            </li>
            <li>
              <span className="mr-2 font-mono text-xs text-zinc-500">04</span>
              Готово. Каждый push в <span className="font-mono">main</span> = новый деплой.
            </li>
          </ol>
        </Card>
      </section>

      {/* Footer на странице */}
      <footer className="border-t border-zinc-800/60 pt-6 text-center text-xs text-zinc-500">
        Сделано на Next.js 16 · Tailwind v4 · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
