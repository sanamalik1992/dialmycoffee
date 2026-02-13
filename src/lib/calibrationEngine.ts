import type { CalibrationInput, CalibrationResponse, Recommendation } from './types';
import { CalibrationResponseSchema } from './types';

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

interface CalibrationContext {
  current: Recommendation;
  input: CalibrationInput;
  machine: {
    name: string;
    min_grind?: number | null;
    max_grind?: number | null;
    espresso_min?: number | null;
    espresso_max?: number | null;
    supports_temp_control?: boolean;
    supports_pressure_control?: boolean;
  };
  iteration: number;
}

/**
 * Process calibration feedback and return max 2 changes.
 * Core principle: never change more than 2 variables at once.
 */
export function processCalibration(ctx: CalibrationContext): CalibrationResponse {
  const { current, input, machine, iteration } = ctx;
  const changes: CalibrationResponse['changes'] = [];
  const newTarget: Partial<Recommendation['target']> = {};
  const grindMin = machine.espresso_min ?? machine.min_grind ?? 1;
  const grindMax = machine.espresso_max ?? machine.max_grind ?? 30;
  const currentGrind = typeof current.grinder.setting_value === 'number'
    ? current.grinder.setting_value
    : parseFloat(String(current.grinder.setting_value)) || 15;

  // Determine the step size (1 for small ranges, up to 2 for large ranges)
  const range = grindMax - grindMin;
  const step = range > 20 ? 2 : 1;

  // Analyse timing first (most impactful)
  const timingIssue = analyseTimingIssue(input, current);
  const tasteIssue = analyseTasteIssue(input);
  const visualIssue = analyseVisualIssue(input);

  // Priority 1: Fix timing issues (if shot was too fast or slow)
  if (timingIssue === 'fast' || input.visual_issues.includes('channeling')) {
    const newGrind = clamp(currentGrind - step, grindMin, grindMax);
    changes.push({
      parameter: 'grind',
      direction: 'finer',
      amount: `${step} ${step === 1 ? 'step' : 'steps'} finer (to ${newGrind})`,
      reason: timingIssue === 'fast'
        ? `Shot ran too fast (${input.shot_time_s}s vs target ${current.target.time_s}s).`
        : 'Channeling detected — finer grind helps create more even resistance.',
    });
  } else if (timingIssue === 'slow') {
    const newGrind = clamp(currentGrind + step, grindMin, grindMax);
    changes.push({
      parameter: 'grind',
      direction: 'coarser',
      amount: `${step} ${step === 1 ? 'step' : 'steps'} coarser (to ${newGrind})`,
      reason: `Shot ran too slow (${input.shot_time_s}s vs target ${current.target.time_s}s).`,
    });
  }

  // Priority 2: Fix taste issues (only if we haven't already made 2 changes)
  if (changes.length < 2) {
    if (tasteIssue === 'sour' && timingIssue !== 'fast') {
      // Sour = under-extracted. If we haven't already gone finer, do it now
      if (!changes.find(c => c.parameter === 'grind')) {
        const newGrind = clamp(currentGrind - step, grindMin, grindMax);
        changes.push({
          parameter: 'grind',
          direction: 'finer',
          amount: `${step} ${step === 1 ? 'step' : 'steps'} finer (to ${newGrind})`,
          reason: 'Sour taste indicates under-extraction. Finer grind increases contact time.',
        });
      } else if (machine.supports_temp_control) {
        newTarget.temp_c = clamp((current.target.temp_c ?? 93) + 1, 85, 100);
        changes.push({
          parameter: 'temperature',
          direction: 'increase',
          amount: `+1°C (to ${newTarget.temp_c}°C)`,
          reason: 'Higher temperature helps extract more from under-extracted coffee.',
        });
      }
    } else if (tasteIssue === 'bitter' && timingIssue !== 'slow') {
      if (!changes.find(c => c.parameter === 'grind')) {
        const newGrind = clamp(currentGrind + step, grindMin, grindMax);
        changes.push({
          parameter: 'grind',
          direction: 'coarser',
          amount: `${step} ${step === 1 ? 'step' : 'steps'} coarser (to ${newGrind})`,
          reason: 'Bitter taste indicates over-extraction. Coarser grind reduces contact time.',
        });
      } else if (machine.supports_temp_control) {
        newTarget.temp_c = clamp((current.target.temp_c ?? 93) - 1, 85, 100);
        changes.push({
          parameter: 'temperature',
          direction: 'decrease',
          amount: `-1°C (to ${newTarget.temp_c}°C)`,
          reason: 'Lower temperature reduces extraction to counter bitterness.',
        });
      }
    } else if (tasteIssue === 'weak') {
      if (!changes.find(c => c.parameter === 'grind')) {
        newTarget.dose_g = clamp(current.target.dose_g + 1, 14, 22);
        changes.push({
          parameter: 'dose',
          direction: 'increase',
          amount: `+1g (to ${newTarget.dose_g}g)`,
          reason: 'Weak body — more coffee grounds will increase strength and body.',
        });
      } else {
        newTarget.yield_g = Math.max(current.target.yield_g - 4, current.target.dose_g);
        changes.push({
          parameter: 'yield',
          direction: 'decrease',
          amount: `-4g (to ${newTarget.yield_g}g)`,
          reason: 'Shorter ratio concentrates flavour for more body.',
        });
      }
    } else if (tasteIssue === 'astringent') {
      if (!changes.find(c => c.parameter === 'grind')) {
        const newGrind = clamp(currentGrind + step, grindMin, grindMax);
        changes.push({
          parameter: 'grind',
          direction: 'coarser',
          amount: `${step} ${step === 1 ? 'step' : 'steps'} coarser (to ${newGrind})`,
          reason: 'Astringency often comes from channeling or over-extraction. Try coarser grind.',
        });
      }
    }
  }

  // If visual issues but we haven't addressed them
  if (changes.length < 2 && visualIssue === 'spritzing') {
    changes.push({
      parameter: 'prep',
      direction: 'improve',
      amount: 'Better distribution + WDT',
      reason: 'Spritzing indicates uneven puck — use WDT tool and ensure even distribution.',
    });
  }

  // If no changes needed (perfect shot)
  if (changes.length === 0) {
    return CalibrationResponseSchema.parse({
      changes: [],
      new_target: {},
      explanation: 'Your shot is dialled in. Save this as your baseline for this bean and machine combination.',
      iteration,
    });
  }

  const explanation = changes.length === 1
    ? `Make one change: ${changes[0].amount}. ${changes[0].reason}`
    : `Make two changes: (1) ${changes[0].amount} — ${changes[0].reason} (2) ${changes[1].amount} — ${changes[1].reason}`;

  return CalibrationResponseSchema.parse({
    changes,
    new_target: newTarget,
    explanation,
    iteration,
  });
}

function analyseTimingIssue(
  input: CalibrationInput,
  current: Recommendation
): 'fast' | 'slow' | 'ok' {
  if (!input.shot_time_s) return 'ok';
  const target = current.target.time_s;
  if (input.shot_time_s < target - 5) return 'fast';
  if (input.shot_time_s > target + 5) return 'slow';
  return 'ok';
}

function analyseTasteIssue(input: CalibrationInput): 'sour' | 'bitter' | 'weak' | 'astringent' | 'ok' {
  if (input.taste.includes('balanced') || input.taste.includes('perfect')) return 'ok';
  if (input.taste.includes('sour')) return 'sour';
  if (input.taste.includes('bitter')) return 'bitter';
  if (input.taste.includes('astringent')) return 'astringent';
  if (input.taste.includes('weak')) return 'weak';
  return 'ok';
}

function analyseVisualIssue(input: CalibrationInput): 'channeling' | 'spritzing' | 'ok' {
  if (input.visual_issues.includes('channeling')) return 'channeling';
  if (input.visual_issues.includes('spritzing')) return 'spritzing';
  return 'ok';
}
