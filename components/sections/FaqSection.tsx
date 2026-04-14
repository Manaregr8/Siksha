"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

type FaqItem = {
  q: string;
  a: string;
};

const items: FaqItem[] = [
  {
    q: "Do I get a certificate?",
    a: "Yes. Every program includes a completion certificate and a shareable portfolio-ready capstone project.",
  },
  {
    q: "Are the courses beginner friendly?",
    a: "We offer both Beginner and Advanced tracks. Beginner tracks start from fundamentals and ramp up with guided projects.",
  },
  {
    q: "How long does a program take?",
    a: "Programs are structured in modules with clear weekly goals. Typical timelines are 2-year and 3-year tracks depending on level.",
  },
  {
    q: "Is it mobile friendly?",
    a: "Yes — the experience is built for mobile-first browsing, with responsive layouts and accessible controls.",
  },
  {
    q: "Do you provide mentorship?",
    a: "Yes. You get structured feedback loops, project reviews, and guided learning paths designed for outcomes.",
  },
];

function AccordionRow({
  item,
  open,
  onToggle,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-900/5 bg-white/70 shadow-md backdrop-blur-xl transition-all duration-300 ease-out hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-slate-900 dark:text-white">
          {item.q}
        </span>
        <span
          className={`grid h-10 w-10 place-items-center rounded-xl border border-slate-900/10 bg-white/80 transition-all duration-300 ease-out dark:border-white/10 dark:bg-slate-950/60 ${
            open ? "shadow-md" : "shadow-sm"
          }`}
          aria-hidden="true"
        >
          <Plus
            className={`h-5 w-5 text-slate-700 transition-transform duration-300 ease-out dark:text-slate-200 ${
              open ? "rotate-45" : "rotate-0"
            }`}
          />
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden px-5">
          <div className="pb-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {item.a}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const list = useMemo(() => items, []);

  return (
    <section className="bg-white py-16 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              FAQs
            </h2>
            <p className="mt-3 max-w-prose text-sm leading-7 text-slate-600 dark:text-slate-300">
              Everything you need to know — clean answers, no noise.
            </p>

            <div className="mt-6 rounded-3xl border border-slate-900/5 bg-slate-50 p-6 shadow-md dark:border-white/10 dark:bg-slate-950">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Support
              </div>
              <div className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                If you want a custom learning plan, we can tailor a track for your goals.
              </div>
              <div className="mt-4 text-sm font-medium text-blue-600">
                Talk to an advisor
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {list.map((item, idx) => (
              <AccordionRow
                key={item.q}
                item={item}
                open={openIndex === idx}
                onToggle={() => setOpenIndex((v) => (v === idx ? -1 : idx))}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
