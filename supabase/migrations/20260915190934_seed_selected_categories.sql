-- Onboarding now lets the user toggle default categories on/off before
-- signup; the choice is passed through raw_user_meta_data.selected_categories
-- (a jsonb array of category names). Rewritten to only seed categories the
-- user kept ON. If the key is absent entirely (e.g. an older client), fall
-- back to seeding everything, preserving the previous behavior.
-- Keep this list in sync with src/constants/defaultCategories.ts.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  has_selection boolean := new.raw_user_meta_data ? 'selected_categories';
  selected jsonb := coalesce(new.raw_user_meta_data -> 'selected_categories', '[]'::jsonb);
begin
  insert into public.profiles (id, name, goal)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'goal'
  );

  insert into public.budget_categories (user_id, name, icon, type, is_default, sort_order)
  select new.id, c.name, c.icon, c.type, true, c.sort_order
  from (values
    ('Gehalt', '💼', 'income', 0),
    ('Miete & Wohnen', '🏠', 'expense', 0),
    ('Lebensmittel', '🛒', 'expense', 1),
    ('Transport', '🚗', 'expense', 2),
    ('Freizeit & Hobbys', '🎉', 'expense', 3),
    ('Abos', '📱', 'expense', 4),
    ('Versicherungen', '🛡️', 'expense', 5),
    ('Sparen', '💰', 'expense', 6),
    ('Sonstiges', '📦', 'expense', 7)
  ) as c(name, icon, type, sort_order)
  where not has_selection or selected ? c.name;

  if new.raw_user_meta_data ->> 'goal' = 'debt' and (not has_selection or selected ? 'Schulden abbauen') then
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
