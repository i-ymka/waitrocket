// GET /api/health/config — agent-readable config ground-truth.
//
// Returns booleans only. No secret values, no stack traces, no env dumps.
// Unauthenticated on purpose — zero secret material in response.

import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const PADDLE_API_URL =
  process.env.PADDLE_API_URL ?? "https://sandbox-api.paddle.com";

const CACHE_TTL_MS = 45_000;

type ConfigHealth = {
  paddle: { configured: boolean; live_auth_ok: boolean };
  resend: { configured: boolean };
  db: { connected: boolean };
  checkout: { ready: boolean };
  checked_at: string;
};

let cached: { value: ConfigHealth; at: number } | null = null;

function nonEmpty(v: string | undefined): boolean {
  return typeof v === "string" && v.trim().length > 0;
}

async function paddleLiveAuthOk(): Promise<boolean> {
  try {
    const res = await fetch(`${PADDLE_API_URL}/event-types?per_page=1`, {
      method: "GET",
      headers: { Authorization: `Bearer ${process.env.PADDLE_API_KEY ?? ""}` },
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function dbConnected(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

async function computeHealth(): Promise<ConfigHealth> {
  const paddleConfigured =
    nonEmpty(process.env.PADDLE_API_KEY) &&
    nonEmpty(process.env.PADDLE_WAITLIST_PRO_PRICE_ID) &&
    nonEmpty(process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN);

  const liveAuthOk = paddleConfigured ? await paddleLiveAuthOk() : false;
  const connected = await dbConnected();
  const resendConfigured = nonEmpty(process.env.RESEND_API_KEY);

  return {
    paddle: { configured: paddleConfigured, live_auth_ok: liveAuthOk },
    resend: { configured: resendConfigured },
    db: { connected },
    checkout: { ready: paddleConfigured && liveAuthOk },
    checked_at: new Date().toISOString(),
  };
}

export async function GET() {
  const now = Date.now();

  if (cached && now - cached.at < CACHE_TTL_MS) {
    return Response.json(cached.value, {
      headers: { "Cache-Control": "public, max-age=45" },
    });
  }

  let value: ConfigHealth;
  try {
    value = await computeHealth();
  } catch {
    value = {
      paddle: { configured: false, live_auth_ok: false },
      resend: { configured: false },
      db: { connected: false },
      checkout: { ready: false },
      checked_at: new Date().toISOString(),
    };
  }

  cached = { value, at: now };

  return Response.json(value, {
    headers: { "Cache-Control": "public, max-age=45" },
  });
}
