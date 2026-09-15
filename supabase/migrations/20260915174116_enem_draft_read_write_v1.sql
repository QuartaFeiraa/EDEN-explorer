create policy essay_drafts_own_read on public.essay_drafts for select to authenticated using ((select auth.uid()) = user_id);
create policy essay_drafts_own_insert on public.essay_drafts for insert to authenticated with check ((select auth.uid()) = user_id);
