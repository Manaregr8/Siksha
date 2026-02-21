import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  GraduationCap,
  Landmark,
  MapPinned,
  Mountain,
  Palmtree,
  Sparkles,
  Trees,
  Waves,
} from "lucide-react";
import { CollegeCard } from "@/components/CollegeCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import { SearchBar } from "@/components/SearchBar";
import {
  AchievementsSection,
  CourseCardsSection,
  FaqSection,
  GallerySection,
  TestimonialsSection,
  WhyJoinSection,
} from "@/components/sections";
import { prisma } from "@/lib/prisma";

function stateIconFor(state: string): LucideIcon {
  const s = state.toLowerCase();

  if (s.includes("delhi")) return Landmark;
  if (s.includes("goa")) return Palmtree;
  if (s.includes("kerala") || s.includes("tamil")) return Waves;
  if (s.includes("himachal") || s.includes("uttarakhand") || s.includes("jammu"))
    return Mountain;
  if (s.includes("rajasthan") || s.includes("gujarat")) return Sparkles;
  if (s.includes("assam") || s.includes("meghalaya") || s.includes("arunachal"))
    return Trees;
  if (s.includes("maharashtra") || s.includes("karnataka") || s.includes("telangana"))
    return Building2;

  return MapPinned;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gulshan Sir Siksha | Find Colleges in India",
  description:
    "Find the best colleges in India. Explore 2-year and 3-year courses with search and filters.",
};

