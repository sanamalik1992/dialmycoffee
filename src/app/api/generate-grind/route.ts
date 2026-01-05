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

    // Generate AI recommendation using Claude with professional barista knowledge
    let grind: number;
    let reasoning: string;

    try {
      const prompt = `You are a world-class barista and espresso expert. Provide a detailed, professional grind recommendation like a consultant would give.

MACHINE: ${machine.name}
BEAN: ${bean.name} by ${bean.roaster}
ROAST LEVEL: ${bean.roast_level || 'medium'}

YOUR EXPERTISE:
You have deep knowledge of every espresso machine's characteristics:
- Sage/Breville Oracle, Barista Express, Dual Boiler: 1-30 scale, espresso 12-18, precise micro-adjustments
- Delonghi Dedica, La Specialista: Different scales by model, often 1-7 or 1-13
- Gaggia Classic Pro: No numeric grind (external grinder needed)
- Bean-to-cup machines: Built-in grinders, 1-13 typical
- Franke, Jura: Commercial/prosumer bean-to-cup

You know roast profiles:
- Light roasts: Dense, bright, acidic, African origins (Ethiopia, Kenya), need finer grind, higher temps
- Medium roasts: Balanced, South American (Colombia, Brazil), middle grind range
- Medium-dark: Sweeter, chocolatey, fuller body, slightly coarser
- Dark roasts: Oily, bittersweet, Italian style, need coarsest grind to avoid over-extraction

TASK: Provide a comprehensive recommendation in this EXACT format:

GRIND: [whole number - the sweet spot]
RANGE: [lower number]-[higher number] (the range to experiment within)
REASONING: Start at [number]. [Bean name] is a [roast level description] that [extraction characteristic]. The ${machine.name} [machine-specific detail]. This setting will give you [expected flavor profile].

DIAL-IN TARGETS:
• Dose: [X]g
• Yield: [X]g  
• Time: [X]-[X] seconds

QUICK ADJUSTMENTS:
• Too sour/fast: Go finer → [number]-[number]
• Too bitter/slow: Go coarser → [number]-[number]

MACHINE TIP: [One specific tip about this machine's grinder or quirks]

CRITICAL RULES:
1. Give a SPECIFIC whole number as the starting point, not a range
2. Base recommendations on REAL machine knowledge, not database values
3. Be precise about dose and yield for this specific machine's basket size
4. Include actionable troubleshooting steps
5. Mention machine-specific quirks (e.g., "Oracle Jet adjusts in small steps", "Barista Express needs multiple clicks", "Dedica has limited range")

Example excellent response:
GRIND: 16
RANGE: 15-17
REASONING: Start at 16. Origin Resolute is a medium-dark espresso blend with chocolate and caramel notes that needs slightly coarser grind than light roasts. The Sage Oracle Jet has precise micro-adjustments between settings, so small changes make a big difference. This setting will give you balanced extraction with good body and sweetness.

DIAL-IN TARGETS:
• Dose: 18-19g
• Yield: 36-40g
• Time: 25-30 seconds

QUICK ADJUSTMENTS:
• Too sour/fast: Go finer → 14-15
• Too bitter/slow: Go coarser → 17-18

MACHINE TIP: Only change 1 step at a time on the Oracle Jet - its grinder is very sensitive and each click makes a noticeable difference.

Now provide your recommendation:`;

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        messages: [{
          role: 'user',
          content: prompt,
        }],
      });

      const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
      
      // Extract grind number
      const grindMatch = responseText.match(/GRIND:\s*(\d+)/i);
      
      if (!grindMatch) {
        throw new Error('AI did not return a valid grind setting');
      }
      
      grind = parseInt(grindMatch[1], 10);
      
      // Use the full detailed response as reasoning
      const fullResponse = responseText.replace(/GRIND:\s*\d+\s*/i, '').trim();
      reasoning = fullResponse || 'Start here and adjust based on taste.';
      
    } catch (aiError: any) {
      // Smart fallback with detailed info
      console.error('AI generation failed, using fallback:', aiError.message);
      
      const machineName = machine.name.toLowerCase();
      const roastLevel = bean.roast_level?.toLowerCase() || 'medium';
      
      if (machineName.includes('sage') || machineName.includes('breville') || machineName.includes('oracle') || machineName.includes('barista')) {
        if (roastLevel.includes('light')) {
          grind = 14;
          reasoning = `RANGE: 13-15\nREASONING: Start at 14. ${bean.name} is a light roast that needs finer grinding for proper extraction. The ${machine.name} uses a 1-30 scale where 12-18 is espresso range.\n\nDIAL-IN TARGETS:\n• Dose: 18-19g\n• Yield: 36-38g\n• Time: 25-30 seconds\n\nQUICK ADJUSTMENTS:\n• Too sour/fast: Go finer → 12-13\n• Too bitter/slow: Go coarser → 15-16\n\nMACHINE TIP: Sage machines have precise grind control - adjust one number at a time.`;
        } else if (roastLevel.includes('dark')) {
          grind = 17;
          reasoning = `RANGE: 16-18\nREASONING: Start at 17. ${bean.name} is a dark roast that extracts easily and needs coarser grinding. The ${machine.name} uses a 1-30 scale where 12-18 is espresso range.\n\nDIAL-IN TARGETS:\n• Dose: 18-19g\n• Yield: 36-40g\n• Time: 25-30 seconds\n\nQUICK ADJUSTMENTS:\n• Too sour/fast: Go finer → 15-16\n• Too bitter/slow: Go coarser → 18-19\n\nMACHINE TIP: Dark roasts can choke the grinder if too fine - stay in 16-18 range.`;
        } else {
          grind = 16;
          reasoning = `RANGE: 15-17\nREASONING: Start at 16. ${bean.name} is a medium roast that works well in the middle of the espresso range. The ${machine.name} uses a 1-30 scale where 15-16 is the sweet spot.\n\nDIAL-IN TARGETS:\n• Dose: 18-19g\n• Yield: 36-40g\n• Time: 25-30 seconds\n\nQUICK ADJUSTMENTS:\n• Too sour/fast: Go finer → 14-15\n• Too bitter/slow: Go coarser → 17-18\n\nMACHINE TIP: The ${machine.name} has micro-adjustments - each step makes a noticeable difference.`;
        }
      } else if (machineName.includes('delonghi')) {
        if (roastLevel.includes('light')) {
          grind = 2;
          reasoning = `RANGE: 1-3\nREASONING: Start at 2. ${bean.name} needs fine grinding for light roasts. Delonghi machines typically use 1-7 scale.\n\nDIAL-IN TARGETS:\n• Dose: 14-16g\n• Yield: 28-32g\n• Time: 25-30 seconds\n\nQUICK ADJUSTMENTS:\n• Too sour/fast: Go finer → 1\n• Too bitter/slow: Go coarser → 3-4`;
        } else if (roastLevel.includes('dark')) {
          grind = 4;
          reasoning = `RANGE: 3-5\nREASONING: Start at 4. ${bean.name} is darker and extracts easily. Delonghi machines typically use 1-7 scale.\n\nDIAL-IN TARGETS:\n• Dose: 14-16g\n• Yield: 28-32g\n• Time: 25-30 seconds\n\nQUICK ADJUSTMENTS:\n• Too sour/fast: Go finer → 2-3\n• Too bitter/slow: Go coarser → 5-6`;
        } else {
          grind = 3;
          reasoning = `RANGE: 2-4\nREASONING: Start at 3. ${bean.name} works well in the middle range. Delonghi machines typically use 1-7 scale.\n\nDIAL-IN TARGETS:\n• Dose: 14-16g\n• Yield: 28-32g\n• Time: 25-30 seconds\n\nQUICK ADJUSTMENTS:\n• Too sour/fast: Go finer → 2\n• Too bitter/slow: Go coarser → 4-5`;
        }
      } else {
        // Generic fallback
        const range = (machine.max_grind || 10) - (machine.min_grind || 1);
        
        if (roastLevel.includes('light')) {
          grind = Math.round((machine.min_grind || 1) + (range * 0.4));
        } else if (roastLevel.includes('dark')) {
          grind = Math.round((machine.min_grind || 1) + (range * 0.6));
        } else {
          grind = Math.round((machine.min_grind || 1) + (range * 0.5));
        }
        
        reasoning = `Start at ${grind} for ${bean.name} (${roastLevel} roast) on your ${machine.name}. Adjust finer if too sour or fast, coarser if too bitter or slow. Typical dose: 16-18g, yield: 32-36g, time: 25-30 seconds.`;
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
