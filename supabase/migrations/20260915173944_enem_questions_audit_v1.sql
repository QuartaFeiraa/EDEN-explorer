alter table public.question_bank add column tags text[] not null default '{}'::text[];
alter table public.question_bank add column created_at timestamptz not null default now();
alter table public.question_bank add column updated_at timestamptz not null default now();
