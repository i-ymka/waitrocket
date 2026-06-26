import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CopyLinkButton } from "./CopyLinkButton";
import { UpgradeButton } from "./UpgradeButton";
import { deleteWaitlist } from "../actions";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function WaitlistManagePage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) return null;

  const { slug } = await params;

  const waitlist = await db.waitlist.findUnique({
    where: { slug },
    include: {
      signups: {
        orderBy: { basePosition: "asc" },
        select: {
          id: true,
          email: true,
          name: true,
          basePosition: true,
          referralCount: true,
          createdAt: true,
        },
      },
    },
  });

  if (!waitlist) notFound();
  if (waitlist.ownerId !== userId) notFound();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaySignups = waitlist.signups.filter(
    (s) => new Date(s.createdAt) >= today
  ).length;

  const totalReferrals = waitlist.signups.reduce((sum, s) => sum + s.referralCount, 0);

  const enriched = waitlist.signups.map((s) => ({
    ...s,
    currentPosition: Math.max(1, s.basePosition - s.referralCount * waitlist.referralWeight),
  }));
  enriched.sort((a, b) => a.currentPosition - b.currentPosition);

  const topReferrers = [...enriched]
    .sort((a, b) => b.referralCount - a.referralCount)
    .slice(0, 5)
    .filter((s) => s.referralCount > 0);

  const publicUrl = `waitrocket.com/w/${slug}`;
  const publicHref = `https://waitrocket.com/w/${slug}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/waitlists"
            className="text-sm font-bold text-zinc-400 hover:text-violet-600 transition-colors"
          >
            ← All waitlists
          </Link>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight mt-2">{waitlist.name}</h1>
          <p className="text-zinc-500 mt-1 font-medium">{waitlist.headline}</p>
        </div>
        <div className="flex items-center gap-2">
          {!waitlist.isPoweredByHidden && <UpgradeButton />}
          <form
            action={async () => {
              "use server";
              await deleteWaitlist(slug);
            }}
          >
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all border-2 border-transparent hover:border-red-100"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total signups", value: waitlist.signups.length },
          { label: "Today's signups", value: todaySignups },
          { label: "Total referrals", value: totalReferrals },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white border-2 border-zinc-100 rounded-2xl p-6 shadow-sm text-center"
          >
            <p className="text-3xl font-black text-zinc-900">{value}</p>
            <p className="text-sm text-zinc-500 font-bold mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Public page link */}
      <div className="bg-white border-2 border-zinc-100 rounded-2xl p-6 shadow-sm">
        <p className="text-sm font-black text-zinc-500 uppercase tracking-wider mb-3">Public page</p>
        <div className="flex items-center gap-3 flex-wrap">
          <code className="flex-1 min-w-0 px-4 py-2 rounded-xl bg-zinc-50 border-2 border-zinc-200 text-zinc-700 font-mono text-sm truncate">
            {publicUrl}
          </code>
          <CopyLinkButton url={publicHref} />
          <a
            href={publicHref}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-sm font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 transition-all border-2 border-violet-100 shrink-0"
          >
            View live page →
          </a>
        </div>
      </div>

      {/* Signups table */}
      <div className="bg-white border-2 border-zinc-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h2 className="text-lg font-black text-zinc-900">
            Signups{" "}
            <span className="text-zinc-400 font-medium text-base">({enriched.length})</span>
          </h2>
          <a
            href={`/api/waitlist/${slug}/export`}
            download
            className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-600 bg-zinc-50 hover:bg-zinc-100 transition-all border-2 border-zinc-200"
          >
            Export CSV
          </a>
        </div>

        {enriched.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 font-bold">
            No signups yet. Share your public page to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-black text-zinc-400 uppercase tracking-wider border-b border-zinc-100">
                  <th className="px-6 py-3">Position</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Referrals</th>
                  <th className="px-6 py-3">Signup date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {enriched.map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 font-black text-violet-700">#{s.currentPosition}</td>
                    <td className="px-6 py-4 text-sm text-zinc-700 font-medium">{s.email}</td>
                    <td className="px-6 py-4 text-sm text-zinc-500">{s.name ?? "—"}</td>
                    <td className="px-6 py-4">
                      {s.referralCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 text-xs font-black">
                          {s.referralCount}
                        </span>
                      ) : (
                        <span className="text-zinc-400 text-sm">0</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{formatDate(s.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top referrers */}
      {topReferrers.length > 0 && (
        <div className="bg-white border-2 border-zinc-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100">
            <h2 className="text-lg font-black text-zinc-900">Top referrers</h2>
          </div>
          <div className="divide-y divide-zinc-50">
            {topReferrers.map((s, i) => (
              <div key={s.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <span className="w-7 h-7 rounded-full bg-violet-50 text-violet-700 font-black text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-black text-zinc-900">{s.email}</p>
                    {s.name && <p className="text-xs text-zinc-500">{s.name}</p>}
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-sm font-black">
                  {s.referralCount} referral{s.referralCount !== 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
