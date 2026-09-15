create unique index question_bank_source_ref_uidx on public.question_bank(source_ref) where source_ref is not null;
create index question_bank_catalog_idx on public.question_bank(track_id, area_id, topic_id);
