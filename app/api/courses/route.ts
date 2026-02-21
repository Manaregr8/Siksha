import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminFromRequest } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

function toInt(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search")?.trim() || "";
  const duration = searchParams.get("duration")?.trim() || "";
  const category = searchParams.get("category")?.trim() || "";
  const state = searchParams.get("state")?.trim() || "";
  const city = searchParams.get("city")?.trim() || "";
  const type = searchParams.get("type")?.trim() || "";

  const feesMin = searchParams.get("feesMin")?.trim() || "";
  const feesMax = searchParams.get("feesMax")?.trim() || "";

  const sort = searchParams.get("sort")?.trim() || "fees";
  const order = (searchParams.get("order")?.trim() || "asc").toLowerCase();
  const sortOrder: "asc" | "desc" = order === "desc" ? "desc" : "asc";

  const page = Math.max(1, toInt(searchParams.get("page"), 1));
  const pageSize = Math.min(24, Math.max(1, toInt(searchParams.get("pageSize"), 12)));
  const skip = (page - 1) * pageSize;

  const feesWhere: Prisma.IntFilter<"Course"> = {};
  if (feesMin && Number.isFinite(Number(feesMin))) feesWhere.gte = Number(feesMin);
  if (feesMax && Number.isFinite(Number(feesMax))) feesWhere.lte = Number(feesMax);

  const where: Prisma.CourseWhereInput = {
    ...(duration && Number.isFinite(Number(duration))
      ? { duration: Number(duration) }
      : {}),
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
    ...(state || city || type
      ? {
          college: {
            ...(state ? { state } : {}),
            ...(city ? { city } : {}),
            ...(type ? { type } : {}),
          },
        }
      : {}),
  };

  const orderBy: Prisma.CourseOrderByWithRelationInput =
    sort === "name"
      ? { name: sortOrder }
      : { fees: sortOrder };

  const [total, data] = await Promise.all([
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
            id: true,
            name: true,
            slug: true,
            state: true,
            city: true,
            type: true,
            approval: true,
            logo: true,
          },
        },
      },
    }),
  ]);

  return NextResponse.json({
    data,
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  });
}

export async function POST(req: Request) {
  try {
    requireAdminFromRequest(req);

    const body = (await req.json()) as Partial<{
      name: string;
      slug: string;
      duration: number;
      category: string;
      fees: number;
      eligibility: string;
      collegeId: string;
    }>;

    const name = body.name?.trim() ?? "";
    const category = body.category?.trim() ?? "";
    const eligibility = body.eligibility?.trim() ?? "";
    const collegeId = body.collegeId?.trim() ?? "";

    const duration = Number(body.duration);
    const fees = Number(body.fees);

    if (!name || !category || !eligibility || !collegeId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (![2, 3].includes(duration)) {
      return NextResponse.json({ error: "Duration must be 2 or 3" }, { status: 400 });
    }

    if (!Number.isFinite(fees) || fees < 0) {
      return NextResponse.json({ error: "Fees must be a positive number" }, { status: 400 });
    }

    const slug = (body.slug?.trim() && slugify(body.slug)) || slugify(`${collegeId}-${name}`);

    const created = await prisma.course.create({
      data: {
        name,
        slug,
        duration,
        category,
        fees,
        eligibility,
        collegeId,
      },
    });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unauthorized";
    const status = message.toLowerCase().includes("unauth") || message.toLowerCase().includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(req: Request) {
  try {
    requireAdminFromRequest(req);
    const body = (await req.json()) as unknown;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const record = body as Record<string, unknown>;
    const id = typeof record.id === "string" ? record.id.trim() : "";
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const data: Prisma.CourseUncheckedUpdateInput = {};
    if (typeof record.name === "string") data.name = record.name.trim();
    if (typeof record.category === "string") data.category = record.category.trim();
    if (typeof record.eligibility === "string") data.eligibility = record.eligibility.trim();
    if (typeof record.collegeId === "string") data.collegeId = record.collegeId.trim();

    if (typeof record.duration !== "undefined") {
      const duration = Number(record.duration);
      if ([2, 3].includes(duration)) data.duration = duration;
    }

    if (typeof record.fees !== "undefined") {
      const fees = Number(record.fees);
      if (Number.isFinite(fees) && fees >= 0) data.fees = fees;
    }

    if (typeof record.slug === "string" && record.slug.trim()) {
      data.slug = slugify(record.slug);
    } else if (typeof data.name === "string" && data.name) {
      data.slug = slugify(data.name);
    }

    const updated = await prisma.course.update({ where: { id }, data });
    return NextResponse.json({ data: updated });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unauthorized";
    const status = message.toLowerCase().includes("unauth") || message.toLowerCase().includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(req: Request) {
  try {
    requireAdminFromRequest(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")?.trim();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unauthorized";
    const status = message.toLowerCase().includes("unauth") || message.toLowerCase().includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
