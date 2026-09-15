-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- for a freshly created project.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  goal text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- RLS policies alone aren't enough for PostgREST: the `authenticated` role
-- also needs base table privileges.
grant select, update on public.profiles to authenticated;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create table public.budget_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  icon text not null default '💰',
  type text not null check (type in ('income', 'expense')),
  amount_cents integer not null default 0,
  is_default boolean not null default false,
  sort_order integer not null default 1000,
  created_at timestamptz not null default now()
);

alter table public.budget_categories enable row level security;

grant select, insert, update, delete on public.budget_categories to authenticated;

create policy "Users can view own budget categories"
  on public.budget_categories for select
  using (auth.uid() = user_id);

create policy "Users can insert own budget categories"
  on public.budget_categories for insert
  with check (auth.uid() = user_id);

create policy "Users can update own budget categories"
  on public.budget_categories for update
  using (auth.uid() = user_id);

create policy "Users can delete own budget categories"
  on public.budget_categories for delete
  using (auth.uid() = user_id);

-- Seed a profile row and the app's suggested default budget categories
-- whenever a new user signs up via Supabase Auth.
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

  -- Personalize based on the onboarding goal: feature the most relevant
  -- category first instead of asking the user to reorder things themselves.
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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
