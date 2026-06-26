import { Webhook } from "svix";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Webhook secret not configured", { status: 400 });
  }

  const body = await request.text();
  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const wh = new Webhook(secret);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let evt: any;
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  const { type, data } = evt;

  if (type === "user.created" || type === "user.updated") {
    const email: string =
      data.email_addresses?.[0]?.email_address ?? "";
    const firstName: string = data.first_name ?? "";
    const lastName: string = data.last_name ?? "";
    const name = [firstName, lastName].filter(Boolean).join(" ") || null;

    await db.user.upsert({
      where: { id: data.id },
      create: { id: data.id, email, name },
      update: { email, name },
    });
  }

  if (type === "user.deleted") {
    await db.user.deleteMany({ where: { id: data.id } });
  }

  return new Response(null, { status: 200 });
}
