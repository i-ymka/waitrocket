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
      email: true,
      name: true,
      basePosition: true,
      referralCount: true,
      createdAt: true,
    },
  });

  const rows = signups
    .map((s) => {
      const currentPosition = Math.max(
        1,
        s.basePosition - s.referralCount * waitlist.referralWeight
      );
      const csvName = s.name ? `"${s.name.replace(/"/g, '""')}"` : "";
      return `${s.email},${csvName},${currentPosition},${s.referralCount},${s.createdAt.toISOString()}`;
    })
    .sort((a, b) => {
      const posA = parseInt(a.split(",")[2] ?? "0", 10);
      const posB = parseInt(b.split(",")[2] ?? "0", 10);
      return posA - posB;
    });

  const csv = ["email,name,currentPosition,referralCount,signupDate", ...rows].join(
    "\n"
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=waitlist-${slug}.csv`,
    },
  });
}
