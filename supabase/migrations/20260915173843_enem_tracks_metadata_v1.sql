alter table public.exam_tracks add column official_reference_url text;
alter table public.exam_tracks add column updated_at timestamptz not null default now();
