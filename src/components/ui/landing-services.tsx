"use client";

import Image from "next/image";

import { TypingAnimation } from "@/components/ui/typing-animation";

const services = [
  {
    title: "Sites autorais e performáticos",
    base: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    overlay:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80",
    description:
      "Design premium pronto para receber identidade e integrações exclusivas.",
  },
  {
    title: "Integrações e automações",
    base: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80",
    overlay:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80",
    description:
      "WhatsApp, Google Agenda, ERPs e CRMs conectados para o cliente não perder nenhum pedido.",
  },
  {
    title: "Agendamentos e pagamentos",
    base: "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=800&q=80",
    overlay:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    description:
      "Fluxos de reservas, recorrência e checkout com Pix e cartão em poucos cliques.",
  },
  {
    title: "Conteúdo e campanhas locais",
    base: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    overlay:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
    description:
      "Landing pages com promoções, menus, planos e depoimentos para cada segmento.",
  },
];

export function LandingServices() {
  return (
    <section
      id="servicos"
      className="relative z-10 mx-auto w-full max-w-5xl px-4 py-16 md:py-24"
    >
      <div className="text-center">
        <TypingAnimation text="Serviços e integrações que entregamos" />
        <p className="mt-4 text-base text-white/70">
          Uma base pensada para customizar em minutos: trocamos imagens, textos
          e integrações para cada proposta e já chegamos prontos na apresentação.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {services.map((service) => (
          <article
            key={service.title}
            className="group flex h-[320px] flex-col rounded-[32px] bg-white/5 p-6 shadow-[0_35px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition hover:bg-white/10"
          >
            <div className="relative flex flex-1 items-center justify-center">
              <div className="relative h-32 w-40">
                <Image
                  src={service.base}
                  alt={`${service.title} base`}
                  fill
                  sizes="200px"
                  className="rounded-2xl object-cover shadow-lg shadow-black/40 transition duration-500 group-hover:-rotate-6 group-hover:scale-105"
                />
              </div>
              <div className="relative h-32 w-40 translate-x-12 -translate-y-6">
                <Image
                  src={service.overlay}
                  alt={`${service.title} destaque`}
                  fill
                  sizes="200px"
                  className="rounded-2xl object-cover shadow-2xl shadow-black/50 transition duration-500 group-hover:rotate-3 group-hover:scale-110"
                />
              </div>
            </div>
            <div className="mt-auto">
              <h3 className="text-lg font-semibold text-white">
                {service.title}
              </h3>
              <p className="text-sm text-white/70">{service.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
