"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  text: string;
  duration?: number;
  className?: string;
}

export function TypingAnimation({
  text,
  duration = 200,
  className,
}: TypingAnimationProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIndex(0));
    return () => cancelAnimationFrame(frame);
  }, [text]);

  useEffect(() => {
    if (index >= text.length) return;
    const timeout = setTimeout(() => {
      setIndex((prev) => Math.min(prev + 1, text.length));
    }, duration);
    return () => clearTimeout(timeout);
  }, [duration, index, text.length]);

  const displayedText = text.substring(0, index) || text;

  return (
    <h2
      className={cn(
        "font-display text-center text-4xl font-bold leading-tight tracking-[-0.02em] text-white drop-shadow-sm md:text-5xl",
        className,
      )}
    >
      {displayedText}
    </h2>
  );
}
