create table public.question_bank (
  id uuid primary key default gen_random_uuid(),
  track_id text not null references public.exam_tracks(id),
  area_id text not null references public.exam_areas(id),
  topic_id text references public.exam_topics(id),
  prompt text not null,
  options jsonb not null default '[]'::jsonb,
  difficulty smallint not null default 2,
  active boolean not null default true,
  verified boolean not null default false
);
alter table public.question_bank enable row level security;
