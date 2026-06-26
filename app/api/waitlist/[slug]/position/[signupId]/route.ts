import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const APP_URL = "https://waitrocket.com";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; signupId: string }> }
) {
  const { slug, signupId } = await params;

  const waitlist = await db.waitlist.findUnique({
    where: { slug },
    select: { id: true, referralWeight: true },
  });
  if (!waitlist) {
    return Response.json({ error: "Waitlist not found" }, { status: 404 });
  }

  const signup = await db.waitlistSignup.findFirst({
    where: { id: signupId, waitlistId: waitlist.id },
    select: { referralCount: true, basePosition: true },
  });
  if (!signup) {
    return Response.json({ error: "Signup not found" }, { status: 404 });
  }

  const currentPosition = Math.max(
    1,
    signup.basePosition - signup.referralCount * waitlist.referralWeight
  );
  const referralLink = `${APP_URL}/w/${slug}?ref=${signupId}`;

  return Response.json({
    currentPosition,
    referralCount: signup.referralCount,
    referralLink,
  });
}
