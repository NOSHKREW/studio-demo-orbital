"use client";

import { TypingAnimation } from "@/components/ui/typing-animation";

export function LandingAbout() {
  return (
    <section
      id="sobre"
      className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-16 text-center text-white/80 md:py-24"
    >
      <TypingAnimation text="Uma única demo para qualquer tipo de empresa" />

      <p className="mx-auto max-w-3xl text-sm text-white/70 md:text-base">
        Esta página é uma demonstração genérica pensada para empresas locais:
        estética, saúde, alimentação, serviços automotivos, educação e muito
        mais. Todo o layout foi criado para ser rapidamente adaptado à
        identidade visual e à comunicação de cada negócio.
      </p>
      <p className="mx-auto max-w-2xl text-xs text-white/50 md:text-sm">
        A ideia é simples: mostrar o que um site profissional consegue fazer por
        qualquer empresa — agendamentos, pagamentos, integrações e presença
        online sólida — sem ficar preso a um único nicho.
      </p>
    </section>
  );
}