export default async function Home() {
  const [featuredColleges, statesAgg] = await Promise.all([
    prisma.college.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        name: true,
        slug: true,
        state: true,
        city: true,
        address: true,
        description: true,
        establishedYear: true,
        type: true,
        approval: true,
        logo: true,
        bannerImage: true,
        _count: { select: { courses: true } },
      },
    }),
    prisma.college.findMany({
      select: { state: true },
    }),
  ]);

  type FeaturedCollege = (typeof featuredColleges)[number];

  const fallbackHeroImages = [
    {
      src: "/colleges/du-650_060114055506_0.jpeg",
      alt: "College background 1",
    },
    {
      src: "/colleges/1.1-Top-10-Best-Colleges-in-India_-A-Comprehensive-Guide-to-Premier-Educational-Institutions-Source-home.iitd_.ac_.in_.jpg",
      alt: "College background 2",
    },
    {
      src: "/colleges/b5af6ee0-ed4d-11eb-a043-f8aaa01a1d1e_1627242083337_1627556687642.webp",
      alt: "College background 3",
    },
  ];

  const heroImages = featuredColleges
    .map((c: FeaturedCollege) => c.bannerImage)
    .filter((s: unknown): s is string => typeof s === "string" && s.length > 0)
    .slice(0, 5)
    .map((src: string, idx: number) => ({ src, alt: `College background ${idx + 1}` }));

  const carouselImages = heroImages.length ? heroImages : fallbackHeroImages;

  const popularStates: string[] = Array.from(
    new Set(
      statesAgg
        .map((row) => row.state)
        .filter((v): v is string => typeof v === "string" && v.trim().length > 0),
    ),
  )
    .sort((a: string, b: string) => a.localeCompare(b))
    .slice(0, 10);

  return (
    <div>
      <section
        id="top"
        className="relative overflow-hidden bg-neutral-50 py-16 dark:bg-neutral-950"
      >
        <div className="absolute inset-0 z-0">
          <HeroCarousel images={carouselImages} />
        </div>
        <div className="pointer-events-none absolute inset-0 z-10 bg-white/80 backdrop-blur-sm dark:bg-neutral-950/70" />
        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
              Find the Best Colleges in India
            </h1>
            <p className="mt-4 text-base leading-7 text-neutral-600 dark:text-neutral-300">
              Search by college, course, or city. Filter by duration, fees and location.
            </p>
            <div className="mt-8">
              <SearchBar actionPath="/colleges" />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href="/colleges"
              className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white/60 p-6 shadow-md backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-neutral-900/55"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-cyan-500/10" />
              </div>

              <div className="relative flex items-start gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-black/10 bg-white/70 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
                  <Building2 className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Explore
                  </div>
                  <div className="mt-1 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                    Colleges
                  </div>
                  <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                    Discover verified listings by city and state.
                  </p>
                  <div className="mt-5 text-sm font-semibold text-blue-600 transition-colors group-hover:text-blue-700">
                    Browse colleges
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/courses/2-years"
              className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white/60 p-6 shadow-md backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-neutral-900/55"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-cyan-500/10" />
              </div>

              <div className="relative flex items-start gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-black/10 bg-white/70 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
                  <GraduationCap className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Programs
                  </div>
                  <div className="mt-1 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                    2‑Year Programs
                  </div>
                  <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                    Explore postgraduate & professional courses.
                  </p>
                  <div className="mt-5 text-sm font-semibold text-blue-600 transition-colors group-hover:text-blue-700">
                    View programs
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/courses/3-years"
              className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white/60 p-6 shadow-md backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-neutral-900/55"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-cyan-500/10" />
              </div>

              <div className="relative flex items-start gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-black/10 bg-white/70 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
                  <Sparkles className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Programs
                  </div>
                  <div className="mt-1 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                    3‑Year Programs
                  </div>
                  <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                    Explore undergraduate courses across streams.
                  </p>
                  <div className="mt-5 text-sm font-semibold text-blue-600 transition-colors group-hover:text-blue-700">
                    View programs
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                About us
              </h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                Shiksha helps students discover colleges and compare courses across India.
                Search by college, course, or city, then use simple filters to narrow down your
                options based on duration, fees, and location.
              </p>
              <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                This portal is built to be fast, mobile-friendly, and easy to browse — whether
                you are exploring 2-year postgraduate programs or 3-year undergraduate courses.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-neutral-50 shadow-md dark:border-white/10 dark:bg-neutral-950">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src="/dizitaladda%20classroom.webp"
                    alt="DizitalAdda classroom"
                    fill
                    sizes="(min-width: 1024px) 520px, 100vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </section>

      <div id="why-join">
        <WhyJoinSection />
      </div>

      <div id="courses">
        <CourseCardsSection />
      </div>

      <section id="popular-states" className="bg-neutral-50 py-16 dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Popular states
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            Browse colleges by location.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {popularStates.map((s) => (
              (() => {
                const Icon = stateIconFor(s);
                const chipBg = s.toLowerCase().includes("goa") || s.toLowerCase().includes("kerala")
                  ? "from-cyan-500/25 via-blue-500/20 to-indigo-500/20"
                  : s.toLowerCase().includes("himachal") || s.toLowerCase().includes("uttarakhand")
                    ? "from-indigo-500/25 via-blue-500/20 to-cyan-500/20"
                    : s.toLowerCase().includes("rajasthan")
                      ? "from-fuchsia-500/20 via-violet-500/20 to-indigo-500/20"
                      : "from-indigo-500/20 via-blue-500/20 to-cyan-500/20";

                return (
              <Link
                key={s}
                href={`/colleges?state=${encodeURIComponent(s)}`}
                className="group flex items-center gap-3 rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-medium text-neutral-800 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-100"
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-black/10 bg-gradient-to-br ${chipBg} shadow-sm dark:border-white/10`}
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4 text-blue-800 dark:text-blue-200" />
                </span>
                <span className="min-w-0 truncate">{s}</span>
              </Link>
                );
              })()
            ))}
          </div>
        </div>
      </section>

      <div id="achievements">
        <AchievementsSection />
      </div>

      <section id="featured-colleges" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                Featured colleges
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                A quick starting point for exploration.
              </p>
            </div>
            <Link
              href="/colleges"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredColleges.map((c) => (
              <CollegeCard key={c.id} college={c} />
            ))}
          </div>
        </div>
      </section>

      <div id="testimonials">
        <TestimonialsSection />
      </div>

      <div id="gallery">
        <GallerySection />
      </div>

      <div id="faq">
        <FaqSection />
      </div>

      
    </div>
  );
}
