"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

function ManageSubscriptionContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/");
      return;
    }

    setUserEmail(user.email || "");

    // Get subscription info
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_pro, stripe_subscription_id')
      .eq('id', user.id)
      .single();

    if (!profile?.is_pro) {
      router.push("/pro");
      return;
    }

    setIsPro(true);
    setSubscriptionId(profile.stripe_subscription_id || "");
    setLoading(false);
  }

  async function handleCancelSubscription() {
    if (!confirm("Are you sure you want to cancel your Pro subscription? You'll lose access to unlimited recommendations at the end of your billing period.")) {
      return;
    }

    setCanceling(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        alert("Please log in again");
        return;
      }

      const res = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel subscription");
      }

      alert("Subscription canceled successfully. You'll have access until the end of your billing period.");
      router.push("/");
    } catch (error: any) {
      alert(error.message || "Failed to cancel subscription");
    } finally {
      setCanceling(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0F1115] text-[#F4F4F2] grid place-items-center">
        <div className="text-[#C48A5A] text-2xl">☕︎</div>
      </main>
    );
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
        <h1 className="mt-8 text-3xl font-semibold">Manage Subscription</h1>
        <p className="mt-2 text-sm text-white/70">
          View and manage your Pro subscription
        </p>

        {/* Subscription Info */}
        <div className="mt-6 rounded-2xl bg-[#141823] p-5 ring-1 ring-white/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-green-500">Active Pro Member</span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Plan</span>
              <span className="text-white font-medium">Dialmycoffee Pro</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Price</span>
              <span className="text-white font-medium">£3.99/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Email</span>
              <span className="text-white font-medium">{userEmail}</span>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-white/10">
            <p className="text-xs text-white/60 mb-3">
              Your subscription will renew automatically each month. You can cancel anytime.
            </p>
            <button
              onClick={handleCancelSubscription}
              disabled={canceling}
              className="w-full rounded-lg bg-red-600/20 border border-red-600/50 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-600/30 disabled:opacity-50 transition"
            >
              {canceling ? "Canceling..." : "Cancel Subscription"}
            </button>
          </div>
        </div>

        {/* Pro Features */}
        <div className="mt-6 rounded-2xl bg-[#141823] p-5 ring-1 ring-white/10">
          <h2 className="text-sm font-medium text-white mb-3">Your Pro Benefits</h2>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex gap-2">
              <span className="text-[#C48A5A]">✓</span>
              Unlimited grind recommendations
            </li>
            <li className="flex gap-2">
              <span className="text-[#C48A5A]">✓</span>
              Pro grind tips (coming soon)
            </li>
            <li className="flex gap-2">
              <span className="text-[#C48A5A]">✓</span>
              Save favorites (coming soon)
            </li>
            <li className="flex gap-2">
              <span className="text-[#C48A5A]">✓</span>
              Early access to new features
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/50">
            Need help? Contact us at{" "}
            <a href="mailto:hello@dialmycoffee.com" className="text-[#C48A5A] hover:underline">
              hello@dialmycoffee.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function ManageSubscriptionPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#0F1115] text-[#F4F4F2] grid place-items-center">
        <div className="text-[#C48A5A] text-2xl">☕︎</div>
      </main>
    }>
      <ManageSubscriptionContent />
    </Suspense>
  );
}
