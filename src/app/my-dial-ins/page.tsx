"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface DialIn {
  id: string;
  machine_id: string;
  bean_name: string;
  roast_level: string;
  dose_g: number;
  yield_g: number;
  time_s: number;
  grind_setting: string;
  temp_c?: number;
  is_successful: boolean;
  roasted_on?: string;
  days_off_roast_at_save?: number;
  notes?: string;
  created_at: string;
}

export default function MyDialInsPage() {
  const router = useRouter();
  const [dialIns, setDialIns] = useState<DialIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_isPro, setIsPro] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { checkAuthAndLoad(); }, []);

  async function checkAuthAndLoad() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) return;

    try {
      // Check Pro status
      const statusRes = await fetch("/api/get-subscription-status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setIsPro(!!statusData.isPro);
        if (!statusData.isPro) {
          router.push("/pro");
          return;
        }
      }

      // Load dial-ins
      const res = await fetch("/api/dial-ins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDialIns(data.dialIns || []);
      } else {
        setError("Failed to load dial-ins");
      }
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleSuccessful(dialIn: DialIn) {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) return;

    const res = await fetch("/api/dial-ins", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: dialIn.id, is_successful: !dialIn.is_successful }),
    });

    if (res.ok) {
      setDialIns(prev => prev.map(d => d.id === dialIn.id ? { ...d, is_successful: !d.is_successful } : d));
    }
  }

  async function deleteDialIn(id: string) {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) return;

    const res = await fetch(`/api/dial-ins?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setDialIns(prev => prev.filter(d => d.id !== id));
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl py-8">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 text-center text-zinc-400">
          Loading your dial-ins...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Dial-Ins</h1>
          <p className="text-sm text-zinc-400 mt-1">Your saved espresso recipes and baselines</p>
        </div>
        <Link href="/#calculator" className="rounded-xl bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 transition">
          New Recommendation
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-red-900 bg-zinc-950 p-4 text-red-300 text-sm">{error}</div>
      )}

      {dialIns.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 text-center">
          <p className="text-zinc-400">No saved dial-ins yet.</p>
          <p className="text-sm text-zinc-500 mt-2">Get a grind recommendation and save it to start building your library.</p>
          <Link href="/#calculator" className="inline-block mt-4 rounded-xl bg-amber-700 px-6 py-3 text-sm font-medium text-white hover:bg-amber-600 transition">
            Get Started
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {dialIns.map((dialIn) => (
            <div key={dialIn.id} className={`rounded-xl border ${dialIn.is_successful ? "border-green-700/35 bg-green-900/5" : "border-zinc-800 bg-zinc-950"} p-5`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{dialIn.bean_name}</h3>
                    {dialIn.is_successful && (
                      <span className="rounded-full bg-green-700/20 border border-green-700/35 px-2 py-0.5 text-xs text-green-300">Successful</span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 mt-1">{dialIn.roast_level} roast</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-amber-200">{dialIn.grind_setting}</p>
                  <p className="text-xs text-zinc-500">Grind</p>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                <div className="rounded-lg bg-zinc-900 p-2 text-center">
                  <p className="text-xs text-zinc-500">Dose</p>
                  <p className="text-sm font-medium text-white">{dialIn.dose_g}g</p>
                </div>
                <div className="rounded-lg bg-zinc-900 p-2 text-center">
                  <p className="text-xs text-zinc-500">Yield</p>
                  <p className="text-sm font-medium text-white">{dialIn.yield_g}g</p>
                </div>
                <div className="rounded-lg bg-zinc-900 p-2 text-center">
                  <p className="text-xs text-zinc-500">Time</p>
                  <p className="text-sm font-medium text-white">{dialIn.time_s}s</p>
                </div>
                {dialIn.temp_c && (
                  <div className="rounded-lg bg-zinc-900 p-2 text-center">
                    <p className="text-xs text-zinc-500">Temp</p>
                    <p className="text-sm font-medium text-white">{dialIn.temp_c}\u00B0C</p>
                  </div>
                )}
                <div className="rounded-lg bg-zinc-900 p-2 text-center">
                  <p className="text-xs text-zinc-500">Ratio</p>
                  <p className="text-sm font-medium text-white">1:{(dialIn.yield_g / dialIn.dose_g).toFixed(1)}</p>
                </div>
              </div>

              {dialIn.notes && (
                <p className="text-sm text-zinc-400 mt-3">{dialIn.notes}</p>
              )}

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800">
                <span className="text-xs text-zinc-500">
                  {new Date(dialIn.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  {dialIn.days_off_roast_at_save !== null && dialIn.days_off_roast_at_save !== undefined ? ` \u2022 ${dialIn.days_off_roast_at_save}d off roast` : ""}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => toggleSuccessful(dialIn)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${dialIn.is_successful ? "border border-zinc-700 text-zinc-400 hover:text-zinc-200" : "bg-green-700/20 border border-green-700/35 text-green-300 hover:bg-green-700/30"}`}>
                    {dialIn.is_successful ? "Unmark" : "Mark Successful"}
                  </button>
                  <button onClick={() => deleteDialIn(dialIn.id)} className="rounded-lg border border-red-700/35 px-3 py-1.5 text-xs text-red-300 hover:bg-red-900/20 transition">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
