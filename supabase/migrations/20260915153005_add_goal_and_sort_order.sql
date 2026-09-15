-- Reconciles an earlier manual schema application with the current
-- supabase/migrations/0001_init.sql: adds the columns introduced since
-- (profiles.goal, budget_categories.sort_order) and refreshes the
-- handle_new_user() seed function to match.

alter table public.profiles
  add column if not exists goal text;

alter table public.budget_categories
  add column if not exists sort_order integer not null default 1000;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, goal)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'goal'
  );

  insert into public.budget_categories (user_id, name, icon, type, is_default, sort_order)
  values
    (new.id, 'Gehalt', '💼', 'income', true, 0),
    (new.id, 'Miete & Wohnen', '🏠', 'expense', true, 0),
    (new.id, 'Lebensmittel', '🛒', 'expense', true, 1),
    (new.id, 'Transport', '🚗', 'expense', true, 2),
    (new.id, 'Freizeit & Hobbys', '🎉', 'expense', true, 3),
    (new.id, 'Abos', '📱', 'expense', true, 4),
    (new.id, 'Versicherungen', '🛡️', 'expense', true, 5),
    (new.id, 'Sparen', '💰', 'expense', true, 6),
    (new.id, 'Sonstiges', '📦', 'expense', true, 7);

  if new.raw_user_meta_data ->> 'goal' = 'debt' then
    insert into public.budget_categories (user_id, name, icon, type, is_default, sort_order)
    values (new.id, 'Schulden abbauen', '💳', 'expense', true, -1);
  elsif new.raw_user_meta_data ->> 'goal' = 'housing' then
    update public.budget_categories set sort_order = -1
      where user_id = new.id and name = 'Miete & Wohnen';
  elsif new.raw_user_meta_data ->> 'goal' = 'saving' then
    update public.budget_categories set sort_order = -1
      where user_id = new.id and name = 'Sparen';
  end if;

  return new;
end;
$$;
