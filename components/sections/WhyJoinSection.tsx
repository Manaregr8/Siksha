import Image from "next/image";
import {
  BadgeCheck,
  Brain,
  Layers,
  Rocket,
  Shield,
  Sparkles,
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const features: Feature[] = [
  {
    title: "Outcome-first curriculum",
    description: "Clear modules, clean pacing, and portfolio-ready deliverables.",
    Icon: Rocket,
  },
  {
    title: "Modern tracks",
    description: "GenAI, Security, Full‑Stack, and product-grade skill paths.",
    Icon: Sparkles,
  },
  {
    title: "Premium learning UX",
    description: "Fast, mobile responsive, and designed like top SaaS products.",
    Icon: Layers,
  },
  {
    title: "Trusted frameworks",
    description: "Industry patterns — not random tutorials. Build the right mental models.",
    Icon: Brain,
  },
  {
    title: "Security-by-design",
    description: "Best practices for real deployments, not just demos.",
    Icon: Shield,
  },
  {
    title: "Proof & credibility",
    description: "Projects, reviews, and structured feedback loops.",
    Icon: BadgeCheck,
  },
];

function IconChip({ Icon }: { Icon: Feature["Icon"] }) {
  return (
    <div className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-900/10 bg-white/70 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/60">
      <Icon className="h-5 w-5 text-blue-700 dark:text-blue-300" />
    </div>
  );
}

export function WhyJoinSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/15 via-blue-500/10 to-cyan-500/10 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Why join our programs
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Minimal icons, crisp hierarchy, and a clean grid — premium by default.
            </p>
          </div>

          <div className="lg:justify-self-end">
            <div className="relative overflow-hidden rounded-3xl border border-slate-900/5 bg-white/70 shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
              <div className="aspect-[4/3] w-full max-w-lg">
                <Image
                  src="/dizitaladda%20classroom.webp"
                  alt="DizitalAdda classroom"
                  fill
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-3xl border border-slate-900/5 bg-white/70 p-6 shadow-md backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60"
            >
              <div className="flex items-start gap-4">
                <IconChip Icon={f.Icon} />
                <div>
                  <div className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                    {f.title}
                  </div>
                  <div className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {f.description}
                  </div>
                </div>
              </div>

              <div className="mt-5 h-px w-full bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
