"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SignUpModal from "@/components/SignUpModal";

type MachineRow = {
  id: string;
  name: string;
  min_grind?: number | null;
  max_grind?: number | null;
  espresso_min?: number | null;
  espresso_max?: number | null;
};

type BeanRow = {
  id: string;
  name: string;
  roaster: string;
  roast_level?: string | null;
};

export default function GrindFinder() {
  const router = useRouter();

  const [machines, setMachines] = useState<MachineRow[]>([]);
  const [beans, setBeans] = useState<BeanRow[]>([]);

  const [machineId, setMachineId] = useState("");
  const [roaster, setRoaster] = useState("");
  const [beanId, setBeanId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [remainingFree, setRemainingFree] = useState<number | null>(2);
  const [guestUsesLeft, setGuestUsesLeft] = useState<number>(2);

  const [recommendation, setRecommendation] = useState<{
    grind: string;
    reasoning: string;
  } | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // My Machine state
  const [defaultMachineId, setDefaultMachineId] = useState<string | null>(null);
  const [savingMachine, setSavingMachine] = useState(false);

  // Feedback state
  const [feedback, setFeedback] = useState<string | null>(null);
  const [adjustedGrind, setAdjustedGrind] = useState<string | null>(null);
  const [savingGrind, setSavingGrind] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [machinesRes, beansRes] = await Promise.all([
          supabase.from("machines").select("*").order("name"),
          supabase.from("beans").select("id, name, roaster, roast_level").order("name"),
        ]);

        if (!isMounted) return;

        if (machinesRes.error) throw machinesRes.error;
        if (beansRes.error) throw beansRes.error;

        setMachines(machinesRes.data ?? []);
        setBeans(beansRes.data ?? []);

        const { data: userRes } = await supabase.auth.getUser();
        const user = userRes.user;

        if (!isMounted) return;

        if (user) {
          setUserEmail(user.email ?? null);

          // Check Pro status using API
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
                const isProUser = !!data.isPro;
                
                if (isMounted) {
                  setIsPro(isProUser);
                  
                  if (!isProUser) {
                    setRemainingFree(data.remaining ?? 2);
                  }

                  // Load default machine for Pro users
                  if (isProUser) {
                    await loadDefaultMachine(token);
                  }
                }
              }
            } catch (error) {
              console.error("Failed to check Pro status:", error);
            }
          }
        } else {
          const used = parseInt(localStorage.getItem("guest_uses") || "0");
          setGuestUsesLeft(Math.max(0, 2 - used));
        }

        const { data: sub } = supabase.auth.onAuthStateChange((_, session) => {
          if (!isMounted) return;
          setUserEmail(session?.user?.email ?? null);
          setRemainingFree(null);
          setRecommendation(null);
          setLimitReached(false);
        });

        return () => {
          isMounted = false;
          sub.subscription.unsubscribe();
        };
      } catch (e: any) {
        if (isMounted) {
          setError(e.message ?? "Failed to load data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  async function loadDefaultMachine(token: string) {
    try {
      const res = await fetch("/api/my-machine", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.machineId) {
          setDefaultMachineId(data.machineId);
          setMachineId(data.machineId);
        }
      }
    } catch (error) {
      console.error("Failed to load default machine:", error);
    }
  }

  async function saveAsMyMachine() {
    if (!isPro || !machineId || savingMachine) return;

    setSavingMachine(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) return;

      const res = await fetch("/api/my-machine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ machineId }),
      });

      if (res.ok) {
        setDefaultMachineId(machineId);
      }
    } catch (error) {
      console.error("Failed to save machine:", error);
    } finally {
      setSavingMachine(false);
    }
  }

  async function clearMyMachine() {
    if (!isPro || savingMachine) return;

    setSavingMachine(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) return;

      const res = await fetch("/api/my-machine", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setDefaultMachineId(null);
      }
    } catch (error) {
      console.error("Failed to clear machine:", error);
    } finally {
      setSavingMachine(false);
    }
  }

  function handleFeedback(type: string) {
    if (!recommendation || !machine) return;
    
    const currentGrind = parseInt(recommendation.grind);
    let newGrind = currentGrind;
    let advice = "";
    
    switch(type) {
      case "too_bitter":
        newGrind = currentGrind + 1;
        advice = "Grind coarser to reduce over-extraction. Try " + newGrind;
        break;
      case "too_sour":
        newGrind = currentGrind - 1;
        advice = "Grind finer to increase extraction. Try " + newGrind;
        break;
      case "too_fast":
        newGrind = currentGrind - 1;
        advice = "Grind finer to slow down the shot. Try " + newGrind;
        break;
      case "too_slow":
        newGrind = currentGrind + 1;
        advice = "Grind coarser to speed up the shot. Try " + newGrind;
        break;
      case "perfect":
        advice = "Great! This setting works well for you.";
        break;
    }
    
    // Keep within machine limits
    if (machine.min_grind && newGrind < machine.min_grind) {
      newGrind = machine.min_grind;
    }
    if (machine.max_grind && newGrind > machine.max_grind) {
      newGrind = machine.max_grind;
    }
    
    setFeedback(advice);
    if (type !== "perfect") {
      setAdjustedGrind(newGrind.toString());
    }
  }

  async function saveGrindSetting() {
    if (!isPro || !machineId || !beanId || !recommendation || savingGrind) return;
    
    setSavingGrind(true);
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      
      if (!token) return;
      
      const grindToSave = adjustedGrind || recommendation.grind;
      
      // TODO: Create API route to save grind settings
      console.log("Saving grind:", grindToSave, "for machine:", machineId, "bean:", beanId);
      
      // For now, just show success
      setFeedback("✓ Saved! This grind will be suggested next time.");
    } catch (error) {
      console.error("Failed to save grind:", error);
    } finally {
      setSavingGrind(false);
    }
  }

  const roasters = useMemo(
    () => Array.from(new Set(beans.map((b) => b.roaster))).sort(),
    [beans]
  );

  const filteredBeans = useMemo(
    () => beans.filter((b) => b.roaster === roaster),
    [beans, roaster]
  );

  const machine = machines.find((m) => m.id === machineId) ?? null;
  const bean = beans.find((b) => b.id === beanId) ?? null;

  const resetRecommendation = useCallback(() => {
    setRecommendation(null);
    setLimitReached(false);
    setFeedback(null);
    setAdjustedGrind(null);
  }, []);

  useEffect(() => {
    resetRecommendation();
  }, [machineId, roaster, beanId, resetRecommendation]);

  const canGenerate = !!machine && !!bean && !generating;

  async function handleGenerateRecommendation() {
    if (!canGenerate) return;

    setError(null);
    setGenerating(true);
    setLimitReached(false);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (token) {
        const res = await fetch("/api/generate-grind", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            machineId,
            beanId,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.limitReached) {
            setLimitReached(true);
            setRemainingFree(0);
            setIsPro(!!data.isPro);
            return;
          }
          throw new Error(data.error || "Failed to generate recommendation");
        }

        setRecommendation({
          grind: data.grind.toString(),
          reasoning: data.reasoning,
        });
        setRemainingFree(data.remaining);
        setIsPro(!!data.isPro);
      } else {
        const used = parseInt(localStorage.getItem("guest_uses") || "0");
        
        if (used >= 2) {
          setLimitReached(true);
          setGuestUsesLeft(0);
          return;
        }

        let grindValue: number;
        
        if (machine.min_grind && machine.max_grind) {
          const range = machine.max_grind - machine.min_grind;
          
          if (bean.roast_level?.toLowerCase().includes("light")) {
            grindValue = Math.round(machine.min_grind + (range * 0.4));
          } else if (bean.roast_level?.toLowerCase().includes("dark")) {
            grindValue = Math.round(machine.min_grind + (range * 0.6));
          } else {
            grindValue = Math.round(machine.min_grind + (range * 0.5));
          }
        } else {
          grindValue = 5;
        }

        setRecommendation({
          grind: grindValue.toString(),
          reasoning: `For ${bean.name} (${bean.roast_level || "medium roast"}) on your ${machine.name}, start at ${grindValue}. ${
            bean.roast_level?.toLowerCase().includes("light")
              ? "Light roasts extract slower, so we have set this finer to help extraction."
              : bean.roast_level?.toLowerCase().includes("dark")
              ? "Dark roasts extract faster, so we have set this slightly coarser."
              : "This is a good middle ground for medium roasts."
          } Adjust finer if too sour or fast, coarser if too bitter or slow.`,
        });

        localStorage.setItem("guest_uses", String(used + 1));
        setGuestUsesLeft(Math.max(0, 1 - used));
      }
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-400">
        Loading coffee data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl mt-6 rounded-xl border border-red-900 bg-zinc-950 p-4 text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            Find Your Perfect Grind
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Get personalised grind settings for your setup
          </p>
        </div>

        <div className="text-right text-xs">
          {userEmail ? (
            <>
              <div className="text-zinc-400">Signed in</div>
              <div className="text-zinc-300 truncate max-w-[180px]">{userEmail}</div>
              <div className="mt-1">
                {isPro ? (
                  <span className="inline-flex items-center rounded-full border border-amber-700/35 px-2 py-0.5 text-amber-200">
                    Pro
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-zinc-700 px-2 py-0.5 text-zinc-300">
                    Free
                  </span>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => router.push("/")}
              className="rounded-lg border border-zinc-700 px-3 py-2 text-zinc-200 hover:bg-zinc-900 transition"
            >
              Log in
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Machine selector with My Machine button */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <select
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white disabled:opacity-50"
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              disabled={generating}
            >
              <option value="">Select coffee machine</option>
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                  {defaultMachineId === m.id ? " ⭐" : ""}
                </option>
              ))}
            </select>
            
            {isPro && machineId && (
              <>
                {defaultMachineId === machineId ? (
                  <button
                    onClick={clearMyMachine}
                    disabled={savingMachine}
                    className="shrink-0 rounded-xl border border-zinc-700 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 transition disabled:opacity-50"
                    title="Clear my machine"
                  >
                    Clear
                  </button>
                ) : (
                  <button
                    onClick={saveAsMyMachine}
                    disabled={savingMachine}
                    className="shrink-0 rounded-xl bg-amber-700/20 border border-amber-700/35 px-4 py-3 text-sm text-amber-200 hover:bg-amber-700/30 transition disabled:opacity-50"
                    title="Save as my machine"
                  >
                    {savingMachine ? "Saving..." : "Set as Mine"}
                  </button>
                )}
              </>
            )}
          </div>
          
          {isPro && defaultMachineId === machineId && (
            <p className="text-xs text-amber-200/70 pl-4">
              ⭐ This is your default machine
            </p>
          )}
        </div>

        <select
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white disabled:opacity-50"
          value={roaster}
          onChange={(e) => {
            setRoaster(e.target.value);
            setBeanId("");
          }}
          disabled={generating}
        >
          <option value="">Select roaster</option>
          {roasters.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white disabled:opacity-50"
          value={beanId}
          onChange={(e) => setBeanId(e.target.value)}
          disabled={!roaster || generating}
        >
          <option value="">{roaster ? "Select bean" : "Select roaster first"}</option>
          {filteredBeans.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleGenerateRecommendation}
            disabled={!canGenerate}
            className="flex-1 rounded-xl bg-amber-700 px-4 py-3 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-3"
          >
            {generating && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {generating ? "Analyzing your beans..." : "Get Recommended Grind Settings"}
          </button>

          {!userEmail && !isPro && (
            <div className="shrink-0 text-right">
              <p className="text-xs text-zinc-400">Free trials</p>
              <p className="text-xs text-amber-200">
                {guestUsesLeft}/2 left
              </p>
            </div>
          )}

          {userEmail && !isPro && (
            <div className="shrink-0 text-right">
              <p className="text-xs text-zinc-400">Free this month</p>
              <p className="text-xs text-amber-200">
                {remainingFree === null ? "—" : `${remainingFree}/2 left`}
              </p>
            </div>
          )}
        </div>

        {limitReached && !userEmail && (
          <div className="rounded-xl border border-amber-700/35 bg-zinc-950 p-4">
            <p className="text-sm font-medium text-white">Free trials used</p>
            <p className="mt-1 text-sm text-zinc-400">
              Upgrade to Pro for unlimited grind recommendations.
            </p>
            <div className="mt-3">
              <button
                onClick={() => setShowSignUpModal(true)}
                className="w-full rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 transition"
              >
                Go Pro - £3.99/mo
              </button>
            </div>
          </div>
        )}

        {limitReached && userEmail && (
          <div className="rounded-xl border border-amber-700/35 bg-zinc-950 p-4">
            <p className="text-sm font-medium text-white">Monthly limit reached</p>
            <p className="mt-1 text-sm text-zinc-400">
              You have used your 2 free recommendations this month. Upgrade to Pro for unlimited access.
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-zinc-500">Resets next month</span>
              <button
                onClick={() => router.push("/pro")}
                className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 transition"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        )}
      </div>

      {recommendation && (
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-700/35 bg-zinc-950 p-5 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-400">Recommended Grind</p>
              <p className="text-3xl font-semibold text-amber-200 mt-1">
                {adjustedGrind || recommendation.grind}
              </p>
              {adjustedGrind && (
                <p className="text-sm text-zinc-400 mt-1">
                  Adjusted from {recommendation.grind}
                </p>
              )}
            </div>
            
            {/* Format the AI response with sections */}
            <div className="text-sm text-zinc-300 leading-relaxed space-y-4">
              {recommendation.reasoning.split(/\n\n+/).map((section, idx) => {
                // Check if section has bullets
                if (section.includes('•')) {
                  const [header, ...bullets] = section.split('•').filter((s: string) => s.trim());
                  return (
                    <div key={idx} className="space-y-2">
                      {header && <p className="font-semibold text-white">{header.trim()}</p>}
                      <ul className="space-y-1.5 pl-1">
                        {bullets.map((bullet: string, bidx: number) => (
                          <li key={bidx} className="flex gap-2">
                            <span className="text-amber-400 shrink-0">•</span>
                            <span>{bullet.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                
                // Bold any section headers (text ending with :)
                const parts = section.split(/([A-Z][A-Z\s]+:)/);
                return (
                  <p key={idx}>
                    {parts.map((part: string, pidx: number) => {
                      if (part.match(/^[A-Z][A-Z\s]+:$/)) {
                        return <strong key={pidx} className="text-white font-semibold">{part} </strong>;
                      }
                      return <span key={pidx}>{part}</span>;
                    })}
                  </p>
                );
              })}
            </div>
            
            <div className="pt-3 border-t border-zinc-800 text-xs text-zinc-500">
              Machine range: {machine?.min_grind ?? "?"} - {machine?.max_grind ?? "?"}
              {" | "}
              Espresso: {machine?.espresso_min ?? "?"} - {machine?.espresso_max ?? "?"}
            </div>
          </div>
          
          {/* Pro feedback section */}
          {isPro && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-sm font-medium text-white mb-3">How does it taste?</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                <button
                  onClick={() => handleFeedback("too_bitter")}
                  className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition"
                >
                  Too Bitter
                </button>
                <button
                  onClick={() => handleFeedback("too_sour")}
                  className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition"
                >
                  Too Sour
                </button>
                <button
                  onClick={() => handleFeedback("too_fast")}
                  className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition"
                >
                  Too Fast
                </button>
                <button
                  onClick={() => handleFeedback("too_slow")}
                  className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition"
                >
                  Too Slow
                </button>
                <button
                  onClick={() => handleFeedback("perfect")}
                  className="rounded-lg border border-amber-700/35 bg-amber-700/10 px-3 py-2 text-sm text-amber-200 hover:bg-amber-700/20 transition"
                >
                  Just Right ✓
                </button>
              </div>
              
              {feedback && (
                <div className="mt-4 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <p className="text-sm text-zinc-300">{feedback}</p>
                  {adjustedGrind && (
                    <button
                      onClick={saveGrindSetting}
                      disabled={savingGrind}
                      className="mt-3 w-full rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50 transition"
                    >
                      {savingGrind ? "Saving..." : "Save This Setting"}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {recommendation && !isPro && (
        <div className="rounded-xl border border-amber-700/35 bg-zinc-950 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white font-medium">Dialmycoffee Pro</p>
              <p className="text-sm text-zinc-400">Unlimited recommendations and advanced features</p>
            </div>
            <p className="text-sm text-white font-medium">
              £3.99<span className="text-zinc-400">/mo</span>
            </p>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-zinc-300">
            <li>- Unlimited grind recommendations</li>
            <li>- Advanced troubleshooting guidance</li>
            <li>- Save your default coffee machine</li>
            <li>- Dial-in feedback system</li>
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-zinc-500">Cancel anytime</span>
            <button
              onClick={() => userEmail ? router.push("/pro") : setShowSignUpModal(true)}
              className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 transition"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <p className="text-sm font-medium text-white">Cannot find your machine or bean?</p>
        <p className="mt-1 text-sm text-zinc-400">Email us and we will add it within 24 hours.</p>
        <div className="mt-3">
          <a
            href="mailto:bestcoffeeaccessories@outlook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg border border-amber-700/35 px-4 py-2 text-sm text-amber-200 hover:bg-amber-700/10 transition cursor-pointer"
          >
            Email us
          </a>
        </div>
      </div>

      {/* Sign-up Modal */}
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSuccess={() => {
          setShowSignUpModal(false);
          router.push("/pro");
        }}
      />
    </div>
  );
}
