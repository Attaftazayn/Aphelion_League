-- ============================================================
-- Aphelion League - Phase 3 Complete Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. PLAYERS
create table if not exists public.players (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_players_name on public.players (name);

alter table public.players enable row level security;

create policy "admins can do everything on players"
  on public.players for all to authenticated using (true) with check (true);

create policy "public read players"
  on public.players for select to anon using (true);

-- 2. SESSIONS
create table if not exists public.sessions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  date        date not null,
  start_time  time not null,
  end_time    time not null,
  location    text not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_sessions_date on public.sessions (date desc);

alter table public.sessions enable row level security;

create policy "admins can do everything on sessions"
  on public.sessions for all to authenticated using (true) with check (true);

create policy "public read sessions"
  on public.sessions for select to anon using (true);

-- 3. SESSION_PLAYERS
create table if not exists public.session_players (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.sessions (id) on delete cascade,
  player_id   uuid not null references public.players (id) on delete restrict,
  created_at  timestamptz not null default now(),
  unique (session_id, player_id)
);

create index if not exists idx_session_players_session on public.session_players (session_id);
create index if not exists idx_session_players_player  on public.session_players (player_id);

alter table public.session_players enable row level security;

create policy "admins can do everything on session_players"
  on public.session_players for all to authenticated using (true) with check (true);

create policy "public read session_players"
  on public.session_players for select to anon using (true);

-- 4. MATCHES
create table if not exists public.matches (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null references public.sessions (id) on delete cascade,
  match_number int not null,
  status       text not null default 'upcoming' check (status in ('upcoming', 'completed')),
  score_a      integer check (score_a is null or score_a >= 0),
  score_b      integer check (score_b is null or score_b >= 0),
  created_at   timestamptz not null default now(),
  unique (session_id, match_number)
);

create index if not exists idx_matches_session on public.matches (session_id);

alter table public.matches enable row level security;

create policy "admins can do everything on matches"
  on public.matches for all to authenticated using (true) with check (true);

create policy "public read matches"
  on public.matches for select to anon using (true);

-- 5. MATCH_PLAYERS
create table if not exists public.match_players (
  id         uuid primary key default gen_random_uuid(),
  match_id   uuid not null references public.matches (id) on delete cascade,
  player_id  uuid not null references public.players (id) on delete restrict,
  team       text not null check (team in ('A', 'B')),
  created_at timestamptz not null default now(),
  unique (match_id, player_id)
);

create index if not exists idx_match_players_match  on public.match_players (match_id);
create index if not exists idx_match_players_player on public.match_players (player_id);

alter table public.match_players enable row level security;

create policy "admins can do everything on match_players"
  on public.match_players for all to authenticated using (true) with check (true);

create policy "public read match_players"
  on public.match_players for select to anon using (true);

-- 6. MONTHLY_CHAMPIONS (Historical snapshot confirmation)
create table if not exists public.monthly_champions (
  id           uuid primary key default gen_random_uuid(),
  month_key    text not null unique, -- e.g. '2026-08'
  player_id    uuid not null references public.players (id) on delete restrict,
  total_points int not null,
  wins         int not null,
  win_rate     numeric(5, 2) not null,
  confirmed_at timestamptz not null default now()
);

create index if not exists idx_monthly_champions_month on public.monthly_champions (month_key desc);

alter table public.monthly_champions enable row level security;

create policy "admins can do everything on monthly_champions"
  on public.monthly_champions for all to authenticated using (true) with check (true);

create policy "public read monthly_champions"
  on public.monthly_champions for select to anon using (true);
