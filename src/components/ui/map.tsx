"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import brazilStates from "@/data/brazil-states.json";

type Coordinate = {
  lat: number;
  lng: number;
  label?: string;
};

type MapConnection = {
  start: Coordinate;
  end: Coordinate;
};

type StateRoute = {
  from: string;
  to: string;
};

type RouteConnection = {
  id: string;
  path: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  startPercent: { x: number; y: number };
  endPercent: { x: number; y: number };
};

type WorldMapProps = {
  dots?: MapConnection[];
  lineColor?: string;
  showLabels?: boolean;
  stateRoutes?: StateRoute[];
  showCityMarkers?: boolean;
};

type PolygonCoords = number[][][];
type MultiPolygonCoords = PolygonCoords[];

type BrazilStateFeature = {
  properties: {
    id?: number;
    name: string;
    sigla: string;
    regiao_id?: string;
    codigo_ibg?: string;
  };
  geometry:
    | {
        type: "Polygon";
        coordinates: PolygonCoords;
      }
    | {
        type: "MultiPolygon";
        coordinates: MultiPolygonCoords;
      };
};

type BrazilStatesGeoJson = {
  features: BrazilStateFeature[];
};

const BRAZIL_STATES = (brazilStates as BrazilStatesGeoJson).features;

const DEFAULT_STATE_ROUTES: StateRoute[] = [
  { from: "DF", to: "GO" },
  { from: "DF", to: "BA" },
  { from: "DF", to: "SP" },
  { from: "DF", to: "RS" },
  { from: "SP", to: "RJ" },
  { from: "BA", to: "PE" },
  { from: "DF", to: "AM" },
];

const mapWidth = 880;
const mapHeight = 520;
const mapPadding = 24;

type LabelTone = "solar" | "serrado" | "oceano";

const labelConfigs: Record<
  string,
  {
    offset: { x: number; y: number };
    tone: LabelTone;
    badge?: string;
  }
> = {
  Brasília: { offset: { x: -150, y: -80 }, tone: "solar", badge: "base" },
  "Asa Norte": { offset: { x: 32, y: -70 }, tone: "serrado" },
  "Asa Sul": { offset: { x: -38, y: 20 }, tone: "serrado" },
  Sudoeste: { offset: { x: -150, y: 10 }, tone: "oceano" },
  "Águas Claras": { offset: { x: -165, y: 60 }, tone: "solar" },
  "Lago Norte": { offset: { x: 32, y: -4 }, tone: "oceano" },
};

const toneStyles: Record<
  LabelTone,
  {
    chip: string;
    badge: string;
  }
> = {
  solar: {
    chip: "border-amber-400/60 bg-[rgba(43,27,9,0.8)] text-amber-50",
    badge: "border-amber-300/60 bg-amber-200/15 text-amber-100",
  },
  serrado: {
    chip: "border-lime-400/60 bg-[rgba(20,40,13,0.8)] text-lime-50",
    badge: "border-lime-300/50 bg-lime-300/15 text-lime-100",
  },
  oceano: {
    chip: "border-cyan-300/60 bg-[rgba(8,29,42,0.85)] text-cyan-100",
    badge: "border-cyan-300/50 bg-cyan-300/15 text-cyan-100",
  },
};

