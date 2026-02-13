import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/roasteries — list roasteries, optionally filtered by country
export async function GET(req: NextRequest) {
  try {
    const countryId = req.nextUrl.searchParams.get('country_id');
    const search = req.nextUrl.searchParams.get('search');
    const popularOnly = req.nextUrl.searchParams.get('popular') === 'true';

    let query = supabase
      .from('roasteries')
      .select('id, name, city, is_popular, country_id')
      .order('is_popular', { ascending: false })
      .order('name');

    if (countryId) {
      query = query.eq('country_id', countryId);
    }
    if (popularOnly) {
      query = query.eq('is_popular', true);
    }
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    query = query.limit(200);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ roasteries: data });

  } catch (error: unknown) {
    console.error('Roasteries GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}

// POST /api/roasteries — submit a new roastery request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, country_id, city } = body;

    if (!name || !country_id) {
      return NextResponse.json({ error: 'Name and country are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('roasteries')
      .insert({
        name,
        country_id,
        city: city || null,
        is_popular: false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ roastery: data });

  } catch (error: unknown) {
    console.error('Roasteries POST error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
