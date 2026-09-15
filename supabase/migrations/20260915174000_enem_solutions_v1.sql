create table public.question_solutions (
  question_id uuid primary key references public.question_bank(id) on delete cascade,
  correct_answer text not null,
  explanation text not null default '',
  created_at timestamptz not null default now()
);
alter table public.question_solutions enable row level security;
