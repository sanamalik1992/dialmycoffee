"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

function normalizeEmail(raw: string) {
  return raw
    .trim()
    .replace(/["'“”‘’]/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero-width/invisible chars
    .replace(/\s+/g, "") // remove any spaces anywhere
    .toLowerCase()
    .normalize("NFKC");
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendLink() {
    setError(null);

    const cleanEmail = normalizeEmail(email);

    // 🔎 DEBUG: prove exactly what is being sent (including hidden characters)
    console.log("RAW email:", JSON.stringify(email));
    console.log("CLEAN email:", JSON.stringify(cleanEmail));
    console.log(
      "CLEAN char codes:",
      [...cleanEmail].map((c) => c.charCodeAt(0))
    );

    // show the cleaned version in the input too
    setEmail(cleanEmail);

    // basic format check
    const looksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);
    if (!looksValid) {
      setError(`Invalid format: ${JSON.stringify(cleanEmail)}`);
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?returnTo=/pro`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSent(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to send login link");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0F1115] text-[#F4F4F2] grid place-items-center px-6">
      <div className="w-full max-w-md rounded-2xl bg-[#141823] p-6 ring-1 ring-white/10">
        <h1 className="text-xl font-semibold">Log in</h1>
        <p className="mt-2 text-sm text-white/70">
          We’ll email you a secure login link.
        </p>

        {sent ? (
          <p className="mt-4 text-sm text-[#C48A5A]">
            Check your inbox for the login link ☕
          </p>
        ) : (
          <>
            <input
              type="email"
              placeholder="sanamalik1992@yahoo.com"
              value={email}
              onChange={(e) => setEmail(normalizeEmail(e.target.value))}
              className="mt-4 w-full rounded-xl bg-[#0F1115] px-4 py-3 text-sm ring-1 ring-white/10 outline-none"
              autoComplete="email"
              inputMode="email"
            />

            <button
              onClick={sendLink}
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-[#C48A5A] px-4 py-3 text-sm font-semibold text-[#0F1115] disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send login link"}
            </button>

            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          </>
        )}
      </div>
    </main>
  );
}
