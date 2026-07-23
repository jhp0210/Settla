# Settla

AI-powered real estate analysis. Search live property listings, get an AI-generated
neighborhood breakdown (price range, pros/cons, scores, real nearby schools, and safety),
and compare homes side by side to find the best value.

Built with **Next.js 16** (App Router), **React 19**, **Tailwind CSS 4**, **Supabase**
(auth + Postgres), **OpenAI**, and **Stripe**.

## Getting started

```bash
npm install
npm run dev      # start the dev server at http://localhost:3000
```

### Scripts

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint (eslint-config-next)
```

There are no tests.

## Features

- **Property search** — live listings via RapidAPI "Realty in US", filterable by price,
  beds, baths, home type, and for-sale / for-rent status.
- **AI analysis** — an OpenAI `gpt-4o-mini` breakdown of a property's neighborhood,
  price range, pros/cons, scores, schools, and safety (labeled an "AI estimate").
- **Real school data** — nearby public schools with star ratings via the U.S. Census
  geocoder + SchoolDigger (optional; falls back to AI-only school info).
- **Side-by-side comparison** — an auto-playing "How it works" walkthrough on the
  landing page and a comparison view on the dashboard.
- **Floating chat widget** — a streaming assistant available on every page.
- **Auth & plans** — Google OAuth + email/password via Supabase. Free plan = 5 searches
  per day and 2 comparison slots; Pro ($10/mo) via Stripe removes the limits.

## Routes

| Route | Description |
|---|---|
| `/` | Landing page: hero search + animated "How it works" walkthrough |
| `/login` | Google OAuth + email/password sign-in |
| `/dashboard` | Authenticated search, AI analysis, and property comparison |
| `/pricing` | Free vs Pro plan selector |
| `/faq` | FAQ accordion |
| `/auth/callback` | Supabase OAuth code exchange |

## Plan & quota enforcement

Quota and plan state are **server-authoritative**. The `profiles.plan`, `searches_today`,
and `search_date` columns are locked against direct client writes; all mutations go through
`SECURITY DEFINER` RPCs (`consume_search()` enforces the free daily limit, `set_plan()` is
downgrade-only). Pro is granted **exclusively** by the Stripe webhook via the service-role
admin client — the browser can never self-promote.

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
RAPIDAPI_KEY=
SCHOOLDIGGER_APP_ID=        # optional — enables real nearby school names in /api/analyze
SCHOOLDIGGER_API_KEY=       # optional — paired with SCHOOLDIGGER_APP_ID
SUPABASE_SERVICE_ROLE_KEY=  # server-only; used by the Stripe webhook. Never expose to the client
STRIPE_SECRET_KEY=          # Stripe secret key (test key works end to end)
STRIPE_WEBHOOK_SECRET=      # signing secret for /api/stripe/webhook
```

`OPENAI_API_KEY` powers the analysis and chat routes; `RAPIDAPI_KEY` powers property
search. The SchoolDigger keys are optional — without them `/api/analyze` simply omits
real school names.

## Deploy

Deploy on [Vercel](https://vercel.com/new). Set the environment variables above in the
project settings, and point your Stripe webhook at `/api/stripe/webhook`.
