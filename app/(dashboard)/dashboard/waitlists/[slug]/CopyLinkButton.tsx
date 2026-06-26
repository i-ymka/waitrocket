"use client";

import { useState } from "react";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback — select the text
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2 rounded-xl text-sm font-bold transition-all border-2"
      style={
        copied
          ? { borderColor: "#16a34a", color: "#16a34a", backgroundColor: "#f0fdf4" }
          : { borderColor: "#e4e4e7", color: "#52525b", backgroundColor: "white" }
      }
    >
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}
