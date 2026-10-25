-- Future Finders private reply storage (Supabase/Postgres)
-- Run this in the Supabase SQL editor with a trusted adult.
-- Public browser access is intentionally disabled; a server-side function
-- must validate a submission reference before reading or writing rows.

create extension if not exists pgcrypto;

create table if not exists public.future_finder_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  idea text not null check (char_length(idea) <= 2000),
  problem_type text not null check (char_length(problem_type) <= 40),
  general_location text check (char_length(general_location) <= 120),
  reference_hash text not null unique,
  reply text check (reply is null or char_length(reply) <= 4000),
  created_at timestamptz not null default now(),
  replied_at timestamptz
);

alter table public.future_finder_submissions enable row level security;

-- No policies are granted to anon/authenticated roles on purpose.
-- Only a trusted server-side function using the service-role key should access
-- this table. Never expose that key in GitHub Pages JavaScript.
revoke all on table public.future_finder_submissions from anon, authenticated;
