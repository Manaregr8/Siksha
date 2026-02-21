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
  const state = searchParams.get("state")?.trim() || "";
  const city = searchParams.get("city")?.trim() || "";
  const type = searchParams.get("type")?.trim() || "";
  const approval = searchParams.get("approval")?.trim() || "";

  const sort = searchParams.get("sort")?.trim() || "name";
  const order = (searchParams.get("order")?.trim() || "asc").toLowerCase();
  const sortOrder: "asc" | "desc" = order === "desc" ? "desc" : "asc";

  const page = Math.max(1, toInt(searchParams.get("page"), 1));
  const pageSize = Math.min(24, Math.max(1, toInt(searchParams.get("pageSize"), 12)));
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
            { courses: { some: { name: { contains: search, mode: "insensitive" } } } },
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

  const [total, data] = await Promise.all([
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
        bannerImage: true,
        createdAt: true,
        _count: { select: { courses: true } },
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
      state: string;
      city: string;
      address: string;
      description: string;
      establishedYear: number;
      type: string;
      approval: string;
      logo: string | null;
      bannerImage: string | null;
    }>;

    const name = body.name?.trim() ?? "";
    const state = body.state?.trim() ?? "";
    const city = body.city?.trim() ?? "";
    const address = body.address?.trim() ?? "";
    const description = body.description?.trim() ?? "";
    const type = body.type?.trim() ?? "";
    const approval = body.approval?.trim() ?? "";
    const establishedYear = Number(body.establishedYear);

    if (
      !name ||
      !state ||
      !city ||
      !address ||
      !description ||
      !type ||
      !approval ||
      !Number.isFinite(establishedYear)
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const slug = (body.slug?.trim() && slugify(body.slug)) || slugify(name);

    const created = await prisma.college.create({
      data: {
        name,
        slug,
        state,
        city,
        address,
        description,
        establishedYear,
        type,
        approval,
        logo: body.logo ?? null,
        bannerImage: body.bannerImage ?? null,
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

    const data: Prisma.CollegeUpdateInput = {};

    if (typeof record.name === "string") data.name = record.name.trim();
    if (typeof record.state === "string") data.state = record.state.trim();
    if (typeof record.city === "string") data.city = record.city.trim();
    if (typeof record.address === "string") data.address = record.address.trim();
    if (typeof record.description === "string") data.description = record.description.trim();
    if (typeof record.type === "string") data.type = record.type.trim();
    if (typeof record.approval === "string") data.approval = record.approval.trim();
    if (typeof record.logo === "string") data.logo = record.logo.trim();
    if (record.logo === null) data.logo = null;
    if (typeof record.bannerImage === "string") data.bannerImage = record.bannerImage.trim();
    if (record.bannerImage === null) data.bannerImage = null;

    if (typeof record.establishedYear !== "undefined") {
      const year = Number(record.establishedYear);
      if (Number.isFinite(year)) data.establishedYear = year;
    }

    if (typeof record.slug === "string" && record.slug.trim()) {
      data.slug = slugify(record.slug);
    } else if (typeof data.name === "string" && data.name) {
      data.slug = slugify(data.name);
    }

    const updated = await prisma.college.update({ where: { id }, data });
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

    await prisma.course.deleteMany({ where: { collegeId: id } });
    await prisma.college.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unauthorized";
    const status = message.toLowerCase().includes("unauth") || message.toLowerCase().includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
