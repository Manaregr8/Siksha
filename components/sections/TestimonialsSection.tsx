import { Star } from "lucide-react";

type Testimonial = {
  name: string;
  role: string;
  avatarText: string;
  rating: number;
  quote: string;
  highlight: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Aarav Mehta",
    role: "Full‑Stack Student",
    avatarText: "AM",
    rating: 5,
    quote:
      "The modules are crisp, the projects feel real, and the mentorship kept me accountable. It genuinely feels like a premium product.",
    highlight: "premium product",
  },
  {
    name: "Isha Sharma",
    role: "GenAI Track",
    avatarText: "IS",
    rating: 5,
    quote:
      "I finally understood how to build and ship. The course roadmap and weekly sprints made learning predictable and fast.",
    highlight: "build and ship",
  },
  {
    name: "Kabir Verma",
    role: "Cyber Security Track",
    avatarText: "KV",
    rating: 5,
    quote:
      "The curriculum is structured like an industry playbook. The labs and capstone felt like what teams do at work.",
    highlight: "industry playbook",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "text-blue-600 dark:text-blue-400"
              : "text-slate-300 dark:text-slate-700"
          }`}
          fill={i < rating ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

function Quote({ quote, highlight }: { quote: string; highlight: string }) {
  const parts = quote.split(highlight);
  if (parts.length !== 2) return <span>{quote}</span>;

  return (
    <>
      {parts[0]}
      <span className="rounded-lg bg-blue-600/10 px-2 py-0.5 font-medium text-blue-700 dark:bg-blue-600/20 dark:text-blue-300">
        {highlight}
      </span>
      {parts[1]}
    </>
  );
}

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/20 via-blue-500/15 to-cyan-500/10 blur-2xl" />
        <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-gradient-to-br from-fuchsia-500/15 via-violet-500/10 to-blue-500/10 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Loved by ambitious learners
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Glassy cards, honest feedback, and outcomes-focused learning — built like a funded startup.
          </p>
        </div>

        <div className="mt-8">
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="group relative min-w-[280px] snap-start rounded-3xl border border-slate-900/5 bg-white/60 p-6 shadow-md backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60"
              >
                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-cyan-500/10" />
                </div>

                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-indigo-500/40 via-blue-500/30 to-cyan-500/30 text-sm font-semibold text-slate-900 dark:text-white">
                      {t.avatarText}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {t.name}
                      </div>
                      <div className="truncate text-xs text-slate-600 dark:text-slate-300">
                        {t.role}
                      </div>
                    </div>
                  </div>

                  <Stars rating={t.rating} />
                </div>

                <div className="relative mt-4 text-sm leading-7 text-slate-700 dark:text-slate-200">
                  <span className="text-blue-700/70 dark:text-blue-300/70">“</span>
                  <Quote quote={t.quote} highlight={t.highlight} />
                  <span className="text-blue-700/70 dark:text-blue-300/70">”</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 sm:hidden">
            Swipe to explore testimonials
          </div>
        </div>
      </div>
    </section>
  );
}
