import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { generateRecommendation, mergeAIWithStructured } from '@/lib/recommendationEngine';
import type { Recommendation } from '@/lib/types';
import { computeDaysOffRoast } from '@/lib/roastDate';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const {
      machineId,
      beanId,
      roastery_id,
      bean_name,
      roast_level,
      roasted_on,
      days_off_roast,
      grinder_id,
    } = body;

    if (!machineId) {
      return NextResponse.json({ error: 'Missing machineId' }, { status: 400 });
    }

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_pro, free_uses_limit, free_uses_count')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check if user is Pro or has free uses remaining
    const isPro = !!profile.is_pro;
    const usesRemaining = (profile.free_uses_limit || 2) - (profile.free_uses_count || 0);

    if (!isPro && usesRemaining <= 0) {
      return NextResponse.json({
        error: 'Monthly limit reached',
        limitReached: true,
        remaining: 0,
        isPro: false,
      }, { status: 403 });
    }

    // Increment usage count if not Pro
    if (!isPro) {
      await supabase
        .from('profiles')
        .update({
          free_uses_count: (profile.free_uses_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
    }

    // Fetch machine data - try espresso_machines first, fall back to machines
    let machine: Record<string, unknown> | null = null;
    const { data: newMachine } = await supabase
      .from('espresso_machines')
      .select('*')
      .eq('id', machineId)
      .single();

    if (newMachine) {
      machine = newMachine;
    } else {
      // Fallback to legacy machines table
      const { data: legacyMachine } = await supabase
        .from('machines')
        .select('*')
        .eq('id', machineId)
        .single();
      if (legacyMachine) {
        machine = legacyMachine;
      }
    }

    if (!machine) {
      return NextResponse.json({ error: 'Machine not found' }, { status: 404 });
    }

    // Fetch bean data if beanId provided
    let bean: Record<string, unknown> | null = null;
    if (beanId) {
      const { data: beanData } = await supabase
        .from('beans')
        .select('*')
        .eq('id', beanId)
        .single();
      bean = beanData;
    }

    // Fetch grinder if provided
    let grinder: Record<string, unknown> | null = null;
    if (grinder_id) {
      const { data: grinderData } = await supabase
        .from('grinders')
        .select('*')
        .eq('id', grinder_id)
        .single();
      grinder = grinderData;
    }

    // Compute days off roast
    let computedDaysOffRoast: number | undefined;
    if (days_off_roast !== undefined && days_off_roast !== null) {
      computedDaysOffRoast = days_off_roast;
    } else if (roasted_on) {
      computedDaysOffRoast = computeDaysOffRoast(roasted_on);
    }

    // Check for saved baseline dial-in
    let baseline: { dose_g: number; yield_g: number; time_s: number; grind_setting: string; temp_c?: number } | null = null;
    if (isPro) {
      const beanNameForSearch = bean_name || (bean ? String(bean.name) : null);
      if (beanNameForSearch) {
        const { data: savedDialIn } = await supabase
          .from('dial_ins')
          .select('dose_g, yield_g, time_s, grind_setting, temp_c')
          .eq('user_id', user.id)
          .eq('machine_id', machineId)
          .eq('is_successful', true)
          .ilike('bean_name', beanNameForSearch)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (savedDialIn) {
          baseline = {
            dose_g: Number(savedDialIn.dose_g),
            yield_g: Number(savedDialIn.yield_g),
            time_s: Number(savedDialIn.time_s),
            grind_setting: String(savedDialIn.grind_setting),
            temp_c: savedDialIn.temp_c ? Number(savedDialIn.temp_c) : undefined,
          };
        }
      }
    }

    // Determine roast level
    const effectiveRoastLevel = roast_level ||
      (bean ? String(bean.roast_level || 'medium') : 'medium');

    // Generate structured recommendation using deterministic engine
    const machineName = String(machine.name || `${machine.brand || ''} ${machine.model || ''}`.trim());
    const beanName = bean_name || (bean ? String(bean.name) : 'Unknown Bean');
    const roasterName = roastery_id ? '' : (bean ? String(bean.roaster) : 'Unknown Roaster');

    const structuredRec = generateRecommendation({
      machine: {
        id: String(machine.id),
        name: machineName,
        brand: machine.brand ? String(machine.brand) : undefined,
        type: machine.type ? String(machine.type) : undefined,
        min_grind: machine.grind_min as number ?? machine.min_grind as number ?? null,
        max_grind: machine.grind_max as number ?? machine.max_grind as number ?? null,
        espresso_min: machine.espresso_min as number ?? null,
        espresso_max: machine.espresso_max as number ?? null,
        has_builtin_grinder: !!machine.has_builtin_grinder,
        supports_temp_control: !!machine.supports_temp_control,
        supports_pressure_control: !!machine.supports_pressure_control,
        supports_preinfusion: !!machine.supports_preinfusion,
        default_dose_min: machine.default_dose_min as number ?? null,
        default_dose_max: machine.default_dose_max as number ?? null,
      },
      bean: {
        name: beanName,
        roaster: roasterName,
        roast_level: effectiveRoastLevel,
      },
      roast_level_override: roast_level as 'light' | 'medium' | 'medium_dark' | 'dark' | undefined,
      roasted_on,
      days_off_roast: computedDaysOffRoast,
      baseline,
      grinder: grinder ? {
        brand: String(grinder.brand || ''),
        model: String(grinder.model || ''),
        adjustment_type: String(grinder.adjustment_type || 'stepped'),
        scale_min: grinder.scale_min as number,
        scale_max: grinder.scale_max as number,
        units: String(grinder.units || 'steps'),
      } : null,
    });

    // Attempt AI enhancement (non-blocking — falls back to structured rec)
    let finalRec: Recommendation = structuredRec;

    try {
      const aiPrompt = `You are a world-class barista. Enhance this structured recommendation with your expertise.

MACHINE: ${machineName}
BEAN: ${beanName} by ${roasterName}
ROAST LEVEL: ${effectiveRoastLevel}
${computedDaysOffRoast !== undefined ? `DAYS OFF ROAST: ${computedDaysOffRoast}` : ''}
${baseline ? `USER BASELINE: grind ${baseline.grind_setting}, ${baseline.dose_g}g dose, ${baseline.yield_g}g yield, ${baseline.time_s}s` : ''}

CURRENT STRUCTURED RECOMMENDATION:
- Grind: ${structuredRec.grinder.setting_value}
- Dose: ${structuredRec.target.dose_g}g
- Yield: ${structuredRec.target.yield_g}g
- Time: ${structuredRec.target.time_s}s
${structuredRec.target.temp_c ? `- Temp: ${structuredRec.target.temp_c}°C` : ''}

Respond ONLY with valid JSON (no markdown, no backticks). Provide:
{
  "rationale": ["string array of 2-3 expert insights about this specific bean/machine combination"],
  "expected_taste": ["string array of 3-4 expected flavour notes"],
  "prep": ["string array of 3-4 preparation tips"],
  "grinder": { "notes": ["string array of 1-2 grinder-specific tips for this machine"] }
}`;

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{ role: 'user', content: aiPrompt }],
      });

      const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

      // Parse AI JSON response
      const aiData = JSON.parse(responseText);
      finalRec = mergeAIWithStructured(aiData, structuredRec);
    } catch (aiError) {
      // AI enhancement failed — use the structured recommendation as-is
      console.error('AI enhancement failed, using structured recommendation:', aiError instanceof Error ? aiError.message : aiError);
    }

    // Save recommendation to database
    const grindValue = typeof finalRec.grinder.setting_value === 'number'
      ? finalRec.grinder.setting_value
      : parseFloat(String(finalRec.grinder.setting_value)) || 0;

    await supabase.from('grind_recommendations').insert({
      user_id: user.id,
      machine_id: machineId,
      bean_id: beanId || null,
      recommended_grind: grindValue,
      ai_reasoning: JSON.stringify(finalRec),
    });

    const newRemaining = isPro ? 999 : usesRemaining - 1;

    return NextResponse.json({
      recommendation: finalRec,
      // Legacy fields for backward compatibility with existing UI
      grind: grindValue,
      reasoning: finalRec.rationale.join('\n\n'),
      remaining: newRemaining,
      isPro,
    });

  } catch (error: unknown) {
    console.error('Generate grind error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
