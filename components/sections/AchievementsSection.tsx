import { AnimatedCounter } from "@/components/sections/AnimatedCounter";

type Stat = {
  label: string;
  value: number;
  suffix?: string;
  hint: string;
};

const stats: Stat[] = [
  { label: "Students", value: 12000, suffix: "+", hint: "Across multiple tracks" },
  { label: "Projects", value: 850, suffix: "+", hint: "Portfolio-ready work" },
  { label: "Hiring partners", value: 120, suffix: "+", hint: "Growing network" },
];

export function AchievementsSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 dark:bg-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-6 h-72 w-[620px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-cyan-500/10 blur-2xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-gradient-to-br from-fuchsia-500/10 via-violet-500/10 to-blue-500/10 blur-2xl dark:animate-pulse" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Our achievements
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Modern stat cards with smooth counters and subtle glow-on-hover.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group rounded-3xl border border-slate-900/5 bg-slate-50/70 p-6 shadow-md backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-950/60"
            >
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {s.label}
              </div>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {s.hint}
              </div>

              <div className="pointer-events-none mt-6 h-px w-full bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
