create table public.exam_topics (
  id text primary key,
  area_id text not null references public.exam_areas(id) on delete cascade,
  slug text not null,
  name text not null,
  description text not null default '',
  order_index integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.exam_topics enable row level security;
