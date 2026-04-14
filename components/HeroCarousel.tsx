"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type HeroImage = {
  src: string;
  alt: string;
};

type Props = {
  images: HeroImage[];
};

export function HeroCarousel({ images }: Props) {
  const safeImages = useMemo(() => images.slice(0, 10), [images]);

  const shouldAutoplay = safeImages.length > 1;
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  function scrollToIndex(index: number) {
    const el = viewportRef.current;
    if (!el) return;
    if (!safeImages.length) return;
    const w = el.clientWidth || 1;
    el.scrollTo({ left: w * index, behavior: "smooth" });
  }

  function onScroll() {
    const el = viewportRef.current;
    if (!el) return;
    if (!safeImages.length) return;
    const w = el.clientWidth || 1;
    const idx = Math.round(el.scrollLeft / w);
    const clamped = Math.max(0, Math.min(safeImages.length - 1, idx));
    setActive(clamped);
  }

  function prev() {
    const nextIndex = (active - 1 + safeImages.length) % safeImages.length;
    scrollToIndex(nextIndex);
  }

  function next() {
    const nextIndex = (active + 1) % safeImages.length;
    scrollToIndex(nextIndex);
  }

  useEffect(() => {
    if (!safeImages.length) return;
    const el = viewportRef.current;
    if (!el) return;
    // Ensure we start at slide 0.
    el.scrollTo({ left: 0, behavior: "auto" as ScrollBehavior });
    setActive(0);
  }, [safeImages.length]);

  useEffect(() => {
    if (!shouldAutoplay) return;
    if (isPaused) return;

    const id = window.setInterval(() => {
      next();
    }, 4500);

    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAutoplay, isPaused, active, safeImages.length]);

  return (
    safeImages.length ?
    <div
      className="absolute inset-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div
        ref={viewportRef}
        onScroll={onScroll}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-hidden="true"
      >
        {safeImages.map((img, idx) => (
          <div key={`${img.src}-${idx}`} className="relative h-full min-w-full snap-center">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out"
              style={{ backgroundImage: `url(${img.src})` }}
            />
          </div>
        ))}
      </div>

      {safeImages.length > 1 ? (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous background"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-xl border border-white/15 bg-slate-950/35 px-3 py-2 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-slate-950/50"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next background"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl border border-white/15 bg-slate-950/35 px-3 py-2 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-slate-950/50"
          >
            Next
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {safeImages.map((_, idx) => {
              const isActive = idx === active;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToIndex(idx)}
                  aria-label={`Go to background ${idx + 1}`}
                  className={`h-2.5 rounded-full border border-white/20 transition-all ${
                    isActive ? "w-6 bg-white/80" : "w-2.5 bg-white/30 hover:bg-white/50"
                  }`}
                />
              );
            })}
          </div>
        </>
      ) : null}
    </div>
    : null
  );
}
