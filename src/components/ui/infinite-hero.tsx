"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useInView, useReducedMotion } from "framer-motion";

gsap.registerPlugin(SplitText);

const ShaderBackgroundGradient = () => (
  <div className="h-full w-full bg-gradient-to-br from-[#020b1b] via-[#050f1f] to-[#0a1b33]" />
);

const DynamicShaderBackground = dynamic(
  () =>
    import("@/components/ui/shader-background").then(
      (mod) => mod.ShaderBackground,
    ),
  {
    ssr: false,
    loading: () => <ShaderBackgroundGradient />,
  },
);

interface InfiniteHeroProps {
  showBackground?: boolean;
}

export default function InfiniteHero({
  showBackground = true,
}: InfiniteHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [isCompactDisplay, setIsCompactDisplay] = useState(false);
  const heroInView = useInView(rootRef, { amount: 0.5, margin: "-20% 0px" });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 768px)");
    const update = () => setIsCompactDisplay(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const shouldRenderShader =
    hasMounted && showBackground && heroInView && !prefersReducedMotion && !isCompactDisplay;

  useGSAP(
    () => {
      const ctas = ctaRef.current ? Array.from(ctaRef.current.children) : [];

      const h1Split = new SplitText(h1Ref.current, { type: "lines" });
      const pSplit = new SplitText(pRef.current, { type: "lines" });

      gsap.set(bgRef.current, { filter: showBackground ? "blur(28px)" : "none" });
      gsap.set(h1Split.lines, {
        opacity: 0,
        y: 18,
        filter: "blur(5px)",
      });
      gsap.set(pSplit.lines, {
        opacity: 0,
        y: 12,
        filter: "blur(4px)",
      });
      if (ctas.length) gsap.set(ctas, { opacity: 0, y: 14 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      if (showBackground) {
        tl.to(bgRef.current, { filter: "blur(0px)", duration: 0.8 }, 0);
      }
      tl.to(
        h1Split.lines,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.55,
          stagger: 0.08,
        },
        0.3,
      )
        .to(
          pSplit.lines,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.45,
            stagger: 0.06,
          },
          "-=0.25",
        )
        .to(ctas, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 }, "-=0.2");

      return () => {
        h1Split.revert();
        pSplit.revert();
      };
    },
    { scope: rootRef, dependencies: [showBackground] },
  );

  return (
    <div
      ref={rootRef}
      className={`relative h-svh w-full overflow-hidden text-white ${showBackground ? "bg-black" : "bg-transparent"}`}
    >
      <div ref={bgRef} className="absolute inset-0">
        {showBackground ? (
          <>
            {shouldRenderShader ? (
              <DynamicShaderBackground className="h-full w-full" />
            ) : (
              <ShaderBackgroundGradient />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-transparent" />
            <div className="absolute inset-0 opacity-30 mix-blend-screen [background:radial-gradient(120%_80%_at_50%_30%,rgba(255,255,255,0.35),transparent_70%)]" />
          </>
        ) : null}
      </div>

      {showBackground && (
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(120%_80%_at_50%_50%,_transparent_40%,_black_100%)]" />
      )}

      <div className="relative z-10 flex h-svh w-full items-center justify-center px-6">
        <div className="text-center">
          <h1
            ref={h1Ref}
            className="mx-auto max-w-2xl lg:max-w-4xl text-[clamp(2.25rem,6vw,4rem)] font-extralight leading-[0.95] tracking-tight"
          >
            Traçamos rotas digitais que fazem sua marca atravessar o Brasil.
          </h1>
          <p
            ref={pRef}
            className="mx-auto mt-4 max-w-2xl md:text-balance text-sm/6 md:text-base/7 font-light tracking-tight text-white/70"
          >
            Sites com luz própria, animações com propósito e experiências que
            convertem em qualquer tela. Não é só uma hero image bonita — é um
            manifesto vivo para marcas que querem escala.
          </p>

          <div
            ref={ctaRef}
            className="mt-8 flex flex-row items-center justify-center gap-4"
          >
            <button
              type="button"
              className="group relative overflow-hidden border border-white/30 bg-gradient-to-r from-white/20 to-white/10 px-4 py-2 text-sm rounded-lg font-medium tracking-wide text-white backdrop-blur-sm transition-[border-color,background-color,box-shadow] duration-500 hover:border-white/50 hover:bg-white/20 hover:shadow-lg hover:shadow-white/10 cursor-pointer"
            >
              Ver tour guiado
            </button>

            <button
              type="button"
              className="group relative px-4 py-2 text-sm font-medium tracking-wide text-white/90 transition-[filter,color] duration-500 hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] hover:text-white cursor-pointer"
            >
              Explorar coleção
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
