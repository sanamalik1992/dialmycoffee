import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { processCalibration } from '@/lib/calibrationEngine';
import { CalibrationInputSchema, RecommendationSchema, type Recommendation } from '@/lib/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Pro check
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_pro')
      .eq('id', user.id)
      .single();

    if (!profile?.is_pro) {
      return NextResponse.json({ error: 'Pro subscription required' }, { status: 403 });
    }

    const body = await req.json();
    const { machineId, recommendation, calibration, recommendation_id } = body;

    if (!machineId || !recommendation || !calibration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate calibration input
    const parsedCalibration = CalibrationInputSchema.parse(calibration);

    // Parse recommendation
    let currentRec: Recommendation;
    try {
      currentRec = RecommendationSchema.parse(recommendation);
    } catch {
      return NextResponse.json({ error: 'Invalid recommendation format' }, { status: 400 });
    }

    // Get iteration count
    const { count } = await supabase
      .from('calibration_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('machine_id', machineId);

    const iteration = (count ?? 0) + 1;

    // Get machine data
    let machine: Record<string, unknown> | null = null;
    const { data: newMachine } = await supabase
      .from('espresso_machines')
      .select('*')
      .eq('id', machineId)
      .single();

    if (newMachine) {
      machine = newMachine;
    } else {
      const { data: legacyMachine } = await supabase
        .from('machines')
        .select('*')
        .eq('id', machineId)
        .single();
      machine = legacyMachine;
    }

    if (!machine) {
      return NextResponse.json({ error: 'Machine not found' }, { status: 404 });
    }

    // Process calibration
    const result = processCalibration({
      current: currentRec,
      input: parsedCalibration,
      machine: {
        name: String(machine.name || `${machine.brand || ''} ${machine.model || ''}`),
        min_grind: (machine.grind_min ?? machine.min_grind) as number | null,
        max_grind: (machine.grind_max ?? machine.max_grind) as number | null,
        espresso_min: machine.espresso_min as number | null,
        espresso_max: machine.espresso_max as number | null,
        supports_temp_control: !!machine.supports_temp_control,
        supports_pressure_control: !!machine.supports_pressure_control,
      },
      iteration,
    });

    // Save calibration to history
    await supabase.from('calibration_history').insert({
      user_id: user.id,
      recommendation_id: recommendation_id || null,
      machine_id: machineId,
      iteration,
      shot_time_s: parsedCalibration.shot_time_s,
      actual_yield_g: parsedCalibration.actual_yield_g,
      taste: parsedCalibration.taste,
      visual_issues: parsedCalibration.visual_issues,
      changes_made: result.changes,
      notes: parsedCalibration.notes,
    });

    return NextResponse.json({
      calibration: result,
      iteration,
    });

  } catch (error: unknown) {
    console.error('Calibration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
