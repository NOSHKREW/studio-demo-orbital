"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import DottedMap from "dotted-map";

interface Coordinate {
  lat: number;
  lng: number;
  label?: string;
}

interface MapConnection {
  start: Coordinate;
  end: Coordinate;
}

interface WorldMapProps {
  dots?: MapConnection[];
  lineColor?: string;
  showLabels?: boolean;
  animationDuration?: number;
  loop?: boolean;
}

export function WorldMap({
  dots = [],
  lineColor = "#31D4FF",
  showLabels = true,
  animationDuration = 2,
  loop = true,
}: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const map = useMemo(() => new DottedMap({ height: 100, grid: "diagonal" }), []);
  const svgMap = useMemo(
    () =>
      map.getSVG({
        radius: 0.22,
        color: "#ffffff20",
        shape: "circle",
        backgroundColor: "#02040a",
      }),
    [map],
  );

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 40;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  const staggerDelay = 0.3;
  const totalAnimationTime = dots.length * staggerDelay + animationDuration;
  const pauseTime = 1.5;
  const fullCycleDuration = totalAnimationTime + pauseTime;

  return (
    <div className="relative w-full overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#040816] via-[#091226] to-[#050910] shadow-[0_35px_140px_rgba(0,0,0,0.55)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(54,198,255,0.25),transparent_55%)] opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(222,128,255,0.25),transparent_65%)] opacity-70" />
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(60deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
        }}
      />
      <Image
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        alt="mapa pontilhado"
        width={1056}
        height={495}
        unoptimized
        className="h-full w-full object-cover opacity-80 [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_88%,transparent)]"
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="orbital-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="15%" stopColor="#35d1ff" stopOpacity="1" />
            <stop offset="85%" stopColor="#c06bff" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="pointGlow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {dots.map((dot, index) => {
          const start = projectPoint(dot.start.lat, dot.start.lng);
          const end = projectPoint(dot.end.lat, dot.end.lng);
          const path = createPath(start, end);
          const startTime = (index * staggerDelay) / fullCycleDuration;
          const endTime = (index * staggerDelay + animationDuration) / fullCycleDuration;
          const resetTime = totalAnimationTime / fullCycleDuration;

          return (
            <g key={`connection-${index}`}>
              <motion.path
                d={path}
                fill="none"
                stroke="url(#orbital-line)"
                strokeWidth="1.8"
                initial={{ pathLength: 0 }}
                animate={
                  loop
                    ? { pathLength: [0, 0, 1, 1, 0] }
                    : { pathLength: 1 }
                }
                transition={
                  loop
                    ? {
                        duration: fullCycleDuration,
                        times: [0, startTime, endTime, resetTime, 1],
                        ease: "easeInOut",
                        repeat: Infinity,
                      }
                    : {
                        duration: animationDuration,
                        delay: index * staggerDelay,
                        ease: "easeInOut",
                      }
                }
              />
            </g>
          );
        })}

        {dots.map((dot, index) => {
          const start = projectPoint(dot.start.lat, dot.start.lng);
          const end = projectPoint(dot.end.lat, dot.end.lng);

          return (
            <g key={`points-${index}`}>
              {[{ point: start, label: dot.start.label }, { point: end, label: dot.end.label }].map(
                ({ point, label }, idx) => (
                  <g key={`${label}-${idx}`}>
                    <motion.g
                      onHoverStart={() => setHovered(label ?? null)}
                      onHoverEnd={() => setHovered(null)}
                      whileHover={{ scale: 1.15 }}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill={lineColor}
                        filter="url(#pointGlow)"
                        className="drop-shadow-[0_0_12px_rgba(49,212,255,0.8)]"
                      />
                      <circle cx={point.x} cy={point.y} r="4" fill={lineColor} opacity="0.4">
                        <animate attributeName="r" from="4" to="16" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.7" to="0" dur="2s" repeatCount="indefinite" />
                      </circle>
                    </motion.g>
                    {showLabels && label && (
                      <foreignObject
                        x={point.x - 70}
                        y={point.y - 45}
                        width="140"
                        height="40"
                        className="pointer-events-none"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="rounded-full border border-white/20 bg-black/85 px-3 py-1 text-xs font-semibold text-white">
                            {label}
                          </span>
                          <span className="rounded-full border border-emerald-400/50 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-emerald-200">
                            ativo
                          </span>
                        </div>
                      </foreignObject>
                    )}
                  </g>
                ),
              )}
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute bottom-4 left-4 rounded-xl border border-white/10 bg-black/70 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-sm md:hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {hovered}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
