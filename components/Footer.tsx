import Link from "next/link";
import {
  Building2,
  GraduationCap,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-slate-600 transition-colors duration-300 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
    >
      {children}
    </Link>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-slate-900/5 bg-white py-14 dark:border-white/10 dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-cyan-500/10 blur-2xl" />
        <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-gradient-to-br from-fuchsia-500/10 via-violet-500/10 to-blue-500/10 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-base font-semibold tracking-tight text-slate-900 dark:text-white"
            >
              <span className="grid h-9 w-9 place-items-center rounded-2xl border border-slate-900/10 bg-white/70 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
                <Sparkles className="h-4 w-4 text-blue-700 dark:text-blue-300" />
              </span>
              Gulshan Sir Siksha
            </Link>

            <p className="mt-3 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300">
              A modern education portal experience — clean filters, premium design, and fast browsing across colleges and programs.
            </p>

            <div className="mt-6 rounded-3xl border border-slate-900/5 bg-white/60 p-5 shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/55">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-900/10 bg-white/70 dark:border-white/10 dark:bg-slate-950/60">
                  <ShieldCheck className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Admin
                  </div>
                  <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                    Manage listings and content securely.
                  </div>
                  <div className="mt-3">
                    <Link
                      href="/admin"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Go to dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <LayoutGrid className="h-4 w-4" />
              Pages
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <FooterLink href="/#top">Home</FooterLink>
              <FooterLink href="/colleges">Colleges</FooterLink>
              <FooterLink href="/courses/2-years">2‑Year Courses</FooterLink>
              <FooterLink href="/courses/3-years">3‑Year Courses</FooterLink>
              <FooterLink href="/admin">Admin</FooterLink>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <Building2 className="h-4 w-4" />
              Explore
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <FooterLink href="/colleges?sort=createdAt&order=desc">Newest colleges</FooterLink>
              <FooterLink href="/courses/2-years?sort=fees&order=asc">Affordable 2‑year</FooterLink>
              <FooterLink href="/courses/3-years?sort=fees&order=asc">Affordable 3‑year</FooterLink>
              <FooterLink href="/colleges?approval=UGC">UGC approved</FooterLink>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <GraduationCap className="h-4 w-4" />
              Home sections
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <FooterLink href="/#why-join">Why join</FooterLink>
              <FooterLink href="/#courses">Programs</FooterLink>
              <FooterLink href="/#popular-states">Popular states</FooterLink>
              <FooterLink href="/#featured-colleges">Featured colleges</FooterLink>
              <FooterLink href="/#achievements">Achievements</FooterLink>
              <FooterLink href="/#testimonials">Testimonials</FooterLink>
              <FooterLink href="/#gallery">Gallery</FooterLink>
              <FooterLink href="/#faq">FAQ</FooterLink>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-900/5 pt-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div>© {year} Gulshan Sir Siksha</div>
          <div className="text-xs">Demo project • Next.js + Prisma</div>
        </div>
      </div>
    </footer>
  );
}
