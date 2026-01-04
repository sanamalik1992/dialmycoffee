"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

type FavouriteMachine = {
  id: string;
  machine_id: string;
  created_at: string;
  machines: {
    id: string;
    name: string;
    min_grind: number;
    max_grind: number;
    espresso_min: number;
    espresso_max: number;
  };
};

type FavouriteBean = {
  id: string;
  bean_id: string;
  created_at: string;
  beans: {
    id: string;
    name: string;
    roaster: string;
    roast_level: string;
  };
};

function FavouritesContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [machines, setMachines] = useState<FavouriteMachine[]>([]);
  const [beans, setBeans] = useState<FavouriteBean[]>([]);

  useEffect(() => {
    checkAuthAndLoadFavourites();
  }, []);

  async function checkAuthAndLoadFavourites() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/");
      return;
    }

    // Check Pro status
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token) {
      router.push("/");
      return;
    }

    try {
      const statusRes = await fetch("/api/get-subscription-status", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        
        if (!statusData.isPro) {
          router.push("/pro");
          return;
        }

        setIsPro(true);

        // Load favourites
        const [machinesRes, beansRes] = await Promise.all([
          fetch("/api/favourite-machines", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/favourite-beans", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [machinesData, beansData] = await Promise.all([
          machinesRes.json(),
          beansRes.json(),
        ]);

        if (machinesData.favourites) {
          setMachines(machinesData.favourites);
        }

        if (beansData.favourites) {
          setBeans(beansData.favourites);
        }
      }
    } catch (error) {
      console.error("Failed to load favourites:", error);
    } finally {
      setLoading(false);
    }
  }

  async function removeMachine(machineId: string) {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token) return;

    try {
      const res = await fetch(`/api/favourite-machines?machineId=${machineId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setMachines(prev => prev.filter(m => m.machine_id !== machineId));
      }
    } catch (error) {
      console.error("Failed to remove machine:", error);
    }
  }

  async function removeBean(beanId: string) {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token) return;

    try {
      const res = await fetch(`/api/favourite-beans?beanId=${beanId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setBeans(prev => prev.filter(b => b.bean_id !== beanId));
      }
    } catch (error) {
      console.error("Failed to remove bean:", error);
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
      <div className="mx-auto max-w-4xl px-5 py-10">
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
        <h1 className="mt-8 text-3xl font-semibold">My Favourites</h1>
        <p className="mt-2 text-sm text-white/70">
          Your saved coffee machines and beans
        </p>

        {/* Favourite Machines */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>☕</span> Coffee Machines
          </h2>
          
          {machines.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center">
              <p className="text-zinc-400">No favourite machines yet</p>
              <p className="text-sm text-zinc-500 mt-2">
                Click the ☆ next to a machine in the grind finder to save it here
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {machines.map((fav) => (
                <div
                  key={fav.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 hover:border-zinc-700 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{fav.machines.name}</h3>
                      <div className="mt-2 space-y-1 text-sm text-zinc-400">
                        <p>Range: {fav.machines.min_grind} - {fav.machines.max_grind}</p>
                        <p>Espresso: {fav.machines.espresso_min} - {fav.machines.espresso_max}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeMachine(fav.machine_id)}
                      className="text-xl hover:scale-110 transition ml-2"
                      title="Remove from favourites"
                    >
                      ⭐
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Favourite Beans */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>🫘</span> Coffee Beans
          </h2>
          
          {beans.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center">
              <p className="text-zinc-400">No favourite beans yet</p>
              <p className="text-sm text-zinc-500 mt-2">
                Click the ☆ next to a bean in the grind finder to save it here
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {beans.map((fav) => (
                <div
                  key={fav.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 hover:border-zinc-700 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{fav.beans.name}</h3>
                      <p className="text-sm text-zinc-400 mt-1">{fav.beans.roaster}</p>
                      {fav.beans.roast_level && (
                        <p className="text-xs text-zinc-500 mt-1">{fav.beans.roast_level}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeBean(fav.bean_id)}
                      className="text-xl hover:scale-110 transition ml-2"
                      title="Remove from favourites"
                    >
                      ⭐
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-700 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition"
          >
            ← Back to Grind Finder
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function FavouritesPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#0F1115] text-[#F4F4F2] grid place-items-center">
        <div className="text-[#C48A5A] text-2xl">☕︎</div>
      </main>
    }>
      <FavouritesContent />
    </Suspense>
  );
}
