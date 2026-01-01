export type RoastLevel = "light" | "medium" | "dark";

export function getStartingGrind(params: {
  espressoMin: number;
  espressoMax: number;
  roast: RoastLevel;
}) {
  const { espressoMin, espressoMax, roast } = params;
  const mid = Math.round((espressoMin + espressoMax) / 2);

  const offset = roast === "light" ? -1 : roast === "dark" ? 1 : 0;

  const start = clamp(mid + offset - 1, espressoMin, espressoMax);
  const end = clamp(mid + offset + 1, espressoMin, espressoMax);

  return { range: `${start}–${end}`, dose: "18 g", time: "25–30 s" };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
