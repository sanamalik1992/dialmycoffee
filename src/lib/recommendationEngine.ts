import { RecommendationSchema, type Recommendation } from './types';
import {
  computeDaysOffRoast,
  getRoastDateAdjustment,
  getRoastLevelBaseline,
} from './roastDate';

const ENGINE_VERSION = '2.0.0';

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

interface EngineInput {
  machine: {
    id: string;
    name: string;
    brand?: string;
    type?: string;
    min_grind?: number | null;
    max_grind?: number | null;
    espresso_min?: number | null;
    espresso_max?: number | null;
    has_builtin_grinder?: boolean;
    supports_temp_control?: boolean;
    supports_pressure_control?: boolean;
    supports_preinfusion?: boolean;
    default_dose_min?: number | null;
    default_dose_max?: number | null;
  };
  bean: {
    name: string;
    roaster: string;
    roast_level?: string | null;
  };
  roast_level_override?: 'light' | 'medium' | 'medium_dark' | 'dark';
  roasted_on?: string;
  days_off_roast?: number;
  baseline?: {
    dose_g: number;
    yield_g: number;
    time_s: number;
    grind_setting: string;
    temp_c?: number;
  } | null;
  grinder?: {
    brand?: string;
    model?: string;
    adjustment_type?: string;
    scale_min?: number;
    scale_max?: number;
    units?: string;
  } | null;
}

/**
 * Normalise roast level from various string formats.
 */
function normaliseRoastLevel(raw?: string | null): 'light' | 'medium' | 'medium_dark' | 'dark' {
  if (!raw) return 'medium';
  const l = raw.toLowerCase().replace(/[^a-z]/g, '');
  if (l.includes('light')) return 'light';
  if (l.includes('mediumdark') || l.includes('meddark')) return 'medium_dark';
  if (l.includes('dark')) return 'dark';
  if (l.includes('medium') || l.includes('med')) return 'medium';
  return 'medium';
}

/**
 * Compute the base grind setting from machine parameters and roast level.
 */
function computeBaseGrind(
  machine: EngineInput['machine'],
  roastLevel: 'light' | 'medium' | 'medium_dark' | 'dark',
  roastLevelBaseline: ReturnType<typeof getRoastLevelBaseline>
): number {
  const espMin = machine.espresso_min ?? machine.min_grind ?? 1;
  const espMax = machine.espresso_max ?? machine.max_grind ?? 30;
  const range = espMax - espMin;

  // Position within the espresso range based on roast
  const roastPositions: Record<string, number> = {
    light: 0.35,
    medium: 0.5,
    medium_dark: 0.6,
    dark: 0.7,
  };
  const position = roastPositions[roastLevel] ?? 0.5;

  // Apply grind bias from roast level
  const baseGrind = espMin + range * position + roastLevelBaseline.grind_bias;

  return Math.round(clamp(baseGrind, espMin, espMax));
}

/**
 * Generate a deterministic, structured recommendation.
 * This is the local/fallback engine — no AI dependency.
 */
