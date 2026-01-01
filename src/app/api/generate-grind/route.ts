import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

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

    const { machineId, beanId } = await req.json();

    if (!machineId || !beanId) {
      return NextResponse.json({ error: 'Missing machineId or beanId' }, { status: 400 });
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
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          free_uses_count: (profile.free_uses_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating usage count:', updateError);
      }
    }

    // Fetch machine and bean data
    const { data: machine } = await supabase
      .from('machines')
      .select('*')
      .eq('id', machineId)
      .single();

    const { data: bean } = await supabase
      .from('beans')
      .select('*')
      .eq('id', beanId)
      .single();

    if (!machine || !bean) {
      return NextResponse.json({ error: 'Machine or bean not found' }, { status: 404 });
    }

    // Generate AI recommendation using Claude (with fallback)
    let grind: number;
    let reasoning: string;

    try {
      const prompt = `You are an expert barista. Recommend an optimal starting grind setting.

Machine: ${machine.name}
- Grind range: ${machine.min_grind} to ${machine.max_grind}
- Espresso sweet spot: ${machine.espresso_min} to ${machine.espresso_max}

Bean: ${bean.name} by ${bean.roaster}
- Roast level: ${bean.roast_level || 'Unknown'}

Based on the roast level and machine specs, what grind setting would you recommend as a starting point?

Respond in this exact format:
GRIND: [number between ${machine.min_grind} and ${machine.max_grind}]
REASONING: [1-2 sentences explaining why this grind setting is optimal for this combination]`;

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      });

      const text = message.content[0].type === 'text' ? message.content[0].text : '';
      
      // Parse Claude's response
      const grindMatch = text.match(/GRIND:\s*(\d+\.?\d*)/i);
      const reasoningMatch = text.match(/REASONING:\s*([\s\S]+)/i);
      
      if (!grindMatch) {
        throw new Error('AI did not return a valid grind setting');
      }
      
      grind = parseFloat(grindMatch[1]);
      reasoning = reasoningMatch?.[1]?.trim() || 'Start here and adjust based on taste.';
    } catch (aiError: any) {
      // Fallback calculation if AI fails
      console.error('AI generation failed, using fallback:', aiError.message);
      
      const range = (machine.max_grind || 10) - (machine.min_grind || 1);
      const roastLevel = bean.roast_level?.toLowerCase() || '';
      
      if (roastLevel.includes('light')) {
        grind = (machine.min_grind || 1) + (range * 0.4);
        reasoning = `For ${bean.name} (light roast) on your ${machine.name}, start at ${grind.toFixed(1)}. Light roasts extract slower, so we've set this finer to help extraction. Adjust finer if too sour or fast, coarser if too bitter or slow.`;
      } else if (roastLevel.includes('dark')) {
        grind = (machine.min_grind || 1) + (range * 0.6);
        reasoning = `For ${bean.name} (dark roast) on your ${machine.name}, start at ${grind.toFixed(1)}. Dark roasts extract faster, so we've set this slightly coarser. Adjust finer if too sour or fast, coarser if too bitter or slow.`;
      } else {
        grind = (machine.min_grind || 1) + (range * 0.5);
        reasoning = `For ${bean.name} (medium roast) on your ${machine.name}, start at ${grind.toFixed(1)}. This is a good middle ground for medium roasts. Adjust finer if too sour or fast, coarser if too bitter or slow.`;
      }
    }

    // Save recommendation to database
    await supabase.from('grind_recommendations').insert({
      user_id: user.id,
      machine_id: machineId,
      bean_id: beanId,
      recommended_grind: grind,
      ai_reasoning: reasoning,
    });

    const newRemaining = isPro ? 999 : usesRemaining - 1;

    return NextResponse.json({
      grind,
      reasoning,
      remaining: newRemaining,
      isPro,
    });

  } catch (error: any) {
    console.error('Generate grind error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
