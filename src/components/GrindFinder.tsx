"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SignUpModal from "@/components/SignUpModal";
import type { Recommendation, CalibrationResponse } from "@/lib/types";

type MachineRow = {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  min_grind?: number | null;
  max_grind?: number | null;
  espresso_min?: number | null;
  espresso_max?: number | null;
  has_builtin_grinder?: boolean;
  supports_temp_control?: boolean;
  supports_pressure_control?: boolean;
  supports_preinfusion?: boolean;
};

type BeanRow = {
  id: string;
  name: string;
  roaster: string;
  roast_level?: string | null;
};

type CountryRow = { id: string; iso2: string; name: string; region?: string };
type RoasteryRow = { id: string; name: string; city?: string; is_popular: boolean; country_id: string };
type GrinderRow = { id: string; brand: string; model: string; adjustment_type: string; scale_min: number; scale_max: number; units: string };

const LOADING_STEPS = [
  "Checking your coffee machine\u2026",
  "Reading bean and roast details\u2026",
  "Estimating extraction parameters\u2026",
  "Calibrating grind range\u2026",
  "Comparing against similar brews\u2026",
  "Finalising your recommended settings\u2026"
];

const STEP_INTERVAL = 900;
const MIN_LOADING_TIME = 800;
const TIMER_INTERVAL = 100;

const ROAST_LEVELS = [
  { value: "light", label: "Light" },
  { value: "medium", label: "Medium" },
  { value: "medium_dark", label: "Medium-Dark" },
  { value: "dark", label: "Dark" },
];

