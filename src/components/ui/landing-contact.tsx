"use client";

import emailjs from "@emailjs/browser";
import { Mail, Phone, Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TypingAnimation } from "@/components/ui/typing-animation";

const infoCards = [
  {
    title: "Atendimento por WhatsApp",
    description: "Clique abaixo e envie uma mensagem instantânea.",
    value: "+44 0757 209 6727",
    icon: Phone,
  },
  {
    title: "Envie o briefing por e-mail",
    description: "Arquivos, logos e roteiros são bem-vindos.",
    value: "nosthe27@gmail.com",
    icon: Mail,
  },
];

const whatsappNumber = "4407572096727";

const servicesOptions = [
  "Landing page",
  "Integrações",
  "Agenda online",
  "Loja / Catálogo",
  "Identidade visual",
  "Outros",
];

export function LandingContact() {
  const [formState, setFormState] = useState({
    name: "",
    whatsapp: "",
    email: "",
    business: "",
    message: "",
    services: [] as string[],
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (field: keyof typeof formState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const toggleService = (service: string) => {
    setFormState((prev) => {
      const exists = prev.services.includes(service);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((item) => item !== service)
          : [...prev.services, service],
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus("error");
      setStatusMessage("Configurar as variáveis do EmailJS antes de enviar.");
      return;
    }

    try {
      setStatus("sending");
      await emailjs.send(
        serviceId,
        templateId,
        {
          name: formState.name,
          whatsapp: formState.whatsapp,
          email: formState.email,
          business: formState.business,
          message: formState.message,
          services: formState.services.join(", "),
        },
        {
          publicKey,
        },
      );
      setStatus("success");
      setStatusMessage("Mensagem enviada. Em breve entro em contato!");
      setFormState({
        name: "",
        whatsapp: "",
        email: "",
        business: "",
        message: "",
        services: [],
      });
    } catch {
      setStatus("error");
      setStatusMessage("Não conseguimos enviar agora. Tente novamente ou chame no WhatsApp.");
    } finally {
      setTimeout(() => {
        setStatus("idle");
        setStatusMessage("");
      }, 5000);
    }
  };

  const buildWhatsAppLink = () => {
    const intro = `Olá! Meu nome é ${formState.name || "___"} e represento ${formState.business || "uma empresa"}.`;
    const services = formState.services.length
      ? `Interesse: ${formState.services.join(", ")}.`
      : "";
    const details = formState.message ? `Detalhes: ${formState.message}` : "";
    const contact = formState.email ? `Email: ${formState.email}` : "";
    const whatsappInfo = formState.whatsapp ? `WhatsApp: ${formState.whatsapp}` : "";
    const text = [intro, services, details, contact, whatsappInfo]
      .filter(Boolean)
      .join("%0A");
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  };

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
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                Nome completo
              </label>
              <Input
                placeholder="Como podemos te chamar?"
                required
                value={formState.name}
                onChange={handleChange("name")}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  WhatsApp
                </label>
                <Input
                  placeholder="(61) 9 9999-0000"
                  required
                  value={formState.whatsapp}
                  onChange={handleChange("whatsapp")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  E-mail
                </label>
                <Input
                  type="email"
                  placeholder="voce@empresa.com"
                  required
                  value={formState.email}
                  onChange={handleChange("email")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                Tipo de negócio
              </label>
              <Input
                placeholder="Clínica, salão, restaurante, oficina..."
                required
                value={formState.business}
                onChange={handleChange("business")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                O que você precisa
              </label>
              <div className="flex flex-wrap gap-2">
                {servicesOptions.map((service) => {
                  const active = formState.services.includes(service);
                  return (
                    <button
                      type="button"
                      key={service}
                      onClick={() => toggleService(service)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] transition ${
                        active
                          ? "border-cyan-300/60 bg-cyan-300/20 text-cyan-100"
                          : "border-white/20 text-white/60 hover:border-white/40"
                      }`}
                    >
                      {service}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                Conte mais
              </label>
              <Textarea
                rows={5}
                placeholder="Ex.: quero agendamentos online, planos mensais e integração com WhatsApp."
                required
                value={formState.message}
                onChange={handleChange("message")}
              />
            </div>
            {status !== "idle" && (
              <p
                className={`text-sm ${
                  status === "error" ? "text-red-300" : "text-emerald-300"
                }`}
              >
                {statusMessage}
              </p>
            )}
            <div className="flex flex-col gap-3 md:flex-row">
              <Button
                type="submit"
                disabled={status === "sending"}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-blue-500 text-black"
              >
                <Send className="h-4 w-4" />
                {status === "sending"
                  ? "Enviando..."
                  : status === "success"
                    ? "Mensagem enviada!"
                    : "Solicitar orçamento"}
              </Button>
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center rounded-full border border-green-300/60 px-4 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-green-100 transition hover:bg-green-400/10"
              >
                Abrir WhatsApp
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
