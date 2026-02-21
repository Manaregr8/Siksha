import type { Metadata } from "next";
import Link from "next/link";
import { CourseCard } from "@/components/CourseCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { SearchBar } from "@/components/SearchBar";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "2-Year Courses",
  description: "Browse 2-year courses across Indian colleges with filters.",
};

function toInt(value: unknown, fallback: number): number {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

export default async function Courses2YearsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const search = (searchParams.search as string | undefined)?.trim() || "";
  const state = (searchParams.state as string | undefined)?.trim() || "";
  const city = (searchParams.city as string | undefined)?.trim() || "";
  const type = (searchParams.type as string | undefined)?.trim() || "";
  const approval = (searchParams.approval as string | undefined)?.trim() || "";
  const category = (searchParams.category as string | undefined)?.trim() || "";

  const feesMin = (searchParams.feesMin as string | undefined)?.trim() || "";
  const feesMax = (searchParams.feesMax as string | undefined)?.trim() || "";

  const sort = ((searchParams.sort as string | undefined) || "fees").trim();
  const order = ((searchParams.order as string | undefined) || "asc").trim();
  const sortOrder: "asc" | "desc" = order === "desc" ? "desc" : "asc";

  const page = Math.max(1, toInt(searchParams.page, 1));
  const pageSize = Math.min(24, Math.max(1, toInt(searchParams.pageSize, 12)));
  const skip = (page - 1) * pageSize;

  const feesWhere: Prisma.IntFilter<"Course"> = {};
  if (feesMin && Number.isFinite(Number(feesMin))) feesWhere.gte = Number(feesMin);
  if (feesMax && Number.isFinite(Number(feesMax))) feesWhere.lte = Number(feesMax);

  const where: Prisma.CourseWhereInput = {
    duration: 2,
    ...(category ? { category } : {}),
    ...(Object.keys(feesWhere).length ? { fees: feesWhere } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { college: { name: { contains: search, mode: "insensitive" } } },
            { college: { city: { contains: search, mode: "insensitive" } } },
          ] satisfies Prisma.CourseWhereInput[],
        }
      : {}),
    ...(state || city || type || approval
      ? {
          college: {
            ...(state ? { state } : {}),
            ...(city ? { city } : {}),
            ...(type ? { type } : {}),
            ...(approval ? { approval } : {}),
          },
        }
      : {}),
  };

  const orderBy: Prisma.CourseOrderByWithRelationInput =
    sort === "name" ? { name: sortOrder } : { fees: sortOrder };

  const [
    total,
    courses,
    statesAgg,
    citiesAgg,
    typesAgg,
    approvalsAgg,
    categoriesAgg,
  ] = await Promise.all([
    prisma.course.count({ where }),
    prisma.course.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      select: {
        id: true,
        name: true,
        slug: true,
        duration: true,
        category: true,
        fees: true,
        eligibility: true,
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
    }),
    prisma.college.findMany({ distinct: ["state"], select: { state: true } }),
    prisma.college.findMany({ distinct: ["city"], select: { city: true } }),
    prisma.college.findMany({ distinct: ["type"], select: { type: true } }),
    prisma.college.findMany({ distinct: ["approval"], select: { approval: true } }),
    prisma.course.findMany({
      where: { duration: 2 },
      distinct: ["category"],
      select: { category: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const options = {
    states: statesAgg.map((c) => c.state),
    cities: citiesAgg.map((c) => c.city),
    types: typesAgg.map((c) => c.type),
    approvals: approvalsAgg.map((c) => c.approval),
    categories: categoriesAgg.map((c) => c.category),
  };

  const title = "2-Year Courses";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
            Filter by state, city, fees, and college type.
          </p>
        </div>

        <SearchBar actionPath="/courses/2-years" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <FilterSidebar kind="courses" options={options} />

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Showing {courses.length} of {total} courses
              </p>
              <Link
                href="/"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Back to home
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {courses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} searchParams={searchParams} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);

  const makeHref = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (typeof v === "string" && v) params.set(k, v);
    }
    params.set("page", String(p));
    return `?${params.toString()}`;
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      <Link
        href={makeHref(prev)}
        aria-disabled={page <= 1}
        className={`h-10 rounded-xl border px-4 text-sm font-medium transition-colors ${
          page <= 1
            ? "pointer-events-none border-black/5 text-neutral-400 dark:border-white/10"
            : "border-black/10 text-neutral-800 hover:bg-neutral-50 dark:border-white/10 dark:text-neutral-100 dark:hover:bg-neutral-800"
        }`}
      >
        Prev
      </Link>
      <div className="text-sm text-neutral-600 dark:text-neutral-300">
        Page {page} of {totalPages}
      </div>
      <Link
        href={makeHref(next)}
        aria-disabled={page >= totalPages}
        className={`h-10 rounded-xl border px-4 text-sm font-medium transition-colors ${
          page >= totalPages
            ? "pointer-events-none border-black/5 text-neutral-400 dark:border-white/10"
            : "border-black/10 text-neutral-800 hover:bg-neutral-50 dark:border-white/10 dark:text-neutral-100 dark:hover:bg-neutral-800"
        }`}
      >
        Next
      </Link>
    </div>
  );
}
