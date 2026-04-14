import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const college = await prisma.college.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true, city: true, state: true },
  });

  if (!college) {
    return {
      title: "College not found",
      description: "College not found",
    };
  }

  return {
    title: `${college.name} | Colleges in India`,
    description: `${college.city}, ${college.state} — ${college.description}`,
  };
}

export default async function CollegeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const college = await prisma.college.findUnique({
    where: { slug: params.slug },
    include: {
      courses: {
        orderBy: [{ duration: "asc" }, { fees: "asc" }],
      },
    },
  });

  if (!college) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-xl border border-slate-900/5 bg-white shadow-md dark:border-white/10 dark:bg-slate-900">
        <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
          {college.bannerImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${college.bannerImage})` }}
              aria-hidden="true"
            />
          ) : null}
          <div
            className="absolute inset-0 bg-gradient-to-r from-slate-950/25 via-slate-950/10 to-transparent dark:from-slate-950/45 dark:via-slate-950/15"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/20 dark:to-slate-950/35"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 px-6 pb-6">
          <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-slate-900/5 bg-white text-sm font-semibold text-slate-900 shadow-md dark:border-white/10 dark:bg-slate-950 dark:text-white">
                Logo
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {college.name}
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {college.city}, {college.state}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-xl bg-blue-600/10 px-2.5 py-1 text-xs font-medium text-blue-600 dark:bg-blue-600/20">
                {college.type}
              </span>
              <span className="rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {college.approval}
              </span>
              <span className="rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Est. {college.establishedYear}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-8">
              <section>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Overview
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {college.description}
                </p>
                <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                  <div className="font-medium text-slate-900 dark:text-white">
                    Address
                  </div>
                  <div className="mt-1">{college.address}</div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Courses
                  </h2>
                  <Link
                    href="/colleges"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Browse more
                  </Link>
                </div>

                <div className="mt-3 overflow-x-auto rounded-xl border border-slate-900/5 dark:border-white/10">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                      <tr>
                        <th className="px-4 py-3">Course</th>
                        <th className="px-4 py-3">Duration</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Fees</th>
                        <th className="px-4 py-3">Eligibility</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-800 dark:text-slate-100">
                      {college.courses.map((c) => (
                        <tr
                          key={c.id}
                          className="border-t border-slate-900/5 dark:border-white/10"
                        >
                          <td className="px-4 py-3 font-medium">{c.name}</td>
                          <td className="px-4 py-3">{c.duration} Years</td>
                          <td className="px-4 py-3">{c.category}</td>
                          <td className="px-4 py-3">₹{c.fees.toLocaleString("en-IN")}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                            {c.eligibility}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <aside className="space-y-4">
              <div className="rounded-xl border border-slate-900/5 bg-white p-5 shadow-md dark:border-white/10 dark:bg-slate-900">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Apply
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Interested in {college.name}? Start your application.
                </p>
                <button className="mt-4 h-11 w-full rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700">
                  Apply now
                </button>
              </div>

              <div className="rounded-xl border border-slate-900/5 bg-white p-5 shadow-md dark:border-white/10 dark:bg-slate-900">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Location
                </h3>
                <div className="mt-3 h-40 w-full rounded-xl bg-slate-100 dark:bg-slate-800" />
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                  Google Map placeholder
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
