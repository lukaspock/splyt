create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid not null references public.budget_categories (id) on delete cascade,
  amount_cents integer not null check (amount_cents > 0),
  spent_at date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.expenses enable row level security;

grant select, insert, update, delete on public.expenses to authenticated;

create policy "Users can view own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own expenses"
  on public.expenses for update
  using (auth.uid() = user_id);

create policy "Users can delete own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

create index expenses_user_month_idx on public.expenses (user_id, spent_at);
create index expenses_category_idx on public.expenses (category_id);
