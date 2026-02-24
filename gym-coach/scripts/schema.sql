-- Run this once in Supabase Dashboard → SQL Editor

-- Main exercises table
create table if not exists exercises (
  id                text primary key,
  name              text not null,
  force             text,
  level             text,
  mechanic          text,
  equipment         text,
  category          text,
  primary_muscles   text[],
  secondary_muscles text[],
  instructions      text[],
  images            text[]
);

-- Allow public read access (anon key can SELECT)
-- The server already uses the service key, but this is good hygiene
alter table exercises disable row level security;

-- Full-text search index on name
create index if not exists exercises_name_search
  on exercises using gin(to_tsvector('english', name));

-- Index for category filtering
create index if not exists exercises_category_idx
  on exercises (category);

-- Index for level filtering
create index if not exists exercises_level_idx
  on exercises (level);

