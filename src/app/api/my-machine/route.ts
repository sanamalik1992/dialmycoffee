import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode JWT to get user ID
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub;

    // Get default machine
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('default_machine_id')
      .eq('id', userId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ machineId: profile?.default_machine_id || null });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode JWT to get user ID
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub;

    const { machineId } = await req.json();

    if (!machineId) {
      return NextResponse.json({ error: 'Machine ID required' }, { status: 400 });
    }

    // Save default machine
    const { error } = await supabase
      .from('profiles')
      .update({ default_machine_id: machineId })
      .eq('id', userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, machineId });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode JWT to get user ID
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub;

    // Clear default machine
    const { error } = await supabase
      .from('profiles')
      .update({ default_machine_id: null })
      .eq('id', userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal error' }, { status: 500 });
  }
}
