create table public.exam_areas (
  id text primary key,
  track_id text not null references public.exam_tracks(id) on delete cascade,
  slug text not null,
  name text not null,
  short_name text not null,
  order_index integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (track_id, slug)
);
alter table public.exam_areas enable row level security;
