-- Grants authenticated (admin) users read access to submissions/responses.
-- The 0001 migration only allowed anon insert (write-only survey funnel),
-- but the admin dashboard signs in via Supabase Auth and needs to read
-- submitted data through the submission_answers view.

create policy "Authenticated users can read submissions"
  on public.submissions for select
  to authenticated
  using (true);

create policy "Authenticated users can read responses"
  on public.responses for select
  to authenticated
  using (true);
