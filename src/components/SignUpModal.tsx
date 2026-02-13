"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SignUpModal({ isOpen, onClose, onSuccess }: SignUpModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/pro`,
        },
      });

      if (error) throw error;

      if (data.user) {
        // Success - proceed to checkout
        onSuccess();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Create your account</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-zinc-400 mb-6">
          Quick sign-up to proceed to checkout
        </p>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 focus:border-amber-700 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 focus:border-amber-700 focus:outline-none"
              placeholder="At least 6 characters"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-900/20 border border-red-900/50 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-700 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Creating account..." : "Continue to checkout"}
          </button>

          <p className="text-xs text-zinc-500 text-center">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </form>
      </div>
    </div>
  );
}
