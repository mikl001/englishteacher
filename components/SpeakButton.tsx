"use client";

import { MouseEvent } from "react";
import { speak } from "@/lib/speech";

export function SpeakButton({
  text,
  size = "md",
  className = "",
}: {
  text: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dims =
    size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const iconSize = size === "sm" ? 14 : size === "lg" ? 22 : 18;

  function onClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    speak(text);
  }

  return (
    <button
      onClick={onClick}
      title={`Прослушать: ${text}`}
      aria-label={`Прослушать ${text}`}
      className={`inline-flex items-center justify-center rounded-full text-zinc-500 transition-all duration-150 hover:bg-zinc-800 hover:text-indigo-300 ${dims} ${className}`}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    </button>
  );
}