export function generateRecommendation(input: EngineInput): Recommendation {
  const roastLevel = input.roast_level_override ?? normaliseRoastLevel(input.bean.roast_level);
  const roastBaseline = getRoastLevelBaseline(roastLevel);

  // Compute days off roast
  let daysOffRoast: number | undefined;
  if (input.days_off_roast !== undefined) {
    daysOffRoast = input.days_off_roast;
  } else if (input.roasted_on) {
    daysOffRoast = computeDaysOffRoast(input.roasted_on);
  }

  const roastAdj = daysOffRoast !== undefined
    ? getRoastDateAdjustment(daysOffRoast, roastLevel)
    : null;

  // Machine constraints
  const grindMin = input.machine.espresso_min ?? input.machine.min_grind ?? 1;
  const grindMax = input.machine.espresso_max ?? input.machine.max_grind ?? 30;
  const doseMin = input.machine.default_dose_min ?? 14;
  const doseMax = input.machine.default_dose_max ?? 20;

  // Start from baseline or compute fresh
  let dose_g: number;
  let grindSetting: number;
  let time_s: number;
  let temp_c: number;

  if (input.baseline) {
    // User has a saved successful dial-in — use it as starting point
    dose_g = input.baseline.dose_g;
    grindSetting = parseFloat(input.baseline.grind_setting) || computeBaseGrind(input.machine, roastLevel, roastBaseline);
    time_s = input.baseline.time_s;
    temp_c = input.baseline.temp_c ?? roastBaseline.temp_c;
  } else {
    dose_g = clamp(roastBaseline.dose_g, doseMin, doseMax);
    grindSetting = computeBaseGrind(input.machine, roastLevel, roastBaseline);
    time_s = roastBaseline.time_s;
    temp_c = roastBaseline.temp_c;
  }

  // Apply roast date adjustments
  if (roastAdj) {
    grindSetting = clamp(
      Math.round(grindSetting + roastAdj.grind_offset),
      grindMin,
      grindMax
    );
    dose_g = clamp(dose_g + roastAdj.dose_offset_g, doseMin, doseMax);
    time_s = Math.max(15, time_s + roastAdj.time_offset_s);
    if (input.machine.supports_temp_control) {
      temp_c = clamp(temp_c + roastAdj.temp_offset_c, 85, 100);
    }
  }

  const yield_g = Math.round(dose_g * roastBaseline.ratio + (roastAdj?.yield_offset_g ?? 0));

  // Build rationale
  const rationale: string[] = [
    `${input.bean.name} by ${input.bean.roaster} is a ${roastLevel.replace('_', '-')} roast.`,
    ...roastBaseline.notes,
  ];

  if (roastAdj) {
    rationale.push(...roastAdj.notes);
  }

  if (input.baseline) {
    rationale.push(`Starting from your saved baseline (grind ${input.baseline.grind_setting}, ${input.baseline.dose_g}g dose).`);
  }

  // Machine-specific notes
  const machineName = input.machine.name.toLowerCase();
  const machineNotes: string[] = [];
  if (machineName.includes('sage') || machineName.includes('breville')) {
    machineNotes.push(`The ${input.machine.name} has precise grind steps — adjust one click at a time.`);
  }
  if (machineName.includes('gaggia')) {
    machineNotes.push('Gaggia Classic works best with an external grinder for finer control.');
  }
  if (machineName.includes('flair') || machineName.includes('robot') || machineName.includes('pavoni')) {
    machineNotes.push('Manual lever machines give you direct pressure control — use it to manage extraction.');
  }

  rationale.push(...machineNotes);

  // Prep steps
  const prep: string[] = [
    `Dose ${dose_g}g of freshly ground coffee.`,
    'Distribute evenly in the basket using WDT or tapping.',
    'Tamp firmly and level (about 15kg of pressure).',
  ];

  if (roastAdj?.preinfusion_recommended && input.machine.supports_preinfusion) {
    prep.push('Use 5-8 second preinfusion to allow CO2 to escape from fresh beans.');
  }

  // Expected taste
  const expectedTaste: string[] = [];
  switch (roastLevel) {
    case 'light':
      expectedTaste.push('Bright acidity', 'Fruity or floral notes', 'Light body', 'Clean finish');
      break;
    case 'medium':
      expectedTaste.push('Balanced sweetness', 'Chocolate and caramel', 'Medium body', 'Mild acidity');
      break;
    case 'medium_dark':
      expectedTaste.push('Chocolate and toffee', 'Low acidity', 'Full body', 'Smooth finish');
      break;
    case 'dark':
      expectedTaste.push('Smoky and bold', 'Dark chocolate', 'Heavy body', 'Minimal acidity');
      break;
  }

  // Grinder notes
  const grinderNotes: string[] = [];
  if (input.grinder) {
    grinderNotes.push(`Using ${input.grinder.brand} ${input.grinder.model}.`);
    if (input.grinder.adjustment_type === 'stepped') {
      grinderNotes.push('Stepped grinder — adjust in whole clicks.');
    } else if (input.grinder.adjustment_type === 'stepless') {
      grinderNotes.push('Stepless grinder — make small, incremental adjustments.');
    }
  } else if (input.machine.has_builtin_grinder) {
    grinderNotes.push(`Using ${input.machine.name} built-in grinder.`);
  }

  // Confidence score
  let confidence = 0.6; // base confidence
  if (input.baseline) confidence += 0.2;        // saved baseline = more accurate
  if (daysOffRoast !== undefined) confidence += 0.1; // roast date known
  if (input.grinder) confidence += 0.05;
  confidence = Math.min(confidence, 0.95);

  // Next adjustments
  const finerStep = Math.max(1, Math.round((grindMax - grindMin) * 0.03));
  const coarserStep = finerStep;

  const next_adjustments = {
    if_fast: [
      `Grind ${finerStep} ${finerStep === 1 ? 'step' : 'steps'} finer (to ${clamp(grindSetting - finerStep, grindMin, grindMax)}).`,
      'If still fast, increase dose by 0.5g.',
    ],
    if_slow: [
      `Grind ${coarserStep} ${coarserStep === 1 ? 'step' : 'steps'} coarser (to ${clamp(grindSetting + coarserStep, grindMin, grindMax)}).`,
      'If still slow, decrease dose by 0.5g.',
    ],
    if_sour: [
      `Grind ${finerStep} ${finerStep === 1 ? 'step' : 'steps'} finer to increase extraction.`,
      input.machine.supports_temp_control
        ? `Increase temperature by 1°C (to ${temp_c + 1}°C).`
        : 'If possible, increase water temperature.',
    ],
    if_bitter: [
      `Grind ${coarserStep} ${coarserStep === 1 ? 'step' : 'steps'} coarser to reduce extraction.`,
      input.machine.supports_temp_control
        ? `Decrease temperature by 1°C (to ${temp_c - 1}°C).`
        : 'Reduce contact time by pulling a shorter shot.',
    ],
    if_weak: [
      'Increase dose by 1g.',
      `Reduce yield by 2-4g (aim for ${Math.max(yield_g - 4, dose_g)}g).`,
    ],
  };

  const recommendation: Recommendation = {
    target: {
      dose_g: Math.round(dose_g * 10) / 10,
      yield_g,
      time_s,
      ...(input.machine.supports_temp_control ? { temp_c } : {}),
      ...(input.machine.supports_pressure_control ? { pressure_bar: 9 } : {}),
    },
    grinder: {
      setting_value: grindSetting,
      ...(grinderNotes.length > 0 ? {} : {}),
      notes: grinderNotes.length > 0 ? grinderNotes : [`Set grind to ${grindSetting} on your ${input.machine.name}.`],
    },
    prep,
    expected_taste: expectedTaste,
    next_adjustments,
    confidence: Math.round(confidence * 100) / 100,
    rationale,
    version: ENGINE_VERSION,
  };

  // Validate with Zod
  return RecommendationSchema.parse(recommendation);
}

