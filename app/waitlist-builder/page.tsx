import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ConsoleWidget } from "./ConsoleWidget";
import "./waitlist-v2.css";

export const metadata: Metadata = {
  title: "waitrocket — viral waitlists, built for launch day",
  description:
    "Referral-powered waitlists with share-to-move-up mechanics. Turn every signup into your next three. One line of embed. Five minutes.",
};

const LOGOS = [
  { src: "/logo-nimbus.png", alt: "Nimbus" },
  { src: "/logo-forge.png", alt: "Forge.dev" },
  { src: "/logo-tidepool.png", alt: "Tidepool" },
  { src: "/logo-quill.png", alt: "Quill" },
  { src: "/logo-sundial.png", alt: "Sundial" },
  { src: "/logo-loopr.png", alt: "Loopr" },
  { src: "/logo-mailgrid.png", alt: "Mailgrid" },
];

export default function WaitlistBuilderPage() {
  return (
    <div className="v2-page">
      {/* NAV */}
      <nav className="v2-nav">
        <div className="v2-nav-inner">
          <Link href="/waitlist-builder" className="v2-brand" aria-label="waitrocket home">
            <Image src="/logo-full.png" alt="waitrocket" width={120} height={26} style={{ height: 26, width: "auto" }} priority />
          </Link>
          <div className="v2-nav-links">
            <a href="#how">How it works</a>
            <a href="#loop">The loop</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="v2-nav-right">
            <Link href="/sign-in" className="v2-btn v2-btn-sm v2-btn-ghost">Sign in</Link>
            <Link href="/sign-up" className="v2-btn v2-btn-sm v2-btn-dark">Start free</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="v2-hero">
        <div className="v2-hero-aura" />
        <div className="v2-wrap v2-hero-inner">
          <div>
            <div className="v2-eyebrow">
              <span className="dot" />
              Distribution is the new bottleneck
            </div>
            <h1 className="v2-hero-head">
              1,000 signups<br />
              become <span className="v">3,200.</span>
            </h1>
            <p className="v2-hero-sub">
              In 2026, building your product takes a weekend. Building a crowd that cares takes waitrocket —{" "}
              <strong>share-to-move-up</strong> mechanics that turn every signup into your next three. One line of embed. Five minutes.
            </p>
            <div className="v2-hero-actions">
              <Link href="/sign-up" className="v2-btn v2-btn-violet">Start for Free →</Link>
              <a href="#dashboard" className="v2-btn v2-btn-ghost">See it live</a>
            </div>
            <div className="v2-hero-meta">
              <div className="cell">
                <div className="v">5<span className="u">min</span></div>
                <div className="k">to install</div>
              </div>
              <div className="cell">
                <div className="v">3.2<span className="u">×</span></div>
                <div className="k">avg multiplier</div>
              </div>
              <div className="cell">
                <div className="v">500</div>
                <div className="k">free signups</div>
              </div>
            </div>
          </div>
          <ConsoleWidget />
        </div>
      </header>

      {/* PROOF STRIP */}
      <section className="v2-proof">
        <div className="v2-wrap v2-proof-inner">
          <span className="t">Trusted by 1,200+ indie hackers shipping today</span>
          <div className="logos">
            {LOGOS.map((l) => (
              <a key={l.alt} href="#">
                <img src={l.src} alt={l.alt} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="v2-pull">
        <div className="v2-wrap inner">
          <div className="figure">
            <div className="big">2,400</div>
            <div className="cap">signups in 48 hours</div>
          </div>
          <div className="q">
            <blockquote>
              &ldquo;We hit 2,400 signups in 48 hours using waitrocket&rsquo;s share mechanic. Our cost per signup went to basically zero — the list just recruited itself.&rdquo;
            </blockquote>
            <div className="src">
              <b>Elena Marsh</b> · Founder, Tidepool · launched March 2026
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="v2-sec" id="how">
        <div className="v2-wrap">
          <div className="v2-sec-eyebrow"><span className="ln" />How it works</div>
          <h2 className="v2-sec-head">Three steps from blank page to launch crowd.</h2>
          <div className="v2-steps">
            <div className="v2-step">
              <div className="num">STEP 01</div>
              <h3>Paste one line.</h3>
              <p>Drop the embed into Webflow, Framer, Next.js or raw HTML. That&rsquo;s the whole install.</p>
              <div className="viz">
                <div className="v2-codeblk">
                  <span className="cp">COPY</span>
                  <span className="cm">{"// paste in <head>"}</span><br />
                  <span className="tag">&lt;script</span><br />
                  &nbsp;&nbsp;<span className="at">src</span>=<span className="st">&quot;waitrocket.com/v1.js&quot;</span><br />
                  &nbsp;&nbsp;<span className="at">data-key</span>=<span className="st">&quot;wr_a8f3…&quot;</span><span className="tag">&gt;&lt;/script&gt;</span>
                </div>
              </div>
            </div>
            <div className="v2-step">
              <div className="num">STEP 02</div>
              <h3>Visitors join the queue.</h3>
              <p>They sign up, get a live position, and feel the line behind them growing in real time.</p>
              <div className="viz">
                <div className="v2-posbox">
                  <div className="n"><span className="h">#</span>847</div>
                  <div className="k">your position in line</div>
                  <div className="bar"><i /></div>
                </div>
              </div>
            </div>
            <div className="v2-step">
              <div className="num">STEP 03</div>
              <h3>They share to move up.</h3>
              <p>Each referral jumps them forward — and pulls fresh signups into the loop behind them.</p>
              <div className="viz">
                <div className="v2-dropbox">
                  <div className="r">
                    <span className="old">#847</span>
                    <span className="ar">3 refs →</span>
                    <span className="new"><span className="h">#</span>12</span>
                  </div>
                  <div className="dft">
                    <span>reward unlocked</span>
                    <span className="rw">★ early access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VIRAL LOOP — dark */}
      <section className="v2-sec v2-dark-sec" id="loop">
        <div className="v2-dark-aura" style={{ top: "-100px", left: "-60px" }} />
        <div className="v2-wrap">
          <div className="v2-sec-eyebrow"><span className="ln" />The viral loop</div>
          <h2 className="v2-sec-head">One signup. <span className="v">Three more.</span> Then nine.</h2>
          <p className="v2-sec-sub">
            Every person you bring in becomes a new source of signups. That compounding is the multiplier nobody on a plain email form ever sees.
          </p>
          <div className="v2-loop-inner">
            <div className="v2-diagram">
              <div className="v2-orbit" />
              <div className="v2-vc">
                <div>
                  <div className="m">3.2×</div>
                  <div className="ml">average growth<br />multiplier</div>
                </div>
              </div>
              <div className="v2-vn v2-vn-1"><div className="i">01</div><div className="x"><span className="xk">start</span><span className="xt">Visitor signs up</span></div></div>
              <div className="v2-vn v2-vn-2"><div className="i">02</div><div className="x"><span className="xk">queue</span><span className="xt">Gets a position</span></div></div>
              <div className="v2-vn v2-vn-3"><div className="i">03</div><div className="x"><span className="xk">share</span><span className="xt">Sends unique link</span></div></div>
              <div className="v2-vn v2-vn-4"><div className="i">04</div><div className="x"><span className="xk">convert</span><span className="xt">Friend signs up</span></div></div>
              <div className="v2-vn v2-vn-5"><div className="i">05</div><div className="x"><span className="xk">move up</span><span className="xt">Original climbs</span></div></div>
              <div className="v2-vn v2-vn-6"><div className="i">06</div><div className="x"><span className="xk">loop</span><span className="xt">Friend shares too</span></div></div>
            </div>
            <div className="v2-loop-pts">
              <div className="v2-lp">
                <div className="n">01</div>
                <div>
                  <h4>Position is a hook, not a number.</h4>
                  <p>Seeing &quot;#847 in line&quot; gives users a reason to care — and a clear path to do something about it.</p>
                </div>
              </div>
              <div className="v2-lp">
                <div className="n">02</div>
                <div>
                  <h4>Sharing is the only way up.</h4>
                  <p>No fake gamification. Real referrals, real movement, real rewards. The mechanic is honest, so it works.</p>
                </div>
              </div>
              <div className="v2-lp">
                <div className="n">03</div>
                <div>
                  <h4>Every new signup repeats the loop.</h4>
                  <p>The list compounds. By launch day you&rsquo;re not emailing 500 people — you&rsquo;re emailing 5,000.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD — dark */}
      <section className="v2-sec v2-dark-sec" id="dashboard">
        <div className="v2-dark-aura" style={{ bottom: "-160px", right: "-80px" }} />
        <div className="v2-wrap">
          <div className="v2-sec-eyebrow"><span className="ln" />Founder dashboard</div>
          <h2 className="v2-sec-head">Watch the loop happen <span className="v">in real time.</span></h2>
          <p className="v2-sec-sub">
            Signups, referral chains and your top referrers — one live view, no spreadsheets.
          </p>
          <div className="v2-dashwin">
            <div className="v2-dwbar">
              <span className="d" /><span className="d" /><span className="d" />
              <span className="u">waitrocket.com/dashboard</span>
            </div>
            <div className="v2-dwbody">
              <div className="v2-dwside">
                <div className="brand">
                  <Image src="/logo-icon.png" alt="" width={18} height={18} style={{ opacity: 0.9 }} />
                  waitrocket
                </div>
                <div className="grp">Overview</div>
                <div className="v2-dwnav on"><span className="i">▣</span>Dashboard</div>
                <div className="v2-dwnav"><span className="i">◉</span>Signups</div>
                <div className="v2-dwnav"><span className="i">↗</span>Referrals</div>
                <div className="grp">Project</div>
                <div className="v2-dwnav"><span className="i">⚙</span>Settings</div>
                <div className="v2-dwnav"><span className="i">$</span>Billing</div>
              </div>
              <div className="v2-dwmain">
                <div className="v2-dwkpis">
                  <div className="v2-dwkpi">
                    <div className="k">Total signups</div>
                    <div className="v">12,847</div>
                    <div className="d">↑ +234 today</div>
                  </div>
                  <div className="v2-dwkpi">
                    <div className="k">Viral coef.</div>
                    <div className="v violet">3.24×</div>
                    <div className="d">↑ +0.4 this week</div>
                  </div>
                  <div className="v2-dwkpi">
                    <div className="k">Active referrers</div>
                    <div className="v">4,128</div>
                    <div className="d">↑ +89 today</div>
                  </div>
                  <div className="v2-dwkpi">
                    <div className="k">Share→signup</div>
                    <div className="v">38%</div>
                    <div className="d">↑ +3pp this week</div>
                  </div>
                </div>
                <div style={{ background: "#14151D", border: "1px solid #262732", borderRadius: 10, padding: "16px 20px", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "#9C9CAC" }}>
                      Signups over time · last 14 days
                    </span>
                    <div style={{ display: "flex", gap: 12, fontSize: 11, fontFamily: "var(--font-geist-mono)", color: "#9C9CAC" }}>
                      <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "#8E73F0", marginRight: 5 }} />Direct</span>
                      <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "#4CC38A", marginRight: 5 }} />Referral</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
                    {[0.3,0.35,0.42,0.45,0.4,0.55,0.65,0.6,0.72,0.82,0.75,0.9,0.95,1].map((h, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, height: "100%", justifyContent: "flex-end" }}>
                        <div style={{ background: "#4CC38A", borderRadius: "2px 2px 0 0", height: `${h * 55}%`, opacity: 0.9 }} />
                        <div style={{ background: "#8E73F0", borderRadius: 0, height: `${h * 40}%` }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: "var(--font-geist-mono)", fontSize: 9, color: "#555663" }}>
                    <span>MAY 15</span>
                    <span>MAY 28</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
            <Link href="/sign-up" className="v2-btn v2-btn-violet">Get your dashboard →</Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="v2-sec">
        <div className="v2-wrap">
          <div className="v2-sec-eyebrow"><span className="ln" />From the launches</div>
          <h2 className="v2-sec-head">Founders who launched to a crowd.</h2>
          <div className="v2-quote-wrap">
            <div className="v2-quote-sm">
              <div className="qt">
                &ldquo;Our viral coefficient hit <span className="v">3.8×</span> in week two. We went from begging for signups to ignoring our inbox.&rdquo;
              </div>
              <div className="qf">
                <img src="/avatar-4.jpg" alt="Arjun Patel" />
                <div>
                  <div className="v2-qname">Arjun Patel</div>
                  <div className="v2-qrole">Founder, Forge.dev</div>
                </div>
              </div>
            </div>
            <div className="v2-quote-sm">
              <div className="qt">
                &ldquo;Shipped the embed on a Sunday. Woke up to <span className="v">1,100 signups</span>. The leaderboard did the marketing for me.&rdquo;
              </div>
              <div className="qf">
                <img src="/avatar-3.jpg" alt="Naomi Adeyemi" />
                <div>
                  <div className="v2-qname">Naomi Adeyemi</div>
                  <div className="v2-qrole">Solo founder, Quill</div>
                </div>
              </div>
            </div>
            <div className="v2-quote-sm">
              <div className="qt">
                &ldquo;Bootstrapped, zero ad budget — waitrocket got us to <span className="v">5,200 on the list</span> before launch day. That&rsquo;s the whole game.&rdquo;
              </div>
              <div className="qf">
                <img src="/avatar-elena.jpg" alt="Elena Marsh" />
                <div>
                  <div className="v2-qname">Elena Marsh</div>
                  <div className="v2-qrole">Founder, Tidepool</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="v2-sec" id="features">
        <div className="v2-wrap">
          <div className="v2-sec-eyebrow"><span className="ln" />What&rsquo;s in the box</div>
          <h2 className="v2-sec-head">Every mechanic you need, none of the chrome you don&rsquo;t.</h2>
          <div className="v2-feat">
            <div className="v2-ft">
              <div className="i">&lt;/&gt;</div>
              <h3>One-line embed</h3>
              <p>Drops into Webflow, Framer, Next.js, plain HTML — anywhere a script tag fits.</p>
            </div>
            <div className="v2-ft">
              <div className="i">#</div>
              <h3>Live position counter</h3>
              <p>Each signup sees their place update as people join and refer. No stale numbers, no fake suspense.</p>
            </div>
            <div className="v2-ft">
              <div className="i">↗</div>
              <h3>Unique referral links</h3>
              <p>Short, branded, trackable — generated per signup with bot-resistant hashing.</p>
            </div>
            <div className="v2-ft">
              <div className="i">★</div>
              <h3>Top-referrer ranking</h3>
              <p>Your dashboard ranks who&rsquo;s driving the most signups — so you can reward your best evangelists.</p>
            </div>
            <div className="v2-ft">
              <div className="i">∿</div>
              <h3>Founder dashboard</h3>
              <p>Signups, referral chains and your top referrers — all in one view, with CSV export.</p>
            </div>
            <div className="v2-ft">
              <div className="i">⛨</div>
              <h3>Disposable-email blocking</h3>
              <p>Throwaway and temp-mail domains are rejected at signup, so your numbers stay real.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / FRAUD */}
      <section className="v2-trust">
        <div className="v2-wrap v2-trust-grid">
          <div>
            <div className="shield">⛨</div>
            <h2>Big numbers only matter if they&rsquo;re <span className="v">real people.</span></h2>
            <p>Vanity metrics die on launch day. waitrocket filters the noise before it ever hits your list — so the crowd you built is a crowd that converts.</p>
          </div>
          <div className="v2-trust-list">
            <div className="row">
              <span className="ic">⊘</span>
              <span className="tx"><b>Disposable-email blocking</b><span>Throwaway and temp-mail domains rejected at signup.</span></span>
            </div>
            <div className="row">
              <span className="ic">⊞</span>
              <span className="tx"><b>Duplicate-signup guard</b><span>One row per email per waitlist — repeat submits never inflate your count.</span></span>
            </div>
            <div className="row">
              <span className="ic">⚑</span>
              <span className="tx"><b>Your data stays yours</b><span>Export anytime as CSV, no resale — ever.</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="v2-sec v2-price-sec" id="pricing">
        <div className="v2-wrap">
          <div className="v2-sec-eyebrow"><span className="ln" />Pricing</div>
          <h2 className="v2-sec-head">Simple pricing. <span className="v">No seat math.</span></h2>
          <p className="v2-sec-sub">Start free. Upgrade when you outgrow it. That&rsquo;s the whole menu.</p>
          <div className="v2-prices">
            <div className="v2-pc">
              <div className="tier">Free</div>
              <div className="amt">$0 <span className="per">forever</span></div>
              <div className="desc">Everything you need to validate the loop and ship your first 500 signups.</div>
              <ul>
                <li><span className="ck">✓</span>Up to 500 signups</li>
                <li><span className="ck">✓</span>One-line embed</li>
                <li><span className="ck">✓</span>Live position counter</li>
                <li><span className="ck">✓</span>Top-referrer ranking</li>
                <li><span className="ck">✓</span>Basic dashboard</li>
              </ul>
              <Link href="/sign-up" className="v2-btn v2-btn-ghost" style={{ width: "100%", justifyContent: "center" }}>Start free →</Link>
            </div>
            <div className="v2-pc featured">
              <span className="badge">Recommended</span>
              <div className="tier">Pro</div>
              <div className="amt">$9 <span className="per">/ month · flat</span></div>
              <div className="desc">For founders ready to push the loop hard. Unlimited signups, every mechanic unlocked.</div>
              <ul>
                <li><span className="ck">✓</span><strong style={{ color: "#fff" }}>Unlimited</strong>&nbsp;signups</li>
                <li><span className="ck">✓</span>Full founder dashboard</li>
                <li><span className="ck">✓</span>Disposable-email blocking</li>
                <li><span className="ck">✓</span>Custom rewards &amp; tiers</li>
                <li><span className="ck">✓</span>Remove waitrocket branding</li>
                <li><span className="ck">✓</span>Priority support</li>
              </ul>
              <Link href="/sign-up" className="v2-btn v2-btn-violet" style={{ width: "100%", justifyContent: "center" }}>Go Pro →</Link>
            </div>
          </div>
          <div className="v2-price-foot">
            <span className="c"><span className="ck">✓</span>Billed via Paddle</span>
            <span className="c"><span className="ck">✓</span>Cancel anytime</span>
            <span className="c"><span className="ck">✓</span>No hidden fees</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="v2-sec" id="faq">
        <div className="v2-wrap">
          <div className="v2-sec-eyebrow"><span className="ln" />Questions</div>
          <h2 className="v2-sec-head">Everything founders ask <span className="v">before they paste.</span></h2>
          <div className="v2-faq-grid">
            <div className="v2-faq">
              <h4><span className="q">Q.</span>Where can I embed it?</h4>
              <p>Anywhere a script tag runs — Webflow, Framer, Next.js, Astro, WordPress, plain HTML. No backend, no build step.</p>
            </div>
            <div className="v2-faq">
              <h4><span className="q">Q.</span>How do you keep signups clean?</h4>
              <p>Disposable and temp-mail domains are blocked at signup, and each email can only join a waitlist once — so throwaway and repeat signups don&rsquo;t inflate your numbers.</p>
            </div>
            <div className="v2-faq">
              <h4><span className="q">Q.</span>What happens at 500 signups on Free?</h4>
              <p>Nothing breaks. New signups keep queuing; you just upgrade to Pro to email past 500 and unlock the full dashboard.</p>
            </div>
            <div className="v2-faq">
              <h4><span className="q">Q.</span>Do I own the email list?</h4>
              <p>Completely. Export to CSV or pipe to your ESP anytime. We never resell or email your audience.</p>
            </div>
            <div className="v2-faq">
              <h4><span className="q">Q.</span>Can I customize the rewards?</h4>
              <p>On Pro, yes — set referral milestones, tiered perks and custom unlock copy. Free uses sensible defaults.</p>
            </div>
            <div className="v2-faq">
              <h4><span className="q">Q.</span>How does billing work?</h4>
              <p>Pro is a flat $9/month via Paddle. No per-seat math, no usage surprises. Cancel in one click, anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="v2-final">
        <div className="aura" />
        <div className="v2-wrap v2-final-in">
          <h2>Your next launch deserves a <span className="v">crowd.</span></h2>
          <p>Start for free — launch in five minutes.</p>
          <div className="act">
            <Link href="/sign-up" className="v2-btn v2-btn-violet" style={{ padding: "16px 28px", fontSize: 16 }}>
              Start for Free →
            </Link>
            <div className="meta">
              <span className="c"><span className="ck">✓</span>No credit card</span>
              <span className="c"><span className="ck">✓</span>500 free signups</span>
              <span className="c"><span className="ck">✓</span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="v2-footer">
        <div className="v2-wrap v2-foot-in">
          <div className="v2-brand">
            <Image src="/logo-full.png" alt="waitrocket" width={100} height={22} style={{ height: 22, width: "auto" }} />
          </div>
          <div className="v2-foot-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/refund">Refund</Link>
            <a href="mailto:support@waitrocket.com">support@waitrocket.com</a>
          </div>
          <div>© 2026</div>
        </div>
      </footer>
    </div>
  );
}
