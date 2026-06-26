import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  const waitlist = await db.waitlist.findUnique({
    where: { slug },
    select: { id: true, ownerId: true, referralWeight: true },
  });
  if (!waitlist) {
    return Response.json({ error: "Waitlist not found" }, { status: 404 });
  }
  if (waitlist.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const signups = await db.waitlistSignup.findMany({
    where: { waitlistId: waitlist.id },
    orderBy: { basePosition: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      basePosition: true,
      referralCount: true,
      createdAt: true,
    },
  });

  const enriched = signups.map((s) => ({
    ...s,
    currentPosition: Math.max(
      1,
      s.basePosition - s.referralCount * waitlist.referralWeight
    ),
  }));

  enriched.sort((a, b) => a.currentPosition - b.currentPosition);

  const topReferrers = [...enriched]
    .sort((a, b) => b.referralCount - a.referralCount)
    .slice(0, 10)
    .filter((s) => s.referralCount > 0)
    .map(({ email, name, referralCount }) => ({ email, name, referralCount }));

  return Response.json({
    signups: enriched,
    totalSignups: enriched.length,
    topReferrers,
  });
}
