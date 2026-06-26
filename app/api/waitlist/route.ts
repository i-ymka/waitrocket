import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 50);
}

function generateSlug(name: string): string {
  const base = toSlug(name) || "waitlist";
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}

// GET /api/waitlist — list authenticated user's waitlists
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const waitlists = await db.waitlist.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      name: true,
      headline: true,
      brandColor: true,
      logoUrl: true,
      createdAt: true,
      _count: { select: { signups: true } },
    },
  });

  return Response.json(waitlists);
}

// POST /api/waitlist — Waitlist Builder creation (requires auth)
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name =
    typeof body.name === "string" ? body.name.trim() : "";
  const headline =
    typeof body.headline === "string" ? body.headline.trim() : "";
  const rewardCopy =
    typeof body.rewardCopy === "string" ? body.rewardCopy.trim() : "";
  const referralWeight =
    typeof body.referralWeight === "number" && body.referralWeight > 0
      ? Math.floor(body.referralWeight)
      : 10;
  const brandColor =
    typeof body.brandColor === "string" &&
    /^#[0-9a-fA-F]{6}$/.test(body.brandColor)
      ? body.brandColor
      : "#7c3aed";
  const logoUrl =
    typeof body.logoUrl === "string" && body.logoUrl.trim()
      ? body.logoUrl.trim()
      : null;

  if (!name) {
    return Response.json({ error: "name is required" }, { status: 400 });
  }
  if (!headline) {
    return Response.json({ error: "headline is required" }, { status: 400 });
  }
  if (!rewardCopy) {
    return Response.json({ error: "rewardCopy is required" }, { status: 400 });
  }

  let slug = generateSlug(name);
  const existing = await db.waitlist.findUnique({ where: { slug } });
  if (existing) slug = generateSlug(name);

  const waitlist = await db.waitlist.create({
    data: {
      slug,
      ownerId: userId,
      name,
      headline,
      rewardCopy,
      referralWeight,
      brandColor,
      logoUrl,
    },
  });

  return Response.json(waitlist, { status: 201 });
}
