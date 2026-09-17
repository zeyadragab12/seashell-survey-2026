-- Relational survey schema.
-- Replaces the single survey_responses(answers jsonb) table with:
--   sections   — the 6 survey sections
--   questions  — every answerable field (24 numbered questions, 48 fields once
--                matrix rows are split out), each with its own metadata
--   submissions — one row per completed survey
--   responses  — one row per (submission, question) answer, FK-controlled by
--                question_id so every response is tied to a real question

create extension if not exists pgcrypto;

-- ── sections ────────────────────────────────────────────────────────────
create table if not exists public.sections (
  id integer primary key,
  title text not null,
  sort_order integer not null
);

-- ── questions ───────────────────────────────────────────────────────────
-- One row per answerable field. `number` is the on-screen question number
-- (matrix rows share a number since they render under one question).
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  number integer not null,
  section_id integer not null references public.sections(id) on delete restrict,
  type text not null check (type in ('rating', 'matrix_row', 'checkbox_group', 'textarea')),
  label text not null,
  required boolean not null default false,
  options jsonb,
  sort_order integer not null default 0
);

create index if not exists questions_section_id_idx on public.questions(section_id);

-- ── submissions ─────────────────────────────────────────────────────────
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

-- ── responses ───────────────────────────────────────────────────────────
-- One row per answered field per submission. `response` holds the raw
-- answer: a rating/matrix option string, a textarea string, or a JSON array
-- of selected values for checkbox groups.
create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete restrict,
  response jsonb not null,
  created_at timestamptz not null default now(),
  unique (submission_id, question_id)
);

create index if not exists responses_submission_id_idx on public.responses(submission_id);
create index if not exists responses_question_id_idx on public.responses(question_id);

-- ── row level security ──────────────────────────────────────────────────
alter table public.sections enable row level security;
alter table public.questions enable row level security;
alter table public.submissions enable row level security;
alter table public.responses enable row level security;

-- Sections and questions are public reference data: anyone (including
-- anonymous survey-takers) can read them, nobody can write via the API.
create policy "Anyone can read sections"
  on public.sections for select
  to anon, authenticated
  using (true);

create policy "Anyone can read questions"
  on public.questions for select
  to anon, authenticated
  using (true);

-- Anonymous respondents can create a submission and attach responses to it,
-- but cannot read, update, or delete any submission/response — that keeps
-- the survey a write-only funnel from the client's perspective, matching
-- the previous anon-insert-only policy on survey_responses.
create policy "Anyone can create a submission"
  on public.submissions for insert
  to anon
  with check (true);

create policy "Anyone can insert responses"
  on public.responses for insert
  to anon
  with check (true);

-- ── seed: sections ──────────────────────────────────────────────────────
insert into public.sections (id, title, sort_order) values
  (1, 'OneCommunity App', 1),
  (2, 'Beach & Commercial', 2),
  (3, 'Facilities Management', 3),
  (4, 'Security & Gates', 4),
  (5, 'Pools & Lagoons', 5),
  (6, 'Operation Team', 6)
on conflict (id) do nothing;

