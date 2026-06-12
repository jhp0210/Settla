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

**Settla** (formerly "AI Housing") is a Next.js 16 app (App Router) for AI-powered real estate analysis. The whole app uses one light theme (white/green `#166534`). `PropertyListings` still carries a `theme` prop (`"light"` | `"dark"`); `"light"` is used everywhere now, and the old dark `#0a0a0f` / indigo variants in the shared components are legacy fallbacks.

### Page routes

| Route | Description |
|---|---|
| `/` | Landing page: `HeroSection`, which renders the sticky `Navbar`, a minimal hero (headline + embedded `PropertyListings` search), and the **"How it works" section** (`id="how-it-works"`) — this is `ComparisonDemo`, an auto-playing animated walkthrough (cursor bookmarks 3 homes → table fills → best-value highlights cascade; loops, Replay button, respects `prefers-reduced-motion`). It's fronted by a **clickable 3-step rail** (Browse & bookmark → Compare side by side → See the best value): the rail's `activeStep` advances with the animation, the matching panel takes focus while the other dims, and clicking a step calls `jumpTo` to snap to that chapter's resting state (stops the auto-loop; Replay restarts it). The demo *is* the "How it works" section. |
| `/login` | Google OAuth + email/password sign-in (wrapped in `<Suspense>` to avoid prerender errors from `useSearchParams`) |
| `/dashboard` | Authenticated search + AI analysis + property comparison |
| `/pricing` | Free vs Pro plan selector |
| `/faq` | Static accordion of FAQs (client component, `Navbar` + hardcoded `FAQS` array) |
| `/auth/callback` | Supabase OAuth code exchange → redirects to `/dashboard` |

> Note: `app/components/HeroSearch.tsx` is legacy and no longer imported — the landing page search is now `PropertyListings` (themed `light`).

> Navbar anchor: the "How it works" link is `/#how-it-works`. Because the App Router skips hash scrolling to a target on the current page, `Navbar` intercepts same-page `/#…` links and calls `scrollIntoView` manually; `globals.css` sets `scroll-padding-top` so the sticky navbar doesn't cover the target.

### API routes

- `POST /api/analyze` — calls OpenAI `gpt-4o-mini` with a property address, returns a JSON `AnalysisData` object (neighborhood, priceRange, pros/cons, scores, `schools` `{rating, summary}`, `safety` `{level, summary}`, etc.). Runs the OpenAI call and `fetchNearbySchools` (`lib/schools.ts`) in parallel; when SchoolDigger returns results it merges real nearby school **names + star ratings** into `schools.names`. `lib/schools.ts` geocodes the address with the free U.S. Census geocoder (no key) → calls SchoolDigger `/v2.0/schools` near that lat/lng, then surfaces **rated (public) schools first** (SchoolDigger only rates public schools; private/alternative come back unrated) and **groups the final 5 for display Elementary → Middle → High**. It fails soft: missing `SCHOOLDIGGER_APP_ID`/`SCHOOLDIGGER_API_KEY`, no geocode match, or no results → returns null and the panel falls back to AI-only school info (unrated schools render "Not rated"). The whole analysis panel carries an "AI estimate" label.
- `POST /api/chat` — streams an OpenAI `gpt-4o-mini` response as `text/plain` for the floating `ChatWidget`
- `POST /api/properties` — searches listings via RapidAPI "Realty in US" (`/v3/list`); dedupes results by `property_id` and upgrades photo URLs from small (`s.jpg`) to large (`l.jpg`). Accepts `priceMin`/`priceMax`/`bedsMin`/`bathsMin`, a `homeType` filter (`house`→`single_family`, `apartment`→`apartment`, `condo`→`condos`), and a `status` (`for_sale` default | `for_rent`). For rentals `list_price` is null, so rent is read from `list_price_min`/`list_price_max` and returned as `price` + `price_max` with a `for_rent` flag (cards render `$X/mo` or `$X–$Y/mo`). Note: "apartment" + `for_sale` is genuinely near-empty in the US (apartments are mostly rentals) — that's expected, not a bug.
- `GET /api/property-detail?property_id=X` — fetches `year_built` and `baths_consolidated` from the RapidAPI detail endpoint (`/v3/detail`); used to enrich a property when it's saved

The OpenAI routes require `OPENAI_API_KEY`; the property routes require `RAPIDAPI_KEY`. The SchoolDigger keys (`SCHOOLDIGGER_APP_ID`/`SCHOOLDIGGER_API_KEY`) are optional — without them `/api/analyze` just omits real school names.

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
SCHOOLDIGGER_APP_ID=      # optional — enables real nearby school names in /api/analyze
SCHOOLDIGGER_API_KEY=     # optional — paired with SCHOOLDIGGER_APP_ID
```
