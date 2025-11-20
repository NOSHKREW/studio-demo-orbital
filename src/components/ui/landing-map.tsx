"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useInView, useReducedMotion } from "framer-motion";

import { TypingAnimation } from "@/components/ui/typing-animation";

const LazyWorldMap = dynamic(
  () =>
    import("@/components/ui/map").then((mod) => ({
      default: mod.WorldMap,
    })),
  {
    ssr: false,
  },
);

const MapPlaceholder = () => (
  <div className="h-[520px] rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/5 opacity-80 backdrop-blur-sm" />
);

export function LandingMap() {
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const mapInView = useInView(mapWrapperRef, { amount: 0.3, margin: "-20% 0px" });
  const prefersReducedMotion = useReducedMotion();
  const shouldRenderMap = mapInView && !prefersReducedMotion;

  return (
    <section id="mapa" className="relative z-10 w-full px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <TypingAnimation text="Clientes pelo Brasil inteiro" />
        <p className="mt-4 text-base text-white/70">
          Os arcos mostram de onde partem nossos projetos e para onde entregamos
          resultados. Cada ponto indica uma etapa ativa entre Brasília e os hubs
          parceiros espalhados pelo país.
        </p>
      </div>
      <div ref={mapWrapperRef} className="mx-auto mt-12 max-w-5xl space-y-6">
        {shouldRenderMap ? (
          <LazyWorldMap showCityMarkers={false} />
        ) : (
          <MapPlaceholder />
        )}
        <section className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 px-6 py-6 text-sm text-white/80 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-white">Rotas em movimento:</p>
            <ul className="space-y-2 text-xs uppercase tracking-[0.35em] text-cyan-100">
              <li>• Projetos que nascem em Brasília</li>
              <li>• Conexões com hubs estratégicos no país</li>
              <li>• Entregas para clientes em expansão</li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-white">Por que esses caminhos?</p>
            <p>
              As rotas destacam onde já temos cases e para onde levamos novas
              marcas. É um mapa vivo dos clientes que confiam no Studio Orbital.
            </p>
            <a
              href="#contato"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/70 transition hover:border-cyan-300 hover:text-white"
            >
              fale com o time
            </a>
          </div>
        </section>
      </div>
    </section>
  );
}
