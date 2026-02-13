# Dialmycoffee

AI-powered espresso grind recommendation platform. Get precise grind settings for your exact machine and bean combination with roast-date intelligence, calibration loops, and saved dial-ins.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (email/password, magic link, OAuth)
- **Payments:** Stripe (subscriptions, webhooks)
- **AI:** Anthropic Claude (recommendation enhancement)
- **Validation:** Zod (schema validation)
- **Analytics:** Vercel Analytics
- **Deployment:** Vercel

## Architecture

```
src/
  app/                          # Next.js App Router pages
    api/                        # API routes
      generate-grind/           # AI + structured recommendation engine
      calibrate/                # Shot calibration loop
      dial-ins/                 # CRUD for saved dial-ins
      countries/                # Country directory
      roasteries/               # Roastery directory
      espresso-machines/        # Machine catalog API
      grinders/                 # Grinder catalog API
      checkout/                 # Stripe checkout session
      stripe-webhook/           # Stripe webhook handler
      cancel-subscription/      # Subscription cancellation
      get-subscription-status/  # Pro status check
      my-machine/               # Default machine save/load
      enrich-bean/              # Bean enrichment (admin)
    my-dial-ins/                # Saved dial-ins page (Pro)
    pro/                        # Pro subscription page
    manage-subscription/        # Subscription management
    login/                      # Magic link login
    auth/callback/              # Auth callback handler
    [machine]-grind-settings/   # SEO guide pages (4 machines)
  components/
    GrindFinder.tsx             # Main calculator (structured + legacy)
    LoginButton.tsx             # Header auth
    SignUpModal.tsx              # Pro signup modal
    PWAInstallPrompt.tsx        # PWA install prompt
  lib/
    types.ts                    # Zod schemas + TypeScript types
    recommendationEngine.ts     # Deterministic recommendation engine
    calibrationEngine.ts        # Calibration loop processor
    roastDate.ts                # Roast freshness intelligence
    grindLogic.ts               # Helper functions
    supabase.ts                 # Supabase client
supabase/
    schema.sql                  # Database schema (all tables)
    seed-countries.sql          # 249 ISO countries
    seed-roasteries.sql         # 200+ global roasteries
    seed-machines.sql           # 80+ espresso machines
    seed-grinders.sql           # 40+ grinders
```

## Required Environment Variables

Create a `.env.local` file with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://www.dialmycoffee.com

# Anthropic (for AI-enhanced recommendations)
ANTHROPIC_API_KEY=sk-ant-...
```

## Database Setup

### 1. Create tables

Run the schema file in your Supabase SQL editor:

```sql
-- Run in Supabase SQL Editor
-- File: supabase/schema.sql
```

This creates: `countries`, `roasteries`, `espresso_machines`, `grinders`, `dial_ins`, `calibration_history` tables with indexes and RLS policies.

### 2. Seed data

Run seed files in order:

```sql
-- 1. Countries (must be first - other tables reference it)
-- File: supabase/seed-countries.sql

-- 2. Roasteries (references countries)
-- File: supabase/seed-roasteries.sql

-- 3. Espresso machines
-- File: supabase/seed-machines.sql

-- 4. Grinders
-- File: supabase/seed-grinders.sql
```

### 3. Existing tables

The app also uses these pre-existing Supabase tables:
- `profiles` - User profiles with Pro status, Stripe IDs
- `machines` - Legacy machine table (still supported as fallback)
- `beans` - Coffee bean database
- `grind_recommendations` - Recommendation history

## Stripe Setup

### 1. Products

The app creates Stripe products dynamically via `price_data` in checkout sessions:
- **Product:** Dialmycoffee Pro
- **Price:** GBP 3.99/month (recurring)
- **Mode:** Subscription

### 2. Webhook

Configure a webhook endpoint in Stripe Dashboard:

- **URL:** `https://www.dialmycoffee.com/api/stripe-webhook`
- **Events to listen for:**
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`

### 3. Test locally

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe-webhook

# Copy the webhook signing secret to .env.local
```

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Production build
npm run build
```

## Recommendation Engine

The recommendation engine uses a hybrid approach:

1. **Deterministic Engine** (`src/lib/recommendationEngine.ts`):
   - Computes grind settings from machine specs, roast level, and roast date
   - Enforces machine constraints (grind range, dose range)
   - Applies roast-date adjustments (0-4d fresh, 5-21d peak, 21-35d fading, 35+d stale)
   - Uses saved baselines when available
   - Produces Zod-validated structured output

2. **AI Enhancement** (Claude API):
   - Enhances the deterministic recommendation with expert insights
   - Adds machine-specific tips and flavour notes
   - Falls back to deterministic output if AI fails

3. **Calibration Loop** (`src/lib/calibrationEngine.ts`):
   - Processes shot feedback (time, yield, taste, visual issues)
   - Returns max 2 changes per iteration
   - Expresses changes in grinder-native increments

### Recommendation Output Schema

```typescript
{
  target: { dose_g, yield_g, time_s, temp_c?, pressure_bar? },
  grinder: { setting_value, micro_adjustment?, notes[] },
  prep: string[],
  expected_taste: string[],
  next_adjustments: { if_fast, if_slow, if_sour, if_bitter, if_weak },
  confidence: number (0-1),
  rationale: string[],
  version: string
}
```

## Free vs Pro Tiers

| Feature | Free | Pro (GBP 3.99/mo) |
|---------|------|---------|
| Recommendations | 2/month | Unlimited |
| Calibration loop | No | Yes |
| Saved dial-ins | No | Yes |
| Default machine | No | Yes |
| Roast date intelligence | Basic | Full |

## Production Deploy Checklist

- [ ] All environment variables set in Vercel/hosting
- [ ] Supabase schema deployed
- [ ] Seed data loaded (countries, roasteries, machines, grinders)
- [ ] Stripe webhook endpoint configured
- [ ] Stripe webhook secret in env vars
- [ ] DNS configured for dialmycoffee.com
- [ ] SSL certificate active
- [ ] Supabase RLS policies enabled
- [ ] Test: guest recommendation flow
- [ ] Test: sign up flow
- [ ] Test: Pro checkout flow (use Stripe test mode first)
- [ ] Test: webhook receives checkout.session.completed
- [ ] Test: Pro user gets unlimited recommendations
- [ ] Test: calibration loop
- [ ] Test: save dial-in
- [ ] Test: cancel subscription
- [ ] Test: PWA install prompt
- [ ] Monitor: Vercel deployment logs
- [ ] Monitor: Stripe webhook delivery dashboard
