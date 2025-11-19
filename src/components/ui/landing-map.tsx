"use client";

import { WorldMap } from "@/components/ui/map";
import { TypingAnimation } from "@/components/ui/typing-animation";

const brasilia = { lat: -15.7975, lng: -47.8919 };
const destinos = [
  { lat: -15.7758, lng: -47.7971, label: "Asa Norte" },
  { lat: -15.8342, lng: -47.913, label: "Asa Sul" },
  { lat: -15.8281, lng: -47.9456, label: "Sudoeste" },
  { lat: -15.8386, lng: -48.0209, label: "Águas Claras" },
  { lat: -15.6557, lng: -47.7991, label: "Lago Norte" },
];

const dots = destinos.map((destino) => ({
  start: { ...brasilia, label: "Brasília" },
  end: destino,
}));

export function LandingMap() {
  return (
    <section id="mapa" className="relative z-10 w-full px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <TypingAnimation text="Brasília é o centro da operação" />
        <p className="mt-4 text-base text-white/70">
          Atendemos presencialmente no Distrito Federal e conectamos negócios
          vizinhos com o mesmo cuidado. Cada ponto revela um cliente ativo e um
          fluxo pronto para ser personalizado.
        </p>
      </div>
      <div className="mx-auto mt-12 max-w-5xl space-y-6">
        <WorldMap dots={dots} />
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white/80">
          <div>
            <p className="text-white">Pontos ativos no DF:</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {destinos.map((destino) => (
                <span
                  key={destino.label}
                  className="flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-100"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                  {destino.label}
                </span>
              ))}
            </div>
          </div>
          <a
            href="#contato"
            className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/70 transition hover:border-cyan-300 hover:text-white"
          >
            ver rota até o estúdio
          </a>
        </div>
      </div>
    </section>
  );
}
