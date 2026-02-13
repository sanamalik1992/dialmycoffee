import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/espresso-machines — list all machines
export async function GET(req: NextRequest) {
  try {
    const brand = req.nextUrl.searchParams.get('brand');
    const search = req.nextUrl.searchParams.get('search');

    let query = supabase
      .from('espresso_machines')
      .select('id, brand, model, type, has_builtin_grinder, supports_temp_control, supports_pressure_control, supports_preinfusion, grind_min, grind_max, espresso_min, espresso_max, default_dose_min, default_dose_max, notes')
      .order('brand')
      .order('model');

    if (brand) {
      query = query.eq('brand', brand);
    }
    if (search) {
      query = query.or(`brand.ilike.%${search}%,model.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      // Fallback to legacy machines table
      const { data: legacyData, error: legacyError } = await supabase
        .from('machines')
        .select('*')
        .order('name');

      if (legacyError) {
        return NextResponse.json({ error: legacyError.message }, { status: 500 });
      }

      // Transform legacy data to match new format
      const transformed = (legacyData || []).map((m: Record<string, unknown>) => ({
        id: m.id,
        brand: String(m.name || '').split(' ')[0],
        model: String(m.name || ''),
        type: 'semi_auto',
        has_builtin_grinder: false,
        supports_temp_control: false,
        supports_pressure_control: false,
        supports_preinfusion: false,
        grind_min: m.min_grind,
        grind_max: m.max_grind,
        espresso_min: m.espresso_min,
        espresso_max: m.espresso_max,
        default_dose_min: 14,
        default_dose_max: 20,
        notes: null,
        // Legacy compat
        name: m.name,
        min_grind: m.min_grind,
        max_grind: m.max_grind,
      }));

      return NextResponse.json({ machines: transformed });
    }

    // Add computed name field for compat
    const withName = (data || []).map((m) => ({
      ...m,
      name: `${m.brand} ${m.model}`,
      min_grind: m.grind_min,
      max_grind: m.grind_max,
    }));

    return NextResponse.json({ machines: withName });

  } catch (error: unknown) {
    console.error('Machines GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
