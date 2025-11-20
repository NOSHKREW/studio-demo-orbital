"use client";

import { TypingAnimation } from "@/components/ui/typing-animation";

export function LandingAbout() {
  return (
    <section
      id="sobre"
      className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-16 text-center text-white/80 md:py-24"
    >
      <TypingAnimation text="Uma demo viva para quem quer presença em escala" />

      <p className="mx-auto max-w-3xl text-sm text-white/70 md:text-base">
        Baseamos esta demo em histórias reais: fotógrafos, clínicas, escritórios
        boutique, operações gastronômicas e startups de serviços. O layout se
        adapta ao branding e aos rituais de cada negócio sem reiniciar tudo do
        zero.
      </p>
      <p className="mx-auto max-w-2xl text-xs text-white/50 md:text-sm">
        Mostramos como estruturamos jornadas completas — agendamentos, vendas,
        integrações e conteúdos que mantêm o público conectado. Você escolhe o
        ponto do mapa, nós criamos o caminho digital para chegar lá.
      </p>
    </section>
  );
}
