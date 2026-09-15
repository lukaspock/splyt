# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Architecture

Backend is Supabase (project `guyjmvkfydlmnfjndhlb`), no custom server. There is no `server/`
directory anymore — an earlier Bun/Hono/tRPC/Drizzle/SQLite backend was fully removed in favor
of talking to Supabase directly from the app.

- `supabase/migrations/` — SQL migrations, applied via the Supabase MCP (`apply_migration`).
  Keep this directory in sync with what's actually deployed; when reconciling a manual/ad-hoc
  change, write a migration for it (matching the deployed version/name) rather than editing
  `0001_init.sql` after the fact, unless the fix belongs in the "fresh install" script itself
  (e.g. `0001_init.sql` was missing `GRANT`s for `authenticated` — that's a bug in the base
  script, so it was patched there too).
- `src/lib/supabase.native.ts` / `src/lib/supabase.web.ts` — platform-split Supabase client.
  Native uses `expo-sqlite/localStorage/install` as the auth storage adapter; web relies on the
  browser's own `localStorage` (supabase-js picks it up automatically). They must stay split:
  expo-sqlite's web storage backend runs SQLite in a WASM web worker that Metro's dev server
  cannot chunk-split, so importing it unconditionally breaks `expo start --web`.
  `tsconfig.json` sets `moduleSuffixes: [".native", ""]` (deliberately *not* including `.web`)
  so `tsc` can resolve `@/lib/supabase` — adding `.web` back here causes `tsc` to pick up
  `.web.d.ts` type files from other packages (e.g. `react-native-svg`) that are missing props
  present in their default types, producing false type errors.
- Auth: Supabase Auth (email/password), "Confirm email" is ON — signup does not return a
  session; `SignUpScreen.tsx` shows an inline "check your inbox" screen instead of navigating
  away (a blocking `Alert.alert` there is bad UX, especially on web where it's a browser
  `confirm()` dialog). `LoginScreen.tsx`/`SignUpScreen.tsx` render react-hook-form field errors
  inline and wire `onSubmitEditing`/`submitBehavior="submit"` so email → password → submit all
  work from the keyboard. Auth error messages are passed through `lib/authErrors.ts`
  (`friendlyAuthError`) to turn Supabase's raw error strings into user-facing copy.
- Onboarding: `(login)/onboarding.tsx` collects name + goal *before* signup (stored in the
  `useOnboarding` zustand store), then `(login)/signup.tsx` only asks for email/password.
- Data model: `profiles` (id, name, goal), `budget_categories` (name, icon, type income/expense,
  amount_cents = the recurring monthly allowance, is_default, sort_order), and `expenses`
  (category_id, amount_cents, spent_at) — all RLS-scoped to `auth.uid()`. A `handle_new_user()`
  trigger on `auth.users` seeds a profile and 9 default categories on signup, personalized by
  `goal` (e.g. goal=debt adds a featured "Schulden abbauen" category with a negative
  sort_order). Row-level security policies are not sufficient on their own — PostgREST also
  needs explicit `GRANT`s on the tables for the `authenticated` role (bit us once already; check
  `information_schema.role_table_grants` after adding a table).
- Allowances vs. actuals: `budget_categories.amount_cents` is the recurring plan and is never
  period-scoped — income is assumed to repeat every month, so there's deliberately no "new
  month" step for it. Actual spending is real user-entered `expenses` rows scoped by
  `spent_at` (a plain date), so "expenses reset to zero" each month falls out for free from date
  filtering (`lib/date.ts` `getMonthRange`) — there is no reset job or stored monthly counter.
- Dashboard UI: `DashboardScreen.tsx` (rendered by `(home)/home.tsx`) combines the spending
  donut (`AllowanceDonutChart.tsx`, pure `react-native-svg` — use an explicit
  `transform="rotate(...)"` string on `<G>` to start the first slice at 12 o'clock, *not* the
  `rotation`/`origin` shorthand props, which react-native-web mistranslates into an invalid
  `transform-origin` DOM attribute and throws a dev-overlay error), the hotstreak calendar
  (`HotstreakCalendar.tsx` + `lib/dashboard.ts` `computeHotstreak` — a day counts as a win if
  that day's total spend stays under `totalPlannedExpenses / daysInMonth`; a day with nothing
  logged is a win too), the expense logger (`AddExpenseForm.tsx` + `useExpenses.ts`), and the
  existing allowance planner (`BudgetOverview`/`BudgetSection`). Amount inputs across the app
  commit on `onBlur`, not `onEndEditing` — react-native-web's `TextInput` doesn't implement
  `onEndEditing` at all, so that prop silently never fires on web.
