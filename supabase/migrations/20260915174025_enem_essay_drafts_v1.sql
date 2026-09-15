create table public.essay_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  essay_topic_id uuid not null references public.essay_topics(id) on delete cascade,
  content text not null default '',
  updated_at timestamptz not null default now(),
  unique (user_id, essay_topic_id)
);
alter table public.essay_drafts enable row level security;
