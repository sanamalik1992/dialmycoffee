import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/dial-ins — list user's saved dial-ins
export async function GET(req: NextRequest) {
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

    const machineId = req.nextUrl.searchParams.get('machine_id');
    const successfulOnly = req.nextUrl.searchParams.get('successful') === 'true';

    let query = supabase
      .from('dial_ins')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (machineId) {
      query = query.eq('machine_id', machineId);
    }
    if (successfulOnly) {
      query = query.eq('is_successful', true);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ dialIns: data });

  } catch (error: unknown) {
    console.error('Dial-ins GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}

// POST /api/dial-ins — save a new dial-in
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
    const {
      machine_id,
      grinder_id,
      roastery_id,
      bean_name,
      roast_level,
      roasted_on,
      days_off_roast_at_save,
      basket_type,
      dose_g,
      yield_g,
      time_s,
      grind_setting,
      temp_c,
      notes,
      is_successful,
    } = body;

    if (!machine_id || !bean_name || !dose_g || !yield_g || !time_s || !grind_setting) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('dial_ins')
      .insert({
        user_id: user.id,
        machine_id,
        grinder_id: grinder_id || null,
        roastery_id: roastery_id || null,
        bean_name,
        roast_level: roast_level || 'medium',
        roasted_on: roasted_on || null,
        days_off_roast_at_save: days_off_roast_at_save ?? null,
        basket_type: basket_type || null,
        dose_g,
        yield_g,
        time_s,
        grind_setting: String(grind_setting),
        temp_c: temp_c || null,
        notes: notes || null,
        is_successful: is_successful ?? false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ dialIn: data });

  } catch (error: unknown) {
    console.error('Dial-ins POST error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}

// PATCH /api/dial-ins — update a dial-in (mark as successful, etc.)
export async function PATCH(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { id, is_successful, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing dial-in ID' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (is_successful !== undefined) updates.is_successful = is_successful;
    if (notes !== undefined) updates.notes = notes;

    const { data, error } = await supabase
      .from('dial_ins')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ dialIn: data });

  } catch (error: unknown) {
    console.error('Dial-ins PATCH error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}

// DELETE /api/dial-ins — delete a dial-in
export async function DELETE(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing dial-in ID' }, { status: 400 });
    }

    const { error } = await supabase
      .from('dial_ins')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error('Dial-ins DELETE error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
