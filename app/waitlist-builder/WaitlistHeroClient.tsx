"use client";

import { useEffect, useState } from "react";

const SEED_COUNT = 1247;
const SEED_RECENT = 38;

const RECENT_SIGNUPS = [
  { name: "Alex M.", location: "San Francisco", time: "2m ago" },
  { name: "Priya K.", location: "London", time: "4m ago" },
  { name: "Jonas R.", location: "Berlin", time: "6m ago" },
  { name: "Sara L.", location: "Toronto", time: "9m ago" },
  { name: "David C.", location: "Sydney", time: "11m ago" },
];

export function LiveFeed() {
  const [count, setCount] = useState(SEED_COUNT);
  const [recentCount, setRecentCount] = useState(SEED_RECENT);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + 1);
      setRecentCount((c) => c + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((i) => (i + 1) % RECENT_SIGNUPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Stat badges */}
      <div className="flex flex-wrap items-center gap-3 mb-12">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-black shadow-lg shadow-orange-200">
          <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
          {recentCount} people joined in the last hour
        </div>
        <div className="px-4 py-2 rounded-full bg-zinc-100 text-zinc-600 text-sm font-bold">
          🚀 {count.toLocaleString()} waitlists launched this month
        </div>
      </div>

      {/* Live signup feed panel — fixed height, no layout shift */}
      <div className="bg-zinc-50 rounded-3xl p-5 border-2 border-zinc-100 max-h-[220px] overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">
            Live signups
          </p>
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </div>
        </div>
        {/* Show exactly 3 entries always — no growing list */}
        <div className="space-y-2">
          {[0, 1, 2].map((offset) => {
            const s = RECENT_SIGNUPS[(currentIdx + offset) % RECENT_SIGNUPS.length];
            return (
              <div
                key={offset}
                className="flex items-center gap-3 p-2.5 bg-white rounded-2xl border border-zinc-100 shadow-sm"
                style={{ opacity: 1 - offset * 0.2 }}
              >
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-black text-sm flex-shrink-0">
                  {s.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-zinc-900 truncate">{s.name}</p>
                  <p className="text-xs text-zinc-400 truncate">{s.location}</p>
                </div>
                <span className="text-xs text-zinc-400 flex-shrink-0">{s.time}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between">
          <p className="text-xs text-zinc-400 font-medium">{count.toLocaleString()} waitlists launched</p>
          <p className="text-xs font-black text-orange-500">this month</p>
        </div>
      </div>
    </>
  );
}

export function ReferralVisual() {
  return (
    <div className="flex flex-col gap-3">
      {/* Queue position badge */}
      <div className="bg-white rounded-2xl border-2 border-orange-200 p-5 shadow-lg shadow-orange-100">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">Your position</p>
          <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">#247 → #12</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-black text-lg shadow-md">
            12
          </div>
          <div>
            <p className="text-sm font-black text-zinc-900">You jumped 235 spots 🚀</p>
            <p className="text-xs text-zinc-500 font-medium">3 friends signed up via your link</p>
          </div>
        </div>
        <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-400" style={{ width: "95%" }} />
        </div>
        <p className="text-xs text-zinc-400 font-medium mt-1.5">Share 2 more to reach #1</p>
      </div>

      {/* Referral link */}
      <div className="bg-zinc-900 rounded-2xl p-4">
        <p className="text-xs text-zinc-500 font-bold mb-2 uppercase tracking-widest">Your referral link</p>
        <div className="flex items-center gap-2 bg-zinc-800 rounded-xl px-3 py-2.5">
          <span className="text-green-400 font-mono text-xs flex-1 truncate">waitrocket.com/w/coolapp?ref=alex23</span>
          <button className="text-xs font-black text-orange-400 hover:text-orange-300 transition-colors flex-shrink-0">Copy</button>
        </div>
      </div>
    </div>
  );
}
