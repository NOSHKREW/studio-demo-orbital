"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel";
import { TypingAnimation } from "@/components/ui/typing-animation";

const projectGallery = [
  { title: "Platahub • Painel do revendedor", image: "/gallery/platahubdashboard.png" },
  { title: "Platahub • Vitrine de serviços", image: "/gallery/platahubservicos.png" },
  { title: "Platahub • Indústrias", image: "/gallery/platahubindustrias.png" },
  { title: "Platahub • Configurações", image: "/gallery/platahubpersonalizar.png" },
  { title: "Digital DLX • Packs visuais", image: "/gallery/digitaldlxpacks.png" },
  { title: "Digital DLX • Área de pagamentos", image: "/gallery/digitaldlxpagamentos.png" },
  { title: "Digital DLX • Rodapé interativo", image: "/gallery/digitaldlxfooter.png" },
  { title: "B2Keeper World • Coleções", image: "/gallery/b2keeperscollections.png" },
  { title: "B2Keeper World • Produtos", image: "/gallery/b2keepersproducts.png" },
  { title: "B2Keeper World • Página de produto", image: "/gallery/b2keepersproductpage.png" },
  { title: "Real Sabor HDR • Cardápio digital", image: "/gallery/realsaborcardapio.png" },
  { title: "Real Sabor HDR • Reservas", image: "/gallery/realsaborreservas.png" },
  { title: "Corte Modelo • Serviços", image: "/gallery/cortemodeloserviços.png" },
  { title: "Corte Modelo • CTA principal", image: "/gallery/cortemodelocta.png" },
  { title: "Siso Conversions • Review hub", image: "/gallery/sisoconversionsreviews.png" },
  { title: "Siso Conversions • Equipe global", image: "/gallery/sisoconversionsteam.png" },
  { title: "Siso Conversions • Galeria", image: "/gallery/sisoconversionsgallery.png" },
  { title: "Siso Despesas • Dashboard", image: "/gallery/sisodespesas.png" },
  { title: "Siso Despesas • Exportações", image: "/gallery/sisodespesasexport.png" },
  { title: "Studio Orbital • Home 3D", image: "/gallery/studioorbital.png" },
];

export function LandingGallery3D() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselInView = useInView(carouselRef, { amount: 0.4, margin: "-20% 0px" });

  return (
    <section id="galeria" className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 md:py-20">
      <div className="text-center space-y-4">
        <TypingAnimation text="Galeria de inspirações" />
        <p className="mt-4 text-sm text-white/70 md:text-base">
          Uma visão em 3D de diferentes estilos de layout, imagens e atmosferas
          que podemos aplicar ao site da sua empresa.
        </p>
      </div>

      <div
        ref={carouselRef}
        className="h-[360px] w-full pt-6 mt-4 md:h-[520px] md:mt-6"
      >
        <ThreeDPhotoCarousel
          images={projectGallery.map((item) => item.image)}
          autoRotate={carouselInView}
        />
      </div>

      <div className="mt-10 grid gap-6 rounded-[32px] border border-white/10 bg-white/5 p-6 text-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:grid-cols-2">
        <div className="space-y-3">
          <p className="text-white text-lg font-semibold">Preview rápido</p>
          <p className="text-sm text-white/70">
            Selecionei alguns projetos que mostraram o potencial da demo:
            layouts minimalistas, paletas quentes e vitrines imersivas para
            negócios de diferentes segmentos.
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.35em] text-cyan-100">
            {projectGallery.slice(0, 3).map((item) => (
              <span
                key={item.title}
                className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1"
              >
                {item.title}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-[11px] text-white/70">
          {projectGallery.slice(3, 7).map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-sm"
            >
              <p className="text-white text-sm font-semibold">{item.title}</p>
              <p className="text-[11px] text-white/60">Experiência imersiva</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