/**
 * Merge AI-generated content with structured recommendation.
 * The AI can override specific fields but the structure is enforced.
 */
export function mergeAIWithStructured(
  aiResponse: Record<string, unknown>,
  base: Recommendation
): Recommendation {
  const merged = { ...base };

  // AI can enhance rationale
  if (Array.isArray(aiResponse.rationale)) {
    merged.rationale = [...(aiResponse.rationale as string[]), ...base.rationale];
  }

  // AI can provide better expected_taste
  if (Array.isArray(aiResponse.expected_taste) && (aiResponse.expected_taste as string[]).length > 0) {
    merged.expected_taste = aiResponse.expected_taste as string[];
  }

  // AI can refine prep steps
  if (Array.isArray(aiResponse.prep) && (aiResponse.prep as string[]).length > 0) {
    merged.prep = aiResponse.prep as string[];
  }

  // AI can adjust grinder notes
  if (aiResponse.grinder && typeof aiResponse.grinder === 'object') {
    const aiGrinder = aiResponse.grinder as Record<string, unknown>;
    if (Array.isArray(aiGrinder.notes)) {
      merged.grinder = { ...merged.grinder, notes: aiGrinder.notes as string[] };
    }
  }

  // Re-validate
  return RecommendationSchema.parse(merged);
}
