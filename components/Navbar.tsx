import Link from "next/link";
import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-neutral-900/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white"
        >
          Shiksha
        </Link>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <div className="w-full sm:w-[360px]">
            <Suspense
              fallback={
                <div className="h-[60px] w-full rounded-xl border border-black/5 bg-white/70 dark:border-white/10 dark:bg-neutral-900" />
              }
            >
              <SearchBar actionPath="/colleges" placeholder="Search colleges, courses, city…" />
            </Suspense>
          </div>

          <nav className="flex items-center gap-3">
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
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
