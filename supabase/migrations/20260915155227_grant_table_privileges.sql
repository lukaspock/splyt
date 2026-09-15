-- RLS policies alone aren't sufficient for PostgREST: the `authenticated`
-- role also needs base table privileges, which 0001_init.sql never granted.
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.budget_categories to authenticated;
