"use client";

import Link from "next/link";
import { Globe, MessageCircle, Send, Share2 } from "lucide-react";

const links = [
  { title: "Serviços", href: "#servicos" },
  { title: "Projetos", href: "#projetos" },
  { title: "Mapa", href: "#mapa" },
  { title: "Contato", href: "#contato" },
];

export function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-white/5 py-10 text-white/70">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-white">Studio Orbital</p>
            <p className="mt-1 text-xs text-white/50">
              Demo de site genérico para empresas locais.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs">
            {links.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-white/60 transition hover:text-white"
              >
                {link.title}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {[Globe, Share2, MessageCircle, Send].map((Icon) => (
              <button
                key={Icon.displayName ?? Icon.name}
                className="rounded-full border border-white/10 p-2 text-white/60 transition hover:border-cyan-400/60 hover:text-cyan-300"
                type="button"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-white/40">
          © {new Date().getFullYear()} Studio Orbital — Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
