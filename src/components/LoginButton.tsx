"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginButton() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
      if (!session) {
        setEmail("");
        setPassword("");
        setError(null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit() {
    setError(null);
    setSuccess(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setError("Please enter your email");
      return;
    }

    if (!cleanPassword) {
      setError("Please enter a password");
      return;
    }

    if (isSignUp && cleanPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      if (isSignUp) {
        // Sign up new user
        const { error: signUpError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (signUpError) {
          console.error("Sign up error:", signUpError);
          setError(signUpError.message);
          return;
        }

        setSuccess("Account created! You can now sign in.");
        setIsSignUp(false);
        setPassword("");
      } else {
        // Sign in existing user
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (signInError) {
          console.error("Sign in error:", signInError);
          setError(signInError.message);
          return;
        }

        // Success - user will be redirected automatically
      }
    } catch (e: unknown) {
      console.error("Auth error:", e);
      setError(e instanceof Error ? e.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to sign out");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  }

  // Logged in state
  if (userEmail) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline text-sm text-zinc-300 truncate max-w-[200px]">
          {userEmail}
        </span>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="rounded-lg px-3 py-2 bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 disabled:opacity-50 transition"
        >
          {loading ? "..." : "Sign out"}
        </button>
      </div>
    );
  }

  // Login/Signup form
  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
              setSuccess(null);
            }}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white w-32 sm:w-40 text-sm placeholder:text-zinc-500 outline-none focus:border-zinc-600 disabled:opacity-50 transition"
          />
        </div>

        <div className="relative">
          <input
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
              setSuccess(null);
            }}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white w-32 sm:w-40 text-sm placeholder:text-zinc-500 outline-none focus:border-zinc-600 disabled:opacity-50 transition"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-lg px-4 py-2 bg-white text-black font-semibold hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
        >
          {loading ? "..." : isSignUp ? "Sign up" : "Sign in"}
        </button>
      </div>

      {/* Toggle Sign Up / Sign In */}
      <div className="mt-2 text-center">
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
            setSuccess(null);
          }}
          className="text-xs text-zinc-400 hover:text-zinc-300 underline"
        >
          {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
        </button>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="absolute top-full left-0 mt-2 text-xs text-red-400 bg-zinc-900 border border-red-800 rounded px-3 py-2 max-w-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="absolute top-full left-0 mt-2 text-xs text-emerald-400 bg-zinc-900 border border-emerald-800 rounded px-3 py-2 max-w-sm">
          {success}
        </div>
      )}
    </div>
  );
}