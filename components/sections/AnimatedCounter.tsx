"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function formatNumber(value: number) {
  return value.toLocaleString("en-IN");
}

export function AnimatedCounter({
  value,
  suffix,
  durationMs = 900,
}: {
  value: number;
  suffix?: string;
  durationMs?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);

  const target = useMemo(() => Math.max(0, Math.floor(value)), [value]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let started = false;
    let start = 0;

    const animate = (t: number) => {
      if (!started) {
        started = true;
        start = t;
      }

      const progress = Math.min(1, (t - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(target * eased);
      setDisplay(next);

      if (progress < 1) raf = requestAnimationFrame(animate);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          io.disconnect();
          raf = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.25 },
    );

    io.observe(el);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [durationMs, target]);

  return (
    <span ref={ref}>
      {formatNumber(display)}
      {suffix ?? ""}
    </span>
  );
}
