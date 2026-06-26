"use client";

import { useRef, useState, useTransition } from "react";
import { createWaitlist } from "../actions";

const PRESET_COLORS = [
  "#7c3aed", // violet-600
  "#2563eb", // blue-600
  "#16a34a", // green-600
  "#dc2626", // red-600
  "#ea580c", // orange-600
  "#0891b2", // cyan-600
  "#db2777", // pink-600
  "#65a30d", // lime-600
];

export default function NewWaitlistPage() {
  const [brandColor, setBrandColor] = useState("#7c3aed");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createWaitlist(data);
      } catch (err) {
        if (err instanceof Error && !err.message.includes("NEXT_REDIRECT")) {
          setError(err.message);
        }
      }
    });
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Create waitlist</h1>
        <p className="text-zinc-500 mt-2 text-lg font-medium">
          Set up a viral launch waitlist with referral mechanics.
        </p>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white border-2 border-zinc-100 rounded-[2.5rem] p-8 shadow-sm space-y-6"
      >
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-bold text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-black text-zinc-900 mb-2" htmlFor="name">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="My Product Launch"
            className="w-full px-4 py-3 rounded-2xl border-2 border-zinc-200 text-zinc-900 font-medium placeholder:text-zinc-400 focus:outline-none focus:border-violet-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-black text-zinc-900 mb-2" htmlFor="headline">
            Headline <span className="text-red-500">*</span>
          </label>
          <input
            id="headline"
            name="headline"
            type="text"
            required
            placeholder="Be the first to know when we launch"
            className="w-full px-4 py-3 rounded-2xl border-2 border-zinc-200 text-zinc-900 font-medium placeholder:text-zinc-400 focus:outline-none focus:border-violet-400 transition-colors"
          />
          <p className="text-xs text-zinc-400 font-medium mt-1.5">Shown on your public waitlist page.</p>
        </div>

        <div>
          <label className="block text-sm font-black text-zinc-900 mb-2" htmlFor="rewardCopy">
            Reward copy <span className="text-red-500">*</span>
          </label>
          <input
            id="rewardCopy"
            name="rewardCopy"
            type="text"
            required
            placeholder="Refer 5 friends to jump 100 spots in line"
            className="w-full px-4 py-3 rounded-2xl border-2 border-zinc-200 text-zinc-900 font-medium placeholder:text-zinc-400 focus:outline-none focus:border-violet-400 transition-colors"
          />
          <p className="text-xs text-zinc-400 font-medium mt-1.5">Shown to users to encourage referrals.</p>
        </div>

        <div>
          <label className="block text-sm font-black text-zinc-900 mb-2" htmlFor="referralWeight">
            Spots jumped per referral
          </label>
          <input
            id="referralWeight"
            name="referralWeight"
            type="number"
            min="1"
            max="1000"
            defaultValue="10"
            className="w-32 px-4 py-3 rounded-2xl border-2 border-zinc-200 text-zinc-900 font-medium focus:outline-none focus:border-violet-400 transition-colors"
          />
          <p className="text-xs text-zinc-400 font-medium mt-1.5">How many positions each referral moves someone up.</p>
        </div>

        <div>
          <label className="block text-sm font-black text-zinc-900 mb-2">
            Brand color
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setBrandColor(color)}
                className="w-9 h-9 rounded-full border-4 transition-all"
                style={{
                  backgroundColor: color,
                  borderColor: brandColor === color ? color : "transparent",
                  outline: brandColor === color ? `3px solid ${color}` : "3px solid transparent",
                  outlineOffset: "2px",
                }}
                aria-label={color}
              />
            ))}
            <input
              type="color"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="w-9 h-9 rounded-full cursor-pointer border-2 border-zinc-200"
              title="Custom color"
            />
          </div>
          <input type="hidden" name="brandColor" value={brandColor} />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 rounded-2xl bg-violet-600 text-white font-black text-lg hover:bg-violet-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {isPending ? "Creating…" : "Create waitlist →"}
          </button>
        </div>
      </form>
    </div>
  );
}
