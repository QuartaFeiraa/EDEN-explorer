create table public.essay_topics (
  id uuid primary key default gen_random_uuid(),
  track_id text not null references public.exam_tracks(id) on delete cascade,
  title text not null,
  prompt text not null,
  source_type text not null default 'original',
  competencies jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.essay_topics enable row level security;
