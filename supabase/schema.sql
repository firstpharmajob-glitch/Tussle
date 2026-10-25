create table if not exists public.newsletter_subscribers (
  email text primary key check (email = lower(btrim(email))),
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

revoke all on table public.newsletter_subscribers from anon, authenticated;

grant insert on table public.newsletter_subscribers to service_role;
