alter table public.question_bank add column source_type text not null default 'original';
alter table public.question_bank add column source_year integer;
alter table public.question_bank add column source_ref text;
