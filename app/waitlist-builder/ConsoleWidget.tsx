"use client";

import { useEffect, useRef, useState } from "react";

const NAMES = [
  "maria.k","devontae","jules.r","samir.h","priya.w",
  "theo.b","nadia","finn.dev","aria.k","kojo","lena.s","rishi",
];

type FeedRow = { name: string; action: string; ts: string; key: number };

const INITIAL_FEED: FeedRow[] = [
  { name: "maria.k", action: `referred <span class="g">+3</span>`, ts: "now", key: 0 },
  { name: "theo.b", action: `joined · #1,204`, ts: "2s", key: 1 },
  { name: "jules.r", action: `climbed <span class="vv">24 ↑</span>`, ts: "4s", key: 2 },
  { name: "aria.k", action: `shared link <span class="vv">↗</span>`, ts: "6s", key: 3 },
];

function makeRow(key: number): FeedRow {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const r = Math.random();
  let action: string;
  if (r < 0.4) {
    action = `referred <span class="g">+${1 + Math.floor(Math.random() * 4)}</span>`;
  } else if (r < 0.68) {
    action = `joined · #${300 + Math.floor(Math.random() * 1400)}`;
  } else if (r < 0.86) {
    action = `climbed <span class="vv">${8 + Math.floor(Math.random() * 40)} ↑</span>`;
  } else {
    action = `shared link <span class="vv">↗</span>`;
  }
  return { name, action, ts: "now", key };
}

export function ConsoleWidget() {
  const [count, setCount] = useState(12847);
  const [delta, setDelta] = useState(234);
  const [refs, setRefs] = useState(4128);
  const [pos, setPos] = useState(847);
  const [barWidth, setBarWidth] = useState(64);
  const [flash, setFlash] = useState(false);
  const [feed, setFeed] = useState<FeedRow[]>(INITIAL_FEED);
  const keyRef = useRef(100);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    function tick() {
      setCount((c) => {
        const next = c + 1 + Math.floor(Math.random() * 3);
        return next;
      });
      setFlash(true);
      setTimeout(() => setFlash(false), 130);
      if (Math.random() < 0.5) setRefs((r) => r + 1);
      timeout = setTimeout(tick, 700 + Math.random() * 900);
    }
    timeout = setTimeout(tick, 900);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setDelta((d) => d + 1 + Math.floor(Math.random() * 2));
    }, 2400);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    function posTick() {
      setPos((p) => {
        if (p <= 12) return 12;
        return Math.max(12, p - 3 - Math.floor(Math.random() * 22));
      });
      setBarWidth((w) => Math.min(96, w + 3 + Math.random() * 6));
      t = setTimeout(posTick, 1700 + Math.random() * 1300);
    }
    t = setTimeout(posTick, 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    function push() {
      const newRow = makeRow(++keyRef.current);
      setFeed((prev) => {
        const updated = [newRow, ...prev.slice(0, 3)];
        return updated.map((r, i) => ({ ...r, ts: i === 0 ? "now" : `${i * 2 + Math.floor(Math.random() * 2)}s` }));
      });
      t = setTimeout(push, 1500 + Math.random() * 1400);
    }
    t = setTimeout(push, 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="v2-console-stage">
      <div className="v2-console-glow" />
      <div className="v2-console">
        <div className="v2-console-bar">
          <span className="d" />
          <span className="d" />
          <span className="d" />
          <span className="path">waitrocket / tidepool</span>
          <span className="live"><span className="b" />LIVE</span>
        </div>
        <div className="v2-console-body">
          <div className="v2-cbig">
            <div>
              <div className="k">Total signups</div>
              <div className={`n tnum${flash ? " flash" : ""}`}>{count.toLocaleString()}</div>
            </div>
            <div className="delta">
              ↑ +{delta}<span className="s">last 24h</span>
            </div>
          </div>
          <div className="v2-creward">
            <div className="lbl">
              <span>Your position</span>
              <span className="pos">#{pos} — 2 referrals to beta</span>
            </div>
            <div className="v2-cbar">
              <div className="fill" style={{ width: `${barWidth}%` }} />
            </div>
          </div>
          <div className="v2-cgauges">
            <div className="v2-cg"><div className="k">Viral coef.</div><div className="v violet">3.24×</div></div>
            <div className="v2-cg"><div className="k">Active refs</div><div className="v tnum">{refs.toLocaleString()}</div></div>
            <div className="v2-cg"><div className="k">Share→join</div><div className="v">38%</div></div>
          </div>
          <div className="v2-cfeed">
            <div className="h">
              <span>Live activity</span>
              <span>+18/min</span>
            </div>
            <div className="list">
              {feed.map((row) => (
                <div key={row.key} className="v2-frow">
                  <span className="w">{row.name}</span>
                  <span className="a" dangerouslySetInnerHTML={{ __html: row.action }} />
                  <span className="t">{row.ts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
