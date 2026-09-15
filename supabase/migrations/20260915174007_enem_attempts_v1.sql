create table public.question_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.question_bank(id) on delete cascade,
  selected_answer text not null,
  correct boolean not null,
  elapsed_seconds integer,
  created_at timestamptz not null default now()
);
alter table public.question_attempts enable row level security;
create index question_attempts_user_created_idx on public.question_attempts(user_id, created_at desc);