const fallbackOffsets = [
  { x: -90, y: -60 },
  { x: 36, y: -50 },
  { x: -120, y: 20 },
  { x: 24, y: 18 },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

type Bounds = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

const regionPalettes: Record<
  string,
  {
    name: string;
    from: string;
    to: string;
    outline: string;
  }
> = {
  "3": { name: "Norte", from: "#215136", to: "#3ea76b", outline: "#143422" },
  "4": { name: "Nordeste", from: "#a45a1c", to: "#f0b35b", outline: "#5f3412" },
  "5": { name: "Centro-Oeste", from: "#1c6b5c", to: "#58b49a", outline: "#0f3d32" },
  "2": { name: "Sudeste", from: "#1f4f7a", to: "#6fa0d3", outline: "#0f2e46" },
  "1": { name: "Sul", from: "#1b5772", to: "#58b0cc", outline: "#0a3442" },
};

const defaultRegion = regionPalettes["5"];

const getPolygons = (geometry: BrazilStateFeature["geometry"]): PolygonCoords[] => {
  if (geometry.type === "Polygon") {
    return [geometry.coordinates];
  }
  return geometry.coordinates;
};

const BRAZIL_BOUNDS = BRAZIL_STATES.reduce<Bounds>(
  (acc, feature) => {
    getPolygons(feature.geometry).forEach((polygon) => {
      polygon.forEach((ring) => {
        ring.forEach(([lng, lat]) => {
          acc.minLat = Math.min(acc.minLat, lat);
          acc.maxLat = Math.max(acc.maxLat, lat);
          acc.minLng = Math.min(acc.minLng, lng);
          acc.maxLng = Math.max(acc.maxLng, lng);
        });
      });
    });
    return acc;
  },
  {
    minLat: Infinity,
    maxLat: -Infinity,
    minLng: Infinity,
    maxLng: -Infinity,
  },
);

const projectBrazilPoint = (lat: number, lng: number) => {
  const { minLat, maxLat, minLng, maxLng } = BRAZIL_BOUNDS;
  const normalizedX = (lng - minLng) / (maxLng - minLng);
  const normalizedY = (maxLat - lat) / (maxLat - minLat);

  const drawableWidth = mapWidth - mapPadding * 2;
  const drawableHeight = mapHeight - mapPadding * 2;

  return {
    x: normalizedX * drawableWidth + mapPadding,
    y: normalizedY * drawableHeight + mapPadding,
  };
};

const computeControlPoint = (start: { x: number; y: number }, end: { x: number; y: number }) => {
  const midX = (start.x + end.x) / 2;
  const curvature = Math.max(60, Math.abs(start.x - end.x) * 0.35);
  const midY = Math.min(start.y, end.y) - curvature;
  return { x: midX, y: midY };
};

const adjustHexColor = (hex: string, amount: number) => {
  const normalized = clamp(amount, -1, 1);
  const trimmed = hex.replace("#", "");
  const num = Number.parseInt(trimmed, 16);
  if (Number.isNaN(num)) return hex;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  const adjustChannel = (channel: number) => {
    if (normalized < 0) {
      return Math.round(channel * (1 + normalized));
    }
    return Math.round(channel + (255 - channel) * normalized);
  };

  const newR = clamp(adjustChannel(r), 0, 255);
  const newG = clamp(adjustChannel(g), 0, 255);
  const newB = clamp(adjustChannel(b), 0, 255);

  return `#${[newR, newG, newB]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
};

type StateShape = {
  name: string;
  sigla: string;
  gradientId: string;
  path: string;
  centroid: { x: number; y: number };
  fillFrom: string;
  fillTo: string;
  stroke: string;
  order: number;
  regionName: string;
};

const STATE_SHAPES: StateShape[] = BRAZIL_STATES.map((feature, index) => {
  const polygons = getPolygons(feature.geometry);
  const path = polygons
    .map((polygon) =>
      polygon
        .map((ring) => {
          const commands = ring.map(([lng, lat], pointIndex) => {
            const { x, y } = projectBrazilPoint(lat, lng);
            return `${pointIndex === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
          });
          return `${commands.join(" ")} Z`;
        })
        .join(" "),
    )
    .join(" ");

  const centroid = (() => {
    const samples: { x: number; y: number }[] = [];
    polygons.forEach((polygon) => {
      const outerRing = polygon[0] ?? [];
      outerRing.forEach(([lng, lat]) => {
        samples.push(projectBrazilPoint(lat, lng));
      });
    });
    if (!samples.length) {
      return { x: mapWidth / 2, y: mapHeight / 2 };
    }
    return {
      x: samples.reduce((sum, sample) => sum + sample.x, 0) / samples.length,
      y: samples.reduce((sum, sample) => sum + sample.y, 0) / samples.length,
    };
  })();

  const region = regionPalettes[feature.properties.regiao_id ?? ""] ?? defaultRegion;
  const codeSeed = Number(feature.properties.codigo_ibg);
  const idSeed =
    feature.properties.id ??
    (!Number.isNaN(codeSeed) ? codeSeed : undefined) ??
    index + 1;
  const variation = pseudoRandom(idSeed) * 0.6 - 0.3;

  return {
    name: feature.properties.name,
    sigla: feature.properties.sigla,
    gradientId: `state-${feature.properties.sigla.toLowerCase()}`,
    path,
    centroid,
    fillFrom: adjustHexColor(region.from, variation * 0.45),
    fillTo: adjustHexColor(region.to, variation * 0.25),
    stroke: adjustHexColor(region.outline, variation * -0.2),
    order: index,
    regionName: region.name,
  };
});

