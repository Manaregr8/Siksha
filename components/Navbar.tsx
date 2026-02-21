import Link from "next/link";
import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-neutral-900/80">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white"
          >
            Shiksha
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <details className="group relative sm:hidden">
              <summary
                aria-label="Open menu"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-black/10 bg-white px-3 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-800 [&::-webkit-details-marker]:hidden"
              >
                <span className="flex flex-col justify-center gap-1.5">
                  <span className="h-0.5 w-5 rounded bg-current" />
                  <span className="h-0.5 w-5 rounded bg-current" />
                  <span className="h-0.5 w-5 rounded bg-current" />
                </span>
              </summary>

              <nav className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-black/10 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-neutral-950">
                <Link
                  className="flex h-10 items-center rounded-lg px-3 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  href="/colleges"
                >
                  Colleges
                </Link>
                <Link
                  className="flex h-10 items-center rounded-lg px-3 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  href="/courses/2-years"
                >
                  Courses
                </Link>
              </nav>
            </details>
          </div>
        </div>

        <div className="mt-3 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="w-full sm:w-[360px]">
            <Suspense
              fallback={
                <div className="h-[60px] w-full rounded-xl border border-black/5 bg-white/70 dark:border-white/10 dark:bg-neutral-900" />
              }
            >
              <SearchBar actionPath="/colleges" placeholder="Search colleges, courses, city…" />
            </Suspense>
          </div>

          <nav className="hidden items-center gap-3 sm:flex">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-xl border border-black/10 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-800"
              href="/colleges"
            >
              Colleges
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-xl border border-black/10 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-800"
              href="/courses/2-years"
            >
              Courses
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
