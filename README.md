# Seashell Survey 2026

The real "Seashell Survey 2026 | G Communities" resident survey, rebuilt as a
React + Tailwind CSS single-page app with responses stored in Supabase. It
replaces the original static `index.html` (Bootstrap + vanilla JS, no backend)
one-for-one: same 6 sections, same 24 questions, same required-field rules —
now with answers that are actually saved.

## Stack

- **Vite + React 19** — `src/App.jsx` renders `SurveyForm`, a multi-step wizard.
- **Tailwind CSS v4** — utility classes replace the old Bootstrap + custom CSS.
- **Supabase** (`@supabase/supabase-js`) — a relational schema (`sections`,
  `questions`, `submissions`, `responses`) instead of a single JSON blob, so
  every answer is tied to a real question row. No login is required to take
  the survey, and there is no admin dashboard in this app — view or export
  responses directly from the Supabase table editor, or query the
  `submission_answers` view for a flattened, human-readable export.

Question copy, field names, and per-section required fields live in
`src/data/surveyConfig.js`, mirrored from the original HTML so nothing was
lost in the rewrite.

## Run locally

Requires Node.js 20+ and npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

## Supabase setup

1. Create a Supabase project (or reuse an existing one).
2. In the SQL editor, run [`supabase/migrations/0001_relational_schema.sql`](supabase/migrations/0001_relational_schema.sql).
   It creates:
   - `sections` — the 6 survey sections
   - `questions` — every answerable field (24 numbered questions, 48 rows
     once matrix rows are split out), each with its type, label, and
     required flag — this is the single source of truth the app reads at
     submit time to validate that a response belongs to a real question
   - `submissions` — one row per completed survey
   - `responses` — one row per `(submission, question)` answer, with a
     foreign key to `questions.id` so every stored response is controlled
     by, and traceable to, its question
   - `submission_answers` — a view that joins the above back into one wide
     row per submission, for easy export/review

   Row level security allows anonymous users to read `sections`/`questions`
   and insert into `submissions`/`responses`, but not read, update, or
   delete anything — the survey stays a write-only funnel from the client.

3. Add your project's values to `.env.local`:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

Until these are set, the app still runs and can be filled out, but submission
shows an inline "storage is not configured" message instead of silently
failing.

## Admin login (email/password + Google)

Admins can sign in with either a Supabase email/password user or Google.
Either way, only emails in the `admin_emails` table can see results — anyone
else's session is immediately rejected by Row Level Security and shown a
"Not authorized" screen.

1. Run [`supabase/migrations/0003_admin_google_login.sql`](supabase/migrations/0003_admin_google_login.sql)
   in the SQL editor. It creates `admin_emails`, tightens the `submissions`/
   `responses` read policies to require allowlist membership, and seeds
   `amr.fayez@thegdevelopments.com` and `zeyad.ragab@thegdevelopments.com`.
   To add or remove an admin later, edit the `admin_emails` table directly.
2. In the Supabase dashboard: **Authentication → Providers → Google**, turn
   it on, and fill in a Google OAuth **Client ID** and **Client secret**.
3. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
   create an OAuth 2.0 Client ID (type: Web application) and add the
   **Authorized redirect URI** shown on the Supabase Google provider page
   (`https://<your-project>.supabase.co/auth/v1/callback`).
4. In Supabase **Authentication → URL Configuration**, add your app's admin
   URL (e.g. `http://localhost:5173/admin` for local dev, plus your
   production URL) to **Redirect URLs**.

To create an email/password admin instead of (or alongside) Google, add the
user under **Authentication → Users** in Supabase and make sure their email
is also in `admin_emails`.

## Project structure

- `src/data/surveyConfig.js` — the 6 sections and 24 questions (ratings,
  rating matrices, multi-select checkboxes, optional comments). Mirrored in
  the database by the `sections`/`questions` tables so the same structure
  exists on both sides.
- `src/components/SurveyForm.jsx` — step state, validation, and submission
  (looks up each answered field's `question_id` and inserts one `submission`
  plus its `responses` rows).
- `src/components/QuestionCard.jsx` — renders one question by type.
- `src/components/ProgressDots.jsx`, `CompleteScreen.jsx` — step indicator and
  the post-submit thank-you screen.
- `src/lib/supabase.js` — Supabase client, `null` when env vars are unset.
- `supabase/migrations/0001_relational_schema.sql` — the relational schema:
  `sections`, `questions`, `submissions`, `responses`, and the
  `submission_answers` export view.
