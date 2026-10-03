# Splyt

A personal budgeting app: plan a monthly allowance per category, log expenses, and keep a daily "hotstreak" going by staying under budget.

> **Note:** This project was implemented with [Claude Code](https://claude.com/claude-code). The architecture and structure were reviewed by me.

## Features

- Email/password auth (Supabase Auth, email confirmation required)
- Onboarding: name, goal and category picker before signup; default categories are seeded per goal
- Budget planner: recurring monthly income and expense allowances per category
- Expense logging with optional notes
- Dashboard with a spending donut chart and a hotstreak calendar (a day is a win if spending stays under `planned expenses / days in month`)
- Runs on iOS, Android and web

## Tech stack

- [Expo](https://docs.expo.dev/versions/v57.0.0/) (SDK 57), React Native, Expo Router (file-based routing)
- Supabase (Postgres, Auth, RLS) accessed directly from the app, no custom server
- TanStack Query, Zustand, react-hook-form
- `react-native-svg` for charts
- Jest + Testing Library

## Getting started

1. Install dependencies

   ```bash
   bun install
   ```

2. Configure environment: copy `.env.example` to `.env` and fill in your Supabase project values

   ```bash
   cp .env.example .env
   ```

   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

3. Apply the database schema from `supabase/migrations/` to your Supabase project (in order, starting with `0001_init.sql`).

4. Start the app

   ```bash
   bun run start     # Expo dev server
   bun run ios       # iOS build
   bun run android   # Android build
   bun run web       # web
   ```

## Scripts

| Script | Description |
| --- | --- |
| `start` | Start the Expo dev server |
| `ios` / `android` / `web` | Run on a platform |
| `lint` | Lint with Expo's ESLint config |
| `test` | Run Jest in watch mode |
| `test:ci` | Run Jest once |

## Project structure

```
src/
  app/          Expo Router routes ((login) and (home) groups)
  components/   Screens and UI components
  hooks/        Data and session hooks (useBudget, useExpenses, ...)
  lib/          Supabase client (platform-split), date/currency/dashboard helpers
  constants/    Styles and default categories
  types/        Database types
supabase/
  migrations/   SQL migrations (schema, RLS, grants, triggers)
```

## Architecture notes

- **Backend:** Supabase only. All tables (`profiles`, `budget_categories`, `expenses`) are protected by row-level security scoped to `auth.uid()`, plus explicit `GRANT`s for the `authenticated` role. A `handle_new_user()` trigger seeds a profile and default categories on signup.
- **Platform-split client:** `lib/supabase.native.ts` uses `expo-sqlite` as auth storage; `lib/supabase.web.ts` uses the browser's `localStorage`. They are split because expo-sqlite's web backend breaks Metro's dev server.
- **Allowances vs. actuals:** category allowances are recurring and never period-scoped. Expenses are dated rows, so monthly "resets" come from date filtering rather than a reset job.

## License

See [LICENSE](LICENSE).
