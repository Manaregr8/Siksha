import Link from "next/link";

type Props = {
  college: {
    id: string;
    name: string;
    slug: string;
    state: string;
    city: string;
    establishedYear: number;
    type: string;
    approval: string;
    logo: string | null;
    _count?: { courses: number };
  };
};

export function CollegeCard({ college }: Props) {
  return (
    <Link
      href={`/college/${college.slug}`}
      className="group rounded-xl border border-slate-900/5 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
            {college.name}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {college.city}, {college.state}
          </p>
        </div>
        <span className="shrink-0 rounded-xl bg-blue-600/10 px-2.5 py-1 text-xs font-medium text-blue-600 dark:bg-blue-600/20">
          {college.type}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-xl bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {college.approval}
        </span>
        <span className="rounded-xl bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          Est. {college.establishedYear}
        </span>
        {typeof college._count?.courses === "number" ? (
          <span className="rounded-xl bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {college._count.courses} courses
          </span>
        ) : null}
      </div>

      <div className="mt-5 text-sm font-medium text-slate-900 group-hover:text-blue-600 dark:text-white">
        View details
      </div>
    </Link>
  );
}
