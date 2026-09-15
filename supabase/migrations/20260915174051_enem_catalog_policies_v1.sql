create policy exam_topics_public_read on public.exam_topics for select to anon, authenticated using (active = true);
create policy question_bank_public_read on public.question_bank for select to anon, authenticated using (active = true and verified = true);
create policy essay_topics_public_read on public.essay_topics for select to anon, authenticated using (active = true);
