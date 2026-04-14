import type { Metadata } from "next";
import Link from "next/link";
import { CollegeCard } from "@/components/CollegeCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { SearchBar } from "@/components/SearchBar";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Colleges in India",
  description: "Browse colleges across India with search and filters.",
};

function toInt(value: unknown, fallback: number): number {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

export default async function CollegesPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const search = (searchParams.search as string | undefined)?.trim() || "";
  const state = (searchParams.state as string | undefined)?.trim() || "";
  const city = (searchParams.city as string | undefined)?.trim() || "";
  const type = (searchParams.type as string | undefined)?.trim() || "";
  const approval = (searchParams.approval as string | undefined)?.trim() || "";

  const sort = ((searchParams.sort as string | undefined) || "name").trim();
  const order = ((searchParams.order as string | undefined) || "asc").trim();
  const sortOrder: "asc" | "desc" = order === "desc" ? "desc" : "asc";

  const page = Math.max(1, toInt(searchParams.page, 1));
  const pageSize = Math.min(24, Math.max(1, toInt(searchParams.pageSize, 12)));
  const skip = (page - 1) * pageSize;

  const where: Prisma.CollegeWhereInput = {
    ...(state ? { state } : {}),
    ...(city ? { city } : {}),
    ...(type ? { type } : {}),
    ...(approval ? { approval } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
            {
              courses: {
                some: { name: { contains: search, mode: "insensitive" } },
              },
            },
          ] satisfies Prisma.CollegeWhereInput[],
        }
      : {}),
  };

  const orderBy: Prisma.CollegeOrderByWithRelationInput =
    sort === "createdAt"
      ? { createdAt: sortOrder }
      : sort === "establishedYear"
        ? { establishedYear: sortOrder }
        : { name: sortOrder };

  const [total, colleges, statesAgg, citiesAgg, typesAgg, approvalsAgg] =
    await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
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
          _count: { select: { courses: true } },
        },
      }),
      prisma.college.findMany({ distinct: ["state"], select: { state: true } }),
      prisma.college.findMany({ distinct: ["city"], select: { city: true } }),
      prisma.college.findMany({ distinct: ["type"], select: { type: true } }),
      prisma.college.findMany({ distinct: ["approval"], select: { approval: true } }),
    ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const options = {
    states: statesAgg.map((c) => c.state),
    cities: citiesAgg.map((c) => c.city),
    types: typesAgg.map((c) => c.type),
    approvals: approvalsAgg.map((c) => c.approval),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Colleges in India
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Search by college name, course, or city.
          </p>
        </div>

        <SearchBar actionPath="/colleges" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <FilterSidebar kind="colleges" options={options} />

          <div>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Showing {colleges.length} of {total} colleges
              </p>
              <Link
                href="/"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Back to home
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {colleges.map((c) => (
                <CollegeCard key={c.id} college={c} />
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
            ? "pointer-events-none border-slate-900/5 text-slate-400 dark:border-white/10"
            : "border-slate-900/10 text-slate-800 hover:bg-slate-50 dark:border-white/10 dark:text-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        Prev
      </Link>
      <div className="text-sm text-slate-600 dark:text-slate-300">
        Page {page} of {totalPages}
      </div>
      <Link
        href={makeHref(next)}
        aria-disabled={page >= totalPages}
        className={`h-10 rounded-xl border px-4 text-sm font-medium transition-colors ${
          page >= totalPages
            ? "pointer-events-none border-slate-900/5 text-slate-400 dark:border-white/10"
            : "border-slate-900/10 text-slate-800 hover:bg-slate-50 dark:border-white/10 dark:text-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        Next
      </Link>
    </div>
  );
}
