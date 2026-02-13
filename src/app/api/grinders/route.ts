import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/grinders — list all grinders
export async function GET(req: NextRequest) {
  try {
    const brand = req.nextUrl.searchParams.get('brand');
    const search = req.nextUrl.searchParams.get('search');

    let query = supabase
      .from('grinders')
      .select('id, brand, model, adjustment_type, scale_min, scale_max, units, notes')
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ grinders: data });

  } catch (error: unknown) {
    console.error('Grinders GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
