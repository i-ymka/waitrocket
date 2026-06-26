import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import Link from "next/link";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function WaitlistsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const waitlists = await db.waitlist.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      name: true,
      headline: true,
      brandColor: true,
      createdAt: true,
      _count: { select: { signups: true } },
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Waitlists</h1>
          <p className="text-zinc-500 mt-2 text-lg font-medium">
            Build viral launch waitlists with built-in referral mechanics.
          </p>
        </div>
        <Link
          href="/dashboard/waitlists/new"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 text-white font-bold hover:bg-violet-700 transition-all shadow-sm shrink-0"
        >
          + Create waitlist
        </Link>
      </div>

      {waitlists.length === 0 ? (
        <div className="text-center py-24 rounded-[2.5rem] bg-zinc-50 border-2 border-dashed border-zinc-200">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-2xl font-black text-zinc-900 mb-2">No waitlists yet</h2>
          <p className="text-zinc-500 font-medium mb-8 max-w-sm mx-auto">
            Create your first waitlist to start collecting signups with viral referral mechanics.
          </p>
          <Link
            href="/dashboard/waitlists/new"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-violet-600 text-white font-bold hover:bg-violet-700 transition-all shadow-sm"
          >
            Create your first waitlist →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {waitlists.map((w) => (
            <Link
              key={w.id}
              href={`/dashboard/waitlists/${w.slug}`}
              className="flex items-center justify-between p-6 rounded-2xl bg-white border-2 border-zinc-100 hover:border-violet-200 transition-all shadow-sm group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: w.brandColor }}
                />
                <div className="min-w-0">
                  <p className="font-black text-zinc-900 text-lg truncate group-hover:text-violet-700 transition-colors">
                    {w.name}
                  </p>
                  <p className="text-zinc-500 text-sm truncate mt-0.5">{w.headline}</p>
                  <p className="text-zinc-400 text-xs font-bold mt-1">
                    Created {formatDate(w.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 ml-4 shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-2xl font-black text-zinc-900">{w._count.signups}</p>
                  <p className="text-xs text-zinc-500 font-bold">signups</p>
                </div>
                <span className="text-zinc-400 group-hover:text-violet-600 transition-colors font-bold">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
