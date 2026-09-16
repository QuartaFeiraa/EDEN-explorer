-- Cover ENEM foreign keys flagged by Supabase Performance Advisor.
-- These indexes improve joins/deletes without changing application semantics.

create index if not exists essay_drafts_essay_topic_idx
  on public.essay_drafts (essay_topic_id);

create index if not exists essay_topics_track_idx
  on public.essay_topics (track_id);

create index if not exists exam_topics_area_idx
  on public.exam_topics (area_id);

create index if not exists question_attempts_question_idx
  on public.question_attempts (question_id);

create index if not exists question_bank_area_idx
  on public.question_bank (area_id);

create index if not exists question_bank_topic_idx
  on public.question_bank (topic_id);
