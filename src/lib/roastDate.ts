import type { RoastWindow, RoastDateAdjustment } from './types';

/**
 * Determine the roast freshness window based on days off roast.
 */
export function getRoastWindow(daysOffRoast: number): RoastWindow {
  if (daysOffRoast <= 4) return 'very_fresh';
  if (daysOffRoast <= 7) return 'resting';
  if (daysOffRoast <= 21) return 'peak';
  if (daysOffRoast <= 35) return 'fading';
  return 'stale';
}

/**
 * Compute days off roast from a roasted_on date string.
 */
export function computeDaysOffRoast(roastedOn: string): number {
  const roastDate = new Date(roastedOn);
  const now = new Date();
  const diffMs = now.getTime() - roastDate.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * Get grind and recipe adjustments based on roast date.
 * These offsets are applied to the baseline recommendation.
 *
 * Roast level affects the magnitude of adjustments:
 * - Light roasts: more sensitive to freshness (CO2 affects extraction more)
 * - Dark roasts: degas faster, age faster
 */
export function getRoastDateAdjustment(
  daysOffRoast: number,
  roastLevel: 'light' | 'medium' | 'medium_dark' | 'dark' = 'medium'
): RoastDateAdjustment {
  const window = getRoastWindow(daysOffRoast);

  const isLight = roastLevel === 'light';
  const isDark = roastLevel === 'dark' || roastLevel === 'medium_dark';

  switch (window) {
    case 'very_fresh': {
      // 0-4 days: lots of CO2, high channeling risk
      return {
        window,
        days_off_roast: daysOffRoast,
        grind_offset: isLight ? 2 : 1,     // coarser to compensate for CO2
        dose_offset_g: 0,
        yield_offset_g: 0,
        time_offset_s: isLight ? 3 : 2,    // allow slightly longer for gas release
        temp_offset_c: 0,
        preinfusion_recommended: true,
        notes: [
          `Beans are very fresh (${daysOffRoast} days). High CO2 causes channeling.`,
          'Grind slightly coarser than usual to allow gas escape.',
          'Use a longer preinfusion (5-8 seconds) if your machine supports it.',
          isLight
            ? 'Light roasts retain more CO2 — consider waiting 2-3 more days.'
            : 'Consider resting beans for another few days for best results.',
          'Expect crema to be very thick and bubbly.',
        ],
      };
    }

    case 'resting': {
      // 5-7 days: still degassing but improving
      return {
        window,
        days_off_roast: daysOffRoast,
        grind_offset: isLight ? 1 : 0,
        dose_offset_g: 0,
        yield_offset_g: 0,
        time_offset_s: 1,
        temp_offset_c: 0,
        preinfusion_recommended: isLight,
        notes: [
          `Beans are resting (${daysOffRoast} days). Almost at peak freshness.`,
          isLight
            ? 'Light roasts may still have some CO2 — grind slightly coarser.'
            : 'Should be approaching ideal extraction window.',
          'Flavours will continue to develop over the next few days.',
        ],
      };
    }

    case 'peak': {
      // 8-21 days: ideal espresso window
      return {
        window,
        days_off_roast: daysOffRoast,
        grind_offset: 0,
        dose_offset_g: 0,
        yield_offset_g: 0,
        time_offset_s: 0,
        temp_offset_c: 0,
        preinfusion_recommended: false,
        notes: [
          `Beans are at peak freshness (${daysOffRoast} days). Ideal for espresso.`,
          'Standard recipe applies — no freshness adjustments needed.',
          isDark
            ? 'Dark roasts peak earlier; best consumed within 14-18 days.'
            : 'Use your baseline recipe for best results.',
        ],
      };
    }

    case 'fading': {
      // 22-35 days: losing freshness, may need compensation
      return {
        window,
        days_off_roast: daysOffRoast,
        grind_offset: isDark ? -2 : -1,   // finer to maintain extraction
        dose_offset_g: 0.5,               // slightly higher dose
        yield_offset_g: isDark ? -4 : -2, // shorter ratio for clarity
        time_offset_s: -2,
        temp_offset_c: isDark ? 1 : 0,
        preinfusion_recommended: false,
        notes: [
          `Beans are fading (${daysOffRoast} days). Freshness declining.`,
          'Grind finer to compensate for reduced solubility.',
          isDark
            ? 'Dark roasts fade faster — grind noticeably finer.'
            : 'Consider a slightly higher dose to maintain body.',
          'Pull shorter ratios to preserve remaining flavour.',
          'Expect muted acidity and less complex flavour profile.',
        ],
      };
    }

    case 'stale': {
      // 35+ days: significantly degraded
      return {
        window,
        days_off_roast: daysOffRoast,
        grind_offset: -2,
        dose_offset_g: 1,
        yield_offset_g: -4,
        time_offset_s: -3,
        temp_offset_c: 1,
        preinfusion_recommended: false,
        notes: [
          `Beans are stale (${daysOffRoast} days). Flavour significantly degraded.`,
          'Grind much finer and increase dose to extract remaining flavour.',
          'Pull shorter shots (1:1.5 ratio) for best clarity.',
          'Strongly recommend purchasing fresher beans for optimal results.',
          'These beans may taste flat, papery, or woody.',
        ],
      };
    }
  }
}

/**
 * Get roast-level specific baseline parameters.
 * These are the starting points BEFORE roast-date adjustments.
 */
export function getRoastLevelBaseline(roastLevel: 'light' | 'medium' | 'medium_dark' | 'dark') {
  switch (roastLevel) {
    case 'light':
      return {
        dose_g: 18,
        ratio: 2.2,        // longer ratio for brightness
        time_s: 28,
        temp_c: 94,         // higher temp for dense beans
        grind_bias: -1,     // finer grind tendency
        notes: [
          'Light roasts are dense and acidic — need finer grind and higher temp.',
          'Expect bright, fruity, floral notes.',
          'Target a longer ratio (1:2.2) for full flavour development.',
        ],
      };
    case 'medium':
      return {
        dose_g: 18,
        ratio: 2.0,
        time_s: 27,
        temp_c: 93,
        grind_bias: 0,
        notes: [
          'Medium roasts are balanced — standard recipe works well.',
          'Expect chocolate, caramel, nutty notes with mild acidity.',
        ],
      };
    case 'medium_dark':
      return {
        dose_g: 18,
        ratio: 1.9,         // slightly shorter
        time_s: 26,
        temp_c: 92,
        grind_bias: 0.5,    // slightly coarser
        notes: [
          'Medium-dark roasts extract easily — slightly coarser grind needed.',
          'Expect chocolate, caramel, low acidity with fuller body.',
          'Be careful not to over-extract — can turn bitter quickly.',
        ],
      };
    case 'dark':
      return {
        dose_g: 17,
        ratio: 1.8,         // shorter for dark
        time_s: 25,
        temp_c: 90,          // lower temp to reduce bitterness
        grind_bias: 1,       // coarser to prevent over-extraction
        notes: [
          'Dark roasts are porous and extract very easily.',
          'Use coarser grind and lower temperature to avoid bitterness.',
          'Shorter ratio (1:1.8) to maintain sweetness without harshness.',
          'Expect smoky, chocolatey, nutty flavour with minimal acidity.',
        ],
      };
  }
}
