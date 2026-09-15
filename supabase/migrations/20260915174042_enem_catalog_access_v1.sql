revoke all on public.exam_tracks, public.exam_areas, public.exam_topics, public.question_bank, public.essay_topics from anon, authenticated;
grant select on public.exam_tracks, public.exam_areas, public.exam_topics, public.question_bank, public.essay_topics to anon, authenticated;
create policy exam_tracks_public_read on public.exam_tracks for select to anon, authenticated using (active = true);
create policy exam_areas_public_read on public.exam_areas for select to anon, authenticated using (active = true);
