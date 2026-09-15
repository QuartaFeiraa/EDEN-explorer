create table public.exam_tracks (
  id text primary key,
  title text not null,
  short_title text not null,
  kind text not null,
  description text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.exam_tracks enable row level security;
