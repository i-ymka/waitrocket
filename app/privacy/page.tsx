import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Waitrocket",
  description: "Waitrocket Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-zinc-100 px-6 py-4">
        <Link href="/" className="text-zinc-900 font-semibold text-lg">
          Waitrocket
        </Link>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-zinc-500 mb-10">Last updated: June 2026</p>

        <div className="max-w-none space-y-8 text-zinc-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">1. Information We Collect</h2>
            <p>We collect information you provide when you create an account, including your name, email address, and payment information. We also collect usage data such as pages visited and features used.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">2. Waitlist Signup Data</h2>
            <p>When people join a waitlist you create, Waitrocket collects and stores the information they submit (such as email address and referral activity) on your behalf. You are the controller of that data; we process it solely to operate your waitlist. You are responsible for how you use and contact those signups.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Provide and improve the Waitrocket service</li>
              <li>Process payments and send receipts</li>
              <li>Send important service updates and notifications</li>
              <li>Respond to your support requests</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">4. Payment Processing</h2>
            <p>Payments are processed by Paddle, our merchant of record. We do not store your full credit card details. Paddle&rsquo;s privacy policy governs the handling of your payment information.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">5. Information Sharing</h2>
            <p>We do not sell your personal information. We share data only with service providers necessary to operate Waitrocket (authentication, analytics, email delivery, payment processing) and when required by law.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">6. Cookies</h2>
            <p>We use cookies to keep you logged in and to understand how the Service is used. You can disable cookies in your browser settings, but some features may not work correctly.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">7. Data Retention</h2>
            <p>We retain your account data as long as your account is active. After account deletion, we may retain certain data for up to 90 days for legal and operational purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">8. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at support@waitrocket.com.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">9. Security</h2>
            <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. We will notify you of significant changes via email or in-app notice.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">11. Contact</h2>
            <p>For privacy-related questions, contact us at support@waitrocket.com.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
