"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 50);
}

async function uniqueSlug(name: string): Promise<string> {
  const base = toSlug(name) || "waitlist";
  for (let i = 0; i < 5; i++) {
    const slug = `${base}-${Math.random().toString(36).slice(2, 8)}`;
    const exists = await db.waitlist.findUnique({ where: { slug } });
    if (!exists) return slug;
  }
  return `${base}-${Date.now()}`;
}

export async function createWaitlist(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const name = ((formData.get("name") as string) ?? "").trim();
  const headline = ((formData.get("headline") as string) ?? "").trim();
  const rewardCopy = ((formData.get("rewardCopy") as string) ?? "").trim();
  const rawWeight = parseInt((formData.get("referralWeight") as string) ?? "10", 10);
  const referralWeight = Number.isFinite(rawWeight) && rawWeight > 0 ? rawWeight : 10;
  const rawColor = ((formData.get("brandColor") as string) ?? "").trim();
  const brandColor = /^#[0-9a-fA-F]{6}$/.test(rawColor) ? rawColor : "#7c3aed";

  if (!name || !headline || !rewardCopy) {
    throw new Error("Name, headline, and reward copy are required");
  }

  const slug = await uniqueSlug(name);

  await db.waitlist.create({
    data: { slug, ownerId: userId, name, headline, rewardCopy, referralWeight, brandColor },
  });

  revalidatePath("/dashboard/waitlists");
  redirect(`/dashboard/waitlists/${slug}`);
}

export async function deleteWaitlist(slug: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.waitlist.deleteMany({ where: { slug, ownerId: userId } });

  revalidatePath("/dashboard/waitlists");
  redirect("/dashboard/waitlists");
}
