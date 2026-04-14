import Link from "next/link";

type Props = {
  course: {
    id: string;
    name: string;
    slug: string;
    duration: number;
    category: string;
    fees: number;
    eligibility: string;
    college: {
      name: string;
      slug: string;
      city: string;
      state: string;
      type: string;
      approval: string;
    };
  };
};

export function CourseCard({ course }: Props) {
  const detailsHref =
    course.duration === 2
      ? `/courses/2-year/${course.slug}`
      : `/courses/3-year/${course.slug}`;

  return (
    <div className="rounded-xl border border-slate-900/5 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            href={detailsHref}
            className="block truncate text-base font-semibold text-slate-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-400"
          >
            {course.name}
          </Link>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {course.category} • {course.duration} Years
          </p>
        </div>
        <span className="shrink-0 rounded-xl bg-blue-600/10 px-2.5 py-1 text-xs font-medium text-blue-600 dark:bg-blue-600/20">
          ₹{course.fees.toLocaleString("en-IN")}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        Eligibility: {course.eligibility}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-slate-600 dark:text-slate-300">
          {course.college.city}, {course.college.state}
        </div>
        <Link
          href={`/college/${course.college.slug}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {course.college.name}
        </Link>
      </div>

      <div className="mt-4">
        <Link
          href={detailsHref}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View course details
        </Link>
      </div>
    </div>
  );
}
