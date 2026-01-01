"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic'; // ADD THIS LINE

function AuthCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [msg, setMsg] = useState("Signing you in…");

  useEffect(() => {
    (async () => {
      try {
        const returnTo = params.get("returnTo") || "/pro";

        // ✅ 1) Try Supabase's built-in handler (works for hash and code flows)
        const authAny = supabase.auth as any;

        if (typeof authAny.getSessionFromUrl === "function") {
          const { data, error } = await authAny.getSessionFromUrl({
            storeSession: true,
          });

          if (error) {
            setMsg(`Login failed: ${error.message}`);
            return;
          }

          if (data?.session) {
            router.replace(returnTo);
            return;
          }
        }

        // ✅ 2) If using PKCE code flow
        const code = params.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setMsg(`Login failed: ${error.message}`);
            return;
          }
          router.replace(returnTo);
          return;
        }

        // ✅ 3) If using magic link token_hash flow
        const token_hash = params.get("token_hash");
        const type = params.get("type"); // usually "magiclink"
        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          });

          if (error) {
            setMsg(`Login failed: ${error.message}`);
            return;
          }
          router.replace(returnTo);
          return;
        }

        // ✅ 4) Last-chance: if Supabase stored session automatically
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session) {
          router.replace(returnTo);
          return;
        }

        setMsg("Missing login details. Please request a new login link.");
      } catch (e: any) {
        setMsg(e?.message ?? "Login failed. Please try again.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-[#0F1115] text-[#F4F4F2] grid place-items-center px-6">
      <div className="w-full max-w-md rounded-2xl bg-[#141823] p-6 ring-1 ring-white/10 text-center">
        <div className="text-[#C48A5A] text-2xl">☕︎</div>
        <h1 className="mt-3 text-lg font-semibold">Signing you in</h1>
        <p className="mt-2 text-sm text-white/70">{msg}</p>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#0F1115] text-[#F4F4F2] grid place-items-center px-6">
        <div className="w-full max-w-md rounded-2xl bg-[#141823] p-6 ring-1 ring-white/10 text-center">
          <div className="text-[#C48A5A] text-2xl">☕︎</div>
          <h1 className="mt-3 text-lg font-semibold">Loading...</h1>
        </div>
      </main>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
