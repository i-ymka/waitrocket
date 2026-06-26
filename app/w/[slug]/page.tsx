import type { Metadata } from "next";
import { WaitlistSignupFlow } from "./WaitlistSignupFlow";
import type { WaitlistData } from "./WaitlistSignupFlow";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
};

async function getWaitlist(slug: string): Promise<WaitlistData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/waitlist/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json() as Promise<WaitlistData>;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const waitlist = await getWaitlist(slug);
  if (!waitlist) return { title: "Waitlist not found — Waitrocket" };
  return {
    title: `Join the ${waitlist.name} waitlist`,
    description: waitlist.headline,
    openGraph: {
      title: `Join the ${waitlist.name} waitlist`,
      description: waitlist.headline,
      url: `https://waitrocket.com/w/${slug}`,
    },
  };
}

export default async function WaitlistPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { ref } = await searchParams;
  const waitlist = await getWaitlist(slug);

  if (!waitlist) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Waitlist not found</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            This waitlist doesn&apos;t exist or may have been removed.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <WaitlistSignupFlow waitlist={waitlist} slug={slug} initialRef={ref} />
      {!waitlist.isPoweredByHidden && (
        <div className="pb-6 text-center">
          <a
            href="https://waitrocket.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-slate-500 transition-colors"
          >
            Powered by Waitrocket
          </a>
        </div>
      )}
    </>
  );
}
