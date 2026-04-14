import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

type MarketingCourse = {
  title: string;
  badge: string;
  duration: string;
  price: string;
  description: string;
  imageSrc: string;
  href: string;
};

const courses: MarketingCourse[] = [
  {
    title: "GenAI Product Builder",
    badge: "GenAI",
    duration: "12 months",
    price: "₹79,000",
    description: "From prompts to production — ship real AI features with modern tooling.",
    imageSrc:
      "/colleges/1.1-Top-10-Best-Colleges-in-India_-A-Comprehensive-Guide-to-Premier-Educational-Institutions-Source-home.iitd_.ac_.in_.jpg",
    href: "/courses/2-years",
  },
  {
    title: "Cyber Security Analyst",
    badge: "Cyber Security",
    duration: "9 months",
    price: "₹69,000",
    description: "Hands-on labs, SOC fundamentals, incident response, and real-world playbooks.",
    imageSrc: "/colleges/b5af6ee0-ed4d-11eb-a043-f8aaa01a1d1e_1627242083337_1627556687642.webp",
    href: "/courses/2-years",
  },
  {
    title: "Full‑Stack Web Engineer",
    badge: "Advanced",
    duration: "10 months",
    price: "₹74,000",
    description: "Build modern apps end-to-end with production patterns and portfolio projects.",
    imageSrc: "/colleges/du-650_060114055506_0.jpeg",
    href: "/courses/3-years",
  },
  {
    title: "UI/UX Design Sprint",
    badge: "Beginner",
    duration: "6 months",
    price: "₹49,000",
    description: "Learn a clean, modern UX process and craft a standout case study.",
    imageSrc: "/hero/college-1.svg",
    href: "/courses/3-years",
  },
  {
    title: "Data & Analytics",
    badge: "Advanced",
    duration: "8 months",
    price: "₹59,000",
    description: "Analytics foundations, dashboards, metrics — and decision-ready storytelling.",
    imageSrc: "/hero/college-2.svg",
    href: "/courses/2-years",
  },
  {
    title: "Career Launch Kit",
    badge: "Beginner",
    duration: "4 months",
    price: "₹29,000",
    description: "Projects, templates, and interview practice — ship your portfolio with confidence.",
    imageSrc: "/hero/college-3.svg",
    href: "/courses/3-years",
  },
];

function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-900/10 bg-white/70 px-2.5 py-1 text-xs font-medium text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-200">
      <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
      {children}
    </span>
  );
}

export function CourseCardsSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-80 w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-500/15 via-blue-500/10 to-cyan-500/10 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Premium courses, built for outcomes
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              A clean card system with glass, soft gradients, and modern interactions.
            </p>
          </div>
          <Link
            href="/courses/2-years"
            className="hidden text-sm font-medium text-blue-600 hover:text-blue-700 sm:inline"
          >
            Browse all
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <div
              key={c.title}
              className="group rounded-3xl bg-gradient-to-r from-indigo-500/15 via-blue-500/10 to-cyan-500/10 p-px transition-all duration-300 ease-out hover:from-indigo-500/30 hover:via-blue-500/25 hover:to-cyan-500/25"
            >
              <div className="relative overflow-hidden rounded-3xl border border-slate-900/5 bg-white/70 shadow-md backdrop-blur-xl transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60">
                <div className="absolute inset-0">
                  <img
                    src={c.imageSrc}
                    alt=""
                    className="h-full w-full object-cover opacity-25 transition-transform duration-300 ease-out group-hover:scale-[1.04] dark:opacity-15"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/45 to-white/85 dark:from-slate-950/50 dark:via-slate-950/65 dark:to-slate-950/85" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-center justify-between gap-3">
                    <Badge>{c.badge}</Badge>
                    <span className="rounded-full border border-slate-900/10 bg-white/70 px-2.5 py-1 text-xs font-medium text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-200">
                      {c.duration}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {c.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Starting at
                      </div>
                      <div className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                        {c.price}
                      </div>
                    </div>

                    <Link
                      href={c.href}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 ease-out hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 dark:focus:ring-blue-500/30"
                    >
                      Explore
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:hidden">
          <Link href="/courses/2-years" className="text-sm font-medium text-blue-600">
            Browse all courses
          </Link>
        </div>
      </div>
    </section>
  );
}
