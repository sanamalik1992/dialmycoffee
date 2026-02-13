import { z } from 'zod';

// ─── Recommendation Engine Output Schema ───

export const RecommendationTargetSchema = z.object({
  dose_g: z.number().min(5).max(25),
  yield_g: z.number().min(10).max(80),
  time_s: z.number().min(15).max(60),
  temp_c: z.number().min(85).max(100).optional(),
  pressure_bar: z.number().min(1).max(15).optional(),
});

export const GrinderSettingSchema = z.object({
  setting_value: z.union([z.number(), z.string()]),
  micro_adjustment: z.string().optional(),
  notes: z.array(z.string()),
});

export const NextAdjustmentsSchema = z.object({
  if_fast: z.array(z.string()),
  if_slow: z.array(z.string()),
  if_sour: z.array(z.string()),
  if_bitter: z.array(z.string()),
  if_weak: z.array(z.string()),
});

export const RecommendationSchema = z.object({
  target: RecommendationTargetSchema,
  grinder: GrinderSettingSchema,
  prep: z.array(z.string()),
  expected_taste: z.array(z.string()),
  next_adjustments: NextAdjustmentsSchema,
  confidence: z.number().min(0).max(1),
  rationale: z.array(z.string()),
  version: z.string(),
});

export type Recommendation = z.infer<typeof RecommendationSchema>;
export type RecommendationTarget = z.infer<typeof RecommendationTargetSchema>;
export type GrinderSetting = z.infer<typeof GrinderSettingSchema>;
export type NextAdjustments = z.infer<typeof NextAdjustmentsSchema>;

// ─── Calibration Input Schema ───

export const CalibrationInputSchema = z.object({
  shot_time_s: z.number().min(5).max(120).optional(),
  actual_yield_g: z.number().min(5).max(100).optional(),
  taste: z.array(z.enum(['sour', 'bitter', 'weak', 'astringent', 'balanced', 'perfect'])),
  visual_issues: z.array(z.enum(['channeling', 'spritzing', 'uneven_extraction', 'none'])),
  notes: z.string().optional(),
});

export type CalibrationInput = z.infer<typeof CalibrationInputSchema>;

export const CalibrationResponseSchema = z.object({
  changes: z.array(z.object({
    parameter: z.string(),
    direction: z.string(),
    amount: z.string(),
    reason: z.string(),
  })).max(2),
  new_target: RecommendationTargetSchema.partial(),
  new_grind: GrinderSettingSchema.partial().optional(),
  explanation: z.string(),
  iteration: z.number(),
});

export type CalibrationResponse = z.infer<typeof CalibrationResponseSchema>;

// ─── Roast Date Logic ───

export type RoastWindow = 'very_fresh' | 'resting' | 'peak' | 'fading' | 'stale';

export interface RoastDateAdjustment {
  window: RoastWindow;
  days_off_roast: number;
  grind_offset: number; // positive = coarser, negative = finer
  dose_offset_g: number;
  yield_offset_g: number;
  time_offset_s: number;
  temp_offset_c: number;
  preinfusion_recommended: boolean;
  notes: string[];
}

// ─── Machine Types ───

export interface EspressoMachine {
  id: string;
  brand: string;
  model: string;
  type: 'semi_auto' | 'auto' | 'manual_lever' | 'bean_to_cup' | 'super_auto' | 'capsule';
  has_builtin_grinder: boolean;
  supports_temp_control: boolean;
  supports_pressure_control: boolean;
  supports_preinfusion: boolean;
  recommended_basket_sizes: string[];
  default_dose_range_g: [number, number];
  default_ratio_range: [number, number];
  grind_min?: number;
  grind_max?: number;
  espresso_min?: number;
  espresso_max?: number;
  notes?: string;
}

export interface Grinder {
  id: string;
  brand: string;
  model: string;
  adjustment_type: 'stepped' | 'stepless' | 'digital';
  scale_min: number;
  scale_max: number;
  units: string;
  notes?: string;
}

// ─── Dial-In Types ───

export interface DialIn {
  id: string;
  user_id: string;
  machine_id: string;
  grinder_id?: string;
  roastery_id?: string;
  bean_name: string;
  roast_level: 'light' | 'medium' | 'medium_dark' | 'dark';
  roasted_on?: string;
  days_off_roast_at_save?: number;
  basket_type?: string;
  dose_g: number;
  yield_g: number;
  time_s: number;
  grind_setting: string;
  temp_c?: number;
  notes?: string;
  is_successful: boolean;
  created_at: string;
}

// ─── Country / Roastery ───

export interface Country {
  id: string;
  iso2: string;
  iso3: string;
  name: string;
  region?: string;
}

export interface Roastery {
  id: string;
  name: string;
  country_id: string;
  city?: string;
  website?: string;
  instagram?: string;
  is_popular: boolean;
  aliases?: string[];
  created_at: string;
  updated_at: string;
}

// ─── API Request/Response ───

export const GenerateGrindRequestSchema = z.object({
  machineId: z.string().uuid(),
  beanId: z.string().uuid().optional(),
  roastery_id: z.string().uuid().optional(),
  bean_name: z.string().optional(),
  roast_level: z.enum(['light', 'medium', 'medium_dark', 'dark']).optional(),
  roasted_on: z.string().optional(),
  days_off_roast: z.number().min(0).max(365).optional(),
  grinder_id: z.string().uuid().optional(),
  baseline_dial_in_id: z.string().uuid().optional(),
});

export type GenerateGrindRequest = z.infer<typeof GenerateGrindRequestSchema>;
