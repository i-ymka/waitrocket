import { db } from "@/lib/db";
import {
  sendWaitlistConfirmation,
  sendWaitlistPositionUpdate,
} from "@/lib/email";

export const dynamic = "force-dynamic";

const APP_URL = "https://waitrocket.com";

// Disposable / throwaway email domains rejected at signup so owners' numbers
// stay real (powers the "disposable-email blocking" promise on the landing).
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com", "yopmail.com", "guerrillamail.com", "sharklasers.com",
  "10minutemail.com", "temp-mail.org", "tempmail.com", "throwawaymail.com",
  "getnada.com", "nada.email", "trashmail.com", "maildrop.cc", "dispostable.com",
  "fakeinbox.com", "mailnesia.com", "mintemail.com", "mohmal.com", "moakt.com",
  "emailondeck.com", "getairmail.com", "tempr.email", "discard.email",
  "spam4.me", "grr.la", "guerrillamailblock.com", "mailcatch.com",
  "tempmailo.com", "tmail.ws", "33mail.com", "burnermail.io", "inboxkitten.com",
  "web-library.net",
]);

function calcPosition(
  basePosition: number,
  referralCount: number,
  referralWeight: number
): number {
  return Math.max(1, basePosition - referralCount * referralWeight);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const name =
    typeof body.name === "string" && body.name.trim()
      ? body.name.trim()
      : null;
  const ref =
    typeof body.ref === "string" && body.ref.trim()
      ? body.ref.trim()
      : null;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Valid email required" }, { status: 400 });
  }

  // Reject disposable / temp-mail addresses to keep the waitlist clean
  const emailDomain = email.split("@")[1] ?? "";
  if (DISPOSABLE_EMAIL_DOMAINS.has(emailDomain)) {
    return Response.json(
      { error: "Disposable email addresses aren't allowed. Please use a real email." },
      { status: 400 }
    );
  }

  const waitlist = await db.waitlist.findUnique({ where: { slug } });
  if (!waitlist) {
    return Response.json({ error: "Waitlist not found" }, { status: 404 });
  }

  // Enforce Free plan limit: 500 signups per waitlist owner
  const FREE_SIGNUP_LIMIT = 500;
  const owner = await db.user.findUnique({ where: { id: waitlist.ownerId }, select: { plan: true } });
  if (!owner || owner.plan === "FREE") {
    const ownerWaitlistIds = await db.waitlist.findMany({
      where: { ownerId: waitlist.ownerId },
      select: { id: true },
    });
    const totalSignups = await db.waitlistSignup.count({
      where: { waitlistId: { in: ownerWaitlistIds.map((w) => w.id) } },
    });
    if (totalSignups >= FREE_SIGNUP_LIMIT) {
      return Response.json(
        { error: "This waitlist has reached its free plan limit. The owner needs to upgrade to Pro." },
        { status: 402 }
      );
    }
  }

  // Validate referrer exists in this waitlist
  let validReferrerId: string | null = null;
  if (ref) {
    const referrer = await db.waitlistSignup.findFirst({
      where: { id: ref, waitlistId: waitlist.id },
      select: { id: true },
    });
    if (referrer) validReferrerId = referrer.id;
  }

  // Count current signups to compute basePosition for potential new signup
  const totalBefore = await db.waitlistSignup.count({
    where: { waitlistId: waitlist.id },
  });
  const basePosition = totalBefore + 1;

  // Upsert eliminates the findUnique+create race window: only one row is ever
  // created per (waitlistId, email). The update clause is a no-op so existing
  // signups are returned unchanged.
  const upsertedAt = new Date();
  const signup = await db.waitlistSignup.upsert({
    where: { waitlistId_email: { waitlistId: waitlist.id, email } },
    create: {
      waitlistId: waitlist.id,
      email,
      name,
      referrerId: validReferrerId,
      basePosition,
    },
    update: {},
  });

  // Detect whether this was a new signup (created just now) vs pre-existing
  const isNewSignup = signup.createdAt >= upsertedAt;

  if (!isNewSignup) {
    const currentPosition = calcPosition(
      signup.basePosition,
      signup.referralCount,
      waitlist.referralWeight
    );
    const referralLink = `${APP_URL}/w/${slug}?ref=${signup.id}`;
    return Response.json({
      signupId: signup.id,
      email: signup.email,
      currentPosition,
      referralLink,
    });
  }

  // Increment referrer's count and fetch updated state
  let referrerSignup: { id: string; email: string; name: string | null; referralCount: number; basePosition: number } | null = null;
  if (validReferrerId) {
    referrerSignup = await db.waitlistSignup.update({
      where: { id: validReferrerId },
      data: { referralCount: { increment: 1 } },
      select: { id: true, email: true, name: true, referralCount: true, basePosition: true },
    });
  }

  const currentPosition = calcPosition(
    signup.basePosition,
    signup.referralCount,
    waitlist.referralWeight
  );
  const referralLink = `${APP_URL}/w/${slug}?ref=${signup.id}`;

  // Fire emails without blocking response
  void sendWaitlistConfirmation({
    toEmail: email,
    name,
    currentPosition,
    referralLink,
  }).catch((err: unknown) =>
    console.error("[waitlist] confirmation email failed:", err)
  );

  if (referrerSignup) {
    const referrerPosition = calcPosition(
      referrerSignup.basePosition,
      referrerSignup.referralCount,
      waitlist.referralWeight
    );
    const referrerLink = `${APP_URL}/w/${slug}?ref=${referrerSignup.id}`;
    void sendWaitlistPositionUpdate({
      toEmail: referrerSignup.email,
      newPosition: referrerPosition,
      referralCount: referrerSignup.referralCount,
      referralLink: referrerLink,
    }).catch((err: unknown) =>
      console.error("[waitlist] position update email failed:", err)
    );
  }

  return Response.json({
    signupId: signup.id,
    email: signup.email,
    currentPosition,
    referralLink,
  });
}
