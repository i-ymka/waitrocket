"use client";

import { useState } from "react";

export type WaitlistData = {
  name: string;
  headline: string;
  rewardCopy: string;
  referralWeight: number;
  brandColor: string;
  logoUrl: string | null;
  isPoweredByHidden: boolean;
  totalSignups: number;
};

type SignupResult = {
  signupId: string;
  email: string;
  currentPosition: number;
  referralLink: string;
};

type Props = {
  waitlist: WaitlistData;
  slug: string;
  initialRef?: string;
};

export function WaitlistSignupFlow({ waitlist, slug, initialRef }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<SignupResult | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`/api/waitlist/${slug}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim() || undefined,
          ref: initialRef || undefined,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as SignupResult;
        setResult(data);
        setStatus("success");
      } else {
        const data = await res.json().catch(() => ({})) as { error?: string };
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  async function handleCopy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const brandColor = waitlist.brandColor;

  const LogoOrInitial = () =>
    waitlist.logoUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={waitlist.logoUrl}
        alt={waitlist.name}
        className="w-14 h-14 rounded-2xl mx-auto mb-6 object-cover shadow-sm"
      />
    ) : (
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-black text-2xl shadow-sm select-none"
        style={{ backgroundColor: brandColor }}
      >
        {waitlist.name[0]?.toUpperCase() ?? "W"}
      </div>
    );

  if (status === "success" && result) {
    const tweetText = encodeURIComponent(
      `I just joined the ${waitlist.name} waitlist! ${waitlist.rewardCopy} ${result.referralLink}`
    );
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <LogoOrInitial />

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-4">
              <svg
                className="w-8 h-8 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-5xl font-black text-slate-900 mb-1 tabular-nums">
              #{result.currentPosition}
            </p>
            <p className="text-lg font-semibold text-slate-600">
              You&apos;re on the waitlist!
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 mb-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">
              {waitlist.rewardCopy}
            </p>
            <div className="flex gap-2">
              <input
                readOnly
                value={result.referralLink}
                aria-label="Your referral link"
                className="flex-1 min-w-0 px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-600 focus:outline-none"
              />
              <button
                onClick={() => handleCopy(result.referralLink)}
                className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-95"
                style={{ backgroundColor: brandColor }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href={tweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </a>
            <button
              onClick={() => handleCopy(result.referralLink)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <LogoOrInitial />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-3">{waitlist.name}</h1>
          <p className="text-slate-500 text-lg leading-relaxed">{waitlist.headline}</p>
          {waitlist.totalSignups > 0 && (
            <p className="mt-3 text-sm font-medium text-slate-400">
              {waitlist.totalSignups.toLocaleString()} people already signed up
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            disabled={status === "loading"}
            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-60 text-base"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            disabled={status === "loading"}
            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-60 text-base"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3.5 rounded-xl text-white font-bold text-base transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-60 mt-1"
            style={{ backgroundColor: brandColor }}
          >
            {status === "loading" ? "Joining…" : "Join Waitlist"}
          </button>
          {status === "error" && (
            <p className="text-sm font-medium text-red-500 text-center">{errorMsg}</p>
          )}
        </form>

        <p className="mt-5 text-center text-xs text-slate-400">{waitlist.rewardCopy}</p>
      </div>
    </main>
  );
}