-- ── seed: questions ─────────────────────────────────────────────────────
insert into public.questions (name, number, section_id, type, label, required, options, sort_order) values
  ('q1', 1, 1, 'rating', 'How would you rate your overall experience with the OneCommunity App?', true, '["Excellent","Good","Fair","Poor","N/A"]'::jsonb, 1),
  ('q2_ease', 2, 1, 'matrix_row', 'Ease of use', true, null, 2),
  ('q2_guests', 2, 1, 'matrix_row', 'Guest passes & invitations', true, null, 3),
  ('q2_payments', 2, 1, 'matrix_row', 'Payments & service requests', true, null, 4),
  ('q2_notifications', 2, 1, 'matrix_row', 'Notifications & community updates', true, null, 5),
  ('q2_reliability', 2, 1, 'matrix_row', 'Reliability & performance', true, null, 6),
  ('q3_comment', 3, 1, 'textarea', 'What is the thing you would most like us to improve or add to the OneCommunity App for Summer 2027?', false, null, 7),
  ('q4', 4, 2, 'rating', 'How would you rate your overall beach experience this summer?', true, '["Excellent","Good","Fair","Poor","N/A"]'::jsonb, 8),
  ('q5_cleanliness', 5, 2, 'matrix_row', 'Cleanliness & overall condition', true, null, 9),
  ('q5_furniture', 5, 2, 'matrix_row', 'Beach furniture & facilities', true, null, 10),
  ('q5_team', 5, 2, 'matrix_row', 'Beach team & lifeguards', true, null, 11),
  ('q5_guest_mgmt', 5, 2, 'matrix_row', 'Organisation & guest management', true, null, 12),
  ('q5_atmosphere', 5, 2, 'matrix_row', 'Overall beach atmosphere', true, null, 13),
  ('q5_outlets', 5, 2, 'matrix_row', 'Commercial outlets & variety', true, null, 14),
  ('q6_priorities', 6, 2, 'checkbox_group', 'Looking ahead to Summer 2027, which areas should we prioritise most?', false, '["Beach furniture & facilities","Cleanliness & maintenance","Beach team & lifeguards","Beach organisation","Guest management","Commercial outlets & variety","Other"]'::jsonb, 15),
  ('q7_comment', 7, 2, 'textarea', 'What else would you like us to know about your beach and commercial experience?', false, null, 16),
  ('q8', 8, 3, 'rating', 'How would you rate your overall experience with Facilities Management this season?', true, '["Excellent","Good","Fair","Poor","N/A"]'::jsonb, 17),
  ('q9_engineering', 9, 3, 'matrix_row', 'Engineering & maintenance', true, null, 18),
  ('q9_housekeeping', 9, 3, 'matrix_row', 'Housekeeping & cleanliness', true, null, 19),
  ('q9_landscaping', 9, 3, 'matrix_row', 'Landscaping', true, null, 20),
  ('q9_pest', 9, 3, 'matrix_row', 'Pest control', true, null, 21),
  ('q9_paid_services', 9, 3, 'matrix_row', 'Paid unit services', true, null, 22),
  ('q10', 10, 3, 'rating', 'For services you requested this season, how would you rate the response and resolution?', true, '["Excellent","Good","Fair","Poor","N/A"]'::jsonb, 23),
  ('q11_priorities', 11, 3, 'checkbox_group', 'Which FM areas should we prioritise most for Summer 2027?', false, '["Engineering & maintenance","Housekeeping & cleanliness","Landscaping","Pest control","Paid unit services","Other"]'::jsonb, 24),
  ('q12_comment', 12, 3, 'textarea', 'What else would you like us to know about Facilities Management?', false, null, 25),
  ('q13', 13, 4, 'rating', 'How would you rate your overall experience with security and access management this season?', true, '["Excellent","Good","Fair","Poor","N/A"]'::jsonb, 26),
  ('q14_gate', 14, 4, 'matrix_row', 'Main gate experience & access', true, null, 27),
  ('q14_presence', 14, 4, 'matrix_row', 'Security presence within Seashell', true, null, 28),
  ('q14_professionalism', 14, 4, 'matrix_row', 'Security team professionalism & response', true, null, 29),
  ('q14_traffic', 14, 4, 'matrix_row', 'Traffic management', true, null, 30),
  ('q14_parking', 14, 4, 'matrix_row', 'Parking management', true, null, 31),
  ('q15_priorities', 15, 4, 'checkbox_group', 'Which areas should we prioritise most for Summer 2027?', false, '["Gate access & entry experience","Security presence","Security response & enforcement","Traffic management","Parking management","Other"]'::jsonb, 32),
  ('q16_comment', 16, 4, 'textarea', 'What else would you like us to know about security, gates, traffic or parking?', false, null, 33),
  ('q17', 17, 5, 'rating', 'How would you rate your overall experience with the pools and lagoons this summer?', true, '["Excellent","Good","Fair","Poor","N/A"]'::jsonb, 34),
  ('q18_pool_cleanliness', 18, 5, 'matrix_row', 'Pools: Pool cleanliness & water quality', true, null, 35),
  ('q18_pool_maint', 18, 5, 'matrix_row', 'Pools: Pool maintenance & condition', true, null, 36),
  ('q18_lagoon_cleanliness', 18, 5, 'matrix_row', 'Lagoons: Lagoon cleanliness & water quality', true, null, 37),
  ('q18_lagoon_maint', 18, 5, 'matrix_row', 'Lagoons: Lagoon maintenance & condition', true, null, 38),
  ('q19_comment', 19, 5, 'textarea', 'What would you most like us to improve about the pools or lagoons for Summer 2027?', false, null, 39),
  ('q20', 20, 6, 'rating', 'How would you rate your overall experience with the operation team this season?', true, '["Excellent","Good","Fair","Poor","N/A"]'::jsonb, 40),
  ('q21_friendliness', 21, 6, 'matrix_row', 'Friendliness & courtesy', true, null, 41),
  ('q21_helpfulness', 21, 6, 'matrix_row', 'Helpfulness & responsiveness', true, null, 42),
  ('q21_professionalism', 21, 6, 'matrix_row', 'Professionalism', true, null, 43),
  ('q21_visibility', 21, 6, 'matrix_row', 'Visibility & availability', true, null, 44),
  ('q21_commitment', 21, 6, 'matrix_row', 'Overall commitment to Seashell', true, null, 45),
  ('q22_priorities', 22, 6, 'checkbox_group', 'Which areas should we prioritise most for Summer 2027?', false, '["Friendliness & courtesy","Helpfulness & responsiveness","Professionalism","Visibility & availability","Overall commitment to Seashell","Other"]'::jsonb, 46),
  ('q23', 23, 6, 'rating', 'For the service you requested this season, how would you rate the response and resolution?', true, '["Excellent","Good","Fair","Poor","N/A"]'::jsonb, 47),
  ('q24', 24, 6, 'rating', 'Overall, how would you rate your Seashell experience this summer?', true, '["Excellent","Good","Fair","Poor"]'::jsonb, 48)
on conflict (name) do update set
  number = excluded.number,
  section_id = excluded.section_id,
  type = excluded.type,
  label = excluded.label,
  required = excluded.required,
  options = excluded.options,
  sort_order = excluded.sort_order;

-- ── convenience view ────────────────────────────────────────────────────
-- Reconstructs each submission as one wide row, joining every response back
-- to its question name — handy for exporting/reviewing in the table editor.
create or replace view public.submission_answers as
select
  s.id as submission_id,
  s.created_at,
  q.name as question_name,
  q.number as question_number,
  q.label as question_label,
  r.response
from public.submissions s
join public.responses r on r.submission_id = s.id
join public.questions q on q.id = r.question_id
order by s.created_at, q.sort_order;
