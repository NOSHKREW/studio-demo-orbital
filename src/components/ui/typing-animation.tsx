"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  text: string;
  duration?: number;
  className?: string;
}

export function TypingAnimation({
  text,
  duration = 90,
  className,
}: TypingAnimationProps) {
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: "-20% 0px" });

  useEffect(() => {
    if (!isInView) return;
    const frame = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(frame);
  }, [isInView]);

  useEffect(() => {
    if (!started) return;
    const frame = requestAnimationFrame(() => setIndex(0));
    return () => cancelAnimationFrame(frame);
  }, [text, started]);

  useEffect(() => {
    if (!started || index >= text.length) return;
    const timeout = setTimeout(() => {
      setIndex((prev) => Math.min(prev + 1, text.length));
    }, duration);
    return () => clearTimeout(timeout);
  }, [duration, index, started, text.length]);

  const displayedText = started
    ? text.substring(0, Math.max(index, 1))
    : "";

  return (
    <h2
      ref={headingRef}
      className={cn(
        "font-display text-center text-4xl font-bold leading-tight tracking-[-0.02em] text-white drop-shadow-sm md:text-5xl",
        className,
      )}
    >
      {displayedText}
    </h2>
  );
}
