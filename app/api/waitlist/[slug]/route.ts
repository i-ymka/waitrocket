import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const waitlist = await db.waitlist.findUnique({
    where: { slug },
    select: {
      name: true,
      headline: true,
      rewardCopy: true,
      referralWeight: true,
      brandColor: true,
      logoUrl: true,
      isPoweredByHidden: true,
      _count: { select: { signups: true } },
    },
  });

  if (!waitlist) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({
    name: waitlist.name,
    headline: waitlist.headline,
    rewardCopy: waitlist.rewardCopy,
    referralWeight: waitlist.referralWeight,
    brandColor: waitlist.brandColor,
    logoUrl: waitlist.logoUrl,
    isPoweredByHidden: waitlist.isPoweredByHidden,
    totalSignups: waitlist._count.signups,
  });
}
