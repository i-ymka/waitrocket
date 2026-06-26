import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Waitrocket",
  description: "Waitrocket Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-zinc-100 px-6 py-4">
        <Link href="/" className="text-zinc-900 font-semibold text-lg">
          Waitrocket
        </Link>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-zinc-500 mb-10">Last updated: June 2026</p>

        <div className="max-w-none space-y-8 text-zinc-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using Waitrocket (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">2. Description of Service</h2>
            <p>Waitrocket is a platform that lets you create launch waitlists with built-in referral mechanics. You can collect signups, track referrals, and embed a waitlist widget on your own site. The Free plan supports up to 500 signups; the Pro plan removes that limit and unlocks additional features.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">3. Account Registration</h2>
            <p>You must create an account to use Waitrocket. You are responsible for maintaining the security of your account and all activity that occurs under it. You must be at least 18 years old to use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">4. Acceptable Use</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Collect signups through deception or without the consent of the people who join</li>
              <li>Send unsolicited spam to people on your waitlist</li>
              <li>Promote illegal, fraudulent, or harmful offerings</li>
              <li>Infringe on the intellectual property or privacy rights of others</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">5. Payments and Billing</h2>
            <p>The Pro plan is billed at $9/month through Paddle, our merchant of record. Payments are processed securely by Paddle, who handles billing, invoicing, and order-related inquiries. You are responsible for any taxes applicable to your use of the Service. You can cancel at any time from your dashboard; your Pro access continues until the end of the current billing period.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">6. Your Data and Signups</h2>
            <p>You retain ownership of the waitlist signups and content you collect through Waitrocket. You are responsible for handling the personal data of people who join your waitlist in line with applicable privacy laws. By using the Service, you grant Waitrocket a limited license to store and process that data solely to operate the Service for you.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">7. Termination</h2>
            <p>We reserve the right to suspend or terminate your account if you violate these Terms. You may cancel your account at any time from your dashboard.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">8. Limitation of Liability</h2>
            <p>Waitrocket is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">9. Changes to Terms</h2>
            <p>We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">10. Contact</h2>
            <p>For questions about these Terms, contact us at support@waitrocket.com.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
