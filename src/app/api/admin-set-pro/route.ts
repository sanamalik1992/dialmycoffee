import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      is_pro: true,
      stripe_customer_id: 'cus_Tiau5plHQNG228',
      updated_at: new Date().toISOString(),
    })
    .eq('email', 'ozeco12@gmail.com');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function GET() {
  return POST();
}