"use client";

import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Compass, Home, Map, MessageCircle, Sparkles, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    id: "inicio",
    label: "Início",
    icon: Home,
    gradient: ["#4EFFE8", "#3D80FF"],
  },
  {
    id: "sobre",
    label: "Sobre",
    icon: Sparkles,
    gradient: ["#7C5DFF", "#C56BFF"],
  },
  {
    id: "servicos",
    label: "Serviços",
    icon: Star,
    gradient: ["#FF8C6F", "#FF5EBD"],
  },
  {
    id: "galeria",
    label: "Galeria",
    icon: Compass,
    gradient: ["#78F7FF", "#5C6CFF"],
  },
  {
    id: "mapa",
    label: "Mapa",
    icon: Map,
    gradient: ["#5BD7FF", "#5799FF"],
  },
  {
    id: "contato",
    label: "Contato",
    icon: MessageCircle,
    gradient: ["#FFC471", "#FF7AAE"],
  },
];

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const smoothScroll = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 flex items-center justify-center transition-all",
        scrolled ? "py-2" : "py-3",
      )}
    >
      <nav className="flex w-[95%] max-w-5xl items-center justify-between rounded-full border border-white/10 bg-black/60 px-4 py-2 shadow-lg shadow-cyan-500/5 backdrop-blur-2xl">
        <Link
          href="#inicio"
          onClick={() => smoothScroll("inicio")}
          className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/70"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-cyan-300 to-blue-500 shadow-[0_0_12px_rgba(64,235,255,0.8)]" />
          Studio Orbital
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => smoothScroll(item.id)}
              style={
                {
                  "--gradient-from": item.gradient[0],
                  "--gradient-to": item.gradient[1],
                } as React.CSSProperties
              }
              className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/70 transition-all duration-300 hover:w-32"
            >
              <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "linear-gradient(120deg, var(--gradient-from), var(--gradient-to))" }} />
              <item.icon className="relative z-10 h-4 w-4 transition-all duration-300 group-hover:scale-0" />
              <span className="absolute z-10 scale-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white transition-all duration-300 group-hover:scale-100">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <Button
          size="sm"
          onClick={() => smoothScroll("contato")}
          className="rounded-full bg-gradient-to-r from-cyan-300 to-blue-500 px-5 text-xs font-semibold uppercase tracking-[0.35em] text-black shadow-lg shadow-cyan-500/30"
        >
          Orçamento
        </Button>
      </nav>
    </header>
  );
}
