"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReadingText, Word } from "@/lib/types";
import { addWord, findWordByEnglish, getTexts, getUserLevel, meetsLevel } from "@/lib/storage";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { SpeakButton } from "@/components/SpeakButton";

type Token = { text: string; isWord: boolean };

function tokenize(text: string): Token[] {
  const parts = text.split(/([A-Za-z][A-Za-z']*)/);
  return parts
    .filter((p) => p.length > 0)
    .map((p) => ({ text: p, isWord: /^[A-Za-z]/.test(p) }));
}

export default function ReadingPage() {
  const [texts, setTexts] = useState<ReadingText[] | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    const level = getUserLevel();
    setTexts(getTexts().filter((t) => meetsLevel(t.level, level)));
  }, []);

  // Если currentId ссылается на исчезнувший текст (после сброса данных) —
  // сбрасываем выбор в эффекте, не в фазе рендера.
  useEffect(() => {
    if (currentId && texts && !texts.find((t) => t.id === currentId)) {
      setCurrentId(null);
    }
  }, [currentId, texts]);

  if (texts === null) {
    return <div className="text-zinc-500">Загрузка…</div>;
  }

  const currentText = currentId
    ? texts.find((t) => t.id === currentId) ?? null
    : null;

  if (currentText) {
    return <ReadingView text={currentText} onBack={() => setCurrentId(null)} />;
  }

  // Список текстов: показываем когда currentId === null
  // или когда выбранный id указывает на исчезнувший текст (эффект выше его сбросит).
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
        Чтение
      </h1>
      <p className="text-sm text-zinc-400">
        Нажми на слово в тексте — увидишь перевод или сможешь добавить новое.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {texts.map((t) => (
          <button
            key={t.id}
            onClick={() => setCurrentId(t.id)}
            className="group text-left transition-all duration-200 hover:-translate-y-0.5"
          >
            <Card className="h-full p-5 transition-all group-hover:border-zinc-700 group-hover:bg-zinc-900/80">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-lg font-semibold text-zinc-100">
                  {t.title}
                </h2>
                {t.level && <LevelBadge level={t.level} />}
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-zinc-400">
                {t.content}
              </p>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}

function LevelBadge({ level }: { level: "A1" | "A2" | "B1" | "B2" | "C1" }) {
  const tone =
    level === "A1"
      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
      : level === "A2"
      ? "bg-teal-500/10 text-teal-300 border-teal-500/30"
      : level === "B1"
      ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
      : level === "B2"
      ? "bg-orange-500/10 text-orange-300 border-orange-500/30"
      : "bg-rose-500/10 text-rose-300 border-rose-500/30";
  return (
    <span className={`rounded-md border px-2 py-0.5 font-mono text-xs ${tone}`}>
      {level}
    </span>
  );
}

function ReadingView({
  text,
  onBack,
}: {
  text: ReadingText;
  onBack: () => void;
}) {
  const tokens = useMemo(() => tokenize(text.content), [text.content]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (selectedIdx === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedIdx(null);
    }
    // Используем click (а не mousedown), чтобы onClick на самом span успел
    // обработаться первым и переключить выделение без моргания popover.
    function onDocClick(e: MouseEvent) {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-word]") && !t.closest("[data-popover]")) {
        setSelectedIdx(null);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onDocClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onDocClick);
    };
  }, [selectedIdx]);

  const selectedWord =
    selectedIdx !== null ? tokens[selectedIdx]?.text ?? null : null;

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={onBack}
        className="mb-6 text-sm text-zinc-500 transition-colors hover:text-zinc-100"
      >
        ← Все тексты
      </button>

      <div className="mb-5 flex items-baseline justify-between gap-3 sm:mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
          {text.title}
        </h1>
        {text.level && <LevelBadge level={text.level} />}
      </div>

      <div className="relative text-base leading-relaxed text-zinc-300 sm:text-lg">
        {tokens.map((tok, i) => {
          if (!tok.isWord) return <span key={i}>{tok.text}</span>;
          const isSelected = selectedIdx === i;
          return (
            <span key={i} className="relative inline-block">
              <span
                data-word
                onClick={() => setSelectedIdx(i)}
                className={`cursor-pointer rounded px-0.5 transition-colors duration-100 hover:bg-indigo-500/15 hover:text-indigo-200 ${
                  isSelected ? "bg-indigo-500/25 text-indigo-100" : ""
                }`}
              >
                {tok.text}
              </span>
              {isSelected && selectedWord && (
                <WordPopover
                  word={selectedWord}
                  onClose={() => setSelectedIdx(null)}
                />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function WordPopover({
  word,
  onClose,
}: {
  word: string;
  onClose: () => void;
}) {
  const [entry, setEntry] = useState<Word | null | undefined>(undefined);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEntry(findWordByEnglish(word) ?? null);
    setDraft("");
    // requestAnimationFrame вместо setTimeout — фокус ставится после layout,
    // и если компонент размонтируется до этого, rAF будет отменён в cleanup.
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [word]);

  if (entry === undefined) return null;

  function save() {
    if (!draft.trim()) return;
    addWord(word, draft);
    setEntry(findWordByEnglish(word) ?? null);
  }

  return (
    <span
      data-popover
      className="animate-pop-in absolute left-0 top-full z-20 mt-2 block w-72 max-w-[min(18rem,calc(100vw-2rem))] origin-top rounded-xl border border-zinc-700 bg-zinc-900/95 p-4 text-left text-sm shadow-2xl backdrop-blur-md"
      style={{ fontStyle: "normal" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="font-mono text-base font-semibold text-zinc-100">
            {word.toLowerCase()}
          </span>
          <SpeakButton text={word} size="sm" />
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 transition-colors hover:text-zinc-100"
          aria-label="Закрыть"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>

      {entry ? (
        <>
          <div className="mt-3 text-base text-zinc-200">{entry.russian}</div>
          {entry.example && (
            <div className="mt-2 text-xs italic text-zinc-500">
              {entry.example}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mt-3 text-xs text-zinc-500">
            Нет в словаре. Введи перевод — сохраню.
          </div>
          <div className="mt-2 flex gap-2">
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
              }}
              placeholder="перевод"
              className="flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-base text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none sm:text-sm"
            />
            <Button size="sm" onClick={save} disabled={!draft.trim()}>
              OK
            </Button>
          </div>
        </>
      )}
    </span>
  );
}
