import { Resend } from "resend";

let resend: Resend | null = null;
function getResend(): Resend {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

// Escape user-supplied text before interpolating into email HTML.
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendWaitlistConfirmation({
  toEmail,
  name,
  currentPosition,
  referralLink,
}: {
  toEmail: string;
  name: string | null;
  currentPosition: number;
  referralLink: string;
}) {
  const from = "hello@waitrocket.com";
  const greeting = name ? `<p>Hi ${escapeHtml(name)},</p>` : "";

  await getResend().emails.send({
    from,
    to: toEmail,
    subject: `You're on the waitlist! You're #${currentPosition}`,
    html: `
      <h2>You made it!</h2>
      ${greeting}
      <p>You're <strong>#${currentPosition}</strong> on the waitlist.</p>
      <p>Want to move up? Share your link to jump ahead:</p>
      <p>
        <a href="${referralLink}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
          Share to move up
        </a>
      </p>
      <p style="color:#888;font-size:12px;">${referralLink}</p>
    `,
  });
}

export async function sendWaitlistPositionUpdate({
  toEmail,
  newPosition,
  referralCount,
  referralLink,
}: {
  toEmail: string;
  newPosition: number;
  referralCount: number;
  referralLink: string;
}) {
  const from = "hello@waitrocket.com";

  await getResend().emails.send({
    from,
    to: toEmail,
    subject: `Someone signed up through your link! You're now #${newPosition}`,
    html: `
      <h2>Your referral worked!</h2>
      <p>Someone joined through your link. You've now referred <strong>${referralCount}</strong> ${referralCount === 1 ? "person" : "people"}.</p>
      <p>Your current position: <strong>#${newPosition}</strong></p>
      <p>Keep sharing to move up faster:</p>
      <p>
        <a href="${referralLink}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
          Share your link
        </a>
      </p>
      <p style="color:#888;font-size:12px;">${referralLink}</p>
    `,
  });
}
