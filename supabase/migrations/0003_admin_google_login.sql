-- Adds Google sign-in support for the admin dashboard, restricted to a
-- fixed allowlist of admin emails. Supabase Auth is shared across providers
-- (email/password and Google both create the same kind of session), so the
-- 0002 "any authenticated user can read" policies are tightened here to
-- "any authenticated user whose email is in admin_emails" instead.

create table if not exists public.admin_emails (
  email text primary key
);

alter table public.admin_emails enable row level security;

-- A signed-in user can only check whether THEIR OWN email is on the list —
-- used by the client right after login to decide whether to keep the
-- session or sign back out. Nobody can list the whole table.
create policy "Users can check their own admin email"
  on public.admin_emails for select
  to authenticated
  using (email = (auth.jwt() ->> 'email'));

-- ── tighten read access granted in 0002 ────────────────────────────────
drop policy if exists "Authenticated users can read submissions" on public.submissions;
drop policy if exists "Authenticated users can read responses" on public.responses;

create policy "Allowlisted admins can read submissions"
  on public.submissions for select
  to authenticated
  using (exists (
    select 1 from public.admin_emails
    where email = (auth.jwt() ->> 'email')
  ));

create policy "Allowlisted admins can read responses"
  on public.responses for select
  to authenticated
  using (exists (
    select 1 from public.admin_emails
    where email = (auth.jwt() ->> 'email')
  ));

-- ── seed: allowed admin emails ──────────────────────────────────────────
insert into public.admin_emails (email) values
  ('amr.fayez@thegdevelopments.com'),
  ('zeyad.ragab@thegdevelopments.com')
on conflict (email) do nothing;
