# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # ESLint (eslint-config-next)
```

There are no tests.

## Architecture

**Settla** (formerly "AI Housing") is a Next.js 16 app (App Router) for AI-powered real estate analysis. It has two distinct visual themes: a public landing page (white/green `#166534`) and authenticated pages (dark `#0a0a0f` / indigo).

### Page routes

| Route | Description |
|---|---|
| `/` | Landing page: `HeroSection`, which renders the sticky `Navbar`, a minimal hero (headline + embedded `PropertyListings` search), a "How it works" strip, and a static side-by-side comparison preview |
| `/login` | Google OAuth + email/password sign-in (wrapped in `<Suspense>` to avoid prerender errors from `useSearchParams`) |
| `/dashboard` | Authenticated search + AI analysis + property comparison |
| `/pricing` | Free vs Pro plan selector |
| `/faq` | Static accordion of FAQs (client component, `Navbar` + hardcoded `FAQS` array) |
| `/auth/callback` | Supabase OAuth code exchange → redirects to `/dashboard` |

> Note: `app/components/HeroSearch.tsx` is legacy and no longer imported — the landing page search is now `PropertyListings` (themed `light`).

### API routes

- `POST /api/analyze` — calls OpenAI `gpt-4o-mini` with a property address, returns a JSON `AnalysisData` object (neighborhood, priceRange, pros/cons, scores, etc.)
- `POST /api/chat` — streams an OpenAI `gpt-4o-mini` response as `text/plain` for the floating `ChatWidget`
- `POST /api/properties` — searches listings via RapidAPI "Realty in US" (`/v3/list`); dedupes results by `property_id` and upgrades photo URLs from small (`s.jpg`) to large (`l.jpg`)
- `GET /api/property-detail?property_id=X` — fetches `year_built` and `baths_consolidated` from the RapidAPI detail endpoint (`/v3/detail`); used to enrich a property when it's saved

The OpenAI routes require `OPENAI_API_KEY`; the property routes require `RAPIDAPI_KEY`.

### Auth & plan state

- **`AuthContext`** (`context/AuthContext.tsx`) — wraps the app in `layout.tsx`, exposes `user`, `session`, `signInWithGoogle`, `signOut`. Uses `lib/supabase/client.ts` (browser client via `@supabase/ssr`).
- **`PlanContext`** (`context/PlanContext.tsx`) — reads/writes the Supabase `profiles` table (`plan`, `searches_today`, `search_date`). Free plan = 5 searches/day and 2 comparison slots. Exposes `canSearch`, `incrementSearch`, `upgradeToPro`, `downgradeToFree`.
- `lib/supabase/server.ts` is an async factory (uses `await cookies()`) for use in Route Handlers.

### Search carry-over pattern

On the landing page, when an unauthenticated user tries to save a listing, `PropertyListings` stores that property's address in `sessionStorage` under `"pending_search"` before pushing to `/login`. After login and redirect to `/dashboard`, `DashboardPage` reads and clears this key in a `useEffect`, then sets it as the search query and immediately runs the search.

### Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
RAPIDAPI_KEY=
```
