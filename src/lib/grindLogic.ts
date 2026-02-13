export type RoastLevel = "light" | "medium" | "medium_dark" | "dark";

export function getStartingGrind(params: {
  espressoMin: number;
  espressoMax: number;
  roast: RoastLevel;
}) {
  const { espressoMin, espressoMax, roast } = params;
  const mid = Math.round((espressoMin + espressoMax) / 2);

  const offsets: Record<RoastLevel, number> = {
    light: -2,
    medium: 0,
    medium_dark: 1,
    dark: 2,
  };
  const offset = offsets[roast] ?? 0;

  const start = clamp(mid + offset - 1, espressoMin, espressoMax);
  const end = clamp(mid + offset + 1, espressoMin, espressoMax);

  const doses: Record<RoastLevel, string> = {
    light: "18 g",
    medium: "18 g",
    medium_dark: "18 g",
    dark: "17 g",
  };

  const times: Record<RoastLevel, string> = {
    light: "28\u201332 s",
    medium: "25\u201330 s",
    medium_dark: "24\u201328 s",
    dark: "22\u201326 s",
  };

  return {
    range: `${start}\u2013${end}`,
    dose: doses[roast] ?? "18 g",
    time: times[roast] ?? "25\u201330 s",
  };
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
