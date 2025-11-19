"use client";

import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type UseMediaQueryOptions = {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
};

const isServer = typeof window === "undefined";

function useMediaQuery(
  query: string,
  { defaultValue = false, initializeWithValue = true }: UseMediaQueryOptions = {},
) {
  const getMatches = useCallback(
    (mediaQuery: string) => {
      if (isServer) return defaultValue;
      return window.matchMedia(mediaQuery).matches;
    },
    [defaultValue],
  );

  const [matches, setMatches] = useState(() => {
    if (initializeWithValue) {
      return getMatches(query);
    }
    return defaultValue;
  });

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);
    const updateMatch = () => setMatches(getMatches(query));
    updateMatch();
    matchMedia.addEventListener("change", updateMatch);
    return () => matchMedia.removeEventListener("change", updateMatch);
  }, [getMatches, query]);

  return matches;
}

const transition = { duration: 0.15, ease: [0.32, 0.72, 0, 1], filter: "blur(4px)" };
const overlayTransition = { duration: 0.5, ease: [0.32, 0.72, 0, 1] };

const Carousel = memo(
  ({
    controls,
    cards,
    onSelect,
    activeDrag,
    autoRotate = true,
  }: {
    controls: ReturnType<typeof useAnimation>;
    cards: string[];
    onSelect: (url: string) => void;
    activeDrag: boolean;
    autoRotate?: boolean;
  }) => {
    const smallScreen = useMediaQuery("(max-width: 640px)", {
      defaultValue: false,
      initializeWithValue: false,
    });
    const faceWidth = smallScreen ? 110 : 220;
    const cylinderWidth = Math.max(faceWidth * cards.length, smallScreen ? 480 : 1800);
    const radius = cylinderWidth / (2 * Math.PI);
    const rotation = useMotionValue(0);
    const transform = useTransform(
      rotation,
      (value) => `rotate3d(0, 1, 0, ${value}deg)`,
    );

    useEffect(() => {
      if (!autoRotate || !activeDrag) return;
      const interval = setInterval(() => {
        rotation.set(rotation.get() + 0.15);
      }, 40);
      return () => clearInterval(interval);
    }, [autoRotate, activeDrag, rotation]);

    return (
      <div
        className="flex h-full items-center justify-center"
        style={{ perspective: smallScreen ? "1200px" : "1800px", transformStyle: "preserve-3d" }}
      >
        <motion.div
          drag={activeDrag ? "x" : false}
          className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
          style={{
            transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
          }}
          onDrag={(_, info) =>
            activeDrag && rotation.set(rotation.get() + info.offset.x * 0.05)
          }
          onDragEnd={(_, info) =>
            activeDrag &&
            controls.start({
              rotateY: rotation.get() + info.velocity.x * 0.05,
              transition: {
                type: "spring",
                stiffness: 120,
                damping: 32,
                mass: 0.2,
              },
            })
          }
          animate={controls}
        >
          {cards.map((image, index) => (
            <motion.div
              key={`${image}-${index}`}
              className="absolute flex h-[60%] origin-center items-center justify-center"
              style={{
                width: `${faceWidth}px`,
                transform: `rotateY(${index * (360 / cards.length)}deg) translateZ(${radius}px)`,
              }}
              onClick={() => onSelect(image)}
            >
              <motion.img
                src={image}
                alt={image}
                className="pointer-events-none aspect-[4/5] w-full rounded-[28px] object-cover shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
                initial={{ filter: "blur(4px)" }}
                animate={{ filter: "blur(0px)" }}
                transition={transition}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  },
);
Carousel.displayName = "Carousel";

type ThreeDPhotoCarouselProps = {
  images?: string[];
};

const defaultKeywords = [
  "business+brasil",
  "restaurant+interior",
  "clinic+modern",
  "barbershop+design",
  "fitness+studio",
  "coffee+shop",
  "boutique+store",
  "auto+repair",
  "spa+brasil",
  "coworking",
];

export function ThreeDPhotoCarousel({ images }: ThreeDPhotoCarouselProps) {
  const [activeImg, setActiveImg] = useState<string | null>(null);
  const [dragging, setDragging] = useState(true);
  const controls = useAnimation();

  const cards = useMemo(() => {
    if (images && images.length) {
      return images;
    }
    return defaultKeywords.map(
      (keyword) =>
        `https://images.unsplash.com/featured/?${keyword}&w=800&q=80`,
    );
  }, [images]);

  return (
    <motion.div layout className="relative h-full">
      <AnimatePresence>
        {activeImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
            onClick={() => {
              setActiveImg(null);
              setDragging(true);
            }}
            transition={overlayTransition}
          >
            <motion.img
              src={activeImg}
              alt="Segmento selecionado"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-h-[80vh] max-w-[80vw] rounded-3xl border border-white/20 object-cover shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative h-full overflow-visible">
        <Carousel
          controls={controls}
          cards={cards}
          activeDrag={dragging}
          autoRotate
          onSelect={(url) => {
            setActiveImg(url);
            setDragging(false);
            controls.stop();
          }}
        />
      </div>
    </motion.div>
  );
}