export default function GrindFinder() {
  const router = useRouter();

  // Data lists
  const [machines, setMachines] = useState<MachineRow[]>([]);
  const [beans, setBeans] = useState<BeanRow[]>([]);
  const [countries, setCountries] = useState<CountryRow[]>([]);
  const [roasteries, setRoasteries] = useState<RoasteryRow[]>([]);
  const [grinders, setGrinders] = useState<GrinderRow[]>([]);

  // Selection state
  const [machineId, setMachineId] = useState("");
  const [grinderId, setGrinderId] = useState("");
  const [beanSource, setBeanSource] = useState<"database" | "manual">("database");
  const [roaster, setRoaster] = useState("");
  const [beanId, setBeanId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [roasteryId, setRoasteryId] = useState("");
  const [manualBeanName, setManualBeanName] = useState("");
  const [roastLevel, setRoastLevel] = useState("");
  const [roastedOn, setRoastedOn] = useState("");
  const [daysOffRoast, setDaysOffRoast] = useState<number | null>(null);
  const [roastDateMode, setRoastDateMode] = useState<"date" | "slider">("date");

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const loadingStartTime = useRef<number>(0);
  const stepIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auth state
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [remainingFree, setRemainingFree] = useState<number | null>(2);
  const [guestUsesLeft, setGuestUsesLeft] = useState<number>(2);

  // Recommendation state
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [legacyRecommendation, setLegacyRecommendation] = useState<{ grind: string; reasoning: string } | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // My Machine state
  const [defaultMachineId, setDefaultMachineId] = useState<string | null>(null);
  const [savingMachine, setSavingMachine] = useState(false);

  // Calibration state
  const [showCalibration, setShowCalibration] = useState(false);
  const [calibrationShotTime, setCalibrationShotTime] = useState("");
  const [calibrationYield, setCalibrationYield] = useState("");
  const [calibrationTaste, setCalibrationTaste] = useState<string[]>([]);
  const [calibrationVisual, setCalibrationVisual] = useState<string[]>([]);
  const [calibrationResult, setCalibrationResult] = useState<CalibrationResponse | null>(null);
  const [calibrating, setCalibrating] = useState(false);
  const [calibrationIteration, setCalibrationIteration] = useState(0);

  // Save dial-in state
  const [savingDialIn, setSavingDialIn] = useState(false);
  const [savedDialIn, setSavedDialIn] = useState(false);

  // Roastery add-new state
  const [showAddRoastery, setShowAddRoastery] = useState(false);
  const [newRoasteryName, setNewRoasteryName] = useState("");

  const cleanupLoading = useCallback(() => {
    if (stepIntervalRef.current) { clearInterval(stepIntervalRef.current); stepIntervalRef.current = null; }
    if (timerIntervalRef.current) { clearInterval(timerIntervalRef.current); timerIntervalRef.current = null; }
    if (abortControllerRef.current) { abortControllerRef.current.abort(); abortControllerRef.current = null; }
  }, []);

  // Load initial data
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch machines from new API or fall back to Supabase direct
        const [machinesRes, beansRes] = await Promise.all([
          supabase.from("machines").select("*").order("name"),
          supabase.from("beans").select("id, name, roaster, roast_level").order("name"),
        ]);

        if (!isMounted) return;
        if (machinesRes.error) throw machinesRes.error;
        if (beansRes.error) throw beansRes.error;

        setMachines(machinesRes.data ?? []);
        setBeans(beansRes.data ?? []);

        // Fetch new tables (non-blocking)
        Promise.all([
          fetch("/api/countries").then(r => r.ok ? r.json() : null).catch(() => null),
          fetch("/api/grinders").then(r => r.ok ? r.json() : null).catch(() => null),
        ]).then(([countriesData, grindersData]) => {
          if (!isMounted) return;
          if (countriesData?.countries) setCountries(countriesData.countries);
          if (grindersData?.grinders) setGrinders(grindersData.grinders);
        });

        const { data: userRes } = await supabase.auth.getUser();
        const user = userRes.user;
        if (!isMounted) return;

        if (user) {
          setUserEmail(user.email ?? null);
          const { data: sessionData } = await supabase.auth.getSession();
          const token = sessionData.session?.access_token;

          if (token) {
            try {
              const res = await fetch("/api/get-subscription-status", {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (res.ok) {
                const data = await res.json();
                const isProUser = !!data.isPro;
                if (isMounted) {
                  setIsPro(isProUser);
                  if (!isProUser) setRemainingFree(data.remaining ?? 2);
                  if (isProUser) await loadDefaultMachine(token);
                }
              }
            } catch (err) {
              console.error("Failed to check Pro status:", err);
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
          setLegacyRecommendation(null);
          setLimitReached(false);
        });

        return () => { isMounted = false; sub.subscription.unsubscribe(); };
      } catch (e: unknown) {
        if (isMounted) setError(e instanceof Error ? e.message : "Failed to load data");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => { isMounted = false; cleanupLoading(); };
  }, [cleanupLoading]);

  // Fetch roasteries when country changes
  useEffect(() => {
    if (!countryId) { setRoasteries([]); return; }
    fetch(`/api/roasteries?country_id=${countryId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.roasteries) setRoasteries(data.roasteries); })
      .catch(() => {});
  }, [countryId]);

  // Compute days off roast from date
  useEffect(() => {
    if (roastedOn && roastDateMode === "date") {
      const diff = Math.floor((Date.now() - new Date(roastedOn).getTime()) / (1000 * 60 * 60 * 24));
      setDaysOffRoast(Math.max(0, diff));
    }
  }, [roastedOn, roastDateMode]);

  async function loadDefaultMachine(token: string) {
    try {
      const res = await fetch("/api/my-machine", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        if (data.machineId) { setDefaultMachineId(data.machineId); setMachineId(data.machineId); }
      }
    } catch (err) { console.error("Failed to load default machine:", err); }
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ machineId }),
      });
      if (res.ok) setDefaultMachineId(machineId);
    } catch (err) { console.error("Failed to save machine:", err); }
    finally { setSavingMachine(false); }
  }

  async function clearMyMachine() {
    if (!isPro || savingMachine) return;
    setSavingMachine(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) return;
      const res = await fetch("/api/my-machine", { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setDefaultMachineId(null);
    } catch (err) { console.error("Failed to clear machine:", err); }
    finally { setSavingMachine(false); }
  }

  async function submitCalibration() {
    if (!recommendation || !machineId || calibrating) return;
    setCalibrating(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) return;

      const res = await fetch("/api/calibrate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          machineId,
          recommendation,
          calibration: {
            shot_time_s: calibrationShotTime ? parseFloat(calibrationShotTime) : undefined,
            actual_yield_g: calibrationYield ? parseFloat(calibrationYield) : undefined,
            taste: calibrationTaste.length > 0 ? calibrationTaste : ["balanced"],
            visual_issues: calibrationVisual.length > 0 ? calibrationVisual : ["none"],
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCalibrationResult(data.calibration);
        setCalibrationIteration(data.iteration);
      }
    } catch (err) { console.error("Calibration error:", err); }
    finally { setCalibrating(false); }
  }

  async function saveDialIn(markSuccessful: boolean) {
    if (!recommendation || !machineId || savingDialIn) return;
    setSavingDialIn(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) return;

      const beanName = beanSource === "database"
        ? (beans.find(b => b.id === beanId)?.name || "Unknown")
        : manualBeanName;

      const res = await fetch("/api/dial-ins", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          machine_id: machineId,
          grinder_id: grinderId || null,
          roastery_id: roasteryId || null,
          bean_name: beanName,
          roast_level: roastLevel || (beans.find(b => b.id === beanId)?.roast_level || "medium"),
          roasted_on: roastedOn || null,
          days_off_roast_at_save: daysOffRoast,
          dose_g: recommendation.target.dose_g,
          yield_g: recommendation.target.yield_g,
          time_s: recommendation.target.time_s,
          grind_setting: String(recommendation.grinder.setting_value),
          temp_c: recommendation.target.temp_c || null,
          is_successful: markSuccessful,
        }),
      });

      if (res.ok) setSavedDialIn(true);
    } catch (err) { console.error("Save dial-in error:", err); }
    finally { setSavingDialIn(false); }
  }

  async function submitNewRoastery() {
    if (!newRoasteryName || !countryId) return;
    try {
      const res = await fetch("/api/roasteries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newRoasteryName, country_id: countryId }),
      });
      if (res.ok) {
        const data = await res.json();
        setRoasteries(prev => [...prev, data.roastery]);
        setRoasteryId(data.roastery.id);
        setShowAddRoastery(false);
        setNewRoasteryName("");
      }
    } catch (err) { console.error("Add roastery error:", err); }
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
    setLegacyRecommendation(null);
    setLimitReached(false);
    setShowCalibration(false);
    setCalibrationResult(null);
    setCalibrationIteration(0);
    setSavedDialIn(false);
    setCalibrationShotTime("");
    setCalibrationYield("");
    setCalibrationTaste([]);
    setCalibrationVisual([]);
  }, []);

  useEffect(() => { resetRecommendation(); }, [machineId, roaster, beanId, roastLevel, roastedOn, resetRecommendation]);

  const canGenerate = !!machine && (!!bean || !!manualBeanName) && !generating && !isLoading;

  async function handleGenerateRecommendation() {
    if (!canGenerate) return;
    cleanupLoading();
    setError(null);
    setGenerating(true);
    setIsLoading(true);
    setLimitReached(false);
    setLoadingStepIndex(0);
    setStatusText(LOADING_STEPS[0]);
    setElapsedTime(0);
    loadingStartTime.current = Date.now();
    abortControllerRef.current = new AbortController();

    let currentStep = 0;
    stepIntervalRef.current = setInterval(() => {
      currentStep = (currentStep + 1) % LOADING_STEPS.length;
      setLoadingStepIndex(currentStep);
      setStatusText(LOADING_STEPS[currentStep]);
    }, STEP_INTERVAL);

    timerIntervalRef.current = setInterval(() => {
      setElapsedTime((Date.now() - loadingStartTime.current) / 1000);
    }, TIMER_INTERVAL);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (token) {
        const res = await fetch("/api/generate-grind", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            machineId,
            beanId: beanSource === "database" ? beanId : undefined,
            bean_name: beanSource === "manual" ? manualBeanName : undefined,
            roast_level: roastLevel || undefined,
            roasted_on: roastedOn || undefined,
            days_off_roast: daysOffRoast ?? undefined,
            grinder_id: grinderId || undefined,
            roastery_id: roasteryId || undefined,
          }),
          signal: abortControllerRef.current?.signal,
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.limitReached) {
            const elapsed = Date.now() - loadingStartTime.current;
            if (elapsed < MIN_LOADING_TIME) await new Promise(r => setTimeout(r, MIN_LOADING_TIME - elapsed));
            cleanupLoading();
            setIsLoading(false);
            setLimitReached(true);
            setRemainingFree(0);
            setIsPro(!!data.isPro);
            setGenerating(false);
            return;
          }
          throw new Error(data.error || "Failed to generate recommendation");
        }

        const elapsed = Date.now() - loadingStartTime.current;
        if (elapsed < MIN_LOADING_TIME) await new Promise(r => setTimeout(r, MIN_LOADING_TIME - elapsed));

        // Handle structured recommendation
        if (data.recommendation) {
          setRecommendation(data.recommendation);
        }

        // Keep legacy format for backward compat
        setLegacyRecommendation({
          grind: String(data.grind),
          reasoning: data.reasoning,
        });

        setRemainingFree(data.remaining);
        setIsPro(!!data.isPro);
      } else {
        // Guest flow
        const used = parseInt(localStorage.getItem("guest_uses") || "0");
        if (used >= 2) {
          const elapsed = Date.now() - loadingStartTime.current;
          if (elapsed < MIN_LOADING_TIME) await new Promise(r => setTimeout(r, MIN_LOADING_TIME - elapsed));
          cleanupLoading();
          setIsLoading(false);
          setLimitReached(true);
          setGuestUsesLeft(0);
          setGenerating(false);
          return;
        }

        let grindValue: number;
        if (machine!.min_grind && machine!.max_grind) {
          const range = machine!.max_grind - machine!.min_grind;
          const rl = (bean?.roast_level || roastLevel || "medium").toLowerCase();
          if (rl.includes("light")) grindValue = Math.round(machine!.min_grind + range * 0.4);
          else if (rl.includes("dark")) grindValue = Math.round(machine!.min_grind + range * 0.6);
          else grindValue = Math.round(machine!.min_grind + range * 0.5);
        } else {
          grindValue = 5;
        }

        const elapsed = Date.now() - loadingStartTime.current;
        if (elapsed < MIN_LOADING_TIME) await new Promise(r => setTimeout(r, MIN_LOADING_TIME - elapsed));

        const beanName = bean?.name || manualBeanName || "your bean";
        const rl = bean?.roast_level || roastLevel || "medium roast";
        setLegacyRecommendation({
          grind: grindValue.toString(),
          reasoning: `For ${beanName} (${rl}) on your ${machine!.name}, start at ${grindValue}. Adjust finer if too sour or fast, coarser if too bitter or slow.`,
        });

        localStorage.setItem("guest_uses", String(used + 1));
        setGuestUsesLeft(Math.max(0, 1 - used));
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "AbortError") return;
      const elapsed = Date.now() - loadingStartTime.current;
      if (elapsed < MIN_LOADING_TIME) await new Promise(r => setTimeout(r, MIN_LOADING_TIME - elapsed));
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      cleanupLoading();
      setIsLoading(false);
      setGenerating(false);
    }
  }

  // Roast freshness indicator
  function getRoastFreshnessLabel(): { label: string; color: string } | null {
    if (daysOffRoast === null) return null;
    if (daysOffRoast <= 4) return { label: `Very Fresh (${daysOffRoast}d) \u2014 beans still degassing`, color: "text-yellow-400" };
    if (daysOffRoast <= 7) return { label: `Resting (${daysOffRoast}d) \u2014 approaching peak`, color: "text-blue-400" };
    if (daysOffRoast <= 21) return { label: `Peak Freshness (${daysOffRoast}d) \u2014 ideal for espresso`, color: "text-green-400" };
    if (daysOffRoast <= 35) return { label: `Fading (${daysOffRoast}d) \u2014 grind finer to compensate`, color: "text-orange-400" };
    return { label: `Stale (${daysOffRoast}d) \u2014 consider fresher beans`, color: "text-red-400" };
  }

  const freshness = getRoastFreshnessLabel();

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-400">
        Loading coffee data...
      </div>
    );
  }

  if (error && !recommendation && !legacyRecommendation) {
    return (
      <div className="mx-auto max-w-2xl mt-6 rounded-xl border border-red-900 bg-zinc-950 p-4 text-red-300">
        {error}
        <button onClick={() => { setError(null); }} className="mt-3 block w-full rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition">
          Try Again
        </button>
      </div>
    );
  }

  const grindDisplay = recommendation
    ? String(recommendation.grinder.setting_value)
    : legacyRecommendation?.grind || null;

  return (
    <>
      <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6" aria-busy={isLoading}>
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">Find Your Perfect Grind</h2>
            <p className="mt-1 text-sm text-zinc-400">Get personalised grind settings for your setup</p>
          </div>
          <div className="text-right text-xs">
            {userEmail ? (
              <>
                <div className="text-zinc-400">Signed in</div>
                <div className="text-zinc-300 truncate max-w-[180px]">{userEmail}</div>
                <div className="mt-1">
                  {isPro ? (
                    <span className="inline-flex items-center rounded-full border border-amber-700/35 px-2 py-0.5 text-amber-200">Pro</span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-zinc-700 px-2 py-0.5 text-zinc-300">Free</span>
                  )}
                </div>
              </>
            ) : (
              <button onClick={() => router.push("/")} className="rounded-lg border border-zinc-700 px-3 py-2 text-zinc-200 hover:bg-zinc-900 transition">Log in</button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Machine selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Machine</label>
            {isPro && machineId ? (
              <div className="flex items-center gap-2">
                <select className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white disabled:opacity-50" value={machineId} onChange={e => setMachineId(e.target.value)} disabled={generating || isLoading}>
                  <option value="">Select coffee machine</option>
                  {machines.map(m => <option key={m.id} value={m.id}>{m.name}{defaultMachineId === m.id ? " \u2B50" : ""}</option>)}
                </select>
                {defaultMachineId === machineId ? (
                  <button onClick={clearMyMachine} disabled={savingMachine} className="shrink-0 rounded-xl border border-zinc-700 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 transition disabled:opacity-50" title="Clear my machine">Clear</button>
                ) : (
                  <button onClick={saveAsMyMachine} disabled={savingMachine} className="shrink-0 rounded-xl bg-amber-700/20 border border-amber-700/35 px-4 py-3 text-sm text-amber-200 hover:bg-amber-700/30 transition disabled:opacity-50">{savingMachine ? "Saving..." : "Set as Mine"}</button>
                )}
              </div>
            ) : (
              <select className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white disabled:opacity-50" value={machineId} onChange={e => setMachineId(e.target.value)} disabled={generating || isLoading}>
                <option value="">Select coffee machine</option>
                {machines.map(m => <option key={m.id} value={m.id}>{m.name}{defaultMachineId === m.id ? " \u2B50" : ""}</option>)}
              </select>
            )}
            {isPro && defaultMachineId === machineId && machineId && (
              <p className="text-xs text-amber-200/70 pl-4">This is your default machine</p>
            )}
          </div>

          {/* Grinder selector (optional, for external grinder machines) */}
          {machine && !machine.has_builtin_grinder && grinders.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Grinder (optional)</label>
              <select className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white disabled:opacity-50" value={grinderId} onChange={e => setGrinderId(e.target.value)} disabled={generating || isLoading}>
                <option value="">No external grinder selected</option>
                {grinders.map(g => <option key={g.id} value={g.id}>{g.brand} {g.model}</option>)}
              </select>
            </div>
          )}

          {/* Bean source toggle */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Coffee Bean</label>
            <div className="flex gap-2">
              <button onClick={() => { setBeanSource("database"); setManualBeanName(""); setCountryId(""); setRoasteryId(""); }} className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${beanSource === "database" ? "bg-amber-700/20 border border-amber-700/35 text-amber-200" : "border border-zinc-700 text-zinc-400 hover:text-zinc-200"}`}>
                From our database
              </button>
              <button onClick={() => { setBeanSource("manual"); setBeanId(""); setRoaster(""); }} className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${beanSource === "manual" ? "bg-amber-700/20 border border-amber-700/35 text-amber-200" : "border border-zinc-700 text-zinc-400 hover:text-zinc-200"}`}>
                Enter manually
              </button>
            </div>
          </div>

          {beanSource === "database" ? (
            <>
              <select className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white disabled:opacity-50" value={roaster} onChange={e => { setRoaster(e.target.value); setBeanId(""); }} disabled={generating || isLoading}>
                <option value="">Select roaster</option>
                {roasters.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white disabled:opacity-50" value={beanId} onChange={e => setBeanId(e.target.value)} disabled={!roaster || generating || isLoading}>
                <option value="">{roaster ? "Select bean" : "Select roaster first"}</option>
                {filteredBeans.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </>
          ) : (
            <>
              {/* Country + Roastery flow */}
              {countries.length > 0 && (
                <div className="space-y-3">
                  <select className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white disabled:opacity-50" value={countryId} onChange={e => { setCountryId(e.target.value); setRoasteryId(""); }} disabled={generating || isLoading}>
                    <option value="">Select country (optional)</option>
                    {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>

                  {countryId && (
                    <>
                      <select className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white disabled:opacity-50" value={roasteryId} onChange={e => setRoasteryId(e.target.value)} disabled={generating || isLoading}>
                        <option value="">Select roastery (optional)</option>
                        {roasteries.map(r => <option key={r.id} value={r.id}>{r.name}{r.city ? ` - ${r.city}` : ""}{r.is_popular ? " \u2605" : ""}</option>)}
                      </select>
                      <button onClick={() => setShowAddRoastery(true)} className="text-xs text-amber-200/70 hover:text-amber-200 transition">
                        Roastery not listed? Add it
                      </button>
                      {showAddRoastery && (
                        <div className="flex gap-2">
                          <input type="text" value={newRoasteryName} onChange={e => setNewRoasteryName(e.target.value)} placeholder="Roastery name" className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-white text-sm" />
                          <button onClick={submitNewRoastery} className="rounded-xl bg-amber-700 px-4 py-2 text-sm text-white hover:bg-amber-600 transition">Add</button>
                          <button onClick={() => { setShowAddRoastery(false); setNewRoasteryName(""); }} className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition">Cancel</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              <input type="text" value={manualBeanName} onChange={e => setManualBeanName(e.target.value)} placeholder="Bean name (e.g. House Blend)" className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500" disabled={generating || isLoading} />

              {/* Roast level selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Roast Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {ROAST_LEVELS.map(rl => (
                    <button key={rl.value} onClick={() => setRoastLevel(rl.value)} className={`rounded-lg px-3 py-2 text-sm font-medium transition ${roastLevel === rl.value ? "bg-amber-700/20 border border-amber-700/35 text-amber-200" : "border border-zinc-700 text-zinc-400 hover:text-zinc-200"}`}>
                      {rl.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Roast Date section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Roast Date (optional)</label>
              <div className="flex gap-1">
                <button onClick={() => setRoastDateMode("date")} className={`rounded px-2 py-1 text-xs transition ${roastDateMode === "date" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>Date</button>
                <button onClick={() => setRoastDateMode("slider")} className={`rounded px-2 py-1 text-xs transition ${roastDateMode === "slider" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>Slider</button>
              </div>
            </div>

            {roastDateMode === "date" ? (
              <input type="date" value={roastedOn} onChange={e => setRoastedOn(e.target.value)} max={new Date().toISOString().split("T")[0]} className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white disabled:opacity-50" disabled={generating || isLoading} />
            ) : (
              <div className="space-y-1">
                <input type="range" min="0" max="60" value={daysOffRoast ?? 14} onChange={e => { setDaysOffRoast(parseInt(e.target.value)); setRoastedOn(""); }} className="w-full accent-amber-500" disabled={generating || isLoading} />
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Today</span>
                  <span className="text-amber-200">{daysOffRoast ?? 14} days ago</span>
                  <span>60 days</span>
                </div>
              </div>
            )}

            {freshness && (
              <p className={`text-xs ${freshness.color} pl-1`}>{freshness.label}</p>
            )}
          </div>

          {/* Generate button */}
          <div className="flex items-center justify-between gap-3">
            <button onClick={handleGenerateRecommendation} disabled={!canGenerate} className="flex-1 rounded-xl bg-amber-700 px-4 py-3 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  Working\u2026
                </>
              ) : "Get Recommended Grind Settings"}
            </button>
            {!userEmail && !isPro && (
              <div className="shrink-0 text-right">
                <p className="text-xs text-zinc-400">Free trials</p>
                <p className="text-xs text-amber-200">{guestUsesLeft}/2 left</p>
              </div>
            )}
            {userEmail && !isPro && (
              <div className="shrink-0 text-right">
                <p className="text-xs text-zinc-400">Free this month</p>
                <p className="text-xs text-amber-200">{remainingFree === null ? "\u2014" : `${remainingFree}/2 left`}</p>
              </div>
            )}
          </div>

          {/* Limit reached */}
          {limitReached && !userEmail && (
            <div className="rounded-xl border border-amber-700/35 bg-zinc-950 p-4">
              <p className="text-sm font-medium text-white">Free trials used</p>
              <p className="mt-1 text-sm text-zinc-400">Upgrade to Pro for unlimited grind recommendations.</p>
              <button onClick={() => setShowSignUpModal(true)} className="mt-3 w-full rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 transition">Go Pro - \u00A33.99/mo</button>
            </div>
          )}
          {limitReached && userEmail && (
            <div className="rounded-xl border border-amber-700/35 bg-zinc-950 p-4">
              <p className="text-sm font-medium text-white">Monthly limit reached</p>
              <p className="mt-1 text-sm text-zinc-400">You have used your 2 free recommendations this month.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-zinc-500">Resets next month</span>
                <button onClick={() => router.push("/pro")} className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 transition">Upgrade to Pro</button>
              </div>
            </div>
          )}
        </div>

        {/* Loading status */}
        {isLoading && (
          <div className="text-center" role="status" aria-live="polite" aria-atomic="true">
            <p className="text-sm text-amber-200/80 animate-pulse">{statusText}</p>
          </div>
        )}

        {/* ═══ STRUCTURED RECOMMENDATION DISPLAY ═══ */}
        {recommendation && (
          <div className="space-y-4">
            <div className="rounded-xl border border-amber-700/35 bg-zinc-950 p-5 space-y-5">
              {/* Grind Setting */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-400">Recommended Grind</p>
                  <p className="text-4xl font-bold text-amber-200 mt-1">{recommendation.grinder.setting_value}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500">Confidence</p>
                  <p className="text-lg font-semibold text-amber-200">{Math.round(recommendation.confidence * 100)}%</p>
                </div>
              </div>

              {/* Target Recipe */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg bg-zinc-900 p-3 text-center">
                  <p className="text-xs text-zinc-500">Dose</p>
                  <p className="text-lg font-semibold text-white">{recommendation.target.dose_g}g</p>
                </div>
                <div className="rounded-lg bg-zinc-900 p-3 text-center">
                  <p className="text-xs text-zinc-500">Yield</p>
                  <p className="text-lg font-semibold text-white">{recommendation.target.yield_g}g</p>
                </div>
                <div className="rounded-lg bg-zinc-900 p-3 text-center">
                  <p className="text-xs text-zinc-500">Time</p>
                  <p className="text-lg font-semibold text-white">{recommendation.target.time_s}s</p>
                </div>
                {recommendation.target.temp_c && (
                  <div className="rounded-lg bg-zinc-900 p-3 text-center">
                    <p className="text-xs text-zinc-500">Temp</p>
                    <p className="text-lg font-semibold text-white">{recommendation.target.temp_c}\u00B0C</p>
                  </div>
                )}
              </div>

              {/* Grinder Notes */}
              {recommendation.grinder.notes.length > 0 && (
                <div className="space-y-1">
                  {recommendation.grinder.notes.map((note, i) => (
                    <p key={i} className="text-sm text-zinc-300">{note}</p>
                  ))}
                </div>
              )}

              {/* Prep Steps */}
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400 mb-2">Preparation</p>
                <ol className="space-y-1.5 pl-1">
                  {recommendation.prep.map((step, i) => (
                    <li key={i} className="flex gap-2 text-sm text-zinc-300">
                      <span className="text-amber-400 shrink-0 font-medium">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Expected Taste */}
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400 mb-2">Expected Flavour</p>
                <div className="flex flex-wrap gap-2">
                  {recommendation.expected_taste.map((taste, i) => (
                    <span key={i} className="rounded-full bg-amber-700/10 border border-amber-700/20 px-3 py-1 text-xs text-amber-200">{taste}</span>
                  ))}
                </div>
              </div>

              {/* Quick Adjustments */}
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400 mb-2">Quick Adjustments</p>
                <div className="grid gap-2 text-sm">
                  <div className="rounded-lg bg-zinc-900 p-3">
                    <p className="text-zinc-400 text-xs mb-1">If too sour / shot too fast:</p>
                    {recommendation.next_adjustments.if_sour.map((adj, i) => (
                      <p key={i} className="text-zinc-300">{adj}</p>
                    ))}
                  </div>
                  <div className="rounded-lg bg-zinc-900 p-3">
                    <p className="text-zinc-400 text-xs mb-1">If too bitter / shot too slow:</p>
                    {recommendation.next_adjustments.if_bitter.map((adj, i) => (
                      <p key={i} className="text-zinc-300">{adj}</p>
                    ))}
                  </div>
                  <div className="rounded-lg bg-zinc-900 p-3">
                    <p className="text-zinc-400 text-xs mb-1">If weak / thin body:</p>
                    {recommendation.next_adjustments.if_weak.map((adj, i) => (
                      <p key={i} className="text-zinc-300">{adj}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rationale */}
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400 mb-2">Why This Setting</p>
                <div className="space-y-2">
                  {recommendation.rationale.map((r, i) => (
                    <p key={i} className="text-sm text-zinc-300 leading-relaxed">{r}</p>
                  ))}
                </div>
              </div>

              {/* Engine version + machine range */}
              <div className="pt-3 border-t border-zinc-800 flex justify-between text-xs text-zinc-500">
                <span>v{recommendation.version}</span>
                <span>Machine range: {machine?.min_grind ?? machine?.espresso_min ?? "?"} - {machine?.max_grind ?? machine?.espresso_max ?? "?"}</span>
              </div>
            </div>

            {/* ═══ PRO FEATURES: Calibration + Save ═══ */}
            {isPro && (
              <div className="space-y-4">
                {/* Save Dial-In */}
                <div className="flex gap-2">
                  {!savedDialIn ? (
                    <>
                      <button onClick={() => saveDialIn(false)} disabled={savingDialIn} className="flex-1 rounded-xl border border-zinc-700 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 transition disabled:opacity-50">
                        {savingDialIn ? "Saving..." : "Save as Baseline"}
                      </button>
                      <button onClick={() => saveDialIn(true)} disabled={savingDialIn} className="flex-1 rounded-xl bg-amber-700/20 border border-amber-700/35 px-4 py-3 text-sm text-amber-200 hover:bg-amber-700/30 transition disabled:opacity-50">
                        {savingDialIn ? "Saving..." : "Mark as Successful"}
                      </button>
                    </>
                  ) : (
                    <div className="flex-1 rounded-xl border border-green-700/35 bg-green-900/10 px-4 py-3 text-sm text-green-300 text-center">
                      Dial-in saved! It will be used as your baseline next time.
                    </div>
                  )}
                </div>

                {/* Calibration Section */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                  <button onClick={() => setShowCalibration(!showCalibration)} className="w-full flex items-center justify-between text-sm font-medium text-white">
                    <span>Shot Calibration {calibrationIteration > 0 ? `(Iteration ${calibrationIteration})` : ""}</span>
                    <svg className={`w-4 h-4 transition-transform ${showCalibration ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>

                  {showCalibration && (
                    <div className="mt-4 space-y-4">
                      <p className="text-xs text-zinc-400">Pull your shot, then enter the results below:</p>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-zinc-500">Shot time (seconds)</label>
                          <input type="number" value={calibrationShotTime} onChange={e => setCalibrationShotTime(e.target.value)} placeholder={String(recommendation.target.time_s)} className="w-full mt-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white text-sm" />
                        </div>
                        <div>
                          <label className="text-xs text-zinc-500">Actual yield (g)</label>
                          <input type="number" value={calibrationYield} onChange={e => setCalibrationYield(e.target.value)} placeholder={String(recommendation.target.yield_g)} className="w-full mt-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white text-sm" />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-zinc-500 mb-2 block">How does it taste?</label>
                        <div className="flex flex-wrap gap-2">
                          {["sour", "bitter", "weak", "astringent", "balanced", "perfect"].map(t => (
                            <button key={t} onClick={() => setCalibrationTaste(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${calibrationTaste.includes(t) ? "bg-amber-700/20 border border-amber-700/35 text-amber-200" : "border border-zinc-700 text-zinc-400 hover:text-zinc-200"}`}>
                              {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-zinc-500 mb-2 block">Visual issues?</label>
                        <div className="flex flex-wrap gap-2">
                          {["channeling", "spritzing", "uneven_extraction", "none"].map(v => (
                            <button key={v} onClick={() => setCalibrationVisual(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${calibrationVisual.includes(v) ? "bg-amber-700/20 border border-amber-700/35 text-amber-200" : "border border-zinc-700 text-zinc-400 hover:text-zinc-200"}`}>
                              {v.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button onClick={submitCalibration} disabled={calibrating || (calibrationTaste.length === 0 && !calibrationShotTime)} className="w-full rounded-xl bg-amber-700 px-4 py-3 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50 transition">
                        {calibrating ? "Analysing..." : "Get Adjustment"}
                      </button>

                      {/* Calibration Result */}
                      {calibrationResult && (
                        <div className="rounded-lg border border-amber-700/20 bg-zinc-900 p-4 space-y-3">
                          {calibrationResult.changes.length === 0 ? (
                            <p className="text-sm text-green-300">Your shot is dialled in! Save this as your baseline.</p>
                          ) : (
                            <>
                              <p className="text-xs uppercase tracking-wide text-zinc-400">Recommended Changes ({calibrationResult.changes.length})</p>
                              {calibrationResult.changes.map((change, i) => (
                                <div key={i} className="rounded-lg bg-zinc-800 p-3">
                                  <p className="text-sm font-medium text-amber-200">{change.amount}</p>
                                  <p className="text-xs text-zinc-400 mt-1">{change.reason}</p>
                                </div>
                              ))}
                            </>
                          )}
                          <p className="text-xs text-zinc-500">{calibrationResult.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ LEGACY RECOMMENDATION DISPLAY (fallback) ═══ */}
        {!recommendation && legacyRecommendation && (
          <div className="space-y-4">
            <div className="rounded-xl border border-amber-700/35 bg-zinc-950 p-5 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400">Recommended Grind</p>
                <p className="text-3xl font-semibold text-amber-200 mt-1">{grindDisplay}</p>
              </div>
              <div className="text-sm text-zinc-300 leading-relaxed space-y-4">
                {legacyRecommendation.reasoning.split(/\n\n+/).map((section, idx) => {
                  if (section.includes("\u2022")) {
                    const [header, ...bullets] = section.split("\u2022").filter((s: string) => s.trim());
                    return (
                      <div key={idx} className="space-y-2">
                        {header && <p className="font-semibold text-white">{header.trim()}</p>}
                        <ul className="space-y-1.5 pl-1">
                          {bullets.map((bullet: string, bidx: number) => (
                            <li key={bidx} className="flex gap-2"><span className="text-amber-400 shrink-0">\u2022</span><span>{bullet.trim()}</span></li>
                          ))}
                        </ul>
                      </div>
                    );
                  }
                  const parts = section.split(/([A-Z][A-Z\s]+:)/);
                  return (
                    <p key={idx}>
                      {parts.map((part: string, pidx: number) => {
                        if (part.match(/^[A-Z][A-Z\s]+:$/)) return <strong key={pidx} className="text-white font-semibold">{part} </strong>;
                        return <span key={pidx}>{part}</span>;
                      })}
                    </p>
                  );
                })}
              </div>
              <div className="pt-3 border-t border-zinc-800 text-xs text-zinc-500">
                Machine range: {machine?.min_grind ?? "?"} - {machine?.max_grind ?? "?"} | Espresso: {machine?.espresso_min ?? "?"} - {machine?.espresso_max ?? "?"}
              </div>
            </div>
          </div>
        )}

        {/* Pro upsell */}
        {(recommendation || legacyRecommendation) && !isPro && (
          <div className="rounded-xl border border-amber-700/35 bg-zinc-950 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white font-medium">Dialmycoffee Pro</p>
                <p className="text-sm text-zinc-400">Unlimited recommendations, calibration loop, and saved dial-ins</p>
              </div>
              <p className="text-sm text-white font-medium">\u00A33.99<span className="text-zinc-400">/mo</span></p>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              <li>- Unlimited grind recommendations</li>
              <li>- Shot calibration with precise adjustments</li>
              <li>- Save and load your dial-ins</li>
              <li>- Roast date intelligence</li>
              <li>- Save your default machine</li>
            </ul>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-zinc-500">Cancel anytime</span>
              <button onClick={() => userEmail ? router.push("/pro") : setShowSignUpModal(true)} className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 transition">Upgrade to Pro</button>
            </div>
          </div>
        )}

        {/* Cannot find section */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <p className="text-sm font-medium text-white">Cannot find your machine or bean?</p>
          <p className="mt-1 text-sm text-zinc-400">Email us and we will add it within 24 hours.</p>
          <div className="mt-3">
            <a href="mailto:bestcoffeeaccessories@outlook.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-lg border border-amber-700/35 px-4 py-2 text-sm text-amber-200 hover:bg-amber-700/10 transition cursor-pointer">
              Email us
            </a>
          </div>
        </div>

        <SignUpModal isOpen={showSignUpModal} onClose={() => setShowSignUpModal(false)} onSuccess={() => { setShowSignUpModal(false); router.push("/pro"); }} />
      </div>

      {/* Loading Modal Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="loading-title">
          <div className="rounded-2xl border border-amber-700/35 bg-zinc-950 p-8 max-w-md mx-4 shadow-2xl">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <svg className="animate-spin h-16 w-16 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M2 21h18v-2H2v2zM20 8h-2V5h2c1.1 0 2 .9 2 2s-.9 2-2 2zm-2 10H4V5h12v13h2zm0-15H4c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-1h2c1.66 0 3-1.34 3-3V7c0-1.66-1.34-3-3-3h-2V3z" /></svg>
                </div>
              </div>
              <div className="space-y-2">
                <h3 id="loading-title" className="text-lg font-semibold text-white">Brewing Your Perfect Shot</h3>
                <p className="text-sm text-amber-200/90 min-h-[20px] transition-opacity duration-300" aria-live="polite" aria-atomic="true">{statusText}</p>
                <p className="text-xs text-amber-400/70 font-mono">{elapsedTime.toFixed(1)} seconds elapsed</p>
              </div>
              <div className="flex gap-2">
                {LOADING_STEPS.map((_, idx) => (
                  <div key={idx} className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${idx === loadingStepIndex ? "bg-amber-500 w-6" : idx < loadingStepIndex ? "bg-amber-500/40" : "bg-zinc-700"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
