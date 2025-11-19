"use client";

import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel";
import { TypingAnimation } from "@/components/ui/typing-animation";

const galleryItems = [
  {
    title: "Clínica de estética integrada",
    thumbnail:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Restaurante & delivery autoral",
    thumbnail:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Consultório multidisciplinar",
    thumbnail:
      "https://images.unsplash.com/photo-1583911860205-72f033c1511c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Studio de pilates & wellness",
    thumbnail:
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Escritório boutique de advocacia",
    thumbnail:
      "https://images.unsplash.com/photo-1528744598421-b7b93e12df0b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Barbearia contemporânea",
    thumbnail:
      "https://images.unsplash.com/photo-1542089363-bba089ffaa6d?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Cafeteria artesanal",
    thumbnail:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Coworking criativo",
    thumbnail:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Estúdio de arquitetura",
    thumbnail:
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Oficina premium",
    thumbnail:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Academia boutique",
    thumbnail:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Loja conceito & showroom",
    thumbnail:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Escola de idiomas premium",
    thumbnail:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Produtora audiovisual",
    thumbnail:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Clube de assinaturas",
    thumbnail:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
  },
];

export function LandingGallery3D() {
  return (
    <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-20 md:py-28">
      <div className="text-center space-y-4">
        <TypingAnimation text="Galeria de inspirações" />
        <p className="mt-4 text-sm text-white/70 md:text-base">
          Uma visão em 3D de diferentes estilos de layout, imagens e atmosferas
          que podemos aplicar ao site da sua empresa.
        </p>
      </div>

      <div className="h-[580px] w-full pt-10 mt-6 md:h-[680px] md:mt-8">
        <ThreeDPhotoCarousel
          images={galleryItems.map((item) => item.thumbnail)}
        />
      </div>
    </section>
  );
}
