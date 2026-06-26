import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Internal endpoint called by Creatdrop to grant Waitrocket Pro on signup.
// Protected by shared INTERNAL_API_SECRET env var.
export async function POST(request: Request) {
  const secret = request.headers.get("x-internal-secret");
  if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const userId = typeof raw.userId === "string" ? raw.userId : null;
  const months = typeof raw.months === "number" ? raw.months : 1;

  if (!userId) {
    return Response.json({ error: "missing_userId" }, { status: 400 });
  }

  try {
    await db.user.updateMany({
      where: { id: userId },
      data: { plan: "PRO" },
    });
    return Response.json({ success: true, userId, months });
  } catch {
    return Response.json({ error: "server_error" }, { status: 500 });
  }
}
