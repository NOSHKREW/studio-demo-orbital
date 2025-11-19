"use client";

import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TypingAnimation } from "@/components/ui/typing-animation";

const infoCards = [
  {
    title: "Atendimento por WhatsApp",
    description: "Respostas em até 15 minutos em horário comercial.",
    value: "(61) 9 9999-0000",
    icon: Phone,
  },
  {
    title: "Envie o briefing por e-mail",
    description: "Arquivos, logos e roteiros são bem-vindos.",
    value: "contato@studioorbital.com",
    icon: Mail,
  },
  {
    title: "Visite o estúdio",
    description: "Agende um café na Asa Norte ou peça um tour virtual.",
    value: "Brasília • DF • Brasil",
    icon: MapPin,
  },
];

export function LandingContact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contato" className="relative z-10 mx-auto w-full max-w-5xl px-4 py-16 md:py-24">
      <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-8">
          <TypingAnimation text="Vamos alinhar o próximo passo?" />
          <p className="text-base text-white/70">
            Conte seu objetivo que preparamos a versão certa da demo, com textos,
            imagens e integrações personalizadas para a sua próxima reunião com o
            cliente.
          </p>
          <ul className="space-y-4">
            {infoCards.map((card) => (
              <li
                key={card.title}
                className="flex items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/60 text-cyan-200">
                  <card.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">
                    {card.title}
                  </p>
                  <p className="text-lg font-semibold text-white">{card.value}</p>
                  <p className="text-sm text-white/60">{card.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-black/40 p-6 shadow-[0_25px_65px_rgba(0,0,0,0.6)]">
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
              setTimeout(() => setSent(false), 4000);
            }}
          >
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                Nome completo
              </label>
              <Input placeholder="Como podemos te chamar?" required />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  WhatsApp
                </label>
                <Input placeholder="(61) 9 9999-0000" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  E-mail
                </label>
                <Input type="email" placeholder="voce@empresa.com" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                Tipo de negócio
              </label>
              <Input placeholder="Clínica, salão, restaurante, oficina..." required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                Conte mais
              </label>
              <Textarea
                rows={5}
                placeholder="Ex.: quero agendamentos online, planos mensais e integração com WhatsApp."
                required
              />
            </div>
            <Button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-blue-500 text-black"
            >
              <Send className="h-4 w-4" />
              {sent ? "Mensagem enviada!" : "Solicitar orçamento"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
