"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
// ... other imports

export const dynamic = 'force-dynamic'; // ADD THIS

export default function ProPage() {
  const params = useSearchParams();
  const canceled = useMemo(() => params.get("canceled") === "1", [params]);
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    // ✅ STEP 1: Force login before checkout
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      alert(error.message);
      return;
    }

    if (!data.user) {
      // Not logged in → send to login page
      window.location.href = "/login";
      return;
    }

    // Existing Stripe checkout flow
    try {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
const token = sessionData.session?.access_token;

console.log("Token:", token); //
console.log("User:", data.user?.email);

if (!token) {
  window.location.href = "/login";
  return;
}

const res = await fetch("/api/create-checkout-session", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

      const data2 = await res.json();

      if (!res.ok) {
        alert(data2?.details ?? data2?.error ?? "Checkout failed");
        return;
      }

      if (data2?.url) {
        window.location.href = data2.url;
      } else {
        alert("Checkout URL missing. Check /api/checkout response.");
      }
    } catch (e: any) {
      alert(e?.message ?? "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0F1115] text-[#F4F4F2]">
      <div className="mx-auto max-w-md px-5 py-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#1A1D24] grid place-items-center">
              <span className="text-[#C48A5A]">☕︎</span>
            </div>
            <div className="text-lg font-semibold tracking-tight">
              dialmycoffee
            </div>
          </Link>

          <Link
            href="/"
            className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 hover:bg-white/15"
          >
            Home
          </Link>
        </div>

        {/* Title */}
        <h1 className="mt-8 text-3xl font-semibold">Dialmycoffee Pro</h1>
        <p className="mt-2 text-sm text-white/70">
          Unlock faster dial-in, smarter guidance, and more beans.
        </p>

        {canceled && (
          <div className="mt-6 rounded-2xl bg-[#141823] p-4 ring-1 ring-white/10 text-sm text-white/80">
            Payment canceled — no worries. You can upgrade anytime.
          </div>
        )}

        {/* Card */}
        <div className="mt-6 rounded-2xl bg-[#141823] p-5 ring-1 ring-white/10">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-sm text-white/70">Pro</div>
              <div className="mt-1 text-2xl font-semibold text-[#C48A5A]">
                £3.99<span className="text-sm text-white/60">/month</span>
              </div>
            </div>
            <div className="text-xs text-white/60">Cancel anytime</div>
          </div>

          <ul className="mt-5 space-y-2 text-sm text-white/80">
            <li className="flex gap-2">
              <span className="text-[#C48A5A]">✓</span>
              Unlimited roasters & beans
            </li>
            <li className="flex gap-2">
              <span className="text-[#C48A5A]">✓</span>
              Pro grind tips (what to change next)
            </li>
            <li className="flex gap-2">
              <span className="text-[#C48A5A]">✓</span>
              Save favourites (machines + beans)
            </li>
            <li className="flex gap-2">
              <span className="text-[#C48A5A]">✓</span>
              Early access to new machine profiles
            </li>
          </ul>

          <button
            onClick={startCheckout}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-[#C48A5A] px-4 py-3 text-sm font-semibold text-[#0F1115] disabled:opacity-60"
          >
            {loading ? "Redirecting…" : "Upgrade now"}
          </button>

          <div className="mt-3 text-xs text-white/50">
            Secure payment powered by Stripe. No card details stored on
            Dialmycoffee.
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-6 flex items-center justify-between text-xs text-white/60">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Dialmycoffee" className="h-10 w-auto" />
          </Link>
          <a
            className="hover:text-white/80"
            href="https://stripe.com"
            target="_blank"
            rel="noreferrer"
          >
            Payments by Stripe
          </a>
        </div>
      </div>
    </main>
  );
}
