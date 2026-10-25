create table if not exists public.newsletter_subscribers (
  email text primary key check (email = lower(btrim(email))),
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

grant usage on schema public to anon, authenticated;
revoke all on table public.newsletter_subscribers from anon, authenticated;
grant insert on table public.newsletter_subscribers to anon, authenticated;

drop policy if exists "Allow public newsletter signups" on public.newsletter_subscribers;
create policy "Allow public newsletter signups"
  on public.newsletter_subscribers
  for insert
  to anon, authenticated
  with check (email = lower(btrim(email)));

notify pgrst, 'reload schema';
