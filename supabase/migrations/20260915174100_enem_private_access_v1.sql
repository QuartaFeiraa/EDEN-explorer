revoke all on public.question_solutions, public.question_attempts, public.essay_drafts from anon, authenticated;
grant select on public.question_attempts to authenticated;
grant select, insert, update, delete on public.essay_drafts to authenticated;
create policy question_attempts_own_read on public.question_attempts for select to authenticated using ((select auth.uid()) = user_id);
