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
      router.push("/pro");
    } else {
      setShowSignUpModal(true);
    }
  }

  function handleSignUpSuccess() {
    setShowSignUpModal(false);
    router.push("/pro");
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative space-y-4 sm:space-y-6 text-center max-w-3xl mx-auto py-4 sm:py-8">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs sm:text-sm font-medium">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            AI-Powered Grind Calculator
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1] px-4">
            Dial in your espresso
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              in seconds
            </span>
          </h1>
          
          <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed px-4">
            Get AI-powered grind recommendations for your exact coffee machine and beans. 
            Stop guessing, start brewing perfect espresso.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 px-4">
            {isPro ? (
              <Link
                href="/manage-subscription"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-base sm:text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/25"
              >
                Manage Subscription
              </Link>
            ) : (
              <button
                onClick={handleGetProClick}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-base sm:text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/25"
              >
                Get Pro - £3.99/mo
              </button>
            )}
            <Link
              href="#calculator"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl border border-zinc-700 text-white font-semibold text-base sm:text-lg hover:bg-zinc-900 transition-all"
            >
              Try Free Calculator
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-6 sm:pt-8 max-w-xl mx-auto px-4">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">100+</div>
              <div className="text-xs sm:text-sm text-zinc-400">Coffee Machines</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">500+</div>
              <div className="text-xs sm:text-sm text-zinc-400">Coffee Beans</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">AI</div>
              <div className="text-xs sm:text-sm text-zinc-400">Powered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Section with Enhanced Glow */}
      <div id="calculator" className="relative px-4 sm:px-0">
        {/* Enhanced glow effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/30 via-amber-600/40 to-amber-500/30 rounded-3xl blur-2xl animate-pulse" />
        
        {/* Subtle inner glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-amber-600/20 to-amber-500/20 rounded-3xl blur-lg" />
        
        <div className="relative">
          <GrindFinder />
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-white">
            Why Dialmycoffee?
          </h2>
          <p className="text-zinc-400 text-lg">
            Get professional barista results at home
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-amber-500/50 transition-all">
            {/* Hover glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity" />
            
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Instant Results</h3>
              <p className="text-zinc-400">Get precise grind settings in seconds, not hours of trial and error</p>
            </div>
          </div>

          <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-amber-500/50 transition-all">
            {/* Hover glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity" />
            
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI-Powered</h3>
              <p className="text-zinc-400">Advanced AI analyzes your machine and beans for optimal extraction</p>
            </div>
          </div>

          <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-amber-500/50 transition-all">
            {/* Hover glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity" />
            
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Expert Guides</h3>
              <p className="text-zinc-400">Detailed guides for Sage, Breville, Gaggia and more</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Guides Section with Glowing Cards */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-white">
            Machine-Specific Guides
          </h2>
          <p className="text-zinc-400 text-lg">
            Detailed grind settings for your coffee machine
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/sage-barista-express-grind-settings"
            className="group relative p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-amber-500/50 transition-all"
          >
            {/* Hover glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity" />
            
            <div className="relative">
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                Sage Barista Express
              </h3>
              <p className="text-sm text-zinc-400 mb-3">
                16 grind settings explained
              </p>
              <span className="text-amber-400 text-sm font-medium group-hover:translate-x-1 inline-block transition-transform">
                Read guide →
              </span>
            </div>
          </Link>
          
          <Link
            href="/breville-barista-pro-grind-settings"
            className="group relative p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-amber-500/50 transition-all"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity" />
            
            <div className="relative">
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                Breville Barista Pro
              </h3>
              <p className="text-sm text-zinc-400 mb-3">
                30 grind settings guide
              </p>
              <span className="text-amber-400 text-sm font-medium group-hover:translate-x-1 inline-block transition-transform">
                Read guide →
              </span>
            </div>
          </Link>
          
          <Link
            href="/gaggia-classic-pro-grind-settings"
            className="group relative p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-amber-500/50 transition-all"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity" />
            
            <div className="relative">
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                Gaggia Classic Pro
              </h3>
              <p className="text-sm text-zinc-400 mb-3">
                External grinder tips
              </p>
              <span className="text-amber-400 text-sm font-medium group-hover:translate-x-1 inline-block transition-transform">
                Read guide →
              </span>
            </div>
          </Link>
          
          <Link
            href="/sage-oracle-grind-settings"
            className="group relative p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-amber-500/50 transition-all"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity" />
            
            <div className="relative">
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                Sage Oracle
              </h3>
              <p className="text-sm text-zinc-400 mb-3">
                45 precision settings
              </p>
              <span className="text-amber-400 text-sm font-medium group-hover:translate-x-1 inline-block transition-transform">
                Read guide →
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* CTA Section with Glow */}
      {!isPro && (
        <div className="relative px-4">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-amber-600/30 to-amber-500/30 rounded-3xl blur-2xl" />
          
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/30 p-8 sm:p-12 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent" />
            
            <div className="relative space-y-4 sm:space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Ready for perfect espresso?
              </h2>
              <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto">
                Upgrade to Pro for unlimited recommendations, dial-in feedback, and save your favorite machines.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={handleGetProClick}
                  className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-base sm:text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-2xl shadow-amber-500/30"
                >
                  Get Pro - £3.99/mo
                </button>
                <p className="text-xs sm:text-sm text-zinc-400">Cancel anytime • No commitment</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSuccess={handleSignUpSuccess}
      />
    </div>
  );
}
