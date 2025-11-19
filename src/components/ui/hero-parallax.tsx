"use client";

import React from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "motion/react";

type Product = {
  title: string;
  link: string;
  thumbnail: string;
};

interface HeroParallaxProps {
  products: Product[];
}

const springConfig = { stiffness: 260, damping: 28, bounce: 80 };

export const HeroParallax = ({ products }: HeroParallaxProps) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 900]),
    springConfig,
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -900]),
    springConfig,
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [18, 0]),
    springConfig,
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [20, 0]),
    springConfig,
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.15, 1]),
    springConfig,
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [-650, 480]),
    springConfig,
  );

  return (
    <div
      ref={containerRef}
      className="relative flex h-[280vh] flex-col overflow-hidden py-32 [perspective:1100px] [transform-style:preserve-3d]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,rgba(48,225,254,0.15),transparent_60%)]" />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-16 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
          Portfólio vivo
        </p>
        <h2 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
          Sessões que respiram cada segmento local
        </h2>
        <p className="mt-4 text-white/70">
          Deslize para ver como transformamos clínicas, restaurantes, estúdios e
          oficinas em experiências digitais premium, sempre com o mesmo layout
          base.
        </p>
      </div>

      <motion.div
        style={{ rotateX, rotateZ, translateY, opacity }}
        className="relative mx-auto flex w-full max-w-6xl flex-col gap-10"
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-8">
          {firstRow.map((product) => (
            <ProductCard
              key={product.title}
              product={product}
              translate={translateX}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row space-x-8">
          {secondRow.map((product) => (
            <ProductCard
              key={product.title}
              product={product}
              translate={translateXReverse}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-8">
          {thirdRow.map((product) => (
            <ProductCard
              key={product.title}
              product={product}
              translate={translateX}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

const ProductCard = ({
  product,
  translate,
}: {
  product: Product;
  translate: MotionValue<number>;
}) => {
  return (
    <motion.article
      style={{ x: translate }}
      whileHover={{ y: -22 }}
      className="group relative h-80 w-[22rem] shrink-0 overflow-hidden rounded-[28px] bg-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
    >
      <div className="relative h-full w-full">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          priority
          sizes="(max-width: 768px) 80vw, 22rem"
          className="object-cover object-center transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />
        <div className="absolute inset-x-0 bottom-4 flex flex-col gap-2 px-5">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
            Estudo
          </p>
          <h3 className="text-2xl font-semibold text-white">{product.title}</h3>
          <a
            href={product.link}
            className="text-sm font-medium text-cyan-300 underline-offset-4 hover:underline"
          >
            ver conceito →
          </a>
        </div>
      </div>
    </motion.article>
  );
};
