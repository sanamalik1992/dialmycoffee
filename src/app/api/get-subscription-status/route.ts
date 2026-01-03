import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  console.log('[GET SUBSCRIPTION STATUS] Starting...');
  
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    console.log('[GET SUBSCRIPTION STATUS] Token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized', isPro: false }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    console.log('[GET SUBSCRIPTION STATUS] User:', user?.id, 'Error:', authError);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token', isPro: false }, { status: 401 });
    }

    // Use service role to bypass RLS
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_pro, stripe_subscription_id, email')
      .eq('id', user.id)
      .single();

    console.log('[GET SUBSCRIPTION STATUS] Profile:', profile, 'Error:', error);

    if (error) {
      console.error('[GET SUBSCRIPTION STATUS] Profile error:', error);
      return NextResponse.json({ error: error.message, isPro: false }, { status: 500 });
    }

    const result = {
      isPro: profile?.is_pro || false,
      subscriptionId: profile?.stripe_subscription_id || null,
      email: profile?.email || user.email,
    };
    
    console.log('[GET SUBSCRIPTION STATUS] Returning:', result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[GET SUBSCRIPTION STATUS] Catch error:', error);
    return NextResponse.json({ error: error.message, isPro: false }, { status: 500 });
  }
}