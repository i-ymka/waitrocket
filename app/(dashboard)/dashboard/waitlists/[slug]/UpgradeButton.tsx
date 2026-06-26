"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { startWaitlistCheckout } from "../../actions";

export function UpgradeButton() {
  const paddleRef = useRef<Paddle | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) {
      setError("paddle_token_missing");
      return;
    }
    initializePaddle({ token, environment: "production" })
      .then((paddle) => {
        if (paddle) {
          paddleRef.current = paddle;
          setReady(true);
        } else {
          setError("paddle_init_returned_null");
        }
      })
      .catch((e) => {
        console.error("[UpgradeButton] Paddle init failed", e);
        setError("paddle_init_failed");
      });
  }, []);

  const onClick = () => {
    if (!ready || !paddleRef.current) return;
    startTransition(async () => {
      const res = await startWaitlistCheckout();
      if (!res.ok) {
        setError(res.error);
        return;
      }
      paddleRef.current!.Checkout.open({ transactionId: res.transactionId });
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={!ready || isPending}
        className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Opening…" : "Upgrade to Pro — $9/mo"}
      </button>
      {error && (
        <span className="text-xs text-red-600 font-medium">Checkout error: {error}</span>
      )}
    </div>
  );
}