const STATE_LOOKUP = new Map(STATE_SHAPES.map((state) => [state.sigla, state]));

const BRAZIL_CENTROID = STATE_SHAPES.reduce(
  (acc, state) => ({
    x: acc.x + state.centroid.x,
    y: acc.y + state.centroid.y,
  }),
  { x: 0, y: 0 },
);
BRAZIL_CENTROID.x /= STATE_SHAPES.length;
BRAZIL_CENTROID.y /= STATE_SHAPES.length;

const BRAZIL_SILHOUETTE_PATH = STATE_SHAPES.map((state) => state.path).join(" ");

const BRASILIA_POINT = projectBrazilPoint(-15.7975, -47.8919);

export function WorldMap({
  dots = [],
  lineColor = "#F8C77B",
  showLabels = true,
  stateRoutes,
  showCityMarkers = true,
}: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredState, setHoveredState] = useState<StateShape | null>(null);
  const rotateYValue = useMotionValue(0);
  const rotateXValue = useMotionValue(0);
  const rotateY = useSpring(rotateYValue, { stiffness: 35, damping: 12, mass: 0.6 });
  const rotateX = useSpring(rotateXValue, { stiffness: 40, damping: 14, mass: 0.6 });
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) return;
    const handlePointerMove = (event: PointerEvent) => {
      if (!pointerStart.current) return;
      const deltaX = event.clientX - pointerStart.current.x;
      const deltaY = event.clientY - pointerStart.current.y;
      rotateYValue.set(clamp(deltaX / 8, -18, 18));
      rotateXValue.set(clamp(-deltaY / 10, -10, 10));
    };

    const handlePointerUp = () => {
      pointerStart.current = null;
      setIsDragging(false);
      rotateYValue.set(0);
      rotateXValue.set(0);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, rotateXValue, rotateYValue]);

  const toPercent = (point: { x: number; y: number }) => ({
    x: (point.x / mapWidth) * 100,
    y: (point.y / mapHeight) * 100,
  });

  const routeConnections = useMemo(() => {
    const source = stateRoutes && stateRoutes.length ? stateRoutes : DEFAULT_STATE_ROUTES;
    return source
      .map<RouteConnection | null>((route, index) => {
        const startState = STATE_LOOKUP.get(route.from.toUpperCase());
        const endState = STATE_LOOKUP.get(route.to.toUpperCase());
        if (!startState || !endState) return null;
        const start = startState.centroid;
        const end = endState.centroid;
        const control = computeControlPoint(start, end);
        const path = `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;

        return {
          id: `${route.from}-${route.to}-${index}`,
          path,
          start,
          end,
          startPercent: toPercent(start),
          endPercent: toPercent(end),
        };
      })
      .filter((connection): connection is RouteConnection => Boolean(connection));
  }, [stateRoutes]);

  const plottedPoints = useMemo(() => {
    const registry = new Map<
      string,
      {
        point: { x: number; y: number };
        label?: string;
      }
    >();

    dots.forEach((dot) => {
      const startPoint = projectBrazilPoint(dot.start.lat, dot.start.lng);
      const startKey = `${dot.start.label}-${startPoint.x.toFixed(1)}-${startPoint.y.toFixed(1)}`;
      if (!registry.has(startKey)) {
        registry.set(startKey, { point: startPoint, label: dot.start.label });
      }

      const endPoint = projectBrazilPoint(dot.end.lat, dot.end.lng);
      const endKey = `${dot.end.label}-${endPoint.x.toFixed(1)}-${endPoint.y.toFixed(1)}`;
      if (!registry.has(endKey)) {
        registry.set(endKey, { point: endPoint, label: dot.end.label });
      }
    });

    return Array.from(registry.values());
  }, [dots]);

  const tooltipPosition = hoveredState
    ? {
        left: clamp(hoveredState.centroid.x + 24, 12, mapWidth - 220),
        top: clamp(hoveredState.centroid.y - 80, 12, mapHeight - 90),
      }
    : null;

  return (
    <motion.div
      className="relative w-full cursor-grab active:cursor-grabbing"
      style={{ rotateY, rotateX }}
      onPointerDown={(event) => {
        pointerStart.current = { x: event.clientX, y: event.clientY };
        setIsDragging(true);
      }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        className="h-[480px] w-full"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
          <defs>
            <linearGradient id="state-fill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#123b2f" />
              <stop offset="100%" stopColor="#0b1f38" />
            </linearGradient>
            <linearGradient id="orbital-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="15%" stopColor="#ffd166" stopOpacity="1" />
              <stop offset="85%" stopColor="#2dd4bf" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {STATE_SHAPES.map((state) => (
              <linearGradient
                key={state.gradientId}
                id={state.gradientId}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={state.fillFrom} />
                <stop offset="100%" stopColor={state.fillTo} />
              </linearGradient>
            ))}
            <filter id="pointGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="brazil-clip">
              <path d={BRAZIL_SILHOUETTE_PATH} />
            </clipPath>
          </defs>

          <g clipPath="url(#brazil-clip)">
            <rect width={mapWidth} height={mapHeight} fill="url(#state-fill)" opacity="0.25" />
            <path d={BRAZIL_SILHOUETTE_PATH} fill="transparent" stroke="#1f4b39" strokeWidth="1.4" opacity="0.3" />
          </g>

          {STATE_SHAPES.map((state) => (
            <motion.path
              key={state.sigla}
              d={state.path}
              fill={`url(#${state.gradientId})`}
              stroke={state.stroke}
              strokeWidth="1.1"
              fillRule="evenodd"
              className="drop-shadow-[0_10px_30px_rgba(3,10,8,0.55)]"
              initial={{ opacity: 0, scale: 0.92, translateY: 12 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              transition={{ delay: state.order * 0.02, duration: 0.6, ease: "easeOut" }}
              onHoverStart={() => setHoveredState(state)}
              onHoverEnd={() => setHoveredState(null)}
            />
          ))}

          {STATE_SHAPES.map((state) => {
            const adjustment =
              state.sigla === "DF"
                ? { x: state.centroid.x + 18, y: state.centroid.y - 8 }
                : state.sigla === "RJ"
                  ? { x: state.centroid.x + 6, y: state.centroid.y + 12 }
                  : state.sigla === "ES"
                    ? { x: state.centroid.x + 16, y: state.centroid.y + 10 }
                    : state.sigla === "SE"
                      ? { x: state.centroid.x + 16, y: state.centroid.y - 4 }
                      : state.sigla === "AL"
                        ? { x: state.centroid.x + 10, y: state.centroid.y - 10 }
                        : { x: state.centroid.x, y: state.centroid.y };

            return (
              <text
                key={`${state.sigla}-label`}
                x={adjustment.x}
                y={adjustment.y}
                textAnchor="middle"
                className="pointer-events-none select-none fill-white/55 text-[11px] font-semibold tracking-[0.3em]"
              >
                {state.sigla}
              </text>
            );
          })}

          <circle cx={BRASILIA_POINT.x} cy={BRASILIA_POINT.y} r="22" fill="url(#state-fill)" opacity="0.35" />
          <circle cx={BRASILIA_POINT.x} cy={BRASILIA_POINT.y} r="22" fill="url(#orbital-line)" opacity="0.5">
            <animate attributeName="r" values="14;28;14" dur="4.8s" repeatCount="indefinite" />
          </circle>
          <circle cx={BRASILIA_POINT.x} cy={BRASILIA_POINT.y} r="7" fill="#ffd277" opacity="0.95" />

          {routeConnections.map((route, index) => {
            const duration = 4.6 + pseudoRandom(index + 3) * 1.25;
            const startDelay = index * 0.95 + pseudoRandom(index + 11) * 0.6;
            return (
              <g key={route.id}>
                <motion.path
                  id={`route-path-${route.id}`}
                  d={route.path}
                  fill="none"
                  stroke="url(#orbital-line)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: index * 0.25, duration: 2.4, ease: "easeInOut" }}
                />
                <path
                  d={route.path}
                  fill="none"
                  stroke="url(#orbital-line)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeDasharray="16 38"
                  opacity="0.45"
                >
                  <animate attributeName="stroke-dashoffset" values="0;-220" dur={`${duration}s`} repeatCount="indefinite" begin={`${startDelay}s`} />
                </path>
                <circle r="4" fill="#050505" stroke="#ffffff30" strokeWidth="1">
                  <animateMotion dur={`${duration}s`} repeatCount="indefinite" begin={`${startDelay}s`} rotate="auto">
                    <mpath xlinkHref={`#route-path-${route.id}`} />
                  </animateMotion>
                  <animate attributeName="r" values="3;4.5;3" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle r="7" fill="none" stroke="#000" strokeOpacity="0.35">
                  <animateMotion dur={`${duration}s`} repeatCount="indefinite" begin={`${startDelay}s`} rotate="auto">
                    <mpath xlinkHref={`#route-path-${route.id}`} />
                  </animateMotion>
                  <animate attributeName="stroke-opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}

          {showCityMarkers &&
            plottedPoints.map(({ point, label }, index) => {
              const fallback = fallbackOffsets[index % fallbackOffsets.length];
              const config = label ? labelConfigs[label] ?? undefined : undefined;
              const offset = config?.offset ?? fallback;
              const tone = config?.tone ?? "serrado";
              const styles = toneStyles[tone];
              const labelX = clamp(point.x + offset.x, 8, mapWidth - 170);
              const labelY = clamp(point.y + offset.y, 8, mapHeight - 70);
              const badgeText = config?.badge ? config.badge.toUpperCase() : "ATIVO";

              return (
                <g key={`${label ?? "ponto"}-${index}`}>
                  <motion.g whileHover={{ scale: 1.1 }} className="cursor-pointer">
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="5"
                      fill={lineColor}
                      filter="url(#pointGlow)"
                      className="drop-shadow-[0_0_18px_rgba(253,196,106,0.8)]"
                    />
                    <circle cx={point.x} cy={point.y} r="5" fill={lineColor} opacity="0.45">
                      <animate attributeName="r" values="5;14;5" dur="2.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.7;0;0.7" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                  </motion.g>
                  {showLabels && label && (
                    <foreignObject x={labelX} y={labelY} width="170" height="60" className="pointer-events-none">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-[0_8px_18px_rgba(0,0,0,0.35)] ${styles.chip}`}>
                          {label}
                        </span>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.45em] ${styles.badge}`}>
                          {badgeText}
                        </span>
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
      </svg>

      <AnimatePresence>
        {hoveredState && tooltipPosition && (
          <motion.div
            key="state-tooltip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pointer-events-none absolute rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm text-white shadow-xl backdrop-blur-md"
            style={{
              left: `${tooltipPosition.left}px`,
              top: `${tooltipPosition.top}px`,
            }}
          >
            <p className="text-xs uppercase tracking-[0.5em] text-white/60">Estado</p>
            <p className="text-lg font-semibold text-white">{hoveredState.name}</p>
            <p className="text-xs text-white/60">{hoveredState.regionName}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
