"use client";

import Image from "next/image";

import { TypingAnimation } from "@/components/ui/typing-animation";

const imageMap: Record<string, string> = {
  "Platahub": "/servicosfeitos/platahubs.jpeg",
  "Digital DLX": "/servicosfeitos/digitaldlx.jpeg",
  "Siso Conversions": "/servicosfeitos/sisoconversions.jpeg",
  "Real Sabor HDR": "/servicosfeitos/realsabor.jpeg",
  "B2Keeper World": "/servicosfeitos/b2keeper.jpeg",
  "Corte Modelo": "/servicosfeitos/cortemodelo.jpeg",
  "Siso Despesas": "/servicosfeitos/sisodespesas].jpeg",
};

const caseStudies = [
  {
    name: "Platahub",
    url: "https://app.platahub.com/",
    summary: "Painel completo para assinaturas, integrações e métricas em tempo real.",
  },
  {
    name: "Digital DLX",
    url: "https://curious-stardust-dbf60e.netlify.app/",
    summary: "Landing 3D experimental com narrativa cinematográfica.",
  },
  {
    name: "Siso Conversions",
    url: "https://sisoconversions.com/",
    summary: "Plataforma internacional focada em performance de vendas.",
  },
  {
    name: "Real Sabor HDR",
    url: "https://www.realsaborhdr.com/",
    summary: "Cardápio digital com reservas, delivery e promoções dinâmicas.",
  },
  {
    name: "B2Keeper World",
    url: "https://www.b2keeperworld.com/",
    summary: "Hub global de tecnologia com multilíngue e CRM integrado.",
  },
  {
    name: "Corte Modelo",
    url: "https://cortemodelo1.netlify.app/",
    summary: "Site ultra leve para serviços locais, agendamentos e planos.",
  },
  {
    name: "Siso Despesas",
    url: "https://despesassiso.org/",
    summary: "Portal institucional com relatórios e área restrita.",
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
        <div className="mt-6 space-y-2 text-sm text-white/65">
          <p className="text-xs uppercase tracking-[0.45em] text-white/40">
            clientes e demos em produção
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {caseStudies.map((project) => (
              <a
                key={project.url}
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/70 transition hover:border-cyan-300/50 hover:text-white"
                title={project.summary}
              >
                {project.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-4 rounded-[40px] border border-white/10 bg-white/5 p-6 shadow-[0_35px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {caseStudies.map((project) => (
            <a
              key={project.url}
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col gap-4 rounded-3xl border border-white/10 p-4 transition hover:border-cyan-300/50 hover:bg-white/5"
            >
              <div className="relative h-36 overflow-hidden rounded-3xl">
                <Image
                  src={imageMap[project.name]}
                  alt={project.name}
                  fill
                  sizes="400px"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  case real
                </p>
                <h3 className="text-lg font-semibold text-white">
                  {project.name}
                </h3>
                <p className="text-sm text-white/70">{project.summary}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
