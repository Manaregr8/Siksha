import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function coerceModuleTitles(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const course = await prisma.course.findFirst({
    where: { slug: params.slug, duration: 2 },
    select: { name: true, category: true, college: { select: { name: true } } },
  });

  if (!course) return { title: "Course" };

  return {
    title: `${course.name} | ${course.college.name}`,
    description: `View modules, fees, eligibility, and details for ${course.name} (${course.category}).`,
  };
}

export default async function Course2YearDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const course = await prisma.course.findFirst({
    where: { slug: params.slug, duration: 2 },
    select: {
      id: true,
      name: true,
      slug: true,
      duration: true,
      category: true,
      fees: true,
      eligibility: true,
      modules: true,
      college: {
        select: {
          name: true,
          slug: true,
          city: true,
          state: true,
          type: true,
          approval: true,
        },
      },
    },
  });

  if (!course) notFound();

  const moduleTitles = coerceModuleTitles(course.modules);
  const approxMonthsPerModule =
    moduleTitles.length > 0
      ? Math.max(1, Math.round((course.duration * 12) / moduleTitles.length))
      : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        <div>
          <Link
            href="/courses/2-years"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Back to 2-year courses
          </Link>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {course.name}
          </h1>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {course.category} • {course.duration} Years • ₹
            {course.fees.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-900/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Offered By
              </div>
              <Link
                href={`/college/${course.college.slug}`}
                className="mt-1 block text-base font-semibold text-slate-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-400"
              >
                {course.college.name}
              </Link>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {course.college.city}, {course.college.state} • {course.college.type} • {course.college.approval}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Eligibility
              </div>
              <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                {course.eligibility}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-900/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Modules
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {moduleTitles.length > 0
              ? "Sample module plan for this course."
              : "No modules added yet for this course."}
          </p>

          {moduleTitles.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {moduleTitles.map((title, idx) => (
                <div
                  key={`${course.id}-${idx}`}
                  className="rounded-xl border border-slate-900/10 bg-white px-4 py-3 text-sm text-slate-800 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
                >
                  <div className="font-medium">Module {idx + 1}</div>
                  <div className="mt-1 text-slate-700 dark:text-slate-200">
                    {title}
                  </div>
                  {approxMonthsPerModule ? (
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Approx duration: ≈{approxMonthsPerModule} months
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
