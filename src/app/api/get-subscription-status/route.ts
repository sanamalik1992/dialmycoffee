import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized', isPro: false }, { status: 401 });
    }

    // Decode JWT to get user ID
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub;

    // Use service role to bypass RLS
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_pro, stripe_subscription_id, email, free_uses_limit, free_uses_count')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Profile error:', error);
      return NextResponse.json({ error: error.message, isPro: false }, { status: 500 });
    }

    const result = {
      isPro: profile?.is_pro || false,
      subscriptionId: profile?.stripe_subscription_id || null,
      email: profile?.email,
      freeUsesLimit: profile?.free_uses_limit || 2,
      freeUsesCount: profile?.free_uses_count || 0,
      remaining: Math.max(0, (profile?.free_uses_limit || 2) - (profile?.free_uses_count || 0)),
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message, isPro: false }, { status: 500 });
  }
}