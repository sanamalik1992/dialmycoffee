 "use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import GrindFinder from "@/components/GrindFinder";
import SignUpModal from "@/components/SignUpModal";

export default function HomePage() {
  const router = useRouter();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    setIsLoggedIn(!!user);

    if (user) {
      // Check if user is Pro using API (bypasses RLS)
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (token) {
        try {
          const res = await fetch("/api/get-subscription-status", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            setIsPro(!!data.isPro);
          }
        } catch (error) {
          console.error("Failed to check Pro status:", error);
        }
      }
    }
  }

  function handleGetProClick() {
    if (isLoggedIn) {
      // Already logged in, go straight to checkout
      router.push("/pro");
    } else {
      // Show sign-up modal
      setShowSignUpModal(true);
    }
  }

  function handleSignUpSuccess() {
    setShowSignUpModal(false);
    // Redirect to Pro page for checkout
    router.push("/pro");
  }

  return (
    <div className="space-y-6">
      {/* Header with Get Pro/Manage Subscription button */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Dial in your espresso
          </h1>
          <p className="text-zinc-300 max-w-2xl mt-2">
            Select your coffee machine, roaster and bean to get a grind recommendation.
          </p>
        </div>

        {isPro ? (
          <Link
            href="/manage-subscription"
            className="shrink-0 rounded-xl bg-[#C48A5A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#B67A4A] transition"
          >
            Manage Subscription
          </Link>
        ) : (
          <button
            onClick={handleGetProClick}
            className="shrink-0 rounded-xl bg-amber-700 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition"
          >
            Get Pro - £3.99/mo
          </button>
        )}
      </div>

      <GrindFinder />

      {/* Sign-up Modal */}
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSuccess={handleSignUpSuccess}
      />
    </div>
  );
}
