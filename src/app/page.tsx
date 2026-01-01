"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import GrindFinder from "@/components/GrindFinder";
import SignUpModal from "@/components/SignUpModal";

export default function HomePage() {
  const router = useRouter();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    setIsLoggedIn(!!user);
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
      {/* Header with Get Pro button */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Dial in your espresso
          </h1>
          <p className="text-zinc-300 max-w-2xl mt-2">
            Select your coffee machine, roaster and bean to get a grind recommendation.
          </p>
        </div>

        <button
          onClick={handleGetProClick}
          className="shrink-0 rounded-xl bg-amber-700 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition"
        >
          Get Pro - £3.99/mo
        </button>
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
